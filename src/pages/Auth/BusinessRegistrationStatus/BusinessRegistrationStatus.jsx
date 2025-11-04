import React, { useEffect, useState } from "react";
import "./BusinessRegistrationStatus.css";
import { 
  Typography, 
  Paper, 
  CircularProgress,
  Chip,
  Button,
  Tabs,
  Tab,
  Box
} from "@mui/material";
import { CiClock2 } from "react-icons/ci";
import { SiTicktick } from "react-icons/si";
import { BiMessageSquareX } from "react-icons/bi";
import { IoLocationOutline } from "react-icons/io5";
import { MdOutlinePhone } from "react-icons/md";
import { CiMail } from "react-icons/ci";
import { TiClipboard } from "react-icons/ti";
import { LuClock, LuCalendar, LuFileText } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { getUserRole } from '../../../utils/authUtils';
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { getHistoryBusinessForm } from "../../../store/slices/bussinessSlice";

function BusinessRegistrationStatus() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { businessFormHistory, isLoading } = useSelector((state) => state.businesses);
  const [activeTab, setActiveTab] = useState('current'); 
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Check role when accessing page
  useEffect(() => {
    const role = getUserRole();
    if (role !== 'customer') {
      toast.error("Only customers can view business registration status");
      navigate('/auth/login');
    }
  }, [navigate]);

  // Fetch history from API
  useEffect(() => {
    dispatch(getHistoryBusinessForm({ limit: 10, page: 1 }));
  }, [dispatch]);

  const hasHistory = Array.isArray(businessFormHistory) && businessFormHistory.length > 0;
  const registrationData = hasHistory ? businessFormHistory[selectedIndex] : null;
  const registrationHistory = hasHistory
    ? businessFormHistory.filter((_, idx) => idx !== selectedIndex)
    : [];

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <CiClock2 className="status-icon pending" />;
      case 'approved':
        return <SiTicktick className="status-icon approved" />;
      case 'rejected':
        return <BiMessageSquareX className="status-icon rejected" />;
      default:
        return <CiClock2 className="status-icon pending" />;
    }
  };

  const getStatusLabel = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'Pending';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Unknown';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="registration-status-container">
        <div className="registration-status-loading">
          <CircularProgress size={50} />
          <Typography variant="h6" style={{ marginTop: 20, color: 'white' }}>
            Loading registration information...
          </Typography>
        </div>
      </div>
    );
  }

  if (!registrationData) {
    return (
      <div className="registration-status-container">
        <div className="registration-status-empty">
          <TiClipboard className="empty-icon" />
          <Typography variant="h4" className="empty-title">
            No Business Registration
          </Typography>
          <Typography variant="body1" className="empty-description">
            You don't have any business registrations yet. Register to become our partner.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/auth/register/bussiness')}
            className="register-button"
          >
            Register Business Now
          </Button>
        </div>
      </div>
    );
  }

  const status = registrationData?.status?.toLowerCase();

  // Component để render chi tiết form
  const renderFormDetails = (data) => {
    const formStatus = data.status?.toLowerCase();
    return (
      <>
        {/* Header Section */}
        <div className="registration-status-header">
          <div className="status-header-main">
            <div className="status-badge-wrapper">
              {getStatusIcon(formStatus)}
              <Chip
                label={getStatusLabel(formStatus)}
                className={`status-chip status-chip-${formStatus}`}
                size="large"
              />
            </div>
            <Typography variant="h4" className="status-title">
              {data.businessName || "Business Registration Status"}
            </Typography>
          </div>
          {formStatus === 'pending' && (
            <Typography variant="body2" className="status-message pending-message">
              <LuClock className="message-icon" />
              Your registration is under review. Please wait for system response.
            </Typography>
          )}
          {formStatus === 'approved' && (
            <Typography variant="body2" className="status-message approved-message">
              <SiTicktick className="message-icon" />
              Congratulations! Your registration has been approved. You can start using our services.
            </Typography>
          )}
          {formStatus === 'rejected' && (
            <Typography variant="body2" className="status-message rejected-message">
              <BiMessageSquareX className="message-icon" />
              Your registration has been rejected. Please check the reason and register again.
            </Typography>
          )}
        </div>

        {/* Business Information Card */}
        <Paper className="info-card">
          <div className="card-header">
            <TiClipboard className="card-icon" />
            <Typography variant="h6" className="card-title">
              Business Information
            </Typography>
          </div>
          <div className="card-content">
            <div className="info-grid">
              <div className="info-item">
                <Typography variant="body2" className="info-label">
                  Business Name
                </Typography>
                <Typography variant="body1" className="info-value">
                  {data.businessName || "N/A"}
                </Typography>
              </div>
              <div className="info-item">
                <Typography variant="body2" className="info-label">
                  Business Type
                </Typography>
                <Typography variant="body1" className="info-value">
                  {data.businessType || "N/A"}
                </Typography>
              </div>
              <div className="info-item">
                <Typography variant="body2" className="info-label">
                  Tax Code
                </Typography>
                <Typography variant="body1" className="info-value">
                  {data.taxCode || "N/A"}
                </Typography>
              </div>
              <div className="info-item">
                <Typography variant="body2" className="info-label">
                  Opening Time
                </Typography>
                <Typography variant="body1" className="info-value">
                  {data.openTime || "N/A"}
                </Typography>
              </div>
              <div className="info-item">
                <Typography variant="body2" className="info-label">
                  Closing Time
                </Typography>
                <Typography variant="body1" className="info-value">
                  {data.closeTime || "N/A"}
                </Typography>
              </div>
              <div className="info-item">
                <Typography variant="body2" className="info-label">
                  Registration Date
                </Typography>
                <Typography variant="body1" className="info-value">
                  <LuCalendar className="inline-icon" />
                  {formatDate(data.createdAt)}
                </Typography>
              </div>
            </div>
          </div>
        </Paper>

        {/* Contact Information Card */}
        <Paper className="info-card">
          <div className="card-header">
            <CiMail className="card-icon" />
            <Typography variant="h6" className="card-title">
              Contact Information
            </Typography>
          </div>
          <div className="card-content">
            <div className="contact-item">
              <CiMail className="contact-icon" />
              <div className="contact-details">
                <Typography variant="body2" className="info-label">
                  Email
                </Typography>
                <Typography variant="body1" className="info-value">
                  {data.businessMail || "N/A"}
                </Typography>
              </div>
            </div>
            <div className="contact-item">
              <MdOutlinePhone className="contact-icon" />
              <div className="contact-details">
                <Typography variant="body2" className="info-label">
                  Phone Number
                </Typography>
                <Typography variant="body1" className="info-value">
                  {data.businessPhone || "N/A"}
                </Typography>
              </div>
            </div>
            <div className="contact-item">
              <IoLocationOutline className="contact-icon" />
              <div className="contact-details">
                <Typography variant="body2" className="info-label">
                  Address
                </Typography>
                <Typography variant="body1" className="info-value">
                  {data.businessAddress || "N/A"}
                </Typography>
              </div>
            </div>
          </div>
        </Paper>

        {/* Documents Card */}
        <Paper className="info-card">
          <div className="card-header">
            <LuFileText className="card-icon" />
            <Typography variant="h6" className="card-title">
              Submitted Documents
            </Typography>
          </div>
          <div className="card-content">
            <div className="documents-grid">
              {data.businessLogoUrl && (
                <div className="document-item">
                  <Typography variant="body2" className="document-label">
                    Business Logo
                  </Typography>
                  <div className="document-preview">
                    <img 
                      src={data.businessLogoUrl} 
                      alt="Business Logo"
                      className="document-image"
                    />
                  </div>
                </div>
              )}
              {data.businessLicenseUrl && (
                <div className="document-item">
                  <Typography variant="body2" className="document-label">
                    Business License
                  </Typography>
                  <div className="document-preview">
                    <img 
                      src={data.businessLicenseUrl} 
                      alt="Business License"
                      className="document-image"
                      onClick={() => window.open(data.businessLicenseUrl, '_blank')}
                    />
                    <Button 
                      size="small" 
                      variant="outlined"
                      onClick={() => window.open(data.businessLicenseUrl, '_blank')}
                      className="view-document-btn"
                    >
                      View Document
                    </Button>
                  </div>
                </div>
              )}
              {data.foodSafetyCertUrl && (
                <div className="document-item">
                  <Typography variant="body2" className="document-label">
                    Food Safety Certificate
                  </Typography>
                  <div className="document-preview">
                    <img 
                      src={data.foodSafetyCertUrl} 
                      alt="Food Safety Certificate"
                      className="document-image"
                      onClick={() => window.open(data.foodSafetyCertUrl, '_blank')}
                    />
                    <Button 
                      size="small" 
                      variant="outlined"
                      onClick={() => window.open(data.foodSafetyCertUrl, '_blank')}
                      className="view-document-btn"
                    >
                      View Document
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Paper>

        {/* Rejection Reason (if rejected) */}
        {formStatus === 'rejected' && data.rejectNote && (
          <Paper className="info-card rejection-card">
            <div className="card-header">
              <BiMessageSquareX className="card-icon rejected-icon" />
              <Typography variant="h6" className="card-title">
                Rejection Reason
              </Typography>
            </div>
            <div className="card-content">
              <Typography variant="body1" className="rejection-note">
                {data.rejectNote}
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => navigate('/auth/register/bussiness')}
                className="register-again-button"
              >
                Register Again
              </Button>
            </div>
          </Paper>
        )}
      </>
    );
  };

  return (
    <div className="registration-status-container">
      <div className="registration-status-content">
        {/* Tabs Section */}
        <Paper className="tabs-paper">
          <Tabs 
            value={activeTab} 
            onChange={(e, newValue) => setActiveTab(newValue)}
            className="status-tabs"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab 
              label={
                <span className="tab-label">
                  <TiClipboard className="tab-icon" />
                  Current Form
                  {registrationData && (
                    <Chip 
                      label={getStatusLabel(registrationData.status)}
                      size="small"
                      className={`tab-chip tab-chip-${registrationData.status?.toLowerCase()}`}
                    />
                  )}
                </span>
              } 
              value="current" 
            />
            <Tab 
              label={
                <span className="tab-label">
                  <LuFileText className="tab-icon" />
                  Registration History ({registrationHistory.length})
                </span>
              } 
              value="history" 
            />
          </Tabs>
        </Paper>

        {activeTab === 'current' ? (
          <>
            {renderFormDetails(registrationData)}
            {/* Action Buttons */}
            <div className="action-buttons">
              <Button 
                variant="outlined" 
                onClick={() => navigate(-1)}
                className="back-button"
              >
                Back
              </Button>
              {status === 'rejected' && (
                <Button 
                  variant="contained" 
                  onClick={() => navigate('/auth/register/bussiness')}
                  className="register-button-primary"
                >
                  Register Again
                </Button>
              )}
            </div>
          </>
        ) : (
          <>
            {/* History Section */}
            <div className="history-header">
              <Typography variant="h5" className="history-title">
                Business Registration History
              </Typography>
              <Typography variant="body2" className="history-subtitle">
                View previously approved or rejected registration applications
              </Typography>
            </div>

            {registrationHistory.length === 0 ? (
              <Paper className="info-card">
                <div className="empty-history">
                  <TiClipboard className="empty-history-icon" />
                  <Typography variant="h6" className="empty-history-title">
                    No Registration History
                  </Typography>
                  <Typography variant="body2" className="empty-history-description">
                    You don't have any registration history yet.
                  </Typography>
                </div>
              </Paper>
            ) : (
              <div className="history-list">
                {registrationHistory.map((item, idx) => (
                  <Paper key={item.id || item._id} className="history-card">
                    <div className="history-card-header">
                      <div className="history-card-title-section">
                        <Typography variant="h6" className="history-card-title">
                          {item.businessName}
                        </Typography>
                        <Chip
                          label={getStatusLabel(item.status)}
                          className={`history-status-chip history-status-chip-${item.status?.toLowerCase()}`}
                          size="small"
                          icon={getStatusIcon(item.status)}
                        />
                      </div>
                      <Typography variant="body2" className="history-date">
                        <LuCalendar className="inline-icon" />
                        {formatDate(item.createdAt)}
                      </Typography>
                    </div>
                    <div className="history-card-content">
                      <div className="history-info-row">
                        <Typography variant="body2" className="history-info-label">
                          Business Type:
                        </Typography>
                        <Typography variant="body2" className="history-info-value">
                          {item.businessType}
                        </Typography>
                      </div>
                      <div className="history-info-row">
                        <Typography variant="body2" className="history-info-label">
                          Email:
                        </Typography>
                        <Typography variant="body2" className="history-info-value">
                          {item.businessMail}
                        </Typography>
                      </div>
                      <div className="history-info-row">
                        <Typography variant="body2" className="history-info-label">
                          Address:
                        </Typography>
                        <Typography variant="body2" className="history-info-value">
                          {item.businessAddress}
                        </Typography>
                      </div>
                      {item.status?.toLowerCase() === 'rejected' && item.rejectNote && (
                        <div className="history-rejection-note">
                          <BiMessageSquareX className="rejection-note-icon" />
                          <Typography variant="body2" className="rejection-note-text">
                            {item.rejectNote}
                          </Typography>
                        </div>
                      )}
                      {/* <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                          setActiveTab('current');
                          const newIndex = businessFormHistory.findIndex(
                            (f) => (f.id || f._id) === (item.id || item._id)
                          );
                          setSelectedIndex(newIndex >= 0 ? newIndex : 0);
                        }}
                        className="view-details-button"
                      >
                        View Details
                      </Button> */}
                    </div>
                  </Paper>
                ))}
              </div>
            )}

            {/* Action Buttons for History */}
            <div className="action-buttons">
              <Button 
                variant="outlined" 
                onClick={() => navigate(-1)}
                className="back-button"
              >
                Back
              </Button>
              <Button 
                variant="contained" 
                onClick={() => navigate('/auth/register/bussiness')}
                className="register-button-primary"
              >
                New Registration
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default BusinessRegistrationStatus;


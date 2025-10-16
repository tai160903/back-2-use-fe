import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { TiClipboard } from "react-icons/ti";
import { IoMdPerson } from "react-icons/io";
import { LuClipboardList } from "react-icons/lu";
import { BiMessageSquareX } from "react-icons/bi";
import { SiTicktick } from "react-icons/si";
import toast from "react-hot-toast";
import CircularProgress from "@mui/material/CircularProgress"; // Import CircularProgress for loading

import "./ModalRegistration.css";
import RejectPopup from "../RejectPopup/RejectPopup";
import { useDispatch } from "react-redux";
import {
  approveBusiness,
  getAllBusinesses,
  rejectBusiness,
} from "../../store/slices/bussinessSlice";
import { Avatar } from "@mui/material";

const ModalRegistration = ({ open, onClose, selectedItem }) => {
  const [isRejectPopupOpen, setIsRejectPopupOpen] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const dispatch = useDispatch();

  const handleRejectClick = () => {
    setIsRejectPopupOpen(true);
  };

  const handleRejectPopupClose = () => {
    setIsRejectPopupOpen(false);
  };

  // logic reject application with note
  const handleRejectApplication = async (rejectData) => {
    try {
      setIsRejectPopupOpen(false);
      await dispatch(rejectBusiness({ 
        id: selectedItem._id, 
        note: rejectData.note 
      })).unwrap();
      
      toast.success("Business application rejected successfully!");
      dispatch(getAllBusinesses({ page: 1, limit: 10 }));
      onClose();
    } catch (error) {
      toast.error("Failed to reject business application: " + error);
    }
  };

  // logic approve application
  const handleApproveApplication = () => {
    setIsApproving(true);

    dispatch(approveBusiness(selectedItem._id))
      .unwrap()
      .then(() => {
        toast.success("Business approved successfully!");
        dispatch(getAllBusinesses({ page: 1, limit: 10 }));
        onClose();
      })
      .catch((error) => {
        toast.error("Failed to approve business: " + error);
      })
      .finally(() => {
        setIsApproving(false);
      });
  };

  const isFinalStatus =
    selectedItem?.status?.toLowerCase() === "approved" ||
    selectedItem?.status?.toLowerCase() === "rejected";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      sx={{
        "& .MuiDialog-paper": {
          width: "550px",
          maxWidth: "90vw",
          overflow: "hidden",
        },
      }}
    >
      <Box className="popup-header">
        <Box className="popup-logo-container">
          {selectedItem?.businessLogoUrl ? (
            <Avatar 
              src={selectedItem.businessLogoUrl} 
              alt="Business Logo" 
              className="popup-logo"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <Typography className="popup-title" style={{ display: selectedItem?.businessLogoUrl ? 'none' : 'flex' }}>
            {selectedItem?.businessName?.charAt(0) || ""}
          </Typography>
        </Box>
        <Typography className="popup-name">
          {selectedItem?.businessName || "N/A"}
        </Typography>
        <Typography className="popup-status">
          {selectedItem?.status || "N/A"}
        </Typography>
      </Box>
      <Box className="popup-des">
        <Typography>
          Review all registration details and approve or reject this business application.
        </Typography>
      </Box>
      <DialogContent>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box className="info-section">
            <Typography variant="h6" className="popUp-info-title">
              <TiClipboard className="mr-2 size-6" /> Business Information
            </Typography>
            <div style={{ border: "1px solid #ccc", marginTop: "8px" }}></div>
            <Typography className="popUp-info">
              <strong className="popUp-info-span">Business Name</strong>{" "}
              {selectedItem?.businessName || "N/A"}
            </Typography>
            <Typography className="popUp-info">
              <strong>Address</strong> {selectedItem?.businessAddress || "N/A"}
            </Typography>
            <Typography className="popUp-info">
              <strong>Tax ID</strong> {selectedItem?.taxCode || "N/A"}
            </Typography>
          </Box>
          <Box className="info-section">
            <Typography variant="h6" className="popUp-info-title">
              <IoMdPerson className="mr-2 size-6" /> Contact Information
            </Typography>
            <div style={{ border: "1px solid #ccc", marginTop: "8px" }}></div>
            <Typography className="popUp-info">
              <strong>Email</strong> {selectedItem?.businessMail || "N/A"}
            </Typography>
            <Typography className="popUp-info">
              <strong>Phone</strong> {selectedItem?.businessPhone || "N/A"}
            </Typography>
            <Typography className="popUp-info">
              <strong>Application Date</strong>{" "}
              {selectedItem?.updatedAt || "N/A"}
            </Typography>
          </Box>
        </Box>
        <div style={{ border: "1px solid #ccc", marginTop: "8px" }}></div>
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" className="popUp-info-title">
            <LuClipboardList className="mr-2 size-5" /> Business Documents
          </Typography>
          <div className="info-section-documents">
            <Box className="document-item">
              <Typography className="popUp-info-documents">
                <strong>Business License</strong>
              </Typography>
              {selectedItem?.businessLicenseUrl ? (
                <Box className="document-image-container">
                  <img 
                    src={selectedItem.businessLicenseUrl} 
                    alt="Business License" 
                    className="document-image"
                    onClick={() => window.open(selectedItem.businessLicenseUrl, '_blank')}
                  />
                  <Typography className="document-link">
                    <a
                      href={selectedItem.businessLicenseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Document
                    </a>
                  </Typography>
                </Box>
              ) : (
                <Typography className="popUp-info-documents">N/A</Typography>
              )}
            </Box>
            
            <Box className="document-item">
              <Typography className="popUp-info-documents">
                <strong>Food Safety Certificate</strong>
              </Typography>
              {selectedItem?.foodSafetyCertUrl ? (
                <Box className="document-image-container">
                  <img 
                    src={selectedItem.foodSafetyCertUrl} 
                    alt="Food Safety Certificate" 
                    className="document-image"
                    onClick={() => window.open(selectedItem.foodSafetyCertUrl, '_blank')}
                  />
                  <Typography className="document-link">
                    <a
                      href={selectedItem.foodSafetyCertUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Document
                    </a>
                  </Typography>
                </Box>
              ) : (
                <Typography className="popUp-info-documents">N/A</Typography>
              )}
            </Box>
          </div>
        </Box>
        <div style={{ border: "1px solid #ccc", marginTop: "8px" }}></div>
        {selectedItem?.status?.toLowerCase() === "rejected" && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" className="popUp-info-title">
              Rejection Reason
            </Typography>
            <Typography className="popUp-info">
              {selectedItem?.rejectNote || "No reason provided"}
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        {!isFinalStatus && (
          <div className="popup-actions">
            <Button onClick={handleRejectClick} className="popup-button-reject">
              <BiMessageSquareX className="mr-3 size-4" /> Reject Application
            </Button>
            <Button
              onClick={handleApproveApplication}
              className="popup-button-approve"
              disabled={isApproving}
            >
              {isApproving ? (
                <CircularProgress size={20} className="mr-3" />
              ) : (
                <SiTicktick className="mr-3 size-4" />
              )}
              Approve Application
            </Button>
          </div>
        )}
      </DialogActions>

      <RejectPopup
        open={isRejectPopupOpen}
        onClose={handleRejectPopupClose}
        onReject={handleRejectApplication}
        businessName={selectedItem?.businessName}
      />
    </Dialog>
  );
};

export default ModalRegistration;

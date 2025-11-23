import React, { useEffect, useState } from "react";
import "./Subscriptions.css";
import { 
  MdAttachMoney, 
  MdCalendarToday, 
  MdDescription, 
  MdPayment, 
  MdDateRange, 
  MdModeEdit, 
  MdDelete,
  MdAdd,
  MdSettings,
} from "react-icons/md";

import { IoIosSearch } from "react-icons/io";
import { 
  BiLayer 
} from "react-icons/bi";
import ModalSubscriptions from "../../../components/ModalSubscriptions/ModalSubscriptions";
import ModalFeatures from "../../../components/ModalFeatures/ModalFeatures";
import DeleteConfirmModal from "../../../components/DeleteConfirmModal/DeleteConfirmModal";
import { useDispatch, useSelector } from "react-redux";
import { 
  deleteSubscription, 
  getALLSubscriptions, 
  getSubscriptionById
} from "../../../store/slices/subscriptionSlice";
import toast from "react-hot-toast";
import { Button } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";


export default function Subscriptions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalMode, setModalMode] = useState("view");
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [openFeaturesModal, setOpenFeaturesModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const dispatch = useDispatch();
  const { subscription } = useSelector(state => state.subscription);

const dataSubscriptions = subscription.data?.subscriptions || [];
const featuresList = subscription.data?.description || [];

  useEffect(() => {
    dispatch(getALLSubscriptions());
  }, [dispatch]);

  // get subscription by id
  useEffect(() => {
    if (selectedItem) {
      dispatch(getSubscriptionById(selectedItem._id));
    }
  }, [dispatch, selectedItem]);

  const handleActionClick = (item) => {
    setSelectedItem(item);
    setModalMode("view");
    setOpenPopup(true);
  };


  // modal create subscription
  const handleCreateClick = () => {
    setSelectedItem(null);
    setModalMode("create");
    setOpenPopup(true);
  };


  // edit subscription
  const handleEditClick = (item) => {
    setSelectedItem(item);
    setModalMode("edit");
    setOpenPopup(true);
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setOpenDeleteModal(true);
  };


  // delete subscription
  const handleConfirmDelete = async () => {
    if (itemToDelete) {
      try {
        await dispatch(deleteSubscription(itemToDelete._id)).unwrap();
        toast.success("Subscription deleted successfully!");
      } catch (error) {
        toast.error(error.message || "An error occurred while deleting the subscription");
      }
      setOpenDeleteModal(false);
      setItemToDelete(null);
    }
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setItemToDelete(null);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
    setSelectedItem(null);
    setModalMode("view");
  };

  const handleManageFeatures = () => {
    setOpenFeaturesModal(true);
  };

  const handleCloseFeaturesModal = () => {
    setOpenFeaturesModal(false);
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  // Get filtered data
  const getFilteredData = () => {
    let filtered = [...dataSubscriptions];
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    return filtered;
  };

  const renderSubscriptionIcon = () => (
    <BiLayer 
      size={32}
      className="subscriptions-title-icon"
    />
  );


  const renderEmptyState = () => (
    <div className="subscriptions-empty">
      <BiLayer 
        size={64}
        className="subscriptions-empty-icon"
      />
      <h3 className="subscriptions-empty-title">No subscriptions found</h3>
      <p className="subscriptions-empty-description">
        {!searchTerm 
          ? 'No subscription plans available at the moment.'
          : `No subscriptions found matching "${searchTerm}". Try changing the search term.`
        }
      </p>
    </div>
  );


  return (
    <div className="subscriptions-management">
      {/* Header Section */}
      <div className="subscriptions-header">
        <div className="subscriptions-title-section">
          {renderSubscriptionIcon()}
          <div>
            <h1 className="subscriptions-title">Subscription Management</h1>
            <p className="subscriptions-description">
              Manage business subscription plans and billing
            </p>
          </div>
        </div>
        <div className="header-actions">
          <button className="manage-features-btn" onClick={handleManageFeatures}>
            <MdSettings size={20} />
            Manage Features
          </button>
          <button className="create-btn" onClick={handleCreateClick}>
            <MdAdd size={20} />
            Create Subscription
          </button>
        </div>
      </div>




  

      {/* Search Section */}
      <div className="subscriptions-filters">
        <div className="search-container">
          <IoIosSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by Subscription Name or Features"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="search-input"
          />
        </div>
      </div>

      {/* Subscription Cards */}
      {dataSubscriptions?.length === 0 ? (
        renderEmptyState()
      ) : (
        <div className="subscriptions-grid">
          {(() => {
            const filteredData = getFilteredData();
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            return filteredData.slice(startIndex, endIndex).map((item) => (
            <div key={item._id} className="subscriptions-card">
              <div className="subscriptions-card-header">
                <div className="subscriptions-card-info">
                  <div className="subscriptions-card-icon">
                    <MdPayment />
                  </div>
                  <div>
                    <h3 className="subscriptions-card-title">{item.name}</h3>
                    <p className="subscriptions-card-subtitle">
                      {item.isTrial ? 'Trial Plan' : 'Subscription Plan'}
                    </p>
                  </div>
                </div>
                <div className="action-buttons-row">
                  <Button 
                    className="action-btn-icon edit-btn"
                    onClick={() => handleEditClick(item)}
                    title="Edit"
                  >
                    <MdModeEdit size={20} />
                  </Button>
                  <Button 
                    className="action-btn-icon delete-btn"
                    onClick={() => handleDeleteClick(item)}
                    title="Delete"
                  >
                    <MdDelete size={20} />
                  </Button>
                </div>
              </div>
              
              <div className="subscriptions-card-details">
                <div className="subscriptions-detail-item">
                  <span className="subscriptions-detail-label">
                    <MdAttachMoney />
                    Price
                  </span>
                  <span className="subscriptions-detail-value">
                    {item.price === 0 ? 'Free' : `${item.price.toLocaleString()} VND`}
                  </span>
                </div>
                <div className="subscriptions-detail-item">
                  <span className="subscriptions-detail-label">
                    <MdCalendarToday />
                    Duration
                  </span>
                  <span className="subscriptions-detail-value">{item.durationInDays} days</span>
                </div>
                <div className="subscriptions-detail-item">
                  <span className="subscriptions-detail-label">
                    <MdDescription />
                    Features
                  </span>
                  <span className="subscriptions-detail-value">
                    {featuresList.length} features
                  </span>
                </div>
                <div className="subscriptions-detail-item">
                  <span className="subscriptions-detail-label">
                    Status
                  </span>
                  <span className={`status-badge ${item.isActive ? 'status-active' : 'status-cancelled'}`}>
                    {item.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="subscriptions-detail-item">
                  <span className="subscriptions-detail-label">
                    <MdDateRange />
                    Created
                  </span>
                  <span className="subscriptions-detail-value">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              
              <div className="subscriptions-card-actions">
                <button 
                  className="action-btn primary"
                  onClick={() => handleActionClick(item)}
                >
                  View Details
                </button>
              </div>
            </div>
            ));
          })()}
        </div>
      )}

      {/* Pagination */}
      {dataSubscriptions?.length > 0 && (() => {
        const filteredData = getFilteredData();
        const totalPages = Math.ceil(filteredData.length / itemsPerPage);
        return (
          <Stack
            spacing={2}
            className="mt-5 mb-5"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Pagination
              count={totalPages > 0 ? totalPages : 1}
              page={currentPage}
              onChange={handlePageChange}
              variant="outlined"
              shape="rounded"
              color="primary"
              showFirstButton
              showLastButton
              sx={{
                "& .MuiPaginationItem-root": {
                  "&.Mui-selected": {
                    backgroundColor: "#12422a",
                    color: "#ffffff",
                    fontWeight: 600,
                    "&:hover": {
                      backgroundColor: "#0d2e1c",
                    },
                  },
                  "&:hover": {
                    backgroundColor: "rgba(18, 66, 42, 0.1)",
                  },
                },
              }}
            />
          </Stack>
        );
      })()}

      <ModalSubscriptions
        open={openPopup}
        onClose={handleClosePopup}
        selectedItem={selectedItem}
        mode={modalMode}
      />

      <DeleteConfirmModal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        itemName={itemToDelete?.name}
        itemType="subscription plan"
      />

      <ModalFeatures
        open={openFeaturesModal}
        onClose={handleCloseFeaturesModal}
      />
    </div>
  );
}

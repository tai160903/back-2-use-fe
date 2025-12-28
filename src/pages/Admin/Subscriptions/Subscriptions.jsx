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
  MdStars,
} from "react-icons/md";

import { IoIosSearch } from "react-icons/io";
import { 
  BiLayer 
} from "react-icons/bi";
import ModalSubscriptions from "../../../components/ModalSubscriptions/ModalSubscriptions";
import ModalRewardPointPackage from "../../../components/ModalRewardPointPackage/ModalRewardPointPackage";
import DeleteConfirmModal from "../../../components/DeleteConfirmModal/DeleteConfirmModal";
import { useDispatch, useSelector } from "react-redux";
import { 
  deleteSubscription, 
  getALLSubscriptions, 
  getSubscriptionById
} from "../../../store/slices/subscriptionSlice";
import { getAllRewardPointPackagesApi, deleteRewardPointPackageApi } from "../../../store/slices/rewardPointPackageSlice";
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
  const [openDeleteRewardModal, setOpenDeleteRewardModal] = useState(false);
  const [rewardPackageToDelete, setRewardPackageToDelete] = useState(null);
  const [openRewardPointModal, setOpenRewardPointModal] = useState(false);
  const [selectedRewardPackage, setSelectedRewardPackage] = useState(null);
  const [rewardPointModalMode, setRewardPointModalMode] = useState("create");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const dispatch = useDispatch();
  const { subscription } = useSelector(state => state.subscription);
  const { packages: rewardPointPackages, isLoading: isLoadingPackages } = useSelector(state => state.rewardPointPackage);

  // Hỗ trợ cả hai dạng response:
  // { statusCode, message, data: [...] } hoặc { statusCode, message, data: { subscriptions: [...] } }
  const dataSubscriptions = Array.isArray(subscription.data)
    ? subscription.data
    : subscription.data?.subscriptions || [];

  useEffect(() => {
    dispatch(getALLSubscriptions());
    dispatch(getAllRewardPointPackagesApi({ page: 1, limit: 100 }));
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

  // Delete reward point package
  const handleDeleteRewardPackageClick = (pkg) => {
    setRewardPackageToDelete(pkg);
    setOpenDeleteRewardModal(true);
  };

  const handleConfirmDeleteRewardPackage = async () => {
    if (rewardPackageToDelete) {
      try {
        await dispatch(deleteRewardPointPackageApi({ id: rewardPackageToDelete._id })).unwrap();
        toast.success("Reward point package deleted successfully!");
        // Refresh packages list
        dispatch(getAllRewardPointPackagesApi({ page: 1, limit: 100 }));
      } catch (error) {
        toast.error(error?.message || error?.data?.message || "An error occurred while deleting the reward point package");
      }
      setOpenDeleteRewardModal(false);
      setRewardPackageToDelete(null);
    }
  };

  const handleCloseDeleteRewardModal = () => {
    setOpenDeleteRewardModal(false);
    setRewardPackageToDelete(null);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
    setSelectedItem(null);
    setModalMode("view");
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

const formatLimitValue = (value) => {
  if (value === -1) return "NO LIMIT";
  if (value == null) return "∞";
  return value;
};


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
          <button 
            className="create-btn reward-point-btn" 
            onClick={() => {
              setSelectedRewardPackage(null);
              setRewardPointModalMode("create");
              setOpenRewardPointModal(true);
            }}
          >
            <MdStars size={20} />
            Create Reward Point Package
          </button>
          <button className="create-btn" onClick={handleCreateClick}>
            <MdAdd size={20} />
            Create Subscription
          </button>
        </div>
      </div>




  

      {/* Reward Point Packages Section */}
      <div className="reward-point-packages-section">
        <div className="section-header-wrapper">
          <div className="section-title-wrapper">
            <MdStars className="section-title-icon" />
            <h2 className="section-title">Reward Point Packages</h2>
            <span className="section-badge">{rewardPointPackages?.length || 0} packages</span>
          </div>
        </div>
        
        {isLoadingPackages ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading packages...</p>
          </div>
        ) : rewardPointPackages?.length === 0 ? (
          <div className="empty-packages">
            <MdStars size={48} className="empty-icon" />
            <p className="empty-text">No reward point packages available</p>
            <p className="empty-subtext">Create your first package to get started</p>
          </div>
        ) : (
          <div className="reward-packages-grid">
            {rewardPointPackages.map((pkg) => (
              <div key={pkg._id} className="reward-package-card">
                <div className="reward-package-header">
                  <div className="reward-package-icon-wrapper">
                    <MdStars className="reward-package-icon" />
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <div className={`reward-package-status ${pkg.isActive ? 'active' : 'inactive'}`}>
                      {pkg.isActive ? 'Active' : 'Inactive'}
                    </div>
                    <Button 
                      className="action-btn-icon edit-btn"
                      onClick={() => {
                        setSelectedRewardPackage(pkg);
                        setRewardPointModalMode("edit");
                        setOpenRewardPointModal(true);
                      }}
                      title="Edit"
                      sx={{ minWidth: '40px', width: '40px', height: '40px' }}
                    >
                      <MdModeEdit size={20} />
                    </Button>
                    <Button 
                      className="action-btn-icon delete-btn"
                      onClick={() => handleDeleteRewardPackageClick(pkg)}
                      title="Delete"
                      sx={{ minWidth: '40px', width: '40px', height: '40px' }}
                    >
                      <MdDelete size={20} />
                    </Button>
                  </div>
                </div>
                <div className="reward-package-content">
                  <h3 className="reward-package-name">{pkg.name}</h3>
                  <p className="reward-package-description">{pkg.description}</p>
                  <div className="reward-package-details">
                    <div className="reward-package-detail-item">
                      <span className="detail-label">Points</span>
                      <span className="detail-value points-value">{pkg.points.toLocaleString()}</span>
                    </div>
                    <div className="reward-package-detail-item">
                      <span className="detail-label">Price</span>
                      <span className="detail-value price-value">{pkg.price.toLocaleString()} VND</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="section-divider"></div>

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

                {/* Usage limits overview */}
                <div className="subscriptions-limits">
                  <div className="limit-badge">
                    <span className="limit-badge-label">Groups</span>
                    <span className="limit-badge-value">
                      {formatLimitValue(item.limits?.productGroupLimit)}
                    </span>
                  </div>
                  <div className="limit-badge">
                    <span className="limit-badge-label">Items / Group</span>
                    <span className="limit-badge-value">
                      {formatLimitValue(item.limits?.productItemLimit)}
                    </span>
                  </div>
                  <div className="limit-badge">
                    <span className="limit-badge-label">Reward Points</span>
                    <span className="limit-badge-value">
                      {item.limits?.rewardPointsLimit != null 
                        ? item.limits.rewardPointsLimit.toLocaleString() 
                        : 'N/A'}
                    </span>
                  </div>
                </div>
                <div className="subscriptions-detail-item">
                  <span className="subscriptions-detail-label">
                    Status
                  </span>
                  <span className={`status-badge ${item.isActive ? 'status-active' : 'status-cancelled'}`}>
                    {item.isActive ? 'Active' : 'Inactive'}
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

      <DeleteConfirmModal
        open={openDeleteRewardModal}
        onClose={handleCloseDeleteRewardModal}
        onConfirm={handleConfirmDeleteRewardPackage}
        itemName={rewardPackageToDelete?.name}
        itemType="reward point package"
      />

      <ModalRewardPointPackage
        open={openRewardPointModal}
        onClose={() => {
          setOpenRewardPointModal(false);
          setSelectedRewardPackage(null);
          setRewardPointModalMode("create");
          // Refresh packages list after creating/updating
          dispatch(getAllRewardPointPackagesApi({ page: 1, limit: 100 }));
        }}
        selectedItem={selectedRewardPackage}
        mode={rewardPointModalMode}
      />

    </div>
  );
}

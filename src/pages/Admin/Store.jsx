import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getAllBusinessesApi, 
  getBusinessStatsApi,
  setBusinessBlockedFilter, 
  updateBusinessBlockStatusApi
} from '../../store/slices/adminSlice';
import StoreDetailModal from '../../components/StoreDetailModal/StoreDetailModal';
import { IoIosSearch } from "react-icons/io";
import { LuStore } from "react-icons/lu";
import { CiClock2 } from "react-icons/ci";
import { SiTicktick } from "react-icons/si";
import { BiMessageSquareX } from "react-icons/bi";
import { FaStore, FaEllipsisV, FaBan, FaUnlock, FaCheckCircle, FaEye } from "react-icons/fa";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Loading from "../../components/Loading/Loading";
import './Store.css';

const Store = () => {
  const dispatch = useDispatch();
  const { 
    businesses, 
    isLoading, 
    businessPagination, 
    businessFilters,
    businessStats 
  } = useSelector(state => state.admin);
  
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isUnblockModalOpen, setIsUnblockModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [blockReason, setBlockReason] = useState('');
  const [unblockReason, setUnblockReason] = useState('');

  useEffect(() => {
    dispatch(getAllBusinessesApi({
      page: currentPage,
      limit: 5,
      isBlocked: businessFilters.isBlocked
    }));
  }, [dispatch, currentPage, businessFilters.isBlocked]);

  // Fetch business statistics on component mount
  useEffect(() => {
    dispatch(getBusinessStatsApi());
  }, [dispatch]);

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1);
    if (newFilter === "All") {
      dispatch(setBusinessBlockedFilter(null));
    } else if (newFilter === "Active") {
      dispatch(setBusinessBlockedFilter(false));
    } else if (newFilter === "Blocked") {
      dispatch(setBusinessBlockedFilter(true));
    }
  };

  const getAllFilteredData = () => {
    let filtered = [...businesses];
    if (filter !== "All") {
      if (filter === "Active") {
        filtered = filtered.filter(item => item.isActive && !item.isBlocked);
      } else if (filter === "Blocked") {
        filtered = filtered.filter(item => item.isBlocked);
      }
    }
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.businessAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.businessPhone.includes(searchTerm)
      );
    }
    return filtered;
  };

  const handleMenuToggle = (storeId) => {
    setOpenMenuId(openMenuId === storeId ? null : storeId);
  };

  const handleStoreAction = (storeId, action) => {
    const store = filteredData.find(s => s._id === storeId);
    if (store) {
      setSelectedStore(store);
      if (action === 'view') {
        setIsDetailModalOpen(true);
      } else if (action === 'block') {
        setIsBlockModalOpen(true);
        setBlockReason('');
      } else if (action === 'unblock') {
        setIsUnblockModalOpen(true);
        setUnblockReason('');
      }
    }
    setOpenMenuId(null);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedStore(null);
  };

  const handleCloseBlockModal = () => {
    setIsBlockModalOpen(false);
    setSelectedStore(null);
    setBlockReason('');
  };

  const handleCloseUnblockModal = () => {
    setIsUnblockModalOpen(false);
    setSelectedStore(null);
    setUnblockReason('');
  };

  const handleConfirmBlock = async () => {
    if (!blockReason.trim()) {
      alert('Please provide a reason for blocking this store.');
      return;
    }
    
    console.log('Blocking store:', selectedStore._id, 'userId:', selectedStore.userId, 'with reason:', blockReason.trim());
    
    try {
      const result = await dispatch(updateBusinessBlockStatusApi({
        businessId: selectedStore.userId,
        blockData: {
          isBlocked: true,
          reason: blockReason.trim()
        }
      })).unwrap();
      
      console.log('Block result:', result);
      handleCloseBlockModal();
      
      // Refresh statistics and business list
      await dispatch(getBusinessStatsApi());
      await dispatch(getAllBusinessesApi({
        page: currentPage,
        limit: 5,
        isBlocked: businessFilters.isBlocked
      }));
    } catch (error) {
      console.error('Block error:', error);
      alert(`Error blocking store: ${error.message || 'Unknown error'}`);
    }
  };

  const handleConfirmUnblock = async () => {
    if (!unblockReason.trim()) {
      alert('Please provide a reason for unblocking this store.');
      return;
    }
    
    console.log('Unblocking store:', selectedStore._id, 'userId:', selectedStore.userId, 'with reason:', unblockReason.trim());
    
    try {
      const result = await dispatch(updateBusinessBlockStatusApi({
        businessId: selectedStore.userId,
        blockData: {
          isBlocked: false,
          reason: unblockReason.trim()
        }
      })).unwrap();
      
      console.log('Unblock result:', result);
      handleCloseUnblockModal();
      
      // Refresh statistics and business list
      await dispatch(getBusinessStatsApi());
      await dispatch(getAllBusinessesApi({
        page: currentPage,
        limit: 5,
        isBlocked: businessFilters.isBlocked
      }));
    } catch (error) {
      console.error('Unblock error:', error);
      alert(`Error unblocking store: ${error.message || 'Unknown error'}`);
    }
  };

  const renderStoreIcon = () => (
    <LuStore className="admin-store-title-icon" size={32} />
  );

  const renderEmptyState = () => (
    <div className="admin-store-empty">
      <LuStore className="admin-store-empty-icon" size={64} />
      <h3 className="admin-store-empty-title">No stores found</h3>
      <p className="admin-store-empty-description">
        {!searchTerm 
          ? 'No stores available at the moment.'
          : `No stores found matching "${searchTerm}". Try changing the search term.`
        }
      </p>
    </div>
  );

  const filteredData = getAllFilteredData();
  const totalStores = businessStats.total || 0;
  const activeStores = businessStats.active || 0;
  const blockedStores = businessStats.blocked || 0;

  return (
    <div className="admin-store-management">
      {/* Header Section */}
      <div className="admin-store-header">
        <div className="admin-store-title-section">
          {renderStoreIcon()}
          <div>
            <h1 className="admin-store-title">Store Management</h1>
            <p className="admin-store-description">
              View and manage business stores and their status
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="admin-store-stats">
        <div className="admin-stat-card admin-stat-card-0">
          <div className="admin-stat-content">
            <div className="admin-stat-info">
              <h3 className="admin-stat-title">Total Stores</h3>
              <span className="admin-stat-number">{totalStores}</span>
            </div>
            <FaStore className="admin-stat-icon" />
          </div>
        </div>

        <div className="admin-stat-card admin-stat-card-1">
          <div className="admin-stat-content">
            <div className="admin-stat-info">
              <h3 className="admin-stat-title">Active Stores</h3>
              <span className="admin-stat-number active">{activeStores}</span>
            </div>
            <FaCheckCircle className="admin-stat-icon active" />
          </div>
        </div>

        <div className="admin-stat-card admin-stat-card-2">
          <div className="admin-stat-content">
            <div className="admin-stat-info">
              <h3 className="admin-stat-title">Blocked Stores</h3>
              <span className="admin-stat-number blocked">{blockedStores}</span>
            </div>
            <BiMessageSquareX className="admin-stat-icon blocked" />
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="admin-store-filters">
        <div className="admin-search-container">
          <IoIosSearch className="admin-search-icon" />
          <input
            type="text"
            placeholder="Search by Store Name, Address, Phone Number..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="admin-search-input"
          />
        </div>
        
        <div className="admin-filter-tabs">
          <button 
            className={`admin-filter-tab ${filter === "All" ? "active" : ""}`}
            onClick={() => handleFilterChange("All")}
          >
            <FaStore />
            All ({totalStores})
          </button>
          <button 
            className={`admin-filter-tab ${filter === "Active" ? "active" : ""}`}
            onClick={() => handleFilterChange("Active")}
          >
            <FaCheckCircle />
            Active ({activeStores})
          </button>
          <button 
            className={`admin-filter-tab ${filter === "Blocked" ? "active" : ""}`}
            onClick={() => handleFilterChange("Blocked")}
          >
            <BiMessageSquareX />
            Blocked ({blockedStores})
          </button>
        </div>
      </div>

      {/* Table Header */}
      <div className="admin-table-header-card">
        <div className="admin-table-header-cell">Store Name</div>
        <div className="admin-table-header-cell">Address</div>
        <div className="admin-table-header-cell">Status</div>
        <div className="admin-table-header-cell">Actions</div>
      </div>

      {/* Store Cards */}
      {isLoading ? (
        <div className="flex w-full justify-center py-10"><Loading /></div>
      ) : filteredData.length === 0 ? (
        renderEmptyState()
      ) : (
        <div className="admin-stores-cards">
          {filteredData.map((store) => {
            const status = store.isBlocked ? "Blocked" : (store.isActive ? "Active" : "Blocked");
            return (
            <div key={store._id} className={`admin-store-card ${openMenuId === store._id ? 'admin-menu-open' : ''}`}>
              <div className="admin-store-card-cell admin-store-info">
                <div className="admin-store-logo-container">
                  {store.businessLogoUrl ? (
                    <img 
                      src={store.businessLogoUrl} 
                      alt={store.businessName}
                      className="admin-store-logo-avatar"
                    />
                  ) : (
                    <div className="admin-store-logo-placeholder-avatar">
                      <FaStore size={20} />
                    </div>
                  )}
                </div>
                <div className="admin-store-details">
                  <div className="admin-store-name">{store.businessName}</div>
                  <div className="admin-store-type">{store.businessType}</div>
                </div>
              </div>
              
              <div className="admin-store-card-cell">
                <div className="admin-store-address">{store.businessAddress}</div>
              </div>
              
              <div className="admin-store-card-cell">
                <div className={`admin-status-indicator ${status.toLowerCase()}`}>
                  <div className={`admin-status-dot ${status.toLowerCase()}`}></div>
                  <span className="admin-status-text">{status}</span>
                </div>
              </div>
              
              <div className="admin-store-card-cell">
                <div className="admin-action-menu-container">
                  <div 
                    className="admin-action-menu"
                    onClick={() => handleMenuToggle(store._id)}
                  >
                    <FaEllipsisV size={16} />
                  </div>
                  
                  {openMenuId === store._id && (
                    <div className="admin-dropdown-menu">
                      <div 
                        className="admin-dropdown-item admin-view"
                        onClick={() => handleStoreAction(store._id, 'view')}
                      >
                        <FaEye className="admin-dropdown-icon" />
                        <span>View Detail</span>
                      </div>
                      {status === "Active" ? (
                        <div 
                          className="admin-dropdown-item admin-block"
                          onClick={() => handleStoreAction(store._id, 'block')}
                        >
                          <FaBan className="admin-dropdown-icon" />
                          <span>Block Store</span>
                        </div>
                      ) : (
                        <div 
                          className="admin-dropdown-item admin-unblock"
                          onClick={() => handleStoreAction(store._id, 'unblock')}
                        >
                          <FaUnlock className="admin-dropdown-icon" />
                          <span>Unblock Store</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )})}
        </div>
      )}

      {/* Pagination */}
      <Stack
        spacing={2}
        className="mt-20 mb-10"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Pagination
          count={businessPagination.totalPages}
          page={currentPage}
          onChange={handlePageChange}
          variant="outlined"
          shape="rounded"
        />
      </Stack>

      {/* Store Detail Modal */}
      <StoreDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        store={selectedStore}
        onBlock={() => {}}
        onUnblock={() => {}}
      />

      {/* Block Store Modal */}
      {isBlockModalOpen && selectedStore && (
        <div className="admin-modal-overlay" onClick={handleCloseBlockModal}>
          <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">Block Store</h2>
              <button className="admin-modal-close-btn" onClick={handleCloseBlockModal}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            <div className="admin-modal-body">
              <div className="admin-store-info-block">
                <h3 className="admin-store-name-block">{selectedStore.businessName}</h3>
                <p className="admin-store-type-block">{selectedStore.businessType}</p>
              </div>

              <div className="admin-form-group">
                <label htmlFor="reason" className="admin-form-label">
                  Reason for blocking *
                </label>
                <textarea
                  id="reason"
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  placeholder="Please provide a reason for blocking this store..."
                  className="admin-form-textarea"
                  rows="4"
                  required
                />
              </div>
            </div>

            <div className="admin-modal-footer">
              <button 
                type="button" 
                className="admin-btn admin-btn-cancel" 
                onClick={handleCloseBlockModal}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="admin-btn admin-btn-confirm-block"
                onClick={handleConfirmBlock}
              >
                Block Store
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Unblock Store Modal */}
      {isUnblockModalOpen && selectedStore && (
        <div className="modal-overlay" onClick={handleCloseUnblockModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Unblock Store</h2>
              <button className="modal-close-btn" onClick={handleCloseUnblockModal}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            <div className="modal-body">
              <div className="store-info">
                <h3 className="store-name">{selectedStore.businessName}</h3>
                <p className="store-type">{selectedStore.businessType}</p>
              </div>

              <div className="form-group">
                <label htmlFor="unblock-reason" className="form-label">
                  Reason for unblocking *
                </label>
                <textarea
                  id="unblock-reason"
                  value={unblockReason}
                  onChange={(e) => setUnblockReason(e.target.value)}
                  placeholder="Please provide a reason for unblocking this store..."
                  className="form-textarea"
                  rows="4"
                  required
                />
              </div>
            </div>

            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-cancel" 
                onClick={handleCloseUnblockModal}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-confirm-unblock"
                onClick={handleConfirmUnblock}
              >
                Unblock Store
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Store;

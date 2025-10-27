import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getAllBusinessesApi, 
  setBusinessBlockedFilter, 
  setBusinessPagination,
  resetBusinessFilters,
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
    businessFilters 
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
      limit: 10,
      isBlocked: businessFilters.isBlocked
    }));
  }, [dispatch, currentPage, businessFilters.isBlocked]);

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
      // Refresh the page after successful block
      window.location.reload();
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
      // Refresh the page after successful unblock
      window.location.reload();
    } catch (error) {
      console.error('Unblock error:', error);
      alert(`Error unblocking store: ${error.message || 'Unknown error'}`);
    }
  };

  const renderStoreIcon = () => (
    <LuStore className="store-title-icon" size={32} />
  );

  const renderEmptyState = () => (
    <div className="store-empty">
      <LuStore className="store-empty-icon" size={64} />
      <h3 className="store-empty-title">No stores found</h3>
      <p className="store-empty-description">
        {!searchTerm 
          ? 'No stores available at the moment.'
          : `No stores found matching "${searchTerm}". Try changing the search term.`
        }
      </p>
    </div>
  );

  const filteredData = getAllFilteredData();
  const totalStores = businessPagination.total || 0;
  const activeStores = businesses.filter(b => b.isActive && !b.isBlocked).length;
  const blockedStores = businesses.filter(b => b.isBlocked).length;

  return (
    <div className="store-management">
      {/* Header Section */}
      <div className="store-header">
        <div className="store-title-section">
          {renderStoreIcon()}
          <div>
            <h1 className="store-title">Store Management</h1>
            <p className="store-description">
              View and manage business stores and their status
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="store-stats">
        <div className="stat-card stat-card-0">
          <div className="stat-content">
            <div className="stat-info">
              <h3 className="stat-title">Total Stores</h3>
              <span className="stat-number">{totalStores}</span>
            </div>
            <FaStore className="stat-icon" />
          </div>
        </div>

        <div className="stat-card stat-card-1">
          <div className="stat-content">
            <div className="stat-info">
              <h3 className="stat-title">Active Stores</h3>
              <span className="stat-number active">{activeStores}</span>
            </div>
            <FaCheckCircle className="stat-icon active" />
          </div>
        </div>

        <div className="stat-card stat-card-2">
          <div className="stat-content">
            <div className="stat-info">
              <h3 className="stat-title">Blocked Stores</h3>
              <span className="stat-number blocked">{blockedStores}</span>
            </div>
            <BiMessageSquareX className="stat-icon blocked" />
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="store-filters">
        <div className="search-container">
          <IoIosSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by Store Name, Address, Phone Number..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="search-input"
          />
        </div>
        
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${filter === "All" ? "active" : ""}`}
            onClick={() => handleFilterChange("All")}
          >
            <FaStore />
            All ({totalStores})
          </button>
          <button 
            className={`filter-tab ${filter === "Active" ? "active" : ""}`}
            onClick={() => handleFilterChange("Active")}
          >
            <FaCheckCircle />
            Active ({activeStores})
          </button>
          <button 
            className={`filter-tab ${filter === "Blocked" ? "active" : ""}`}
            onClick={() => handleFilterChange("Blocked")}
          >
            <BiMessageSquareX />
            Blocked ({blockedStores})
          </button>
        </div>
      </div>

      {/* Table Header */}
      <div className="table-header-card">
        <div className="table-header-cell">Store Name</div>
        <div className="table-header-cell">Address</div>
        <div className="table-header-cell">Status</div>
        <div className="table-header-cell">Actions</div>
      </div>

      {/* Store Cards */}
      {isLoading ? (
        <div className="flex w-full justify-center py-10"><Loading /></div>
      ) : filteredData.length === 0 ? (
        renderEmptyState()
      ) : (
        <div className="stores-cards">
          {filteredData.map((store) => {
            const status = store.isBlocked ? "Blocked" : (store.isActive ? "Active" : "Blocked");
            return (
            <div key={store._id} className={`store-card ${openMenuId === store._id ? 'menu-open' : ''}`}>
              <div className="store-card-cell store-info">
                <div className="store-logo-container">
                  {store.businessLogoUrl ? (
                    <img 
                      src={store.businessLogoUrl} 
                      alt={store.businessName}
                      className="store-logo-avatar"
                    />
                  ) : (
                    <div className="store-logo-placeholder-avatar">
                      <FaStore size={20} />
                    </div>
                  )}
                </div>
                <div className="store-details">
                  <div className="store-name">{store.businessName}</div>
                  <div className="store-type">{store.businessType}</div>
                </div>
              </div>
              
              <div className="store-card-cell">
                <div className="store-address">{store.businessAddress}</div>
              </div>
              
              <div className="store-card-cell">
                <div className={`status-indicator ${status.toLowerCase()}`}>
                  <div className={`status-dot ${status.toLowerCase()}`}></div>
                  <span className="status-text">{status}</span>
                </div>
              </div>
              
              <div className="store-card-cell">
                <div className="action-menu-container">
                  <div 
                    className="action-menu"
                    onClick={() => handleMenuToggle(store._id)}
                  >
                    <FaEllipsisV size={16} />
                  </div>
                  
                  {openMenuId === store._id && (
                    <div className="dropdown-menu">
                      <div 
                        className="dropdown-item view"
                        onClick={() => handleStoreAction(store._id, 'view')}
                      >
                        <FaEye className="dropdown-icon" />
                        <span>View Detail</span>
                      </div>
                      {status === "Active" ? (
                        <div 
                          className="dropdown-item block"
                          onClick={() => handleStoreAction(store._id, 'block')}
                        >
                          <FaBan className="dropdown-icon" />
                          <span>Block Store</span>
                        </div>
                      ) : (
                        <div 
                          className="dropdown-item unblock"
                          onClick={() => handleStoreAction(store._id, 'unblock')}
                        >
                          <FaUnlock className="dropdown-icon" />
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
        <div className="modal-overlay" onClick={handleCloseBlockModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Block Store</h2>
              <button className="modal-close-btn" onClick={handleCloseBlockModal}>
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
                <label htmlFor="reason" className="form-label">
                  Reason for blocking *
                </label>
                <textarea
                  id="reason"
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  placeholder="Please provide a reason for blocking this store..."
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
                onClick={handleCloseBlockModal}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-confirm-block"
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

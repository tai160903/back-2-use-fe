import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import VoucherCard from '../../components/VoucherCard/VoucherCard';
import VoucherModal from './VoucherModal';
import VoucherDetailModal from '../../components/VoucherDetailModal/VoucherDetailModal';
import { 
  getLeaderboardVouchersApi,
  createLeaderboardVoucherApi,
  getLeaderboardVoucherByIdApi,
  getBusinessVouchersAdminApi,
  getBusinessVoucherByIdAdminApi,
  setVoucherNameFilter,
  resetVoucherFilters,
  setCurrentVoucher
} from '../../store/slices/voucherSlice';
import { FaGift, FaPlus, FaTrophy, FaStore } from 'react-icons/fa';
import { PiClipboardTextBold } from "react-icons/pi";
import { IoIosSearch } from "react-icons/io";
import { CiEdit } from "react-icons/ci";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import './AdminVoucher.css';

const Analytics = () => {
  const dispatch = useDispatch();
  const { 
    vouchers, 
    adminBusinessVouchers,
    currentVoucher,
    isLoading, 
    error, 
    voucherPagination, 
    voucherFilters 
  } = useSelector(state => state.vouchers);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // Load both leaderboard and business vouchers on component mount
    dispatch(getLeaderboardVouchersApi({
      page: 1,
      limit: 100,
    }));
    dispatch(getBusinessVouchersAdminApi({
      page: 1,
      limit: 100,
    }));
  }, [dispatch]);

  const handleAddVoucher = () => {
    setEditingVoucher(null);
    setIsModalOpen(true);
  };

  const handleEditVoucher = (voucher) => {
    setEditingVoucher(voucher);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingVoucher(null);
  };

  const handleViewDetail = (voucher) => {
    const voucherId = voucher._id || voucher.id;
    if (voucherId) {
      // Check voucher type to call appropriate API
      if (voucher.voucherType === 'business') {
        // For business vouchers, use the data we already have from list API
        // The list API already returns full voucher details, no need to call detail API
        // Map the business voucher data to match the expected format
        const mappedVoucher = {
          ...voucher,
          name: voucher.customName || voucher.name,
          description: voucher.customDescription || voucher.description,
          discountPercent: voucher.discountPercent || voucher.discount,
          voucherType: 'business',
        };
        dispatch(setCurrentVoucher(mappedVoucher));
        setIsDetailModalOpen(true);
      } else {
        // For leaderboard vouchers, call the API
        dispatch(getLeaderboardVoucherByIdApi(voucherId));
        setIsDetailModalOpen(true);
      }
    }
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleFilterChange = (event, newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };


  // Get all vouchers (combine leaderboard and business)
  const getAllVouchers = () => {
    // Map leaderboard vouchers with voucherType
    const leaderboardVouchers = vouchers
      .filter((item) => item.voucherType === 'leaderboard')
      .map(item => ({ ...item, voucherType: 'leaderboard' }));
    
    // Map business vouchers with voucherType
    const businessVouchers = (adminBusinessVouchers || []).map(item => ({
      ...item,
      voucherType: 'business'
    }));
    
    return [...leaderboardVouchers, ...businessVouchers];
  };

  // Get all filtered data
  const getAllFilteredData = () => {
    let filtered = getAllVouchers();
    
    // Filter by voucher type
    if (filter === "Leaderboard Voucher") {
      filtered = filtered.filter((item) => item.voucherType === 'leaderboard');
    } else if (filter === "Business Voucher") {
      filtered = filtered.filter((item) => item.voucherType === 'business');
    }
    // If filter is "All", show all vouchers
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    return filtered;
  };

  // Get leaderboard vouchers count
  const getLeaderboardVouchersCount = () => {
    return getAllVouchers().filter((item) => item.voucherType === 'leaderboard').length;
  };

  // Get business vouchers count
  const getBusinessVouchersCount = () => {
    return getAllVouchers().filter((item) => item.voucherType === 'business').length;
  };

  const renderGiftIcon = () => (
    <svg 
      width="32" 
      height="32" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="voucher-title-icon"
    >
      <path 
        d="M20 12v-2a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v2M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M12 4v16M9 4a3 3 0 0 1 3 3M15 4a3 3 0 0 0-3 3" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );

  const renderEmptyState = () => (
    <div className="voucher-empty">
      <svg 
        width="64" 
        height="64" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="voucher-empty-icon"
      >
        <path 
          d="M20 12v-2a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v2M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M12 4v16" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
      <h3 className="voucher-empty-title">No vouchers found</h3>
      <p className="voucher-empty-description">
        {!searchTerm 
          ? 'No vouchers available at the moment.'
          : `No vouchers found matching "${searchTerm}". Try changing the search term.`
        }
      </p>
    </div>
  );

  const renderLoadingState = () => (
    <div className="voucher-loading">
      <div className="loading-spinner"></div>
    </div>
  );

  return (
    <div className="voucher-management">
      {/* Header Section */}
      <div className="voucher-header">
        <div className="voucher-title-section">
          {renderGiftIcon()}
          <div>
            <h1 className="voucher-title">Vouchers Management</h1>
            <p className="voucher-description">
              Create and manage leaderboard vouchers for top-ranked customers
            </p>
          </div>
        </div>
        <button className="add-voucher-btn" onClick={handleAddVoucher}>
          <FaPlus size={16} />
          Add Voucher
        </button>
      </div>

      {/* Statistics Cards - All Vouchers */}
      <div className="voucher-stats">
        <div className="stat-card stat-card-0">
          <div className="stat-content">
            <div className="stat-info">
              <h3 className="stat-title">Total Vouchers</h3>
              <span className="stat-number">{getAllVouchers().length}</span>
            </div>
            <PiClipboardTextBold className="stat-icon" size={56} />
          </div>
        </div>

        <div className="stat-card stat-card-1">
          <div className="stat-content">
            <div className="stat-info">
              <h3 className="stat-title">Leaderboard Vouchers</h3>
              <span className="stat-number">
                {getLeaderboardVouchersCount()}
              </span>
            </div>
            <FaTrophy className="stat-icon" size={56} style={{ color: '#fbbf24' }} />
          </div>
        </div>

        <div className="stat-card stat-card-2">
          <div className="stat-content">
            <div className="stat-info">
              <h3 className="stat-title">Business Vouchers</h3>
              <span className="stat-number">
                {getBusinessVouchersCount()}
              </span>
            </div>
            <FaStore className="stat-icon" size={56} style={{ color: '#22c55e' }} />
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="voucher-filters">
        <div className="search-container">
          <IoIosSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by Voucher Name or..."
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
            onClick={() => handleFilterChange(null, "All")}
          >
            <PiClipboardTextBold />
            All ({getAllVouchers().length})
          </button>
          <button 
            className={`filter-tab ${filter === "Leaderboard Voucher" ? "active" : ""}`}
            onClick={() => handleFilterChange(null, "Leaderboard Voucher")}
          >
            <FaTrophy />
            Leaderboard Voucher ({getLeaderboardVouchersCount()})
          </button>
          <button 
            className={`filter-tab ${filter === "Business Voucher" ? "active" : ""}`}
            onClick={() => handleFilterChange(null, "Business Voucher")}
          >
            <FaStore />
            Business Voucher ({getBusinessVouchersCount()})
          </button>
        </div>
      </div>

      {/* Voucher List */}
      {isLoading ? (
        renderLoadingState()
      ) : getAllFilteredData().length === 0 ? (
        renderEmptyState()
      ) : (
        <div className="voucher-list-container">
          <div className="voucher-list-header">
            <div className="voucher-list-header-cell" style={{ flex: '2' }}>Voucher Name</div>
            <div className="voucher-list-header-cell" style={{ flex: '1' }}>Type</div>
            <div className="voucher-list-header-cell" style={{ flex: '1' }}>Discount</div>
            <div className="voucher-list-header-cell" style={{ flex: '1' }}>Base Code</div>
            <div className="voucher-list-header-cell" style={{ flex: '1', textAlign: 'center' }}>Actions</div>
          </div>
          <div className="voucher-list">
            {(() => {
              const filteredData = getAllFilteredData();
              const perPage = 10;
              const startIndex = (currentPage - 1) * perPage;
              const endIndex = startIndex + perPage;
              return filteredData.slice(startIndex, endIndex).map((voucher) => (
                <div key={voucher._id || voucher.id} className="voucher-list-item">
                  <div className="voucher-list-cell" style={{ flex: '2' }}>
                    <div className="voucher-list-name">
                      <FaGift className="voucher-list-icon" />
                      <div>
                        <div className="voucher-list-title">{voucher.name}</div>
                        <div className="voucher-list-subtitle">
                          {voucher.voucherType === 'leaderboard' ? 'Leaderboard Voucher' : 'Business Voucher'}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="voucher-list-cell" style={{ flex: '1' }}>
                    <span className={`voucher-type-badge ${voucher.voucherType === 'leaderboard' ? 'type-leaderboard' : 'type-business'}`}>
                      {voucher.voucherType === 'leaderboard' ? 'Leaderboard' : 'Business'}
                    </span>
                  </div>
                  <div className="voucher-list-cell" style={{ flex: '1' }}>
                    <span className="discount-badge-list">
                      {voucher.discountPercent || voucher.discount || 0}%
                    </span>
                  </div>
                  <div className="voucher-list-cell" style={{ flex: '1' }}>
                    <span className="base-code-text">{voucher.baseCode || 'N/A'}</span>
                  </div>
                  <div className="voucher-list-cell" style={{ flex: '1', textAlign: 'center', justifyContent: 'center' }}>
                    <div className="voucher-list-actions">
                      <button 
                        className="action-btn-list edit-btn-list" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditVoucher(voucher);
                        }}
                        title="Edit"
                      >
                        <CiEdit size={18} />
                      </button>
                      <button 
                        className="action-btn-list view-btn-list" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetail(voucher);
                        }}
                        title="View Details"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && getAllVouchers().length > 0 && (() => {
        const filteredData = getAllFilteredData();
        const perPage = 8;
        const filteredTotalPages = Math.ceil(filteredData.length / perPage);
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
              count={filteredTotalPages > 0 ? filteredTotalPages : 1}
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
                    backgroundColor: "#164e31",
                    color: "#ffffff",
                    fontWeight: 600,
                    "&:hover": {
                      backgroundColor: "#0f3d20",
                    },
                  },
                  "&:hover": {
                    backgroundColor: "rgba(22, 78, 49, 0.1)",
                  },
                },
              }}
            />
          </Stack>
        );
      })()}

      {/* Voucher Modal */}
      {isModalOpen && (
        <VoucherModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          voucher={editingVoucher}
          voucherType="leaderboard"
          onSubmit={async (voucherData) => {
            try {
              if (editingVoucher) {
                // Note: updateVoucherApi has been removed
                console.warn('Update functionality has been removed');
              } else {
                // Only create leaderboard vouchers (admin-created vouchers)
                await dispatch(createLeaderboardVoucherApi(voucherData)).unwrap();
                // Refresh voucher list after successful creation
                dispatch(getLeaderboardVouchersApi({
                  page: 1,
                  limit: 100,
                }));
              }
              handleCloseModal();
            } catch (error) {
              // Error is handled by the thunk (toast notification)
              console.error('Failed to save voucher:', error);
            }
          }}
        />
      )}

      {/* Voucher Detail Modal */}
      <VoucherDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        voucher={currentVoucher}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Analytics;

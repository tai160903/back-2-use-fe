import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import VoucherCard from '../../components/VoucherCard/VoucherCard';
import VoucherModal from './VoucherModal';
import VoucherDetailModal from '../../components/VoucherDetailModal/VoucherDetailModal';
import { 
  getAllVouchersApi,
  createVoucherApi,
  createBusinessVoucherApi,
  createLeaderboardVoucherApi,
  updateVoucherApi,
  getVoucherByIdApi,
  setVoucherNameFilter,
  resetVoucherFilters 
} from '../../store/slices/voucherSlice';
import { FaGift, FaPlus } from 'react-icons/fa';
import { CiClock2 } from "react-icons/ci";
import { SiTicktick } from "react-icons/si";
import { BiMessageSquareX } from "react-icons/bi";
import { PiClipboardTextBold } from "react-icons/pi";
import { IoIosSearch } from "react-icons/io";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import './AdminVoucher.css';

const Analytics = () => {
  const dispatch = useDispatch();
  const { 
    vouchers, 
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
    // Load only leaderboard vouchers (admin-created vouchers) on component mount
    dispatch(getAllVouchersApi({
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
      dispatch(getVoucherByIdApi(voucherId));
      setIsDetailModalOpen(true);
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


  // Get all filtered data - only leaderboard vouchers (admin-created)
  const getAllFilteredData = () => {
    // Filter only leaderboard vouchers (admin-created vouchers)
    let filtered = vouchers.filter(
      (item) => item.voucherType === 'leaderboard'
    );
    
    if (filter !== "All") {
      filtered = filtered.filter(
        (item) => item.status.toLowerCase() === filter.toLowerCase()
      );
    }
    
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    return filtered;
  };

  // Get only leaderboard vouchers for stats
  const getLeaderboardVouchers = () => {
    return vouchers.filter((item) => item.voucherType === 'leaderboard');
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

      {/* Statistics Cards - Only Leaderboard Vouchers */}
      <div className="voucher-stats">
        <div className="stat-card stat-card-0">
          <div className="stat-content">
            <div className="stat-info">
              <h3 className="stat-title">Total Vouchers</h3>
              <span className="stat-number">{getLeaderboardVouchers().length}</span>
            </div>
            <PiClipboardTextBold className="stat-icon" size={56} />
          </div>
        </div>

        <div className="stat-card stat-card-1">
          <div className="stat-content">
            <div className="stat-info">
              <h3 className="stat-title">Pending Review</h3>
              <span className="stat-number pending">
                {getLeaderboardVouchers().filter((item) => item.status === "pending").length}
              </span>
            </div>
            <CiClock2 className="stat-icon pending" size={56} />
          </div>
        </div>

        <div className="stat-card stat-card-2">
          <div className="stat-content">
            <div className="stat-info">
              <h3 className="stat-title">Active</h3>
              <span className="stat-number active">
                {getLeaderboardVouchers().filter((item) => item.status === "active").length}
              </span>
            </div>
            <SiTicktick className="stat-icon active" size={56} />
          </div>
        </div>

        <div className="stat-card stat-card-3">
          <div className="stat-content">
            <div className="stat-info">
              <h3 className="stat-title">Expired</h3>
              <span className="stat-number expired">
                {getLeaderboardVouchers().filter((item) => item.status === "expired").length}
              </span>
            </div>
            <BiMessageSquareX className="stat-icon expired" size={56} />
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
            All ({getLeaderboardVouchers().length})
          </button>
          <button 
            className={`filter-tab ${filter === "pending" ? "active" : ""}`}
            onClick={() => handleFilterChange(null, "pending")}
          >
            <CiClock2 />
            Pending ({getLeaderboardVouchers().filter((item) => item.status === "pending").length})
          </button>
          <button 
            className={`filter-tab ${filter === "active" ? "active" : ""}`}
            onClick={() => handleFilterChange(null, "active")}
          >
            <SiTicktick />
            Active ({getLeaderboardVouchers().filter((item) => item.status === "active").length})
          </button>
          <button 
            className={`filter-tab ${filter === "expired" ? "active" : ""}`}
            onClick={() => handleFilterChange(null, "expired")}
          >
            <BiMessageSquareX />
            Expired ({getLeaderboardVouchers().filter((item) => item.status === "expired").length})
          </button>
        </div>
      </div>

      {/* Voucher Cards */}
      {isLoading ? (
        renderLoadingState()
      ) : getAllFilteredData().length === 0 ? (
        renderEmptyState()
      ) : (
        <div className="voucher-grid leaderboard">
          {(() => {
            const filteredData = getAllFilteredData();
            const perPage = 8;
            const startIndex = (currentPage - 1) * perPage;
            const endIndex = startIndex + perPage;
            return filteredData.slice(startIndex, endIndex).map((voucher) => (
              <VoucherCard 
                key={voucher._id} 
                voucher={voucher}
                onEdit={handleEditVoucher}
                onViewDetail={handleViewDetail}
              />
            ));
          })()}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && getLeaderboardVouchers().length > 0 && (() => {
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
                await dispatch(updateVoucherApi({
                  voucherId: editingVoucher._id,
                  voucherData
                })).unwrap();
              } else {
                // Only create leaderboard vouchers (admin-created vouchers)
                await dispatch(createLeaderboardVoucherApi(voucherData)).unwrap();
                // Refresh voucher list after successful creation
                dispatch(getAllVouchersApi({
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

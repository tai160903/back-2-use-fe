import React, { useEffect, useState } from "react";
import "./Registration.css";
import { CiClock2 } from "react-icons/ci";
import { SiTicktick } from "react-icons/si";
import { BiMessageSquareX } from "react-icons/bi";
import { PiClipboardTextBold } from "react-icons/pi";
import { IoIosSearch } from "react-icons/io";
import { CiMail } from "react-icons/ci";
import { MdOutlinePhone } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import { TiClipboard } from "react-icons/ti";
import { FaEllipsisV } from "react-icons/fa";
import ModalRegistration from "../../../components/ModalRegistration/ModalRegistration";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useDispatch, useSelector } from "react-redux";
import { getAllBusinesses, getAllBusinessesForStats } from "../../../store/slices/bussinessSlice";

export default function Registration() {
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState(null);

  const dispatch = useDispatch();
  const { businesses, allBusinesses, totalPages, total, isLoading } = useSelector(
    (state) => state.businesses
  );
  useEffect(() => {
    dispatch(getAllBusinesses({ page: currentPage, limit: 10 }));
    dispatch(getAllBusinessesForStats());
  }, [dispatch, currentPage]);

  // Debug logging
  useEffect(() => {
    console.log("Businesses data:", businesses);
    console.log("All Businesses:", allBusinesses);
    console.log("Total:", total);
    console.log("Total Pages:", totalPages);
    console.log("Current Page:", currentPage);
    console.log("Is Loading:", isLoading);
  }, [businesses, allBusinesses, total, totalPages, currentPage, isLoading]);

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleFilterChange = (event, newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const handleMenuToggle = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  // Hàm để lấy dữ liệu đã filter từ tất cả businesses
  const getAllFilteredData = () => {
    let filtered = [...allBusinesses];
    if (filter !== "All") {
      filtered = filtered.filter(
        (item) => item.status.toLowerCase() === filter.toLowerCase()
      );
    }
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.businessMail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.businessPhone.includes(searchTerm)
      );
    }
    return filtered;
  };

  const handleActionClick = (item) => {
    setSelectedItem(item);
    setOpenPopup(true);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
    setSelectedItem(null);
  };

  const renderBusinessIcon = () => (
    <svg 
      width="32" 
      height="32" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="registration-title-icon"
    >
      <path 
        d="M12 2L2 7L12 12L22 7L12 2Z" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M2 17L12 22L22 17" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M2 12L12 17L22 12" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );

  const renderEmptyState = () => (
    <div className="registration-empty">
      <svg 
        width="64" 
        height="64" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="registration-empty-icon"
      >
        <path 
          d="M12 2L2 7L12 12L22 7L12 2Z" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
      <h3 className="registration-empty-title">No businesses found</h3>
      <p className="registration-empty-description">
        {!searchTerm 
          ? 'No business applications available at the moment.'
          : `No businesses found matching "${searchTerm}". Try changing the search term.`
        }
      </p>
    </div>
  );

  const renderLoadingState = () => (
    <div className="registration-loading">
      <div className="loading-spinner"></div>
    </div>
  );

  return (
    <div className="registration-management">
      {/* Header Section */}
      <div className="registration-header">
        <div className="registration-title-section">
          {renderBusinessIcon()}
          <div>
            <h1 className="registration-title">Business Registration Management</h1>
            <p className="registration-description">
              Review and manage business applications by status
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="registration-stats">
        <div className="stat-card stat-card-0">
          <div className="stat-content">
            <div className="stat-info">
              <h3 className="stat-title">Total Applications</h3>
              <span className="stat-number">{allBusinesses.length}</span>
            </div>
            <PiClipboardTextBold className="stat-icon" />
          </div>
        </div>

        <div className="stat-card stat-card-1">
          <div className="stat-content">
            <div className="stat-info">
              <h3 className="stat-title">Pending Review</h3>
              <span className="stat-number pending">
                {allBusinesses.filter((item) => item.status === "pending").length}
              </span>
            </div>
            <CiClock2 className="stat-icon pending" />
          </div>
        </div>

        <div className="stat-card stat-card-2">
          <div className="stat-content">
            <div className="stat-info">
              <h3 className="stat-title">Approved</h3>
              <span className="stat-number approved">
                {allBusinesses.filter((item) => item.status === "approved").length}
              </span>
            </div>
            <SiTicktick className="stat-icon approved" />
          </div>
        </div>

        <div className="stat-card stat-card-3">
          <div className="stat-content">
            <div className="stat-info">
              <h3 className="stat-title">Rejected</h3>
              <span className="stat-number rejected">
                {allBusinesses.filter((item) => item.status === "rejected").length}
              </span>
            </div>
            <BiMessageSquareX className="stat-icon rejected" />
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="registration-filters">
        <div className="search-container">
          <IoIosSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by Business Name, Email, Phone Number"
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
            All ({allBusinesses.length})
          </button>
          <button 
            className={`filter-tab ${filter === "pending" ? "active" : ""}`}
            onClick={() => handleFilterChange(null, "pending")}
          >
            <CiClock2 />
            Pending ({allBusinesses.filter((item) => item.status === "pending").length})
          </button>
          <button 
            className={`filter-tab ${filter === "approved" ? "active" : ""}`}
            onClick={() => handleFilterChange(null, "approved")}
          >
            <SiTicktick />
            Approved ({allBusinesses.filter((item) => item.status === "approved").length})
          </button>
          <button 
            className={`filter-tab ${filter === "rejected" ? "active" : ""}`}
            onClick={() => handleFilterChange(null, "rejected")}
          >
            <BiMessageSquareX />
            Rejected ({allBusinesses.filter((item) => item.status === "rejected").length})
          </button>
        </div>
      </div>

      {/* Business List (Users-like layout) */}
      {isLoading ? (
        renderLoadingState()
      ) : getAllFilteredData().length === 0 ? (
        renderEmptyState()
      ) : (
        <>
          <div className="table-header-card">
            <div className="table-header-cell">Business</div>
            <div className="table-header-cell">Email</div>
            <div className="table-header-cell">Phone</div>
            <div className="table-header-cell">Status</div>
            <div className="table-header-cell">Actions</div>
          </div>
          <div className="registration-cards">
            {(() => {
              const filteredData = getAllFilteredData();
              const startIndex = (currentPage - 1) * 10;
              const endIndex = startIndex + 10;
              return filteredData.slice(startIndex, endIndex).map((item) => {
                const id = item.id || item._id || item.businessId;
                const status = item.status; // pending | approved | rejected
                return (
                  <div key={id} className={`registration-row ${openMenuId === id ? 'menu-open' : ''}`}>
                    <div className="registration-cell registration-info">
                      <div className="registration-avatar">
                        <PiClipboardTextBold />
                      </div>
                      <div className="registration-details">
                        <div className="registration-name">{item.businessName}</div>
                        <div className="registration-subtitle">Business Application</div>
                      </div>
                    </div>

                    <div className="registration-cell">
                      <div className="registration-email">{item.businessMail}</div>
                    </div>

                    <div className="registration-cell">
                      <div className="registration-phone">{item.businessPhone}</div>
                    </div>

                    <div className="registration-cell">
                      <div className={`status-indicator ${status}`}>
                        <div className={`status-dot ${status}`}></div>
                        <span className="status-text">{status}</span>
                      </div>
                    </div>

                    <div className="registration-cell">
                      <div className="action-menu-container">
                        <div 
                          className="action-menu"
                          onClick={() => handleMenuToggle(id)}
                        >
                          <FaEllipsisV size={16} />
                        </div>
                        {openMenuId === id && (
                          <div className="dropdown-menu">
                            <div 
                              className="dropdown-item unblock"
                              onClick={() => { setOpenMenuId(null); handleActionClick(item); }}
                            >
                              <span>Manage Application</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </>
      )}

      {/* Pagination */}
      {!isLoading && (() => {
        const filteredData = getAllFilteredData();
        const filteredTotalPages = Math.ceil(filteredData.length / 10);
        return filteredTotalPages > 1 && (
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
              count={filteredTotalPages}
              page={currentPage}
              onChange={handlePageChange}
              variant="outlined"
              shape="rounded"
            />
          </Stack>
        );
      })()}

      <ModalRegistration
        open={openPopup}
        onClose={handleClosePopup}
        selectedItem={selectedItem}
      />
    </div>
  );
}

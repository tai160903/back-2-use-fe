import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getAllMaterialsApi, 
  createMaterialApi,
  setMaterialNameFilter,
  resetFilters,
  getMaterialRequestsApi,
  updateMaterialApi,
  reviewMaterialApi
} from '../../store/slices/adminSlice';
import MaterialCard from '../../components/MaterialCard/MaterialCard';
import MaterialModal from './MaterialModal';
import ReviewMaterialModal from './ReviewMaterialModal';
import { FaRecycle, FaPlus } from 'react-icons/fa';
import { CiClock2 } from "react-icons/ci";
import { SiTicktick } from "react-icons/si";
import { BiMessageSquareX } from "react-icons/bi";
import { PiClipboardTextBold } from "react-icons/pi";
import { IoIosSearch } from "react-icons/io";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import './Material.css';

const Material = () => {
  const dispatch = useDispatch();
  const { 
    materials, 
    materialRequests,
    materialRequestPagination,
    isLoading, 
    error, 
    pagination, 
    filters 
  } = useSelector(state => state.admin);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewingRequest, setReviewingRequest] = useState(null);
  const [reviewMode, setReviewMode] = useState(null); // 'approve' or 'reject'
  const [filter, setFilter] = useState("active");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // Load materials on component mount
    dispatch(getAllMaterialsApi({
      page: 1,
      limit: 100,
    }));
    // Load material requests (pending) on component mount
    dispatch(getMaterialRequestsApi({
      status: 'pending',
      page: 1,
      limit: 100,
    }));
  }, [dispatch]);

  const handleAddMaterial = () => {
    setEditingMaterial(null);
    setIsModalOpen(true);
  };

  const handleEditMaterial = (material) => {
    setEditingMaterial(material);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMaterial(null);
  };

  const handleOpenReviewModal = (request, mode) => {
    setReviewingRequest(request);
    setReviewMode(mode);
    setIsReviewModalOpen(true);
  };

  const handleCloseReviewModal = () => {
    // Reset state in correct order to prevent flickering
    setReviewMode(null);
    setReviewingRequest(null);
    setIsReviewModalOpen(false);
  };

  const handleReviewSubmit = async (reviewData) => {
    if (!reviewingRequest) return;
    
    try {
      await dispatch(reviewMaterialApi({
        materialId: reviewingRequest._id,
        reviewData
      })).unwrap();
      
      // Refresh material requests
      dispatch(getMaterialRequestsApi({
        status: 'pending',
        page: 1,
        limit: 100,
      }));
      
      // Refresh materials list
      dispatch(getAllMaterialsApi({
        page: 1,
        limit: 100,
      }));
      
      handleCloseReviewModal();
    } catch (error) {
      // Error handled by thunk
    }
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleFilterChange = (event, newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1);
    // Reload material requests when switching to pending filter
    if (newFilter === "pending") {
      dispatch(getMaterialRequestsApi({
        status: 'pending',
        page: 1,
        limit: 100,
      }));
    }
  };

  // Get all filtered data (safe guards for undefined fields)
  const getAllFilteredData = () => {
    const safeMaterials = Array.isArray(materials) ? materials : [];
    let filtered = [...safeMaterials];
    
    // Filter by status - only show active materials
    if (filter === "active") {
      filtered = filtered.filter((item) => {
        // Material is active if:
        // 1. isActive is true
        // 2. status is 'approved' or 'active'
        return item.isActive === true || 
               item.status === 'approved' || 
               item.status === 'active';
      });
    }
    
    // Filter by search term
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter((item) => {
        const name = (item?.materialName ?? '').toLowerCase();
        const desc = (item?.description ?? '').toLowerCase();
        return name.includes(q) || desc.includes(q);
      });
    }
    return filtered;
  };
  
  // Get active materials count
  const getActiveMaterialsCount = () => {
    const safeMaterials = Array.isArray(materials) ? materials : [];
    return safeMaterials.filter((item) => {
      return item.isActive === true || 
             item.status === 'approved' || 
             item.status === 'active';
    }).length;
  };

  const renderRecycleIcon = () => (
    <svg 
      width="32" 
      height="32" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="material-title-icon"
    >
      <path 
        d="M9 3V4H4V6H5V19C5 20.1 5.9 21 7 21H17C18.1 21 19 20.1 19 19V6H20V4H15V3H9ZM7 6H17V19H7V6Z" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill="currentColor"
      />
      <path 
        d="M9 8V17H11V8H9ZM13 8V17H15V8H13Z" 
        fill="currentColor"
      />
    </svg>
  );

  const renderEmptyState = () => (
    <div className="material-empty">
      <svg 
        width="64" 
        height="64" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="material-empty-icon"
      >
        <path 
          d="M9 3V4H4V6H5V19C5 20.1 5.9 21 7 21H17C18.1 21 19 20.1 19 19V6H20V4H15V3H9Z" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
      <h3 className="material-empty-title">No materials found</h3>
      <p className="material-empty-description">
        {!searchTerm 
          ? 'No recyclable materials available at the moment.'
          : `No materials found matching "${searchTerm}". Try changing the search term.`
        }
      </p>
    </div>
  );

  const renderLoadingState = () => (
    <div className="material-loading">
      <div className="loading-spinner"></div>
    </div>
  );

  return (
    <div className="material-management">
      {/* Header Section */}
      <div className="material-header">
        <div className="material-title-section">
          {renderRecycleIcon()}
          <div>
            <h1 className="material-title">Materials Management</h1>
            <p className="material-description">
              Review and manage recyclable materials by status
            </p>
          </div>
        </div>
        <button className="add-material-btn" onClick={handleAddMaterial}>
          <FaPlus size={16} />
          Add Material
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="material-stats">
        <div className="stat-card stat-card-0">
          <div className="stat-content">
            <div className="stat-info">
              <h3 className="stat-title">Total Active Materials</h3>
              <span className="stat-number">{materials.length}</span>
            </div>
            <PiClipboardTextBold className="stat-icon" size={56} />
          </div>
        </div>

        <div className="stat-card stat-card-1">
          <div className="stat-content">
            <div className="stat-info">
              <h3 className="stat-title">Waiting Approve</h3>
              <span className="stat-number pending">
                {materialRequestPagination?.total || materialRequests?.length || 0}
              </span>
            </div>
            <CiClock2 className="stat-icon pending" size={56} />
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="material-filters">
        <div className="search-container">
          <IoIosSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by Material Name or Description"
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
            className={`filter-tab ${filter === "active" ? "active" : ""}`}
            onClick={() => handleFilterChange(null, "active")}
          >
            <PiClipboardTextBold />
            Active ({getActiveMaterialsCount()})
          </button>
          <button 
            className={`filter-tab ${filter === "pending" ? "active" : ""}`}
            onClick={() => handleFilterChange(null, "pending")}
          >
            <CiClock2 />
            Waiting Approve ({materialRequestPagination?.total || materialRequests?.length || 0})
          </button>
        </div>
      </div>

      {/* Material Cards or Material Requests */}
      {isLoading ? (
        renderLoadingState()
      ) : filter === "pending" ? (
        // Show material requests when filter is "pending"
        materialRequests.length === 0 ? (
          renderEmptyState()
        ) : (
          <div className="material-grid">
            {(() => {
              const startIndex = (currentPage - 1) * 6;
              const endIndex = startIndex + 6;
              return materialRequests.slice(startIndex, endIndex).map((request) => (
                <div key={request._id} className="material-card">
                  <div className="material-card-header">
                    <h3 className="material-card-title">{request.requestedMaterialName}</h3>
                    <span className="material-card-status pending">Active</span>
                  </div>
                  <div className="material-card-body">
                    <p className="material-card-description">{request.description || 'No description'}</p>
                    {request.businessId && (
                      <div className="material-card-business">
                        <strong>Business:</strong> {request.businessId.businessName || 'N/A'}
                      </div>
                    )}
                    <div className="material-card-date">
                      <strong>Requested:</strong> {new Date(request.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="material-card-actions">
                    <button
                      className="material-card-btn approve-btn"
                      onClick={() => handleOpenReviewModal(request, 'approve')}
                    >
                      <SiTicktick />
                      Approve
                    </button>
                    <button
                      className="material-card-btn reject-btn"
                      onClick={() => handleOpenReviewModal(request, 'reject')}
                    >
                      <BiMessageSquareX />
                      Reject
                    </button>
                  </div>
                </div>
              ));
            })()}
          </div>
        )
      ) : getAllFilteredData().length === 0 ? (
        renderEmptyState()
      ) : (
        <div className="material-grid">
          {(() => {
            const filteredData = getAllFilteredData();
            const startIndex = (currentPage - 1) * 6;
            const endIndex = startIndex + 6;
            return filteredData.slice(startIndex, endIndex).map((material) => (
              <MaterialCard 
                key={material._id} 
                material={material}
                onEdit={handleEditMaterial}
              />
            ));
          })()}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && (() => {
        let totalPages = 1;
        let totalItems = 0;
        
        if (filter === "pending") {
          totalItems = materialRequests.length;
          totalPages = Math.ceil(totalItems / 6);
        } else {
          const filteredData = getAllFilteredData();
          totalItems = filteredData.length;
          totalPages = Math.ceil(totalItems / 6);
        }
        
        return totalItems > 0 ? (
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
        ) : null;
      })()}

      {/* Material Modal */}
      <MaterialModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        material={editingMaterial}
        onSubmit={async (materialData) => {
          try {
            if (editingMaterial) {
              await dispatch(updateMaterialApi({
                materialId: editingMaterial._id,
                materialData
              })).unwrap();
              // Refresh materials list
              dispatch(getAllMaterialsApi({
                page: 1,
                limit: 100,
              }));
            } else {
              await dispatch(createMaterialApi(materialData)).unwrap();
              // Refresh materials list
              dispatch(getAllMaterialsApi({
                page: 1,
                limit: 100,
              }));
            }
            handleCloseModal();
          } catch (error) {
            // Error handled by thunk
          }
        }}
      />

      {/* Review Material Modal */}
      <ReviewMaterialModal
        isOpen={isReviewModalOpen}
        onClose={handleCloseReviewModal}
        materialRequest={reviewingRequest}
        mode={reviewMode}
        onSubmit={handleReviewSubmit}
      />
    </div>
  );
};

export default Material;



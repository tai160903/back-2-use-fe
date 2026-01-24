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
import { CiClock2, CiEdit } from "react-icons/ci";
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
  const [singleUseFilter, setSingleUseFilter] = useState("all"); // "all", "single", "reusable"

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
    
    // Filter by single use
    if (singleUseFilter === "single") {
      filtered = filtered.filter((item) => item.isSingleUse === true);
    } else if (singleUseFilter === "reusable") {
      filtered = filtered.filter((item) => item.isSingleUse !== true);
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

  // Get single-use materials count
  const getSingleUseMaterialsCount = () => {
    const safeMaterials = Array.isArray(materials) ? materials : [];
    return safeMaterials.filter((item) => {
      const isActive = item.isActive === true || 
                       item.status === 'approved' || 
                       item.status === 'active';
      return isActive && item.isSingleUse === true;
    }).length;
  };

  // Get reusable materials count
  const getReusableMaterialsCount = () => {
    const safeMaterials = Array.isArray(materials) ? materials : [];
    return safeMaterials.filter((item) => {
      const isActive = item.isActive === true || 
                       item.status === 'approved' || 
                       item.status === 'active';
      return isActive && item.isSingleUse !== true;
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
        <div 
          className="stat-card stat-card-0"
          onClick={() => {
            setFilter("active");
            setSingleUseFilter("all");
            setCurrentPage(1);
          }}
          style={{ cursor: 'pointer' }}
        >
          <div className="stat-content">
            <div className="stat-info">
              <h3 className="stat-title">Total Active Materials</h3>
              <span className="stat-number">{getActiveMaterialsCount()}</span>
            </div>
            <PiClipboardTextBold className="stat-icon" size={56} />
          </div>
        </div>

        <div 
          className="stat-card stat-card-1"
          onClick={() => {
            setFilter("active");
            setSingleUseFilter("single");
            setCurrentPage(1);
          }}
          style={{ cursor: 'pointer' }}
        >
          <div className="stat-content">
            <div className="stat-info">
              <h3 className="stat-title">Single-Use Materials</h3>
              <span className="stat-number" style={{ color: '#f57c00' }}>
                {getSingleUseMaterialsCount()}
              </span>
            </div>
            <FaRecycle className="stat-icon" size={56} style={{ color: '#f57c00', backgroundColor: '#fff3e0' }} />
          </div>
        </div>

        <div 
          className="stat-card stat-card-2"
          onClick={() => {
            setFilter("active");
            setSingleUseFilter("reusable");
            setCurrentPage(1);
          }}
          style={{ cursor: 'pointer' }}
        >
          <div className="stat-content">
            <div className="stat-info">
              <h3 className="stat-title">Reusable Materials</h3>
              <span className="stat-number" style={{ color: '#2e7d32' }}>
                {getReusableMaterialsCount()}
              </span>
            </div>
            <FaRecycle className="stat-icon" size={56} style={{ color: '#2e7d32', backgroundColor: '#e8f5e9' }} />
          </div>
        </div>

        <div 
          className="stat-card stat-card-3"
          onClick={() => {
            setFilter("pending");
            setCurrentPage(1);
          }}
          style={{ cursor: 'pointer' }}
        >
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
            className={`filter-tab ${filter === "active" && singleUseFilter === "all" ? "active" : ""}`}
            onClick={() => {
              handleFilterChange(null, "active");
              setSingleUseFilter("all");
            }}
          >
            <PiClipboardTextBold />
            All Active ({getActiveMaterialsCount()})
          </button>
          <button 
            className={`filter-tab ${filter === "active" && singleUseFilter === "single" ? "active" : ""}`}
            onClick={() => {
              setFilter("active");
              setSingleUseFilter("single");
              setCurrentPage(1);
            }}
            style={{ 
              backgroundColor: filter === "active" && singleUseFilter === "single" ? '#f57c00' : 'white',
              color: filter === "active" && singleUseFilter === "single" ? 'white' : '#6b7280',
              borderColor: filter === "active" && singleUseFilter === "single" ? '#f57c00' : '#e5e7eb'
            }}
          >
            Single-Use ({getSingleUseMaterialsCount()})
          </button>
          <button 
            className={`filter-tab ${filter === "active" && singleUseFilter === "reusable" ? "active" : ""}`}
            onClick={() => {
              setFilter("active");
              setSingleUseFilter("reusable");
              setCurrentPage(1);
            }}
            style={{ 
              backgroundColor: filter === "active" && singleUseFilter === "reusable" ? '#2e7d32' : 'white',
              color: filter === "active" && singleUseFilter === "reusable" ? 'white' : '#6b7280',
              borderColor: filter === "active" && singleUseFilter === "reusable" ? '#2e7d32' : '#e5e7eb'
            }}
          >
            Reusable ({getReusableMaterialsCount()})
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
          <div className="material-list-container">
            <div className="material-list-header">
              <div className="material-list-header-cell" style={{ flex: '2' }}>Material Name</div>
              <div className="material-list-header-cell" style={{ flex: '1.5' }}>Business</div>
              <div className="material-list-header-cell" style={{ flex: '1' }}>Requested Date</div>
              <div className="material-list-header-cell" style={{ flex: '1', textAlign: 'center' }}>Actions</div>
            </div>
            <div className="material-list">
              {(() => {
                const perPage = 10;
                const startIndex = (currentPage - 1) * perPage;
                const endIndex = startIndex + perPage;
                return materialRequests.slice(startIndex, endIndex).map((request) => (
                  <div key={request._id} className="material-list-item">
                    <div className="material-list-cell" style={{ flex: '2' }}>
                      <div className="material-list-name">
                        <FaRecycle className="material-list-icon" />
                        <div>
                          <div className="material-list-title">{request.requestedMaterialName}</div>
                          <div className="material-list-subtitle">
                            {request.description ? (request.description.length > 50 ? request.description.substring(0, 50) + '...' : request.description) : 'No description'}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="material-list-cell" style={{ flex: '1.5' }}>
                      <span style={{ fontWeight: 500, color: '#374151' }}>
                        {request.businessId?.businessName || 'N/A'}
                      </span>
                    </div>
                    <div className="material-list-cell" style={{ flex: '1' }}>
                      <span style={{ fontSize: '13px', color: '#6b7280' }}>
                        {new Date(request.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="material-list-cell" style={{ flex: '1', textAlign: 'center', justifyContent: 'center' }}>
                      <div className="material-list-actions">
                        <button
                          className="action-btn-list approve-btn-list"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenReviewModal(request, 'approve');
                          }}
                          title="Approve"
                        >
                          <SiTicktick size={16} />
                          Approve
                        </button>
                        <button
                          className="action-btn-list reject-btn-list"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenReviewModal(request, 'reject');
                          }}
                          title="Reject"
                        >
                          <BiMessageSquareX size={16} />
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>
        )
      ) : getAllFilteredData().length === 0 ? (
        renderEmptyState()
      ) : (
        <div className="material-list-container">
          <div className="material-list-header">
            <div className="material-list-header-cell" style={{ flex: '2' }}>Material Name</div>
            <div className="material-list-header-cell" style={{ flex: '1' }}>Type</div>
            <div className="material-list-header-cell" style={{ flex: '1' }}>Reuse Limit</div>
            <div className="material-list-header-cell" style={{ flex: '1' }}>Status</div>
            <div className="material-list-header-cell" style={{ flex: '1', textAlign: 'center' }}>Actions</div>
          </div>
          <div className="material-list">
            {(() => {
              const filteredData = getAllFilteredData();
              const perPage = 10;
              const startIndex = (currentPage - 1) * perPage;
              const endIndex = startIndex + perPage;
              return filteredData.slice(startIndex, endIndex).map((material) => (
                <div key={material._id} className="material-list-item">
                  <div className="material-list-cell" style={{ flex: '2' }}>
                    <div className="material-list-name">
                      <FaRecycle className="material-list-icon" />
                      <div>
                        <div className="material-list-title">{material.materialName}</div>
                        <div className="material-list-subtitle">
                          {material.description ? (material.description.length > 50 ? material.description.substring(0, 50) + '...' : material.description) : 'No description'}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="material-list-cell" style={{ flex: '1' }}>
                    <span className={`material-status-badge ${material.isSingleUse ? 'status-pending' : 'status-active'}`} style={{
                      backgroundColor: material.isSingleUse ? '#fff3e0' : '#e8f5e9',
                      color: material.isSingleUse ? '#f57c00' : '#2e7d32',
                      border: `1px solid ${material.isSingleUse ? '#f57c00' : '#2e7d32'}`,
                      fontWeight: 600,
                      fontSize: '12px',
                      padding: '4px 12px',
                      borderRadius: '12px',
                    }}>
                      {material.isSingleUse ? 'Single-Use' : 'Reusable'}
                    </span>
                  </div>
                  <div className="material-list-cell" style={{ flex: '1' }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#374151' }}>
                      {material.reuseLimit || material.maximumReuse || 'N/A'} times
                    </span>
                  </div>
            
                  <div className="material-list-cell" style={{ flex: '1' }}>
                    <span className={`material-status-badge ${material.isActive ? 'status-active' : 'status-pending'}`}>
                      {material.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="material-list-cell" style={{ flex: '1', textAlign: 'center', justifyContent: 'center' }}>
                    <button
                      className="action-btn-list"
                      onClick={() => handleEditMaterial(material)}
                      title="Edit"
                      style={{
                        backgroundColor: '#164e31',
                        color: 'white',
                        border: 'none',
                        padding: '6px 16px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '13px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <CiEdit size={16} />
                      Edit
                    </button>
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && (() => {
        let totalPages = 1;
        let totalItems = 0;
        
        if (filter === "pending") {
          totalItems = materialRequests.length;
          const perPage = 10;
          totalPages = Math.ceil(totalItems / perPage);
        } else {
          const filteredData = getAllFilteredData();
          totalItems = filteredData.length;
          const perPage = 10;
          totalPages = Math.ceil(totalItems / perPage);
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



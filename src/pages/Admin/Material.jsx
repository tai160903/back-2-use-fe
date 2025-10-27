import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getAllMaterialsApi, 
  createMaterialApi,
  setMaterialNameFilter,
  resetFilters 
} from '../../store/slices/adminSlice';
import MaterialCard from '../../components/MaterialCard/MaterialCard';
import MaterialModal from './MaterialModal';
import { updateMaterialApi } from '../../store/slices/adminSlice';
import { FaRecycle, FaPlus } from 'react-icons/fa';
import './Material.css';

const Material = () => {
  const dispatch = useDispatch();
  const { 
    materials, 
    isLoading, 
    error, 
    pagination, 
    filters 
  } = useSelector(state => state.admin);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);

  useEffect(() => {
    // Load materials on component mount and when material name filter changes
    dispatch(getAllMaterialsApi({
      page: 1,
      limit: 20,
      materialName: filters.materialName
    }));
  }, [dispatch, filters.materialName]);

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

  const handleMaterialNameFilterChange = (name) => {
    dispatch(setMaterialNameFilter(name));
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
  };

  const renderRecycleIcon = () => (
    <FaRecycle className="material-title-icon" />
  );

  const renderAddIcon = () => (
    <FaPlus size={20} />
  );

  const renderEmptyState = () => (
    <div className="materials-empty">
      <svg 
        width="64" 
        height="64" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="materials-empty-icon"
      >
        <path 
          d="M9 3V4H4V6H5V19C5 20.1 5.9 21 7 21H17C18.1 21 19 20.1 19 19V6H20V4H15V3H9ZM7 6H17V19H7V6ZM9 8V17H11V8H9ZM13 8V17H15V8H13Z" 
          fill="currentColor"
        />
      </svg>
      <h3 className="materials-empty-title">No materials found</h3>
      <p className="materials-empty-description">
        {!filters.materialName 
          ? 'Start by adding your first recyclable material.'
          : `No materials found matching "${filters.materialName}". Try changing the search term or add a new material.`
        }
      </p>
      {/* Only keep top Add button; no duplicate below */}
    </div>
  );

  const renderLoadingState = () => (
    <div className="materials-loading">
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
            <h1 className="material-title">Recyclable Materials Management</h1>
            <p className="material-description">
              Manage recyclable materials and their maximum reuse counts for the platform
            </p>
          </div>
        </div>
        <button className="add-material-btn" onClick={handleAddMaterial}>
          {renderAddIcon()}
          Add Material
        </button>
      {/* Removed bottom Add Material button in empty state */}
      </div>

  {/* Material Name Filter (Dropdown) */}
  <div style={{ marginBottom: '20px', display: 'flex', gap: '12px', alignItems: 'center' }}>
    <span style={{ fontWeight: '600', color: '#374151' }}>Filter by material name:</span>
    <select
      value={filters.materialName}
      onChange={(e) => handleMaterialNameFilterChange(e.target.value)}
      style={{
        padding: '8px 12px',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        backgroundColor: 'white',
        fontSize: '14px',
        minWidth: '250px',
        maxWidth: '400px'
      }}
    >
      <option value="">All Materials</option>
      {materials.map((m) => (
        <option key={m._id} value={m.materialName}>{m.materialName}</option>
      ))}
    </select>
    {filters.materialName && (
      <button 
        onClick={handleResetFilters}
        style={{
          padding: '8px 12px',
          backgroundColor: '#f3f4f6',
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          fontSize: '14px',
          cursor: 'pointer'
        }}
      >
        Clear
      </button>
    )}
  </div>

      {/* Materials Sections */}
      {isLoading ? (
        renderLoadingState()
      ) : materials.length === 0 ? (
        renderEmptyState()
      ) : (
        <>
          {/* Approved (Admin/Active) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h2 style={{ margin: 0 }}>Active Materials</h2>
            <span style={{ color: '#6b7280' }}>{materials.filter(m => m.status === 'approved').length}</span>
          </div>
          <div className="materials-grid" style={{ marginBottom: 32 }}>
            {materials.filter(m => m.status === 'approved').map((material) => (
              <MaterialCard 
                key={material._id} 
                material={material}
                onEdit={handleEditMaterial}
              />
            ))}
          </div>

          {/* Pending (Business submissions) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h2 style={{ margin: 0 }}>Pending Review</h2>
            <span style={{ color: '#6b7280' }}>{materials.filter(m => m.status === 'pending').length}</span>
          </div>
          <div className="materials-grid">
            {materials.filter(m => m.status === 'pending').map((material) => (
              <MaterialCard 
                key={material._id} 
                material={material}
                onEdit={handleEditMaterial}
              />
            ))}
          </div>
        </>
      )}

      {/* Material Modal */}
      <MaterialModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        material={editingMaterial}
        onSubmit={(materialData) => {
          if (editingMaterial) {
            dispatch(updateMaterialApi({
              materialId: editingMaterial._id,
              materialData
            }));
          } else {
            dispatch(createMaterialApi(materialData));
          }
          handleCloseModal();
        }}
      />
    </div>
  );
};

export default Material;



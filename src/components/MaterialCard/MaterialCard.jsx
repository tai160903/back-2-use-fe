import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { 
  deleteMaterialApi, 
  reviewMaterialApi 
} from '../../store/slices/adminSlice';
import './MaterialCard.css';

const MaterialCard = ({ material, onEdit }) => {
  const dispatch = useDispatch();
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(material);
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${material.materialName}"?`)) {
      dispatch(deleteMaterialApi(material._id));
    }
  };

  const handleApprove = () => {
    dispatch(reviewMaterialApi({
      materialId: material._id,
      reviewData: {
        status: 'approved'
      }
    }));
  };

  const handleReject = () => {
    setRejectReason('');
    setIsRejectOpen(true);
  };

  const submitReject = () => {
    const reason = rejectReason.trim();
    if (!reason) {
      alert('Please enter a rejection reason.');
      return;
    }
    dispatch(reviewMaterialApi({
      materialId: material._id,
      reviewData: {
        status: 'rejected',
        rejectReason: reason
      }
    }));
    setIsRejectOpen(false);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'approved':
        return 'status-approved';
      case 'rejected':
        return 'status-rejected';
      case 'pending':
      default:
        return 'status-pending';
    }
  };

  const getRecycleIcon = () => {
    return (
      <svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="material-card-icon"
      >
        <path 
          d="M9 3V4H4V6H5V19C5 20.1 5.9 21 7 21H17C18.1 21 19 20.1 19 19V6H20V4H15V3H9ZM7 6H17V19H7V6ZM9 8V17H11V8H9ZM13 8V17H15V8H13Z" 
          fill="currentColor"
        />
      </svg>
    );
  };

  return (
    <div className="material-card">
      <div className="material-card-header">
        <div className="material-card-info">
          {getRecycleIcon()}
          <div>
            <h3 className="material-card-title">{material.materialName}</h3>
            <p className="material-card-subtitle">Recyclable Material</p>
          </div>
        </div>
        
        <div className="material-card-actions">
          {material.status === 'pending' && (
            <>
              <button 
                className="action-btn approve-btn" 
                onClick={handleApprove}
                title="Approve"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/>
                </svg>
              </button>
              <button 
                className="action-btn reject-btn" 
                onClick={handleReject}
                title="Reject"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" fill="currentColor"/>
                </svg>
              </button>
            </>
          )}
          
          <button 
            className="action-btn edit-btn" 
            onClick={handleEdit}
            title="Edit"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
            </svg>
          </button>
          
          <button 
            className="action-btn delete-btn" 
            onClick={handleDelete}
            title="Delete"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="material-card-details">
        <div className="material-detail-item">
          <span className="material-detail-label">Maximum Reuse:</span>
          <span className="material-detail-value">
            <span className="maximum-reuse-badge">
              {material.maximumReuse} times
            </span>
          </span>
        </div>
        
        <div className="material-detail-item">
          <span className="material-detail-label">Created:</span>
          <span className="material-detail-value created-date">
            {formatDate(material.createdAt)}
          </span>
        </div>
        
        <div className="material-detail-item">
          <span className="material-detail-label">Status:</span>
          <span className={`status-badge ${getStatusBadgeClass(material.status)}`}>
            {material.status}
          </span>
        </div>
        
        {material.description && (
          <div className="material-detail-item">
            <span className="material-detail-label">Description:</span>
            <span className="material-detail-value" style={{ fontSize: '13px', color: '#6b7280' }}>
              {material.description}
            </span>
          </div>
        )}
        
        {material.status === 'rejected' && material.rejectReason && (
          <div className="material-detail-item">
            <span className="material-detail-label">Rejection Reason:</span>
            <span className="material-detail-value" style={{ fontSize: '13px', color: '#dc2626' }}>
              {material.rejectReason}
            </span>
          </div>
        )}
      </div>
      {isRejectOpen && (
        <div className="mc-modal-overlay" onClick={() => setIsRejectOpen(false)}>
          <div className="mc-modal" onClick={(e) => e.stopPropagation()}>
            <div className="mc-modal-header">
              <h3 className="mc-modal-title">Reject Material</h3>
              <button className="mc-modal-close" onClick={() => setIsRejectOpen(false)}>×</button>
            </div>
            <div className="mc-modal-body">
              <label className="mc-label">Reason (required)</label>
              <textarea
                className="mc-textarea"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter the reason for rejection..."
                rows={4}
              />
            </div>
            <div className="mc-modal-actions">
              <button className="mc-btn" onClick={() => setIsRejectOpen(false)}>Cancel</button>
              <button className="mc-btn-danger" onClick={submitReject}>Reject</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialCard;

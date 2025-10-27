import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { 
  deleteMaterialApi, 
  reviewMaterialApi 
} from '../../store/slices/adminSlice';
import { 
  FaRegEdit, 
  FaCheck, 
  FaTimes, 
  FaRecycle 
} from 'react-icons/fa';
import { MdDeleteOutline } from 'react-icons/md';
import './MaterialCard.css';
import { CiEdit } from "react-icons/ci";

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
    return <FaRecycle className="material-card-icon" />;
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
                <FaCheck size={16} />
              </button>
              <button 
                className="action-btn reject-btn" 
                onClick={handleReject}
                title="Reject"
              >
                <FaTimes size={16} />
              </button>
            </>
          )}
          
          <button 
            className="action-btn edit-btn" 
            onClick={handleEdit}
            title="Edit"
          >
            <CiEdit size={16} />
          </button>
          
          <button 
            className="action-btn delete-btn" 
            onClick={handleDelete}
            title="Delete"
          >
            <MdDeleteOutline size={16} />
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

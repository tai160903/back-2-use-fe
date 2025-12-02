import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
// Note: deleteVoucherApi and reviewVoucherApi have been removed from voucherSlice
import { 
  FaRegEdit, 
  FaCheck, 
  FaTimes, 
  FaGift
} from 'react-icons/fa';
import { MdDeleteOutline } from 'react-icons/md';
import { CiEdit } from "react-icons/ci";
import './VoucherCard.css';
import {
  Button,
  Box,
  Typography,
  IconButton,
  Alert,
  Paper,
  Divider,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Close as CloseIcon,
  CardGiftcard as VoucherIcon,
} from '@mui/icons-material';
import DeleteConfirmModal from '../DeleteConfirmModal/DeleteConfirmModal';

const VoucherCard = ({ voucher, onEdit, onViewDetail }) => {
  const dispatch = useDispatch();
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(voucher);
    }
  };

  const handleViewDetail = (e) => {
    e.stopPropagation();
    if (onViewDetail) {
      onViewDetail(voucher);
    }
  };

  const handleCardClick = () => {
    if (onViewDetail) {
      onViewDetail(voucher);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setIsDeleteOpen(true);
  };

  const handleCloseDelete = () => {
    setIsDeleteOpen(false);
  };

  const handleConfirmDelete = () => {
    // Note: deleteVoucherApi has been removed
    console.warn('Delete functionality has been removed');
    setIsDeleteOpen(false);
  };

  const handleApprove = (e) => {
    e.stopPropagation();
    // Note: reviewVoucherApi has been removed
    console.warn('Approve functionality has been removed');
  };

  const handleReject = (e) => {
    e.stopPropagation();
    setRejectReason('');
    setIsRejectOpen(true);
  };

  const submitReject = () => {
    const reason = rejectReason.trim();
    if (!reason) {
      alert('Please enter a rejection reason.');
      return;
    }
    // Note: reviewVoucherApi has been removed
    console.warn('Reject functionality has been removed');
    setIsRejectOpen(false);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active':
        return 'status-active';
      case 'expired':
        return 'status-expired';
      case 'pending':
      default:
        return 'status-pending';
    }
  };

  const getGiftIcon = () => {
    return <FaGift className="voucher-card-icon" />;
  };

  return (
    <div className="voucher-card" onClick={handleCardClick} style={{ cursor: onViewDetail ? 'pointer' : 'default' }}>
      <div className="voucher-card-header">
        <div className="voucher-card-info">
          {getGiftIcon()}
          <div>
            <h3 className="voucher-card-title">{voucher.name}</h3>
            <p className="voucher-card-subtitle">Discount Voucher</p>
          </div>
        </div>

        {/* Action buttons aligned with title */}
        <div className="voucher-card-actions-top" onClick={(e) => e.stopPropagation()}>
          {/* Row 1: Edit & Delete */}
          <div className="voucher-card-actions-row">
            <button 
              className="action-btn edit-btn" 
              onClick={handleEdit}
              title="Edit"
            >
              <CiEdit size={18} />
            </button>
            
            <button 
              className="action-btn delete-btn" 
              onClick={handleDelete}
              title="Delete"
            >
              <MdDeleteOutline size={18} />
            </button>
          </div>

          {/* Row 2: Approve & Reject (only for pending) */}
          {voucher.status === 'pending' && (
            <div className="voucher-card-actions-row">
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
            </div>
          )}
        </div>
      </div>

      <div className="voucher-card-details">
        <div className="voucher-detail-item">
          <span className="voucher-detail-label">Discount:</span>
          <span className="voucher-detail-value">
            <span className="discount-badge">
              {voucher.discountPercent || voucher.discount || 0}%
            </span>
          </span>
        </div>
        
        <div className="voucher-detail-item">
          <span className="voucher-detail-label">Base Code:</span>
          <span className="voucher-detail-value">
            {voucher.baseCode}
          </span>
        </div>

        {onViewDetail && (
          <div className="voucher-detail-item" style={{ 
            marginTop: '8px', 
            paddingTop: '8px', 
            borderTop: '1px solid #e5e7eb',
            flexShrink: 0
          }}>
            <button 
              className="view-detail-btn"
              onClick={handleViewDetail}
              onMouseDown={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                padding: '6px 10px',
                backgroundColor: '#22c55e',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '12px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#16a34a';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#22c55e';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Xem chi tiết
            </button>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {isRejectOpen && (
        <div className="vc-modal-overlay" onClick={() => setIsRejectOpen(false)}>
          <div className="vc-modal" onClick={(e) => e.stopPropagation()}>
            <div className="vc-modal-header">
              <h3 className="vc-modal-title">Reject Voucher</h3>
              <button className="vc-modal-close" onClick={() => setIsRejectOpen(false)}>×</button>
            </div>
            <div className="vc-modal-body">
              <label className="vc-label">Reason (required)</label>
              <textarea
                className="vc-textarea"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter the reason for rejection..."
                rows={4}
              />
            </div>
            <div className="vc-modal-actions">
              <button className="vc-btn" onClick={() => setIsRejectOpen(false)}>Cancel</button>
              <button className="vc-btn-danger" onClick={submitReject}>Reject</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal - unified style */}
      <DeleteConfirmModal
        open={isDeleteOpen}
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
        itemName={voucher.name}
        itemType="voucher"
      />
    </div>
  );
};

export default VoucherCard;

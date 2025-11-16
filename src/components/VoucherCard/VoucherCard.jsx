import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { 
  deleteVoucherApi,
  reviewVoucherApi
} from '../../store/slices/adminSlice';
import { 
  FaRegEdit, 
  FaCheck, 
  FaTimes, 
  FaGift,
  FaPercentage,
  FaCoins
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

const VoucherCard = ({ voucher, onEdit }) => {
  const dispatch = useDispatch();
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
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
      onEdit(voucher);
    }
  };

  const handleDelete = () => {
    setIsDeleteOpen(true);
  };

  const handleCloseDelete = () => {
    setIsDeleteOpen(false);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteVoucherApi(voucher._id));
    setIsDeleteOpen(false);
  };

  const handleApprove = () => {
    dispatch(reviewVoucherApi({
      voucherId: voucher._id,
      reviewData: {
        status: 'active'
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
    dispatch(reviewVoucherApi({
      voucherId: voucher._id,
      reviewData: {
        status: 'expired',
        rejectReason: reason
      }
    }));
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
    <div className="voucher-card">
      <div className="voucher-card-header">
        <div className="voucher-card-info">
          {getGiftIcon()}
          <div>
            <h3 className="voucher-card-title">{voucher.name}</h3>
            <p className="voucher-card-subtitle">Discount Voucher</p>
          </div>
        </div>

        {/* Action buttons aligned with title */}
        <div className="voucher-card-actions-top">
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
          <span className="voucher-detail-label">Points Cost:</span>
          <span className="voucher-detail-value points-cost">
            <FaCoins size={14} style={{ marginRight: '4px', color: '#f59e0b' }} />
            {voucher.rewardPointCost} pts
          </span>
        </div>
        
        <div className="voucher-detail-item">
          <span className="voucher-detail-label">Max Usage:</span>
          <span className="voucher-detail-value">
            {voucher.maxUsage}
          </span>
        </div>
        
        <div className="voucher-detail-item">
          <span className="voucher-detail-label">Base Code:</span>
          <span className="voucher-detail-value">
            {voucher.baseCode}
          </span>
        </div>
        
        <div className="voucher-detail-item">
          <span className="voucher-detail-label">Expiry Date:</span>
          <span className="voucher-detail-value expiry-date">
            {formatDate(voucher.endDate)}
          </span>
        </div>
        
        <div className="voucher-detail-item">
          <span className="voucher-detail-label">Status:</span>
          <span className={`status-badge ${getStatusBadgeClass(voucher.status)}`}>
            {voucher.status}
          </span>
        </div>
        
        {voucher.description && (
          <div className="voucher-detail-item">
            <span className="voucher-detail-label">Description:</span>
            <span className="voucher-detail-value" style={{ fontSize: '13px', color: '#6b7280' }}>
              {voucher.description}
            </span>
          </div>
        )}
        
        {voucher.status === 'expired' && voucher.rejectReason && (
          <div className="voucher-detail-item">
            <span className="voucher-detail-label">Rejection Reason:</span>
            <span className="voucher-detail-value" style={{ fontSize: '13px', color: '#dc2626' }}>
              {voucher.rejectReason}
            </span>
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

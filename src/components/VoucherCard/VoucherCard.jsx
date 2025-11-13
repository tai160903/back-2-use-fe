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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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

      {/* Delete Confirmation Modal */}
      <Dialog 
        open={isDeleteOpen} 
        onClose={handleCloseDelete} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(211, 47, 47, 0.15)'
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
            color: 'white',
            py: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <DeleteIcon sx={{ fontSize: 32 }} />
            <Box>
              <Typography variant="h5" component="div" fontWeight="bold">
                Delete Voucher
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                This action cannot be undone
              </Typography>
            </Box>
          </Box>
          <IconButton 
            onClick={handleCloseDelete}
            sx={{ 
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 4, pb: 3 }}>
          <Box>
            <Alert 
              severity="warning" 
              sx={{ 
                mb: 3,
                borderRadius: 2,
                '& .MuiAlert-message': {
                  width: '100%'
                }
              }}
            >
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                ⚠️ Warning
              </Typography>
              <Typography variant="body2">
                This action is permanent and cannot be undone. The voucher will be completely removed from the system.
              </Typography>
            </Alert>

            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                backgroundColor: 'rgba(244, 67, 54, 0.05)',
                borderRadius: 2,
                border: '1px solid rgba(244, 67, 54, 0.2)'
              }}
            >
              <Typography variant="body1" gutterBottom sx={{ fontWeight: 600, color: '#d32f2f' }}>
                Are you sure you want to delete this voucher?
              </Typography>
              
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <VoucherIcon sx={{ color: '#f44336', fontSize: 20 }} />
                <Typography variant="body2" color="text.secondary">
                  Voucher Name:
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ mt: 1, color: '#1B5E20', fontWeight: 'bold' }}>
                {voucher.name}
              </Typography>
            </Paper>
          </Box>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ px: 3, py: 2.5, gap: 1.5 }}>
          <Button 
            onClick={handleCloseDelete}
            variant="outlined"
            sx={{
              color: '#666',
              borderColor: '#ddd',
              px: 3,
              py: 1,
              '&:hover': {
                borderColor: '#999',
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            variant="contained" 
            color="error"
            startIcon={<DeleteIcon />}
            sx={{
              px: 3,
              py: 1,
              boxShadow: '0 4px 12px rgba(244, 67, 54, 0.3)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(244, 67, 54, 0.4)',
              }
            }}
          >
            Delete Voucher
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default VoucherCard;

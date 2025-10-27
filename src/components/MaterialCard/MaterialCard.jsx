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
  Category as CategoryIcon,
} from '@mui/icons-material';

const MaterialCard = ({ material, onEdit }) => {
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
      onEdit(material);
    }
  };

  const handleDelete = () => {
    setIsDeleteOpen(true);
  };

  const handleCloseDelete = () => {
    setIsDeleteOpen(false);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteMaterialApi(material._id));
    setIsDeleteOpen(false);
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

        {/* Action buttons aligned with title */}
        <div className="material-card-actions-top">
          {/* Row 1: Edit & Delete */}
          <div className="material-card-actions-row">
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
          {material.status === 'pending' && (
            <div className="material-card-actions-row">
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
      {/* Reject Modal */}
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
                Delete Material
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
                This action is permanent and cannot be undone. The material will be completely removed from the system.
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
                Are you sure you want to delete this material?
              </Typography>
              
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <CategoryIcon sx={{ color: '#f44336', fontSize: 20 }} />
                <Typography variant="body2" color="text.secondary">
                  Material Name:
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ mt: 1, color: '#1B5E20', fontWeight: 'bold' }}>
                {material.materialName}
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
            Delete Material
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MaterialCard;

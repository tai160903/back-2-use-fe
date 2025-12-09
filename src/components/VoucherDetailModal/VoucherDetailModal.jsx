import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Divider,
  Grid,
  Chip,
} from '@mui/material';
import {
  Close as CloseIcon,
  CardGiftcard as VoucherIcon,
} from '@mui/icons-material';
import { FaGift, FaCoins, FaCalendarAlt, FaCode, FaInfoCircle } from 'react-icons/fa';
import './VoucherDetailModal.css';

const VoucherDetailModal = ({ isOpen, onClose, voucher, isLoading }) => {

  if (!isOpen) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
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

  const getVoucherTypeLabel = (type) => {
    switch (type) {
      case 'system':
        return 'System Voucher';
      case 'business':
        return 'Business Voucher';
      case 'leaderboard':
        return 'Leaderboard Voucher';
      default:
        return 'Voucher';
    }
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <Typography>Loading voucher information...</Typography>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  if (!voucher) {
    return null;
  }

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
            boxShadow: '0 12px 40px rgba(22, 78, 49, 0.2)',
          overflow: 'hidden',
          background: 'linear-gradient(to bottom, #ffffff 0%, #f9fdf9 100%)',
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #164e31 0%, #0f3d20 100%)',
          color: 'white',
          py: 2,
          px: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <VoucherIcon sx={{ fontSize: 28 }} />
          <Box>
            <Typography variant="h6" component="div" fontWeight="bold">
              Voucher Details
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9, mt: 0.25, display: 'block' }}>
              {voucher.name}
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2, pb: 1.5, px: 2.5, maxHeight: 'calc(90vh - 200px)', overflowY: 'auto' }}>
        <Grid container spacing={2.5} sx={{ '& .MuiGrid-item': { display: 'flex', alignItems: 'stretch' } }}>
          {/* Thông tin cơ bản */}
          <Grid item xs={12}>
            <Box className="voucher-detail-section">
              <Typography variant="h6" className="voucher-detail-section-title">
                <FaInfoCircle style={{ marginRight: '8px' }} />
                Basic Information
              </Typography>
              <Divider sx={{ my: 1.5 }} />
              <Grid container spacing={2.5}>
                {/* Row 1: Voucher Name and Voucher Type */}
                <Grid item xs={12} md={6}>
                  <Box className="voucher-detail-item">
                    <Typography className="voucher-detail-label">Voucher Name</Typography>
                    <Typography className="voucher-detail-value" sx={{ fontWeight: 700, fontSize: '16px', color: '#164c34' }}>
                      {voucher.name || 'N/A'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box className="voucher-detail-item">
                    <Typography className="voucher-detail-label">Voucher Type</Typography>
                    <Chip
                      label={getVoucherTypeLabel(voucher.voucherType)}
                      color="primary"
                      size="small"
                      sx={{ 
                        mt: 0.5,
                        fontWeight: 600,
                        backgroundColor: '#3b82f6',
                        '&:hover': {
                          backgroundColor: '#2563eb',
                        }
                      }}
                    />
                  </Box>
                </Grid>
                
                {/* Row 2: Description - Full width */}
                <Grid item xs={12}>
                  <Box sx={{ 
                    p: 2, 
                    backgroundColor: '#f9fafb', 
                    borderRadius: 2, 
                    border: '1px solid #e5e7eb',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.75
                  }}>
                    <Typography className="voucher-detail-label" sx={{ mb: 0 }}>
                      Description
                    </Typography>
                    <Typography sx={{ 
                      fontSize: '0.9375rem', 
                      color: '#374151', 
                      fontWeight: 400,
                      lineHeight: 1.6,
                      wordBreak: 'break-word'
                    }}>
                      {voucher.description || 'No description'}
                    </Typography>
                  </Box>
                </Grid>
                
                {/* Row 4: Base Code - Full width */}
                <Grid item xs={12}>
                  <Box className="voucher-detail-item">
                    <Typography className="voucher-detail-label">Base Code</Typography>
                    <Typography className="voucher-detail-value code-value">
                      <FaCode style={{ marginRight: '6px', fontSize: '14px' }} />
                      {voucher.baseCode || 'N/A'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* Discount Information and Time Information - 2 columns */}
          <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
            <Box className="voucher-detail-section" sx={{ width: '100%', height: '100%' }}>
              <Typography variant="h6" className="voucher-detail-section-title">
                <FaGift style={{ marginRight: '8px' }} />
                Discount Information
              </Typography>
              <Divider sx={{ my: 1.5 }} />
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box className="voucher-detail-item">
                    <Typography className="voucher-detail-label">Discount Percentage</Typography>
                    <Typography className="voucher-detail-value discount-value">
                      {voucher.discountPercent || voucher.discount || 0}%
                    </Typography>
                  </Box>
                </Grid>
                {voucher.rewardPointCost && (
                  <Grid item xs={12}>
                    <Box className="voucher-detail-item">
                      <Typography className="voucher-detail-label">Reward Point Cost</Typography>
                      <Typography className="voucher-detail-value points-value">
                        <FaCoins style={{ marginRight: '6px', fontSize: '14px' }} />
                        {voucher.rewardPointCost} points
                      </Typography>
                    </Box>
                  </Grid>
                )}
                {voucher.maxUsage && (
                  <Grid item xs={12}>
                    <Box className="voucher-detail-item">
                      <Typography className="voucher-detail-label">Max Usage</Typography>
                      <Typography className="voucher-detail-value">
                        {voucher.maxUsage} times
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Grid>

          {/* Time Information */}
          <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
            <Box className="voucher-detail-section" sx={{ width: '100%', height: '100%' }}>
              <Typography variant="h6" className="voucher-detail-section-title">
                <FaCalendarAlt style={{ marginRight: '8px' }} />
                Time Information
              </Typography>
              <Divider sx={{ my: 1.5 }} />
              <Grid container spacing={2}>
                {voucher.startDate && (
                  <Grid item xs={12}>
                    <Box className="voucher-detail-item">
                      <Typography className="voucher-detail-label">Start Date</Typography>
                      <Typography className="voucher-detail-value">
                        {formatDate(voucher.startDate)}
                      </Typography>
                    </Box>
                  </Grid>
                )}
                {voucher.endDate && (
                  <Grid item xs={12}>
                    <Box className="voucher-detail-item">
                      <Typography className="voucher-detail-label">End Date</Typography>
                      <Typography className="voucher-detail-value">
                        {formatDate(voucher.endDate)}
                      </Typography>
                    </Box>
                  </Grid>
                )}
                {voucher.createdAt && (
                  <Grid item xs={12}>
                    <Box className="voucher-detail-item">
                      <Typography className="voucher-detail-label">Created At</Typography>
                      <Typography className="voucher-detail-value">
                        {formatDate(voucher.createdAt)}
                      </Typography>
                    </Box>
                  </Grid>
                )}
                {voucher.updatedAt && (
                  <Grid item xs={12}>
                    <Box className="voucher-detail-item">
                      <Typography className="voucher-detail-label">Updated At</Typography>
                      <Typography className="voucher-detail-value">
                        {formatDate(voucher.updatedAt)}
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Grid>

          {/* Thông tin bổ sung */}
          {voucher.ecoRewardPolicyId && (
            <Grid item xs={12}>
              <Box className="voucher-detail-section">
                <Typography variant="h6" className="voucher-detail-section-title">
                  Additional Information
                </Typography>
                <Divider sx={{ my: 1.5 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box className="voucher-detail-item">
                      <Typography className="voucher-detail-label">Eco Reward Policy</Typography>
                      {typeof voucher.ecoRewardPolicyId === 'object' && voucher.ecoRewardPolicyId !== null ? (
                        <Box sx={{ mt: 1 }}>
                          <Typography className="voucher-detail-value" sx={{ fontWeight: 600, mb: 0.5 }}>
                            {voucher.ecoRewardPolicyId.label || 'N/A'}
                          </Typography>
                          {voucher.ecoRewardPolicyId.description && (
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                              {voucher.ecoRewardPolicyId.description}
                            </Typography>
                          )}
                          <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              <strong>ID:</strong> {voucher.ecoRewardPolicyId._id || 'N/A'}
                            </Typography>
                            {voucher.ecoRewardPolicyId.threshold !== undefined && (
                              <Typography variant="caption" color="text.secondary">
                                <strong>Threshold:</strong> {voucher.ecoRewardPolicyId.threshold}
                              </Typography>
                            )}
                            <Chip
                              label={voucher.ecoRewardPolicyId.isActive ? 'Active' : 'Inactive'}
                              size="small"
                              color={voucher.ecoRewardPolicyId.isActive ? 'success' : 'default'}
                            />
                          </Box>
                        </Box>
                      ) : (
                        <Typography className="voucher-detail-value">
                          {voucher.ecoRewardPolicyId}
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          )}

          {/* Lý do từ chối */}
          {voucher.status === 'expired' && voucher.rejectReason && (
            <Grid item xs={12}>
              <Box className="voucher-detail-section reject-section">
                <Typography variant="h6" className="voucher-detail-section-title">
                  Rejection Reason
                </Typography>
                <Divider sx={{ my: 1.5 }} />
                <Box className="voucher-detail-item">
                  <Typography className="voucher-detail-value reject-reason">
                    {voucher.rejectReason}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2, gap: 2, backgroundColor: 'rgba(34, 197, 94, 0.02)' }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            backgroundColor: '#164e31',
            px: 3,
            py: 1,
            fontSize: '0.9375rem',
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(22, 78, 49, 0.35)',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: '#0f3d20',
              boxShadow: '0 6px 16px rgba(22, 78, 49, 0.45)',
              transform: 'translateY(-2px)',
            },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VoucherDetailModal;


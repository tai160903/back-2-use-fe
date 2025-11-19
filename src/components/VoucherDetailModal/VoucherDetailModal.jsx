import React from 'react';
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
            <Typography>Đang tải thông tin voucher...</Typography>
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
          boxShadow: '0 12px 40px rgba(34, 197, 94, 0.2)',
          overflow: 'hidden',
          background: 'linear-gradient(to bottom, #ffffff 0%, #f9fdf9 100%)',
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
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
              Chi tiết Voucher
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

      <DialogContent sx={{ pt: 3, pb: 2, px: 3, maxHeight: 'calc(90vh - 200px)', overflowY: 'auto' }}>
        <Grid container spacing={2.5}>
          {/* Thông tin cơ bản */}
          <Grid item xs={12}>
            <Box className="voucher-detail-section">
              <Typography variant="h6" className="voucher-detail-section-title">
                <FaInfoCircle style={{ marginRight: '8px' }} />
                Thông tin cơ bản
              </Typography>
              <Divider sx={{ my: 1.5 }} />
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box className="voucher-detail-item">
                    <Typography className="voucher-detail-label">Tên Voucher</Typography>
                    <Typography className="voucher-detail-value" sx={{ fontWeight: 700, fontSize: '16px' }}>
                      {voucher.name || 'N/A'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box className="voucher-detail-item">
                    <Typography className="voucher-detail-label">Loại Voucher</Typography>
                    <Chip
                      label={getVoucherTypeLabel(voucher.voucherType)}
                      color="primary"
                      size="small"
                      sx={{ mt: 0.5 }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box className="voucher-detail-item">
                    <Typography className="voucher-detail-label">Trạng thái</Typography>
                    <Chip
                      label={voucher.status || 'N/A'}
                      className={`status-chip ${getStatusBadgeClass(voucher.status)}`}
                      size="small"
                      sx={{ mt: 0.5 }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box className="voucher-detail-item" sx={{ flexDirection: 'column', alignItems: 'flex-start', gap: 0.5 }}>
                    <Typography className="voucher-detail-label">Mô tả</Typography>
                    <Typography className="voucher-detail-value" sx={{ textAlign: 'left', width: '100%', fontWeight: 400 }}>
                      {voucher.description || 'Không có mô tả'}
                    </Typography>
                  </Box>
                </Grid>
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

          {/* Thông tin giảm giá và Thông tin thời gian - 2 cột */}
          <Grid item xs={12} md={6}>
            <Box className="voucher-detail-section">
              <Typography variant="h6" className="voucher-detail-section-title">
                <FaGift style={{ marginRight: '8px' }} />
                Thông tin giảm giá
              </Typography>
              <Divider sx={{ my: 1.5 }} />
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box className="voucher-detail-item">
                    <Typography className="voucher-detail-label">Phần trăm giảm giá</Typography>
                    <Typography className="voucher-detail-value discount-value">
                      {voucher.discountPercent || voucher.discount || 0}%
                    </Typography>
                  </Box>
                </Grid>
                {voucher.rewardPointCost && (
                  <Grid item xs={12}>
                    <Box className="voucher-detail-item">
                      <Typography className="voucher-detail-label">Chi phí điểm thưởng</Typography>
                      <Typography className="voucher-detail-value points-value">
                        <FaCoins style={{ marginRight: '6px', fontSize: '14px' }} />
                        {voucher.rewardPointCost} điểm
                      </Typography>
                    </Box>
                  </Grid>
                )}
                {voucher.maxUsage && (
                  <Grid item xs={12}>
                    <Box className="voucher-detail-item">
                      <Typography className="voucher-detail-label">Số lần sử dụng tối đa</Typography>
                      <Typography className="voucher-detail-value">
                        {voucher.maxUsage} lần
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Grid>

          {/* Thông tin thời gian */}
          <Grid item xs={12} md={6}>
            <Box className="voucher-detail-section">
              <Typography variant="h6" className="voucher-detail-section-title">
                <FaCalendarAlt style={{ marginRight: '8px' }} />
                Thông tin thời gian
              </Typography>
              <Divider sx={{ my: 1.5 }} />
              <Grid container spacing={2}>
                {voucher.startDate && (
                  <Grid item xs={12}>
                    <Box className="voucher-detail-item">
                      <Typography className="voucher-detail-label">Ngày bắt đầu</Typography>
                      <Typography className="voucher-detail-value">
                        {formatDate(voucher.startDate)}
                      </Typography>
                    </Box>
                  </Grid>
                )}
                {voucher.endDate && (
                  <Grid item xs={12}>
                    <Box className="voucher-detail-item">
                      <Typography className="voucher-detail-label">Ngày kết thúc</Typography>
                      <Typography className="voucher-detail-value">
                        {formatDate(voucher.endDate)}
                      </Typography>
                    </Box>
                  </Grid>
                )}
                {voucher.createdAt && (
                  <Grid item xs={12}>
                    <Box className="voucher-detail-item">
                      <Typography className="voucher-detail-label">Ngày tạo</Typography>
                      <Typography className="voucher-detail-value">
                        {formatDate(voucher.createdAt)}
                      </Typography>
                    </Box>
                  </Grid>
                )}
                {voucher.updatedAt && (
                  <Grid item xs={12}>
                    <Box className="voucher-detail-item">
                      <Typography className="voucher-detail-label">Ngày cập nhật</Typography>
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
                  Thông tin bổ sung
                </Typography>
                <Divider sx={{ my: 1.5 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box className="voucher-detail-item">
                      <Typography className="voucher-detail-label">Eco Reward Policy ID</Typography>
                      <Typography className="voucher-detail-value">
                        {voucher.ecoRewardPolicyId}
                      </Typography>
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
                  Lý do từ chối
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
            backgroundColor: '#22c55e',
            px: 3,
            py: 1,
            fontSize: '0.9375rem',
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(34, 197, 94, 0.35)',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: '#16a34a',
              boxShadow: '0 6px 16px rgba(34, 197, 94, 0.45)',
              transform: 'translateY(-2px)',
            },
          }}
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VoucherDetailModal;


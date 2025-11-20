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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  Close as CloseIcon,
  CardGiftcard as VoucherIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { FaGift, FaCoins, FaCalendarAlt, FaCode, FaInfoCircle, FaStore } from 'react-icons/fa';
import {
  getBusinessVouchersByVoucherIdApi,
  getBusinessVoucherCodesApi,
  updateBusinessVoucherIsDisabledApi,
} from '../../store/slices/voucherSlice';
import './VoucherDetailModal.css';

const VoucherDetailModal = ({ isOpen, onClose, voucher, isLoading }) => {
  const dispatch = useDispatch();
  const { adminBusinessVouchers: businessVouchers, adminBusinessVoucherCodes: businessVoucherCodes, isLoading: adminLoading } = useSelector(state => state.vouchers);
  const [expandedBusinessVoucher, setExpandedBusinessVoucher] = useState(null);
  const [codesLoading, setCodesLoading] = useState({});

  useEffect(() => {
    if (isOpen && voucher && voucher.voucherType === 'business') {
      const voucherId = voucher._id || voucher.id;
      if (voucherId) {
        dispatch(getBusinessVouchersByVoucherIdApi({ voucherId, page: 1, limit: 100 }));
      }
    } else if (!isOpen) {
      // Reset state when modal closes
      setExpandedBusinessVoucher(null);
      setCodesLoading({});
    }
  }, [isOpen, voucher, dispatch]);

  const handleToggleBusinessVoucher = (businessVoucherId) => {
    if (expandedBusinessVoucher === businessVoucherId) {
      setExpandedBusinessVoucher(null);
    } else {
      setExpandedBusinessVoucher(businessVoucherId);
      // Load codes when expanding
      setCodesLoading({ ...codesLoading, [businessVoucherId]: true });
      dispatch(getBusinessVoucherCodesApi({ businessVoucherId, page: 1, limit: 100 }))
        .finally(() => {
          setCodesLoading({ ...codesLoading, [businessVoucherId]: false });
        });
    }
  };

  const handleToggleIsDisabled = (businessVoucherId, currentIsDisabled) => {
    dispatch(updateBusinessVoucherIsDisabledApi({
      voucherId: businessVoucherId,
      isDisabled: !currentIsDisabled,
    })).then(() => {
      // Refresh business vouchers list
      const voucherId = voucher._id || voucher.id;
      if (voucherId) {
        dispatch(getBusinessVouchersByVoucherIdApi({ voucherId, page: 1, limit: 100 })).then(() => {
          // Reload codes if this business voucher is expanded
          if (expandedBusinessVoucher === businessVoucherId) {
            setCodesLoading({ ...codesLoading, [businessVoucherId]: true });
            dispatch(getBusinessVoucherCodesApi({ businessVoucherId, page: 1, limit: 100 }))
              .finally(() => {
                setCodesLoading({ ...codesLoading, [businessVoucherId]: false });
              });
          }
        });
      }
    });
  };

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

          {/* Business Vouchers List - Only for business type vouchers */}
          {voucher.voucherType === 'business' && (
            <Grid item xs={12}>
              <Box className="voucher-detail-section">
                <Typography variant="h6" className="voucher-detail-section-title">
                  <FaStore style={{ marginRight: '8px' }} />
                  Business Vouchers ({businessVouchers?.length || 0})
                </Typography>
                <Divider sx={{ my: 1.5 }} />
                {adminLoading && businessVouchers.length === 0 ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                    <CircularProgress size={24} />
                    <Typography sx={{ ml: 2 }}>Đang tải business vouchers...</Typography>
                  </Box>
                ) : businessVouchers && businessVouchers.length > 0 ? (
                  <Box sx={{ mt: 2 }}>
                    {businessVouchers.map((businessVoucher) => {
                      const businessVoucherId = businessVoucher._id || businessVoucher.id;
                      const isExpanded = expandedBusinessVoucher === businessVoucherId;
                      const codes = isExpanded ? businessVoucherCodes : [];
                      const loadingCodes = codesLoading[businessVoucherId];

                      return (
                        <Accordion
                          key={businessVoucherId}
                          expanded={isExpanded}
                          onChange={() => handleToggleBusinessVoucher(businessVoucherId)}
                          sx={{
                            mb: 1.5,
                            '&:before': { display: 'none' },
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            borderRadius: '8px !important',
                            overflow: 'hidden',
                          }}
                        >
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            sx={{
                              backgroundColor: isExpanded ? 'rgba(34, 197, 94, 0.05)' : 'transparent',
                              '&:hover': {
                                backgroundColor: 'rgba(34, 197, 94, 0.08)',
                              },
                            }}
                          >
                            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 2 }}>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle1" fontWeight={600}>
                                  {businessVoucher.businessId?.name || businessVoucher.businessName || 'Business Voucher'}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                  ID: {businessVoucherId}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography variant="body2" color="text.secondary">
                                    {businessVoucher.isDisabled ? 'Disabled' : 'Enabled'}
                                  </Typography>
                                  <Switch
                                    checked={!businessVoucher.isDisabled}
                                    onChange={() => handleToggleIsDisabled(businessVoucherId, businessVoucher.isDisabled)}
                                    size="small"
                                    onClick={(e) => e.stopPropagation()}
                                    onFocus={(e) => e.stopPropagation()}
                                  />
                                </Box>
                              </Box>
                            </Box>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Box sx={{ pt: 1 }}>
                              <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid item xs={12} md={6}>
                                  <Typography variant="body2" color="text.secondary">
                                    <strong>Created:</strong> {formatDate(businessVoucher.createdAt)}
                                  </Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <Typography variant="body2" color="text.secondary">
                                    <strong>Updated:</strong> {formatDate(businessVoucher.updatedAt)}
                                  </Typography>
                                </Grid>
                              </Grid>
                              
                              <Divider sx={{ my: 2 }} />
                              
                              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
                                Voucher Codes ({businessVoucherCodes?.length || 0})
                              </Typography>
                              
                              {loadingCodes ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                                  <CircularProgress size={20} />
                                  <Typography variant="body2" sx={{ ml: 1 }}>Đang tải codes...</Typography>
                                </Box>
                              ) : codes && codes.length > 0 ? (
                                <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 300 }}>
                                  <Table size="small" stickyHeader>
                                    <TableHead>
                                      <TableRow>
                                        <TableCell><strong>Code</strong></TableCell>
                                        <TableCell><strong>Status</strong></TableCell>
                                        <TableCell><strong>Used At</strong></TableCell>
                                        <TableCell><strong>Created At</strong></TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {codes.map((code, index) => (
                                        <TableRow key={code._id || code.id || index}>
                                          <TableCell>
                                            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                              {code.code || 'N/A'}
                                            </Typography>
                                          </TableCell>
                                          <TableCell>
                                            <Chip
                                              label={code.status || 'N/A'}
                                              size="small"
                                              color={code.status === 'used' ? 'success' : code.status === 'expired' ? 'error' : 'default'}
                                            />
                                          </TableCell>
                                          <TableCell>
                                            <Typography variant="body2" fontSize="0.75rem">
                                              {code.usedAt ? formatDate(code.usedAt) : 'N/A'}
                                            </Typography>
                                          </TableCell>
                                          <TableCell>
                                            <Typography variant="body2" fontSize="0.75rem">
                                              {code.createdAt ? formatDate(code.createdAt) : 'N/A'}
                                            </Typography>
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </TableContainer>
                              ) : (
                                <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                                  Không có codes nào
                                </Typography>
                              )}
                            </Box>
                          </AccordionDetails>
                        </Accordion>
                      );
                    })}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                    Không có business vouchers nào
                  </Typography>
                )}
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


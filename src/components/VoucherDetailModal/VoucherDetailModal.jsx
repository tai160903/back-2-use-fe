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
import Tooltip from '@mui/material/Tooltip';
import { FaGift, FaCoins, FaCalendarAlt, FaCode, FaInfoCircle, FaStore } from 'react-icons/fa';
import {
  getBusinessVoucherCodesApi,
} from '../../store/slices/voucherSlice';
import './VoucherDetailModal.css';

const VoucherDetailModal = ({ isOpen, onClose, voucher, isLoading }) => {
  const dispatch = useDispatch();
  const { adminBusinessVouchers: businessVouchers, adminBusinessVoucherCodes: businessVoucherCodes, isLoading: adminLoading } = useSelector(state => state.vouchers);
  const [expandedBusinessVoucher, setExpandedBusinessVoucher] = useState(null);
  const [codesLoading, setCodesLoading] = useState({});
  const [togglingVouchers, setTogglingVouchers] = useState({});
  const [togglingTemplate, setTogglingTemplate] = useState(false);

  useEffect(() => {
    if (isOpen && voucher && voucher.voucherType === 'business') {
      // Note: getBusinessVouchersByVoucherIdApi has been removed
      console.warn('getBusinessVouchersByVoucherIdApi has been removed');
    } else if (!isOpen) {
      // Reset state when modal closes
      setExpandedBusinessVoucher(null);
      setCodesLoading({});
      setTogglingVouchers({});
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

  const handleToggleTemplateIsDisabled = async (currentIsDisabled) => {
    // Note: updateVoucherTemplateIsDisabledApi and getVoucherByIdApi have been removed
    console.warn('Toggle template isDisabled functionality has been removed');
    setTogglingTemplate(false);
  };

  const handleToggleIsDisabled = async (businessVoucherId, currentIsDisabled) => {
    // Note: updateBusinessVoucherIsDisabledApi and getBusinessVouchersByVoucherIdApi have been removed
    console.warn('Toggle business voucher isDisabled functionality has been removed');
    setTogglingVouchers({ ...togglingVouchers, [businessVoucherId]: false });
    
    try {
      // Reload codes if this business voucher is expanded
      if (expandedBusinessVoucher === businessVoucherId) {
        setCodesLoading({ ...codesLoading, [businessVoucherId]: true });
        await dispatch(getBusinessVoucherCodesApi({ businessVoucherId, page: 1, limit: 100 }));
        setCodesLoading({ ...codesLoading, [businessVoucherId]: false });
      }
    } catch (error) {
      // Error is handled by the thunk (toast notification)
      console.error('Failed to toggle isDisabled:', error);
    } finally {
      setTogglingVouchers({ ...togglingVouchers, [businessVoucherId]: false });
    }
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

      <DialogContent sx={{ pt: 3, pb: 2, px: 3, maxHeight: 'calc(90vh - 200px)', overflowY: 'auto' }}>
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
                
                {/* Row 2: Display Status for Business (if applicable) */}
                {voucher.voucherType === 'business' && (
                  <Grid item xs={12}>
                    <Box className="voucher-detail-item">
                      <Typography className="voucher-detail-label">
                        Display Status for Business
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 0.5 }}>
                        <Chip
                          label={voucher.isDisabled ? 'Disabled' : 'Enabled'}
                          color={voucher.isDisabled ? 'error' : 'success'}
                          size="small"
                          sx={{ minWidth: '80px', fontWeight: 600 }}
                        />
                        <Tooltip
                          title={voucher.isDisabled
                            ? 'Click to enable voucher (business can view and claim)'
                            : 'Click to disable voucher (business cannot view and claim)'}
                          arrow
                          placement="top"
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                            {togglingTemplate ? (
                              <CircularProgress size={20} sx={{ color: '#22c55e' }} />
                            ) : (
                              <Switch
                                checked={!voucher.isDisabled}
                                onChange={() => handleToggleTemplateIsDisabled(voucher.isDisabled)}
                                size="medium"
                                color="primary"
                                disabled={togglingTemplate}
                                sx={{
                                  '& .MuiSwitch-switchBase.Mui-checked': {
                                    color: '#22c55e',
                                  },
                                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                    backgroundColor: '#22c55e',
                                  },
                                }}
                              />
                            )}
                          </Box>
                        </Tooltip>
                      </Box>
                    </Box>
                  </Grid>
                )}
                
                {/* Row 3: Description - Full width */}
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

          {/* Business Vouchers List - Only for business type vouchers */}
          {voucher.voucherType === 'business' && (
            <Grid item xs={12}>
              <Box className="voucher-detail-section">
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="h6" className="voucher-detail-section-title" sx={{ mb: 0 }}>
                    <FaStore style={{ marginRight: '8px' }} />
                    Business Vouchers ({businessVouchers?.length || 0})
                  </Typography>
                  {businessVouchers && businessVouchers.length > 0 && (
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                      💡 Use Switch to toggle isDisabled
                    </Typography>
                  )}
                </Box>
                <Divider sx={{ my: 1.5 }} />
                {adminLoading && businessVouchers.length === 0 ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                    <CircularProgress size={24} />
                    <Typography sx={{ ml: 2 }}>Loading business vouchers...</Typography>
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
                              minHeight: '64px',
                              '& .MuiAccordionSummary-content': {
                                margin: '12px 0',
                                alignItems: 'center',
                              },
                            }}
                          >
                            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 2, gap: 2 }}>
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.5 }}>
                                  {businessVoucher.businessId?.name || businessVoucher.businessName || 'Business Voucher'}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                  ID: {businessVoucherId}
                                </Typography>
                              </Box>
                              <Box 
                                sx={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: 1.5,
                                  flexShrink: 0,
                                  padding: '4px 8px',
                                  borderRadius: '8px',
                                  backgroundColor: 'rgba(0, 0, 0, 0.02)',
                                }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Chip
                                  label={businessVoucher.isDisabled ? 'Disabled' : 'Enabled'}
                                  color={businessVoucher.isDisabled ? 'error' : 'success'}
                                  size="small"
                                  sx={{ minWidth: '80px', fontWeight: 600 }}
                                />
                                <Tooltip 
                                  title={businessVoucher.isDisabled 
                                    ? 'Click to enable voucher (business can claim)' 
                                    : 'Click to disable voucher (business cannot claim)'}
                                  arrow
                                  placement="top"
                                >
                                  <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                    {togglingVouchers[businessVoucherId] ? (
                                      <CircularProgress size={20} sx={{ color: '#22c55e' }} />
                                    ) : (
                                      <Switch
                                        checked={!businessVoucher.isDisabled}
                                        onChange={() => handleToggleIsDisabled(businessVoucherId, businessVoucher.isDisabled)}
                                        size="medium"
                                        color="primary"
                                        sx={{
                                          '& .MuiSwitch-switchBase.Mui-checked': {
                                            color: '#22c55e',
                                          },
                                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                            backgroundColor: '#22c55e',
                                          },
                                        }}
                                      />
                                    )}
                                  </Box>
                                </Tooltip>
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
                                  <Typography variant="body2" sx={{ ml: 1 }}>Loading codes...</Typography>
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
                      No codes available
                    </Typography>
                              )}
                            </Box>
                          </AccordionDetails>
                        </Accordion>
                      );
                    })}
                  </Box>
                ) : (
                  <Box sx={{ py: 3, textAlign: 'center' }}>
                    <FaStore style={{ fontSize: '48px', color: '#9ca3af', marginBottom: '12px' }} />
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      No business vouchers available
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      When a business claims this voucher, you will see Switch to toggle isDisabled here
                    </Typography>
                  </Box>
                )}
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
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VoucherDetailModal;


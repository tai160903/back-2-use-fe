import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  LinearProgress,
  Link,
  CircularProgress,
  Pagination,
} from '@mui/material';
import {
  Close as CloseIcon,
  CardGiftcard as GiftIcon,
  LocalFlorist as EcoIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import { getCustomerVouchers, redeemCustomerVoucher, getMyCustomerVouchers } from '../../../store/slices/voucherSlice';
import { PATH } from '../../../routes/path';
import { getUserRole } from '../../../utils/authUtils';
import { getCurrentUser } from '../../../utils/authUtils';
import './Voucher.css';

export default function Voucher() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    customerVouchers, 
    myCustomerVouchers,
    customerVoucherPagination,
    isLoading 
  } = useSelector((state) => state.vouchers);

  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [conditionModalOpen, setConditionModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [exchangingVoucherId, setExchangingVoucherId] = useState(null);
  const [exchangedVoucherIds, setExchangedVoucherIds] = useState(new Set());
  const [openExchangeDialog, setOpenExchangeDialog] = useState(false);
  const [voucherToExchange, setVoucherToExchange] = useState(null);
  const itemsPerPage = 8;

  const role = getUserRole();
  const currentUser = getCurrentUser();

  // Load vouchers from API and user's exchanged vouchers
  useEffect(() => {
    // Map filter to API status
    let apiStatus = undefined;
    let limit = itemsPerPage;
    
    if (statusFilter === 'active') {
      apiStatus = 'active';
      limit = itemsPerPage;
    } else if (statusFilter === 'inactive') {
     
      apiStatus = undefined; 
      limit = 1000; 
    } else {
 
      limit = itemsPerPage; 
    }
    
    // Load vouchers with pagination
    dispatch(getCustomerVouchers({ 
      status: apiStatus,
      page: statusFilter === 'inactive' ? 1 : page, 
      limit: limit
    }));

    // Load user's exchanged vouchers to check which ones have been exchanged
    if (role === 'customer' && currentUser?.accessToken) {
      dispatch(getMyCustomerVouchers({
        status: 'redeemed',
        page: 1,
        limit: 1000, 
      }));
    }
  }, [dispatch, statusFilter, page, itemsPerPage, role, currentUser?.accessToken]);

  const vouchers = useMemo(() => {
    if (!customerVouchers || customerVouchers.length === 0) {
      return [];
    }

  
    const businessVouchers = customerVouchers.filter(
      (voucher) => voucher.voucherType !== 'leaderboard'
    );

    return businessVouchers.map((voucher) => {
      const discountPercent = voucher.discountPercent || 0;
      const maxUsage = voucher.maxUsage || 0;
      const redeemedCount = voucher.redeemedCount || 0;
      const usagePercentage = maxUsage > 0 ? Math.round((redeemedCount / maxUsage) * 100) : 0;
      
      // Format expiry date
      const endDate = voucher.endDate;
      let expiryText = 'N/A';
      if (endDate) {
        const date = new Date(endDate);
        if (!isNaN(date.getTime())) {
          expiryText = date.toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          });
        }
      }

      // Template vouchers don't have claimedAt - will check against user's exchanged vouchers
      return {
        id: voucher._id || voucher.id,
        voucherId: voucher._id || voucher.id,
        type: 'regular', 
        discount: `${discountPercent}%`,

        points: voucher.rewardPointCost || 0,
        usagePercentage: usagePercentage,
        redeemedCount: redeemedCount,
        maxUsage: maxUsage,
        status: voucher.status || 'active',
        category: voucher.businessInfo?.businessName || 'Partner Store',
        expiry: expiryText,
        customName: voucher.customName,
        baseCode: voucher.baseCode,
        description: voucher.customDescription,
        businessName: voucher.businessInfo?.businessName,
        originalVoucher: voucher,
      };
    });
  }, [customerVouchers]);

  // Build set of exchanged voucher template IDs from user's vouchers
  useEffect(() => {
    if (myCustomerVouchers && myCustomerVouchers.length > 0) {
      const exchangedIds = new Set();
      myCustomerVouchers.forEach((myVoucher) => {
        // Get the voucher template ID from user's voucher
        const templateId = 
          myVoucher.voucher?._id?.toString() || 
          myVoucher.voucher?.id?.toString() ||
          myVoucher.voucherId?.toString() ||
          myVoucher.voucherTemplateId?.toString();
        if (templateId) {
          exchangedIds.add(templateId);
        }
      });
      setExchangedVoucherIds(exchangedIds);
    } else {
      setExchangedVoucherIds(new Set());
    }
  }, [myCustomerVouchers]);

  // Get user points from wallet or user state (mock for now)
  const userPoints = 350; // TODO: Get from actual user wallet/points

  // Handle exchange voucher - opens confirmation dialog
  const handleSaveVoucher = (voucher) => {
    setVoucherToExchange(voucher);
    setOpenExchangeDialog(true);
  };

  // Confirm and execute voucher exchange
  const handleConfirmExchange = async () => {
    if (!voucherToExchange) return;
    
    const voucherId = voucherToExchange.voucherId || voucherToExchange.id;
    setOpenExchangeDialog(false);
    setExchangingVoucherId(voucherId);
    
    try {
      await dispatch(redeemCustomerVoucher({ voucherId })).unwrap();
      // Show success toast with link to voucher wallet
      toast.success(
        (t) => (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Voucher exchanged successfully!
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              View your vouchers in your voucher wallet
            </Typography>
            <Button
              size="small"
              variant="contained"
              onClick={() => {
                toast.dismiss(t.id);
                navigate(PATH.REWARDS);
              }}
              sx={{
                mt: 0.5,
                backgroundColor: '#22c55e',
                '&:hover': { backgroundColor: '#16a34a' },
                textTransform: 'none',
                fontSize: '12px',
                py: 0.5,
                px: 1.5
              }}
            >
              View Voucher Wallet
            </Button>
          </Box>
        ),
        {
          duration: 5000,
          position: 'top-right',
        }
      );
      
      // Refresh vouchers list
      await dispatch(getCustomerVouchers({ 
        status: statusFilter === 'all' ? undefined : statusFilter === 'active' ? 'active' : undefined,
        page: page,
        limit: itemsPerPage 
      }));

      // Refresh user's exchanged vouchers to update the exchanged list
      if (role === 'customer' && currentUser?.accessToken) {
        await dispatch(getMyCustomerVouchers({
          status: 'redeemed',
          page: 1,
          limit: 1000,
        }));
      }
    } catch {
      // Error toast is already handled in the slice, no need to call again
    } finally {
      setExchangingVoucherId(null);
      setVoucherToExchange(null);
    }
  };

  const handleShowConditions = (voucher) => {
    setSelectedVoucher(voucher);
    setConditionModalOpen(true);
  };

  const handleCloseModals = () => {
    setConditionModalOpen(false);
    setSelectedVoucher(null);
  };

  // Reset to page 1 when filter changes
  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  // Filter vouchers based on status filter
  const filteredVouchers = useMemo(() => {
    if (statusFilter === 'all') {
      return vouchers;
    } else if (statusFilter === 'active') {
      return vouchers.filter(v => v.status === 'active');
    } else if (statusFilter === 'inactive') {
      return vouchers.filter(v => v.status !== 'active');
    }
    return vouchers;
  }, [vouchers, statusFilter]);

  // Paginate filtered vouchers for inactive filter (client-side pagination)
  const paginatedVouchers = useMemo(() => {
    if (statusFilter === 'inactive') {
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return filteredVouchers.slice(startIndex, endIndex);
    }
    // For 'all' and 'active', vouchers are already paginated by API
    return filteredVouchers;
  }, [filteredVouchers, page, itemsPerPage, statusFilter]);

  // Calculate total pages based on filter type
  const totalPages = useMemo(() => {
    if (statusFilter === 'inactive') {
      // Client-side pagination: calculate based on filtered vouchers
      return Math.ceil(filteredVouchers.length / itemsPerPage);
    }
    // Server-side pagination: use API pagination info
    return customerVoucherPagination?.totalPages || 1;
  }, [filteredVouchers.length, itemsPerPage, statusFilter, customerVoucherPagination]);

  return (
    <div className="voucher-page-shopee">
      {/* Main Banner */}
      <div className="voucher-banner-main">
        <div className="voucher-banner-content">
          <EcoIcon className="banner-logo-icon" />
          <div className="banner-text-container">
            <Typography variant="h3" className="banner-title">
              VOUCHER BACK2USE
            </Typography>
            <Typography variant="body2" className="banner-subtitle">
              Limited quantity, for the fastest users.
            </Typography>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="voucher-content-wrapper">
        <div className="voucher-content-card">
          {/* Section Header */}
          <div className="voucher-section-header-custom">
            <EcoIcon className="section-icon-custom" />
            <Typography variant="h6" className="section-title-custom">
              VOUCHER BACK2USE
            </Typography>
          </div>

          {/* Filters */}
          <div className="voucher-filters-custom">
            <Button
              variant={statusFilter === 'all' ? 'contained' : 'outlined'}
              onClick={() => setStatusFilter('all')}
              className={`filter-btn-custom ${statusFilter === 'all' ? 'active' : ''}`}
              size="small"
            >
              All
            </Button>
            <Button
              variant={statusFilter === 'active' ? 'contained' : 'outlined'}
              onClick={() => setStatusFilter('active')}
              className={`filter-btn-custom ${statusFilter === 'active' ? 'active' : ''}`}
              size="small"
            >
              Active
            </Button>
            <Button
              variant={statusFilter === 'inactive' ? 'contained' : 'outlined'}
              onClick={() => setStatusFilter('inactive')}
              className={`filter-btn-custom ${statusFilter === 'inactive' ? 'active' : ''}`}
              size="small"
            >
              Inactive
            </Button>
          </div>

          {/* Voucher Grid */}
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : filteredVouchers.length > 0 ? (
            <>
              <div className="voucher-grid-custom">
                {paginatedVouchers.map((voucher) => {
                  // Check if this voucher template has been exchanged by the current user
                  const templateId = voucher.voucherId.toString();
                  const isExchanged = exchangedVoucherIds.has(templateId);
                  const canSave = userPoints >= voucher.points;
              
              return (
                <div 
                  key={voucher.id} 
                  className={`voucher-card-custom ${voucher.type} ${voucher.status !== 'active' ? 'inactive' : ''}`}
                >
                  {/* Left Strip */}
                  <div className="voucher-card-strip">
                    <div className="voucher-strip-badge">
                      <div className="badge-icon-wrapper">
                        {voucher.type === 'exclusive' ? (
                          <StarIcon className="strip-icon" />
                        ) : (
                          <EcoIcon className="strip-icon" />
                        )}
                      </div>
                      <span className="strip-text">
                        {voucher.type === 'exclusive' ? 'EXCLUSIVE' : 'BACK2USE'}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="voucher-card-body">
                    <div className="voucher-main-info">
                      <Typography variant="h3" className="voucher-discount-text">
                        {voucher.discount}
                      </Typography>
                      {voucher.maxDiscount > 0 && (
                        <Typography variant="body2" className="voucher-max-discount-text">
                          Max discount {voucher.maxDiscount.toLocaleString('en-US')}đ
                        </Typography>
                      )}
                      {voucher.minSpend > 0 && (
                        <Typography variant="body2" className="voucher-min-order-text">
                          Min order {voucher.minSpend.toLocaleString('en-US')}đ
                        </Typography>
                      )}
                      <Typography variant="body2" className="voucher-category-text">
                        {voucher.businessName || voucher.category}
                      </Typography>
                      {voucher.customName && (
                        <Typography variant="body2" className="voucher-category-text" style={{ fontWeight: 600, marginTop: '4px' }}>
                          {voucher.customName}
                        </Typography>
                      )}
                      
                      {/* Points */}
                      <div className="voucher-points-section">
                        <GiftIcon className="points-icon" />
                        <Typography variant="caption" className="points-text">
                          {voucher.points} points
                        </Typography>
                      </div>

                      {/* Usage Progress */}
                      {voucher.maxUsage > 0 && (
                        <div className="voucher-usage-section">
                          <LinearProgress 
                            variant="determinate" 
                            value={voucher.usagePercentage} 
                            className="usage-bar"
                          />
                          <Typography variant="caption" className="usage-percentage">
                            Used {voucher.usagePercentage}% ({voucher.redeemedCount || 0}/{voucher.maxUsage})
                          </Typography>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="voucher-card-footer-custom">
                      {/* Inactive notice */}
                      {voucher.status !== 'active' && (
                        <Box 
                          sx={{ 
                            mb: 1.5,
                            p: 1,
                            backgroundColor: 'rgba(238, 77, 45, 0.1)',
                            borderRadius: 1,
                            border: '1px solid rgba(238, 77, 45, 0.3)'
                          }}
                        >
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: '#ee4d2d',
                              fontWeight: 600,
                              fontSize: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 0.5
                            }}
                          >
                            <span>⚠</span>
                            <span>Inactive - This voucher is not currently available</span>
                          </Typography>
                        </Box>
                      )}
                      {isExchanged ? (
                        <>
                          {/* Exchanged notice */}
                          <Box 
                            sx={{ 
                              mb: 1.5,
                              p: 1,
                              backgroundColor: 'rgba(34, 197, 94, 0.1)',
                              borderRadius: 1,
                              border: '1px solid rgba(34, 197, 94, 0.3)'
                            }}
                          >
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: '#16a34a',
                                fontWeight: 600,
                                fontSize: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 0.5
                              }}
                            >
                              <span>✓</span>
                              <span>You have already exchanged this voucher</span>
                            </Typography>
                          </Box>
                          <Button
                            variant="contained"
                            onClick={() => navigate(PATH.REWARDS)}
                            fullWidth
                            sx={{
                              backgroundColor: '#22c55e',
                              color: 'white',
                              minHeight: '40px',
                              fontWeight: 600,
                              textTransform: 'none',
                              mb: 1,
                              '&:hover': {
                                backgroundColor: '#16a34a',
                              }
                            }}
                          >
                            View in Voucher Wallet
                          </Button>
                          <Link
                            component="button"
                            variant="caption"
                            className="condition-link"
                            onClick={() => handleShowConditions(voucher)}
                          >
                            Conditions
                          </Link>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="contained"
                            className={`save-btn ${!canSave || voucher.status !== 'active' ? 'disabled' : ''}`}
                            onClick={() => handleSaveVoucher(voucher)}
                            disabled={!canSave || voucher.status !== 'active' || exchangingVoucherId === voucher.voucherId}
                            fullWidth
                            sx={{
                              position: 'relative',
                              minHeight: '40px',
                            }}
                          >
                            {exchangingVoucherId === voucher.voucherId ? (
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                <CircularProgress size={20} sx={{ color: 'white' }} />
                                <span>Processing...</span>
                              </Box>
                            ) : (
                              voucher.status !== 'active' ? 'Not Available' : canSave ? 'Exchange Voucher' : `Need ${voucher.points - userPoints} more points`
                            )}
                          </Button>
                          <Link
                            component="button"
                            variant="caption"
                            className="condition-link"
                            onClick={() => handleShowConditions(voucher)}
                          >
                            Conditions
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(e, value) => setPage(value)}
                    color="primary"
                    size="large"
                  />
                </Box>
              )}
            </>
          ) : (
            <Box sx={{ textAlign: 'center', p: 4 }}>
              <Typography variant="body1" color="text.secondary">
                No vouchers available
              </Typography>
            </Box>
          )}
        </div>
      </div>

      {/* Condition Modal */}
      <Dialog
        open={conditionModalOpen}
        onClose={handleCloseModals}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 12px 40px rgba(34, 197, 94, 0.2)',
            overflow: 'hidden',
          }
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
            justifyContent: 'space-between'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <GiftIcon sx={{ fontSize: 28 }} />
            <Box>
              <Typography variant="h6" component="div" fontWeight="bold">
                Usage Conditions
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9, mt: 0.25, display: 'block' }}>
                Terms and conditions for using this voucher
              </Typography>
            </Box>
          </Box>
          <IconButton 
            onClick={handleCloseModals}
            size="small"
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
        <DialogContent sx={{ pt: 3, pb: 2, px: 3 }}>
          <Box>
            <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
              Please read the following conditions before using this voucher:
            </Typography>
            <Box component="ul" sx={{ m: 0, pl: 2.5, listStyle: 'none' }}>
              <Box component="li" sx={{ mb: 1.5, display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <Typography variant="body2" sx={{ color: '#16a34a', fontWeight: 600, minWidth: '8px' }}>•</Typography>
                <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.6 }}>
                  This voucher is valid only for orders placed before the expiry date ({selectedVoucher?.expiry || 'N/A'}).
                </Typography>
              </Box>
              {selectedVoucher?.minSpend > 0 && (
                <Box component="li" sx={{ mb: 1.5, display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <Typography variant="body2" sx={{ color: '#16a34a', fontWeight: 600, minWidth: '8px' }}>•</Typography>
                  <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.6 }}>
                    Minimum order value of {selectedVoucher.minSpend.toLocaleString('en-US')}đ is required to use this voucher.
                  </Typography>
                </Box>
              )}
              <Box component="li" sx={{ mb: 1.5, display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <Typography variant="body2" sx={{ color: '#16a34a', fontWeight: 600, minWidth: '8px' }}>•</Typography>
                <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.6 }}>
                  This voucher cannot be combined with other promotions or discounts.
                </Typography>
              </Box>
              <Box component="li" sx={{ mb: 1.5, display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <Typography variant="body2" sx={{ color: '#16a34a', fontWeight: 600, minWidth: '8px' }}>•</Typography>
                <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.6 }}>
                  Each customer can only use this voucher once per transaction.
                </Typography>
              </Box>
              <Box component="li" sx={{ mb: 1.5, display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <Typography variant="body2" sx={{ color: '#16a34a', fontWeight: 600, minWidth: '8px' }}>•</Typography>
                <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.6 }}>
                  This voucher is non-refundable and cannot be exchanged for cash or other vouchers.
                </Typography>
              </Box>
              <Box component="li" sx={{ mb: 1.5, display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <Typography variant="body2" sx={{ color: '#16a34a', fontWeight: 600, minWidth: '8px' }}>•</Typography>
                <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.6 }}>
                  The voucher discount will be automatically applied at checkout when conditions are met.
                </Typography>
              </Box>
              <Box component="li" sx={{ mb: 0, display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <Typography variant="body2" sx={{ color: '#16a34a', fontWeight: 600, minWidth: '8px' }}>•</Typography>
                <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.6 }}>
                  The store reserves the right to refuse voucher usage if terms are violated.
                </Typography>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={handleCloseModals}
            variant="contained"
            sx={{
              backgroundColor: '#22c55e',
              color: 'white',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              '&:hover': {
                backgroundColor: '#16a34a',
              }
            }}
          >
            Understood
          </Button>
        </DialogActions>
      </Dialog>

      {/* Exchange Voucher Confirmation Dialog */}
      <Dialog
        open={openExchangeDialog}
        onClose={() => setOpenExchangeDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ 
          fontWeight: 700, 
          color: '#164c34',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <GiftIcon sx={{ color: '#22c55e' }} />
          Confirm Exchange Voucher
        </DialogTitle>
        <DialogContent dividers>
          {voucherToExchange && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Are you sure you want to exchange this voucher?
              </Typography>
              
              <Box sx={{ 
                p: 2, 
                backgroundColor: '#f0fdf4', 
                borderRadius: 2,
                border: '1px solid #dcfce7'
              }}>
                <Typography variant="h6" sx={{ color: '#22c55e', fontWeight: 700, mb: 1 }}>
                  {voucherToExchange.discount || '0%'}
                </Typography>
                {voucherToExchange.customName && (
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#164c34', mb: 0.5 }}>
                    {voucherToExchange.customName}
                  </Typography>
                )}
                <Typography variant="body2" sx={{ color: '#16a34a', mb: 1 }}>
                  {voucherToExchange.businessName || voucherToExchange.category}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1.5 }}>
                  <GiftIcon sx={{ fontSize: 18, color: '#22c55e' }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#164c34' }}>
                    Cost: {voucherToExchange.points || 0} points
                  </Typography>
                </Box>
                
                {userPoints < (voucherToExchange.points || 0) && (
                  <Typography variant="caption" sx={{ color: '#dc2626', mt: 1, display: 'block' }}>
                    ⚠ You need {(voucherToExchange.points || 0) - userPoints} more points
                  </Typography>
                )}
              </Box>
              
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                This action cannot be undone. The points will be deducted from your account.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button 
            onClick={() => setOpenExchangeDialog(false)}
            disabled={exchangingVoucherId !== null}
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmExchange}
            variant="contained"
            disabled={exchangingVoucherId !== null || !voucherToExchange || userPoints < (voucherToExchange?.points || 0)}
            sx={{
              backgroundColor: '#22c55e',
              '&:hover': { backgroundColor: '#16a34a' },
              textTransform: 'none',
              minWidth: '120px'
            }}
          >
            {exchangingVoucherId ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={16} sx={{ color: 'white' }} />
                <span>Exchanging...</span>
              </Box>
            ) : (
              'Confirm Exchange'
            )}
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
}

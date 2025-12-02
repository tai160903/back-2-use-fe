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
import { getCustomerVouchers, redeemCustomerVoucher } from '../../../store/slices/voucherSlice';
import { PATH } from '../../../routes/path';
import './Voucher.css';

export default function Voucher() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { 
    customerVouchers, 
    customerVoucherPagination,
    isLoading 
  } = useSelector((state) => state.vouchers);

  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [conditionModalOpen, setConditionModalOpen] = useState(false);
  const [savedVouchers, setSavedVouchers] = useState(new Set());
  const [page, setPage] = useState(1);
  const [exchangingVoucherId, setExchangingVoucherId] = useState(null);
  const itemsPerPage = 12;

  // Load vouchers from API
  useEffect(() => {
    // Map filter to API status
    let apiStatus = undefined;
    if (statusFilter === 'active') {
      apiStatus = 'active';
    } else if (statusFilter === 'inactive') {
      // For inactive, we'll filter client-side since API might not support it
      apiStatus = undefined; // Load all and filter client-side
    }
    
    dispatch(getCustomerVouchers({ 
      status: apiStatus,
      page,
      limit: itemsPerPage 
    }));
  }, [dispatch, statusFilter, page]);

  // Transform API vouchers to display format
  const vouchers = useMemo(() => {
    if (!customerVouchers || customerVouchers.length === 0) {
      return [];
    }

    return customerVouchers.map((voucher) => {
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

      // Check if voucher has been exchanged by user (has claimedAt)
      const isExchanged = !!voucher.claimedAt;

      return {
        id: voucher._id || voucher.id,
        voucherId: voucher._id || voucher.id,
        type: voucher.voucherType === 'leaderboard' ? 'exclusive' : 'regular',
        discount: `${discountPercent}%`,
        maxDiscount: 0, // Not available in API
        minSpend: 0, // Not available in API
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
        isExchanged: isExchanged,
        claimedAt: voucher.claimedAt,
      };
    });
  }, [customerVouchers]);

  // Get user points from wallet or user state (mock for now)
  const userPoints = 350; // TODO: Get from actual user wallet/points

  const handleSaveVoucher = async (voucherId) => {
    setExchangingVoucherId(voucherId);
    try {
      await dispatch(redeemCustomerVoucher({ voucherId })).unwrap();
      // Add to saved vouchers set
      const newSaved = new Set(savedVouchers);
      newSaved.add(voucherId);
      setSavedVouchers(newSaved);
      
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
                navigate(PATH.VOUCHERS);
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
      dispatch(getCustomerVouchers({ 
        status: statusFilter === 'all' ? undefined : statusFilter === 'active' ? 'active' : undefined,
        page,
        limit: itemsPerPage 
      }));
    } catch (error) {
      // Error toast is already handled in the slice, no need to call again
      // Just update saved vouchers state if needed
    } finally {
      setExchangingVoucherId(null);
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
                {filteredVouchers.map((voucher) => {
                  // Check if voucher is already exchanged (from API or local state)
                  const isExchanged = voucher.isExchanged || savedVouchers.has(voucher.id);
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
                      <Button
                        variant="contained"
                        className={`save-btn ${isExchanged ? 'saved' : ''} ${!canSave || voucher.status !== 'active' || isExchanged ? 'disabled' : ''}`}
                        onClick={() => handleSaveVoucher(voucher.voucherId)}
                        disabled={!canSave || isExchanged || voucher.status !== 'active' || exchangingVoucherId === voucher.voucherId}
                        fullWidth
                        sx={{
                          position: 'relative',
                          minHeight: '40px',
                          cursor: isExchanged ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {exchangingVoucherId === voucher.voucherId ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                            <CircularProgress size={20} sx={{ color: 'white' }} />
                            <span>Processing...</span>
                          </Box>
                        ) : (
                          isExchanged ? 'Exchanged' : voucher.status !== 'active' ? 'Not Available' : canSave ? 'Exchange Voucher' : `Need ${voucher.points - userPoints} more points`
                        )}
                      </Button>
                      <Link
                        component="button"
                        variant="caption"
                        className="condition-link"
                        onClick={() => handleShowConditions(voucher)}
                        sx={{
                          pointerEvents: isExchanged ? 'none' : 'auto',
                          opacity: isExchanged ? 0.6 : 1
                        }}
                      >
                        Conditions
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
              </div>
              
              {/* Pagination */}
              {customerVoucherPagination.totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
                  <Pagination
                    count={customerVoucherPagination.totalPages}
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

    </div>
  );
}

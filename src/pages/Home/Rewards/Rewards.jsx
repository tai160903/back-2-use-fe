import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getMyCustomerVouchers
} from '../../../store/slices/voucherSlice';
import { 
  Pagination, 
  Stack, 
  Chip, 
  Box, 
  Typography, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button,
  IconButton,
  Grid,
  Alert
} from '@mui/material';
import { FaGift, FaClock, FaExclamationTriangle } from 'react-icons/fa';
import { BiDetail } from 'react-icons/bi';
import { Close as CloseIcon, LocalFlorist as EcoIcon, CardGiftcard as GiftIcon } from '@mui/icons-material';
import './Rewards.css';

export default function Rewards() {
  const dispatch = useDispatch();
  const { 
    myCustomerVouchers,
    myCustomerVoucherPagination,
    isLoading 
  } = useSelector(state => state.vouchers);

  const [myVouchersPage, setMyVouchersPage] = useState(1);
  const [myVouchersStatus, setMyVouchersStatus] = useState('all'); // all, redeemed, used, expired, expiring
  const itemsPerPage = 8;
  
  // Modal state
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  // Load my vouchers - Load all vouchers to enable filtering
  useEffect(() => {
    // Load all vouchers (status: redeemed includes all redeemed vouchers)
    // The API returns all user's vouchers when status is 'redeemed'
    dispatch(getMyCustomerVouchers({
      status: 'redeemed', // This loads all user's vouchers
      page: myVouchersPage,
      limit: itemsPerPage,
    }));
  }, [dispatch, myVouchersPage]);

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Helper để tính số ngày còn lại đến hết hạn
  const getDaysUntilExpiry = (expiryDateString) => {
    if (!expiryDateString) return null;
    const expiryDate = new Date(expiryDateString);
    if (isNaN(expiryDate.getTime())) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    expiryDate.setHours(0, 0, 0, 0);
    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Transform my vouchers from API
  const myVouchers = useMemo(() => {
    if (!myCustomerVouchers || myCustomerVouchers.length === 0) return [];
    
    return myCustomerVouchers.map(voucher => {
      // Determine discount value
      let discountValue = '';
      if (voucher.voucher?.discountPercent) {
        discountValue = `${voucher.voucher.discountPercent}%`;
      } else if (voucher.voucher?.discountAmount) {
        discountValue = `${voucher.voucher.discountAmount.toLocaleString('en-US')}đ`;
      } else if (voucher.discountPercent) {
        discountValue = `${voucher.discountPercent}%`;
      }

      const expiryDate = voucher.expiryDate || voucher.leaderboardExpireAt || voucher.voucher?.endDate || voucher.voucherInfo?.endDate;
      const daysUntilExpiry = getDaysUntilExpiry(expiryDate);
      const isExpiring = daysUntilExpiry !== null && daysUntilExpiry >= 0 && daysUntilExpiry <= 7;
      const isExpired = daysUntilExpiry !== null && daysUntilExpiry < 0;

      // Xác định status
      let status = 'redeemed';
      if (voucher.status === 'used') {
        status = 'used';
      } else if (voucher.status === 'expired' || isExpired) {
        status = 'expired';
      } else if (voucher.status === 'redeemed') {
        status = 'redeemed';
      }

      return {
        id: voucher._id || voucher.id,
        name: voucher.voucher?.name || voucher.voucherInfo?.name || voucher.name || 'Voucher',
        code: voucher.fullCode || voucher.code || voucher.voucherCode || '',
        discount: voucher.voucher?.discountPercent || voucher.voucherInfo?.discountPercent || voucher.discountPercent || 0,
        discountValue: discountValue,
        redeemedAt: formatDate(voucher.redeemedAt || voucher.createdAt),
        expiry: formatDate(expiryDate),
        expiryDate: expiryDate,
        daysUntilExpiry: daysUntilExpiry,
        isExpiring: isExpiring,
        isExpired: isExpired,
        status: status,
        qrCode: voucher.qrCode || '',
        description: voucher.voucher?.description || voucher.voucherInfo?.description || '',
        originalVoucher: voucher,
        // Add voucherInfo fields
        customName: voucher.voucher?.customName || voucher.voucherInfo?.customName || voucher.customName || '',
        customDescription: voucher.voucher?.customDescription || voucher.voucherInfo?.customDescription || voucher.customDescription || '',
        baseCode: voucher.voucher?.baseCode || voucher.voucherInfo?.baseCode || voucher.baseCode || '',
        maxUsage: voucher.voucher?.maxUsage || voucher.voucherInfo?.maxUsage || voucher.maxUsage || 0,
        redeemedCount: voucher.voucher?.redeemedCount || voucher.voucherInfo?.redeemedCount || voucher.redeemedCount || 0,
        startDate: voucher.voucher?.startDate || voucher.voucherInfo?.startDate || voucher.startDate || '',
        endDate: voucher.voucher?.endDate || voucher.voucherInfo?.endDate || voucher.endDate || expiryDate,
        rewardPointCost: voucher.voucher?.rewardPointCost || voucher.voucherInfo?.rewardPointCost || voucher.rewardPointCost || 0,
        voucherType: voucher.voucherType || '',
      };
    });
  }, [myCustomerVouchers]);

  // Filter vouchers theo status
  const filteredMyVouchers = useMemo(() => {
    if (!myVouchers || myVouchers.length === 0) return [];
    
    switch(myVouchersStatus) {
      case 'all':
        return myVouchers;
      case 'expiring':
        return myVouchers.filter(v => v.isExpiring && !v.isExpired && v.status !== 'used');
      case 'used':
        return myVouchers.filter(v => v.status === 'used');
      case 'expired':
        return myVouchers.filter(v => v.isExpired || v.status === 'expired');
      case 'redeemed':
        return myVouchers.filter(v => v.status === 'redeemed' && !v.isExpired);
      default:
        return myVouchers;
    }
  }, [myVouchers, myVouchersStatus]);

  const myVouchersTotalPages = myCustomerVoucherPagination?.totalPages || 1;
  const paginatedMyVouchers = filteredMyVouchers;

  // Đếm số lượng voucher sắp hết hạn
  const expiringCount = useMemo(() => {
    return myVouchers.filter(v => v.isExpiring && !v.isExpired && v.status !== 'used').length;
  }, [myVouchers]);

  const handleMyVouchersPageChange = (event, newPage) => {
    setMyVouchersPage(newPage);
  };

  const handleMyVouchersStatusChange = (newStatus) => {
    setMyVouchersStatus(newStatus);
    setMyVouchersPage(1);
  };

  const handleViewDetail = (voucher) => {
    // Lấy voucher data từ originalVoucher hoặc từ voucher object trực tiếp
    const voucherData = voucher.originalVoucher || voucher;
    setSelectedVoucher(voucherData);
    setDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedVoucher(null);
  };

  if (isLoading) {
    return (
      <div className="rewards-page">
        <div className="loading-state">Loading vouchers...</div>
      </div>
    );
  }

  return (
    <div className="rewards-page">
      {/* Wallet Header Section */}
      <div className="wallet-header-section">
        <div className="wallet-header-content">
          <div className="wallet-icon-wrapper">
            <FaGift className="wallet-icon" />
          </div>
          <div className="wallet-header-text">
            <h2 className="wallet-title">My Voucher Wallet</h2>
            <p className="wallet-subtitle">Manage and use your vouchers</p>
          </div>
        </div>
        <div className="wallet-stats">
          <div className="wallet-stat-item">
            <Typography variant="h4" className="stat-number">{myVouchers.length}</Typography>
            <Typography variant="body2" className="stat-label">Total Vouchers</Typography>
          </div>
          <div className="wallet-stat-item">
            <Typography variant="h4" className="stat-number">{myVouchers.filter(v => v.status === 'redeemed' && !v.isExpired).length}</Typography>
            <Typography variant="body2" className="stat-label">Available</Typography>
          </div>
          <div className="wallet-stat-item">
            <Typography variant="h4" className="stat-number">{expiringCount}</Typography>
            <Typography variant="body2" className="stat-label">Expiring Soon</Typography>
          </div>
        </div>
      </div>

      {/* Expiring Vouchers Alert */}
      {expiringCount > 0 && myVouchersStatus !== 'expiring' && (
        <Alert 
          severity="warning" 
          icon={<FaExclamationTriangle />}
          sx={{ 
            mb: 3,
            borderRadius: 2,
            backgroundColor: '#fef3c7',
            color: '#92400e',
            '& .MuiAlert-icon': {
              color: '#f59e0b'
            }
          }}
          action={
            <Button 
              size="small" 
              onClick={() => handleMyVouchersStatusChange('expiring')}
              sx={{ color: '#92400e', fontWeight: 600 }}
            >
              View Now
            </Button>
          }
        >
          You have <strong>{expiringCount}</strong> voucher{expiringCount > 1 ? 's' : ''} expiring in the next 7 days!
        </Alert>
      )}

      {/* My Vouchers Section */}
      <div className="my-vouchers-section">
        <div className="section-header">
          <h3 className="section-title">
            <FaGift className="section-icon" />
            My Vouchers
          </h3>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${myVouchersStatus === 'all' ? 'active' : ''}`}
            onClick={() => handleMyVouchersStatusChange('all')}
          >
            All
            <span className="tab-count">
              ({myVouchers.length})
            </span>
          </button>
          <button 
            className={`filter-tab ${myVouchersStatus === 'expiring' ? 'active' : ''}`}
            onClick={() => handleMyVouchersStatusChange('expiring')}
          >
            <FaExclamationTriangle style={{ fontSize: '14px' }} />
            Expiring Soon
            <span className="tab-count">
              ({expiringCount})
            </span>
          </button>
          <button 
            className={`filter-tab ${myVouchersStatus === 'redeemed' ? 'active' : ''}`}
            onClick={() => handleMyVouchersStatusChange('redeemed')}
          >
            Available
            <span className="tab-count">
              ({myVouchers.filter(v => v.status === 'redeemed' && !v.isExpired).length})
            </span>
          </button>
          <button 
            className={`filter-tab ${myVouchersStatus === 'used' ? 'active' : ''}`}
            onClick={() => handleMyVouchersStatusChange('used')}
          >
            Used
            <span className="tab-count">
              ({myVouchers.filter(v => v.status === 'used').length})
            </span>
          </button>
          <button 
            className={`filter-tab ${myVouchersStatus === 'expired' ? 'active' : ''}`}
            onClick={() => handleMyVouchersStatusChange('expired')}
          >
            Expired
            <span className="tab-count">
              ({myVouchers.filter(v => v.isExpired || v.status === 'expired').length})
            </span>
          </button>
        </div>

        <div className="vouchers-grid">
          {paginatedMyVouchers.length > 0 ? (
            paginatedMyVouchers.map((voucher) => {
              const isInactive = voucher.isExpired || voucher.status === 'expired' || voucher.status === 'used';
              const businessName = voucher.originalVoucher?.voucher?.businessInfo?.businessName || 
                                   voucher.originalVoucher?.businessInfo?.businessName || 
                                   voucher.originalVoucher?.voucherInfo?.businessInfo?.businessName || '';
              const customName = voucher.originalVoucher?.voucher?.customName || 
                                voucher.originalVoucher?.customName || 
                                voucher.originalVoucher?.voucherInfo?.customName || '';
              const voucherType = voucher.voucherType || voucher.originalVoucher?.voucherType || '';
              
              return (
                <div 
                  key={voucher.id} 
                  className={`voucher-card-custom ${isInactive ? 'inactive' : ''} ${voucher.isExpiring ? 'expiring' : ''}`}
                  onClick={() => handleViewDetail(voucher)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Left Strip */}
                  <div className="voucher-card-strip">
                    <div className="voucher-strip-badge">
                      <div className="badge-icon-wrapper">
                        <EcoIcon className="strip-icon" />
                      </div>
                      <span className="strip-text">BACK2USE</span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="voucher-card-body">
                    <div className="voucher-main-info">
                      {/* Voucher Type Badge */}
                      {voucherType && (
                        <Box sx={{ mb: 1 }}>
                          <Chip
                            label={voucherType === 'business' ? 'Business' : voucherType === 'leaderboard' ? 'Leaderboard' : voucherType}
                            size="small"
                            sx={{
                              backgroundColor: voucherType === 'business' ? '#dbeafe' : '#fef3c7',
                              color: voucherType === 'business' ? '#1e40af' : '#92400e',
                              fontWeight: 600,
                              fontSize: '10px',
                              height: '20px',
                              textTransform: 'capitalize'
                            }}
                          />
                        </Box>
                      )}
                      <Typography variant="h3" className="voucher-discount-text">
                        {voucher.discountValue || `${voucher.discount}%`}
                      </Typography>
                      <Typography variant="body2" className="voucher-category-text">
                        {businessName || voucher.name}
                      </Typography>
                      {customName && (
                        <Typography variant="body2" className="voucher-category-text" style={{ fontWeight: 600, marginTop: '4px' }}>
                          {customName}
                        </Typography>
                      )}
                      
                      {/* Voucher Code */}
                      {voucher.code && (
                        <Box sx={{ mt: 1, mb: 1 }}>
                          <Typography variant="caption" sx={{ color: '#666', fontSize: '11px', display: 'block', mb: 0.5 }}>
                            Voucher Code:
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontFamily: 'monospace',
                              fontWeight: 700,
                              color: '#006C1E',
                              fontSize: '13px',
                              backgroundColor: '#f5f5f5',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              display: 'inline-block',
                              border: '1px dashed #d1d5db'
                            }}
                          >
                            {voucher.code}
                          </Typography>
                        </Box>
                      )}

                      {/* Saved Date */}
                      <Box sx={{ mt: 1, mb: 1 }}>
                        <Typography variant="caption" sx={{ color: '#666', fontSize: '11px', display: 'block', mb: 0.5 }}>
                          Saved:
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#1f2937', fontSize: '13px', fontWeight: 500 }}>
                          {voucher.redeemedAt}
                        </Typography>
                      </Box>

                      {/* Expiry Date */}
                      <Box sx={{ mt: 1, mb: 1 }}>
                        <Typography variant="caption" sx={{ color: '#666', fontSize: '11px', display: 'block', mb: 0.5 }}>
                          Expires:
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: voucher.isExpiring ? '#f59e0b' : voucher.isExpired ? '#ef4444' : '#1f2937',
                            fontSize: '13px',
                            fontWeight: 500
                          }}
                        >
                          {voucher.expiry}
                          {voucher.daysUntilExpiry !== null && !voucher.isExpired && (
                            <span style={{ marginLeft: '8px', fontSize: '0.85em', color: voucher.isExpiring ? '#f59e0b' : '#6b7280' }}>
                              ({voucher.daysUntilExpiry === 0 ? 'Today' : 
                                voucher.daysUntilExpiry === 1 ? '1 day' : 
                                `${voucher.daysUntilExpiry} days`})
                            </span>
                          )}
                        </Typography>
                      </Box>
                    </div>

                    {/* Footer */}
                    <div className="voucher-card-footer-custom">
                      <Button
                        variant="outlined"
                        className="view-detail-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetail(voucher);
                        }}
                        fullWidth
                        sx={{
                          textTransform: 'none',
                          fontWeight: 600,
                          fontSize: '14px',
                          py: 1
                        }}
                      >
                        <BiDetail style={{ marginRight: '8px' }} />
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="empty-state">
              <FaGift className="empty-icon" />
              <p>You don't have any vouchers yet</p>
            </div>
          )}
        </div>

        {myVouchersTotalPages > 1 && (
          <Stack spacing={2} className="pagination-container">
            <Pagination
              count={myVouchersTotalPages}
              page={myVouchersPage}
              onChange={handleMyVouchersPageChange}
              variant="outlined"
              shape="rounded"
              sx={{
                '& .MuiPaginationItem-root.Mui-selected': {
                  backgroundColor: '#22c55e',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#16a34a'
                  }
                },
                '& .MuiPaginationItem-root': {
                  '&:hover': {
                    backgroundColor: 'rgba(34, 197, 94, 0.1)'
                  }
                }
              }}
            />
          </Stack>
        )}
      </div>

      {/* Voucher Detail Modal */}
      <Dialog 
        open={detailModalOpen} 
        onClose={handleCloseDetailModal} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 12px 40px rgba(34, 197, 94, 0.2)',
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
            <FaGift style={{ fontSize: '24px' }} />
            <Typography variant="h6" fontWeight="bold">Voucher Details</Typography>
          </Box>
          <IconButton
            onClick={handleCloseDetailModal}
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
        <DialogContent sx={{ 
          pt: 3, 
          pb: 2, 
          px: 3,
          maxHeight: 'calc(90vh - 200px)',
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            width: '0px',
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'transparent',
          },
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}>
          {selectedVoucher ? (
            <Box>
              {/* Voucher Header */}
              <Box sx={{ mb: 3, textAlign: 'center' }}>
                <Typography variant="h4" sx={{ mb: 1, fontWeight: 700, color: '#1a1a1a' }}>
                  {selectedVoucher.customName || selectedVoucher.voucher?.customName || selectedVoucher.voucherInfo?.customName || selectedVoucher.voucher?.name || selectedVoucher.voucherInfo?.name || selectedVoucher.name || 'Voucher'}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6, maxWidth: '600px', mx: 'auto' }}>
                  {selectedVoucher.customDescription || selectedVoucher.voucher?.customDescription || selectedVoucher.voucherInfo?.customDescription || selectedVoucher.voucher?.description || selectedVoucher.voucherInfo?.description || selectedVoucher.description || 'No description'}
                </Typography>
              </Box>

              <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
                {/* QR Code - Centered at top */}
                {selectedVoucher.qrCode && (
                  <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Box sx={{ 
                      p: 2.5, 
                      borderRadius: 3, 
                      backgroundColor: '#f9fafb',
                      textAlign: 'center',
                      border: '2px dashed #22c55e',
                      width: '100%',
                      maxWidth: '300px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      mb: 3
                    }}>
                      <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 600, color: '#22c55e', fontSize: '0.9rem' }}>
                        Scan to Use
                      </Typography>
                      <Box
                        component="img"
                        src={selectedVoucher.qrCode}
                        alt="Voucher QR Code"
                        sx={{
                          width: '180px',
                          height: '180px',
                          objectFit: 'contain',
                          borderRadius: 2,
                          backgroundColor: 'white',
                          p: 1.5,
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                          display: 'block'
                        }}
                      />
                      {selectedVoucher.fullCode && (
                        <Box sx={{ mt: 1.5, p: 1, borderRadius: 2, backgroundColor: 'rgba(34, 197, 94, 0.1)', width: '100%' }}>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontSize: '0.7rem' }}>
                            Voucher Code
                          </Typography>
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              fontWeight: 700, 
                              color: '#22c55e',
                              fontFamily: 'monospace',
                              letterSpacing: 1,
                              fontSize: '0.85rem'
                            }}
                          >
                            {selectedVoucher.fullCode}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Grid>
                )}

                {/* Voucher Details */}
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    {/* Voucher Code (nếu không có QR Code) */}
                    {!selectedVoucher.qrCode && (
                      <>
                        {selectedVoucher.fullCode && (
                          <Grid item xs={12}>
                            <Box sx={{ 
                              p: 3, 
                              borderRadius: 2, 
                              background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)',
                              border: '2px solid #22c55e',
                              textAlign: 'center'
                            }}>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontWeight: 600 }}>
                                Voucher Code
                              </Typography>
                              <Typography 
                                variant="h4" 
                                sx={{ 
                                  fontWeight: 700, 
                                  color: '#22c55e',
                                  fontFamily: 'monospace',
                                  letterSpacing: 2
                                }}
                              >
                                {selectedVoucher.fullCode}
                              </Typography>
                            </Box>
                          </Grid>
                        )}
                        {!selectedVoucher.fullCode && (selectedVoucher.baseCode || selectedVoucher.code) && (
                          <Grid item xs={12}>
                            <Box sx={{ 
                              p: 3, 
                              borderRadius: 2, 
                              background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)',
                              border: '2px solid #22c55e',
                              textAlign: 'center'
                            }}>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontWeight: 600 }}>
                                Base Code
                              </Typography>
                              <Typography 
                                variant="h5" 
                                sx={{ 
                                  fontWeight: 700, 
                                  color: '#22c55e',
                                  fontFamily: 'monospace',
                                  letterSpacing: 1
                                }}
                              >
                                {selectedVoucher.baseCode || selectedVoucher.code}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                This code will be updated after you save the voucher
                              </Typography>
                            </Box>
                          </Grid>
                        )}
                      </>
                    )}

                    {/* Discount & Points Row */}
                    <Grid item xs={12}>
                      <Grid container spacing={2}>
                        {(selectedVoucher.voucher?.discountPercent || selectedVoucher.voucherInfo?.discountPercent || selectedVoucher.discountPercent || selectedVoucher.discount) && (
                          <Grid item xs={6}>
                            <Box sx={{ 
                              p: 2.5, 
                              borderRadius: 2, 
                              background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0.08) 100%)',
                              border: '1px solid rgba(34, 197, 94, 0.3)',
                              textAlign: 'center'
                            }}>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontWeight: 600 }}>
                                Discount
                              </Typography>
                              <Typography variant="h5" sx={{ fontWeight: 700, color: '#22c55e' }}>
                                {selectedVoucher.voucher?.discountPercent || selectedVoucher.voucherInfo?.discountPercent || selectedVoucher.discountPercent || selectedVoucher.discount}%
                              </Typography>
                            </Box>
                          </Grid>
                        )}
                        {(selectedVoucher.rewardPointCost || selectedVoucher.points) && (
                          <Grid item xs={6}>
                            <Box sx={{ 
                              p: 2.5, 
                              borderRadius: 2, 
                              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0.08) 100%)',
                              border: '1px solid rgba(245, 158, 11, 0.3)',
                              textAlign: 'center'
                            }}>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontWeight: 600 }}>
                                Points Required
                              </Typography>
                              <Typography variant="h5" sx={{ fontWeight: 700, color: '#f59e0b' }}>
                                {selectedVoucher.rewardPointCost || selectedVoucher.points}
                              </Typography>
                            </Box>
                          </Grid>
                        )}
                      </Grid>
                    </Grid>

                    {/* Status & Important Info Row */}
                    <Grid item xs={12}>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Box sx={{ 
                            p: 2, 
                            borderRadius: 2, 
                            backgroundColor: 'rgba(0, 0, 0, 0.02)',
                            border: '1px solid #e5e7eb'
                          }}>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontWeight: 600 }}>
                              Status
                            </Typography>
                            <Chip
                              label={selectedVoucher.status === 'used' ? 'Used' : 
                                     selectedVoucher.status === 'expired' ? 'Expired' : 
                                     selectedVoucher.status === 'redeemed' ? 'Available' : 
                                     selectedVoucher.status === 'active' ? 'Active' :
                                     selectedVoucher.status === 'inactive' ? 'Inactive' : 'Available'}
                              size="medium"
                              sx={{
                                backgroundColor: selectedVoucher.status === 'used' ? '#d1fae5' :
                                               selectedVoucher.status === 'expired' ? '#fee2e2' : 
                                               selectedVoucher.status === 'active' ? '#d1fae5' :
                                               selectedVoucher.status === 'redeemed' ? '#d1fae5' :
                                               '#f3f4f6',
                                color: selectedVoucher.status === 'used' ? '#065f46' :
                                      selectedVoucher.status === 'expired' ? '#991b1b' : 
                                      selectedVoucher.status === 'active' ? '#065f46' :
                                      selectedVoucher.status === 'redeemed' ? '#065f46' :
                                      '#374151',
                                fontWeight: 600,
                                fontSize: '0.875rem',
                                height: '28px'
                              }}
                            />
                          </Box>
                        </Grid>
                        {(selectedVoucher.voucherType || selectedVoucher.originalVoucher?.voucherType) && (
                          <Grid item xs={6}>
                            <Box sx={{ 
                              p: 2, 
                              borderRadius: 2, 
                              backgroundColor: 'rgba(0, 0, 0, 0.02)',
                              border: '1px solid #e5e7eb'
                            }}>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontWeight: 600 }}>
                                Voucher Type
                              </Typography>
                              <Chip
                                label={(selectedVoucher.voucherType || selectedVoucher.originalVoucher?.voucherType) === 'business' ? 'Business' : 
                                       (selectedVoucher.voucherType || selectedVoucher.originalVoucher?.voucherType) === 'leaderboard' ? 'Leaderboard' : 
                                       (selectedVoucher.voucherType || selectedVoucher.originalVoucher?.voucherType)}
                                size="medium"
                                sx={{
                                  backgroundColor: (selectedVoucher.voucherType || selectedVoucher.originalVoucher?.voucherType) === 'business' ? '#dbeafe' : '#fef3c7',
                                  color: (selectedVoucher.voucherType || selectedVoucher.originalVoucher?.voucherType) === 'business' ? '#1e40af' : '#92400e',
                                  fontWeight: 600,
                                  fontSize: '0.875rem',
                                  height: '28px',
                                  textTransform: 'capitalize'
                                }}
                              />
                            </Box>
                          </Grid>
                        )}
                        {!selectedVoucher.voucherType && !selectedVoucher.originalVoucher?.voucherType && selectedVoucher.redeemedAt && (
                          <Grid item xs={6}>
                            <Box sx={{ 
                              p: 2, 
                              borderRadius: 2, 
                              backgroundColor: 'rgba(0, 0, 0, 0.02)',
                              border: '1px solid #e5e7eb'
                            }}>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontWeight: 600 }}>
                                Saved At
                              </Typography>
                              <Typography variant="body1" sx={{ fontWeight: 600, color: '#1f2937' }}>
                                {formatDate(selectedVoucher.redeemedAt)}
                              </Typography>
                            </Box>
                          </Grid>
                        )}
                        {selectedVoucher.redeemedAt && (selectedVoucher.voucherType || selectedVoucher.originalVoucher?.voucherType) && (
                          <Grid item xs={12}>
                            <Box sx={{ 
                              p: 2, 
                              borderRadius: 2, 
                              backgroundColor: 'rgba(0, 0, 0, 0.02)',
                              border: '1px solid #e5e7eb'
                            }}>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontWeight: 600 }}>
                                Saved At
                              </Typography>
                              <Typography variant="body1" sx={{ fontWeight: 600, color: '#1f2937' }}>
                                {formatDate(selectedVoucher.redeemedAt)}
                              </Typography>
                            </Box>
                          </Grid>
                        )}
                      </Grid>
                    </Grid>

                    {/* Dates Row */}
                    <Grid item xs={12}>
                      <Grid container spacing={2}>
                        {selectedVoucher.startDate && (
                          <Grid item xs={6}>
                            <Box sx={{ 
                              p: 2, 
                              borderRadius: 2, 
                              backgroundColor: 'rgba(0, 0, 0, 0.02)',
                              border: '1px solid #e5e7eb'
                            }}>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontWeight: 600 }}>
                                Start Date
                              </Typography>
                              <Typography variant="body1" sx={{ fontWeight: 600, color: '#1f2937' }}>
                                {formatDate(selectedVoucher.startDate)}
                              </Typography>
                            </Box>
                          </Grid>
                        )}
                        {(selectedVoucher.expiryDate || selectedVoucher.leaderboardExpireAt || selectedVoucher.voucher?.endDate || selectedVoucher.voucherInfo?.endDate || selectedVoucher.endDate) && (
                          <Grid item xs={6}>
                            <Box sx={{ 
                              p: 2, 
                              borderRadius: 2, 
                              backgroundColor: 'rgba(0, 0, 0, 0.02)',
                              border: '1px solid #e5e7eb'
                            }}>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontWeight: 600 }}>
                                Expiry Date
                              </Typography>
                              <Typography variant="body1" sx={{ fontWeight: 600, color: '#1f2937' }}>
                                {formatDate(selectedVoucher.expiryDate || selectedVoucher.leaderboardExpireAt || selectedVoucher.voucher?.endDate || selectedVoucher.voucherInfo?.endDate || selectedVoucher.endDate)}
                              </Typography>
                            </Box>
                          </Grid>
                        )}
                      </Grid>
                    </Grid>

                    {/* Max Usage and Usage Count */}
                    <Grid item xs={12}>
                      <Grid container spacing={2}>
                        {selectedVoucher.maxUsage && (
                          <Grid item xs={6}>
                            <Box sx={{ 
                              p: 2, 
                              borderRadius: 2, 
                              backgroundColor: 'rgba(0, 0, 0, 0.02)',
                              border: '1px solid #e5e7eb'
                            }}>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontWeight: 600 }}>
                                Max Usage
                              </Typography>
                              <Typography variant="body1" sx={{ fontWeight: 600, color: '#1f2937' }}>
                                {selectedVoucher.maxUsage} time{selectedVoucher.maxUsage > 1 ? 's' : ''}
                              </Typography>
                            </Box>
                          </Grid>
                        )}
                        {(selectedVoucher.redeemedCount !== undefined || selectedVoucher.voucher?.redeemedCount || selectedVoucher.voucherInfo?.redeemedCount) && (
                          <Grid item xs={6}>
                            <Box sx={{ 
                              p: 2, 
                              borderRadius: 2, 
                              backgroundColor: 'rgba(0, 0, 0, 0.02)',
                              border: '1px solid #e5e7eb'
                            }}>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontWeight: 600 }}>
                                Usage Count
                              </Typography>
                              <Typography variant="body1" sx={{ fontWeight: 600, color: '#1f2937' }}>
                                {selectedVoucher.redeemedCount || selectedVoucher.voucher?.redeemedCount || selectedVoucher.voucherInfo?.redeemedCount || 0} time{((selectedVoucher.redeemedCount || selectedVoucher.voucher?.redeemedCount || selectedVoucher.voucherInfo?.redeemedCount || 0) > 1) ? 's' : ''}
                              </Typography>
                            </Box>
                          </Grid>
                        )}
                      </Grid>
                    </Grid>

                    {/* Base Code */}
                    {(selectedVoucher.baseCode || selectedVoucher.voucher?.baseCode || selectedVoucher.voucherInfo?.baseCode) && (
                      <Grid item xs={12}>
                        <Box sx={{ 
                          p: 2, 
                          borderRadius: 2, 
                          backgroundColor: 'rgba(0, 0, 0, 0.02)',
                          border: '1px solid #e5e7eb'
                        }}>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontWeight: 600 }}>
                            Base Code
                          </Typography>
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              fontWeight: 700, 
                              color: '#22c55e',
                              fontFamily: 'monospace',
                              letterSpacing: 1,
                              fontSize: '1rem'
                            }}
                          >
                            {selectedVoucher.baseCode || selectedVoucher.voucher?.baseCode || selectedVoucher.voucherInfo?.baseCode}
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary">No voucher information available</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button 
            onClick={handleCloseDetailModal}
            variant="contained"
            sx={{
              backgroundColor: '#22c55e',
              px: 3,
              py: 1,
              fontSize: '0.9375rem',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: '#16a34a',
              }
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

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
import { Close as CloseIcon } from '@mui/icons-material';
import './Rewards.css';
import toast from 'react-hot-toast';

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

  // Load my vouchers - Load tất cả để có thể filter
  useEffect(() => {
    // Load tất cả vouchers đã redeem (status: redeemed, used, expired)
    // Vì API có thể không hỗ trợ load tất cả, ta sẽ load redeemed và filter client-side
    dispatch(getMyCustomerVouchers({
      status: 'redeemed', // Load redeemed vouchers, sau đó filter client-side
      page: myVouchersPage,
      limit: itemsPerPage * 2, // Load nhiều hơn để có đủ data filter
    }));
  }, [dispatch, myVouchersPage]);

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('vi-VN', {
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
        discountValue = `${voucher.voucher.discountAmount.toLocaleString('vi-VN')}đ`;
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
        originalVoucher: voucher
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
        <div className="loading-state">Đang tải voucher...</div>
      </div>
    );
  }

  return (
    <div className="rewards-page">
      {/* Header Section */}
      <div className="rewards-header">
        <h2 className="rewards-title">
          <FaGift className="rewards-title-icon" />
          Voucher của tôi
        </h2>
        <p className="rewards-subtitle">Quản lý và sử dụng voucher của bạn</p>
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
              Xem ngay
            </Button>
          }
        >
          Bạn có <strong>{expiringCount}</strong> voucher sắp hết hạn trong 7 ngày tới!
        </Alert>
      )}

      {/* My Vouchers Section */}
      <div className="my-vouchers-section">
        <div className="section-header">
          <h3 className="section-title">
            <FaGift className="section-icon" />
            Voucher đã lưu
          </h3>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${myVouchersStatus === 'all' ? 'active' : ''}`}
            onClick={() => handleMyVouchersStatusChange('all')}
          >
            Tất cả
            <span className="tab-count">
              ({myVouchers.length})
            </span>
          </button>
          <button 
            className={`filter-tab ${myVouchersStatus === 'expiring' ? 'active' : ''}`}
            onClick={() => handleMyVouchersStatusChange('expiring')}
          >
            <FaExclamationTriangle style={{ fontSize: '14px' }} />
            Sắp hết hạn
            <span className="tab-count">
              ({expiringCount})
            </span>
          </button>
          <button 
            className={`filter-tab ${myVouchersStatus === 'redeemed' ? 'active' : ''}`}
            onClick={() => handleMyVouchersStatusChange('redeemed')}
          >
            Đã lưu
            <span className="tab-count">
              ({myVouchers.filter(v => v.status === 'redeemed' && !v.isExpired).length})
            </span>
          </button>
          <button 
            className={`filter-tab ${myVouchersStatus === 'used' ? 'active' : ''}`}
            onClick={() => handleMyVouchersStatusChange('used')}
          >
            Đã sử dụng
            <span className="tab-count">
              ({myVouchers.filter(v => v.status === 'used').length})
            </span>
          </button>
          <button 
            className={`filter-tab ${myVouchersStatus === 'expired' ? 'active' : ''}`}
            onClick={() => handleMyVouchersStatusChange('expired')}
          >
            Đã hết hạn
            <span className="tab-count">
              ({myVouchers.filter(v => v.isExpired || v.status === 'expired').length})
            </span>
          </button>
        </div>

        <div className="vouchers-grid">
          {paginatedMyVouchers.length > 0 ? (
            paginatedMyVouchers.map((voucher) => (
              <div 
                key={voucher.id} 
                className={`voucher-card ${voucher.isExpiring ? 'expiring' : ''} ${voucher.isExpired ? 'expired' : ''}`}
                style={{ position: 'relative' }}
              >
                {/* Status Badge */}
                <Chip
                  label={
                    voucher.status === 'used' ? 'Đã sử dụng' : 
                    voucher.isExpired ? 'Đã hết hạn' : 
                    voucher.isExpiring ? 'Sắp hết hạn' : 
                    'Đã lưu'}
                  color={voucher.status === 'used' ? 'success' : voucher.isExpired ? 'error' : voucher.isExpiring ? 'warning' : 'success'}
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    fontWeight: 600,
                    zIndex: 1,
                    backgroundColor: voucher.status === 'used' ? '#22c55e' : 
                                     voucher.isExpired ? '#ef4444' : 
                                     voucher.isExpiring ? '#f59e0b' : 
                                     '#22c55e',
                    color: 'white',
                    fontSize: '0.75rem'
                  }}
                />
                
                {/* Expiring Warning Badge */}
                {voucher.isExpiring && !voucher.isExpired && voucher.status !== 'used' && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      zIndex: 1,
                      backgroundColor: '#fef3c7',
                      color: '#92400e',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <FaExclamationTriangle style={{ fontSize: '12px' }} />
                    {voucher.daysUntilExpiry === 0 ? 'Hết hạn hôm nay' : 
                     voucher.daysUntilExpiry === 1 ? 'Còn 1 ngày' : 
                     `Còn ${voucher.daysUntilExpiry} ngày`}
                  </Box>
                )}

                <div className="voucher-header">
                  <div className="voucher-icon">
                    <FaGift />
                  </div>
                  <div className="voucher-info">
                    <h4 className="voucher-name">{voucher.name}</h4>
                    <p className="voucher-description">
                      {voucher.description || 
                       voucher.originalVoucher?.voucher?.description || 
                       voucher.originalVoucher?.voucherInfo?.description || 
                       voucher.originalVoucher?.description || 
                       'Mô tả voucher'}
                    </p>
                  </div>
                </div>

                <div className="voucher-details">
                  {voucher.code && (
                    <div className="detail-item">
                      <span className="detail-label">Mã voucher:</span>
                      <span className="detail-value code-value">{voucher.code}</span>
                    </div>
                  )}
                  {voucher.discountValue && (
                    <div className="detail-item">
                      <span className="detail-label">Giảm giá:</span>
                      <span className="detail-value" style={{ color: '#2e7d32', fontWeight: 700 }}>{voucher.discountValue}</span>
                    </div>
                  )}
                  <div className="detail-item">
                    <span className="detail-label">Đã lưu:</span>
                    <span className="detail-value">{voucher.redeemedAt}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Hết hạn:</span>
                    <span className={`detail-value ${voucher.isExpiring ? 'expiring-text' : voucher.isExpired ? 'expired-text' : ''}`}>
                      {voucher.expiry}
                      {voucher.daysUntilExpiry !== null && !voucher.isExpired && (
                        <span style={{ marginLeft: '8px', fontSize: '0.85em', color: voucher.isExpiring ? '#f59e0b' : '#6b7280' }}>
                          ({voucher.daysUntilExpiry === 0 ? 'Hôm nay' : 
                            voucher.daysUntilExpiry === 1 ? '1 ngày nữa' : 
                            `${voucher.daysUntilExpiry} ngày nữa`})
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                <div className="voucher-footer">
                  <div className="voucher-actions" style={{ width: '100%', justifyContent: 'flex-end' }}>
                    <button 
                      className="btn-view-detail"
                      onClick={() => handleViewDetail(voucher)}
                    >
                      <BiDetail />
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <FaGift className="empty-icon" />
              <p>Bạn chưa có voucher nào</p>
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
            <Typography variant="h6" fontWeight="bold">Chi tiết Voucher</Typography>
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
        <DialogContent sx={{ pt: 3, pb: 2, px: 3 }}>
          {selectedVoucher ? (
            <Box>
              {/* Voucher Header */}
              <Box sx={{ mb: 3, textAlign: 'center' }}>
                <Typography variant="h4" sx={{ mb: 1, fontWeight: 700, color: '#1a1a1a' }}>
                  {selectedVoucher.voucher?.name || selectedVoucher.voucherInfo?.name || selectedVoucher.name || selectedVoucher.customName || 'Voucher'}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6, maxWidth: '600px', mx: 'auto' }}>
                  {selectedVoucher.voucher?.description || selectedVoucher.voucherInfo?.description || selectedVoucher.description || selectedVoucher.customDescription || 'No description'}
                </Typography>
              </Box>

              <Grid container spacing={3}>
                {/* Left Column - QR Code (nếu có) */}
                {selectedVoucher.qrCode && (
                  <Grid item xs={12} md={5}>
                    <Box sx={{ 
                      p: 2.5, 
                      borderRadius: 3, 
                      backgroundColor: '#f9fafb',
                      textAlign: 'center',
                      border: '2px dashed #22c55e',
                      position: 'sticky',
                      top: 20
                    }}>
                      <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 600, color: '#22c55e', fontSize: '1rem' }}>
                        Quét để sử dụng
                      </Typography>
                      <Box
                        component="img"
                        src={selectedVoucher.qrCode}
                        alt="Voucher QR Code"
                        sx={{
                          width: '100%',
                          maxWidth: '200px',
                          height: 'auto',
                          borderRadius: 2,
                          backgroundColor: 'white',
                          p: 1.5,
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                          mx: 'auto',
                          display: 'block'
                        }}
                      />
                      {selectedVoucher.fullCode && (
                        <Box sx={{ mt: 2, p: 1.5, borderRadius: 2, backgroundColor: 'rgba(34, 197, 94, 0.1)' }}>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontSize: '0.7rem' }}>
                            Mã Voucher
                          </Typography>
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              fontWeight: 700, 
                              color: '#22c55e',
                              fontFamily: 'monospace',
                              letterSpacing: 1,
                              fontSize: '0.95rem'
                            }}
                          >
                            {selectedVoucher.fullCode}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Grid>
                )}

                {/* Right Column - Voucher Details */}
                <Grid item xs={12} md={selectedVoucher.qrCode ? 7 : 12}>
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
                                Mã Voucher
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
                                Mã cơ sở
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
                                Mã này sẽ được cập nhật sau khi bạn lưu voucher
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
                                Giảm giá
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
                                Điểm yêu cầu
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
                              Trạng thái
                            </Typography>
                            <Chip
                              label={selectedVoucher.status === 'used' ? 'Đã sử dụng' : 
                                     selectedVoucher.status === 'expired' ? 'Đã hết hạn' : 
                                     selectedVoucher.status === 'redeemed' ? 'Đã lưu' : 
                                     selectedVoucher.status === 'active' ? 'Hoạt động' :
                                     selectedVoucher.status === 'inactive' ? 'Không hoạt động' : 'Có sẵn'}
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
                        {selectedVoucher.redeemedAt && (
                          <Grid item xs={6}>
                            <Box sx={{ 
                              p: 2, 
                              borderRadius: 2, 
                              backgroundColor: 'rgba(0, 0, 0, 0.02)',
                              border: '1px solid #e5e7eb'
                            }}>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontWeight: 600 }}>
                                Đã lưu lúc
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
                                Ngày bắt đầu
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
                                Hết hạn
                              </Typography>
                              <Typography variant="body1" sx={{ fontWeight: 600, color: '#1f2937' }}>
                                {formatDate(selectedVoucher.expiryDate || selectedVoucher.leaderboardExpireAt || selectedVoucher.voucher?.endDate || selectedVoucher.voucherInfo?.endDate || selectedVoucher.endDate)}
                              </Typography>
                            </Box>
                          </Grid>
                        )}
                      </Grid>
                    </Grid>

                    {/* Max Usage */}
                    {selectedVoucher.maxUsage && (
                      <Grid item xs={12}>
                        <Box sx={{ 
                          p: 2, 
                          borderRadius: 2, 
                          backgroundColor: 'rgba(0, 0, 0, 0.02)',
                          border: '1px solid #e5e7eb'
                        }}>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontWeight: 600 }}>
                            Số lần sử dụng tối đa
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 600, color: '#1f2937' }}>
                            {selectedVoucher.maxUsage} lần
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
              <Typography color="text.secondary">Không có thông tin voucher</Typography>
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
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

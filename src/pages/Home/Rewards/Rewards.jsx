import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getCustomerVouchers, 
  getMyCustomerVouchers, 
  redeemCustomerVoucher 
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
  Grid
} from '@mui/material';
import { FaGift, FaHistory, FaClock } from 'react-icons/fa';
import { IoIosSearch } from 'react-icons/io';
import { BiDetail } from 'react-icons/bi';
import { Close as CloseIcon } from '@mui/icons-material';
import './Rewards.css';
import toast from 'react-hot-toast';

export default function Rewards() {
  const dispatch = useDispatch();
  const { 
    customerVouchers,
    customerVoucherPagination,
    myCustomerVouchers,
    myCustomerVoucherPagination,
    isLoading 
  } = useSelector(state => state.vouchers);
  const { userInfo } = useSelector(state => state.user);

  const [filter, setFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('active'); // active, inactive, expired
  const [currentPage, setCurrentPage] = useState(1);
  const [myVouchersPage, setMyVouchersPage] = useState(1);
  const [myVouchersStatus, setMyVouchersStatus] = useState('redeemed'); // redeemed, used, expired
  const [voucherTypeFilter, setVoucherTypeFilter] = useState(''); // business, leaderboard
  const itemsPerPage = 4;
  
  // Modal state
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  // User reward points
  const userPoints = userInfo?.rewardPoints || 0;

  // Mock points history
  const pointsHistory = [
    { id: 1, action: 'On-time return', date: '8/11/2024', points: '+5' },
    { id: 2, action: 'First time user bonus', date: '8/11/2024', points: '+10' }
  ];

  // Load available vouchers
  useEffect(() => {
    dispatch(getCustomerVouchers({
      status: statusFilter,
      page: currentPage,
      limit: itemsPerPage,
    }));
  }, [dispatch, statusFilter, currentPage]);

  // Load my vouchers - Load tất cả để kiểm tra redeemed status
  useEffect(() => {
    // Load tất cả redeemed vouchers để so sánh với available vouchers
    dispatch(getMyCustomerVouchers({
      voucherType: undefined, // Load tất cả types
      status: 'redeemed', // Chỉ cần redeemed để check
      page: 1,
      limit: 100, // Load nhiều để đảm bảo có đủ data
    }));
  }, [dispatch]);

  // Load my vouchers theo filter (cho section My Vouchers)
  useEffect(() => {
    dispatch(getMyCustomerVouchers({
      voucherType: voucherTypeFilter || undefined,
      status: myVouchersStatus,
      page: myVouchersPage,
      limit: itemsPerPage,
    }));
  }, [dispatch, myVouchersStatus, myVouchersPage, voucherTypeFilter]);

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

  // Transform available vouchers from API
  const availableVouchers = useMemo(() => {
    if (!customerVouchers || customerVouchers.length === 0) return [];
    
    // Lấy danh sách voucher IDs đã redeem từ myCustomerVouchers
    // So sánh bằng cách lấy voucherId/templateVoucherId từ my vouchers và so với _id của available vouchers
    const redeemedVoucherIds = new Set();
    (myCustomerVouchers || []).forEach(v => {
      // Lấy voucherId từ các field khác nhau trong my vouchers
      // templateVoucherId là ID của voucher template (available voucher)
      const redeemedId = v.templateVoucherId || v.voucherId || v.voucher?._id || v.voucherInfo?._id;
      if (redeemedId) {
        redeemedVoucherIds.add(String(redeemedId));
      }
    });
    
    return customerVouchers.map(voucher => {
      // Determine discount value
      let discountValue = '';
      if (voucher.discountPercent) {
        discountValue = `${voucher.discountPercent}%`;
      } else if (voucher.discountAmount) {
        discountValue = `${voucher.discountAmount.toLocaleString('vi-VN')}đ`;
      } else if (voucher.discount) {
        discountValue = `${voucher.discount}%`;
      }

      const voucherId = String(voucher._id || voucher.id);
      // Kiểm tra xem voucher này đã được redeem chưa
      const isRedeemed = redeemedVoucherIds.has(voucherId);

      return {
        id: voucherId,
        name: voucher.name || voucher.customName,
        discount: voucher.discountPercent || voucher.discount || 0,
        discountValue: discountValue,
        description: voucher.description || voucher.customDescription || `Get ${discountValue} off on your purchase`,
        points: voucher.rewardPointCost || 0,
        code: voucher.baseCode || '',
        expiry: formatDate(voucher.endDate),
        maxUsage: voucher.maxUsage,
        isRedeemed: isRedeemed, // Thêm flag để biết đã redeem chưa
        originalVoucher: voucher
      };
    });
  }, [customerVouchers, myCustomerVouchers]);

  // Transform my vouchers from API
  const redeemedVouchers = useMemo(() => {
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

      return {
        id: voucher._id || voucher.id,
        name: voucher.voucher?.name || voucher.voucherInfo?.name || voucher.name || 'Voucher',
        code: voucher.fullCode || voucher.code || voucher.voucherCode || '',
        discount: voucher.voucher?.discountPercent || voucher.voucherInfo?.discountPercent || voucher.discountPercent || 0,
        discountValue: discountValue,
        redeemedAt: formatDate(voucher.redeemedAt || voucher.createdAt),
        expiry: formatDate(voucher.expiryDate || voucher.leaderboardExpireAt || voucher.voucher?.endDate || voucher.voucherInfo?.endDate),
        status: voucher.status === 'used' ? 'Used' : voucher.status === 'expired' ? 'Expired' : 'Available',
        qrCode: voucher.qrCode || '',
        description: voucher.voucher?.description || voucher.voucherInfo?.description || '',
        originalVoucher: voucher
      };
    });
  }, [myCustomerVouchers]);

  // Filter vouchers (client-side filtering for display)
  const filteredVouchers = useMemo(() => {
    switch(filter) {
      case 'All':
        return availableVouchers;
      case 'Get Voucher':
        return availableVouchers.filter(v => userPoints >= v.points);
      case 'Used More Points':
        return availableVouchers.filter(v => userPoints < v.points);
      case 'Redeemed':
        return [];
      case 'Expired':
        return [];
      default:
        return availableVouchers;
    }
  }, [filter, availableVouchers, userPoints]);

  // Pagination from API
  const totalPages = customerVoucherPagination?.totalPages || 1;
  const paginatedVouchers = filteredVouchers;

  const myVouchersTotalPages = myCustomerVoucherPagination?.totalPages || 1;
  const paginatedMyVouchers = redeemedVouchers;

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleMyVouchersPageChange = (event, newPage) => {
    setMyVouchersPage(newPage);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (newStatus) => {
    setStatusFilter(newStatus);
    setCurrentPage(1);
  };

  const handleMyVouchersStatusChange = (newStatus) => {
    setMyVouchersStatus(newStatus);
    setMyVouchersPage(1);
  };

  const handleRedeem = async (voucher) => {
    if (userPoints < voucher.points) {
      toast.error(`You need ${voucher.points - userPoints} more points to redeem this voucher`);
      return;
    }

    const voucherId = voucher.originalVoucher?._id || voucher.originalVoucher?.id || voucher.id;
    if (!voucherId) {
      toast.error('Không tìm thấy voucher ID');
      return;
    }

    try {
      const result = await dispatch(redeemCustomerVoucher({ voucherId })).unwrap();
      // Lấy voucher đã redeem từ response
      const redeemedVoucherData = result?.data || result;
      
      // Refresh both lists after redeem
      await Promise.all([
        dispatch(getCustomerVouchers({
          status: statusFilter,
          page: currentPage,
          limit: itemsPerPage,
        })),
        dispatch(getMyCustomerVouchers({
          voucherType: voucherTypeFilter || undefined,
          status: myVouchersStatus,
          page: myVouchersPage,
          limit: itemsPerPage,
        }))
      ]);
      
      // Hiển thị modal với thông tin voucher đã redeem
      if (redeemedVoucherData) {
        setSelectedVoucher(redeemedVoucherData);
        setDetailModalOpen(true);
      }
    } catch (error) {
      // Error is handled by the thunk
    }
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
        <div className="loading-state">Loading rewards...</div>
      </div>
    );
  }

  return (
    <div className="rewards-page">
      {/* Reward Points Header */}
      <div className="reward-points-header">
        <div className="reward-icon">
          <FaGift />
        </div>
        <div className="reward-points-info">
          <h2 className="reward-title">Reward Points</h2>
          <p className="reward-subtitle">Earn points for every on-time return and redeem for rewards!</p>
        </div>
        <div className="points-display">
          <div className="points-number">{userPoints}</div>
          <div className="points-label">Available Points</div>
        </div>
      </div>

      {/* Available Vouchers Section */}
      <div className="vouchers-section">
        <h3 className="section-title">
          <FaGift className="section-icon" />
          Available Vouchers
        </h3>
        <p className="section-subtitle">Redeem your best redeemable vouchers</p>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          {['All', 'Get Voucher', 'Used More Points'].map((tab) => (
            <button
              key={tab}
              className={`filter-tab ${filter === tab ? 'active' : ''}`}
              onClick={() => handleFilterChange(tab)}
            >
              {tab}
              <span className="tab-count">
                ({tab === 'All' ? availableVouchers.length : 
                  tab === 'Get Voucher' ? availableVouchers.filter(v => userPoints >= v.points).length :
                  tab === 'Used More Points' ? availableVouchers.filter(v => userPoints < v.points).length : 0})
              </span>
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>Status:</Typography>
          <Chip
            label="Active"
            onClick={() => handleStatusFilterChange('active')}
            color={statusFilter === 'active' ? 'success' : 'default'}
            size="small"
            sx={{ 
              cursor: 'pointer',
              backgroundColor: statusFilter === 'active' ? '#22c55e' : undefined,
              color: statusFilter === 'active' ? 'white' : undefined,
              '&:hover': {
                backgroundColor: statusFilter === 'active' ? '#16a34a' : undefined
              }
            }}
          />
          <Chip
            label="Inactive"
            onClick={() => handleStatusFilterChange('inactive')}
            color={statusFilter === 'inactive' ? 'success' : 'default'}
            size="small"
            sx={{ 
              cursor: 'pointer',
              backgroundColor: statusFilter === 'inactive' ? '#22c55e' : undefined,
              color: statusFilter === 'inactive' ? 'white' : undefined,
              '&:hover': {
                backgroundColor: statusFilter === 'inactive' ? '#16a34a' : undefined
              }
            }}
          />
          <Chip
            label="Expired"
            onClick={() => handleStatusFilterChange('expired')}
            color={statusFilter === 'expired' ? 'success' : 'default'}
            size="small"
            sx={{ 
              cursor: 'pointer',
              backgroundColor: statusFilter === 'expired' ? '#22c55e' : undefined,
              color: statusFilter === 'expired' ? 'white' : undefined,
              '&:hover': {
                backgroundColor: statusFilter === 'expired' ? '#16a34a' : undefined
              }
            }}
          />
        </Box>

        {/* Vouchers Grid */}
        <div className="vouchers-grid">
          {paginatedVouchers.length > 0 ? (
            paginatedVouchers.map((voucher) => (
              <div 
                key={voucher.id} 
                className={`voucher-card ${voucher.isRedeemed ? 'redeemed' : ''}`}
                style={{
                  opacity: voucher.isRedeemed ? 0.8 : 1,
                  position: 'relative'
                }}
              >
                {voucher.isRedeemed && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      zIndex: 1
                    }}
                  >
                    <Chip
                      label="Redeemed"
                      size="small"
                      sx={{
                        backgroundColor: '#22c55e',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        boxShadow: '0 2px 8px rgba(34, 197, 94, 0.3)'
                      }}
                    />
                  </Box>
                )}
                <div className="voucher-header">
                  <div className="voucher-icon">
                    <FaGift />
                  </div>
                  <div className="voucher-info">
                    <h4 className="voucher-name">{voucher.name}</h4>
                    <p className="voucher-description">{voucher.description}</p>
                  </div>
                </div>

                <div className="voucher-details">
                  {voucher.code && (
                    <div className="detail-item">
                      <span className="detail-label">Code:</span>
                      <span className="detail-value code-value">{voucher.code}</span>
                    </div>
                  )}
                  <div className="detail-item">
                    <span className="detail-label">Expires:</span>
                    <span className="detail-value">{voucher.expiry}</span>
                  </div>
                  {voucher.discountValue && (
                    <div className="detail-item">
                      <span className="detail-label">Giảm giá:</span>
                      <span className="detail-value" style={{ color: '#2e7d32', fontWeight: 700 }}>{voucher.discountValue}</span>
                    </div>
                  )}
                </div>

                <div className="voucher-footer">
                  <div className="points-required">
                    <FaGift className="points-icon" />
                    <span className="points-text">{voucher.points} points</span>
                  </div>
                  <div className="voucher-actions">
                    <button 
                      className="btn-view-detail"
                      onClick={() => handleViewDetail(voucher)}
                    >
                      <BiDetail />
                      View Detail
                    </button>
                    {voucher.isRedeemed ? (
                      <button 
                        className="btn-redeem disabled"
                        disabled
                        style={{
                          backgroundColor: '#d1d5db',
                          color: '#6b7280',
                          cursor: 'not-allowed',
                          opacity: 0.6
                        }}
                      >
                        Redeemed
                      </button>
                    ) : (
                      <button 
                        className={`btn-redeem ${userPoints >= voucher.points ? '' : 'disabled'}`}
                        onClick={() => handleRedeem(voucher)}
                        disabled={userPoints < voucher.points || voucher.isRedeemed}
                      >
                        Redeem
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <FaGift className="empty-icon" />
              <p>No vouchers available</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Stack spacing={2} className="pagination-container">
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
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

      {/* My Vouchers Section */}
      <div className="my-vouchers-section">
        <h3 className="section-title">
          <FaGift className="section-icon" />
          My Vouchers
        </h3>
        <p className="section-subtitle">See your best redeemable vouchers</p>

        <div className="filter-tabs">
          <button 
            className={`filter-tab ${myVouchersStatus === 'redeemed' ? 'active' : ''}`}
            onClick={() => handleMyVouchersStatusChange('redeemed')}
          >
            Redeemed
            <span className="tab-count">
              ({myVouchersStatus === 'redeemed' ? redeemedVouchers.length : 0})
            </span>
          </button>
          <button 
            className={`filter-tab ${myVouchersStatus === 'used' ? 'active' : ''}`}
            onClick={() => handleMyVouchersStatusChange('used')}
          >
            Used
            <span className="tab-count">
              ({myVouchersStatus === 'used' ? redeemedVouchers.length : 0})
            </span>
          </button>
          <button 
            className={`filter-tab ${myVouchersStatus === 'expired' ? 'active' : ''}`}
            onClick={() => handleMyVouchersStatusChange('expired')}
          >
            Expired
            <span className="tab-count">
              ({myVouchersStatus === 'expired' ? redeemedVouchers.length : 0})
            </span>
          </button>
        </div>

        {/* Voucher Type Filter */}
        <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>Voucher Type:</Typography>
          <Chip
            label="All"
            onClick={() => setVoucherTypeFilter('')}
            color={voucherTypeFilter === '' ? 'success' : 'default'}
            size="small"
            sx={{ 
              cursor: 'pointer',
              backgroundColor: voucherTypeFilter === '' ? '#22c55e' : undefined,
              color: voucherTypeFilter === '' ? 'white' : undefined,
              '&:hover': {
                backgroundColor: voucherTypeFilter === '' ? '#16a34a' : undefined
              }
            }}
          />
          <Chip
            label="Business"
            onClick={() => setVoucherTypeFilter('business')}
            color={voucherTypeFilter === 'business' ? 'success' : 'default'}
            size="small"
            sx={{ 
              cursor: 'pointer',
              backgroundColor: voucherTypeFilter === 'business' ? '#22c55e' : undefined,
              color: voucherTypeFilter === 'business' ? 'white' : undefined,
              '&:hover': {
                backgroundColor: voucherTypeFilter === 'business' ? '#16a34a' : undefined
              }
            }}
          />
          <Chip
            label="Leaderboard"
            onClick={() => setVoucherTypeFilter('leaderboard')}
            color={voucherTypeFilter === 'leaderboard' ? 'success' : 'default'}
            size="small"
            sx={{ 
              cursor: 'pointer',
              backgroundColor: voucherTypeFilter === 'leaderboard' ? '#22c55e' : undefined,
              color: voucherTypeFilter === 'leaderboard' ? 'white' : undefined,
              '&:hover': {
                backgroundColor: voucherTypeFilter === 'leaderboard' ? '#16a34a' : undefined
              }
            }}
          />
        </Box>

        <div className="vouchers-grid">
          {paginatedMyVouchers.length > 0 ? (
            paginatedMyVouchers.map((voucher) => (
              <div 
                key={voucher.id} 
                className="voucher-card"
                style={{ position: 'relative' }}
              >
                <Chip
                  label={voucher.status === 'Used' ? 'Used' : voucher.status === 'Expired' ? 'Expired' : 'Redeemed'}
                  color={voucher.status === 'Used' ? 'success' : voucher.status === 'Expired' ? 'error' : 'success'}
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    fontWeight: 600,
                    zIndex: 1,
                    backgroundColor: voucher.status === 'Used' ? '#22c55e' : voucher.status === 'Expired' ? '#ef4444' : '#22c55e',
                    color: 'white'
                  }}
                />
                <div className="voucher-header">
                  <div className="voucher-icon">
                    <FaGift />
                  </div>
                  <div className="voucher-info">
                    <h4 className="voucher-name">{voucher.name}</h4>
                    <p className="voucher-description">
                      {voucher.originalVoucher?.voucher?.description || 
                       voucher.originalVoucher?.voucherInfo?.description || 
                       voucher.originalVoucher?.description || 
                       voucher.description || 
                       'Voucher description'}
                    </p>
                  </div>
                </div>

                <div className="voucher-details">
                  {voucher.code && (
                    <div className="detail-item">
                      <span className="detail-label">Code:</span>
                      <span className="detail-value code-value">{voucher.code}</span>
                    </div>
                  )}
                  {voucher.discountValue && (
                    <div className="detail-item">
                      <span className="detail-label">Discount:</span>
                      <span className="detail-value" style={{ color: '#2e7d32', fontWeight: 700 }}>{voucher.discountValue}</span>
                    </div>
                  )}
                  <div className="detail-item">
                    <span className="detail-label">Redeemed:</span>
                    <span className="detail-value">{voucher.redeemedAt}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Expires:</span>
                    <span className="detail-value">{voucher.expiry}</span>
                  </div>
                </div>

                <div className="voucher-footer">
                  <div className="voucher-actions" style={{ width: '100%', justifyContent: 'flex-end' }}>
                    <button 
                      className="btn-view-detail"
                      onClick={() => handleViewDetail(voucher)}
                    >
                      <BiDetail />
                      View Detail
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <FaGift className="empty-icon" />
              <p>You don't have any vouchers</p>
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

      {/* Points History Section */}
      <div className="points-history-section">
        <h3 className="section-title">
          <FaHistory className="section-icon" />
          Points History
        </h3>
        <p className="section-subtitle">Redeem points earned</p>

        <div className="history-list">
          {pointsHistory.map((item) => (
            <div key={item.id} className="history-item">
              <div className="history-info">
                <h4 className="history-action">{item.action}</h4>
                <p className="history-date">
                  <FaClock className="clock-icon" />
                  {item.date}
                </p>
              </div>
              <div className={`history-points ${item.points.startsWith('+') ? 'positive' : 'negative'}`}>
                {item.points}
              </div>
            </div>
          ))}
        </div>

        <div className="pagination-info">
          Page 1 of 2
          <button className="btn-next">Next &gt;</button>
        </div>
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
                        Scan to Use
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
                            Voucher Code
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
                                This code will be updated after you redeem the voucher
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
                                     selectedVoucher.status === 'redeemed' ? 'Redeemed' : 
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
                        {selectedVoucher.redeemedAt && (
                          <Grid item xs={6}>
                            <Box sx={{ 
                              p: 2, 
                              borderRadius: 2, 
                              backgroundColor: 'rgba(0, 0, 0, 0.02)',
                              border: '1px solid #e5e7eb'
                            }}>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontWeight: 600 }}>
                                Redeemed At
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
                                Expires
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
                            Max Usage
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 600, color: '#1f2937' }}>
                            {selectedVoucher.maxUsage} times
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
              <Typography color="text.secondary">No voucher details available</Typography>
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

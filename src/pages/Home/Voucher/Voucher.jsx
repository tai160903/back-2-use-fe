import { Typography, Pagination, Stack, Tabs, Tab, Box } from '@mui/material'
import React, { useState, useMemo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
  getCustomerVouchers, 
  getMyCustomerVouchers, 
  redeemCustomerVoucher 
} from '../../../store/slices/voucherSlice'
import { switchAccountTypeAPI } from '../../../store/slices/authSlice'
import { getUserRole, getCurrentUser, getTokenRole } from '../../../utils/authUtils'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination as SwiperPagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import './Voucher.css'
import toast from 'react-hot-toast'

// Helper function to format date
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


export default function Voucher() {
  const dispatch = useDispatch();
  const { 
    customerVouchers, 
    customerVoucherPagination,
    myCustomerVouchers,
    myCustomerVoucherPagination,
    isLoading 
  } = useSelector(state => state.vouchers);

  // State cho tab, filter và pagination
  const [activeTab, setActiveTab] = useState(0); // 0: All Vouchers, 1: My Vouchers
  const [statusFilter, setStatusFilter] = useState(''); // '', active, inactive, expired
  const [voucherTypeFilter, setVoucherTypeFilter] = useState(''); // business, leaderboard
  const [currentPage, setCurrentPage] = useState(1);
  const [myVouchersPage, setMyVouchersPage] = useState(1);
  const vouchersPerPage = 10;

  // Check and sync role if mismatch
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const tokenRole = getTokenRole();
    const userRole = getUserRole(); // Ưu tiên role từ user object
    
    // Nếu role trong token khác với role trong user object, cần switch
    if (userRole && tokenRole && tokenRole !== userRole) {
      console.log(`Role mismatch detected. Token: ${tokenRole}, User: ${userRole}. Switching to ${userRole}...`);
      dispatch(switchAccountTypeAPI({ role: userRole })).then((result) => {
        if (switchAccountTypeAPI.fulfilled.match(result)) {
          console.log('Role switched successfully');
          // Reload page to refresh token
          window.location.reload();
        }
      });
    }
  }, [dispatch]);

  // Load customer vouchers (All Vouchers)
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    // Chỉ gọi API nếu đang ở customer mode
    const tokenRole = getUserRole();
    if (tokenRole !== 'customer') {
      console.warn('Not in customer mode, skipping voucher load');
      return;
    }
    
    dispatch(getCustomerVouchers({
      status: statusFilter || undefined, // Don't send status if empty
      page: currentPage,
      limit: vouchersPerPage,
    })).catch((error) => {
      console.error('Error loading customer vouchers:', error);
      if (error?.response?.status === 403) {
        // Nếu bị 403, có thể role chưa sync, thử switch lại
        const userRole = currentUser.user?.role?.trim().toLowerCase();
        if (userRole === 'customer') {
          dispatch(switchAccountTypeAPI({ role: 'customer' })).then(() => {
            window.location.reload();
          });
        } else {
          toast.error('Bạn không có quyền truy cập. Vui lòng đăng nhập lại.');
        }
      }
    });
  }, [dispatch, statusFilter, currentPage]);

  // Load my customer vouchers
  useEffect(() => {
    if (activeTab === 1) {
      dispatch(getMyCustomerVouchers({
        voucherType: voucherTypeFilter || undefined,
        status: 'redeemed', // redeemed, used, expired
        page: myVouchersPage,
        limit: vouchersPerPage,
      }));
    }
  }, [dispatch, activeTab, voucherTypeFilter, myVouchersPage]);

  // Transform API data to match component format
  const transformedVouchers = useMemo(() => {
    const vouchers = activeTab === 0 ? customerVouchers : myCustomerVouchers;
    console.log('Raw vouchers data:', vouchers);
    if (!vouchers || vouchers.length === 0) {
      console.log('No vouchers found or empty array');
      return [];
    }
    
    const transformed = vouchers.map((voucher, index) => {
      // Determine discount value
      let value = '';
      if (voucher.discountPercent) {
        value = `${voucher.discountPercent}%`;
      } else if (voucher.discountAmount) {
        value = `${voucher.discountAmount.toLocaleString('vi-VN')}đ`;
      } else if (voucher.discount) {
        value = `${voucher.discount}%`;
      }

      // Determine status for UI
      let status = 'available';
      if (activeTab === 1) {
        // My vouchers
        if (voucher.status === 'used') status = 'collected';
        else if (voucher.status === 'expired') status = 'unavailable';
        else if (voucher.status === 'redeemed') status = 'available';
      } else {
        // All vouchers
        if (voucher.status === 'inactive') status = 'unavailable';
        else if (voucher.status === 'expired') status = 'unavailable';
        else if (voucher.status === 'active') status = 'available';
      }

      return {
        id: voucher._id || voucher.id,
        type: voucher.voucherType === 'leaderboard' ? 'exclusive' : 'regular',
        rank: voucher.voucherType === 'leaderboard' && index < 10 ? `Top ${index + 1}` : null,
        title: voucher.customName || voucher.name || voucher.voucher?.name || 'Voucher',
        value: value,
        description: voucher.customDescription || voucher.description || voucher.voucher?.description || 'Voucher description',
        points: voucher.rewardPointCost || voucher.voucher?.rewardPointCost || 0,
        code: voucher.baseCode || voucher.code || voucher.voucher?.baseCode || '',
        expiry: formatDate(voucher.endDate || voucher.voucher?.endDate || voucher.expiryDate),
        status: status,
        originalVoucher: voucher
      };
    });
    console.log('Transformed vouchers:', transformed);
    return transformed;
  }, [customerVouchers, myCustomerVouchers, activeTab]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setCurrentPage(1);
    setMyVouchersPage(1);
  };

  // Handle status filter change (for All Vouchers)
  const handleStatusFilterChange = (newStatus) => {
    setStatusFilter(newStatus);
    setCurrentPage(1);
  };

  // Handle voucher type filter change (for My Vouchers)
  const handleVoucherTypeFilterChange = (newType) => {
    setVoucherTypeFilter(newType);
    setMyVouchersPage(1);
  };

  // Handle page change
  const handlePageChange = (event, newPage) => {
    if (activeTab === 0) {
      setCurrentPage(newPage);
    } else {
      setMyVouchersPage(newPage);
    }
  };

  // Handle redeem voucher
  const handleRedeemVoucher = async (voucher) => {
    const voucherId = voucher.originalVoucher?._id || voucher.originalVoucher?.id || voucher.id;
    if (!voucherId) {
      toast.error('Không tìm thấy voucher ID');
      return;
    }

    try {
      await dispatch(redeemCustomerVoucher({ voucherId })).unwrap();
      // Refresh my vouchers after redeem
      if (activeTab === 1) {
        dispatch(getMyCustomerVouchers({
          voucherType: voucherTypeFilter || undefined,
          status: 'redeemed',
          page: myVouchersPage,
          limit: vouchersPerPage,
        }));
      }
      // Refresh all vouchers
      dispatch(getCustomerVouchers({
        status: statusFilter,
        page: currentPage,
        limit: vouchersPerPage,
      }));
    } catch (error) {
      // Error is handled by the thunk
    }
  };

  // Get pagination info
  const pagination = activeTab === 0 ? customerVoucherPagination : myCustomerVoucherPagination;
  const totalPages = pagination?.totalPages || 1;

  // Get top featured vouchers (first 10 or exclusive ones)
  const featuredVouchers = useMemo(() => {
    if (activeTab === 1) return []; // Don't show featured in My Vouchers
    return transformedVouchers.filter(v => v.type === 'exclusive').slice(0, 10);
  }, [transformedVouchers, activeTab]);

  // Render voucher card
  const renderVoucherCard = (voucher) => {
    const isExclusive = voucher.rank !== null
    const isCollected = voucher.status === 'collected'
    const isUnavailable = voucher.status === 'unavailable'

    return (
      <div 
        key={voucher.id} 
        className={`voucher-grid-card ${isUnavailable || isCollected ? 'unavailable' : ''} ${isExclusive ? 'exclusive' : 'regular'}`}
      >
        {isExclusive && (
          <div className='voucher-category-badge'>
            <span className='crown-icon'>👑</span>
            <span>EXCLUSIVE - TOP 50</span>
          </div>
        )}
        
        <div className='voucher-grid-content'>
          <div className='voucher-grid-title'>{voucher.title}</div>
          <div className='voucher-grid-value'>{voucher.value}</div>
          <div className='voucher-grid-description'>{voucher.description}</div>
          {activeTab === 0 && voucher.points > 0 && (
            <div className='voucher-grid-points'>{voucher.points} points</div>
          )}
          {voucher.code && (
            <div className='voucher-grid-code'>
              <span className='code-icon'>📄</span>
              <span>{voucher.code}</span>
            </div>
          )}
          <div className='voucher-grid-expiry'>Expires: {voucher.expiry}</div>
          
          <div className='voucher-grid-actions'>
            {activeTab === 1 ? (
              // My Vouchers tab
              isCollected ? (
                <div className='collected-text'>
                  <span className='check-icon'>✓</span>
                  <span>Đã sử dụng</span>
                </div>
              ) : isUnavailable ? (
                <div className='unavailable-text'>
                  <span className='lock-icon'>🔒</span>
                  <span>Đã hết hạn</span>
                </div>
              ) : (
                <div className='collected-text'>
                  <span className='check-icon'>✓</span>
                  <span>Đã đổi</span>
                </div>
              )
            ) : (
              // All Vouchers tab
              isCollected ? (
                <div className='collected-text'>
                  <span className='check-icon'>✓</span>
                  <span>Đã đổi</span>
                </div>
              ) : isUnavailable ? (
                <div className='unavailable-text'>
                  <span className='lock-icon'>🔒</span>
                  <span>Không khả dụng</span>
                </div>
              ) : (
                <button 
                  className='btn-collect'
                  onClick={() => handleRedeemVoucher(voucher)}
                  disabled={isLoading}
                >
                  {isLoading ? 'Đang xử lý...' : 'Đổi ngay'}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    )
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className='vouchers-page'>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '400px',
          fontSize: '18px',
          color: '#666'
        }}>
          Loading vouchers...
        </div>
      </div>
    );
  }

  return (
    <>
    <div className='vouchers-page'>
        <div className='vouchers-banner'>
        </div>
        
        {/* Featured Vouchers Carousel - Only show in All Vouchers tab */}
        {activeTab === 0 && (
          <div className='vouchers-carousel'>
            <div className='vouchers-header'>
              <Typography variant='h2' className='vouchers-carousel-title'>
                Voucher Nổi Bật
              </Typography>
              <span className='vouchers-carousel-subtitle'>
                Khám phá các voucher độc quyền dành cho top 50 thành viên
              </span>
            </div>

            <div className='vouchers-swiper-container'>
              {featuredVouchers.length > 0 ? (
                <Swiper
                  modules={[Navigation, SwiperPagination]}
                  spaceBetween={30}
                  slidesPerView={1}
                  navigation={{
                    nextEl: '.swiper-button-next-custom',
                    prevEl: '.swiper-button-prev-custom',
                  }}
                  pagination={{
                    clickable: true,
                    el: '.swiper-pagination-custom',
                  }}
                  loop={true}
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                  }}
                  className="vouchers-swiper"
                >
                  {featuredVouchers.map((voucher) => (
                    <SwiperSlide key={voucher.id}>
                      <div className='voucher-cards-container'>
                        {voucher.rank && (
                          <div className='voucher-rank-badge'>
                            <span className='rank-text'>{voucher.rank}</span>
                            <span className='crown-icon'>👑</span>
                          </div>
                        )}
                        <div className='voucher-value'>
                          {voucher.value}
                        </div>
                        <div className='voucher-description'>
                          {voucher.description}
                        </div>
                        {voucher.code && (
                          <div className='voucher-code'>
                            Code: {voucher.code}
                          </div>
                        )}
                        <div className='voucher-tag'>
                          {voucher.title}
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                  Hiện chưa có voucher nổi bật
                </div>
              )}
              
              {/* Custom Navigation Buttons */}
              <div className='swiper-button-prev-custom'>
                <span>‹</span>
              </div>
              <div className='swiper-button-next-custom'>
                <span>›</span>
              </div>
              
              {/* Custom Pagination */}
              <div className='swiper-pagination-custom'></div>
            </div>
          </div>
        )}

        {/* Tabs Section */}
        <div className='vouchers-content'>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              sx={{
                '& .MuiTab-root': {
                  fontSize: '16px',
                  fontWeight: 600,
                  textTransform: 'none',
                }
              }}
            >
              <Tab label="Tất cả Voucher" />
              <Tab label="Voucher của tôi" />
            </Tabs>
          </Box>

          {/* Filter Buttons */}
          {activeTab === 0 ? (
            // All Vouchers filters
            <div className='voucher-filter'>
              <button 
                className={`filter-btn ${statusFilter === '' ? 'active' : ''}`}
                onClick={() => handleStatusFilterChange('')}
              >
                <span className='filter-icon'>🎁</span>
                <span>Tất cả</span>
              </button>
              <button 
                className={`filter-btn ${statusFilter === 'active' ? 'active' : ''}`}
                onClick={() => handleStatusFilterChange('active')}
              >
                <span className='filter-icon'>✅</span>
                <span>Đang hoạt động</span>
              </button>
              <button 
                className={`filter-btn ${statusFilter === 'inactive' ? 'active' : ''}`}
                onClick={() => handleStatusFilterChange('inactive')}
              >
                <span className='filter-icon'>⏸️</span>
                <span>Chưa kích hoạt</span>
              </button>
              <button 
                className={`filter-btn ${statusFilter === 'expired' ? 'active' : ''}`}
                onClick={() => handleStatusFilterChange('expired')}
              >
                <span className='filter-icon'>⏰</span>
                <span>Đã hết hạn</span>
              </button>
            </div>
          ) : (
            // My Vouchers filters
            <div className='voucher-filter'>
              <button 
                className={`filter-btn ${voucherTypeFilter === '' ? 'active' : ''}`}
                onClick={() => handleVoucherTypeFilterChange('')}
              >
                <span className='filter-icon'>🎁</span>
                <span>Tất cả</span>
              </button>
              <button 
                className={`filter-btn ${voucherTypeFilter === 'business' ? 'active' : ''}`}
                onClick={() => handleVoucherTypeFilterChange('business')}
              >
                <span className='filter-icon'>🏪</span>
                <span>Business</span>
              </button>
              <button 
                className={`filter-btn ${voucherTypeFilter === 'leaderboard' ? 'active' : ''}`}
                onClick={() => handleVoucherTypeFilterChange('leaderboard')}
              >
                <span className='filter-icon'>👑</span>
                <span>Leaderboard</span>
              </button>
            </div>
          )}

          {/* Voucher Grid */}
          <div className='voucher-grid'>
            {transformedVouchers.length > 0 ? (
              transformedVouchers.map(renderVoucherCard)
            ) : (
              <div style={{ 
                gridColumn: '1 / -1', 
                padding: '60px 20px', 
                textAlign: 'center', 
                color: '#999',
                fontSize: '18px'
              }}>
                {isLoading ? 'Đang tải...' : 'Không có voucher nào'}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Stack
              spacing={2}
              className="voucher-pagination"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "40px"
              }}
            >
              <Pagination
                count={totalPages}
                page={activeTab === 0 ? currentPage : myVouchersPage}
                onChange={handlePageChange}
                variant="outlined"
                shape="rounded"
                color="primary"
              />
            </Stack>
          )}
        </div>
    </div>
    </>
  )
}

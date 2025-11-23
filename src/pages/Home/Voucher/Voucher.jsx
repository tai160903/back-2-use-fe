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
  const [displayPage, setDisplayPage] = useState(1); // Client-side pagination for display
  const [myVouchersDisplayPage, setMyVouchersDisplayPage] = useState(1); // Client-side pagination for My Vouchers
  const vouchersPerPage = 10; // API pagination
  const vouchersPerDisplayPage = 9; // Display pagination (3x3 grid)

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

  // Load customer vouchers (All Vouchers) - Always load to ensure Featured Vouchers has data
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    // Chỉ gọi API nếu đang ở customer mode
    const tokenRole = getUserRole();
    if (tokenRole !== 'customer') {
      console.warn('Not in customer mode, skipping voucher load');
      return;
    }
    
    // Always load customer vouchers (even in My Vouchers tab) to ensure Featured Vouchers has data
    dispatch(getCustomerVouchers({
      status: activeTab === 0 ? (statusFilter || undefined) : undefined, // Only apply filter in All Vouchers tab
      page: activeTab === 0 ? currentPage : 1, // Use currentPage only in All Vouchers tab
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
          toast.error('You do not have permission. Please log in again.');
        }
      }
    });
  }, [dispatch, statusFilter, currentPage, activeTab]);

  // Load my customer vouchers - Load tất cả để kiểm tra redeemed status cho All Vouchers tab
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    const tokenRole = getUserRole();
    if (tokenRole !== 'customer') return;

    if (activeTab === 1) {
      // Load với filter cho My Vouchers tab
      dispatch(getMyCustomerVouchers({
        voucherType: voucherTypeFilter || undefined,
        status: 'redeemed', // redeemed, used, expired
        page: myVouchersPage,
        limit: vouchersPerPage,
      }));
    } else {
      // Load tất cả redeemed vouchers để so sánh với All Vouchers
      dispatch(getMyCustomerVouchers({
        voucherType: undefined,
        status: 'redeemed',
        page: 1,
        limit: 100, // Load nhiều để đảm bảo có đủ data
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
    
    // Tạo Set chứa các voucher ID đã được redeem (cho All Vouchers tab)
    const redeemedVoucherIds = new Set();
    if (activeTab === 0 && myCustomerVouchers && myCustomerVouchers.length > 0) {
      myCustomerVouchers.forEach(redeemedVoucher => {
        // Lấy voucher template ID từ myCustomerVouchers để so sánh với customerVouchers
        // templateVoucherId là ID của voucher template (available voucher)
        const redeemedId = redeemedVoucher.templateVoucherId || 
                           redeemedVoucher.voucherId || 
                           redeemedVoucher.voucher?._id || 
                           redeemedVoucher.voucherInfo?._id ||
                           redeemedVoucher.voucher?.id ||
                           redeemedVoucher.voucherTemplateId;
        if (redeemedId) {
          redeemedVoucherIds.add(String(redeemedId));
        }
      });
    }
    
    const transformed = vouchers.map((voucher, index) => {
      // Determine discount value - prioritize percentage
      let value = '';
      if (activeTab === 1) {
        // My vouchers - check voucher object first
        if (voucher.voucher?.discountPercent) {
          value = `${voucher.voucher.discountPercent}%`;
        } else if (voucher.voucherInfo?.discountPercent) {
          value = `${voucher.voucherInfo.discountPercent}%`;
        } else if (voucher.discountPercent) {
          value = `${voucher.discountPercent}%`;
        } else if (voucher.discount) {
          value = `${voucher.discount}%`;
        } else if (voucher.voucher?.discountAmount) {
          value = `${voucher.voucher.discountAmount.toLocaleString('vi-VN')}đ`;
        } else if (voucher.discountAmount) {
          value = `${voucher.discountAmount.toLocaleString('vi-VN')}đ`;
        }
      } else {
        // All vouchers
        if (voucher.discountPercent) {
          value = `${voucher.discountPercent}%`;
        } else if (voucher.discount) {
          value = `${voucher.discount}%`;
        } else if (voucher.discountAmount) {
          value = `${voucher.discountAmount.toLocaleString('vi-VN')}đ`;
        }
      }
      
      // If still no value, set default
      if (!value) {
        value = '0%';
      }

      // Determine status for UI
      let status = 'available';
      let statusText = 'Available';
      const voucherId = String(voucher._id || voucher.id);
      const isRedeemed = activeTab === 0 && redeemedVoucherIds.has(voucherId);
      
      if (activeTab === 1) {
        // My vouchers
        if (voucher.status === 'used') {
          status = 'collected';
          statusText = 'Used';
        } else if (voucher.status === 'expired') {
          status = 'unavailable';
          statusText = 'Expired';
        } else if (voucher.status === 'redeemed') {
          status = 'available';
          statusText = 'Redeemed';
        }
      } else {
        // All vouchers
        if (isRedeemed) {
          status = 'collected'; // Đánh dấu là đã redeem
          statusText = 'Redeemed';
        } else if (voucher.status === 'inactive') {
          status = 'unavailable';
          statusText = 'Inactive';
        } else if (voucher.status === 'expired') {
          status = 'unavailable';
          statusText = 'Expired';
        } else if (voucher.status === 'active') {
          status = 'available';
          statusText = 'Available';
        }
      }

      return {
        id: voucher._id || voucher.id,
        type: voucher.voucherType === 'leaderboard' ? 'exclusive' : 'regular',
        rank: voucher.voucherType === 'leaderboard' && index < 10 ? `Top ${index + 1}` : null,
        title: activeTab === 1 
          ? (voucher.voucher?.name || voucher.voucherInfo?.name || voucher.customName || voucher.name || 'Voucher')
          : (voucher.customName || voucher.name || voucher.voucher?.name || 'Voucher'),
        value: value,
        description: activeTab === 1
          ? (voucher.voucher?.description || voucher.voucherInfo?.description || voucher.customDescription || voucher.description || 'Voucher description')
          : (voucher.customDescription || voucher.description || voucher.voucher?.description || 'Voucher description'),
        points: voucher.rewardPointCost || voucher.voucher?.rewardPointCost || 0,
        code: activeTab === 1
          ? (voucher.fullCode || voucher.code || voucher.voucherCode || voucher.baseCode || voucher.voucher?.baseCode || '')
          : (voucher.baseCode || voucher.code || voucher.voucher?.baseCode || ''),
        expiry: formatDate(activeTab === 1
          ? (voucher.expiryDate || voucher.leaderboardExpireAt || voucher.voucher?.endDate || voucher.voucherInfo?.endDate)
          : (voucher.endDate || voucher.voucher?.endDate || voucher.expiryDate)),
        redeemedAt: activeTab === 1 ? formatDate(voucher.redeemedAt || voucher.createdAt) : null,
        status: status,
        statusText: statusText,
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
    setDisplayPage(1);
    setMyVouchersDisplayPage(1);
  };

  // Handle status filter change (for All Vouchers)
  const handleStatusFilterChange = (newStatus) => {
    setStatusFilter(newStatus);
    setCurrentPage(1);
    setDisplayPage(1);
    // Scroll to top when filter changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle voucher type filter change (for My Vouchers)
  const handleVoucherTypeFilterChange = (newType) => {
    setVoucherTypeFilter(newType);
    setMyVouchersPage(1);
    setMyVouchersDisplayPage(1);
    // Scroll to top when filter changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle page change (API pagination)
  const handlePageChange = (event, newPage) => {
    if (activeTab === 0) {
      setCurrentPage(newPage);
    } else {
      setMyVouchersPage(newPage);
    }
  };
  
  // Handle display page change (Client-side pagination)
  const handleDisplayPageChange = (event, newPage) => {
    if (activeTab === 0) {
      setDisplayPage(newPage);
    } else {
      setMyVouchersDisplayPage(newPage);
    }
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle redeem voucher
  const handleRedeemVoucher = async (voucher) => {
    const voucherId = voucher.originalVoucher?._id || voucher.originalVoucher?.id || voucher.id;
    if (!voucherId) {
      toast.error('Voucher ID not found');
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
      // Reset display page after redeem
      setDisplayPage(1);
      setMyVouchersDisplayPage(1);
    } catch (error) {
      // Error is handled by the thunk
    }
  };
  
  // Reset display page when filter or tab changes
  useEffect(() => {
    setDisplayPage(1);
  }, [statusFilter, activeTab]);
  
  useEffect(() => {
    setMyVouchersDisplayPage(1);
  }, [voucherTypeFilter, activeTab]);

  // Get pagination info
  const pagination = activeTab === 0 ? customerVoucherPagination : myCustomerVoucherPagination;
  const totalPages = pagination?.totalPages || 1;
  
  // Client-side pagination for display (9 vouchers per page)
  const displayVouchers = useMemo(() => {
    const startIndex = activeTab === 0 
      ? (displayPage - 1) * vouchersPerDisplayPage
      : (myVouchersDisplayPage - 1) * vouchersPerDisplayPage;
    const endIndex = startIndex + vouchersPerDisplayPage;
    return transformedVouchers.slice(startIndex, endIndex);
  }, [transformedVouchers, displayPage, myVouchersDisplayPage, activeTab]);
  
  const totalDisplayPages = transformedVouchers.length > 0 
    ? Math.ceil(transformedVouchers.length / vouchersPerDisplayPage) 
    : 1;

  // Get top featured vouchers (Leaderboard vouchers) - Always show, prioritize All Vouchers data
  const featuredVouchers = useMemo(() => {
    // Always try to get from customerVouchers first (All Vouchers) for consistency
    // If not available, fallback to myCustomerVouchers
    let sourceVouchers = customerVouchers;
    let isFromMyVouchers = false;
    
    // If customerVouchers is empty or no leaderboard vouchers found, try myCustomerVouchers
    if (!sourceVouchers || sourceVouchers.length === 0) {
      sourceVouchers = myCustomerVouchers;
      isFromMyVouchers = true;
    }
    
    if (!sourceVouchers || sourceVouchers.length === 0) return [];
    
    // Filter leaderboard vouchers from source
    let leaderboardVouchers = sourceVouchers
      .filter(voucher => {
        // Check if it's from myCustomerVouchers (nested structure) or customerVouchers (flat structure)
        if (isFromMyVouchers || activeTab === 1) {
          return voucher.voucher?.voucherType === 'leaderboard' || 
                 voucher.voucherType === 'leaderboard' ||
                 voucher.voucherInfo?.voucherType === 'leaderboard';
        }
        // For All Vouchers tab
        return voucher.voucherType === 'leaderboard';
      })
      .slice(0, 10); // Get first 10 leaderboard vouchers
    
    // If no leaderboard vouchers found in current source, try the other source
    if (leaderboardVouchers.length === 0 && !isFromMyVouchers && myCustomerVouchers && myCustomerVouchers.length > 0) {
      leaderboardVouchers = myCustomerVouchers
        .filter(voucher => {
          return voucher.voucher?.voucherType === 'leaderboard' || 
                 voucher.voucherType === 'leaderboard' ||
                 voucher.voucherInfo?.voucherType === 'leaderboard';
        })
        .slice(0, 10);
      isFromMyVouchers = true;
    }
    
    if (leaderboardVouchers.length === 0) return [];
    
    // Transform to match carousel format
    return leaderboardVouchers.map((voucher, index) => {
      // Determine discount value - handle both nested and flat structures
      let value = '';
      if (isFromMyVouchers) {
        // From myCustomerVouchers - check nested voucher object
        if (voucher.voucher?.discountPercent) {
          value = `${voucher.voucher.discountPercent}%`;
        } else if (voucher.voucherInfo?.discountPercent) {
          value = `${voucher.voucherInfo.discountPercent}%`;
        } else if (voucher.discountPercent) {
          value = `${voucher.discountPercent}%`;
        } else if (voucher.voucher?.discountAmount) {
          value = `${voucher.voucher.discountAmount.toLocaleString('vi-VN')}đ`;
        } else if (voucher.discountAmount) {
          value = `${voucher.discountAmount.toLocaleString('vi-VN')}đ`;
        }
      } else {
        // From customerVouchers - flat structure
        if (voucher.discountPercent) {
          value = `${voucher.discountPercent}%`;
        } else if (voucher.discountAmount) {
          value = `${voucher.discountAmount.toLocaleString('vi-VN')}đ`;
        } else if (voucher.discount) {
          value = `${voucher.discount}%`;
        }
      }
      if (!value) value = '0%';
      
      return {
        id: voucher._id || voucher.id,
        type: 'exclusive',
        rank: index < 10 ? `Top ${index + 1}` : null,
        title: isFromMyVouchers
          ? (voucher.voucher?.name || voucher.voucherInfo?.name || voucher.customName || voucher.name || 'Voucher')
          : (voucher.customName || voucher.name || voucher.voucher?.name || 'Voucher'),
        value: value,
        description: isFromMyVouchers
          ? (voucher.voucher?.description || voucher.voucherInfo?.description || voucher.customDescription || voucher.description || 'Voucher description')
          : (voucher.customDescription || voucher.description || voucher.voucher?.description || 'Voucher description'),
        points: voucher.rewardPointCost || voucher.voucher?.rewardPointCost || 0,
        code: isFromMyVouchers
          ? (voucher.fullCode || voucher.code || voucher.voucherCode || voucher.baseCode || voucher.voucher?.baseCode || '')
          : (voucher.baseCode || voucher.code || voucher.voucher?.baseCode || ''),
        expiry: formatDate(isFromMyVouchers
          ? (voucher.expiryDate || voucher.leaderboardExpireAt || voucher.voucher?.endDate || voucher.voucherInfo?.endDate)
          : (voucher.endDate || voucher.voucher?.endDate || voucher.expiryDate)),
        status: isFromMyVouchers
          ? (voucher.status === 'used' ? 'unavailable' : voucher.status === 'expired' ? 'unavailable' : 'available')
          : (voucher.status === 'active' ? 'available' : 'unavailable'),
        originalVoucher: voucher
      };
    });
  }, [customerVouchers, myCustomerVouchers, activeTab]);

  // Render voucher card
  const renderVoucherCard = (voucher) => {
    const isExclusive = voucher.rank !== null
    // Kiểm tra nếu voucher đã được redeem (cho All Vouchers tab)
    const isCollected = voucher.status === 'collected' || (activeTab === 0 && voucher.statusText === 'Redeemed')
    const isUnavailable = voucher.status === 'unavailable'

    return (
      <div 
        key={voucher.id} 
        className={`voucher-grid-card ${isUnavailable || isCollected ? 'unavailable' : ''} ${isExclusive ? 'exclusive' : 'regular'}`}
      >
        
        <div className='voucher-grid-content'>
          <div className='voucher-grid-title'>{voucher.title}</div>
          {voucher.value && (
            <div className='voucher-grid-value' style={{ fontSize: '1.5rem', fontWeight: 700, color: '#22c55e', marginBottom: '8px' }}>
              {voucher.value}
            </div>
          )}
          <div className='voucher-grid-description'>{voucher.description}</div>
          {activeTab === 0 && voucher.points > 0 && (
            <div className='voucher-grid-points'>{voucher.points} points</div>
          )}
          {activeTab === 1 && (
            <>
              {voucher.code && (
                <div className='voucher-grid-code'>
                  <span className='code-icon'>📄</span>
                  <span style={{ fontWeight: 600, fontFamily: 'monospace' }}>{voucher.code}</span>
                </div>
              )}
              {voucher.redeemedAt && (
                <div className='voucher-grid-expiry' style={{ marginTop: '8px' }}>
                  <span style={{ fontWeight: 500 }}>Redeemed:</span> {voucher.redeemedAt}
                </div>
              )}
              <div className='voucher-grid-expiry' style={{ marginTop: '4px' }}>
                <span style={{ fontWeight: 500 }}>Status:</span> {voucher.statusText}
              </div>
            </>
          )}
          {activeTab === 0 && (
            <>
              {voucher.code && (
                <div className='voucher-grid-code'>
                  <span className='code-icon'>📄</span>
                  <span>{voucher.code}</span>
                </div>
              )}
              <div className='voucher-grid-expiry'>Expires: {voucher.expiry}</div>
            </>
          )}
          
          <div className='voucher-grid-actions'>
            {activeTab === 1 ? (
              // My Vouchers tab
              isCollected ? (
                <div className='collected-text'>
                  <span className='check-icon'>✓</span>
                  <span>Used</span>
                </div>
              ) : isUnavailable ? (
                <div className='unavailable-text'>
                  <span className='lock-icon'>🔒</span>
                  <span>Expired</span>
                </div>
              ) : (
                <div className='collected-text'>
                  <span className='check-icon'>✓</span>
                  <span>Redeemed</span>
                </div>
              )
            ) : (
              // All Vouchers tab
              isCollected ? (
                <div className='collected-text'>
                  <span className='check-icon'>✓</span>
                  <span>Redeemed</span>
                </div>
              ) : isUnavailable ? (
                <div className='unavailable-text'>
                  <span className='lock-icon'>🔒</span>
                  <span>Unavailable</span>
                </div>
              ) : (
                <button 
                  className='btn-collect'
                  onClick={() => handleRedeemVoucher(voucher)}
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Redeem Now'}
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
        
        {/* Featured Vouchers Carousel - Show in both tabs */}
        {featuredVouchers.length > 0 && (
          <div className='vouchers-carousel'>
            <div className='vouchers-header'>
              <Typography variant='h2' className='vouchers-carousel-title'>
                Featured Vouchers
              </Typography>
              <span className='vouchers-carousel-subtitle'>
                Discover exclusive vouchers for top 50 members
              </span>
            </div>

            <div className='vouchers-swiper-container'>
              {featuredVouchers.length > 0 ? (
                <Swiper
                  modules={[Navigation, SwiperPagination]}
                  spaceBetween={20}
                  slidesPerView={3}
                  slidesPerGroup={1}
                  navigation={{
                    nextEl: '.swiper-button-next-custom',
                    prevEl: '.swiper-button-prev-custom',
                  }}
                  pagination={{
                    clickable: true,
                    el: '.swiper-pagination-custom',
                  }}
                  loop={false}
                  breakpoints={{
                    320: {
                      slidesPerView: 1,
                      spaceBetween: 10
                    },
                    640: {
                      slidesPerView: 2,
                      spaceBetween: 15
                    },
                    1024: {
                      slidesPerView: 3,
                      spaceBetween: 20
                    }
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
                  No featured vouchers available
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
              <Tab label="All Vouchers" />
              <Tab label="My Vouchers" />
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
                <span>All</span>
              </button>
              <button 
                className={`filter-btn ${statusFilter === 'active' ? 'active' : ''}`}
                onClick={() => handleStatusFilterChange('active')}
              >
                <span className='filter-icon'>✅</span>
                <span>Active</span>
              </button>
              <button 
                className={`filter-btn ${statusFilter === 'inactive' ? 'active' : ''}`}
                onClick={() => handleStatusFilterChange('inactive')}
              >
                <span className='filter-icon'>⏸️</span>
                <span>Inactive</span>
              </button>
              <button 
                className={`filter-btn ${statusFilter === 'expired' ? 'active' : ''}`}
                onClick={() => handleStatusFilterChange('expired')}
              >
                <span className='filter-icon'>⏰</span>
                <span>Expired</span>
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
                <span>All</span>
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
            {displayVouchers.length > 0 ? (
              displayVouchers.map(renderVoucherCard)
            ) : (
              <div style={{ 
                gridColumn: '1 / -1', 
                padding: '60px 20px', 
                textAlign: 'center', 
                color: '#999',
                fontSize: '18px'
              }}>
                {isLoading ? 'Loading...' : 'No vouchers found'}
              </div>
            )}
          </div>

          {/* Display Pagination (Client-side - 9 vouchers per page) */}
          {transformedVouchers.length > 0 && (
            <Stack
              spacing={2}
              className="voucher-pagination"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "40px",
                marginBottom: "20px"
              }}
            >
              <Pagination
                count={totalDisplayPages}
                page={activeTab === 0 ? displayPage : myVouchersDisplayPage}
                onChange={handleDisplayPageChange}
                variant="outlined"
                shape="rounded"
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Stack>
          )}

          {/* API Pagination (Server-side - Load more data from server) */}
          {totalPages > 1 && (
            <Stack
              spacing={2}
              className="voucher-api-pagination"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "20px",
                marginBottom: "40px"
              }}
            >
              <Pagination
                count={totalPages}
                page={activeTab === 0 ? currentPage : myVouchersPage}
                onChange={handlePageChange}
                variant="outlined"
                shape="rounded"
                color="secondary"
                size="medium"
                showFirstButton
                showLastButton
              />
            </Stack>
          )}
        </div>
    </div>
    </>
  )
}

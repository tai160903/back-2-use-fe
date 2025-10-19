import { Typography, Pagination, Stack } from '@mui/material'
import React, { useState, useMemo } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination as SwiperPagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import './Voucher.css'

// Data giả cho tất cả vouchers
const allVouchers = [
  // Exclusive Top 50 vouchers
  {
    id: 1,
    type: 'exclusive',
    rank: 'Top 1',
    title: 'Summer',
    value: '50%',
    description: '50% off all summer products',
    points: 500,
    code: 'SUMMER50',
    expiry: '31/12/2025',
    status: 'available'
  },
  {
    id: 2,
    type: 'exclusive',
    rank: 'Top 2',
    title: 'Loyalty',
    value: '100K',
    description: 'Voucher for loyal customers',
    points: 1000,
    code: 'LOYALTY100',
    expiry: '30/11/2025',
    status: 'available'
  },
  {
    id: 3,
    type: 'exclusive',
    rank: 'Top 3',
    title: 'Premium',
    value: '150K',
    description: 'Premium voucher for excellent members',
    points: 1500,
    code: 'PREMIUM150',
    expiry: '25/12/2025',
    status: 'available'
  },
  {
    id: 9,
    type: 'exclusive',
    rank: 'Top 5',
    title: 'Special',
    value: '80K',
    description: 'Special voucher for top members',
    points: 800,
    code: 'SPECIAL80',
    expiry: '20/12/2025',
    status: 'available'
  },
  // Regular vouchers
  {
    id: 4,
    type: 'regular',
    title: 'Welcome',
    value: '20%',
    description: 'Welcome new customers',
    points: 200,
    code: 'WELCOME20',
    expiry: '30/11/2025',
    status: 'collected'
  },
  {
    id: 6,
    type: 'regular',
    title: 'Birthday',
    value: '25%',
    description: 'Your birthday - 25% off',
    points: 250,
    code: 'BIRTHDAY25',
    expiry: '15/12/2025',
    status: 'available'
  },
  {
    id: 7,
    type: 'regular',
    title: 'Shipping',
    value: 'Free',
    description: 'Free shipping for orders over 500K',
    points: 150,
    code: 'FREESHIP',
    expiry: '28/11/2025',
    status: 'available'
  },
  {
    id: 8,
    type: 'regular',
    title: 'First Order',
    value: '25%',
    description: 'Discount voucher for first order',
    points: 250,
    code: 'FIRST25',
    expiry: '22/12/2025',
    status: 'available'
  },
  {
    id: 10,
    type: 'regular',
    title: 'Points',
    value: '20K',
    description: 'Points voucher for members',
    points: 200,
    code: 'POINTS20',
    expiry: '18/12/2025',
    status: 'available'
  },
  // Unavailable voucher
  {
    id: 5,
    type: 'regular',
    title: 'Flash Sale',
    value: '30%',
    description: 'Today\'s flash sale',
    points: 300,
    code: 'FLASH30',
    expiry: '20/10/2025',
    status: 'unavailable'
  },
  // More vouchers for pagination testing
  {
    id: 11,
    type: 'exclusive',
    rank: 'Top 10',
    title: 'VIP',
    value: '200K',
    description: 'VIP voucher for top members',
    points: 2000,
    code: 'VIP200',
    expiry: '31/12/2025',
    status: 'available'
  },
  {
    id: 12,
    type: 'regular',
    title: 'Student',
    value: '15%',
    description: 'Student discount voucher',
    points: 150,
    code: 'STUDENT15',
    expiry: '25/12/2025',
    status: 'available'
  },
  {
    id: 13,
    type: 'regular',
    title: 'Weekend',
    value: '20%',
    description: 'Weekend special offer',
    points: 200,
    code: 'WEEKEND20',
    expiry: '30/11/2025',
    status: 'collected'
  },
  {
    id: 14,
    type: 'exclusive',
    rank: 'Top 15',
    title: 'Elite',
    value: '120K',
    description: 'Elite member exclusive voucher',
    points: 1200,
    code: 'ELITE120',
    expiry: '28/12/2025',
    status: 'available'
  },
  {
    id: 15,
    type: 'regular',
    title: 'Referral',
    value: '30K',
    description: 'Referral bonus voucher',
    points: 300,
    code: 'REFER30',
    expiry: '22/12/2025',
    status: 'available'
  },
  {
    id: 16,
    type: 'regular',
    title: 'Holiday',
    value: '25%',
    description: 'Holiday season special',
    points: 250,
    code: 'HOLIDAY25',
    expiry: '15/12/2025',
    status: 'available'
  },
  {
    id: 17,
    type: 'exclusive',
    rank: 'Top 20',
    title: 'Gold',
    value: '90K',
    description: 'Gold member premium voucher',
    points: 900,
    code: 'GOLD90',
    expiry: '20/12/2025',
    status: 'available'
  },
  {
    id: 18,
    type: 'regular',
    title: 'New Year',
    value: '40%',
    description: 'New Year celebration voucher',
    points: 400,
    code: 'NEWYEAR40',
    expiry: '31/12/2025',
    status: 'available'
  },
  {
    id: 19,
    type: 'regular',
    title: 'Loyalty',
    value: '35K',
    description: 'Loyalty reward voucher',
    points: 350,
    code: 'LOYALTY35',
    expiry: '18/12/2025',
    status: 'collected'
  },
  {
    id: 20,
    type: 'exclusive',
    rank: 'Top 25',
    title: 'Platinum',
    value: '75K',
    description: 'Platinum member exclusive',
    points: 750,
    code: 'PLATINUM75',
    expiry: '25/12/2025',
    status: 'available'
  },
  {
    id: 21,
    type: 'regular',
    title: 'Anniversary',
    value: '50%',
    description: 'App anniversary celebration',
    points: 500,
    code: 'ANNIVERSARY50',
    expiry: '30/12/2025',
    status: 'available'
  },
  {
    id: 22,
    type: 'regular',
    title: 'Early Bird',
    value: '20%',
    description: 'Early bird special offer',
    points: 200,
    code: 'EARLY20',
    expiry: '15/12/2025',
    status: 'unavailable'
  }
]

// Data cho carousel (chỉ top 50)
const top50Vouchers = allVouchers.filter(v => v.type === 'exclusive')


export default function Voucher() {
  // State cho filter và pagination
  const [filter, setFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const vouchersPerPage = 6

  // Filter vouchers
  const filteredVouchers = useMemo(() => {
    if (filter === 'all') return allVouchers
    if (filter === 'exclusive') return allVouchers.filter(v => v.type === 'exclusive')
    if (filter === 'regular') return allVouchers.filter(v => v.type === 'regular')
    return allVouchers
  }, [filter])

  // Pagination logic
  const totalPages = Math.ceil(filteredVouchers.length / vouchersPerPage)
  const startIndex = (currentPage - 1) * vouchersPerPage
  const paginatedVouchers = filteredVouchers.slice(startIndex, startIndex + vouchersPerPage)

  // Handle filter change
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter)
    setCurrentPage(1) // Reset về trang 1 khi đổi filter
  }

  // Handle page change
  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage)
  }

  // Render voucher card
  const renderVoucherCard = (voucher) => {
    const isExclusive = voucher.type === 'exclusive'
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
          <div className='voucher-grid-points'>{voucher.points} points</div>
          <div className='voucher-grid-code'>
            <span className='code-icon'>📄</span>
            <span>{voucher.code}</span>
          </div>
          <div className='voucher-grid-expiry'>Expires: {voucher.expiry}</div>
          
          <div className='voucher-grid-actions'>
            {isCollected ? (
              <div className='collected-text'>
                <span className='check-icon'>✓</span>
                <span>Collected</span>
              </div>
            ) : isUnavailable ? (
              <div className='unavailable-text'>
                <span className='lock-icon'>🔒</span>
                <span>Not Available</span>
              </div>
            ) : (
              <button className='btn-collect'>
                Collect Now
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
    <div className='vouchers-page'>
        <div className='vouchers-banner'>
        </div>
        
        {/* Featured Vouchers Carousel */}
        <div className='vouchers-carousel'>
          <div className='vouchers-header'>
            <Typography variant='h2' className='vouchers-carousel-title'>
              Featured Vouchers
            </Typography>
            <span className='vouchers-carousel-subtitle'>
              Discover exclusive vouchers reserved for top 50 members
            </span>
          </div>

          <div className='vouchers-swiper-container'>
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
              {top50Vouchers.map((voucher) => (
                <SwiperSlide key={voucher.id}>
                  <div className='voucher-card'>
                    <div className='voucher-rank-badge'>
                      <span className='rank-text'>{voucher.rank}</span>
                      <span className='crown-icon'>👑</span>
                    </div>
                    <div className='voucher-value' style={{ color: voucher.color }}>
                      {voucher.value}
                    </div>
                    <div className='voucher-description'>
                      {voucher.description}
                    </div>
                    <div className='voucher-code'>
                      Code: {voucher.code}
                    </div>
                    <div className='voucher-tag' style={{ backgroundColor: voucher.color }}>
                      {voucher.title}
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            
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

        {/* Voucher Grid Section */}
        <div className='vouchers-content'>
          <div className='vouchers-header'>
            <Typography variant='h2' className='vouchers-carousel-title'>
              Explore Vouchers
            </Typography>
            <span className='vouchers-carousel-subtitle'>
              Select the type of voucher you want to view and start collecting
            </span>
          </div>

          {/* Filter Buttons */}
          <div className='voucher-filters'>
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => handleFilterChange('all')}
            >
              <span className='filter-icon'>🎁</span>
              <span>All</span>
            </button>
            <button 
              className={`filter-btn ${filter === 'exclusive' ? 'active' : ''}`}
              onClick={() => handleFilterChange('exclusive')}
            >
              <span className='filter-icon'>👑</span>
              <span>Exclusive (Top 50)</span>
            </button>
            <button 
              className={`filter-btn ${filter === 'regular' ? 'active' : ''}`}
              onClick={() => handleFilterChange('regular')}
            >
              <span className='filter-icon'>🎫</span>
              <span>Regular</span>
            </button>
          </div>

          {/* Voucher Grid */}
          <div className='voucher-grid'>
            {paginatedVouchers.map(renderVoucherCard)}
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
                page={currentPage}
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

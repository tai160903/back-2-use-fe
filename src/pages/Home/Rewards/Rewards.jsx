import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllVouchersApi } from '../../../store/slices/adminSlice';
import { Pagination, Stack } from '@mui/material';
import { FaGift, FaHistory, FaClock } from 'react-icons/fa';
import { IoIosSearch } from 'react-icons/io';
import { BiDetail } from 'react-icons/bi';
import './Rewards.css';

export default function Rewards() {
  const dispatch = useDispatch();
  const { vouchers, isLoading } = useSelector(state => state.admin);
  const { userInfo } = useSelector(state => state.user);

  const [filter, setFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [myVouchersPage, setMyVouchersPage] = useState(1);
  const itemsPerPage = 4;

  // Mock user reward points - replace with actual user data
  const userPoints = userInfo?.rewardPoints || 15;

  // Mock redeemed vouchers - replace with actual user data
  const [redeemedVouchers] = useState([
    {
      id: 1,
      name: '20% Off Store Credit',
      code: 'REWARD-STORE123',
      discount: 20,
      redeemedAt: '8/11/2024',
      status: 'Used'
    }
  ]);

  // Mock points history
  const pointsHistory = [
    { id: 1, action: 'On-time return', date: '8/11/2024', points: '+5' },
    { id: 2, action: 'First time user bonus', date: '8/11/2024', points: '+10' }
  ];

  useEffect(() => {
    dispatch(getAllVouchersApi({
      page: 1,
      limit: 100,
    }));
  }, [dispatch]);

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Transform API vouchers
  const availableVouchers = useMemo(() => {
    if (!vouchers || vouchers.length === 0) return [];
    
    return vouchers
      .filter(v => v.status === 'active')
      .map(voucher => ({
        id: voucher._id || voucher.id,
        name: voucher.name,
        discount: voucher.discount,
        description: voucher.description || `Get ${voucher.discount}% off on your purchase at any participating store`,
        points: voucher.rewardPointCost,
        code: voucher.baseCode,
        expiry: formatDate(voucher.endDate),
        maxUsage: voucher.maxUsage
      }));
  }, [vouchers]);

  // Filter vouchers
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

  // Pagination
  const totalPages = Math.ceil(filteredVouchers.length / itemsPerPage);
  const paginatedVouchers = filteredVouchers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const myVouchersTotalPages = Math.ceil(redeemedVouchers.length / itemsPerPage);
  const paginatedMyVouchers = redeemedVouchers.slice(
    (myVouchersPage - 1) * itemsPerPage,
    myVouchersPage * itemsPerPage
  );

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

  const handleRedeem = (voucher) => {
    if (userPoints >= voucher.points) {
      // TODO: Implement redeem logic with API
      console.log('Redeeming voucher:', voucher);
      alert(`Redeeming ${voucher.name} for ${voucher.points} points`);
    } else {
      alert(`You need ${voucher.points - userPoints} more points to redeem this voucher`);
    }
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
          {['All', 'Get Voucher', 'Used More Points', 'Redeemed', 'Expired'].map((tab) => (
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

        {/* Vouchers Grid */}
        <div className="vouchers-grid">
          {paginatedVouchers.length > 0 ? (
            paginatedVouchers.map((voucher) => (
              <div key={voucher.id} className="voucher-card">
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
                  <div className="detail-item">
                    <span className="detail-label">Code:</span>
                    <span className="detail-value code-value">{voucher.code}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Expires:</span>
                    <span className="detail-value">{voucher.expiry}</span>
                  </div>
                </div>

                <div className="voucher-footer">
                  <div className="points-required">
                    <FaGift className="points-icon" />
                    <span className="points-text">{voucher.points} points</span>
                  </div>
                  <div className="voucher-actions">
                    <button className="btn-view-detail">
                      <BiDetail />
                      View Detail
                    </button>
                    <button 
                      className={`btn-redeem ${userPoints >= voucher.points ? '' : 'disabled'}`}
                      onClick={() => handleRedeem(voucher)}
                      disabled={userPoints < voucher.points}
                    >
                      Redeem
                    </button>
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
              color="primary"
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

        <div className="my-vouchers-tabs">
          <button className="my-voucher-tab active">
            Available <span className="tab-badge">{redeemedVouchers.length}</span>
          </button>
          <button className="my-voucher-tab">
            Used <span className="tab-badge">0</span>
          </button>
          <button className="my-voucher-tab">
            Expired <span className="tab-badge">0</span>
          </button>
        </div>

        <div className="my-vouchers-list">
          {paginatedMyVouchers.map((voucher) => (
            <div key={voucher.id} className="my-voucher-item">
              <div className="my-voucher-icon">
                <FaGift />
              </div>
              <div className="my-voucher-info">
                <h4 className="my-voucher-name">{voucher.name}</h4>
                <p className="my-voucher-code">Code: <strong>{voucher.code}</strong></p>
                <p className="my-voucher-expiry">Expires: {voucher.redeemedAt}</p>
              </div>
              <div className="my-voucher-actions">
                <span className={`voucher-status ${voucher.status.toLowerCase()}`}>
                  {voucher.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {myVouchersTotalPages > 1 && (
          <Stack spacing={2} className="pagination-container">
            <Pagination
              count={myVouchersTotalPages}
              page={myVouchersPage}
              onChange={handleMyVouchersPageChange}
              variant="outlined"
              shape="rounded"
              color="primary"
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
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  FaStore,
  FaBoxOpen,
  FaMoneyBillWave,
  FaUsers,
  FaChartLine,
  FaArrowUp,
  FaArrowDown,
  FaRecycle,
  FaLeaf,
  FaShoppingCart,
  FaDollarSign,
  FaShoppingBag,
  FaBoxes,
  FaUserFriends,
  FaStar
} from 'react-icons/fa';
import { 
  MdDashboard, 
  MdTrendingUp, 
  MdTrendingDown,
  MdAttachMoney,
  MdShoppingCart,
  MdInventory,
  MdPeople
} from 'react-icons/md';
import { BiPackage } from 'react-icons/bi';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import './BussinessDashbord.css';
import { PATH } from '../../../routes/path';
import { 
  getBusinessDashboardOverview, 
  getBusinessBorrowTransactionsMonthly,
  getBusinessTopBorrowed
} from '../../../store/slices/bussinessSlice';
import { Box, CircularProgress, TextField, Grid, Avatar, Chip, Typography } from '@mui/material';

export default function BussinessDashbord() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get dashboard data from Redux store
  const { 
    dashboardOverview, 
    dashboardLoading,
    borrowTransactionsMonthly,
    borrowTransactionsMonthlyLoading,
    topBorrowed,
    topBorrowedLoading
  } = useSelector((state) => state.businesses);

  // Cho phép nhập tạm thời (string) để không tự nhảy về 5 khi xóa ô input
  const [topBorrowedLimit, setTopBorrowedLimit] = useState('5');

  // Fetch dashboard data on component mount
  useEffect(() => {
    dispatch(getBusinessDashboardOverview());
    dispatch(getBusinessBorrowTransactionsMonthly({ 
      year: new Date().getFullYear(),
      type: '',
      status: ''
    }));
  }, [dispatch]);

  useEffect(() => {
    const topNumber = Number(topBorrowedLimit);
    dispatch(getBusinessTopBorrowed({ top: Number.isFinite(topNumber) && topNumber > 0 ? topNumber : 5 }));
  }, [dispatch, topBorrowedLimit]);

  // Calculate stats from dashboard overview
  const stats = dashboardOverview ? {
    borrowTransactions: { count: dashboardOverview.borrowTransactions || 0 },
    businessVouchers: { count: dashboardOverview.businessVouchers || 0 },
    productGroups: { count: dashboardOverview.productGroups || 0 },
    products: { count: dashboardOverview.products || 0 },
    staffs: { count: dashboardOverview.staffs || 0 },
    co2Reduced: { amount: dashboardOverview.co2Reduced || 0 },
    ecoPoints: { count: dashboardOverview.ecoPoints || 0 },
    averageRating: { value: dashboardOverview.averageRating || 0 },
    totalReviews: { count: dashboardOverview.totalReviews || 0 },
  } : null;

  // Format borrow transactions monthly data for chart
  const formatBorrowTransactionsData = () => {
    if (!borrowTransactionsMonthly || !borrowTransactionsMonthly.data) {
      return [];
    }

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return borrowTransactionsMonthly.data
      .map(item => ({
        month: monthNames[item.month - 1] || `Month ${item.month}`,
        count: item.count || 0,
        monthNumber: item.month
      }))
      .sort((a, b) => a.monthNumber - b.monthNumber);
  };

  const borrowTransactionsChartData = formatBorrowTransactionsData();

  // topBorrowed should be an array of products from Redux store
  const topBorrowedList = Array.isArray(topBorrowed) ? topBorrowed : [];

  // Material sales data
  const materialSalesData = [
    { name: 'Plastic', sales: 45, value: 15000000 },
    { name: 'Paper', sales: 38, value: 12000000 },
    { name: 'Metal', sales: 28, value: 9500000 },
    { name: 'Glass', sales: 22, value: 7000000 },
    { name: 'Electronics', sales: 18, value: 5500000 },
    { name: 'Others', sales: 15, value: 3678000 },
  ];

  // Material distribution pie chart
  const materialDistribution = [
    { name: 'Plastic', value: 45, color: '#12422a' },
    { name: 'Paper', value: 38, color: '#16a34a' },
    { name: 'Metal', value: 28, color: '#22c55e' },
    { name: 'Glass', value: 22, color: '#4ade80' },
    { name: 'Electronics', value: 18, color: '#86efac' },
    { name: 'Others', value: 15, color: '#bbf7d0' },
  ];

  // Recent transactions
  const recentTransactions = [
    {
      id: 'TXN001',
      customer: 'John Doe',
      type: 'Material Sale',
      amount: 250000,
      status: 'Completed',
      date: '2024-03-20'
    },
    {
      id: 'TXN002',
      customer: 'Jane Smith',
      type: 'Material Sale',
      amount: 180000,
      status: 'Completed',
      date: '2024-03-20'
    },
    {
      id: 'TXN003',
      customer: 'Mike Johnson',
      type: 'Voucher',
      amount: -50000,
      status: 'Pending',
      date: '2024-03-19'
    },
    {
      id: 'TXN004',
      customer: 'Sarah Wilson',
      type: 'Material Sale',
      amount: 320000,
      status: 'Completed',
      date: '2024-03-19'
    },
  ];

  // Quick actions
  const quickActions = [
    {
      title: 'Add Material',
      description: 'List new recyclable materials',
      icon: <FaBoxOpen />,
      path: PATH.BUSINESS_MATERIALS,
      color: '#12422a'
    },
    {
      title: 'View Transactions',
      description: 'Check transaction history',
      icon: <FaMoneyBillWave />,
      path: PATH.BUSINESS_TRANSACTION,
      color: '#f59e0b'
    },
    {
      title: 'Redeem Vouchers',
      description: 'Process customer vouchers',
      icon: <FaShoppingCart />,
      path: PATH.BUSINESS_REEDEM_REWARDS,
      color: '#3b82f6'
    },
    {
      title: 'Manage Wallet',
      description: 'View wallet balance',
      icon: <FaMoneyBillWave />,
      path: PATH.BUSINESS_WALLET,
      color: '#8b5cf6'
    },
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  const getBorrowedName = (item) => {
    return (
      item?.group?.name ||
      item?.productName ||
      item?.name ||
      item?.materialName ||
      item?.productGroupName ||
      'Unknown item'
    );
  };

  const getBorrowedCategory = (item) => {
    return (
      item?.group?.name ||
      item?.category ||
      item?.productGroupName ||
      item?.materialType ||
      item?.type ||
      item?.label ||
      'N/A'
    );
  };

  const getBorrowedCount = (item) => {
    const count =
      item?.reuseCount ??
      item?.totalBorrowed ??
      item?.borrowCount ??
      item?.totalBorrowTransactions ??
      item?.count ??
      item?.quantity ??
      0;
    return typeof count === 'number' ? count : Number(count) || 0;
  };

  const getBorrowedCo2 = (item) => {
    const co2 = item?.totalCo2Reduced ?? item?.co2Reduced ?? item?.co2 ?? 0;
    return typeof co2 === 'number' ? co2 : Number(co2) || 0;
  };

  const getBorrowedEcoPoints = (item) => {
    const points = item?.totalEcoPoints ?? item?.ecoPoints ?? item?.points ?? 0;
    return typeof points === 'number' ? points : Number(points) || 0;
  };

  if (dashboardLoading) {
    return (
      <div className="business-dashboard">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </div>
    );
  }

  return (
    <div className="business-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-title-section">
          <MdDashboard className="dashboard-title-icon" />
          <div>
            <h1 className="dashboard-title">Business Dashboard</h1>
            <p className="dashboard-description">
              Welcome back! Here's what's happening with your business today.
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="dashboard-stats">
          <div className="dashboard-stat-card">
            <div className="stat-card-header">
              <div className="stat-info">
                <h3 className="stat-label">Borrow Transactions</h3>
                <p className="stat-value">{formatNumber(stats.borrowTransactions.count)}</p>
              </div>
              <div className="stat-icon-container revenue">
                <FaShoppingBag className="stat-icon" color="#ffffff" size={32} />
              </div>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="stat-card-header">
              <div className="stat-info">
                <h3 className="stat-label">Business Vouchers</h3>
                <p className="stat-value">{formatNumber(stats.businessVouchers.count)}</p>
              </div>
              <div className="stat-icon-container orders">
                <FaShoppingCart className="stat-icon" color="#ffffff" size={32} />
              </div>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="stat-card-header">
              <div className="stat-info">
                <h3 className="stat-label">Product Groups</h3>
                <p className="stat-value">{formatNumber(stats.productGroups.count)}</p>
              </div>
              <div className="stat-icon-container materials">
                <FaBoxes className="stat-icon" color="#ffffff" size={32} />
              </div>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="stat-card-header">
              <div className="stat-info">
                <h3 className="stat-label">Products</h3>
                <p className="stat-value">{formatNumber(stats.products.count)}</p>
              </div>
              <div className="stat-icon-container customers">
                <BiPackage className="stat-icon" color="#ffffff" size={32} />
              </div>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="stat-card-header">
              <div className="stat-info">
                <h3 className="stat-label">Staffs</h3>
                <p className="stat-value">{formatNumber(stats.staffs.count)}</p>
              </div>
              <div className="stat-icon-container customers">
                <FaUserFriends className="stat-icon" color="#ffffff" size={32} />
              </div>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="stat-card-header">
              <div className="stat-info">
                <h3 className="stat-label">CO₂ Reduced</h3>
                <p className="stat-value">{stats.co2Reduced.amount.toFixed(2)} kg</p>
              </div>
              <div className="stat-icon-container revenue">
                <FaRecycle className="stat-icon" color="#ffffff" size={32} />
              </div>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="stat-card-header">
              <div className="stat-info">
                <h3 className="stat-label">Eco Points</h3>
                <p className="stat-value">{formatNumber(stats.ecoPoints.count)}</p>
              </div>
              <div className="stat-icon-container orders">
                <FaChartLine className="stat-icon" color="#ffffff" size={32} />
              </div>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="stat-card-header">
              <div className="stat-info">
                <h3 className="stat-label">Average Rating</h3>
                <p className="stat-value">{stats.averageRating.value.toFixed(1)} ⭐</p>
              </div>
              <div className="stat-icon-container customers">
                <FaStar className="stat-icon" color="#ffffff" size={32} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts Row 1 */}
      <div className="charts-row">
        {/* Borrow Transactions Chart */}
        <div className="chart-card large">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Borrow Transactions Overview</h3>
              <p className="chart-subtitle">Monthly borrow transactions trend</p>
            </div>
            <FaChartLine className="chart-icon" />
          </div>
          <div className="chart-container">
            {borrowTransactionsMonthlyLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                <CircularProgress />
              </Box>
            ) : borrowTransactionsChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={borrowTransactionsChartData}>
                  <defs>
                    <linearGradient id="colorTransactions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#12422a" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#12422a" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#12422a" 
                    fillOpacity={1} 
                    fill="url(#colorTransactions)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300, color: '#6b7280' }}>
                No data available
              </Box>
            )}
          </div>
        </div>

        {/* Totals Summary */}
        {borrowTransactionsMonthly && borrowTransactionsMonthly.totals && (
          <div className="chart-card small">
            <div className="chart-header">
              <div>
                <h3 className="chart-title">Transaction Totals</h3>
                <p className="chart-subtitle">Summary statistics</p>
              </div>
              <FaMoneyBillWave className="chart-icon" />
            </div>
            <div className="transactions-list">
              <div className="transaction-item">
                <div className="transaction-info">
                  <div className="transaction-customer">Total Reward Points</div>
                </div>
                <div className="transaction-details">
                  <div className="transaction-amount positive">
                    {formatNumber(borrowTransactionsMonthly.totals.totalRewardPoints || 0)}
                  </div>
                </div>
              </div>
              <div className="transaction-item">
                <div className="transaction-info">
                  <div className="transaction-customer">Total Ranking Points</div>
                </div>
                <div className="transaction-details">
                  <div className="transaction-amount positive">
                    {formatNumber(borrowTransactionsMonthly.totals.totalRankingPoints || 0)}
                  </div>
                </div>
              </div>
              <div className="transaction-item">
                <div className="transaction-info">
                  <div className="transaction-customer">Total Eco Points</div>
                </div>
                <div className="transaction-details">
                  <div className="transaction-amount positive">
                    {formatNumber(borrowTransactionsMonthly.totals.totalEcoPoints || 0)}
                  </div>
                </div>
              </div>
              <div className="transaction-item">
                <div className="transaction-info">
                  <div className="transaction-customer">Total CO₂ Reduced</div>
                </div>
                <div className="transaction-details">
                  <div className="transaction-amount positive">
                    {(borrowTransactionsMonthly.totals.totalCo2Reduced || 0).toFixed(2)} kg
                  </div>
                </div>
              </div>
              <div className="transaction-item">
                <div className="transaction-info">
                  <div className="transaction-customer">Total Deposit Amount</div>
                </div>
                <div className="transaction-details">
                  <div className="transaction-amount positive">
                    {formatCurrency(borrowTransactionsMonthly.totals.totalDepositAmount || 0)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Top Borrowed Ranking (giống top business admin) */}
      <div className="top-ranking-section">
        <div className="chart-header">
          <div>
            <h3 className="chart-title">Top Borrowed</h3>
            <p className="chart-subtitle">The most borrowed items</p>
          </div>
          <FaShoppingBag className="chart-icon" />
        </div>

        <div className="ranking-filters-section">
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: '#12422a', fontSize: '18px', letterSpacing: '0.5px' }}>
            Filters
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item size={3}>
              <TextField
                label="Top products"
                type="number"
                value={topBorrowedLimit}
                onChange={(e) => setTopBorrowedLimit(e.target.value)}
                variant="outlined"
                size="medium"
                fullWidth
                inputProps={{ min: 1, max: 50 }}
          
              />
            </Grid>
          </Grid>
        </div>

        {topBorrowedLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '260px' }}>
            <CircularProgress />
          </Box>
        ) : topBorrowedList.length > 0 ? (
          <div className="ranking-cards-grid">
            {topBorrowedList.map((item, index) => {
              const rank = index + 1;
              const isTopThree = rank <= 3;
              const rankColors = {
                1: { bg: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)', text: '#000' },
                2: { bg: 'linear-gradient(135deg, #C0C0C0 0%, #A9A9A9 100%)', text: '#000' },
                3: { bg: 'linear-gradient(135deg, #CD7F32 0%, #8B4513 100%)', text: '#fff' }
              };
              const rankColor = isTopThree ? rankColors[rank] : { bg: '#ffffff', text: '#6b7280' };

              const name = getBorrowedName(item);
              const category = getBorrowedCategory(item);
              const borrowCount = getBorrowedCount(item);
              const co2Value = getBorrowedCo2(item);
              const ecoPointsValue = getBorrowedEcoPoints(item);
              const imageUrl = item?.group?.imageUrl || item?.imageUrl || item?.productImage || item?.thumbnail || item?.photo;

              return (
                <div 
                  key={item?._id || item?.id || index} 
                  className={`ranking-card ${isTopThree ? 'top-rank' : ''}`}
                  style={isTopThree ? {
                    border: `3px solid ${rank === 1 ? '#FFD700' : rank === 2 ? '#C0C0C0' : '#CD7F32'}`,
                    background: rankColor.bg
                  } : {}}
                >
                  <div className="ranking-card-rank-badge" style={isTopThree ? { background: rankColor.bg, color: rankColor.text } : {}}>
                    #{rank}
                  </div>
                  
                  <div className="ranking-card-avatar-container">
                    <Avatar
                      src={imageUrl}
                      alt={name}
                      sx={{ 
                        width: 96, 
                        height: 96, 
                        border: isTopThree ? `4px solid ${rank === 1 ? '#FFD700' : rank === 2 ? '#C0C0C0' : '#CD7F32'}` : '4px solid #12422a',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        fontSize: '28px',
                        backgroundColor: '#12422a',
                        color: '#fff'
                      }}
                    >
                      {!imageUrl && name?.[0]}
                    </Avatar>
                    {isTopThree && (
                      <div className="ranking-medal">
                        {rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}
                      </div>
                    )}
                  </div>

                  <div className="ranking-card-content">
                    <div className="ranking-card-header-info">
                      <h3 className="ranking-card-name" style={isTopThree ? { color: rankColor.text } : {}}>
                        {name}
                      </h3>
                      <Chip
                        label={category}
                        color="success"
                        size="small"
                        sx={{ 
                          fontWeight: 600,
                          height: '24px',
                          fontSize: '11px'
                        }}
                      />
                    </div>

                    <div className="ranking-card-metrics">
                      <div className="ranking-metric-item">
                        <div className="ranking-metric-icon" style={{ backgroundColor: '#12422a15', color: '#12422a' }}>
                          <FaShoppingBag />
                        </div>
                        <div className="ranking-metric-info">
                          <span className="ranking-metric-label">Borrow Count</span>
                          <span className="ranking-metric-value">
                            {formatNumber(borrowCount)}
                          </span>
                        </div>
                      </div>
                      <div className="ranking-metric-item">
                        <div className="ranking-metric-icon" style={{ backgroundColor: '#f59e0b15', color: '#f59e0b' }}>
                          <FaRecycle />
                        </div>
                        <div className="ranking-metric-info">
                          <span className="ranking-metric-label">CO₂ Reduced</span>
                          <span className="ranking-metric-value">
                            {co2Value.toFixed(2)} kg
                          </span>
                        </div>
                      </div>
                      <div className="ranking-metric-item">
                        <div className="ranking-metric-icon" style={{ backgroundColor: '#10b98115', color: '#10b981' }}>
                          <FaLeaf />
                        </div>
                        <div className="ranking-metric-info">
                          <span className="ranking-metric-label">Eco Points</span>
                          <span className="ranking-metric-value">
                            {formatNumber(ecoPointsValue)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '240px', backgroundColor: 'white', borderRadius: '16px', border: '2px dashed #e5e7eb' }}>
            <Typography color="text.secondary" sx={{ fontSize: '16px' }}>Không có dữ liệu</Typography>
          </Box>
        )}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h3 className="section-title">Quick Actions</h3>
        <div className="quick-actions-grid">
          {quickActions.map((action, index) => (
            <div
              key={index}
              className="quick-action-card"
              onClick={() => navigate(action.path)}
              style={{ '--action-color': action.color }}
            >
              <div className="action-icon" style={{ backgroundColor: action.color }}>
                {action.icon}
              </div>
              <div className="action-content">
                <h4 className="action-title">{action.title}</h4>
                <p className="action-description">{action.description}</p>
              </div>
              <div className="action-arrow">→</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

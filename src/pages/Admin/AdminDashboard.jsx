import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  FaUsers, 
  FaStore, 
  FaRecycle, 
  FaGift,
  FaClipboardList,
  FaCrown,
  FaArrowRight,
  FaChartLine,
  FaCheckCircle,
  FaClock,
  FaLeaf,
  FaCoins,
  FaStar,
  FaMoneyBillWave,
  FaBoxes,
  FaExchangeAlt,
  FaWallet
} from 'react-icons/fa';
import { IoMdTrendingUp, IoMdTrendingDown } from 'react-icons/io';
import { MdDashboard } from 'react-icons/md';
import { 
  getAdminDashboardOverviewApi,
  getBorrowTransactionsMonthlyApi,
  getTopBusinessesApi,
  getBusinessMonthlyApi,
  getTopCustomersApi,
  getCustomerMonthlyApi,
  getWalletTransactionsApi,
  getWalletTransactionsByMonthApi
} from '../../store/slices/adminSlice';
import { Box, CircularProgress, Typography, TextField, Select, MenuItem, FormControl, InputLabel, Grid, Rating, Avatar, Chip } from '@mui/material';
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
import './AdminDashboard.css';
import { PATH } from '../../routes/path';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Filter states for borrow transactions
  const [borrowFilters, setBorrowFilters] = useState({
    year: new Date().getFullYear(),
    type: '',
    status: ''
  });

  // Filter states for top businesses
  const [businessFilters, setBusinessFilters] = useState({
    top: 5,
    sortBy: '',
    order: ''
  });

  // Filter states for top customers
  const [customerFilters, setCustomerFilters] = useState({
    top: 5,
    sortBy: '',
    order: ''
  });

  // Filter state for business monthly
  const [businessMonthlyYear, setBusinessMonthlyYear] = useState(new Date().getFullYear());

  // Filter state for customer monthly
  const [customerMonthlyYear, setCustomerMonthlyYear] = useState(new Date().getFullYear());

  // Filter states for wallet transactions monthly
  const [walletTransactionsFilters, setWalletTransactionsFilters] = useState({
    year: new Date().getFullYear(),
    transactionType: '',
    direction: '',
    status: ''
  });
  
  // Get dashboard data from Redux store
  const { 
    dashboardOverview, 
    dashboardLoading,
    borrowTransactionsMonthly,
    topBusinesses,
    businessMonthly,
    topCustomers,
    customerMonthly,
    walletTransactions,
    walletTransactionsByMonth,
    isLoading
  } = useSelector((state) => state.admin);

  // Fetch dashboard data on component mount
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    
    // Dispatch all API calls (except borrowTransactionsMonthly, topBusinesses, topCustomers, businessMonthly, customerMonthly, and walletTransactionsByMonth - handled by filters useEffect)
    dispatch(getAdminDashboardOverviewApi());
    dispatch(getWalletTransactionsApi());
  }, [dispatch]);

  // Fetch borrow transactions when filters change
  useEffect(() => {
    const filters = {
      year: borrowFilters.year || new Date().getFullYear(),
      ...(borrowFilters.type && { type: borrowFilters.type }),
      ...(borrowFilters.status && { status: borrowFilters.status })
    };
    dispatch(getBorrowTransactionsMonthlyApi(filters));
  }, [borrowFilters, dispatch]);

  // Fetch top businesses when filters change
  useEffect(() => {
    const filters = {
      top: businessFilters.top || 5,
      ...(businessFilters.sortBy && { sortBy: businessFilters.sortBy }),
      ...(businessFilters.order && { order: businessFilters.order })
    };
    dispatch(getTopBusinessesApi(filters));
  }, [businessFilters, dispatch]);

  // Fetch top customers when filters change
  useEffect(() => {
    const filters = {
      top: customerFilters.top || 5,
      ...(customerFilters.sortBy && { sortBy: customerFilters.sortBy }),
      ...(customerFilters.order && { order: customerFilters.order })
    };
    dispatch(getTopCustomersApi(filters));
  }, [customerFilters, dispatch]);

  // Fetch business monthly when year changes
  useEffect(() => {
    dispatch(getBusinessMonthlyApi({ year: businessMonthlyYear }));
  }, [businessMonthlyYear, dispatch]);

  // Fetch customer monthly when year changes
  useEffect(() => {
    dispatch(getCustomerMonthlyApi({ year: customerMonthlyYear }));
  }, [customerMonthlyYear, dispatch]);

  // Fetch wallet transactions monthly when filters change
  useEffect(() => {
    const filters = {
      year: walletTransactionsFilters.year || new Date().getFullYear(),
      ...(walletTransactionsFilters.transactionType && { transactionType: walletTransactionsFilters.transactionType }),
      ...(walletTransactionsFilters.direction && { direction: walletTransactionsFilters.direction }),
      ...(walletTransactionsFilters.status && { status: walletTransactionsFilters.status })
    };
    dispatch(getWalletTransactionsByMonthApi(filters));
  }, [walletTransactionsFilters, dispatch]);

  // Calculate total users
  const totalUsers = dashboardOverview?.users 
    ? (dashboardOverview.users.customers || 0) + 
      (dashboardOverview.users.businesses || 0) + 
      (dashboardOverview.users.staffs || 0)
    : 0;

  // Calculate total vouchers
  const totalVouchers = dashboardOverview?.vouchers
    ? (dashboardOverview.vouchers.businessVouchers || 0) + 
      (dashboardOverview.vouchers.leaderboardVouchers || 0)
    : 0;

  // Calculate total transactions
  const totalTransactions = dashboardOverview?.transactions
    ? (dashboardOverview.transactions.borrowTransactions || 0) + 
      (dashboardOverview.transactions.walletTransactions || 0)
    : 0;

  // Calculate total products
  const totalProducts = dashboardOverview?.products
    ? (dashboardOverview.products.groups || 0) + 
      (dashboardOverview.products.products || 0)
    : 0;

  // Format money
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount || 0);
  };

  // Format borrow transactions monthly data for chart
  const formatBorrowTransactionsData = () => {
    if (!borrowTransactionsMonthly) {
      return [];
    }

    // Handle different response structures
    let dataArray = null;
    
    // Check if it's already an array
    if (Array.isArray(borrowTransactionsMonthly)) {
      dataArray = borrowTransactionsMonthly;
    }
    // Check if data exists and is an array
    else if (borrowTransactionsMonthly.data && Array.isArray(borrowTransactionsMonthly.data)) {
      dataArray = borrowTransactionsMonthly.data;
    }
    // Fallback: check nested data
    else if (borrowTransactionsMonthly.data?.data && Array.isArray(borrowTransactionsMonthly.data.data)) {
      dataArray = borrowTransactionsMonthly.data.data;
    }

    if (!dataArray || !Array.isArray(dataArray) || dataArray.length === 0) {
      return [];
    }

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return dataArray
      .map(item => ({
        month: monthNames[item.month - 1] || `Month ${item.month}`,
        count: item.count || 0,
        monthNumber: item.month
      }))
      .sort((a, b) => a.monthNumber - b.monthNumber);
  };

  const borrowTransactionsChartData = formatBorrowTransactionsData();

  // Format business monthly data for chart
  const formatBusinessMonthlyData = () => {
    if (!businessMonthly) {
      return [];
    }

    // Handle different response structures
    let dataArray = null;
    
    // Check if it's already an array
    if (Array.isArray(businessMonthly)) {
      dataArray = businessMonthly;
    }
    // Check if data exists and is an array
    else if (businessMonthly.data && Array.isArray(businessMonthly.data)) {
      dataArray = businessMonthly.data;
    }
    // Fallback: check nested data
    else if (businessMonthly.data?.data && Array.isArray(businessMonthly.data.data)) {
      dataArray = businessMonthly.data.data;
    }

    if (!dataArray || !Array.isArray(dataArray) || dataArray.length === 0) {
      return [];
    }

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return dataArray.map(item => ({
      month: monthNames[item.month - 1] || `Month ${item.month}`,
      count: item.count || 0,
      monthNumber: item.month
    })).sort((a, b) => a.monthNumber - b.monthNumber);
  };

  const businessMonthlyChartData = formatBusinessMonthlyData();

  // Format customer monthly data for chart
  const formatCustomerMonthlyData = () => {
    if (!customerMonthly) {
      return [];
    }

    // Handle different response structures
    let dataArray = null;
    
    // Check if it's already an array
    if (Array.isArray(customerMonthly)) {
      dataArray = customerMonthly;
    }
    // Check if data exists and is an array
    else if (customerMonthly.data && Array.isArray(customerMonthly.data)) {
      dataArray = customerMonthly.data;
    }
    // Fallback: check nested data
    else if (customerMonthly.data?.data && Array.isArray(customerMonthly.data.data)) {
      dataArray = customerMonthly.data.data;
    }

    if (!dataArray || !Array.isArray(dataArray) || dataArray.length === 0) {
      return [];
    }

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return dataArray
      .map(item => ({
        month: monthNames[item.month - 1] || `Month ${item.month}`,
        count: item.count || 0,
        monthNumber: item.month
      }))
      .sort((a, b) => a.monthNumber - b.monthNumber);
  };

  const customerMonthlyChartData = formatCustomerMonthlyData();

  // Format wallet transactions monthly data for chart
  const formatWalletTransactionsMonthlyData = () => {
    if (!walletTransactionsByMonth) {
      return [];
    }

    // Handle different response structures
    let dataArray = null;
    
    // Check if it's already an array
    if (Array.isArray(walletTransactionsByMonth)) {
      dataArray = walletTransactionsByMonth;
    }
    // Check if data exists and is an array
    else if (walletTransactionsByMonth.data && Array.isArray(walletTransactionsByMonth.data)) {
      dataArray = walletTransactionsByMonth.data;
    }
    // Fallback: check nested data
    else if (walletTransactionsByMonth.data?.data && Array.isArray(walletTransactionsByMonth.data.data)) {
      dataArray = walletTransactionsByMonth.data.data;
    }

    if (!dataArray || !Array.isArray(dataArray) || dataArray.length === 0) {
      return [];
    }

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return dataArray
      .map(item => ({
        month: monthNames[item.month - 1] || `Month ${item.month}`,
        count: item.count || 0,
        monthNumber: item.month
      }))
      .sort((a, b) => a.monthNumber - b.monthNumber);
  };

  const walletTransactionsMonthlyChartData = formatWalletTransactionsMonthlyData();

  const recentActivities = [
    {
      id: 1,
      type: 'user',
      title: 'New user registered',
      description: 'user@example.com joined the platform',
      time: '5 minutes ago',
      icon: <FaUsers />,
      color: '#3b82f6'
    },
    {
      id: 2,
      type: 'store',
      title: 'Store approved',
      description: 'Green Recycling Center was approved',
      time: '15 minutes ago',
      icon: <FaStore />,
      color: '#12422a'
    },
    {
      id: 3,
      type: 'material',
      title: 'Material submitted',
      description: 'New plastic material pending review',
      time: '1 hour ago',
      icon: <FaRecycle />,
      color: '#f59e0b'
    },
    {
      id: 4,
      type: 'voucher',
      title: 'Voucher created',
      description: 'Summer Sale 2025 voucher activated',
      time: '2 hours ago',
      icon: <FaGift />,
      color: '#8b5cf6'
    }
  ];

  const quickActions = [
    {
      title: 'Manage Users',
      description: 'View and manage all users',
      icon: <FaUsers />,
      path: PATH.ADMIN_USERS,
      color: '#3b82f6'
    },
    {
      title: 'Store Management',
      description: 'Approve or block stores',
      icon: <FaStore />,
      path: PATH.ADMIN_STORE,
      color: '#12422a'
    },
    {
      title: 'Materials',
      description: 'Review recyclable materials',
      icon: <FaRecycle />,
      path: PATH.ADMIN_MATERIAL,
      color: '#f59e0b'
    },
    {
      title: 'Vouchers',
      description: 'Manage discount vouchers',
      icon: <FaGift />,
      path: PATH.ADMIN_VOUCHER,
      color: '#8b5cf6'
    },
    {
      title: 'Registrations',
      description: 'Review business applications',
      icon: <FaClipboardList />,
      path: PATH.ADMIN_REGISTRATION,
      color: '#ef4444'
    },
    {
      title: 'Subscriptions',
      description: 'Manage subscription plans',
      icon: <FaCrown />,
      path: PATH.ADMIN_SUBSCRIPTIONS,
      color: '#ec4899'
    }
  ];

  // Chart data
  const userGrowthData = [
    { month: 'Jan', users: 850, stores: 45 },
    { month: 'Feb', users: 920, stores: 52 },
    { month: 'Mar', users: 980, stores: 58 },
    { month: 'Apr', users: 1050, stores: 65 },
    { month: 'May', users: 1120, stores: 73 },
    { month: 'Jun', users: 1180, stores: 81 },
    { month: 'Jul', users: 1247, stores: 89 }
  ];

  const materialDistributionData = [
    { name: 'Plastic', value: 45, color: '#3b82f6' },
    { name: 'Paper', value: 35, color: '#10b981' },
    { name: 'Metal', value: 28, color: '#f59e0b' },
    { name: 'Glass', value: 25, color: '#8b5cf6' },
    { name: 'Electronic', value: 23, color: '#ef4444' }
  ];

  const voucherStatusData = [
    { name: 'Active', value: 28, color: '#12422a' },
    { name: 'Pending', value: 12, color: '#f59e0b' },
    { name: 'Expired', value: 5, color: '#dc2626' }
  ];

  const monthlyRevenueData = [
    { month: 'Jan', revenue: 45000 },
    { month: 'Feb', revenue: 52000 },
    { month: 'Mar', revenue: 48000 },
    { month: 'Apr', revenue: 61000 },
    { month: 'May', revenue: 55000 },
    { month: 'Jun', revenue: 67000 },
    { month: 'Jul', revenue: 72000 }
  ];

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <MdDashboard className="header-icon" />
            <div>
              <h1 className="dashboard-title">Admin Dashboard</h1>
              <p className="dashboard-subtitle">Welcome back! Here's what's happening today.</p>
            </div>
          </div>
          <div className="header-right">
            <div className="date-display">
              <FaClock className="clock-icon" />
              <span>{new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Overview */}
      {dashboardLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      ) : dashboardOverview ? (
        <div className="dashboard-overview-container">
          {/* Key Statistics Cards - 5 Cards Only */}
          <div className="stats-grid">
            {/* Card 1: Gradient Card - Users */}
            <div className="stat-card stat-card-gradient stat-card-blue">
              <div className="stat-icon-large">
                <FaUsers />
              </div>
              <div className="stat-content">
                <h3 className="stat-label">Total Users</h3>
                <p className="stat-value">{totalUsers.toLocaleString()}</p>
                <p className="stat-description">
                  {dashboardOverview.users?.customers || 0} Customers, {dashboardOverview.users?.businesses || 0} Businesses, {dashboardOverview.users?.staffs || 0} Staffs
                </p>
              </div>
            </div>

            {/* Card 2: Outlined Card - Vouchers */}
            <div className="stat-card stat-card-outlined stat-card-purple">
              <div className="stat-header">
                <div className="stat-icon-wrapper">
                  <FaGift />
                </div>
              </div>
              <div className="stat-content">
                <h3 className="stat-label">Vouchers</h3>
                <p className="stat-value">{totalVouchers.toLocaleString()}</p>
                <p className="stat-description">
                  {dashboardOverview.vouchers?.businessVouchers || 0} Business, {dashboardOverview.vouchers?.leaderboardVouchers || 0} Leaderboard
                </p>
              </div>
            </div>

            {/* Card 3: Filled Card - Transactions */}
            <div className="stat-card stat-card-filled stat-card-indigo">
              <div className="stat-header">
                <div className="stat-icon-wrapper">
                  <FaExchangeAlt />
                </div>
              </div>
              <div className="stat-content">
                <h3 className="stat-label">Transactions</h3>
                <p className="stat-value">{totalTransactions.toLocaleString()}</p>
                <p className="stat-description">
                  {dashboardOverview.transactions?.borrowTransactions || 0} Borrow, {dashboardOverview.transactions?.walletTransactions || 0} Wallet
                </p>
              </div>
            </div>

            {/* Card 4: Border Highlight - Products */}
            <div className="stat-card stat-card-border stat-card-green">
              <div className="stat-header">
                <div className="stat-icon-wrapper">
                  <FaBoxes />
                </div>
              </div>
              <div className="stat-content">
                <h3 className="stat-label">Products</h3>
                <p className="stat-value">{totalProducts.toLocaleString()}</p>
                <p className="stat-description">
                  {dashboardOverview.products?.groups || 0} Groups, {dashboardOverview.products?.products || 0} Items
                </p>
              </div>
            </div>

            {/* Card 5: Shadow Card - Money */}
            <div className="stat-card stat-card-shadow stat-card-money">
              <div className="stat-header">
                <div className="stat-icon-wrapper">
                  <FaMoneyBillWave />
                </div>
              </div>
              <div className="stat-content">
                <h3 className="stat-label">Total Money</h3>
                <p className="stat-value-small">{formatMoney(dashboardOverview.totalMoneyInSystem || 0)}</p>
                <p className="stat-description">In system</p>
              </div>
            </div>
          </div>

          {/* Additional Statistics - Table/List Design */}
          <div className="additional-stats-container">
            {/* Business & Materials Section */}
            <div className="stats-table-section">
              <div className="table-section-header">
                <FaStore className="section-icon" style={{ color: '#12422a' }} />
                <h2 className="section-title">Business & Materials</h2>
              </div>
              <div className="stats-table-wrapper">
                <table className="stats-table">
                  <tbody>
                    <tr>
                      <td className="table-label">
                        <FaStore className="table-icon" />
                        Businesses
                      </td>
                      <td className="table-value">{(dashboardOverview.users?.businesses || 0).toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td className="table-label">
                        <FaRecycle className="table-icon" />
                        Materials
                      </td>
                      <td className="table-value">{(dashboardOverview.materials || 0).toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Environmental Impact Section */}
            <div className="stats-list-section">
              <div className="list-section-header">
                <FaLeaf className="section-icon" style={{ color: '#10b981' }} />
                <h2 className="section-title">Environmental Impact</h2>
              </div>
              <div className="stats-list">
                <div className="stats-list-item">
                  <div className="list-item-icon" style={{ backgroundColor: '#ecfdf5', color: '#10b981' }}>
                    <FaRecycle />
                  </div>
                  <div className="list-item-content">
                    <div className="list-item-label">Total Reuses</div>
                    <div className="list-item-value">{(dashboardOverview.totalReuses || 0).toLocaleString()}</div>
                  </div>
                </div>
                <div className="stats-list-item">
                  <div className="list-item-icon" style={{ backgroundColor: '#fef3c7', color: '#f59e0b' }}>
                    <FaChartLine />
                  </div>
                  <div className="list-item-content">
                    <div className="list-item-label">Return Rate</div>
                    <div className="list-item-value">{((dashboardOverview.returnRate || 0).toFixed(1))}%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Platform Performance Section */}
            <div className="stats-badge-section">
              <div className="badge-section-header">
                <FaStar className="section-icon" style={{ color: '#fbbf24' }} />
                <h2 className="section-title">Platform Performance</h2>
              </div>
              <div className="stats-badges">
                <div className="stat-badge">
                  <div className="badge-label">Average Rating</div>
                  <div className="badge-value">
                    <FaStar className="badge-star" />
                    {(dashboardOverview.averageRating || 0).toFixed(1)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CO2 Environmental Impact Section */}
          <div className="co2-impact-section">
            <div className="co2-section-header">
              <div className="co2-header-icon">
                <FaLeaf />
              </div>
              <div className="co2-header-content">
                <h2 className="co2-section-title">CO2 Reduction Impact</h2>
                <p className="co2-section-subtitle">Understanding our environmental contribution</p>
              </div>
              <div className="co2-stat-display">
                <div className="co2-stat-value">{(dashboardOverview.co2Reduced || 0).toFixed(2)}</div>
                <div className="co2-stat-unit">kg CO₂</div>
              </div>
            </div>

            <div className="co2-content-grid">
              {/* Left: CO2 Impact Information */}
              <div className="co2-info-card">
                <div className="co2-info-header">
                  <FaLeaf className="co2-info-icon" />
                  <h3 className="co2-info-title">How CO₂ Affects the Environment</h3>
                </div>
                <div className="co2-info-content">
                  <div className="co2-impact-item">
                    <div className="impact-icon impact-negative">⚠️</div>
                    <div className="impact-content">
                      <h4 className="impact-title">Climate Change</h4>
                      <p className="impact-description">
                        CO₂ is a greenhouse gas that traps heat in the atmosphere, contributing to global warming and climate change.
                      </p>
                    </div>
                  </div>
                  <div className="co2-impact-item">
                    <div className="impact-icon impact-negative">🌡️</div>
                    <div className="impact-content">
                      <h4 className="impact-title">Rising Temperatures</h4>
                      <p className="impact-description">
                        Increased CO₂ levels lead to higher global temperatures, causing extreme weather events and ecosystem disruption.
                      </p>
                    </div>
                  </div>
                  <div className="co2-impact-item">
                    <div className="impact-icon impact-negative">🌊</div>
                    <div className="impact-content">
                      <h4 className="impact-title">Ocean Acidification</h4>
                      <p className="impact-description">
                        Excess CO₂ dissolves in oceans, making them more acidic and harming marine life and coral reefs.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Benefits of CO2 Reduction */}
              <div className="co2-benefits-card">
                <div className="co2-benefits-header">
                  <FaLeaf className="co2-benefits-icon" />
                  <h3 className="co2-benefits-title">Benefits of Our CO₂ Reduction</h3>
                </div>
                <div className="co2-benefits-content">
                  <div className="co2-benefit-item">
                    <div className="benefit-icon benefit-positive">🌳</div>
                    <div className="benefit-content">
                      <h4 className="benefit-title">Equivalent to Planting Trees</h4>
                      <p className="benefit-description">
                        Reducing {(dashboardOverview.co2Reduced || 0).toFixed(2)} kg of CO₂ is equivalent to planting approximately {Math.round((dashboardOverview.co2Reduced || 0) * 0.5)} trees.
                      </p>
                    </div>
                  </div>
                  <div className="co2-benefit-item">
                    <div className="benefit-icon benefit-positive">🚗</div>
                    <div className="benefit-content">
                      <h4 className="benefit-title">Reduced Vehicle Emissions</h4>
                      <p className="benefit-description">
                        This reduction equals removing about {Math.round((dashboardOverview.co2Reduced || 0) / 4.6)} km of car emissions from the atmosphere.
                      </p>
                    </div>
                  </div>
                  <div className="co2-benefit-item">
                    <div className="benefit-icon benefit-positive">💚</div>
                    <div className="benefit-content">
                      <h4 className="benefit-title">Healthier Environment</h4>
                      <p className="benefit-description">
                        Lower CO₂ levels mean cleaner air, reduced health risks, and a more sustainable future for generations to come.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <Typography>No data available</Typography>
        </Box>
      )}

      {/* Borrow Transactions Statistics Section */}
      <div className="borrow-transactions-section">
          <div className="borrow-section-header">
            <div>
              <h2 className="borrow-section-title">Borrow Transactions Statistics</h2>
            </div>
          </div>

          {/* Filters Section */}
          <div className="borrow-filters-section">
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: '#12422a', fontSize: '18px', letterSpacing: '0.5px' }}>
              Filters
            </Typography>
            <Grid container spacing={2} alignItems="flex-start">
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <TextField
                    label="Year to Filter"
                    type="number"
                    value={borrowFilters.year}
                    onChange={(e) => setBorrowFilters({ ...borrowFilters, year: parseInt(e.target.value) || new Date().getFullYear() })}
                    variant="outlined"
                    size="small"
                    helperText="Filter by year"
                    inputProps={{ min: 2000, max: 2100 }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'white',
                        borderRadius: '10px',
                        transition: 'all 0.3s ease',
                        '&:hover fieldset': {
                          borderColor: '#10b981',
                          borderWidth: '2px',
                          boxShadow: '0 2px 8px rgba(16, 185, 129, 0.15)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#10b981',
                          borderWidth: '2px',
                          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        fontWeight: 600,
                        color: '#4b5563',
                        '&.Mui-focused': {
                          color: '#10b981',
                          fontWeight: 700,
                        },
                      },
                      '& .MuiFormHelperText-root': {
                        color: '#6b7280',
                        fontSize: '0.75rem',
                        marginTop: '4px',
                      },
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size="small" variant="outlined">
                  <InputLabel 
                    id="borrow-type-filter-label"
                    sx={{
                      backgroundColor: 'white',
                      px: 0.5,
                    }}
                  >
                    Filter by Transaction Type
                  </InputLabel>
                  <Select
                    labelId="borrow-type-filter-label"
                    value={borrowFilters.type}
                    onChange={(e) => setBorrowFilters({ ...borrowFilters, type: e.target.value })}
                    label="Filter by Transaction Type"
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 300,
                          zIndex: 1300
                        }
                      },
                      style: {
                        zIndex: 1300
                      }
                    }}
                    sx={{
                      backgroundColor: 'white',
                      borderRadius: '10px',
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#10b981',
                        borderWidth: '2px',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#10b981',
                        borderWidth: '2px',
                      },
                      '& .MuiSelect-select': {
                        py: 1.25,
                        fontWeight: 500,
                      },
                    }}
                  >
                    <MenuItem value="">All Types</MenuItem>
                    <MenuItem value="borrow">borrow</MenuItem>
                    <MenuItem value="return_success">return_success</MenuItem>
                    <MenuItem value="return_failed">return_failed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size="small" variant="outlined">
                  <InputLabel 
                    id="borrow-status-filter-label"
                    sx={{
                      backgroundColor: 'white',
                      px: 0.5,
                    }}
                  >
                    Filter by Transaction Status
                  </InputLabel>
                  <Select
                    labelId="borrow-status-filter-label"
                    value={borrowFilters.status}
                    onChange={(e) => setBorrowFilters({ ...borrowFilters, status: e.target.value })}
                    label="Filter by Transaction Status"
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 300,
                          zIndex: 1300
                        }
                      },
                      style: {
                        zIndex: 1300
                      }
                    }}
                    sx={{
                      backgroundColor: 'white',
                      borderRadius: '10px',
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#10b981',
                        borderWidth: '2px',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#10b981',
                        borderWidth: '2px',
                      },
                      '& .MuiSelect-select': {
                        py: 1.25,
                        fontWeight: 500,
                      },
                    }}
                  >
                    <MenuItem value="">All Statuses</MenuItem>
                    <MenuItem value="pending_pickup">pending_pickup</MenuItem>
                    <MenuItem value="borrowing">borrowing</MenuItem>
                    <MenuItem value="returned">returned</MenuItem>
                    <MenuItem value="return_late">return_late</MenuItem>
                    <MenuItem value="rejected">rejected</MenuItem>
                    <MenuItem value="cancelled">cancelled</MenuItem>
                    <MenuItem value="lost">lost</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </div>

          <div className="borrow-transactions-content">
            {/* Chart Card */}
            <div className="borrow-chart-card">
              <div className="chart-header">
                <h3 className="chart-title">Monthly Transaction Count</h3>
                <p className="chart-subtitle">Number of borrow transactions per month</p>
              </div>
              {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '350px' }}>
                  <CircularProgress size={40} />
                </Box>
              ) : borrowTransactionsChartData && borrowTransactionsChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={borrowTransactionsChartData}>
                    <defs>
                      <linearGradient id="colorBorrowTransactions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.2}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="month" 
                      stroke="#6b7280"
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                    />
                    <YAxis 
                      stroke="#6b7280"
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                      label={{ value: 'Number of Transactions', angle: -90, position: 'insideLeft', style: { fill: '#6b7280' } }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }}
                      formatter={(value) => [value, 'Transactions']}
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Bar 
                      dataKey="count" 
                      fill="url(#colorBorrowTransactions)" 
                      radius={[8, 8, 0, 0]}
                      name="Transactions"
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '350px' }}>
                  <Typography color="text.secondary">No data available</Typography>
                </Box>
              )}
            </div>

                {/* Totals Cards */}
            {borrowTransactionsMonthly?.totals && (
              <div className="borrow-totals-grid">
                {/* Reward Points Card */}
                <div className="borrow-total-card">
                  <div className="total-card-icon" style={{ backgroundColor: '#3b82f615', color: '#3b82f6' }}>
                    <FaCoins />
                  </div>
                  <div className="total-card-content">
                    <h4 className="total-card-label">Total Reward Points</h4>
                    <p className="total-card-value">
                      {borrowTransactionsMonthly.totals.totalRewardPoints?.toLocaleString() || 0}
                    </p>
                  </div>
                </div>

                {/* Ranking Points Card */}
                <div className="borrow-total-card">
                  <div className="total-card-icon" style={{ backgroundColor: '#8b5cf615', color: '#8b5cf6' }}>
                    <FaCrown />
                  </div>
                  <div className="total-card-content">
                    <h4 className="total-card-label">Total Ranking Points</h4>
                    <p className="total-card-value">
                      {borrowTransactionsMonthly.totals.totalRankingPoints?.toLocaleString() || 0}
                    </p>
                  </div>
                </div>

                {/* Eco Points Card */}
                <div className="borrow-total-card">
                  <div className="total-card-icon" style={{ backgroundColor: '#10b98115', color: '#10b981' }}>
                    <FaLeaf />
                  </div>
                  <div className="total-card-content">
                    <h4 className="total-card-label">Total Eco Points</h4>
                    <p className="total-card-value">
                      {borrowTransactionsMonthly.totals.totalEcoPoints?.toLocaleString('en-US', { maximumFractionDigits: 1 }) || 0}
                    </p>
                  </div>
                </div>

                {/* CO2 Reduced Card */}
                <div className="borrow-total-card">
                  <div className="total-card-icon" style={{ backgroundColor: '#f59e0b15', color: '#f59e0b' }}>
                    <FaRecycle />
                  </div>
                  <div className="total-card-content">
                    <h4 className="total-card-label">Total CO₂ Reduced</h4>
                    <p className="total-card-value">
                      {borrowTransactionsMonthly.totals.totalCo2Reduced?.toFixed(2) || 0} kg
                    </p>
                  </div>
                </div>

                {/* Deposit Amount Card */}
                <div className="borrow-total-card">
                  <div className="total-card-icon" style={{ backgroundColor: '#12422a15', color: '#12422a' }}>
                    <FaMoneyBillWave />
                  </div>
                  <div className="total-card-content">
                    <h4 className="total-card-label">Total Deposit Amount</h4>
                    <p className="total-card-value">
                      {formatMoney(borrowTransactionsMonthly.totals.totalDepositAmount || 0)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      {/* Business Monthly Statistics Section */}
      <div className="business-monthly-section">
        <div className="business-monthly-header">
          <div>
            <h2 className="business-monthly-title">Business Monthly Statistics</h2>
          </div>
        </div>

        {/* Year Filter Section */}
        <div className="business-monthly-filter-section">
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: '#12422a', fontSize: '18px', letterSpacing: '0.5px' }}>
            Filter
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <TextField
                  label="Year to Filter"
                  type="number"
                  value={businessMonthlyYear}
                  onChange={(e) => setBusinessMonthlyYear(parseInt(e.target.value) || new Date().getFullYear())}
                  variant="outlined"
                  size="small"
                  helperText="Filter by year"
                  inputProps={{ min: 2000, max: 2100 }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'white',
                      borderRadius: '10px',
                      transition: 'all 0.3s ease',
                      '&:hover fieldset': {
                        borderColor: '#12422a',
                        borderWidth: '2px',
                        boxShadow: '0 2px 8px rgba(18, 66, 42, 0.15)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#12422a',
                        borderWidth: '2px',
                        boxShadow: '0 4px 12px rgba(18, 66, 42, 0.25)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      fontWeight: 600,
                      color: '#4b5563',
                      '&.Mui-focused': {
                        color: '#12422a',
                        fontWeight: 700,
                      },
                    },
                    '& .MuiFormHelperText-root': {
                      color: '#6b7280',
                      fontSize: '0.75rem',
                      marginTop: '4px',
                    },
                  }}
                />
              </FormControl>
            </Grid>
          </Grid>
        </div>

        <div className="business-monthly-content">
          {/* Chart Card */}
          <div className="business-monthly-chart-card">
              <div className="chart-header">
                <h3 className="chart-title">Monthly Business Registration Count</h3>
                <p className="chart-subtitle">Number of businesses registered per month</p>
              </div>
              {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '350px' }}>
                  <CircularProgress size={40} />
                </Box>
              ) : businessMonthlyChartData && businessMonthlyChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={businessMonthlyChartData}>
                    <defs>
                      <linearGradient id="colorBusinessMonthly" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#12422a" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#12422a" stopOpacity={0.2}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="month" 
                      stroke="#6b7280"
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                    />
                    <YAxis 
                      stroke="#6b7280"
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                      label={{ value: 'Number of Businesses', angle: -90, position: 'insideLeft', style: { fill: '#6b7280' } }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }}
                      formatter={(value) => [value, 'Businesses']}
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Bar 
                      dataKey="count" 
                      fill="url(#colorBusinessMonthly)" 
                      radius={[8, 8, 0, 0]}
                      name="Businesses"
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '350px' }}>
                  <Typography color="text.secondary">No data available</Typography>
                </Box>
              )}
            </div>
        </div>
      </div>

      {/* Wallet Overview Section */}
      <div className="wallet-overview-section">
        <div className="wallet-overview-header">
          <div>
            <h2 className="wallet-overview-title">
              <FaWallet style={{ marginRight: '12px', color: '#10b981' }} />
              Wallet Overview
            </h2>
          </div>
        </div>

        {isLoading && !walletTransactions ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
            <CircularProgress size={50} />
          </Box>
        ) : (() => {
          // Handle different data structures
          // API response: { status, message, data: { totalTopUp, ... } }
          // Redux stores: payload.data || payload
          // So walletTransactions could be either:
          // 1. { totalTopUp, totalWithdraw, ... } (if payload.data exists)
          // 2. { status, message, data: {...} } (if payload is stored directly)
          
          let walletData = null;
          
          if (walletTransactions) {
            // Check if it has the nested data structure
            if (walletTransactions.data && typeof walletTransactions.data === 'object' && walletTransactions.data.totalTopUp !== undefined) {
              walletData = walletTransactions.data;
            } 
            // Check if it's the direct data structure
            else if (walletTransactions.totalTopUp !== undefined) {
              walletData = walletTransactions;
            }
            // Try to find data in other possible locations
            else if (walletTransactions.data) {
              walletData = walletTransactions.data;
            } else {
              walletData = walletTransactions;
            }
          }
          
          // Check if walletData exists and has at least one valid property
          if (!walletData || typeof walletData !== 'object') {
            return (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px', backgroundColor: 'white', borderRadius: '16px', border: '2px dashed #e5e7eb' }}>
                <Typography color="text.secondary" sx={{ fontSize: '16px' }}>No wallet data available</Typography>
              </Box>
            );
          }

          return (
            <div className="wallet-overview-grid">
              <div className="wallet-metric-card wallet-card-primary">
                <div className="wallet-metric-icon">
                  <FaMoneyBillWave />
                </div>
                <div className="wallet-metric-content">
                  <h4 className="wallet-metric-label">Total Top Up</h4>
                  <p className="wallet-metric-value">{formatMoney(walletData.totalTopUp || 0)}</p>
                  <div className="wallet-metric-trend">
                    <FaArrowRight style={{ fontSize: '12px' }} />
                    <span>Income</span>
                  </div>
                </div>
              </div>

              <div className="wallet-metric-card wallet-card-warning">
                <div className="wallet-metric-icon">
                  <FaExchangeAlt />
                </div>
                <div className="wallet-metric-content">
                  <h4 className="wallet-metric-label">Total Withdraw</h4>
                  <p className="wallet-metric-value">{formatMoney(walletData.totalWithdraw || 0)}</p>
                  <div className="wallet-metric-trend">
                    <FaArrowRight style={{ fontSize: '12px' }} />
                    <span>Outgoing</span>
                  </div>
                </div>
              </div>

              <div className="wallet-metric-card wallet-card-info">
                <div className="wallet-metric-icon">
                  <FaCoins />
                </div>
                <div className="wallet-metric-content">
                  <h4 className="wallet-metric-label">Total Deposit</h4>
                  <p className="wallet-metric-value">{formatMoney(walletData.totalDeposit || 0)}</p>
                  <div className="wallet-metric-trend">
                    <FaArrowRight style={{ fontSize: '12px' }} />
                    <span>Security</span>
                  </div>
                </div>
              </div>

              <div className="wallet-metric-card wallet-card-purple">
                <div className="wallet-metric-icon">
                  <FaMoneyBillWave />
                </div>
                <div className="wallet-metric-content">
                  <h4 className="wallet-metric-label">Total Refund</h4>
                  <p className="wallet-metric-value">{formatMoney(walletData.totalRefund || 0)}</p>
                  <div className="wallet-metric-trend">
                    <FaArrowRight style={{ fontSize: '12px' }} />
                    <span>Returned</span>
                  </div>
                </div>
              </div>

              <div className="wallet-metric-card wallet-card-pink">
                <div className="wallet-metric-icon">
                  <FaWallet />
                </div>
                <div className="wallet-metric-content">
                  <h4 className="wallet-metric-label">Total Subscription Fee</h4>
                  <p className="wallet-metric-value">{formatMoney(walletData.totalSubscriptionFee || 0)}</p>
                  <div className="wallet-metric-trend">
                    <FaArrowRight style={{ fontSize: '12px' }} />
                    <span>Service</span>
                  </div>
                </div>
              </div>

              <div className="wallet-metric-card wallet-card-danger">
                <div className="wallet-metric-icon">
                  <FaMoneyBillWave />
                </div>
                <div className="wallet-metric-content">
                  <h4 className="wallet-metric-label">Total Penalty</h4>
                  <p className="wallet-metric-value">{formatMoney(walletData.totalPenalty || 0)}</p>
                  <div className="wallet-metric-trend">
                    <FaArrowRight style={{ fontSize: '12px' }} />
                    <span>Fine</span>
                  </div>
                </div>
              </div>

              <div className="wallet-metric-card wallet-card-dark">
                <div className="wallet-metric-icon">
                  <FaMoneyBillWave />
                </div>
                <div className="wallet-metric-content">
                  <h4 className="wallet-metric-label">Total Forfeited</h4>
                  <p className="wallet-metric-value">{formatMoney(walletData.totalForfeited || 0)}</p>
                  <div className="wallet-metric-trend">
                    <FaArrowRight style={{ fontSize: '12px' }} />
                    <span>Lost</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Wallet Transactions Monthly Statistics Section */}
      <div className="wallet-transactions-monthly-section">
        <div className="wallet-transactions-monthly-header">
          <div>
            <h2 className="wallet-transactions-monthly-title">Wallet Transactions Monthly Statistics</h2>
          </div>
        </div>

        {/* Filters Section */}
        <div className="wallet-transactions-filters-section">
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: '#12422a', fontSize: '18px', letterSpacing: '0.5px' }}>
            Filters
          </Typography>
          <Grid container spacing={2} alignItems="flex-start">
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <TextField
                  label="Year to Filter"
                  type="number"
                  value={walletTransactionsFilters.year}
                  onChange={(e) => setWalletTransactionsFilters({ ...walletTransactionsFilters, year: parseInt(e.target.value) || new Date().getFullYear() })}
                  variant="outlined"
                  size="small"
                  helperText="Filter by year"
                  inputProps={{ min: 2000, max: 2100 }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'white',
                      borderRadius: '10px',
                      transition: 'all 0.3s ease',
                      '&:hover fieldset': {
                        borderColor: '#10b981',
                        borderWidth: '2px',
                        boxShadow: '0 2px 8px rgba(16, 185, 129, 0.15)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#10b981',
                        borderWidth: '2px',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      fontWeight: 600,
                      color: '#4b5563',
                      '&.Mui-focused': {
                        color: '#10b981',
                        fontWeight: 700,
                      },
                    },
                    '& .MuiFormHelperText-root': {
                      color: '#6b7280',
                      fontSize: '0.75rem',
                      marginTop: '4px',
                    },
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth size="small" variant="outlined">
                <InputLabel 
                  id="wallet-transaction-type-filter-label"
                  sx={{
                    backgroundColor: 'white',
                    px: 0.5,
                  }}
                >
                  Transaction Type
                </InputLabel>
                <Select
                  labelId="wallet-transaction-type-filter-label"
                  value={walletTransactionsFilters.transactionType}
                  onChange={(e) => setWalletTransactionsFilters({ ...walletTransactionsFilters, transactionType: e.target.value })}
                  label="Transaction Type"
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300,
                        zIndex: 1300
                      }
                    },
                    style: {
                      zIndex: 1300
                    }
                  }}
                  sx={{
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#10b981',
                      borderWidth: '2px',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#10b981',
                      borderWidth: '2px',
                    },
                    '& .MuiSelect-select': {
                      py: 1.25,
                      fontWeight: 500,
                    },
                  }}
                >
                  <MenuItem value="">All Types</MenuItem>
                  <MenuItem value="top_up">top_up</MenuItem>
                  <MenuItem value="withdrawal">withdrawal</MenuItem>
                  <MenuItem value="borrow_deposit">borrow_deposit</MenuItem>
                  <MenuItem value="return_refund">return_refund</MenuItem>
                  <MenuItem value="subscription_fee">subscription_fee</MenuItem>
                  <MenuItem value="penalty">penalty</MenuItem>
                  <MenuItem value="deposit_forfeited">deposit_forfeited</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth size="small" variant="outlined">
                <InputLabel 
                  id="wallet-direction-filter-label"
                  sx={{
                    backgroundColor: 'white',
                    px: 0.5,
                  }}
                >
                  Direction
                </InputLabel>
                <Select
                  labelId="wallet-direction-filter-label"
                  value={walletTransactionsFilters.direction}
                  onChange={(e) => setWalletTransactionsFilters({ ...walletTransactionsFilters, direction: e.target.value })}
                  label="Direction"
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300,
                        zIndex: 1300
                      }
                    },
                    style: {
                      zIndex: 1300
                    }
                  }}
                  sx={{
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#10b981',
                      borderWidth: '2px',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#10b981',
                      borderWidth: '2px',
                    },
                    '& .MuiSelect-select': {
                      py: 1.25,
                      fontWeight: 500,
                    },
                  }}
                >
                  <MenuItem value="">All Directions</MenuItem>
                  <MenuItem value="in">in</MenuItem>
                  <MenuItem value="out">out</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth size="small" variant="outlined">
                <InputLabel 
                  id="wallet-status-filter-label"
                  sx={{
                    backgroundColor: 'white',
                    px: 0.5,
                  }}
                >
                  Status
                </InputLabel>
                <Select
                  labelId="wallet-status-filter-label"
                  value={walletTransactionsFilters.status}
                  onChange={(e) => setWalletTransactionsFilters({ ...walletTransactionsFilters, status: e.target.value })}
                  label="Status"
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300,
                        zIndex: 1300
                      }
                    },
                    style: {
                      zIndex: 1300
                    }
                  }}
                  sx={{
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#10b981',
                      borderWidth: '2px',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#10b981',
                      borderWidth: '2px',
                    },
                    '& .MuiSelect-select': {
                      py: 1.25,
                      fontWeight: 500,
                    },
                  }}
                >
                  <MenuItem value="">All Statuses</MenuItem>
                  <MenuItem value="processing">processing</MenuItem>
                  <MenuItem value="completed">completed</MenuItem>
                  <MenuItem value="failed">failed</MenuItem>
                  <MenuItem value="expired">expired</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </div>

        <div className="wallet-transactions-monthly-content">
          {/* Chart Card */}
          <div className="wallet-transactions-monthly-chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Monthly Wallet Transactions Count</h3>
              <p className="chart-subtitle">Number of wallet transactions per month</p>
            </div>
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '350px' }}>
                <CircularProgress size={40} />
              </Box>
            ) : walletTransactionsMonthlyChartData && walletTransactionsMonthlyChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={walletTransactionsMonthlyChartData}>
                  <defs>
                    <linearGradient id="colorWalletTransactions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#6b7280"
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    label={{ value: 'Number of Transactions', angle: -90, position: 'insideLeft', style: { fill: '#6b7280' } }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                    formatter={(value) => [value, 'Transactions']}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="url(#colorWalletTransactions)" 
                    radius={[8, 8, 0, 0]}
                    name="Transactions"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '350px' }}>
                <Typography color="text.secondary">No data available</Typography>
              </Box>
            )}
          </div>
        </div>
      </div>

      {/* Top Businesses Section */}
      <div className="top-ranking-section">
        <div className="top-ranking-header">
          <div>
            <h2 className="top-ranking-title">
              <FaStore style={{ marginRight: '12px', color: '#12422a' }} />
              Top Businesses
            </h2>
          </div>
        </div>

        {/* Filters Section */}
        <div className="ranking-filters-section">
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: '#12422a', fontSize: '18px', letterSpacing: '0.5px' }}>
            Filters
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <TextField
                  label="Top N Businesses"
                  type="number"
                  value={businessFilters.top}
                  onChange={(e) => setBusinessFilters({ ...businessFilters, top: parseInt(e.target.value) || 5 })}
                  variant="outlined"
                  size="small"
                  inputProps={{ min: 1, max: 50 }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'white',
                      borderRadius: '10px',
                      transition: 'all 0.3s ease',
                      '&:hover fieldset': {
                        borderColor: '#12422a',
                        borderWidth: '2px',
                        boxShadow: '0 2px 8px rgba(18, 66, 42, 0.15)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#12422a',
                        borderWidth: '2px',
                        boxShadow: '0 4px 12px rgba(18, 66, 42, 0.25)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      fontWeight: 600,
                      color: '#4b5563',
                      '&.Mui-focused': {
                        color: '#12422a',
                        fontWeight: 700,
                      },
                    },
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small" variant="outlined">
                <InputLabel 
                  sx={{
                    backgroundColor: 'white',
                    px: 0.5,
                  }}
                >
                  Sort By
                </InputLabel>
                <Select
                  value={businessFilters.sortBy}
                  onChange={(e) => setBusinessFilters({ ...businessFilters, sortBy: e.target.value })}
                  label="Sort By"
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300,
                        zIndex: 1300
                      }
                    },
                    style: {
                      zIndex: 1300
                    }
                  }}
                  sx={{
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#12422a',
                      borderWidth: '2px',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#12422a',
                      borderWidth: '2px',
                    },
                    '& .MuiSelect-select': {
                      py: 1.25,
                      fontWeight: 500,
                    },
                  }}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="co2Reduced">CO₂ Reduced</MenuItem>
                  <MenuItem value="ecoPoints">Eco Points</MenuItem>
                  <MenuItem value="averageRating">Average Rating</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small" variant="outlined">
                <InputLabel 
                  sx={{
                    backgroundColor: 'white',
                    px: 0.5,
                  }}
                >
                  Order
                </InputLabel>
                <Select
                  value={businessFilters.order}
                  onChange={(e) => setBusinessFilters({ ...businessFilters, order: e.target.value })}
                  label="Order"
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300,
                        zIndex: 1300
                      }
                    },
                    style: {
                      zIndex: 1300
                    }
                  }}
                  sx={{
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#12422a',
                      borderWidth: '2px',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#12422a',
                      borderWidth: '2px',
                    },
                    '& .MuiSelect-select': {
                      py: 1.25,
                      fontWeight: 500,
                    },
                  }}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="asc">Ascending</MenuItem>
                  <MenuItem value="desc">Descending</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </div>

        {/* Ranking Cards Grid */}
        {isLoading && !topBusinesses ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
            <CircularProgress />
          </Box>
        ) : topBusinesses && topBusinesses.length > 0 ? (
          <div className="ranking-cards-grid">
            {topBusinesses.map((business, index) => {
              const rank = index + 1;
              const isTopThree = rank <= 3;
              const rankColors = {
                1: { bg: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)', text: '#000' },
                2: { bg: 'linear-gradient(135deg, #C0C0C0 0%, #A9A9A9 100%)', text: '#000' },
                3: { bg: 'linear-gradient(135deg, #CD7F32 0%, #8B4513 100%)', text: '#fff' }
              };
              const rankColor = isTopThree ? rankColors[rank] : { bg: '#ffffff', text: '#6b7280' };

              return (
                <div 
                  key={business._id || index} 
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
                      src={business.businessLogoUrl}
                      alt={business.businessName}
                      sx={{ 
                        width: 100, 
                        height: 100, 
                        border: isTopThree ? `4px solid ${rank === 1 ? '#FFD700' : rank === 2 ? '#C0C0C0' : '#CD7F32'}` : '4px solid #12422a',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                      }}
                    />
                    {isTopThree && (
                      <div className="ranking-medal">
                        {rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}
                      </div>
                    )}
                  </div>

                  <div className="ranking-card-content">
                    <div className="ranking-card-header-info">
                      <h3 className="ranking-card-name" style={isTopThree ? { color: rankColor.text } : {}}>
                        {business.businessName || 'Unknown Business'}
                      </h3>
                      <Chip
                        label={business.status || 'active'}
                        color={business.status === 'active' ? 'success' : 'default'}
                        size="small"
                        sx={{ 
                          fontWeight: 600,
                          height: '24px',
                          fontSize: '11px'
                        }}
                      />
                    </div>

                    <p className="ranking-card-type" style={isTopThree ? { color: rankColor.text, opacity: 0.8 } : {}}>
                      {business.businessType || 'N/A'}
                    </p>

                    <div className="ranking-card-rating">
                      <Rating
                        value={business.averageRating || 0}
                        precision={0.1}
                        readOnly
                        size="small"
                        sx={{ 
                          '& .MuiRating-iconFilled': {
                            color: '#fbbf24'
                          }
                        }}
                      />
                      <span className="ranking-rating-text" style={isTopThree ? { color: rankColor.text } : {}}>
                        {business.averageRating ? business.averageRating.toFixed(1) : '0.0'}
                        <span style={{ opacity: 0.7, marginLeft: '4px' }}>
                          ({business.totalReviews || 0} reviews)
                        </span>
                      </span>
                    </div>

                    <div className="ranking-card-metrics">
                      <div className="ranking-metric-item">
                        <div className="ranking-metric-icon" style={{ backgroundColor: '#10b98115', color: '#10b981' }}>
                          <FaLeaf />
                        </div>
                        <div className="ranking-metric-info">
                          <span className="ranking-metric-label">Eco Points</span>
                          <span className="ranking-metric-value">
                            {business.ecoPoints ? business.ecoPoints.toLocaleString('en-US', { maximumFractionDigits: 1 }) : 0}
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
                            {business.co2Reduced ? business.co2Reduced.toFixed(2) : 0} kg
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
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px', backgroundColor: 'white', borderRadius: '16px', border: '2px dashed #e5e7eb' }}>
            <Typography color="text.secondary" sx={{ fontSize: '16px' }}>No businesses available</Typography>
          </Box>
        )}
      </div>

      {/* Top Customers Section */}
      <div className="top-ranking-section">
        <div className="top-ranking-header">
          <div>
            <h2 className="top-ranking-title">
              <FaUsers style={{ marginRight: '12px', color: '#12422a' }} />
              Top Customers
            </h2>
          </div>
        </div>

        {/* Filters Section */}
        <div className="ranking-filters-section">
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: '#12422a', fontSize: '18px', letterSpacing: '0.5px' }}>
            Filters
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <TextField
                  label="Top N Customers"
                  type="number"
                  value={customerFilters.top}
                  onChange={(e) => setCustomerFilters({ ...customerFilters, top: parseInt(e.target.value) || 5 })}
                  variant="outlined"
                  size="small"
                  inputProps={{ min: 1, max: 50 }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'white',
                      borderRadius: '10px',
                      transition: 'all 0.3s ease',
                      '&:hover fieldset': {
                        borderColor: '#12422a',
                        borderWidth: '2px',
                        boxShadow: '0 2px 8px rgba(18, 66, 42, 0.15)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#12422a',
                        borderWidth: '2px',
                        boxShadow: '0 4px 12px rgba(18, 66, 42, 0.25)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      fontWeight: 600,
                      color: '#4b5563',
                      '&.Mui-focused': {
                        color: '#12422a',
                        fontWeight: 700,
                      },
                    },
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small" variant="outlined">
                <InputLabel 
                  sx={{
                    backgroundColor: 'white',
                    px: 0.5,
                  }}
                >
                  Sort By
                </InputLabel>
                <Select
                  value={customerFilters.sortBy}
                  onChange={(e) => setCustomerFilters({ ...customerFilters, sortBy: e.target.value })}
                  label="Sort By"
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300,
                        zIndex: 1300
                      }
                    },
                    style: {
                      zIndex: 1300
                    }
                  }}
                  sx={{
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#12422a',
                      borderWidth: '2px',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#12422a',
                      borderWidth: '2px',
                    },
                    '& .MuiSelect-select': {
                      py: 1.25,
                      fontWeight: 500,
                    },
                  }}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="rankingPoints">Ranking Points</MenuItem>
                  <MenuItem value="ecoPoints">Eco Points</MenuItem>
                  <MenuItem value="totalTransactions">Total Transactions</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small" variant="outlined">
                <InputLabel 
                  sx={{
                    backgroundColor: 'white',
                    px: 0.5,
                  }}
                >
                  Order
                </InputLabel>
                <Select
                  value={customerFilters.order}
                  onChange={(e) => setCustomerFilters({ ...customerFilters, order: e.target.value })}
                  label="Order"
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300,
                        zIndex: 1300
                      }
                    },
                    style: {
                      zIndex: 1300
                    }
                  }}
                  sx={{
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#12422a',
                      borderWidth: '2px',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#12422a',
                      borderWidth: '2px',
                    },
                    '& .MuiSelect-select': {
                      py: 1.25,
                      fontWeight: 500,
                    },
                  }}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="asc">Ascending</MenuItem>
                  <MenuItem value="desc">Descending</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </div>

        {/* Ranking Cards Grid */}
        {isLoading && !topCustomers ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
            <CircularProgress />
          </Box>
        ) : topCustomers && topCustomers.length > 0 ? (
          <div className="ranking-cards-grid">
            {topCustomers.map((customer, index) => {
              const rank = index + 1;
              const isTopThree = rank <= 3;
              const rankColors = {
                1: { bg: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)', text: '#000' },
                2: { bg: 'linear-gradient(135deg, #C0C0C0 0%, #A9A9A9 100%)', text: '#000' },
                3: { bg: 'linear-gradient(135deg, #CD7F32 0%, #8B4513 100%)', text: '#fff' }
              };
              const rankColor = isTopThree ? rankColors[rank] : { bg: '#ffffff', text: '#6b7280' };
              
              const customerData = customer.customerId || customer;
              const avatarUrl = customerData?.userId?.avatar;
              const displayName = customerData?.fullName || `Customer #${rank}`;
              const initials = displayName.split(' ').filter(Boolean).map(word => word[0]).join('').slice(0, 2).toUpperCase();

              return (
                <div 
                  key={customer._id || index} 
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
                      src={avatarUrl}
                      alt={displayName}
                      sx={{ 
                        width: 100, 
                        height: 100, 
                        border: isTopThree ? `4px solid ${rank === 1 ? '#FFD700' : rank === 2 ? '#C0C0C0' : '#CD7F32'}` : '4px solid #12422a',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        bgcolor: '#12422a',
                        fontSize: '32px',
                        fontWeight: 700
                      }}
                    >
                      {!avatarUrl && initials}
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
                        {displayName}
                      </h3>
                    </div>

                    {customerData?.phone && (
                      <p className="ranking-card-type" style={isTopThree ? { color: rankColor.text, opacity: 0.8 } : {}}>
                        <FaUsers style={{ marginRight: '6px', fontSize: '12px' }} />
                        {customerData.phone}
                      </p>
                    )}

                    <div className="ranking-card-metrics">
                      <div className="ranking-metric-item">
                        <div className="ranking-metric-icon" style={{ backgroundColor: '#3b82f615', color: '#3b82f6' }}>
                          <FaCrown />
                        </div>
                        <div className="ranking-metric-info">
                          <span className="ranking-metric-label">Ranking Points</span>
                          <span className="ranking-metric-value">
                            {customer.rankingPoints ? customer.rankingPoints.toLocaleString('en-US') : customer.totalRankingPoints?.toLocaleString('en-US') || 0}
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
                            {customer.ecoPoints ? customer.ecoPoints.toLocaleString('en-US', { maximumFractionDigits: 1 }) : customer.totalEcoPoints?.toLocaleString('en-US', { maximumFractionDigits: 1 }) || 0}
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
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px', backgroundColor: 'white', borderRadius: '16px', border: '2px dashed #e5e7eb' }}>
            <Typography color="text.secondary" sx={{ fontSize: '16px' }}>No customers available</Typography>
          </Box>
        )}
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        {/* User & Store Growth Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h2 className="chart-title">Users & Stores Growth</h2>
            <p className="chart-subtitle">Monthly trend overview</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={userGrowthData}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorStores" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#12422a" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#12422a" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="users" 
                stroke="#3b82f6" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorUsers)" 
                name="Users"
              />
              <Area 
                type="monotone" 
                dataKey="stores" 
                stroke="#12422a" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorStores)" 
                name="Stores"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Material Distribution Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h2 className="chart-title">Material Distribution</h2>
            <p className="chart-subtitle">By material type</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={materialDistributionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              />
              <Bar dataKey="value" fill="#8884d8" radius={[8, 8, 0, 0]}>
                {materialDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Voucher Status Pie Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h2 className="chart-title">Voucher Status</h2>
            <p className="chart-subtitle">Current distribution</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={voucherStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {voucherStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-content">
        {/* Quick Actions */}
        <div className="quick-actions-section">
          <h2 className="section-title">Quick Actions</h2>
          <div className="quick-actions-grid">
            {quickActions.map((action, index) => (
              <div 
                key={index} 
                className="quick-action-card"
                onClick={() => navigate(action.path)}
              >
                <div className="action-icon" style={{ backgroundColor: `${action.color}15`, color: action.color }}>
                  {action.icon}
                </div>
                <div className="action-content">
                  <h3 className="action-title">{action.title}</h3>
                  <p className="action-description">{action.description}</p>
                </div>
                <FaArrowRight className="action-arrow" />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="recent-activities-section">
          <h2 className="section-title">Recent Activities</h2>
          <div className="activities-list">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon" style={{ backgroundColor: `${activity.color}15`, color: activity.color }}>
                  {activity.icon}
                </div>
                <div className="activity-content">
                  <h4 className="activity-title">{activity.title}</h4>
                  <p className="activity-description">{activity.description}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="view-all-btn">
            View All Activities
            <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

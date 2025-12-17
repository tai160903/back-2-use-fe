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
import { MdExpandMore, MdChevronRight } from 'react-icons/md';
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
import { Box, CircularProgress, Typography, TextField, Select, MenuItem, FormControl, InputLabel, Grid, Rating, Avatar, Chip, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
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

const dashboardSubItems = [
  { id: "borrow-transactions", label: "Borrow Transactions Statistics", path: PATH.ADMIN_DASHBOARD_BORROW_TRANSACTIONS, icon: <FaExchangeAlt /> },
  { id: "business-monthly", label: "Business Monthly Statistics", path: PATH.ADMIN_DASHBOARD_BUSINESS_MONTHLY, icon: <FaStore /> },
  { id: "wallet-overview", label: "Wallet Overview", path: PATH.ADMIN_DASHBOARD_WALLET_OVERVIEW, icon: <FaWallet /> },
  { id: "wallet-transactions-monthly", label: "Wallet Transactions Monthly", path: PATH.ADMIN_DASHBOARD_WALLET_TRANSACTIONS_MONTHLY, icon: <FaWallet /> },
  { id: "top-businesses", label: "Top Businesses", path: PATH.ADMIN_DASHBOARD_TOP_BUSINESSES, icon: <FaStore /> },
  { id: "top-customers", label: "Top Customers", path: PATH.ADMIN_DASHBOARD_TOP_CUSTOMERS, icon: <FaUsers /> },
  { id: "quick-actions", label: "Quick Actions", path: PATH.ADMIN_DASHBOARD_QUICK_ACTIONS, icon: <FaClipboardList /> },
];

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

  // Accordion expanded states
  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    borrowTransactions: false,
    businessMonthly: false,
    walletOverview: false,
    walletTransactionsMonthly: false,
    topBusinesses: false,
    topCustomers: false,
    charts: false,
    quickActions: false
  });

  const handleAccordionChange = (section) => (event, isExpanded) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: isExpanded
    }));
  };

  // Listen for expand section event from sidebar
  useEffect(() => {
    const handleExpandSection = (event) => {
      const { section } = event.detail;
      if (section && expandedSections.hasOwnProperty(section)) {
        setExpandedSections(prev => ({
          ...prev,
          [section]: true
        }));
        // Scroll to section after a short delay
        setTimeout(() => {
          const accordionElement = document.querySelector(`[data-section="${section}"]`);
          if (accordionElement) {
            accordionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 300);
      }
    };

    window.addEventListener('expandDashboardSection', handleExpandSection);
    return () => {
      window.removeEventListener('expandDashboardSection', handleExpandSection);
    };
  }, [expandedSections]);
  
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

      {/* Dashboard Overview Accordion */}
      <Accordion 
        expanded={expandedSections.overview} 
        onChange={handleAccordionChange('overview')}
        sx={{
          mb: 2,
          borderRadius: '12px !important',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e5e7eb',
          '&:before': { display: 'none' },
          '&.Mui-expanded': {
            margin: '0 0 16px 0',
          }
        }}
      >
        <AccordionSummary
          expandIcon={<MdExpandMore style={{ color: '#164e31', fontSize: '24px' }} />}
          sx={{
            backgroundColor: '#f9fafb',
            borderRadius: '12px',
            minHeight: '64px',
            '&.Mui-expanded': {
              minHeight: '64px',
              borderBottom: '1px solid #e5e7eb',
            },
            '& .MuiAccordionSummary-content': {
              margin: '12px 0',
              alignItems: 'center',
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
            <Box sx={{ 
              width: 40, 
              height: 40, 
              borderRadius: '10px', 
              background: 'linear-gradient(135deg, #164e31 0%, #0f3d20 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <MdDashboard style={{ fontSize: '20px' }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a1a', fontSize: '18px' }}>
                Dashboard Overview
              </Typography>
              <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '14px' }}>
                Key statistics and metrics
              </Typography>
            </Box>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
      {dashboardLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      ) : dashboardOverview ? (
            <div className="dashboard-overview-container" style={{ padding: '24px' }}>
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
          {/* <div className="co2-impact-section">
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

       
              <div className="co2-benefits-card">
                <div className="co2-benefits-header">
                  <FaLeaf className="co2-benefits-icon" />
                  <h3 className="co2-benefits-title">Benefits of Our CO₂ Reduction</h3>
                </div>
                <div className="co2-benefits-content">
                  <div className="co2-benefit-item">
                    <div className="benefit-icon benefit-positive">🌳</div>
                    <div className="benefit-content">
                      <h4 className="benefit-title">Co2 Reduction</h4>
                      <p className="benefit-description">
                        Reducing {(dashboardOverview.co2Reduced || 0).toFixed(2)} kg of CO₂. 
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
          </div> */}
        </div>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <Typography>No data available</Typography>
        </Box>
      )}
        </AccordionDetails>
      </Accordion>

      {/* Dashboard Navigation Cards */}
      <div className="dashboard-navigation-section">
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a1a1a', mb: 3, fontSize: '24px' }}>
          Dashboard Sections
            </Typography>
        <div className="dashboard-cards-grid">
          {dashboardSubItems.map((item) => (
            <Box
              key={item.id}
              className="dashboard-nav-card"
              onClick={() => navigate(item.path)}
                    sx={{
                cursor: 'pointer',
                        transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(22, 78, 49, 0.15)',
                }
              }}
            >
              <Box
                    sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #164e31 0%, #0f3d20 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '24px',
                  mb: 2
                }}
              >
                {item.icon}
                </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 1, fontSize: '16px' }}>
                {item.label}
          </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', color: '#164e31', mt: 'auto' }}>
                <Typography variant="body2" sx={{ fontSize: '14px', fontWeight: 500, mr: 1 }}>
                  View Details
          </Typography>
                <FaArrowRight style={{ fontSize: '14px' }} />
              </Box>
              </Box>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

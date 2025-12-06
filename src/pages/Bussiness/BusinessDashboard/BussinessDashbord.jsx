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
  FaShoppingCart,
  FaDollarSign,
  FaShoppingBag,
  FaBoxes,
  FaUserFriends
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

export default function BussinessDashbord() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Mock data - Replace with actual Redux state later
  const stats = {
    totalRevenue: { amount: 45678000, trend: 12.5, isUp: true },
    totalOrders: { count: 156, trend: 8.3, isUp: true },
    totalMaterials: { count: 48, trend: -2.1, isUp: false },
    totalCustomers: { count: 234, trend: 15.2, isUp: true },
  };

  // Revenue data for line chart
  const revenueData = [
    { month: 'Jan', revenue: 28000000, orders: 98 },
    { month: 'Feb', revenue: 32000000, orders: 112 },
    { month: 'Mar', revenue: 35000000, orders: 125 },
    { month: 'Apr', revenue: 38000000, orders: 138 },
    { month: 'May', revenue: 42000000, orders: 148 },
    { month: 'Jun', revenue: 45678000, orders: 156 },
  ];

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
      path: PATH.BUSINESS_WALLET_ACTIONS,
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
      <div className="dashboard-stats">
        <div className="dashboard-stat-card">
          <div className="stat-card-header">
            <div className="stat-info">
              <h3 className="stat-label">Total Revenue</h3>
              <p className="stat-value">{formatCurrency(stats.totalRevenue.amount)}</p>
            </div>
            <div className="stat-icon-container revenue">
              <MdAttachMoney className="stat-icon" color="#ffffff" size={32} />
            </div>
          </div>
          <div className="stat-trend">
            {stats.totalRevenue.isUp ? (
              <span className="trend-up">
                <FaArrowUp /> {stats.totalRevenue.trend}%
              </span>
            ) : (
              <span className="trend-down">
                <FaArrowDown /> {Math.abs(stats.totalRevenue.trend)}%
              </span>
            )}
            <span className="trend-label">vs last month</span>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="stat-card-header">
            <div className="stat-info">
              <h3 className="stat-label">Total Orders</h3>
              <p className="stat-value">{formatNumber(stats.totalOrders.count)}</p>
            </div>
            <div className="stat-icon-container orders">
              <FaShoppingBag className="stat-icon" color="#ffffff" size={32} />
            </div>
          </div>
          <div className="stat-trend">
            {stats.totalOrders.isUp ? (
              <span className="trend-up">
                <FaArrowUp /> {stats.totalOrders.trend}%
              </span>
            ) : (
              <span className="trend-down">
                <FaArrowDown /> {Math.abs(stats.totalOrders.trend)}%
              </span>
            )}
            <span className="trend-label">vs last month</span>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="stat-card-header">
            <div className="stat-info">
              <h3 className="stat-label">Materials Listed</h3>
              <p className="stat-value">{formatNumber(stats.totalMaterials.count)}</p>
            </div>
            <div className="stat-icon-container materials">
              <FaBoxes className="stat-icon" color="#ffffff" size={32} />
            </div>
          </div>
          <div className="stat-trend">
            {stats.totalMaterials.isUp ? (
              <span className="trend-up">
                <FaArrowUp /> {stats.totalMaterials.trend}%
              </span>
            ) : (
              <span className="trend-down">
                <FaArrowDown /> {Math.abs(stats.totalMaterials.trend)}%
              </span>
            )}
            <span className="trend-label">vs last month</span>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="stat-card-header">
            <div className="stat-info">
              <h3 className="stat-label">Total Customers</h3>
              <p className="stat-value">{formatNumber(stats.totalCustomers.count)}</p>
            </div>
            <div className="stat-icon-container customers">
              <FaUserFriends className="stat-icon" color="#ffffff" size={32} />
            </div>
          </div>
          <div className="stat-trend">
            {stats.totalCustomers.isUp ? (
              <span className="trend-up">
                <FaArrowUp /> {stats.totalCustomers.trend}%
              </span>
            ) : (
              <span className="trend-down">
                <FaArrowDown /> {Math.abs(stats.totalCustomers.trend)}%
              </span>
            )}
            <span className="trend-label">vs last month</span>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="charts-row">
        {/* Revenue Chart */}
        <div className="chart-card large">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Revenue Overview</h3>
              <p className="chart-subtitle">Monthly revenue and orders trend</p>
            </div>
            <FaChartLine className="chart-icon" />
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
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
                  formatter={(value) => formatCurrency(value)}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#12422a" 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Material Distribution Pie Chart */}
        <div className="chart-card small">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Material Distribution</h3>
              <p className="chart-subtitle">Sales by category</p>
            </div>
            <BiPackage className="chart-icon" />
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={materialDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {materialDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="charts-row">
        {/* Material Sales Bar Chart */}
        <div className="chart-card large">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Material Sales Performance</h3>
              <p className="chart-subtitle">Sales count by material type</p>
            </div>
            <FaBoxOpen className="chart-icon" />
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={materialSalesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="sales" fill="#12422a" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="chart-card small">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Recent Transactions</h3>
              <p className="chart-subtitle">Latest 4 transactions</p>
            </div>
            <FaMoneyBillWave className="chart-icon" />
          </div>
          <div className="transactions-list">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="transaction-item">
                <div className="transaction-info">
                  <div className="transaction-customer">{transaction.customer}</div>
                  <div className="transaction-type">{transaction.type}</div>
                </div>
                <div className="transaction-details">
                  <div className={`transaction-amount ${transaction.amount < 0 ? 'negative' : 'positive'}`}>
                    {transaction.amount < 0 ? '-' : '+'}{formatCurrency(Math.abs(transaction.amount))}
                  </div>
                  <span className={`transaction-status ${transaction.status.toLowerCase()}`}>
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))}
            <button 
              className="view-all-btn"
              onClick={() => navigate(PATH.BUSINESS_TRANSACTION)}
            >
              View All Transactions →
            </button>
          </div>
        </div>
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

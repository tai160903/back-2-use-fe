import React, { useEffect } from 'react';
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
  FaClock
} from 'react-icons/fa';
import { IoMdTrendingUp, IoMdTrendingDown } from 'react-icons/io';
import { MdDashboard } from 'react-icons/md';
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

  // Mock data - sẽ thay thế bằng dữ liệu từ API
  const stats = {
    users: {
      total: 1247,
      growth: 12.5,
      trend: 'up'
    },
    stores: {
      total: 89,
      growth: 8.3,
      trend: 'up'
    },
    materials: {
      total: 156,
      growth: -2.4,
      trend: 'down'
    },
    vouchers: {
      total: 45,
      growth: 15.2,
      trend: 'up'
    },
    registrations: {
      total: 23,
      growth: 5.1,
      trend: 'up'
    },
    subscriptions: {
      total: 67,
      growth: 18.7,
      trend: 'up'
    }
  };

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

      {/* Statistics Grid */}
      <div className="stats-grid">
        <div className="stat-card stat-users">
          <div className="stat-header">
            <div className="stat-icon-wrapper" style={{ backgroundColor: '#dbeafe' }}>
              <FaUsers style={{ color: '#3b82f6' }} />
            </div>
            <div className={`stat-trend ${stats.users.trend === 'up' ? 'trend-up' : 'trend-down'}`}>
              {stats.users.trend === 'up' ? <IoMdTrendingUp /> : <IoMdTrendingDown />}
              <span>{Math.abs(stats.users.growth)}%</span>
            </div>
          </div>
          <div className="stat-content">
            <h3 className="stat-label">Total Users</h3>
            <p className="stat-value">{stats.users.total.toLocaleString()}</p>
            <p className="stat-description">Active platform users</p>
          </div>
        </div>

        <div className="stat-card stat-stores">
          <div className="stat-header">
            <div className="stat-icon-wrapper" style={{ backgroundColor: '#e8f5e8' }}>
              <FaStore style={{ color: '#12422a' }} />
            </div>
            <div className={`stat-trend ${stats.stores.trend === 'up' ? 'trend-up' : 'trend-down'}`}>
              {stats.stores.trend === 'up' ? <IoMdTrendingUp /> : <IoMdTrendingDown />}
              <span>{Math.abs(stats.stores.growth)}%</span>
            </div>
          </div>
          <div className="stat-content">
            <h3 className="stat-label">Active Stores</h3>
            <p className="stat-value">{stats.stores.total.toLocaleString()}</p>
            <p className="stat-description">Registered businesses</p>
          </div>
        </div>

        <div className="stat-card stat-materials">
          <div className="stat-header">
            <div className="stat-icon-wrapper" style={{ backgroundColor: '#fef3c7' }}>
              <FaRecycle style={{ color: '#f59e0b' }} />
            </div>
            <div className={`stat-trend ${stats.materials.trend === 'up' ? 'trend-up' : 'trend-down'}`}>
              {stats.materials.trend === 'up' ? <IoMdTrendingUp /> : <IoMdTrendingDown />}
              <span>{Math.abs(stats.materials.growth)}%</span>
            </div>
          </div>
          <div className="stat-content">
            <h3 className="stat-label">Materials</h3>
            <p className="stat-value">{stats.materials.total.toLocaleString()}</p>
            <p className="stat-description">Recyclable materials</p>
          </div>
        </div>

        <div className="stat-card stat-vouchers">
          <div className="stat-header">
            <div className="stat-icon-wrapper" style={{ backgroundColor: '#f3e8ff' }}>
              <FaGift style={{ color: '#8b5cf6' }} />
            </div>
            <div className={`stat-trend ${stats.vouchers.trend === 'up' ? 'trend-up' : 'trend-down'}`}>
              {stats.vouchers.trend === 'up' ? <IoMdTrendingUp /> : <IoMdTrendingDown />}
              <span>{Math.abs(stats.vouchers.growth)}%</span>
            </div>
          </div>
          <div className="stat-content">
            <h3 className="stat-label">Active Vouchers</h3>
            <p className="stat-value">{stats.vouchers.total.toLocaleString()}</p>
            <p className="stat-description">Available discounts</p>
          </div>
        </div>

        <div className="stat-card stat-registrations">
          <div className="stat-header">
            <div className="stat-icon-wrapper" style={{ backgroundColor: '#fee2e2' }}>
              <FaClipboardList style={{ color: '#ef4444' }} />
            </div>
            <div className={`stat-trend ${stats.registrations.trend === 'up' ? 'trend-up' : 'trend-down'}`}>
              {stats.registrations.trend === 'up' ? <IoMdTrendingUp /> : <IoMdTrendingDown />}
              <span>{Math.abs(stats.registrations.growth)}%</span>
            </div>
          </div>
          <div className="stat-content">
            <h3 className="stat-label">Pending Registrations</h3>
            <p className="stat-value">{stats.registrations.total.toLocaleString()}</p>
            <p className="stat-description">Awaiting review</p>
          </div>
        </div>

        <div className="stat-card stat-subscriptions">
          <div className="stat-header">
            <div className="stat-icon-wrapper" style={{ backgroundColor: '#fce7f3' }}>
              <FaCrown style={{ color: '#ec4899' }} />
            </div>
            <div className={`stat-trend ${stats.subscriptions.trend === 'up' ? 'trend-up' : 'trend-down'}`}>
              {stats.subscriptions.trend === 'up' ? <IoMdTrendingUp /> : <IoMdTrendingDown />}
              <span>{Math.abs(stats.subscriptions.growth)}%</span>
            </div>
          </div>
          <div className="stat-content">
            <h3 className="stat-label">Subscriptions</h3>
            <p className="stat-value">{stats.subscriptions.total.toLocaleString()}</p>
            <p className="stat-description">Active plans</p>
          </div>
        </div>
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

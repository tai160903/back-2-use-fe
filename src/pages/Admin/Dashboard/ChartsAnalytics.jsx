import React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { FaChartLine } from 'react-icons/fa';
import '../AdminDashboard.css';

const ChartsAnalytics = () => {
  // Sample data - in real app, this would come from API
  const userGrowthData = [
    { month: 'Jan', users: 120, stores: 15 },
    { month: 'Feb', users: 190, stores: 20 },
    { month: 'Mar', users: 300, stores: 25 },
    { month: 'Apr', users: 500, stores: 30 },
    { month: 'May', users: 800, stores: 35 },
    { month: 'Jun', users: 1200, stores: 40 }
  ];

  const materialDistributionData = [
    { name: 'Plastic', value: 400, color: '#8884d8' },
    { name: 'Glass', value: 300, color: '#82ca9d' },
    { name: 'Paper', value: 200, color: '#ffc658' },
    { name: 'Metal', value: 100, color: '#ff7300' }
  ];

  const voucherStatusData = [
    { name: 'Active', value: 400, color: '#10b981' },
    { name: 'Expired', value: 300, color: '#ef4444' },
    { name: 'Inactive', value: 200, color: '#6b7280' }
  ];

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <FaChartLine className="header-icon" style={{ fontSize: '48px', color: '#164e31' }} />
            <div>
              <h1 className="dashboard-title">Charts & Analytics</h1>
              <p className="dashboard-subtitle">Visual data representations</p>
            </div>
          </div>
        </div>
      </div>

      <div className="charts-section" style={{ padding: '24px' }}>
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
    </div>
  );
};

export default ChartsAnalytics;


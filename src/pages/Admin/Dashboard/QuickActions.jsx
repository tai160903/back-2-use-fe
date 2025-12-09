import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaUsers, 
  FaStore, 
  FaRecycle, 
  FaGift,
  FaArrowRight
} from 'react-icons/fa';
import { PATH } from '../../../routes/path';
import '../AdminDashboard.css';

const QuickActions = () => {
  const navigate = useNavigate();

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
  ];

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

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <FaGift className="header-icon" style={{ fontSize: '48px', color: '#164e31' }} />
            <div>
              <h1 className="dashboard-title">Quick Actions & Recent Activities</h1>
              <p className="dashboard-subtitle">Quick navigation and activity feed</p>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-content" style={{ padding: '24px' }}>
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

export default QuickActions;


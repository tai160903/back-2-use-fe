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

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <FaGift className="header-icon" style={{ fontSize: '48px', color: '#164e31' }} />
            <div>
              <h1 className="dashboard-title">Quick Actions</h1>
              <p className="dashboard-subtitle">Quick navigation to admin functions</p>
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
      </div>
    </div>
  );
};

export default QuickActions;


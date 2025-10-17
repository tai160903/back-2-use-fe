import React, { useState, useEffect } from "react";
import "./Users.css";
import { 
  FaUsers, 
  FaUserSlash, 
  FaCheckCircle, 
  FaEllipsisV,
  FaSearch,
  FaBan,
  FaUnlock
} from "react-icons/fa";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

export default function Users() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(3); // Giả định có 3 trang
  
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Nguyễn Văn A",
      email: "nguyenvana@email.com",
      role: "Customer",
      status: "Active",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Trần Thị B",
      email: "tranthib@email.com",
      role: "Business Owner",
      status: "Active",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "Lê Văn C",
      email: "levanc@email.com",
      role: "Customer",
      status: "Blocked",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face"
    },
    {
      id: 4,
      name: "Phạm Thị D",
      email: "phamthid@email.com",
      role: "Business Owner",
      status: "Active",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face"
    },
    {
      id: 5,
      name: "Hoàng Văn E",
      email: "hoangvane@email.com",
      role: "Customer",
      status: "Blocked",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&crop=face"
    }
  ]);

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isClickInsideMenu = event.target.closest('.action-menu-container');
      if (!isClickInsideMenu) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle menu toggle
  const handleMenuToggle = (userId) => {
    setOpenMenuId(openMenuId === userId ? null : userId);
  };

  // Handle page change
  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  // Handle block/unblock user
  const handleUserAction = (userId, action) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId 
          ? { ...user, status: action === 'block' ? 'Blocked' : 'Active' }
          : user
      )
    );
    setOpenMenuId(null);
  };

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || user.status.toLowerCase() === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const renderUserIcon = () => (
    <svg 
      width="32" 
      height="32" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="users-title-icon"
    >
      <path 
        d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <circle 
        cx="12" 
        cy="7" 
        r="4" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );

  const renderEmptyState = () => (
    <div className="users-empty">
      <svg 
        width="64" 
        height="64" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="users-empty-icon"
      >
        <path 
          d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <circle 
          cx="12" 
          cy="7" 
          r="4" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
      <h3 className="users-empty-title">No users found</h3>
      <p className="users-empty-description">
        {!searchTerm 
          ? 'No users available at the moment.'
          : `No users found matching "${searchTerm}". Try changing the search term.`
        }
      </p>
    </div>
  );

  // Tính toán thống kê
  const totalUsers = users.length;
  const blockedUsers = users.filter(user => user.status === "Blocked").length;
  const activeUsers = users.filter(user => user.status === "Active").length;

  return (
    <div className="users-management">
      {/* Header Section */}
      <div className="users-header">
        <div className="users-title-section">
          {renderUserIcon()}
          <div>
            <h1 className="users-title">User Management</h1>
            <p className="users-description">
              View and manage user information by status
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="users-stats">
        <div className="stat-card stat-card-0">
          <div className="stat-content">
            <div className="stat-info">
              <h3 className="stat-title">Total Users</h3>
              <span className="stat-number">{totalUsers}</span>
            </div>
            <FaUsers className="stat-icon" />
          </div>
        </div>

        <div className="stat-card stat-card-1">
          <div className="stat-content">
            <div className="stat-info">
              <h3 className="stat-title">Blocked Accounts</h3>
              <span className="stat-number blocked">{blockedUsers}</span>
            </div>
            <FaUserSlash className="stat-icon blocked" />
          </div>
        </div>

        <div className="stat-card stat-card-2">
          <div className="stat-content">
            <div className="stat-info">
              <h3 className="stat-title">Active Accounts</h3>
              <span className="stat-number active">{activeUsers}</span>
            </div>
            <FaCheckCircle className="stat-icon active" />
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="users-filters">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${statusFilter === "all" ? "active" : ""}`}
            onClick={() => setStatusFilter("all")}
          >
            <FaUsers />
            All ({totalUsers})
          </button>
          <button 
            className={`filter-tab ${statusFilter === "active" ? "active" : ""}`}
            onClick={() => setStatusFilter("active")}
          >
            <FaCheckCircle />
            Active ({activeUsers})
          </button>
          <button 
            className={`filter-tab ${statusFilter === "blocked" ? "active" : ""}`}
            onClick={() => setStatusFilter("blocked")}
          >
            <FaUserSlash />
            Blocked ({blockedUsers})
          </button>
        </div>
      </div>

      {/* Table Header */}
      <div className="table-header-card">
        <div className="table-header-cell">Name</div>
        <div className="table-header-cell">Email</div>
        <div className="table-header-cell">Role</div>
        <div className="table-header-cell">Status</div>
        <div className="table-header-cell">Actions</div>
      </div>

      {/* Users Cards */}
      {filteredUsers.length === 0 ? (
        renderEmptyState()
      ) : (
        <div className="users-cards">
          {filteredUsers.map((user) => (
            <div key={user.id} className={`user-card ${openMenuId === user.id ? 'menu-open' : ''}`}>
              <div className="user-card-cell user-info">
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="user-avatar"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-semibold text-lg" style={{display: 'none'}}>
                  {user.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="user-details">
                  <div className="user-name">{user.name}</div>
                </div>
              </div>
              
              <div className="user-card-cell">
                <div className="user-email">{user.email}</div>
              </div>
              
              <div className="user-card-cell">
                <div className="user-role">{user.role}</div>
              </div>
              
              <div className="user-card-cell">
                <div className={`status-indicator ${user.status.toLowerCase()}`}>
                  <div className={`status-dot ${user.status.toLowerCase()}`}></div>
                  <span className="status-text">{user.status}</span>
                </div>
              </div>
              
              <div className="user-card-cell">
                <div className="action-menu-container">
                  <div 
                    className="action-menu"
                    onClick={() => handleMenuToggle(user.id)}
                  >
                    <FaEllipsisV size={16} />
                  </div>
                  
                  {openMenuId === user.id && (
                    <div className="dropdown-menu">
                      {user.status === "Active" ? (
                        <div 
                          className="dropdown-item block"
                          onClick={() => handleUserAction(user.id, 'block')}
                        >
                          <FaBan className="dropdown-icon" />
                          <span>Block Account</span>
                        </div>
                      ) : (
                        <div 
                          className="dropdown-item unblock"
                          onClick={() => handleUserAction(user.id, 'unblock')}
                        >
                          <FaUnlock className="dropdown-icon" />
                          <span>Unblock Account</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <Stack
        spacing={2}
        className="mt-20 mb-10"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          variant="outlined"
          shape="rounded"
        />
      </Stack>
    </div>
  );
}
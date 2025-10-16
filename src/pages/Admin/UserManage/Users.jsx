import React, { useState, useEffect } from "react";
import "./Users.css";
import { 
  FaUsers, 
  FaUserSlash, 
  FaCheckCircle, 
  FaInfoCircle, 
  FaEllipsisV,
  FaSearch,
  FaFilter,
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

  // Tính toán thống kê
  const totalUsers = users.length;
  const blockedUsers = users.filter(user => user.status === "Blocked").length;
  const activeUsers = users.filter(user => user.status === "Active").length;

  return (
    <div className="users">
      <div className="users-container">
        {/* Statistics Cards */}
        <div className="users-header">
          <div className="stat-card stat-card-0">
            <div>
              <div className="stat-title">
                Tổng người dùng
                <span> {totalUsers}</span>
              </div>
            </div>
            <div>
              <FaUsers className="stat-icon" size={32} />
            </div>
          </div>

          <div className="stat-card stat-card-1">
            <div>
              <div className="stat-title">
                Tài khoản bị khóa
                <span className="text-[#721c24]"> {blockedUsers}</span>
              </div>
            </div>
            <div>
              <FaUserSlash className="stat-icon text-[#721c24]" size={32} />
            </div>
          </div>

          <div className="stat-card stat-card-2">
            <div>
              <div className="stat-title">
                Tài khoản hoạt động
                <span className="text-[#155724]"> {activeUsers}</span>
              </div>
            </div>
            <div>
              <FaCheckCircle className="stat-icon text-[#155724]" size={32} />
            </div>
          </div>
        </div>

        {/* Users Body */}
        <div className="users-body">
          <div className="users-body-header">
            <div className="users-body-header-title">
              <FaUsers className="mr-2" size={24} />
              Quản lý người dùng
            </div>
            <div className="users-body-text">
              <FaInfoCircle className="mr-2" size={20} />
              {blockedUsers} tài khoản bị khóa
            </div>
          </div>
          
          {/* Search and Filter Section */}
          <div className="search-filter-section">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên hoặc email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filter-group">
              <div className="filter-item">
   
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="active">Hoạt động</option>
                  <option value="blocked">Bị khóa</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="users-body-des">
            Xem và quản lý thông tin người dùng theo trạng thái
          </div>

          {/* Table Header */}
          <div className="table-header-card">
            <div className="table-header-cell">Họ và tên</div>
            <div className="table-header-cell">Email</div>
            <div className="table-header-cell">Trạng thái</div>
            <div className="table-header-cell">Thao tác</div>
          </div>

          {/* Users Cards */}
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
                            <span>Khóa tài khoản</span>
                          </div>
                        ) : (
                          <div 
                            className="dropdown-item unblock"
                            onClick={() => handleUserAction(user.id, 'unblock')}
                          >
                            <FaUnlock className="dropdown-icon" />
                            <span>Mở khóa tài khoản</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
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
      </div>
    </div>
  );
}
import React, { useState, useEffect } from "react";
import "./Users.css";
import { 
  FaUsers, 
  FaUserSlash, 
  FaCheckCircle, 
  FaEllipsisV,
  FaSearch,
  FaBan,
  FaUnlock,
  FaUser
} from "react-icons/fa";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useDispatch, useSelector } from "react-redux";
import { getUserPaginationApi, getAllUserApi, updateUserBlockStatusApi } from "../../../store/slices/manageUserSlice";
import Loading from "../../../components/Loading/Loading";
import BlockUserModal from "../../../components/BlockUserModal/BlockUserModal";
import toast from "react-hot-toast";

export default function Users() {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [limit] = useState(5);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalAction, setModalAction] = useState('block'); // 'block' or 'unblock'

  const { manageUser, totalPages, total, currentPage, isLoading, allUsers, isUpdating } = useSelector((state) => state.manageUser);

  useEffect(() => {
    // Load dữ liệu ban đầu chỉ một lần (hoặc khi limit thay đổi) để tránh lặp vô hạn
    dispatch(getUserPaginationApi({ page: 1, limit }));
    dispatch(getAllUserApi());
  }, [dispatch, limit]);

  // Handle menu toggle
  const handleMenuToggle = (userId) => {
    setOpenMenuId(openMenuId === userId ? null : userId);
  };

  // Handle page change
  const handlePageChange = (event, newPage) => {
    dispatch(getUserPaginationApi({ page: newPage, limit }));
  };

  // logic block/unblock user
  const handleUserAction = (userId, action) => {
    const user = filteredUsers.find(u => (u._id || u.userId) === userId);
    if (user) {
      setSelectedUser(user);
      setModalAction(action);
      setIsModalOpen(true);
    }
    setOpenMenuId(null);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setModalAction('block');
  };

  // Handle form submission
  const handleModalSubmit = async (data) => {
    try {
      await dispatch(updateUserBlockStatusApi({
        id: selectedUser.userId,
        isBlocked: data.isBlocked,
        reason: data.reason
      })).unwrap();
      
      // Close modal and refresh data
      handleModalClose();
      dispatch(getUserPaginationApi({ page: currentPage, limit }));
      dispatch(getAllUserApi());
      
      // Show success message
      toast.success(`Account ${modalAction === 'block' ? 'blocked' : 'unblocked'} successfully!`);
      
    } catch (error) {
      toast.error(error.message || 'An error occurred while updating account status');
    }
  };

  const filteredUsers = (manageUser || []).filter((user) => {
    const name = (user.fullName || user.name || user.email || "").toLowerCase();
    const matchesSearch = name.includes(searchTerm.toLowerCase());
    const status = user.isBlocked ? "blocked" : (user.isActive ? "active" : "blocked");
    const matchesStatus = statusFilter === "all" || status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const renderUserIcon = () => (
    <FaUser className="users-title-icon" size={32} />
  );

  const renderEmptyState = () => (
    <div className="users-empty">
      <FaUser className="users-empty-icon" size={64} />
      <h3 className="users-empty-title">No users found</h3>
      <p className="users-empty-description">
        {!searchTerm 
          ? 'No users available at the moment.'
          : `No users found matching "${searchTerm}". Try changing the search term.`
        }
      </p>
    </div>
  );

  // Card thống kê sử dụng allUsers để không bị thay đổi theo trang
  const totalUsers = (allUsers?.length) ?? total ?? 0;
  const blockedUsers = (allUsers || []).filter(user => user.isBlocked || !user.isActive).length;
  const activeUsers = (allUsers || []).filter(user => !user.isBlocked && user.isActive).length;

  return (
    <div className="users-management" >
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
      {isLoading ? (
        <div className="flex w-full justify-center py-10"><Loading /></div>
      ) : filteredUsers.length === 0 ? (
        renderEmptyState()
      ) : (
        <div className="users-cards">
          {filteredUsers.map((user) => {
            const id = user._id || user.userId;
            const name = user.fullName || user.name || (user.email ? user.email.split("@")[0] : "Unknown");
            const email = user.email;
            const role = (user.role || "customer");
            const status = user.isBlocked ? "Blocked" : (user.isActive ? "Active" : "Blocked");
            const avatar = user.avatar;
            return (
            <div key={id} className={`user-card ${openMenuId === id ? 'menu-open' : ''}`}>
              <div className="user-card-cell user-info">
                <img 
                  src={avatar} 
                  alt={name}
                  className="user-avatar"
           
                />
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-semibold text-lg" style={{display: 'none'}}>
                  {name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="user-details">
                  <div className="user-name">{name}</div>
                </div>
              </div>
              
              <div className="user-card-cell">
                <div className="user-email">{email}</div>
              </div>
              
              <div className="user-card-cell">
                <div className="user-role">{role}</div>
              </div>
              
              <div className="user-card-cell">
                <div className={`status-indicator ${status.toLowerCase()}`}>
                  <div className={`status-dot ${status.toLowerCase()}`}></div>
                  <span className="status-text">{status}</span>
                </div>
              </div>
              
              <div className="user-card-cell">
                <div className="action-menu-container">
                  <div 
                    className="action-menu"
                    onClick={() => handleMenuToggle(id)}
                  >
                    <FaEllipsisV size={16} />
                  </div>
                  
                  {openMenuId === id && (
                    <div className="dropdown-menu">
                      {status === "Active" ? (
                        <div 
                          className="dropdown-item block"
                          onClick={() => handleUserAction(id, 'block')}
                        >
                          <FaBan className="dropdown-icon" />
                          <span>Block Account</span>
                        </div>
                      ) : (
                        <div 
                          className="dropdown-item unblock"
                          onClick={() => handleUserAction(id, 'unblock')}
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
          )})}
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
          color="primary"
          showFirstButton
          showLastButton
          sx={{
            "& .MuiPaginationItem-root": {
              "&.Mui-selected": {
                backgroundColor: "#12422a",
                color: "#ffffff",
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: "#0d2e1c",
                },
              },
              "&:hover": {
                backgroundColor: "rgba(18, 66, 42, 0.1)",
              },
            },
          }}
        />
      </Stack>

      {/* Block/Unblock Modal */}
      <BlockUserModal
        open={isModalOpen}
        onClose={handleModalClose}
        user={selectedUser}
        action={modalAction}
        onSubmit={handleModalSubmit}
        isLoading={isUpdating}
      />
    </div>
  );
}
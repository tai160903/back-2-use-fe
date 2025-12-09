import { useState, useEffect } from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  Collapse,
} from "@mui/material";

import {
  IoHomeOutline,
  IoPersonOutline,
  IoStorefrontOutline,
} from "react-icons/io5";
import { MdOutlineAccountBalanceWallet, MdRedeem } from "react-icons/md";
import { CiStar } from "react-icons/ci";
import { GoHistory } from "react-icons/go";
import { TiMessages } from "react-icons/ti";
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";
import { CiLogout } from "react-icons/ci";
import { MdExpandMore, MdChevronRight } from "react-icons/md";
import { FaExchangeAlt, FaWallet, FaStore, FaUsers, FaChartLine, FaClipboardList } from "react-icons/fa";
import {
  People,
  Store,
  Assessment,
  Settings,
  TrendingUp,
  Security,
} from "@mui/icons-material";
import "./AdminNavbar.css";
import { useNavigate, useLocation } from "react-router-dom";
import { PATH } from "../../routes/path";
import { useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import logoImage from "../../assets/image/Back2Use-Review 1.png";
import { MdAppRegistration } from "react-icons/md";
import { GoPeople } from "react-icons/go";
import { FiPackage } from "react-icons/fi";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { AiOutlineGift } from "react-icons/ai";
import { LuStore } from "react-icons/lu";

const dashboardSubItems = [
  { id: "borrow-transactions", label: "Borrow Transactions Statistics", path: PATH.ADMIN_DASHBOARD_BORROW_TRANSACTIONS, icon: <FaExchangeAlt /> },
  { id: "business-monthly", label: "Business Monthly Statistics", path: PATH.ADMIN_DASHBOARD_BUSINESS_MONTHLY, icon: <FaStore /> },
  { id: "wallet-overview", label: "Wallet Overview", path: PATH.ADMIN_DASHBOARD_WALLET_OVERVIEW, icon: <FaWallet /> },
  { id: "wallet-transactions-monthly", label: "Wallet Transactions Monthly", path: PATH.ADMIN_DASHBOARD_WALLET_TRANSACTIONS_MONTHLY, icon: <FaWallet /> },
  { id: "top-businesses", label: "Top Businesses", path: PATH.ADMIN_DASHBOARD_TOP_BUSINESSES, icon: <FaStore /> },
  { id: "top-customers", label: "Top Customers", path: PATH.ADMIN_DASHBOARD_TOP_CUSTOMERS, icon: <FaUsers /> },
  { id: "charts", label: "Charts & Analytics", path: PATH.ADMIN_DASHBOARD_CHARTS, icon: <FaChartLine /> },
  { id: "quick-actions", label: "Quick Actions", path: PATH.ADMIN_DASHBOARD_QUICK_ACTIONS, icon: <FaClipboardList /> },
];

const adminSidebarItems = [
  { id: "admin-dashboard", label: "Dashboard", path: PATH.ADMIN, hasSubItems: true },
  { id: "registration", label: "Registration", path: PATH.ADMIN_REGISTRATION },
  { id: "users", label: "Users", path: PATH.ADMIN_USERS },
  { id: "subscriptions", label: "Subscriptions", path: PATH.ADMIN_SUBSCRIPTIONS },
  { id: "voucher", label: "Voucher", path: PATH.ADMIN_VOUCHER },
  { id: "eco-reward", label: "Eco Reward", path: PATH.ADMIN_ECO_REWARD },
  { id: "leaderboard", label: "Leader Board", path: PATH.ADMIN_LEADERBOARD },
  { id: "stores", label: "Stores", path: PATH.ADMIN_STORE },
  { id: "material", label: "Material", path: PATH.ADMIN_MATERIAL },
  { id: "settings", label: "Settings", path: PATH.ADMIN_SETTINGS },
  { id: "logout", label: "Logout", path: null },
];

const AdminNavbar = ({ onDrawerToggle }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [dashboardExpanded, setDashboardExpanded] = useState(false);

  // Notify parent when drawer toggles
  useEffect(() => {
    if (onDrawerToggle) {
      onDrawerToggle(isOpen);
    }
  }, [isOpen, onDrawerToggle]);

  // LOGOUT
  const handleLogout = () => {
    dispatch(logout());
    navigate(PATH.LOGIN);
  };

  // Handle drawer toggle
  const handleDrawerToggle = () => {
    const newOpen = !isOpen;
    setIsOpen(newOpen);
    if (onDrawerToggle) {
      onDrawerToggle(newOpen);
    }
  };

  const getIconComponent = (iconName) => {
    const icons = {
      "admin-dashboard": <IoHomeOutline color="#dc2626" className="navbar-icon" />,
      registration: <MdAppRegistration color="#f6ba35" className="navbar-icon" />,
      users: <GoPeople color="#6967ac" className="navbar-icon" />,
      subscriptions: <FiPackage color="#419065" className="navbar-icon" />,
      voucher: <AiOutlineGift color="#ee8a59" className="navbar-icon" />,
      "eco-reward": <CiStar color="#f59e0b" className="navbar-icon" />,
      leaderboard: <TrendingUp color="#10b981" className="navbar-icon" />,
      stores: <LuStore color="#7b1fa2" className="navbar-icon" />,
      material: <AiOutlinePlusCircle color="#2e7d32" className="navbar-icon" />,
      settings: <Settings color="#6a1b9a" className="navbar-icon" />,
      logout: <CiLogout color="#fb4225" className="navbar-icon" />,
    };
    return icons[iconName];
  };

  const handleExpandToggle = () => {
    setDashboardExpanded(!dashboardExpanded);
  };

  const handleDashboardNavigate = () => {
    navigate(PATH.ADMIN);
  };

  const handleSubItemClick = (path) => {
    navigate(path);
  };

  // Auto expand dashboard submenu when on dashboard sub-pages
  useEffect(() => {
    if (location.pathname.startsWith(PATH.ADMIN + '/dashboard')) {
      setDashboardExpanded(true);
    }
  }, [location.pathname]);

  return (
    <div
    className={`navbar ${isOpen ? "navbar-open" : "navbar-closed"}`}
    style={{
    height:"auto",
      background: "#fff",
      borderRight: "1px solid #ddd",
      transition: "width 0.3s",
    }}
  >
    <div className="navbar-header">
      <div className="navbar-logo">
        <img
          src={logoImage}
          alt="Back2Use Logo"
          className="navbar-logo-image"
        />
        {isOpen && <span className="navbar-logo-text">Back2Use</span>}
      </div>
      <IconButton size="small" onClick={handleDrawerToggle} sx={{ color: "#ffffff" }}>
        {isOpen ? <AiOutlineMenuFold color="#ffffff" size={22} /> : <AiOutlineMenuUnfold color="#ffffff" size={22} />}
      </IconButton>
    </div>
      <List className="navbar-content">
        {adminSidebarItems.map((item) => (
          <div key={item.id}>
            <ListItem
              button
              selected={location.pathname === item.path || (item.id === "admin-dashboard" && location.pathname === PATH.ADMIN)}
              onClick={() => {
                if (item.id === "logout") {
                  handleLogout();
                } else if (item.id === "admin-dashboard" && item.hasSubItems) {
                  handleDashboardNavigate();
                } else {
                  navigate(item.path);
                }
              }}
              className={`navbar-item ${
                location.pathname === item.path || (item.id === "admin-dashboard" && location.pathname === PATH.ADMIN) ? "active" : ""
              }`}
            >
              <Tooltip title={!isOpen ? item.label : ""} placement="right">
                <ListItemIcon className={`navbar-icon navbar-icon-${item.id}`}>
                  {getIconComponent(item.id)}
                </ListItemIcon>
              </Tooltip>
              {isOpen && <ListItemText primary={item.label} />}
              {isOpen && item.hasSubItems && (
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExpandToggle();
                  }}
                  sx={{ 
                    color: location.pathname === item.path || (item.id === "admin-dashboard" && location.pathname === PATH.ADMIN) ? "#007c00" : "#ffffff",
                    padding: "4px"
                  }}
                >
                  {dashboardExpanded ? <MdExpandMore /> : <MdChevronRight />}
                </IconButton>
              )}
            </ListItem>
            {isOpen && item.hasSubItems && (
              <Collapse in={dashboardExpanded} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {dashboardSubItems.map((subItem) => (
                    <ListItem
                      button
                      key={subItem.id}
                      selected={location.pathname === subItem.path}
                      onClick={() => handleSubItemClick(subItem.path)}
                      className={`navbar-sub-item ${location.pathname === subItem.path ? 'active' : ''}`}
                      sx={{ pl: 4 }}
                    >
                      <ListItemIcon sx={{ minWidth: "24px", color: location.pathname === subItem.path ? "#007c00" : "#ffffff" }}>
                        {subItem.icon}
                      </ListItemIcon>
                      <ListItemText 
                        primary={subItem.label}
                        primaryTypographyProps={{
                          fontSize: "13px",
                          fontWeight: location.pathname === subItem.path ? 600 : 400,
                          color: location.pathname === subItem.path ? "#007c00" : "#ffffff"
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </div>
        ))}
      </List>
    </div>
  );
};

export default AdminNavbar;

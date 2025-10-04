import { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
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

const adminSidebarItems = [
  { id: "admin-dashboard", label: "Dashboard", path: PATH.ADMIN },
  { id: "registration", label: "Registration", path: PATH.ADMIN_REGISTRATION },
  { id: "users", label: "Users", path: PATH.ADMIN_USERS },
  { id: "business", label: "Business", path: PATH.ADMIN_BUSINESS },
  { id: "analytics", label: "Analytics", path: PATH.ADMIN_ANALYTICS },
  { id: "reports", label: "Reports", path: PATH.ADMIN_REPORTS },
  { id: "settings", label: "Settings", path: PATH.ADMIN_SETTINGS },
  { id: "logout", label: "Logout", path: null },
];

const AdminNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // LOGOUT
  const handleLogout = () => {
    dispatch(logout());
    navigate(PATH.LOGIN);
  };

  const getIconComponent = (iconName) => {
    const icons = {
      "admin-dashboard": <IoHomeOutline color="#dc2626" className="navbar-icon" />,
      registration: <People color="#1976d2" className="navbar-icon" />,
      users: <People color="#1976d2" className="navbar-icon" />,
      business: <Store color="#2e7d32" className="navbar-icon" />,
      analytics: <Assessment color="#f57c00" className="navbar-icon" />,
      reports: <TrendingUp color="#7b1fa2" className="navbar-icon" />,
      settings: <Settings color="#6a1b9a" className="navbar-icon" />,
      logout: <CiLogout color="#fb4225" className="navbar-icon" />,
    };
    return icons[iconName];
  };

  return (
    <Drawer
      variant="permanent"
      className={`navbar ${isOpen ? "navbar-open" : "navbar-closed"}`}
      classes={{
        paper: `navbar-paper ${isOpen ? "navbar-open" : "navbar-closed"}`,
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
        <IconButton onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <AiOutlineMenuFold /> : <AiOutlineMenuUnfold />}
        </IconButton>
      </div>
      <List className="navbar-content">
        {adminSidebarItems.map((item) => (
          <ListItem
            button
            key={item.id}
            selected={location.pathname === item.path}
            onClick={() =>
              item.id === "logout" ? handleLogout() : navigate(item.path)
            }
            className={`navbar-item ${
              location.pathname === item.path ? "active" : ""
            }`}
          >
            <Tooltip title={!isOpen ? item.label : ""} placement="right">
              <ListItemIcon className={`navbar-icon navbar-icon-${item.id}`}>
                {getIconComponent(item.id)}
              </ListItemIcon>
            </Tooltip>
            {isOpen && <ListItemText primary={item.label} />}
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default AdminNavbar;

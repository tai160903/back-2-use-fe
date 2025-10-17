import { useState } from "react";
import {
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
import { MdAppRegistration } from "react-icons/md";
import { GoPeople } from "react-icons/go";
import { FiPackage } from "react-icons/fi";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { AiOutlineGift } from "react-icons/ai";
import { LuStore } from "react-icons/lu";

const adminSidebarItems = [
  { id: "admin-dashboard", label: "Dashboard", path: PATH.ADMIN },
  { id: "registration", label: "Registration", path: PATH.ADMIN_REGISTRATION },
  { id: "users", label: "Users", path: PATH.ADMIN_USERS },
  { id: "subscriptions", label: "Subscriptions", path: PATH.ADMIN_SUBSCRIPTIONS },
  { id: "rewards", label: "Rewards", path: PATH.ADMIN_ANALYTICS },
  { id: "stores", label: "Stores", path: PATH.ADMIN_REPORTS },
  { id: "material", label: "Material", path: PATH.ADMIN_MATERIAL },
  { id: "settings", label: "Settings", path: PATH.ADMIN_SETTINGS },
  { id: "logout", label: "Logout", path: null },
];

const AdminNavbar = ({ onDrawerToggle }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

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
      rewards: <AiOutlineGift color="#ee8a59" className="navbar-icon" />,
      stores: <LuStore color="#7b1fa2" className="navbar-icon" />,
      material: <AiOutlinePlusCircle color="#2e7d32" className="navbar-icon" />,
      settings: <Settings color="#6a1b9a" className="navbar-icon" />,
      logout: <CiLogout color="#fb4225" className="navbar-icon" />,
    };
    return icons[iconName];
  };

  return (
    <div
      className={`navbar ${isOpen ? "navbar-open" : "navbar-closed"}`}
      style={{
        height: "auto",
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
        <IconButton onClick={handleDrawerToggle}>
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
    </div>
  );
};

export default AdminNavbar;

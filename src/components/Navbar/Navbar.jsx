import { useState, useEffect } from "react";
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
import { MdOutlineAccountBalanceWallet, MdRedeem, MdOutlineEco } from "react-icons/md";
import { CiStar, CiLogout } from "react-icons/ci";
import { GoHistory } from "react-icons/go";
import { TiMessages } from "react-icons/ti";
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";
import "./Navbar.css";
import { useNavigate, useLocation } from "react-router-dom";
import { PATH } from "../../routes/path";
import { useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import logoImage from "../../assets/image/Logo.png";

const sidebarItems = [
  { id: "home", label: "Home", path: PATH.HOME },
  { id: "profile", label: "Profile", path: PATH.PROFILE },
  { id: "wallet-transaction", label: "Wallet transaction", path: PATH.WALLET_CUSTOMER },
  // { id: "stores", label: "Stores", path: PATH.STORE },
  { id: "history", label: "History", path: PATH.TRANSACTION_HISTORY },
  { id: "co2-report", label: "CO₂ Report", path: PATH.CUSTOMER_CO2_REPORT },
  { id: "single-use-usage", label: "Single-use Usage", path: PATH.CUSTOMER_SINGLE_USE_HISTORY },
  { id: "rewards", label: "Voucher Wallet", path: PATH.REWARDS },
  { id: "logout", label: "Logout", path: null },
];

const Navbar = ({ onDrawerToggle }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

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

  const getIconComponent = (iconName) => {
    const icons = {
      home: <IoHomeOutline color="#1976d2" className="navbar-icon" />,
      "ai-checker": <CiStar color="#ff9800" className="navbar-icon" />,
      profile: <IoPersonOutline color="#9c27b0" className="navbar-icon" />,
      "wallet-transaction": (
        <MdOutlineAccountBalanceWallet
          color="#2e7d32"
          className="navbar-icon"
        />
      ),
      stores: <IoStorefrontOutline color="#d84315" className="navbar-icon" />,
      history: <GoHistory color="#6a1b9a" className="navbar-icon" />,
      "co2-report": <MdOutlineEco color="#2e7d32" className="navbar-icon" />,
      "single-use-usage": <MdOutlineEco color="#388e3c" className="navbar-icon" />,
      rewards: <MdRedeem color="#fbc02d" className="navbar-icon" />,
      assistant: <TiMessages color="#0097a7" className="navbar-icon" />,
      logout: <CiLogout color="#fb4225" className="navbar-icon" />,
    };
    return icons[iconName];
  };

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
        <IconButton size="small" onClick={() => setIsOpen(!isOpen)} sx={{ color: "#ffffff" }}>
          {isOpen ? <AiOutlineMenuFold color="#ffffff" size={22} /> : <AiOutlineMenuUnfold color="#ffffff" size={22} />}
        </IconButton>
      </div>

      <List className="navbar-content">
        {sidebarItems.map((item) => {
          return (
            <div key={item.id}>
              <ListItem
                button
                selected={location.pathname === item.path}
                onClick={() =>
                  item.id === "logout" ? handleLogout() : navigate(item.path)
                }
                className={`navbar-item ${
                  location.pathname === item.path ? "active" : ""
                }`}
              >
                <Tooltip title={!isOpen ? item.label : ""} placement="right">
                  <ListItemIcon
                    className={`navbar-icon navbar-icon-${item.id}`}
                  >
                    {getIconComponent(item.id)}
                  </ListItemIcon>
                </Tooltip>
                {isOpen && <ListItemText primary={item.label} />}
              </ListItem>
            </div>
          );
        })}
      </List>
    </div>
  );
};

export default Navbar;

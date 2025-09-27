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
import "./Navbar.css";
import { useNavigate, useLocation } from "react-router-dom";
import { PATH } from "../../routes/path";
import { useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";

const sidebarItems = [
  { id: "home", label: "Home", path: PATH.HOME },
  { id: "ai-checker", label: "AI Check", path: PATH.AI_CHECK },
  { id: "profile", label: "Profile", path: PATH.PROFILE },
  { id: "wallet", label: "Wallet", path: PATH.WALLET_CUSTOMER },
  { id: "stores", label: "Stores", path: PATH.STORE },
  { id: "history", label: "History", path: PATH.TRANSACTION_HISTORY },
  { id: "rewards", label: "Rewards", path: PATH.REWARDS },
  { id: "assistant", label: "Assistant", path: PATH.ASSISTANT },
  { id: "logout", label: "Logout", path: null },
];

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // LOGOUT
  const handleLogout = () => {
    dispatch(logout());
    navigate(PATH.LOGIN)
  };

  const getIconComponent = (iconName) => {
    const icons = {
      home: <IoHomeOutline color="#1976d2" className="navbar-icon" />,
      "ai-checker": <CiStar color="#ff9800" className="navbar-icon" />,
      profile: <IoPersonOutline color="#9c27b0" className="navbar-icon" />,
      wallet: (
        <MdOutlineAccountBalanceWallet
          color="#2e7d32"
          className="navbar-icon"
        />
      ),
      stores: <IoStorefrontOutline color="#d84315" className="navbar-icon" />,
      history: <GoHistory color="#6a1b9a" className="navbar-icon" />,
      rewards: <MdRedeem color="#fbc02d" className="navbar-icon" />,
      assistant: <TiMessages color="#0097a7" className="navbar-icon" />,
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
        <IconButton onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <AiOutlineMenuFold /> : <AiOutlineMenuUnfold />}
        </IconButton>
      </div>
      <List className="navbar-content">
        {sidebarItems.map((item) => (
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

export default Navbar;

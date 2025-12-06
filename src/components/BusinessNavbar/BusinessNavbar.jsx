import { useState, useEffect } from "react";
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
  IoChevronDownOutline,
  IoChevronForwardOutline,
} from "react-icons/io5";
import { MdOutlineAccountBalanceWallet, MdRedeem, MdPayment, MdShoppingCart, MdSubscriptions } from "react-icons/md";
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
import "./BusinessNavbar.css";
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

const businessSidebarItems = [
  { id: "business-dashboard", label: "Dashboard", path: PATH.BUSINESS },
  { id: "profile", label: "Profile", path: PATH.BUSINESS_PROFILE },
  { id: "inventory", label: "Inventory Management", path: PATH.BUSINESS_INVENTORY },
  { id: "materials", label: "Materials", path: PATH.BUSINESS_MATERIALS },
  { id: "transaction", label: "Transaction", path: PATH.BUSINESS_TRANSACTION },
  { id: "subscriptions", label: "Subscriptions", path: PATH.BUSINESS_SUBSCRIPTIONS },
  { id: "reedem-rewards", label: "Reedem Rewards", path: PATH.BUSINESS_REEDEM_REWARDS },
  {
    id: "wallet-transaction",
    label: "Wallet transaction",
    children: [
      { id: "wallet-actions", label: "Deposit/Withdraw History", path: PATH.BUSINESS_WALLET_ACTIONS },
      { id: "wallet-history", label: "Borrow/Return History", path: PATH.BUSINESS_WALLET_HISTORY },
    ],
  },
  { id: "staff", label: "Staff Management", path: PATH.BUSINESS_STAFF },
  { id: "logout", label: "Logout", path: null },
];

const BusinessNavbar = ({ onDrawerToggle, sidebarItems }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isWalletMenuOpen, setIsWalletMenuOpen] = useState(false);

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

  // Drawer toggle handled inline

  const getIconComponent = (iconName) => {
    const icons = {
      "business-dashboard": <IoHomeOutline className="navbar-icon" />,
      profile: <IoPersonOutline className="navbar-icon" />,
      inventory: <LuStore className="navbar-icon" />,
      materials: <FiPackage className="navbar-icon" />,
      transaction: <MdPayment className="navbar-icon" />,
      "online-borrow-orders": <MdShoppingCart className="navbar-icon" />,
      subscriptions: <MdSubscriptions className="navbar-icon" />,
      "reedem-rewards": <AiOutlineGift className="navbar-icon" />,
      wallet: <MdOutlineAccountBalanceWallet className="navbar-icon" />,
      staff: <GoPeople className="navbar-icon" />,
      logout: <CiLogout className="navbar-icon" />,
    };
    return icons[iconName];
  };

  const itemsToRender = sidebarItems && sidebarItems.length > 0
    ? sidebarItems
    : businessSidebarItems;

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
        {itemsToRender.map((item) => {
          if (item.id === "wallet-transaction") {
            const isChildActive =
              location.pathname === PATH.BUSINESS_WALLET_ACTIONS ||
              location.pathname === PATH.BUSINESS_WALLET_HISTORY;
            return (
              <div key={item.id}>
                <ListItem
                  button
                  onClick={() => setIsWalletMenuOpen((prev) => !prev)}
                  className={`navbar-item ${isChildActive ? "active" : ""}`}
                >
                  <Tooltip title={!isOpen ? item.label : ""} placement="right">
                    <ListItemIcon
                      className={`navbar-icon navbar-icon-${item.id}`}
                    >
                      {getIconComponent("wallet")}
                    </ListItemIcon>
                  </Tooltip>
                  {isOpen && (
                    <>
                      <ListItemText primary={item.label} />
                      {isWalletMenuOpen ? (
                        <IoChevronDownOutline size={16} color="#ffffff" />
                      ) : (
                        <IoChevronForwardOutline size={16} color="#ffffff" />
                      )}
                    </>
                  )}
                </ListItem>
                {isWalletMenuOpen && isOpen && (
                  <List component="div" disablePadding>
                    {item.children.map((child) => {
                      const isActive = location.pathname === child.path;
                      return (
                        <ListItem
                          button
                          key={child.id}
                          selected={isActive}
                          onClick={() => navigate(child.path)}
                          className={`navbar-item navbar-sub-item ${
                            isActive ? "active" : ""
                          }`}
                          sx={{ 
                            pl: 4,
                            ...(isActive && {
                              backgroundColor: '#ffffff !important',
                              borderRadius: '0 !important',
                              '& .MuiListItemText-primary': {
                                color: '#007c00 !important',
                              },
                              '& .navbar-icon': {
                                color: '#007c00 !important',
                              },
                              '&:hover': {
                                backgroundColor: '#ffffff !important',
                                '& .MuiListItemText-primary': {
                                  color: '#007c00 !important',
                                },
                                '& .navbar-icon': {
                                  color: '#007c00 !important',
                                }
                              }
                            })
                          }}
                        >
                          <Tooltip
                            title={!isOpen ? child.label : ""}
                            placement="right"
                          >
                            <ListItemIcon
                              className={`navbar-icon navbar-icon-${child.id}`}
                            >
                              <GoHistory className="navbar-icon" />
                            </ListItemIcon>
                          </Tooltip>
                          {isOpen && <ListItemText primary={child.label} />}
                        </ListItem>
                      );
                    })}
                  </List>
                )}
              </div>
            );
          }

          return (
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
                  {item.icon ? item.icon : getIconComponent(item.id)}
                </ListItemIcon>
              </Tooltip>
              {isOpen && <ListItemText primary={item.label} />}
            </ListItem>
          );
        })}
      </List>
    </div>
  );
};

export default BusinessNavbar;

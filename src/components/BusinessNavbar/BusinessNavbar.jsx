import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";

import {
  IoHomeOutline,
  IoPersonOutline,
} from "react-icons/io5";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import { GoHistory } from "react-icons/go";
import { CiLogout } from "react-icons/ci";
import "../../components/AdminNavbar/AdminNavbar.css";
import { useNavigate, useLocation } from "react-router-dom";
import { PATH } from "../../routes/path";
import { useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import { FiPackage } from "react-icons/fi";
import { AiOutlineGift } from "react-icons/ai";

const businessSidebarItems = [
  { id: "business-dashboard", label: "Dashboard", path: PATH.BUSINESS },
  { id: "profile", label: "Profile", path: PATH.BUSINESS_PROFILE },
  { id: "inventory", label: "Inventory", path: PATH.BUSINESS_INVENTORY },
  { id: "transaction", label: "Transaction", path: PATH.BUSINESS_TRANSACTION },
  { id: "subscriptions", label: "Subscriptions", path: PATH.BUSINESS_SUBSCRIPTIONS },
  { id: "reedem-rewards", label: "Reedem Rewards", path: PATH.BUSINESS_REEDEM_REWARDS },
  { id: "wallet", label: "Wallet", path: PATH.BUSINESS_WALLET },
  { id: "logout", label: "Logout", path: null },
];

const BusinessNavbar = ({ isOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // LOGOUT
  const handleLogout = () => {
    dispatch(logout());
    navigate(PATH.LOGIN);
  };


  const getIconComponent = (iconName) => {
    const icons = {
      "business-dashboard": <IoHomeOutline color="#dc2626" className="navbar-icon" />,
      profile: <IoPersonOutline color="#f6ba35" className="navbar-icon" />,
      inventory: <FiPackage color="#f6ba35" className="navbar-icon" />,
      transaction: <GoHistory color="#6967ac" className="navbar-icon" />,
      subscriptions: <FiPackage color="#419065" className="navbar-icon" />,
      "reedem-rewards": <AiOutlineGift color="#ee8a59" className="navbar-icon" />,
      wallet: <MdOutlineAccountBalanceWallet color="#7b1fa2" className="navbar-icon" />,
      logout: <CiLogout color="#fb4225" className="navbar-icon" />,
    };
    return icons[iconName];
  };

  return (
    <div
      className={`navbar ${isOpen ? "navbar-open" : "navbar-closed"}`}
    >
      <List className="navbar-content">
        {businessSidebarItems.map((item) => (
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

export default BusinessNavbar;

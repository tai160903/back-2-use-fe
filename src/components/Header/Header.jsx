import React, { useEffect, useState, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import "./Header.css";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import logoImage from "../../assets/image/Logo.png";
import useAuth from "../../hooks/useAuth";
import { logout } from "../../store/slices/authSlice";
import { useSelector } from "react-redux";
import { getProfileApi } from "../../store/slices/userSlice";
import { getUserRole } from "../../utils/authUtils";
import { PATH } from "../../routes/path";
import { TiClipboard } from "react-icons/ti";
import { IoWalletOutline } from "react-icons/io5";
import { CiUser } from "react-icons/ci";
import { CiLogout } from "react-icons/ci";
import Notification from "../Notification/Notification";
import { io } from "socket.io-client";

export default function Header() {
  const location = useLocation();
  const { currentUser, dispatch, navigate } = useAuth();
  const { userInfo } = useSelector((state) => state.user);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const userRole = currentUser ? getUserRole() : null;
  const [notifications, setNotifications] = useState([]);
  const socketRef = useRef(null);

  // Gọi API get profile khi component mount và có currentUser
  useEffect(() => {
    if (currentUser && !userInfo?.data) {
      dispatch(getProfileApi());
    }
  }, [currentUser, userInfo?.data, dispatch]);

  // Kết nối socket để lấy danh sách thông báo và lắng nghe realtime
  useEffect(() => {
    if (!currentUser) return;

    const userId = userInfo?._id;
    if (!userId) return;

    const socket = io(import.meta.env.VITE_API_URL || "http://localhost:3000", {
      transports: ["websocket"],
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("register", { userId });
      socket.emit(
        "findAllNotifications",
        { userId, mode: "customer" },
        (response) => {
          if (Array.isArray(response)) {
            setNotifications(response);
          }
        }
      );
    });

    socket.on("notification:new", (payload) => {
      setNotifications((prev) => [payload, ...prev]);
    });

    return () => {
      try {
        socket.disconnect();
      } catch (err) {
        console.warn("Socket disconnect error:", err);
      }
      socketRef.current = null;
    };
  }, [currentUser, userInfo?._id]);

  // Danh sách trang auth
  const loginPage = location.pathname === "/auth/login";
  const registerPage = location.pathname === "/auth/register";

  let buttonText = "Get started";
  let buttonLink = "/auth/login";
  if (loginPage) {
    buttonText = "Sign Up";
    buttonLink = "/auth/register";
  } else if (registerPage) {
    buttonText = "Sign In";
    buttonLink = "/auth/login";
  }

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    dispatch(logout());
    handleMenuClose();
    navigate("/auth/login");
  };

  const handleBusinessRegistrationClick = () => {
    navigate(PATH.BUSINESS_REGISTRATION_STATUS);
    handleMenuClose();
  };

  return (
    <div className="header">
      <div className="headerTitles">
        {/* LOGO */}
        <div className="header-logo">
          <img src={logoImage} alt="Back2Use Logo" className="logo-image" />
          <div className="logo-text">
            <Button
              sx={{
                fontSize: "30px",
                fontWeight: "700",
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
                textTransform: "none",
              }}
            >
              <Link to="/" style={{ textDecoration: "none", color: "#006C1E" }}>
                Back2Use
              </Link>
              <span
                style={{
                  fontSize: "15px",
                  color: "#374151",
                  textTransform: "none",
                }}
              >
                Reusable Packaging
              </span>
            </Button>
          </div>
        </div>

        {/* NAV LINKS */}
        <div className="header-nav">
          <Link to="/liststore">Stores</Link>
          <Link to="/rankings">Ranking</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/vouchers">Vouchers</Link>
          <Link to="/about">About</Link>
        </div>

        {/* CTA hoặc Avatar */}
        <div className="cta">
          {currentUser ? (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <Notification
                  userId={userInfo?._id}
                  initialNotifications={notifications}
                  socket={socketRef.current}
                />
                <Avatar
                  src={userInfo?.avatar || ""}
                  alt={userInfo?.fullName || "User"}
                  onClick={handleMenuOpen}
                  sx={{
                    cursor: "pointer",
                    boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
                    width: 40,
                    height: 40,
                  }}
                >
                  {userInfo?.fullName
                    ? userInfo.fullName.charAt(0).toUpperCase()
                    : "U"}
                </Avatar>
              </div>

              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                PaperProps={{
                  elevation: 3,
                  sx: { mt: 1.5 },
                }}
              >
                <MenuItem
                  onClick={() => {
                    navigate("/profile");
                    handleMenuClose();
                  }}
                >
                  <CiUser
                    style={{ marginRight: 8, fontSize: 18, color: "#3a704e" }}
                  />{" "}
                  Profile
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    navigate("/walllet_customer");
                    handleMenuClose();
                  }}
                >
                  <IoWalletOutline
                    style={{ marginRight: 8, fontSize: 18, color: "#3a704e" }}
                  />{" "}
                  Wallet
                </MenuItem>
                {userRole === "customer" && (
                  <MenuItem onClick={handleBusinessRegistrationClick}>
                    <TiClipboard
                      style={{ marginRight: 8, fontSize: 18, color: "#3a704e" }}
                    />
                    Business Registration
                  </MenuItem>
                )}
                <MenuItem onClick={handleLogout}>
                  <CiLogout
                    style={{ marginRight: 8, fontSize: 18, color: "#3a704e" }}
                  />
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              sx={{
                backgroundColor: "#006c1e",
                color: "white",
                "&:hover": { backgroundColor: "#004d15" },
              }}
            >
              <Link
                to={buttonLink}
                style={{ textDecoration: "none", color: "white" }}
              >
                {buttonText}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

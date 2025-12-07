import React, { useEffect, useState, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import "./Header.css";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import logoImage from "../../assets/image/Logo.png";
import useAuth from "../../hooks/useAuth";
import { logout, switchAccountTypeAPI, syncWithLocalStorage } from "../../store/slices/authSlice";
import { useSelector } from "react-redux";
import { getProfileApi } from "../../store/slices/userSlice";
import { getUserRole, getRedirectPath } from "../../utils/authUtils";
import { PATH } from "../../routes/path";
import { TiClipboard } from "react-icons/ti";
import { IoWalletOutline } from "react-icons/io5";
import { CiUser } from "react-icons/ci";
import { CiLogout } from "react-icons/ci";
import { HiSwitchHorizontal } from "react-icons/hi";
import Notification from "../Notification/Notification";
import { io } from "socket.io-client";
import { getHistoryBusinessForm } from "../../store/slices/bussinessSlice";
import toast from "react-hot-toast";

export default function Header() {
  const location = useLocation();
  const { currentUser, dispatch, navigate } = useAuth();
  const { userInfo } = useSelector((state) => state.user);
  const { businessFormHistory } = useSelector((state) => state.businesses);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  // Sử dụng useMemo để đảm bảo userRole được tính lại khi currentUser thay đổi
  const userRole = React.useMemo(() => {
    return currentUser ? getUserRole() : null;
  }, [currentUser]);
  const [notifications, setNotifications] = useState([]);
  const socketRef = useRef(null);

  // Gọi API get profile khi component mount và có currentUser
  useEffect(() => {
    if (currentUser && !userInfo?.data) {
      dispatch(getProfileApi());
    }
  }, [currentUser, userInfo?.data, dispatch]);

  // Load business registration history to check if user has approved business
  useEffect(() => {
    if (currentUser && userRole === "customer") {
      dispatch(getHistoryBusinessForm({ limit: 10, page: 1 }));
    }
  }, [currentUser, userRole, dispatch]);

  // Check if user has approved business registration
  const hasApprovedBusiness = React.useMemo(() => {
    if (!businessFormHistory || !Array.isArray(businessFormHistory)) {
      return false;
    }
    // Check if there's any business registration with status "approved"
    return businessFormHistory.some(
      (form) => form?.status?.toLowerCase() === "approved"
    );
  }, [businessFormHistory]);

  // Kết nối socket để lấy danh sách thông báo và lắng nghe realtime
  useEffect(() => {
    if (!currentUser) return;
    const userId = userInfo?._id;
    if (!userId) return;
    const mode = (userRole || "customer").toLowerCase();

    const socket = io(import.meta.env.VITE_API_URL || "http://localhost:3000", {
      transports: ["websocket"],
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      // Đăng ký kèm mode để BE biết đang ở role nào
      socket.emit("register", { userId, mode });
      socket.emit(
        "findAllNotifications",
        { userId, mode },
        (response) => {
          if (Array.isArray(response)) {
            // lọc an toàn theo receiverType (tránh lẫn role)
            const filtered = response.filter(
              (n) =>
                !n?.receiverType ||
                n.receiverType.toLowerCase() === mode
            );
            setNotifications(filtered);
          }
        }
      );
    });

    // Lắng nghe realtime; backend hiện emit "notification"
    socket.on("notification", (payload) => {
      if (
        payload?.receiverType &&
        payload.receiverType.toLowerCase() !== mode
      ) {
        return;
      }
      setNotifications((prev) => [payload, ...prev]);
    });

    // fallback nếu backend vẫn dùng "notification:new"
    socket.on("notification:new", (payload) => {
      if (
        payload?.receiverType &&
        payload.receiverType.toLowerCase() !== mode
      ) {
        return;
      }
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
  }, [currentUser, userInfo?._id, userRole]);

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

  const handleSwitchAccountType = async () => {
    if (!userRole) return;

    const targetRole =
      userRole === "customer"
        ? "business"
        : userRole === "business"
        ? "customer"
        : null;

    if (!targetRole) return;

    try {
      const resultAction = await dispatch(
        switchAccountTypeAPI({ role: targetRole })
      );

      if (switchAccountTypeAPI.fulfilled.match(resultAction)) {
        // Đảm bảo state được sync với localStorage
        dispatch(syncWithLocalStorage());
        
        // Sử dụng targetRole trực tiếp vì chúng ta biết chắc chắn role mới là gì
        // Đợi một chút để đảm bảo Redux state và localStorage đã được cập nhật
        setTimeout(() => {
          const redirectPath = getRedirectPath(targetRole);
          navigate(redirectPath, { replace: true });
        }, 100);
      }
    } catch (error) {
      toast.error(error?.message || "Có lỗi xảy ra khi chuyển đổi loại tài khoản.");
    } finally {
      handleMenuClose();
    }
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
                  mode={(userRole || "customer").toLowerCase()}
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
                {/* Only show "Switch to Business" if user has approved business registration */}
                {userRole === "customer" && hasApprovedBusiness && (
                  <MenuItem onClick={handleSwitchAccountType}>
                    <HiSwitchHorizontal
                      style={{ marginRight: 8, fontSize: 18, color: "#3a704e" }}
                    />
                    Switch to Business
                  </MenuItem>
                )}
                {/* Show "Switch to Customer" if user is currently in business mode */}
                {userRole === "business" && (
                  <MenuItem onClick={handleSwitchAccountType}>
                    <HiSwitchHorizontal
                      style={{ marginRight: 8, fontSize: 18, color: "#3a704e" }}
                    />
                    Switch to Customer
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

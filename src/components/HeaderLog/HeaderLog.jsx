import "./HeaderLog.css";
import Typography from "@mui/material/Typography";
import { FaWallet } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { PATH } from "../../routes/path";
import { logout, switchAccountTypeAPI, syncWithLocalStorage } from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import { getUserRole, getRedirectPath } from "../../utils/authUtils";
import React, { useEffect, useState, useRef } from "react";
import {
  getProfileApi,
  getProfileBusiness,
  getProfileStaff,
} from "../../store/slices/userSlice";

import { IoIosLogOut } from "react-icons/io";
import { HiSwitchHorizontal } from "react-icons/hi";
import Notification from "../Notification/Notification";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
export default function HeaderLog() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);
  const { userInfo, businessInfo, staffInfo } = useSelector((state) => state.user);
  const navigate = useNavigate();
  // Sử dụng state để đảm bảo userRole được tính lại khi currentUser thay đổi
  const [userRole, setUserRole] = useState(() => getUserRole());
  
  useEffect(() => {
    setUserRole(getUserRole());
  }, [currentUser]);

  useEffect(() => {
    if (userRole === "admin") {
      // Không gọi API profile cho admin
      return;
    }
    if (userRole === "business") {
      dispatch(getProfileBusiness());
    } else if (userRole === "staff") {
      dispatch(getProfileStaff());
    } else {
      dispatch(getProfileApi());
    }
  }, [dispatch, userRole]);

  const [notifications, setNotifications] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    // Không kết nối socket cho admin
    if (userRole === "admin") return;
    
    const userId = userInfo?._id;
    if (!userId) return;

    const mode =
      userRole === "business" ? "business" : "customer";

    const socket = io(import.meta.env.VITE_API_URL || "http://localhost:3000", {
      transports: ["websocket"],
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      // đăng ký kèm mode
      socket.emit("register", { userId, mode });
      socket.emit(
        "findAllNotifications",
        { userId, mode },
        (response) => {
          if (Array.isArray(response)) {
            const filtered = response.filter(
              (n) =>
                !n?.receiverType ||
                n.receiverType.toLowerCase() === mode
            );
            console.log(response);
            setNotifications(filtered);
          }
        }
      );
    });

    socket.on("notification", (payload) => {
      if (
        payload?.receiverType &&
        payload.receiverType.toLowerCase() !== mode
      ) {
        return;
      }
      setNotifications((prev) => [payload, ...prev]);
    });

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
  }, [userInfo, businessInfo, userRole]);

  const handleLogout = () => {
    dispatch(logout());
    navigate(PATH.LOGIN);
  };

  const handleSwitchToCustomer = async () => {
    if (userRole !== "business") return;

    try {
      const resultAction = await dispatch(
        switchAccountTypeAPI({ role: "customer" })
      );

      if (switchAccountTypeAPI.fulfilled.match(resultAction)) {
        // Đảm bảo state được sync với localStorage
        dispatch(syncWithLocalStorage());
        
        // Sử dụng "customer" trực tiếp vì chúng ta biết chắc chắn role mới là gì
        // Đợi một chút để đảm bảo Redux state và localStorage đã được cập nhật
        setTimeout(() => {
          const redirectPath = getRedirectPath("customer");
          navigate(redirectPath, { replace: true });
        }, 100);
      }
    } catch (error) {
      toast.error(error?.message || "Có lỗi xảy ra khi chuyển đổi loại tài khoản.");
    }
  };

  // Render thông tin cho customer
  const renderCustomerInfo = () => (
    <>
      <Typography className="header-log-name" variant="h6" noWrap>
        Welcome, {userInfo?.fullName || "User"}
      </Typography>
      <Typography className="header-log-balance">
        <FaWallet className="mr-2" /> {userInfo?.wallet?.availableBalance || 0}{" "}
        {"VND"}
      </Typography>
    </>
  );

  // Render thông tin cho business
  const renderBusinessInfo = () => (
    <>
      <Typography className="header-log-name" variant="h6" noWrap>
        Welcome, {businessInfo?.data?.business?.businessName || "Business"}
      </Typography>
      <Typography className="header-log-balance">
        <FaWallet className="mr-2" />{" "}
        {businessInfo?.data?.wallet?.availableBalance || 0} {"VND"}
      </Typography>
    </>
  );

  // Render thông tin cho staff
  const renderStaffInfo = () => (
    <>
      <Typography className="header-log-name" variant="h6" noWrap>
        Staff at{" "}
        {staffInfo?.data?.businessId?.businessName || "Store"}
      </Typography>
    </>
  );

  // Render thông tin cho admin
  const renderAdminInfo = () => (
    <>
      <Typography className="header-log-name" variant="h6" noWrap>
        Welcome admin
      </Typography>
    </>
  );

  return (
    <>
      <div className="header-log">
        <div className="header-log-container">
          <div className="header-log-left">
            <div className="header-log-info">
              <Avatar
                src={
                  userRole === "admin"
                    ? ""
                    : userRole === "business"
                    ? businessInfo?.data?.business?.businessLogoUrl ||
                      businessInfo?.data?.business?.avatar ||
                      ""
                    : userRole === "staff"
                    ? staffInfo?.data?.businessId?.businessLogoUrl || ""
                    : userInfo?.avatar || ""
                }
                alt={
                  userRole === "admin"
                    ? "Admin"
                    : userRole === "business"
                    ? businessInfo?.data?.business?.businessName || "Business"
                    : userRole === "staff"
                    ? staffInfo?.data?.businessId?.businessName || "Store"
                    : userInfo?.fullName || "User"
                }
                sx={{
                  marginRight: 2,
                  cursor: "pointer",
                }}
              >
                {userRole === "admin" ? "A" : ""}
              </Avatar>
              <div>
                {userRole === "admin"
                  ? renderAdminInfo()
                  : userRole === "business"
                  ? renderBusinessInfo()
                  : userRole === "staff"
                  ? renderStaffInfo()
                  : renderCustomerInfo()}
              </div>
            </div>
          </div>
          <div className="header-log-actions">
            {userRole === "business" && (
              <div
                className="header-log-switch"
                onClick={handleSwitchToCustomer}
              >
                <HiSwitchHorizontal className="header-log-switch-icon" />
                <span className="header-log-switch-text">
                  Switch to Customer
                </span>
              </div>
            )}
            {userRole !== "admin" && (
              <div className="header-log-icon-notificate">
                <Notification
                  userId={
                    userRole === "business"
                      ? businessInfo?.data?.business?._id ||
                        businessInfo?.data?.business?._uid
                      : userInfo?._id
                  }
                  initialNotifications={notifications}
                  socket={socketRef.current}
                  mode={
                    userRole === "business" ? "business" : "customer"
                  }
                />
              </div>
            )}
            <IoIosLogOut className="header-log-icon" onClick={handleLogout} />
          </div>
        </div>
      </div>
    </>
  );
}

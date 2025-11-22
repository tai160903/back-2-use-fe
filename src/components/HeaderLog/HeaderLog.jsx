import "./HeaderLog.css";
import Typography from "@mui/material/Typography";
import { FaWallet } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { PATH } from "../../routes/path";
import { logout, switchAccountTypeAPI } from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import { getUserRole, getRedirectPath } from "../../utils/authUtils";
import { useEffect, useState, useRef } from "react";
import {
  getProfileApi,
  getProfileBusiness,
} from "../../store/slices/userSlice";

import { IoIosLogOut } from "react-icons/io";
import { HiSwitchHorizontal } from "react-icons/hi";
import Notification from "../Notification/Notification";
import { io } from "socket.io-client";
export default function HeaderLog() {
  const dispatch = useDispatch();
  const { userInfo, businessInfo } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const userRole = getUserRole();

  useEffect(() => {
    if (userRole === "business") {
      dispatch(getProfileBusiness());
    } else {
      dispatch(getProfileApi());
    }
  }, [dispatch, userRole]);

  const [notifications, setNotifications] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    const userId =
      userRole === "business"
        ? businessInfo?.data?.business?._id ||
          businessInfo?.data?.business?._uid
        : userInfo?._id;

    if (!userId) return;

    const socket = io(import.meta.env.VITE_API_URL || "http://localhost:3000", {
      transports: ["websocket"],
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("register", { userId });
      socket.emit(
        "findAllNotifications",
        { userId, mode: userRole === "business" ? "business" : "customer" },
        (response) => {
          if (Array.isArray(response)) {
            console.log(response);
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
        const payload = resultAction.payload;
        const newRole =
          payload?.data?.user?.role?.trim().toLowerCase() || "customer";
        const redirectPath = getRedirectPath(newRole);
        navigate(redirectPath, { replace: true });
      }
    } catch (error) {
      // lỗi đã được xử lý trong slice (toast), không cần làm thêm
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

  return (
    <>
      <div className="header-log">
        <div className="header-log-container">
          <div className="header-log-left">
            <div className="header-log-info">
              <Avatar
                src={
                  userRole === "business"
                    ? businessInfo?.data?.business?.businessLogoUrl ||
                      businessInfo?.data?.business?.avatar ||
                      ""
                    : userInfo?.avatar || ""
                }
                alt={
                  userRole === "business"
                    ? businessInfo?.data?.business?.businessName || "Business"
                    : userInfo?.fullName || "User"
                }
                sx={{
                  marginRight: 2,
                  cursor: "pointer",
                }}
              ></Avatar>
              <div>
                {userRole === "business"
                  ? renderBusinessInfo()
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
              />
            </div>
            <IoIosLogOut className="header-log-icon" onClick={handleLogout} />
          </div>
        </div>
      </div>
    </>
  );
}

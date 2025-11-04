import "./HeaderLog.css";
import Typography from "@mui/material/Typography";
import { FaWallet } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { PATH } from "../../routes/path";
import { logout } from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import { getUserRole } from "../../utils/authUtils";
import { useEffect } from "react";
import { getProfileApi, getProfileBusiness } from "../../store/slices/userSlice";

import { IoMdNotificationsOutline } from "react-icons/io";
import { IoIosLogOut } from "react-icons/io";
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

  const handleLogout = () => {
    dispatch(logout());
    navigate(PATH.LOGIN);
  };

  // Render thông tin cho customer
  const renderCustomerInfo = () => (
    <>
      <Typography className="header-log-name" variant="h6" noWrap>
        Welcome, {userInfo?.fullName || "User"} 
      </Typography>
      <Typography className="header-log-balance">
        <FaWallet className="mr-2" /> {userInfo?.wallet?.balance || 0} {"VND"}
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
        <FaWallet className="mr-2" /> {businessInfo?.data?.wallet?.availableBalance || 0} {"VND"}
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
                    ? (
                      businessInfo?.data?.business?.businessLogoUrl ||
                      businessInfo?.data?.business?.avatar ||
                      ""
                    )
                    : (userInfo?.avatar || "")
                }
                alt={
                  userRole === "business"
                    ? (businessInfo?.data?.business?.businessName || "Business")
                    : (userInfo?.fullName || "User")
                }
                sx={{
                  marginRight: 2,
                  cursor: "pointer",
                }}
              >
         
              </Avatar>
              <div>
                {userRole === "business" ? renderBusinessInfo() : renderCustomerInfo()}
              </div>
            </div>
          </div>
          <div className="header-log-actions">
            <div className="header-log-icon-notificate">
              <IoMdNotificationsOutline />
              <span className="notification-badge">3</span>
            </div>
            <IoIosLogOut className="header-log-icon" onClick={handleLogout} />
          </div>
        </div>
      </div>
    </>
  );
}

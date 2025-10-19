import "./HeaderLog.css";
import Typography from "@mui/material/Typography";
import { FaWallet } from "react-icons/fa6";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoIosLogOut } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { PATH } from "../../routes/path";
import { logout } from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
export default function HeaderLog() {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate(PATH.LOGIN);
  };

  return (
    <>
      <div className="header-log">
        <div className="header-log-container">
          <div className="header-log-left">
            <div className="header-log-info">
              <Avatar
                src={userInfo?.avatar || ""}
                alt={userInfo?.data?.user?.name || "User"}
                sx={{
                  marginRight: 2,
                  cursor: "pointer",
                }}
              >
         
              </Avatar>
              <div>
                <Typography className="header-log-name" variant="h6" noWrap>
                  Welcome, {userInfo?.fullName || "User"} 
                </Typography>
            
                  
                <Typography className="header-log-balance">
                      <FaWallet className="mr-2" /> {userInfo?.wallet?.balance  || 0 } {"VND"}
                    </Typography>
                 
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

import "./HeaderLog.css";
import Typography from "@mui/material/Typography";
import { FaWallet } from "react-icons/fa6";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoIosLogOut } from "react-icons/io";
import { useDispatch } from "react-redux";
import { PATH } from "../../routes/path";
import { logout } from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
export default function HeaderLog() {
  const dispatch = useDispatch();
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
              <Typography
                className="header-log-atv"
                variant="h6"
                noWrap
                component="div"
              >
                A
              </Typography>
              <div>
                <Typography className="header-log-name" variant="h6" noWrap>
                  Welcome, Sarah Wilson
                </Typography>
                <Typography className="header-log-role" variant="body2" noWrap>
                  Green Café Downtown - Business
                  <span className="header-log-balance">
                    <FaWallet className="mr-2" /> $2,500.00
                  </span>
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

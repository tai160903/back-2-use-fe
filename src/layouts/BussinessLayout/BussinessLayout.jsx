import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import HeaderLog from "../../components/HeaderLog/HeaderLog";
import BusinessNavbar from "../../components/BusinessNavbar/BusinessNavbar";
import { useDispatch, useSelector } from "react-redux";
import { getProfileApi } from "../../store/slices/userSlice";
import { logout } from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../routes/path";
import "./BussinessLayout.css";

export default function BussinessLayout() {
  const [isOpen, setIsOpen] = useState(false); // Trạng thái sidebar
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    
    if (!userInfo && currentUser?.accessToken) {
      dispatch(getProfileApi());
    }
  }, [dispatch, userInfo]);

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
    navigate(PATH.LOGIN);
  };

  const handleDrawerToggle = (open) => {
    setIsOpen(open);
  };

  return (
    <div className="business-layout-container">
      {/* Sidebar bên trái - Fixed */}
      <BusinessNavbar onDrawerToggle={handleDrawerToggle} />

      {/* Cột nội dung bên phải gồm Header + Content */}
      <div className={`business-content-wrapper ${isOpen ? 'sidebar-open' : ''}`}>
        <HeaderLog />
        <div className="business-page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import HeaderLog from "../../components/HeaderLog/HeaderLog";
import Navbar from "../../components/Navbar/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { getProfileApi } from "../../store/slices/userSlice";
import "./MainLayout.css";

export default function MainLayout() {
  const [activeTab, setActiveTab] = useState("home");
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);

  // Load user profile data khi vào main layout (chỉ khi chưa có dữ liệu)
  useEffect(() => {
    if (!userInfo) {
      dispatch(getProfileApi());
    }
  }, [dispatch, userInfo]);

  const handleDrawerToggle = (open) => {
    setIsOpen(open);
  };

  return (
    <div className="main-layout-container">
      {/* Sidebar bên trái - Fixed */}
      <Navbar
        activeTab={location.pathname}
        onTabChange={setActiveTab}
        onDrawerToggle={handleDrawerToggle}
      />

      {/* Cột nội dung bên phải gồm Header + Content */}
      <div className={`main-content-wrapper ${isOpen ? 'sidebar-open' : ''}`}>
        <HeaderLog />
        <div className="main-page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

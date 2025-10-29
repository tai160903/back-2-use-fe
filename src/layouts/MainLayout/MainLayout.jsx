import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import HeaderLog from "../../components/HeaderLog/HeaderLog";
import Navbar from "../../components/Navbar/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { getProfileApi } from "../../store/slices/userSlice";

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

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar bên trái */}
      <Navbar
        activeTab={location.pathname}
        onTabChange={setActiveTab}
        onDrawerToggle={setIsOpen}
      />

      {/* Cột nội dung bên phải gồm Header + Content */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <HeaderLog />
        <div style={{ flex: 1, padding: "20px" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

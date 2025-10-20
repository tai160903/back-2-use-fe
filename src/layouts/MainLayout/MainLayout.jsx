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
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header cố định trên cùng */}
      <HeaderLog />

      <div style={{ display: "flex", flex: 1 }}>
        {/* Navbar bên trái */}
        <Navbar
          activeTab={location.pathname}
          onTabChange={setActiveTab}
          onDrawerToggle={setIsOpen}
        />

        {/* Nội dung chính bên phải */}
        <div
          style={{
            flexGrow: 1,
            marginLeft: isOpen ? "" : "70px",
            transition: "margin-left 0.3s",
            padding: "20px",
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}

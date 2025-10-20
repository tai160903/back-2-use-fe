import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import HeaderLog from "../../components/HeaderLog/HeaderLog";
import BusinessNavbar from "../../components/BusinessNavbar/BusinessNavbar";
import { useDispatch, useSelector } from "react-redux";
import { getProfileApi } from "../../store/slices/userSlice";

export default function BussinessLayout() {
  const [isOpen, setIsOpen] = useState(false); // Trạng thái sidebar
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);

  // Load user profile data khi vào business layout (chỉ khi chưa có dữ liệu)
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
        {/* AdminNavbar bên trái */}
        <BusinessNavbar
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

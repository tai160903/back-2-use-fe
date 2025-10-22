import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import HeaderLog from "../../components/HeaderLog/HeaderLog";
import BusinessNavbar from "../../components/BusinessNavbar/BusinessNavbar";
import { useDispatch, useSelector } from "react-redux";
import { getProfileApi } from "../../store/slices/userSlice";
import { logout } from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../routes/path";
import { IconButton, Box } from "@mui/material";
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";
import { IoMdNotificationsOutline, IoIosLogOut } from "react-icons/io";
import logoImage from "../../assets/image/Back2Use-Review 1.png";

export default function BussinessLayout() {
  const [isOpen, setIsOpen] = useState(false); // Trạng thái sidebar
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.user);

  // Load user profile data khi vào business layout (chỉ khi chưa có dữ liệu)
  useEffect(() => {
    if (!userInfo) {
      dispatch(getProfileApi());
    }
  }, [dispatch, userInfo]);

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
    navigate(PATH.LOGIN);
  };


  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header cố định trên cùng với logo và toggle button */}
      <div style={{ 
        position: "fixed", 
        top: 0, 
        left: 0, 
        right: 0, 
        zIndex: 1201,
        background: "#fff",
        borderBottom: "1px solid #e0e0e0",
        height: "84px", // 64px + 20px margin
        display: "flex",
        alignItems: "center",
        padding: "0 20px"
      }}>
image.png        {/* Logo, ví và tên bên trái */}
        <Box style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <IconButton onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <AiOutlineMenuFold /> : <AiOutlineMenuUnfold />}
          </IconButton>
          <img 
            src={logoImage} 
            alt="Back2Use Logo" 
            style={{ height: "30px", width: "auto" }}
          />
          {isOpen && <span style={{ fontSize: "16px", fontWeight: "600", color: "#006c1d" }}>Back2Use</span>}
        </Box>
        
        {/* Thông tin user (avatar, tên, ví) ở giữa */}
        <div style={{ marginLeft: "20px" }}>
          <HeaderLog />
        </div>
        
        {/* Nút thông báo và logout bên phải */}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "25px" }}>
          <div style={{ position: "relative", display: "inline-block" }}>
            <IoMdNotificationsOutline style={{ fontSize: "25px", cursor: "pointer" }} />
            <span style={{
              position: "absolute",
              top: "-5px",
              right: "-9px",
              backgroundColor: "red",
              color: "white",
              borderRadius: "50%",
              width: "16px",
              height: "16px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "10px",
              fontWeight: "bold"
            }}>3</span>
          </div>
          <IoIosLogOut 
            style={{ fontSize: "25px", cursor: "pointer" }} 
            onClick={handleLogout}
          />
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, position: "relative", marginTop: "84px" }}>
        {/* BusinessNavbar bên trái - cố định */}
        <BusinessNavbar
          isOpen={isOpen}
        />

        {/* Nội dung chính bên phải */}
        <div
          style={{
            flexGrow: 1,
            marginLeft: isOpen ? "250px" : "70px",
            transition: "margin-left 0.3s",
            padding: "20px",
            minHeight: "calc(100vh - 84px)", // Trừ đi chiều cao header
            overflowY: "auto", // Cho phép scroll nội dung
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}

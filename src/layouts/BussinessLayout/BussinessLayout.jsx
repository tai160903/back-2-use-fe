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


  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header cố định trên cùng với logo và toggle button */}
      <div >       
        
        {/* Thông tin user (avatar, tên, ví) ở giữa */}
        <div style={{ marginLeft: "20px" }}>
          <HeaderLog />
        </div>
        
        {/* Nút thông báo và logout bên phải */}
      
      </div>

      <div style={{ display: "flex", flex: 1 }}>
        {/* BusinessNavbar bên trái - cố định */}
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

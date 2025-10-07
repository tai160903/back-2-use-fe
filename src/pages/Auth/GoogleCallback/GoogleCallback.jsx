import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../../store/slices/authSlice";
import toast from "react-hot-toast";
import { PATH } from "../../../routes/path";
import { jwtDecode } from "jwt-decode";

const GoogleCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");

  if (token) {
    try {
      const decodedToken = jwtDecode(token); 

      const userData = {
        accessToken: token,
        user: {
          role: decodedToken.role || "customer",
          id: decodedToken.sub || null, 
        },
      };

      localStorage.setItem("currentUser", JSON.stringify(userData));
      dispatch(login(userData));

      toast.success("Đăng nhập bằng Google thành công!");

      const userRole = userData.user.role.trim().toLowerCase();
      const redirectPath = userRole === "customer" ? PATH.HOME : PATH.BUSINESS;
      navigate(redirectPath, { replace: true });
    } catch (error) {
      console.error("Error decoding token:", error);
      toast.error("Đăng nhập Google thất bại, token không hợp lệ.");
      navigate(PATH.LOGIN, { replace: true });
    }
  } else {
    toast.error("Đăng nhập thất bại, không tìm thấy token.");
    navigate(PATH.LOGIN, { replace: true });
  }
}, [location, navigate, dispatch]);

  return null;
};

export default GoogleCallback;
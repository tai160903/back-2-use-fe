import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { googleRedirectAPI, login } from "../../../store/slices/authSlice";
import toast from "react-hot-toast";
import { PATH } from "../../../routes/path";
import { CircularProgress, Box, Typography } from "@mui/material";
import { getUserRole, getRedirectPath } from "../../../utils/authUtils";

export default function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      // Lấy tất cả query params từ URL
      const token = searchParams.get("token");
      const accessToken = searchParams.get("accessToken");
      const error = searchParams.get("error");
      const code = searchParams.get("code");

      // Nếu có lỗi từ backend
      if (error) {
        toast.error("Đăng nhập Google thất bại. Vui lòng thử lại.");
        navigate(PATH.LOGIN);
        return;
      }

      // Trường hợp 1: Backend trả về token trực tiếp trong URL
      if (token || accessToken) {
        try {
          const userToken = token || accessToken;
          
          // Decode JWT token để lấy user info
          const tokenPayload = JSON.parse(atob(userToken.split('.')[1]));
          
          // Tạo user object
          const userData = {
            accessToken: userToken,
            ...tokenPayload
          };

          // Lưu vào localStorage và Redux
          localStorage.setItem("currentUser", JSON.stringify(userData));
          dispatch(login(userData));

          // Lấy role hiện tại (ưu tiên từ user object nếu sau này có, fallback token)
          const userRole =
            getUserRole() ||
            tokenPayload.role?.trim().toLowerCase() ||
            "customer";
          const redirectPath = getRedirectPath(userRole);

          // Điều hướng dựa vào role
          setTimeout(() => {
            navigate(redirectPath, { replace: true });
          }, 100);

          toast.success("Đăng nhập bằng Google thành công!");
          return;
        } catch (error) {
          console.error("Token parsing error:", error);
          toast.error("Lỗi xử lý token. Vui lòng thử lại.");
          navigate(PATH.LOGIN);
          return;
        }
      }

      // Trường hợp 2: Backend trả về code, cần gọi API để đổi lấy token
      if (code) {
        try {
          // Gọi API backend để xử lý Google redirect
          const params = {};
          searchParams.forEach((value, key) => {
            params[key] = value;
          });

          const payload = await dispatch(googleRedirectAPI(params)).unwrap();

          if (payload && payload.data) {
            // Lưu dữ liệu user vào localStorage
            localStorage.setItem("currentUser", JSON.stringify(payload.data));

            // Lấy role hiện tại ưu tiên từ user object, fallback token
            const userRole =
              getUserRole() ||
              (() => {
                try {
                  const token = payload.data.accessToken;
                  const tokenPayload = JSON.parse(atob(token.split(".")[1]));
                  return tokenPayload.role?.trim().toLowerCase();
                } catch {
                  return null;
                }
              })() ||
              "customer";

            const redirectPath = getRedirectPath(userRole);

            // Điều hướng dựa vào role
            setTimeout(() => {
              navigate(redirectPath, { replace: true });
            }, 100);

            toast.success("Đăng nhập bằng Google thành công!");
          } else {
            toast.error("Đăng nhập thất bại. Vui lòng thử lại.");
            navigate(PATH.LOGIN);
          }
        } catch (error) {
          console.error("Google login error:", error);
          toast.error(error.message || "Đăng nhập Google thất bại. Vui lòng thử lại.");
          navigate(PATH.LOGIN);
        }
        return;
      }

      // Nếu không có params nào, redirect về login
      toast.error("Không nhận được dữ liệu xác thực.");
      navigate(PATH.LOGIN);
    };

    handleGoogleCallback();
  }, [searchParams, navigate, dispatch]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        bgcolor: "#f5f5f5",
      }}
    >
      <CircularProgress size={60} sx={{ color: "#6a1b9a", mb: 3 }} />
      <Typography variant="h5" sx={{ fontWeight: 600, color: "#2c3e50", mb: 1 }}>
        Đang xử lý đăng nhập...
      </Typography>
      <Typography variant="body1" sx={{ color: "#7f8c8d" }}>
        Vui lòng chờ trong giây lát
      </Typography>
    </Box>
  );
}

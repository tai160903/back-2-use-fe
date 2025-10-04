import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Box, Typography, Button, Container, Paper, CircularProgress } from "@mui/material";
import { CheckCircle, Error, Email } from "@mui/icons-material";
import { activeAccountAPI } from "../../../store/slices/authSlice";
import { PATH } from "../../../routes/path";
import "../../Auth/Login/Login.css";

export default function ActiveAccount() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    
    if (!token) {
      setStatus("error");
      setMessage("Token xác nhận không hợp lệ hoặc đã hết hạn.");
      return;
    }

    // Gọi API xác nhận tài khoản với token
    const confirmAccount = async () => {
      try {
        // Tạo payload với token để gửi lên backend
        const payload = { token };
        await dispatch(activeAccountAPI(payload)).unwrap();
        setStatus("success");
        setMessage("Đăng ký thành công! Đang chuyển về trang đăng nhập...");
        
        // Tự động chuyển về trang login sau 2 giây
        setTimeout(() => {
          navigate(PATH.LOGIN);
        }, 2000);
      } catch (error) {
        setStatus("error");
        setMessage(error.message || "Kích hoạt tài khoản thất bại. Vui lòng thử lại.");
      }
    };

    confirmAccount();
  }, [searchParams, dispatch, navigate]);

  const handleGoToLogin = () => {
    navigate(PATH.LOGIN);
  };

  const renderContent = () => {
    switch (status) {
      case "loading":
        return (
          <>
            <CircularProgress
              size={80}
              sx={{ color: "#1976d2", marginBottom: 2 }}
            />
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ fontWeight: "bold", color: "#1976d2" }}
            >
              Đang xác nhận tài khoản...
            </Typography>
            <Typography
              variant="body1"
              sx={{
                marginBottom: 3,
                color: "#666",
                lineHeight: 1.6,
              }}
            >
              Vui lòng chờ trong giây lát.
            </Typography>
          </>
        );

      case "success":
        return (
          <>
            <CheckCircle
              sx={{
                fontSize: 80,
                color: "#4caf50",
                marginBottom: 2,
              }}
            />
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ fontWeight: "bold", color: "#4caf50" }}
            >
              Đăng ký thành công!
            </Typography>
            <Typography
              variant="body1"
              sx={{
                marginBottom: 3,
                color: "#666",
                lineHeight: 1.6,
              }}
            >
              {message}
            </Typography>
          </>
        );

      case "error":
        return (
          <>
            <Error
              sx={{
                fontSize: 80,
                color: "#f44336",
                marginBottom: 2,
              }}
            />
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ fontWeight: "bold", color: "#f44336" }}
            >
              Kích hoạt thất bại
            </Typography>
            <Typography
              variant="body1"
              sx={{
                marginBottom: 3,
                color: "#666",
                lineHeight: 1.6,
              }}
            >
              {message}
            </Typography>
            <Button
              variant="contained"
              onClick={handleGoToLogin}
              sx={{
                backgroundColor: "#1976d2",
                "&:hover": {
                  backgroundColor: "#1565c0",
                },
                padding: "12px 32px",
                fontSize: "16px",
                marginTop: 2
              }}
            >
              Quay lại trang đăng nhập
            </Button>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="auth-container">
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            marginTop: 8,
            textAlign: "center",
            borderRadius: 2,
          }}
        >
          <Box sx={{ marginBottom: 3 }}>
            {renderContent()}
          </Box>
        </Paper>
      </Container>
    </div>
  );
}

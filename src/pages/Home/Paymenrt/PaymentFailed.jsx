import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Divider,
  Alert,
} from "@mui/material";
import { MdError, MdRefresh } from "react-icons/md";
import { FaHome, FaHeadset } from "react-icons/fa";
import { IoMdInformationCircle } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserRole } from "../../../utils/authUtils";
import { PATH } from "../../../routes/path";
import "./CheckoutPayment.css";

export default function PaymentFailure() {
  const navigate = useNavigate();
  const [depositAmount, setDepositAmount] = useState("500,000");
  
  useEffect(() => {
    // Lấy số tiền nạp từ localStorage
    const savedAmount = localStorage.getItem("depositAmount");
    if (savedAmount) {
      setDepositAmount(parseFloat(savedAmount).toLocaleString('vi-VN'));
      // Xóa số tiền đã lưu sau khi sử dụng
      localStorage.removeItem("depositAmount");
    }
  }, []);

  const transactionData = {
    amount: depositAmount,
    transactionId: "WLT20250109123456",
    date: "01/09/2025",
    time: "14:30:25",
    method: "Bank Card",
    accountNumber: "**** **** **** 4532",
    transactionType: "Wallet Top-Up",
    errorCode: "ERR_PAYMENT_DECLINED",
    errorMessage: "Transaction declined by the bank",
  };

  // Xác định trang hiện tại để điều hướng đúng
  const getWalletRoute = () => {
    const userRole = getUserRole();

    
    if (userRole === "business" || userRole === "bussiness") {
      return "/wallet_business";
    }
    return "/wallet_customer";
  };

  // Xác định trang chủ theo role
  const getHomeRoute = () => {
    const userRole = getUserRole();
    if (userRole === "business" || userRole === "bussiness") {
      return PATH.BUSINESS;
    }
    return PATH.HOME;
  };

  return (
    <Box className="checkoutPayment-container checkoutPayment-failure-container">
      <Container maxWidth="md" style={{ position: "relative", zIndex: 1 }}>
        <Paper className="checkoutPayment-paper">
          <Box className="checkoutPayment-header checkoutPayment-failure-header">
            <Box className="checkoutPayment-icon-circle checkoutPayment-icon-circle-failure">
              <MdError
                size={64}
                color="#ffffff"
                style={{ position: "relative", zIndex: 1 }}
              />
            </Box>
            <Typography variant="h4" className="checkoutPayment-title">
              Thanh toán thất bại
            </Typography>
            <Typography variant="body1" className="checkoutPayment-subtitle">
              Xin lỗi, chúng tôi không thể hoàn tất giao dịch nạp tiền
            </Typography>
          </Box>

          <Box sx={{ p: 6 }}>
            <Alert
              severity="error"
              icon={<IoMdInformationCircle size={28} />}
              className="checkoutPayment-alert"
            >
              <Typography
                variant="body2"
                className="checkoutPayment-alert-title"
              >
                {transactionData.errorMessage}
              </Typography>
              <Typography
                variant="caption"
                className="checkoutPayment-alert-code"
              >
                Mã lỗi: {transactionData.errorCode}
              </Typography>
            </Alert>

            <Box className="checkoutPayment-amount-box checkoutPayment-amount-box-failure">
              <Typography
                variant="h3"
                className="checkoutPayment-amount-text checkoutPayment-amount-text-failure"
              >
                {transactionData.amount} VND
              </Typography>
              <Typography
                variant="body2"
                className="checkoutPayment-amount-label"
              >
                Số tiền nạp
              </Typography>
            </Box>

            <Box className="checkoutPayment-details-box">
              <Box className="checkoutPayment-detail-row">
                <Typography className="checkoutPayment-detail-label">
                  Loại giao dịch
                </Typography>
                <Typography className="checkoutPayment-detail-value">
                  {transactionData.transactionType}
                </Typography>
              </Box>

              <Divider className="checkoutPayment-divider" />

              <Box className="checkoutPayment-detail-row">
                <Typography className="checkoutPayment-detail-label">
                  Mã giao dịch
                </Typography>
                <Typography className="checkoutPayment-detail-value checkoutPayment-detail-value-monospace">
                  {transactionData.transactionId}
                </Typography>
              </Box>

              <Divider className="checkoutPayment-divider" />

              <Box className="checkoutPayment-detail-row">
                <Typography className="checkoutPayment-detail-label">
                  Ngày giao dịch
                </Typography>
                <Typography className="checkoutPayment-detail-value">
                  {transactionData.date}
                </Typography>
              </Box>

              <Divider className="checkoutPayment-divider" />

              <Box className="checkoutPayment-detail-row">
                <Typography className="checkoutPayment-detail-label">
                  Thời gian
                </Typography>
                <Typography className="checkoutPayment-detail-value">
                  {transactionData.time}
                </Typography>
              </Box>

              <Divider className="checkoutPayment-divider" />

              <Box className="checkoutPayment-detail-row">
                <Typography className="checkoutPayment-detail-label">
                  Phương thức thanh toán
                </Typography>
                <Typography className="checkoutPayment-detail-value">
                  {transactionData.method}
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{ mt: 5, display: "flex", flexDirection: "row", gap: 2.5 }}
            >
              <Button
                variant="contained"
                fullWidth
                startIcon={<MdRefresh />}
                className="checkoutPayment-button checkoutPayment-button-failure"
                onClick={() => navigate(getWalletRoute())}
              >
                Thử nạp lại
              </Button>

              <Button
                variant="text"
                fullWidth
                startIcon={<FaHome />}
                className="checkoutPayment-button checkoutPayment-button-text"
                onClick={() => navigate(getHomeRoute())}
              >
                Về trang chủ
              </Button>
            </Box>

            <Box className="checkoutPayment-suggestions-box">
              <Typography
                variant="subtitle2"
                className="checkoutPayment-suggestions-title"
              >
                Gợi ý khắc phục:
              </Typography>
              <Box component="ul" className="checkoutPayment-suggestions-list">
                <Typography
                  component="li"
                  variant="body2"
                  className="checkoutPayment-suggestions-item"
                >
                  Kiểm tra số dư tài khoản ngân hàng của bạn
                </Typography>
                <Typography
                  component="li"
                  variant="body2"
                  className="checkoutPayment-suggestions-item"
                >
                  Đảm bảo thẻ ngân hàng của bạn được kích hoạt cho thanh toán trực tuyến
                </Typography>
                <Typography
                  component="li"
                  variant="body2"
                  className="checkoutPayment-suggestions-item"
                >
                  Thử sử dụng phương thức thanh toán khác
                </Typography>
                <Typography
                  component="li"
                  variant="body2"
                  className="checkoutPayment-suggestions-item"
                >
                  Liên hệ ngân hàng hoặc bộ phận hỗ trợ nếu vấn đề vẫn tiếp diễn
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
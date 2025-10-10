import { Box, Container, Typography, Button, Paper, Divider } from "@mui/material";
import { FaCheckCircle, FaHome, FaReceipt } from "react-icons/fa";
import { MdAccountBalanceWallet } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import "./CheckoutPayment.css";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const transactionData = {
    amount: "500,000",
    transactionId: "WLT20250109123456",
    date: "01/09/2025",
    time: "14:30:25",
    method: "Bank Card",
    accountNumber: "**** **** **** 4532",
    transactionType: "Wallet Top-Up",
    walletBalance: "1,250,000",
  };

  return (
    <Box className="checkoutPayment-container checkoutPayment-success-container">
      <Container maxWidth="md" style={{ position: "relative", zIndex: 1 }}>
        <Paper className="checkoutPayment-paper">
          <Box className="checkoutPayment-header checkoutPayment-success-header">
            <Box className="checkoutPayment-icon-circle checkoutPayment-icon-circle-success">
              <FaCheckCircle
                size={64}
                color="#ffffff"
                style={{ position: "relative", zIndex: 1 }}
              />
            </Box>
            <Typography variant="h4" className="checkoutPayment-title">
              Payment Successful!
            </Typography>
            <Typography variant="body1" className="checkoutPayment-subtitle">
              Your wallet balance has been updated
            </Typography>
          </Box>

          <Box sx={{ p: 6 }}>
            <Box className="checkoutPayment-amount-box checkoutPayment-amount-box-success">
              <Typography variant="h3" className="checkoutPayment-amount-text">
                {transactionData.amount} VND
              </Typography>
              <Typography
                variant="body2"
                className="checkoutPayment-amount-label"
              >
                Top-Up Amount
              </Typography>
            </Box>

            <Box className="checkoutPayment-details-box">
              <Box className="checkoutPayment-detail-row">
                <Typography className="checkoutPayment-detail-label">
                  Current Wallet Balance
                </Typography>
                <Box className="checkoutPayment-wallet-balance">
                  <MdAccountBalanceWallet size={24} color="#22c55e" />
                  <Typography className="checkoutPayment-wallet-balance-text">
                    {transactionData.walletBalance} VND
                  </Typography>
                </Box>
              </Box>

              <Divider className="checkoutPayment-divider" />

              <Box className="checkoutPayment-detail-row">
                <Typography className="checkoutPayment-detail-label">
                  Transaction Type
                </Typography>
                <Typography className="checkoutPayment-detail-value">
                  {transactionData.transactionType}
                </Typography>
              </Box>

              <Divider className="checkoutPayment-divider" />

              <Box className="checkoutPayment-detail-row">
                <Typography className="checkoutPayment-detail-label">
                  Transaction ID
                </Typography>
                <Typography className="checkoutPayment-detail-value checkoutPayment-detail-value-monospace">
                  {transactionData.transactionId}
                </Typography>
              </Box>

              <Divider className="checkoutPayment-divider" />

              <Box className="checkoutPayment-detail-row">
                <Typography className="checkoutPayment-detail-label">
                  Transaction Date
                </Typography>
                <Typography className="checkoutPayment-detail-value">
                  {transactionData.date}
                </Typography>
              </Box>

              <Divider className="checkoutPayment-divider" />

              <Box className="checkoutPayment-detail-row">
                <Typography className="checkoutPayment-detail-label">
                  Time
                </Typography>
                <Typography className="checkoutPayment-detail-value">
                  {transactionData.time}
                </Typography>
              </Box>

              <Divider className="checkoutPayment-divider" />

              <Box className="checkoutPayment-detail-row">
                <Typography className="checkoutPayment-detail-label">
                  Payment Method
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
                variant="text"
                fullWidth
                startIcon={<FaHome />}
                className="checkoutPayment-button checkoutPayment-button-text"
                onClick={() => navigate("/")}
              >
                Về trang chủ
              </Button>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<FaReceipt />}
                className="checkoutPayment-button checkoutPayment-button-outlined checkoutPayment-button-outlined-success"
                onClick={() => navigate("/transaction_history")}
              >
                Xem lịch sử giao dịch
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
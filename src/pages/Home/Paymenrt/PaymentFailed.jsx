"use client"

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
import "./CheckoutPayment.css";

export default function PaymentFailure() {
  const transactionData = {
    amount: "500,000",
    transactionId: "WLT20250109123456",
    date: "01/09/2025",
    time: "14:30:25",
    method: "Bank Card",
    accountNumber: "**** **** **** 4532",
    transactionType: "Wallet Top-Up",
    errorCode: "ERR_PAYMENT_DECLINED",
    errorMessage: "Transaction declined by the bank",
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
              Payment Failed
            </Typography>
            <Typography variant="body1" className="checkoutPayment-subtitle">
              Sorry, we couldn't complete the top-up transaction
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
                Error Code: {transactionData.errorCode}
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
                Top-Up Amount
              </Typography>
            </Box>

            <Box className="checkoutPayment-details-box">
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
                variant="contained"
                fullWidth
                startIcon={<MdRefresh />}
                className="checkoutPayment-button checkoutPayment-button-failure"
              >
                Try Top-Up Again
              </Button>

              <Button
                variant="text"
                fullWidth
                startIcon={<FaHome />}
                className="checkoutPayment-button checkoutPayment-button-text"
              >
                Back to Home
              </Button>
            </Box>

            <Box className="checkoutPayment-suggestions-box">
              <Typography
                variant="subtitle2"
                className="checkoutPayment-suggestions-title"
              >
                Troubleshooting Suggestions:
              </Typography>
              <Box component="ul" className="checkoutPayment-suggestions-list">
                <Typography
                  component="li"
                  variant="body2"
                  className="checkoutPayment-suggestions-item"
                >
                  Check your bank account balance
                </Typography>
                <Typography
                  component="li"
                  variant="body2"
                  className="checkoutPayment-suggestions-item"
                >
                  Ensure your bank card is enabled for online payments
                </Typography>
                <Typography
                  component="li"
                  variant="body2"
                  className="checkoutPayment-suggestions-item"
                >
                  Try using a different payment method
                </Typography>
                <Typography
                  component="li"
                  variant="body2"
                  className="checkoutPayment-suggestions-item"
                >
                  Contact your bank or support if the issue persists
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
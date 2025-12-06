import { Box, Container, Typography, Button, Paper, Divider } from "@mui/material";
import { FaCheckCircle, FaHome, FaReceipt } from "react-icons/fa";
import { MdAccountBalanceWallet } from "react-icons/md";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { getUserRole } from "../../../utils/authUtils";
import { PATH } from "../../../routes/path";
import "./CheckoutPayment.css";
import { useDispatch } from "react-redux";
import { getTransactionHistoryBusinessApiDetail } from "../../../store/slices/walletSlice";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [transactionDetail, setTransactionDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatCurrency = useMemo(() => (value) => {
    if (value === null || value === undefined) return "0";
    const num = typeof value === "number" ? value : parseFloat(value);
    if (Number.isNaN(num)) return "0";
    return num.toLocaleString("vi-VN");
  }, []);

  // No localStorage usage; rely solely on API detail by id from URL

  useEffect(() => {
    // Try multiple possible param keys coming back from BE/VNPay
    const possibleKeys = ["id", "transactionId", "txnId", "txnRef", "vnp_TxnRef"];
    const foundId = possibleKeys.map((k) => searchParams.get(k)).find(Boolean);
    if (!foundId) return;

    setLoading(true);
    setError(null);
    dispatch(getTransactionHistoryBusinessApiDetail({ id: foundId }))
      .unwrap()
      .then((res) => {
        setTransactionDetail(res?.data || null);
      })
      .catch((e) => {
        setError(
          typeof e === "string"
            ? e
            : e?.message || "Unable to load transaction details"
        );
      })
      .finally(() => setLoading(false));
  }, [dispatch, searchParams]);

  const resolveMethodLabel = () => {
    const raw =
      transactionDetail?.paymentMethod ||
      transactionDetail?.referenceType ||
      transactionDetail?.provider;

    if (!raw) return undefined;

    const lower = String(raw).toLowerCase();
    if (lower === "vnpay") return "VNPay";
    if (lower === "momo") return "MoMo";
    if (lower === "manual") return "Manual";
    return raw;
  };

  const transactionData = {
    amount: transactionDetail?.amount,
    transactionId: transactionDetail?._id,
    date: transactionDetail?.createdAt
      ? new Date(transactionDetail.createdAt).toLocaleDateString("vi-VN")
      : undefined,
    time: transactionDetail?.createdAt
      ? new Date(transactionDetail.createdAt).toLocaleTimeString("vi-VN")
      : undefined,
    method: resolveMethodLabel(),
    transactionType: transactionDetail?.transactionType,
    status: transactionDetail?.status,
    direction: transactionDetail?.direction,
  };

  const getWalletRoute = () => {
    const userRole = getUserRole();
    if (userRole === "business") {
      return PATH.BUSINESS_WALLET_ACTIONS;
    }
    return PATH.WALLET_CUSTOMER;
  };


  const getHomeRoute = () => {
    const userRole = getUserRole();
    console.log("Home route for role:", userRole); 
    
    if (userRole === "business") {
      return "/business";
    }
    return "/";
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
            {loading && (
              <Typography variant="body2" sx={{ mb: 2 }}>
                Loading transaction details...
              </Typography>
            )}
            {error && (
              <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}
            <Box className="checkoutPayment-amount-box checkoutPayment-amount-box-success">
              <Typography variant="h3" className="checkoutPayment-amount-text">
                {formatCurrency(transactionData.amount)} VND
              </Typography>
              <Typography
                variant="body2"
                className="checkoutPayment-amount-label"
              >
                Top-Up Amount
              </Typography>
            </Box>

            {transactionDetail && (
              <Box className="checkoutPayment-details-box">
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
                    Transaction Type
                  </Typography>
                  <Typography className="checkoutPayment-detail-value">
                    {transactionData.transactionType}
                  </Typography>
                </Box>

                <Divider className="checkoutPayment-divider" />

                <Box className="checkoutPayment-detail-row">
                  <Typography className="checkoutPayment-detail-label">
                    Direction
                  </Typography>
                  <Typography className="checkoutPayment-detail-value">
                    {transactionData.direction}
                  </Typography>
                </Box>

                <Divider className="checkoutPayment-divider" />

                <Box className="checkoutPayment-detail-row">
                  <Typography className="checkoutPayment-detail-label">
                    Status
                  </Typography>
                  <Typography className="checkoutPayment-detail-value">
                    {transactionData.status}
                  </Typography>
                </Box>

                <Divider className="checkoutPayment-divider" />

                <Box className="checkoutPayment-detail-row">
                  <Typography className="checkoutPayment-detail-label">
                    Transaction Date
                  </Typography>
                  <Typography className="checkoutPayment-detail-value">
                    {transactionData.date} {transactionData.time}
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
            )}

            <Box
              sx={{ mt: 5, display: "flex", flexDirection: "row", gap: 2.5 }}
            >
              <Button
                variant="text"
                fullWidth
                startIcon={<FaHome />}
                className="checkoutPayment-button checkoutPayment-button-text"
                onClick={() => navigate(getHomeRoute())}
              >
                Back to Home
              </Button>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<FaReceipt />}
                className="checkoutPayment-button checkoutPayment-button-outlined checkoutPayment-button-outlined-success"
                onClick={() => navigate(getWalletRoute())}
              >
                View Transaction History
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
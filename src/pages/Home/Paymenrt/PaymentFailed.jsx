import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Divider,
  Alert,
} from "@mui/material";
import { MdError } from "react-icons/md";
import { FaRedo, FaReceipt } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserRole } from "../../../utils/authUtils";
import "./CheckoutPayment.css";
import { useDispatch } from "react-redux";
import { getTransactionHistoryBusinessApiDetail } from "../../../store/slices/walletSlice";

export default function PaymentFailure() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  
  const pendingTxnRef = localStorage.getItem("pendingTxnRef");
  const txnRef = searchParams.get("txnRef") || pendingTxnRef;

  useEffect(() => {
    if (!txnRef) {
      setLoading(false);
      return;
    }
    dispatch(getTransactionHistoryBusinessApiDetail({ id: txnRef }))
      .unwrap()
      .then((res) => setDetail(res?.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [dispatch, txnRef]);

  const format = (v) => (v ? Number(v).toLocaleString("vi-VN") : "0");
  const date = detail?.createdAt ? new Date(detail.createdAt).toLocaleDateString("vi-VN") : "";
  const time = detail?.createdAt ? new Date(detail.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : "";

  const wallet = getUserRole() === "business" ? "/business/wallet" : "/walllet_customer";
  const code = searchParams.get("code") || "24";

  return (
    <Box className="checkoutPayment-container checkoutPayment-failure-container">
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper elevation={10} sx={{ borderRadius: 3, overflow: "hidden" }}>
          {/* HEADER */}
          <Box sx={{ bgcolor: "#d32f2f", color: "white", p: 4, textAlign: "center" }}>
            <MdError size={60} />
            <Typography variant="h4" sx={{ mt: 2, fontWeight: 600 }}>
              Thanh toán thất bại
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>
              Mã lỗi: {code} - {code === "24" ? "Bạn đã hủy giao dịch" : "Lỗi không xác định"}
            </Typography>
          </Box>

          <Box sx={{ p: 5 }}>
            {loading && (
              <Typography textAlign="center" color="text.secondary">
                Đang tải chi tiết...
              </Typography>
            )}

            {detail && (
              <>
                <Box sx={{ textAlign: "center", mb: 4 }}>
                  <Typography variant="h3" color="#d32f2f" fontWeight={600}>
                    {format(detail.amount)} VND
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Số tiền nạp
                  </Typography>
                </Box>

                <Box sx={{ bgcolor: "#fafafa", borderRadius: 2, p: 3 }}>
                  <Typography variant="body2" fontWeight="bold" gutterBottom>
                    Chi tiết giao dịch
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ "& > div": { display: "flex", justifyContent: "space-between", py: 1 } }}>
                    <div><strong>Mã GD:</strong> <code>{detail._id}</code></div>
                    <div><strong>Phương thức:</strong> VNPay</div>
                    <div><strong>Thời gian:</strong> {date} {time}</div>
                    <div><strong>Trạng thái:</strong> <span style={{color: "#d32f2f"}}>Thất bại</span></div>
                  </Box>
                </Box>
              </>
            )}

            <Box sx={{ mt: 5, display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                color="error"
                fullWidth
                startIcon={<FaRedo />}
                onClick={() => navigate(wallet)}
              >
                Thử nạp lại
              </Button>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<FaReceipt />}
                onClick={() => navigate(wallet)}
              >
                Xem lịch sử
              </Button>
            </Box>

            <Alert severity="warning" sx={{ mt: 3 }}>
              <strong>Gợi ý:</strong> Kiểm tra số dư, bật 3D Secure, hoặc thử thẻ khác.
            </Alert>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
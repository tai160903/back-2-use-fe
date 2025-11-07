import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography, Chip, Divider, Button } from "@mui/material";
import "./ModalTransactionDetail.css";
import { FiCheckCircle, FiClock, FiXCircle, FiArrowDownLeft, FiArrowUpRight, FiRotateCcw } from "react-icons/fi";

export default function ModalTransactionDetail({ open, onClose, transaction, loading }) {
  const getStatusColor = (status) => {
    if (!status) return "default";
    const normalized = String(status).toLowerCase();
    if (normalized === "completed" || normalized === "success") return "success";
    if (normalized === "processing" || normalized === "pending") return "warning";
    if (["failed", "faild", "rejected", "canceled", "cancelled", "error"].includes(normalized)) return "error";
    return "default";
  };

  const getStatusTheme = (status) => {
    const statusColor = getStatusColor(status);
    switch (statusColor) {
      case "success":
        return { bg: "linear-gradient(180deg, #16a34a, #22c55e)", fg: "#ffffff", softBg: "#e6f4ea", softBorder: "#22c55e", Icon: FiCheckCircle, title: "Payment Successful!", subtitle: "Your wallet balance has been updated" };
      case "warning":
        return { bg: "linear-gradient(180deg, #f59e0b, #fbbf24)", fg: "#1f2937", softBg: "#fff4e5", softBorder: "#f59e0b", Icon: FiClock, title: "Payment Pending", subtitle: "Your transaction is being processed" };
      case "error":
        return { bg: "linear-gradient(180deg, #ef4444, #f87171)", fg: "#ffffff", softBg: "#fde7e7", softBorder: "#ef4444", Icon: FiXCircle, title: "Payment Failed", subtitle: "Your wallet balance was not changed" };
      default:
        return { bg: "#f5f5f5", fg: "#212121", softBg: "#f5f5f5", softBorder: "#9e9e9e", Icon: FiClock, title: "Transaction", subtitle: "Transaction details" };
    }
  };

  const getTypeIcon = (type) => {
    const normalizedType = String(type || "").toLowerCase();
    if (["deposit", "top_up", "topup"].includes(normalizedType)) return FiArrowDownLeft;
    if (["withdraw", "withdrawal"].includes(normalizedType)) return FiArrowUpRight;
    if (["refund"].includes(normalizedType)) return FiRotateCcw;
    return FiClock;
  };

  const isWithdrawType = (type) => {
    const normalizedType = String(type || "").toLowerCase();
    return ["withdraw", "withdrawal"].includes(normalizedType);
  };

  const getTheme = (status, type) => {
    const baseTheme = getStatusTheme(status);
    if (isWithdrawType(type)) {
      return { ...baseTheme, bg: "linear-gradient(180deg, #ef4444, #f87171)", fg: "#ffffff", softBg: "#fde7e7", softBorder: "#ef4444" };
    }
    return baseTheme;
  };

  const formatDateTime = (iso) => {
    try {
      return new Date(iso).toLocaleString("vi-VN");
    } catch {
      return iso || "";
    }
  };

  const absAmountStr = (amount) => {
    if (amount == null) return "";
    return `${Math.abs(Number(amount)).toLocaleString("vi-VN")} VNĐ`;
  };



  const labelValue = (label, value, rowClassName = "") => (
    <Box className={rowClassName} sx={{ display: "flex", justifyContent: "space-between", py: 0.5 }}>
      <Typography variant="body2" sx={{ color: "#616161" }}>{label}</Typography>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>{value ?? "-"}</Typography>
    </Box>
  );

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ className: "transactionDetailHistory" }}>
      <DialogTitle sx={{ p: 0 }}>
        {(() => {
          const theme = getTheme(transaction?.status, transaction?.transactionType);
          const StatusIcon = theme.Icon;
          return (
            <Box className="transactionDetailHistory__header" sx={{
              px: 3,
              py: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: 1,
              background: theme.bg,
              color: theme.fg,
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
            }}>
              <StatusIcon size={32} />
              <Typography variant="h5" sx={{ fontWeight: 900 }}>
                {(transaction?.transactionType)}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {theme.subtitle}
              </Typography>
            </Box>
          );
        })()}
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        {loading ? (
          <Box sx={{ p: 3 }}>
            <Typography>Loading details...</Typography>
          </Box>
        ) : (
          <Box sx={{ p: 3 }}>
            <Box sx={{
              border: "1px solid #eee",
              borderRadius: 2,
              boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
              overflow: "hidden",
              backgroundColor: "#fff",
            }}>
              <Box className="transactionDetailHistory__amount-card" sx={{ px: 3, py: 2.5, borderBottom: "1px dashed #e0e0e0" }}>
                {(() => {
                  const theme = getTheme(transaction?.status, transaction?.transactionType);
                  const TypeIcon = getTypeIcon(transaction?.transactionType);
                  const isNegative = (transaction?.direction === "out" || ["failed","faild","rejected","canceled","cancelled","error"].includes(String(transaction?.status).toLowerCase()));
                  return (
                    <Box sx={{
                      p: 2.5,
                      borderRadius: 2,
                      border: `2px solid ${theme.softBorder}`,
                      background: "linear-gradient(180deg, #ffffff, #f8fafb)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      gap: 0.5,
                    }}>
                      <Typography variant="h3" sx={{ fontWeight: 900, color: isNegative ? "#d32f2f" : "#22c55e" }}>
                        {absAmountStr(transaction?.amount)}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, color: "#6b7280" }}>
                        <TypeIcon size={16} />
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          {(transaction?.transactionType)} Amount
                        </Typography>
                      </Box>
                    </Box>
                  );
                })()}
                <Box className="transactionDetailHistory__time-row" sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                  <Typography variant="overline" sx={{ color: "#9e9e9e" }}>Time</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {formatDateTime(transaction?.createdAt)}
                  </Typography>
                </Box>
              </Box>

              <Box className="transactionDetailHistory__content" sx={{ px: 3, py: 2.5 }}>
                <Box className="transactionDetailHistory__description" sx={{ mb: 1.5 }}>
                  <Typography variant="overline" sx={{ color: "#9e9e9e" }}>Description</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {transaction?.description || "-"}
                  </Typography>
                </Box>

                <Divider sx={{ my: 1.5, borderStyle: "dashed" }} />

                <Box className="transactionDetailHistory__table" sx={{ display: "flex", flexDirection: "column" }}>
                  {labelValue("Transaction ID", transaction?._id, "transactionDetailHistory__row")}
                  <Divider sx={{ my: 1, borderStyle: "dashed" }} />
                  {labelValue("Transaction Type", (transaction?.transactionType), "transactionDetailHistory__row")}
                  <Divider sx={{ my: 1, borderStyle: "dashed" }} />
                  {labelValue("Direction", transaction?.direction, "transactionDetailHistory__row")}
                  <Divider sx={{ my: 1, borderStyle: "dashed" }} />
                  {labelValue("Status", transaction?.status, "transactionDetailHistory__row")}
                  <Divider sx={{ my: 1, borderStyle: "dashed" }} />
                  {labelValue("Transaction Date", formatDateTime(transaction?.createdAt), "transactionDetailHistory__row")}
                  <Divider sx={{ my: 1, borderStyle: "dashed" }} />
                  {labelValue("Payment Method", (transaction?.referenceType), "transactionDetailHistory__row")}
                </Box>
              </Box>

              <Box className="transactionDetailHistory__footer" sx={{ px: 3, py: 1.5, background: "#fafafa", borderTop: "1px dashed #e0e0e0" }}>
                <Typography variant="caption" sx={{ color: "#9e9e9e" }}>This is an electronic receipt; no signature required.</Typography>
              </Box>
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="contained">Close</Button>
      </DialogActions>
    </Dialog>
  );
}



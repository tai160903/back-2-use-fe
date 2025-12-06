import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography, Chip, Divider, Button } from "@mui/material";
import "./ModalTransactionDetail.css";
import { FiCheckCircle, FiClock, FiXCircle, FiArrowDownLeft, FiArrowUpRight, FiRotateCcw } from "react-icons/fi";

export default function ModalTransactionDetail({ open, onClose, transaction, loading }) {
  // Map transaction type to professional terminology
  const getTransactionTypeLabel = (transactionType) => {
    const typeMap = {
      'top_up': 'Deposit',
      'deposit': 'Deposit',
      'withdrawal': 'Withdraw',
      'withdraw': 'Withdraw',
      'borrow': 'Borrow',
      'borrow_deposit': 'Borrow Deposit',
      'return': 'Return',
      'return_refund': 'Return Refund',
      'penalty': 'Penalty',
      'refund': 'Refund',
    };
    return typeMap[String(transactionType).toLowerCase()] || transactionType;
  };

  // Format payment method to display
  const formatPaymentMethod = (paymentMethod) => {
    if (!paymentMethod) return null;
    const methodMap = {
      'momo': 'MoMo',
      'vnpay': 'VNPay',
      'bank': 'Bank Account',
      'bank_account': 'Bank Account',
      'manual': 'Manual',
      'cash': 'Cash',
    };
    return methodMap[String(paymentMethod).toLowerCase()] || paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1);
  };

  // Format direction to professional terminology
  const formatDirection = (direction) => {
    if (!direction) return "-";
    const dirMap = {
      'in': 'Money In',
      'out': 'Money Out',
    };
    return dirMap[String(direction).toLowerCase()] || direction;
  };

  // Format reference type
  const formatReferenceType = (referenceType) => {
    if (!referenceType) return "-";
    return referenceType.charAt(0).toUpperCase() + referenceType.slice(1);
  };

  // Format balance type
  const formatBalanceType = (balanceType) => {
    if (!balanceType) return "-";
    return balanceType.charAt(0).toUpperCase() + balanceType.slice(1);
  };

  // Format status
  const formatStatus = (status) => {
    if (!status) return "-";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

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

  const getTheme = (status, type, direction) => {
    const baseTheme = getStatusTheme(status);
    
    // Override color based on direction
    if (direction === "out") {
      return { 
        ...baseTheme, 
        bg: "linear-gradient(180deg, #ef4444, #f87171)", 
        fg: "#ffffff", 
        softBg: "#fde7e7", 
        softBorder: "#ef4444",
        Icon: FiArrowUpRight
      };
    }
    
    if (direction === "in") {
      return { 
        ...baseTheme, 
        bg: "linear-gradient(180deg, #16a34a, #22c55e)", 
        fg: "#ffffff", 
        softBg: "#e6f4ea", 
        softBorder: "#22c55e",
        Icon: FiArrowDownLeft
      };
    }
    
    // Fallback to original logic if direction is not specified
    if (isWithdrawType(type)) {
      return { ...baseTheme, bg: "linear-gradient(180deg, #ef4444, #f87171)", fg: "#ffffff", softBg: "#fde7e7", softBorder: "#ef4444" };
    }
    return baseTheme;
  };

  const formatDateTime = (iso) => {
    try {
      const date = new Date(iso);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch {
      return iso || "";
    }
  };

  const formatAmount = (amount, direction) => {
    if (amount == null) return "-";
    const sign = direction === "in" ? "+" : "-";
    return `${sign}${Math.abs(Number(amount)).toLocaleString("en-US").replace(/,/g, ".")} VND`;
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
          const theme = getTheme(transaction?.status, transaction?.transactionType, transaction?.direction);
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
                {getTransactionTypeLabel(transaction?.transactionType)}
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
                  const theme = getTheme(transaction?.status, transaction?.transactionType, transaction?.direction);
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
                        {formatAmount(transaction?.amount, transaction?.direction)}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, color: "#6b7280" }}>
                        <TypeIcon size={16} />
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          {getTransactionTypeLabel(transaction?.transactionType)} Amount
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
                {/* Payment Method - Prominent Display */}
                {transaction?.paymentMethod && (
                  <Box sx={{ mb: 2, display: "flex", flexDirection: "column", gap: 1 }}>
                    <Typography variant="overline" sx={{ color: "#9e9e9e", fontSize: "11px" }}>Payment Method</Typography>
                    <Chip
                      label={formatPaymentMethod(transaction.paymentMethod)}
                      sx={{
                        height: "40px",
                        fontSize: "16px",
                        fontWeight: 700,
                        backgroundColor: "#1976d2",
                        color: "#ffffff",
                        width: "fit-content",
                        "&:hover": {
                          backgroundColor: "#1565c0",
                        },
                      }}
                    />
                  </Box>
                )}

                <Box className="transactionDetailHistory__description" sx={{ mb: 1.5 }}>
                  <Typography variant="overline" sx={{ color: "#9e9e9e", fontSize: "11px" }}>Description</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500, fontSize: "13px" }}>
                    {transaction?.description || "-"}
                  </Typography>
                </Box>

                <Divider sx={{ my: 1.5, borderStyle: "dashed" }} />

                <Box className="transactionDetailHistory__table" sx={{ display: "flex", flexDirection: "column" }}>
                  {/* {labelValue("Transaction ID", transaction?._id, "transactionDetailHistory__row")}
                  <Divider sx={{ my: 1, borderStyle: "dashed" }} /> */}
                  {labelValue("Transaction Type", getTransactionTypeLabel(transaction?.transactionType), "transactionDetailHistory__row")}
                  <Divider sx={{ my: 1, borderStyle: "dashed" }} />
                  {labelValue("Direction", formatDirection(transaction?.direction), "transactionDetailHistory__row")}
                  <Divider sx={{ my: 1, borderStyle: "dashed" }} />
                  {labelValue("Status", formatStatus(transaction?.status), "transactionDetailHistory__row")}
                  {/* <Divider sx={{ my: 1, borderStyle: "dashed" }} />
                  {labelValue("Amount", formatAmount(transaction?.amount, transaction?.direction), "transactionDetailHistory__row")} */}
                  <Divider sx={{ my: 1, borderStyle: "dashed" }} />
                  {labelValue("Reference Type", formatReferenceType(transaction?.referenceType), "transactionDetailHistory__row")}
                  <Divider sx={{ my: 1, borderStyle: "dashed" }} />
                  {labelValue("Balance Type", formatBalanceType(transaction?.balanceType), "transactionDetailHistory__row")}
                  {transaction?.toBalanceType && (
                    <>
                      <Divider sx={{ my: 1, borderStyle: "dashed" }} />
                      {labelValue("To Balance Type", formatBalanceType(transaction?.toBalanceType), "transactionDetailHistory__row")}
                    </>
                  )}
                
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



import Typography from "@mui/material/Typography";
import { MdAttachMoney } from "react-icons/md";
import { Tabs, Tab, Box, Chip } from "@mui/material";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUserInfo } from "../../../hooks/useUserInfo";
import { getTransactionHistoryApi } from "../../../store/slices/walletSlice";
import { FiArrowDownLeft, FiArrowUpRight } from "react-icons/fi";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import TabPanelRecent from "../../../components/TabPanelRecent/TabPanelRecent";

export default function WalletHistoryOnly() {
  const dispatch = useDispatch();
  const { walletId } = useUserInfo();

  const { transactionHistory, transactionTotalPages, isLoading: transactionLoading } = useSelector((state) => state.wallet);

  const [value, setValue] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [direction, setDirection] = useState("all");
  const limit = 3;

  const getStatusColor = (status) => {
    if (!status) return "default";
    const normalized = String(status).toLowerCase();
    if (normalized === "completed" || normalized === "success") return "success";
    if (normalized === "processing" || normalized === "pending") return "warning";
    if (["failed", "faild", "rejected", "canceled", "cancelled", "error"].includes(normalized)) return "error";
    return "default";
  };

  const handleChange = (event, newValue) => setValue(newValue);
  const handleDirectionChange = (newDirection) => { setDirection(newDirection); setCurrentPage(1); };
  const handlePageChange = (event, newPage) => setCurrentPage(newPage);

  useEffect(() => {
    if (walletId) {
      dispatch(getTransactionHistoryApi({ page: currentPage, limit, typeGroup: "personal", direction, walletType: "customer" }));
    }
  }, [dispatch, walletId, currentPage, limit, direction]);

  const formatTransactionData = (transactions) => {
    return transactions.map((transaction) => ({
      id: transaction._id,
      date: new Date(transaction.createdAt).toLocaleDateString('vi-VN'),
      type: transaction.transactionType === 'deposit' ? 'VNPay' : 'Bank Account',
      description: transaction.description,
      amount: transaction.direction === 'in' 
        ? `+${transaction.amount.toLocaleString('vi-VN')} VNĐ`
        : `-${transaction.amount.toLocaleString('vi-VN')} VNĐ`,
      status: transaction.status,
      direction: transaction.direction,
      transactionType: transaction.transactionType,
    }));
  };

  const realTransactionData = transactionHistory ? formatTransactionData(transactionHistory) : [];

  const getFilteredData = (data) => data;

  return (
    <div className="recentTransaction">
      <div className="recentTransaction-container">
        <Typography className="recentTransaction-title">
          <MdAttachMoney className="mr-2 size-8" /> Recent Transactions
        </Typography>
        <div className="recentTransaction-tabs">
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="recent transactions tabs"
            sx={{
              "& .MuiTabs-indicator": { backgroundColor: "transparent" },
              "& .MuiTab-root": {
                backgroundColor: "transparent",
                color: "#000000",
                textTransform: "none",
                fontSize: "16px",
                minWidth: "150px",
                borderRadius: "8px",
                "&.Mui-selected": { backgroundColor: "#2E7D32", color: "#FFFFFF" },
                width: "50%",
              },
            }}
          >
            <Tab label="Subscriptions & Withdrawals" />
            <Tab label="Deposits & Refunds" />
          </Tabs>
          <TabPanelRecent value={value} index={0}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2, justifyContent: "flex-end" }}>
              <Chip label="All" color={direction === "all" ? "primary" : "default"} onClick={() => handleDirectionChange("all")} sx={{ mr: 1, cursor: "pointer" }} />
              <Chip label="Money In" color={direction === "in" ? "success" : "default"} onClick={() => handleDirectionChange("in")} sx={{ mr: 1, cursor: "pointer" }} />
              <Chip label="Money Out" color={direction === "out" ? "error" : "default"} onClick={() => handleDirectionChange("out")} sx={{ cursor: "pointer" }} />
            </Box>
            {transactionLoading ? (
              <div style={{ textAlign: "center", padding: "20px" }}>
                <Typography>Loading transactions...</Typography>
              </div>
            ) : (
              <>
                {getFilteredData(realTransactionData).length === 0 ? (
                  <div style={{ textAlign: "center", padding: 20 }}>
                    <Typography>No transactions found.</Typography>
                  </div>
                ) : getFilteredData(realTransactionData).map((item) => (
                  <Box
                    key={item.id}
                    sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2, mb: 1, border: "1px solid #e0e0e0", borderRadius: "8px", backgroundColor: item.status === "completed" ? "#f5f5f5" : "#fff" }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Box sx={{ width: 36, height: 36, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: item.direction === "out" ? "#fde7e7" : "#e7f5ed", color: item.direction === "out" ? "#d32f2f" : "#2e7d32" }}>
                        {item.direction === "out" ? <FiArrowUpRight size={18} /> : <FiArrowDownLeft size={18} />}
                      </Box>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>{item.description}</Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Typography variant="caption" color="textSecondary">{item.date} {item.type}</Typography>
                          <Chip size="small" label={item.status} color={getStatusColor(item.status)} />
                        </Box>
                        <Typography variant="caption" color="textSecondary">ID: {item.id}</Typography>
                      </Box>
                    </Box>
                    <Typography variant="body1" color={item.direction === "out" ? "error" : "success"} sx={{ fontWeight: "bold", color: item.direction === "out" ? "#d32f2f" : "#2e7d32" }}>
                      {item.amount}
                    </Typography>
                  </Box>
                ))}

                {transactionTotalPages > 1 && (
                  <Stack spacing={2} className="mt-4" sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Pagination count={transactionTotalPages} page={currentPage} onChange={handlePageChange} variant="outlined" shape="rounded" />
                  </Stack>
                )}
              </>
            )}
          </TabPanelRecent>
          <TabPanelRecent value={value} index={1}>
            <Typography variant="body2" sx={{ color: "#666" }}>No local deposit/refund sample data in this view.</Typography>
          </TabPanelRecent>
        </div>
      </div>
    </div>
  );
}



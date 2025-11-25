
import Typography from "@mui/material/Typography";
import "../../Home/WalletCustomer/WalletCustomer.css";
import { LuWallet } from "react-icons/lu";
import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa";
import { useState, useEffect } from "react";

import { MdAttachMoney } from "react-icons/md";
import { FiArrowDownLeft, FiArrowUpRight } from "react-icons/fi";
import { Tabs, Tab, Box, Chip, Button } from "@mui/material";

import toast from "react-hot-toast";
import { useUserInfo } from "../../../hooks/useUserInfo";
import useDeposit from "../../../hooks/useDeposit";
import useWithdraw from "../../../hooks/useWithdraw";
import TabPanelRecent from "../../../components/TabPanelRecent/TabPanelRecent";
import ModalWallet from "../../../components/ModalWallet/ModalWallet";
import ModalTransactionDetail from "../../../components/ModalTransactionDetail/ModalTransactionDetail";
import { useDispatch, useSelector } from "react-redux";
import { getTransactionHistoryApi, getTransactionHistoryBusinessApiDetail } from "../../../store/slices/walletSlice";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

export default function WalletBusiness() {
  const dispatch = useDispatch();
  const { walletId, balance, availableBalance, holdingBalance, isLoading: profileLoading } = useUserInfo();
  
  // Redux state for transaction history
  const { 
    transactionHistory, 
    transactionTotalPages, 

    isLoading: transactionLoading 
  } = useSelector((state) => state.wallet);

  // hook
  const {
    addAmount,
    setAddAmount,
    handleDeposit,
    depositLoading,
    depositError,
    resetDeposit,
    paymentMethod,
    setPaymentMethod,
  } = useDeposit(walletId);

  const {
    withdrawAmount,
    setWithdrawAmount,
    handleWithdraw,
    withdrawLoading,
    withdrawError,
    resetWithdraw,
  } = useWithdraw();

  const [value, setValue] = useState(0);
  const [openAddFunds, setOpenAddFunds] = useState(false);
  const [openWithdraw, setOpenWithdraw] = useState(false);
  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [direction, setDirection] = useState("all");
  const limit = 3;
  const [openTxnDetail, setOpenTxnDetail] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const getStatusColor = (status) => {
    if (!status) return "default";
    const normalized = String(status).toLowerCase();
    if (normalized === "completed" || normalized === "success" ) return "success";
    if (normalized === "processing" || normalized === "pending") return "warning";
    if (["failed", "faild", "rejected", "canceled", "cancelled", "error"].includes(normalized)) return "error";
    return "default";
  };

  const handleOpenAddFunds = () => {
    if (!walletId) {
      toast.error("Please refresh the page to get wallet information.");
      return;
    }
    setOpenAddFunds(true);
  };

  const handleCloseAddFunds = () => {
    setOpenAddFunds(false);
    resetDeposit();
  };

  const handleOpenWithdraw = () => setOpenWithdraw(true);
  const handleCloseWithdraw = () => {
    setOpenWithdraw(false);
    resetWithdraw(); 
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const handleDirectionChange = (newDirection) => {
    setDirection(newDirection);
    setCurrentPage(1);
  };

  // Load transaction history
  useEffect(() => {
    if (walletId) {
      dispatch(
        getTransactionHistoryApi({
          page: currentPage,
          limit,
          typeGroup: value === 0 ? "personal" : "deposit_refund",
          direction,
        })
      );
    }
  }, [dispatch, walletId, currentPage, limit, direction, value]);

  // Handle page change
  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleOpenTxnDetail = async (id) => {
    try {
      setDetailLoading(true);
      const res = await dispatch(getTransactionHistoryBusinessApiDetail({ id })).unwrap();
      setSelectedTxn(res?.data);
      setOpenTxnDetail(true);
    } catch {
      // ignore
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCloseTxnDetail = () => {
    setOpenTxnDetail(false);
    setSelectedTxn(null);
  };

  // Format transaction data (tolerate non-array shapes)
  const formatTransactionData = (transactions) => {
    const list = Array.isArray(transactions)
      ? transactions
      : (Array.isArray(transactions?.data) ? transactions.data : []);
    return list.map((transaction) => ({
      id: transaction._id,
      date: new Date(transaction.createdAt).toLocaleDateString("vi-VN"),
      type: ["deposit", "top_up"].includes(
        String(transaction.transactionType)
      )
        ? "VNPay"
        : "Bank Account",
      description: transaction.description,
      amount:
        transaction.direction === "in"
          ? `+${transaction.amount.toLocaleString("vi-VN")} VND`
          : `-${transaction.amount.toLocaleString("vi-VN")} VND`,
      status: transaction.status,
      direction: transaction.direction,
      transactionType: transaction.transactionType,
    }));
  };

  // Get real transaction data
  const realTransactionData = formatTransactionData(transactionHistory);
  
  // Filter logic
  const getFilteredData = (data) => {
    if (filter === "All") return data;
    if (filter === "Plus Money")
      return data.filter((item) => item.amount.startsWith("+"));
    if (filter === "Minus Money")
      return data.filter((item) => item.amount.startsWith("-"));
    return data;
  };

  if (profileLoading) {
    return (
      <div className="wallet">
        <div style={{ textAlign: "center", padding: "50px" }}>
          <Typography>Loading wallet information...</Typography>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="wallet">
        <div className="wallet-container">
          <div className="wallet-header">
            <div className="wallet-title">
              <Typography
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  fontSize: "30px",
                  fontWeight: "bold",
                }}
              >
                <LuWallet className="mr-2 text-black" /> Wallet Balance
              </Typography>
              <span style={{ color: "#787e7a" }}>
                Manage your deposits and payment methods
              </span>
            </div>
          <div className="wallet-balance" style={{ display: 'flex', gap: 24 }}>
            <div className="wallet-balance-des" style={{ minWidth: 280 }}>
              <Typography
                sx={{
                  fontSize: "36px",
                  color: "#007a00",
                  fontWeight: "bold",
                }}
              >
                {(availableBalance ?? balance).toLocaleString('vi-VN')} VNĐ
              </Typography>
              <span>Business Balance (Available)</span>
            </div>
            <div className="wallet-balance-des" style={{ minWidth: 280 }}>
              <Typography
                sx={{
                  fontSize: "28px",
                  color: "#c97700",
                  fontWeight: 700,
                }}
              >
                {(holdingBalance || 0).toLocaleString('vi-VN')} VNĐ
              </Typography>
              <span>Customer Deposits (Holding)</span>
            </div>
            <div>
              <div
                className="wallet-balance-transaction"
                onClick={handleOpenAddFunds}
              >
                <FaPlus className="mr-3" />
                Add funds
              </div>
              <div
                className="wallet-balance-transaction-withdraw mt-4"
                onClick={handleOpenWithdraw}
              >
                <FaMinus className="mr-3" />
                Withdraw
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
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
                "& .MuiTabs-indicator": {
                  backgroundColor: "transparent",
                },
                "& .MuiTab-root": {
                  backgroundColor: "transparent",
                  color: "#000000",
                  textTransform: "none",
                  fontSize: "16px",
                  minWidth: "150px",
                  borderRadius: "8px",
                  "&.Mui-selected": {
                    backgroundColor: "#2E7D32",
                    color: "#FFFFFF",
                  },
                  width: "50%",
                },
              }}
            >
              <Tab label="Subscriptions & Withdrawals" />
              <Tab label="Deposits & Refunds" />
            </Tabs>
            <TabPanelRecent value={value} index={0}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2, justifyContent: "flex-end" }}>
                <Chip
                  label="All"
                  color={direction === "all" ? "primary" : "default"}
                  onClick={() => handleDirectionChange("all")}
                  sx={{ mr: 1, cursor: "pointer" }}
                />
                <Chip
                  label="Money In"
                  color={direction === "in" ? "success" : "default"}
                  onClick={() => handleDirectionChange("in")}
                  sx={{ mr: 1, cursor: "pointer" }}
                />
                <Chip
                  label="Money Out"
                  color={direction === "out" ? "error" : "default"}
                  onClick={() => handleDirectionChange("out")}
                  sx={{ cursor: "pointer" }}
                />
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
                  ) : getFilteredData(realTransactionData).map((item) => {
                    const failedStatuses = [
                      "failed",
                      "faild",
                      "rejected",
                      "canceled",
                      "cancelled",
                      "error",
                    ];
                    const isDepositLike = ["deposit", "top_up"].includes(String(item.transactionType).toLowerCase());
                    const isNegative =
                      item.direction === "out" ||
                      (isDepositLike && failedStatuses.includes(String(item.status).toLowerCase()));
                    return (
                      <Box
                        key={item.id}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          p: 2,
                          mb: 1,
                          border: "1px solid #e0e0e0",
                          borderRadius: "8px",
                          backgroundColor:
                            item.status === "completed" ? "#f5f5f5" : "#fff",
                        }}
                        onClick={() => handleOpenTxnDetail(item.id)}
                        role="button"
                        style={{ cursor: "pointer" }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <Box
                            sx={{
                              width: 36,
                              height: 36,
                              borderRadius: "10px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: isNegative ? "#fde7e7" : "#e7f5ed",
                              color: isNegative ? "#d32f2f" : "#2e7d32",
                            }}
                          >
                            {item.direction === "out" ? (
                              <FiArrowUpRight size={18} />
                            ) : (
                              <FiArrowDownLeft size={18} />
                            )}
                          </Box>
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>{item.description}</Typography>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Typography variant="caption" color="textSecondary">
                                {item.date} {item.type}
                              </Typography>
                              <Chip
                                size="small"
                                label={item.status}
                                color={getStatusColor(item.status)}
                              />
                            </Box>
                            <Typography variant="caption" color="textSecondary">
                              ID: {item.id}
                            </Typography>
                          </Box>
                        </Box>
                        <Typography
                          variant="body1"
                          color={isNegative ? "error" : "success"}
                          sx={{ 
                            fontWeight: "bold",
                            color: isNegative ? "#d32f2f" : "#2e7d32"
                          }}
                        >
                          {item.amount}
                        </Typography>
                      </Box>
                    );
                  })}
                  
                  {/* Pagination */}
                  {transactionTotalPages > 1 && (
                    <Stack
                      spacing={2}
                      className="mt-4"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Pagination
                        count={transactionTotalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        variant="outlined"
                        shape="rounded"
                      />
                    </Stack>
                  )}
                </>
              )}
            </TabPanelRecent>
            <TabPanelRecent value={value} index={1}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Chip
                  label="All"
                  color={filter === "All" ? "primary" : "default"}
                  onClick={() => handleFilterChange("All")}
                  sx={{ mr: 1, cursor: "pointer" }}
                />
                <Chip
                  label="Plus Money"
                  color={filter === "Plus Money" ? "success" : "default"}
                  onClick={() => handleFilterChange("Plus Money")}
                  sx={{ mr: 1, cursor: "pointer" }}
                />
                <Chip
                  label="Minus Money"
                  color={filter === "Minus Money" ? "error" : "default"}
                  onClick={() => handleFilterChange("Minus Money")}
                  sx={{ cursor: "pointer" }}
                />
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
                  ) : (
                    getFilteredData(realTransactionData).map((item) => {
                      const failedStatuses = [
                        "failed",
                        "faild",
                        "rejected",
                        "canceled",
                        "cancelled",
                        "error",
                      ];
                      const isDepositLike = ["deposit", "top_up"].includes(
                        String(item.transactionType).toLowerCase()
                      );
                      const isNegative =
                        item.direction === "out" ||
                        (isDepositLike &&
                          failedStatuses.includes(
                            String(item.status).toLowerCase()
                          ));
                      return (
                        <Box
                          key={item.id}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            p: 2,
                            mb: 1,
                            border: "1px solid #e0e0e0",
                            borderRadius: "8px",
                            backgroundColor:
                              item.status === "completed" ? "#f5f5f5" : "#fff",
                          }}
                          onClick={() => handleOpenTxnDetail(item.id)}
                          role="button"
                          style={{ cursor: "pointer" }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <Box
                              sx={{
                                width: 36,
                                height: 36,
                                borderRadius: "10px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: isNegative
                                  ? "#fde7e7"
                                  : "#e7f5ed",
                                color: isNegative ? "#d32f2f" : "#2e7d32",
                              }}
                            >
                              {item.direction === "out" ? (
                                <FiArrowUpRight size={18} />
                              ) : (
                                <FiArrowDownLeft size={18} />
                              )}
                            </Box>
                            <Box>
                              <Typography
                                variant="body1"
                                sx={{ fontWeight: 600 }}
                              >
                                {item.description}
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  color="textSecondary"
                                >
                                  {item.date} {item.type}
                                </Typography>
                                <Chip
                                  size="small"
                                  label={item.status}
                                  color={getStatusColor(item.status)}
                                />
                              </Box>
                              <Typography
                                variant="caption"
                                color="textSecondary"
                              >
                                ID: {item.id}
                              </Typography>
                            </Box>
                          </Box>
                          <Typography
                            variant="body1"
                            color={isNegative ? "error" : "success"}
                            sx={{
                              fontWeight: "bold",
                              color: isNegative ? "#d32f2f" : "#2e7d32",
                            }}
                          >
                            {item.amount}
                          </Typography>
                        </Box>
                      );
                    })
                  )}
                  {/* Pagination for deposits & refunds */}
                  {transactionTotalPages > 1 && (
                    <Stack
                      spacing={2}
                      className="mt-4"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Pagination
                        count={transactionTotalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        variant="outlined"
                        shape="rounded"
                      />
                    </Stack>
                  )}
                </>
              )}
            </TabPanelRecent>
          </div>
        </div>
      </div>

      <ModalWallet
        open={openAddFunds}
        handleClose={handleCloseAddFunds}
        title="Deposit to wallet"
        description="Enter the amount you want to deposit (VND)"
        amount={addAmount}
        setAmount={setAddAmount}
        handleSubmit={handleDeposit}
        action="deposit"
        loading={depositLoading}
        error={depositError}
        walletId={walletId}
        currency="VND"
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
      />
      <ModalWallet
        open={openWithdraw}
        handleClose={handleCloseWithdraw}
        title="Withdraw Funds from Wallet"
        description="Withdraw funds from your wallet for container deposits and fees"
        amount={withdrawAmount}
        setAmount={setWithdrawAmount}
    handleSubmit={(e) => handleWithdraw(e, walletId, handleCloseWithdraw)}
        action="withdraw"
        loading={withdrawLoading}
        error={withdrawError}
        walletId={walletId}
        currency="VND" 
      />
      <ModalTransactionDetail
        open={openTxnDetail}
        onClose={handleCloseTxnDetail}
        transaction={selectedTxn}
        loading={detailLoading}
      />
    </>
  );
}

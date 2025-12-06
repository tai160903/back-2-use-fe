
import Typography from "@mui/material/Typography";
import "../../Home/WalletCustomer/WalletCustomer.css";
import { LuWallet } from "react-icons/lu";
import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa";
import { useState, useEffect } from "react";

import { MdAttachMoney } from "react-icons/md";
import { FiArrowDownLeft, FiArrowUpRight } from "react-icons/fi";
import { Box, Chip } from "@mui/material";

import toast from "react-hot-toast";
import { useUserInfo } from "../../../hooks/useUserInfo";
import useDeposit from "../../../hooks/useDeposit";
import useWithdraw from "../../../hooks/useWithdraw";
import ModalWallet from "../../../components/ModalWallet/ModalWallet";
import ModalTransactionDetail from "../../../components/ModalTransactionDetail/ModalTransactionDetail";
import { useDispatch, useSelector } from "react-redux";
import { getTransactionHistoryApi, getTransactionHistoryBusinessApiDetail } from "../../../store/slices/walletSlice";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

export default function WalletBusiness({ mode = "actions" }) {
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

  const [openAddFunds, setOpenAddFunds] = useState(false);
  const [openWithdraw, setOpenWithdraw] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [direction, setDirection] = useState("all");
  const [transactionTypeFilter, setTransactionTypeFilter] = useState("borrow_return"); 
  const [depositWithdrawFilter, setDepositWithdrawFilter] = useState("all"); 
  const limit = 3;
  const [openTxnDetail, setOpenTxnDetail] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const isHistoryMode = mode === "history";

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

  const handleDirectionChange = (newDirection) => {
    setDirection(newDirection);
    setCurrentPage(1);
  };

  const handleTransactionTypeFilterChange = (newFilter) => {
    setTransactionTypeFilter(newFilter);
    setCurrentPage(1);
  };

  const handleDepositWithdrawFilterChange = (newFilter) => {
    setDepositWithdrawFilter(newFilter);
    setCurrentPage(1);
  };

  // Load transaction history
  useEffect(() => {
    if (walletId) {
      if (isHistoryMode) {
       
        if (transactionTypeFilter === "penalty") {
          // When filter is "penalty", only get penalty
          dispatch(
            getTransactionHistoryApi({
              page: currentPage,
              limit,
              typeGroup: "penalty",
              direction,
              walletType: "business",
            })
          );
        } else {
          // When filter is "borrow_return", only get deposit_refund
          dispatch(
            getTransactionHistoryApi({
              page: currentPage,
              limit,
              typeGroup: "deposit_refund",
              direction,
              walletType: "business",
            })
          );
        }
      } else {
        // Use regular API for personal transactions
        dispatch(
          getTransactionHistoryApi({
            page: currentPage,
            limit,
            typeGroup: "personal",
            direction,
            walletType: "business",
          })
        );
      }
    }
  }, [dispatch, walletId, currentPage, limit, direction, isHistoryMode, transactionTypeFilter, depositWithdrawFilter]);

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

  // Format transaction data
  const formatTransactionData = (transactions) => {
    const list = Array.isArray(transactions)
      ? transactions
      : (Array.isArray(transactions?.data) ? transactions.data : []);
    return list.map(transaction => {
      const date = new Date(transaction.createdAt);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const formattedDate = `${day}/${month}/${year}`;
      const formattedTime = `${hours}:${minutes}`;
      
      return {
        id: transaction._id,
        date: formattedDate,
        time: formattedTime,
        dateTime: `${formattedDate} ${formattedTime}`,
        transactionTypeLabel: getTransactionTypeLabel(transaction.transactionType),
        description: transaction.description,
        amount: transaction.amount,
        amountFormatted: transaction.direction === 'in' 
          ? `+${transaction.amount.toLocaleString('en-US').replace(/,/g, ".")} VND`
          : `-${transaction.amount.toLocaleString('en-US').replace(/,/g, ".")} VND`,
        status: transaction.status,
        direction: transaction.direction,
        transactionType: transaction.transactionType,
        paymentMethod: transaction.paymentMethod ? formatPaymentMethod(transaction.paymentMethod) : null
      };
    });
  };

  // Get real transaction data
  const realTransactionData = transactionHistory ? formatTransactionData(transactionHistory) : [];
  
  // Filter by direction (money in/out)
  const filterByDirection = (data) => {
    if (direction === "all") return data;
    return data.filter((item) => item.direction === direction);
  };

  // Keep only borrow / return / penalty transactions (exclude pure top-ups)
  const borrowPenaltyOnly = (data) =>
    data.filter(
      (item) =>
        !["deposit", "top_up"].includes(
          String(item.transactionType).toLowerCase()
        )
    );
  
  // Filter by transaction type (borrow_return, penalty) - for history mode
  const filterByTransactionType = (data) => {
    if (transactionTypeFilter === "penalty") {
      return data.filter((item) => 
        String(item.transactionType).toLowerCase() === "penalty"
      );
    }
    // When filter is "borrow_return", exclude penalty and deposit/top_up
    if (transactionTypeFilter === "borrow_return") {
      return data.filter((item) => 
        String(item.transactionType).toLowerCase() !== "penalty" &&
        !["deposit", "top_up"].includes(String(item.transactionType).toLowerCase())
      );
    }
    return data;
  };

  // Filter by transaction type for deposit/withdraw mode (all, top_up, withdraw, subscription_fee)
  const filterByDepositWithdrawType = (data) => {
    if (depositWithdrawFilter === "all") return data;
    if (depositWithdrawFilter === "top_up") {
      return data.filter((item) => 
        ["top_up", "deposit"].includes(String(item.transactionType).toLowerCase())
      );
    }
    if (depositWithdrawFilter === "withdraw") {
      return data.filter((item) => 
        ["withdraw", "withdrawal"].includes(String(item.transactionType).toLowerCase())
      );
    }
    if (depositWithdrawFilter === "subscription_fee") {
      return data.filter((item) => 
        String(item.transactionType).toLowerCase() === "subscription_fee"
      );
    }
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
                <LuWallet className="mr-2 text-black" /> Business Wallet
              </Typography>
              <span style={{ color: "#787e7a" }}>
                {isHistoryMode
                  ? "View detailed borrow/return and penalty transaction history"
                  : "Top up and withdraw money from your wallet"}
              </span>
            </div>
          </div>

          {!isHistoryMode && (
            <>
              {/* Action section: deposit & withdraw */}
              <div className="wallet-balance">
                <div className="wallet-balance-des">
                  <Typography
                    sx={{
                      fontSize: "40px",
                      color: "#007a00",
                      fontWeight: "bold",
                    }}
                  >
                    {(availableBalance ?? balance).toLocaleString('en-US').replace(/,/g, ".")} VND
                  </Typography>
                  <span>Available balance</span>
                </div>
                <div>
                  <div
                    className="wallet-balance-transaction"
                    onClick={handleOpenAddFunds}
                  >
                    <FaPlus className="mr-3" />
                    Top up
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

              {/* Deposit/Withdraw History */}
              <div className="recentTransaction">
                <div className="recentTransaction-container">
                  <Typography className="recentTransaction-title">
                    <MdAttachMoney className="mr-2 size-8" /> Deposit/Withdraw History
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 2,
                      justifyContent: "flex-start",
                      flexWrap: "wrap",
                      gap: 1,
                    }}
                  >
                    {/* Transaction Type Filters */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                      <Chip
                        label="All"
                        color={depositWithdrawFilter === "all" ? "primary" : "default"}
                        onClick={() => handleDepositWithdrawFilterChange("all")}
                        sx={{ cursor: "pointer" }}
                      />
                      <Chip
                        label="Deposit"
                        color={depositWithdrawFilter === "top_up" ? "primary" : "default"}
                        onClick={() => handleDepositWithdrawFilterChange("top_up")}
                        sx={{ cursor: "pointer" }}
                      />
                      <Chip
                        label="Withdraw"
                        color={depositWithdrawFilter === "withdraw" ? "primary" : "default"}
                        onClick={() => handleDepositWithdrawFilterChange("withdraw")}
                        sx={{ cursor: "pointer" }}
                      />
                      <Chip
                        label="Subscription"                        color={depositWithdrawFilter === "subscription_fee" ? "primary" : "default"}
                        onClick={() => handleDepositWithdrawFilterChange("subscription_fee")}
                        sx={{ cursor: "pointer" }}
                      />
                    </Box>
                  </Box>
                  {transactionLoading ? (
                    <div style={{ textAlign: "center", padding: "20px" }}>
                      <Typography>Loading history...</Typography>
                    </div>
                  ) : (
                    <>
                      {filterByDepositWithdrawType(realTransactionData).length === 0 ? (
                        <div style={{ textAlign: "center", padding: 20 }}>
                          <Typography>No deposit/withdraw transactions found.</Typography>
                        </div>
                      ) : (
                        filterByDepositWithdrawType(realTransactionData).map((item) => {
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
                          alignItems: "flex-start",
                          p: 3,
                          mb: 2,
                          border: "1px solid #e0e0e0",
                          borderRadius: "12px",
                          backgroundColor: "#fff",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                            borderColor: "#007c00",
                          },
                        }}
                        onClick={() => handleOpenTxnDetail(item.id)}
                        role="button"
                        style={{ cursor: "pointer" }}
                      >
                        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, flex: 1 }}>
                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: "12px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: isNegative
                                ? "#fee"
                                : "#e8f5e9",
                              color: isNegative ? "#d32f2f" : "#2e7d32",
                              flexShrink: 0,
                            }}
                          >
                            {item.direction === "out" ? (
                              <FiArrowUpRight size={22} />
                            ) : (
                              <FiArrowDownLeft size={22} />
                            )}
                          </Box>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            {/* Transaction Type - Most Prominent */}
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 700,
                                fontSize: "18px",
                                color: isNegative ? "#d32f2f" : "#2e7d32",
                                mb: 0.5,
                              }}
                            >
                              {item.transactionTypeLabel}
                            </Typography>
                            
                            {/* Description */}
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 500,
                                color: "#424242",
                                mb: 1,
                                wordBreak: "break-word",
                              }}
                            >
                              {item.description}
                            </Typography>
                            
                            {/* Payment Method */}
                            {item.paymentMethod && (
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: "#757575",
                                    fontSize: "12px",
                                  }}
                                >
                                  Payment Method:
                                </Typography>
                                <Chip
                                  label={item.paymentMethod}
                                  size="small"
                                  sx={{
                                    height: "20px",
                                    fontSize: "11px",
                                    fontWeight: 600,
                                    backgroundColor: "#e3f2fd",
                                    color: "#1976d2",
                                  }}
                                />
                              </Box>
                            )}
                            
                            {/* Date and Time */}
                            <Typography
                              variant="caption"
                              sx={{
                                color: "#757575",
                                fontSize: "13px",
                                display: "block",
                                mb: 1,
                              }}
                            >
                              {item.dateTime}
                            </Typography>
                            
                            {/* Status */}
                            <Chip
                              label={item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                              color={getStatusColor(item.status)}
                              size="small"
                              sx={{
                                fontWeight: 600,
                                fontSize: "11px",
                                height: "24px",
                              }}
                            />
                          </Box>
                        </Box>
                        
                        {/* Amount - Right Side, Prominent */}
                        <Box sx={{ textAlign: "right", ml: 2, flexShrink: 0 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 700,
                              fontSize: "20px",
                              color: isNegative ? "#d32f2f" : "#2e7d32",
                              mb: 0.5,
                            }}
                          >
                            {item.amountFormatted}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: "#757575",
                              fontSize: "11px",
                            }}
                          >
                            {item.direction === "in" ? "Money In" : "Money Out"}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  }))}
                  
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
                </div>
              </div>
            </>
          )}

          {isHistoryMode && (
            <>
              {/* Holding Balance Display - Similar to Available Balance */}
              <div className="wallet-balance">
                <div className="wallet-balance-des">
                  <Typography
                    sx={{
                      fontSize: "40px",
                      color: "#007a00",
                      fontWeight: "bold",
                    }}
                  >
                    {holdingBalance.toLocaleString("en-US").replace(/,/g, ".")} VND
                  </Typography>
                  <span>Holding balance</span>
                </div>
              </div>

              <div className="recentTransaction">
                <div className="recentTransaction-container">
                  <Typography className="recentTransaction-title">
                    <MdAttachMoney className="mr-2 size-8" /> Borrow/Return/Penalty History
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 2,
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: 1,
                    }}
                  >
                    {/* Transaction Type Filters */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                      <Chip
                        label="Borrow/Return"
                        color={transactionTypeFilter === "borrow_return" ? "primary" : "default"}
                        onClick={() => handleTransactionTypeFilterChange("borrow_return")}
                        sx={{ cursor: "pointer" }}
                      />
                      <Chip
                        label="Penalty"
                        color={transactionTypeFilter === "penalty" ? "primary" : "default"}
                        onClick={() => handleTransactionTypeFilterChange("penalty")}
                        sx={{ cursor: "pointer" }}
                      />
                    </Box>
                    
                    {/* Direction Filters */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                      <Chip
                        label="All"
                        color={direction === "all" ? "success" : "default"}
                        onClick={() => handleDirectionChange("all")}
                        sx={{ cursor: "pointer" }}
                      />
                      <Chip
                        label="Money in"
                        color={direction === "in" ? "success" : "default"}
                        onClick={() => handleDirectionChange("in")}
                        sx={{ cursor: "pointer" }}
                      />
                      <Chip
                        label="Money out"
                        color={direction === "out" ? "error" : "default"}
                        onClick={() => handleDirectionChange("out")}
                        sx={{ cursor: "pointer" }}
                      />
                    </Box>
                  </Box>
                  {transactionLoading ? (
                    <div style={{ textAlign: "center", padding: "20px" }}>
                      <Typography>Loading history...</Typography>
                    </div>
                  ) : (
                    <>
                      {filterByDirection(
                        filterByTransactionType(
                          borrowPenaltyOnly(realTransactionData)
                        )
                      ).length === 0 ? (
                        <div style={{ textAlign: "center", padding: 20 }}>
                          <Typography>
                            No transactions found.
                          </Typography>
                        </div>
                      ) : (
                        filterByDirection(
                          filterByTransactionType(
                            borrowPenaltyOnly(realTransactionData)
                          )
                        ).map((item) => {
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
                                alignItems: "flex-start",
                                p: 3,
                                mb: 2,
                                border: "1px solid #e0e0e0",
                                borderRadius: "12px",
                                backgroundColor: "#fff",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                                transition: "all 0.2s ease",
                                "&:hover": {
                                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                                  borderColor: "#007c00",
                                },
                              }}
                              onClick={() => handleOpenTxnDetail(item.id)}
                              role="button"
                              style={{ cursor: "pointer" }}
                            >
                              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, flex: 1 }}>
                                <Box
                                  sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: "12px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: isNegative
                                      ? "#fee"
                                      : "#e8f5e9",
                                    color: isNegative ? "#d32f2f" : "#2e7d32",
                                    flexShrink: 0,
                                  }}
                                >
                                  {item.direction === "out" ? (
                                    <FiArrowUpRight size={22} />
                                  ) : (
                                    <FiArrowDownLeft size={22} />
                                  )}
                                </Box>
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                  {/* Transaction Type - Most Prominent */}
                                  <Typography
                                    variant="h6"
                                    sx={{
                                      fontWeight: 700,
                                      fontSize: "18px",
                                      color: isNegative ? "#d32f2f" : "#2e7d32",
                                      mb: 0.5,
                                    }}
                                  >
                                    {item.transactionTypeLabel}
                                  </Typography>
                                  
                                  {/* Description */}
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontWeight: 500,
                                      color: "#424242",
                                      mb: 1,
                                      wordBreak: "break-word",
                                    }}
                                  >
                                    {item.description}
                                  </Typography>
                                  
                                  {/* Payment Method */}
                                  {item.paymentMethod && (
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                      <Typography
                                        variant="caption"
                                        sx={{
                                          color: "#757575",
                                          fontSize: "12px",
                                        }}
                                      >
                                        Payment Method:
                                      </Typography>
                                      <Chip
                                        label={item.paymentMethod}
                                        size="small"
                                        sx={{
                                          height: "20px",
                                          fontSize: "11px",
                                          fontWeight: 600,
                                          backgroundColor: "#e3f2fd",
                                          color: "#1976d2",
                                        }}
                                      />
                                    </Box>
                                  )}
                                  
                                  {/* Date and Time */}
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: "#757575",
                                      fontSize: "13px",
                                      display: "block",
                                      mb: 1,
                                    }}
                                  >
                                    {item.dateTime}
                                  </Typography>
                                  
                                  {/* Status */}
                                  <Chip
                                    label={item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                    color={getStatusColor(item.status)}
                                    size="small"
                                    sx={{
                                      fontWeight: 600,
                                      fontSize: "11px",
                                      height: "24px",
                                    }}
                                  />
                                </Box>
                              </Box>
                              
                              {/* Amount - Right Side, Prominent */}
                              <Box sx={{ textAlign: "right", ml: 2, flexShrink: 0 }}>
                                <Typography
                                  variant="h6"
                                  sx={{
                                    fontWeight: 700,
                                    fontSize: "20px",
                                    color: isNegative ? "#d32f2f" : "#2e7d32",
                                    mb: 0.5,
                                  }}
                                >
                                  {item.amountFormatted}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: "#757575",
                                    fontSize: "11px",
                                  }}
                                >
                                  {item.direction === "in" ? "Money In" : "Money Out"}
                                </Typography>
                              </Box>
                            </Box>
                          );
                        })
                      )}

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
                </div>
              </div>
            </>
          )}
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

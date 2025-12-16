
import Typography from "@mui/material/Typography";
import "../../Home/WalletCustomer/WalletCustomer.css";
import { LuWallet } from "react-icons/lu";
import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa";
import { useState, useEffect } from "react";

import { MdAttachMoney } from "react-icons/md";
import { FiArrowDownLeft, FiArrowUpRight, FiUser } from "react-icons/fi";
import { Box, Chip, Tabs, Tab, Button } from "@mui/material";
import TabPanelRecent from "../../../components/TabPanelRecent/TabPanelRecent";

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

  const [openAddFunds, setOpenAddFunds] = useState(false);
  const [openWithdraw, setOpenWithdraw] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [depositWithdrawFilter, setDepositWithdrawFilter] = useState("all"); 
  const [borrowReturnFilter, setBorrowReturnFilter] = useState("all"); // "all", "borrow_deposit", "return_refund", "penalty"
  const limit = 3;
  const [openTxnDetail, setOpenTxnDetail] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [depositRefundData, setDepositRefundData] = useState([]);
  const [penaltyData, setPenaltyData] = useState([]);
  const [depositRefundTotalPages, setDepositRefundTotalPages] = useState(0);
  const [penaltyTotalPages, setPenaltyTotalPages] = useState(0);

  // Map transaction type to professional terminology
  const getTransactionTypeLabel = (transactionType) => {
    const typeMap = {
      'deposit_forfeited': 'Deposit Forfeited',
      'top_up': 'Top up',
      'deposit': 'Top up',
      'withdrawal': 'Withdraw',
      'withdraw': 'Withdraw',
      'borrow': 'Borrow',
      'borrow_deposit': 'Borrow Deposit',
      'return': 'Return',
      'return_refund': 'Return Refund',
      'penalty': 'Penalty',
      'refund': 'Refund',
      'subscription_fee': 'Subscription',
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

  const handleDepositWithdrawFilterChange = (newFilter) => {
    setDepositWithdrawFilter(newFilter);
    setCurrentPage(1);
  };

  const handleBorrowReturnFilterChange = (newFilter) => {
    setBorrowReturnFilter(newFilter);
    setCurrentPage(1);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setCurrentPage(1);
  };


  useEffect(() => {
    if (walletId && tabValue === 0) {
      // Other filters: filter on frontend
      const fetchLimit = depositWithdrawFilter !== "all" ? 100 : limit;
      const fetchPage = depositWithdrawFilter !== "all" ? 1 : currentPage;
      dispatch(
        getTransactionHistoryApi({
          page: fetchPage,
          limit: fetchLimit,
          typeGroup: "personal",
          walletType: "business",
        })
      );
    }
  }, [dispatch, walletId, currentPage, limit, tabValue, depositWithdrawFilter]);

  // Load transaction history for Tab 1: Borrow/Return History (deposit_refund + penalty)
  useEffect(() => {
    if (walletId && tabValue === 1) {
      // If filter is penalty, only fetch penalty from backend
      if (borrowReturnFilter === "penalty") {
        dispatch(
          getTransactionHistoryApi({
            page: currentPage,
            limit,
            typeGroup: "penalty",
            walletType: "business",
          })
        ).then((result) => {
          if (result.payload) {
            setPenaltyData(result.payload.data || []);
            setPenaltyTotalPages(result.payload.totalPages || 0);
            setDepositRefundData([]);
            setDepositRefundTotalPages(0);
          }
        });
      } else {
        // Fetch deposit_refund for borrow_deposit, return_refund, or all
        dispatch(
          getTransactionHistoryApi({
            page: currentPage,
            limit: borrowReturnFilter === "all" ? limit : 100, // Fetch more if need to filter on FE
            typeGroup: "deposit_refund",
            walletType: "business",
          })
        ).then((result) => {
          if (result.payload) {
            setDepositRefundData(result.payload.data || []);
            setDepositRefundTotalPages(result.payload.totalPages || 0);
          }
        });

        // Fetch penalty only if filter is "all"
        if (borrowReturnFilter === "all") {
          dispatch(
            getTransactionHistoryApi({
              page: currentPage,
              limit,
              typeGroup: "penalty",
              walletType: "business",
            })
          ).then((result) => {
            if (result.payload) {
              setPenaltyData(result.payload.data || []);
              setPenaltyTotalPages(result.payload.totalPages || 0);
            }
          });
        } else {
          setPenaltyData([]);
          setPenaltyTotalPages(0);
        }
      }
    }
  }, [dispatch, walletId, currentPage, limit, tabValue, borrowReturnFilter]);

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
      
      // Get subscription name if it's a subscription_fee transaction
      let description = transaction.description;
      let transactionTypeLabel = getTransactionTypeLabel(transaction.transactionType);
      
      if (transaction.transactionType === 'subscription_fee' && transaction.referenceDetail?.subscriptionInfo?.name) {
        transactionTypeLabel = `Purchase: ${transaction.referenceDetail.subscriptionInfo.name}`;
        description = `Subscription package: ${transaction.referenceDetail.subscriptionInfo.name}`;
      }
      
      return {
        id: transaction._id,
        date: formattedDate,
        time: formattedTime,
        dateTime: `${formattedDate} ${formattedTime}`,
        transactionTypeLabel: transactionTypeLabel,
        description: description,
        amount: transaction.amount,
        amountFormatted: transaction.direction === 'in' 
          ? `+${transaction.amount.toLocaleString('en-US').replace(/,/g, ".")} VND`
          : `-${transaction.amount.toLocaleString('en-US').replace(/,/g, ".")} VND`,
        status: transaction.status,
        direction: transaction.direction,
        transactionType: transaction.transactionType,
        paymentMethod: transaction.paymentMethod ? formatPaymentMethod(transaction.paymentMethod) : null,
        paymentUrl: transaction.paymentUrl || null,
        referenceDetail: transaction.referenceDetail,
        relatedUser: transaction.relatedUser || null,
        relatedUserType: transaction.relatedUserType || null,
        balanceType: transaction.balanceType || null,
        toBalanceType: transaction.toBalanceType || null
      };
    });
  };

  // Get real transaction data
  const realTransactionData = transactionHistory ? formatTransactionData(transactionHistory) : [];
  
  // Filter by transaction type for Tab 1 (FE filtering for borrow_deposit and return_refund)
  const filterByBorrowReturnType = (data) => {
    if (borrowReturnFilter === "all" || borrowReturnFilter === "penalty") {
      return data; // Already filtered from backend
    }
    if (borrowReturnFilter === "borrow_deposit") {
      return data.filter((item) => 
        item.transactionType === "borrow_deposit"
      );
    }
    if (borrowReturnFilter === "return_refund") {
      return data.filter((item) => 
        item.transactionType === "return_refund" || item.transactionType === "deposit_refund"
      );
    }
    return data;
  };
  
  // Merge deposit_refund and penalty data for Tab 1
  const mergedDepositPenaltyData = tabValue === 1 
    ? (() => {
        let dataToMerge = [];
        
        // If filter is penalty, only use penalty data
        if (borrowReturnFilter === "penalty") {
          dataToMerge = formatTransactionData(penaltyData);
        }
        // If filter is borrow_deposit or return_refund, only use deposit_refund data and filter on FE
        else if (borrowReturnFilter === "borrow_deposit" || borrowReturnFilter === "return_refund") {
          dataToMerge = filterByBorrowReturnType(formatTransactionData(depositRefundData));
        }
        // If filter is "all", merge both
        else {
          dataToMerge = [
            ...formatTransactionData(depositRefundData), 
            ...formatTransactionData(penaltyData)
          ];
        }
        
        return dataToMerge.sort((a, b) => {
          const dateA = new Date(a.dateTime.split(' ')[0].split('/').reverse().join('-') + ' ' + a.dateTime.split(' ')[1]);
          const dateB = new Date(b.dateTime.split(' ')[0].split('/').reverse().join('-') + ' ' + b.dateTime.split(' ')[1]);
          return dateB - dateA;
        });
      })()
    : [];
  
  // Filter by transactionType for Tab 0
  const filterByTransactionType = (data) => {
    if (depositWithdrawFilter === "all") return data;
    
    if (depositWithdrawFilter === "top_up") {
      return data.filter((item) => 
        item.transactionType === "top_up" || item.transactionType === "deposit"
      );
    }
    
    if (depositWithdrawFilter === "withdraw") {
      return data.filter((item) => 
        item.transactionType === "withdrawal" || item.transactionType === "withdraw"
      );
    }
    
    if (depositWithdrawFilter === "subscription_fee") {
      return data.filter((item) => item.transactionType === "subscription_fee");
    }
    
    return data;
  };
  
  // Apply filters to transaction data for Tab 0
  const filteredTransactionData = tabValue === 0 
    ? filterByTransactionType(realTransactionData)
    : [];

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
                  color: "#164e31",
                }}
              >
                <LuWallet className="mr-2" style={{ color: "#164e31" }} /> Business Wallet
              </Typography>
              <span style={{ color: "#000000" }}>
                Manage your wallet transactions and history
              </span>
            </div>
          </div>

          {/* Action section: deposit & withdraw - show in both tabs */}
          <div className="wallet-balance">
            <div style={{ display: "flex", gap: "120px", alignItems: "flex-start", flexWrap: "wrap" }}>
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
              <div className="wallet-balance-des">
                <Typography
                  sx={{
                    fontSize: "40px",
                    color: "#1976d2",
                    fontWeight: "bold",
                  }}
                >
                  {(holdingBalance || 0).toLocaleString('en-US').replace(/,/g, ".")} VND
                </Typography>
                <span>Holding balance</span>
              </div>
            </div>
            {tabValue === 0 && (
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
            )}
          </div>

          {/* Recent Transactions with Tabs */}
          <div className="recentTransaction">
            <div className="recentTransaction-container">
              <Typography className="recentTransaction-title">
                <MdAttachMoney className="mr-2 size-8" /> Recent Transactions
              </Typography>
              <div className="recentTransaction-tabs">
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  aria-label="wallet transaction tabs"
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
                  <Tab label="Deposit/Withdraw History" />
                  <Tab label="Borrow/Return History" />
                </Tabs>

                {/* Tab 0: Deposit/Withdraw History (personal) */}
                <TabPanelRecent value={tabValue} index={0}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 2,
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: 2,
                    }}
                  >
                    {/* Transaction Type Filters */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mr: 1, color: "#424242" }}>
                        Transaction Type:
                      </Typography>
                      <Chip
                        label="All"
                        color={depositWithdrawFilter === "all" ? "primary" : "default"}
                        onClick={() => handleDepositWithdrawFilterChange("all")}
                        sx={{ cursor: "pointer" }}
                      />
                      <Chip
                        label="Top up"
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
                        label="Subscription"
                        color={depositWithdrawFilter === "subscription_fee" ? "primary" : "default"}
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
                      {filteredTransactionData.length === 0 ? (
                        <div style={{ textAlign: "center", padding: 20 }}>
                          <Typography>No deposit/withdraw transactions found.</Typography>
                        </div>
                      ) : (
                        filteredTransactionData.map((item) => {
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
                            
                            {/* Balance Transfer Info - Transfer from Holding to Available */}
                            {item.balanceType === "holding" && item.toBalanceType === "available" && (
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                <Chip
                                  icon={<FiArrowDownLeft size={14} />}
                                  label={`Transferred from Holding Balance → Available Balance`}
                                  size="small"
                                  sx={{
                                    height: "24px",
                                    fontSize: "11px",
                                    fontWeight: 600,
                                    backgroundColor: "#fff3e0",
                                    color: "#e65100",
                                    border: "1px solid #ffb74d",
                                    "& .MuiChip-icon": {
                                      color: "#e65100",
                                    },
                                  }}
                                />
                              </Box>
                            )}
                            
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
                            
                            {/* Continue Payment Button for processing status */}
                            {item.status === "processing" && item.paymentUrl && (
                              <Box sx={{ mt: 1.5 }}>
                                <Button
                                  variant="contained"
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(item.paymentUrl, '_blank');
                                  }}
                                  sx={{
                                    backgroundColor: "#007c00",
                                    color: "#ffffff",
                                    fontWeight: 600,
                                    fontSize: "12px",
                                    textTransform: "none",
                                    "&:hover": {
                                      backgroundColor: "#006600",
                                    },
                                  }}
                                >
                                  Continue Payment
                                </Button>
                              </Box>
                            )}
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
                  
                  {/* Show pagination only when filter is "all" */}
                  {depositWithdrawFilter === "all" && transactionTotalPages > 1 && (
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

                {/* Tab 1: Borrow/Return History (deposit_refund + penalty) */}
                <TabPanelRecent value={tabValue} index={1}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 2,
                      justifyContent: "flex-start",
                      flexWrap: "wrap",
                      gap: 2,
                    }}
                  >
                    {/* Transaction Type Filters */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mr: 1, color: "#424242" }}>
                        Transaction Type:
                      </Typography>
                      <Chip
                        label="All"
                        color={borrowReturnFilter === "all" ? "primary" : "default"}
                        onClick={() => handleBorrowReturnFilterChange("all")}
                        sx={{ cursor: "pointer" }}
                      />
                      <Chip
                        label="Borrow Deposit"
                        color={borrowReturnFilter === "borrow_deposit" ? "primary" : "default"}
                        onClick={() => handleBorrowReturnFilterChange("borrow_deposit")}
                        sx={{ cursor: "pointer" }}
                      />
                      <Chip
                        label="Return Refund"
                        color={borrowReturnFilter === "return_refund" ? "primary" : "default"}
                        onClick={() => handleBorrowReturnFilterChange("return_refund")}
                        sx={{ cursor: "pointer" }}
                      />
                      <Chip
                        label="Penalty"
                        color={borrowReturnFilter === "penalty" ? "primary" : "default"}
                        onClick={() => handleBorrowReturnFilterChange("penalty")}
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
                      {mergedDepositPenaltyData.length === 0 ? (
                        <div style={{ textAlign: "center", padding: 20 }}>
                          <Typography>No borrow/return transactions found.</Typography>
                        </div>
                      ) : (
                        mergedDepositPenaltyData.map((item) => {
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
                                  
                                  {/* Balance Transfer Info - Chuyển từ Holding sang Available */}
                                  {item.balanceType === "holding" && item.toBalanceType === "available" && (
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                      <Chip
                                        icon={<FiArrowDownLeft size={14} />}
                                        label={`Transferred from Holding Balance → Available Balance`}
                                        size="small"
                                        sx={{
                                          height: "24px",
                                          fontSize: "11px",
                                          fontWeight: 600,
                                          backgroundColor: "#fff3e0",
                                          color: "#e65100",
                                          border: "1px solid #ffb74d",
                                          "& .MuiChip-icon": {
                                            color: "#e65100",
                                          },
                                        }}
                                      />
                                    </Box>
                                  )}
                                  
                                  {/* Related User - Customer Name */}
                                  {item.relatedUser && item.relatedUserType === "customer" && item.relatedUser.fullName && (
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                      <FiUser size={14} style={{ color: "#757575" }} />
                                      <Typography
                                        variant="caption"
                                        sx={{
                                          color: "#757575",
                                          fontSize: "12px",
                                        }}
                                      >
                                        Borrower: <span style={{ fontWeight: 600, color: "#424242" }}>{item.relatedUser.fullName}</span>
                                      </Typography>
                                    </Box>
                                  )}
                                  
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

                      {/* Pagination */}
                      {(() => {
                        let totalPages = 0;
                        let showPagination = false;
                        
                        if (borrowReturnFilter === "penalty") {
                          totalPages = penaltyTotalPages;
                          showPagination = penaltyTotalPages > 1;
                        } else if (borrowReturnFilter === "borrow_deposit" || borrowReturnFilter === "return_refund") {
                          // No pagination for FE-filtered data (fetch 100 records, filter on FE)
                          showPagination = false;
                        } else {
                          // Filter is "all"
                          totalPages = Math.max(depositRefundTotalPages, penaltyTotalPages);
                          showPagination = totalPages > 1;
                        }
                        
                        return showPagination ? (
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
                              count={totalPages}
                              page={currentPage}
                              onChange={handlePageChange}
                              variant="outlined"
                              shape="rounded"
                            />
                          </Stack>
                        ) : null;
                      })()}
                    </>
                  )}
                </TabPanelRecent>
              </div>
            </div>
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

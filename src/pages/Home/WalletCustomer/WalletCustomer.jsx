import Typography from "@mui/material/Typography";
import "./WalletCustomer.css";
import "../../../components/TabPanelRecent/TabPanelRecent";
import { LuWallet } from "react-icons/lu";
import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa";
import { useState } from "react";
import ModalWallet from "../../../components/ModalWallet/ModalWallet";
import { MdAttachMoney } from "react-icons/md";
import { Tabs, Tab, Box, Chip } from "@mui/material";
import TabPanelRecent from "../../../components/TabPanelRecent/TabPanelRecent";

export default function WalletCustomer() {
  const [value, setValue] = useState(0);
  const [openAddFunds, setOpenAddFunds] = useState(false);
  const [openWithdraw, setOpenWithdraw] = useState(false);
  const [addAmount, setAddAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const handleOpenAddFunds = () => setOpenAddFunds(true);
  const handleCloseAddFunds = () => setOpenAddFunds(false);
  const handleOpenWithdraw = () => setOpenWithdraw(true);
  const handleCloseWithdraw = () => setOpenWithdraw(false);

  const handleAddFundsSubmit = (e) => {
    e.preventDefault();
    // Add logic to handle adding funds (e.g., API call)
    console.log("Adding funds:", addAmount);
    setAddAmount("");
    handleCloseAddFunds();
  };

  const handleWithdrawSubmit = (e) => {
    e.preventDefault();
    console.log("Withdrawing funds:", withdrawAmount);
    setWithdrawAmount("");
    handleCloseWithdraw();
  };

  // tab
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  //fake data
  const subscriptionsData = [
    {
      id: "TXN-SUB-001",
      date: "05/01/2024",
      type: "Wallet Balance",
      description: "Premium Subscription Extension",
      amount: "-$29.99",
      status: "completed",
      duration: "1 month",
    },
    {
      id: "TXN-WITH-001",
      date: "10/01/2024",
      type: "Bank Account",
      description: "Wallet Withdrawal to Bank",
      amount: "-$50.00",
      status: "processing",
    },
    {
      id: "TXN-SUB-002",
      date: "05/01/2024",
      type: "Wallet Balance",
      description: "Basic Plan Extension",
      amount: "-$15.99",
      status: "completed",
      duration: "1 month",
    },
  ];

  // Dummy data for Deposits & Refunds
  const depositsData = [
    {
      id: "TXN-ADD-001",
      date: "20/01/2024",
      type: "Visa ****1234",
      description: "Add Funds via Credit Card",
      amount: "+$100.00",
      status: "completed",
    },
    {
      id: "TXN-ADD-002",
      date: "05/01/2024",
      type: "PayPal",
      description: "Add Funds via PayPal",
      amount: "+$75.00",
      status: "completed",
    },
  ];

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
            <div className="wallet-balance">
              <div className="wallet-balance-des">
                <Typography
                  sx={{
                    fontSize: "40px",
                    color: "#007a00",
                    fontWeight: "bold",
                  }}
                >
                  $25.50
                </Typography>
                <span>Available Balance</span>
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
                  With draw
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
            {/* Tab content for Subscriptions & Withdrawals */}
            <TabPanelRecent value={value} index={0}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Chip label="All" color="default" sx={{ mr: 1 }} />
                <Chip label="Plus Money" color="success" sx={{ mr: 1 }} />
                <Chip label="Minus Money" color="error" />
              </Box>
              {subscriptionsData.map((item) => (
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
                >
                  <Box>
                    <Typography variant="body1">{item.description}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {item.date} {item.type}{" "}
                      {item.status === "completed" && "completed"}
                      {item.duration && ` - Duration: ${item.duration}`}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      ID: {item.id}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body1"
                    color={item.amount.startsWith("-") ? "error" : "success"}
                  >
                    {item.amount}
                  </Typography>
                </Box>
              ))}
            </TabPanelRecent>
            {/* Tab content for Deposits & Refunds */}
            <TabPanelRecent value={value} index={1}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Chip label="All" color="default" sx={{ mr: 1 }} />
                <Chip label="Plus Money" color="success" sx={{ mr: 1 }} />
                <Chip label="Minus Money" color="error" />
              </Box>
              {depositsData.map((item) => (
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
                >
                  <Box>
                    <Typography variant="body1">{item.description}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {item.date} {item.type}{" "}
                      {item.status === "completed" && "completed"}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      ID: {item.id}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body1"
                    color={item.amount.startsWith("-") ? "error" : "success"}
                  >
                    {item.amount}
                  </Typography>
                </Box>
              ))}
            </TabPanelRecent>
          </div>
        </div>
      </div>

      <ModalWallet
        open={openAddFunds}
        handleClose={handleCloseAddFunds}
        title="Add Funds to Wallet"
        description="Add money to your wallet for container deposits and fees"
        amount={addAmount}
        setAmount={setAddAmount}
        handleSubmit={handleAddFundsSubmit}
        action="add"
      />
      <ModalWallet
        open={openWithdraw}
        handleClose={handleCloseWithdraw}
        title="Withdraw Funds to Wallet"
        description="Withdraw Funds to your wallet for container deposits and fees"
        amount={withdrawAmount}
        setAmount={setWithdrawAmount}
        handleSubmit={handleWithdrawSubmit}
        action="withdraw"
      />
    </>
  );
}

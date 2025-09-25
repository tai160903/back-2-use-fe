import Typography from "@mui/material/Typography";
import { IoQrCodeOutline } from "react-icons/io5";
import "./TransactionHistory.css";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { IoIosSearch } from "react-icons/io";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import { FaArrowUpLong } from "react-icons/fa6";
import { MdOutlineQrCode2 } from "react-icons/md";
import { FiBox } from "react-icons/fi";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { MdOutlineRemoveRedEye } from "react-icons/md";

// ================== Fake Data ==================
const transactions = [
  {
    id: 1,
    name: "Unknown Item",
    image:
      "https://www.nguyenlieutrasua.com/cdn/shop/products/D5A9827_large.jpg?v=1596429456",
    qr: "QR002",
    material: "Stainless Steel",
    date: "22/1/2024",
    due: "24/1/2024",
    type: "Borrow",
    status: "failed",
    overdueDays: 611,
    fee: 1833,
    deposit: -5,
    count: 3,
  },
  {
    id: 2,
    name: "Unknown Item",
    qr: "QR001",
    material: "Bamboo Fiber",
    date: "20/1/2024",
    due: "22/1/2024",
    type: "return",
    status: "success",
    deposit: -3,
    receive: 3,
    reward: 15,
    count: 2,
  },
  {
    id: 3,
    name: "Unknown Item",
    qr: "QR003",
    material: "Plastic",
    date: "21/1/2024",
    due: "23/1/2024",
    type: "borrow",
    status: "success",
    deposit: -2,
    count: 1,
  },
];

// ================== Card Components ==================
function BorrowCard({ item }) {
  return (
    <Box className="borrow-card" p={2} mb={2} borderRadius="10px">
      <div className="borrow-container">
        <div className="borrow-content-title">
          <Typography className="borrow-content-type">
            <FaArrowUpLong className="borrow-content-icons" /> {item.type}
          </Typography>
          <Typography className="borrow-content-status">
            {item.status}
          </Typography>
        </div>
        <div className="borrow-content">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div className="borrow-content-info">
              <img
                src={item.image || "https://via.placeholder.com/150"}
                alt={item.name}
                className="borrow-content-image"
              />
              <div style={{ marginLeft: "20px", color: "#8c8987" }}>
                <Typography variant="h6" className="borrow-content-name">
                  {item.name}
                  <div className="borrow-content-count">{item.count}</div>
                </Typography>
                <Typography variant="body2" className="borrow-content-qr">
                  <MdOutlineQrCode2 /> {item.qr}
                </Typography>
                <Typography variant="body2" className="borrow-content-material">
                  <FiBox />
                  Material: {item.material}
                </Typography>
                <div className="borrow-content-time">
                  <Typography
                    variant="body2"
                    className="borrow-content-material"
                  >
                    {" "}
                    <RiCalendarScheduleLine />
                    Borrowed: {item.due}
                  </Typography>
                  <Typography
                    variant="body2"
                    className="borrow-content-material"
                  >
                    {" "}
                    <RiCalendarScheduleLine />
                    Due: {item.due}
                  </Typography>
                </div>
              </div>
            </div>
            <div className="borrow-content-right">
              <Typography>Deposit: {item.deposit}$</Typography>
              <Button className="borrow-content-btn">
                <MdOutlineRemoveRedEye style={{ fontSize: "20px" }} /> View Details
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
}

function SuccessCard({ item }) {
  return (
    <Box className="success-card" p={2} mb={2} borderRadius="10px">
      <Typography variant="h6">{item.name}</Typography>
      <Typography variant="body2">QR: {item.qr}</Typography>
      <Typography variant="body2">Material: {item.material}</Typography>
      <Typography variant="body2">Borrowed: {item.date}</Typography>
      <Typography variant="body2">Due: {item.due}</Typography>
      <Typography>Deposit: {item.deposit}$</Typography>
      {item.receive && <Typography>Receive: {item.receive}$</Typography>}
      {item.reward && <Typography>Reward Points: {item.reward}</Typography>}
      <Button variant="contained" color="success" size="small" sx={{ mt: 1 }}>
        Complete
      </Button>
    </Box>
  );
}

function FailedCard({ item }) {
  return (
    <Box className="failed-card" p={2} mb={2} borderRadius="10px">
      <Typography variant="h6">{item.name}</Typography>
      <Typography variant="body2">QR: {item.qr}</Typography>
      <Typography variant="body2">Material: {item.material}</Typography>
      <Typography variant="body2">Borrowed: {item.date}</Typography>
      <Typography variant="body2">Due: {item.due}</Typography>
      <Typography color="error">Failed transaction</Typography>
      <Typography>Deposit: {item.deposit}$</Typography>
      <Button variant="contained" color="error" size="small" sx={{ mt: 1 }}>
        Retry
      </Button>
    </Box>
  );
}

// ================== Main Component ==================
export default function TransactionHistory() {
  const [status, setStatus] = useState("all");
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getFilteredData = () => {
    if (value === 0) return transactions;
    if (value === 1) return transactions.filter((t) => t.type === "borrow");
    if (value === 2) return transactions.filter((t) => t.status === "success");
    if (value === 3) return transactions.filter((t) => t.status === "failed");
    return transactions;
  };

  const filteredData = getFilteredData();

  return (
    <div className="transaction">
      <div className="transaction-container">
        {/* Header */}
        <div className="transaction-header">
          <Typography className="transaction-title text-black">
            <IoQrCodeOutline className="mr-2 size-10 text-green-400" />
            Transaction History
          </Typography>
          <span style={{ color: "#838383" }}>
            View all your borrowing and return activities
          </span>
        </div>

        {/* Search & filter */}
        <div className="transaction-search">
          <TextField
            placeholder="Search by transaction ID or QR code..."
            variant="outlined"
            size="small"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IoIosSearch size={20} color="#666" />
                </InputAdornment>
              ),
            }}
            style={{ height: "40px" }}
          />

          {/* Filter dropdown */}
          <FormControl
            variant="outlined"
            size="small"
            style={{ minWidth: 150, height: "40px" }}
            className={`filter-select ${status}`}
          >
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="success">Success</MenuItem>
              <MenuItem value="failed">Failed</MenuItem>
            </Select>
          </FormControl>
        </div>

        {/* Tabs */}
        <div className="transaction-tabar">
          <Tabs
            value={value}
            onChange={handleChange}
            variant="fullWidth"
            TabIndicatorProps={{ style: { display: "none" } }}
            className="tab-list"
          >
            <Tab
              label="All"
              className={`tab-item ${value === 0 ? "active" : ""}`}
            />
            <Tab
              label="Borrow"
              className={`tab-item ${value === 1 ? "active" : ""}`}
            />
            <Tab
              label="Return Success"
              className={`tab-item ${value === 2 ? "active" : ""}`}
            />
            <Tab
              label="Return Failed"
              className={`tab-item ${value === 3 ? "active" : ""}`}
            />
          </Tabs>
        </div>

        {/* Render Cards */}
        <div className="transaction-list">
          {filteredData.map((item) => {
            if (item.type === "borrow")
              return <BorrowCard key={item.id} item={item} />;
            if (item.status === "success")
              return <SuccessCard key={item.id} item={item} />;
            if (item.status === "failed")
              return <FailedCard key={item.id} item={item} />;
            return null;
          })}
        </div>
      </div>
    </div>
  );
}

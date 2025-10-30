import Typography from "@mui/material/Typography";
import { IoQrCodeOutline } from "react-icons/io5";
import "../../Home/TransactionHistory/TransactionHistory.css";
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
import { CiWarning } from "react-icons/ci";
import { MdOutlineFeedback } from "react-icons/md";

// ================== Fake Data ==================
const transactions = [
  {
    id: 1,
    name: "Unknown Item",
    image:
      "https://www.nguyenlieutrasua.com/cdn/shop/products/D5A9827_large.jpg?v=1596429456",
    qr: "QR002",
    material: "Stainless Steel",
    date: "22/9/2025",
    due: "30/1/2025",
    type: "Return Failed",
    status: "failed",
    overdueDays: 5,
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
    type: "Return Success",
    status: "complete",
    deposit: -3,
    receive: 3,
    reward: 15,
    count: 2,
    fee: 1833,
    overdueDays: 5,
  },
  {
    id: 3,
    name: "Unknown Item",
    qr: "QR003",
    material: "Plastic",
    date: "21/1/2024",
    due: "23/1/2024",
    type: "Borrow",
    status: "complete",
    deposit: -2,
    count: 1,
    overdueDays: 5,
    fee: 1833,
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
          <div className="borrow-content-status-wrapper">
            <Typography className="borrow-content-status">
              {item.status}
            </Typography>
          </div>
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
                  <FiBox /> Material: {item.material}
                </Typography>
                <div className="borrow-content-time">
                  <Typography
                    variant="body2"
                    className="borrow-content-material"
                  >
                    <RiCalendarScheduleLine /> Borrowed: {item.date}
                  </Typography>
                  <Typography
                    variant="body2"
                    className="borrow-content-material"
                  >
                    <RiCalendarScheduleLine /> Due: {item.due}
                  </Typography>
                </div>
                {/* Overdue đưa ngay dưới info */}

                <div className="borrow-content-overdue">
                  <Typography className="borrow-content-overdue-title">
                    <CiWarning style={{ marginRight: "10px" }} /> Overdue by{" "}
                    {item.overdueDays} days <br />
                  </Typography>
                  <Typography>Total charge fee: ${item.fee}</Typography>
                </div>
              </div>
            </div>
            <div className="borrow-content-right">
              <Typography>
                Deposit:{" "}
                <span style={{ color: "#cc3500", fontWeight: "bold" }}>
                  {item.deposit} $
                </span>
              </Typography>
              <Button className="borrow-content-btn">
                <MdOutlineRemoveRedEye style={{ fontSize: "20px" }} /> View
                Details
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
    <Box className="borrow-card-success" p={2} mb={2} borderRadius="10px">
      <div className="borrow-container">
        <div className="borrow-content-title">
          <Typography className="borrow-content-type-success">
            <FaArrowUpLong className="borrow-content-icons" /> {item.type}
          </Typography>
          <div className="borrow-content-status-wrapper">
            <Typography className="borrow-content-status">
              {item.status}
            </Typography>
          </div>
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
                  <FiBox /> Material: {item.material}
                </Typography>
                <div className="borrow-content-time">
                  <Typography
                    variant="body2"
                    className="borrow-content-material"
                  >
                    <RiCalendarScheduleLine /> Borrowed: {item.date}
                  </Typography>
                  <Typography
                    variant="body2"
                    className="borrow-content-material"
                  >
                    <RiCalendarScheduleLine /> Due: {item.due}
                  </Typography>
                </div>
                {/* Overdue đưa ngay dưới info */}

                <div className="borrow-content-overdue-success">
                  <Typography className="borrow-content-overdue-title">
                    <CiWarning style={{ marginRight: "10px" }} /> Late return
                    but within allowed time{" "}
                  </Typography>
                  <div style={{ display: "flex" }}>
                    <Typography>
                      <Typography>Late fee: $2.00 | </Typography>
                    </Typography>
                    <Typography> Total returned: ${item.fee}</Typography>
                  </div>
                </div>
              </div>
            </div>
            <div className="borrow-content-right-success">
              <Typography sx={{ marginLeft: "10px" }}>
                Deposit:{" "}
                <span style={{ color: "#cc3500", fontWeight: "bold" }}>
                  {item.deposit} $
                </span>
              </Typography>
              <Typography sx={{ marginLeft: "10px", marginTop: "10px" }}>
                Late fee:{" "}
                <span style={{ color: "#cc3500", fontWeight: "bold" }}>
                  {item.deposit} $
                </span>
              </Typography>

              <div className="borrow-receivePoint">
                <Typography>
                  Receive Money: {}
                  <span style={{ color: "#36c775", fontWeight: "bold" }}>
                    {item.deposit} $
                  </span>
                </Typography>
              </div>
              <div className="borrow-rewardPoint">
                <Typography>
                  Reward Points: {}
                  <span style={{ color: "#365bbf", fontWeight: "600" }}>
                    + {}15 points
                  </span>
                </Typography>
              </div>
              <div className="borrow-legitPoint">
                <Typography>
                  Legit Points: {}
                  <span style={{ color: "#8200de", fontWeight: "600" }}>
                    + {}30 points
                  </span>
                </Typography>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <Button className="borrow-content-btn">
                  <MdOutlineFeedback style={{ fontSize: "20px" }} /> Feedback
                </Button>
                <Button className="borrow-content-btn">
                  <MdOutlineRemoveRedEye style={{ fontSize: "20px" }} /> View
                  Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
}

function FailedCard({ item }) {
  return (
    <Box className="borrow-card-failed" p={2} mb={2} borderRadius="10px">
      <div className="borrow-container">
        <div className="borrow-content-title">
          <Typography className="borrow-content-type">
            <FaArrowUpLong className="borrow-content-icons" /> {item.type}
          </Typography>
          <div className="borrow-content-status-wrapper">
            <Typography className="borrow-content-status-failed">
              {item.status}
            </Typography>
          </div>
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
                  <FiBox /> Material: {item.material}
                </Typography>
                <div className="borrow-content-time">
                  <Typography
                    variant="body2"
                    className="borrow-content-material"
                  >
                    <RiCalendarScheduleLine /> Borrowed: {item.date}
                  </Typography>
                  <Typography
                    variant="body2"
                    className="borrow-content-material"
                  >
                    <RiCalendarScheduleLine /> Due: {item.due}
                  </Typography>
                </div>
                {/* Overdue đưa ngay dưới info */}

                <div className="borrow-content-overdue-failed">
                  <Typography className="borrow-content-overdue-title">
                    <CiWarning style={{ marginRight: "10px" }} /> Late return
                    but within allowed time{" "}
                  </Typography>
                  <div style={{ display: "flex" }}>
                    <Typography>
                      <Typography>Late fee: $2.00 | </Typography>
                    </Typography>
                    <Typography> Total returned: ${item.fee}</Typography>
                  </div>
                </div>
              </div>
            </div>
            <div className="borrow-content-right-success">
              <Typography sx={{ marginLeft: "10px" }}>
                Deposit:{" "}
                <span style={{ color: "#cc3500", fontWeight: "bold" }}>
                  {item.deposit} $
                </span>
              </Typography>

              <div className="borrow-receivePoint">
                <Typography>
                  Receive Money: {}
                  <span style={{ color: "#c64b4f", fontWeight: "bold" }}>
                    {item.deposit} $
                  </span>
                </Typography>
              </div>

              <div className="borrow-legitPoint-failed">
                <Typography>
                  Legit Points: {}
                  <span style={{ color: "#df4d56", fontWeight: "600" }}>
                    - {}30 points
                  </span>
                </Typography>
              </div>
              <div className="borrow-failedPoint">
                <Typography>No refund due to failed return</Typography>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <Button className="borrow-content-btn">
                  <MdOutlineFeedback style={{ fontSize: "20px" }} /> Feedback
                </Button>
                <Button className="borrow-content-btn">
                  <MdOutlineRemoveRedEye style={{ fontSize: "20px" }} /> View
                  Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
}

// ================== Main Component ==================
export default function BusinessTransaction() {
  const [status, setStatus] = useState("all");
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getFilteredData = () => {
    if (value === 0) return transactions;
    if (value === 1) return transactions.filter((t) => t.type === "Borrow");
    if (value === 2)
      return transactions.filter((t) => t.type === "Return Success");
    if (value === 3)
      return transactions.filter((t) => t.type === "Return Failed");
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
            if (item.type === "Borrow")
              return <BorrowCard key={item.id} item={item} />;
            if (item.type === "Return Success")
              return <SuccessCard key={item.id} item={item} />;
            if (item.type === "Return Failed")
              return <FailedCard key={item.id} item={item} />;
            return null;
          })}
        </div>
      </div>
    </div>
  );
}

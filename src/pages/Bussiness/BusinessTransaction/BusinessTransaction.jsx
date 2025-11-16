import Typography from "@mui/material/Typography";
import { IoQrCodeOutline } from "react-icons/io5";
import "../../Home/TransactionHistory/TransactionHistory.css";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { IoIosSearch } from "react-icons/io";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { getTransactionHistoryBusinessApi } from "../../../store/slices/borrowSlice";

// ================== Card Components ==================
function BorrowCard({ item }) {
  const product = item.productId || {};
  const productGroup = product.productGroupId || {};
  const materialObj = productGroup.materialId || {};
  const sizeObj = product.productSizeId || {};

  const name = productGroup.name || "Unknown Item";
  const image =
    productGroup.imageUrl ||
    product.imageUrl ||
    "https://via.placeholder.com/150";
  const qr = item.qrCode || product.qrCode || product.serialNumber || "N/A";
  const material = materialObj.materialName || "N/A";
  const size = sizeObj.sizeName;

  const toVNDate = (d) =>
    d ? new Date(d).toLocaleDateString("vi-VN") : "N/A";

  const date = toVNDate(item.borrowDate || item.createdAt);
  const due = toVNDate(item.dueDate);
  const deposit = item.depositAmount || 0;
  const status = item.status || "unknown";

  const rawType = item.borrowTransactionType;
  let typeLabel = rawType;
  if (rawType === "borrow") typeLabel = "Borrow";
  if (rawType === "return_success") typeLabel = "Return Success";
  if (rawType === "return_failed") typeLabel = "Return Failed";

  const overdueDays = item.overdueDays || 0;
  const fee = item.totalChargeFee || item.fee || 0;

  return (
    <Box className="borrow-card" p={2} mb={2} borderRadius="10px">
      <div className="borrow-container">
        <div className="borrow-content-title">
          <Typography className="borrow-content-type">
            <FaArrowUpLong className="borrow-content-icons" /> {typeLabel}
          </Typography>
          <div className="borrow-content-status-wrapper">
            <Typography className="borrow-content-status">
              {status}
            </Typography>
          </div>
        </div>
        <div className="borrow-content">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div className="borrow-content-info">
              <img
                src={image}
                alt={name}
                className="borrow-content-image"
              />
              <div style={{ marginLeft: "20px", color: "#8c8987" }}>
                <Typography variant="h6" className="borrow-content-name">
                  {name}
                  {size && (
                    <div className="borrow-content-count">{size}</div>
                  )}
                </Typography>
                <Typography variant="body2" className="borrow-content-qr">
                  <MdOutlineQrCode2 /> {qr}
                </Typography>
                <Typography variant="body2" className="borrow-content-material">
                  <FiBox /> Material: {material}
                </Typography>
                <div className="borrow-content-time">
                  <Typography
                    variant="body2"
                    className="borrow-content-material"
                  >
                    <RiCalendarScheduleLine /> Borrowed: {date}
                  </Typography>
                  <Typography
                    variant="body2"
                    className="borrow-content-material"
                  >
                    <RiCalendarScheduleLine /> Due: {due}
                  </Typography>
                </div>
                {/* Overdue đưa ngay dưới info */}

                <div className="borrow-content-overdue">
                  <Typography className="borrow-content-overdue-title">
                    <CiWarning style={{ marginRight: "10px" }} /> Overdue by{" "}
                    {overdueDays} days <br />
                  </Typography>
                  <Typography>
                    Total charge fee: {fee.toLocaleString("vi-VN")} VNĐ
                  </Typography>
                </div>
              </div>
            </div>
            <div className="borrow-content-right">
              <Typography>
                Deposit:{" "}
                <span style={{ color: "#36c775", fontWeight: "bold" }}>
                  {deposit.toLocaleString("vi-VN")} VNĐ
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
  const product = item.productId || {};
  const productGroup = product.productGroupId || {};
  const materialObj = productGroup.materialId || {};
  const sizeObj = product.productSizeId || {};

  const name = productGroup.name || "Unknown Item";
  const image =
    productGroup.imageUrl ||
    product.imageUrl ||
    "https://via.placeholder.com/150";
  const qr = item.qrCode || product.qrCode || product.serialNumber || "N/A";
  const material = materialObj.materialName || "N/A";
  const size = sizeObj.sizeName;

  const toVNDate = (d) =>
    d ? new Date(d).toLocaleDateString("vi-VN") : "N/A";

  const date = toVNDate(item.borrowDate || item.createdAt);
  const due = toVNDate(item.dueDate);
  const deposit = item.depositAmount || 0;
  const status = item.status || "unknown";

  const rawType = item.borrowTransactionType;
  let typeLabel = rawType;
  if (rawType === "borrow") typeLabel = "Borrow";
  if (rawType === "return_success") typeLabel = "Return Success";
  if (rawType === "return_failed") typeLabel = "Return Failed";

  const fee = item.totalChargeFee || item.fee || 0;

  return (
    <Box className="borrow-card-success" p={2} mb={2} borderRadius="10px">
      <div className="borrow-container">
        <div className="borrow-content-title">
          <Typography className="borrow-content-type-success">
            <FaArrowUpLong className="borrow-content-icons" /> {typeLabel}
          </Typography>
          <div className="borrow-content-status-wrapper">
            <Typography className="borrow-content-status">
              {status}
            </Typography>
          </div>
        </div>
        <div className="borrow-content">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div className="borrow-content-info">
              <img
                src={image}
                alt={name}
                className="borrow-content-image"
              />
              <div style={{ marginLeft: "20px", color: "#8c8987" }}>
                <Typography variant="h6" className="borrow-content-name">
                  {name}
                  {size && (
                    <div className="borrow-content-count">{size}</div>
                  )}
                </Typography>
                <Typography variant="body2" className="borrow-content-qr">
                  <MdOutlineQrCode2 /> {qr}
                </Typography>
                <Typography variant="body2" className="borrow-content-material">
                  <FiBox /> Material: {material}
                </Typography>
                <div className="borrow-content-time">
                  <Typography
                    variant="body2"
                    className="borrow-content-material"
                  >
                    <RiCalendarScheduleLine /> Borrowed: {date}
                  </Typography>
                  <Typography
                    variant="body2"
                    className="borrow-content-material"
                  >
                    <RiCalendarScheduleLine /> Due: {due}
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
                    <Typography>
                      {" "}
                      Total returned: {fee.toLocaleString("vi-VN")} VNĐ
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
            <div className="borrow-content-right-success">
              <Typography sx={{ marginLeft: "10px" }}>
                Deposit:{" "}
                <span style={{ color: "#36c775", fontWeight: "bold" }}>
                  {deposit.toLocaleString("vi-VN")} VNĐ
                </span>
              </Typography>
              <Typography sx={{ marginLeft: "10px", marginTop: "10px" }}>
                Late fee:{" "}
                <span style={{ color: "#36c775", fontWeight: "bold" }}>
                  {fee.toLocaleString("vi-VN")} VNĐ
                </span>
              </Typography>

              <div className="borrow-receivePoint">
                <Typography>
                  Receive Money: {}
                  <span style={{ color: "#c64b4f", fontWeight: "bold" }}>
                    {deposit.toLocaleString("vi-VN")} VNĐ
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
                <span style={{ color: "#36c775", fontWeight: "bold" }}>
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
  const dispatch = useDispatch();
  const { borrow, isLoading } = useSelector((state) => state.borrow);

  const [status, setStatus] = useState("");
  const [searchText, setSearchText] = useState("");
  const [value, setValue] = useState(0);

  const transactions = Array.isArray(borrow) ? borrow : [];

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Gọi API mỗi khi filter thay đổi (giống TransactionHistory)
  useEffect(() => {
    let borrowTransactionType;
    if (value === 1) borrowTransactionType = "borrow";
    if (value === 2) borrowTransactionType = "return_success";
    if (value === 3) borrowTransactionType = "return_failed";

    dispatch(
      getTransactionHistoryBusinessApi({
        status: status || undefined,
        productName: searchText || undefined,
        borrowTransactionType,
      })
    );
  }, [dispatch, status, searchText, value]);

  const filteredData = transactions;

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
            placeholder="Search by product name..."
            variant="outlined"
            size="small"
            fullWidth
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
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
            style={{ minWidth: 220, height: "40px" }}
            className="filter-select"
          >
            <Select
              value={status}
              displayEmpty
              onChange={(e) => setStatus(e.target.value)}
              renderValue={(selected) => {
                if (!selected) {
                  return "--";
                }
                return selected;
              }}
            >
              <MenuItem value="">
                <em>--</em>
              </MenuItem>
              <MenuItem value="pending_pickup">pending_pickup</MenuItem>
              <MenuItem value="borrowing">borrowing</MenuItem>
              <MenuItem value="returned">returned</MenuItem>
              <MenuItem value="return_late">return_late</MenuItem>
              <MenuItem value="rejected">rejected</MenuItem>
              <MenuItem value="lost">lost</MenuItem>
              <MenuItem value="canceled">canceled</MenuItem>
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
          {isLoading ? (
            <Typography style={{ marginTop: "16px" }}>
              Đang tải lịch sử giao dịch...
            </Typography>
          ) : filteredData.length === 0 ? (
            <Typography style={{ marginTop: "16px" }}>
              Không có giao dịch nào.
            </Typography>
          ) : (
            filteredData.map((item) => {
              if (item.borrowTransactionType === "borrow")
                return <BorrowCard key={item._id} item={item} />;
              if (item.borrowTransactionType === "return_success")
                return <SuccessCard key={item._id} item={item} />;
              if (item.borrowTransactionType === "return_failed")
                return <FailedCard key={item._id} item={item} />;
              return <BorrowCard key={item._id} item={item} />;
            })
          )}
        </div>
      </div>
    </div>
  );
}

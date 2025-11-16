import Typography from "@mui/material/Typography";
import { IoQrCodeOutline } from "react-icons/io5";
import "./TransactionHistory.css";
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
import { MdOutlineFeedback } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { getTransactionHistoryApi } from "../../../store/slices/borrowSlice";

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
              </div>
            </div>
            <div className="borrow-content-right">
              <Typography>
                Deposit:{" "}
                <span style={{ color: "#cc3500", fontWeight: "bold" }}>
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
              </div>
            </div>
            <div className="borrow-content-right-success">
              <Typography sx={{ marginLeft: "10px" }}>
                Deposit:{" "}
                <span style={{ color: "#cc3500", fontWeight: "bold" }}>
                  {deposit.toLocaleString("vi-VN")} VNĐ
                </span>
              </Typography>

              <div className="borrow-receivePoint">
                <Typography>
                  Receive Money:
                  <span style={{ color: "#36c775", fontWeight: "bold" }}>
                    {" "}
                    {deposit.toLocaleString("vi-VN")} VNĐ
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

  return (
    <Box className="borrow-card-failed" p={2} mb={2} borderRadius="10px">
      <div className="borrow-container">
        <div className="borrow-content-title">
          <Typography className="borrow-content-type">
            <FaArrowUpLong className="borrow-content-icons" /> {typeLabel}
          </Typography>
          <div className="borrow-content-status-wrapper">
            <Typography className="borrow-content-status-failed">
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
              </div>
            </div>
            <div className="borrow-content-right-success">
              <Typography sx={{ marginLeft: "10px" }}>
                Deposit:{" "}
                <span style={{ color: "#cc3500", fontWeight: "bold" }}>
                  {deposit.toLocaleString("vi-VN")} VNĐ
                </span>
              </Typography>

              <div className="borrow-receivePoint">
                <Typography>
                  Receive Money:
                  <span style={{ color: "#c64b4f", fontWeight: "bold" }}>
                    {" "}
                    {deposit.toLocaleString("vi-VN")} VNĐ
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

export default function TransactionHistory() {
  const dispatch = useDispatch();
  const { borrow, isLoading } = useSelector((state) => state.borrow);

  // trạng thái filter
  const [status, setStatus] = useState("");
  const [searchText, setSearchText] = useState("");
  const [value, setValue] = useState(0); // tab hiện tại

  const transactions = Array.isArray(borrow) ? borrow : [];

  // call API mỗi khi filter thay đổi
  useEffect(() => {
    // map tab -> borrowTransactionType
    let borrowTransactionType;
    if (value === 1) borrowTransactionType = "borrow";
    if (value === 2) borrowTransactionType = "return_success";
    if (value === 3) borrowTransactionType = "return_failed";

    dispatch(
      getTransactionHistoryApi({
        status: status || undefined,
        productName: searchText || undefined,
        borrowTransactionType,
      })
    );
  }, [dispatch, status, searchText, value]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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

          {/* Filter dropdown - status */}
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
              // fallback
              return <BorrowCard key={item._id} item={item} />;
            })
          )}
        </div>
      </div>
    </div>
  );
}

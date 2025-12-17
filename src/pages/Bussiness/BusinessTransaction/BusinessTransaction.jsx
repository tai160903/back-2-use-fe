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
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Divider,
  Pagination,
  Stack,
} from "@mui/material";
import { FaArrowUpLong } from "react-icons/fa6";
import { MdOutlineQrCode2 } from "react-icons/md";
import { FiBox, FiUser, FiShoppingBag, FiRefreshCw } from "react-icons/fi";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { CiWarning } from "react-icons/ci";
import { MdOutlineFeedback } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  getTransactionHistoryBusinessApi,
  getDetailsBorrowTransactionBusinessApi,
} from "../../../store/slices/borrowSlice";

// ============ Timing Helpers (similar to customer TransactionHistory) ============
const MS_PER_DAY = 1000 * 60 * 60 * 24;
const diffDaysCeil = (later, earlier) => {
  const diff = later.getTime() - earlier.getTime();
  return Math.ceil(diff / MS_PER_DAY);
};

// Calculate timing info for borrowing/return: how long until due or how late
const getTimingInfo = (item) => {
  if (!item) return null;

  const now = new Date();
  const dueDate = item.dueDate ? new Date(item.dueDate) : null;
  const returnDate = item.returnDate ? new Date(item.returnDate) : null;
  const status = item.status || "";

  if (!dueDate) return null;

  // Borrowing or pending pickup
  if (status === "borrowing" || status === "pending_pickup") {
    const daysLeft = diffDaysCeil(dueDate, now);

    if (daysLeft > 0) {
      return {
        type: "upcoming",
        message: `${daysLeft} day(s) left until due date.`,
      };
    }

    if (daysLeft === 0) {
      return {
        type: "due_today",
        message: "Today is the due date for this container.",
      };
    }

    const daysLate = Math.abs(daysLeft);
    return {
      type: "late",
      message: `Overdue by ${daysLate} day(s) past the due date.`,
    };
  }

  // Returned: compare returnDate (if any) with dueDate
  if (status === "return_late" || status === "returned") {
    const base = returnDate || now;
    const diff = diffDaysCeil(base, dueDate);

    if (diff > 0) {
      return {
        type: "late",
        message: `Returned late by ${diff} day(s) past the due date.`,
      };
    }

    if (diff === 0) {
      return {
        type: "on_time",
        message: "Returned on the due date.",
      };
    }

    const earlyDays = Math.abs(diff);
    return {
      type: "early",
      message: `Returned ${earlyDays} day(s) early before the due date.`,
    };
  }

  return null;
};

// ================== Card Components ==================
function BorrowCard({ item }) {
  const product = item.productId || {};
  const productGroup = product.productGroupId || {};
  const sizeObj = product.productSizeId || {};
  const customer = item.customerId || {};

  const name = productGroup.name || "Unknown Item";
  const image =
    productGroup.imageUrl ||
    product.imageUrl ||
    "https://via.placeholder.com/150";
  
  const size = sizeObj.sizeName;

  // Ưu tiên fullName, nếu không có thì hiển thị email
  const customerEmail = customer.userId?.email || customer.email || "N/A";
  const customerName = customer.fullName || customerEmail;
  const quantity = item.quantity || 1;
  const extensions = item.extensionCount || 0;

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
               
                <div
                  style={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 16,
                      flexWrap: "wrap",
                    }}
                  >
                    <Typography
                      variant="body2"
                      className="borrow-content-material"
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <FiUser /> User: {customerName} 
                    </Typography>
                    {item.returnDate && (
                      <Typography
                        variant="body2"
                        className="borrow-content-material"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          whiteSpace: "nowrap",
                        }}
                      >
                        <RiCalendarScheduleLine />
                        Returned: {toVNDate(item.returnDate)}
                      </Typography>
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 16,
                      flexWrap: "wrap",
                    }}
                  >
                    <Typography
                      variant="body2"
                      className="borrow-content-material"
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <FiShoppingBag /> Items: {quantity}
                    </Typography>
                    <Typography
                      variant="body2"
                      className="borrow-content-material"
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <FiRefreshCw /> Extensions: {extensions}
                    </Typography>
                  </div>
                </div>
                {/* Timing info (days left / late / early) and fee */}
                {getTimingInfo(item) && (
                  <div className="borrow-content-overdue">
                    <Typography className="borrow-content-overdue-title">
                      <CiWarning style={{ marginRight: "10px" }} />
                      {getTimingInfo(item).message}
                    </Typography>
                    {fee > 0 && (
                      <Typography>
                        Total charge fee: {fee.toLocaleString("vi-VN")} VNĐ
                      </Typography>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="borrow-content-right">
              <Typography>
                Deposit:{" "}
                <span style={{ color: "#36c775", fontWeight: "bold" }}>
                  {deposit.toLocaleString("vi-VN")} VNĐ
                </span>
              </Typography>
              <div style={{ display: "flex", gap: "10px" }}>
                <Button
                  className="borrow-content-btn"
                  onClick={item.onViewDetails}
                >
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

function SuccessCard({ item }) {
  const product = item.productId || {};
  const productGroup = product.productGroupId || {};
  const sizeObj = product.productSizeId || {};
  const customer = item.customerId || {};
  const ecoPointChanged = item.ecoPointChanged ?? null;

  const name = productGroup.name || "Unknown Item";
  const image =
    productGroup.imageUrl ||
    product.imageUrl ||
    "https://via.placeholder.com/150";
  
  const size = sizeObj.sizeName;

  // Ưu tiên fullName, nếu không có thì hiển thị email
  const customerEmail = customer.userId?.email || customer.email || "N/A";
  const customerName = customer.fullName || customerEmail;
  const quantity = item.quantity || 1;
  const extensions = item.extensionCount || 0;

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

  // Ưu tiên lấy late fee từ walletTransaction.amount (theo response API)
  const walletLateFee =
    item.walletTransaction && item.walletTransaction.amount != null
      ? item.walletTransaction.amount
      : null;

  // Fallback sang các field khác nếu không có trong walletTransaction
  const fee =
    walletLateFee != null
      ? walletLateFee
      : item.amount != null
      ? item.amount
      : item.fee || 0;

  // Số tiền business thực nhận: Deposit - Late fee (không âm)
  const receiveMoney = Math.max((deposit || 0) - (fee || 0), 0);

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
                {/* Customer, quantity, extensions + returned date (nằm ngang, có icon) */}
                <div
                  style={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 16,
                      flexWrap: "wrap",
                    }}
                  >
                    <Typography
                      variant="body2"
                      className="borrow-content-material"
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <FiUser /> User: {customerName}
                    </Typography>
                    {item.returnDate && (
                      <Typography
                        variant="body2"
                        className="borrow-content-material"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          whiteSpace: "nowrap",
                        }}
                      >
                        <RiCalendarScheduleLine />
                        Returned: {toVNDate(item.returnDate)}
                      </Typography>
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 16,
                      flexWrap: "wrap",
                    }}
                  >
                    <Typography
                      variant="body2"
                      className="borrow-content-material"
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <FiShoppingBag /> Items: {quantity}
                    </Typography>
                    <Typography
                      variant="body2"
                      className="borrow-content-material"
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <FiRefreshCw /> Extensions: {extensions}
                    </Typography>
                  </div>
                </div>
                {/* Timing info & late fee */}
                {getTimingInfo(item) && (
                  <div className="borrow-content-overdue-success">
                    <Typography className="borrow-content-overdue-title">
                      <CiWarning style={{ marginRight: "10px" }} />
                      {getTimingInfo(item).message}
                    </Typography>
                    {fee > 0 && (
                      <Typography>
                        Late fee: {fee.toLocaleString("vi-VN")} VNĐ
                      </Typography>
                    )}
                  </div>
                )}
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

              {item.co2Changed !== undefined && item.co2Changed !== null && (
                <Typography sx={{ marginLeft: "10px", marginTop: "10px" }}>
                  CO2 Point:{" "}
                  <span style={{ color: "#1b4c2d", fontWeight: "bold" }}>
                    {typeof item.co2Changed === 'number' 
                      ? item.co2Changed.toFixed(3) 
                      : item.co2Changed} kg
                  </span>
                </Typography>
              )}

              {ecoPointChanged !== null && (
                <Typography sx={{ marginLeft: "10px", marginTop: "10px" }}>
                  Eco Points:{" "}
                  <span style={{ fontWeight: 600 }}>
                    {ecoPointChanged > 0 ? `+${ecoPointChanged}` : ecoPointChanged} points
                  </span>  
                </Typography>
              )}

              <div className="borrow-receivePoint">
                <Typography>
                  Receive Money: {}
                  <span style={{ color: "#c64b4f", fontWeight: "bold" }}>
                    {receiveMoney.toLocaleString("vi-VN")} VNĐ
                  </span>
                </Typography>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
              
                <Button
                  className="borrow-content-btn"
                  onClick={item.onViewDetails}
                >
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
  const sizeObj = product.productSizeId || {};
  const customer = item.customerId || {};
  const ecoPointChanged = item.ecoPointChanged ?? null;

  const name = productGroup.name || "Unknown Item";
  const image =
    productGroup.imageUrl ||
    product.imageUrl ||
    "https://via.placeholder.com/150";
  
  const size = sizeObj.sizeName;

  // Ưu tiên fullName, nếu không có thì hiển thị email
  const customerEmail = customer.userId?.email || customer.email || "N/A";
  const customerName = customer.fullName || customerEmail;
  const quantity = item.quantity || 1;
  const extensions = item.extensionCount || 0;

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
                {/* Customer, quantity, extensions + returned date (nằm ngang, có icon) */}
                <div
                  style={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 16,
                      flexWrap: "wrap",
                    }}
                  >
                    <Typography
                      variant="body2"
                      className="borrow-content-material"
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <FiUser /> User: {customerName}
                    </Typography>
                    {item.returnDate && (
                      <Typography
                        variant="body2"
                        className="borrow-content-material"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          whiteSpace: "nowrap",
                        }}
                      >
                        <RiCalendarScheduleLine />
                        Returned: {toVNDate(item.returnDate)}
                      </Typography>
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 16,
                      flexWrap: "wrap",
                    }}
                  >
                    <Typography
                      variant="body2"
                      className="borrow-content-material"
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <FiShoppingBag /> Items: {quantity}
                    </Typography>
                    <Typography
                      variant="body2"
                      className="borrow-content-material"
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <FiRefreshCw /> Extensions: {extensions}
                    </Typography>
                  </div>
                </div>
                {/* Timing info & fee for failed / lost */}
                {getTimingInfo(item) && (
                  <div className="borrow-content-overdue-failed">
                    <Typography className="borrow-content-overdue-title">
                      <CiWarning style={{ marginRight: "10px" }} />
                      {getTimingInfo(item).message}
                    </Typography>
                    {fee > 0 && (
                      <Typography>
                        Fee / forfeited deposit: {fee.toLocaleString("vi-VN")} VNĐ
                      </Typography>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="borrow-content-right-success">
              <Typography sx={{ marginLeft: "10px" }}>
                Deposit:{" "}
                <span style={{ color: "#36c775", fontWeight: "bold" }}>
                  {deposit.toLocaleString("vi-VN")} VNĐ
                </span>
              </Typography>

              {item.co2Changed !== undefined && item.co2Changed !== null && (
                <Typography sx={{ marginLeft: "10px", marginTop: "10px" }}>
                  CO2 Point:{" "}
                  <span style={{ color: "#1b4c2d", fontWeight: "bold" }}>
                    {typeof item.co2Changed === "number"
                      ? item.co2Changed.toFixed(3)
                      : item.co2Changed} kg
                  </span>
                </Typography>
              )}

              {ecoPointChanged !== null && (
                <Typography sx={{ marginLeft: "10px", marginTop: "10px" }}>
                  Eco Points:{" "}
                  <span style={{ fontWeight: 600 }}>
                    {ecoPointChanged > 0 ? `+${ecoPointChanged}` : ecoPointChanged} points
                  </span>  
                </Typography>
              )}

              <div className="borrow-receivePoint">
                <Typography>
                  Receive Money: {}
                  <span style={{ color: "#c64b4f", fontWeight: "bold" }}>
                    {deposit.toLocaleString("vi-VN")} VNĐ
                  </span>
                </Typography>
              </div>

              {/* No legit points display for failed transactions here */}
              <div className="borrow-failedPoint">
                <Typography>No refund due to failed return</Typography>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
              
                <Button
                  className="borrow-content-btn"
                  onClick={item.onViewDetails}
                >
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
  const { borrow, isLoading, borrowDetail, isDetailLoading, totalPages } =
    useSelector((state) => state.borrow);

  const [status, setStatus] = useState("");
  const [searchText, setSearchText] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [value, setValue] = useState(0);
  const [openDetail, setOpenDetail] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 3;

  const transactions = Array.isArray(borrow) ? borrow : [];

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setCurrentPage(1);
  };

  const handleViewDetails = (id) => {
    if (!id) return;
    dispatch(getDetailsBorrowTransactionBusinessApi(id));
    setOpenDetail(true);
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
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
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
        page: currentPage,
        limit,
      })
    );
  }, [dispatch, status, searchText, value, currentPage, limit, fromDate, toDate]);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const filteredData = transactions;

  const detail = borrowDetail || {};
  const detailProduct = detail.productId || {};
  const detailGroup = detailProduct.productGroupId || {};
  const detailSize = detailProduct.productSizeId || {};
  const detailCustomer = detail.customerId || {};
  const detailPreviousImages = detail.previousConditionImages || {};
  const detailCurrentImages = detail.currentConditionImages || {};
  const conditionFaces = ["front", "back", "left", "right", "top", "bottom"];
  const detailEcoPointChanged = detail.ecoPointChanged ?? null;

  // Prefer QR from productId for QR display, fallback to transaction-level or serial
  const detailQrCode =
    detailProduct.qrCode ||
    detail.qrCode ||
    detailProduct.serialNumber ||
    "";

  const toVNDate = (d) =>
    d ? new Date(d).toLocaleDateString("vi-VN") : "N/A";

  const rawType = detail.borrowTransactionType;
  let typeLabel = rawType;
  if (rawType === "borrow") typeLabel = "Borrow";
  if (rawType === "return_success") typeLabel = "Return Success";
  if (rawType === "return_failed") typeLabel = "Return Failed";

  // Hiển thị tên khách hàng trong popup: ưu tiên fullName, nếu không có thì dùng email
  const detailCustomerEmail =
    detailCustomer.userId?.email || detailCustomer.email || "N/A";
  const detailCustomerName = detailCustomer.fullName || detailCustomerEmail;

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

          {/* Date range filters */}
          <TextField
            label="From date"
            type="date"
            size="small"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            style={{ minWidth: 180, height: "40px" }}
          />
          <TextField
            label="To date"
            type="date"
            size="small"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            style={{ minWidth: 180, height: "40px" }}
          />
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
              const cardProps = {
                ...item,
                onViewDetails: () => handleViewDetails(item._id),
              };
              if (item.borrowTransactionType === "borrow")
                return <BorrowCard key={item._id} item={cardProps} />;
              if (item.borrowTransactionType === "return_success")
                return <SuccessCard key={item._id} item={cardProps} />;
              if (item.borrowTransactionType === "return_failed")
                return <FailedCard key={item._id} item={cardProps} />;
              return <BorrowCard key={item._id} item={cardProps} />;
            })
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Stack
            spacing={2}
            sx={{
              mt: 3,
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
        )}

        {/* Detail popup for business transaction */}
        <Dialog
          open={openDetail}
          onClose={handleCloseDetail}
          fullWidth
          maxWidth="md"
          PaperProps={{
            sx: {
              borderRadius: 3,
              maxWidth: 900,
            },
          }}
        >
          <DialogTitle
            sx={{
              fontWeight: 700,
              fontSize: 18,
              backgroundColor: "#0b5529",
              color: "#ffffff",
              borderBottom: "1px solid #eee",
            }}
          >
            Transaction Detail
          </DialogTitle>
          <DialogContent dividers>
            {isDetailLoading ? (
              <Typography>Loading transaction detail...</Typography>
            ) : !detail || !detail._id ? (
              <Typography>Transaction not found.</Typography>
            ) : (
              <Box className="borrow-detail-popup" sx={{ mt: 1 }}>
                {/* Header sản phẩm + chip loại & trạng thái */}
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    mb: 2,
                    alignItems: "flex-start",
                  }}
                >
                  <Box
                    component="img"
                    src={
                      detailGroup.imageUrl ||
                      detailProduct.imageUrl ||
                      "https://via.placeholder.com/150"
                    }
                    alt={detailGroup.name || "Product"}
                    sx={{
                      width: 120,
                      height: 120,
                      borderRadius: 2,
                      objectFit: "cover",
                      boxShadow: 2,
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ minWidth: 0 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography variant="h6">
                          {detailGroup.name || "Unknown Item"}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Chip
                            size="small"
                            label={typeLabel}
                            variant="outlined"
                            sx={{
                              borderColor: "#0b5529",
                              color: "#0b5529",
                              fontWeight: 500,
                            }}
                          />
                          <Chip
                            size="small"
                            label={detail.status}
                            variant="filled"
                            sx={{
                              backgroundColor: "#0b5529",
                              color: "#ffffff",
                              fontWeight: 500,
                            }}
                          />
                        </Box>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Size: {detailSize.sizeName || "N/A"}
                      </Typography>
                      
                    </Box>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Hai cột: Transaction Info + Customer */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    gap: 2.5,
                  }}
                >
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ mb: 1, fontWeight: 600 }}
                    >
                      Transaction Info
                    </Typography>
                    <Typography variant="body2">
                      Borrowed at:{" "}
                      <strong>
                        {toVNDate(detail.borrowDate || detail.createdAt)}
                      </strong>
                    </Typography>
                    <Typography variant="body2">
                      Due date:{" "}
                      <strong>{toVNDate(detail.dueDate)}</strong>
                    </Typography>
                    {detail.returnDate && (
                      <Typography variant="body2">
                        Returned at:{" "}
                        <strong>{toVNDate(detail.returnDate)}</strong>
                      </Typography>
                    )}
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Deposit:{" "}
                      <span
                        style={{ color: "#cc3500", fontWeight: "bold" }}
                      >
                        {Number(detail.depositAmount || 0).toLocaleString(
                          "vi-VN"
                        )}{" "}
                        VNĐ
                      </span>
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Status: <strong>{detail.status}</strong>
                    </Typography>
                    {detail.co2Changed !== undefined && detail.co2Changed !== null && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        CO2 Point:{" "}
                        <span style={{ color: "#1b4c2d", fontWeight: "bold" }}>
                          {typeof detail.co2Changed === 'number' 
                            ? detail.co2Changed.toFixed(3) 
                            : detail.co2Changed}
                        </span>
                      </Typography>
                    )}
                    {detailEcoPointChanged !== null && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Eco Points:{" "}
                        <span style={{ fontWeight: 600 }}>
                          {detailEcoPointChanged > 0
                            ? `+${detailEcoPointChanged}`
                            : detailEcoPointChanged}
                        </span>
                      </Typography>
                    )}
                  </Box>

                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ mb: 1, fontWeight: 600 }}
                    >
                      Customer
                    </Typography>
                    <Typography variant="body2">
                      Name: <strong>{detailCustomerName}</strong>
                    </Typography>
                    <Typography variant="body2">
                      Phone: {detailCustomer.phone || "N/A"}
                    </Typography>
                  </Box>
                </Box>

                {/* Hình ảnh tình trạng trước & sau giống trang TransactionHistory */}
                <Divider sx={{ my: 2 }} />
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 1.5, fontWeight: 600 }}
                >
                  Condition images
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ mb: 1, fontWeight: 600 }}
                    >
                      Previous condition
                    </Typography>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "repeat(3, 1fr)" },
                        gap: 1,
                      }}
                    >
                      {conditionFaces.map((face) => {
                        const src =
                          detailPreviousImages[`${face}Image`] || null;
                        if (!src) return null;
                        return (
                          <Box
                            key={`prev-${face}`}
                            sx={{ textAlign: "center" }}
                          >
                            <Box
                              component="img"
                              src={src}
                              alt={`Previous ${face}`}
                              sx={{
                                width: "100%",
                                height: 70,
                                objectFit: "cover",
                                borderRadius: 1,
                                border: "1px solid #eee",
                              }}
                            />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {face.charAt(0).toUpperCase() + face.slice(1)}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>

                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ mb: 1, fontWeight: 600 }}
                    >
                      Current condition
                    </Typography>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "repeat(3, 1fr)" },
                        gap: 1,
                      }}
                    >
                      {conditionFaces.map((face) => {
                        const src =
                          detailCurrentImages[`${face}Image`] || null;
                        if (!src) return null;
                        return (
                          <Box
                            key={`curr-${face}`}
                            sx={{ textAlign: "center" }}
                          >
                            <Box
                              component="img"
                              src={src}
                              alt={`Current ${face}`}
                              sx={{
                                width: "100%",
                                height: 70,
                                objectFit: "cover",
                                borderRadius: 1,
                                border: "1px solid #eee",
                              }}
                            />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {face.charAt(0).toUpperCase() + face.slice(1)}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                </Box>

                {/* QR Code at the bottom */}
                {detailQrCode && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Typography
                      variant="subtitle2"
                      sx={{ mb: 1.5, fontWeight: 600 }}
                    >
                      QR Code
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Box
                        component="img"
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                          detailQrCode
                        )}`}
                        alt={`QR Code for ${detailQrCode}`}
                        sx={{
                          width: 180,
                          height: 180,
                          objectFit: "contain",
                          backgroundColor: "#ffffff",
                          borderRadius: 2,
                          border: "1px solid #e5e7eb",
                          p: 1.5,
                        }}
                      />
                    </Box>
                  </>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDetail}>Close</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

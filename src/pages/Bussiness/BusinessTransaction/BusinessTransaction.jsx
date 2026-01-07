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
  Pagination,
  Stack,
} from "@mui/material";
import { FaArrowUpLong } from "react-icons/fa6";
import { FiBox, FiUser, FiShoppingBag, FiRefreshCw } from "react-icons/fi";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { CiWarning } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import {
  getTransactionHistoryBusinessApi,
} from "../../../store/slices/borrowSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { PATH } from "../../../routes/path";

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
                Customer Deposit:{" "}
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
  const rewardPointChanged = item.rewardPointChanged ?? null;

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

  // Tiền hoàn lại cho khách: Customer Deposit - Late fee (không âm)
  const refundedMoney = Math.max((deposit || 0) - (fee || 0), 0);

  // Tiền business thực nhận: Customer Deposit - Refunded Money
  const businessReceiveMoney = Math.max((deposit || 0) - refundedMoney, 0);

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
             
                      </Typography>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="borrow-content-right-success">
              <Typography sx={{ marginLeft: "10px" }}>
                Customer Deposit:{" "}
                <span style={{ color: "#36c775", fontWeight: "bold" }}>
                  {deposit.toLocaleString("vi-VN")} VNĐ
                </span>
              </Typography>


              {/* Chỉ hiển thị các dòng tiền cho trạng thái return_success */}
              {item.borrowTransactionType === "return_success" && (
                <>
                  <div className="borrow-receivePoint">
                    <Typography>
                      Business Receive Money
                      {status === "return_late" ? " (Late fee)" : ""}
                      :{" "}
                      <span style={{ color: "#c64b4f", fontWeight: "bold" }}>
                        {businessReceiveMoney.toLocaleString("vi-VN")} VNĐ
                      </span>
                    </Typography>
                  </div>
                  <div className="borrow-receivePoint">
                    <Typography>
                      Customer Refund Money:{" "}
                      <span style={{ color: "#36c775", fontWeight: "bold" }}>
                        {refundedMoney.toLocaleString("vi-VN")} VNĐ
                      </span>
                    </Typography>
                  </div>
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
              {rewardPointChanged !== null && (
                <Typography sx={{ marginLeft: "10px", marginTop: "10px" }}>
                  Reward Points:{" "}
                  <span style={{ fontWeight: 600 }}>
                    {rewardPointChanged > 0
                      ? `-${rewardPointChanged}`
                      : rewardPointChanged}{" "}
                    points
                  </span>
                </Typography>
              )}
                </>
              )}
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
  const rewardPointChanged = item.rewardPointChanged ?? null;

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
               Customer Deposit:{" "}
                <span style={{ color: "#36c775", fontWeight: "bold" }}>
                  {deposit.toLocaleString("vi-VN")} VNĐ
                </span>
              </Typography>

          

              <div className="borrow-receivePoint">
                <Typography>
                  Business Receive Money: {}
                  <span style={{ color: "#c64b4f", fontWeight: "bold" }}>
                    {deposit.toLocaleString("vi-VN")} VNĐ
                  </span>
                </Typography>
              </div>

              <div className="borrow-receivePoint">
                <Typography>
                  Customer Refund Money: {}
                  <span style={{ color: "#36c775", fontWeight: "bold" }}>
                    {Math.max(deposit - deposit, 0).toLocaleString("vi-VN")} VNĐ
                  </span>
                </Typography>
              </div>
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
              {rewardPointChanged !== null && (
                <Typography sx={{ marginLeft: "10px", marginTop: "10px" }}>
                  Reward Points:{" "}
                  <span style={{ fontWeight: 600 }}>
                    {rewardPointChanged > 0
                      ? `-${rewardPointChanged}`
                      : rewardPointChanged}{" "}
                    points
                  </span>
                </Typography>
              )}

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
  const { borrow, isLoading, totalPages } = useSelector((state) => state.borrow);
  const navigate = useNavigate();
  const location = useLocation();

  const [status, setStatus] = useState("");
  const [searchText, setSearchText] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [value, setValue] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 3;

  const transactions = Array.isArray(borrow) ? borrow : [];

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setCurrentPage(1);
  };

  const handleViewDetails = (id) => {
    if (!id) return;
    const isStaff = location.pathname.startsWith("/staff");
    const target = isStaff
      ? PATH.STAFF_TRANSACTION_DETAIL.replace(":id", id)
      : PATH.BUSINESS_TRANSACTION_DETAIL.replace(":id", id);
    navigate(target, { state: { from: location.pathname } });
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
      </div>
    </div>
  );
}

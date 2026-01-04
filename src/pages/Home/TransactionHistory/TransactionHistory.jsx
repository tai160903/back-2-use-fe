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
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
  Stack,
} from "@mui/material";
import Rating from "@mui/material/Rating";
import { FaArrowUpLong } from "react-icons/fa6";
import { MdOutlineQrCode2 } from "react-icons/md";
import { FiBox, FiUser, FiShoppingBag, FiRefreshCw } from "react-icons/fi";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { MdOutlineFeedback } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useUserInfo } from "../../../hooks/useUserInfo";
import { getUserRole } from "../../../utils/authUtils";
import { useForm, Controller } from "react-hook-form";
import {
  getTransactionHistoryApi,
  cancelBorrowTransactionCustomerApi,
  extendBorrowProductApi,
} from "../../../store/slices/borrowSlice";
import { giveFeedbackApi } from "../../../store/slices/feedbackSlice";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { PATH } from "../../../routes/path";

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

function BorrowCard({ item }) {
  const product = item.productId || {};
  const productGroup = product.productGroupId || {};
  const materialObj = productGroup.materialId || {};
  const sizeObj = product.productSizeId || {};
  const business = item.businessId || {};

  const name = productGroup.name || "Unknown Item";
  const image =
    productGroup.imageUrl ||
    product.imageUrl ||
    "https://via.placeholder.com/150";

  const material = materialObj.materialName || "N/A";
  const size = sizeObj.sizeName;

  const toVNDate = (d) =>
    d ? new Date(d).toLocaleDateString("vi-VN") : "N/A";

  const date = toVNDate(item.borrowDate || item.createdAt);
  const due = toVNDate(item.dueDate);
  const deposit = item.depositAmount || 0;
  const status = item.status || "unknown";
  const timingInfo = getTimingInfo(item);

  const businessName = business.businessName || "N/A";
  const quantity = item.quantity || 1;
  const extensions = item.extensionCount || 0;

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
                      <FiUser /> Store: {businessName}
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
              </div>
            </div>
            <div className="borrow-content-right">
              <Typography>
                Deposit:{" "}
                <span style={{ color: "#cc3500", fontWeight: "bold" }}>
                  {deposit.toLocaleString("vi-VN")} VND
                </span>
              </Typography>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Button
                  className="borrow-content-btn"
                  onClick={item.onViewDetails}
                >
                  <MdOutlineRemoveRedEye style={{ fontSize: "20px" }} /> View
                  Details
                </Button>
                {item.status === "pending_pickup" && item.onCancel && (
                  <Button
                    className="borrow-content-btn"
                    color="error"
                    onClick={item.onCancel}
                  >
                    Cancel
                  </Button>
                )}
                {item.status === "borrowing" && item.onExtend && (
                  <Button
                    className="borrow-content-btn"
                    color="primary"
                    onClick={item.onExtend}
                  >
                    Extend
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Thông tin còn bao lâu / trễ bao nhiêu ngày khi đang mượn */}
          {timingInfo && (
            <div className="borrow-content-overdue">
              <Typography className="borrow-content-overdue-title">
                {timingInfo.message}
              </Typography>
            </div>
          )}
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
  const walletTransaction = item.walletTransaction || {};
  const business = item.businessId || {};

  const name = productGroup.name || "Unknown Item";
  const image =
    productGroup.imageUrl ||
    product.imageUrl ||
    "https://via.placeholder.com/150";

  const material = materialObj.materialName || "N/A";
  const size = sizeObj.sizeName;

  const toVNDate = (d) =>
    d ? new Date(d).toLocaleDateString("vi-VN") : "N/A";

  const date = toVNDate(item.borrowDate || item.createdAt);
  const due = toVNDate(item.dueDate);
  const deposit = item.depositAmount || 0;
  const status = item.status || "unknown";

  const businessName = business.businessName || "N/A";
  const quantity = item.quantity || 1;
  const extensions = item.extensionCount || 0;

  const rewardPoints = item.rewardPointChanged || 0;
  const legitPoints = item.rankingPointChanged || 0;
  const co2Changed = item.co2Changed ?? 0;
  const ecoPointChanged = item.ecoPointChanged ?? 0;
  const totalConditionPoints = item.totalConditionPoints ?? 0;

  // Tiền trả lại từ ví (có thể hoàn toàn hoặc một phần nếu bị phạt)
  const refundedAmount =
    typeof walletTransaction.amount === "number" ? walletTransaction.amount : 0;

  // Late fee thực tế = Deposit - Refunded amount (số tiền bị trừ do phạt)
  const lateFee = Math.max((deposit || 0) - (refundedAmount || 0), 0);

  const rawType = item.borrowTransactionType;
  let typeLabel = rawType;
  if (rawType === "borrow") typeLabel = "Borrow";
  if (rawType === "return_success") typeLabel = "Return Success";
  if (rawType === "return_failed") typeLabel = "Return Failed";

  const timingInfo = getTimingInfo(item);

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
                {/* Business, quantity, extensions + returned date (nằm ngang, có icon) */}
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
                      <FiUser /> Store: {businessName}
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
              </div>
            </div>
            <div className="borrow-content-right-success">
              <Typography sx={{ marginLeft: "10px" }}>
                Deposit (upfront):{" "}
                <span style={{ color: "#cc3500", fontWeight: "bold" }}>
                  {deposit.toLocaleString("vi-VN")} VND
                </span>
              </Typography>

              {status === "return_late" && lateFee > 0 && (
                <Typography sx={{ marginLeft: "10px", marginTop: "10px" }}>
                  Late fee:{" "}
                  <span style={{ color: "#dc2626", fontWeight: "bold" }}>
                    {lateFee.toLocaleString("vi-VN")} VND
                  </span>
                </Typography>
              )}
                 <div className="borrow-receivePoint">
                <Typography>
                  Refunded amount:
                  <span style={{ color: "#36c775", fontWeight: "bold" }}>
                    {" "}
                    {Number(refundedAmount || 0).toLocaleString("vi-VN")} VND
                  </span>
                </Typography>
              </div>

              <div className="borrow-points-grid">
                <div className="borrow-rewardPoint">
                  <Typography>
                    Reward Points:{" "}
                    <span style={{ color: "#365bbf", fontWeight: "600" }}>
                      {rewardPoints > 0 ? `+${rewardPoints}` : rewardPoints} points
                    </span>
                  </Typography>
                </div>

                <div className="borrow-legitPoint">
                  <Typography>
                    Ranking Points:{" "}
                    <span style={{ color: "#8200de", fontWeight: "600" }}>
                      {legitPoints > 0 ? `+${legitPoints}` : legitPoints} points
                    </span>
                  </Typography>
                </div>

                {/* CO2, Eco, Condition with separate colors */}
                <div className="borrow-co2Point">
                  <Typography>
                    CO₂ Changed:{" "}
                    <span style={{ fontWeight: 600 }}>
                      {co2Changed > 0 ? `+${co2Changed}` : co2Changed} kg
                    </span>
                  </Typography>
                </div>

                {/* <div className="borrow-ecoPoint">
                  <Typography>
                    Eco Points:{" "}
                    <span style={{ fontWeight: 600 }}>
                      {ecoPointChanged > 0 ? `+${ecoPointChanged}` : ecoPointChanged}
                    </span>
                  </Typography>
                </div> */}

                <div className="borrow-conditionPoint">
                  <Typography>
                    Condition Points:{" "}
                    <span style={{ fontWeight: 600 }}>
                      {totalConditionPoints} points
                    </span>
                  </Typography>
                </div>
              </div>

           

              <div style={{ display: "flex", gap: "10px" }}>
                {item.canFeedback && (
                  <Button
                    className="borrow-content-btn"
                    onClick={item.onFeedback}
                  >
                    <MdOutlineFeedback style={{ fontSize: "20px" }} /> Feedback
                  </Button>
                )}
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

          {/* Thông tin trễ / đúng hạn cho giao dịch trả thành công - full chiều ngang giống Borrow */}
          {timingInfo && (
            <div className="borrow-content-overdue-success">
              <Typography className="borrow-content-overdue-title">
                {timingInfo.message}
              </Typography>
            </div>
          )}
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
  const walletTransaction = item.walletTransaction || {};
  const business = item.businessId || {};

  const name = productGroup.name || "Unknown Item";
  const image =
    productGroup.imageUrl ||
    product.imageUrl ||
    "https://via.placeholder.com/150";

  const material = materialObj.materialName || "N/A";
  const size = sizeObj.sizeName;

  const toVNDate = (d) =>
    d ? new Date(d).toLocaleDateString("vi-VN") : "N/A";

  const date = toVNDate(item.borrowDate || item.createdAt);
  const due = toVNDate(item.dueDate);
  const deposit = item.depositAmount || 0;
  const status = item.status || "unknown";

  const businessName = business.businessName || "N/A";
  const quantity = item.quantity || 1;
  const extensions = item.extensionCount || 0;

  const rewardPoints = item.rewardPointChanged || 0;
  const legitPoints = item.rankingPointChanged || 0;
  const co2Changed = item.co2Changed ?? 0;
  const ecoPointChanged = item.ecoPointChanged ?? 0;
  const totalConditionPoints = item.totalConditionPoints ?? 0;

  // Tiền trả lại trong trường hợp mất / thất bại (thường là 0 hoặc một phần)
  const refundedAmount =
    typeof walletTransaction.amount === "number" ? walletTransaction.amount : 0;

  const rawType = item.borrowTransactionType;
  let typeLabel = rawType;
  if (rawType === "borrow") typeLabel = "Borrow";
  if (rawType === "return_success") typeLabel = "Return Success";
  if (rawType === "return_failed") typeLabel = "Return Failed";

  const timingInfo = getTimingInfo(item);

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
                {/* Business, quantity, extensions + returned date (nằm ngang, có icon) */}
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
                      <FiUser /> Store: {businessName}
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
              </div>
            </div>
            <div className="borrow-content-right-success">
              <Typography sx={{ marginLeft: "10px" }}>
                Deposit (upfront):{" "}
                <span style={{ color: "#cc3500", fontWeight: "bold" }}>
                  {deposit.toLocaleString("vi-VN")} VND
                </span>
              </Typography>

              <div className="borrow-receivePoint">
                <Typography>
                  Refunded amount:
                  <span style={{ color: "#c64b4f", fontWeight: "bold" }}>
                    {" "}
                    {Number(refundedAmount || 0).toLocaleString("vi-VN")} VND
                  </span>
                </Typography>
              </div>

              <div className="borrow-points-grid">
                <div className="borrow-rewardPoint">
                  <Typography>
                    Reward Points:{" "}
                    <span style={{ color: "#365bbf", fontWeight: "600" }}>
                      {rewardPoints > 0 ? `+${rewardPoints}` : rewardPoints} points
                    </span>
                  </Typography>
                </div>

                <div className="borrow-legitPoint">
                  <Typography>
                   Ranking Points:{" "}
                    <span
                      style={{
                        color: legitPoints < 0 ? "#df4d56" : "#8200de",
                        fontWeight: "600",
                      }}
                    >
                      {legitPoints > 0 ? `+${legitPoints}` : legitPoints} points
                    </span>
                  </Typography>
                </div>

                {/* CO2, Eco, Condition with separate colors */}
                <div className="borrow-co2Point">
                  <Typography>
                    CO₂ Changed:{" "}
                    <span style={{ fontWeight: 600 }}>
                      {co2Changed > 0 ? `+${co2Changed}` : co2Changed} kg
                    </span>
                  </Typography>
                </div>
                {/* <div className="borrow-ecoPoint">
                  <Typography>
                    Eco Points:{" "}
                    <span style={{ fontWeight: 600 }}>
                      {ecoPointChanged > 0 ? `+${ecoPointChanged}` : ecoPointChanged}
                    </span>
                  </Typography>
                </div> */}
                <div className="borrow-conditionPoint">
                  <Typography>
                    Condition Points:{" "}
                    <span style={{ fontWeight: 600 }}>
                      {totalConditionPoints} points
                    </span>
                  </Typography>
                </div>
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

          {/* Thông tin trễ / mất cho giao dịch thất bại - full chiều ngang giống Borrow */}
          {timingInfo && (
            <div className="borrow-content-overdue-failed">
              <Typography className="borrow-content-overdue-title">
                {timingInfo.message}
              </Typography>
            </div>
          )}
        </div>
      </div>
    </Box>
  );
}

export default function TransactionHistory() {
  const dispatch = useDispatch();
  const { borrow, isLoading, totalPages } = useSelector((state) => state.borrow);
  const { refetch: refetchUserInfo } = useUserInfo();
  const role = getUserRole();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    control,
    handleSubmit,
    reset: resetFeedbackForm,
    register,
    formState: { errors: feedbackErrors, isSubmitting: isSubmittingFeedback },
  } = useForm({
    defaultValues: {
      rating: 5,
      comment: "",
    },
  });

  // trạng thái filter
  const [status, setStatus] = useState("");
  const [searchText, setSearchText] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [value, setValue] = useState(0); // tab hiện tại
  const [openCancel, setOpenCancel] = useState(false);
  const [selectedCancelId, setSelectedCancelId] = useState(null);
  const [openExtend, setOpenExtend] = useState(false);
  const [selectedExtendId, setSelectedExtendId] = useState(null);
  const [extendDays, setExtendDays] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 3;

  const [openFeedback, setOpenFeedback] = useState(false);
  const [selectedFeedbackId, setSelectedFeedbackId] = useState(null);

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
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
        page: currentPage,
        limit,
      })
    );
  }, [dispatch, status, searchText, value, currentPage, limit, fromDate, toDate]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setCurrentPage(1);
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleViewDetails = (id) => {
    if (!id) return;
    navigate(PATH.CUSTOMER_TRANSACTION_DETAIL.replace(":id", id), {
      state: { from: location.pathname },
    });
  };

  const handleOpenCancel = (id) => {
    setSelectedCancelId(id);
    setOpenCancel(true);
  };

  const handleCloseCancel = () => {
    setOpenCancel(false);
    setSelectedCancelId(null);
  };

  const handleConfirmCancel = async () => {
    if (!selectedCancelId) return;
    await dispatch(cancelBorrowTransactionCustomerApi(selectedCancelId));
    setOpenCancel(false);
    setSelectedCancelId(null);
  };

  const handleOpenExtend = (id) => {
    setSelectedExtendId(id);
    setExtendDays("");
    setOpenExtend(true);
  };

  const handleCloseExtend = () => {
    setOpenExtend(false);
    setSelectedExtendId(null);
    setExtendDays("");
  };

  const handleOpenFeedback = (id) => {
    setSelectedFeedbackId(id);
    setOpenFeedback(true);
    resetFeedbackForm({
      rating: 5,
      comment: "",
    });
  };

  const handleCloseFeedback = () => {
    setOpenFeedback(false);
    setSelectedFeedbackId(null);
    resetFeedbackForm({
      rating: 5,
      comment: "",
    });
  };

  const onSubmitFeedback = async (data) => {
    if (role !== "customer") {
      toast.error("Only customer accounts can send feedback.");
      return;
    }

    if (!selectedFeedbackId) {
      toast.error("Cannot find transaction to rate.");
      return;
    }

    try {
      await dispatch(
        giveFeedbackApi({
          borrowTransactionId: selectedFeedbackId,
          rating: data.rating,
          comment: data.comment,
        })
      ).unwrap();
      toast.success("Feedback submitted successfully.");
      setOpenFeedback(false);
      setSelectedFeedbackId(null);
      resetFeedbackForm({
        rating: 5,
        comment: "",
      });
    } catch (error) {
      const backendMessage =
        error?.message ||
        error?.error ||
        (typeof error === "string" ? error : null) ||
        "Failed to submit feedback.";

      toast.error(backendMessage);
    }
  };

  const handleConfirmExtend = async () => {
    if (!selectedExtendId) return;

    const daysNumber = Number(extendDays);
    if (!Number.isFinite(daysNumber) || daysNumber <= 0) {
      toast.error("Please enter a valid number of days.");
      return;
    }

    try {
      await dispatch(
        extendBorrowProductApi({
          id: selectedExtendId,
          additionalDays: daysNumber,
        })
      ).unwrap();
      // Refresh user & wallet info so wallet balance updates without page reload
      refetchUserInfo();
      toast.success("Borrow product extended successfully");
    } catch (error) {
      const backendMessage =
        error?.message ||
        error?.error ||
        (typeof error === "string" ? error : null) ||
        "Failed to extend borrowing period.";

      toast.error(backendMessage);
    }
    setOpenExtend(false);
    setSelectedExtendId(null);
    setExtendDays("");
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
              Loading transaction history...
            </Typography>
          ) : filteredData.length === 0 ? (
            <Typography style={{ marginTop: "16px" }}>
              No transactions found.
            </Typography>
          ) : (
            filteredData.map((item) => {
              const cardProps = {
                ...item,
                onViewDetails: () => handleViewDetails(item._id),
                onCancel: () => handleOpenCancel(item._id),
                onExtend: () => handleOpenExtend(item._id),
                onFeedback: () => handleOpenFeedback(item._id),
                canFeedback: role === "customer",
              };
              if (item.borrowTransactionType === "borrow")
                return <BorrowCard key={item._id} item={cardProps} />;
              if (item.borrowTransactionType === "return_success")
                return <SuccessCard key={item._id} item={cardProps} />;
              if (item.borrowTransactionType === "return_failed")
                return <FailedCard key={item._id} item={cardProps} />;
              // fallback
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


        {/* Cancel confirmation popup */}
        <Dialog
          open={openCancel}
          onClose={handleCloseCancel}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle sx={{ fontWeight: 600 }}>Cancel transaction</DialogTitle>
          <DialogContent dividers>
            <Typography>
              Are you sure you want to cancel this transaction?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseCancel} disabled={isLoading}>
              Keep
            </Button>
            <Button
              onClick={handleConfirmCancel}
              color="error"
              variant="contained"
              disabled={isLoading}
            >
              {isLoading ? "Canceling..." : "Yes, cancel"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Extend borrow popup */}
        <Dialog
          open={openExtend}
          onClose={handleCloseExtend}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle sx={{ fontWeight: 600 }}>Extend borrowing period</DialogTitle>
          <DialogContent dividers>
            <Typography>
              Please enter the number of additional days you want to extend.
            </Typography>
            <TextField
              type="number"
              label="Additional days"
              fullWidth
              margin="normal"
              value={extendDays}
              onChange={(e) => setExtendDays(e.target.value)}
              inputProps={{ min: 1 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseExtend} disabled={isLoading}>
              Close
            </Button>
            <Button
              onClick={handleConfirmExtend}
              color="primary"
              variant="contained"
              disabled={isLoading}
            >
              {isLoading ? "Extending..." : "Confirm"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Feedback popup */}
        <Dialog
          open={openFeedback}
          onClose={handleCloseFeedback}
          maxWidth="sm"
          fullWidth
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
            Send feedback
          </DialogTitle>
          <DialogContent dividers>
            <Typography>
              Please rate your borrowing/return experience.
            </Typography>
            <form
              id="feedback-form"
              onSubmit={handleSubmit(onSubmitFeedback)}
              style={{ marginTop: 16 }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Typography sx={{ minWidth: 80 }}>Rating:</Typography>
                  <Controller
                    name="rating"
                    control={control}
                    rules={{
                      required: "Please select a rating.",
                    }}
                    render={({ field }) => (
                      <Rating
                        {...field}
                        value={field.value || 0}
                        onChange={(_, value) => field.onChange(value)}
                       
                      />
                    )}
                  />
                </Box>
                {feedbackErrors.rating && (
                  <Typography variant="caption" color="error">
                    {feedbackErrors.rating.message}
                  </Typography>
                )}

                <TextField
                  label="Comment"
                  multiline
                  minRows={3}
                  placeholder="Share more about the service and product quality..."
                  fullWidth
                  {...register("comment")}
                />
              </Box>
            </form>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseFeedback}
              disabled={isSubmittingFeedback}
            >
              Close
            </Button>
            <Button
              type="submit"
              form="feedback-form"
              variant="contained"
              sx={{
                backgroundColor: "#0b5529",
                "&:hover": { backgroundColor: "#094421" },
              }}
              disabled={isSubmittingFeedback}
            >
              {isSubmittingFeedback ? "Sending..." : "Submit feedback"}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

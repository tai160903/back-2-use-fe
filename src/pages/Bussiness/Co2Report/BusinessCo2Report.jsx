import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
  Chip,
  Stack,
  Paper,
  Divider,
  Pagination,
  Button,
} from "@mui/material";
import { IoIosSearch } from "react-icons/io";
import { MdOutlineEco } from "react-icons/md";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { FaArrowUpLong } from "react-icons/fa6";
import { FiUser, FiShoppingBag } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { getTransactionHistoryBusinessApi } from "../../../store/slices/borrowSlice";
import { exportCo2Report } from "../../../store/slices/bussinessSlice";
import fetcher from "../../../apis/fetcher";

const typeOptions = [
  { label: "All transaction types", value: "" },
  { label: "Borrow", value: "borrow" },
  { label: "Return Success", value: "return_success" },
  { label: "Return Failed / Lost", value: "return_failed" },
];

const statusOptions = [
  { label: "All statuses", value: "" },
  { label: "Pending pickup", value: "pending_pickup" },
  { label: "Borrowing", value: "borrowing" },
  { label: "Returned", value: "returned" },
  { label: "Return late", value: "return_late" },
  { label: "Rejected", value: "rejected" },
  { label: "Lost", value: "lost" },
  { label: "Canceled", value: "canceled" },
];

const formatDate = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleString("vi-VN");
};

const typeLabel = (raw) => {
  if (raw === "borrow") return "Borrow";
  if (raw === "return_success") return "Return Success";
  if (raw === "return_failed") return "Return Failed";
  return raw || "Unknown";
};

const renderStatusPill = (status) => {
  const map = {
    returned: { label: "Returned", bg: "#e8f5e9", color: "#2e7d32" },
    return_success: { label: "Return success", bg: "#e8f5e9", color: "#2e7d32" },
    borrowing: { label: "Borrowing", bg: "#e3f2fd", color: "#1565c0" },
    pending_pickup: { label: "Pending pickup", bg: "#fff3e0", color: "#ef6c00" },
    return_late: { label: "Return late", bg: "#fff3e0", color: "#d84315" },
    lost: { label: "Lost", bg: "#ffebee", color: "#c62828" },
    rejected: { label: "Rejected", bg: "#fbe9e7", color: "#bf360c" },
    canceled: { label: "Canceled", bg: "#eceff1", color: "#455a64" },
  };
  const cfg = map[status] || { label: status || "unknown", bg: "#eceff1", color: "#455a64" };
  return (
    <Box
      sx={{
        px: 1.5,
        py: 0.5,
        borderRadius: 999,
        backgroundColor: cfg.bg,
        color: cfg.color,
        display: "inline-flex",
        alignItems: "center",
        gap: 0.5,
        fontSize: 12,
        fontWeight: 600,
        textTransform: "capitalize",
      }}
    >
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: cfg.color,
        }}
      />
      {cfg.label}
    </Box>
  );
};

export default function BusinessCo2Report() {
  const dispatch = useDispatch();
  const { borrow, isLoading, totalPages } = useSelector((state) => state.borrow);
  const { exportCo2ReportLoading } = useSelector((state) => state.businesses || {});

  const [searchText, setSearchText] = useState("");
  const [status, setStatus] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCo2Summary, setTotalCo2Summary] = useState({ total: 0, byType: {} });
  const [isLoadingTotal, setIsLoadingTotal] = useState(false);
  const limit = 10;

  // Fetch paginated data for display
  useEffect(() => {
    dispatch(
      getTransactionHistoryBusinessApi({
        status: status || undefined,
        productName: searchText || undefined,
        borrowTransactionType: transactionType || undefined,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
        page: currentPage,
        limit,
      })
    );
  }, [dispatch, status, searchText, transactionType, fromDate, toDate, currentPage]);

  // Fetch all data (without pagination) to calculate total CO₂
  useEffect(() => {
    const fetchTotalCo2 = async () => {
      setIsLoadingTotal(true);
      try {
        const response = await fetcher.get("/borrow-transactions/business", {
          params: {
            status: status || undefined,
            productName: searchText || undefined,
            borrowTransactionType: transactionType || undefined,
            fromDate: fromDate || undefined,
            toDate: toDate || undefined,
            page: 1,
            limit: 10000, // Large limit to get all data
          },
        });
        
        const allItems = Array.isArray(response.data?.data) 
          ? response.data.data 
          : (response.data?.data?.items || []);
        
        const summary = allItems.reduce(
          (acc, item) => {
            const val = Number(item.co2Changed) || 0;
            const t = item.borrowTransactionType || "unknown";
            acc.total += val;
            acc.byType[t] = (acc.byType[t] || 0) + val;
            return acc;
          },
          { total: 0, byType: {} }
        );
        setTotalCo2Summary(summary);
      } catch (error) {
        console.error("Failed to fetch total CO₂:", error);
        setTotalCo2Summary({ total: 0, byType: {} });
      } finally {
        setIsLoadingTotal(false);
      }
    };

    fetchTotalCo2();
  }, [status, searchText, transactionType, fromDate, toDate]);

  const items = useMemo(() => (Array.isArray(borrow) ? borrow : []), [borrow]);

  const handlePageChange = (_, page) => setCurrentPage(page);
  const handleExport = async () => {
    try {
      const data = await dispatch(exportCo2Report()).unwrap();
      if (!data) return;
      const blob =
        data instanceof Blob ? data : new Blob([data], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "business-co2-report.csv";
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export CO2 report failed", error);
    }
  };

  return (
    <Box
      className="transaction"
      sx={{
        p: { xs: 1, sm: 2 },
        backgroundColor: "#f7f9f8",
        minHeight: "100vh",
      }}
    >
      <Box
        className="transaction-container"
        sx={{
          backgroundColor: "#ffffff",
          borderRadius: 2,
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          p: { xs: 2, md: 3 },
        }}
      >
        <Box className="transaction-header" sx={{ mb: 2 }}>
          <Typography
            className="transaction-title text-black"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <MdOutlineEco className="mr-2 size-8 text-green-600" /> CO₂ Impact Report
          </Typography>
          <span style={{ color: "#5f6b63" }}>
            Track CO₂ for borrow / return / late return with borrower and item details.
          </span>
        </Box>

        {/* Filters */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          gap={2}
          alignItems={{ xs: "stretch", md: "center" }}
          sx={{ mb: 3, background: "#f2f5f3", p: 2, borderRadius: 2 }}
        >
          <TextField
            placeholder="Search by item name"
            label="Item name"
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
          />

          <FormControl size="small" sx={{ minWidth: 200 }}>
            <Select
              value={status}
              displayEmpty
              onChange={(e) => setStatus(e.target.value)}
              renderValue={(selected) => (selected ? selected : "Filter by status")}
            >
              {statusOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 220 }}>
            <Select
              value={transactionType}
              displayEmpty
              onChange={(e) => setTransactionType(e.target.value)}
              renderValue={(selected) =>
                selected ? typeLabel(selected) : "Filter by transaction type"
              }
            >
              {typeOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="From date"
            placeholder="YYYY-MM-DD"
            type="date"
            size="small"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 170 }}
          />
          <TextField
            label="To date"
            placeholder="YYYY-MM-DD"
            type="date"
            size="small"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 170 }}
          />

          <Button
            onClick={handleExport}
            variant="contained"
            size="small"
            sx={{
              backgroundColor: "#0b5529",
              "&:hover": { backgroundColor: "#094421" },
            }}
            disabled={exportCo2ReportLoading}
          >
            {exportCo2ReportLoading ? "Exporting..." : "Export CSV"}
          </Button>
        </Stack>

        {/* Summary cards */}
        <Stack direction={{ xs: "column", md: "row" }} gap={2} sx={{ mb: 3 }}>
          <Paper
            sx={{
              p: 2,
              flex: 1,
              borderRadius: 2,
              border: "1px solid #e5eee8",
              background: "#0b5529",
              color: "#fff",
            }}
          >
            <Typography variant="subtitle2" sx={{ opacity: 0.85 }}>
              Total CO₂ (filtered)
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, mt: 0.5 }}>
              {isLoadingTotal ? "..." : totalCo2Summary.total.toFixed(3)} kg
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>
              Aggregated across all pages with current filters.
            </Typography>
          </Paper>
          <Paper
            sx={{
              p: 2,
              flex: 1,
              borderRadius: 2,
              border: "1px solid #e5eee8",
              background: "#f9fbfa",
            }}
          >
            <Typography variant="subtitle2" color="text.secondary">
              CO₂ by transaction type
            </Typography>
            <Stack direction="row" gap={1} flexWrap="wrap" sx={{ mt: 1 }}>
              {isLoadingTotal ? (
                <Typography variant="body2" color="text.secondary">
                  Loading...
                </Typography>
              ) : Object.keys(totalCo2Summary.byType).length > 0 ? (
                Object.entries(totalCo2Summary.byType).map(([k, v]) => (
                  <Chip
                    key={k}
                    label={`${typeLabel(k)}: ${v.toFixed(3)} kg`}
                    sx={{
                      borderColor: v >= 0 ? "#0b5529" : "#c62828",
                      color: v >= 0 ? "#0b5529" : "#c62828",
                      background: v >= 0 ? "#e8f3ec" : "#fdecea",
                    }}
                    variant="outlined"
                  />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No data yet.
                </Typography>
              )}
            </Stack>
          </Paper>
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* List style giống StaffManagement */}
        <Box
          sx={{
            mt: 2,
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
          }}
        >
          {/* Header row */}
          <Box
            sx={{
              background: "#ffffff",
              borderRadius: 2,
              p: 2,
              boxShadow: "0 4px 10px rgba(0,0,0,0.04)",
              border: "1px solid #e5e7eb",
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, minmax(0,1fr))",
                md: "0.5fr 1fr 1fr 0.8fr 1.2fr 1.2fr 1fr 1fr",
              },
              gap: 2,
              fontWeight: 800,
              color: "#0b5529",
            }}
          >
            <Typography fontSize={14}>#</Typography>
            <Typography fontSize={14}>Type</Typography>
            <Typography fontSize={14}>Status</Typography>
            <Typography fontSize={14}>CO₂ (kg)</Typography>
            <Typography fontSize={14}>Borrower</Typography>
            <Typography fontSize={14}>Product</Typography>
            <Typography fontSize={14} textAlign="right">
              Borrowed at
            </Typography>
            <Typography fontSize={14} textAlign="right">
              Returned/Due
            </Typography>
          </Box>

          {/* Rows */}
          {isLoading ? (
            <Paper sx={{ p: 2, textAlign: "center" }}>Loading...</Paper>
          ) : items.length === 0 ? (
            <Paper sx={{ p: 2, textAlign: "center" }}>
              No data in the filter.
            </Paper>
          ) : (
            items.map((item, idx) => {
              const customer = item.customerId || {};
              const product = item.productId || {};
              const group = product.productGroupId || {};
              const co2Val = Number(item.co2Changed) || 0;
              const co2Color = co2Val >= 0 ? "#1b4c2d" : "#c62828";
              const isEven = idx % 2 === 0;
              return (
                <Box
                  key={item._id || idx}
                  sx={{
                    background: isEven ? "#ffffff" : "#f9fbfa",
                    borderRadius: 2,
                    p: 2,
                    boxShadow: "0 4px 10px rgba(0,0,0,0.04)",
                    border: "1px solid #e5e7eb",
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "repeat(2, minmax(0,1fr))",
                      md: "0.5fr 1fr 1fr 0.8fr 1.2fr 1.2fr 1fr 1fr",
                    },
                    gap: 2,
                    alignItems: "center",
                    "&:hover": {
                      background: "#eef5f1",
                      boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
                    },
                  }}
                >
                  <Typography fontWeight={600}>
                    {(currentPage - 1) * limit + idx + 1}
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Chip
                      size="small"
                      label={typeLabel(item.borrowTransactionType)}
                      icon={<FaArrowUpLong size={14} />}
                      variant="outlined"
                      sx={{
                        borderColor: "#0b5529",
                        color: "#0b5529",
                        background: "#f0f7f3",
                        fontWeight: 600,
                      }}
                    />
                  </Box>

                  <Box>{renderStatusPill(item.status)}</Box>

                  <Box>
                    <Typography sx={{ color: co2Color, fontWeight: 700 }}>
                      {co2Val.toFixed(3)} kg
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Eco: {(Number(item.ecoPointChanged) || 0).toFixed(2)}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <FiUser /> {customer.fullName || customer.userId?.email || "N/A"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {customer.phone || "N/A"}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <FiShoppingBag /> {group.name || "Unknown"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ wordBreak: "break-all" }}>
                      {product.serialNumber || product.qrCode || "N/A"}
                    </Typography>
                  </Box>

                  <Typography
                    textAlign="right"
                    sx={{ display: "flex", alignItems: "center", gap: 0.5, justifyContent: "flex-end" }}
                  >
                    <RiCalendarScheduleLine /> {formatDate(item.borrowDate || item.createdAt)}
                  </Typography>

                  <Typography
                    textAlign="right"
                    sx={{ display: "flex", alignItems: "center", gap: 0.5, justifyContent: "flex-end" }}
                  >
                    <RiCalendarScheduleLine /> {formatDate(item.returnDate || item.dueDate)}
                  </Typography>
                </Box>
              );
            })
          )}
        </Box>

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
      </Box>
    </Box>
  );
}



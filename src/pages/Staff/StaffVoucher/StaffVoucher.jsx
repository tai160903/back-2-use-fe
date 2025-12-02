import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useBusinessVoucherCode } from "../../../store/slices/voucherSlice";
import { FaGift } from "react-icons/fa";
import { MdCheckCircle, MdError } from "react-icons/md";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import toast from "react-hot-toast";
import "./StaffVoucher.css";

export default function StaffVoucher() {
  const dispatch = useDispatch();
  const { lastUseCodeResult, isLoading } = useSelector((state) => state.vouchers);

  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [error, setError] = useState("");

  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) {
      setError("Please enter a voucher code");
      return;
    }

    setError("");
    try {
      const result = await dispatch(
        useBusinessVoucherCode({ code: voucherCode.trim() })
      ).unwrap();

      if (result) {
        setAppliedVoucher(result.data || result);
        toast.success("Voucher applied successfully!");
        setVoucherCode("");
      }
    } catch (error) {
      const errorMessage =
        error?.message ||
        error?.error ||
        error?.data?.message ||
        "Invalid voucher code or already used";
      setError(errorMessage);
      toast.error(errorMessage);
      setAppliedVoucher(null);
    }
  };

  const handleReset = () => {
    setVoucherCode("");
    setAppliedVoucher(null);
    setError("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleApplyVoucher();
    }
  };

  const getVoucherInfo = (voucher) => {
    if (!voucher) return null;

    // Lấy thông tin từ voucher code hoặc businessVoucher
    const businessVoucher = voucher.businessVoucher || voucher.businessVoucherId || {};
    const voucherData = businessVoucher || voucher;

    // Lấy discount info từ nhiều nguồn có thể
    const discountPercent = 
      voucherData.discountPercent || 
      voucherData.discount || 
      voucher.discountPercent || 
      voucher.discount || 
      0;

    const discountType = voucherData.discountType || 
      (discountPercent > 0 ? "percentage" : "fixed");

    return {
      name: voucherData.name || voucherData.customName || voucher.name || "N/A",
      code: voucher.code || voucherCode,
      description: voucherData.description || voucherData.customDescription || voucher.description || "",
      discountType: discountType,
      discountValue: discountPercent || voucherData.discountValue || 0,
      expiryDate: voucherData.endDate || voucherData.expiryDate || voucher.expiryDate || null,
    };
  };

  const getDiscountText = (voucherInfo) => {
    if (!voucherInfo) return "";
    
    if (voucherInfo.discountType === "percentage") {
      return `${voucherInfo.discountValue || 0}% off`;
    } else if (voucherInfo.discountType === "fixed") {
      return `${(voucherInfo.discountValue || 0).toLocaleString("en-US")} VND off`;
    }
    return "";
  };

  return (
    <div className="staff-voucher-page">
      <div className="voucher-page-container">
        {/* Header */}
        <Box className="voucher-content-header" sx={{ mb: 3 }}>
          <Box className="header-left">
            <FaGift style={{ fontSize: 32, color: "#12422a" }} />
            <Box>
              <Typography
                variant="h4"
                component="h1"
                fontWeight={700}
                sx={{
                  color: "#1a1a1a",
                  mb: 0.5,
                }}
              >
                Apply Voucher
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#6b7280", fontSize: "0.875rem" }}
              >
                Enter voucher code to apply discount to the bill
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Main Content */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 2,
            backgroundColor: "white",
            border: "1px solid #e5e7eb",
            mb: 3,
          }}
        >
          {/* Voucher Input Section */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="body1"
              sx={{ fontWeight: 600, color: "#374151", mb: 1.5 }}
            >
              Voucher Code
            </Typography>
            <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
              <TextField
                fullWidth
                placeholder="Enter voucher code..."
                value={voucherCode}
                onChange={(e) => {
                  setVoucherCode(e.target.value.toUpperCase());
                  setError("");
                }}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                error={!!error}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "#6b7280" }} />
                    </InputAdornment>
                  ),
                  sx: {
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    fontSize: "16px",
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover fieldset": {
                      borderColor: "#12422a",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#12422a",
                    },
                  },
                }}
              />
              <Button
                variant="contained"
                onClick={handleApplyVoucher}
                disabled={isLoading || !voucherCode.trim()}
                sx={{
                  backgroundColor: "#12422a",
                  color: "#ffffff",
                  textTransform: "none",
                  fontWeight: 600,
                  padding: "14px 28px",
                  borderRadius: 2,
                  minWidth: "120px",
                  boxShadow: "0 4px 12px rgba(18, 66, 42, 0.3)",
                  "&:hover": {
                    backgroundColor: "#0d2e1c",
                    boxShadow: "0 6px 16px rgba(18, 66, 42, 0.4)",
                  },
                  "&:disabled": {
                    backgroundColor: "#9ca3af",
                  },
                }}
              >
                {isLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Apply"
                )}
              </Button>
            </Box>
            {error && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mt: 1.5,
                  p: 1.5,
                  backgroundColor: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: 1,
                  color: "#991b1b",
                }}
              >
                <MdError style={{ fontSize: 20, flexShrink: 0 }} />
                <Typography variant="body2">{error}</Typography>
              </Box>
            )}
          </Box>

          {/* Applied Voucher Display */}
          {appliedVoucher && (() => {
            const voucherInfo = getVoucherInfo(appliedVoucher);
            if (!voucherInfo) return null;

            return (
              <Box sx={{ mt: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 2,
                    pb: 2,
                    borderBottom: "2px solid #d1fae5",
                  }}
                >
                  <MdCheckCircle
                    style={{ fontSize: 28, color: "#10b981", flexShrink: 0 }}
                  />
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: "#065f46" }}
                  >
                    Voucher applied successfully!
                  </Typography>
                </Box>

                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: 2,
                    backgroundColor: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      py: 1.5,
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, color: "#374151", minWidth: 140 }}
                    >
                      Voucher Name:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#1f2937", textAlign: "right", flex: 1 }}
                    >
                      {voucherInfo.name}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      py: 1.5,
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, color: "#374151", minWidth: 140 }}
                    >
                      Voucher Code:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#12422a",
                        fontFamily: "monospace",
                        fontWeight: 600,
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                        textAlign: "right",
                        flex: 1,
                      }}
                    >
                      {voucherInfo.code}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      py: 1.5,
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, color: "#374151", minWidth: 140 }}
                    >
                      Discount Type:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#1f2937", textAlign: "right", flex: 1 }}
                    >
                      {voucherInfo.discountType === "percentage"
                        ? "Percentage"
                        : voucherInfo.discountType === "fixed"
                        ? "Fixed Amount"
                        : "N/A"}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      py: 1.5,
                      backgroundColor: "#ecfdf5",
                      margin: "0 -20px",
                      padding: "16px 20px",
                      borderRadius: 1,
                      borderTop: "2px solid #10b981",
                      borderBottom: "2px solid #10b981",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, color: "#374151", minWidth: 140 }}
                    >
                      Discount Amount:
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#10b981",
                        fontWeight: 700,
                        textAlign: "right",
                        flex: 1,
                      }}
                    >
                      {getDiscountText(voucherInfo)}
                    </Typography>
                  </Box>

                  {voucherInfo.description && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        py: 1.5,
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: "#374151",
                          minWidth: 140,
                        }}
                      >
                        Description:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#1f2937", textAlign: "right", flex: 1 }}
                      >
                        {voucherInfo.description}
                      </Typography>
                    </Box>
                  )}

                  {voucherInfo.expiryDate && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        py: 1.5,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: "#374151",
                          minWidth: 140,
                        }}
                      >
                        Expiry Date:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#1f2937", textAlign: "right", flex: 1 }}
                      >
                        {new Date(voucherInfo.expiryDate).toLocaleDateString(
                          "en-US"
                        )}
                      </Typography>
                    </Box>
                  )}
                </Paper>

                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={handleReset}
                    sx={{
                      borderColor: "#12422a",
                      color: "#12422a",
                      textTransform: "none",
                      fontWeight: 600,
                      padding: "12px 24px",
                      borderRadius: 2,
                      "&:hover": {
                        backgroundColor: "#12422a",
                        color: "#ffffff",
                        borderColor: "#12422a",
                      },
                    }}
                  >
                    Apply Another Voucher
                  </Button>
                </Box>
              </Box>
            );
          })()}

          {/* Instructions */}
          {!appliedVoucher && (
            <Box
              sx={{
                mt: 3,
                p: 3,
                backgroundColor: "#f9fafb",
                borderRadius: 2,
                border: "1px solid #e5e7eb",
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: "#12422a", mb: 2 }}
              >
                How to use:
              </Typography>
              <Box component="ul" sx={{ m: 0, pl: 3 }}>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Enter the voucher code provided by the customer in the field
                  above
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Click "Apply" or press Enter to validate and apply the voucher
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  The voucher will be applied to reduce the total bill amount
                </Typography>
                <Typography component="li" variant="body2">
                  Each voucher code can only be used once
                </Typography>
              </Box>
            </Box>
          )}
        </Paper>
      </div>
    </div>
  );
}


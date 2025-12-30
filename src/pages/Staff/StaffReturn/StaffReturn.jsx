import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { scanReturnApi, checkReturnApi, confirmReturnApi, clearScanData, clearPreviewData, getDamagePolicyApi } from "../../../store/slices/returnSlice";
import { FaBoxOpen, FaCheckCircle, FaExclamationTriangle, FaUser, FaPhone, FaCalendarAlt, FaMoneyBillWave, FaClock } from "react-icons/fa";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  InputAdornment,
  CircularProgress,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Divider,
  Chip,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import { QrCodeScanner as QrCodeIcon, CloudUpload as UploadIcon, Close as CloseIcon } from "@mui/icons-material";
import toast from "react-hot-toast";
import "./StaffReturn.css";

const FACE_LABELS = {
  front: "Front",
  back: "Back",
  left: "Left",
  right: "Right",
  top: "Top",
  bottom: "Bottom",
};

// Yup schema for form validation
const returnFormSchema = yup.object({
  frontIssue: yup.string().optional(),
  backIssue: yup.string().optional(),
  leftIssue: yup.string().optional(),
  rightIssue: yup.string().optional(),
  topIssue: yup.string().optional(),
  bottomIssue: yup.string().optional(),
});

// Helper function to format issue labels
const formatIssueLabel = (issue) => {
  const labels = {
    none: "No issue",
    scratch_light: "Light scratch",
    scratch_medium: "Medium scratch",
    scratch_heavy: "Heavy scratch",
    dirty_light: "Light dirt",
    dirty_heavy: "Heavy dirt",
    dent_small: "Small dent",
    dent_large: "Large dent",
    crack_small: "Small crack",
    crack_large: "Large crack",
    deformed: "Deformed",
    broken: "Broken",
  };
  return labels[issue] || issue;
};

export default function StaffReturn() {
  const dispatch = useDispatch();
  const { scanData, previewData, isLoading, error, damagePolicy } = useSelector((state) => state.return);

  const [serialNumber, setSerialNumber] = useState("");
  const [images, setImages] = useState({
    frontImage: null,
    backImage: null,
    leftImage: null,
    rightImage: null,
    topImage: null,
    bottomImage: null,
  });
  const [previews, setPreviews] = useState({
    frontImage: null,
    backImage: null,
    leftImage: null,
    rightImage: null,
    topImage: null,
    bottomImage: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmNote, setConfirmNote] = useState("");
  const previewUrlsRef = useRef(new Set());

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(returnFormSchema),
    defaultValues: {
      frontIssue: "none",
      backIssue: "none",
      leftIssue: "none",
      rightIssue: "none",
      topIssue: "none",
      bottomIssue: "none",
    },
  });

  // Load damage policy on component mount
  useEffect(() => {
    dispatch(getDamagePolicyApi());
  }, [dispatch]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    const currentUrls = previewUrlsRef.current;
    return () => {
      currentUrls.forEach((url) => {
        URL.revokeObjectURL(url);
      });
      currentUrls.clear();
    };
  }, []);

  const handleScanSerialNumber = async () => {
    if (!serialNumber.trim()) {
      toast.error("Please enter serial number");
      return;
    }

    try {
      await dispatch(scanReturnApi({ serialNumber: serialNumber.trim() })).unwrap();
      toast.success("Scanned successfully!");
    } catch (error) {
      const errorMessage =
        error?.message || error?.error || error?.data?.message || "Product not found";
      toast.error(errorMessage);
    }
  };

  const handleImageChange = (face, file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be under 5MB");
      return;
    }

    const imageKey = `${face}Image`;
    
    // Cleanup previous preview URL if exists
    setPreviews((prev) => {
      if (prev[imageKey]) {
        URL.revokeObjectURL(prev[imageKey]);
        previewUrlsRef.current.delete(prev[imageKey]);
      }
      return prev;
    });

    setImages((prev) => ({ ...prev, [imageKey]: file }));
    const previewUrl = URL.createObjectURL(file);
    previewUrlsRef.current.add(previewUrl);
    setPreviews((prev) => ({ ...prev, [imageKey]: previewUrl }));
  };

  const handleRemoveImage = (face) => {
    const imageKey = `${face}Image`;
    const preview = previews[imageKey];
    
    if (preview) {
      URL.revokeObjectURL(preview);
      previewUrlsRef.current.delete(preview);
    }
    
    setImages((prev) => ({ ...prev, [imageKey]: null }));
    setPreviews((prev) => ({ ...prev, [imageKey]: null }));
  };

  const onSubmit = async (data) => {
    if (!scanData) {
      toast.error("Please scan serial number first");
      return;
    }

    // Validate all images are uploaded
    const allImagesUploaded = Object.values(images).every((img) => img !== null);
    if (!allImagesUploaded) {
      toast.error("Please upload all 6 photos (6 faces)");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      
      // Append all images
      Object.keys(images).forEach((key) => {
        if (images[key]) {
          formData.append(key, images[key]);
        }
      });

      // Append all issues
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key] || "");
      });

      const result = await dispatch(
        checkReturnApi({
          serialNumber: scanData?.product?.serialNumber || serialNumber,
          formData,
        })
      ).unwrap();

      // Debug log to check response structure
      console.log("Check Return API Response:", result);

      toast.success("Check completed! Please review and confirm.");
    } catch (error) {
      const errorMessage =
        error?.message || error?.error || error?.data?.message || "An error occurred during check";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirm = async () => {
    if (!previewData) {
      toast.error("No preview data");
      return;
    }

    setIsConfirming(true);

    try {
      const confirmData = {
        note: confirmNote || "",
        damageFaces: previewData.damageFaces || [],
        tempImages: previewData.tempImages || {},
        totalDamagePoints: previewData.totalDamagePoints || 0,
        finalCondition: previewData.finalCondition || "good",
      };

      await dispatch(
        confirmReturnApi({
          serialNumber: previewData.serialNumber || scanData?.product?.serialNumber || serialNumber,
          confirmData,
        })
      ).unwrap();

      toast.success("Return confirmed successfully!");
      
      // Close modal and reset everything after successful confirmation
      dispatch(clearPreviewData());
      setConfirmNote("");
      handleReset();
    } catch (error) {
      const errorMessage =
        error?.message || error?.error || error?.data?.message || "An error occurred during confirmation";
      toast.error(errorMessage);
    } finally {
      setIsConfirming(false);
    }
  };

  const handleReset = () => {
    // Cleanup all preview URLs
    previewUrlsRef.current.forEach((url) => {
      URL.revokeObjectURL(url);
    });
    previewUrlsRef.current.clear();

    setSerialNumber("");
    setConfirmNote("");
    setImages({
      frontImage: null,
      backImage: null,
      leftImage: null,
      rightImage: null,
      topImage: null,
      bottomImage: null,
    });
    setPreviews({
      frontImage: null,
      backImage: null,
      leftImage: null,
      rightImage: null,
      topImage: null,
      bottomImage: null,
    });
    reset({
      frontIssue: "none",
      backIssue: "none",
      leftIssue: "none",
      rightIssue: "none",
      topIssue: "none",
      bottomIssue: "none",
    });
    dispatch(clearScanData());
    dispatch(clearPreviewData());
  };

  const handleClosePreviewModal = () => {
    if (!isConfirming) {
      dispatch(clearPreviewData());
      setConfirmNote("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleScanSerialNumber();
    }
  };

  const product = scanData?.product;
  const transaction = scanData?.transaction;
  const lateInfo = scanData?.lateInfo;
  const lastConditionImages = product?.lastConditionImages;

  // Debug: Log previewData to check if it's being set
  useEffect(() => {
    if (previewData) {
      console.log("Preview Data in component:", previewData);
    }
  }, [previewData]);

  return (
    <div className="staff-return-page">
      <div className="return-page-container">
        {/* Header */}
        <Box className="return-content-header" sx={{ mb: 3 }}>
          <Box className="header-left">
            <FaBoxOpen style={{ fontSize: 32, color: "#12422a" }} />
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
                Return Check
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#6b7280", fontSize: "0.875rem" }}
              >
                Scan QR code and review product condition
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Serial Number Input Section */}
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
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: "#374151", mb: 2 }}
          >
            Enter Serial Number
          </Typography>
          <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
            <TextField
              fullWidth
              placeholder="Enter or scan serial number..."
              value={serialNumber}
              onChange={(e) => {
                setSerialNumber(e.target.value.toUpperCase());
                dispatch(clearScanData());
              }}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <QrCodeIcon sx={{ color: "#6b7280" }} />
                  </InputAdornment>
                ),
                sx: {
                  textTransform: "uppercase",
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
              onClick={handleScanSerialNumber}
              disabled={isLoading || !serialNumber.trim()}
              sx={{
                backgroundColor: "#12422a",
                color: "#ffffff",
                textTransform: "none",
                fontWeight: 600,
                padding: "14px 28px",
                borderRadius: 2,
                minWidth: "120px",
                "&:hover": {
                  backgroundColor: "#0d2e1c",
                },
                "&:disabled": {
                  backgroundColor: "#9ca3af",
                },
              }}
            >
              {isLoading ? <CircularProgress size={20} color="inherit" /> : "Scan"}
            </Button>
          </Box>
        </Paper>

        {/* Product Information Section */}
        {product && transaction && (
          <>
            {/* Product & Transaction Info Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              {/* Product Info Card */}
              <Grid item size={6}  >
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    height: "100%",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: "#12422a", mb: 2.5, display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <FaBoxOpen /> Product Information
                  </Typography>
                  <Divider sx={{ mb: 2.5 }} />
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="caption" sx={{ color: "#6b7280", fontWeight: 600, display: "block", mb: 0.5 }}>
                        Product name
                      </Typography>
                      <Typography variant="body1" sx={{ color: "#1f2937", fontWeight: 500 }}>
                        {product.productGroupId?.name || "N/A"}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: "#6b7280", fontWeight: 600, display: "block", mb: 0.5 }}>
                        Serial Number
                      </Typography>
                      <Typography variant="body1" sx={{ color: "#12422a", fontFamily: "monospace", fontWeight: 600 }}>
                        {product.serialNumber}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: "#6b7280", fontWeight: 600, display: "block", mb: 0.5 }}>
                        Size
                      </Typography>
                      <Typography variant="body1" sx={{ color: "#1f2937", fontWeight: 500 }}>
                        {product.productSizeId?.sizeName || "N/A"}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: "#6b7280", fontWeight: 600, display: "block", mb: 0.5 }}>
                        Condition
                      </Typography>
                      <Chip
                        label={product.condition === "good" ? "Good" : product.condition}
                        color={product.condition === "good" ? "success" : "default"}
                        size="small"
                      />
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: "#6b7280", fontWeight: 600, display: "block", mb: 0.5 }}>
                        Reuse count
                      </Typography>
                      <Typography variant="body1" sx={{ color: "#1f2937", fontWeight: 500 }}>
                        {product.reuseCount || 0} times
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>

              {/* Transaction Info Card */}
              <Grid item size={6} >
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    height: "100%",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: "#12422a", mb: 2.5, display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <FaUser /> Transaction Information
                  </Typography>
                  <Divider sx={{ mb: 2.5 }} />
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="caption" sx={{ color: "#6b7280", fontWeight: 600, display: "block", mb: 0.5 }}>
                        <FaUser style={{ marginRight: 4, fontSize: 12 }} />
                        Customer
                      </Typography>
                      <Typography variant="body1" sx={{ color: "#1f2937", fontWeight: 500 }}>
                        {transaction.customerId?.fullName || "N/A"}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: "#6b7280", fontWeight: 600, display: "block", mb: 0.5 }}>
                        <FaPhone style={{ marginRight: 4, fontSize: 12 }} />
                        Phone
                      </Typography>
                      <Typography variant="body1" sx={{ color: "#1f2937", fontWeight: 500 }}>
                        {transaction.customerId?.phone || "N/A"}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: "#6b7280", fontWeight: 600, display: "block", mb: 0.5 }}>
                        <FaCalendarAlt style={{ marginRight: 4, fontSize: 12 }} />
                        Borrow date
                      </Typography>
                      <Typography variant="body1" sx={{ color: "#1f2937", fontWeight: 500 }}>
                        {new Date(transaction.borrowDate).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: "#6b7280", fontWeight: 600, display: "block", mb: 0.5 }}>
                        <FaClock style={{ marginRight: 4, fontSize: 12 }} />
                        Due date
                      </Typography>
                      <Typography variant="body1" sx={{ color: "#1f2937", fontWeight: 500 }}>
                        {new Date(transaction.dueDate).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: "#6b7280", fontWeight: 600, display: "block", mb: 0.5 }}>
                        <FaMoneyBillWave style={{ marginRight: 4, fontSize: 12 }} />
                        Deposit
                      </Typography>
                      <Typography variant="body1" sx={{ color: "#1f2937", fontWeight: 600 }}>
                        {transaction.depositAmount?.toLocaleString("vi-VN")} VND
                      </Typography>
                    </Box>
                    {lateInfo && (
                      <>
                        <Divider />
                        <Box>
                          <Typography variant="caption" sx={{ color: "#6b7280", fontWeight: 600, display: "block", mb: 0.5 }}>
                            Late return
                          </Typography>
                          <Chip
                            label={lateInfo.isLate ? `Yes (${lateInfo.lateDays} days)` : "No"}
                            color={lateInfo.isLate ? "error" : "success"}
                            size="small"
                          />
                        </Box>
                        {lateInfo.isLate && (
                          <Box>
                            <Typography variant="caption" sx={{ color: "#6b7280", fontWeight: 600, display: "block", mb: 0.5 }}>
                              Late fee
                            </Typography>
                            <Typography variant="body1" sx={{ color: "#dc2626", fontWeight: 600 }}>
                              {lateInfo.lateFee?.toLocaleString("vi-VN")} VND
                            </Typography>
                          </Box>
                        )}
                        <Box sx={{ backgroundColor: "#ecfdf5", p: 2, borderRadius: 1, border: "1px solid #10b981" }}>
                          <Typography variant="caption" sx={{ color: "#065f46", fontWeight: 600, display: "block", mb: 0.5 }}>
                            Refund amount
                          </Typography>
                          <Typography variant="h6" sx={{ color: "#10b981", fontWeight: 700 }}>
                            {lateInfo.finalReturnMoney?.toLocaleString("vi-VN")} VND
                          </Typography>
                        </Box>
                      </>
                    )}
                  </Stack>
                </Paper>
              </Grid>
            </Grid>

            {/* Previous Condition Images - 3 per row */}
            {lastConditionImages && (
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
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: "#12422a", mb: 2.5 }}
                >
                  Previous Condition Photos
                </Typography>
                <Grid container spacing={2}>
                  {Object.keys(FACE_LABELS).map((face) => {
                    const imageKey = `${face}Image`;
                    const imageUrl = lastConditionImages[imageKey];
                    if (!imageUrl) return null;

                    return (
                      <Grid item size={4} key={face}>
                        <Card
                          sx={{
                            height: "100%",
                            border: "1px solid #e5e7eb",
                            "&:hover": {
                              boxShadow: 4,
                            },
                          }}
                        >
                          <CardMedia
                            component="img"
                            height="200"
                            image={imageUrl}
                            alt={FACE_LABELS[face]}
                            sx={{ objectFit: "cover" }}
                          />
                          <CardContent sx={{ p: 1.5, textAlign: "center" }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: "#374151" }}>
                              {FACE_LABELS[face]}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              </Paper>
            )}

            {/* Upload New Condition Images Form - 3 per row */}
            {!previewData && (
            <Paper
              elevation={0}
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              sx={{
                p: 3,
                borderRadius: 2,
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                mb: 3,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: "#12422a", mb: 2.5 }}
              >
                Upload Current Condition Photos <span style={{ color: "#dc2626" }}>(Required)</span>
              </Typography>
              
              <Grid container spacing={3}>
                {Object.keys(FACE_LABELS).map((face) => {
                  const imageKey = `${face}Image`;
                  const issueKey = `${face}Issue`;
                  const preview = previews[imageKey];
                  const hasImage = images[imageKey] !== null;

                  return (
                    <Grid item size={4} key={face}>
                      <Box
                        sx={{
                          border: "2px solid",
                          borderColor: hasImage ? "#10b981" : "#e5e7eb",
                          borderRadius: 2,
                          p: 2,
                          backgroundColor: hasImage ? "#f0fdf4" : "#f9fafb",
                          transition: "all 0.2s",
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600, color: "#374151", mb: 1.5, display: "flex", alignItems: "center", gap: 0.5 }}
                        >
                          {FACE_LABELS[face]}
                          <span style={{ color: "#dc2626" }}>*</span>
                          {hasImage && <FaCheckCircle style={{ color: "#10b981", fontSize: 14, marginLeft: "auto" }} />}
                        </Typography>

                        {/* Image Preview or Upload Button */}
                        {preview ? (
                          <Box sx={{ mb: 2, position: "relative" }}>
                            <img
                              src={preview}
                              alt={FACE_LABELS[face]}
                              style={{
                                width: "100%",
                                height: "200px",
                                objectFit: "cover",
                                borderRadius: "8px",
                                border: "1px solid #e5e7eb",
                              }}
                            />
                            <Button
                              size="small"
                              onClick={() => handleRemoveImage(face)}
                              sx={{
                                position: "absolute",
                                top: 8,
                                right: 8,
                                minWidth: "auto",
                                backgroundColor: "rgba(220, 38, 38, 0.9)",
                                color: "white",
                                padding: "4px 8px",
                                "&:hover": {
                                  backgroundColor: "rgba(220, 38, 38, 1)",
                                },
                              }}
                            >
                              <CloseIcon fontSize="small" />
                            </Button>
                          </Box>
                        ) : (
                          <label htmlFor={`upload-${face}`}>
                            <input
                              accept="image/*"
                              style={{ display: "none" }}
                              id={`upload-${face}`}
                              type="file"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  handleImageChange(face, file);
                                }
                              }}
                            />
                            <Button
                              component="span"
                              variant="outlined"
                              fullWidth
                              startIcon={<UploadIcon />}
                              sx={{
                                borderColor: "#12422a",
                                color: "#12422a",
                                py: 2,
                                mb: 2,
                                borderStyle: "dashed",
                                "&:hover": {
                                  borderColor: "#0d2e1c",
                                  backgroundColor: "#f0f9f4",
                                  borderStyle: "solid",
                                },
                              }}
                            >
                              Upload Photo
                            </Button>
                          </label>
                        )}

                        {/* Issue Select */}
                        <Controller
                          name={issueKey}
                          control={control}
                          render={({ field }) => (
                            <FormControl
                              fullWidth
                              size="small"
                              error={!!errors[issueKey]}
                            >
                              <InputLabel id={`${issueKey}-label`}>Damage condition</InputLabel>
                              <Select
                                {...field}
                                labelId={`${issueKey}-label`}
                                label="Damage condition"
                                sx={{
                                  "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#e5e7eb",
                                  },
                                  "&:hover .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#12422a",
                                  },
                                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#12422a",
                                  },
                                }}
                              >
                                {damagePolicy && damagePolicy.length > 0 ? (
                                  damagePolicy.map((policy) => (
                                    <MenuItem key={policy.issue} value={policy.issue}>
                                      <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                                        <span>{formatIssueLabel(policy.issue)}</span>
                                        <Chip
                                          label={`-${policy.points}`}
                                          size="small"
                                          color={policy.points === 0 ? "success" : policy.points <= 3 ? "warning" : "error"}
                                          sx={{ ml: 1, height: "20px", fontSize: "0.7rem" }}
                                        />
                                      </Box>
                                    </MenuItem>
                                  ))
                                ) : (
                                  <MenuItem disabled>Loading...</MenuItem>
                                )}
                              </Select>
                              {errors[issueKey] && (
                                <FormHelperText>{errors[issueKey]?.message}</FormHelperText>
                              )}
                            </FormControl>
                          )}
                        />
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>

              {/* Submit Buttons */}
              <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 4 }}>
                <Button
                  variant="outlined"
                  onClick={handleReset}
                  disabled={isSubmitting}
                  sx={{
                    borderColor: "#6b7280",
                    color: "#6b7280",
                    textTransform: "none",
                    fontWeight: 600,
                    padding: "12px 32px",
                    borderRadius: 2,
                    "&:hover": {
                      borderColor: "#374151",
                      backgroundColor: "#f9fafb",
                    },
                  }}
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting || Object.values(images).some((img) => !img)}
                  startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <FaCheckCircle />}
                  sx={{
                    backgroundColor: "#12422a",
                    color: "#ffffff",
                    textTransform: "none",
                    fontWeight: 600,
                    padding: "12px 32px",
                    borderRadius: 2,
                    boxShadow: "0 4px 12px rgba(18, 66, 42, 0.3)",
                    "&:hover": {
                      backgroundColor: "#0d2e1c",
                      boxShadow: "0 6px 16px rgba(18, 66, 42, 0.4)",
                    },
                    "&:disabled": {
                      backgroundColor: "#9ca3af",
                      boxShadow: "none",
                    },
                  }}
                >
                  {isSubmitting ? "Processing..." : "Submit Check"}
                </Button>
              </Box>
            </Paper>
            )}
          </>
        )}

        {/* Preview Confirmation Modal */}
        <Dialog
          open={!!previewData}
          onClose={handleClosePreviewModal}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
            },
          }}
        >
          <DialogTitle sx={{ pb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <FaCheckCircle style={{ fontSize: 28, color: "#10b981" }} />
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "#12422a" }}>
                    Confirm Return
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#6b7280", mt: 0.5 }}>
                    Please review details before confirming
                  </Typography>
                </Box>
              </Box>
              <IconButton
                onClick={handleClosePreviewModal}
                disabled={isConfirming}
                sx={{
                  color: "#6b7280",
                  "&:hover": {
                    backgroundColor: "#f3f4f6",
                  },
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>

          <DialogContent dividers sx={{ pt: 3 }}>
            {previewData && (
              <>
                {/* Preview Images */}
                {previewData.tempImages && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: "#374151", mb: 2 }}>
                    Uploaded Photos
                    </Typography>
                    <Grid container spacing={2}>
                      {Object.keys(FACE_LABELS).map((face) => {
                        const imageKey = `${face}Image`;
                        const imageUrl = previewData.tempImages[imageKey];
                        if (!imageUrl) return null;

                        return (
                          <Grid item size={4} key={face}>
                            <Card
                              sx={{
                                border: "1px solid #e5e7eb",
                                "&:hover": {
                                  boxShadow: 4,
                                },
                              }}
                            >
                              <CardMedia
                                component="img"
                                height="150"
                                image={imageUrl}
                                alt={FACE_LABELS[face]}
                                sx={{ objectFit: "cover" }}
                              />
                              <CardContent sx={{ p: 1.5, textAlign: "center" }}>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: "#374151" }}>
                                  {FACE_LABELS[face]}
                                </Typography>
                                {previewData.damageFaces && (
                                  <Chip
                                    label={formatIssueLabel(
                                      previewData.damageFaces.find((df) => df.face === face)?.issue || "none"
                                    )}
                                    size="small"
                                    color={
                                      previewData.damageFaces.find((df) => df.face === face)?.issue === "none"
                                        ? "success"
                                        : "warning"
                                    }
                                    sx={{ mt: 0.5, fontSize: "0.7rem" }}
                                  />
                                )}
                              </CardContent>
                            </Card>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Box>
                )}

                {/* Summary Info */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item size={6}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: "#f9fafb",
                        border: "1px solid #e5e7eb",
                      }}
                    >
                      <Typography variant="caption" sx={{ color: "#6b7280", fontWeight: 600, display: "block", mb: 1 }}>
                        Total Damage Points
                      </Typography>
                      <Typography
                        variant="h4"
                        sx={{
                          color: previewData.totalDamagePoints > 0 ? "#dc2626" : "#10b981",
                          fontWeight: 700,
                        }}
                      >
                        {previewData.totalDamagePoints || 0}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item size={6}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: "#f9fafb",
                        border: "1px solid #e5e7eb",
                      }}
                    >
                      <Typography variant="caption" sx={{ color: "#6b7280", fontWeight: 600, display: "block", mb: 1 }}>
                        Final Condition
                      </Typography>
                      <Chip
                        label={previewData.finalCondition === "good" ? "Good" : previewData.finalCondition}
                        color={previewData.finalCondition === "good" ? "success" : "default"}
                        sx={{ fontSize: "1rem", height: "32px", fontWeight: 600 }}
                      />
                    </Box>
                  </Grid>
                </Grid>

                {/* Damage Faces Details */}
                {previewData.damageFaces && previewData.damageFaces.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: "#374151", mb: 2 }}>
                    Damage Details Per Face
                    </Typography>
                    <Grid container spacing={2}>
                      {previewData.damageFaces.map((damageFace, index) => (
                        <Grid item size={4} key={index}>
                          <Box
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              backgroundColor: damageFace.issue === "none" ? "#f0fdf4" : "#fef3c7",
                              border: `1px solid ${damageFace.issue === "none" ? "#10b981" : "#f59e0b"}`,
                            }}
                          >
                            <Typography variant="body2" sx={{ fontWeight: 600, color: "#374151", mb: 1 }}>
                              {FACE_LABELS[damageFace.face]}
                            </Typography>
                            <Chip
                              label={formatIssueLabel(damageFace.issue)}
                              size="small"
                              color={damageFace.issue === "none" ? "success" : "warning"}
                            />
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}

                {/* Note Input */}
                <Box>
                  <TextField
                    fullWidth
                    label="Note (optional)"
                    placeholder="Enter additional note..."
                    multiline
                    rows={3}
                    value={confirmNote}
                    onChange={(e) => setConfirmNote(e.target.value)}
                    disabled={isConfirming}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": {
                          borderColor: "#12422a",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#12422a",
                        },
                      },
                    }}
                  />
                </Box>
              </>
            )}
          </DialogContent>

          <DialogActions sx={{ px: 3, py: 2.5, gap: 1.5 }}>
            <Button
              variant="outlined"
              onClick={handleClosePreviewModal}
              disabled={isConfirming}
              sx={{
                borderColor: "#6b7280",
                color: "#6b7280",
                textTransform: "none",
                fontWeight: 600,
                padding: "10px 24px",
                borderRadius: 2,
                "&:hover": {
                  borderColor: "#374151",
                  backgroundColor: "#f9fafb",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleConfirm}
              disabled={isConfirming}
              startIcon={isConfirming ? <CircularProgress size={20} color="inherit" /> : <FaCheckCircle />}
              sx={{
                backgroundColor: "#10b981",
                color: "#ffffff",
                textTransform: "none",
                fontWeight: 600,
                padding: "10px 24px",
                borderRadius: 2,
                boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
                "&:hover": {
                  backgroundColor: "#059669",
                  boxShadow: "0 6px 16px rgba(16, 185, 129, 0.4)",
                },
                "&:disabled": {
                  backgroundColor: "#9ca3af",
                  boxShadow: "none",
                },
              }}
            >
              {isConfirming ? "Confirming..." : "Confirm Return"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Error Display */}
        {error && !product && (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              mb: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <FaExclamationTriangle style={{ fontSize: 24, color: "#dc2626" }} />
              <Typography variant="body1" sx={{ color: "#991b1b", fontWeight: 600 }}>
                {error?.message || error?.error || "An error occurred while scanning serial number"}
              </Typography>
            </Box>
          </Paper>
        )}

        {/* Instructions */}
        {!product && (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              backgroundColor: "#f9fafb",
              border: "1px solid #e5e7eb",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: "#12422a", mb: 2 }}
            >
              How to use
            </Typography>
            <Box component="ul" sx={{ m: 0, pl: 3, "& li": { mb: 1 } }}>
              <Typography component="li" variant="body2" sx={{ color: "#4b5563" }}>
                Enter or scan the product serial number above
              </Typography>
              <Typography component="li" variant="body2" sx={{ color: "#4b5563" }}>
                Review product info and previous condition photos
              </Typography>
              <Typography component="li" variant="body2" sx={{ color: "#4b5563" }}>
                Upload 6 current-condition photos (all faces) - <strong>Required</strong>
              </Typography>
              <Typography component="li" variant="body2" sx={{ color: "#4b5563" }}>
                Select damage status per face, add notes if any, then click "Submit Check"
              </Typography>
            </Box>
          </Paper>
        )}
      </div>
    </div>
  );
}

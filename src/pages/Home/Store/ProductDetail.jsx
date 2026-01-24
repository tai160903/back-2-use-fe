import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Pagination from "@mui/material/Pagination";
import TextField from "@mui/material/TextField";
import "./ProductDetail.css";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import QrCode2RoundedIcon from "@mui/icons-material/QrCode2Rounded";
import Box from "@mui/material/Box";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { PATH } from "../../../routes/path";
import { isAuthenticated } from "../../../utils/authUtils";
import { getDetailsProductById, getProductById, getStoreById } from "../../../store/slices/storeSilce";
import { borrowProductOnlineApi } from "../../../store/slices/borrowSlice";

export default function ProductDetail() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const dispatch = useDispatch();
  const { detailsProduct, isLoadingDetailsProduct, error, storeDetail } = useSelector((state) => state.store);
  const [sizeFilter, setSizeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("all"); // all | available | non-available
  const [conditionFilter, setConditionFilter] = useState("all"); // all | good | damaged | expired | lost
  const [clientPage, setClientPage] = useState(1);
  const clientPageSize = 10;
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedProductDetail, setSelectedProductDetail] = useState(null);
  const [isSelectedProductLoading, setIsSelectedProductLoading] = useState(false);
  const [borrowDialogOpen, setBorrowDialogOpen] = useState(false);
  const [borrowPayload, setBorrowPayload] = useState(null);
  const [borrowDays, setBorrowDays] = useState(1);
  const [borrowItemCo2, setBorrowItemCo2] = useState(0);
  const { isLoading: isBorrowLoading } = useSelector((state) => state.borrow || { isLoading: false });
  const formatCurrency = (value) => Number(value || 0).toLocaleString("vi-VN");
  const calculateDeposit = (basePrice = 0, days = 1) => {
    const price = Number(basePrice) || 0;
    const duration = Math.max(Number(days) || 0, 1);
    return price + price * 0.01 * duration;
  };

  useEffect(() => {
    // Bảo vệ route: bắt buộc đăng nhập
    if (!isAuthenticated()) {
      toast.error("Please login to view product details");
      navigate(PATH.LOGIN, { replace: true });
      return;
    }

    if (productId) {
      const apiStatus = statusFilter === "all" ? undefined : statusFilter;
      const apiCondition = conditionFilter === "all" ? undefined : conditionFilter;

      dispatch(
        getDetailsProductById({
          productGroupId: productId,
          page: 1,
          limit: 100000,
          status: apiStatus,
          condition: apiCondition,
        })
      );
      setClientPage(1);
      setSizeFilter("All");
    }
  }, [dispatch, productId, navigate, statusFilter, conditionFilter]);

  // Lấy thông tin business/store khi có detailsProduct
  useEffect(() => {
    if (detailsProduct) {
      // Lấy businessId từ nhiều nguồn có thể
      const businessId = 
        detailsProduct.business?._id ||
        detailsProduct.businessId ||
        (detailsProduct.products && detailsProduct.products[0]?.productGroupId?.businessId?._id) ||
        (detailsProduct.products && detailsProduct.products[0]?.productGroupId?.businessId) ||
        (detailsProduct.products && detailsProduct.products[0]?.businessId);

      if (businessId) {
        dispatch(getStoreById(businessId));
      }
    }
  }, [dispatch, detailsProduct]);

  useEffect(() => {
    setClientPage(1);
  }, [sizeFilter]);

  if (isLoadingDetailsProduct) {
    return (
      <div className="productDetail" style={{ padding: "16px" }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
          Back
        </Button>
        <Typography sx={{ mt: 2 }}>Loading...</Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div className="productDetail" style={{ padding: "16px" }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
         Back
        </Button>
        <Typography variant="h6" color="error" sx={{ mt: 2 }}>
          An error occurred while loading the product
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {error.message || "Please try again later"}
        </Typography>
      </div>
    );
  }

  const allItems = (detailsProduct && detailsProduct.products) ? detailsProduct.products : [];

  // Danh sách size duy nhất từ tất cả items
  const sizeOptions = (() => {
    const sizeNameSet = new Set();
    for (const productItem of allItems) {
      const sizeName = productItem?.productSizeId?.sizeName;
      if (sizeName) sizeNameSet.add(sizeName);
    }
    return Array.from(sizeNameSet);
  })();

  // filter by size
  const filteredItems =
    sizeFilter && sizeFilter !== "All"
      ? allItems.filter((productItem) => (productItem?.productSizeId?.sizeName || "") === sizeFilter)
      : allItems;

  // Phân trang 
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / clientPageSize));
  const startIndex = (clientPage - 1) * clientPageSize;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + clientPageSize);

  // group info (from first item)
  const group = allItems[0]?.productGroupId || null;
  const groupImage = group?.imageUrl || "";
  const groupName = group?.name || "coffee cup";
  
  // Lấy thông tin business/store - ưu tiên từ detailsProduct.business, fallback sang storeDetail
  const business = detailsProduct?.business || storeDetail?.business || storeDetail || null;
  const storeName = business?.businessName || "";

  // Giá/đặt cọc lấy theo size đang lọc (nếu có), fallback item đầu tiên
  const sampleItemForMeta =
    (sizeFilter && sizeFilter !== "All"
      ? allItems.find((it) => (it?.productSizeId?.sizeName || "") === sizeFilter)
      : allItems[0]) || {};
  const metaBasePrice = sampleItemForMeta?.productSizeId?.basePrice || 0;
  const metaDeposit = calculateDeposit(metaBasePrice, 1);
  const metaSize = sampleItemForMeta?.productSizeId?.sizeName || sizeOptions[0] || "—";

  const handleOpenBorrowDialog = (item) => {
    if (!item) return;

    const businessId =
      item.businessId ||
      item.productGroupId?.businessId?._id ||
      item.productGroupId?.businessId ||
      null;

    const basePrice = item?.productSizeId?.basePrice || 0;
    const depositValue = item?.productSizeId?.depositValue || 0;
    const co2Reduced = item?.co2Reduced || item?.totalCo2Reduced || item?.productSizeId?.co2Reduced || item?.productSizeId?.co2EmissionPerKg || 0;

    if (!businessId) {
      toast.error("Store information for this product was not found");
      return;
    }

    const basePayload = {
      productId: item._id,
      businessId,
      basePrice,
      depositValue, 
    };

    setBorrowPayload(basePayload);
    setBorrowDays(10);
    setBorrowItemCo2(co2Reduced);
    setBorrowDialogOpen(true);
  };

  const handleOpenProductDetail = async (item) => {
    if (!item?._id) return;

    // Lưu item ban đầu để phục vụ logic mượn như hiện tại
    setSelectedItem(item);
    setIsSelectedProductLoading(true);
    setSelectedProductDetail(null);

    try {
      const res = await dispatch(getProductById(item._id)).unwrap();
      const productData = res?.data || res;
      setSelectedProductDetail(productData);
    } catch (err) {
      const message =
        err?.data?.message ||
        err?.message ||
        "Không thể tải chi tiết sản phẩm, vui lòng thử lại";
      toast.error(message);
    } finally {
      setIsSelectedProductLoading(false);
    }
  };

  const handleCloseProductDetail = () => {
    setSelectedItem(null);
    setSelectedProductDetail(null);
    setIsSelectedProductLoading(false);
  };

  const handleConfirmBorrowOnline = async () => {
    if (!borrowPayload) return;

    const days = Number(borrowDays);
    if (!days || days <= 0) {
      toast.error("Please enter a valid number of days");
      return;
    }

    const payloadToSend = {
      productId: borrowPayload.productId,
      businessId: borrowPayload.businessId,
      durationInDays: days,
      depositValue: borrowPayload.depositValue,
    };

    try {
      await dispatch(borrowProductOnlineApi(payloadToSend)).unwrap();
      toast.success("Online borrow request created successfully");
      setBorrowDialogOpen(false);
      navigate(PATH.TRANSACTION_HISTORY, { replace: true });
    } catch (err) {
      const message =
        err?.data?.message ||
        err?.message ||
        "Online borrow failed, please try again";
      toast.error(message);
    }
  };

  return (
    <div className="productDetail">
      <div className="productDetail-header">
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>

      <div className="productDetail-hero">
        <div className="productDetail-main">
          <div className="pd-badge">
            <CategoryRoundedIcon fontSize="small" />
            <span>{groupName}</span>
            {storeName && <span> • {storeName}</span>}
          </div>
          <Typography variant="h2" className="pd-title">{groupName}</Typography>
          <Typography className="pd-desc">
            Manage {allItems.length.toLocaleString("vi-VN")} QR codes with different statuses
          </Typography>

          <div className="pd-stats">
            <div className="pd-stat">
              <div className="pd-stat-icon"><PaidRoundedIcon fontSize="small" /></div>
              <div>
                <span className="pd-stat-label">Price</span>
                <span className="pd-stat-value">{metaBasePrice.toLocaleString()}đ</span>
              </div>
            </div>
            <div className="pd-stat">
              <div className="pd-stat-icon"><CategoryRoundedIcon fontSize="small" /></div>
              <div>
                <span className="pd-stat-label">Size</span>
                <span className="pd-stat-value">{metaSize}</span>
              </div>
            </div>
            <div className="pd-stat">
              <div className="pd-stat-icon"><AutorenewRoundedIcon fontSize="small" /></div>
              <div>
                <span className="pd-stat-label">Deposit (Price + 1%/day)</span>
                <span className="pd-stat-value">{formatCurrency(metaDeposit)}đ</span>
              
              </div>
            </div>
          </div>
        </div>
        <div className="productDetail-visual">
          {groupImage ? (
            <img src={groupImage} alt={groupName} />
          ) : (
            <div style={{position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center"}}>
              {groupName?.[0]?.toUpperCase() || "P"}
            </div>
          )}
        </div>
      </div>

      <div className="pd-items">
        <div className="pd-items-header">
          <Typography className="pd-items-title">All QR codes</Typography>
        </div>
        <div className="pd-filters-row">
          <div className="pd-filter-group">
            <span className="pd-filter-label">Filter by size</span>
            <select
              className="pd-filter-select"
              value={sizeFilter}
              onChange={(e) => setSizeFilter(e.target.value)}
            >
              <option value="All">All</option>
              {sizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="pd-filter-group">
            <span className="pd-filter-label">Filter by product status</span>
            <select
              className="pd-filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="available">available</option>
              <option value="non-available">non-available</option>
            </select>
          </div>
          <div className="pd-filter-group">
            <span className="pd-filter-label">Filter by product condition</span>
            <select
              className="pd-filter-select"
              value={conditionFilter}
              onChange={(e) => setConditionFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="good">good</option>
              <option value="damaged">damaged</option>
              <option value="expired">expired</option>
              <option value="lost">lost</option>
            </select>
          </div>
        </div>
        <div className="pd-items-list">
          {paginatedItems.map((item) => {
            const sizeName = item?.productSizeId?.sizeName || "—";
            const basePriceValue = item?.productSizeId?.basePrice || 0;
            const basePrice = formatCurrency(basePriceValue);
            const deposit = formatCurrency(calculateDeposit(basePriceValue, 1));
            const co2Reduced = item?.co2Reduced || item?.totalCo2Reduced || 0;
            return (
              <div key={item._id} className="pd-line-card">
                <div className="pd-line-left">
                  <div className="pd-line-icon">
                    <img
                      src={item?.productGroupId?.imageUrl || groupImage}
                      alt={groupName}
                      className="pd-line-thumb"
                    />
                  </div>
                </div>
                <div className="pd-line-center">
                  <div className="pd-line-title">{groupName}</div>
                  <div className="pd-line-sub">
                    {sizeName} • {groupName}
                  </div>
                  <div className="pd-line-serial" onClick={() => handleOpenProductDetail(item)}>
                    <QrCode2RoundedIcon fontSize="small" />
                    <button className="pd-serial-link">{item.serialNumber}</button>
                  </div>
                  <div className="pd-line-meta">
                    <div className="pd-line-meta-item">
                      <span className="pd-meta-label">Reuse count</span>
                      <span className="pd-meta-value">{item.reuseCount}</span>
                    </div>
                    <div className="pd-line-meta-item">
                      <span className="pd-meta-label">Price</span>
                      <span className="pd-meta-value">{basePrice}đ</span>
                    </div>
                    <div className="pd-line-meta-item">
                      <span className="pd-meta-label">Deposit (Price + 1%/day)</span>
                      <span className="pd-meta-value">{deposit}đ</span>
                    </div>
                    <div className="pd-line-meta-item">
                    
                      
                    </div>
                  </div>
                </div>
                <div className="pd-line-right">
                  <span className={`pd-item-status status-${item.status || "unknown"}`}>
                    {item.status || "unknown"}
                  </span>
                  <Button
                    size="small"
                    className="pd-qr-view-btn"
                    onClick={() => handleOpenProductDetail(item)}
                  >
                    View QR Code
                  </Button>
                </div>
              </div>
            );
          })}
          {filteredItems.length === 0 && (
            <div className="pd-item-empty">
              <Typography>No product found.</Typography>
            </div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
          <Pagination
            count={totalPages}
            page={clientPage}
            onChange={(event, pageNumber) => setClientPage(pageNumber)}
            variant="outlined"
            shape="rounded"
          />
        </div>
      </div>

      {/* Online borrow modal */}
      <Dialog
        open={borrowDialogOpen}
        onClose={() => setBorrowDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Inventory2RoundedIcon fontSize="small" />
            <span style={{ fontWeight: 700, color: "#164c34" }}>
              Borrow product online
            </span>
          </div>
          <IconButton
            aria-label="close"
            onClick={() => setBorrowDialogOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {borrowPayload && (() => {
            const borrowBasePrice = borrowPayload?.basePrice || 0;
            const borrowDayNumber = Math.max(Number(borrowDays) || 0, 1);
            const borrowDeposit = calculateDeposit(borrowBasePrice, borrowDayNumber);
            const borrowDailyFee = borrowBasePrice * 0.01;
            return (
              <div className="pd-detail" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Borrow information
                </Typography>

                <div className="pd-detail-row">
                  <span className="pd-meta-label">Deposit:</span>
                  <span className="pd-detail-value">
                    {formatCurrency(borrowDeposit)}đ
                  </span>
                </div>
                <Typography variant="body2" color="text.secondary">
                  Deposit = Price ({formatCurrency(borrowBasePrice)}đ) + 1% Price x {borrowDayNumber} days ({formatCurrency(borrowDailyFee)}đ/day)
                </Typography>

                <div style={{ marginTop: 12 }}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                    Borrow days
                  </Typography>
                  <TextField
                    type="number"
                    size="small"
                    fullWidth
                    value={borrowDays}
                    onChange={(e) => setBorrowDays(e.target.value)}
                    inputProps={{ min: 1 }}
                    helperText="Enter the number of days you want to borrow (>= 1 day & <= 10 days)"
                  />
                </div>

                <div style={{ marginTop: 12 }}>
                  <Typography variant="body2" color="text.secondary">
                    Borrow type: <strong>online</strong>
                  </Typography>
                </div>

                {/* Note về CO₂ Reduced */}
                {borrowItemCo2 > 0 && (
                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      backgroundColor: '#f0fdf4',
                      border: '2px solid #10b981',
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 1.5,
                      boxShadow: '0 2px 8px rgba(16, 185, 129, 0.15)',
                    }}
                  >
                    <InfoOutlinedIcon sx={{ color: '#10b981', fontSize: 20, mt: 0.25, flexShrink: 0 }} />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#065f46', mb: 0.5 }}>
                          🌱 Environmental Benefit
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#047857', lineHeight: 1.6 }}>
                          When you successfully return this product, you will help reduce <strong>{Number(borrowItemCo2).toFixed(2)} kg CO₂</strong> emissions into the environment. 
                          This is an important contribution to protecting our planet!
                        </Typography>
                      </Box>
                  </Box>
                )}
              </div>
            );
          })()}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setBorrowDialogOpen(false)}>Close</Button>
          <Button
            onClick={handleConfirmBorrowOnline}
            variant="contained"
            disabled={isBorrowLoading}
            sx={{
              backgroundColor: "#12422a",
              "&:hover": { backgroundColor: "#0c351c" },
            }}
          >
            {isBorrowLoading ? "Processing..." : "Confirm borrow"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal chi tiết sản phẩm */}
      <Dialog
        open={Boolean(selectedItem)}
        onClose={handleCloseProductDetail}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          {(() => {
            const displayProduct = selectedProductDetail || selectedItem;
            return (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontWeight: 800, color: "#164c34" }}>{groupName}</span>
                {displayProduct && (
                  <span className={`pd-item-status status-${displayProduct.status || "unknown"}`}>
                    {displayProduct.status || "unknown"}
                  </span>
                )}
          </div>
            );
          })()}
          <IconButton
            aria-label="close"
            onClick={handleCloseProductDetail}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {isSelectedProductLoading && (
            <Typography variant="body2" sx={{ mb: 2 }}>
              Đang tải chi tiết sản phẩm...
            </Typography>
          )}
          {(() => {
            const displayProduct = selectedProductDetail || selectedItem;
            if (!displayProduct) return null;

            const co2Reduced = displayProduct?.co2Reduced || displayProduct?.totalCo2Reduced || 0;
            const displayBasePrice = displayProduct?.productSizeId?.basePrice || 0;
            const displayDeposit = calculateDeposit(displayBasePrice, 1);
            return (
              <div className="pd-detail">
                <div className="pd-detail-header">
                  <div>
                    <span className="pd-meta-label">Size</span>
                    <div className="pd-detail-value">
                      {displayProduct?.productSizeId?.sizeName || "—"}
                    </div>
                  </div>
                  <div>
                    {/* <span className="pd-meta-label">Price</span>
                    <div className="pd-detail-value">
                      {(displayProduct?.productSizeId?.basePrice || 0).toLocaleString()}đ
                    </div> */}
                  </div>
                  <div>
                    <span className="pd-meta-label">Deposit</span>
                    <div className="pd-detail-value">
                      {formatCurrency(displayDeposit)}đ
                    </div>
                    <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
                      Price + 1% Price x {1} day
                    </div>
                  </div>
                  <div>
                    <span className="pd-meta-label">Reuse count</span>
                    <div className="pd-detail-value">{displayProduct.reuseCount}</div>
                  </div>
                  <div>
               
                 
                  </div>
                </div>

                {/* Note về CO₂ Reduced */}
                {co2Reduced > 0 && (
                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      backgroundColor: '#f0fdf4',
                      border: '2px solid #10b981',
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 1.5,
                      boxShadow: '0 2px 8px rgba(16, 185, 129, 0.15)',
                    }}
                  >
                    <InfoOutlinedIcon sx={{ color: '#10b981', fontSize: 20, mt: 0.25, flexShrink: 0 }} />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#065f46', mb: 0.5 }}>
                        🌱 Environmental Benefit
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#047857', lineHeight: 1.6 }}>
                        When you successfully return this product, you will help reduce <strong>{Number(co2Reduced).toFixed(2)} kg CO₂</strong> emissions into the environment. 
                        This is an important contribution to protecting our planet!
                      </Typography>
                    </Box>
                  </Box>
                )}

                <div className="pd-modal-qr">
                  <Typography className="pd-section" style={{ marginTop: 0 }}>
                    Product QR Code
                  </Typography>
                  <div className="pd-modal-qr-box">
                    <img
                      src={displayProduct.qrCode}
                      alt={`QR ${displayProduct.serialNumber}`}
                    />
                  </div>

                  <div className="pd-qr-serial">{displayProduct.serialNumber}</div>

                  {/* Size từ product detail */}
                  <div
                    style={{
                      marginTop: 12,
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 16,
                    }}
                  >
                    <div>
                      <span className="pd-meta-label">Size</span>
                      <div className="pd-detail-value">
                        {displayProduct?.productSizeId?.sizeName || "—"}
                      </div>
                    </div>
                  </div>

                  {/* Last condition images */}
                  {displayProduct.lastConditionImages && (
                    <div style={{ marginTop: 24 }}>
                      <Typography className="pd-section">
                        Last condition images
                      </Typography>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
                          gap: 12,
                          marginTop: 8,
                        }}
                      >
                        {[
                          { key: "topImage", label: "Top" },
                          { key: "bottomImage", label: "Bottom" },
                          { key: "frontImage", label: "Front" },
                          { key: "backImage", label: "Back" },
                          { key: "leftImage", label: "Left" },
                          { key: "rightImage", label: "Right" },
                        ].map(({ key, label }) => {
                          const url = displayProduct.lastConditionImages[key];
                          if (!url) return null;
                          return (
                            <div
                              key={key}
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 4,
                              }}
                            >
                              <span className="pd-meta-label">{label}</span>
                              <img
                                src={url}
                                alt={`${label} condition`}
                                style={{
                                  width: "100%",
                                  aspectRatio: "1 / 1",
                                  objectFit: "cover",
                                  borderRadius: 8,
                                  border: "1px solid #e0e0e0",
                                }}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Last damage faces */}
                  {Array.isArray(displayProduct.lastDamageFaces) &&
                    displayProduct.lastDamageFaces.length > 0 && (
                      <div style={{ marginTop: 24 }}>
                        <Typography className="pd-section">
                          Last damage faces
                        </Typography>
                        <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 8 }}>
                          {displayProduct.lastDamageFaces.map((dmg) => (
                            <div
                              key={dmg._id || `${dmg.face}-${dmg.issue}`}
                              style={{
                                padding: "6px 10px",
                                borderRadius: 999,
                                border: "1px solid #e0e0e0",
                                background:
                                  dmg.issue && dmg.issue !== "none"
                                    ? "rgba(211, 47, 47, 0.06)"
                                    : "rgba(46, 125, 50, 0.06)",
                                fontSize: 12,
                              }}
                            >
                              <strong style={{ textTransform: "capitalize" }}>
                                {dmg.face}
                              </strong>
                              {": "}
                              <span style={{ textTransform: "capitalize" }}>
                                {dmg.issue || "none"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  <div style={{ marginTop: 24 }}>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => {
                        // Ưu tiên dùng selectedProductDetail nếu có, fallback sang selectedItem
                        const itemToUse = selectedProductDetail || selectedItem;
                        handleOpenBorrowDialog(itemToUse);
                      }}
                      sx={{
                        backgroundColor: "#12422a",
                        "&:hover": { backgroundColor: "#0c351c" },
                      }}
                    >
                      Borrow online
                    </Button>
                  </div>
                </div>
              </div>
            );
          })()}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseProductDetail}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

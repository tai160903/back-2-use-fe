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
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import QrCode2RoundedIcon from "@mui/icons-material/QrCode2Rounded";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { PATH } from "../../../routes/path";
import { isAuthenticated } from "../../../utils/authUtils";
import { getDetailsProductById } from "../../../store/slices/storeSilce";
import { borrowProductOnlineApi } from "../../../store/slices/borrowSlice";

export default function ProductDetail() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const dispatch = useDispatch();
  const { detailsProduct, isLoadingDetailsProduct, error } = useSelector((state) => state.store);
  const [sizeFilter, setSizeFilter] = useState("All");
  const [clientPage, setClientPage] = useState(1);
  const clientPageSize = 10;
  const [selectedItem, setSelectedItem] = useState(null);
  const [borrowDialogOpen, setBorrowDialogOpen] = useState(false);
  const [borrowPayload, setBorrowPayload] = useState(null);
  const [borrowDays, setBorrowDays] = useState(1);
  const { isLoading: isBorrowLoading } = useSelector((state) => state.borrow || { isLoading: false });

  useEffect(() => {

    if (!isAuthenticated()) {
      toast.error("Please login to view product details");
      navigate(PATH.LOGIN, { replace: true });
      return;
    }

    if (productId) {
      dispatch(
        getDetailsProductById({
          productGroupId: productId,
          page: 1,
          limit: 100000,
        })
      );
      setClientPage(1);
      setSizeFilter("All");
    }
  }, [dispatch, productId, navigate]);

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

  // Giá/đặt cọc lấy theo size đang lọc (nếu có), fallback item đầu tiên
  const sampleItemForMeta =
    (sizeFilter && sizeFilter !== "All"
      ? allItems.find((it) => (it?.productSizeId?.sizeName || "") === sizeFilter)
      : allItems[0]) || {};
  const metaBasePrice = sampleItemForMeta?.productSizeId?.basePrice || 0;
  const metaDeposit = sampleItemForMeta?.productSizeId?.depositValue || 0;
  const metaSize = sampleItemForMeta?.productSizeId?.sizeName || sizeOptions[0] || "—";

  const handleOpenBorrowDialog = (item) => {
    if (!item) return;

    const businessId =
      item.businessId ||
      item.productGroupId?.businessId?._id ||
      item.productGroupId?.businessId ||
      null;

    const depositValue = item?.productSizeId?.depositValue || 0;

    if (!businessId) {
      toast.error("Store information for this product was not found");
      return;
    }

    const basePayload = {
      productId: item._id,
      businessId,
      durationInDays: 30,
      depositValue,
      type: "online",
    };

    setBorrowPayload(basePayload);
    setBorrowDays(30);
    setBorrowDialogOpen(true);
  };

  const handleConfirmBorrowOnline = async () => {
    if (!borrowPayload) return;

    const days = Number(borrowDays);
    if (!days || days <= 0) {
      toast.error("Please enter a valid number of days");
      return;
    }

    const payloadToSend = {
      ...borrowPayload,
      durationInDays: days,
      type: "online",
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
                <span className="pd-stat-label">Deposit</span>
                <span className="pd-stat-value">{metaDeposit.toLocaleString()}đ</span>
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
        <div className="pd-filter-inline">
            <span className="pd-filter-label">Filter by size</span>
            <div className="pd-size-chips">
              <button
                className={`pd-chip ${sizeFilter === "All" ? "active" : ""}`}
                onClick={() => setSizeFilter("All")}
              >
                <span>All</span>
              </button>
              {sizeOptions.map((option) => (
                <button
                  key={option}
                  className={`pd-chip ${sizeFilter === option ? "active" : ""}`}
                  onClick={() => setSizeFilter(option)}
                >
                  <span>{option}</span>
                </button>
              ))}
            </div>
          </div>
        <div className="pd-items-list">
          {paginatedItems.map((item) => {
            const sizeName = item?.productSizeId?.sizeName || "—";
            const basePrice = (item?.productSizeId?.basePrice || 0).toLocaleString();
            const deposit = (item?.productSizeId?.depositValue || 0).toLocaleString();
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
                  <div className="pd-line-serial" onClick={() => setSelectedItem(item)}>
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
                      <span className="pd-meta-label">Deposit</span>
                      <span className="pd-meta-value">{deposit}đ</span>
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
                    onClick={() => setSelectedItem(item)}
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
          {borrowPayload && (
            <div className="pd-detail" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Borrow information
              </Typography>

              <div className="pd-detail-row">
                <span className="pd-meta-label">Deposit:</span>
                <span className="pd-detail-value">
                  {borrowPayload.depositValue.toLocaleString("vi-VN")}đ
                </span>
              </div>

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
                  helperText="Enter the number of days you want to borrow (>= 1 day)"
                />
              </div>

              <div style={{ marginTop: 12 }}>
                <Typography variant="body2" color="text.secondary">
                  Borrow type: <strong>online</strong>
                </Typography>
              </div>
            </div>
          )}
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
        onClose={() => setSelectedItem(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontWeight: 800, color: "#164c34" }}>{groupName}</span>
            {selectedItem && (
              <span className={`pd-item-status status-${selectedItem.status || "unknown"}`}>
                {selectedItem.status || "unknown"}
              </span>
            )}
          </div>
          <IconButton
            aria-label="close"
            onClick={() => setSelectedItem(null)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedItem && (
            <div className="pd-detail">
              <div className="pd-detail-header">
                <div>
                  <span className="pd-meta-label">Size</span>
                  <div className="pd-detail-value">{selectedItem?.productSizeId?.sizeName || "—"}</div>
                </div>
                <div>
                  <span className="pd-meta-label">Price</span>
                  <div className="pd-detail-value">
                    {(selectedItem?.productSizeId?.basePrice || 0).toLocaleString()}đ
                  </div>
                </div>
                <div>
                  <span className="pd-meta-label">Deposit</span>
                  <div className="pd-detail-value">
                    {(selectedItem?.productSizeId?.depositValue || 0).toLocaleString()}đ
                  </div>
                </div>
                <div>
                  <span className="pd-meta-label">Reuse count</span>
                  <div className="pd-detail-value">{selectedItem.reuseCount}</div>
                </div>
             
              
              </div>

              <div className="pd-modal-qr">
                <Typography className="pd-section" style={{ marginTop: 0 }}>Product QR Code</Typography>
                <div className="pd-modal-qr-box">
                  <img src={selectedItem.qrCode} alt={`QR ${selectedItem.serialNumber}`} />
                </div>

                <div className="pd-qr-serial">{selectedItem.serialNumber}</div>

                <div style={{ marginTop: 16 }}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleOpenBorrowDialog(selectedItem)}
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
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setSelectedItem(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}


import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Pagination from "@mui/material/Pagination";
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
import { getDetailsProductById } from "../../../store/slices/storeSilce";

export default function ProductDetail() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const dispatch = useDispatch();
  const { detailsProduct, isLoadingDetailsProduct, error } = useSelector((state) => state.store);
  const [sizeFilter, setSizeFilter] = useState("All");
  const [clientPage, setClientPage] = useState(1);
  const clientPageSize = 10;
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (productId) {
      dispatch(getDetailsProductById({ productGroupId: productId, page: 1, limit: 100000 }));
      setClientPage(1);
      setSizeFilter("All");
    }
  }, [dispatch, productId]);

  useEffect(() => {
    setClientPage(1);
  }, [sizeFilter]);


  const formatDate = (isoString) => {
    if (!isoString) return "—";
    try {
      return new Date(isoString).toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

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


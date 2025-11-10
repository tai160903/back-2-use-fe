import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Pagination from "@mui/material/Pagination";
import "./ProductDetail.css";
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

  useEffect(() => {
    if (productId) {
      dispatch(getDetailsProductById({ productGroupId: productId, page: 1, limit: 100000 }));
      setClientPage(1);
      setSizeFilter("All");
    }
  }, [dispatch, productId]);

  // Reset về trang 1 khi đổi filter (đặt trước mọi early return)
  useEffect(() => {
    setClientPage(1);
  }, [sizeFilter]);

  // Hiển thị status trực tiếp từ dữ liệu, không dịch

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
          Quay lại
        </Button>
        <Typography sx={{ mt: 2 }}>Đang tải danh sách sản phẩm...</Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div className="productDetail" style={{ padding: "16px" }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
          Quay lại
        </Button>
        <Typography variant="h6" color="error" sx={{ mt: 2 }}>
          Có lỗi xảy ra khi tải sản phẩm
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {error.message || "Vui lòng thử lại sau"}
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

  // Lọc theo size trên client
  const filteredItems =
    sizeFilter && sizeFilter !== "All"
      ? allItems.filter((productItem) => (productItem?.productSizeId?.sizeName || "") === sizeFilter)
      : allItems;

  // Phân trang client sau khi lọc
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / clientPageSize));
  const startIndex = (clientPage - 1) * clientPageSize;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + clientPageSize);

  // group info (from first item)
  const group = allItems[0]?.productGroupId || null;
  const groupImage = group?.imageUrl || "";
  const groupName = group?.name || "Product group";
  const groupDescription = group?.description || "";

  return (
    <div className="productDetail">
      <div className="productDetail-header">
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
          Quay lại
        </Button>
      </div>

      <div className="productDetail-hero">
        <div className="productDetail-main">
          <Typography variant="h4" className="pd-title">{groupName}</Typography>
          <Typography className="pd-desc">{groupDescription}</Typography>

          <div className="pd-stats">
            <div className="pd-stat">
              <span className="pd-stat-label">Tổng số items</span>
              <span className="pd-stat-value">{allItems.length}</span>
            </div>
            <div className="pd-stat">
              <span className="pd-stat-label">Kích cỡ</span>
              <span className="pd-stat-value">
                {sizeOptions.length > 0 ? sizeOptions.join(", ") : "—"}
              </span>
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

      <div className="pd-size-filter" style={{ marginTop: 12 }}>
        <Typography className="pd-section">Lọc theo kích cỡ</Typography>
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

      <div className="pd-items">
        <Typography className="pd-items-title">Inventory items</Typography>
        <div className="pd-items-grid">
          {paginatedItems.map((item) => (
            <div key={item._id} className="pd-item-card">
              <div className="pd-item-header">
                <span className="pd-item-serial">{item.serialNumber}</span>
                <span className={`pd-item-status status-${item.status || "unknown"}`}>
                  {item.status || "unknown"}
                </span>
              </div>
              <div className="pd-item-body">
                <div className="pd-item-qr">
                  <img src={item.qrCode} alt={`QR ${item.serialNumber}`} />
                </div>
                <div className="pd-item-meta">
                  <div>
                    <span className="pd-meta-label">Reuse count</span>
                    <span className="pd-meta-value">{item.reuseCount}</span>
                  </div>
                  <div>
                    <span className="pd-meta-label">Base price</span>
                    <span className="pd-meta-value">
                      {(item?.productSizeId?.basePrice || 0).toLocaleString()}đ
                    </span>
                  </div>
                  <div>
                    <span className="pd-meta-label">Deposit</span>
                    <span className="pd-meta-value">
                      {(item?.productSizeId?.depositValue || 0).toLocaleString()}đ
                    </span>
                  </div>
                  <div>
                    <span className="pd-meta-label">Created at</span>
                    <span className="pd-meta-value">{formatDate(item.createdAt)}</span>
                  </div>
                  <div>
                    <span className="pd-meta-label">Updated at</span>
                    <span className="pd-meta-value">{formatDate(item.updatedAt)}</span>
                  </div>
                </div>
              </div>
              <div className="pd-item-footer">
                <a href={item.qrCode} target="_blank" rel="noreferrer" className="pd-link">
                  View full QR
                </a>
              </div>
            </div>
          ))}
          {filteredItems.length === 0 && (
            <div className="pd-item-empty">
              <Typography>Chưa có sản phẩm nào.</Typography>
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
    </div>
  );
}


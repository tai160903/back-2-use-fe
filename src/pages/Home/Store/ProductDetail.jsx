import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "./ProductDetail.css";

// Mock catalog for demo (no API calls)
function buildMockCatalog(productId) {
  const sizes = [
    { _id: "size-300", sizeName: "Small", basePrice: 6500, description: "Compact and convenient" },
    { _id: "size-350", sizeName: "Medium", basePrice: 10000, description: "Versatile everyday choice" },
    { _id: "size-500", sizeName: "Large", basePrice: 14500, description: "Generous capacity" },
  ];
  const items = [
    // 350 ml samples
    {
      _id: "69102972a205df423111deab",
      productSizeId: { _id: "size-350" },
      qrCode: "https://res.cloudinary.com/dioszgueh/image/upload/v1762666857/qrcodes/COF-1762666863543-78080-0.png",
      serialNumber: "COF-1762666863543-78080-0",
      status: "available",
      reuseCount: 0,
      createdAt: "2025-11-09T05:41:06.330Z",
      updatedAt: "2025-11-09T05:41:06.330Z",
    },
    {
      _id: "69102972a205df423111deac",
      productSizeId: { _id: "size-350" },
      qrCode: "https://res.cloudinary.com/dioszgueh/image/upload/v1762666857/qrcodes/COF-1762666863543-83013-1.png",
      serialNumber: "COF-1762666863543-83013-1",
      status: "available",
      reuseCount: 0,
      createdAt: "2025-11-09T05:41:06.330Z",
      updatedAt: "2025-11-09T05:41:06.330Z",
    },
    {
      _id: "69102972a205df423111dead",
      productSizeId: { _id: "size-350" },
      qrCode: "https://res.cloudinary.com/dioszgueh/image/upload/v1762666857/qrcodes/COF-1762666863543-36758-2.png",
      serialNumber: "COF-1762666863543-36758-2",
      status: "available",
      reuseCount: 0,
      createdAt: "2025-11-09T05:41:06.330Z",
      updatedAt: "2025-11-09T05:41:06.330Z",
    },
    // 300 ml samples
    {
      _id: "mock-300-1",
      productSizeId: { _id: "size-300" },
      qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=COF-300-1",
      serialNumber: "COF-300-1",
      status: "available",
      reuseCount: 2,
      createdAt: "2025-10-01T08:41:06.330Z",
      updatedAt: "2025-10-11T08:41:06.330Z",
    },
    {
      _id: "mock-300-2",
      productSizeId: { _id: "size-300" },
      qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=COF-300-2",
      serialNumber: "COF-300-2",
      status: "available",
      reuseCount: 1,
      createdAt: "2025-10-02T08:41:06.330Z",
      updatedAt: "2025-10-12T08:41:06.330Z",
    },
    // 500 ml samples
    {
      _id: "mock-500-1",
      productSizeId: { _id: "size-500" },
      qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=COF-500-1",
      serialNumber: "COF-500-1",
      status: "available",
      reuseCount: 5,
      createdAt: "2025-09-21T08:41:06.330Z",
      updatedAt: "2025-10-01T08:41:06.330Z",
    },
  ];
  const groupInfo = {
    id: productId,
    name: "Coffee Cup",
    description: "Ly cà phê tái sử dụng, nhiều kích cỡ, dễ mượn trả.",
    images: ["https://i.pinimg.com/1200x/26/0d/0a/260d0aed364c7ff8ad535f830a7c4aab.jpg"],
    material: "plastic",
  };
  return { groupInfo, sizes, items };
}

export default function ProductDetail() {
  const navigate = useNavigate();
  const { productId } = useParams(); // productId ~ productGroupId

  // Build mock data
  const { groupInfo, sizes, items } = useMemo(() => buildMockCatalog(productId), [productId]);

  const sizeOptions = useMemo(() => sizes.map((s) => s.sizeName), [sizes]);
  const [selectedSize, setSelectedSize] = useState("");
  const [sizeFilter, setSizeFilter] = useState("");

  // Initialize selection when sizes load
  useEffect(() => {
    if (sizes.length > 0) {
      const defaultSize = sizes[0].sizeName;
      setSelectedSize((s) => s || defaultSize);
      setSizeFilter((s) => s || defaultSize);
    }
  }, [sizes]);

  // Price map by size name
  const sizePriceMap = useMemo(() => {
    const map = {};
    for (const s of sizes) {
      map[s.sizeName] = s.basePrice;
    }
    return map;
  }, [sizes]);

  // Map: sizeName -> sizeId
  const sizeNameToId = useMemo(() => {
    const map = {};
    for (const s of sizes) map[s.sizeName] = s._id;
    return map;
  }, [sizes]);

  // Count items per size
  const sizeCounts = useMemo(() => {
    const counts = {};
    for (const s of sizes) counts[s.sizeName] = 0;
    for (const it of items) {
      const sizeId = typeof it.productSizeId === "object" ? (it.productSizeId._id || it.productSizeId.id) : it.productSizeId;
      const sizeObj = sizes.find((s) => s._id === sizeId);
      if (sizeObj) counts[sizeObj.sizeName] = (counts[sizeObj.sizeName] || 0) + 1;
    }
    return counts;
  }, [items, sizes]);

  // Variants visualization is now based on sizes, not use-tiers
  const filteredVariants = useMemo(
    () =>
      sizes
        .filter((s) => s.sizeName === sizeFilter)
        .map((s) => ({
          id: s._id,
          size: s.sizeName,
          rentalPrice: s.basePrice,
        })),
    [sizes, sizeFilter]
  );
  const [selectedVariantId, setSelectedVariantId] = useState("");
  useEffect(() => {
    if (filteredVariants[0]) {
      setSelectedVariantId(filteredVariants[0].id);
    }
  }, [filteredVariants]);

  const selectedVariant =
    filteredVariants.find((v) => v.id === selectedVariantId) ||
    filteredVariants[0] ||
    null;

  const allItems = useMemo(() => items || [], [items]);
  const filteredItems = useMemo(() => {
    if (!sizeFilter) return allItems;
    const sizeId = sizeNameToId[sizeFilter];
    return allItems.filter((item) => {
      const itemSizeId =
        typeof item.productSizeId === "object"
          ? item.productSizeId._id || item.productSizeId.id
          : item.productSizeId;
      return itemSizeId === sizeId;
    });
  }, [allItems, sizeFilter, sizeNameToId]);

  const statusLabelMap = {
    available: "Sẵn sàng",
    in_use: "Đang sử dụng",
    cleaning: "Đang vệ sinh",
    maintenance: "Bảo trì",
    retired: "Ngừng sử dụng",
  };

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

  return (
    <div className="productDetail">
      <div className="productDetail-header">
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
          Back to Store
        </Button>
      </div>

      <div className="productDetail-hero">
        <div className="productDetail-visual"
         >
          <img src={groupInfo.images[0]} alt={groupInfo.name} />
         </div>
        <div className="productDetail-main">
          <Typography variant="h4" className="pd-title">{groupInfo.name}</Typography>
          
          <Typography>
          Material: {groupInfo.material || "—"}  
          </Typography>

          <Typography className="pd-desc">{groupInfo.description}</Typography>

     

          <div className="pd-actions">
            <div className="pd-price">
              <span className="pd-price-label">Daily rental</span>
              <span className="pd-price-value">
                {(sizePriceMap[selectedSize] || selectedVariant?.rentalPrice || 0).toLocaleString()}đ
              </span>
            </div>
            <Button variant="contained" className="pd-cta">Borrow now</Button>
          </div>

     
        </div>
      </div>


      {/* Options below: filter by size and variants */}
      <div className="pd-options">
        <div className="pd-size-filter">
          <Typography className="pd-section">Available sizes</Typography>
          <div className="pd-size-chips">
            {sizeOptions.map((opt) => (
              <button
                key={opt}
                className={`pd-chip ${sizeFilter === opt ? "active" : ""}`}
                onClick={() => { setSizeFilter(opt); setSelectedSize(opt); }}
              >
                <span>{opt}</span>
                <span className="pd-chip-stat">
                  {(sizeCounts[opt] || 0)} sp · {(sizePriceMap[opt] || 0).toLocaleString()}đ
                </span>
              </button>
            ))}
          </div>
        </div>

    
      </div>

      <div className="pd-items">
        <Typography className="pd-items-title">Inventory items</Typography>
        <div className="pd-items-grid">
          {filteredItems.map((item) => (
            <div key={item._id} className="pd-item-card">
              <div className="pd-item-header">
                <span className="pd-item-serial">{item.serialNumber}</span>
                <span className={`pd-item-status status-${item.status || "unknown"}`}>
                  {statusLabelMap[item.status] || item.status || "Không rõ"}
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
              <Typography>No items for this size yet.</Typography>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



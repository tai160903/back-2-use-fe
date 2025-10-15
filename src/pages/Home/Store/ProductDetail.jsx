import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "./ProductDetail.css";

// Demo catalog generator (should be replaced by real API later)
function buildDemoProduct(productId) {
  const base = {
    id: productId,
    name: "Reusable Cup",
    description:
      "Durable, reusable cup designed for borrowing and returning easily. Reduce single-use waste.",
    images: ["https://i.pinimg.com/1200x/26/0d/0a/260d0aed364c7ff8ad535f830a7c4aab.jpg"],
    baseRating: 4.6,
    material: "plastic",
    // same product, only different by number of uses and size
    variants: [
      // 300 ml
      { id: "v-300-u30", size: "300 ml", uses: 30, rentalPrice: 6500 },
      { id: "v-300-u50", size: "300 ml", uses: 50, rentalPrice: 7500 },
      { id: "v-300-u80", size: "300 ml", uses: 80, rentalPrice: 8500 },
      // 350 ml
      { id: "v-350-u100", size: "350 ml", uses: 100, rentalPrice: 10000 },
      { id: "v-350-u120", size: "350 ml", uses: 120, rentalPrice: 11000 },
      { id: "v-350-u150", size: "350 ml", uses: 150, rentalPrice: 12000 },
      { id: "v-350-u200", size: "350 ml", uses: 200, rentalPrice: 13000 },
      // 500 ml
      { id: "v-500-u250", size: "500 ml", uses: 250, rentalPrice: 14500 },
      { id: "v-500-u300", size: "500 ml", uses: 300, rentalPrice: 15500 },
      { id: "v-500-u400", size: "500 ml", uses: 400, rentalPrice: 17500 },
    ],
  };
  return base;
}

export default function ProductDetail() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const product = useMemo(() => buildDemoProduct(productId), [productId]);
  const sizeOptions = useMemo(
    () => Array.from(new Set(product.variants.map((v) => v.size))),
    [product]
  );
  const [selectedSize, setSelectedSize] = useState(sizeOptions[0]);
  const [sizeFilter, setSizeFilter] = useState(sizeOptions[0]);
  const sizePriceMap = useMemo(() => {
    const map = {};
    for (const v of product.variants) {
      if (map[v.size] == null) map[v.size] = v.rentalPrice; 
    }
    return map;
  }, [product]);
  const filteredVariants = useMemo(
    () =>
      product.variants.filter((v) => v.size === sizeFilter),
    [product, sizeFilter]
  );
  const [selectedVariantId, setSelectedVariantId] = useState(
    filteredVariants[0]?.id || product.variants[0].id
  );
  if (!filteredVariants.some((v) => v.id === selectedVariantId)) {
    if (filteredVariants[0] && filteredVariants[0].id !== selectedVariantId) {
      setSelectedVariantId(filteredVariants[0].id);
    }
  }
  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId) || filteredVariants[0] || product.variants[0];

  return (
    <div className="productDetail">
      <div className="productDetail-header">
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
          Back to store
        </Button>
      </div>

      <div className="productDetail-hero">
        <div className="productDetail-visual"
         >
          <img src={product.images[0]} alt={product.name} />
         </div>
        <div className="productDetail-main">
          <Typography variant="h4" className="pd-title">{product.name}</Typography>
          
          <Typography>
          Material: {product.material}  
          </Typography>

          <Typography className="pd-desc">{product.description}</Typography>

     

          <div className="pd-actions">
            <div className="pd-price">
              <span className="pd-price-label">Rental price/day</span>
              <span className="pd-price-value">{(sizePriceMap[selectedSize] || selectedVariant.rentalPrice).toLocaleString()}đ</span>
            </div>
          </div>

     
        </div>
      </div>

      {/* Options below: filter by size and variants */}
      <div className="pd-options">
        <div className="pd-size-filter">
          <Typography className="pd-section">Filter by size</Typography>
          <div className="pd-size-chips">
            {sizeOptions.map((opt) => (
              <button
                key={opt}
                className={`pd-chip ${sizeFilter === opt ? "active" : ""}`}
                onClick={() => { setSizeFilter(opt); setSelectedSize(opt); }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="pd-variants">
          <Typography className="pd-section">Variants</Typography>
          <div className="pd-variant-list">
            {filteredVariants.map((v) => (
              <button
                key={v.id}
                className={`pd-variant ${selectedVariantId === v.id ? "active" : ""}`}
                onClick={() => setSelectedVariantId(v.id)}
              >
                <span className="pd-variant-size">{v.size}</span>
                <span className="pd-variant-uses">{v.uses} uses</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      
    </div>
  );
}



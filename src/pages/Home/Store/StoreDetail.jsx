import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./StoreDetail.css";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import { useDispatch, useSelector } from "react-redux";
import { getStoreById } from "../../../store/slices/storeSilce";
import cupImg from "../../../assets/image/cup6.png";
import containerImg from "../../../assets/image/container.png";
import cup3 from "../../../assets/image/cup3.png";
import Loading from "../../../components/Loading/Loading";

export default function StoreDetail() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id: storeId } = useParams();
  const { storeDetail, isLoadingStoreDetail, error } = useSelector((state) => state.store);
  const vouchers = [
    {
      id: "v1",
      off: "25%",
      note: "First order only",
      title: "25% OFF at Green Leaf Cafe",
      code: "GREEN25",
      expire: "12/31",
    },
    {
      id: "v2",
      off: "40%",
      note: "Limited stock",
      title: "40% OFF at Eco Brew House",
      code: "ECO40",
      expire: "11/15",
    },
    {
      id: "v3",
      off: "15%",
      note: "For all orders",
      title: "15% OFF network-wide",
      code: "REUSE15",
      expire: "10/30",
    },
  ];
  const [selectedProductType, setSelectedProductType] = useState(null);
  const [materialFilter, setMaterialFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [catalogProducts, setCatalogProducts] = useState([]);

  // Lấy data từ API
  const business = storeDetail?.business || storeDetail || null;
  const convertToSlug = (value) =>
    (value || "").toLowerCase().trim().replace(/\s+/g, "-");
  const deriveProductTypeFromName = (name) => {
    const lower = (name || "").toLowerCase();
    if (/(bottle|cup|mug)/.test(lower)) return "cup";
    if (/(container|box|tray)/.test(lower)) return "container";
    return "other";
  };

  // Load store detail khi component mount hoặc id thay đổi
  useEffect(() => {
    if (storeId) {
      dispatch(getStoreById(storeId));
    }
  }, [dispatch, storeId]);

  // Map productGroups từ API sang catalog hiển thị
  useEffect(() => {
    const groups = storeDetail?.productGroups || [];
    if (groups.length > 0) {
      const mappedCatalogProducts = groups.map((productGroup) => {
        const materialName = productGroup.materialId?.materialName || "Unknown";
        return {
          id: productGroup._id,
          name: productGroup.name,
          image: productGroup.imageUrl || cup3,
          type: deriveProductTypeFromName(productGroup.name),
          material: convertToSlug(materialName),
          materialLabel: materialName,
          depositPercent: productGroup.materialId?.depositPercent,
          reuseLimit: productGroup.materialId?.reuseLimit,
        };
      });
      setCatalogProducts(mappedCatalogProducts);
    } else {
      setCatalogProducts([]);
    }
  }, [storeDetail]);

  const reviews = [
    {
      id: "r1",
      user: "Alex Nguyen",
      role: "CEO",
      rating: 5,
      date: "2025-10-10",
      comment:
        "Back2Use made it easy to borrow and return cups. Super convenient and eco-friendly!",
    },
    {
      id: "r2",
      user: "Lan Pham",
      role: "Product Designer",
      rating: 4.5,
      date: "2025-10-05",
      comment:
        "Thanks to the program, I feel more informed and confident about my choices. The containers are sturdy and clean.",
    },
    {
      id: "r3",
      user: "Khanh Vo",
      role: "Design Lead",
      rating: 4,
      date: "2025-09-28",
      comment:
        "Great customer support. The team went above and beyond to help with a billing issue.",
    },
  ];



  // (Bỏ AVERAGE_RATING vì không hiển thị trong UI)

  // Reviews pagination
  const [reviewPage, setReviewPage] = useState(1);
  const reviewsPerPage = 6;
  const [reviewRatingFilter, setReviewRatingFilter] = useState("all"); 
  const filteredReviews =
    reviewRatingFilter === "all"
      ? reviews
      : reviews.filter((review) => review.rating >= parseFloat(reviewRatingFilter));
  const totalReviewPages = Math.max(
    1,
    Math.ceil(filteredReviews.length / reviewsPerPage)
  );
  const reviewStart = (reviewPage - 1) * reviewsPerPage;
  const paginatedReviews = filteredReviews.slice(
    reviewStart,
    reviewStart + reviewsPerPage
  );
  const handleReviewPageChange = (event, page) => setReviewPage(page);
  useEffect(() => {
    setReviewPage(1);
  }, [reviewRatingFilter]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [materialFilter, selectedProductType]);

  // Loading state
  if (isLoadingStoreDetail) {
    return <Loading />;
  }

  // Error state
  if (error) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <Typography variant="h6" color="error">
          Có lỗi xảy ra khi tải thông tin cửa hàng
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {error.message || "Vui lòng thử lại sau"}
        </Typography>
      </div>
    );
  }

  // Store not found
  if (!business) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <Typography variant="h6">
          Không tìm thấy cửa hàng! (ID: {storeId})
        </Typography>
      </div>
    );
  }

  // Sử dụng materials trực tiếp làm catalog (đã có đầy đủ thông tin)
  const catalog = catalogProducts;

  // Xác định products types từ catalog
  const productTypes = [];
  if (catalog.some(product => product.type === "cup")) productTypes.push("cup");
  if (catalog.some(product => product.type === "container")) productTypes.push("container");

  const materialLabelMap = {};
  catalog.forEach((product) => {
    if (product.material && product.materialLabel) {
      materialLabelMap[product.material] = product.materialLabel;
    }
  });
  const materialOptions = [
    "all",
    ...Array.from(new Set(catalog.map((product) => product.material))),
  ];

  const displayedProducts = catalog.filter((product) => {
    const matchType = selectedProductType ? product.type === selectedProductType : true;
    const matchMaterial =
      materialFilter === "all" ? true : product.material === materialFilter;
    return matchType && matchMaterial;
  });

  const effectiveProducts = displayedProducts.length > 0 ? displayedProducts : catalog;
  const totalPages = Math.max(1, Math.ceil(effectiveProducts.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = effectiveProducts.slice(startIndex, startIndex + itemsPerPage);

  // Lấy các giá trị từ business object trực tiếp
  const businessName = business.businessName || "";
  const businessAddress = business.businessAddress || "";
  const businessLogoUrl = business.businessLogoUrl || "";
  const businessMail = business.businessMail || "";
  const businessPhone = business.businessPhone || "";
  const openTime = business.openTime || "08:00";
  const closeTime = business.closeTime || "22:00";
  const businessOpenCloseHours = `${openTime} - ${closeTime}`;
  const availableProductTypes = productTypes.length > 0 ? productTypes : ["cup", "container"];
  const rating = business.rating || business.averageRating || 4.5;
  const reviewCount = business.reviewCount || business.totalReviews || 0;

  return (
    <div className="storeDetail">
      <div
        className="storeDetail-banner"
        style={{ backgroundImage: `url(${businessLogoUrl})` }}
      >
        <div className="storeDetail-overlay"></div>
        <div className="storeDetail-container">
          <div className="storeDetail-content">
            <div className="storeDetail-card">
              <Grid container spacing={3} alignItems="center">
                <Grid item size={12} sm={6}>
                  <div className="storeDetail-left">
                    <img
                      className="storeDetail-avatar"
                      src={businessLogoUrl}
                      alt={`${businessName} avatar`}
                    />
                    <div className="storeDetail-heading">
                      <Typography
                        variant="h3"
                        component="h1"
                        className="storeDetail-title"
                      >
                        {businessName}
                      </Typography>
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        className="storeDetail-rating"
                      >
                        <Rating
                          name="half-rating-read"
                          value={rating}
                          precision={0.5}
                          readOnly
                        />
                        <Typography variant="body1">
                          {rating} ({reviewCount} đánh giá)
                        </Typography>
                      </Stack>
                    </div>
                  </div>
                </Grid>
                <Grid item size={12} sm={6}>
                  <div className="storeDetail-right">
                    <div className="storeDetail-infoRow">
                      <LocationOnIcon className="storeDetail-icon" />
                      <Typography variant="body1">
                        <strong>Address:</strong> {businessAddress}
                      </Typography>
                    </div>
                    <div className="storeDetail-infoRow">
                      <AccessTimeIcon className="storeDetail-icon" />
                      <Typography variant="body1">
                        <strong>Opening Hours:</strong> {businessOpenCloseHours}
                      </Typography>
                    </div>
                    <div className="storeDetail-infoRow">
                      <EmailOutlinedIcon className="storeDetail-icon" />
                      <Typography variant="body1">
                        <strong>Email:</strong> {businessMail}
                      </Typography>
                    </div>
                    <div className="storeDetail-infoRow">
                      <LocalPhoneIcon className="storeDetail-icon" />
                      <Typography variant="body1">
                        <strong>Phone:</strong> {businessPhone}
                      </Typography>
                    </div>
                  </div>
                </Grid>
              </Grid>
            </div>
          </div>
        </div>
      </div>
      {/* Category section header */}
      <div className="storeDetail-categories-header">
        <Typography variant="h4" className="storeDetail-categories-title">
          Reusable Products
        </Typography>
      </div>

      {/* Category filter cards */}
      <div className="storeDetail-categories">
        <div
          className={`storeDetail-category-card ${
            selectedProductType === "cup" ? "active" : ""
          } ${availableProductTypes.includes("cup") ? "" : "disabled"}`}
          onClick={() => {
            if (!availableProductTypes.includes("cup")) return;
            setSelectedProductType(selectedProductType === "cup" ? null : "cup");
          }}
        >
          <div className="storeDetail-category-text">
            <Typography className="storeDetail-category-titles">
              Reusable Cups & Bottles
            </Typography>
            <p className="storeDetail-category-desc">
              Includes eco-friendly cups, mugs, and bottles that can be borrowed
              and returned easily. A sustainable choice to reduce single-use
              plastic waste.
            </p>
          </div>
          <img src={cupImg} alt="Cốc" className="storeDetail-category-image" />
        </div>
        <div
          className={`storeDetail-category-card ${
            selectedProductType === "container" ? "active" : ""
          } ${availableProductTypes.includes("container") ? "" : "disabled"}`}
          onClick={() => {
            if (!availableProductTypes.includes("container")) return;
            setSelectedProductType(
              selectedProductType === "container" ? null : "container"
            );
          }}
        >
          <div className="storeDetail-category-text">
            <Typography className="storeDetail-category-titles">
              Reusable Food Containers
            </Typography>
            <p className="storeDetail-category-desc">
              Includes eco-friendly reusable food containers that are easy to
              borrow and return, helping reduce single-use waste and protect the
              environment
            </p>
          </div>
          <img
            src={containerImg}
            alt="Hộp đựng"
            className="storeDetail-category-image"
          />
        </div>
      </div>

      {/* Product filters and grid */}
      <div className="storeDetail-products">
        <div className="storeDetail-products-header">
          <div className="storeDetail-material-filter">
            {materialOptions.map((option) => (
              <button
                key={option}
                className={`material-chip ${
                  materialFilter === option ? "active" : ""
                }`}
                onClick={() => setMaterialFilter(option)}
              >
                {option === "all" ? "All" : materialLabelMap[option] || option}
              </button>
            ))}
          </div>
        </div>

        <div className="storeDetail-grid">
          {paginatedProducts.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-thumb">
                <img src={product.image} alt={product.name} />
              </div>
              <div className="product-info">
                <Typography className="product-name">{product.name}</Typography>
                <div className="product-meta">
                  <span className="product-tag">
                    {product.type === "cup" ? "Cup/Bottle" : product.type === "container" ? "Food Container" : "Other"}
                  </span>
                  <span className="product-dot">•</span>
                  <span className="product-tag">
                    {materialLabelMap[product.material] || product.material}
                  </span>
                </div>
                <div className="product-stats">
                  <span className="available">
                    Deposit: {product.depositPercent ?? 0}%
                  </span>
                  <span className="separator">|</span>
                  <span className="unavailable">
                    Reuse limit: {product.reuseLimit ?? 0}
                  </span>
                </div>
                <div className="product-bottom">
                  <span className="product-price">
                    {product.rentalPrice ? `${product.rentalPrice.toLocaleString()}vnd/day` : "Contact for price"}
                  </span>
                  <button className="product-btn" onClick={() => navigate(`/product/${business._id}/${product.id}`)}>View details</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Stack
          spacing={2}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(event, pageNumber) => setCurrentPage(pageNumber)}
            variant="outlined"
            shape="rounded"
          />
        </Stack>
      </div>

        <section className="cooperate-section">
          <div className="homePage-container">
          <div className="promo-wrapper">
            <div className="promo-left">
              <p className="voucher-eyebrow">Featured deals</p>
              <h2 className="voucher-heading">Collect green vouchers</h2>
              <p className="voucher-copy">
                Grab exclusive discount codes for partner stores. Collect now and
                redeem when borrowing reusable cups and containers.
              </p>
              <button className="voucher-cta">Collect now</button>
            </div>
            <div className="promo-right">
              <div className="voucher-lists">
                {vouchers.slice(0, 2).map((v) => (
                  <div key={v.id} className="voucher-cards">
                    <div className="voucher-left">
                      <div className="voucher-off">{v.off}</div>
                      <div className="voucher-note">{v.note}</div>
                    </div>
                    <div className="voucher-right">
                      <div className="voucher-title">{v.title}</div>
                      <div className="voucher-meta">Code: {v.code} • Exp: {v.expire}</div>
                      <button className="voucher-btn">Save voucher</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          </div>
        </section>

      {/* Customer Reviews */}
      <section className="reviews-section">
        <div className="reviews-container">
          <div className="reviews-header">
            <Typography variant="h4" className="reviews-title">
              What our happy user says
            </Typography>
          </div>
          <div className="review-filter">
            {["all", "1", "2", "3", "4", "5"].map((option) => (
              <button
                key={option}
                className={`review-chip ${
                  reviewRatingFilter === option ? "active" : ""
                }`}
                onClick={() => setReviewRatingFilter(option)}
              >
                {option === "all"
                  ? "All ratings"
                  : `${option}${option === "5" ? "" : "+"} stars`}
              </button>
            ))}
          </div>
          <div className="reviews-list">
            {paginatedReviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-score-row">
                  <StarRoundedIcon className="review-star" />
                  <span className="review-score">{review.rating.toFixed(1)}</span>
                </div>
                <Typography className="review-text">{review.comment}</Typography>

                <div className="review-footer">
                  <Avatar className="review-avatar">{review.user.charAt(0)}</Avatar>
                  <div className="review-footer-right">
                    <Typography className="review-user">{review.user}</Typography>
                    <span className="review-role">{review.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Stack
            spacing={2}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "16px",
            }}
          >
            <Pagination
              count={totalReviewPages}
              page={reviewPage}
              onChange={handleReviewPageChange}
              variant="outlined"
              shape="rounded"
            />
          </Stack>
        </div>
      </section>
    </div>
  );
}

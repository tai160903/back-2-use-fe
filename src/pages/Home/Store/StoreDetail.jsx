import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
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
  const { id } = useParams();
  const { storeDetail, isLoadingStoreDetail, error } = useSelector((state) => state.store);
  const vouchers = useMemo(
    () => [
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
    ],
    []
  );
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [materialFilter, setMaterialFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [materials, setMaterials] = useState([]);

  // Lấy business data trực tiếp từ API
  const business = storeDetail;

  // Load store detail khi component mount hoặc id thay đổi
  useEffect(() => {
    if (id) {
      dispatch(getStoreById(id));
    }
  }, [dispatch, id]);

  // Mock data cho materials/catalog (tạm thời cho đến khi có API)
  useEffect(() => {
    if (business?._id) {
      const mockMaterials = [
        {
          id: "m1",
          name: "Plastic Cup 350ml",
          rentalPrice: 10000,
          available: 8,
          unavailable: 2,
          image: cup3,
          type: "cup",
          material: "plastic",
        },
        {
          id: "m2",
          name: "Glass Cup 350ml",
          rentalPrice: 15000,
          available: 5,
          unavailable: 1,
          image: cup3,
          type: "cup",
          material: "glass",
        },
        {
          id: "m3",
          name: "Double Cup 500ml",
          rentalPrice: 18000,
          available: 7,
          unavailable: 0,
          image: cup3,
          type: "cup",
          material: "plastic",
        },
        {
          id: "m4",
          name: "Paper Food Box 750ml",
          rentalPrice: 12000,
          available: 10,
          unavailable: 3,
          image: containerImg,
          type: "container",
          material: "paper",
        },
        {
          id: "m5",
          name: "Stainless Food Box 800ml",
          rentalPrice: 30000,
          available: 4,
          unavailable: 2,
          image: containerImg,
          type: "container",
          material: "steel",
        },
        {
          id: "m6",
          name: "Reusable Bottle 500ml",
          rentalPrice: 20000,
          available: 6,
          unavailable: 1,
          image: cup3,
          type: "cup",
          material: "plastic",
        },
        {
          id: "m7",
          name: "Glass Container 600ml",
          rentalPrice: 25000,
          available: 3,
          unavailable: 1,
          image: containerImg,
          type: "container",
          material: "glass",
        },
        {
          id: "m8",
          name: "Plastic Container 500ml",
          rentalPrice: 11000,
          available: 9,
          unavailable: 2,
          image: containerImg,
          type: "container",
          material: "plastic",
        },
      ];
      setMaterials(mockMaterials);
    } else {
      setMaterials([]);
    }
  }, [business?._id]);

  const reviews = useMemo(
    () => [
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
    ],
    []
  );



  // Average kept for potential future use (sorting), but hidden from UI
  const AVERAGE_RATING = useMemo(() => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  }, [reviews]);

  // Reviews pagination
  const [reviewPage, setReviewPage] = useState(1);
  const reviewsPerPage = 6;
  const [reviewRatingFilter, setReviewRatingFilter] = useState("all"); 
  const filteredReviews = useMemo(() => {
    if (reviewRatingFilter === "all") return reviews;
    const threshold = parseFloat(reviewRatingFilter);
    return reviews.filter((r) => r.rating >= threshold);
  }, [reviews, reviewRatingFilter]);
  const totalReviewPages = Math.max(
    1,
    Math.ceil(filteredReviews.length / reviewsPerPage)
  );
  const reviewStart = (reviewPage - 1) * reviewsPerPage;
  const paginatedReviews = filteredReviews.slice(
    reviewStart,
    reviewStart + reviewsPerPage
  );
  const handleReviewPageChange = (e, p) => setReviewPage(p);
  useEffect(() => {
    setReviewPage(1);
  }, [reviewRatingFilter]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [materialFilter, selectedProduct]);

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
          Không tìm thấy cửa hàng! (ID: {id})
        </Typography>
      </div>
    );
  }

  // Sử dụng materials trực tiếp làm catalog (đã có đầy đủ thông tin)
  const catalog = materials;

  // Xác định products types từ catalog
  const productTypes = [];
  if (catalog.some(p => p.type === "cup")) productTypes.push("cup");
  if (catalog.some(p => p.type === "container")) productTypes.push("container");

  const materialLabelMap = {
    plastic: "Plastic",
    glass: "Glass",
    steel: "Stainless steel",
    paper: "Paper",
  };
  const materialOptions = [
    "all",
    ...Array.from(new Set(catalog.map((p) => p.material))),
  ];

  const displayedProducts = catalog.filter((p) => {
    const matchType = selectedProduct ? p.type === selectedProduct : true;
    const matchMaterial =
      materialFilter === "all" ? true : p.material === materialFilter;
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
  const daily = `${openTime} - ${closeTime}`;
  const products = productTypes.length > 0 ? productTypes : ["cup", "container"];
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
                        <strong>Địa chỉ:</strong> {businessAddress}
                      </Typography>
                    </div>
                    <div className="storeDetail-infoRow">
                      <AccessTimeIcon className="storeDetail-icon" />
                      <Typography variant="body1">
                        <strong>Giờ mở cửa:</strong> {daily}
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
                        <strong>Số điện thoại:</strong> {businessPhone}
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
            selectedProduct === "cup" ? "active" : ""
          } ${products.includes("cup") ? "" : "disabled"}`}
          onClick={() => {
            if (!products.includes("cup")) return;
            setSelectedProduct(selectedProduct === "cup" ? null : "cup");
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
            selectedProduct === "container" ? "active" : ""
          } ${products.includes("container") ? "" : "disabled"}`}
          onClick={() => {
            if (!products.includes("container")) return;
            setSelectedProduct(
              selectedProduct === "container" ? null : "container"
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
            {materialOptions.map((opt) => (
              <button
                key={opt}
                className={`material-chip ${
                  materialFilter === opt ? "active" : ""
                }`}
                onClick={() => setMaterialFilter(opt)}
              >
                {opt === "all" ? "All" : materialLabelMap[opt] || opt}
              </button>
            ))}
          </div>
        </div>

        <div className="storeDetail-grid">
          {paginatedProducts.map((p) => (
            <div key={p.id} className="product-card">
              <div className="product-thumb">
                <img src={p.image} alt={p.name} />
              </div>
              <div className="product-info">
                <Typography className="product-name">{p.name}</Typography>
                <div className="product-meta">
                  <span className="product-tag">
                    {p.type === "cup" ? "Cup/Bottle" : "Food Container"}
                  </span>
                  <span className="product-dot">•</span>
                  <span className="product-tag">
                    {materialLabelMap[p.material] || p.material}
                  </span>
                </div>
                <div className="product-stats">
                  <span className="available">
                    Available: {p.available ?? 0}
                  </span>
                  <span className="separator">|</span>
                  <span className="unavailable">
                    Unavailable: {p.unavailable ?? 0}
                  </span>
                </div>
                <div className="product-bottom">
                  <span className="product-price">
                    {(p.rentalPrice ?? p.price).toLocaleString()}đ/day
                  </span>
                  <button className="product-btn" onClick={() => navigate(`/product/${business._id}/${p.id}`)}>View details</button>
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
            onChange={(e, p) => setCurrentPage(p)}
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
            {["all", "1", "2", "3", "4", "5"].map((opt) => (
              <button
                key={opt}
                className={`review-chip ${
                  reviewRatingFilter === opt ? "active" : ""
                }`}
                onClick={() => setReviewRatingFilter(opt)}
              >
                {opt === "all"
                  ? "All ratings"
                  : `${opt}${opt === "5" ? "" : "+"} stars`}
              </button>
            ))}
          </div>
          <div className="reviews-list">
            {paginatedReviews.map((rv) => (
              <div key={rv.id} className="review-card">
                <div className="review-score-row">
                  <StarRoundedIcon className="review-star" />
                  <span className="review-score">{rv.rating.toFixed(1)}</span>
                </div>
                <Typography className="review-text">{rv.comment}</Typography>

                <div className="review-footer">
                  <Avatar className="review-avatar">{rv.user.charAt(0)}</Avatar>
                  <div className="review-footer-right">
                    <Typography className="review-user">{rv.user}</Typography>
                    <span className="review-role">{rv.role}</span>
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

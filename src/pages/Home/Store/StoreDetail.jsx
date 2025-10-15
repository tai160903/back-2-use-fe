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
import cupImg from "../../../assets/image/cup6.png";
import containerImg from "../../../assets/image/container.png";
import cup3 from "../../../assets/image/cup3.png";
import cup6 from "../../../assets/image/cup6.png";
import cupdou from "../../../assets/image/cupdou.png";

// Mock data (cùng với StorePage)
const mockStores = [
  {
    id: 1,
    name: "Green Café Downtown",
    address: "1262 Kha Vạn Cân, Thủ Đức, TP.HCM",
    coords: [10.8565, 106.7709],
    products: ["cup", "container", "bottle"],
    daily: "9AM - 8PM",
    image:
      "https://sakos.vn/wp-content/uploads/2024/07/2.-Nha-Trong-Ngo-Quan-ca-phe-dep-o-Ho-Tay.jpg",
    avatar:
      "https://sakos.vn/wp-content/uploads/2024/07/2.-Nha-Trong-Ngo-Quan-ca-phe-dep-o-Ho-Tay.jpg",
    rating: 4.5,
    reviewCount: 123,
    email: "cduy527@gmail.com",
    phone: "0901 234 567",
    catalog: [
      {
        id: "p1",
        name: "Plastic Cup 350ml",
        rentalPrice: 10000,
        available: 8,
        unavailable: 2,
        image: cup3,
        type: "cup",
        material: "plastic",
      },
      {
        id: "p2",
        name: "Glass Cup 350ml",
        rentalPrice: 15000,
        available: 5,
        unavailable: 1,
        image: cup6,
        type: "cup",
        material: "glass",
      },
      {
        id: "p3",
        name: "Double Cup 500ml",
        rentalPrice: 18000,
        available: 7,
        unavailable: 0,
        image: cupdou,
        type: "cup",
        material: "plastic",
      },
      {
        id: "p4",
        name: "Paper Food Box 750ml",
        rentalPrice: 12000,
        available: 10,
        unavailable: 3,
        image: containerImg,
        type: "container",
        material: "paper",
      },
      {
        id: "p5",
        name: "Stainless Food Box 800ml",
        rentalPrice: 30000,
        available: 4,
        unavailable: 2,
        image: containerImg,
        type: "container",
        material: "steel",
      },
    ],
  },
  {
    id: 2,
    name: "Eco Coffee Shop",
    address: "456 River Rd, Uptown, City 67890",
    coords: [10.768, 106.673],
    products: ["cup"],
    daily: "9AM - 8PM",
    image:
      "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=2070&auto=format&fit=crop",
    avatar:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=640&auto=format&fit=crop",
    rating: 4.0,
    reviewCount: 89,
    email: "contact@ecocoffee.vn",
    phone: "0987 654 321",
    catalog: [
      {
        id: "p6",
        name: "Plastic Cup 300ml",
        rentalPrice: 9000,
        available: 12,
        unavailable: 1,
        image: cup3,
        type: "cup",
        material: "plastic",
      },
      {
        id: "p7",
        name: "Paper Food Box 600ml",
        rentalPrice: 11000,
        available: 6,
        unavailable: 2,
        image: containerImg,
        type: "container",
        material: "paper",
      },
    ],
  },
];

export default function StoreDetail() {
  const navigate = useNavigate();
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
  const { id } = useParams();
  const [store, setStore] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [materialFilter, setMaterialFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

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
  const [reviewRatingFilter, setReviewRatingFilter] = useState("all"); // 'all' | '1' | '2' | '3' | '4' | '5'
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

  useEffect(() => {
    const foundStore = mockStores.find((s) => s.id === parseInt(id));
    setStore(foundStore);
  }, [id]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [materialFilter, selectedProduct]);

  if (!store) {
    return <div>Không tìm thấy cửa hàng! (ID: {id})</div>;
  }

  const materialLabelMap = {
    plastic: "Plastic",
    glass: "Glass",
    steel: "Stainless steel",
    paper: "Paper",
  };
  const materialOptions = [
    "all",
    ...Array.from(new Set((store.catalog || []).map((p) => p.material))),
  ];

  const displayedProducts = (store.catalog || []).filter((p) => {
    const matchType = selectedProduct ? p.type === selectedProduct : true;
    const matchMaterial =
      materialFilter === "all" ? true : p.material === materialFilter;
    return matchType && matchMaterial;
  });

  const effectiveProducts =
    displayedProducts.length > 0 ? displayedProducts : store.catalog || [];
  const totalPages = Math.max(1, Math.ceil(effectiveProducts.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = effectiveProducts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="storeDetail">
      <div
        className="storeDetail-banner"
        style={{ backgroundImage: `url(${store.image})` }}
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
                      src={store.avatar}
                      alt={`${store.name} avatar`}
                    />
                    <div className="storeDetail-heading">
                      <Typography
                        variant="h3"
                        component="h1"
                        className="storeDetail-title"
                      >
                        {store.name}
                      </Typography>
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        className="storeDetail-rating"
                      >
                        <Rating
                          name="half-rating-read"
                          value={store.rating}
                          precision={0.5}
                          readOnly
                        />
                        <Typography variant="body1">
                          {store.rating} ({store.reviewCount} đánh giá)
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
                        <strong>Địa chỉ:</strong> {store.address}
                      </Typography>
                    </div>
                    <div className="storeDetail-infoRow">
                      <AccessTimeIcon className="storeDetail-icon" />
                      <Typography variant="body1">
                        <strong>Giờ mở cửa:</strong> {store.daily}
                      </Typography>
                    </div>
                    <div className="storeDetail-infoRow">
                      <EmailOutlinedIcon className="storeDetail-icon" />
                      <Typography variant="body1">
                        <strong>Email:</strong> {store.email}
                      </Typography>
                    </div>
                    <div className="storeDetail-infoRow">
                      <LocalPhoneIcon className="storeDetail-icon" />
                      <Typography variant="body1">
                        <strong>Số điện thoại:</strong> {store.phone}
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
          } ${store.products.includes("cup") ? "" : "disabled"}`}
          onClick={() => {
            if (!store.products.includes("cup")) return;
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
          } ${store.products.includes("container") ? "" : "disabled"}`}
          onClick={() => {
            if (!store.products.includes("container")) return;
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
                  <button className="product-btn" onClick={() => navigate(`/product/${store.id}/${p.id}`)}>View details</button>
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
                  Grab exclusive discount codes for partner stores. Collect now
                  and redeem when borrowing reusable cups and containers.
                </p>
                <button className="voucher-cta">Collect now</button>
              </div>
              <div className="promo-right">
                <div className="voucher-list">
                  {vouchers.slice(0, 2).map((v) => (
                    <div key={v.id} className="voucher-card">
                      <div className="voucher-left">
                        <div className="voucher-off">{v.off}</div>
                        <div className="voucher-note">{v.note}</div>
                      </div>
                      <div className="voucher-right">
                        <div className="voucher-title">{v.title}</div>
                        <div className="voucher-meta">
                          Code: {v.code} • Exp: {v.expire}
                        </div>
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

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./StoreDetail.css";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import { useDispatch, useSelector } from "react-redux";
import { getStoreById } from "../../../store/slices/storeSilce";
import {
  getFeedbackApi,
  getFeedbackOfCustomerApi,
  deleteFeedbackApi,
  updateFeedbackApi,
} from "../../../store/slices/feedbackSlice";
import { getUserRole } from "../../../utils/authUtils";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import cupImg from "../../../assets/image/cup6.png";
import containerImg from "../../../assets/image/container.png";
import cup3 from "../../../assets/image/cup3.png";
import Loading from "../../../components/Loading/Loading";
import toast from "react-hot-toast";

export default function StoreDetail() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id: storeId } = useParams();
  const {
    storeDetail,
    isLoadingStoreDetail,
    error: storeError,
  } = useSelector((state) => state.store);
  const {
    businessFeedback,
    myFeedback,
    loading: isLoadingFeedback,
    error: feedbackError,
  } = useSelector((state) => state.feedback);
  const { currentUser } = useSelector((state) => state.auth);
  const role = getUserRole();
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
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deletingFeedback, setDeletingFeedback] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);


  
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

  const feedbackData = Array.isArray(businessFeedback?.data)
    ? businessFeedback.data
    : [];
  const myFeedbackData = Array.isArray(myFeedback?.data) ? myFeedback.data : [];
  const myFeedbackIdSet = new Set(myFeedbackData.map((item) => item._id));


  // Reviews pagination
  const [reviewPage, setReviewPage] = useState(1);
  const reviewsPerPage = 3;
  const [reviewRatingFilter, setReviewRatingFilter] = useState("all"); 
  const filteredReviews =
    reviewRatingFilter === "all"
      ? feedbackData
      : feedbackData.filter(
          (review) =>
            Number(review.rating || 0) === Number(reviewRatingFilter)
        );
  const totalReviewPages =
    businessFeedback?.totalPages && businessFeedback.totalPages > 0
      ? businessFeedback.totalPages
      : 1;
  const paginatedReviews = filteredReviews;
  const handleReviewPageChange = (event, page) => setReviewPage(page);
  useEffect(() => {
    setReviewPage(1);
  }, [reviewRatingFilter]);


  useEffect(() => {
    if (!storeId) return;
    const ratingParam =
      reviewRatingFilter === "all" ? "" : Number(reviewRatingFilter);
    dispatch(
      getFeedbackApi({
        businessId: storeId,
        page: reviewPage,
        limit: reviewsPerPage,
        rating: ratingParam,
      })
    );
  }, [dispatch, storeId, reviewPage, reviewsPerPage, reviewRatingFilter]);

  // Lấy tất cả feedback của chính user (để xác định feedback nào là của mình)
  useEffect(() => {
    if (role !== "customer") return;
    if (!currentUser?.accessToken) return;
    dispatch(
      getFeedbackOfCustomerApi({
        page: 1,
        limit: 1000,
        rating: "",
      })
    );
  }, [dispatch, role, currentUser?.accessToken]);

  const refreshFeedbackLists = () => {
    const ratingParam =
      reviewRatingFilter === "all" ? "" : Number(reviewRatingFilter);
    if (storeId) {
      dispatch(
        getFeedbackApi({
          businessId: storeId,
          page: reviewPage,
          limit: reviewsPerPage,
          rating: ratingParam,
        })
      );
    }
    if (role === "customer" && currentUser?.accessToken) {
      dispatch(
        getFeedbackOfCustomerApi({
          page: 1,
          limit: 1000,
          rating: "",
        })
      );
    }
  };

  const handleOpenDelete = (review) => {
    setDeletingFeedback(review);
    setOpenDeleteDialog(true);
  };

  const handleCloseDelete = () => {
    setOpenDeleteDialog(false);
    setDeletingFeedback(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingFeedback?._id) return;
    try {
      await dispatch(
        deleteFeedbackApi({ id: deletingFeedback._id })
      ).unwrap();
      refreshFeedbackLists();
    } catch (error) {
   
      toast.error(error.message || "Failed to delete feedback");
    }
    setOpenDeleteDialog(false);
    setDeletingFeedback(null);
  };

  const handleOpenEdit = (review) => {
    setEditingFeedback(review);
    setEditRating(review.rating || 0);
    setEditComment(review.comment || "");
    setOpenEditDialog(true);
  };

  const handleCloseEdit = () => {
    setOpenEditDialog(false);
    setEditingFeedback(null);
    setEditRating(5);
    setEditComment("");
  };

  const handleConfirmEdit = async () => {
    if (!editingFeedback?._id) return;
    setSubmittingFeedback(true);
    try {
      await dispatch(
        updateFeedbackApi({
          id: editingFeedback._id,
          data: { rating: editRating, comment: editComment },
        })
      ).unwrap();
      refreshFeedbackLists();
    } catch (error) {
      toast.error(error.message || "Failed to update feedback");
    } finally {
      setSubmittingFeedback(false);
      handleCloseEdit();
    }
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [materialFilter, selectedProductType]);

  // Loading state
  if (isLoadingStoreDetail) {
    return <Loading />;
  }

  // Error state
  if (storeError) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <Typography variant="h6" color="error">
          An error occurred while loading store information
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {storeError.message || "Vui lòng thử lại sau"}
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
                          {rating} ({reviewCount} reviews)
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
                  : `${option} stars`}
              </button>
            ))}
          </div>
          <div className="reviews-list">
            {isLoadingFeedback ? (
              <Typography>Loading customer reviews...</Typography>
            ) : feedbackError ? (
              <Typography color="error">
                Unable to load reviews:{" "}
                {feedbackError.message || String(feedbackError)}
              </Typography>
            ) : paginatedReviews.length === 0 ? (
              <Typography> No reviews found for this store</Typography>
            ) : (
              paginatedReviews.map((review) => {
                const reviewerName =
                  review.customerId?.fullName || "Khách hàng ẩn danh";
                const ratingValue = Number(review.rating || 0).toFixed(1);
                const isOwner = myFeedbackIdSet.has(review._id);

                return (
                  <div key={review._id} className="review-card">
                    <div className="review-score-row">
                      <StarRoundedIcon className="review-star" />
                      <span className="review-score">{ratingValue}</span>
                    </div>
                    <Typography className="review-text">
                      {review.comment}
                    </Typography>

                    <div className="review-footer">
                      <Avatar className="review-avatar">
                        {reviewerName.charAt(0)}
                      </Avatar>
                      <div className="review-footer-right">
                        <Typography className="review-user">
                          {reviewerName}
                        </Typography>
                        <span className="review-role">Khách hàng</span>
                        {isOwner && (
                          <div className="review-actions">
                            <button
                              className="review-action-btn edit"
                              onClick={() => handleOpenEdit(review)}
                            >
                              <FiEdit2 className="review-action-icon" />
                              Edit
                            </button>
                            <button
                              className="review-action-btn delete"
                              onClick={() => handleOpenDelete(review)}
                            >
                              <FiTrash2 className="review-action-icon" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
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

      {/* Delete review dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDelete}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete review</DialogTitle>
        <DialogContent dividers>
          <Typography>
            Are you sure you want to delete this review? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete}>Cancel</Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit review dialog */}
      <Dialog
        open={openEditDialog}
        onClose={handleCloseEdit}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit review</DialogTitle>
        <DialogContent dividers>
          <Typography sx={{ mb: 2 }}>
            Update your rating and comment for this store.
          </Typography>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <Typography sx={{ minWidth: 80 }}>Rating:</Typography>
            <Rating
              value={editRating}
              onChange={(_, value) => setEditRating(value || 0)}
            />
          </div>
          <TextField
            label="Comment"
            multiline
            minRows={3}
            fullWidth
            value={editComment}
            onChange={(e) => setEditComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit} disabled={submittingFeedback}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmEdit}
            variant="contained"
            disabled={submittingFeedback}
            sx={{
              backgroundColor: "#0b5529",
              "&:hover": { backgroundColor: "#094421" },
            }}
          >
            {submittingFeedback ? "Saving..." : "Save changes"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

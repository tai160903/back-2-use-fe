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
import { getCustomerVouchers, redeemCustomerVoucher, getMyCustomerVouchers } from "../../../store/slices/voucherSlice";
import { PATH } from "../../../routes/path";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import LinearProgress from "@mui/material/LinearProgress";
import { LocalFlorist as EcoIcon, CardGiftcard as GiftIcon } from "@mui/icons-material";

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
  const {
    customerVouchers,
    myCustomerVouchers,
    isLoading: isLoadingVouchers,
  } = useSelector((state) => state.vouchers);
  
  const [businessVouchers, setBusinessVouchers] = useState([]);
  const [exchangingVoucherId, setExchangingVoucherId] = useState(null);
  const [savedVouchers, setSavedVouchers] = useState(new Set());
  const [currentVoucherIndex, setCurrentVoucherIndex] = useState(0);
  const vouchersPerPage = 5; // Show 5 vouchers at a time
  const vouchersToScroll = 2; // Scroll 2 vouchers each time
  const [exchangedVoucherIds, setExchangedVoucherIds] = useState(new Set());
  const [openExchangeDialog, setOpenExchangeDialog] = useState(false);
  const [voucherToExchange, setVoucherToExchange] = useState(null);
  const userPoints = 350; // TODO: Get from actual user wallet/points
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

  // Load business vouchers and user's exchanged vouchers
  useEffect(() => {
    if (storeId) {
      dispatch(getCustomerVouchers({
        status: 'active',
        page: 1,
        limit: 100, // Load enough to filter
      }));
      // Load user's exchanged vouchers to check which ones have been exchanged
      if (role === 'customer' && currentUser?.accessToken) {
        dispatch(getMyCustomerVouchers({
          status: 'redeemed',
          page: 1,
          limit: 1000, // Load all to check
        }));
      }
    }
  }, [dispatch, storeId, role, currentUser?.accessToken]);

  // Filter vouchers by business ID
  useEffect(() => {
    if (customerVouchers && customerVouchers.length > 0 && storeId) {
      const businessIdToMatch = storeId.toString();
      
      const filtered = customerVouchers
        .filter((voucher) => {
          // Only show business vouchers (not leaderboard)
          if (voucher.voucherType === 'leaderboard') return false;
          // Only show active vouchers
          if (voucher.status !== 'active') return false;
          
          // Try multiple possible ways to get business ID from voucher
          let voucherBusinessId = null;
          
          // Check businessInfo object (most common structure)
          if (voucher.businessInfo) {
            voucherBusinessId = 
              voucher.businessInfo.businessId?.toString() || 
              voucher.businessInfo._id?.toString() ||
              voucher.businessInfo.id?.toString();
          }
          
          // Check direct businessId field
          if (!voucherBusinessId && voucher.businessId) {
            voucherBusinessId = voucher.businessId.toString();
          }
          
          // Check business object
          if (!voucherBusinessId && voucher.business) {
            voucherBusinessId = 
              voucher.business._id?.toString() ||
              voucher.business.id?.toString();
          }
          
          // Compare both as strings to handle ObjectId comparison
          const matches = voucherBusinessId && voucherBusinessId === businessIdToMatch;
          
          // Debug log (remove in production)
          if (process.env.NODE_ENV === 'development' && voucherBusinessId) {
            console.log('Voucher business ID:', voucherBusinessId, 'Store ID:', businessIdToMatch, 'Matches:', matches, 'Voucher:', {
              id: voucher._id || voucher.id,
              customName: voucher.customName,
              businessName: voucher.businessInfo?.businessName,
              claimedAt: voucher.claimedAt,
              status: voucher.status
            });
          }
          
          return matches;
        })
        // Load all vouchers for carousel (no limit)
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Filtered vouchers for store:', storeId, filtered.length, 'vouchers found', filtered.map(v => ({
          id: v._id || v.id,
          customName: v.customName,
          claimedAt: v.claimedAt,
          businessId: v.businessInfo?.businessId || v.businessId
        })));
      }
      setBusinessVouchers(filtered);
      // Reset carousel index when vouchers change
      setCurrentVoucherIndex(0);
    } else {
      setBusinessVouchers([]);
      setCurrentVoucherIndex(0);
    }
  }, [customerVouchers, storeId]);

  // Build set of exchanged voucher template IDs from user's vouchers
  useEffect(() => {
    if (myCustomerVouchers && myCustomerVouchers.length > 0) {
      const exchangedIds = new Set();
      myCustomerVouchers.forEach((myVoucher) => {
        // Get the voucher template ID from user's voucher
        const templateId = 
          myVoucher.voucher?._id?.toString() || 
          myVoucher.voucher?.id?.toString() ||
          myVoucher.voucherId?.toString() ||
          myVoucher.voucherTemplateId?.toString();
        if (templateId) {
          exchangedIds.add(templateId);
        }
      });
      setExchangedVoucherIds(exchangedIds);
    } else {
      setExchangedVoucherIds(new Set());
    }
  }, [myCustomerVouchers]);

  // Handle exchange voucher - opens confirmation dialog
  const handleExchangeVoucher = (voucher) => {
    setVoucherToExchange(voucher);
    setOpenExchangeDialog(true);
  };

  // Confirm and execute voucher exchange
  const handleConfirmExchange = async () => {
    if (!voucherToExchange) return;
    
    const voucherId = voucherToExchange._id || voucherToExchange.id;
    setOpenExchangeDialog(false);
    setExchangingVoucherId(voucherId);
    
    try {
      await dispatch(redeemCustomerVoucher({ voucherId })).unwrap();
      
      toast.success(
        (t) => (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Voucher exchanged successfully!
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              View your vouchers in your voucher wallet
            </Typography>
            <Button
              size="small"
              variant="contained"
              onClick={() => {
                toast.dismiss(t.id);
                navigate(PATH.REWARDS);
              }}
              sx={{
                mt: 0.5,
                backgroundColor: '#22c55e',
                '&:hover': { backgroundColor: '#16a34a' },
                textTransform: 'none',
                fontSize: '12px',
                py: 0.5,
                px: 1.5
              }}
            >
              View Voucher Wallet
            </Button>
          </Box>
        ),
        {
          duration: 5000,
          position: 'top-right',
        }
      );
      
      // Refresh vouchers to update claimedAt status from API
      await dispatch(getCustomerVouchers({
        status: 'active',
        page: 1,
        limit: 100,
      }));
      
      // Refresh user's exchanged vouchers to update the exchanged list
      if (role === 'customer' && currentUser?.accessToken) {
        await dispatch(getMyCustomerVouchers({
          status: 'redeemed',
          page: 1,
          limit: 1000,
        }));
      }
    } catch (error) {
      // Error handled in slice
    } finally {
      setExchangingVoucherId(null);
      setVoucherToExchange(null);
    }
  };

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
  const rating = business.averageRating;
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

        {(businessVouchers.length > 0 || isLoadingVouchers) && (
          <section className="cooperate-section">
            <div className="voucher-section-wrapper">
              <div className="voucher-section-header">
                <Typography variant="h4" className="voucher-section-title">
                  {businessName} Vouchers
                </Typography>
              </div>
              <div className="voucher-carousel-wrapper-section">
                  {isLoadingVouchers ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
                      <CircularProgress />
                    </Box>
                  ) : businessVouchers.length > 0 ? (
                    <div className="voucher-carousel-container">
                      <IconButton
                        className="carousel-arrow carousel-arrow-left"
                        onClick={() => {
                          setCurrentVoucherIndex((prev) => {
                            const newIndex = Math.max(0, prev - vouchersToScroll);
                            return newIndex;
                          });
                        }}
                        disabled={currentVoucherIndex === 0 || businessVouchers.length <= vouchersPerPage}
                        sx={{
                          position: 'absolute',
                          left: '-20px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          zIndex: 2,
                          backgroundColor: 'white',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                          '&:hover': {
                            backgroundColor: '#f5f5f5',
                          },
                          '&.Mui-disabled': {
                            opacity: 0.3,
                          }
                        }}
                      >
                        <ArrowBackIosIcon />
                      </IconButton>
                      
                      <div className="voucher-carousel-wrapper">
                        <div 
                          className="voucher-carousel-track"
                          style={{
                            display: 'flex',
                            transform: `translateX(-${(currentVoucherIndex * 100) / vouchersPerPage}%)`,
                            transition: 'transform 0.3s ease-in-out'
                          }}
                        >
                          {businessVouchers.map((voucher, index) => {
                            const discountPercent = voucher.discountPercent || 0;
                            const endDate = voucher.endDate;
                            let expiryText = 'N/A';
                            if (endDate) {
                              const date = new Date(endDate);
                              if (!isNaN(date.getTime())) {
                                expiryText = date.toLocaleDateString('en-US', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric'
                                });
                              }
                            }
                            const voucherId = voucher._id || voucher.id;
                            // Check if this voucher template has been exchanged by the current user
                            // by comparing template ID with user's exchanged vouchers
                            const templateId = voucherId.toString();
                            const isExchanged = exchangedVoucherIds.has(templateId);
                            const canSave = userPoints >= (voucher.rewardPointCost || 0);
                            const maxUsage = voucher.maxUsage || 0;
                            const redeemedCount = voucher.redeemedCount || 0;
                            const usagePercentage = maxUsage > 0 ? Math.round((redeemedCount / maxUsage) * 100) : 0;

                            return (
                              <div 
                                key={voucherId} 
                                className={`voucher-card-custom-carousel ${voucher.status !== 'active' ? 'inactive' : ''}`}
                                style={{
                                  flex: '0 0 calc(100% / 5)',
                                  minWidth: 'calc(100% / 5)',
                                  padding: '0 8px'
                                }}
                              >
                                {/* Left Strip */}
                                <div className="voucher-card-strip">
                                  <div className="voucher-strip-badge">
                                    <div className="badge-icon-wrapper">
                                      <EcoIcon className="strip-icon" />
                                    </div>
                                    <span className="strip-text">BACK2USE</span>
                                  </div>
                                </div>

                                {/* Card Content */}
                                <div className="voucher-card-body">
                                  <div className="voucher-main-info">
                                    <Typography variant="h3" className="voucher-discount-text">
                                      {discountPercent}%
                                    </Typography>
                                    <Typography variant="body2" className="voucher-category-text">
                                      {voucher.businessInfo?.businessName || businessName}
                                    </Typography>
                                    {voucher.customName && (
                                      <Typography variant="body2" className="voucher-category-text" style={{ fontWeight: 600, marginTop: '4px' }}>
                                        {voucher.customName}
                                      </Typography>
                                    )}
                                    
                                    {/* Points */}
                                    <div className="voucher-points-section">
                                      <GiftIcon className="points-icon" />
                                      <Typography variant="caption" className="points-text">
                                        {voucher.rewardPointCost || 0} points
                                      </Typography>
                                    </div>

                                    {/* Usage Progress */}
                                    {maxUsage > 0 && (
                                      <div className="voucher-usage-section">
                                        <LinearProgress 
                                          variant="determinate" 
                                          value={usagePercentage} 
                                          className="usage-bar"
                                        />
                                        <Typography variant="caption" className="usage-percentage">
                                          Used {usagePercentage}% ({redeemedCount}/{maxUsage})
                                        </Typography>
                                      </div>
                                    )}
                                  </div>

                                  {/* Footer */}
                                  <div className="voucher-card-footer-custom">
                                    {/* Inactive notice */}
                                    {voucher.status !== 'active' && (
                                      <Box 
                                        sx={{ 
                                          mb: 1.5,
                                          p: 1,
                                          backgroundColor: 'rgba(238, 77, 45, 0.1)',
                                          borderRadius: 1,
                                          border: '1px solid rgba(238, 77, 45, 0.3)'
                                        }}
                                      >
                                        <Typography 
                                          variant="caption" 
                                          sx={{ 
                                            color: '#ee4d2d',
                                            fontWeight: 600,
                                            fontSize: '12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 0.5
                                          }}
                                        >
                                          <span>⚠</span>
                                          <span>Inactive - This voucher is not currently available</span>
                                        </Typography>
                                      </Box>
                                    )}
                                    <Button
                                      variant="contained"
                                      className={`save-btn ${isExchanged ? 'saved' : ''} ${!canSave || voucher.status !== 'active' || isExchanged ? 'disabled' : ''}`}
                                      onClick={() => handleExchangeVoucher(voucher)}
                                      disabled={!canSave || isExchanged || voucher.status !== 'active' || exchangingVoucherId === voucherId}
                                      fullWidth
                                      sx={{
                                        position: 'relative',
                                        minHeight: '40px',
                                        cursor: isExchanged ? 'not-allowed' : 'pointer'
                                      }}
                                    >
                                      {exchangingVoucherId === voucherId ? (
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                          <CircularProgress size={20} sx={{ color: 'white' }} />
                                          <span>Processing...</span>
                                        </Box>
                                      ) : (
                                        isExchanged ? 'Exchanged' : voucher.status !== 'active' ? 'Not Available' : canSave ? 'Exchange Voucher' : `Need ${(voucher.rewardPointCost || 0) - userPoints} more points`
                                      )}
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <IconButton
                        className="carousel-arrow carousel-arrow-right"
                        onClick={() => {
                          setCurrentVoucherIndex((prev) => {
                            const maxIndex = Math.max(0, businessVouchers.length - vouchersPerPage);
                            const newIndex = Math.min(maxIndex, prev + vouchersToScroll);
                            return newIndex;
                          });
                        }}
                        disabled={currentVoucherIndex + vouchersPerPage >= businessVouchers.length || businessVouchers.length <= vouchersPerPage}
                        sx={{
                          position: 'absolute',
                          right: '-20px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          zIndex: 2,
                          backgroundColor: 'white',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                          '&:hover': {
                            backgroundColor: '#f5f5f5',
                          },
                          '&.Mui-disabled': {
                            opacity: 0.3,
                          }
                        }}
                      >
                        <ArrowForwardIosIcon />
                      </IconButton>
                    </div>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        No vouchers available for this store
                      </Typography>
                    </Box>
                  )}
              </div>
            </div>
          </section>
        )}

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

      {/* Exchange Voucher Confirmation Dialog */}
      <Dialog
        open={openExchangeDialog}
        onClose={() => setOpenExchangeDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ 
          fontWeight: 700, 
          color: '#164c34',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <GiftIcon sx={{ color: '#22c55e' }} />
          Confirm Exchange Voucher
        </DialogTitle>
        <DialogContent dividers>
          {voucherToExchange && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Are you sure you want to exchange this voucher?
              </Typography>
              
              <Box sx={{ 
                p: 2, 
                backgroundColor: '#f0fdf4', 
                borderRadius: 2,
                border: '1px solid #dcfce7'
              }}>
                <Typography variant="h6" sx={{ color: '#22c55e', fontWeight: 700, mb: 1 }}>
                  {voucherToExchange.discountPercent || 0}% OFF
                </Typography>
                {voucherToExchange.customName && (
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#164c34', mb: 0.5 }}>
                    {voucherToExchange.customName}
                  </Typography>
                )}
                <Typography variant="body2" sx={{ color: '#16a34a', mb: 1 }}>
                  {voucherToExchange.businessInfo?.businessName || businessName}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1.5 }}>
                  <GiftIcon sx={{ fontSize: 18, color: '#22c55e' }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#164c34' }}>
                    Cost: {voucherToExchange.rewardPointCost || 0} points
                  </Typography>
                </Box>
                
                {userPoints < (voucherToExchange.rewardPointCost || 0) && (
                  <Typography variant="caption" sx={{ color: '#dc2626', mt: 1, display: 'block' }}>
                    ⚠ You need {(voucherToExchange.rewardPointCost || 0) - userPoints} more points
                  </Typography>
                )}
              </Box>
              
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                This action cannot be undone. The points will be deducted from your account.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button 
            onClick={() => setOpenExchangeDialog(false)}
            disabled={exchangingVoucherId !== null}
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmExchange}
            variant="contained"
            disabled={exchangingVoucherId !== null || !voucherToExchange || userPoints < (voucherToExchange?.rewardPointCost || 0)}
            sx={{
              backgroundColor: '#22c55e',
              '&:hover': { backgroundColor: '#16a34a' },
              textTransform: 'none',
              minWidth: '120px'
            }}
          >
            {exchangingVoucherId ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={16} sx={{ color: 'white' }} />
                <span>Exchanging...</span>
              </Box>
            ) : (
              'Confirm Exchange'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

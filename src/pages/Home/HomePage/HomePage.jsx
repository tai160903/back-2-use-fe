import Grid from "@mui/material/Grid";
import "./HomePage.css";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import AddIcon from "@mui/icons-material/Add";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { FaCoins, FaLeaf, FaUsers, FaStar, FaRegStar } from "react-icons/fa";
import { RiTruckLine, RiCustomerService2Line, RiArrowGoBackLine, RiShieldCheckLine } from "react-icons/ri";
import { useMemo, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { PATH } from "../../../routes/path";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getLeaderBoardApiCustomer } from "../../../store/slices/leaderBoardSlice";
import {
  getCustomerVouchers,
  redeemCustomerVoucher,
} from "../../../store/slices/voucherSlice";
import { getAllStoreApi } from "../../../store/slices/storeSilce";
import toast from "react-hot-toast";

import { IoQrCodeOutline } from "react-icons/io5";
import image1 from "../../../assets/image/cup6.png";
import plantIndoor from "../../../assets/image/container.png";
import plantOutdoor from "../../../assets/image/cupdou.png";
import storeImg1 from "../../../assets/image/item1.jpg";
import storeImg2 from "../../../assets/image/item2.jpg";
import storeImg3 from "../../../assets/image/item3.png";
import storeImg4 from "../../../assets/image/banner.jpg";
import storeImg5 from "../../../assets/image/banner1.jpg";
import banner4Img from "../../../assets/image/banner4.jpg";

export default function HomePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { leaderBoard, isLoading } = useSelector((state) => state.leaderBoard);
  const { customerVouchers, isLoading: vouchersLoading } = useSelector((state) => state.vouchers);
  const { allStores, isLoading: isLoadingStores } = useSelector((state) => state.store);

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const monthOptions = useMemo(
    () => Array.from({ length: 12 }, (unused, index) => index + 1),
    []
  );
  const yearOptions = useMemo(
    () => Array.from({ length: 5 }, (unused, index) => currentYear - index),
    [currentYear]
  );

  useEffect(() => {
    dispatch(
      getLeaderBoardApiCustomer({
        month: selectedMonth,
        year: selectedYear,
        page: 1,
        limit: 10,
      })
    );
  }, [dispatch, selectedMonth, selectedYear]);

  // Load customer vouchers for homepage display
  useEffect(() => {
    dispatch(getCustomerVouchers({ page: 1, limit: 2 }));
  }, [dispatch]);

  // Load all businesses for home top stores section
  useEffect(() => {
    dispatch(getAllStoreApi());
  }, [dispatch]);

  // Top 8 stores: highest rating, newest
  const topStores = Array.isArray(allStores) && allStores.length > 0
    ? (() => {
        const activeStores = allStores.filter(
          (store) => store.isActive && !store.isBlocked
        );

        const sorted = [...activeStores].sort((a, b) => {
          const ratingA =
            typeof a.averageRating === "number" ? a.averageRating : 0;
          const ratingB =
            typeof b.averageRating === "number" ? b.averageRating : 0;

          if (ratingB !== ratingA) return ratingB - ratingA;

          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });

        return sorted.slice(0, 8);
      })()
    : [];
  // Transform API vouchers to display format - only show active vouchers
  const vouchers = useMemo(() => {
    if (!customerVouchers || customerVouchers.length === 0) {
      // Fallback to empty array if no vouchers
      return [];
    }

    // Filter only active vouchers
    const activeVouchers = customerVouchers.filter(
      (voucher) => voucher.status === "active"
    );

    return activeVouchers.slice(0, 2).map((voucher) => {
      // Get discount percent - check voucher directly first, then businessVoucher
      const discountPercent = 
        voucher.discountPercent || 
        voucher.businessVoucher?.discountPercent || 
        0;

      // Get voucher name/title - customName is directly in voucher object
      const voucherName = 
        voucher.customName || 
        voucher.businessVoucher?.customName || 
        voucher.name || 
        'Voucher';

      // Format expiry date
      const endDate = voucher.endDate || voucher.businessVoucher?.endDate;
      let expireText = 'N/A';
      if (endDate) {
        const date = new Date(endDate);
        if (!isNaN(date.getTime())) {
          expireText = `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
        }
      }

      // Get voucher code - use baseCode directly
      const voucherCode = voucher.baseCode || voucher.businessVoucher?.baseCode || voucher.code || 'N/A';

      // Get additional info - directly from voucher object
      const maxUsage = voucher.maxUsage || voucher.businessVoucher?.maxUsage || 0;
      const rewardPointCost = voucher.rewardPointCost || voucher.businessVoucher?.rewardPointCost || 0;

      return {
        id: voucher._id || voucher.id || `v-${Math.random()}`,
        voucherId: voucher._id || voucher.id, // For redeem API
        off: `${discountPercent}%`,
        title: `${discountPercent}% OFF ${voucherName}`,
        code: voucherCode,
        expire: expireText,
        maxUsage: maxUsage,
        rewardPointCost: rewardPointCost,
        discountPercent: discountPercent,
        voucherName: voucherName,
      };
    });
  }, [customerVouchers]);

  // Handle redeem voucher
  const handleRedeemVoucher = async (voucherId, e) => {
    e.stopPropagation(); // Prevent navigation
    try {
      await dispatch(redeemCustomerVoucher({ voucherId })).unwrap();
      toast.success('Voucher saved successfully!');
      // Optionally refresh vouchers list
      dispatch(getCustomerVouchers({ page: 1, limit: 2 }));
    } catch (error) {
      const errorMessage = 
        error?.message || 
        error?.error || 
        error?.data?.message || 
        'Failed to save voucher';
      toast.error(errorMessage);
    }
  };
  const topTenLeaderBoard = useMemo(() => {
    if (!Array.isArray(leaderBoard)) return [];
    return leaderBoard.slice(0, 10);
  }, [leaderBoard]);
  return (
    <div className="homePage">
      {/* Plant-themed Hero Section */}
      <section className="plant-hero">
        <div className="hero-content">
          <div className="hero-text">
            <p className="hero-tagline">Share the planet, share the love</p>
            <h1 className="hero-title">
              Explore sustainable sharing<br />
              with reusable items for every<br />
              part of your life.
            </h1>
            <p className="hero-description">
              From food containers to reusable cups,<br />
              find eco-friendly solutions for your daily needs.
            </p>
            <div className="hero-actions">
              <Button className="shop-now-btn" onClick={() => navigate(PATH.REGISTERBUSSINESS)}>
                Become a Partner
              </Button>
            </div>
          </div>
          <div className="hero-plants"></div>
        </div>

        {/* Statistics Section */}
        <div className="statistics-section">
          <div className="stats-container">
            <div className="stat-card">
              <h3>Trusted by</h3>
              <div className="stat-number" style={{ color: '#0b5529', fontWeight: '700' }}>1,900+</div>
              <p>Happy Plant Lovers</p>
            </div>
            <div className="stat-card">
              <h3>Explore</h3>
              <div className="stat-number" style={{ color: '#0b5529', fontWeight: '700' }}>8,000+</div>
              <p>Unique Green Beauties</p>
            </div>
            <div className="stat-card">
              <h3>Backed by</h3>
              <div className="stat-number" style={{ color: '#0b5529', fontWeight: '700' }}>520+</div>
              <p>Local Greenhouses</p>
            </div>
            <div className="stat-card">
              <h3>Rated</h3>
              <div className="stat-number" style={{ color: '#0b5529', fontWeight: '700' }}>4.9★</div>
              <p>by Our Customers</p>
            </div>
          </div>
        </div>
      </section>
      {/* welcome - Why Shop layout */}
      <section className="welcome-section">
        <div className="homePage-container">
          <div className="why-header">
            <Typography className="why-title">Why choose reusable cups and boxes?</Typography>
            <Typography className="why-subtitle">
              From your screen to your space — we make sustainable shopping smooth and stress‑free.
            </Typography>
          </div>

          <div className="why-grid">
            <div className="why-column why-left">
              <div className="feature-item">
                <div className="feature-icon">
                  <FaCoins />
                </div>
                <div>
                  <h4 className="feature-title">Save money</h4>
                  <p className="feature-desc">Place a deposit, return the item, get a full refund.</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <FaLeaf />
                </div>
                <div>
                  <h4 className="feature-title">Protect the environment</h4>
                  <p className="feature-desc">Reuse items, reduce waste.</p>
                </div>
              </div>
            </div>

            <div className="why-center">
              <img
                className="why-plant"
                src={image1}
                alt="plant"
              />
            </div>

            <div className="why-column why-right">
              <div className="feature-item">
                <div className="feature-icon">
                  <IoQrCodeOutline />
                </div>
                <div>
                  <h4 className="feature-title">Fast & easy</h4>
                  <p className="feature-desc">Scan QR, no hassle.</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <FaUsers />
                </div>
                <div>
                  <h4 className="feature-title">Share & sustain</h4>
                  <p className="feature-desc">Connect, share, and build a greener community.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
 

      {/* PARTNERS */}
      <section className="partners-section">
        <div className="partners-wrapper">
          <div className="partner-card left">
            <div className="card-content">
              <span className="card-badge">Indoors</span>
              <h3 className="card-title">Explore Reusable Cups</h3>
              <p className="card-desc">
              Discover eco-friendly cup models available at multiple partner stores. Check size, material, and store locations before borrowing in person.
              </p>
              <button className="card-btn">Explore Now</button>
            </div>
            <div className="card-image">
            <img src={plantOutdoor} />
            </div>
          </div>

          <div className="partner-card right">
            <div className="card-content">
              <span className="card-badge">Outdoors</span>
              <h3 className="card-title">Top Green Users</h3>
              <p className="card-desc">
              Check out the top users who borrow and return cups responsibly. Climb the ranking by borrowing smart and returning on time — every action counts for the planet.
              </p>
              <button className="card-btn">View Rankings</button>
            </div>
            <div className="card-image">
              <img src={plantIndoor} />
            </div>
          </div>
        </div>
      </section>


      {/* Top Rated Stores */}
      <section className="stores-section">
        <div className="homePage-container">
          <div className="stores-header">
            <h2 className="stores-title">Top Rated Stores</h2>
            <p className="stores-subtitle">
              Discover the most loved partner stores. Easy to borrow, hard not to love.
            </p>
          </div>

          <div className="store-grid">
            {isLoadingStores && topStores?.length === 0 ? (
              <div
                style={{
                  padding: "20px",
                  textAlign: "center",
                  color: "#6b7280",
                }}
              >
                Loading top stores...
              </div>
            ) : topStores?.length === 0 ? (
              <div
                style={{
                  padding: "20px",
                  textAlign: "center",
                  color: "#6b7280",
                }}
              >
                No stores available
              </div>
            ) : (
              topStores?.map((store) => {
                const rating =
                  typeof store.averageRating === "number"
                    ? store.averageRating
                    : 0;
                const displayName = store.businessName || "Store";
                const address = store.businessAddress || "";
                const logo = store.businessLogoUrl || storeImg1;

                return (
                  <div
                    className="store-card"
                    key={store._id || displayName}
                  >
                    <div className="store-thumb">
                      <img src={logo} alt={displayName} />
                    </div>
                    <div className="store-info">
                      <div className="store-name">{displayName}</div>
                      <div className="store-rating">
                        {Array.from({ length: 5 }).map((_, idx) => {
                          const filled = idx < Math.round(rating);
                          return filled ? (
                            <FaStar className="star filled" key={idx} />
                          ) : (
                            <FaRegStar className="star" key={idx} />
                          );
                        })}
                        <span className="rating-number">
                          {rating.toFixed(1)}
                        </span>
                      </div>
                      <div className="store-address">{address}</div>
                    </div>
                    <div className="store-actions">
                      <button
                        className="view-store-btn"
                        onClick={() => {
                          if (store._id) {
                            navigate(
                              PATH.STOREDETAIL.replace(":id", store._id)
                            );
                          }
                        }}
                      >
                        View Store
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

         
        </div>
      </section>

      {/* cooperate - Voucher collection banner */}
      <section 
        className="cooperate-section"
        style={{
          backgroundImage: `url(${banner4Img})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          backgroundPosition: 'top'
        }}
      >
        <div className="homePage-container">
          <div className="promo-wrapper">
            <div className="promo-left">
              <p className="voucher-eyebrow">Featured deals</p>
              <h2 className="voucher-heading">Collect green vouchers</h2>
              <p className="voucher-copy">
                Grab exclusive discount codes for partner stores. Collect now and
                redeem when borrowing reusable cups and containers.
              </p>
              <button className="voucher-cta" onClick={() => navigate(PATH.VOUCHERS)}>Collect now</button>
            </div>
            <div className="promo-right">
              <div className="voucher-lists">
                {vouchersLoading ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
                    Loading vouchers...
                  </div>
                ) : vouchers.length > 0 ? (
                  vouchers.map((v) => (
                    <div key={v.id} className="voucher-cards">
                      <div className="voucher-left">
                        <div className="voucher-off">{v.off}</div>
                      </div>
                      <div className="voucher-right">
                        <div className="voucher-title">{v.voucherName}</div>
                        <div className="voucher-meta">
                          <div style={{ marginBottom: '4px' }}>
                            <strong>Discount:</strong> {v.discountPercent}%
                          </div>
                          <div style={{ marginBottom: '4px' }}>
                            <strong>Quantity:</strong> {v.maxUsage}
                          </div>
                          <div style={{ marginBottom: '4px' }}>
                            <strong>Point Cost:</strong> {v.rewardPointCost} points
                          </div>
                          <div>Code: {v.code} • Exp: {v.expire}</div>
                        </div>
                        <button 
                          className="voucher-btn"
                          onClick={(e) => handleRedeemVoucher(v.voucherId, e)}
                        >
                          Save voucher
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
                    No vouchers available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Leaderboard carousel under voucher */}
      <section className="leaderboard-section">
        <div className="homePage-container">
          <div className="leaderboard-header">
            <h2 className="leaderboard-title">Monthly Leaderboard</h2>
          </div>
          <p className="leaderboard-sub leaderboard-sub--below">
            Top 10 users for month {selectedMonth} / {selectedYear}
          </p>

          <div className="leaderboard-filters-bar">
            <FormControl size="small" className="leaderboard-filter-control">
              <InputLabel id="home-month-select-label">Month</InputLabel>
              <Select
                labelId="home-month-select-label"
                value={selectedMonth}
                label="Month"
                onChange={(event) => setSelectedMonth(event.target.value)}
              >
                {monthOptions.map((monthValue) => (
                  <MenuItem key={monthValue} value={monthValue}>
                    Month {monthValue}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" className="leaderboard-filter-control">
              <InputLabel id="home-year-select-label">Year</InputLabel>
              <Select
                labelId="home-year-select-label"
                value={selectedYear}
                label="Year"
                onChange={(event) => setSelectedYear(event.target.value)}
              >
                {yearOptions.map((yearValue) => (
                  <MenuItem key={yearValue} value={yearValue}>
                    {yearValue}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <Swiper
            className="leaderboard-swiper"
            modules={[Navigation, Pagination, A11y]}
            navigation
            pagination={{ clickable: true }}
            spaceBetween={16}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 1 },
              980: { slidesPerView: 2 },
              1280: { slidesPerView: 3 },
            }}
          >
            {isLoading && topTenLeaderBoard.length === 0 ? (
              <SwiperSlide>
                <div className="lb-card lb-loading">
                  <div className="lb-name">Loading leaderboard...</div>
                  <div className="lb-points">Please wait a moment.</div>
                </div>
              </SwiperSlide>
            ) : topTenLeaderBoard.length === 0 ? (
              <SwiperSlide >
                <div className="lb-card lb-empty" >
                  <div className="lb-name">No rankings yet this month</div>
                  <div className="lb-points">
                    Be the first to borrow and return responsibly to appear here.
                  </div>
                </div>
              </SwiperSlide>
            ) : (
              topTenLeaderBoard.map((entry, index) => {
                const displayName =
                  (entry.customerId && entry.customerId.fullName) ||
                  `User #${entry.rank ?? index + 1}`;
                const avatarUrl = entry.customerId?.userId?.avatar;
                const initials = displayName.charAt(0).toUpperCase();
                return (
                  <SwiperSlide key={entry._id || entry.id || index}>
                    <div className={`lb-card rank-${index + 1}`}>
                      <div className="lb-medal">{entry.rank ?? index + 1}</div>
                      <div className="lb-avatar">
                        {avatarUrl ? (
                          <img src={avatarUrl} alt={displayName} />
                        ) : (
                          <span>{initials}</span>
                        )}
                      </div>
                      <div className="lb-name">{displayName}</div>
                      <div className="lb-points">
                        {entry.rankingPoints ?? 0} pts
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })
            )}
          </Swiper>

          <div className="leaderboard-actions">
            <button className="view-all-btn-leaderboard" onClick={() => navigate(PATH.RANKINGS)}>View all</button>
          </div>
        </div>
      </section>
    </div>
  );
}


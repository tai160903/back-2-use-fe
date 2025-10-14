import Grid from "@mui/material/Grid";
import "./HomePage.css";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import AddIcon from "@mui/icons-material/Add";
import { FaPlay } from "react-icons/fa";
import { RiTruckLine, RiCustomerService2Line, RiArrowGoBackLine, RiShieldCheckLine } from "react-icons/ri";
import image1 from "../../../assets/image/item3.png";

export default function HomePage() {
  return (
    <div className="homePage">
      {/* Plant-themed Hero Section */}
      <section className="plant-hero">
        <div className="hero-content">
          <div className="hero-text">
            <p className="hero-tagline">Breathe life into your space</p>
            <h1 className="hero-title">
              Discover beautiful indoor plants for every corner of your home
            </h1>
            <p className="hero-description">
              From indoor greens to outdoor blooms — shop plants, pots, and care
              tools delivered with love
            </p>
            <div className="hero-actions">
              <Button className="shop-now-btn">Become a Partner</Button>
              <div className="watch-video">
                <div className="play-icon">
                  <FaPlay />
                </div>
                <span>Watch how Reusables works</span>
              </div>
            </div>
            <p className="hero-stats">
              Join 8,000+ plant lovers growing their dream spaces
            </p>
          </div>
          <div className="hero-plants"></div>
        </div>

        {/* Statistics Section */}
        <div className="statistics-section">
          <div className="stats-container">
            <div className="stat-card">
              <h3>Trusted by</h3>
              <div className="stat-number">1,900+</div>
              <p>Happy Plant Lovers</p>
            </div>
            <div className="stat-card">
              <h3>Explore</h3>
              <div className="stat-number">8,000+</div>
              <p>Unique Green Beauties</p>
            </div>
            <div className="stat-card">
              <h3>Backed by</h3>
              <div className="stat-number">520+</div>
              <p>Local Greenhouses</p>
            </div>
            <div className="stat-card">
              <h3>Rated</h3>
              <div className="stat-number">4.9★</div>
              <p>by Our Customers</p>
            </div>
          </div>
        </div>
      </section>
      {/* welcome - Why Shop layout */}
      <section className="welcome-section">
        <div className="homePage-container">
          <div className="why-header">
            <Typography className="why-title">Why shop with Reusables?</Typography>
            <Typography className="why-subtitle">
              From your screen to your space — we make sustainable shopping smooth and stress‑free.
            </Typography>
          </div>

          <div className="why-grid">
            <div className="why-column why-left">
              <div className="feature-item">
                <div className="feature-icon">
                  <RiTruckLine />
                </div>
                <div>
                  <h4 className="feature-title">Free and Fast Delivery</h4>
                  <p className="feature-desc">Free delivery on orders over $50. Fresh to your door.</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <RiArrowGoBackLine />
                </div>
                <div>
                  <h4 className="feature-title">Hassle‑Free Returns</h4>
                  <p className="feature-desc">Changed your mind? Return within 30 days, no stress.</p>
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
                  <RiCustomerService2Line />
                </div>
                <div>
                  <h4 className="feature-title">24/7 Customer Support</h4>
                  <p className="feature-desc">We’re here whenever you need us — day or night.</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <RiShieldCheckLine />
                </div>
                <div>
                  <h4 className="feature-title">Secure Payments</h4>
                  <p className="feature-desc">Pay safely with secure, encrypted checkout.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="partners-section">
        <Typography className="partners-title">
          PARTNERS WORKING WITH US
        </Typography>
        <div className="partners-containers">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWFGeQAZXgKnplOilFt7XCt6f-Q6JCoPGiRg&s"
            alt="OMR"
            className="partner-logo"
          ></img>
          <img
            src="https://ibrand.vn/wp-content/uploads/2024/07/Pepsi-logo-1.png"
            alt="OMR"
            className="partner-logo"
          ></img>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2KGanyb4j9JOTo9vSNexIGkNJUx69MKXLb0VB39xqnlUAulXFb_WdZ4QbhPnDaLReZds&usqp=CAU"
            alt="OMR"
            className="partner-logo"
          ></img>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/e/e5/OMR_Logo.png"
            alt="OMR"
            className="partner-logo"
          ></img>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7zcqjXndH2gViGh7KeuaVJjFTLsuTMZ1DoA&s"
            alt="OMR"
            className="partner-logo"
          ></img>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYfAopoHLew0jA_ZKURJKrJG8eQbQ0ceXcgLVhOH20zOGV_ulPclfObOyj_bNghr11qYg&usqp=CAU"
            alt="OMR"
            className="partner-logo"
          ></img>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/9/9d/BackWerk_logo.svg"
            alt="OMR"
            className="partner-logo"
          ></img>
          <img
            src="https://d21buns5ku92am.cloudfront.net/69274/documents/43826-1608038201-Wolt_logo_RGB-86ecff-medium.png"
            alt="OMR"
            className="partner-logo"
          ></img>
        </div>
      </section>

      {/* slution*/}
      <section>
        <div className="solution-section">
          <div className="homePage-container">
            <div className="solution-header">
              <Typography className="solution-title">OUR SOLUTIONS</Typography>
            </div>
          </div>
        </div>
        <div>
          <div className="solution-content">
            <div className="solution-item operations">
              <div className="content-overlay">
                <p className="solution-description">
                  From the first package to the final report, we take care of
                  everything for you. Storage, logistics, cleaning, and
                  reporting? Easy! Sustainable, smart, and hassle-free.
                  Reusables have never been this simple.
                </p>
              </div>
              <div className="solution-footer">
                <Typography className="solution-text">Operations</Typography>
                <Link href="#" className="solution-link">
                  {" "}
                  Learn more
                  <AddIcon sx={{ marginLeft: "10px" }} />
                </Link>
              </div>
            </div>
            <div className="solution-item point-of-sale">
              <div className="content-overlay">
                <p className="solution-description">
                  Effortless reusable solutions with smart distribution & return
                  processes, powered by advanced technology for a 99.2% return
                  rate. Works seamlessly via app or POS integration.
                </p>
              </div>
              <div className="solution-footer">
                <Typography className="solution-text">
                  {" "}
                  Point of sale
                </Typography>
                <Link href="#" className="solution-link">
                  {" "}
                  Learn more
                  <AddIcon sx={{ marginLeft: "10px" }} />
                </Link>
              </div>
            </div>
            <div className="solution-item engagement">
              <div className="content-overlay">
                <p className="solution-description">
                  Your packaging can do more! With branded cups, giveaways, or
                  exciting promotions, your reusable cup becomes a brand
                  ambassador. This communication tool speaks for itself – and
                  for you.
                </p>
              </div>
              <div className="solution-footer">
                <Typography className="solution-text">ENGAGEMENT</Typography>
                <Link href="#" className="solution-link">
                  {" "}
                  Learn more
                  <AddIcon sx={{ marginLeft: "10px" }} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* global */}
      <section className="global-section">
        <div className="homePage-container">
          <Grid container spacing={35} sx={{ maxWidth: "1600px" }}>
            <Grid size={6} className="global-left">
              <Typography className="global-text-title">
                Our Global Network for change
              </Typography>
              <Typography className="global-text-description">
                Become part of our global network and help make reusables the
                new standard!
              </Typography>
              <button className="global-btn">
                <Link
                  href="/auth/register/bussiness"
                  sx={{ textDecoration: "none", color: "white" }}
                >
                  Become a Partner Now!
                </Link>
              </button>
            </Grid>
            <Grid size={6} className="global-right">
              <div className="globe">
                <img
                  src="https://cdn.prod.website-files.com/67518f48ef6518d6394c6a67/67810cdf17ff5303f9441371_vytal_globe_grey_white.jpg"
                  className="gloabal"
                  alt="globe"
                />
              </div>
            </Grid>
          </Grid>
        </div>
      </section>

      {/* cooperate */}
      <section className="cooperate-section">
        <div className="homePage-container">
          <Grid container spacing={40} sx={{ maxWidth: "1700px" }}>
            <Grid size={5}>
              <Typography className="cooperate-text-description">
                Let’s create a lasting impact together, with efficient, green
                solutions.
              </Typography>
              <a href="#" className="get-in-touch-btn">
                Get in touch
              </a>
            </Grid>
            <Grid size={7}>
              <Typography className="cooperate-title">
                CREATE IMPACT WITH US
              </Typography>
              <button className="cooperate-sub">Choose to reuse</button>
            </Grid>
          </Grid>
        </div>
      </section>
    </div>
  );
}

//  padding-bottom: 80px !important;

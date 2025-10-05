import Grid from "@mui/material/Grid";
import "./HomePage.css";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import AddIcon from "@mui/icons-material/Add";

export default function HomePage() {
  return (
    <div className="homePage">
      {/* banner */}
      <section className="banner">
        <div className="bg-image-container">
          <img
            src="https://a.storyblok.com/f/102007/768x432/94c9316db2/sustainable-packaging-paper-eco-friendly-disposable-tableware-plates-cups-bowls-recycling-signs.jpg/m/filters:quality(90)"
            alt="Sustainable products background"
            className="banner-image"
          />
          <div className="bg-overlay"></div>
        </div>

        <div className="banner-content">
          {/* Badge */}
          <div className="badge">
            <span className="badge-text">Reuse for a green future</span>
          </div>

          {/* Main Heading */}
          <Typography className="main-heading">
            The future
            <br />
            <span className="primary-text">of reusables</span>
          </Typography>

          {/* Subheading */}
          <p className="subheading">
            Join the world's largest reuse system
            <br />
            and let us shape the future
          </p>

          {/* CTA Button */}
          <Button className="cta-button">
            <Link href="/auth/login" sx={{ color: "white" }}>
              Get Start
            </Link>
          </Button>
        </div>
      </section>
      {/* welcome */}
      <section className="welcome-section">
        <div className="homePage-container">
          <Grid container spacing={10} sx={{ maxWidth: "1600px" }}>
            <Grid size={5} className="welcome-left">
              <Typography className="welcome-text-title">
                Welcome to Reusables
              </Typography>
              <Typography className="welcome-text-description">
                We are the world’s largest reusable system.
              </Typography>
              <button className="welcome-btn">More about</button>
            </Grid>
            <Grid size={7} className="welcome-right">
              <Grid container spacing={3}>
                {" "}
                <Grid item size={4}>
                  <div className="welcome-item">
                    <Typography variant="h3" color="text.primary">
                      +7K
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.primary"
                      style={{ fontSize: 20 }}
                    >
                      Partners
                    </Typography>
                  </div>
                </Grid>
                <Grid item size={4}>
                  <div className="welcome-item">
                    <Typography
                      variant="h3"
                      color="text.primary"
                      style={{ wordWrap: "break-word" }}
                    >
                      +19M
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.primary"
                      style={{ wordWrap: "break-word", fontSize: 20 }}
                    >
                      Waste Diverted
                    </Typography>
                  </div>
                </Grid>
                <Grid item size={4}>
                  <div className="image-container">
                    <img
                      src="https://www.elpack.co.uk/wp-content/uploads/2023/08/bigstock-Disposable-Eco-friendly-Packag-470195495-1032x1032.jpg"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                </Grid>
                <Grid item size={4}>
                  <div className="image-container">
                    <img
                      src="https://images.squarespace-cdn.com/content/v1/613a3e0d61ffac1865f75ffe/e6bcbdc7-7a1e-466d-a3f1-e4aaf60f8df9/OKAPI_July2022_IMG_9247_JasonQuigley.jpg"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                </Grid>
                <Grid item size={4}>
                  <div className="welcome-item">
                    <Typography
                      variant="h3"
                      color="text.primary"
                      style={{ wordWrap: "break-word" }}
                    >
                      +23K
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.primary"
                      style={{ wordWrap: "break-word", fontSize: 20 }}
                    >
                      Countries
                    </Typography>
                  </div>
                </Grid>
                <Grid item size={4}>
                  <div className="welcome-item">
                    <Typography
                      variant="h3"
                      color="text.primary"
                      style={{ wordWrap: "break-word" }}
                    >
                      +10M
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.primary"
                      style={{ wordWrap: "break-word", fontSize: 20 }}
                    >
                      Consumers
                    </Typography>
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="partners-section">
        <Typography className="partners-title">
          PARTNERS WORKING WITH US
        </Typography>
        <div className="partners-container">
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

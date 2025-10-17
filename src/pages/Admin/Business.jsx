import React from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Store, Business as BusinessIcon, TrendingUp } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../routes/path";
import "./AdminDashboard.css";

export default function Business() {
  const navigate = useNavigate();

  const handleManageSubscriptions = () => {
    navigate(PATH.ADMIN_SUBSCRIPTIONS);
  };

  return (
    <div className="adminDashboard">
      {/* banner */}
      <section className="banner">
        <div className="bg-image-container">
          <img
            src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Business management background"
            className="banner-image"
          />
          <div className="bg-overlay"></div>
        </div>

        <div className="banner-content">
          <div className="badge">
            <span className="badge-text">Subscription Management</span>
          </div>
          <Typography className="main-heading">
            Subscription
            <br />
            <span className="primary-text">Management</span>
          </Typography>
          <p className="subheading">
            Manage business subscription plans and
            <br />
            monitor billing information
          </p>
          <Button className="cta-button" onClick={handleManageSubscriptions}>
            Manage Subscriptions
          </Button>
        </div>
      </section>

      {/* content */}
      <section className="welcome-section">
        <div className="adminDashboard-container">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card className="welcome-item">
                <CardContent>
                  <Store sx={{ fontSize: 40, color: "#2e7d32", mb: 2 }} />
                  <Typography variant="h4" color="text.primary">
                    156
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Active Subscriptions
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card className="welcome-item">
                <CardContent>
                  <BusinessIcon sx={{ fontSize: 40, color: "#1976d2", mb: 2 }} />
                  <Typography variant="h4" color="text.primary">
                    23
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Expired Plans
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card className="welcome-item">
                <CardContent>
                  <TrendingUp sx={{ fontSize: 40, color: "#f57c00", mb: 2 }} />
                  <Typography variant="h4" color="text.primary">
                    89%
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Revenue Rate
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </div>
      </section>
    </div>
  );
}

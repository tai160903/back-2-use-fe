import React from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Assessment, TrendingUp, Speed } from "@mui/icons-material";
import "./AdminDashboard.css";

export default function Analytics() {
  return (
    <div className="adminDashboard">
      {/* banner */}
      <section className="banner">
        <div className="bg-image-container">
          <img
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Analytics dashboard background"
            className="banner-image"
          />
          <div className="bg-overlay"></div>
        </div>

        <div className="banner-content">
          <div className="badge">
            <span className="badge-text">Analytics Dashboard</span>
          </div>
          <Typography className="main-heading">
            Platform
            <br />
            <span className="primary-text">Analytics</span>
          </Typography>
          <p className="subheading">
            Monitor performance metrics and
            <br />
            track key indicators
          </p>
          <Button className="cta-button">
            Export Data
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
                  <Assessment sx={{ fontSize: 40, color: "#7b1fa2", mb: 2 }} />
                  <Typography variant="h4" color="text.primary">
                    1.2M
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Total Transactions
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card className="welcome-item">
                <CardContent>
                  <TrendingUp sx={{ fontSize: 40, color: "#2e7d32", mb: 2 }} />
                  <Typography variant="h4" color="text.primary">
                    +15%
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Growth Rate
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card className="welcome-item">
                <CardContent>
                  <Speed sx={{ fontSize: 40, color: "#f57c00", mb: 2 }} />
                  <Typography variant="h4" color="text.primary">
                    99.8%
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Uptime
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

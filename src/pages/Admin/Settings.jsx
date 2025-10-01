import React from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Settings as SettingsIcon, Security, Notifications } from "@mui/icons-material";
import "./AdminDashboard.css";

export default function Settings() {
  return (
    <div className="adminDashboard">
      {/* banner */}
      <section className="banner">
        <div className="bg-image-container">
          <img
            src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Settings dashboard background"
            className="banner-image"
          />
          <div className="bg-overlay"></div>
        </div>

        <div className="banner-content">
          <div className="badge">
            <span className="badge-text">System Settings</span>
          </div>
          <Typography className="main-heading">
            Platform
            <br />
            <span className="primary-text">Settings</span>
          </Typography>
          <p className="subheading">
            Configure system preferences and
            <br />
            manage platform settings
          </p>
          <Button className="cta-button">
            Save Changes
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
                  <SettingsIcon sx={{ fontSize: 40, color: "#6a1b9a", mb: 2 }} />
                  <Typography variant="h4" color="text.primary">
                    General
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Basic platform configuration
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card className="welcome-item">
                <CardContent>
                  <Security sx={{ fontSize: 40, color: "#d32f2f", mb: 2 }} />
                  <Typography variant="h4" color="text.primary">
                    Security
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Authentication and access control
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card className="welcome-item">
                <CardContent>
                  <Notifications sx={{ fontSize: 40, color: "#f57c00", mb: 2 }} />
                  <Typography variant="h4" color="text.primary">
                    Notifications
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Email and alert preferences
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

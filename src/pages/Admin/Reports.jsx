import React from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Description, Assessment, Download } from "@mui/icons-material";
import "./AdminDashboard.css";

export default function Reports() {
  return (
    <div className="adminDashboard">
      {/* banner */}
      <section className="banner">
        <div className="bg-image-container">
          <img
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2015&q=80"
            alt="Reports dashboard background"
            className="banner-image"
          />
          <div className="bg-overlay"></div>
        </div>

        <div className="banner-content">
          <div className="badge">
            <span className="badge-text">Reports Center</span>
          </div>
          <Typography className="main-heading">
            Generate
            <br />
            <span className="primary-text">Reports</span>
          </Typography>
          <p className="subheading">
            Create detailed reports and
            <br />
            export data for analysis
          </p>
          <Button className="cta-button">
            New Report
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
                  <Description sx={{ fontSize: 40, color: "#1976d2", mb: 2 }} />
                  <Typography variant="h4" color="text.primary">
                    45
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Generated Reports
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card className="welcome-item">
                <CardContent>
                  <Assessment sx={{ fontSize: 40, color: "#2e7d32", mb: 2 }} />
                  <Typography variant="h4" color="text.primary">
                    12
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Scheduled Reports
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card className="welcome-item">
                <CardContent>
                  <Download sx={{ fontSize: 40, color: "#f57c00", mb: 2 }} />
                  <Typography variant="h4" color="text.primary">
                    234
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Downloads This Month
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

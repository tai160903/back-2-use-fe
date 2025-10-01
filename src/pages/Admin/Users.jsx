import React from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { People, PersonAdd, Security } from "@mui/icons-material";
import "./AdminDashboard.css";

export default function Users() {
  return (
    <div className="adminDashboard">
      {/* banner */}
      <section className="banner">
        <div className="bg-image-container">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
            alt="Users management background"
            className="banner-image"
          />
          <div className="bg-overlay"></div>
        </div>

        <div className="banner-content">
          <div className="badge">
            <span className="badge-text">User Management</span>
          </div>
          <Typography className="main-heading">
            Manage
            <br />
            <span className="primary-text">Users</span>
          </Typography>
          <p className="subheading">
            Control user access, roles and permissions
            <br />
            across your platform
          </p>
          <Button className="cta-button">
            Add New User
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
                  <People sx={{ fontSize: 40, color: "#1976d2", mb: 2 }} />
                  <Typography variant="h4" color="text.primary">
                    2,543
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Total Users
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card className="welcome-item">
                <CardContent>
                  <PersonAdd sx={{ fontSize: 40, color: "#2e7d32", mb: 2 }} />
                  <Typography variant="h4" color="text.primary">
                    127
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    New This Month
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card className="welcome-item">
                <CardContent>
                  <Security sx={{ fontSize: 40, color: "#d32f2f", mb: 2 }} />
                  <Typography variant="h4" color="text.primary">
                    15
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Suspended
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

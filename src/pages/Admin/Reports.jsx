import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import Pagination from "@mui/material/Pagination";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import { 
  getAllBusinessesApi, 
  setBusinessBlockedFilter, 
  setBusinessPagination,
  resetBusinessFilters 
} from "../../store/slices/adminSlice";
import { Store, Business, Block } from "@mui/icons-material";
import "./AdminDashboard.css";

export default function Store() {
  const dispatch = useDispatch();
  const { 
    businesses, 
    isLoading, 
    businessPagination, 
    businessFilters 
  } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(getAllBusinessesApi({
      page: businessPagination.page,
      limit: businessPagination.limit,
      isBlocked: businessFilters.isBlocked
    }));
  }, [dispatch, businessPagination.page, businessPagination.limit, businessFilters.isBlocked]);

  const handlePageChange = (event, value) => {
    dispatch(setBusinessPagination({ page: value }));
  };

  const handleFilterChange = (event) => {
    const value = event.target.value;
    dispatch(setBusinessBlockedFilter(value === 'all' ? null : value === 'blocked'));
    dispatch(setBusinessPagination({ page: 1 })); // Reset to first page when filtering
  };

  const handleResetFilters = () => {
    dispatch(resetBusinessFilters());
    dispatch(setBusinessPagination({ page: 1 }));
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    return timeString;
  };

  const getStatusChip = (isBlocked, isActive) => {
    if (isBlocked) {
      return <Chip label="Blocked" color="error" size="small" />;
    }
    if (isActive) {
      return <Chip label="Active" color="success" size="small" />;
    }
    return <Chip label="Inactive" color="warning" size="small" />;
  };

  return (
    <div className="adminDashboard">
      {/* banner */}
      <section className="banner">
        <div className="bg-image-container">
          <img
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2015&q=80"
            alt="Store dashboard background"
            className="banner-image"
          />
          <div className="bg-overlay"></div>
        </div>

        <div className="banner-content">
          <div className="badge">
            <span className="badge-text">Store Management</span>
          </div>
          <Typography className="main-heading">
            Manage
            <br />
            <span className="primary-text">Stores</span>
          </Typography>
          <p className="subheading">
            View and manage all business stores
            <br />
            in the platform
          </p>
        </div>
      </section>

      {/* content */}
      <section className="welcome-section">
        <div className="adminDashboard-container">
          {/* Statistics Cards */}
          <Grid container spacing={4} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Card className="welcome-item">
                <CardContent>
                  <Store sx={{ fontSize: 40, color: "#1976d2", mb: 2 }} />
                  <Typography variant="h4" color="text.primary">
                    {businessPagination.total || 0}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Total Stores
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card className="welcome-item">
                <CardContent>
                  <Business sx={{ fontSize: 40, color: "#2e7d32", mb: 2 }} />
                  <Typography variant="h4" color="text.primary">
                    {businesses.filter(b => b.isActive && !b.isBlocked).length}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Active Stores
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card className="welcome-item">
                <CardContent>
                  <Block sx={{ fontSize: 40, color: "#f57c00", mb: 2 }} />
                  <Typography variant="h4" color="text.primary">
                    {businesses.filter(b => b.isBlocked).length}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Blocked Stores
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Filters */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={businessFilters.isBlocked === null ? 'all' : businessFilters.isBlocked ? 'blocked' : 'unblocked'}
                      label="Status"
                      onChange={handleFilterChange}
                    >
                      <MenuItem value="all">All Stores</MenuItem>
                      <MenuItem value="unblocked">Active Only</MenuItem>
                      <MenuItem value="blocked">Blocked Only</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button 
                    variant="outlined" 
                    onClick={handleResetFilters}
                    fullWidth
                  >
                    Reset Filters
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Business Table */}
          <Card>
            <CardContent>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Logo</TableCell>
                      <TableCell>Business Name</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Address</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>Hours</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Created</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={8} align="center">
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : businesses.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} align="center">
                          No businesses found
                        </TableCell>
                      </TableRow>
                    ) : (
                      businesses.map((business) => (
                        <TableRow key={business._id}>
                          <TableCell>
                            <Avatar
                              src={business.businessLogoUrl}
                              alt={business.businessName}
                              sx={{ width: 40, height: 40 }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="subtitle2" fontWeight="bold">
                              {business.businessName}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={business.businessType} 
                              variant="outlined" 
                              size="small" 
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ maxWidth: 200 }}>
                              {business.businessAddress}
                            </Typography>
                          </TableCell>
                          <TableCell>{business.businessPhone}</TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {formatTime(business.openTime)} - {formatTime(business.closeTime)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {getStatusChip(business.isBlocked, business.isActive)}
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {new Date(business.createdAt).toLocaleDateString()}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              {businessPagination.totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Pagination
                    count={businessPagination.totalPages}
                    page={businessPagination.currentPage}
                    onChange={handlePageChange}
                    variant="outlined"
                    shape="rounded"
                    color="primary"
                    showFirstButton
                    showLastButton
                    sx={{
                      "& .MuiPaginationItem-root": {
                        "&.Mui-selected": {
                          backgroundColor: "#12422a",
                          color: "#ffffff",
                          fontWeight: 600,
                          "&:hover": {
                            backgroundColor: "#0d2e1c",
                          },
                        },
                        "&:hover": {
                          backgroundColor: "rgba(18, 66, 42, 0.1)",
                        },
                      },
                    }}
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  getTopCustomersApi
} from '../../../store/slices/adminSlice';
import { Box, CircularProgress, Typography, TextField, Select, MenuItem, FormControl, InputLabel, Grid, Avatar, FormHelperText } from '@mui/material';
import { FaUsers, FaCrown, FaLeaf } from 'react-icons/fa';
import '../AdminDashboard.css';

const TopCustomers = () => {
  const dispatch = useDispatch();
  
  // Filter states for top customers
  const [customerFilters, setCustomerFilters] = useState({
    top: 5,
    sortBy: '',
    order: ''
  });

  // Get data from Redux store
  const { 
    topCustomers,
    isLoading
  } = useSelector((state) => state.admin);

  // Fetch top customers when filters change
  useEffect(() => {
    const filters = {
      top: customerFilters.top || 5,
      ...(customerFilters.sortBy && { sortBy: customerFilters.sortBy }),
      ...(customerFilters.order && { order: customerFilters.order })
    };
    dispatch(getTopCustomersApi(filters));
  }, [customerFilters, dispatch]);

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <FaUsers className="header-icon" style={{ fontSize: '48px', color: '#164e31' }} />
            <div>
              <h1 className="dashboard-title">Top Customers</h1>
              <p className="dashboard-subtitle">Top performing customers ranking</p>
            </div>
          </div>
        </div>
      </div>

      <div className="top-ranking-section" style={{ padding: '24px' }}>
        {/* Filters Section */}
        <div className="ranking-filters-section">
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: '#12422a', fontSize: '18px', letterSpacing: '0.5px' }}>
            Filters
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <TextField
                  label="Number of Customers"
                  type="number"
                  value={customerFilters.top}
                  onChange={(e) => setCustomerFilters({ ...customerFilters, top: parseInt(e.target.value) || 5 })}
                  variant="outlined"
                  size="small"
                  helperText="How many customers to show"
                  inputProps={{ min: 1, max: 50 }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'white',
                      borderRadius: '10px',
                      transition: 'all 0.3s ease',
                      '&:hover fieldset': {
                        borderColor: '#12422a',
                        borderWidth: '2px',
                        boxShadow: '0 2px 8px rgba(18, 66, 42, 0.15)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#12422a',
                        borderWidth: '2px',
                        boxShadow: '0 4px 12px rgba(18, 66, 42, 0.25)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      fontWeight: 600,
                      color: '#4b5563',
                      '&.Mui-focused': {
                        color: '#12422a',
                        fontWeight: 700,
                      },
                    },
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small" variant="outlined">
                <InputLabel 
                  sx={{
                    backgroundColor: 'white',
                    px: 0.5,
                  }}
                >
                  Sort By
                </InputLabel>
                <Select
                  value={customerFilters.sortBy}
                  onChange={(e) => setCustomerFilters({ ...customerFilters, sortBy: e.target.value })}
                  label="Sort By"
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300,
                        zIndex: 1300
                      }
                    },
                    style: {
                      zIndex: 1300
                    }
                  }}
                  sx={{
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#12422a',
                      borderWidth: '2px',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#12422a',
                      borderWidth: '2px',
                    },
                    '& .MuiSelect-select': {
                      py: 1.25,
                      fontWeight: 500,
                    },
                  }}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="rankingPoints">Ranking Points</MenuItem>
                  <MenuItem value="ecoPoints">Eco Points</MenuItem>
                  <MenuItem value="totalTransactions">Total Transactions</MenuItem>
                </Select>
                <FormHelperText sx={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '4px' }}>
                  Sort customers by metric
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small" variant="outlined">
                <InputLabel 
                  sx={{
                    backgroundColor: 'white',
                    px: 0.5,
                  }}
                >
                  Order
                </InputLabel>
                <Select
                  value={customerFilters.order}
                  onChange={(e) => setCustomerFilters({ ...customerFilters, order: e.target.value })}
                  label="Order"
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300,
                        zIndex: 1300
                      }
                    },
                    style: {
                      zIndex: 1300
                    }
                  }}
                  sx={{
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#12422a',
                      borderWidth: '2px',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#12422a',
                      borderWidth: '2px',
                    },
                    '& .MuiSelect-select': {
                      py: 1.25,
                      fontWeight: 500,
                    },
                  }}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="asc">Ascending</MenuItem>
                  <MenuItem value="desc">Descending</MenuItem>
                </Select>
                <FormHelperText sx={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '4px' }}>
                  Ascending or descending order
                </FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
        </div>

        {/* Ranking Cards Grid */}
        {isLoading && !topCustomers ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
            <CircularProgress />
          </Box>
        ) : topCustomers && topCustomers.length > 0 ? (
          <div className="ranking-cards-grid">
            {topCustomers.map((customer, index) => {
              const rank = index + 1;
              const isTopThree = rank <= 3;
              const rankColors = {
                1: { bg: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)', text: '#000' },
                2: { bg: 'linear-gradient(135deg, #C0C0C0 0%, #A9A9A9 100%)', text: '#000' },
                3: { bg: 'linear-gradient(135deg, #CD7F32 0%, #8B4513 100%)', text: '#fff' }
              };
              const rankColor = isTopThree ? rankColors[rank] : { bg: '#ffffff', text: '#6b7280' };
              
              const customerData = customer.customerId || customer;
              const avatarUrl = customerData?.userId?.avatar;
              const displayName = customerData?.fullName || `Customer #${rank}`;
              const initials = displayName.split(' ').filter(Boolean).map(word => word[0]).join('').slice(0, 2).toUpperCase();

              return (
                <div 
                  key={customer._id || index} 
                  className={`ranking-card ${isTopThree ? 'top-rank' : ''}`}
                  style={isTopThree ? {
                    border: `3px solid ${rank === 1 ? '#FFD700' : rank === 2 ? '#C0C0C0' : '#CD7F32'}`,
                    background: rankColor.bg
                  } : {}}
                >
                  <div className="ranking-card-rank-badge" style={isTopThree ? { background: rankColor.bg, color: rankColor.text } : {}}>
                    #{rank}
                  </div>
                  
                  <div className="ranking-card-avatar-container">
                    <Avatar
                      src={avatarUrl}
                      alt={displayName}
                      sx={{ 
                        width: 100, 
                        height: 100, 
                        border: isTopThree ? `4px solid ${rank === 1 ? '#FFD700' : rank === 2 ? '#C0C0C0' : '#CD7F32'}` : '4px solid #12422a',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        bgcolor: '#12422a',
                        fontSize: '32px',
                        fontWeight: 700
                      }}
                    >
                      {!avatarUrl && initials}
                    </Avatar>
                    {isTopThree && (
                      <div className="ranking-medal">
                        {rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}
                      </div>
                    )}
                  </div>

                  <div className="ranking-card-content">
                    <div className="ranking-card-header-info">
                      <h3 className="ranking-card-name" style={isTopThree ? { color: rankColor.text } : {}}>
                        {displayName}
                      </h3>
                    </div>

                    {customerData?.phone && (
                      <p className="ranking-card-type" style={isTopThree ? { color: rankColor.text, opacity: 0.8 } : {}}>
                        <FaUsers style={{ marginRight: '6px', fontSize: '12px' }} />
                        {customerData.phone}
                      </p>
                    )}

                    <div className="ranking-card-metrics">
                      <div className="ranking-metric-item">
                        <div className="ranking-metric-icon" style={{ backgroundColor: '#3b82f615', color: '#3b82f6' }}>
                          <FaCrown />
                        </div>
                        <div className="ranking-metric-info">
                          <span className="ranking-metric-label">Ranking Points</span>
                          <span className="ranking-metric-value">
                            {customer.rankingPoints ? customer.rankingPoints.toLocaleString('en-US') : customer.totalRankingPoints?.toLocaleString('en-US') || 0}
                          </span>
                        </div>
                      </div>
                      <div className="ranking-metric-item">
                        <div className="ranking-metric-icon" style={{ backgroundColor: '#10b98115', color: '#10b981' }}>
                          <FaLeaf />
                        </div>
                        <div className="ranking-metric-info">
                          <span className="ranking-metric-label">Eco Points</span>
                          <span className="ranking-metric-value">
                            {customer.ecoPoints ? customer.ecoPoints.toLocaleString('en-US', { maximumFractionDigits: 1 }) : customer.totalEcoPoints?.toLocaleString('en-US', { maximumFractionDigits: 1 }) || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px', backgroundColor: 'white', borderRadius: '16px', border: '2px dashed #e5e7eb' }}>
            <Typography color="text.secondary" sx={{ fontSize: '16px' }}>No customers available</Typography>
          </Box>
        )}
      </div>
    </div>
  );
};

export default TopCustomers;


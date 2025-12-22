import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  getTopBusinessesApi
} from '../../../store/slices/adminSlice';
import { Box, CircularProgress, Typography, TextField, Select, MenuItem, FormControl, InputLabel, Grid, Rating, Avatar, Chip, FormHelperText } from '@mui/material';
import { FaStore, FaLeaf, FaRecycle } from 'react-icons/fa';
import { PATH } from '../../../routes/path';
import '../AdminDashboard.css';

const TopBusinesses = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Filter states for top businesses
  const [businessFilters, setBusinessFilters] = useState({
    top: 5,
    sortBy: '',
    order: ''
  });

  // Get data from Redux store
  const { 
    topBusinesses,
    isLoading
  } = useSelector((state) => state.admin);

  // Fetch top businesses when filters change
  useEffect(() => {
    const filters = {
      top: businessFilters.top || 5,
      ...(businessFilters.sortBy && { sortBy: businessFilters.sortBy }),
      ...(businessFilters.order && { order: businessFilters.order })
    };
    dispatch(getTopBusinessesApi(filters));
  }, [businessFilters, dispatch]);

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <FaStore className="header-icon" style={{ fontSize: '48px', color: '#164e31' }} />
            <div>
              <h1 className="dashboard-title">Top Businesses</h1>
              <p className="dashboard-subtitle">Top performing businesses ranking</p>
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
                  label="Number of Businesses"
                  type="number"
                  value={businessFilters.top}
                  onChange={(e) => setBusinessFilters({ ...businessFilters, top: parseInt(e.target.value) || 5 })}
                  variant="outlined"
                  size="small"
                  helperText="How many businesses to show"
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
                  value={businessFilters.sortBy}
                  onChange={(e) => setBusinessFilters({ ...businessFilters, sortBy: e.target.value })}
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
                  <MenuItem value="co2Reduced">CO₂ Reduced</MenuItem>
                  <MenuItem value="ecoPoints">Eco Points</MenuItem>
                  <MenuItem value="averageRating">Average Rating</MenuItem>
                </Select>
                <FormHelperText sx={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '4px' }}>
                  Sort businesses by metric
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
                  value={businessFilters.order}
                  onChange={(e) => setBusinessFilters({ ...businessFilters, order: e.target.value })}
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
        {isLoading && !topBusinesses ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
            <CircularProgress />
          </Box>
        ) : topBusinesses && topBusinesses.length > 0 ? (
          <div className="ranking-cards-grid">
            {topBusinesses.map((business, index) => {
              const rank = index + 1;
              const isTopThree = rank <= 3;
              const rankColors = {
                1: { bg: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)', text: '#000' },
                2: { bg: 'linear-gradient(135deg, #C0C0C0 0%, #A9A9A9 100%)', text: '#000' },
                3: { bg: 'linear-gradient(135deg, #CD7F32 0%, #8B4513 100%)', text: '#fff' }
              };
              const rankColor = isTopThree ? rankColors[rank] : { bg: '#ffffff', text: '#6b7280' };

              return (
                <div 
                  key={business._id || index} 
                  className={`ranking-card ${isTopThree ? 'top-rank' : ''}`}
                  style={{
                    ...(isTopThree ? {
                      border: `3px solid ${rank === 1 ? '#FFD700' : rank === 2 ? '#C0C0C0' : '#CD7F32'}`,
                      background: rankColor.bg
                    } : {}),
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => navigate(PATH.ADMIN_DASHBOARD_BUSINESS_TRANSACTIONS.replace(':businessId', business._id))}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '';
                  }}
                >
                  <div className="ranking-card-rank-badge" style={isTopThree ? { background: rankColor.bg, color: rankColor.text } : {}}>
                    #{rank}
                  </div>
                  
                  <div className="ranking-card-avatar-container">
                    <Avatar
                      src={business.businessLogoUrl}
                      alt={business.businessName}
                      sx={{ 
                        width: 100, 
                        height: 100, 
                        border: isTopThree ? `4px solid ${rank === 1 ? '#FFD700' : rank === 2 ? '#C0C0C0' : '#CD7F32'}` : '4px solid #12422a',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                      }}
                    />
                    {isTopThree && (
                      <div className="ranking-medal">
                        {rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}
                      </div>
                    )}
                  </div>

                  <div className="ranking-card-content">
                    <div className="ranking-card-header-info">
                      <h3 className="ranking-card-name" style={isTopThree ? { color: rankColor.text } : {}}>
                        {business.businessName || 'Unknown Business'}
                      </h3>
                      <Chip
                        label={business.status || 'active'}
                        color={business.status === 'active' ? 'success' : 'default'}
                        size="small"
                        sx={{ 
                          fontWeight: 600,
                          height: '24px',
                          fontSize: '11px'
                        }}
                      />
                    </div>

                    <p className="ranking-card-type" style={isTopThree ? { color: rankColor.text, opacity: 0.8 } : {}}>
                      {business.businessType || 'N/A'}
                    </p>

                    <div className="ranking-card-rating">
                      <Rating
                        value={business.averageRating || 0}
                        precision={0.1}
                        readOnly
                        size="small"
                        sx={{ 
                          '& .MuiRating-iconFilled': {
                            color: '#fbbf24'
                          }
                        }}
                      />
                      <span className="ranking-rating-text" style={isTopThree ? { color: rankColor.text } : {}}>
                        {business.averageRating ? business.averageRating.toFixed(1) : '0.0'}
                        <span style={{ opacity: 0.7, marginLeft: '4px' }}>
                          ({business.totalReviews || 0} reviews)
                        </span>
                      </span>
                    </div>

                    <div className="ranking-card-metrics">
                      <div className="ranking-metric-item">
                        <div className="ranking-metric-icon" style={{ backgroundColor: '#10b98115', color: '#10b981' }}>
                          <FaLeaf />
                        </div>
                        <div className="ranking-metric-info">
                          <span className="ranking-metric-label">Eco Points</span>
                          <span className="ranking-metric-value">
                            {business.ecoPoints ? business.ecoPoints.toLocaleString('en-US', { maximumFractionDigits: 1 }) : 0}
                          </span>
                        </div>
                      </div>
                      <div className="ranking-metric-item">
                        <div className="ranking-metric-icon" style={{ backgroundColor: '#f59e0b15', color: '#f59e0b' }}>
                          <FaRecycle />
                        </div>
                        <div className="ranking-metric-info">
                          <span className="ranking-metric-label">CO₂ Reduced</span>
                          <span className="ranking-metric-value">
                            {business.co2Reduced ? business.co2Reduced.toFixed(2) : 0} kg
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
            <Typography color="text.secondary" sx={{ fontSize: '16px' }}>No businesses available</Typography>
          </Box>
        )}
      </div>
    </div>
  );
};

export default TopBusinesses;


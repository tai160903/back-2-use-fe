import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  getBorrowTransactionsMonthlyApi
} from '../../../store/slices/adminSlice';
import { Box, CircularProgress, Typography, TextField, Select, MenuItem, FormControl, InputLabel, Grid, FormHelperText } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { FaExchangeAlt, FaCoins, FaCrown, FaLeaf, FaRecycle, FaMoneyBillWave } from 'react-icons/fa';
import '../AdminDashboard.css';

const BorrowTransactionsStatistics = () => {
  const dispatch = useDispatch();
  
  // Filter states for borrow transactions
  const [borrowFilters, setBorrowFilters] = useState({
    year: new Date().getFullYear(),
    type: '',
    status: ''
  });

  // Get data from Redux store
  const { 
    borrowTransactionsMonthly,
    isLoading
  } = useSelector((state) => state.admin);

  // Fetch borrow transactions when filters change
  useEffect(() => {
    const filters = {
      year: borrowFilters.year || new Date().getFullYear(),
      ...(borrowFilters.type && { type: borrowFilters.type }),
      ...(borrowFilters.status && { status: borrowFilters.status })
    };
    dispatch(getBorrowTransactionsMonthlyApi(filters));
  }, [borrowFilters, dispatch]);

  // Format money
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount || 0);
  };

  // Format borrow transactions monthly data for chart
  const formatBorrowTransactionsData = () => {
    if (!borrowTransactionsMonthly) {
      return [];
    }

    // Handle different response structures
    let dataArray = null;
    
    // Check if it's already an array
    if (Array.isArray(borrowTransactionsMonthly)) {
      dataArray = borrowTransactionsMonthly;
    }
    // Check if data exists and is an array
    else if (borrowTransactionsMonthly.data && Array.isArray(borrowTransactionsMonthly.data)) {
      dataArray = borrowTransactionsMonthly.data;
    }
    // Fallback: check nested data
    else if (borrowTransactionsMonthly.data?.data && Array.isArray(borrowTransactionsMonthly.data.data)) {
      dataArray = borrowTransactionsMonthly.data.data;
    }

    if (!dataArray || !Array.isArray(dataArray) || dataArray.length === 0) {
      return [];
    }

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return dataArray
      .map(item => ({
        month: monthNames[item.month - 1] || `Month ${item.month}`,
        count: item.count || 0,
        monthNumber: item.month
      }))
      .sort((a, b) => a.monthNumber - b.monthNumber);
  };

  const borrowTransactionsChartData = formatBorrowTransactionsData();

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <FaExchangeAlt className="header-icon" style={{ fontSize: '48px', color: '#164e31' }} />
            <div>
              <h1 className="dashboard-title">Borrow Transactions Statistics</h1>
              <p className="dashboard-subtitle">Monthly transaction analysis</p>
            </div>
          </div>
        </div>
      </div>

      <div className="borrow-transactions-section" style={{ padding: '24px' }}>
        {/* Filters Section */}
        <div className="borrow-filters-section">
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: '#12422a', fontSize: '18px', letterSpacing: '0.5px' }}>
            Filters
          </Typography>
          <Grid container spacing={2} alignItems="flex-start">
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <TextField
                  label="Year"
                  type="number"
                  value={borrowFilters.year}
                  onChange={(e) => setBorrowFilters({ ...borrowFilters, year: parseInt(e.target.value) || new Date().getFullYear() })}
                  variant="outlined"
                  size="small"
                  helperText="Select year to filter"
                  inputProps={{ min: 2000, max: 2100 }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'white',
                      borderRadius: '10px',
                      transition: 'all 0.3s ease',
                      '&:hover fieldset': {
                        borderColor: '#10b981',
                        borderWidth: '2px',
                        boxShadow: '0 2px 8px rgba(16, 185, 129, 0.15)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#10b981',
                        borderWidth: '2px',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      fontWeight: 600,
                      color: '#4b5563',
                      '&.Mui-focused': {
                        color: '#10b981',
                        fontWeight: 700,
                      },
                    },
                    '& .MuiFormHelperText-root': {
                      color: '#6b7280',
                      fontSize: '0.75rem',
                      marginTop: '4px',
                    },
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small" variant="outlined">
                <InputLabel 
                  id="borrow-type-filter-label"
                  sx={{
                    backgroundColor: 'white',
                    px: 0.5,
                  }}
                >
                  Type
                </InputLabel>
                <Select
                  labelId="borrow-type-filter-label"
                  value={borrowFilters.type}
                  onChange={(e) => setBorrowFilters({ ...borrowFilters, type: e.target.value })}
                  label="Type"
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
                      borderColor: '#10b981',
                      borderWidth: '2px',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#10b981',
                      borderWidth: '2px',
                    },
                    '& .MuiSelect-select': {
                      py: 1.25,
                      fontWeight: 500,
                    },
                  }}
                >
                  <MenuItem value="">All Types</MenuItem>
                  <MenuItem value="borrow">Borrow</MenuItem>
                  <MenuItem value="return_success">Return Success</MenuItem>
                  <MenuItem value="return_failed">Return Failed</MenuItem>
                </Select>
                <FormHelperText sx={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '4px' }}>
                  Filter by transaction type
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small" variant="outlined">
                <InputLabel 
                  id="borrow-status-filter-label"
                  sx={{
                    backgroundColor: 'white',
                    px: 0.5,
                  }}
                >
                  Status
                </InputLabel>
                <Select
                  labelId="borrow-status-filter-label"
                  value={borrowFilters.status}
                  onChange={(e) => setBorrowFilters({ ...borrowFilters, status: e.target.value })}
                  label="Status"
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
                      borderColor: '#10b981',
                      borderWidth: '2px',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#10b981',
                      borderWidth: '2px',
                    },
                    '& .MuiSelect-select': {
                      py: 1.25,
                      fontWeight: 500,
                    },
                  }}
                >
                  <MenuItem value="">All Statuses</MenuItem>
                  <MenuItem value="pending_pickup">Pending Pickup</MenuItem>
                  <MenuItem value="borrowing">Borrowing</MenuItem>
                  <MenuItem value="returned">Returned</MenuItem>
                  <MenuItem value="return_late">Return Late</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                  <MenuItem value="lost">Lost</MenuItem>
                </Select>
                <FormHelperText sx={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '4px' }}>
                  Filter by transaction status
                </FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
        </div>

        <div className="borrow-transactions-content">
          {/* Chart Card */}
          <div className="borrow-chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Monthly Transaction Count</h3>
              <p className="chart-subtitle">Number of borrow transactions per month</p>
            </div>
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '350px' }}>
                <CircularProgress size={40} />
              </Box>
            ) : borrowTransactionsChartData && borrowTransactionsChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={borrowTransactionsChartData}>
                  <defs>
                    <linearGradient id="colorBorrowTransactions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#6b7280"
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    label={{ value: 'Number of Transactions', angle: -90, position: 'insideLeft', style: { fill: '#6b7280' } }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                    formatter={(value) => [value, 'Transactions']}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="url(#colorBorrowTransactions)" 
                    radius={[8, 8, 0, 0]}
                    name="Transactions"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '350px' }}>
                <Typography color="text.secondary">No data available</Typography>
              </Box>
            )}
          </div>

          {/* Totals Cards */}
          {borrowTransactionsMonthly?.totals && (
            <div className="borrow-totals-grid">
              {/* Reward Points Card */}
              <div className="borrow-total-card">
                <div className="total-card-icon" style={{ backgroundColor: '#3b82f615', color: '#3b82f6' }}>
                  <FaCoins />
                </div>
                <div className="total-card-content">
                  <h4 className="total-card-label">Total Reward Points</h4>
                  <p className="total-card-value">
                    {borrowTransactionsMonthly.totals.totalRewardPoints?.toLocaleString() || 0}
                  </p>
                </div>
              </div>

              {/* Ranking Points Card */}
              <div className="borrow-total-card">
                <div className="total-card-icon" style={{ backgroundColor: '#8b5cf615', color: '#8b5cf6' }}>
                  <FaCrown />
                </div>
                <div className="total-card-content">
                  <h4 className="total-card-label">Total Ranking Points</h4>
                  <p className="total-card-value">
                    {borrowTransactionsMonthly.totals.totalRankingPoints?.toLocaleString() || 0}
                  </p>
                </div>
              </div>

              {/* Eco Points Card */}
              <div className="borrow-total-card">
                <div className="total-card-icon" style={{ backgroundColor: '#10b98115', color: '#10b981' }}>
                  <FaLeaf />
                </div>
                <div className="total-card-content">
                  <h4 className="total-card-label">Total Eco Points</h4>
                  <p className="total-card-value">
                    {borrowTransactionsMonthly.totals.totalEcoPoints?.toLocaleString('en-US', { maximumFractionDigits: 1 }) || 0}
                  </p>
                </div>
              </div>

              {/* CO2 Reduced Card */}
              <div className="borrow-total-card">
                <div className="total-card-icon" style={{ backgroundColor: '#f59e0b15', color: '#f59e0b' }}>
                  <FaRecycle />
                </div>
                <div className="total-card-content">
                  <h4 className="total-card-label">Total CO₂ Reduced</h4>
                  <p className="total-card-value">
                    {borrowTransactionsMonthly.totals.totalCo2Reduced?.toFixed(2) || 0} kg
                  </p>
                </div>
              </div>

              {/* Deposit Amount Card */}
              <div className="borrow-total-card">
                <div className="total-card-icon" style={{ backgroundColor: '#12422a15', color: '#12422a' }}>
                  <FaMoneyBillWave />
                </div>
                <div className="total-card-content">
                  <h4 className="total-card-label">Total Deposit Amount</h4>
                  <p className="total-card-value">
                    {formatMoney(borrowTransactionsMonthly.totals.totalDepositAmount || 0)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BorrowTransactionsStatistics;


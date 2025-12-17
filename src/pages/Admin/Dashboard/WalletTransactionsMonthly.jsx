import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  getWalletTransactionsByMonthApi
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
import { FaWallet } from 'react-icons/fa';
import '../AdminDashboard.css';

const WalletTransactionsMonthly = () => {
  const dispatch = useDispatch();
  
  // Filter states for wallet transactions monthly
  const [walletTransactionsFilters, setWalletTransactionsFilters] = useState({
    year: new Date().getFullYear(),
    transactionType: '',
    direction: '',
    status: ''
  });

  // Get data from Redux store
  const { 
    walletTransactionsByMonth,
    isLoading
  } = useSelector((state) => state.admin);

  // Fetch wallet transactions monthly when filters change
  useEffect(() => {
    const filters = {
      year: walletTransactionsFilters.year || new Date().getFullYear(),
      ...(walletTransactionsFilters.transactionType && { transactionType: walletTransactionsFilters.transactionType }),
      ...(walletTransactionsFilters.direction && { direction: walletTransactionsFilters.direction }),
      ...(walletTransactionsFilters.status && { status: walletTransactionsFilters.status })
    };
    dispatch(getWalletTransactionsByMonthApi(filters));
  }, [walletTransactionsFilters, dispatch]);

  // Format wallet transactions monthly data for chart
  const formatWalletTransactionsMonthlyData = () => {
    if (!walletTransactionsByMonth) {
      return [];
    }

    // Handle different response structures
    let dataArray = null;
    
    // Check if it's already an array
    if (Array.isArray(walletTransactionsByMonth)) {
      dataArray = walletTransactionsByMonth;
    }
    // Check if data exists and is an array
    else if (walletTransactionsByMonth.data && Array.isArray(walletTransactionsByMonth.data)) {
      dataArray = walletTransactionsByMonth.data;
    }
    // Fallback: check nested data
    else if (walletTransactionsByMonth.data?.data && Array.isArray(walletTransactionsByMonth.data.data)) {
      dataArray = walletTransactionsByMonth.data.data;
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

  const walletTransactionsMonthlyChartData = formatWalletTransactionsMonthlyData();

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <FaWallet className="header-icon" style={{ fontSize: '48px', color: '#164e31' }} />
            <div>
              <h1 className="dashboard-title">Wallet Transactions Monthly Statistics</h1>
              <p className="dashboard-subtitle">Monthly wallet transaction analysis</p>
            </div>
          </div>
        </div>
      </div>

      <div className="wallet-transactions-monthly-section" style={{ padding: '24px' }}>
        {/* Filters Section */}
        <div className="wallet-transactions-filters-section">
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: '#12422a', fontSize: '18px', letterSpacing: '0.5px' }}>
            Filters
          </Typography>
          <Grid container spacing={2} alignItems="flex-start">
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <TextField
                  label="Year"
                  type="number"
                  value={walletTransactionsFilters.year}
                  onChange={(e) => setWalletTransactionsFilters({ ...walletTransactionsFilters, year: parseInt(e.target.value) || new Date().getFullYear() })}
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
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth size="small" variant="outlined">
                <InputLabel 
                  id="wallet-transaction-type-filter-label"
                  sx={{
                    backgroundColor: 'white',
                    px: 0.5,
                  }}
                >
                  Type
                </InputLabel>
                <Select
                  labelId="wallet-transaction-type-filter-label"
                  value={walletTransactionsFilters.transactionType}
                  onChange={(e) => setWalletTransactionsFilters({ ...walletTransactionsFilters, transactionType: e.target.value })}
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
                  <MenuItem value="top_up">Top Up</MenuItem>
                  <MenuItem value="withdrawal">Withdrawal</MenuItem>
                  <MenuItem value="borrow_deposit">Borrow Deposit</MenuItem>
                  <MenuItem value="return_refund">Return Refund</MenuItem>
                  <MenuItem value="subscription_fee">Subscription Fee</MenuItem>
                  <MenuItem value="penalty">Penalty</MenuItem>
                  <MenuItem value="deposit_forfeited">Deposit Forfeited</MenuItem>
                </Select>
                <FormHelperText sx={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '4px' }}>
                  Filter by transaction type
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth size="small" variant="outlined">
                <InputLabel 
                  id="wallet-direction-filter-label"
                  sx={{
                    backgroundColor: 'white',
                    px: 0.5,
                  }}
                >
                  Direction
                </InputLabel>
                <Select
                  labelId="wallet-direction-filter-label"
                  value={walletTransactionsFilters.direction}
                  onChange={(e) => setWalletTransactionsFilters({ ...walletTransactionsFilters, direction: e.target.value })}
                  label="Direction"
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
                  <MenuItem value="">All Directions</MenuItem>
                  <MenuItem value="in">In</MenuItem>
                  <MenuItem value="out">Out</MenuItem>
                </Select>
                <FormHelperText sx={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '4px' }}>
                  Filter by money flow direction
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth size="small" variant="outlined">
                <InputLabel 
                  id="wallet-status-filter-label"
                  sx={{
                    backgroundColor: 'white',
                    px: 0.5,
                  }}
                >
                  Status
                </InputLabel>
                <Select
                  labelId="wallet-status-filter-label"
                  value={walletTransactionsFilters.status}
                  onChange={(e) => setWalletTransactionsFilters({ ...walletTransactionsFilters, status: e.target.value })}
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
                  <MenuItem value="processing">Processing</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="failed">Failed</MenuItem>
                  <MenuItem value="expired">Expired</MenuItem>
                </Select>
                <FormHelperText sx={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '4px' }}>
                  Filter by transaction status
                </FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
        </div>

        <div className="wallet-transactions-monthly-content">
          {/* Chart Card */}
          <div className="wallet-transactions-monthly-chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Monthly Wallet Transactions Count</h3>
              <p className="chart-subtitle">Number of wallet transactions per month</p>
            </div>
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '350px' }}>
                <CircularProgress size={40} />
              </Box>
            ) : walletTransactionsMonthlyChartData && walletTransactionsMonthlyChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={walletTransactionsMonthlyChartData}>
                  <defs>
                    <linearGradient id="colorWalletTransactions" x1="0" y1="0" x2="0" y2="1">
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
                    fill="url(#colorWalletTransactions)" 
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
        </div>
      </div>
    </div>
  );
};

export default WalletTransactionsMonthly;


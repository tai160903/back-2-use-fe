import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  getBusinessMonthlyApi
} from '../../../store/slices/adminSlice';
import { Box, CircularProgress, Typography, TextField, FormControl, Grid } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { FaStore } from 'react-icons/fa';
import '../AdminDashboard.css';

const BusinessMonthlyStatistics = () => {
  const dispatch = useDispatch();
  
  // Filter state for business monthly
  const [businessMonthlyYear, setBusinessMonthlyYear] = useState(new Date().getFullYear());

  // Get data from Redux store
  const { 
    businessMonthly,
    isLoading
  } = useSelector((state) => state.admin);

  // Fetch business monthly when year changes
  useEffect(() => {
    dispatch(getBusinessMonthlyApi({ year: businessMonthlyYear }));
  }, [businessMonthlyYear, dispatch]);

  // Format business monthly data for chart
  const formatBusinessMonthlyData = () => {
    if (!businessMonthly) {
      return [];
    }

    // Handle different response structures
    let dataArray = null;
    
    // Check if it's already an array
    if (Array.isArray(businessMonthly)) {
      dataArray = businessMonthly;
    }
    // Check if data exists and is an array
    else if (businessMonthly.data && Array.isArray(businessMonthly.data)) {
      dataArray = businessMonthly.data;
    }
    // Fallback: check nested data
    else if (businessMonthly.data?.data && Array.isArray(businessMonthly.data.data)) {
      dataArray = businessMonthly.data.data;
    }

    if (!dataArray || !Array.isArray(dataArray) || dataArray.length === 0) {
      return [];
    }

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return dataArray.map(item => ({
      month: monthNames[item.month - 1] || `Month ${item.month}`,
      count: item.count || 0,
      monthNumber: item.month
    })).sort((a, b) => a.monthNumber - b.monthNumber);
  };

  const businessMonthlyChartData = formatBusinessMonthlyData();

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <FaStore className="header-icon" style={{ fontSize: '48px', color: '#164e31' }} />
            <div>
              <h1 className="dashboard-title">Business Monthly Statistics</h1>
              <p className="dashboard-subtitle">Monthly business registration trends</p>
            </div>
          </div>
        </div>
      </div>

      <div className="business-monthly-section" style={{ padding: '24px' }}>
        {/* Year Filter Section */}
        <div className="business-monthly-filter-section">
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: '#12422a', fontSize: '18px', letterSpacing: '0.5px' }}>
            Filter
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <TextField
                  label="Year to Filter"
                  type="number"
                  value={businessMonthlyYear}
                  onChange={(e) => setBusinessMonthlyYear(parseInt(e.target.value) || new Date().getFullYear())}
                  variant="outlined"
                  size="small"
                  helperText="Filter by year"
                  inputProps={{ min: 2000, max: 2100 }}
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
                    '& .MuiFormHelperText-root': {
                      color: '#6b7280',
                      fontSize: '0.75rem',
                      marginTop: '4px',
                    },
                  }}
                />
              </FormControl>
            </Grid>
          </Grid>
        </div>

        <div className="business-monthly-content">
          {/* Chart Card */}
          <div className="business-monthly-chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Monthly Business Registration Count</h3>
              <p className="chart-subtitle">Number of businesses registered per month</p>
            </div>
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '350px' }}>
                <CircularProgress size={40} />
              </Box>
            ) : businessMonthlyChartData && businessMonthlyChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={businessMonthlyChartData}>
                  <defs>
                    <linearGradient id="colorBusinessMonthly" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#12422a" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#12422a" stopOpacity={0.2}/>
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
                    label={{ value: 'Number of Businesses', angle: -90, position: 'insideLeft', style: { fill: '#6b7280' } }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                    formatter={(value) => [value, 'Businesses']}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="url(#colorBusinessMonthly)" 
                    radius={[8, 8, 0, 0]}
                    name="Businesses"
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

export default BusinessMonthlyStatistics;


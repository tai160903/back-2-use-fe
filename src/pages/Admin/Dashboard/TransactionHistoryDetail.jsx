import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  getBusinessTransactionsApi,
  getCustomerTransactionsApi
} from '../../../store/slices/adminSlice';
import { 
  Box, 
  CircularProgress, 
  Typography, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  Pagination,
  IconButton,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  FormHelperText
} from '@mui/material';
import { 
  FaArrowLeft, 
  FaStore, 
  FaUsers,
  FaBox,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaLeaf,
  FaCloud
} from 'react-icons/fa';
import '../AdminDashboard.css';

const TransactionHistoryDetail = ({ type = 'business' }) => {
  const { businessId, customerId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  
  // Filter states
  const [status, setStatus] = useState('');
  const [borrowTransactionType, setBorrowTransactionType] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const { 
    businessTransactions,
    customerTransactions,
    transactionHistoryLoading,
    transactionHistoryPagination
  } = useSelector((state) => state.admin);

  const transactions = type === 'business' ? businessTransactions : customerTransactions;
  const id = type === 'business' ? businessId : customerId;

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [status, borrowTransactionType, fromDate, toDate]);

  useEffect(() => {
    if (id) {
      const filters = {
        page: currentPage,
        limit,
        ...(status && { status }),
        ...(borrowTransactionType && { borrowTransactionType }),
        ...(fromDate && { fromDate }),
        ...(toDate && { toDate })
      };
      
      if (type === 'business') {
        dispatch(getBusinessTransactionsApi({ businessId: id, ...filters }));
      } else {
        dispatch(getCustomerTransactionsApi({ customerId: id, ...filters }));
      }
    }
  }, [id, currentPage, limit, dispatch, type, status, borrowTransactionType, fromDate, toDate]);

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount || 0);
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      'returned': { label: 'Returned', color: 'success' },
      'borrowing': { label: 'Borrowing', color: 'warning' },
      'lost': { label: 'Lost', color: 'error' },
      'pending_pickup': { label: 'Pending Pickup', color: 'info' },
      'return_late': { label: 'Late Return', color: 'error' }
    };
    
    const config = statusConfig[status] || { label: status, color: 'default' };
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  const getTransactionTypeChip = (type) => {
    const typeConfig = {
      'return_success': { label: 'Return Success', color: 'success' },
      'return_failed': { label: 'Return Failed', color: 'error' },
      'borrow': { label: 'Borrow', color: 'info' }
    };
    
    const config = typeConfig[type] || { label: type, color: 'default' };
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  // Get header info
  const getHeaderInfo = () => {
    if (transactions.length === 0) return null;
    const firstTransaction = transactions[0];
    
    if (type === 'business') {
      // For business transactions, businessId might be a string or object
      const business = typeof firstTransaction.businessId === 'object' 
        ? firstTransaction.businessId 
        : null;
      // If businessId is a string, we need to get business info from the first transaction
      // In this case, we'll show a generic header or try to get from transaction data
      if (!business && firstTransaction.businessId) {
        // businessId is just a string ID, we can't get details from it
        return {
          title: 'Business Transactions',
          subtitle: `Business ID: ${firstTransaction.businessId}`,
          logo: null,
          icon: <FaStore />
        };
      }
      return {
        title: business?.businessName || 'Business',
        subtitle: business?.businessAddress || '',
        logo: business?.businessLogoUrl,
        icon: <FaStore />
      };
    } else {
      const customer = firstTransaction.customerId;
      return {
        title: customer?.fullName || 'Customer',
        subtitle: customer?.phone || customer?.userId?.email || '',
        logo: customer?.userId?.avatar,
        icon: <FaUsers />
      };
    }
  };

  const headerInfo = getHeaderInfo();

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <IconButton 
              onClick={() => navigate(-1)}
              sx={{ 
                mr: 2, 
                color: '#12422a',
                '&:hover': { backgroundColor: 'rgba(18, 66, 42, 0.1)' }
              }}
            >
              <FaArrowLeft />
            </IconButton>
            {headerInfo && (
              <>
                {headerInfo.logo ? (
                  <Avatar 
                    src={headerInfo.logo} 
                    alt={headerInfo.title}
                    sx={{ width: 56, height: 56, mr: 2 }}
                  />
                ) : (
                  <Box sx={{ 
                    width: 56, 
                    height: 56, 
                    borderRadius: '50%', 
                    bgcolor: '#12422a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                    color: 'white',
                    fontSize: '24px'
                  }}>
                    {headerInfo.icon}
                  </Box>
                )}
                <div>
                  <h1 className="dashboard-title">
                    Transaction History - {headerInfo.title}
                  </h1>
                  <p className="dashboard-subtitle">{headerInfo.subtitle}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Summary Cards - Full Width */}
      {!transactionHistoryLoading && transactions.length > 0 && (
        <Box sx={{ px: 0, py: 4, mb: 2 }}>
          <Grid container spacing={3} sx={{ px: 3 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card 
                  sx={{ 
                    bgcolor: '#f0f9ff', 
                    border: '2px solid #0284c7',
                    borderRadius: '16px',
                    boxShadow: '0 4px 12px rgba(2, 132, 199, 0.15)',
                    transition: 'all 0.3s ease',
                    height: '100%',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 20px rgba(2, 132, 199, 0.25)',
                    }
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Box 
                        sx={{ 
                          width: 56, 
                          height: 56, 
                          borderRadius: '12px',
                          bgcolor: '#0284c7',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2.5,
                          boxShadow: '0 2px 8px rgba(2, 132, 199, 0.3)'
                        }}
                      >
                        <FaBox style={{ color: 'white', fontSize: '28px' }} />
                      </Box>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: '#64748b',
                          fontWeight: 600,
                          fontSize: '15px'
                        }}
                      >
                        Total Transactions
                      </Typography>
                    </Box>
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        fontWeight: 800, 
                        color: '#0284c7',
                        fontSize: '42px',
                        lineHeight: 1.2
                      }}
                    >
                      {transactionHistoryPagination.total}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card 
                  sx={{ 
                    bgcolor: '#f0fdf4', 
                    border: '2px solid #16a34a',
                    borderRadius: '16px',
                    boxShadow: '0 4px 12px rgba(22, 163, 74, 0.15)',
                    transition: 'all 0.3s ease',
                    height: '100%',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 20px rgba(22, 163, 74, 0.25)',
                    }
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Box 
                        sx={{ 
                          width: 56, 
                          height: 56, 
                          borderRadius: '12px',
                          bgcolor: '#16a34a',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2.5,
                          boxShadow: '0 2px 8px rgba(22, 163, 74, 0.3)'
                        }}
                      >
                        <FaCheckCircle style={{ color: 'white', fontSize: '28px' }} />
                      </Box>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: '#64748b',
                          fontWeight: 600,
                          fontSize: '15px'
                        }}
                      >
                        Returned
                      </Typography>
                    </Box>
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        fontWeight: 800, 
                        color: '#16a34a',
                        fontSize: '42px',
                        lineHeight: 1.2
                      }}
                    >
                      {transactions.filter(t => t.status === 'returned').length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card 
                  sx={{ 
                    bgcolor: '#fffbeb', 
                    border: '2px solid #d97706',
                    borderRadius: '16px',
                    boxShadow: '0 4px 12px rgba(217, 119, 6, 0.15)',
                    transition: 'all 0.3s ease',
                    height: '100%',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 20px rgba(217, 119, 6, 0.25)',
                    }
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Box 
                        sx={{ 
                          width: 56, 
                          height: 56, 
                          borderRadius: '12px',
                          bgcolor: '#d97706',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2.5,
                          boxShadow: '0 2px 8px rgba(217, 119, 6, 0.3)'
                        }}
                      >
                        <FaClock style={{ color: 'white', fontSize: '28px' }} />
                      </Box>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: '#64748b',
                          fontWeight: 600,
                          fontSize: '15px'
                        }}
                      >
                        Borrowing
                      </Typography>
                    </Box>
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        fontWeight: 800, 
                        color: '#d97706',
                        fontSize: '42px',
                        lineHeight: 1.2
                      }}
                    >
                      {transactions.filter(t => t.status === 'borrowing').length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card 
                  sx={{ 
                    bgcolor: '#fef2f2', 
                    border: '2px solid #dc2626',
                    borderRadius: '16px',
                    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.15)',
                    transition: 'all 0.3s ease',
                    height: '100%',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 20px rgba(220, 38, 38, 0.25)',
                    }
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Box 
                        sx={{ 
                          width: 56, 
                          height: 56, 
                          borderRadius: '12px',
                          bgcolor: '#dc2626',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2.5,
                          boxShadow: '0 2px 8px rgba(220, 38, 38, 0.3)'
                        }}
                      >
                        <FaTimesCircle style={{ color: 'white', fontSize: '28px' }} />
                      </Box>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: '#64748b',
                          fontWeight: 600,
                          fontSize: '15px'
                        }}
                      >
                        Lost/Failed
                      </Typography>
                    </Box>
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        fontWeight: 800, 
                        color: '#dc2626',
                        fontSize: '42px',
                        lineHeight: 1.2
                      }}
                    >
                      {transactions.filter(t => t.status === 'lost' || t.borrowTransactionType === 'return_failed').length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
          </Grid>
        </Box>
      )}

      <Box sx={{ padding: '24px' }}>
        {transactionHistoryLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <CircularProgress />
          </Box>
        ) : transactions.length === 0 ? (
          <Card sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No transactions found
            </Typography>
          </Card>
        ) : (
          <>
            {/* Filters Section */}
            <Card sx={{ mb: 3, p: 3, borderRadius: '12px' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: '#12422a', fontSize: '18px', letterSpacing: '0.5px' }}>
                Filters
              </Typography>
              <Grid container spacing={2}>
                {/* Status filter */}
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <FormControl fullWidth size="small" variant="outlined" sx={{ mb: '20px' }}>
                      <InputLabel 
                        sx={{
                          backgroundColor: 'white',
                          px: 0.5,
                        }}
                      >
                        Filter by transaction status
                      </InputLabel>
                      <Select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        label="Filter by transaction status"
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
                        <MenuItem value="pending_pickup">Pending Pickup</MenuItem>
                        <MenuItem value="borrowing">Borrowing</MenuItem>
                        <MenuItem value="returned">Returned</MenuItem>
                        <MenuItem value="return_late">Late Return</MenuItem>
                        <MenuItem value="rejected">Rejected</MenuItem>
                        <MenuItem value="lost">Lost</MenuItem>
                        <MenuItem value="cancelled">Cancelled</MenuItem>
                      </Select>
                    </FormControl>
                    <FormHelperText sx={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '-16px', marginBottom: 0 }}>
                      Filter transactions by status
                    </FormHelperText>
                  </Box>
                </Grid>
                {/* Transaction Type filter */}
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <FormControl fullWidth size="small" variant="outlined" sx={{ mb: '20px' }}>
                      <InputLabel 
                        sx={{
                          backgroundColor: 'white',
                          px: 0.5,
                        }}
                      >
                        Borrow transaction type
                      </InputLabel>
                      <Select
                        value={borrowTransactionType}
                        onChange={(e) => setBorrowTransactionType(e.target.value)}
                        label="Borrow transaction type"
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
                        <MenuItem value="borrow">Borrow</MenuItem>
                        <MenuItem value="return_success">Return Success</MenuItem>
                        <MenuItem value="return_failed">Return Failed</MenuItem>
                      </Select>
                    </FormControl>
                    <FormHelperText sx={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '-16px', marginBottom: 0 }}>
                      Filter by transaction type
                    </FormHelperText>
                  </Box>
                </Grid>
                {/* From Date filter */}
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                    <TextField
                      label="From Date"
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      size="small"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{
                        backgroundColor: 'white',
                        borderRadius: '10px',
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '10px',
                          '&:hover fieldset': {
                            borderColor: '#12422a',
                            borderWidth: '2px',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#12422a',
                            borderWidth: '2px',
                          },
                        },
                      }}
                    />
                    <Box sx={{ height: '20px' }} /> {/* Spacer to match helper text height */}
                  </Box>
                </Grid>
                {/* To Date filter */}
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                    <TextField
                      label="To Date"
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      size="small"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{
                        backgroundColor: 'white',
                        borderRadius: '10px',
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '10px',
                          '&:hover fieldset': {
                            borderColor: '#12422a',
                            borderWidth: '2px',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#12422a',
                            borderWidth: '2px',
                          },
                        },
                      }}
                    />
                    <Box sx={{ height: '20px' }} /> {/* Spacer to match helper text height */}
                  </Box>
                </Grid>
              </Grid>
            </Card>

            {/* Transactions Table */}
            <TableContainer component={Paper} sx={{ borderRadius: '12px', overflow: 'hidden', mt: 3 }}>
              <Table>
                <TableHead sx={{ bgcolor: '#12422a' }}>
                  <TableRow>
                    <TableCell sx={{ color: 'white', fontWeight: 700 }}>Product</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 700 }}>Transaction Type</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 700 }}>Status</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 700 }}>Borrow Date</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 700 }}>Due Date</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 700 }}>Return Date</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 700 }}>Deposit</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 700 }}>Reward Points</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 700 }}>CO₂</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.map((transaction) => {
                    const product = transaction.productId || {};
                    const productGroup = product.productGroupId || {};
                    const size = product.productSizeId || {};
                    // Handle both string and object businessId
                    const business = typeof transaction.businessId === 'object' 
                      ? transaction.businessId 
                      : null;
                    const customer = transaction.customerId || {};

                    return (
                      <TableRow 
                        key={transaction._id}
                        sx={{ 
                          '&:hover': { bgcolor: '#f9fafb' },
                          '&:nth-of-type(even)': { bgcolor: '#fafafa' }
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {productGroup.imageUrl && (
                              <Avatar 
                                src={productGroup.imageUrl} 
                                alt={productGroup.name}
                                sx={{ width: 40, height: 40, mr: 1 }}
                              />
                            )}
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {productGroup.name || 'N/A'}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {size.sizeName || 'N/A'}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          {getTransactionTypeChip(transaction.borrowTransactionType)}
                        </TableCell>
                        <TableCell>
                          {getStatusChip(transaction.status)}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <FaCalendarAlt style={{ marginRight: '4px', fontSize: '12px', color: '#6b7280' }} />
                            <Typography variant="body2">
                              {formatDate(transaction.borrowDate)}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {formatDate(transaction.dueDate)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {transaction.returnDate ? formatDate(transaction.returnDate) : '-'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <FaMoneyBillWave style={{ marginRight: '4px', fontSize: '12px', color: '#10b981' }} />
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#10b981' }}>
                              {formatCurrency(transaction.depositAmount)}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <FaLeaf style={{ marginRight: '2px', fontSize: '10px', color: '#10b981' }} />
                              <Typography variant="body2" sx={{ color: '#10b981' }}>
                                {transaction.ecoPointChanged || 0}
                              </Typography>
                            </Box>
                            {transaction.rewardPointChanged > 0 && (
                              <Chip 
                                label={`+${transaction.rewardPointChanged}`}
                                size="small"
                                sx={{ 
                                  height: '20px',
                                  fontSize: '10px',
                                  bgcolor: '#fbbf24',
                                  color: 'white'
                                }}
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <FaCloud style={{ marginRight: '4px', fontSize: '12px', color: '#3b82f6' }} />
                            <Typography variant="body2" sx={{ color: transaction.co2Changed >= 0 ? '#10b981' : '#ef4444' }}>
                              {transaction.co2Changed >= 0 ? '+' : ''}{transaction.co2Changed?.toFixed(2) || 0} kg
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            {transactionHistoryPagination.totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Pagination
                  count={transactionHistoryPagination.totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: '#12422a',
                      '&.Mui-selected': {
                        bgcolor: '#12422a',
                        color: 'white',
                        '&:hover': {
                          bgcolor: '#164e31'
                        }
                      }
                    }
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Box>
    </div>
  );
};

export default TransactionHistoryDetail;

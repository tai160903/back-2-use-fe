import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  getBusinessTransactionDetailApi,
  getCustomerTransactionDetailApi
} from '../../../store/slices/borrowSlice';
import { getDetailSingleUseApi } from '../../../store/slices/singleUseSlice';
import { 
  Box, 
  CircularProgress, 
  Typography, 
  Paper,
  Chip,
  Avatar,
  IconButton,
  Card,
  CardContent,
  Grid,
  Divider,
  Button,
  Pagination,
} from '@mui/material';
import { 
  FaArrowLeft, 
  FaStore, 
  FaUser,
  FaBox,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaLeaf,
  FaCoins,
  FaQrcode,
  FaImage,
  FaExclamationTriangle,
  FaCheckDouble,
  FaBan
} from 'react-icons/fa';
import { PATH } from '../../../routes/path';

const BorrowTransactionDetail = ({ type = 'business' }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const { borrowDetail, isDetailLoading, error } = useSelector((state) => state.borrow);
  const {
    singleUseDetail = [],
    isLoading: isLoadingSingleUseDetail,
  } = useSelector((state) => state.singleUse);

  const SINGLE_USE_PAGE_SIZE = 3;
  const [singleUsePage, setSingleUsePage] = useState(1);

  useEffect(() => {
    if (id) {
      if (type === 'business') {
        dispatch(getBusinessTransactionDetailApi(id));
      } else {
        dispatch(getCustomerTransactionDetailApi(id));
      }
      dispatch(getDetailSingleUseApi({ borrowTransactionId: id }));
    }
  }, [id, dispatch, type]);

  useEffect(() => {
    setSingleUsePage(1);
  }, [singleUseDetail]);

  const handleBack = () => {
    const fromPath = location.state?.from;

    // Nếu có state.from, ưu tiên quay lại đúng trang gốc
    if (fromPath) return navigate(fromPath);

    if (type === 'business') {
      // Fallback theo context URL
      if (location.pathname.startsWith('/staff')) return navigate(PATH.STAFF_TRANSACTION);
      return navigate(PATH.BUSINESS_CO2_REPORT);
    }

    // customer
    navigate(PATH.CUSTOMER_CO2_REPORT);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateShort = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('en-US');
  };

  const getStatusChip = (status) => {
    const statusMap = {
      'pending_pickup': { label: 'Pending Pickup', color: '#ff9800', bg: '#fff3e0' },
      'borrowing': { label: 'Borrowing', color: '#2196f3', bg: '#e3f2fd' },
      'returned': { label: 'Returned', color: '#4caf50', bg: '#e8f5e9' },
      'return_late': { label: 'Return Late', color: '#f44336', bg: '#ffebee' },
      'rejected': { label: 'Rejected', color: '#9e9e9e', bg: '#f5f5f5' },
      'lost': { label: 'Lost', color: '#9c27b0', bg: '#f3e5f5' },
      'canceled': { label: 'Canceled', color: '#607d8b', bg: '#eceff1' }
    };
    const statusInfo = statusMap[status] || { label: status, color: '#757575', bg: '#f5f5f5' };
    return (
      <Chip
        label={statusInfo.label}
        sx={{
          backgroundColor: statusInfo.bg,
          color: statusInfo.color,
          fontWeight: 600,
          fontSize: '0.75rem'
        }}
      />
    );
  };

  const getTransactionTypeChip = (type) => {
    const typeMap = {
      'borrow': { 
        label: 'Borrow', 
        color: '#0b5529', 
        bg: '#f0f7f3',
        icon: null
      },
      'return_success': { 
        label: 'Return Success', 
        color: '#2e7d32', 
        bg: '#e8f5e9',
        icon: <FaCheckDouble style={{ fontSize: '0.75rem', marginRight: '4px' }} />
      },
      'return_failed': { 
        label: 'Return Failed', 
        color: '#c62828', 
        bg: '#ffebee',
        icon: <FaExclamationTriangle style={{ fontSize: '0.75rem', marginRight: '4px' }} />
      }
    };
    const typeInfo = typeMap[type] || { label: type, color: '#757575', bg: '#f5f5f5', icon: null };
    return (
      <Chip
        icon={typeInfo.icon}
        label={typeInfo.label}
        sx={{
          backgroundColor: typeInfo.bg,
          color: typeInfo.color,
          fontWeight: 600,
          fontSize: '0.75rem',
          border: `1.5px solid ${typeInfo.color}`,
          height: '28px',
          '& .MuiChip-icon': {
            color: typeInfo.color,
            marginLeft: '8px'
          }
        }}
      />
    );
  };

  if (isDetailLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress sx={{ color: '#0b5529' }} />
      </Box>
    );
  }

  if (error || !borrowDetail) {
    return (
      <Box sx={{ p: 3 }}>
        <Button
          startIcon={<FaArrowLeft />}
          onClick={handleBack}
          sx={{ mb: 2, color: '#0b5529' }}
        >
          Back to CO₂ Report
        </Button>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="error">
            {error?.message || 'Transaction not found'}
          </Typography>
        </Paper>
      </Box>
    );
  }

  const detail = borrowDetail;
  const customer = detail.customerId || {};
  const business = detail.businessId || {};
  const product = detail.productId || {};
  const productGroup = product.productGroupId || {};
  const productSize = product.productSizeId || {};
  const material = productGroup.materialId || {};
  const previousImages = detail.previousConditionImages || {};
  const currentImages = detail.currentConditionImages || {};
  const walletTransactions = detail.walletTransactions || [];
  const currentDamageFaces = detail.currentDamageFaces || [];
  const singleUseList = Array.isArray(singleUseDetail) ? singleUseDetail : [];
  const singleUseTotalPages = Math.max(
    1,
    Math.ceil(singleUseList.length / SINGLE_USE_PAGE_SIZE)
  );
  const singleUsePageItems = singleUseList.slice(
    (singleUsePage - 1) * SINGLE_USE_PAGE_SIZE,
    singleUsePage * SINGLE_USE_PAGE_SIZE
  );

  const imageFaces = [
    { key: 'frontImage', label: 'Front' },
    { key: 'backImage', label: 'Back' },
    { key: 'leftImage', label: 'Left' },
    { key: 'rightImage', label: 'Right' },
    { key: 'topImage', label: 'Top' },
    { key: 'bottomImage', label: 'Bottom' }
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<FaArrowLeft />}
          onClick={handleBack}
          sx={{ 
            mb: 2, 
            color: '#0b5529',
            fontWeight: 600,
            textTransform: 'none',
            px: 1.5,
            py: 0.75,
            minWidth: 'auto',
            '&:hover': { 
              backgroundColor: '#f0f7f3',
            }
          }}
        >
          Back
        </Button>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 700, 
                color: '#0b5529', 
                mb: 0.5,
                fontSize: { xs: '1.5rem', md: '1.75rem' }
              }}
            >
              Transaction Details
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ fontSize: '0.875rem' }}
            >
              Complete transaction information
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {getTransactionTypeChip(detail.borrowTransactionType)}
            {getStatusChip(detail.status)}
          </Box>
        </Box>
      </Box>

      <Grid container spacing={2.5}>
        {/* Left Column - Main Info */}
        <Grid item size={6}>
          {/* Transaction Overview Card */}
          <Card sx={{ 
            mb: 2.5, 
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)', 
            borderRadius: 2,
            border: detail.borrowTransactionType === 'return_success' 
              ? '1.5px solid rgba(46, 125, 50, 0.3)' 
              : detail.borrowTransactionType === 'return_failed'
              ? '1.5px solid rgba(198, 40, 40, 0.3)'
              : '1px solid rgba(11, 85, 41, 0.1)',
            backgroundColor: detail.borrowTransactionType === 'return_success'
              ? 'rgba(232, 245, 233, 0.3)'
              : detail.borrowTransactionType === 'return_failed'
              ? 'rgba(255, 235, 238, 0.3)'
              : 'transparent',
          }}>
            <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#0b5529', fontSize: '1rem' }}>
                  Transaction Overview
                </Typography>
                {(detail.borrowTransactionType === 'return_success' || detail.borrowTransactionType === 'return_failed') && (
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 0.75,
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1.5,
                    backgroundColor: detail.borrowTransactionType === 'return_success'
                      ? 'rgba(46, 125, 50, 0.1)'
                      : 'rgba(198, 40, 40, 0.1)',
                  }}>
                    {detail.borrowTransactionType === 'return_success' ? (
                      <>
                        <FaCheckDouble style={{ color: '#2e7d32', fontSize: '0.9rem' }} />
                        <Typography variant="caption" sx={{ fontWeight: 600, color: '#2e7d32', fontSize: '0.75rem' }}>
                          Successfully Returned
                        </Typography>
                      </>
                    ) : (
                      <>
                        <FaExclamationTriangle style={{ color: '#c62828', fontSize: '0.9rem' }} />
                        <Typography variant="caption" sx={{ fontWeight: 600, color: '#c62828', fontSize: '0.75rem' }}>
                          Return Failed / Lost
                        </Typography>
                      </>
                    )}
                  </Box>
                )}
              </Box>
              <Grid container spacing={2}>
                <Grid item size={6}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
                    <FaCalendarAlt style={{ color: '#0b5529', fontSize: '1rem', marginTop: '2px', flexShrink: 0 }} />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontSize: '0.75rem' }}>
                        Borrow Date
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: '#1a1a1a' }}>
                        {formatDate(detail.borrowDate || detail.createdAt)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
                    <FaClock style={{ color: '#0b5529', fontSize: '1rem', marginTop: '2px', flexShrink: 0 }} />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontSize: '0.75rem' }}>
                        Due Date
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: '#1a1a1a' }}>
                        {formatDate(detail.dueDate)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {detail.returnDate && (
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
                      <FaCheckCircle style={{ color: '#4caf50', fontSize: '1rem', marginTop: '2px', flexShrink: 0 }} />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontSize: '0.75rem' }}>
                          Return Date
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500, color: '#1a1a1a' }}>
                          {formatDate(detail.returnDate)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
                    <FaMoneyBillWave style={{ color: '#c62828', fontSize: '1rem', marginTop: '2px', flexShrink: 0 }} />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontSize: '0.75rem' }}>
                        Deposit Amount
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#c62828' }}>
                        {Number(detail.depositAmount || 0).toLocaleString('en-US')} VND
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {detail.extensionCount > 0 && (
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
                      <FaClock style={{ color: '#ff9800', fontSize: '1rem', marginTop: '2px', flexShrink: 0 }} />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontSize: '0.75rem' }}>
                          Extensions
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500, color: '#1a1a1a' }}>
                          {detail.extensionCount} time(s)
                        </Typography>
                        {detail.lastExtensionDate && (
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25, fontSize: '0.7rem' }}>
                            Last: {formatDateShort(detail.lastExtensionDate)}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>

          {/* CO₂ & Points Card */}
          <Card sx={{ 
            mb: 2.5, 
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)', 
            borderRadius: 2,
            border: '1px solid rgba(11, 85, 41, 0.1)',
          }}>
            <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#0b5529', mb: 2, fontSize: '1rem' }}>
                Environmental Impact
              </Typography>
              <Grid container spacing={1.5}>
                <Grid item size={3}>
                  <Box sx={{ 
                    textAlign: 'center', 
                    p: 1.5, 
                    backgroundColor: '#e8f5e9', 
                    borderRadius: 1.5,
                    border: '1px solid rgba(46, 125, 50, 0.15)',
                  }}>
                    <FaLeaf style={{ fontSize: '1.5rem', color: '#2e7d32', marginBottom: '0.5rem' }} />
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontSize: '0.7rem', fontWeight: 500 }}>
                      CO₂ Reduced
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#2e7d32', fontSize: '0.95rem' }}>
                      {Number(detail.co2Changed || 0).toFixed(3)} kg
                    </Typography>
                  </Box>
                </Grid>
                <Grid item size={3}>
                  <Box sx={{ 
                    textAlign: 'center', 
                    p: 1.5, 
                    backgroundColor: '#fff3e0', 
                    borderRadius: 1.5,
                    border: '1px solid rgba(255, 152, 0, 0.15)',
                  }}>
                    <FaCoins style={{ fontSize: '1.5rem', color: '#ff9800', marginBottom: '0.5rem' }} />
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontSize: '0.7rem', fontWeight: 500 }}>
                      Eco Points
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#ff9800', fontSize: '0.95rem' }}>
                      {Number(detail.ecoPointChanged || 0).toFixed(2)}
                    </Typography>
                  </Box>
                </Grid>
                {detail.rankingPointChanged !== undefined && (
                  <Grid item size={3}>
                    <Box sx={{ 
                      textAlign: 'center', 
                      p: 1.5, 
                      backgroundColor: '#e3f2fd', 
                      borderRadius: 1.5,
                      border: '1px solid rgba(33, 150, 243, 0.15)',
                    }}>
                      <FaCoins style={{ fontSize: '1.5rem', color: '#2196f3', marginBottom: '0.5rem' }} />
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontSize: '0.7rem', fontWeight: 500 }}>
                        Ranking Points
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#2196f3', fontSize: '0.95rem' }}>
                        {Number(detail.rankingPointChanged || 0).toFixed(2)}
                      </Typography>
                    </Box>
                  </Grid>
                )}
                {detail.rewardPointChanged !== undefined && (
                  <Grid item size={3}>
                    <Box sx={{ 
                      textAlign: 'center', 
                      p: 1.5, 
                      backgroundColor: '#f3e5f5', 
                      borderRadius: 1.5,
                      border: '1px solid rgba(156, 39, 176, 0.15)',
                    }}>
                      <FaCoins style={{ fontSize: '1.5rem', color: '#9c27b0', marginBottom: '0.5rem' }} />
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontSize: '0.7rem', fontWeight: 500 }}>
                        Reward Points
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#9c27b0', fontSize: '0.95rem' }}>
                        {Number(detail.rewardPointChanged || 0).toFixed(2)}
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>

          {/* Single-use Consumption */}
          <Card sx={{ 
            mb: 2.5, 
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)', 
            borderRadius: 2,
            border: '1px solid rgba(11, 85, 41, 0.1)',
            backgroundColor: '#f5f7fa',
          }}>
            <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5, gap: 1, flexWrap: 'wrap' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0b5529', fontSize: '1rem' }}>
                  Single-use consumption
                </Typography>
              </Box>
              {isLoadingSingleUseDetail ? (
                <Typography>Loading single-use consumption...</Typography>
              ) : singleUseList.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No single-use consumption records.
                </Typography>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {singleUsePageItems.map((item) => {
                    const product = item.product || {};
                    const staff = item.staff || {};
                    const loggedAt = item.createdAt
                      ? new Date(item.createdAt).toLocaleString('en-US')
                      : 'N/A';
                    const blockchainTxHash = item.blockchainTxHash || 'N/A';
                    const productImage =
                      product.imageUrl ||
                      'https://via.placeholder.com/140x120?text=Single-use';

                    return (
                      <Box
                        key={item._id || item.id}
                        sx={{
                          border: '1px solid #e5e7eb',
                          borderRadius: 1.5,
                          p: 1.5,
                          backgroundColor: '#ffffff',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', sm: '140px 1fr 1fr' },
                            gap: 1.5,
                            alignItems: 'center',
                          }}
                        >
                          <Box
                            component="img"
                            src={productImage}
                            alt={product.name || 'Single-use item'}
                            sx={{
                              width: '100%',
                              maxWidth: 140,
                              height: 120,
                              objectFit: 'cover',
                              borderRadius: 1.5,
                              border: '1px solid #e5e7eb',
                              backgroundColor: '#fff',
                            }}
                          />

                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                              {product.name || 'Single-use item'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Type: <strong>{product.type || 'N/A'}</strong>
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Size: <strong>{product.size || 'N/A'}</strong>
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Material: <strong>{product.material || 'N/A'}</strong>
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Weight: <strong>{product.weight ?? 'N/A'} g</strong>
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              CO₂ per unit:{" "}
                              <strong>
                                {item.co2PerUnit !== undefined && item.co2PerUnit !== null
                                  ? `${item.co2PerUnit} kg`
                                  : 'N/A'}
                              </strong>
                            </Typography>
                          </Box>

                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                              Staff
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Name: <strong>{staff.fullName || 'N/A'}</strong>
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Email: <strong>{staff.email || 'N/A'}</strong>
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Phone: <strong>{staff.phone || 'N/A'}</strong>
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Logged at: <strong>{loggedAt}</strong>
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Blockchain Tx Hash:
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                wordBreak: 'break-all',
                                fontFamily: 'monospace',
                                backgroundColor: '#f5f7fa',
                                p: 0.75,
                                borderRadius: 1,
                                border: '1px dashed #d0d7de',
                                color: blockchainTxHash === 'N/A' ? 'text.secondary' : '#0b5529',
                                fontWeight: 600,
                              }}
                            >
                              {blockchainTxHash}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    );
                  })}
                  {singleUseTotalPages > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                      <Pagination
                        count={singleUseTotalPages}
                        page={singleUsePage}
                        onChange={(_, page) => setSingleUsePage(page)}
                        shape="rounded"
                        color="primary"
                        size="small"
                      />
                    </Box>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Condition Images */}
          {(previousImages.frontImage || currentImages.frontImage) && (
            <Card sx={{ 
              mb: 2.5, 
              boxShadow: '0 1px 4px rgba(0,0,0,0.08)', 
              borderRadius: 2,
              border: detail.borrowTransactionType === 'return_success'
                ? '1.5px solid rgba(46, 125, 50, 0.25)'
                : detail.borrowTransactionType === 'return_failed'
                ? '1.5px solid rgba(198, 40, 40, 0.25)'
                : '1px solid rgba(11, 85, 41, 0.1)',
              backgroundColor: detail.borrowTransactionType === 'return_success'
                ? 'rgba(232, 245, 233, 0.2)'
                : detail.borrowTransactionType === 'return_failed'
                ? 'rgba(255, 235, 238, 0.2)'
                : 'transparent',
            }}>
              <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#0b5529', fontSize: '1rem' }}>
                    <FaImage style={{ marginRight: '0.5rem', fontSize: '0.9rem' }} />
                    Condition Images
                  </Typography>
                  {detail.borrowTransactionType === 'return_success' && (
                    <Chip
                      icon={<FaCheckCircle />}
                      label="Good Condition"
                      size="small"
                      sx={{
                        backgroundColor: '#e8f5e9',
                        color: '#2e7d32',
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        height: '24px',
                        border: '1px solid #2e7d32',
                        '& .MuiChip-icon': {
                          color: '#2e7d32',
                          fontSize: '0.75rem'
                        }
                      }}
                    />
                  )}
                  {detail.borrowTransactionType === 'return_failed' && (
                    <Chip
                      icon={<FaBan />}
                      label="Damaged / Lost"
                      size="small"
                      sx={{
                        backgroundColor: '#ffebee',
                        color: '#c62828',
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        height: '24px',
                        border: '1px solid #c62828',
                        '& .MuiChip-icon': {
                          color: '#c62828',
                          fontSize: '0.75rem'
                        }
                      }}
                    />
                  )}
                </Box>
                
                {previousImages.frontImage && (
                  <Box sx={{ mb: 2.5 }}>
                    <Typography variant="caption" sx={{ mb: 1.5, fontWeight: 600, color: '#0b5529', display: 'block', fontSize: '0.8rem' }}>
                      Previous Condition
                    </Typography>
                    <Grid container spacing={1.5}>
                      {imageFaces.map((face) => {
                        const imageUrl = previousImages[face.key];
                        if (!imageUrl) return null;
                        return (
                          <Grid item size={2} key={face.key}>
                            <Box sx={{ textAlign: 'center' }}>
                              <img
                                src={imageUrl}
                                alt={face.label}
                                style={{
                                  width: '100%',
                                  height: '100px',
                                  objectFit: 'cover',
                                  borderRadius: '6px',
                                  border: '1px solid #e5e7eb'
                                }}
                              />
                              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block', fontSize: '0.7rem' }}>
                                {face.label}
                              </Typography>
                            </Box>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Box>
                )}

                {currentImages.frontImage && (
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: '#0b5529', display: 'block', fontSize: '0.8rem' }}>
                        Current Condition
                      </Typography>
                      {detail.borrowTransactionType === 'return_success' && (
                        <Typography variant="caption" sx={{ 
                          color: '#2e7d32', 
                          fontWeight: 600, 
                          fontSize: '0.7rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5
                        }}>
                          <FaCheckCircle style={{ fontSize: '0.7rem' }} />
                          Verified
                        </Typography>
                      )}
                      {detail.borrowTransactionType === 'return_failed' && (
                        <Typography variant="caption" sx={{ 
                          color: '#c62828', 
                          fontWeight: 600, 
                          fontSize: '0.7rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5
                        }}>
                          <FaExclamationTriangle style={{ fontSize: '0.7rem' }} />
                          Issues Found
                        </Typography>
                      )}
                    </Box>
                    <Grid container spacing={1.5}>
                      {imageFaces.map((face) => {
                        const imageUrl = currentImages[face.key];
                        if (!imageUrl) return null;
                        const damageFace = currentDamageFaces.find(d => d.face === face.key.replace('Image', ''));
                        const hasDamage = damageFace && damageFace.issue && damageFace.issue !== 'none';
                        return (
                          <Grid item size={2} key={face.key}>
                            <Box sx={{ 
                              textAlign: 'center',
                              position: 'relative'
                            }}>
                              <Box sx={{ position: 'relative' }}>
                                <img
                                  src={imageUrl}
                                  alt={face.label}
                                  style={{
                                    width: '100%',
                                    height: '100px',
                                    objectFit: 'cover',
                                    borderRadius: '6px',
                                    border: hasDamage 
                                      ? '2px solid #c62828' 
                                      : detail.borrowTransactionType === 'return_success'
                                      ? '2px solid #2e7d32'
                                      : '1px solid #e5e7eb',
                                    opacity: hasDamage ? 0.85 : 1
                                  }}
                                />
                                {hasDamage && (
                                  <Box sx={{
                                    position: 'absolute',
                                    top: 4,
                                    right: 4,
                                    backgroundColor: '#c62828',
                                    borderRadius: '50%',
                                    width: '20px',
                                    height: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}>
                                    <FaExclamationTriangle style={{ color: 'white', fontSize: '0.7rem' }} />
                                  </Box>
                                )}
                                {detail.borrowTransactionType === 'return_success' && !hasDamage && (
                                  <Box sx={{
                                    position: 'absolute',
                                    top: 4,
                                    right: 4,
                                    backgroundColor: '#2e7d32',
                                    borderRadius: '50%',
                                    width: '20px',
                                    height: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}>
                                    <FaCheckCircle style={{ color: 'white', fontSize: '0.7rem' }} />
                                  </Box>
                                )}
                              </Box>
                              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block', fontSize: '0.7rem' }}>
                                {face.label}
                              </Typography>
                              {hasDamage && (
                                <Typography variant="caption" sx={{ 
                                  display: 'block', 
                                  color: '#c62828', 
                                  fontWeight: 600,
                                  fontSize: '0.65rem',
                                  mt: 0.25
                                }}>
                                  {damageFace.issue}
                                </Typography>
                              )}
                            </Box>
                          </Grid>
                        );
                      })}
                    </Grid>
                    {currentDamageFaces.length > 0 && (
                      <Box sx={{ mt: 2, p: 1.5, backgroundColor: '#ffebee', borderRadius: 1.5, border: '1px solid rgba(198, 40, 40, 0.2)' }}>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: '#c62828', display: 'block', mb: 1, fontSize: '0.75rem' }}>
                          Damage Report:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {currentDamageFaces
                            .filter(d => d.issue && d.issue !== 'none')
                            .map((damage, idx) => (
                              <Chip
                                key={idx}
                                label={`${damage.face}: ${damage.issue}`}
                                size="small"
                                sx={{
                                  backgroundColor: '#ffffff',
                                  color: '#c62828',
                                  fontSize: '0.7rem',
                                  height: '22px',
                                  border: '1px solid #c62828',
                                  fontWeight: 500,
                                  textTransform: 'capitalize'
                                }}
                              />
                            ))}
                        </Box>
                      </Box>
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          )}

          {/* Wallet Transactions */}
          {walletTransactions.length > 0 && (
            <Card sx={{ 
              boxShadow: '0 1px 4px rgba(0,0,0,0.08)', 
              borderRadius: 2,
              border: '1px solid rgba(11, 85, 41, 0.1)',
            }}>
              <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#0b5529', mb: 2, fontSize: '1rem' }}>
                  Wallet Transactions
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {walletTransactions.map((txn, idx) => (
                    <Box
                      key={txn._id || idx}
                      sx={{
                        p: 1.5,
                        backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f9fbfa',
                        borderRadius: 1.5,
                        border: '1px solid rgba(11, 85, 41, 0.1)',
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                            {txn.transactionType?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.75rem' }}>
                            {txn.description || 'N/A'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, fontSize: '0.7rem' }}>
                            {formatDate(txn.createdAt)}
                          </Typography>
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 700,
                            color: txn.direction === 'in' ? '#4caf50' : '#c62828',
                            fontSize: '0.95rem',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {txn.direction === 'in' ? '+' : '-'}
                          {Number(txn.amount || 0).toLocaleString('en-US')} VND
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Right Column - Side Info */}
        <Grid item size={6}>
          {/* Customer/Business Info */}
          <Card sx={{ 
            mb: 2.5, 
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)', 
            borderRadius: 2,
            border: '1px solid rgba(11, 85, 41, 0.1)',
          }}>
            <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#0b5529', mb: 2, fontSize: '1rem' }}>
                {type === 'business' ? (
                  <>
                    <FaUser style={{ marginRight: '0.5rem', fontSize: '0.9rem' }} />
                    Customer Information
                  </>
                ) : (
                  <>
                    <FaStore style={{ marginRight: '0.5rem', fontSize: '0.9rem' }} />
                    Business Information
                  </>
                )}
              </Typography>
              
              {type === 'business' ? (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar
                      src={customer.avatar}
                      sx={{ width: 48, height: 48, bgcolor: '#0b5529', fontSize: '1rem' }}
                    >
                      {customer.fullName?.[0]?.toUpperCase() || 'C'}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.25 }}>
                        {customer.fullName || customer.userId?.email || 'N/A'}
                      </Typography>
                      {customer.phone && (
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                          {customer.phone}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </>
              ) : (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                    <Avatar
                      src={business.businessLogoUrl}
                      sx={{ width: 48, height: 48, bgcolor: '#0b5529', fontSize: '1rem' }}
                    >
                      {business.businessName?.[0]?.toUpperCase() || 'B'}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.25 }}>
                        {business.businessName || 'N/A'}
                      </Typography>
                      {business.businessPhone && (
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                          {business.businessPhone}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  {business.businessAddress && (
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', display: 'block' }}>
                      {business.businessAddress}
                    </Typography>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Product Info */}
          <Card sx={{ 
            mb: 3, 
            boxShadow: '0 2px 8px rgba(0,0,0,0.1), 0 4px 16px rgba(0,0,0,0.05)', 
            borderRadius: 3,
            border: '1px solid rgba(11, 85, 41, 0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0,0,0,0.15), 0 8px 24px rgba(0,0,0,0.08)',
            }
          }}>
            <CardContent sx={{ p: { xs: 2.5, sm: 3, md: 3.5 } }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#0b5529', mb: 2.5, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                <FaBox style={{ marginRight: '0.5rem' }} />
                Product Information
              </Typography>
              <Divider sx={{ mb: 3, borderColor: 'rgba(11, 85, 41, 0.2)' }} />
              
              {productGroup.imageUrl && (
                <Box sx={{ 
                  mb: 3, 
                  textAlign: 'center',
                  p: 2,
                  backgroundColor: '#f9fbfa',
                  borderRadius: 2.5,
                  border: '1px solid rgba(11, 85, 41, 0.1)'
                }}>
                  <img
                    src={productGroup.imageUrl}
                    alt={productGroup.name}
                    style={{
                      width: '100%',
                      maxHeight: '220px',
                      objectFit: 'contain',
                      borderRadius: '8px'
                    }}
                  />
                </Box>
              )}
              
              <Box sx={{ 
                mb: 2, 
                p: 1.5,
                backgroundColor: 'rgba(11, 85, 41, 0.03)',
                borderRadius: 2
              }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontSize: '0.8rem', fontWeight: 500 }}>
                  Product Name
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                  {productGroup.name || 'N/A'}
                </Typography>
              </Box>
              
              {material.materialName && (
                <Box sx={{ 
                  mb: 2, 
                  p: 1.5,
                  backgroundColor: 'rgba(11, 85, 41, 0.03)',
                  borderRadius: 2
                }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontSize: '0.8rem', fontWeight: 500 }}>
                    Material
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                    {material.materialName}
                  </Typography>
                </Box>
              )}
              
              {productSize.sizeName && (
                <Box sx={{ 
                  mb: 2, 
                  p: 1.5,
                  backgroundColor: 'rgba(11, 85, 41, 0.03)',
                  borderRadius: 2
                }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontSize: '0.8rem', fontWeight: 500 }}>
                    Size
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                    {productSize.sizeName}
                  </Typography>
                </Box>
              )}
              
              {product.serialNumber && (
                <Box sx={{ 
                  mb: 2, 
                  p: 1.5,
                  backgroundColor: 'rgba(11, 85, 41, 0.03)',
                  borderRadius: 2
                }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontSize: '0.8rem', fontWeight: 500 }}>
                    Serial Number
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, fontFamily: 'monospace', color: '#1a1a1a' }}>
                    {product.serialNumber}
                  </Typography>
                </Box>
              )}
              
              {(detail.qrCode || product.qrCode) && (
                <Box sx={{ 
                  mt: 3, 
                  textAlign: 'center',
                  p: 2.5,
                  backgroundColor: '#f9fbfa',
                  borderRadius: 2.5,
                  border: '2px solid rgba(11, 85, 41, 0.15)'
                }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontWeight: 500 }}>
                    QR Code
                  </Typography>
                  <img
                    src={detail.qrCode || product.qrCode}
                    alt="QR Code"
                    style={{
                      width: '160px',
                      height: '160px',
                      border: '2px solid rgba(11, 85, 41, 0.2)',
                      borderRadius: '12px',
                      padding: '12px',
                      backgroundColor: '#ffffff',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    }}
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BorrowTransactionDetail;

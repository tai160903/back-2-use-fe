import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  createSingleUseProductSizeApi,
  getAllSingleUseProductSizesApi,
  updateSingleUseProductSizeStatusApi,
  getAllSingleUseProductTypesApi,
} from '../../../store/slices/singleUseProductTypeSlice';
import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Alert,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment,
  Divider,
  Pagination,
  Switch,
  FormControlLabel,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import { PATH } from '../../../routes/path';
import './SingleUseProductSize.css';

const SingleUseProductSize = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productTypeId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const openCreateOnMount = searchParams.get('openCreate') === 'true';

  const {
    productSizes = [],
    productSizePagination,
    productTypes = [],
    isLoading,
    error,
  } = useSelector((state) => state.singleUseProductType);

  const [openDialog, setOpenDialog] = useState(openCreateOnMount);
  const [formData, setFormData] = useState({
    productTypeId: productTypeId || '',
    sizeName: '',
    minWeight: '',
    maxWeight: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isActiveFilter, setIsActiveFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Get current product type info
  const currentProductType = productTypes.find((type) => type._id === productTypeId);

  useEffect(() => {
    if (productTypeId) {
      loadProductSizes();
      // Load product types to get current product type name
      dispatch(getAllSingleUseProductTypesApi({ page: 1, limit: 100 }));
    }
  }, [productTypeId, currentPage, isActiveFilter]);

  // Remove openCreate param after opening modal
  useEffect(() => {
    if (openCreateOnMount && searchParams.has('openCreate')) {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.delete('openCreate');
        return newParams;
      });
    }
  }, [openCreateOnMount]);

  const loadProductSizes = () => {
    if (!productTypeId) {
      console.warn('productTypeId is missing');
      return;
    }
    dispatch(
      getAllSingleUseProductSizesApi({
        productTypeId,
        isActive: isActiveFilter || undefined,
      })
    );
  };

  const handleOpenDialog = () => {
    setFormData({
      productTypeId: productTypeId || '',
      sizeName: '',
      minWeight: '',
      maxWeight: '',
    });
    setFormErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      productTypeId: productTypeId || '',
      sizeName: '',
      minWeight: '',
      maxWeight: '',
    });
    setFormErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'minWeight' || name === 'maxWeight' ? (value === '' ? '' : Number(value)) : value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.sizeName.trim()) {
      errors.sizeName = 'Size name is required';
    }
    if (formData.minWeight === '' || formData.minWeight === null || formData.minWeight === undefined) {
      errors.minWeight = 'Minimum weight is required';
    } else if (formData.minWeight < 0) {
      errors.minWeight = 'Minimum weight must be greater than or equal to 0';
    }
    if (formData.maxWeight === '' || formData.maxWeight === null || formData.maxWeight === undefined) {
      errors.maxWeight = 'Maximum weight is required';
    } else if (formData.maxWeight < 0) {
      errors.maxWeight = 'Maximum weight must be greater than or equal to 0';
    }
    if (formData.minWeight !== '' && formData.maxWeight !== '' && formData.minWeight >= formData.maxWeight) {
      errors.maxWeight = 'Maximum weight must be greater than minimum weight';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      await dispatch(
        createSingleUseProductSizeApi({
          productTypeId: formData.productTypeId,
          sizeName: formData.sizeName.trim(),
          minWeight: Number(formData.minWeight),
          maxWeight: Number(formData.maxWeight),
        })
      ).unwrap();
      handleCloseDialog();
      loadProductSizes();
    } catch (error) {
      // Error handled by thunk
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await dispatch(
        updateSingleUseProductSizeStatusApi({
          id,
          isActive: !currentStatus,
        })
      ).unwrap();
      loadProductSizes();
    } catch (error) {
      // Error handled by thunk
    }
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
    // Note: API may not support pagination, so we just update state for UI
  };

  const handleFilterChange = (newFilter) => {
    setIsActiveFilter(newFilter);
    setCurrentPage(1);
  };

  // Filter by search query
  const filteredProductSizes = productSizes.filter((item) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return item.sizeName?.toLowerCase().includes(query);
  });

  // Get counts
  const getActiveCount = () => {
    return productSizes.filter((item) => item.isActive === true).length;
  };

  const getInactiveCount = () => {
    return productSizes.filter((item) => item.isActive === false).length;
  };

  return (
    <Box className="single-use-product-size-page" sx={{ p: 3, backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      {/* Header Section */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <IconButton
            onClick={() => navigate(PATH.ADMIN_SINGLE_USE_PRODUCT_TYPE)}
            sx={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              '&:hover': {
                backgroundColor: '#f9fafb',
              },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 2,
              backgroundColor: '#12422a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(18, 66, 42, 0.25)',
            }}
          >
            <CategoryIcon sx={{ fontSize: 32, color: 'white' }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h4"
              component="h1"
              fontWeight={700}
              sx={{
                color: '#1a1a1a',
                fontFamily: 'inherit',
                letterSpacing: '-0.02em',
                mb: 0.5,
              }}
            >
              Product Sizes
            </Typography>
            <Typography variant="body1" sx={{ color: '#6b7280', fontSize: '0.95rem' }}>
              {currentProductType
                ? `Manage sizes for "${currentProductType.name}"`
                : 'Manage product sizes'}
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
            sx={{
              borderRadius: 2,
              backgroundColor: '#12422a',
              px: 3,
              py: 1.25,
              fontSize: '0.9375rem',
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: '0 4px 12px rgba(18, 66, 42, 0.3)',
              '&:hover': {
                backgroundColor: '#0d2e1c',
                boxShadow: '0 6px 16px rgba(18, 66, 42, 0.4)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Add Product Size
          </Button>
        </Box>

        {/* Statistics Cards */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mb: 3 }}>
          <Paper
            elevation={0}
            onClick={() => handleFilterChange('')}
            sx={{
              p: 2.5,
              borderRadius: 2,
              backgroundColor: 'white',
              border: isActiveFilter === '' ? '2px solid #12422a' : '1px solid #e5e7eb',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                transform: 'translateY(-2px)',
                borderColor: '#12422a',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 500 }}>
                Total Sizes
              </Typography>
              <CategoryIcon sx={{ fontSize: 20, color: '#9ca3af' }} />
            </Box>
            <Typography variant="h4" sx={{ color: '#1a1a1a', fontWeight: 700 }}>
              {productSizes.length}
            </Typography>
          </Paper>

          <Paper
            elevation={0}
            onClick={() => handleFilterChange('true')}
            sx={{
              p: 2.5,
              borderRadius: 2,
              backgroundColor: 'white',
              border: isActiveFilter === 'true' ? '2px solid #16a34a' : '1px solid #e5e7eb',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                transform: 'translateY(-2px)',
                borderColor: '#16a34a',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 500 }}>
                Active
              </Typography>
              <CheckCircleIcon sx={{ fontSize: 20, color: '#16a34a' }} />
            </Box>
            <Typography variant="h4" sx={{ color: '#16a34a', fontWeight: 700 }}>
              {getActiveCount()}
            </Typography>
          </Paper>

          <Paper
            elevation={0}
            onClick={() => handleFilterChange('false')}
            sx={{
              p: 2.5,
              borderRadius: 2,
              backgroundColor: 'white',
              border: isActiveFilter === 'false' ? '2px solid #ef4444' : '1px solid #e5e7eb',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                transform: 'translateY(-2px)',
                borderColor: '#ef4444',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 500 }}>
                Inactive
              </Typography>
              <CancelIcon sx={{ fontSize: 20, color: '#ef4444' }} />
            </Box>
            <Typography variant="h4" sx={{ color: '#ef4444', fontWeight: 700 }}>
              {getInactiveCount()}
            </Typography>
          </Paper>
        </Box>

        {/* Search */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <TextField
            size="small"
            placeholder="Search by size name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              flex: 1,
              maxWidth: 400,
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'white',
                borderRadius: 2,
                '&:hover fieldset': {
                  borderColor: '#12422a',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#12422a',
                  borderWidth: 2,
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#9ca3af' }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {typeof error === 'string' ? error : error?.message || 'Something went wrong'}
        </Alert>
      )}

      {/* Main Content */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
        }}
      >
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
            <CircularProgress sx={{ color: '#12422a' }} />
          </Box>
        ) : filteredProductSizes.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6, px: 3 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: '#f0f9f4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
              }}
            >
              <CategoryIcon sx={{ fontSize: 40, color: '#12422a' }} />
            </Box>
            <Typography variant="h6" sx={{ color: '#1a1a1a', fontWeight: 600, mb: 1 }}>
              No product sizes found
            </Typography>
            <Typography variant="body2" sx={{ color: '#6b7280', mb: 3, maxWidth: 400, mx: 'auto' }}>
              {searchQuery
                ? `No product sizes found matching "${searchQuery}"`
                : 'Start by creating your first product size for this product type'}
            </Typography>
            {!searchQuery && (
              <Button
                variant="contained"
                onClick={handleOpenDialog}
                startIcon={<AddIcon />}
                sx={{
                  backgroundColor: '#12422a',
                  px: 3,
                  py: 1.25,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(18, 66, 42, 0.3)',
                  '&:hover': {
                    backgroundColor: '#0d2e1c',
                    boxShadow: '0 6px 16px rgba(18, 66, 42, 0.4)',
                  },
                }}
              >
                Create Product Size
              </Button>
            )}
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f9fafb' }}>
                    <TableCell sx={{ py: 1.5, fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>
                      Size Name
                    </TableCell>
                    <TableCell sx={{ py: 1.5, fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>
                      Weight Range (g)
                    </TableCell>
                    <TableCell sx={{ py: 1.5, fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>
                      Status
                    </TableCell>
                    <TableCell sx={{ py: 1.5, fontWeight: 600, color: '#374151', fontSize: '0.875rem', textAlign: 'center' }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredProductSizes.map((item) => (
                    <TableRow
                      key={item._id}
                      sx={{
                        '&:hover': {
                          backgroundColor: '#f9fafb',
                        },
                        '&:last-child td': {
                          borderBottom: 'none',
                        },
                      }}
                    >
                      <TableCell sx={{ py: 1.75 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: 1.5,
                              backgroundColor: '#f0f9f4',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <CategoryIcon sx={{ fontSize: 20, color: '#12422a' }} />
                          </Box>
                          <Typography variant="body2" fontWeight={600} sx={{ fontFamily: 'inherit', color: '#1a1a1a' }}>
                            {item.sizeName}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 1.75 }}>
                        <Typography variant="body2" sx={{ fontFamily: 'inherit', color: '#6b7280' }}>
                          {item.minWeight} - {item.maxWeight} g
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 1.75 }}>
                        <Chip
                          label={item.isActive ? 'Active' : 'Inactive'}
                          size="small"
                          sx={{
                            backgroundColor: item.isActive ? '#e8f5e9' : '#ffebee',
                            color: item.isActive ? '#2e7d32' : '#c62828',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            border: `1px solid ${item.isActive ? '#2e7d32' : '#c62828'}`,
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ py: 1.75, textAlign: 'center' }}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={item.isActive === true}
                              onChange={() => handleToggleStatus(item._id, item.isActive)}
                              color="success"
                              size="small"
                            />
                          }
                          label=""
                          sx={{ m: 0 }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {productSizePagination?.totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <Pagination
                  count={productSizePagination.totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  variant="outlined"
                  shape="rounded"
                  color="primary"
                  showFirstButton
                  showLastButton
                  sx={{
                    '& .MuiPaginationItem-root': {
                      '&.Mui-selected': {
                        backgroundColor: '#12422a',
                        color: '#ffffff',
                        fontWeight: 600,
                        '&:hover': {
                          backgroundColor: '#0d2e1c',
                        },
                      },
                      '&:hover': {
                        backgroundColor: 'rgba(18, 66, 42, 0.1)',
                      },
                    },
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Paper>

      {/* Create Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 12px 40px rgba(18, 66, 42, 0.2)',
          },
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #12422a 0%, #0d2e1c 100%)',
            color: 'white',
            py: 1.5,
            px: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <CategoryIcon />
          <Typography variant="subtitle1" component="div" fontWeight={700} sx={{ fontFamily: 'inherit' }}>
            Create Product Size
          </Typography>
        </DialogTitle>

        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: 2.25, pb: 2, px: 2.25 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Size Name"
                placeholder="e.g., S, M, L, Small, Medium, Large"
                name="sizeName"
                value={formData.sizeName}
                onChange={handleInputChange}
                required
                variant="outlined"
                size="small"
                error={!!formErrors.sizeName}
                helperText={formErrors.sizeName || 'Enter a size name (e.g., S, M, L)'}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    '&:hover fieldset': {
                      borderColor: '#12422a',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#12422a',
                      borderWidth: 2,
                    },
                  },
                }}
              />

              <TextField
                fullWidth
                label="Minimum Weight (g)"
                placeholder="e.g., 0, 10, 50"
                name="minWeight"
                type="number"
                value={formData.minWeight}
                onChange={handleInputChange}
                required
                variant="outlined"
                size="small"
                inputProps={{ min: 0, step: 0.1 }}
                error={!!formErrors.minWeight}
                helperText={formErrors.minWeight || 'Enter the minimum weight in grams'}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    '&:hover fieldset': { 
                      borderColor: '#12422a',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#12422a',
                      borderWidth: 2,
                    },
                  },
                }}
              />

              <TextField
                fullWidth
                label="Maximum Weight (g)"
                placeholder="e.g., 10, 50, 100"
                name="maxWeight"
                type="number"
                value={formData.maxWeight}
                onChange={handleInputChange}
                required
                variant="outlined"
                size="small"
                inputProps={{ min: 0, step: 0.1 }}
                error={!!formErrors.maxWeight}
                helperText={formErrors.maxWeight || 'Enter the maximum weight in grams (must be greater than minimum weight)'}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    '&:hover fieldset': {
                      borderColor: '#12422a',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#12422a',
                      borderWidth: 2,
                    },
                  },
                }}
              />
            </Box>
          </DialogContent>

          <Divider />

          <DialogActions
            sx={{
              px: 2,
              py: 1.5,
              gap: 2,
              backgroundColor: 'rgba(18, 66, 42, 0.02)',
            }}
          >
            <Button
              onClick={handleCloseDialog}
              variant="outlined"
              sx={{
                color: '#666',
                borderColor: '#ccc',
                px: 2,
                py: 0.75,
                fontSize: '0.9rem',
                borderWidth: 1.5,
                fontWeight: 500,
                '&:hover': {
                  borderColor: '#999',
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  borderWidth: 1.5,
                },
              }}
              size="small"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<AddIcon fontSize="small" />}
              sx={{
                backgroundColor: '#12422a',
                px: 2,
                py: 0.75,
                fontSize: '0.9rem',
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(18, 66, 42, 0.35)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#0d2e1c',
                  boxShadow: '0 6px 16px rgba(18, 66, 42, 0.45)',
                  transform: 'translateY(-2px)',
                },
              }}
              size="small"
            >
              Create
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default SingleUseProductSize;

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  createSingleUseProductTypeApi,
  getAllSingleUseProductTypesApi,
  updateSingleUseProductTypeStatusApi,
} from '../../../store/slices/singleUseProductTypeSlice';
import { PATH } from '../../../routes/path';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
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
  Stack,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import './SingleUseProductType.css';

const SingleUseProductType = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    productTypes = [],
    pagination,
    isLoading,
    error,
  } = useSelector((state) => state.singleUseProductType);

  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({ name: '' });
  const [formErrors, setFormErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isActiveFilter, setIsActiveFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [newlyCreatedTypeId, setNewlyCreatedTypeId] = useState(null);

  useEffect(() => {
    loadProductTypes();
  }, [currentPage, isActiveFilter]);

  const loadProductTypes = () => {
    dispatch(
      getAllSingleUseProductTypesApi({
        page: currentPage,
        limit: 10,
        isActive: isActiveFilter || undefined,
      })
    );
  };

  const handleOpenDialog = () => {
    setFormData({ name: '' });
    setFormErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({ name: '' });
    setFormErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
    if (!formData.name.trim()) {
      errors.name = 'Product type name is required';
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
      const result = await dispatch(
        createSingleUseProductTypeApi({
          name: formData.name.trim(),
        })
      ).unwrap();
      handleCloseDialog();
      loadProductTypes();
      
      // Navigate to product size page and open create modal for newly created type
      if (result?.data?._id) {
        setNewlyCreatedTypeId(result.data._id);
        navigate(`${PATH.ADMIN_SINGLE_USE_PRODUCT_SIZE.replace(':productTypeId', result.data._id)}?openCreate=true`);
      }
    } catch (error) {
      // Error handled by thunk
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await dispatch(
        updateSingleUseProductTypeStatusApi({
          id,
          isActive: !currentStatus,
        })
      ).unwrap();
      loadProductTypes();
    } catch (error) {
      // Error handled by thunk
    }
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleFilterChange = (newFilter) => {
    setIsActiveFilter(newFilter);
    setCurrentPage(1);
  };

  // Filter by search query
  const filteredProductTypes = productTypes.filter((item) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return item.name?.toLowerCase().includes(query);
  });

  // Get counts
  const getActiveCount = () => {
    return productTypes.filter((item) => item.isActive === true).length;
  };

  const getInactiveCount = () => {
    return productTypes.filter((item) => item.isActive === false).length;
  };

  return (
    <Box className="single-use-product-type-page" sx={{ p: 3, backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      {/* Header Section */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
            <Box>
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
                Single-Use Product Types
              </Typography>
              <Typography variant="body1" sx={{ color: '#6b7280', fontSize: '0.95rem' }}>
                Manage single-use product types for the system
              </Typography>
            </Box>
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
            Add Product Type
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
                Total Product Types
              </Typography>
              <CategoryIcon sx={{ fontSize: 20, color: '#9ca3af' }} />
            </Box>
            <Typography variant="h4" sx={{ color: '#1a1a1a', fontWeight: 700 }}>
              {productTypes.length}
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

        {/* Search and Filter */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <TextField
            size="small"
            placeholder="Search by product type name..."
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
        ) : filteredProductTypes.length === 0 ? (
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
              No product types found
            </Typography>
            <Typography variant="body2" sx={{ color: '#6b7280', mb: 3, maxWidth: 400, mx: 'auto' }}>
              {searchQuery
                ? `No product types found matching "${searchQuery}"`
                : 'Start by creating your first single-use product type'}
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
                Create Product Type
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
                      Product Type Name
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
                  {filteredProductTypes.map((item) => (
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
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1.5,
                            cursor: 'pointer',
                            '&:hover': {
                              opacity: 0.7,
                            },
                          }}
                          onClick={() => navigate(PATH.ADMIN_SINGLE_USE_PRODUCT_SIZE.replace(':productTypeId', item._id))}
                        >
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
                            {item.name}
                          </Typography>
                        </Box>
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
            {pagination?.totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <Pagination
                  count={pagination.totalPages}
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
            Create Single-Use Product Type
          </Typography>
        </DialogTitle>

        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: 2.25, pb: 2, px: 2.25 }}>
            <TextField
              fullWidth
              label="Product Type Name"
              placeholder="e.g., Cold plastic cup, Paper container"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              variant="outlined"
              size="small"
              error={!!formErrors.name}
              helperText={formErrors.name || 'Enter a clear and descriptive name for the product type'}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CategoryIcon sx={{ color: '#12422a' }} />
                  </InputAdornment>
                ),
              }}
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

export default SingleUseProductType;

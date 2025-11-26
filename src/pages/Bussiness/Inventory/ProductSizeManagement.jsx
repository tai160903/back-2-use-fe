import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  Divider,
  Alert,
  Paper,
  Pagination,
  Stack,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Inventory2 as InventoryIcon,
  Close as CloseIcon,
  Straighten as SizeIcon,
  AttachMoney as MoneyIcon,
  Description as DescriptionIcon,
  Scale as ScaleIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
  getMyProductGroups,
  getProductSizes,
  createProductSize,
  updateProductSize,
} from '../../../store/slices/bussinessSlice';
import { PATH } from '../../../routes/path';
import toast from 'react-hot-toast';
import './ProductSizeManagement.css';

export default function ProductSizeManagement() {
  const { productGroupId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    productGroups,
    productSizes,
    productSizeLoading,
    productSizeError,
  } = useSelector((state) => state.businesses);

  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    sizeName: '',
    basePrice: '',
    weight: '',
    description: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Get current product group
  const productGroup = productGroups.find(
    (pg) => (pg.id || pg._id) === productGroupId
  );

  useEffect(() => {
    // Load product groups if not loaded
    if (productGroups.length === 0) {
      dispatch(getMyProductGroups());
    }
  }, [dispatch, productGroups.length]);

  useEffect(() => {
    // Load product sizes when productGroupId is available
    // Load all sizes first, then paginate on client side
    if (productGroupId) {
      dispatch(getProductSizes({ productGroupId, page: 1, limit: 1000 }));
    }
  }, [dispatch, productGroupId]);

  // Client-side pagination
  const totalPages = Math.ceil(productSizes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSizes = productSizes.slice(startIndex, endIndex);

  // Reset to page 1 when productSizes change
  useEffect(() => {
    setCurrentPage(1);
  }, [productSizes.length]);

  const handleBack = () => {
    navigate(PATH.BUSINESS_INVENTORY);
  };

  const handleOpenDialog = () => {
    setEditMode(false);
    setSelectedSize(null);
    setFormData({
      sizeName: '',
      basePrice: '',
      weight: '',
      description: '',
    });
    setFormErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditMode(false);
    setSelectedSize(null);
    setFormData({
      sizeName: '',
      basePrice: '',
      weight: '',
      description: '',
    });
    setFormErrors({});
  };

  const handleEdit = (size) => {
    setEditMode(true);
    setSelectedSize(size);
    setFormData({
      sizeName: size.sizeName || '',
      basePrice: size.basePrice || '',
      weight: size.weight || '',
      description: size.description || '',
    });
    setFormErrors({});
    setOpenDialog(true);
  };

  const handleDelete = (size) => {
    setSelectedSize(size);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    // TODO: Implement delete API if available
    toast.error('Delete functionality not yet implemented');
    setOpenDeleteDialog(false);
    setSelectedSize(null);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.sizeName.trim()) {
      errors.sizeName = 'Size name is required';
    }
    if (!formData.basePrice || formData.basePrice <= 0) {
      errors.basePrice = 'Base price must be greater than 0';
    }
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      const sizeData = {
        sizeName: formData.sizeName.trim(),
        basePrice: Number(formData.basePrice),
        weight: formData.weight ? Number(formData.weight) : undefined,
        description: formData.description.trim(),
      };

      if (editMode && selectedSize) {
        // Update existing size
        await dispatch(
          updateProductSize({
            id: selectedSize.id || selectedSize._id,
            productSizeData: sizeData,
          })
        ).unwrap();
        toast.success('Product size updated successfully');
      } else {
        // Create new size
        await dispatch(
          createProductSize({
            productGroupId: productGroupId,
            ...sizeData,
          })
        ).unwrap();
        toast.success('Product size created successfully');
      }

      // Reload product sizes
      dispatch(getProductSizes({ productGroupId, page: 1, limit: 1000 }));
      handleCloseDialog();
    } catch (error) {
      const errorMessage =
        error?.message ||
        error?.data?.message ||
        'Failed to save product size';
      toast.error(errorMessage);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  if (!productGroup) {
    return (
      <Box className="product-size-management">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Typography>Loading product group...</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="product-size-management">
      {/* Header */}
      <Box className="size-header">
        <Box className="header-top">
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            className="back-button"
          >
            Back to Types
          </Button>
        </Box>
        <Box className="header-main">
          <Box className="header-left">
            <Box className="header-title-section">
              <SizeIcon className="header-icon" />
              <Box>
                <Typography variant="h4" className="header-title">
                  Product Sizes
                </Typography>
                <Typography variant="body2" className="header-subtitle">
                  Manage sizes for {productGroup.name || 'Product Type'}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
            className="add-button"
          >
            Add Size
          </Button>
        </Box>
      </Box>

      {/* Product Sizes Grid */}
      {productSizeLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <Typography>Loading...</Typography>
        </Box>
      ) : productSizeError ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <Typography color="error">
            Error loading product sizes:{' '}
            {typeof productSizeError === 'string'
              ? productSizeError
              : productSizeError?.message ||
                productSizeError?.error ||
                productSizeError?.data?.message ||
                'Unknown error'}
          </Typography>
        </Box>
      ) : productSizes.length === 0 ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <Typography color="textSecondary">
            No product sizes found. Click "+ Add Size" to create one.
          </Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={3} className="sizes-grid">
            {paginatedSizes.map((size) => (
            <Grid item xs={12} sm={6} md={4} key={size.id || size._id}>
              <Card className="size-card">
                <CardContent>
                  <Box className="card-header">
                    <Box className="card-title-section">
                      <SizeIcon className="card-icon" />
                      <Box>
                        <Typography variant="h6" className="card-title">
                          {size.sizeName}
                        </Typography>
                      </Box>
                    </Box>
                    <Box className="card-actions">
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(size)}
                        className="edit-button"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(size)}
                        className="delete-button"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>

                  <Box className="card-details">
                    <Box className="detail-row">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <MoneyIcon sx={{ fontSize: 18, color: '#16a34a', flexShrink: 0 }} />
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: '#6b7280',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                          }}
                        >
                          Base Price
                        </Typography>
                      </Box>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          color: '#16a34a', 
                          fontWeight: 700,
                          fontSize: '1.125rem',
                        }}
                      >
                        {formatPrice(size.basePrice)}
                      </Typography>
                    </Box>
                    {size.weight && (
                      <Box className="detail-row">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <ScaleIcon sx={{ fontSize: 18, color: '#12422a', flexShrink: 0 }} />
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#6b7280',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            Weight
                          </Typography>
                        </Box>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            color: '#374151',
                            fontWeight: 600,
                            fontSize: '1rem',
                          }}
                        >
                          {size.weight} g
                        </Typography>
                      </Box>
                    )}
                    <Box className="detail-row">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <DescriptionIcon sx={{ fontSize: 18, color: '#12422a', flexShrink: 0 }} />
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: '#6b7280',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                          }}
                        >
                          Description
                        </Typography>
                      </Box>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#374151',
                          fontSize: '0.875rem',
                          lineHeight: 1.6,
                        }}
                      >
                        {size.description}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                mt: 4,
                mb: 2
              }}
            >
              <Stack spacing={2}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(event, value) => {
                    setCurrentPage(value);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  variant="outlined"
                  shape="rounded"
                  color="primary"
                  showFirstButton
                  showLastButton
                  sx={{
                    '& .MuiPaginationItem-root': {
                      fontSize: '1rem',
                      fontWeight: 500,
                      '&.Mui-selected': {
                        backgroundColor: '#12422a !important',
                        color: '#ffffff !important',
                        fontWeight: 600,
                        '&:hover': {
                          backgroundColor: '#0d2e1c !important',
                        },
                      },
                      '&:hover': {
                        backgroundColor: 'rgba(18, 66, 42, 0.1) !important',
                      },
                    },
                  }}
                />
              </Stack>
            </Box>
          )}
        </>
      )}

      {/* Add/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        TransitionProps={{
          timeout: 400,
        }}
        PaperProps={{
          className: 'add-size-dialog',
        }}
      >
        <DialogTitle className="dialog-title-section">
          <Box className="dialog-header">
            <Box className="header-left">
              <Box className="header-title-section">
                <SizeIcon className="header-icon" />
                <Box>
                  <Typography variant="h6" component="div" className="dialog-title">
                    {editMode ? 'Edit Product Size' : 'Create New Product Size'}
                  </Typography>
                  <Typography variant="body2" className="dialog-subtitle">
                    {editMode
                      ? 'Update your product size details'
                      : `Add a new size for ${productGroup.name || 'Product Type'}`}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <IconButton
              onClick={handleCloseDialog}
              size="small"
              className="close-button"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <form onSubmit={handleSubmit} className="dialog-form">
          <DialogContent className="dialog-content-custom">
            <Grid container spacing={2}>
              {/* Size Name Field */}
              <Grid item xs={6}>
                <Box sx={{ mb: 0.5 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#12422a',
                      fontWeight: 600,
                      mb: 0.75,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.75,
                    }}
                  >
                    <SizeIcon sx={{ fontSize: 16 }} />
                    Size Name <span style={{ color: '#f44336' }}>*</span>
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  placeholder="e.g., Small, Medium, Large"
                  name="sizeName"
                  value={formData.sizeName}
                  onChange={(e) => {
                    setFormData({ ...formData, sizeName: e.target.value });
                    if (formErrors.sizeName) {
                      setFormErrors({ ...formErrors, sizeName: '' });
                    }
                  }}
                  required
                  variant="outlined"
                  size="small"
                  error={!!formErrors.sizeName}
                  helperText={
                    formErrors.sizeName ||
                    'Enter a clear size name (e.g., Small, Medium, Large)'
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SizeIcon sx={{ color: '#12422a' }} />
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
              </Grid>

              {/* Base Price Field */}
              <Grid item xs={6}>
                <Box sx={{ mb: 0.5 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#12422a',
                      fontWeight: 600,
                      mb: 0.75,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.75,
                    }}
                  >
                    <MoneyIcon sx={{ fontSize: 16 }} />
                    Base Price <span style={{ color: '#f44336' }}>*</span>
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  placeholder="e.g., 50000"
                  name="basePrice"
                  type="number"
                  value={formData.basePrice}
                  onChange={(e) => {
                    setFormData({ ...formData, basePrice: e.target.value });
                    if (formErrors.basePrice) {
                      setFormErrors({ ...formErrors, basePrice: '' });
                    }
                  }}
                  required
                  variant="outlined"
                  size="small"
                  error={!!formErrors.basePrice}
                  helperText={
                    formErrors.basePrice || 'Enter the base price in VND'
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MoneyIcon sx={{ color: '#12422a' }} />
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
              </Grid>

              {/* Weight Field */}
              <Grid item xs={6}>
                <Box sx={{ mb: 0.5 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#12422a',
                      fontWeight: 600,
                      mb: 0.75,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.75,
                    }}
                  >
                    <ScaleIcon sx={{ fontSize: 16 }} />
                    Weight (grams)
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  placeholder="e.g., 500"
                  name="weight"
                  type="number"
                  value={formData.weight}
                  onChange={(e) => {
                    setFormData({ ...formData, weight: e.target.value });
                    if (formErrors.weight) {
                      setFormErrors({ ...formErrors, weight: '' });
                    }
                  }}
                  variant="outlined"
                  size="small"
                  error={!!formErrors.weight}
                  helperText={
                    formErrors.weight || 'Enter the weight in grams (optional)'
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ScaleIcon sx={{ color: '#12422a' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <Typography variant="caption" sx={{ color: '#666' }}>
                          g
                        </Typography>
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
              </Grid>

              {/* Description Field */}
              <Grid item size={12}>
                <Box sx={{ mb: 0.5 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#12422a',
                      fontWeight: 600,
                      mb: 0.75,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.75,
                    }}
                  >
                    <DescriptionIcon sx={{ fontSize: 16 }} />
                    Description <span style={{ color: '#f44336' }}>*</span>
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  placeholder="e.g., 500ml bottle, 12oz cup"
                  name="description"
                  value={formData.description}
                  onChange={(e) => {
                    setFormData({ ...formData, description: e.target.value });
                    if (formErrors.description) {
                      setFormErrors({ ...formErrors, description: '' });
                    }
                  }}
                  required
                  multiline
                  minRows={3}
                  variant="outlined"
                  size="small"
                  error={!!formErrors.description}
                  helperText={
                    formErrors.description ||
                    'Provide detailed information about this size'
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        sx={{ alignSelf: 'flex-start', mt: 1.2 }}
                      >
                        <DescriptionIcon
                          sx={{ color: '#12422a', fontSize: 18 }}
                        />
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
              </Grid>

              {/* Info Box */}
              <Grid item xs={12}>
                <Box
                  sx={{
                    p: 2,
                    background:
                      'linear-gradient(135deg, rgba(18, 66, 42, 0.08) 0%, rgba(18, 66, 42, 0.02) 100%)',
                    borderRadius: 2,
                    border: '2px solid rgba(18, 66, 42, 0.25)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1.5,
                    boxShadow: '0 2px 8px rgba(18, 66, 42, 0.1)',
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: '#12422a',
                      borderRadius: '50%',
                      p: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '36px',
                      height: '36px',
                    }}
                  >
                    <SizeIcon sx={{ color: 'white', fontSize: 20 }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{ color: '#12422a', fontWeight: 700, mb: 0.5 }}
                    >
                      📦 Product Size Management
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#12422a',
                        lineHeight: 1.5,
                        display: 'block',
                      }}
                    >
                      Create different sizes for your product group. Each size
                      can have its own base price and description. Customers
                      will be able to choose from these sizes when renting your
                      products.
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions className="dialog-actions-custom">
            <Button
              onClick={handleCloseDialog}
              startIcon={<CloseIcon fontSize="small" />}
              className="cancel-button"
              size="small"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              startIcon={
                editMode ? (
                  <EditIcon fontSize="small" />
                ) : (
                  <AddIcon fontSize="small" />
                )
              }
              disabled={productSizeLoading}
              className="create-button"
              size="small"
            >
              {productSizeLoading
                ? 'Saving...'
                : editMode
                ? 'Update Size'
                : 'Create Size'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(211, 47, 47, 0.15)'
          }
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
            color: 'white',
            py: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <DeleteIcon sx={{ fontSize: 32 }} />
            <Box>
              <Typography variant="h5" component="div" fontWeight="bold">
                Delete Product Size
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                This action cannot be undone
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={() => setOpenDeleteDialog(false)}
            sx={{
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 4, pb: 3 }}>
          {selectedSize && (
            <Box>
              <Alert
                severity="warning"
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  '& .MuiAlert-message': {
                    width: '100%'
                  }
                }}
              >
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  ⚠️ Warning
                </Typography>
                <Typography variant="body2">
                  This action is permanent and cannot be undone. The product size will be completely removed from your inventory.
                </Typography>
              </Alert>

              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  backgroundColor: 'rgba(244, 67, 54, 0.05)',
                  borderRadius: 2,
                  border: '1px solid rgba(244, 67, 54, 0.2)'
                }}
              >
                <Typography variant="body1" gutterBottom sx={{ fontWeight: 600, color: '#d32f2f' }}>
                  Are you sure you want to delete this product size?
                </Typography>

                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SizeIcon sx={{ color: '#f44336', fontSize: 20 }} />
                  <Typography variant="body2" color="text.secondary">
                    Size Name:
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ mt: 1, color: '#1B5E20', fontWeight: 'bold' }}>
                  {selectedSize.sizeName}
                </Typography>
              </Paper>
            </Box>
          )}
        </DialogContent>

        <Divider />

        <DialogActions sx={{ px: 3, py: 2.5, gap: 1.5 }}>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            variant="outlined"
            sx={{
              color: '#666',
              borderColor: '#ddd',
              px: 3,
              py: 1,
              '&:hover': {
                borderColor: '#999',
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            startIcon={<DeleteIcon />}
            sx={{
              backgroundColor: '#f44336',
              px: 3,
              py: 1,
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(244, 67, 54, 0.35)',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: '#d32f2f',
                boxShadow: '0 6px 16px rgba(244, 67, 54, 0.45)',
                transform: 'translateY(-2px)',
              }
            }}
          >
            Delete Size
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  CircularProgress,
  Pagination,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Inventory2 as InventoryIcon,
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
  Straighten as SizeIcon,
  Category as CategoryIcon,
  Description as DescriptionIcon,
  Image as ImageIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getApprovedMaterials, 
  createProductGroup, 
  getMyProductGroups,
} from '../../../store/slices/bussinessSlice';
import { getBusinessProductsByGroup } from '../../../store/slices/storeSilce';
import { PATH } from '../../../routes/path';
import './InventoryManagement.css';

export default function InventoryManagement() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { 
    approvedMaterials, 
    productGroups,
    productGroupLoading,
    productGroupError
  } = useSelector((state) => state.businesses);

  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    typeName: '',
    description: '',
    materialId: '',
    image: null,
  });

  // Load approved materials and product groups on component mount
  useEffect(() => {
    dispatch(getApprovedMaterials());
    dispatch(getMyProductGroups());
  }, [dispatch]);

  // State to store products by product group ID
  const [productsByGroup, setProductsByGroup] = useState({});

  // Load all products for all product groups to calculate available/non-available counts
  useEffect(() => {
    if (productGroups.length > 0) {
      // Load products for all product groups using new API
      const loadProductsForGroups = async () => {
        const productsMap = {};
        
        for (const pg of productGroups) {
          const pgId = pg.id || pg._id;
          if (pgId) {
            try {
              const result = await dispatch(getBusinessProductsByGroup({ 
                productGroupId: pgId, 
                page: 1, 
                limit: 1000 
              })).unwrap();
              const productsList = result?.data?.products || result?.products || result?.data || [];
              productsMap[pgId] = Array.isArray(productsList) ? productsList : [];
            } catch (error) {
              console.error(`Error loading products for group ${pgId}:`, error);
              productsMap[pgId] = [];
            }
          }
        }
        
        setProductsByGroup(productsMap);
      };
      
      loadProductsForGroups();
    }
  }, [dispatch, productGroups]);

  const handleOpenDialog = () => {
    setEditMode(false);
    setSelectedProduct(null);
    setSelectedImage(null);
    setImagePreview(null);
    setFormData({
      typeName: '',
      description: '',
      materialId: '',
      image: null,
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditMode(false);
    setSelectedProduct(null);
    setSelectedImage(null);
    setImagePreview(null);
    setFormData({
      typeName: '',
      description: '',
      materialId: '',
      image: null,
    });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setFormData({ ...formData, image: file });
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = (product) => {
    setEditMode(true);
    setSelectedProduct(product);
    setSelectedImage(null);
    setImagePreview(product.image || product.imageUrl || null);
    // Ensure materialId is extracted correctly (could be string or object)
    let materialId = '';
    if (product.materialId) {
      materialId = typeof product.materialId === 'string' 
        ? product.materialId 
        : (product.materialId._id || product.materialId.id || '');
    } else if (product.material?.id) {
      materialId = product.material.id;
    } else if (product.material?._id) {
      materialId = product.material._id;
    }
    
    setFormData({
      typeName: product.name || product.typeName,
      description: product.description || '',
      materialId: materialId,
      image: null,
    });
    setOpenDialog(true);
  };

  const handleDelete = (product) => {
    setSelectedProduct(product);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (selectedProduct) {
      // TODO: Implement delete API if available
      // For now, just update local state (will be refreshed on next load)
      setOpenDeleteDialog(false);
      setSelectedProduct(null);
      // Reload product groups
      dispatch(getMyProductGroups());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.typeName || !formData.materialId) {
      return; // Basic validation
    }

    if (editMode && selectedProduct) {
      // TODO: Implement update API if available
      // For now, just close dialog
      handleCloseDialog();
      return;
    }

    try {
      // Create product group with API
      const productGroupData = {
        materialId: formData.materialId,
        name: formData.typeName,
        description: formData.description || '',
        image: selectedImage || null,
      };

      await dispatch(createProductGroup(productGroupData)).unwrap();
      
      // Reload product groups after creation
      dispatch(getMyProductGroups());
      
      handleCloseDialog();
    } catch (error) {
      console.error('Error creating product group:', error);
      // Handle error (you can add toast notification here)
    }
  };

  // Map product groups to display format
  const productTypes = (Array.isArray(productGroups) ? productGroups : []).map((pg) => {
    if (!pg) return null; // Skip null/undefined items
    
    // Handle materialId - it can be either a string ID or an object with _id and materialName
    let materialId = pg.materialId;
    let materialName = '';
    let material = null;

    if (pg.materialId && typeof pg.materialId === 'object' && pg.materialId !== null) {
      // materialId is an object (populated)
      materialId = pg.materialId._id || pg.materialId.id || '';
      materialName = pg.materialId.materialName || pg.materialId.name || '';
    } else if (pg.materialId && typeof pg.materialId === 'string') {
      // materialId is a string, find material from approvedMaterials
      materialId = pg.materialId;
      material = Array.isArray(approvedMaterials) ? approvedMaterials.find(
        (m) => (m?.id || m?._id) === materialId
      ) : null;
      materialName = material?.materialName || material?.name || '';
    }

    // Calculate available and non-available from actual products
    const pgId = pg.id || pg._id;
    
    // Get products for this specific product group from productsByGroup state
    const productsForGroup = productsByGroup[pgId] || [];

    const availableCount = productsForGroup.filter((p) => (p.status || 'available') === 'available').length;
    const nonAvailableCount = productsForGroup.filter((p) => (p.status || 'available') === 'non-available').length;
    
    return {
      id: pgId,
      typeName: pg.name || '',
      category: materialName || 'General',
      description: pg.description || '',
      material: materialName,
      materialId: materialId || '',
      available: availableCount,
      nonAvailable: nonAvailableCount,
      image: pg.image || pg.imageUrl || '',
    };
  }).filter(item => item !== null); // Remove any null items

  const filteredProducts = productTypes.filter(product =>
    product.typeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const itemsPerPage = 9;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate statistics
  const totalProductTypes = productTypes.length;
  const totalAvailable = productTypes.reduce((sum, p) => sum + p.available, 0);
  const totalNonAvailable = productTypes.reduce((sum, p) => sum + p.nonAvailable, 0);
  const totalItems = totalAvailable + totalNonAvailable;

  return (
    <Box className="inventory-management" sx={{ p: 3, fontFamily: 'inherit', backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      {/* Header Section */}
      <Box className="inventory-header" sx={{ mb: 3 }}>
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
              <InventoryIcon sx={{ fontSize: 32, color: 'white' }} />
            </Box>
            <Box>
              <Typography 
                variant="h4" 
                component="h1" 
                fontWeight={700} 
                sx={{ 
                  color: '#1a1a1a', 
                  fontFamily: 'inherit',
                  mb: 0.5
                }}
              >
                Inventory Management
              </Typography>
              <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.875rem' }}>
                Manage your store's reusable packaging inventory
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
            sx={{
              backgroundColor: '#12422a',
              color: '#ffffff',
              textTransform: 'none',
              fontWeight: 600,
              padding: '12px 24px',
              borderRadius: 2,
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
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mb: 3 }}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 2.5, 
              borderRadius: 2, 
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                transform: 'translateY(-2px)',
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 500 }}>
                Total Product Types
              </Typography>
              <CategoryIcon sx={{ fontSize: 20, color: '#12422a' }} />
            </Box>
            <Typography variant="h4" sx={{ color: '#1a1a1a', fontWeight: 700 }}>
              {totalProductTypes}
            </Typography>
          </Paper>

          <Paper 
            elevation={0}
            sx={{ 
              p: 2.5, 
              borderRadius: 2, 
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                transform: 'translateY(-2px)',
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 500 }}>
                Total Items
              </Typography>
              <TrendingUpIcon sx={{ fontSize: 20, color: '#12422a' }} />
            </Box>
            <Typography variant="h4" sx={{ color: '#1a1a1a', fontWeight: 700 }}>
              {totalItems}
            </Typography>
          </Paper>

          <Paper 
            elevation={0}
            sx={{ 
              p: 2.5, 
              borderRadius: 2, 
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                transform: 'translateY(-2px)',
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 500 }}>
                Available
              </Typography>
              <CheckCircleIcon sx={{ fontSize: 20, color: '#16a34a' }} />
            </Box>
            <Typography variant="h4" sx={{ color: '#16a34a', fontWeight: 700 }}>
              {totalAvailable}
            </Typography>
          </Paper>

          <Paper 
            elevation={0}
            sx={{ 
              p: 2.5, 
              borderRadius: 2, 
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                transform: 'translateY(-2px)',
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 500 }}>
                Non-Available
              </Typography>
              <CancelIcon sx={{ fontSize: 20, color: '#ef4444' }} />
            </Box>
            <Typography variant="h4" sx={{ color: '#ef4444', fontWeight: 700 }}>
              {totalNonAvailable}
            </Typography>
          </Paper>
        </Box>

        {/* Search Bar */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search by type name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              backgroundColor: 'white',
              borderRadius: 2,
              '& .MuiOutlinedInput-root': {
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

      {/* Product Types Grid */}
      {productGroupLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <Typography>Loading...</Typography>
        </Box>
      ) : productGroupError ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <Typography color="error">
            Error loading product groups: {
              typeof productGroupError === 'string' 
                ? productGroupError 
                : productGroupError?.message 
                || productGroupError?.error 
                || productGroupError?.data?.message
                || 'Unknown error'
            }
          </Typography>
        </Box>
      ) : filteredProducts.length === 0 ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <Typography color="textSecondary">
            No product groups found. Click "+ Add Product Type" to create one.
          </Typography>
        </Box>
      ) : (
        <>
          <Grid 
            container 
            spacing={3} 
            className="products-grid"
            sx={{ alignItems: 'stretch' }}
          >
            {currentProducts.map((product) => (
            <Grid 
              item 
              xs={12} 
              sm={6} 
              md={4} 
              key={product.id}
              sx={{ 
                display: 'flex'
              }}
            >
              <Card 
                className="product-card"
                onClick={() => navigate(`/business/inventory/${product.id}/items`)}
                sx={{ 
                  cursor: 'pointer', 
                  height: '100%', 
                  width: '100%',
                  display: 'flex', 
                  flexDirection: 'column',
                  overflow: 'hidden',
                  borderRadius: 2,
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                    transform: 'translateY(-4px)',
                    borderColor: '#12422a',
                  }
                }}
              >
                <CardContent 
                  sx={{ 
                    flexGrow: 1, 
                    display: 'flex', 
                    flexDirection: 'column',
                    p: 2.5,
                    width: '100%'
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, flex: 1, minWidth: 0 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 1.5,
                          backgroundColor: '#f0f9f4',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <InventoryIcon sx={{ fontSize: 24, color: '#12422a' }} />
                      </Box>
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography 
                          variant="h6" 
                          sx={{
                            fontSize: '1.125rem',
                            fontWeight: 700,
                            color: '#1a1a1a',
                            mb: 0.5,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            wordBreak: 'break-word',
                            overflowWrap: 'break-word',
                            lineHeight: 1.4,
                          }}
                        >
                          {product.typeName}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{
                            fontSize: '0.75rem',
                            color: '#6b7280',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            fontWeight: 500,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {product.category}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/business/inventory/${product.id}/sizes`);
                        }}
                        sx={{
                          color: '#0d9488',
                          '&:hover': {
                            backgroundColor: 'rgba(13, 148, 136, 0.1)',
                          },
                        }}
                        title="Manage Sizes"
                      >
                        <SizeIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(product);
                        }}
                        sx={{
                          color: '#12422a',
                          '&:hover': {
                            backgroundColor: 'rgba(18, 66, 42, 0.1)',
                          },
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(product);
                        }}
                        sx={{
                          color: '#ef4444',
                          '&:hover': {
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                          },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, flexGrow: 1 }}>
                    <Box>
                      <Typography 
                        variant="body2" 
                        sx={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: '#6b7280',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          mb: 0.5,
                        }}
                      >
                        Description
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{
                          fontSize: '0.875rem',
                          color: '#374151',
                          lineHeight: 1.6,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word'
                        }}
                      >
                        {product.description || 'No description'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography 
                        variant="body2" 
                        sx={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: '#6b7280',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          mb: 0.5,
                        }}
                      >
                        Material
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{
                          fontSize: '0.875rem',
                          color: '#374151',
                          fontWeight: 500,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {product.material}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 3, mt: 'auto', pt: 1.5, borderTop: '1px solid #f3f4f6' }}>
                      <Box>
                        <Typography 
                          variant="body2" 
                          sx={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: '#6b7280',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            mb: 0.5,
                          }}
                        >
                          Available
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#16a34a', fontWeight: 700, fontSize: '1.25rem' }}>
                          {product.available}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography 
                          variant="body2" 
                          sx={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: '#6b7280',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            mb: 0.5,
                          }}
                        >
                          Non-Available
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#ef4444', fontWeight: 700, fontSize: '1.25rem' }}>
                          {product.nonAvailable}
                        </Typography>
                      </Box>
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
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
                sx={{
                  '& .MuiPaginationItem-root': {
                    fontSize: '1rem',
                    fontWeight: 500,
                  },
                  '& .Mui-selected': {
                    backgroundColor: '#12422a !important',
                    color: '#ffffff !important',
                  },
                }}
              />
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
          className: 'add-product-dialog',
        }}
      >
        <DialogTitle className="dialog-title-section">
          <Box className="dialog-header">
            <Box className="header-left">
              <Box className="header-title-section">
                <InventoryIcon className="header-icon" />
                <Box>
                  <Typography variant="h6" component="div" className="dialog-title">
                    {editMode ? 'Edit Product Type' : 'Create New Product Type'}
                  </Typography>
                  <Typography variant="body2" className="dialog-subtitle">
                    {editMode
                      ? 'Update your product type details'
                      : 'Create a new product type for your packaging items'}
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
              {/* Product Type Name Field */}
              <Grid item xs={4}>
                <Box sx={{ mb: 0.5 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#12422a',
                      fontWeight: 600,
                      mb: 0.75,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.75
                    }}
                  >
                    <CategoryIcon sx={{ fontSize: 16 }} />
                    Product Type Name <span style={{ color: '#f44336' }}>*</span>
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  placeholder="e.g., Coffee Cup, Food Container"
                  name="typeName"
                  value={formData.typeName}
                  onChange={(e) => setFormData({ ...formData, typeName: e.target.value })}
                  required
                  variant="outlined"
                  size="small"
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
                        borderColor: '#4CAF50',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#4CAF50',
                        borderWidth: 2,
                      },
                    },
                  }}
                />
              </Grid>

              {/* Material Select Field */}
              <Grid item xs={4}>
                <Box sx={{ mb: 0.5 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#12422a',
                      fontWeight: 600,
                      mb: 0.75,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.75
                    }}
                  >
                    <InventoryIcon sx={{ fontSize: 16 }} />
                    Material <span style={{ color: '#f44336' }}>*</span>
                  </Typography>
                </Box>
                <FormControl
                  fullWidth
                  variant="outlined"
                  size="small"
                  error={approvedMaterials.length === 0}
                  disabled={approvedMaterials.length === 0}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'white',
                      '&:hover fieldset': {
                        borderColor: '#4CAF50',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#4CAF50',
                        borderWidth: 2,
                      },
                    },
                  }}
                >
                  <Select
                    value={formData.materialId}
                    onChange={(e) => setFormData({ ...formData, materialId: e.target.value })}
                  >
                    {approvedMaterials.map((material) => (
                      <MenuItem key={material.id || material._id} value={material.id || material._id}>
                        {material.materialName || material.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {approvedMaterials.length === 0 && (
                    <FormHelperText>
                      No materials available. Please contact admin to add materials.
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
                   {/* Upload Image Field */}
              <Grid item xs={4}>
                <Box sx={{ mb: 0.5 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#12422a',
                      fontWeight: 600,
                      mb: 0.75,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.75
                    }}
                  >
                    <ImageIcon sx={{ fontSize: 16 }} />
                    Upload Image
                  </Typography>
                </Box>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="image-upload"
                  type="file"
                  onChange={handleImageChange}
                />
                <label htmlFor="image-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<CloudUploadIcon />}
                    fullWidth
                    sx={{
                      backgroundColor: 'white',
                      borderColor: '#4CAF50',
                      color: '#2E7D32',
                      '&:hover': {
                        borderColor: '#388E3C',
                        backgroundColor: 'rgba(76, 175, 80, 0.05)',
                      },
                    }}
                  >
                    {selectedImage ? selectedImage.name : 'Choose File (No file chosen)'}
                  </Button>
                </label>
                {imagePreview && (
                  <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '200px', 
                        borderRadius: '8px',
                        border: '2px solid rgba(76, 175, 80, 0.3)'
                      }} 
                    />
                  </Box>
                )}
                <Typography variant="caption" sx={{ mt: 0.5, display: 'block', color: '#666' }}>
                  This image will be applied to all items of this product type
                </Typography>
              </Grid>

              {/* Description Field */}
              <Grid item xs={12}>
                <Box sx={{ mb: 0.5 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#12422a',
                      fontWeight: 600,
                      mb: 0.75,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.75
                    }}
                  >
                    <DescriptionIcon sx={{ fontSize: 16 }} />
                    Description <span style={{ color: '#f44336' }}>*</span>
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  placeholder="Brief description of this product type"
                  name="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  multiline
                  minRows={3}
                  variant="outlined"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.2 }}>
                        <DescriptionIcon sx={{ color: '#12422a', fontSize: 18 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'white',
                      '&:hover fieldset': {
                        borderColor: '#4CAF50',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#4CAF50',
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
                    background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(46, 125, 50, 0.05) 100%)',
                    borderRadius: 2,
                    border: '2px solid rgba(76, 175, 80, 0.3)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1.5,
                    boxShadow: '0 2px 8px rgba(76, 175, 80, 0.1)'
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
                      height: '36px'
                    }}
                  >
                    <InventoryIcon sx={{ color: 'white', fontSize: 20 }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ color: '#12422a', fontWeight: 700, mb: 0.5 }}>
                      📦 Product Type Management
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#12422a', lineHeight: 1.5, display: 'block' }}>
                      Create a product type to organize your reusable packaging items. Each product type can have multiple sizes and items. 
                      All items of this type will share the same image and material.
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
              startIcon={editMode ? <EditIcon fontSize="small" /> : <AddIcon fontSize="small" />}
              disabled={!formData.typeName || !formData.materialId || productGroupLoading}
              className="create-button"
              size="small"
            >
              {productGroupLoading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={16} color="inherit" />
                  {editMode ? 'Updating...' : 'Creating...'}
                </Box>
              ) : (
                editMode ? 'Update Type' : 'Create Type'
              )}
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
                Delete Product Type
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
          {selectedProduct && (
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
                  This action is permanent and cannot be undone. The product type and all its associated items will be completely removed from your inventory.
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
                  Are you sure you want to delete this product type?
                </Typography>

                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CategoryIcon sx={{ color: '#f44336', fontSize: 20 }} />
                  <Typography variant="body2" color="text.secondary">
                    Product Type Name:
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ mt: 1, color: '#1B5E20', fontWeight: 'bold' }}>
                  {selectedProduct.typeName}
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
            Delete Type
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}


import React, { useState, useEffect, useMemo } from 'react';
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
  Tabs,
  Tab,
  Chip,
  Switch,
  FormControlLabel,
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
  Recycling as RecycleIcon,
  LocalOffer as SingleUseIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getApprovedMaterials, 
  createProductGroup, 
  getMyProductGroups,
} from '../../../store/slices/bussinessSlice';
import { getBusinessProductsByGroup } from '../../../store/slices/storeSilce';
import {
  getBusinessSingleUseProductTypesApi,
  getBusinessSingleUseProductSizesApi,
  getMySingleUseProductsApi,
  createBusinessSingleUseProductApi,
  updateBusinessSingleUseProductApi,
} from '../../../store/slices/singleUseProductTypeSlice';
import { PATH } from '../../../routes/path';
import toast from 'react-hot-toast';
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

  const {
    businessProductTypes = [],
    businessProductSizes = [],
    mySingleUseProducts = [],
    mySingleUseProductsPagination,
    isLoading: singleUseLoading,
  } = useSelector((state) => state.singleUseProductType);

  const [activeTab, setActiveTab] = useState(0); // 0: Reusable, 1: Single-Use
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openSingleUseDialog, setOpenSingleUseDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [singleUseCurrentPage, setSingleUseCurrentPage] = useState(1);
  const [isActiveFilter, setIsActiveFilter] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    typeName: '',
    description: '',
    materialId: '',
    image: null,
  });
  const [singleUseFormData, setSingleUseFormData] = useState({
    name: '',
    description: '',
    productTypeId: '',
    productSizeId: '',
    materialId: '',
    weight: '',
    image: null,
    isActive: true,
  });

  // Load approved materials and product groups on component mount
  useEffect(() => {
    dispatch(getApprovedMaterials());
    dispatch(getMyProductGroups());
    dispatch(getBusinessSingleUseProductTypesApi());
    dispatch(getMySingleUseProductsApi({ page: 1, limit: 100 }));
  }, [dispatch]);

  // Load product sizes when product type changes
  useEffect(() => {
    if (singleUseFormData.productTypeId) {
      dispatch(getBusinessSingleUseProductSizesApi(singleUseFormData.productTypeId));
    }
  }, [singleUseFormData.productTypeId, dispatch]);

  // Filter materials based on product type
  // For reusable products: only show materials where isSingleUse === false or undefined
  const reusableMaterials = useMemo(() => {
    return Array.isArray(approvedMaterials)
      ? approvedMaterials.filter((material) => !material.isSingleUse)
      : [];
  }, [approvedMaterials]);

  // For single-use products: only show materials where isSingleUse === true
  const singleUseMaterials = useMemo(() => {
    return Array.isArray(approvedMaterials)
      ? approvedMaterials.filter((material) => material.isSingleUse === true)
      : [];
  }, [approvedMaterials]);

  // Reset materialId for reusable form if current selection is not in filtered list
  useEffect(() => {
    if (formData.materialId) {
      if (reusableMaterials.length === 0) {
        // If no reusable materials available, reset materialId
        setFormData((prev) => ({ ...prev, materialId: '' }));
      } else {
        const isMaterialValid = reusableMaterials.some(
          (material) => (material.id || material._id) === formData.materialId
        );
        if (!isMaterialValid) {
          setFormData((prev) => ({ ...prev, materialId: '' }));
        }
      }
    }
  }, [approvedMaterials, formData.materialId, reusableMaterials]);

  // Reset materialId for single-use form if current selection is not in filtered list
  useEffect(() => {
    if (singleUseFormData.materialId) {
      if (singleUseMaterials.length === 0) {
        // If no single-use materials available, reset materialId
        setSingleUseFormData((prev) => ({ ...prev, materialId: '' }));
      } else {
        const isMaterialValid = singleUseMaterials.some(
          (material) => (material.id || material._id) === singleUseFormData.materialId
        );
        if (!isMaterialValid) {
          setSingleUseFormData((prev) => ({ ...prev, materialId: '' }));
        }
      }
    }
  }, [approvedMaterials, singleUseFormData.materialId, singleUseMaterials]);

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
    setIsCreating(false);
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
    setIsCreating(false);
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

    // Prevent multiple submissions
    if (isCreating) {
      return;
    }

    setIsCreating(true);
    try {
      // Create product group with API
      const productGroupData = {
        materialId: formData.materialId,
        name: formData.typeName,
        description: formData.description || '',
        image: selectedImage || null,
      };

      const result = await dispatch(createProductGroup(productGroupData)).unwrap();
      
      // Get the created product group ID
      const createdProductGroupId = result?.data?.id || result?.data?._id || result?.id || result?._id;
      
      if (createdProductGroupId) {
        // Navigate to product size page and open create modal
        navigate(`/business/inventory/${createdProductGroupId}/sizes?openDialog=true`);
      } else {
        // Fallback: reload product groups if ID not available
        dispatch(getMyProductGroups());
        toast.success('Product group created successfully!');
        handleCloseDialog();
      }
    } catch (error) {
      console.error('Error creating product group:', error);
      
      // Extract error message from API response
      const errorMessage = 
        error?.message || 
        error?.data?.message || 
        error?.response?.data?.message ||
        error?.error?.message ||
        'Failed to create product group. Please try again.';
      
      // Show error toast notification
      toast.error(errorMessage, {
        duration: 5000,
        style: {
          maxWidth: '500px',
        },
      });
    } finally {
      setIsCreating(false);
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
    setSingleUseCurrentPage(1);
  }, [searchQuery, activeTab]);

  // Filter single-use products
  const filteredSingleUseProducts = mySingleUseProducts.filter((product) => {
    const matchesSearch = !searchQuery.trim() || 
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesActive = !isActiveFilter || 
      (isActiveFilter === 'active' && product.isActive === true) ||
      (isActiveFilter === 'inactive' && product.isActive === false);
    return matchesSearch && matchesActive;
  });

  // Pagination for single-use products
  const singleUseItemsPerPage = 9;
  const singleUseTotalPages = Math.ceil(filteredSingleUseProducts.length / singleUseItemsPerPage);
  const singleUseStartIndex = (singleUseCurrentPage - 1) * singleUseItemsPerPage;
  const singleUseEndIndex = singleUseStartIndex + singleUseItemsPerPage;
  const currentSingleUseProducts = filteredSingleUseProducts.slice(singleUseStartIndex, singleUseEndIndex);

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

  // Single-use product statistics
  const totalSingleUseProducts = mySingleUseProducts.length;
  const activeSingleUseProducts = mySingleUseProducts.filter(p => p.isActive === true).length;
  const inactiveSingleUseProducts = mySingleUseProducts.filter(p => p.isActive === false).length;

  // Handlers for single-use products
  const handleOpenSingleUseDialog = () => {
    setEditMode(false);
    setSelectedProduct(null);
    setSelectedImage(null);
    setImagePreview(null);
    setIsCreating(false);
    setSingleUseFormData({
      name: '',
      description: '',
      productTypeId: '',
      productSizeId: '',
      materialId: '',
      weight: '',
      image: null,
      isActive: true,
    });
    setOpenSingleUseDialog(true);
  };

  const handleCloseSingleUseDialog = () => {
    setOpenSingleUseDialog(false);
    setEditMode(false);
    setSelectedProduct(null);
    setSelectedImage(null);
    setImagePreview(null);
    setIsCreating(false);
    setSingleUseFormData({
      name: '',
      description: '',
      productTypeId: '',
      productSizeId: '',
      materialId: '',
      weight: '',
      image: null,
      isActive: true,
    });
  };

  const handleSingleUseImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setSingleUseFormData({ ...singleUseFormData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditSingleUse = (product) => {
    setEditMode(true);
    setSelectedProduct(product);
    setSelectedImage(null);
    setImagePreview(product.image || product.imageUrl || null);
    setSingleUseFormData({
      name: product.name || '',
      description: product.description || '',
      productTypeId: product.productTypeId?._id || product.productTypeId || '',
      productSizeId: product.productSizeId?._id || product.productSizeId || '',
      materialId: product.materialId?._id || product.materialId || '',
      weight: product.weight || '',
      image: null,
      isActive: product.isActive !== undefined ? product.isActive : true,
    });
    // Load sizes for the selected product type
    if (product.productTypeId?._id || product.productTypeId) {
      dispatch(getBusinessSingleUseProductSizesApi(product.productTypeId?._id || product.productTypeId));
    }
    setOpenSingleUseDialog(true);
  };

  const handleSubmitSingleUse = async (e) => {
    e.preventDefault();
    if (!singleUseFormData.name || !singleUseFormData.productTypeId || !singleUseFormData.productSizeId || !singleUseFormData.materialId || !singleUseFormData.weight) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (isCreating) {
      return;
    }

    setIsCreating(true);
    try {
      if (editMode && selectedProduct) {
        await dispatch(
          updateBusinessSingleUseProductApi({
            productId: selectedProduct._id,
            productData: {
              name: singleUseFormData.name,
              description: singleUseFormData.description,
              weight: Number(singleUseFormData.weight),
              isActive: singleUseFormData.isActive,
              image: selectedImage,
            },
          })
        ).unwrap();
      } else {
        await dispatch(
          createBusinessSingleUseProductApi({
            name: singleUseFormData.name,
            description: singleUseFormData.description,
            productTypeId: singleUseFormData.productTypeId,
            productSizeId: singleUseFormData.productSizeId,
            materialId: singleUseFormData.materialId,
            weight: Number(singleUseFormData.weight),
            image: selectedImage,
          })
        ).unwrap();
      }
      handleCloseSingleUseDialog();
      dispatch(getMySingleUseProductsApi({ page: singleUseCurrentPage, limit: 100 }));
    } catch (error) {
      // Error handled by thunk
    } finally {
      setIsCreating(false);
    }
  };

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
                Manage your store's reusable and single-use packaging inventory
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={activeTab === 0 ? handleOpenDialog : handleOpenSingleUseDialog}
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
            {activeTab === 0 ? 'Add Reusable Product Type' : 'Add Single-Use Product'}
          </Button>
        </Box>

        {/* Tabs */}
        <Box sx={{ mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.9375rem',
                minHeight: 48,
              },
              '& .Mui-selected': {
                color: '#12422a',
              },
            }}
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab
              icon={<RecycleIcon />}
              iconPosition="start"
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>Reusable Products</span>
                  <Chip
                    label={totalProductTypes}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.75rem',
                      backgroundColor: '#e8f5e9',
                      color: '#2e7d32',
                      fontWeight: 600,
                    }}
                  />
                </Box>
              }
            />
            <Tab
              icon={<SingleUseIcon />}
              iconPosition="start"
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>Single-Use Products</span>
                  <Chip
                    label={totalSingleUseProducts}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.75rem',
                      backgroundColor: '#fff3e0',
                      color: '#f57c00',
                      fontWeight: 600,
                    }}
                  />
                </Box>
              }
            />
          </Tabs>
        </Box>

        {/* Statistics Cards */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mb: 3 }}>
          {activeTab === 0 ? (
            <>
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
                    Reusable Product Types
                  </Typography>
                  <RecycleIcon sx={{ fontSize: 20, color: '#2e7d32' }} />
                </Box>
                <Typography variant="h4" sx={{ color: '#2e7d32', fontWeight: 700 }}>
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
            </>
          ) : (
            <>
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
                    Total Single-Use Products
                  </Typography>
                  <SingleUseIcon sx={{ fontSize: 20, color: '#f57c00' }} />
                </Box>
                <Typography variant="h4" sx={{ color: '#f57c00', fontWeight: 700 }}>
                  {totalSingleUseProducts}
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
                    Active
                  </Typography>
                  <CheckCircleIcon sx={{ fontSize: 20, color: '#16a34a' }} />
                </Box>
                <Typography variant="h4" sx={{ color: '#16a34a', fontWeight: 700 }}>
                  {activeSingleUseProducts}
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
                    Inactive
                  </Typography>
                  <CancelIcon sx={{ fontSize: 20, color: '#ef4444' }} />
                </Box>
                <Typography variant="h4" sx={{ color: '#ef4444', fontWeight: 700 }}>
                  {inactiveSingleUseProducts}
                </Typography>
              </Paper>
            </>
          )}
        </Box>

        {/* Search Bar and Filter */}
        <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            placeholder={activeTab === 0 ? "Search by product type name..." : "Search by product name..."}
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
          {activeTab === 1 && (
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={isActiveFilter}
                label="Status"
                onChange={(e) => setIsActiveFilter(e.target.value)}
                sx={{
                  backgroundColor: 'white',
                  borderRadius: 2,
                }}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          )}
        </Box>
      </Box>

      {/* Product Types Grid */}
      {activeTab === 0 ? (
        productGroupLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress sx={{ color: '#12422a' }} />
          </Box>
        ) : productGroupError ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px" sx={{ px: 2 }}>
            <Alert 
              severity="error" 
              sx={{ 
                maxWidth: '600px',
                width: '100%',
                '& .MuiAlert-message': {
                  width: '100%'
                }
              }}
            >
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Error loading product groups
              </Typography>
              <Typography variant="body2">
                {typeof productGroupError === 'string' 
                  ? productGroupError 
                  : productGroupError?.message 
                  || productGroupError?.error 
                  || productGroupError?.data?.message
                  || 'Unknown error'}
              </Typography>
            </Alert>
          </Box>
        ) : filteredProducts.length === 0 ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <Typography color="textSecondary">
              No reusable product types found. Click "+ Add Reusable Product Type" to create one.
            </Typography>
          </Box>
        ) : (
        <>
          {/* Table Header */}
          <Paper 
            elevation={0}
            sx={{
              borderRadius: 2,
              border: '1px solid #e5e7eb',
              mb: 2,
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 120px',
                gap: 2,
                p: 2.5,
                backgroundColor: '#f9fafb',
                borderBottom: '1px solid #e5e7eb',
              }}
            >
              <Typography sx={{ fontWeight: 700, color: '#12422a', fontSize: '0.875rem' }}>
                Product Type
              </Typography>
              <Typography sx={{ fontWeight: 700, color: '#12422a', fontSize: '0.875rem' }}>
                Material
              </Typography>
              <Typography sx={{ fontWeight: 700, color: '#12422a', fontSize: '0.875rem' }}>
                Available
              </Typography>
              <Typography sx={{ fontWeight: 700, color: '#12422a', fontSize: '0.875rem' }}>
                Non-Available
              </Typography>
              <Typography sx={{ fontWeight: 700, color: '#12422a', fontSize: '0.875rem' }}>
                Total
              </Typography>
              <Typography sx={{ fontWeight: 700, color: '#12422a', fontSize: '0.875rem', textAlign: 'center' }}>
                Actions
              </Typography>
            </Box>

            {/* Product Types List */}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {currentProducts.map((product, index) => (
                <Box
                  key={product.id}
                  onClick={() => navigate(`/business/inventory/${product.id}/items`)}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 120px',
                    gap: 2,
                    p: 2.5,
                    borderBottom: index < currentProducts.length - 1 ? '1px solid #f3f4f6' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    backgroundColor: '#ffffff',
                    '&:hover': {
                      backgroundColor: '#12422a',
                      color: '#ffffff',
                      '& .product-name, & .product-material, & .product-description, & .product-count': {
                        color: '#ffffff !important',
                      },
                    },
                  }}
                >
                  {/* Product Type Column */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 1,
                        backgroundColor: '#f0f9f4',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <InventoryIcon sx={{ fontSize: 20, color: '#12422a' }} />
                    </Box>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography
                        className="product-name"
                        sx={{
                          fontWeight: 600,
                          fontSize: '0.9375rem',
                          color: '#1a1a1a',
                          mb: 0.25,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {product.typeName}
                      </Typography>
                      <Typography
                        className="product-description"
                        sx={{
                          fontSize: '0.8125rem',
                          color: '#6b7280',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {product.description || 'No description'}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Material Column */}
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography
                      className="product-material"
                      sx={{
                        fontSize: '0.875rem',
                        color: '#374151',
                        fontWeight: 500,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {product.material}
                    </Typography>
                  </Box>

                  {/* Available Column */}
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography
                      className="product-count"
                      sx={{
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: '#16a34a',
                      }}
                    >
                      {product.available}
                    </Typography>
                  </Box>

                  {/* Non-Available Column */}
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography
                      className="product-count"
                      sx={{
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: '#ef4444',
                      }}
                    >
                      {product.nonAvailable}
                    </Typography>
                  </Box>

                  {/* Total Column */}
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography
                      className="product-count"
                      sx={{
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: '#374151',
                      }}
                    >
                      {product.available + product.nonAvailable}
                    </Typography>
                  </Box>

                  {/* Actions Column */}
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      gap: 0.5,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
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
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
          {/* Pagination for Reusable Products */}
          {!productGroupLoading && filteredProducts.length > 0 && totalPages > 1 && (
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
        )
      ) : null}

      {/* Single-Use Products List */}
      {activeTab === 1 && (
        singleUseLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress sx={{ color: '#12422a' }} />
          </Box>
        ) : filteredSingleUseProducts.length === 0 ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <Typography color="textSecondary">
              No single-use products found. Click "+ Add Single-Use Product" to create one.
            </Typography>
          </Box>
        ) : (
          <>
            <Paper 
              elevation={0}
              sx={{
                borderRadius: 2,
                border: '1px solid #e5e7eb',
                mb: 2,
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 120px',
                  gap: 2,
                  p: 2.5,
                  backgroundColor: '#fff3e0',
                  borderBottom: '1px solid #e5e7eb',
                }}
              >
                <Typography sx={{ fontWeight: 700, color: '#f57c00', fontSize: '0.875rem' }}>
                  Product Name
                </Typography>
                <Typography sx={{ fontWeight: 700, color: '#f57c00', fontSize: '0.875rem' }}>
                  Type & Size
                </Typography>
                <Typography sx={{ fontWeight: 700, color: '#f57c00', fontSize: '0.875rem' }}>
                  Material
                </Typography>
                <Typography sx={{ fontWeight: 700, color: '#f57c00', fontSize: '0.875rem' }}>
                  Weight (gram)
                </Typography>
                <Typography sx={{ fontWeight: 700, color: '#f57c00', fontSize: '0.875rem' }}>
                  CO2 Emission
                </Typography>
                <Typography sx={{ fontWeight: 700, color: '#f57c00', fontSize: '0.875rem' }}>
                  Status
                </Typography>
                <Typography sx={{ fontWeight: 700, color: '#f57c00', fontSize: '0.875rem', textAlign: 'center' }}>
                  Actions
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                {currentSingleUseProducts.map((product, index) => (
                  <Box
                    key={product._id}
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 120px',
                      gap: 2,
                      p: 2.5,
                      borderBottom: index < currentSingleUseProducts.length - 1 ? '1px solid #f3f4f6' : 'none',
                      transition: 'all 0.2s ease',
                      backgroundColor: '#ffffff',
                      '&:hover': {
                        backgroundColor: '#fff3e0',
                      },
                    }}
                  >
                    {/* Product Name Column */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
                      {product.image || product.imageUrl ? (
                        <Box
                          component="img"
                          src={product.image || product.imageUrl}
                          alt={product.name}
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 1,
                            objectFit: 'cover',
                            flexShrink: 0,
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 1,
                            backgroundColor: '#fff3e0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <SingleUseIcon sx={{ fontSize: 20, color: '#f57c00' }} />
                        </Box>
                      )}
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.9375rem',
                            color: '#1a1a1a',
                            mb: 0.25,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {product.name}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '0.8125rem',
                            color: '#6b7280',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {product.description || 'No description'}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Type & Size Column */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography
                        sx={{
                          fontSize: '0.875rem',
                          color: '#374151',
                          fontWeight: 500,
                        }}
                      >
                        {product.productTypeId?.name || 'N/A'} - {product.productSizeId?.sizeName || 'N/A'}
                      </Typography>
                    </Box>

                    {/* Material Column */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography
                        sx={{
                          fontSize: '0.875rem',
                          color: '#374151',
                          fontWeight: 500,
                        }}
                      >
                        {product.materialId?.materialName || 'N/A'}
                      </Typography>
                    </Box>

                    {/* Weight Column */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography
                        sx={{
                          fontSize: '0.875rem',
                          color: '#374151',
                          fontWeight: 600,
                        }}
                      >
                        {product.weight || '-'} g
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography
                        sx={{
                          fontSize: '0.875rem',
                          color: '#374151',
                          fontWeight: 600,
                        }}
                      >
                        {product.co2Emission || '-'}  CO2/kg
                      </Typography>
                    </Box>

                    {/* Status Column */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Chip
                        label={product.isActive ? 'Active' : 'Inactive'}
                        size="small"
                        sx={{
                          backgroundColor: product.isActive ? '#e8f5e9' : '#ffebee',
                          color: product.isActive ? '#2e7d32' : '#c62828',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          border: `1px solid ${product.isActive ? '#2e7d32' : '#c62828'}`,
                        }}
                      />
                    </Box>

                    {/* Actions Column */}
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        gap: 0.5,
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() => handleEditSingleUse(product)}
                        sx={{
                          color: '#12422a',
                          '&:hover': {
                            backgroundColor: 'rgba(18, 66, 42, 0.1)',
                          },
                        }}
                        title="Edit"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>

            {/* Pagination for Single-Use Products */}
            {singleUseTotalPages > 1 && (
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
                  count={singleUseTotalPages}
                  page={singleUseCurrentPage}
                  onChange={(e, value) => {
                    setSingleUseCurrentPage(value);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
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
                      backgroundColor: '#f57c00 !important',
                      color: '#ffffff !important',
                    },
                  }}
                />
              </Box>
            )}
          </>
        )
      )}

      {/* Add/Edit Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={isCreating ? undefined : handleCloseDialog}
        maxWidth="sm" 
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
              disabled={isCreating}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <form onSubmit={handleSubmit} className="dialog-form">
          <DialogContent className="dialog-content-custom">
            <Grid container spacing={2}>
              {/* Product Type Name Field */}
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
                    <InventoryIcon sx={{ fontSize: 16 }} />
                    Material <span style={{ color: '#f44336' }}>*</span>
                  </Typography>
                </Box>
                <FormControl
                  fullWidth
                  variant="outlined"
                  size="small"
                  error={reusableMaterials.length === 0}
                  disabled={reusableMaterials.length === 0}
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
                    {reusableMaterials.map((material) => (
                      <MenuItem key={material.id || material._id} value={material.id || material._id}>
                        {material.materialName || material.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {reusableMaterials.length === 0 && (
                    <FormHelperText>
                      No reusable materials available. Please contact admin to add reusable materials.
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
                   {/* Upload Image Field */}
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
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              startIcon={!isCreating && (editMode ? <EditIcon fontSize="small" /> : <AddIcon fontSize="small" />)}
              disabled={!formData.typeName || !formData.materialId || isCreating}
              className="create-button"
              size="small"
            >
              {isCreating ? (
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

      {/* Single-Use Product Create/Edit Dialog */}
      <Dialog 
        open={openSingleUseDialog} 
        onClose={isCreating ? undefined : handleCloseSingleUseDialog}
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 12px 40px rgba(245, 124, 0, 0.2)',
          },
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #f57c00 0%, #e65100 100%)',
            color: 'white',
            py: 2,
            px: 2.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <SingleUseIcon sx={{ fontSize: 28 }} />
            <Box>
              <Typography variant="h6" component="div" fontWeight={700} sx={{ fontFamily: 'inherit' }}>
                {editMode ? 'Edit Single-Use Product' : 'Create Single-Use Product'}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9, mt: 0.25, display: 'block', fontFamily: 'inherit' }}>
                {editMode
                  ? 'Update your single-use product details'
                  : 'Create a new single-use product from available types and sizes'}
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={handleCloseSingleUseDialog}
            size="small"
            sx={{ 
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)'
              }
            }}
            disabled={isCreating}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <form onSubmit={handleSubmitSingleUse}>
          <DialogContent sx={{ pt: 2.25, pb: 2, px: 2.25 }}>
            <Grid container spacing={2}>
              {/* Product Name */}
              <Grid item xs={12}>
                <Box sx={{ mb: 0.5 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#f57c00',
                      fontWeight: 600,
                      mb: 0.75,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.75
                    }}
                  >
                    <CategoryIcon sx={{ fontSize: 16 }} />
                    Product Name <span style={{ color: '#f44336' }}>*</span>
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  placeholder="e.g., Plastic Cup 12oz"
                  name="name"
                  value={singleUseFormData.name}
                  onChange={(e) => setSingleUseFormData({ ...singleUseFormData, name: e.target.value })}
                  required
                  variant="outlined"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CategoryIcon sx={{ color: '#f57c00' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'white',
                      '&:hover fieldset': {
                        borderColor: '#f57c00',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#f57c00',
                        borderWidth: 2,
                      },
                    },
                  }}
                />
              </Grid>

              {/* Product Type */}
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 0.5 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#f57c00',
                      fontWeight: 600,
                      mb: 0.75,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.75
                    }}
                  >
                    <CategoryIcon sx={{ fontSize: 16 }} />
                    Product Type <span style={{ color: '#f44336' }}>*</span>
                  </Typography>
                </Box>
                <FormControl fullWidth variant="outlined" size="small" required>
                  <Select
                    value={singleUseFormData.productTypeId}
                    onChange={(e) => {
                      const selectedTypeId = e.target.value;
                      setSingleUseFormData({ 
                        ...singleUseFormData, 
                        productTypeId: selectedTypeId,
                        productSizeId: '', // Reset size when type changes
                      });
                      // Load sizes for the selected product type
                      if (selectedTypeId) {
                        dispatch(getBusinessSingleUseProductSizesApi(selectedTypeId));
                      }
                    }}
                    sx={{
                      backgroundColor: 'white',
                      '&:hover fieldset': {
                        borderColor: '#f57c00',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#f57c00',
                        borderWidth: 2,
                      },
                    }}
                  >
                    {businessProductTypes.filter(type => type.isActive === true).map((type) => (
                      <MenuItem key={type._id} value={type._id}>
                        {type.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Product Size */}
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 0.5 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#f57c00',
                      fontWeight: 600,
                      mb: 0.75,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.75
                    }}
                  >
                    <SizeIcon sx={{ fontSize: 16 }} />
                    Product Size <span style={{ color: '#f44336' }}>*</span>
                  </Typography>
                </Box>
                <FormControl 
                  fullWidth 
                  variant="outlined" 
                  size="small" 
                  required
                  disabled={!singleUseFormData.productTypeId}
                >
                  <Select
                    value={singleUseFormData.productSizeId}
                    onChange={(e) => setSingleUseFormData({ ...singleUseFormData, productSizeId: e.target.value })}
                    sx={{
                      backgroundColor: 'white',
                      '&:hover fieldset': {
                        borderColor: '#f57c00',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#f57c00',
                        borderWidth: 2,
                      },
                    }}
                  >
                    {(() => {
                      if (!singleUseFormData.productTypeId) {
                        return (
                          <MenuItem disabled>Please select a product type first</MenuItem>
                        );
                      }

                      // Filter sizes for the selected product type
                      const filteredSizes = businessProductSizes.filter(size => {
                        // Check if size is active (allow undefined as true for backward compatibility)
                        if (size.isActive === false) return false;
                        
                        // Handle productTypeId as both string and object
                        const sizeProductTypeId = typeof size.productTypeId === 'object' && size.productTypeId !== null
                          ? (size.productTypeId._id || size.productTypeId.id)
                          : size.productTypeId;
                        
                        return sizeProductTypeId === singleUseFormData.productTypeId;
                      });

                      if (filteredSizes.length === 0) {
                        return (
                          <MenuItem disabled>
                            {singleUseLoading ? 'Loading sizes...' : 'No sizes available for this product type'}
                          </MenuItem>
                        );
                      }

                      return filteredSizes.map((size) => (
                        <MenuItem key={size._id || size.id} value={size._id || size.id}>
                          {size.sizeName} ({size.minWeight} - {size.maxWeight} g)
                        </MenuItem>
                      ));
                    })()}
                  </Select>
                  {!singleUseFormData.productTypeId && (
                    <FormHelperText>Please select a product type first</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* Material */}
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 0.5 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#f57c00',
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
                <FormControl fullWidth variant="outlined" size="small" required>
                  <Select
                    value={singleUseFormData.materialId}
                    onChange={(e) => setSingleUseFormData({ ...singleUseFormData, materialId: e.target.value })}
                    sx={{
                      backgroundColor: 'white',
                      '&:hover fieldset': {
                        borderColor: '#f57c00',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#f57c00',
                        borderWidth: 2,
                      },
                    }}
                  >
                    {singleUseMaterials.map((material) => (
                      <MenuItem key={material.id || material._id} value={material.id || material._id}>
                        {material.materialName || material.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {singleUseMaterials.length === 0 && (
                    <FormHelperText sx={{ mt: 0.5 }}>
                      No single-use materials available. Please contact admin to add single-use materials.
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* Weight */}
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 0.5 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#f57c00',
                      fontWeight: 600,
                      mb: 0.75,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.75
                    }}
                  >
                    <TrendingUpIcon sx={{ fontSize: 16 }} />
                    Weight (g) <span style={{ color: '#f44336' }}>*</span>
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  placeholder="e.g., 12000"
                  name="weight"
                  type="number"
                  value={singleUseFormData.weight}
                  onChange={(e) => setSingleUseFormData({ ...singleUseFormData, weight: e.target.value })}
                  required
                  variant="outlined"
                  size="small"
                  inputProps={{ min: 0, step: 0.1 }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'white',
                      '&:hover fieldset': {
                        borderColor: '#f57c00',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#f57c00',
                        borderWidth: 2,
                      },
                    },
                  }}
                />
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <Box sx={{ mb: 0.5 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#f57c00',
                      fontWeight: 600,
                      mb: 0.75,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.75
                    }}
                  >
                    <DescriptionIcon sx={{ fontSize: 16 }} />
                    Description
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  placeholder="Brief description of this product"
                  name="description"
                  value={singleUseFormData.description}
                  onChange={(e) => setSingleUseFormData({ ...singleUseFormData, description: e.target.value })}
                  multiline
                  minRows={2}
                  variant="outlined"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.2 }}>
                        <DescriptionIcon sx={{ color: '#f57c00', fontSize: 18 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'white',
                      '&:hover fieldset': {
                        borderColor: '#f57c00',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#f57c00',
                        borderWidth: 2,
                      },
                    },
                  }}
                />
              </Grid>

              {/* Image Upload */}
              <Grid item xs={12}>
                <Box sx={{ mb: 0.5 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#f57c00',
                      fontWeight: 600,
                      mb: 0.75,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.75
                    }}
                  >
                    <ImageIcon sx={{ fontSize: 16 }} />
                    Product Image
                  </Typography>
                </Box>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="single-use-image-upload"
                  type="file"
                  onChange={handleSingleUseImageChange}
                />
                <label htmlFor="single-use-image-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<CloudUploadIcon />}
                    fullWidth
                    sx={{
                      backgroundColor: 'white',
                      borderColor: '#f57c00',
                      color: '#f57c00',
                      '&:hover': {
                        borderColor: '#e65100',
                        backgroundColor: 'rgba(245, 124, 0, 0.05)',
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
                        border: '2px solid rgba(245, 124, 0, 0.3)'
                      }} 
                    />
                  </Box>
                )}
              </Grid>

              {/* Active Status (only for edit mode) */}
              {editMode && (
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={singleUseFormData.isActive}
                        onChange={(e) => setSingleUseFormData({ ...singleUseFormData, isActive: e.target.checked })}
                        color="warning"
                      />
                    }
                    label="Active Product"
                    sx={{
                      '& .MuiFormControlLabel-label': {
                        color: '#374151',
                        fontWeight: 500,
                      },
                    }}
                  />
                </Grid>
              )}
            </Grid>
          </DialogContent>

          <Divider />

          <DialogActions
            sx={{
              px: 2,
              py: 1.5,
              gap: 2,
              backgroundColor: 'rgba(245, 124, 0, 0.02)',
            }}
          >
            <Button
              onClick={handleCloseSingleUseDialog}
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
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={!isCreating && (editMode ? <EditIcon fontSize="small" /> : <AddIcon fontSize="small" />)}
              disabled={
                !singleUseFormData.name || 
                !singleUseFormData.productTypeId || 
                !singleUseFormData.productSizeId || 
                !singleUseFormData.materialId || 
                !singleUseFormData.weight || 
                isCreating
              }
              sx={{
                backgroundColor: '#f57c00',
                px: 2,
                py: 0.75,
                fontSize: '0.9rem',
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(245, 124, 0, 0.35)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#e65100',
                  boxShadow: '0 6px 16px rgba(245, 124, 0, 0.45)',
                  transform: 'translateY(-2px)',
                },
              }}
              size="small"
            >
              {isCreating ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={16} color="inherit" />
                  {editMode ? 'Updating...' : 'Creating...'}
                </Box>
              ) : (
                editMode ? 'Update Product' : 'Create Product'
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}


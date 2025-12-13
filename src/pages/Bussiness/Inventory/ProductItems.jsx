import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Alert,
  Paper,
  CircularProgress,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Inventory2 as InventoryIcon,
  Add as AddIcon,
  CalendarToday as CalendarIcon,
  Straighten as SizeIcon,
  FilterList as FilterIcon,
  QrCode as QrCodeIcon,
  Close as CloseIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
  getMyProductGroups,
  createProducts,
  getProductSizes,
  updateProduct,
} from '../../../store/slices/bussinessSlice';
import { getBusinessProductsByGroup } from '../../../store/slices/storeSilce';
import { PATH } from '../../../routes/path';
import toast from 'react-hot-toast';
import './ProductItems.css';

export default function ProductItems() {
  const { productGroupId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    productGroups,
    productSizes,
  } = useSelector((state) => state.businesses);
  
  const {
    businessProducts,
    isLoadingBusinessProducts,
    error: productError,
  } = useSelector((state) => state.store);
  
  const products = businessProducts?.products || [];
  const productLoading = isLoadingBusinessProducts;

  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [sizeFilter, setSizeFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('available'); // 'available' or 'non-available'
  const [nonAvailableSubFilter, setNonAvailableSubFilter] = useState('all'); // 'all', 'borrowing', 'lost', 'damaged', 'over-reuse-limit'
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemDetailDialogOpen, setItemDetailDialogOpen] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const [formData, setFormData] = useState({
    productSizeId: '',
    amount: 1,
  });
  const [editFormData, setEditFormData] = useState({
    status: 'available',
    condition: 'good',
    lastConditionNote: '',
    lastConditionImage: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [editFormErrors, setEditFormErrors] = useState({});
  const [isCreating, setIsCreating] = useState(false);
  const formatVnd = (value) => new Intl.NumberFormat('vi-VN').format(Number(value) || 0);

  // Modal UI (đồng bộ với style modal admin)
  const modalPaperSx = {
    borderRadius: 3.5,
    boxShadow: '0 24px 70px rgba(0, 0, 0, 0.16)',
    overflow: 'hidden',
    background: '#f6f7f9',
    maxHeight: '90vh',
  };

  const modalTitleSx = {
    background: 'linear-gradient(135deg, #12422a 0%, #0b2a1b 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    py: 1.75,
    px: 2.25,
  };

  const modalContentSx = {
    pt: 2.5,
    pb: 2,
    px: 2.75,
    maxHeight: 'calc(90vh - 220px)',
    overflowY: 'auto',
    backgroundColor: '#ffffff',
    borderRadius: 2,
    border: '1px solid #e5e7eb',
    boxShadow: '0 6px 14px rgba(0,0,0,0.06)',
  };

  const modalActionsSx = {
    px: 2.5,
    py: 1.75,
    gap: 1.25,
    display: 'flex',
    justifyContent: 'flex-end',
    backgroundColor: '#f5f6f7',
    borderTop: '1px solid #e5e7eb',
  };

  // Get current product group
  const productGroup = productGroups.find(
    (pg) => (pg.id || pg._id) === productGroupId
  );

  // Extract material name from product group
  const getMaterialName = () => {
    if (!productGroup) return '';
    if (productGroup.materialId && typeof productGroup.materialId === 'object') {
      return productGroup.materialId.materialName || productGroup.materialId.name || '';
    }
    return '';
  };

  // Load products and product sizes on mount
  useEffect(() => {
    // Load product groups if not loaded
    if (productGroups.length === 0) {
      dispatch(getMyProductGroups());
    }
    // Load product sizes for this product group
    if (productGroupId) {
      dispatch(getProductSizes({ productGroupId, page: 1, limit: 100 }));
    }
    // Load products for this product group using new API
    if (productGroupId) {
      dispatch(getBusinessProductsByGroup({ 
        productGroupId, 
        page: 1, 
        limit: 1000 
      }));
    }
  }, [dispatch, productGroupId]);

  // Map products to productItems format
  const productItems = products
    .filter((product) => {
      // Filter by productGroupId if product has it
      if (product.productGroupId) {
        const pgId = typeof product.productGroupId === 'object' 
          ? (product.productGroupId.id || product.productGroupId._id)
          : product.productGroupId;
        return pgId === productGroupId;
      }
      return true;
    })
    .map((product) => {
      // Get size name from productSizeId
      let sizeName = 'Unknown';
      if (product.productSizeId) {
        const size = productSizes.find(
          (s) => (s.id || s._id) === (typeof product.productSizeId === 'object' 
            ? (product.productSizeId.id || product.productSizeId._id)
            : product.productSizeId)
        );
        if (size) {
          sizeName = size.sizeName;
        }
      }

      const sizeDeposit = product?.productSizeId?.depositValue;
      const sizeCo2 = product?.productSizeId?.co2Reduced ?? product?.productSizeId?.co2EmissionPerKg;
      return {
        id: product.id || product._id,
        qrCode: product.serialNumber || product.qrCode || 'N/A',
        size: sizeName,
        material: getMaterialName(),
        createdAt: product.createdAt || product.created_at,
        uses: product.useCount || product.uses || 0,
        guaranteeFee: product.depositValue ?? sizeDeposit ?? product.deposit ?? 0,
        co2Reduced: product.co2Reduced ?? product.totalCo2Reduced ?? sizeCo2 ?? 0,
        status: product.status || 'available',
        nonAvailableStatus: product.nonAvailableStatus || null,
        product: product, // Store full product object
      };
    });

  // Filter items based on availability
  const availableItems = productItems.filter((item) => item.status === 'available');
  const nonAvailableItems = productItems.filter((item) => item.status === 'non-available');

  // Get current items based on availability filter and sub-filter
  let currentItems = availabilityFilter === 'available' ? availableItems : nonAvailableItems;

  // Apply sub-filter for non-available items
  if (availabilityFilter === 'non-available' && nonAvailableSubFilter !== 'all') {
    currentItems = currentItems.filter((item) => item.nonAvailableStatus === nonAvailableSubFilter);
  }

  // Filter by search query, date, and size
  const filteredItems = currentItems.filter((item) => {
    const matchesSearch = item.qrCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = dateFilter === 'all' || true; // TODO: Implement date filtering
    const matchesSize = sizeFilter === 'all' || item.size.includes(sizeFilter);
    return matchesSearch && matchesDate && matchesSize;
  });

  // Count items by non-available status
  const nonAvailableCounts = {
    all: nonAvailableItems.length,
    borrowing: nonAvailableItems.filter((item) => item.nonAvailableStatus === 'borrowing').length,
    lost: nonAvailableItems.filter((item) => item.nonAvailableStatus === 'lost').length,
    damaged: nonAvailableItems.filter((item) => item.nonAvailableStatus === 'damaged').length,
    'over-reuse-limit': nonAvailableItems.filter((item) => item.nonAvailableStatus === 'over-reuse-limit').length,
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, dateFilter, sizeFilter, availabilityFilter, nonAvailableSubFilter]);

  const handleBack = () => {
    navigate(PATH.BUSINESS_INVENTORY);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setEditFormData({
      status: item.status || 'available',
      condition: item.product?.condition || 'good',
      lastConditionNote: item.product?.lastConditionNote || '',
      lastConditionImage: item.product?.lastConditionImage || '',
    });
    setEditFormErrors({});
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditingItem(null);
    setEditFormData({
      status: 'available',
      condition: 'good',
      lastConditionNote: '',
      lastConditionImage: '',
    });
    setEditFormErrors({});
  };

  const validateEditForm = () => {
    const errors = {};
    if (!editFormData.status) {
      errors.status = 'Status is required';
    }
    if (!editFormData.condition) {
      errors.condition = 'Condition is required';
    }
    setEditFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    if (!validateEditForm() || !editingItem) {
      return;
    }

    try {
      const productId = editingItem.id || editingItem.product?._id || editingItem.product?.id;
      if (!productId) {
        toast.error('Product ID not found');
        return;
      }

      const updateData = {
        status: editFormData.status,
        condition: editFormData.condition,
        ...(editFormData.lastConditionNote && { lastConditionNote: editFormData.lastConditionNote }),
        ...(editFormData.lastConditionImage && { lastConditionImage: editFormData.lastConditionImage }),
      };

      await dispatch(updateProduct({ id: productId, productData: updateData })).unwrap();
      toast.success('Product updated successfully');
      
      // Reload products
      dispatch(getBusinessProductsByGroup({ productGroupId, page: 1, limit: 1000 }));
      
      handleCloseEditDialog();
    } catch (error) {
      const errorMessage =
        error?.message ||
        error?.data?.message ||
        'Failed to update product';
      toast.error(errorMessage);
    }
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    setOpenDeleteDialog(true);
  };

  const handleOpenItemDetails = (item) => {
    setSelectedItem(item);
    setItemDetailDialogOpen(true);
  };

  const handleCloseItemDetails = (clearSelection = true) => {
    setItemDetailDialogOpen(false);
    if (clearSelection) {
      setSelectedItem(null);
    }
  };

  const handleConfirmDelete = () => {
    if (selectedItem) {
      setProductItems((prev) => prev.filter((item) => item.id !== selectedItem.id));
      setOpenDeleteDialog(false);
      setSelectedItem(null);
    }
  };

  const handleAddItem = () => {
    setFormData({
      productSizeId: '',
      amount: 1,
    });
    setFormErrors({});
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    if (isCreating) return; // Prevent closing while creating
    setOpenAddDialog(false);
    setFormData({
      productSizeId: '',
      amount: 1,
    });
    setFormErrors({});
    setIsCreating(false);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.productSizeId) {
      errors.productSizeId = 'Product size is required';
    }
    if (!formData.amount || formData.amount < 1) {
      errors.amount = 'Amount must be at least 1';
    }
    if (formData.amount > 1000) {
      errors.amount = 'Amount must not exceed 1000';
    }
    if (formData.amount && (!Number.isInteger(Number(formData.amount)) || Number(formData.amount) <= 0)) {
      errors.amount = 'Amount must be a positive number';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitCreateProducts = async (e) => {
    e.preventDefault();
    if (!validateForm() || isCreating) {
      return;
    }

    setIsCreating(true);
    try {
      const productData = {
        productGroupId: productGroupId,
        productSizeId: formData.productSizeId,
        amount: parseInt(formData.amount),
      };

      await dispatch(createProducts(productData)).unwrap();
      toast.success(`Successfully created ${formData.amount} product(s)`);
      
      // Reload products using new API
      dispatch(getBusinessProductsByGroup({ productGroupId, page: 1, limit: 1000 }));
      
      handleCloseAddDialog();
    } catch (error) {
      const errorMessage =
        error?.message ||
        error?.data?.message ||
        'Failed to create products';
      toast.error(errorMessage);
    } finally {
      setIsCreating(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Invalid Date';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Invalid Date';
    }
  };

  // Get label for non-available status
  const getNonAvailableStatusLabel = (status) => {
    const statusLabels = {
      borrowing: 'Borrowing',
      lost: 'Lost',
      damaged: 'Damaged',
      'over-reuse-limit': 'Over Reuse Limit',
    };
    return statusLabels[status] || 'Non-available';
  };

  if (!productGroup) {
    return (
      <Box className="product-items">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Typography>Loading product group...</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="product-items">
      {/* Header */}
      <Box className="items-header">
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
              <InventoryIcon className="header-icon" />
              <Box>
                <Typography variant="h4" className="header-title">
                  {productGroup.name || 'Product Items'} Items
                </Typography>
                <Typography variant="body2" className="header-subtitle">
                  Manage individual items for {productGroup.name || 'Product Type'}
                </Typography>
                {/* Available and Non-available counts */}
                <Box sx={{ display: 'flex', gap: 2, mt: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: '#16a34a',
                      }}
                    />
                    <Typography variant="body2" sx={{ color: '#16a34a', fontWeight: 600 }}>
                      Available: {productGroup.available || availableItems.length}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: '#dc2626',
                      }}
                    />
                    <Typography variant="body2" sx={{ color: '#dc2626', fontWeight: 600 }}>
                      Non-available: {productGroup.nonAvailable || nonAvailableItems.length}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddItem}
            className="add-button"
          >
             Add Items
          </Button>
        </Box>
      </Box>

      {/* Search and Filters */}
      <Box className="filters-section">
        <TextField
          placeholder="Search by QR code..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          className="search-input"
        />
        <Box className="filter-dropdowns">
          <FilterIcon className="filter-icon-main" />
          <FormControl className="filter-select">
            <InputLabel>Date</InputLabel>
            <Select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              label="Date"
            >
              <MenuItem value="all">All Dates</MenuItem>
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="week">This Week</MenuItem>
              <MenuItem value="month">This Month</MenuItem>
            </Select>
          </FormControl>
          <FormControl className="filter-select">
            <InputLabel>Size</InputLabel>
            <Select
              value={sizeFilter}
              onChange={(e) => setSizeFilter(e.target.value)}
              label="Size"
            >
              <MenuItem value="all">All Sizes</MenuItem>
              <MenuItem value="Small">Small</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Large">Large</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Divider */}
      <Box className="divider" />

      {/* Availability Tabs */}
      <Box className="availability-tabs-container">
        <Box className="availability-tabs">
          <Box
            className={`availability-tab ${availabilityFilter === 'available' ? 'active' : ''}`}
            onClick={() => {
              setAvailabilityFilter('available');
              setNonAvailableSubFilter('all');
            }}
          >
            <Typography variant="body1" className="tab-label">
              Available ({availableItems.length})
            </Typography>
          </Box>
          <Box
            className={`availability-tab ${availabilityFilter === 'non-available' ? 'active' : ''}`}
            onClick={() => {
              setAvailabilityFilter('non-available');
              setNonAvailableSubFilter('all');
            }}
          >
            <Typography variant="body1" className="tab-label">
              Non-available ({nonAvailableItems.length})
            </Typography>
          </Box>
        </Box>

        {/* Sub-tabs for Non-available */}
        {availabilityFilter === 'non-available' && (
          <Box className="sub-tabs">
            <Box
              className={`sub-tab ${nonAvailableSubFilter === 'all' ? 'active' : ''}`}
              onClick={() => setNonAvailableSubFilter('all')}
            >
              <Typography variant="body2" className="sub-tab-label">
                All ({nonAvailableCounts.all})
              </Typography>
            </Box>
            <Box
              className={`sub-tab ${nonAvailableSubFilter === 'borrowing' ? 'active' : ''}`}
              onClick={() => setNonAvailableSubFilter('borrowing')}
            >
              <Typography variant="body2" className="sub-tab-label">
                Borrowing ({nonAvailableCounts.borrowing})
              </Typography>
            </Box>
            <Box
              className={`sub-tab ${nonAvailableSubFilter === 'lost' ? 'active' : ''}`}
              onClick={() => setNonAvailableSubFilter('lost')}
            >
              <Typography variant="body2" className="sub-tab-label">
                Lost ({nonAvailableCounts.lost})
              </Typography>
            </Box>
            <Box
              className={`sub-tab ${nonAvailableSubFilter === 'damaged' ? 'active' : ''}`}
              onClick={() => setNonAvailableSubFilter('damaged')}
            >
              <Typography variant="body2" className="sub-tab-label">
                Damaged ({nonAvailableCounts.damaged})
              </Typography>
            </Box>
            <Box
              className={`sub-tab ${nonAvailableSubFilter === 'over-reuse-limit' ? 'active' : ''}`}
              onClick={() => setNonAvailableSubFilter('over-reuse-limit')}
            >
              <Typography variant="body2" className="sub-tab-label">
                Over Reuse Limit ({nonAvailableCounts['over-reuse-limit']})
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      {/* Loading State */}
      {productLoading && products.length === 0 && (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      )}

      {/* Error State */}
      {productError && (
        <Box sx={{ mb: 2 }}>
          <Alert severity="error">
            {productError?.message || 'Failed to load products'}
          </Alert>
        </Box>
      )}

      {/* Product Items List */}
      {!productLoading && (
        <>
          {filteredItems.length === 0 ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <Typography color="textSecondary">
                No items found. Click "+ Add Items" to create one.
              </Typography>
            </Box>
          ) : (
            <>
              <TableContainer 
                component={Paper} 
                className="items-list-container"
                sx={{
                  maxHeight: '600px',
                  overflowY: 'auto',
                  '&::-webkit-scrollbar': {
                    width: '8px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: '#f1f1f1',
                    borderRadius: '4px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: '#888',
                    borderRadius: '4px',
                  },
                  '&::-webkit-scrollbar-thumb:hover': {
                    background: '#555',
                  },
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow className="table-header-row">
                      <TableCell className="table-header-cell">Product</TableCell>
                      <TableCell className="table-header-cell">QR Code</TableCell>
                      <TableCell className="table-header-cell">Size</TableCell>
                      <TableCell className="table-header-cell">Material</TableCell>
                      <TableCell className="table-header-cell">Created</TableCell>
                      <TableCell className="table-header-cell">Uses</TableCell>
                      <TableCell className="table-header-cell">Guarantee fee</TableCell>
                      <TableCell className="table-header-cell">CO₂ Reduced</TableCell>
                      <TableCell className="table-header-cell">Status</TableCell>
                      <TableCell className="table-header-cell" align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedItems.map((item) => (
                      <TableRow
                        key={item.id}
                        className="table-row"
                        onClick={() => handleOpenItemDetails(item)}
                        sx={{
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: '#f9fafb',
                          },
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <InventoryIcon sx={{ color: '#16a34a', fontSize: 20 }} />
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {productGroup.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <QrCodeIcon sx={{ color: '#6b7280', fontSize: 18 }} />
                            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                              {item.qrCode}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{item.size || '—'}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{item.material || getMaterialName() || '—'}</Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CalendarIcon sx={{ color: '#6b7280', fontSize: 16 }} />
                            <Typography variant="body2">{formatDate(item.createdAt)}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{item.uses || '0'}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ color: '#16a34a', fontWeight: 600 }}>
                            {formatVnd(item.guaranteeFee)} VND
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {Number(item.co2Reduced || 0).toFixed(2)} kg
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={item.status === 'available' ? 'Ready to rent' : 'Not Available'}
                            className={`status-chip ${item.status === 'available' ? 'available' : 'non-available'}`}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                            <IconButton
                              size="small"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleEdit(item);
                              }}
                              className="edit-button"
                              sx={{ padding: '4px' }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleDelete(item);
                              }}
                              className="delete-button"
                              sx={{ padding: '4px' }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Item Details Dialog */}
              <Dialog
                open={itemDetailDialogOpen}
                onClose={() => handleCloseItemDetails()}
          maxWidth="sm"
          fullWidth
                TransitionProps={{
                  timeout: 400,
                }}
                PaperProps={{
                  sx: modalPaperSx,
                }}
              >
                <DialogTitle
                  sx={modalTitleSx}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <QrCodeIcon sx={{ fontSize: 28 }} />
                    <Box>
                      <Typography variant="subtitle1" component="div" fontWeight={700} sx={{ fontFamily: 'inherit' }}>
                        Item Details
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.9, mt: 0.25, display: 'block', fontFamily: 'inherit' }}>
                        QR code and product information
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton
                    onClick={() => handleCloseItemDetails()}
                    size="small"
                    sx={{
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      },
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </DialogTitle>
                <DialogContent
                  sx={modalContentSx}
                >
                  {selectedItem ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2.5,
                            borderRadius: 2,
                            border: '1px solid #e5e7eb',
                            background: '#f8fbf8',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Box
                            component="img"
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                              selectedItem.qrCode || ''
                            )}`}
                            alt={`QR Code for ${selectedItem.qrCode}`}
                            sx={{
                              width: 200,
                              height: 200,
                              objectFit: 'contain',
                              borderRadius: 1.5,
                              backgroundColor: '#fff',
                              p: 1.25,
                              border: '1px solid #e5e7eb',
                            }}
                          />
                        </Paper>
                      </Box>

                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                          gap: 1.25,
                          backgroundColor: '#f8faf9',
                          borderRadius: 2,
                          border: '1px solid #e5e7eb',
                          p: 1.75,
                        }}
                      >
                        {[
                          { label: 'Product Type', value: productGroup?.name || 'N/A' },
                          { label: 'Size', value: selectedItem.size || 'N/A' },
                          { label: 'Material', value: selectedItem.material || getMaterialName() || 'N/A' },
                          { label: 'Created Date', value: formatDate(selectedItem.createdAt) },
                          { label: 'Uses', value: selectedItem.uses ?? '/' },
                          { label: 'Guarantee fee', value: `${formatVnd(selectedItem.guaranteeFee)} VND`, highlight: '#16a34a' },
                          { label: 'CO₂ Reduced', value: `${Number(selectedItem.co2Reduced || 0).toFixed(2)} kg`, highlight: '#111827' },
                          {
                            label: 'Status',
                            value: (
                              <Chip
                                label={
                                  selectedItem.status === 'available'
                                    ? 'Available'
                                    : getNonAvailableStatusLabel(selectedItem.nonAvailableStatus) || 'Non-available'
                                }
                                color={selectedItem.status === 'available' ? 'success' : 'error'}
                                sx={{ fontWeight: 700, px: 1, py: 0.5 }}
                                size="small"
                              />
                            ),
                          },
                        ].map((item, idx) => (
                          <Box
                            key={idx}
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 0.5,
                              padding: 1.1,
                              borderRadius: 1.5,
                              backgroundColor: 'white',
                              border: '1px solid #eef2f2',
                            }}
                          >
                            <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 600, letterSpacing: 0.2 }}>
                              {item.label}
                            </Typography>
                            {typeof item.value === 'string' ? (
                              <Typography
                                variant="body1"
                                sx={{ fontWeight: 700, color: item.highlight || '#111827', wordBreak: 'break-word' }}
                              >
                                {item.value}
                              </Typography>
                            ) : (
                              item.value
                            )}
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                      <CircularProgress />
                    </Box>
                  )}
                </DialogContent>
                <Divider sx={{ mx: 0, my: 0 }} />
                <DialogActions sx={modalActionsSx}>
                  <Button
                    onClick={() => handleCloseItemDetails()}
                    variant="outlined"
                    startIcon={<CloseIcon fontSize="small" />}
                    sx={{
                      color: '#666',
                      borderColor: '#ccc',
                      px: 2,
                      py: 0.75,
                      fontSize: '0.9rem',
                      textTransform: 'none',
                      borderWidth: 1.5,
                      '&:hover': {
                        borderColor: '#999',
                        backgroundColor: '#f9fafb',
                      },
                    }}
                  >
                    Close
                  </Button>
                  <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Button
                      variant="contained"
                      startIcon={<EditIcon />}
                      onClick={() => {
                        if (selectedItem) {
                          handleCloseItemDetails(false);
                          handleEdit(selectedItem);
                        }
                      }}
                      sx={{
                        textTransform: 'none',
                        fontWeight: 700,
                        px: 2.4,
                        py: 0.9,
                        background: 'linear-gradient(135deg, #12422a 0%, #0b2a1b 100%)',
                        boxShadow: '0 6px 16px rgba(18, 66, 42, 0.35)',
                        borderRadius: 2,
                        '&:hover': {
                          background: 'linear-gradient(135deg, #0f3d26 0%, #082018 100%)',
                          boxShadow: '0 8px 18px rgba(18, 66, 42, 0.45)',
                        },
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => {
                        if (selectedItem) {
                          handleCloseItemDetails(false);
                          handleDelete(selectedItem);
                        }
                      }}
                      sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 2.5,
                        py: 0.75,
                        boxShadow: '0 8px 20px rgba(220, 38, 38, 0.15)',
                        '&:hover': {
                          boxShadow: '0 10px 24px rgba(220, 38, 38, 0.25)',
                        },
                      }}
                    >
                      Delete
                    </Button>
                  </Box>
                </DialogActions>
              </Dialog>

              {/* Pagination */}
              {filteredItems.length > 0 && totalPages > 1 && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mt: 4,
                    mb: 2,
                  }}
                >
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(event, value) => setCurrentPage(value)}
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
                        fontWeight: 600,
                        '&:hover': {
                          backgroundColor: '#0d2e1c !important',
                        },
                      },
                      '& .MuiPaginationItem-root:hover': {
                        backgroundColor: 'rgba(18, 66, 42, 0.1) !important',
                      },
                    }}
                  />
                </Box>
              )}

              {/* Pagination Info */}
              {filteredItems.length > 0 && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mt: 1,
                    mb: 2,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Showing {startIndex + 1} - {Math.min(endIndex, filteredItems.length)} of {filteredItems.length} items
                  </Typography>
                </Box>
              )}
            </>
          )}
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: modalPaperSx,
        }}
      >
        <DialogTitle sx={modalTitleSx}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DeleteIcon />
            <Typography variant="subtitle1" fontWeight={700}>
              Confirm Delete
            </Typography>
          </Box>
          <IconButton
            onClick={() => setOpenDeleteDialog(false)}
            size="small"
            sx={{
              color: 'white',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2, px: 3 }}>
          <Typography sx={{ color: '#374151', lineHeight: 1.6 }}>
            Bạn có chắc chắn muốn xóa item "{selectedItem?.qrCode}"? Thao tác này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions sx={modalActionsSx}>
          <Button variant="outlined" onClick={() => setOpenDeleteDialog(false)} sx={{ textTransform: 'none' }}>
            Hủy
          </Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error" sx={{ textTransform: 'none' }}>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Items Dialog */}
      <Dialog
        open={openAddDialog}
        onClose={handleCloseAddDialog}
          maxWidth="sm"
          fullWidth
        TransitionProps={{
          timeout: 400,
        }}
        PaperProps={{
          sx: modalPaperSx
        }}
      >
        <DialogTitle
          sx={modalTitleSx}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <AddIcon sx={{ fontSize: 28 }} />
            <Box>
              <Typography variant="subtitle1" component="div" fontWeight={700} sx={{ fontFamily: 'inherit' }}>
                Create New Products
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9, mt: 0.25, display: 'block', fontFamily: 'inherit' }}>
                Create multiple products with QR codes for {productGroup?.name || 'Product Type'}
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={handleCloseAddDialog}
            size="small"
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

        <form onSubmit={handleSubmitCreateProducts}>
          <DialogContent sx={{ ...modalContentSx, maxHeight: 'calc(90vh - 180px)' }}>
            <Grid container spacing={2}>
              {/* Product Type Details */}
              <Grid item xs={12}>
                <Box
                  sx={{
                    p: 2.5,
                    backgroundColor: '#f5f5f5',
                    borderRadius: 2,
                    border: '1px solid #e0e0e0',
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 700,
                      mb: 2,
                      color: '#374151',
                      fontFamily: 'monospace',
                    }}
                  >
                    Product Type Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ mb: 1.5 }}>
                        <Typography
                          variant="caption"
                          sx={{
                            color: '#6b7280',
                            display: 'block',
                            mb: 0.5,
                            fontWeight: 500,
                          }}
                        >
                          Name:
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#1a1a1a', fontWeight: 500 }}>
                          {productGroup?.name || 'N/A'}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ mb: 1.5 }}>
                        <Typography
                          variant="caption"
                          sx={{
                            color: '#6b7280',
                            display: 'block',
                            mb: 0.5,
                            fontWeight: 500,
                          }}
                        >
                          Material:
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#1a1a1a', fontWeight: 500 }}>
                          {getMaterialName() || 'N/A'}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ mb: 1.5 }}>
                        <Typography
                          variant="caption"
                          sx={{
                            color: '#6b7280',
                            display: 'block',
                            mb: 0.5,
                            fontWeight: 500,
                          }}
                        >
                          Description:
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#1a1a1a', fontWeight: 500 }}>
                          {productGroup?.description || 'N/A'}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              {/* Created Date Field */}
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 0.5 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#2E7D32',
                      fontWeight: 600,
                      mb: 0.75,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.75
                    }}
                  >
                    <CalendarIcon sx={{ fontSize: 16 }} />
                    Created Date
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  value={(() => {
                    const today = new Date();
                    const month = String(today.getMonth() + 1).padStart(2, '0');
                    const day = String(today.getDate()).padStart(2, '0');
                    const year = today.getFullYear();
                    return `${month}/${day}/${year}`;
                  })()}
                  variant="outlined"
                  size="small"
                  disabled
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#f5f5f5',
                      '& fieldset': {
                        borderColor: '#e0e0e0',
                      },
                    },
                  }}
                />
                <Typography variant="caption" sx={{ mt: 0.5, display: 'block', color: '#666' }}>
                  Items are automatically created with today's date
                </Typography>
              </Grid>

              {/* Product Size Field */}
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 0.5 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#2E7D32',
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
                  error={!!formErrors.productSizeId}
                >
                  <Select
                    value={formData.productSizeId}
                    onChange={(e) => {
                      setFormData({ ...formData, productSizeId: e.target.value });
                      if (formErrors.productSizeId) {
                        setFormErrors({ ...formErrors, productSizeId: '' });
                      }
                    }}
                    disabled={isCreating}
                    sx={{
                      backgroundColor: 'white',
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#4CAF50',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#4CAF50',
                        borderWidth: 2,
                      },
                    }}
                  >
                    <MenuItem value="">
                      <em>Select a product size</em>
                    </MenuItem>
                    {productSizes.map((size) => (
                      <MenuItem key={size.id || size._id} value={size.id || size._id}>
                        {size.sizeName} - {size.basePrice ? new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }).format(size.basePrice) : 'N/A'}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.productSizeId && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                      {formErrors.productSizeId}
                    </Typography>
                  )}
                  {!formErrors.productSizeId && (
                    <Typography variant="caption" sx={{ mt: 0.5, ml: 1.75, color: '#666' }}>
                      Select the size for the products you want to create
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Amount Field */}
              <Grid item xs={12}>
                <Box sx={{ mb: 0.5 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#2E7D32',
                      fontWeight: 600,
                      mb: 0.75,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.75
                    }}
                  >
                    <InventoryIcon sx={{ fontSize: 16 }} />
                    Number of Items to Create <span style={{ color: '#f44336' }}>*</span>
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  placeholder="e.g., 1, 10, 50, 100"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData({ ...formData, amount: value });
                    if (formErrors.amount) {
                      setFormErrors({ ...formErrors, amount: '' });
                    }
                  }}
                  required
                  variant="outlined"
                  size="small"
                  error={!!formErrors.amount}
                  disabled={isCreating}
                  helperText={formErrors.amount || `Each item will get a unique QR code automatically generated (max 1000 items)`}
                  inputProps={{
                    min: 1,
                    max: 1000,
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
                      backgroundColor: '#4CAF50',
                      borderRadius: '50%',
                      p: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '36px',
                      height: '36px'
                    }}
                  >
                    <QrCodeIcon sx={{ color: 'white', fontSize: 20 }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ color: '#2E7D32', fontWeight: 700, mb: 0.5 }}>
                      📦 Bulk Product Creation
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#1B5E20', lineHeight: 1.5, display: 'block' }}>
                      Each product will be automatically assigned a unique QR code (serial number). 
                      You can create up to 1000 items at once. All products will be created with the selected size and linked to this product group.
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </DialogContent>

          <Divider />

          <DialogActions sx={modalActionsSx}>
            <Button
              onClick={handleCloseAddDialog}
              variant="outlined"
              startIcon={<CloseIcon fontSize="small" />}
              disabled={isCreating}
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
                '&:disabled': {
                  borderColor: '#d1d5db',
                  color: '#9ca3af',
                }
              }}
              size="small"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={!isCreating && <AddIcon fontSize="small" />}
              disabled={isCreating}
              sx={{
                background: isCreating 
                  ? '#d1d5db' 
                  : 'linear-gradient(135deg, #12422a 0%, #0b2a1b 100%)',
                px: 2.4,
                py: 0.9,
                fontSize: '0.95rem',
                fontWeight: 700,
                boxShadow: isCreating ? 'none' : '0 6px 16px rgba(18, 66, 42, 0.35)',
                borderRadius: 2,
                transition: 'all 0.25s ease',
                textTransform: 'none',
                '&:hover': {
                  background: isCreating 
                    ? '#d1d5db' 
                    : 'linear-gradient(135deg, #0f3d26 0%, #082018 100%)',
                  boxShadow: isCreating ? 'none' : '0 8px 18px rgba(18, 66, 42, 0.45)',
                  transform: isCreating ? 'none' : 'translateY(-1px)',
                },
                '&:disabled': {
                  backgroundColor: '#d1d5db',
                  color: '#9ca3af',
                  boxShadow: 'none',
                }
              }}
              size="small"
            >
              {isCreating ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={16} sx={{ color: '#9ca3af' }} />
                  <span>Đang tạo...</span>
                </Box>
              ) : (
                `Create ${formData.amount || 0} Product(s)`
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        maxWidth="md"
        fullWidth
        TransitionProps={{
          timeout: 400,
        }}
        PaperProps={{
          sx: modalPaperSx
        }}
      >
        <DialogTitle
          sx={modalTitleSx}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <EditIcon sx={{ fontSize: 28 }} />
            <Box>
              <Typography variant="subtitle1" component="div" fontWeight={700} sx={{ fontFamily: 'inherit' }}>
                Edit Product
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9, mt: 0.25, display: 'block', fontFamily: 'inherit' }}>
                Update product status and condition
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={handleCloseEditDialog}
            size="small"
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

        <form onSubmit={handleSubmitEdit}>
          <DialogContent sx={{ ...modalContentSx, maxHeight: 'calc(90vh - 180px)' }}>
            {editingItem && (
              <Grid container spacing={2}>
                {/* Product Info */}
                <Grid item xs={12}>
                  <Box
                    sx={{
                      p: 2,
                      backgroundColor: '#f5f5f5',
                      borderRadius: 2,
                      border: '1px solid #e0e0e0',
                      mb: 1,
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#374151' }}>
                      Product Information
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>
                      <strong>QR Code:</strong> {editingItem.qrCode}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6b7280', mt: 0.5 }}>
                      <strong>Product:</strong> {productGroup?.name || 'N/A'}
                    </Typography>
                  </Box>
                </Grid>

                {/* Status Field */}
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 0.5 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#2E7D32',
                        fontWeight: 600,
                        mb: 0.75,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.75
                      }}
                    >
                      Status <span style={{ color: '#f44336' }}>*</span>
                    </Typography>
                  </Box>
                  <FormControl
                    fullWidth
                    variant="outlined"
                    size="small"
                    error={!!editFormErrors.status}
                    required
                  >
                    <Select
                      value={editFormData.status}
                      onChange={(e) => {
                        setEditFormData({ ...editFormData, status: e.target.value });
                        if (editFormErrors.status) {
                          setEditFormErrors({ ...editFormErrors, status: '' });
                        }
                      }}
                      sx={{
                        backgroundColor: 'white',
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#4CAF50',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#4CAF50',
                          borderWidth: 2,
                        },
                      }}
                    >
                      <MenuItem value="available">Available</MenuItem>
                      <MenuItem value="non-available">Non-available</MenuItem>
                    </Select>
                    {editFormErrors.status && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                        {editFormErrors.status}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>

                {/* Condition Field */}
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 0.5 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#2E7D32',
                        fontWeight: 600,
                        mb: 0.75,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.75
                      }}
                    >
                      Condition <span style={{ color: '#f44336' }}>*</span>
                    </Typography>
                  </Box>
                  <FormControl
                    fullWidth
                    variant="outlined"
                    size="small"
                    error={!!editFormErrors.condition}
                    required
                  >
                    <Select
                      value={editFormData.condition}
                      onChange={(e) => {
                        setEditFormData({ ...editFormData, condition: e.target.value });
                        if (editFormErrors.condition) {
                          setEditFormErrors({ ...editFormErrors, condition: '' });
                        }
                      }}
                      sx={{
                        backgroundColor: 'white',
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#4CAF50',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#4CAF50',
                          borderWidth: 2,
                        },
                      }}
                    >
                      <MenuItem value="good">Good</MenuItem>
                      <MenuItem value="fair">Fair</MenuItem>
                      <MenuItem value="poor">Poor</MenuItem>
                      <MenuItem value="damaged">Damaged</MenuItem>
                    </Select>
                    {editFormErrors.condition && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                        {editFormErrors.condition}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>

                {/* Last Condition Note Field */}
                <Grid item xs={12}>
                  <Box sx={{ mb: 0.5 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#2E7D32',
                        fontWeight: 600,
                        mb: 0.75,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.75
                      }}
                    >
                      <DescriptionIcon sx={{ fontSize: 16 }} />
                      Condition Note
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    placeholder="e.g., Good condition, no damage"
                    value={editFormData.lastConditionNote}
                    onChange={(e) => {
                      setEditFormData({ ...editFormData, lastConditionNote: e.target.value });
                    }}
                    multiline
                    minRows={3}
                    variant="outlined"
                    size="small"
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
                  <Typography variant="caption" sx={{ mt: 0.5, display: 'block', color: '#666' }}>
                    Optional: Add a note about the product's current condition
                  </Typography>
                </Grid>

                {/* Last Condition Image Field */}
                <Grid item xs={12}>
                  <Box sx={{ mb: 0.5 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#2E7D32',
                        fontWeight: 600,
                        mb: 0.75,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.75
                      }}
                    >
                      Condition Image URL
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    placeholder="https://cloudinary.com/image.jpg"
                    value={editFormData.lastConditionImage}
                    onChange={(e) => {
                      setEditFormData({ ...editFormData, lastConditionImage: e.target.value });
                    }}
                    variant="outlined"
                    size="small"
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
                  <Typography variant="caption" sx={{ mt: 0.5, display: 'block', color: '#666' }}>
                    Optional: URL to an image showing the product's current condition
                  </Typography>
                </Grid>
              </Grid>
            )}
          </DialogContent>

          <Divider />

          <DialogActions sx={modalActionsSx}>
            <Button
              onClick={handleCloseEditDialog}
              variant="outlined"
              startIcon={<CloseIcon fontSize="small" />}
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
                }
              }}
              size="small"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<EditIcon fontSize="small" />}
              disabled={productLoading}
              sx={{
                backgroundColor: '#4CAF50',
                px: 2,
                py: 0.75,
                fontSize: '0.9rem',
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(76, 175, 80, 0.35)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#388E3C',
                  boxShadow: '0 6px 16px rgba(76, 175, 80, 0.45)',
                  transform: 'translateY(-2px)',
                },
                '&:disabled': {
                  backgroundColor: '#d1d5db',
                  color: '#9ca3af',
                }
              }}
              size="small"
            >
              {productLoading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={16} color="inherit" />
                  Updating...
                </Box>
              ) : (
                'Update Product'
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}


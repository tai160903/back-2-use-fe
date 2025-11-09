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
  getProducts,
  createProducts,
  getProductSizes,
} from '../../../store/slices/bussinessSlice';
import { PATH } from '../../../routes/path';
import toast from 'react-hot-toast';
import './ProductItems.css';

export default function ProductItems() {
  const { productGroupId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    productGroups,
    products,
    productLoading,
    productError,
    productSizes,
  } = useSelector((state) => state.businesses);

  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [sizeFilter, setSizeFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('available'); // 'available' or 'non-available'
  const [nonAvailableSubFilter, setNonAvailableSubFilter] = useState('all'); // 'all', 'borrowing', 'lost', 'damaged', 'over-reuse-limit'
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemDetailDialogOpen, setItemDetailDialogOpen] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const [formData, setFormData] = useState({
    productSizeId: '',
    amount: 1,
  });
  const [formErrors, setFormErrors] = useState({});

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
    // Load products for this product group
    if (productGroupId) {
      dispatch(getProducts({ productGroupId, page: 1, limit: 1000 }));
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

      return {
        id: product.id || product._id,
        qrCode: product.serialNumber || product.qrCode || 'N/A',
        size: sizeName,
        material: getMaterialName(),
        createdAt: product.createdAt || product.created_at,
        uses: product.useCount || product.uses || 0,
        deposit: product.deposit || 0,
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
    // TODO: Implement edit functionality
    console.log('Edit item:', item);
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
    setOpenAddDialog(false);
    setFormData({
      productSizeId: '',
      amount: 1,
    });
    setFormErrors({});
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
    if (!validateForm()) {
      return;
    }

    try {
      const productData = {
        productGroupId: productGroupId,
        productSizeId: formData.productSizeId,
        amount: parseInt(formData.amount),
      };

      await dispatch(createProducts(productData)).unwrap();
      toast.success(`Successfully created ${formData.amount} product(s)`);
      
      // Reload products
      dispatch(getProducts({ productGroupId, page: 1, limit: 1000 }));
      
      handleCloseAddDialog();
    } catch (error) {
      const errorMessage =
        error?.message ||
        error?.data?.message ||
        'Failed to create products';
      toast.error(errorMessage);
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

      {/* Product Items Grid */}
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
              <Box
                className="items-grid"
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                  },
                  gap: '32px',
                  width: '100%',
                  margin: '0',
                  padding: '0',
                }}
              >
                {paginatedItems.map((item) => (
                <Box key={item.id} sx={{ display: 'flex', width: '100%' }}>
                  <Card
                    className="item-card"
                    sx={{ width: '100%', cursor: 'pointer' }}
                    onClick={() => handleOpenItemDetails(item)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        handleOpenItemDetails(item);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%', '&:last-child': { pb: 3 } }}>
                      <Box className="card-header">
                        <Box className="card-title-section">
                          <InventoryIcon className="card-icon" />
                          <Box>
                            <Typography variant="h6" className="card-title">
                              {productGroup.name}
                            </Typography>
                            {item.size && (
                              <Typography variant="body2" className="card-subtitle">
                                {item.size}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                        <Box className="card-actions">
                          <IconButton
                            size="small"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleEdit(item);
                            }}
                            className="edit-button"
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
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>

                      <Box className="card-details">
                        <Box className="detail-row">
                          <QrCodeIcon className="detail-icon" />
                          <Typography variant="body2" className="detail-label">
                            QR Code:
                          </Typography>
                          <Typography variant="body2" className="detail-value">
                            {item.qrCode}
                          </Typography>
                        </Box>
                        <Box className="detail-row">
                          <Typography variant="body2" className="detail-label">
                            Material:
                          </Typography>
                          <Typography variant="body2" className="detail-value">
                            {item.material || getMaterialName()}
                          </Typography>
                        </Box>
                        <Box className="detail-row">
                          <CalendarIcon className="detail-icon" />
                          <Typography variant="body2" className="detail-label">
                            Created:
                          </Typography>
                          <Typography variant="body2" className="detail-value">
                            {formatDate(item.createdAt)}
                          </Typography>
                        </Box>
                        <Box className="detail-row">
                          <Typography variant="body2" className="detail-label">
                            Uses:
                          </Typography>
                          <Typography variant="body2" className="detail-value">
                            {item.uses || '/'}
                          </Typography>
                        </Box>
                        <Box className="detail-row">
                          <Typography variant="body2" className="detail-label">
                            Deposit:
                          </Typography>
                          <Typography variant="body2" className="detail-value deposit">
                            ${item.deposit?.toFixed(2)}/day
                          </Typography>
                        </Box>
                      </Box>

                      <Box className="card-status">
                        <Chip
                          label={item.status === 'available' ? 'Ready to rent' : 'Not Available'}
                          className={`status-chip ${item.status === 'available' ? 'available' : 'non-available'}`}
                          size="small"
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
                ))}
              </Box>

              {/* Item Details Dialog */}
              <Dialog
                open={itemDetailDialogOpen}
                onClose={() => handleCloseItemDetails()}
                maxWidth="md"
                fullWidth
                TransitionProps={{
                  timeout: 400,
                }}
                PaperProps={{
                  sx: {
                    borderRadius: 3,
                    boxShadow: '0 12px 40px rgba(46, 125, 50, 0.2)',
                    overflow: 'hidden',
                    background: 'linear-gradient(to bottom, #ffffff 0%, #f9fdf9 100%)',
                    maxHeight: '90vh',
                  },
                }}
              >
                <DialogTitle
                  sx={{
                    background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    py: 1.5,
                    px: 2,
                  }}
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
                  sx={{
                    pt: 3,
                    pb: 2,
                    px: 3,
                    maxHeight: 'calc(90vh - 200px)',
                    overflowY: 'auto',
                  }}
                >
                  {selectedItem ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 3,
                            borderRadius: 3,
                            border: '1px solid rgba(76, 175, 80, 0.25)',
                            background: 'linear-gradient(145deg, #f1fdf4, #ecfdf5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Box
                            component="img"
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
                              selectedItem.qrCode || ''
                            )}`}
                            alt={`QR Code for ${selectedItem.qrCode}`}
                            sx={{
                              width: 220,
                              height: 220,
                              objectFit: 'contain',
                              borderRadius: 2,
                              backgroundColor: '#fff',
                              p: 1.5,
                              border: '1px solid rgba(76, 175, 80, 0.2)',
                            }}
                          />
                        </Paper>
                      </Box>

                      <Divider />

                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="caption" sx={{ color: '#6b7280', mb: 0.5, display: 'block' }}>
                            Product Type
                          </Typography>
                          <Typography variant="body1" fontWeight={600}>
                            {productGroup?.name || 'N/A'}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="caption" sx={{ color: '#6b7280', mb: 0.5, display: 'block' }}>
                            Size
                          </Typography>
                          <Typography variant="body1" fontWeight={600}>
                            {selectedItem.size || 'N/A'}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="caption" sx={{ color: '#6b7280', mb: 0.5, display: 'block' }}>
                            Material
                          </Typography>
                          <Typography variant="body1">
                            {selectedItem.material || getMaterialName() || 'N/A'}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="caption" sx={{ color: '#6b7280', mb: 0.5, display: 'block' }}>
                            Created Date
                          </Typography>
                          <Typography variant="body1">
                            {formatDate(selectedItem.createdAt)}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="caption" sx={{ color: '#6b7280', mb: 0.5, display: 'block' }}>
                            Uses
                          </Typography>
                          <Typography variant="body1">
                            {selectedItem.uses ?? '/'}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="caption" sx={{ color: '#6b7280', mb: 0.5, display: 'block' }}>
                            Deposit
                          </Typography>
                          <Typography variant="body1" sx={{ color: '#16a34a', fontWeight: 600 }}>
                            ${selectedItem.deposit?.toFixed(2) || '0.00'}/day
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="caption" sx={{ color: '#6b7280', mb: 0.5, display: 'block' }}>
                            Status
                          </Typography>
                          <Chip
                            label={
                              selectedItem.status === 'available'
                                ? 'Available'
                                : getNonAvailableStatusLabel(selectedItem.nonAvailableStatus) || 'Non-available'
                            }
                            color={selectedItem.status === 'available' ? 'success' : 'error'}
                            sx={{ fontWeight: 600, px: 1, py: 0.5 }}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                      <CircularProgress />
                    </Box>
                  )}
                </DialogContent>
                <Divider sx={{ mx: 0, my: 0 }} />
                <DialogActions
                  sx={{
                    px: 2,
                    py: 1.5,
                    gap: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    backgroundColor: 'rgba(76, 175, 80, 0.02)',
                  }}
                >
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
                        fontWeight: 600,
                        px: 2.5,
                        py: 0.75,
                        background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
                        boxShadow: '0 8px 20px rgba(76, 175, 80, 0.15)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #43A047 0%, #1B5E20 100%)',
                          boxShadow: '0 10px 24px rgba(76, 175, 80, 0.25)',
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
              {totalPages > 1 && (
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
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete item "{selectedItem?.qrCode}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Items Dialog */}
      <Dialog
        open={openAddDialog}
        onClose={handleCloseAddDialog}
        maxWidth="md"
        fullWidth
        TransitionProps={{
          timeout: 400,
        }}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 12px 40px rgba(46, 125, 50, 0.2)',
            overflow: 'hidden',
            background: 'linear-gradient(to bottom, #ffffff 0%, #f9fdf9 100%)',
            maxHeight: '90vh'
          }
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
            color: 'white',
            py: 1.5,
            px: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
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
          <DialogContent sx={{ pt: 3, pb: 2, px: 3, maxHeight: 'calc(90vh - 200px)', overflowY: 'auto' }}>
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
                          Category:
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#1a1a1a', fontWeight: 500 }}>
                          {productGroup?.category || 'N/A'}
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

          <DialogActions
            sx={{
              px: 2,
              py: 1.5,
              gap: 2,
              backgroundColor: 'rgba(76, 175, 80, 0.02)',
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <Button
              onClick={handleCloseAddDialog}
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
              startIcon={<AddIcon fontSize="small" />}
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
                  Creating...
                </Box>
              ) : (
                `Create ${formData.amount || 0} Product(s)`
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}


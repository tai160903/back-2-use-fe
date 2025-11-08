import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Inventory2 as InventoryIcon,
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getApprovedMaterials, 
  createProductGroup, 
  getMyProductGroups 
} from '../../../store/slices/bussinessSlice';
import './InventoryManagement.css';

export default function InventoryManagement() {
  const dispatch = useDispatch();
  const { 
    approvedMaterials, 
    materialLoading,
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
    setFormData({
      typeName: product.name || product.typeName,
      description: product.description || '',
      materialId: product.materialId || product.material?.id || '',
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

  const handleSave = async () => {
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
  const productTypes = productGroups.map((pg) => {
    // Find material name from approvedMaterials
    const material = approvedMaterials.find(
      (m) => (m.id || m._id) === pg.materialId
    );
    
    return {
      id: pg.id || pg._id,
      typeName: pg.name,
      category: material?.materialName || material?.name || 'General',
      description: pg.description || '',
      material: material?.materialName || material?.name || '',
      materialId: pg.materialId,
      available: pg.available || 0,
      nonAvailable: pg.nonAvailable || 0,
      image: pg.image || pg.imageUrl,
    };
  });

  const filteredProducts = productTypes.filter(product =>
    product.typeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box className="inventory-management">
      {/* Header */}
      <Box className="inventory-header">
        <Box className="header-left">
          <Box className="header-title-section">
            <InventoryIcon className="header-icon" />
            <Box>
              <Typography variant="h4" className="header-title">
                Inventory Management
              </Typography>
              <Typography variant="body2" className="header-subtitle">
                Manage your store's reusable packaging inventory
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
          + Add Product Type
        </Button>
      </Box>

      {/* Search Bar */}
      <Box className="search-section">
        <TextField
          fullWidth
          placeholder="Search by type name..."
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
      </Box>

      {/* Product Types Grid */}
      {productGroupLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <Typography>Loading...</Typography>
        </Box>
      ) : productGroupError ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <Typography color="error">
            Error loading product groups: {productGroupError.message || 'Unknown error'}
          </Typography>
        </Box>
      ) : filteredProducts.length === 0 ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <Typography color="textSecondary">
            No product groups found. Click "+ Add Product Type" to create one.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3} className="products-grid">
          {filteredProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card className="product-card">
              <CardContent>
                <Box className="card-header">
                  <Box className="card-title-section">
                    <InventoryIcon className="card-icon" />
                    <Box>
                      <Typography variant="h6" className="card-title">
                        {product.typeName}
                      </Typography>
                      <Typography variant="body2" className="card-subtitle">
                        {product.category}
                      </Typography>
                    </Box>
                  </Box>
                  <Box className="card-actions">
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(product)}
                      className="edit-button"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(product)}
                      className="delete-button"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                <Box className="card-details">
                  <Box className="detail-row">
                    <Typography variant="body2" className="detail-label">
                      Description:
                    </Typography>
                    <Typography variant="body2" className="detail-value">
                      {product.description}
                    </Typography>
                  </Box>
                  <Box className="detail-row">
                    <Typography variant="body2" className="detail-label">
                      Material:
                    </Typography>
                    <Typography variant="body2" className="detail-value">
                      {product.material}
                    </Typography>
                  </Box>
                  <Box className="detail-row">
                    <Typography variant="body2" className="detail-label">
                      Available:
                    </Typography>
                    <Typography variant="body2" className="detail-value available">
                      {product.available}
                    </Typography>
                  </Box>
                  <Box className="detail-row">
                    <Typography variant="body2" className="detail-label">
                      Non-available:
                    </Typography>
                    <Typography variant="body2" className="detail-value non-available">
                      {product.nonAvailable}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          ))}
        </Grid>
      )}

      {/* Add/Edit Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          className: 'add-product-dialog'
        }}
      >
        <DialogTitle className="dialog-title-section">
          <Box className="dialog-header">
            <Box>
              <Typography variant="h6" className="dialog-title">
                {editMode ? 'Edit Product Type' : 'Add New Product Type'}
              </Typography>
              {!editMode && (
                <Typography variant="body2" className="dialog-subtitle">
                  Create a new product type for your packaging items
                </Typography>
              )}
            </Box>
            <IconButton onClick={handleCloseDialog} size="small" className="close-button">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent className="dialog-content-custom">
          <Box className="dialog-form">
            {/* Product Type Name */}
            <TextField
              fullWidth
              label="Product Type Name"
              placeholder="e.g., Coffee Cup, Food Container"
              value={formData.typeName}
              onChange={(e) => setFormData({ ...formData, typeName: e.target.value })}
              margin="normal"
              required
              className="dialog-field"
            />

            {/* Description */}
            <TextField
              fullWidth
              label="Description"
              placeholder="Brief description of this product type"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              margin="normal"
              multiline
              rows={4}
              required
              className="dialog-field"
            />

            {/* Material Select */}
            <FormControl fullWidth margin="normal" className="dialog-field" error={approvedMaterials.length === 0}>
              <InputLabel>Material</InputLabel>
              <Select
                value={formData.materialId}
                onChange={(e) => setFormData({ ...formData, materialId: e.target.value })}
                label="Material"
                disabled={approvedMaterials.length === 0}
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

            {/* Upload Image */}
            <Box className="upload-section">
              <Typography variant="body2" className="upload-label">
                Upload Image
              </Typography>
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
                  className="upload-button"
                  fullWidth
                >
                  Choose File
                  {selectedImage && `: ${selectedImage.name}`}
                  {!selectedImage && !imagePreview && ' (No file chosen)'}
                </Button>
              </label>
              {imagePreview && (
                <Box className="image-preview">
                  <img src={imagePreview} alt="Preview" className="preview-image" />
                </Box>
              )}
              <Typography variant="caption" className="upload-hint">
                This image will be applied to all items of this product type
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions className="dialog-actions-custom">
          <Button onClick={handleCloseDialog} className="cancel-button">
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            variant="contained" 
            className="create-button"
            disabled={!formData.typeName || !formData.materialId || productGroupLoading}
          >
            {productGroupLoading ? 'Creating...' : editMode ? 'Update Type' : 'Create Type'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedProduct?.typeName}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}


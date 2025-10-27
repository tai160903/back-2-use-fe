import React, { useState, useEffect } from 'react';
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
  Tabs,
  Tab,
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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  CheckCircle as ApprovedIcon,
  Pending as PendingIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
  createMaterial,
  getApprovedMaterials,
  getMyMaterials,
} from '../../../store/slices/bussinessSlice';

export default function Materials() {
  const dispatch = useDispatch();
  const { myMaterials, approvedMaterials, materialLoading, materialError } = useSelector(
    (state) => state.businesses
  );

  const [activeTab, setActiveTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    materialName: '',
    maximumReuse: '',
    description: '',
  });

  // Load materials on component mount
  useEffect(() => {
    dispatch(getMyMaterials());
    dispatch(getApprovedMaterials());
  }, [dispatch]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleOpenDialog = () => {
    setEditMode(false);
    setSelectedMaterial(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditMode(false);
    setSelectedMaterial(null);
    setFormData({
      materialName: '',
      maximumReuse: '',
      description: '',
    });
    setFormErrors({});
  };

  // Handle View Material
  const handleViewMaterial = (material) => {
    setSelectedMaterial(material);
    setOpenViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    setSelectedMaterial(null);
  };

  // Handle Edit Material
  const handleEditMaterial = (material) => {
    setSelectedMaterial(material);
    setEditMode(true);
    setFormData({
      materialName: material.materialName,
      maximumReuse: material.maximumReuse,
      description: material.description,
    });
    setOpenDialog(true);
  };

  // Handle Delete Material
  const handleDeleteMaterial = (material) => {
    setSelectedMaterial(material);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedMaterial(null);
  };

  const handleConfirmDelete = async () => {
    // TODO: Implement delete API call
    console.log('Deleting material:', selectedMaterial);
    // await dispatch(deleteMaterial(selectedMaterial._id)).unwrap();
    // dispatch(getMyMaterials());
    handleCloseDeleteDialog();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.materialName.trim()) {
      errors.materialName = 'Material name is required';
    }
    
    if (!formData.maximumReuse || formData.maximumReuse === '') {
      errors.maximumReuse = 'Maximum reuse is required';
    } else if (isNaN(formData.maximumReuse) || parseInt(formData.maximumReuse, 10) < 1) {
      errors.maximumReuse = 'Maximum reuse must be a number greater than 0';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    try {
      // Convert maximumReuse to number before sending
      const materialData = {
        ...formData,
        maximumReuse: parseInt(formData.maximumReuse, 10)
      };
      
      if (editMode && selectedMaterial) {
        // TODO: Implement update API call
        console.log('Updating material:', selectedMaterial._id, materialData);
        // await dispatch(updateMaterial({ id: selectedMaterial._id, data: materialData })).unwrap();
      } else {
        await dispatch(createMaterial(materialData)).unwrap();
      }
      
      handleCloseDialog();
      // Refresh materials list
      dispatch(getMyMaterials());
    } catch (error) {
      console.error('Error saving material:', error);
    }
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'approved':
        return <Chip icon={<ApprovedIcon />} label="Approved" color="success" size="small" />;
      case 'pending':
        return <Chip icon={<PendingIcon />} label="Pending" color="warning" size="small" />;
      case 'rejected':
        return <Chip label="Rejected" color="error" size="small" />;
      default:
        return <Chip label="Unknown" color="default" size="small" />;
    }
  };

  const renderMaterialsTable = (materials, showActions = false) => (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Material Name</TableCell>
            <TableCell>Maximum Reuse</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Status</TableCell>
            {showActions && <TableCell>Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {materials.map((material, index) => (
            <TableRow key={material.id || index}>
              <TableCell>
                <Typography variant="subtitle2" fontWeight="bold">
                  {material.materialName}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {material.maximumReuse} times
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {material.description}
                </Typography>
              </TableCell>
              <TableCell>
                {getStatusChip(material.status || 'pending')}
              </TableCell>
              {showActions && (
                <TableCell>
                  <Tooltip title="View Details">
                    <IconButton 
                      size="small" 
                      onClick={() => handleViewMaterial(material)}
                      sx={{ color: '#12422a' }}
                    >
                      <ViewIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton 
                      size="small" 
                      onClick={() => handleEditMaterial(material)}
                      sx={{ color: '#1976d2' }}
                      disabled={material.status === 'approved'}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => handleDeleteMaterial(material)}
                      disabled={material.status === 'approved'}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
          Materials Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          sx={{ borderRadius: 2 }}
        >
          Add New Material
        </Button>
      </Box>

      {/* Error Alert */}
      {materialError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {materialError}
        </Alert>
      )}

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth">
          <Tab label={`My Materials (${myMaterials.length})`} />
          <Tab label={`Approved Materials (${approvedMaterials.length})`} />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <Box sx={{ mt: 2 }}>
        {materialLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {activeTab === 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  My Materials
                </Typography>
                {myMaterials.length === 0 ? (
                  <Card>
                    <CardContent sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        No materials created yet
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Create your first material to get started
                      </Typography>
                      <Button variant="outlined" onClick={handleOpenDialog}>
                        Create Material
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  renderMaterialsTable(myMaterials, true)
                )}
              </Box>
            )}

            {activeTab === 1 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Approved Materials
                </Typography>
                {approvedMaterials.length === 0 ? (
                  <Card>
                    <CardContent sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        No approved materials available
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Approved materials will appear here once they are reviewed
                      </Typography>
                    </CardContent>
                  </Card>
                ) : (
                  renderMaterialsTable(approvedMaterials, false)
                )}
              </Box>
            )}
          </>
        )}
      </Box>

      {/* Create/Edit Material Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? 'Edit Material' : 'Create New Material'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Material Name"
                  name="materialName"
                  value={formData.materialName}
                  onChange={handleInputChange}
                  required
                  variant="outlined"
                  error={!!formErrors.materialName}
                  helperText={formErrors.materialName}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Maximum Reuse"
                  name="maximumReuse"
                  type="number"
                  value={formData.maximumReuse}
                  onChange={handleInputChange}
                  required
                  variant="outlined"
                  inputProps={{ min: 1 }}
                  error={!!formErrors.maximumReuse}
                  helperText={formErrors.maximumReuse}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  multiline
                  rows={3}
                  variant="outlined"
                  error={!!formErrors.description}
                  helperText={formErrors.description}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editMode ? 'Update Material' : 'Create Material'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* View Material Dialog */}
      <Dialog open={openViewDialog} onClose={handleCloseViewDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Material Details</DialogTitle>
        <DialogContent>
          {selectedMaterial && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Material Name
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {selectedMaterial.materialName}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Maximum Reuse
                </Typography>
                <Typography variant="body1">
                  {selectedMaterial.maximumReuse} times
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Description
                </Typography>
                <Typography variant="body1">
                  {selectedMaterial.description}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Status
                </Typography>
                <Box sx={{ mt: 1 }}>
                  {getStatusChip(selectedMaterial.status || 'pending')}
                </Box>
              </Grid>
              {selectedMaterial.rejectReason && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Rejection Reason
                  </Typography>
                  <Alert severity="error" sx={{ mt: 1 }}>
                    {selectedMaterial.rejectReason}
                  </Alert>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Material</DialogTitle>
        <DialogContent>
          {selectedMaterial && (
            <Box>
              <Typography variant="body1" gutterBottom>
                Are you sure you want to delete this material?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                <strong>Material:</strong> {selectedMaterial.materialName}
              </Typography>
              <Alert severity="warning" sx={{ mt: 2 }}>
                This action cannot be undone.
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}


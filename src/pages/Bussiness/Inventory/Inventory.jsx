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

export default function Material() {
  const dispatch = useDispatch();
  const { myMaterials, approvedMaterials, materialLoading, materialError } = useSelector(
    (state) => state.businesses
  );

  const [activeTab, setActiveTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [formErrors, setFormErrors] = useState({});
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
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      materialName: '',
      maximumReuse: '',
      description: '',
    });
    setFormErrors({});
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
      
      await dispatch(createMaterial(materialData)).unwrap();
      handleCloseDialog();
      // Refresh materials list
      dispatch(getMyMaterials());
    } catch (error) {
      console.error('Error creating material:', error);
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
                    <IconButton size="small">
                      <ViewIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton size="small">
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" color="error">
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
          Material Management
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

      {/* Create Material Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Material</DialogTitle>
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
              Create Material
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

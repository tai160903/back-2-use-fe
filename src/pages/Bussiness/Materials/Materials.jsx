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
  InputAdornment,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  CheckCircle as ApprovedIcon,
  Pending as PendingIcon,
  Recycling as EcoIcon,
  Category as CategoryIcon,
  Replay as ReplayIcon,
  Description as DescriptionIcon,
  Close as CloseIcon,
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

  // Filter rejected materials from myMaterials
  const rejectedMaterials = myMaterials.filter(material => material.status === 'rejected');

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
        return (
          <Chip 
            icon={<ApprovedIcon />} 
            label="Approved" 
            size="small"
            sx={{ 
              backgroundColor: '#4CAF50', 
              color: 'white',
              '& .MuiChip-icon': {
                color: 'white'
              }
            }} 
          />
        );
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
                      sx={{ color: '#2E7D32' }}
                    >
                      <ViewIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton 
                      size="small" 
                      onClick={() => handleEditMaterial(material)}
                      sx={{ color: '#66BB6A' }}
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
        <Typography variant="h4" component="h1" fontWeight="bold" sx={{ color: '#2E7D32' }}>
          Materials Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          sx={{ 
            borderRadius: 2,
            backgroundColor: '#4CAF50',
            '&:hover': {
              backgroundColor: '#388E3C'
            }
          }}
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
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              color: '#66BB6A',
              '&.Mui-selected': {
                color: '#2E7D32',
                fontWeight: 'bold'
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#4CAF50'
            }
          }}
        >
          <Tab label={`My Materials (${myMaterials.length})`} />
          <Tab label={`Approved Materials (${approvedMaterials.length})`} />
          <Tab label={`Rejected Materials (${rejectedMaterials.length})`} />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <Box sx={{ mt: 2 }}>
        {materialLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress sx={{ color: '#4CAF50' }} />
          </Box>
        ) : (
          <>
            {activeTab === 0 && (
              <Box>
                <Typography variant="h6" gutterBottom sx={{ color: '#2E7D32', fontWeight: 'bold' }}>
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
                      <Button 
                        variant="outlined" 
                        onClick={handleOpenDialog}
                        sx={{
                          color: '#4CAF50',
                          borderColor: '#4CAF50',
                          '&:hover': {
                            borderColor: '#2E7D32',
                            backgroundColor: 'rgba(76, 175, 80, 0.08)'
                          }
                        }}
                      >
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
                <Typography variant="h6" gutterBottom sx={{ color: '#2E7D32', fontWeight: 'bold' }}>
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

            {activeTab === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom sx={{ color: '#2E7D32', fontWeight: 'bold' }}>
                  Rejected Materials
                </Typography>
                {rejectedMaterials.length === 0 ? (
                  <Card>
                    <CardContent sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        No rejected materials
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Materials that are rejected will appear here
                      </Typography>
                    </CardContent>
                  </Card>
                ) : (
                  renderMaterialsTable(rejectedMaterials, true)
                )}
              </Box>
            )}
          </>
        )}
      </Box>

      {/* Create/Edit Material Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
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
            py: 2,
            px: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <EcoIcon sx={{ fontSize: 28 }} />
            <Box>
              <Typography variant="h6" component="div" fontWeight="bold">
                {editMode ? 'Edit Material' : 'Create New Material'}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9, mt: 0.25, display: 'block' }}>
                {editMode ? 'Update your eco-friendly material details' : 'Add a new eco-friendly material to your inventory'}
              </Typography>
            </Box>
          </Box>
          <IconButton 
            onClick={handleCloseDialog}
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

        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: 3, pb: 2, px: 3, maxHeight: 'calc(90vh - 200px)', overflowY: 'auto' }}>
            <Grid container spacing={2.5}>
              {/* Material Name Field */}
              <Grid item xs={12} md={7}>
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
                    <CategoryIcon sx={{ fontSize: 16 }} />
                    Material Name <span style={{ color: '#f44336' }}>*</span>
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  placeholder="e.g., Reusable Coffee Cup, Glass Container"
                  name="materialName"
                  value={formData.materialName}
                  onChange={handleInputChange}
                  required
                  variant="outlined"
                  error={!!formErrors.materialName}
                  helperText={formErrors.materialName || 'Enter a clear and descriptive name'}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CategoryIcon sx={{ color: '#4CAF50' }} />
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

              {/* Maximum Reuse Field */}
              <Grid item xs={12} md={5}>
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
                    <ReplayIcon sx={{ fontSize: 16 }} />
                    Reuse Count <span style={{ color: '#f44336' }}>*</span>
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  placeholder="100"
                  name="maximumReuse"
                  type="number"
                  value={formData.maximumReuse}
                  onChange={handleInputChange}
                  required
                  variant="outlined"
                  inputProps={{ min: 1 }}
                  error={!!formErrors.maximumReuse}
                  helperText={formErrors.maximumReuse || 'Number of reuses'}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ReplayIcon sx={{ color: '#4CAF50' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <Typography variant="body2" sx={{ color: '#66BB6A', fontWeight: 600 }}>
                          times
                        </Typography>
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

              {/* Description Field */}
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
                    Description <span style={{ color: '#f44336' }}>*</span>
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  placeholder="Describe the material, its uses, and benefits..."
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  multiline
                  rows={3}
                  variant="outlined"
                  error={!!formErrors.description}
                  helperText={formErrors.description || 'Provide detailed information about this material'}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.2 }}>
                        <DescriptionIcon sx={{ color: '#4CAF50', fontSize: 18 }} />
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
                    <EcoIcon sx={{ color: 'white', fontSize: 20 }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ color: '#2E7D32', fontWeight: 700, mb: 0.5 }}>
                      🌱 Contributing to a Sustainable Future
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#1B5E20', lineHeight: 1.5, display: 'block' }}>
                      By adding eco-friendly materials, you're helping reduce waste and promote sustainability. 
                      All materials will be reviewed by our team before approval.
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </DialogContent>

          <Divider />

          <DialogActions 
            sx={{ 
              px: 3, 
              py: 2, 
              gap: 2,
              backgroundColor: 'rgba(76, 175, 80, 0.02)',
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <Button 
              onClick={handleCloseDialog}
              variant="outlined"
              startIcon={<CloseIcon fontSize="small" />}
              sx={{
                color: '#666',
                borderColor: '#ccc',
                px: 3,
                py: 1,
                fontSize: '0.9375rem',
                borderWidth: 1.5,
                fontWeight: 500,
                '&:hover': {
                  borderColor: '#999',
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  borderWidth: 1.5,
                }
              }}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained"
              startIcon={editMode ? <EditIcon fontSize="small" /> : <AddIcon fontSize="small" />}
              sx={{
                backgroundColor: '#4CAF50',
                px: 3,
                py: 1,
                fontSize: '0.9375rem',
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(76, 175, 80, 0.35)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#388E3C',
                  boxShadow: '0 6px 16px rgba(76, 175, 80, 0.45)',
                  transform: 'translateY(-2px)',
                }
              }}
            >
              {editMode ? 'Update Material' : 'Create Material'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* View Material Dialog */}
      <Dialog 
        open={openViewDialog} 
        onClose={handleCloseViewDialog} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(46, 125, 50, 0.15)'
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            background: 'linear-gradient(135deg, #66BB6A 0%, #4CAF50 100%)',
            color: 'white',
            py: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ViewIcon sx={{ fontSize: 32 }} />
            <Box>
              <Typography variant="h5" component="div" fontWeight="bold">
                Material Details
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                View complete information about this material
              </Typography>
            </Box>
          </Box>
          <IconButton 
            onClick={handleCloseViewDialog}
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
          {selectedMaterial && (
            <Grid container spacing={3}>
              {/* Material Name */}
              <Grid item xs={12}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    backgroundColor: 'rgba(76, 175, 80, 0.05)',
                    borderRadius: 2,
                    border: '1px solid rgba(76, 175, 80, 0.2)'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <CategoryIcon sx={{ color: '#4CAF50', fontSize: 20 }} />
                    <Typography variant="subtitle2" sx={{ color: '#2E7D32', fontWeight: 600 }}>
                      Material Name
                    </Typography>
                  </Box>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: '#1B5E20' }}>
                    {selectedMaterial.materialName}
                  </Typography>
                </Paper>
              </Grid>

              {/* Maximum Reuse */}
              <Grid item xs={12} sm={6}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    backgroundColor: 'rgba(76, 175, 80, 0.05)',
                    borderRadius: 2,
                    border: '1px solid rgba(76, 175, 80, 0.2)',
                    height: '100%'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <ReplayIcon sx={{ color: '#4CAF50', fontSize: 20 }} />
                    <Typography variant="subtitle2" sx={{ color: '#2E7D32', fontWeight: 600 }}>
                      Maximum Reuse
                    </Typography>
                  </Box>
                  <Typography variant="h5" fontWeight="bold" sx={{ color: '#1B5E20' }}>
                    {selectedMaterial.maximumReuse} 
                    <Typography component="span" variant="body1" sx={{ ml: 1, color: '#66BB6A' }}>
                      times
                    </Typography>
                  </Typography>
                </Paper>
              </Grid>

              {/* Status */}
              <Grid item xs={12} sm={6}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    backgroundColor: 'rgba(76, 175, 80, 0.05)',
                    borderRadius: 2,
                    border: '1px solid rgba(76, 175, 80, 0.2)',
                    height: '100%'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <ApprovedIcon sx={{ color: '#4CAF50', fontSize: 20 }} />
                    <Typography variant="subtitle2" sx={{ color: '#2E7D32', fontWeight: 600 }}>
                      Status
                    </Typography>
                  </Box>
                  <Box sx={{ mt: 1.5 }}>
                    {getStatusChip(selectedMaterial.status || 'pending')}
                  </Box>
                </Paper>
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    backgroundColor: 'rgba(76, 175, 80, 0.05)',
                    borderRadius: 2,
                    border: '1px solid rgba(76, 175, 80, 0.2)'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <DescriptionIcon sx={{ color: '#4CAF50', fontSize: 20 }} />
                    <Typography variant="subtitle2" sx={{ color: '#2E7D32', fontWeight: 600 }}>
                      Description
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ color: '#1B5E20', lineHeight: 1.7 }}>
                    {selectedMaterial.description}
                  </Typography>
                </Paper>
              </Grid>

              {/* Rejection Reason */}
              {selectedMaterial.rejectReason && (
                <Grid item xs={12}>
                  <Alert 
                    severity="error" 
                    sx={{ 
                      borderRadius: 2,
                      '& .MuiAlert-message': {
                        width: '100%'
                      }
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                      Rejection Reason
                    </Typography>
                    <Typography variant="body2">
                      {selectedMaterial.rejectReason}
                    </Typography>
                  </Alert>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>

        <Divider />

        <DialogActions sx={{ px: 3, py: 2.5 }}>
          <Button 
            onClick={handleCloseViewDialog}
            variant="contained"
            sx={{
              backgroundColor: '#4CAF50',
              px: 3,
              py: 1,
              '&:hover': {
                backgroundColor: '#388E3C'
              }
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={openDeleteDialog} 
        onClose={handleCloseDeleteDialog} 
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
                Delete Material
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                This action cannot be undone
              </Typography>
            </Box>
          </Box>
          <IconButton 
            onClick={handleCloseDeleteDialog}
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
          {selectedMaterial && (
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
                  This action is permanent and cannot be undone. The material will be completely removed from your inventory.
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
                  Are you sure you want to delete this material?
                </Typography>
                
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CategoryIcon sx={{ color: '#f44336', fontSize: 20 }} />
                  <Typography variant="body2" color="text.secondary">
                    Material Name:
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ mt: 1, color: '#1B5E20', fontWeight: 'bold' }}>
                  {selectedMaterial.materialName}
                </Typography>
              </Paper>
            </Box>
          )}
        </DialogContent>

        <Divider />

        <DialogActions sx={{ px: 3, py: 2.5, gap: 1.5 }}>
          <Button 
            onClick={handleCloseDeleteDialog}
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
            color="error"
            startIcon={<DeleteIcon />}
            sx={{
              px: 3,
              py: 1,
              boxShadow: '0 4px 12px rgba(244, 67, 54, 0.3)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(244, 67, 54, 0.4)',
              }
            }}
          >
            Delete Material
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}


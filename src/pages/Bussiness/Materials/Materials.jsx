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
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
  createMaterial,
  getApprovedMaterials,
  getMyMaterials,
} from '../../../store/slices/bussinessSlice';
import './Materials.css';

export default function Materials() {
  const dispatch = useDispatch();
  const { myMaterials, approvedMaterials, materialLoading, materialError } = useSelector(
    (state) => state.businesses
  );

  const [openDialog, setOpenDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'
  const [searchQuery, setSearchQuery] = useState('');
  const [myMaterialsPage, setMyMaterialsPage] = useState(1);
  const [activePage, setActivePage] = useState(1);
  const [rejectedPage, setRejectedPage] = useState(1);
  const itemsPerPage = 10;

  // Reset pagination when search changes
  useEffect(() => {
    setMyMaterialsPage(1);
    setActivePage(1);
    setRejectedPage(1);
  }, [searchQuery]);
  const [formData, setFormData] = useState({
    materialName: '',
    description: '',
  });

  // Filter pending/rejected materials from myMaterials
  const pendingMaterials = myMaterials.filter(material => (material.status || '').toLowerCase() === 'pending');
  const rejectedMaterials = myMaterials.filter(material => (material.status || '').toLowerCase() === 'rejected');

  const normalize = (v = '') => (v || '').toString().toLowerCase().trim();
  const matchesSearch = (m) => {
    const q = normalize(searchQuery);
    if (!q) return true;
    return normalize(m.materialName || m.requestedMaterialName).includes(q) || normalize(m.description).includes(q);
  };

  const filtered = {
    my: myMaterials.filter(matchesSearch),
    approved: approvedMaterials.filter(matchesSearch),
    pending: pendingMaterials.filter(matchesSearch),
    rejected: rejectedMaterials.filter(matchesSearch),
  };

  // Pagination helpers
  const getPaginatedData = (data, page, itemsPerPage) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const getTotalPages = (data, itemsPerPage) => {
    return Math.max(1, Math.ceil(data.length / itemsPerPage));
  };

  // Paginated data
  const paginatedMy = getPaginatedData(filtered.my, myMaterialsPage, itemsPerPage);
  const paginatedActive = getPaginatedData(filtered.approved, activePage, itemsPerPage);
  const paginatedRejected = getPaginatedData(filtered.rejected, rejectedPage, itemsPerPage);

  // Load materials on component mount
  useEffect(() => {
    dispatch(getMyMaterials());
    dispatch(getApprovedMaterials());
  }, [dispatch]);


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
      materialName: material.materialName || material.requestedMaterialName || '',
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
    
    // For business request creation, maximumReuse is not required by API
    
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
      const materialData = {
        materialName: formData.materialName.trim(),
        description: formData.description.trim(),
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
      case 'active':
        return (
          <Chip 
            icon={<ApprovedIcon />} 
            label="Active" 
            size="small"
            sx={{ 
              backgroundColor: '#4CAF50', 
              color: 'white',
              '& .MuiChip-icon': { color: 'white' }
            }} 
          />
        );
      case 'unactive':
        return <Chip label="Unactive" size="small" sx={{ backgroundColor: '#e5e7eb', color: '#374151' }} />;
      case 'inactive':
      case 'not_active':
        return <Chip label="Inactive" size="small" sx={{ backgroundColor: '#e5e7eb', color: '#374151' }} />;
      case 'approved':
        return (
          <Chip 
            icon={<ApprovedIcon />} 
            label="Active" 
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
        return <Chip label={status || 'Unknown'} color="default" size="small" />;
    }
  };

  const renderMaterialsTable = (materials, showActions = false, useIsActive = false) => {
    const hasReuse = Array.isArray(materials) && materials.some(m => m?.maximumReuse || m?.reuseLimit);
    return (
    <TableContainer 
      component={Paper} 
      elevation={0}
      sx={{ 
        mt: 1.5, 
        border: '1px solid #e5e7eb', 
        borderRadius: 2,
        backgroundColor: 'white',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
      }}
    >
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f9fafb' }}>
            <TableCell sx={{ py: 1.5, fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>
              Material Name
            </TableCell>
            {hasReuse && (
              <TableCell sx={{ py: 1.5, fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>
                Maximum Reuse
              </TableCell>
            )}
            <TableCell sx={{ py: 1.5, fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>
              Description
            </TableCell>
            <TableCell sx={{ py: 1.5, fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>
              Status
            </TableCell>
            {showActions && (
              <TableCell sx={{ py: 1.5, fontWeight: 600, color: '#374151', fontSize: '0.875rem', width: 140, textAlign: 'center' }}>
                Actions
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {materials.map((material, index) => (
            <TableRow 
              key={material.id || index}
              sx={{
                '&:hover': {
                  backgroundColor: '#f9fafb',
                },
                '&:last-child td': {
                  borderBottom: 'none'
                }
              }}
            >
              <TableCell sx={{ py: 1.75 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
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
                    {material.materialName || material.requestedMaterialName}
                  </Typography>
                </Box>
              </TableCell>
              {hasReuse && (
                <TableCell sx={{ py: 1.75 }}>
                  <Typography variant="body2" sx={{ fontFamily: 'inherit', color: '#6b7280' }}>
                    {(material.maximumReuse || material.reuseLimit || '-')} {material.maximumReuse || material.reuseLimit ? 'times' : ''}
                  </Typography>
                </TableCell>
              )}
              <TableCell sx={{ py: 1.75, maxWidth: 400 }}>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    fontFamily: 'inherit',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {material.description}
                </Typography>
              </TableCell>
              <TableCell sx={{ py: 1.75 }}>
                {useIsActive ? getStatusChip(material?.isActive ? 'active' : 'unactive') : getStatusChip(material.status || 'pending')}
              </TableCell>
              {showActions && (
                <TableCell sx={{ py: 1.75 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                    <Tooltip title="View Details">
                      <IconButton 
                        size="small"
                        onClick={() => handleViewMaterial(material)}
                        sx={{ 
                          color: '#12422a',
                          '&:hover': {
                            backgroundColor: '#f0f9f4',
                          }
                        }}
                      >
                        <ViewIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton 
                        size="small"
                        onClick={() => handleEditMaterial(material)}
                        disabled={material.status === 'approved'}
                        sx={{ 
                          color: '#16a34a',
                          '&:hover': {
                            backgroundColor: '#f0f9f4',
                          },
                          '&.Mui-disabled': {
                            color: '#d1d5db'
                          }
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton 
                        size="small"
                        onClick={() => handleDeleteMaterial(material)}
                        disabled={material.status === 'approved'}
                        sx={{ 
                          color: '#ef4444',
                          '&:hover': {
                            backgroundColor: '#fef2f2',
                          },
                          '&.Mui-disabled': {
                            color: '#d1d5db'
                          }
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  ); };

  const renderMaterialsCards = (materials, showActions = false, useIsActive = false) => {
    return (
      <Grid container spacing={2.5} className="materials-grid">
        {materials.map((material, index) => (
          <Grid item xs={12} sm={6} md={4} key={material.id || index}>
            <Card 
              className="material-card" 
              elevation={0}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid #e5e7eb',
                borderRadius: 2,
                backgroundColor: 'white',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                  transform: 'translateY(-4px)',
                  borderColor: '#12422a',
                }
              }}
            >
              <CardContent sx={{ p: 2.5, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Box className="card-header" sx={{ mb: 2 }}>
                  <Box className="card-title-section" sx={{ flex: 1 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 1.5,
                        backgroundColor: '#f0f9f4',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 1.5,
                      }}
                    >
                      <CategoryIcon sx={{ fontSize: 24, color: '#12422a' }} />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography 
                        className="card-title"
                        sx={{
                          fontSize: '1.125rem',
                          fontWeight: 700,
                          color: '#1a1a1a',
                          mb: 0.5,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {material.materialName || material.requestedMaterialName}
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        {useIsActive ? getStatusChip(material?.isActive ? 'active' : 'unactive') : getStatusChip(material.status || 'pending')}
                      </Box>
                    </Box>
                  </Box>
                  {showActions && (
                    <Box sx={{ display: 'flex', gap: 0.5, ml: 1 }}>
                      <Tooltip title="View Details">
                        <IconButton 
                          size="small" 
                          onClick={() => handleViewMaterial(material)} 
                          sx={{
                            color: '#12422a',
                            '&:hover': {
                              backgroundColor: '#f0f9f4',
                            }
                          }}
                        >
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton 
                          size="small" 
                          onClick={() => handleEditMaterial(material)} 
                          disabled={material.status === 'approved'}
                          sx={{
                            color: '#16a34a',
                            '&:hover': {
                              backgroundColor: '#f0f9f4',
                            },
                            '&.Mui-disabled': {
                              color: '#d1d5db'
                            }
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton 
                          size="small" 
                          onClick={() => handleDeleteMaterial(material)} 
                          disabled={material.status === 'approved'}
                          sx={{
                            color: '#ef4444',
                            '&:hover': {
                              backgroundColor: '#fef2f2',
                            },
                            '&.Mui-disabled': {
                              color: '#d1d5db'
                            }
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}
                </Box>

                <Box className="card-details" sx={{ flex: 1 }}>
                  <Box className="detail-row" sx={{ mb: 1.5 }}>
                    <Typography 
                      className="detail-label"
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
                      className="detail-value"
                      sx={{
                        fontSize: '0.875rem',
                        color: '#374151',
                        lineHeight: 1.6,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {material.description || '-'}
                    </Typography>
                  </Box>
                  {(material.maximumReuse || material.reuseLimit) && (
                    <Box className="detail-row" sx={{ mb: 1.5 }}>
                      <Typography 
                        className="detail-label"
                        sx={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: '#6b7280',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          mb: 0.5,
                        }}
                      >
                        Maximum Reuse
                      </Typography>
                      <Typography 
                        className="detail-value"
                        sx={{
                          fontSize: '0.875rem',
                          color: '#374151',
                          fontWeight: 600,
                        }}
                      >
                        {(material.maximumReuse || material.reuseLimit)} times
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Box className="materials-page" sx={{ p: 3, fontFamily: 'inherit', backgroundColor: '#f5f7fa' }}>
      {/* Header Section */}
      <Box className="materials-header" sx={{ mb: 3 }}>
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
              <EcoIcon sx={{ fontSize: 32, color: 'white' }} />
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
                  mb: 0.5
                }}
              >
                Materials Management
              </Typography>
              <Typography variant="body1" sx={{ color: '#6b7280', fontSize: '0.95rem' }}>
                Manage and track your eco-friendly materials inventory
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
              transition: 'all 0.3s ease'
            }}
            className="add-button"
          >
            Add New Material
          </Button>
        </Box>

        {/* Statistics Cards */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 3 }}>
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
                My Active Materials 
              </Typography>
              <CategoryIcon sx={{ fontSize: 20, color: '#9ca3af' }} />
            </Box>
            <Typography variant="h4" sx={{ color: '#1a1a1a', fontWeight: 700 }}>
              {myMaterials.length}
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
                Active Materials
              </Typography>
              <ApprovedIcon sx={{ fontSize: 20, color: '#16a34a' }} />
            </Box>
            <Typography variant="h4" sx={{ color: '#16a34a', fontWeight: 700 }}>
              {approvedMaterials.length}
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
                Rejected
              </Typography>
              <DeleteIcon sx={{ fontSize: 20, color: '#ef4444' }} />
            </Box>
            <Typography variant="h4" sx={{ color: '#ef4444', fontWeight: 700 }}>
              {rejectedMaterials.length}
            </Typography>
          </Paper>
        </Box>

        {/* Search and View Toggle */}
        <Box className="materials-toolbar" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <TextField
            size="small"
            placeholder="Search materials by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            sx={{
              minWidth: 320,
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, backgroundColor: 'white', borderRadius: 2, p: 0.5, border: '1px solid #e5e7eb' }}>
            <Tooltip title="List View">
              <IconButton
                className={`view-toggle ${viewMode === 'table' ? 'active' : ''}`}
                onClick={() => setViewMode('table')}
                size="small"
                sx={{
                  borderRadius: 1.5,
                  color: viewMode === 'table' ? '#12422a' : '#6b7280',
                  backgroundColor: viewMode === 'table' ? '#f0f9f4' : 'transparent',
                  '&:hover': {
                    backgroundColor: viewMode === 'table' ? '#e0f2e9' : '#f9fafb',
                  },
                }}
              >
                <ViewListIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Card View">
              <IconButton
                className={`view-toggle ${viewMode === 'cards' ? 'active' : ''}`}
                onClick={() => setViewMode('cards')}
                size="small"
                sx={{
                  borderRadius: 1.5,
                  color: viewMode === 'cards' ? '#12422a' : '#6b7280',
                  backgroundColor: viewMode === 'cards' ? '#f0f9f4' : 'transparent',
                  '&:hover': {
                    backgroundColor: viewMode === 'cards' ? '#e0f2e9' : '#f9fafb',
                  },
                }}
              >
                <ViewModuleIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>

      {/* Error Alert */}
      {materialError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {typeof materialError === 'string' ? materialError : (materialError?.message || 'Something went wrong')}
        </Alert>
      )}


      {/* Main Content */}
      <Box>
        {materialLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
            <CircularProgress sx={{ color: '#12422a' }} />
          </Box>
        ) : (
          <>
            {/* My Materials Section - Main */}
            <Paper
              elevation={0}
              sx={{
                mb: 3,
                borderRadius: 2,
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  p: 2.5,
                  borderBottom: '1px solid #e5e7eb',
                  backgroundColor: '#f9fafb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 1.5,
                      backgroundColor: '#12422a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CategoryIcon sx={{ fontSize: 22, color: 'white' }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ color: '#1a1a1a', fontWeight: 700, mb: 0.25 }}>
                      My Materials
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.875rem' }}>
                      Materials you have created ({filtered.my.length})
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ p: 2.5 }}>
                {filtered.my.length === 0 ? (
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
                      <EcoIcon sx={{ fontSize: 40, color: '#12422a' }} />
                    </Box>
                    <Typography variant="h6" sx={{ color: '#1a1a1a', fontWeight: 600, mb: 1 }}>
                      No materials created yet
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6b7280', mb: 3, maxWidth: 400, mx: 'auto' }}>
                      Start building your eco-friendly materials inventory by creating your first material request
                    </Typography>
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
                        }
                      }}
                    >
                      Create Your First Material
                    </Button>
                  </Box>
                ) : (
                  <>
                    {viewMode === 'table' ? renderMaterialsTable(paginatedMy, true) : renderMaterialsCards(paginatedMy, true)}
                    {getTotalPages(filtered.my, itemsPerPage) > 1 && (
                      <Stack spacing={2} sx={{ mt: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Pagination
                          count={getTotalPages(filtered.my, itemsPerPage)}
                          page={myMaterialsPage}
                          onChange={(event, value) => setMyMaterialsPage(value)}
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
                      </Stack>
                    )}
                  </>
                )}
              </Box>
            </Paper>

            {/* Active and Rejected Materials - Side by Side */}
            <Grid container spacing={3}>
              {/* Active Materials Section */}
              <Grid item xs={12} md={6}>
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 2,
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                    overflow: 'hidden',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: 500,
                  }}
                >
                  <Box
                    sx={{
                      p: 2.5,
                      borderBottom: '1px solid #e5e7eb',
                      backgroundColor: '#f0fdf4',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 1.5,
                        backgroundColor: '#16a34a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <ApprovedIcon sx={{ fontSize: 22, color: 'white' }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ color: '#1a1a1a', fontWeight: 700, mb: 0.25 }}>
                        Active Materials
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.875rem' }}>
                        Approved and available ({filtered.approved.length})
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ p: 2.5, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {filtered.approved.length === 0 ? (
                      <Box sx={{ textAlign: 'center', py: 4, px: 2, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Box
                          sx={{
                            width: 60,
                            height: 60,
                            borderRadius: '50%',
                            backgroundColor: '#f0f9f4',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mx: 'auto',
                            mb: 1.5,
                          }}
                        >
                          <ApprovedIcon sx={{ fontSize: 30, color: '#16a34a' }} />
                        </Box>
                        <Typography variant="body1" sx={{ color: '#1a1a1a', fontWeight: 600, mb: 0.5 }}>
                          No approved materials
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.875rem' }}>
                          Approved materials will appear here
                        </Typography>
                      </Box>
                    ) : (
                      <>
                        <Box sx={{ flex: 1, overflowY: 'auto', mb: 2 }}>
                          {viewMode === 'table' ? (
                            renderMaterialsTable(paginatedActive, false, true)
                          ) : (
                            renderMaterialsCards(paginatedActive, false, true)
                          )}
                        </Box>
                        {getTotalPages(filtered.approved, itemsPerPage) > 1 && (
                          <Stack spacing={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 'auto' }}>
                            <Pagination
                              count={getTotalPages(filtered.approved, itemsPerPage)}
                              page={activePage}
                              onChange={(event, value) => setActivePage(value)}
                              variant="outlined"
                              shape="rounded"
                              color="primary"
                              size="small"
                              showFirstButton
                              showLastButton
                              sx={{
                                '& .MuiPaginationItem-root': {
                                  '&.Mui-selected': {
                                    backgroundColor: '#16a34a',
                                    color: '#ffffff',
                                    fontWeight: 600,
                                    '&:hover': {
                                      backgroundColor: '#15803d',
                                    },
                                  },
                                  '&:hover': {
                                    backgroundColor: 'rgba(22, 163, 74, 0.1)',
                                  },
                                },
                              }}
                            />
                          </Stack>
                        )}
                      </>
                    )}
                  </Box>
                </Paper>
              </Grid>

              {/* Rejected Materials Section */}
              <Grid item xs={12} md={6}>
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 2,
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                    overflow: 'hidden',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: 500,
                  }}
                >
                  <Box
                    sx={{
                      p: 2.5,
                      borderBottom: '1px solid #e5e7eb',
                      backgroundColor: '#fef2f2',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 1.5,
                        backgroundColor: '#ef4444',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <DeleteIcon sx={{ fontSize: 22, color: 'white' }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ color: '#1a1a1a', fontWeight: 700, mb: 0.25 }}>
                        Rejected Materials
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.875rem' }}>
                        Materials that were rejected ({filtered.rejected.length})
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ p: 2.5, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {filtered.rejected.length === 0 ? (
                      <Box sx={{ textAlign: 'center', py: 4, px: 2, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Box
                          sx={{
                            width: 60,
                            height: 60,
                            borderRadius: '50%',
                            backgroundColor: '#fef2f2',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mx: 'auto',
                            mb: 1.5,
                          }}
                        >
                          <DeleteIcon sx={{ fontSize: 30, color: '#ef4444' }} />
                        </Box>
                        <Typography variant="body1" sx={{ color: '#1a1a1a', fontWeight: 600, mb: 0.5 }}>
                          No rejected materials
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.875rem' }}>
                          Rejected materials will appear here with reasons
                        </Typography>
                      </Box>
                    ) : (
                      <>
                        <Box sx={{ flex: 1, overflowY: 'auto', mb: 2 }}>
                          {viewMode === 'table' ? (
                            renderMaterialsTable(paginatedRejected, true)
                          ) : (
                            renderMaterialsCards(paginatedRejected, true)
                          )}
                        </Box>
                        {getTotalPages(filtered.rejected, itemsPerPage) > 1 && (
                          <Stack spacing={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 'auto' }}>
                            <Pagination
                              count={getTotalPages(filtered.rejected, itemsPerPage)}
                              page={rejectedPage}
                              onChange={(event, value) => setRejectedPage(value)}
                              variant="outlined"
                              shape="rounded"
                              color="primary"
                              size="small"
                              showFirstButton
                              showLastButton
                              sx={{
                                '& .MuiPaginationItem-root': {
                                  '&.Mui-selected': {
                                    backgroundColor: '#ef4444',
                                    color: '#ffffff',
                                    fontWeight: 600,
                                    '&:hover': {
                                      backgroundColor: '#dc2626',
                                    },
                                  },
                                  '&:hover': {
                                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                  },
                                },
                              }}
                            />
                          </Stack>
                        )}
                      </>
                    )}
                  </Box>
                </Paper>
              </Grid>
            </Grid>
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
            boxShadow: '0 12px 40px rgba(18, 66, 42, 0.2)',
            overflow: 'hidden',
            background: 'linear-gradient(to bottom, #ffffff 0%, #f9fafb 100%)',
            maxHeight: '90vh'
          }
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
            justifyContent: 'space-between'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <EcoIcon sx={{ fontSize: 28 }} />
            <Box>
               <Typography variant="subtitle1" component="div" fontWeight={700} sx={{ fontFamily: 'inherit' }}>
                {editMode ? 'Edit Material' : 'Create New Material'}
              </Typography>
               <Typography variant="caption" sx={{ opacity: 0.9, mt: 0.25, display: 'block', fontFamily: 'inherit' }}>
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
             <Grid container spacing={2}>
              {/* Material Name Field */}
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
                   size="small"
                  error={!!formErrors.materialName}
                  helperText={formErrors.materialName || 'Enter a clear and descriptive name'}
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
              </Grid>

              {/* Note: Business request does not require reuse limit */}

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
                  placeholder="Describe the material, its uses, and benefits..."
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  multiline
                   minRows={3}
                  variant="outlined"
                   size="small"
                  error={!!formErrors.description}
                  helperText={formErrors.description || 'Provide detailed information about this material'}
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
                    background: 'linear-gradient(135deg, rgba(18, 66, 42, 0.08) 0%, rgba(13, 46, 28, 0.05) 100%)',
                    borderRadius: 2,
                    border: '2px solid rgba(18, 66, 42, 0.25)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1.5,
                    boxShadow: '0 2px 8px rgba(18, 66, 42, 0.1)'
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
                    <EcoIcon sx={{ color: 'white', fontSize: 20 }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ color: '#12422a', fontWeight: 700, mb: 0.5 }}>
                      🌱 Contributing to a Sustainable Future
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#0f2e1e', lineHeight: 1.5, display: 'block' }}>
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
               px: 2, 
               py: 1.5, 
              gap: 2,
              backgroundColor: 'rgba(18, 66, 42, 0.02)',
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
              className="cancel-button"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained"
              startIcon={editMode ? <EditIcon fontSize="small" /> : <AddIcon fontSize="small" />}
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
                }
              }}
               size="small"
              className="create-button"
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
            boxShadow: '0 8px 32px rgba(18, 66, 42, 0.15)'
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            background: 'linear-gradient(135deg, #166534 0%, #12422a 100%)',
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
                    backgroundColor: 'rgba(18, 66, 42, 0.05)',
                    borderRadius: 2,
                    border: '1px solid rgba(18, 66, 42, 0.2)'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <CategoryIcon sx={{ color: '#12422a', fontSize: 20 }} />
                    <Typography variant="subtitle2" sx={{ color: '#12422a', fontWeight: 600 }}>
                      Material Name
                    </Typography>
                  </Box>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: '#1B5E20' }}>
                    {selectedMaterial.materialName || selectedMaterial.requestedMaterialName}
                  </Typography>
                </Paper>
              </Grid>

              {/* Maximum Reuse */}
              <Grid item xs={12} sm={6}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    backgroundColor: 'rgba(18, 66, 42, 0.05)',
                    borderRadius: 2,
                    border: '1px solid rgba(18, 66, 42, 0.2)',
                    height: '100%'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <ReplayIcon sx={{ color: '#12422a', fontSize: 20 }} />
                    <Typography variant="subtitle2" sx={{ color: '#12422a', fontWeight: 600 }}>
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
                    backgroundColor: 'rgba(18, 66, 42, 0.05)',
                    borderRadius: 2,
                    border: '1px solid rgba(18, 66, 42, 0.2)',
                    height: '100%'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <ApprovedIcon sx={{ color: '#12422a', fontSize: 20 }} />
                    <Typography variant="subtitle2" sx={{ color: '#12422a', fontWeight: 600 }}>
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
                    backgroundColor: 'rgba(18, 66, 42, 0.05)',
                    borderRadius: 2,
                    border: '1px solid rgba(18, 66, 42, 0.2)'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <DescriptionIcon sx={{ color: '#12422a', fontSize: 20 }} />
                    <Typography variant="subtitle2" sx={{ color: '#12422a', fontWeight: 600 }}>
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
              backgroundColor: '#12422a',
              px: 3,
              py: 1,
              '&:hover': {
                backgroundColor: '#0d2e1c'
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


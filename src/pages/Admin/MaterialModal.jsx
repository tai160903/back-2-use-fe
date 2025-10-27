import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  InputAdornment,
  Grid,
  Divider,
} from '@mui/material';
import {
  Recycling as EcoIcon,
  Category as CategoryIcon,
  Replay as ReplayIcon,
  Description as DescriptionIcon,
  Close as CloseIcon,
  Add as AddIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import './MaterialModal.css';

const MaterialModal = ({ isOpen, onClose, material, onSubmit }) => {
  const [formData, setFormData] = useState({
    materialName: '',
    maximumReuse: '',
    description: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (material) {
      setFormData({
        materialName: material.materialName || '',
        maximumReuse: material.maximumReuse || '',
        description: material.description || ''
      });
    } else {
      setFormData({
        materialName: '',
        maximumReuse: '',
        description: ''
      });
    }
    setErrors({});
  }, [material, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.materialName.trim()) {
      newErrors.materialName = 'Material name is required';
    }

    if (!formData.maximumReuse) {
      newErrors.maximumReuse = 'Maximum reuse count is required';
    } else if (isNaN(formData.maximumReuse) || parseInt(formData.maximumReuse) <= 0) {
      newErrors.maximumReuse = 'Maximum reuse must be a positive number';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        materialName: formData.materialName.trim(),
        maximumReuse: parseInt(formData.maximumReuse),
        description: formData.description.trim()
      });
    }
  };

  const handleClose = () => {
    setFormData({
      materialName: '',
      maximumReuse: '',
      description: ''
    });
    setErrors({});
    onClose();
  };

  const editMode = !!material;

  return (
    <Dialog 
      open={isOpen} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      TransitionProps={{
        timeout: 400,
      }}
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 12px 40px rgba(34, 197, 94, 0.2)',
          overflow: 'hidden',
          background: 'linear-gradient(to bottom, #ffffff 0%, #f9fdf9 100%)',
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
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
              {editMode ? 'Edit Material' : 'Add New Material'}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9, mt: 0.25, display: 'block' }}>
              {editMode ? 'Update recyclable material details' : 'Add a new recyclable material to the platform'}
            </Typography>
          </Box>
        </Box>
        <IconButton 
          onClick={handleClose}
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
                    color: '#16a34a', 
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
                placeholder="e.g., Plastic, Glass, Aluminum"
                name="materialName"
                value={formData.materialName}
                onChange={handleInputChange}
                required
                variant="outlined"
                error={!!errors.materialName}
                helperText={errors.materialName || 'Enter a clear and descriptive name'}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CategoryIcon sx={{ color: '#22c55e' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    '&:hover fieldset': {
                      borderColor: '#22c55e',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#22c55e',
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
                    color: '#16a34a', 
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
                error={!!errors.maximumReuse}
                helperText={errors.maximumReuse || 'Number of reuses'}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ReplayIcon sx={{ color: '#22c55e' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Typography variant="body2" sx={{ color: '#16a34a', fontWeight: 600 }}>
                        times
                      </Typography>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    '&:hover fieldset': {
                      borderColor: '#22c55e',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#22c55e',
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
                    color: '#16a34a', 
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
                placeholder="Describe the material properties and characteristics..."
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                multiline
                rows={3}
                variant="outlined"
                error={!!errors.description}
                helperText={errors.description || 'Provide detailed information about this material'}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.2 }}>
                      <DescriptionIcon sx={{ color: '#22c55e', fontSize: 18 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    '&:hover fieldset': {
                      borderColor: '#22c55e',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#22c55e',
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
                  background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.05) 100%)',
                  borderRadius: 2,
                  border: '2px solid rgba(34, 197, 94, 0.3)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1.5,
                  boxShadow: '0 2px 8px rgba(34, 197, 94, 0.1)'
                }}
              >
                <Box 
                  sx={{ 
                    backgroundColor: '#22c55e',
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
                  <Typography variant="body2" sx={{ color: '#16a34a', fontWeight: 700, mb: 0.5 }}>
                    ♻️ Recyclable Material
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#15803d', lineHeight: 1.5, display: 'block' }}>
                    By adding recyclable materials, you're helping reduce waste and promote sustainability.
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
            backgroundColor: 'rgba(34, 197, 94, 0.02)',
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <Button 
            onClick={handleClose}
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
              backgroundColor: '#22c55e',
              px: 3,
              py: 1,
              fontSize: '0.9375rem',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(34, 197, 94, 0.35)',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: '#16a34a',
                boxShadow: '0 6px 16px rgba(34, 197, 94, 0.45)',
                transform: 'translateY(-2px)',
              }
            }}
          >
            {editMode ? 'Update Material' : 'Create Material'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default MaterialModal;

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
  Scale as ScaleIcon,
  CloudQueue as CloudIcon,
} from '@mui/icons-material';
import './MaterialModal.css';

const MaterialModal = ({ isOpen, onClose, material, onSubmit }) => {
  const [formData, setFormData] = useState({
    materialName: '',
    reuseLimit: '',
    depositPercent: '',
    description: '',
    plasticEquivalentMultiplier: '',
    co2EmissionPerKg: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (material) {
      setFormData({
        materialName: material.materialName || '',
        reuseLimit: material.reuseLimit ?? material.maximumReuse ?? '',
        depositPercent: material.depositPercent ?? '',
        description: material.description || '',
        plasticEquivalentMultiplier: material.plasticEquivalentMultiplier ?? '',
        co2EmissionPerKg: material.co2EmissionPerKg ?? ''
      });
    } else {
      setFormData({
        materialName: '',
        reuseLimit: '',
        depositPercent: '',
        description: '',
        plasticEquivalentMultiplier: '',
        co2EmissionPerKg: ''
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

    if (!formData.reuseLimit) {
      newErrors.reuseLimit = 'Reuse limit is required';
    } else if (isNaN(formData.reuseLimit) || parseInt(formData.reuseLimit) <= 0) {
      newErrors.reuseLimit = 'Reuse limit must be a positive number';
    }

    if (formData.depositPercent === '' || formData.depositPercent === null) {
      newErrors.depositPercent = 'Deposit percent is required';
    } else if (isNaN(formData.depositPercent) || parseInt(formData.depositPercent) < 0 || parseInt(formData.depositPercent) > 100) {
      newErrors.depositPercent = 'Deposit percent must be between 0 and 100';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.plasticEquivalentMultiplier === '' || formData.plasticEquivalentMultiplier === null) {
      newErrors.plasticEquivalentMultiplier = 'Plastic equivalent multiplier is required';
    } else if (isNaN(formData.plasticEquivalentMultiplier) || parseFloat(formData.plasticEquivalentMultiplier) < 0) {
      newErrors.plasticEquivalentMultiplier = 'Plastic equivalent multiplier must be a positive number';
    }

    if (formData.co2EmissionPerKg === '' || formData.co2EmissionPerKg === null) {
      newErrors.co2EmissionPerKg = 'CO2 emission per kg is required';
    } else if (isNaN(formData.co2EmissionPerKg) || parseFloat(formData.co2EmissionPerKg) < 0) {
      newErrors.co2EmissionPerKg = 'CO2 emission per kg must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        materialName: formData.materialName.trim(),
        reuseLimit: parseInt(formData.reuseLimit),
        depositPercent: parseInt(formData.depositPercent),
        description: formData.description.trim(),
        plasticEquivalentMultiplier: parseFloat(formData.plasticEquivalentMultiplier),
        co2EmissionPerKg: parseFloat(formData.co2EmissionPerKg)
      });
    }
  };

  const handleClose = () => {
    setFormData({
      materialName: '',
      reuseLimit: '',
      depositPercent: '',
      description: '',
      plasticEquivalentMultiplier: '',
      co2EmissionPerKg: ''
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

            {/* Reuse Limit Field */}
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
                  Reuse Limit <span style={{ color: '#f44336' }}>*</span>
                </Typography>
              </Box>
              <TextField
                fullWidth
                placeholder="100"
                name="reuseLimit"
                type="number"
                value={formData.reuseLimit}
                onChange={handleInputChange}
                required
                variant="outlined"
                inputProps={{ min: 1 }}
                error={!!errors.reuseLimit}
                helperText={errors.reuseLimit || 'Max times a material can be reused'}
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

            {/* Deposit Percent Field */}
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
                  Deposit Percent <span style={{ color: '#f44336' }}>*</span>
                </Typography>
              </Box>
              <TextField
                fullWidth
                placeholder="20"
                name="depositPercent"
                type="number"
                value={formData.depositPercent}
                onChange={handleInputChange}
                required
                variant="outlined"
                inputProps={{ min: 0, max: 100 }}
                error={!!errors.depositPercent}
                helperText={errors.depositPercent || 'Deposit percentage (0-100)'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%
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

            {/* Plastic Equivalent Multiplier Field */}
            <Grid item xs={12} md={6}>
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
                  <ScaleIcon sx={{ fontSize: 16 }} />
                  Plastic Equivalent Multiplier <span style={{ color: '#f44336' }}>*</span>
                </Typography>
              </Box>
              <TextField
                fullWidth
                placeholder="1"
                name="plasticEquivalentMultiplier"
                type="number"
                value={formData.plasticEquivalentMultiplier}
                onChange={handleInputChange}
                required
                variant="outlined"
                inputProps={{ min: 0, step: 0.1 }}
                error={!!errors.plasticEquivalentMultiplier}
                helperText={errors.plasticEquivalentMultiplier || 'Multiplier for plastic equivalent calculation'}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ScaleIcon sx={{ color: '#22c55e' }} />
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

            {/* CO2 Emission Per Kg Field */}
            <Grid item xs={12} md={6}>
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
                  <CloudIcon sx={{ fontSize: 16 }} />
                  CO2 Emission Per Kg <span style={{ color: '#f44336' }}>*</span>
                </Typography>
              </Box>
              <TextField
                fullWidth
                placeholder="3.4"
                name="co2EmissionPerKg"
                type="number"
                value={formData.co2EmissionPerKg}
                onChange={handleInputChange}
                required
                variant="outlined"
                inputProps={{ min: 0, step: 0.1 }}
                error={!!errors.co2EmissionPerKg}
                helperText={errors.co2EmissionPerKg || 'CO2 emission in kg per kg of material'}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CloudIcon sx={{ color: '#22c55e' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Typography variant="body2" sx={{ color: '#16a34a', fontWeight: 600 }}>
                        kg CO2/kg
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

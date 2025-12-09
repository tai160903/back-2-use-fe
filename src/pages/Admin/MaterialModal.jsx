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
} from '@mui/material';
import {
  Recycling as EcoIcon,
  Close as CloseIcon,
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
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '20px',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          maxWidth: '700px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          background: 'linear-gradient(135deg, #164e31 0%, #0f3d20 100%)',
          color: 'white',
          py: 2,
          px: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: '20px 20px 0 0',
          flexShrink: 0,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)',
            }}
          >
            <EcoIcon sx={{ fontSize: 20, color: 'white' }} />
          </Box>
          <Box>
            <Typography variant="h6" component="div" fontWeight={700} sx={{ fontSize: '22px', mb: 0.25 }}>
              {editMode ? 'Edit Material' : 'Create New Material'}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '14px' }}>
              {editMode ? 'Update recyclable material details' : 'Add a new recyclable material to the platform'}
            </Typography>
          </Box>
        </Box>
        <IconButton 
          onClick={handleClose}
          size="small"
          sx={{ 
            color: 'white',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              transform: 'scale(1.05)',
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <DialogContent 
          sx={{ 
            pt: 2, 
            pb: 1, 
            px: 2.5,
            overflowY: 'auto',
            flex: 1,
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#164e31',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: '#0f3d20',
            },
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              name="materialName"
              label="Material Name *"
              placeholder="e.g., Plastic, Glass, Aluminum"
              value={formData.materialName}
              onChange={handleInputChange}
              error={!!errors.materialName}
              helperText={errors.materialName || 'Enter a clear and descriptive name'}
              fullWidth
              required
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  fontSize: '14px',
                },
                '& .MuiInputLabel-root': {
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#374151',
                },
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#164e31',
                  borderWidth: '2px',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#164e31',
                }
              }}
            />

            <TextField
              name="reuseLimit"
              label="Reuse Limit *"
              placeholder="100"
              type="number"
              value={formData.reuseLimit}
              onChange={handleInputChange}
              error={!!errors.reuseLimit}
              helperText={errors.reuseLimit || 'Max times a material can be reused'}
              fullWidth
              required
              variant="outlined"
              inputProps={{ min: 1 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography variant="body2" sx={{ color: '#164e31', fontWeight: 600 }}>
                      times
                    </Typography>
                  </InputAdornment>
                ),
              }}
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  fontSize: '14px',
                },
                '& .MuiInputLabel-root': {
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#374151',
                },
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#164e31',
                  borderWidth: '2px',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#164e31',
                }
              }}
            />

            <TextField
              name="depositPercent"
              label="Deposit Percent (%) *"
              placeholder="20"
              type="number"
              value={formData.depositPercent}
              onChange={handleInputChange}
              error={!!errors.depositPercent}
              helperText={errors.depositPercent || 'Deposit percentage (0-100)'}
              fullWidth
              required
              variant="outlined"
              inputProps={{ min: 0, max: 100 }}
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  fontSize: '14px',
                },
                '& .MuiInputLabel-root': {
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#374151',
                },
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#164e31',
                  borderWidth: '2px',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#164e31',
                }
              }}
            />

            <TextField
              name="plasticEquivalentMultiplier"
              label="Plastic Equivalent Multiplier *"
              placeholder="1"
              type="number"
              value={formData.plasticEquivalentMultiplier}
              onChange={handleInputChange}
              error={!!errors.plasticEquivalentMultiplier}
              helperText={errors.plasticEquivalentMultiplier || 'Multiplier for plastic equivalent calculation'}
              fullWidth
              required
              variant="outlined"
              inputProps={{ min: 0, step: 0.1 }}
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  fontSize: '14px',
                },
                '& .MuiInputLabel-root': {
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#374151',
                },
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#164e31',
                  borderWidth: '2px',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#164e31',
                }
              }}
            />

            <TextField
              name="co2EmissionPerKg"
              label="CO2 Emission Per Kg *"
              placeholder="3.4"
              type="number"
              value={formData.co2EmissionPerKg}
              onChange={handleInputChange}
              error={!!errors.co2EmissionPerKg}
              helperText={errors.co2EmissionPerKg || 'CO2 emission in kg per kg of material'}
              fullWidth
              required
              variant="outlined"
              inputProps={{ min: 0, step: 0.1 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography variant="body2" sx={{ color: '#164e31', fontWeight: 600 }}>
                      kg CO2/kg
                    </Typography>
                  </InputAdornment>
                ),
              }}
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  fontSize: '14px',
                },
                '& .MuiInputLabel-root': {
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#374151',
                },
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#164e31',
                  borderWidth: '2px',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#164e31',
                }
              }}
            />

            <TextField
              name="description"
              label="Description *"
              placeholder="Describe the material properties and characteristics..."
              value={formData.description}
              onChange={handleInputChange}
              error={!!errors.description}
              helperText={errors.description || 'Provide detailed information about this material'}
              fullWidth
              required
              multiline
              rows={2}
              variant="outlined"
              size="small"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  fontSize: '14px',
                },
                '& .MuiInputLabel-root': {
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#374151',
                },
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#164e31',
                  borderWidth: '2px',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#164e31',
                }
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions 
          sx={{ 
            px: 2.5, 
            py: 1.5, 
            gap: 2, 
            borderTop: '1px solid',
            borderColor: 'divider',
            backgroundColor: '#fafafa',
            justifyContent: 'flex-end',
            flexShrink: 0,
          }}
        >
          <Button 
            onClick={handleClose}
            variant="outlined"
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '16px',
              px: 3,
              py: 1.5,
              borderWidth: '1px',
              color: '#374151',
              borderColor: '#d1d5db',
              '&:hover': {
                borderColor: '#9ca3af',
                backgroundColor: '#f9fafb',
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained"
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '16px',
              px: 4,
              py: 1.5,
              backgroundColor: '#164e31',
              '&:hover': {
                backgroundColor: '#0f3d20',
              },
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

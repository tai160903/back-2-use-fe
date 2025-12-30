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
  FormControlLabel,
  Switch,
  FormHelperText,
} from '@mui/material';
import {
  Recycling as EcoIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import MaterialReferenceTable from '../../components/MaterialReferenceTable/MaterialReferenceTable';
import './MaterialModal.css';

const MaterialModal = ({ isOpen, onClose, material, onSubmit }) => {
  const [formData, setFormData] = useState({
    materialName: '',
    reuseLimit: '',
    description: '',
    co2EmissionPerKg: '',
    isSingleUse: false
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (material) {
      setFormData({
        materialName: material.materialName || '',
        reuseLimit: material.reuseLimit ?? material.maximumReuse ?? '',
        description: material.description || '',
        co2EmissionPerKg: material.co2EmissionPerKg ?? '',
        isSingleUse: material.isSingleUse ?? false
      });
    } else {
      setFormData({
        materialName: '',
        reuseLimit: '',
        description: '',
        co2EmissionPerKg: '',
        isSingleUse: false
      });
    }
    setErrors({});
  }, [material, isOpen]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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

    if (!formData.reuseLimit && !formData.isSingleUse) {
      newErrors.reuseLimit = 'Reuse limit is required';
    } else if (!formData.isSingleUse && (isNaN(formData.reuseLimit) || parseInt(formData.reuseLimit) <= 1)) {
      newErrors.reuseLimit = 'Reusable materials must have reuse limit greater than 1';
    } else if (formData.isSingleUse && formData.reuseLimit && parseInt(formData.reuseLimit) !== 1) {
      newErrors.reuseLimit = 'Single-use materials must have reuse limit of 1';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
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
      const submitData = {
        materialName: formData.materialName.trim(),
        reuseLimit: formData.isSingleUse ? 1 : parseInt(formData.reuseLimit),
        description: formData.description.trim(),
        co2EmissionPerKg: parseFloat(formData.co2EmissionPerKg),
        isSingleUse: formData.isSingleUse
      };
      
      onSubmit(submitData);
    }
  };

  const handleClose = () => {
    setFormData({
      materialName: '',
      reuseLimit: '',
      description: '',
      co2EmissionPerKg: '',
      isSingleUse: false
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
          borderRadius: '20px',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
          maxWidth: '1400px',
          width: { xs: '95vw', sm: '90vw', md: '85vw' },
          maxHeight: '90vh',
          height: 'auto',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'visible',
          margin: '20px',
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          background: 'linear-gradient(135deg, #164e31 0%, #0f3d20 100%)',
          color: 'white',
          py: 1.5,
          px: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: '20px 20px 0 0',
          flexShrink: 0,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)',
            }}
          >
            <EcoIcon sx={{ fontSize: 18, color: 'white' }} />
          </Box>
          <Box>
            <Typography variant="h6" component="div" fontWeight={700} sx={{ fontSize: '19px', mb: 0.25 }}>
              {editMode ? 'Edit Material' : 'Create New Material'}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '13px' }}>
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

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        <DialogContent 
          sx={{ 
            pt: 1.5, 
            pb: 0.5, 
            px: 2.5,
            overflow: 'hidden',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            height: 'calc(90vh - 180px)',
            maxHeight: '600px',
            minHeight: '500px',
          }}
        >
          <Box sx={{ display: 'flex', height: '100%', gap: 2, overflow: 'hidden' }}>
            {/* Form Section */}
            <Box sx={{ 
              flex: '0 0 35%',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              pr: 1,
            }}>
              <Box sx={{ 
                overflowY: 'auto',
                flex: 1,
                minHeight: 0,
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
              }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isSingleUse}
                  onChange={handleInputChange}
                  name="isSingleUse"
                  color="primary"
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#164e31',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#164e31',
                    },
                  }}
                />
              }
              label={
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151', fontSize: '14px' }}>
                    Single-Use Material
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '12px', display: 'block' }}>
                    {formData.isSingleUse 
                      ? 'This material is for single-use products (reuse limit will be set to 1)'
                      : 'This material is reusable (reuse limit can be set to any value > 1)'}
                  </Typography>
                </Box>
              }
              sx={{ 
                alignItems: 'flex-start',
                marginLeft: 0,
                marginBottom: 0.5,
                '& .MuiFormControlLabel-label': {
                  marginLeft: 1.5,
                }
              }}
            />

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
              placeholder={formData.isSingleUse ? "1" : "100"}
              type="number"
              value={formData.isSingleUse ? 1 : formData.reuseLimit}
              onChange={handleInputChange}
              error={!!errors.reuseLimit}
              helperText={errors.reuseLimit || (formData.isSingleUse 
                ? 'Single-use materials have a reuse limit of 1'
                : 'Max times a material can be reused')}
              fullWidth
              required
              variant="outlined"
              inputProps={{ min: 1 }}
              disabled={formData.isSingleUse}
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
              rows={1}
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
                </Box>
              </Box>
            </Box>
            
            {/* Reference Table Section */}
            <Box sx={{ 
              flex: '0 0 65%',
              display: 'flex',
              flexDirection: 'column',
              borderLeft: '1px solid #e2e8f0',
              pl: 2,
              overflow: 'hidden',
              height: '100%',
              minHeight: 0,
            }}>
              <MaterialReferenceTable />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions 
          sx={{ 
            px: { xs: 2, sm: 2.5 }, 
            py: 2, 
            gap: 1.5, 
            borderTop: '1px solid',
            borderColor: 'divider',
            backgroundColor: '#fafafa',
            justifyContent: 'flex-end',
            flexShrink: 0,
            minHeight: '70px',
            overflow: 'visible',
            flexWrap: 'wrap',
          }}
        >
          <Button 
            onClick={handleClose}
            variant="outlined"
            sx={{
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '15px',
              px: 2.5,
              py: 1.25,
              minHeight: '44px',
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
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '15px',
              px: 3,
              py: 1.25,
              minHeight: '44px',
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

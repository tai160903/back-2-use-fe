import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import {
  Close as CloseIcon,
  CardGiftcard as VoucherIcon,
} from '@mui/icons-material';

const VoucherModal = ({ isOpen, onClose, voucher, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    baseCode: '',
    discountPercent: '',
  });

  const [errors, setErrors] = useState({});
  const [isDescriptionFocused, setIsDescriptionFocused] = useState(false);

  // Calculate rows for description based on content
  const calculateDescriptionRows = () => {
    if (isDescriptionFocused) {
      // When focused, expand based on content
      const lineCount = formData.description.split('\n').length;
      const minRows = 3;
      const maxRows = 8;
      // Calculate rows based on content length and line breaks
      const estimatedRows = Math.max(
        minRows,
        Math.min(maxRows, Math.ceil(formData.description.length / 50) + lineCount - 1)
      );
      return estimatedRows;
    }
    // When not focused, show same height as other fields (1 row to match single-line inputs)
    return 1;
  };

  useEffect(() => {
    if (voucher) {
      setFormData({
        name: voucher.name || '',
        description: voucher.description || '',
        baseCode: voucher.baseCode || '',
        discountPercent: voucher.discountPercent || voucher.discount || '',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        baseCode: '',
        discountPercent: '',
      });
    }
    setErrors({});
  }, [voucher, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Voucher name is required';
    }

    if (!formData.baseCode.trim()) {
      newErrors.baseCode = 'Base code is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.discountPercent || formData.discountPercent <= 0) {
      newErrors.discountPercent = 'Discount percent must be greater than 0';
    } else if (formData.discountPercent > 100) {
      newErrors.discountPercent = 'Discount percent cannot exceed 100%';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const submitData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        discountPercent: parseFloat(formData.discountPercent),
        baseCode: formData.baseCode.trim().toUpperCase(),
      };
      
      onSubmit(submitData);
    }
  };

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '20px',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          maxWidth: '900px',
        }
      }}
    >
      {/* Header */}
      <DialogTitle 
        sx={{ 
          background: 'linear-gradient(135deg, #164e31 0%, #0f3d20 100%)',
          color: 'white',
          py: 3,
          px: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: '20px 20px 0 0',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)',
            }}
          >
            <VoucherIcon sx={{ fontSize: 24, color: 'white' }} />
          </Box>
          <Box>
            <Typography variant="h6" component="div" fontWeight={700} sx={{ fontSize: '28px', mb: 0.5 }}>
              {voucher ? 'Edit Voucher' : 'Create New Voucher'}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '16px' }}>
              {voucher ? 'Update voucher information' : 'Create a new leaderboard voucher for top-ranked customers'}
            </Typography>
          </Box>
        </Box>
        <IconButton 
          onClick={onClose}
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

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 3, pb: 2, px: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              name="name"
              label="Voucher Name *"
              placeholder="Enter voucher name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              fullWidth
              required
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  fontSize: '16px',
                },
                '& .MuiInputLabel-root': {
                  fontSize: '16px',
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
              name="baseCode"
              label="Base Code *"
              placeholder="E.G. SUMMER2025"
              value={formData.baseCode}
              onChange={handleChange}
              error={!!errors.baseCode}
              helperText={errors.baseCode || 'Code will be automatically converted to uppercase'}
              fullWidth
              required
              variant="outlined"
              inputProps={{
                style: { textTransform: 'uppercase' },
                maxLength: 20,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontFamily: 'monospace',
                },
                '& .MuiInputLabel-root': {
                  fontSize: '16px',
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
              name="discountPercent"
              label="Discount Percent (%) *"
              type="number"
              placeholder="0"
              value={formData.discountPercent}
              onChange={handleChange}
              error={!!errors.discountPercent}
              helperText={errors.discountPercent || 'Discount percentage for top-ranked customers (0-100%)'}
              fullWidth
              required
              variant="outlined"
              inputProps={{ min: 0, max: 100, step: 0.1 }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  fontSize: '16px',
                },
                '& .MuiInputLabel-root': {
                  fontSize: '16px',
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
              placeholder="Enter voucher description"
              value={formData.description}
              onChange={handleChange}
              onFocus={() => setIsDescriptionFocused(true)}
              onBlur={() => setIsDescriptionFocused(false)}
              error={!!errors.description}
              helperText={errors.description}
              multiline
              rows={3}
              fullWidth
              required
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  fontSize: '16px',
                },
                '& .MuiInputLabel-root': {
                  fontSize: '16px',
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

        {/* Footer Actions */}
        <DialogActions 
          sx={{ 
            px: 3, 
            py: 2.5, 
            gap: 2, 
            borderTop: '1px solid',
            borderColor: 'divider',
            backgroundColor: '#fafafa',
            justifyContent: 'flex-end',
          }}
        >
          <Button 
            onClick={onClose}
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
            {voucher ? 'Update Voucher' : 'Create Voucher'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default VoucherModal;

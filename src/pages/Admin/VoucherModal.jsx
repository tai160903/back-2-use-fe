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
  InputAdornment,
  Paper,
  Stack,
  Grid,
} from '@mui/material';
import {
  Close as CloseIcon,
  CardGiftcard as VoucherIcon,
  Percent as PercentIcon,
  Code as CodeIcon,
  Description as DescriptionIcon,
  Title as TitleIcon,
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
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
          overflow: 'hidden',
        }
      }}
    >
      {/* Header */}
      <DialogTitle 
        sx={{ 
          background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
          color: 'white',
          py: 2.5,
          px: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'rgba(255, 255, 255, 0.2)',
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <VoucherIcon sx={{ fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h6" component="div" fontWeight="bold" sx={{ mb: 0.5 }}>
              {voucher ? 'Edit Voucher' : 'Create New Voucher'}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.95, fontSize: '0.875rem' }}>
              {voucher ? 'Update voucher information' : 'Create a new leaderboard voucher for top-ranked customers'}
            </Typography>
          </Box>
        </Box>
        <IconButton 
          onClick={onClose}
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
        <DialogContent sx={{ pt: 4, pb: 2, px: 3 }}>
          <Grid container spacing={2.5}>
            {/* Row 1: Voucher Name and Base Code */}
            <Grid item xs={12} sm={6}>
              <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <TitleIcon sx={{ fontSize: 20, color: '#22c55e' }} />
                  <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                    Voucher Name
                  </Typography>
                  <Typography component="span" sx={{ color: 'error.main', ml: 0.5 }}>*</Typography>
                </Box>
                <TextField
                  name="name"
                  placeholder="Enter voucher name"
                  value={formData.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  fullWidth
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      height: '56.5px',
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
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <CodeIcon sx={{ fontSize: 20, color: '#22c55e' }} />
                  <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                    Base Code
                  </Typography>
                  <Typography component="span" sx={{ color: 'error.main', ml: 0.5 }}>*</Typography>
                </Box>
                <TextField
                  name="baseCode"
                  placeholder="e.g. SUMMER2025"
                  value={formData.baseCode}
                  onChange={handleChange}
                  error={!!errors.baseCode}
                  helperText={errors.baseCode || 'Code will be automatically converted to uppercase'}
                  fullWidth
                  required
                  inputProps={{
                    style: { textTransform: 'uppercase' },
                    maxLength: 20,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      fontFamily: 'monospace',
                      height: '56.5px',
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
              </Box>
            </Grid>

            {/* Row 2: Description and Discount Percent */}
            <Grid item xs={12} sm={6}>
              <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <DescriptionIcon sx={{ fontSize: 20, color: '#22c55e' }} />
                  <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                    Description
                  </Typography>
                  <Typography component="span" sx={{ color: 'error.main', ml: 0.5 }}>*</Typography>
                </Box>
                <TextField
                  name="description"
                  placeholder="Enter voucher description"
                  value={formData.description}
                  onChange={handleChange}
                  onFocus={() => setIsDescriptionFocused(true)}
                  onBlur={() => setIsDescriptionFocused(false)}
                  error={!!errors.description}
                  helperText={errors.description}
                  multiline
                  rows={calculateDescriptionRows()}
                  fullWidth
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      minHeight: isDescriptionFocused ? 'auto' : '56.5px',
                      height: isDescriptionFocused ? 'auto' : '56.5px',
                      alignItems: isDescriptionFocused ? 'flex-start' : 'center',
                      '&:hover fieldset': {
                        borderColor: '#22c55e',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#22c55e',
                        borderWidth: 2,
                      },
                    },
                    '& .MuiInputBase-input': {
                      transition: 'all 0.3s ease',
                      overflow: isDescriptionFocused ? 'auto' : 'hidden',
                      paddingTop: isDescriptionFocused ? '16.5px' : '16.5px',
                      paddingBottom: isDescriptionFocused ? '16.5px' : '16.5px',
                      minHeight: isDescriptionFocused ? 'auto' : '23px',
                      lineHeight: isDescriptionFocused ? '1.5' : '1.4375em',
                      height: isDescriptionFocused ? 'auto' : '23px',
                    },
                  }}
                />
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <PercentIcon sx={{ fontSize: 20, color: '#22c55e' }} />
                  <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                    Discount Percent
                  </Typography>
                  <Typography component="span" sx={{ color: 'error.main', ml: 0.5 }}>*</Typography>
                </Box>
                <TextField
                  name="discountPercent"
                  type="number"
                  placeholder="0"
                  value={formData.discountPercent}
                  onChange={handleChange}
                  error={!!errors.discountPercent}
                  helperText={errors.discountPercent || 'Discount percentage for top-ranked customers (0-100%)'}
                  fullWidth
                  required
                  inputProps={{ min: 0, max: 100, step: 0.1 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Typography variant="body2" sx={{ color: '#22c55e', fontWeight: 600 }}>
                          %
                        </Typography>
                      </InputAdornment>
                    )
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      height: '56.5px',
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
              </Box>
            </Grid>
          </Grid>
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
          }}
        >
          <Button 
            onClick={onClose}
            variant="outlined"
            sx={{
              color: '#6b7280',
              borderColor: '#d1d5db',
              px: 3,
              py: 1.25,
              fontSize: '0.9375rem',
              fontWeight: 600,
              borderRadius: 2,
              textTransform: 'none',
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
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              color: 'white',
              px: 4,
              py: 1.25,
              fontSize: '0.9375rem',
              fontWeight: 600,
              borderRadius: 2,
              textTransform: 'none',
              boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                boxShadow: '0 6px 16px rgba(34, 197, 94, 0.4)',
                transform: 'translateY(-1px)',
              },
              '&:active': {
                transform: 'translateY(0)',
              }
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

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  IconButton,
  Alert,
} from '@mui/material';
import {
  Close as CloseIcon,
  CardGiftcard as VoucherIcon,
} from '@mui/icons-material';

const VoucherModal = ({ isOpen, onClose, voucher, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    discount: '',
    baseCode: '',
    rewardPointCost: '',
    maxUsage: '',
    endDate: '',
    description: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (voucher) {
      setFormData({
        name: voucher.name || '',
        discount: voucher.discount || '',
        baseCode: voucher.baseCode || '',
        rewardPointCost: voucher.rewardPointCost || '',
        maxUsage: voucher.maxUsage || '',
        endDate: voucher.endDate ? voucher.endDate.split('T')[0] : '',
        description: voucher.description || '',
      });
    } else {
      setFormData({
        name: '',
        discount: '',
        baseCode: '',
        rewardPointCost: '',
        maxUsage: '',
        endDate: '',
        description: '',
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

    if (!formData.discount || formData.discount <= 0) {
      newErrors.discount = 'Discount must be greater than 0';
    }

    if (formData.discount > 100) {
      newErrors.discount = 'Discount cannot exceed 100%';
    }

    if (!formData.baseCode.trim()) {
      newErrors.baseCode = 'Base code is required';
    }

    if (!formData.rewardPointCost || formData.rewardPointCost <= 0) {
      newErrors.rewardPointCost = 'Reward point cost must be greater than 0';
    }

    if (!formData.maxUsage || formData.maxUsage <= 0) {
      newErrors.maxUsage = 'Max usage must be greater than 0';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit(formData);
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
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          background: 'linear-gradient(135deg, #12422a 0%, #0d2e1c 100%)',
          color: 'white',
          py: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <VoucherIcon sx={{ fontSize: 32 }} />
          <Box>
            <Typography variant="h5" component="div" fontWeight="bold">
              {voucher ? 'Edit Voucher' : 'Create New Voucher'}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
              {voucher ? 'Update voucher information' : 'Add a new voucher to the system'}
            </Typography>
          </Box>
        </Box>
        <IconButton 
          onClick={onClose}
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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            name="name"
            label="Voucher Name"
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
            required
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              name="discount"
              label="Discount (%)"
              type="number"
              value={formData.discount}
              onChange={handleChange}
              error={!!errors.discount}
              helperText={errors.discount}
              fullWidth
              required
              inputProps={{ min: 0, max: 100 }}
            />

            <TextField
              name="baseCode"
              label="Base Code"
              value={formData.baseCode}
              onChange={handleChange}
              error={!!errors.baseCode}
              helperText={errors.baseCode}
              fullWidth
              required
              placeholder="e.g. SUMMER2025"
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              name="rewardPointCost"
              label="Reward Point Cost"
              type="number"
              value={formData.rewardPointCost}
              onChange={handleChange}
              error={!!errors.rewardPointCost}
              helperText={errors.rewardPointCost}
              fullWidth
              required
              inputProps={{ min: 0 }}
            />

            <TextField
              name="maxUsage"
              label="Max Usage"
              type="number"
              value={formData.maxUsage}
              onChange={handleChange}
              error={!!errors.maxUsage}
              helperText={errors.maxUsage}
              fullWidth
              required
              inputProps={{ min: 0 }}
            />
          </Box>

          <TextField
            name="endDate"
            label="End Date"
            type="date"
            value={formData.endDate}
            onChange={handleChange}
            error={!!errors.endDate}
            helperText={errors.endDate}
            fullWidth
            required
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            name="description"
            label="Description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={4}
            fullWidth
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2.5, gap: 1.5 }}>
        <Button 
          onClick={onClose}
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
          onClick={handleSubmit}
          variant="contained"
          sx={{
            background: 'linear-gradient(135deg, #12422a 0%, #0d2e1c 100%)',
            px: 3,
            py: 1,
            boxShadow: '0 4px 12px rgba(18, 66, 42, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #0d2e1c 0%, #12422a 100%)',
              boxShadow: '0 6px 16px rgba(18, 66, 42, 0.4)',
            }
          }}
        >
          {voucher ? 'Update Voucher' : 'Create Voucher'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VoucherModal;


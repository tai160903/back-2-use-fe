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

const VoucherModal = ({ isOpen, onClose, voucher, onSubmit, voucherType }) => {
  const [selectedVoucherType, setSelectedVoucherType] = useState(voucherType || 'system');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    baseCode: '',
    discountPercent: '',
    rewardPointCost: '',
    maxUsage: '',
    startDate: '',
    endDate: '',
    ecoRewardPolicyId: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (voucher) {
      setSelectedVoucherType(voucher.voucherType || 'system');
      setFormData({
        name: voucher.name || '',
        description: voucher.description || '',
        baseCode: voucher.baseCode || '',
        discountPercent: voucher.discountPercent || voucher.discount || '',
        rewardPointCost: voucher.rewardPointCost || '',
        maxUsage: voucher.maxUsage || '',
        startDate: voucher.startDate ? voucher.startDate.split('T')[0] : '',
        endDate: voucher.endDate ? voucher.endDate.split('T')[0] : '',
        ecoRewardPolicyId: voucher.ecoRewardPolicyId || '',
      });
    } else {
      setSelectedVoucherType(voucherType || 'system');
      setFormData({
        name: '',
        description: '',
        baseCode: '',
        discountPercent: '',
        rewardPointCost: '',
        maxUsage: '',
        startDate: '',
        endDate: '',
        ecoRewardPolicyId: '',
      });
    }
    setErrors({});
  }, [voucher, isOpen, voucherType]);

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

    // Validation based on voucher type
    if (selectedVoucherType === 'business') {
      if (!formData.maxUsage || formData.maxUsage <= 0) {
        newErrors.maxUsage = 'Max usage must be greater than 0';
      }
      if (!formData.ecoRewardPolicyId.trim()) {
        newErrors.ecoRewardPolicyId = 'Eco Reward Policy ID is required';
      }
    } else if (selectedVoucherType === 'leaderboard') {
      if (!formData.discountPercent || formData.discountPercent <= 0) {
        newErrors.discountPercent = 'Discount percent must be greater than 0';
      }
      if (formData.discountPercent > 100) {
        newErrors.discountPercent = 'Discount percent cannot exceed 100%';
      }
    } else if (selectedVoucherType === 'system') {
      if (!formData.discountPercent || formData.discountPercent <= 0) {
        newErrors.discountPercent = 'Discount percent must be greater than 0';
      }
      if (formData.discountPercent > 100) {
        newErrors.discountPercent = 'Discount percent cannot exceed 100%';
      }
      if (!formData.rewardPointCost || formData.rewardPointCost <= 0) {
        newErrors.rewardPointCost = 'Reward point cost must be greater than 0';
      }
      if (!formData.maxUsage || formData.maxUsage <= 0) {
        newErrors.maxUsage = 'Max usage must be greater than 0';
      }
      if (!formData.startDate) {
        newErrors.startDate = 'Start date is required';
      }
      if (!formData.endDate) {
        newErrors.endDate = 'End date is required';
      }
      if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      // Prepare data based on voucher type
      let submitData = {};
      
      if (selectedVoucherType === 'business') {
        submitData = {
          name: formData.name,
          description: formData.description,
          baseCode: formData.baseCode,
          maxUsage: parseInt(formData.maxUsage),
          ecoRewardPolicyId: formData.ecoRewardPolicyId,
        };
      } else if (selectedVoucherType === 'leaderboard') {
        submitData = {
          name: formData.name,
          description: formData.description,
          discountPercent: parseFloat(formData.discountPercent),
          baseCode: formData.baseCode,
        };
      } else if (selectedVoucherType === 'system') {
        submitData = {
          startDate: formData.startDate,
          endDate: formData.endDate,
          name: formData.name,
          description: formData.description,
          discountPercent: parseFloat(formData.discountPercent),
          baseCode: formData.baseCode,
          rewardPointCost: parseInt(formData.rewardPointCost),
          maxUsage: parseInt(formData.maxUsage),
        };
      }
      
      onSubmit(submitData, selectedVoucherType);
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
          {!voucher && (
            <FormControl fullWidth required>
              <InputLabel>Voucher Type</InputLabel>
              <Select
                value={selectedVoucherType}
                label="Voucher Type"
                onChange={(e) => setSelectedVoucherType(e.target.value)}
              >
                <MenuItem value="system">System Voucher</MenuItem>
                <MenuItem value="business">Business Voucher</MenuItem>
                <MenuItem value="leaderboard">Leaderboard Voucher</MenuItem>
              </Select>
            </FormControl>
          )}

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

          <TextField
            name="description"
            label="Description"
            value={formData.description}
            onChange={handleChange}
            error={!!errors.description}
            helperText={errors.description}
            multiline
            rows={3}
            fullWidth
            required
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

          {/* Business Voucher Fields */}
          {selectedVoucherType === 'business' && (
            <>
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
                inputProps={{ min: 1 }}
              />
              <TextField
                name="ecoRewardPolicyId"
                label="Eco Reward Policy ID"
                value={formData.ecoRewardPolicyId}
                onChange={handleChange}
                error={!!errors.ecoRewardPolicyId}
                helperText={errors.ecoRewardPolicyId}
                fullWidth
                required
                placeholder="Enter eco reward policy ID"
              />
            </>
          )}

          {/* Leaderboard Voucher Fields */}
          {selectedVoucherType === 'leaderboard' && (
            <TextField
              name="discountPercent"
              label="Discount Percent (%)"
              type="number"
              value={formData.discountPercent}
              onChange={handleChange}
              error={!!errors.discountPercent}
              helperText={errors.discountPercent}
              fullWidth
              required
              inputProps={{ min: 0, max: 100, step: 0.1 }}
            />
          )}

          {/* System Voucher Fields */}
          {selectedVoucherType === 'system' && (
            <>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  name="startDate"
                  label="Start Date"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  error={!!errors.startDate}
                  helperText={errors.startDate}
                  fullWidth
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
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
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  name="discountPercent"
                  label="Discount Percent (%)"
                  type="number"
                  value={formData.discountPercent}
                  onChange={handleChange}
                  error={!!errors.discountPercent}
                  helperText={errors.discountPercent}
                  fullWidth
                  required
                  inputProps={{ min: 0, max: 100, step: 0.1 }}
                />
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
              </Box>
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
                inputProps={{ min: 1 }}
              />
            </>
          )}
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


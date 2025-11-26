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
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Close as CloseIcon,
  Description as DescriptionIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import './MaterialModal.css';

const ReviewMaterialModal = ({ isOpen, onClose, materialRequest, mode, onSubmit }) => {
  const [formData, setFormData] = useState({
    adminNote: '',
    reuseLimit: '',
    depositPercent: '',
    plasticEquivalentMultiplier: '',
    co2EmissionPerKg: '',
  });
  const [errors, setErrors] = useState({});
  // Only determine mode when modal is open to prevent flickering
  const isApprove = isOpen && mode === 'approve';
  const isReject = isOpen && mode === 'reject';

  useEffect(() => {
    // Only reset form when modal is opened, not when it's closed
    if (isOpen && materialRequest) {
      setFormData({
        adminNote: '',
        reuseLimit: materialRequest.reuseLimit || '',
        depositPercent: materialRequest.depositPercent || '',
        plasticEquivalentMultiplier: materialRequest.plasticEquivalentMultiplier || '',
        co2EmissionPerKg: materialRequest.co2EmissionPerKg || '',
      });
      setErrors({});
    } else if (!isOpen) {
      // Reset form when modal is closed
      setFormData({
        adminNote: '',
        reuseLimit: '',
        depositPercent: '',
        plasticEquivalentMultiplier: '',
        co2EmissionPerKg: '',
      });
      setErrors({});
    }
  }, [isOpen, materialRequest]);

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

    if (isReject && !formData.adminNote.trim()) {
      newErrors.adminNote = 'Admin note is required for rejection';
    }

    if (isApprove) {
      if (!formData.reuseLimit) {
        newErrors.reuseLimit = 'Reuse limit is required';
      } else if (isNaN(formData.reuseLimit) || parseInt(formData.reuseLimit) <= 0) {
        newErrors.reuseLimit = 'Reuse limit must be a positive number';
      }

      if (formData.depositPercent === '' || formData.depositPercent === null) {
        newErrors.depositPercent = 'Deposit percent is required';
      } else if (isNaN(formData.depositPercent) || parseFloat(formData.depositPercent) < 0 || parseFloat(formData.depositPercent) > 100) {
        newErrors.depositPercent = 'Deposit percent must be between 0 and 100';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const reviewData = {
        decision: isApprove ? 'approved' : 'rejected',
      };

      if (isReject) {
        reviewData.adminNote = formData.adminNote.trim();
      }

      if (isApprove) {
        reviewData.materialData = {
          reuseLimit: parseInt(formData.reuseLimit),
          depositPercent: parseFloat(formData.depositPercent),
        };
        
        if (formData.plasticEquivalentMultiplier) {
          reviewData.materialData.plasticEquivalentMultiplier = parseFloat(formData.plasticEquivalentMultiplier);
        }
        
        if (formData.co2EmissionPerKg) {
          reviewData.materialData.co2EmissionPerKg = parseFloat(formData.co2EmissionPerKg);
        }
      }

      onSubmit(reviewData);
    }
  };

  const handleClose = () => {
    // Reset form first
    setFormData({
      adminNote: '',
      reuseLimit: '',
      depositPercent: '',
      plasticEquivalentMultiplier: '',
      co2EmissionPerKg: '',
    });
    setErrors({});
    // Then close modal
    onClose();
  };

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
          boxShadow: isApprove 
            ? '0 12px 40px rgba(34, 197, 94, 0.2)' 
            : '0 12px 40px rgba(239, 68, 68, 0.2)',
          overflow: 'hidden',
          background: 'linear-gradient(to bottom, #ffffff 0%, #f9fdf9 100%)',
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          background: isApprove 
            ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
            : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          color: 'white',
          py: 2,
          px: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {isApprove ? (
            <CheckCircleIcon sx={{ fontSize: 28 }} />
          ) : (
            <CancelIcon sx={{ fontSize: 28 }} />
          )}
          <Box>
            <Typography variant="h6" component="div" fontWeight="bold">
              {isApprove ? 'Approve Material Request' : 'Reject Material Request'}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9, mt: 0.25, display: 'block' }}>
              {isApprove 
                ? 'Confirm approval of this material request' 
                : 'Provide a reason for rejecting this material request'}
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
          {/* Material Request Info */}
          {materialRequest && (
            <Box 
              sx={{ 
                p: 2, 
                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.05) 100%)',
                borderRadius: 2,
                border: '2px solid rgba(34, 197, 94, 0.3)',
                mb: 3,
              }}
            >
              <Typography variant="body2" sx={{ color: '#16a34a', fontWeight: 700, mb: 1 }}>
                Material Request Details
              </Typography>
              <Typography variant="body2" sx={{ color: '#15803d', mb: 0.5 }}>
                <strong>Name:</strong> {materialRequest.requestedMaterialName}
              </Typography>
              <Typography variant="body2" sx={{ color: '#15803d', mb: 0.5 }}>
                <strong>Description:</strong> {materialRequest.description || 'No description'}
              </Typography>
              {materialRequest.businessId && (
                <Typography variant="body2" sx={{ color: '#15803d' }}>
                  <strong>Business:</strong> {materialRequest.businessId.businessName || 'N/A'}
                </Typography>
              )}
            </Box>
          )}

          <Grid container spacing={2.5}>
            {isReject && (
              <Grid item xs={12}>
                <Box sx={{ mb: 0.5 }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#dc2626', 
                      fontWeight: 600,
                      mb: 0.75,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.75
                    }}
                  >
                    <DescriptionIcon sx={{ fontSize: 16 }} />
                    Admin Note <span style={{ color: '#f44336' }}>*</span>
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  placeholder="Explain why this material request is being rejected..."
                  name="adminNote"
                  value={formData.adminNote}
                  onChange={handleInputChange}
                  required
                  multiline
                  rows={4}
                  variant="outlined"
                  error={!!errors.adminNote}
                  helperText={errors.adminNote || 'This note will be sent to the business explaining the rejection reason'}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.2 }}>
                        <WarningIcon sx={{ color: '#ef4444', fontSize: 18 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'white',
                      '&:hover fieldset': {
                        borderColor: '#ef4444',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#ef4444',
                        borderWidth: 2,
                      },
                    },
                  }}
                />
              </Grid>
            )}

            {isApprove && (
              <>
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
                    inputProps={{ min: 0, max: 100, step: 0.1 }}
                    error={!!errors.depositPercent}
                    helperText={errors.depositPercent || 'Deposit percentage (0-100)'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">%</InputAdornment>
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

                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 0.5 }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#16a34a', 
                        fontWeight: 600,
                        mb: 0.75,
                      }}
                    >
                      Plastic Equivalent Multiplier
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    placeholder="1"
                    name="plasticEquivalentMultiplier"
                    type="number"
                    value={formData.plasticEquivalentMultiplier}
                    onChange={handleInputChange}
                    variant="outlined"
                    inputProps={{ min: 0, step: 0.1 }}
                    helperText="Optional: Plastic equivalent multiplier"
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

                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 0.5 }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#16a34a', 
                        fontWeight: 600,
                        mb: 0.75,
                      }}
                    >
                      CO2 Emission Per Kg
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    placeholder="3.4"
                    name="co2EmissionPerKg"
                    type="number"
                    value={formData.co2EmissionPerKg}
                    onChange={handleInputChange}
                    variant="outlined"
                    inputProps={{ min: 0, step: 0.1 }}
                    helperText="Optional: CO2 emission per kg"
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
              </>
            )}

            {/* Info Box */}
            <Grid item xs={12}>
              <Box 
                sx={{ 
                  p: 2, 
                  background: isApprove
                    ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.05) 100%)'
                    : 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%)',
                  borderRadius: 2,
                  border: isApprove
                    ? '2px solid rgba(34, 197, 94, 0.3)'
                    : '2px solid rgba(239, 68, 68, 0.3)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1.5,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}
              >
                <Box 
                  sx={{ 
                    backgroundColor: isApprove ? '#22c55e' : '#ef4444',
                    borderRadius: '50%',
                    p: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '36px',
                    height: '36px'
                  }}
                >
                  {isApprove ? (
                    <CheckCircleIcon sx={{ color: 'white', fontSize: 20 }} />
                  ) : (
                    <CancelIcon sx={{ color: 'white', fontSize: 20 }} />
                  )}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ color: isApprove ? '#16a34a' : '#dc2626', fontWeight: 700, mb: 0.5 }}>
                    {isApprove ? '✓ Approve Material Request' : '✗ Reject Material Request'}
                  </Typography>
                  <Typography variant="caption" sx={{ color: isApprove ? '#15803d' : '#991b1b', lineHeight: 1.5, display: 'block' }}>
                    {isApprove 
                      ? 'By approving this request, the material will be added to the platform and businesses can use it.'
                      : 'This rejection will be sent to the business with the note you provide above.'}
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
            backgroundColor: 'rgba(0, 0, 0, 0.01)',
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
            startIcon={isApprove ? <CheckCircleIcon fontSize="small" /> : <CancelIcon fontSize="small" />}
            sx={{
              backgroundColor: isApprove ? '#22c55e' : '#ef4444',
              px: 3,
              py: 1,
              fontSize: '0.9375rem',
              fontWeight: 600,
              boxShadow: isApprove 
                ? '0 4px 12px rgba(34, 197, 94, 0.35)'
                : '0 4px 12px rgba(239, 68, 68, 0.35)',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: isApprove ? '#16a34a' : '#dc2626',
                boxShadow: isApprove 
                  ? '0 6px 16px rgba(34, 197, 94, 0.45)'
                  : '0 6px 16px rgba(239, 68, 68, 0.45)',
                transform: 'translateY(-2px)',
              }
            }}
          >
            {isApprove ? 'Approve Material' : 'Reject Material'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ReviewMaterialModal;


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
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Close as CloseIcon,
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
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '20px',
          boxShadow: isApprove 
            ? '0 25px 50px rgba(22, 78, 49, 0.25)' 
            : '0 25px 50px rgba(239, 68, 68, 0.25)',
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
          background: isApprove 
            ? 'linear-gradient(135deg, #164e31 0%, #0f3d20 100%)'
            : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          color: 'white',
          py: 2,
          px: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: '20px 20px 0 0',
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
            {isApprove ? (
              <CheckCircleIcon sx={{ fontSize: 20, color: 'white' }} />
            ) : (
              <CancelIcon sx={{ fontSize: 20, color: 'white' }} />
            )}
          </Box>
          <Box>
            <Typography variant="h6" component="div" fontWeight={700} sx={{ fontSize: '22px', mb: 0.25 }}>
              {isApprove ? 'Approve Material Request' : 'Reject Material Request'}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '14px' }}>
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
          {/* Material Request Info */}
          {materialRequest && (
            <Box 
              sx={{ 
                p: 2, 
                background: isApprove
                  ? 'linear-gradient(135deg, rgba(22, 78, 49, 0.1) 0%, rgba(15, 61, 32, 0.05) 100%)'
                  : 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%)',
                borderRadius: 2,
                border: isApprove
                  ? '2px solid rgba(22, 78, 49, 0.3)'
                  : '2px solid rgba(239, 68, 68, 0.3)',
                mb: 2,
              }}
            >
              <Typography variant="body2" sx={{ color: isApprove ? '#164e31' : '#dc2626', fontWeight: 700, mb: 1 }}>
                Material Request Details
              </Typography>
              <Typography variant="body2" sx={{ color: isApprove ? '#0f3d20' : '#991b1b', mb: 0.5 }}>
                <strong>Name:</strong> {materialRequest.requestedMaterialName}
              </Typography>
              <Typography variant="body2" sx={{ color: isApprove ? '#0f3d20' : '#991b1b', mb: 0.5 }}>
                <strong>Description:</strong> {materialRequest.description || 'No description'}
              </Typography>
              {materialRequest.businessId && (
                <Typography variant="body2" sx={{ color: isApprove ? '#0f3d20' : '#991b1b' }}>
                  <strong>Business:</strong> {materialRequest.businessId.businessName || 'N/A'}
                </Typography>
              )}
            </Box>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {isReject && (
              <TextField
                name="adminNote"
                label="Admin Note *"
                placeholder="Explain why this material request is being rejected..."
                value={formData.adminNote}
                onChange={handleInputChange}
                error={!!errors.adminNote}
                helperText={errors.adminNote || 'This note will be sent to the business explaining the rejection reason'}
                fullWidth
                required
                multiline
                rows={2}
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
                    borderColor: '#ef4444',
                    borderWidth: '2px',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#ef4444',
                  }
                }}
              />
            )}

            {isApprove && (
              <>
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
                  inputProps={{ min: 0, max: 100, step: 0.1 }}
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
                  label="Plastic Equivalent Multiplier"
                  placeholder="1"
                  type="number"
                  value={formData.plasticEquivalentMultiplier}
                  onChange={handleInputChange}
                  helperText="Optional: Plastic equivalent multiplier"
                  fullWidth
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
                  label="CO2 Emission Per Kg"
                  placeholder="3.4"
                  type="number"
                  value={formData.co2EmissionPerKg}
                  onChange={handleInputChange}
                  helperText="Optional: CO2 emission per kg"
                  fullWidth
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
              </>
            )}
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
            startIcon={isApprove ? <CheckCircleIcon fontSize="small" /> : <CancelIcon fontSize="small" />}
            sx={{
              backgroundColor: isApprove ? '#164e31' : '#ef4444',
              px: 3,
              py: 1,
              fontSize: '0.9375rem',
              fontWeight: 600,
              borderRadius: '12px',
              boxShadow: isApprove 
                ? '0 4px 12px rgba(22, 78, 49, 0.35)'
                : '0 4px 12px rgba(239, 68, 68, 0.35)',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: isApprove ? '#0f3d20' : '#dc2626',
                boxShadow: isApprove 
                  ? '0 6px 16px rgba(22, 78, 49, 0.45)'
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


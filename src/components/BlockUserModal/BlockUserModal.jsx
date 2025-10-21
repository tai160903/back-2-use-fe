import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import './BlockUserModal.css';

const schema = yup.object({
  reason: yup
    .string()
    .required('Reason is required')
    .min(10, 'Reason must be at least 10 characters')
    .max(500, 'Reason cannot exceed 500 characters')
});

const BlockUserModal = ({ 
  open, 
  onClose, 
  user, 
  action, 
  onSubmit, 
  isLoading = false 
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      reason: ''
    }
  });

  const reasonValue = watch('reason');

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = (data) => {
    onSubmit({
      isBlocked: action === 'block',
      reason: data.reason
    });
  };

  const isBlockAction = action === 'block';
  const actionText = isBlockAction ? 'Block' : 'Unblock';
  const actionColor = isBlockAction ? 'error' : 'success';

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          {actionText} User Account
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Are you sure you want to {actionText.toLowerCase()} this account?
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {user && (
          <Box sx={{ mb: 3 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              p: 2, 
              bgcolor: 'grey.50', 
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'grey.200'
            }}>
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    marginRight: 12
                  }}
                />
              ) : (
                <Box sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  mr: 1.5
                }}>
                  {(user.fullName || user.name || user.email || 'U').charAt(0).toUpperCase()}
                </Box>
              )}
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {user.fullName || user.name || user.email?.split('@')[0] || 'Unknown'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.email}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Role: {user.role || 'customer'}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        <Controller
          name="reason"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              multiline
              rows={4}
              label={`Reason for ${actionText.toLowerCase()}`}
              placeholder={`Enter reason for ${actionText.toLowerCase()}ing this account...`}
              error={!!errors.reason}
              helperText={errors.reason?.message || `${reasonValue?.length || 0}/500 characters`}
              variant="outlined"
              disabled={isLoading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />
          )}
        />

        {isBlockAction && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Note:</strong> The user will not be able to log into the system after being blocked.
            </Typography>
          </Alert>
        )}

        {!isBlockAction && (
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Note:</strong> The user will be able to log back into the system after being unblocked.
            </Typography>
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button 
          onClick={handleClose}
          disabled={isLoading}
          sx={{ 
            minWidth: 100,
            textTransform: 'none',
            fontWeight: 500
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(handleFormSubmit)}
          variant="contained"
          color={actionColor}
          disabled={isLoading}
          sx={{ 
            minWidth: 100,
            textTransform: 'none',
            fontWeight: 500,
            position: 'relative'
          }}
        >
          {isLoading && (
            <CircularProgress 
              size={20} 
              sx={{ 
                position: 'absolute',
                left: 12,
                color: 'white'
              }} 
            />
          )}
          {isLoading ? 'Processing...' : `${actionText}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BlockUserModal;

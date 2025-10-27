import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  CircularProgress
} from '@mui/material';
import { FaCrown, FaWallet, FaExclamationTriangle } from 'react-icons/fa';
import './SubscriptionConfirmModal.css';

const SubscriptionConfirmModal = ({
  open,
  onClose,
  subscription,
  userBalance,
  onConfirm,
  isLoading = false
}) => {
  const formatPrice = (priceInVND) => {
    if (priceInVND === 0) return 'FREE';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(priceInVND);
  };

  const formatDuration = (days) => {
    if (days === 7) return '7 days';
    if (days === 30) return '1 month';
    if (days === 180) return '6 months';
    if (days === 365) return '12 months';
    return `${days} days`;
  };

  const hasEnoughBalance = userBalance >= subscription?.price;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      className="subscription-confirm-modal"
    >
      <DialogTitle className="modal-title">
        <Box display="flex" alignItems="center" gap={1}>
          <FaCrown className="crown-icon" />
          <Typography variant="h6" fontWeight="bold">
         Confirm Purchase
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent className="modal-content-subscription-confirm">
        {subscription && (
          <>
            {/* Subscription Info */}
            <Box className="subscription-info">
              <Typography variant="h6" className="package-name">
                {subscription.name}
              </Typography>
              <Typography variant="body1" className="package-duration">
                Thời gian: {formatDuration(subscription.durationInDays)}
              </Typography>
              <Typography variant="h5" className="package-price">
                {formatPrice(subscription.price)}
              </Typography>
            </Box>

            <Divider className="divider" />

            {/* Balance Check */}
            <Box className="balance-check">
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <FaWallet className="wallet-icon" />
                <Typography variant="body1">
                  Current balance: {formatPrice(userBalance)}
                </Typography>
              </Box>

              {!hasEnoughBalance && (
                <Box className="insufficient-balance">
                  <Box display="flex" alignItems="center" gap={1}>
                    <FaExclamationTriangle className="warning-icon" />
                    <Typography variant="body2" color="error">
                      Insufficient balance to purchase this package
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Need to add: {formatPrice(subscription.price - userBalance)}
                  </Typography>
                </Box>
              )}
            </Box>
          </>
        )}
      </DialogContent>

      <DialogActions className="modal-actions">
        <Button 
          onClick={onClose}
          variant="outlined"
          disabled={isLoading}
        >
          Hủy
        </Button>
        
        {hasEnoughBalance ? (
          <Button
            onClick={onConfirm}
            variant="contained"
            className="confirm-button"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : <FaCrown />}
          >
            {isLoading ? 'Processing...' : 'Confirm Purchase'}
          </Button>
        ) : (
          <Button
            onClick={onConfirm}
            variant="contained"
            className="go-to-wallet-button"
            disabled={isLoading}
            startIcon={<FaWallet />}
          >
            Go to wallet
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default SubscriptionConfirmModal;

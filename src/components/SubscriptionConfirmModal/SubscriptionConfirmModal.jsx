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
  CircularProgress,
  FormControlLabel,
  Switch
} from '@mui/material';
import { FaCrown, FaWallet, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import './SubscriptionConfirmModal.css';

const SubscriptionConfirmModal = ({
  open,
  onClose,
  subscription,
  userBalance,
  onConfirm,
  isLoading = false,
  autoRenew = false,
  onToggleAutoRenew
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
  const featureList = subscription?.features || [];

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      className="subscription-confirm-modal"
    >
      <DialogTitle className="modal-title">
        <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
          <FaCrown className="crown-icon" />
          <Box className="modal-title-text">
            <Typography variant="h6" fontWeight="bold">
              Confirm subscription purchase
            </Typography>
            <Typography variant="body2">
              Please review the package information before confirming the payment.
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent className="modal-content-subscription-confirm">
        {subscription && (
          <Box className="modal-inner">
            {/* Subscription Info */}
            <Box className="subscription-info">
              <Typography variant="overline" className="package-label">
                Selected plan
              </Typography>
              <Typography variant="h6" className="package-name">
                {subscription.name}
              </Typography>
              <Typography variant="body2" className="package-duration">
                Duration: {formatDuration(subscription.durationInDays)}
              </Typography>
              <Typography variant="h4" className="package-price">
                {formatPrice(subscription.price)}
              </Typography>
            </Box>

            {featureList.length > 0 && (
              <Box className="modal-features">
                <Typography variant="subtitle2" className="features-title">
                  Plan features
                </Typography>
                <Box className="features-list">
                  {featureList.map((feature, index) => (
                    <Box key={index} className="features-row">
                     
                      <Typography variant="body2" className="feature-text">
                        {feature}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            <Divider className="divider" />

            {/* Balance Check */}
            <Box className="balance-check">
        

            

              {!hasEnoughBalance && (
                <Box className="insufficient-balance">
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                    className="warning-header"
                  >
                    <FaExclamationTriangle className="warning-icon" />
                    <Typography variant="body2" className="warning-title">
                      Your wallet balance is not enough to purchase this plan
                    </Typography>
                  </Box>
                  <Typography variant="body2" className="warning-description">
                    You need to add{" "}
                    <span className="warning-highlight">
                      {formatPrice(subscription.price - userBalance)}
                    </span>{" "}
                    to complete the payment.
                  </Typography>
                </Box>
              )}
            </Box>

            <Box className="auto-renew-row">
              <FormControlLabel
                control={
                  <Switch
                    color="success"
                    checked={autoRenew}
                    onChange={onToggleAutoRenew}
                  />
                }
                label={
                  <Typography variant="body2">
                    Enable auto-renewal for the next period
                  </Typography>
                }
              />
            </Box>

           
          </Box>
        )}
      </DialogContent>

      <DialogActions className="modal-actions">
        <Button 
          onClick={onClose}
          variant="outlined"
          disabled={isLoading}
        >
          Cancel
        </Button>
        
        {hasEnoughBalance ? (
          <Button
            onClick={onConfirm}
            variant="contained"
            className="confirm-button"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : <FaCrown />}
          >
            {isLoading ? 'Processing...' : 'Confirm payment'}
          </Button>
        ) : (
          <Button
            onClick={onConfirm}
            variant="contained"
            className="go-to-wallet-button"
            disabled={isLoading}
            startIcon={<FaWallet />}
          >
            View top-up guide
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default SubscriptionConfirmModal;

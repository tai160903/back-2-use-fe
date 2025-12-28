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
} from '@mui/material';
import { MdStars } from 'react-icons/md';
import { FaWallet, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import './RewardPointConfirmModal.css';

const RewardPointConfirmModal = ({
  open,
  onClose,
  package: rewardPackage,
  userBalance,
  onConfirm,
  isLoading = false,
}) => {
  const formatPrice = (priceInVND) => {
    if (priceInVND === 0) return 'FREE';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(priceInVND);
  };

  const hasEnoughBalance = userBalance >= (rewardPackage?.price || 0);
  const remainingBalance = hasEnoughBalance ? userBalance - (rewardPackage?.price || 0) : userBalance;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      className="reward-point-confirm-modal"
    >
      <DialogTitle className="modal-title">
        <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
          <MdStars className="stars-icon" />
          <Box className="modal-title-text">
            <Typography variant="h6" fontWeight="bold">
              Confirm Reward Points Purchase
            </Typography>
            <Typography variant="body2">
              Please review the package information before confirming the payment.
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent className="modal-content-reward-point-confirm">
        {rewardPackage && (
          <Box className="modal-inner">
            {/* Package Info */}
            <Box className="reward-point-info">
              <Typography variant="overline" className="package-label">
                Selected Package
              </Typography>
              <Typography variant="h6" className="package-name">
                {rewardPackage.name}
              </Typography>
              <Typography variant="body2" className="package-description">
                {rewardPackage.description}
              </Typography>
              
              <Box className="reward-point-details">
                <Box className="detail-row">
                  <Typography variant="body2" className="detail-label">
                    Reward Points:
                  </Typography>
                  <Typography variant="h6" className="detail-value points-highlight">
                    {rewardPackage.points?.toLocaleString()} points
                  </Typography>
                </Box>
                <Box className="detail-row">
                  <Typography variant="body2" className="detail-label">
                    Price:
                  </Typography>
                  <Typography variant="h6" className="detail-value price-highlight">
                    {formatPrice(rewardPackage.price)}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Balance Info */}
            <Box className="balance-info">
              <Box className="balance-row">
                <Box display="flex" alignItems="center" gap={1}>
                  <FaWallet className="wallet-icon" />
                  <Typography variant="body2" className="balance-label">
                    Current Balance:
                  </Typography>
                </Box>
                <Typography variant="h6" className="balance-value">
                  {formatPrice(userBalance)}
                </Typography>
              </Box>

              {hasEnoughBalance ? (
                <>
                  <Box className="balance-row">
                    <Typography variant="body2" className="balance-label">
                      After Purchase:
                    </Typography>
                    <Typography variant="h6" className="balance-value remaining">
                      {formatPrice(remainingBalance)}
                    </Typography>
                  </Box>
                  <Box className="success-message">
                    <FaCheckCircle className="success-icon" />
                    <Typography variant="body2">
                      You have sufficient balance to complete this purchase.
                    </Typography>
                  </Box>
                </>
              ) : (
                <Box className="error-message">
                  <FaExclamationTriangle className="error-icon" />
                  <Typography variant="body2">
                    Insufficient balance. Please deposit money into your wallet.
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions className="modal-actions">
        <Button 
          onClick={onClose} 
          disabled={isLoading}
          className="cancel-button"
        >
          Cancel
        </Button>
        <Button 
          onClick={onConfirm} 
          disabled={!hasEnoughBalance || isLoading}
          className="confirm-button"
          variant="contained"
        >
          {isLoading ? (
            <Box display="flex" alignItems="center" gap={1}>
              <CircularProgress size={20} color="inherit" />
              <span>Processing...</span>
            </Box>
          ) : (
            'Confirm Purchase'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RewardPointConfirmModal;


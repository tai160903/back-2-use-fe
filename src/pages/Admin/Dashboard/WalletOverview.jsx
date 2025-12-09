import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  getWalletTransactionsApi
} from '../../../store/slices/adminSlice';
import { Box, CircularProgress, Typography } from '@mui/material';
import { FaWallet, FaMoneyBillWave, FaExchangeAlt, FaCoins, FaArrowRight } from 'react-icons/fa';
import '../AdminDashboard.css';

const WalletOverview = () => {
  const dispatch = useDispatch();

  // Get data from Redux store
  const { 
    walletTransactions,
    isLoading
  } = useSelector((state) => state.admin);

  // Fetch wallet transactions on component mount
  useEffect(() => {
    dispatch(getWalletTransactionsApi());
  }, [dispatch]);

  // Format money
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount || 0);
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <FaWallet className="header-icon" style={{ fontSize: '48px', color: '#164e31' }} />
            <div>
              <h1 className="dashboard-title">Wallet Overview</h1>
              <p className="dashboard-subtitle">Total wallet transactions summary</p>
            </div>
          </div>
        </div>
      </div>

      <div className="wallet-overview-section" style={{ padding: '24px' }}>
        {isLoading && !walletTransactions ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
            <CircularProgress size={50} />
          </Box>
        ) : (() => {
          // Handle different data structures
          let walletData = null;
          
          if (walletTransactions) {
            // Check if it has the nested data structure
            if (walletTransactions.data && typeof walletTransactions.data === 'object' && walletTransactions.data.totalTopUp !== undefined) {
              walletData = walletTransactions.data;
            } 
            // Check if it's the direct data structure
            else if (walletTransactions.totalTopUp !== undefined) {
              walletData = walletTransactions;
            }
            // Try to find data in other possible locations
            else if (walletTransactions.data) {
              walletData = walletTransactions.data;
            } else {
              walletData = walletTransactions;
            }
          }
          
          // Check if walletData exists and has at least one valid property
          if (!walletData || typeof walletData !== 'object') {
            return (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px', backgroundColor: 'white', borderRadius: '16px', border: '2px dashed #e5e7eb' }}>
                <Typography color="text.secondary" sx={{ fontSize: '16px' }}>No wallet data available</Typography>
              </Box>
            );
          }

          return (
            <div className="wallet-overview-grid">
              <div className="wallet-metric-card wallet-card-primary">
                <div className="wallet-metric-icon">
                  <FaMoneyBillWave />
                </div>
                <div className="wallet-metric-content">
                  <h4 className="wallet-metric-label">Total Top Up</h4>
                  <p className="wallet-metric-value">{formatMoney(walletData.totalTopUp || 0)}</p>
                  <div className="wallet-metric-trend">
                    <FaArrowRight style={{ fontSize: '12px' }} />
                    <span>Income</span>
                  </div>
                </div>
              </div>

              <div className="wallet-metric-card wallet-card-warning">
                <div className="wallet-metric-icon">
                  <FaExchangeAlt />
                </div>
                <div className="wallet-metric-content">
                  <h4 className="wallet-metric-label">Total Withdraw</h4>
                  <p className="wallet-metric-value">{formatMoney(walletData.totalWithdraw || 0)}</p>
                  <div className="wallet-metric-trend">
                    <FaArrowRight style={{ fontSize: '12px' }} />
                    <span>Outgoing</span>
                  </div>
                </div>
              </div>

              <div className="wallet-metric-card wallet-card-info">
                <div className="wallet-metric-icon">
                  <FaCoins />
                </div>
                <div className="wallet-metric-content">
                  <h4 className="wallet-metric-label">Total Deposit</h4>
                  <p className="wallet-metric-value">{formatMoney(walletData.totalDeposit || 0)}</p>
                  <div className="wallet-metric-trend">
                    <FaArrowRight style={{ fontSize: '12px' }} />
                    <span>Security</span>
                  </div>
                </div>
              </div>

              <div className="wallet-metric-card wallet-card-purple">
                <div className="wallet-metric-icon">
                  <FaMoneyBillWave />
                </div>
                <div className="wallet-metric-content">
                  <h4 className="wallet-metric-label">Total Refund</h4>
                  <p className="wallet-metric-value">{formatMoney(walletData.totalRefund || 0)}</p>
                  <div className="wallet-metric-trend">
                    <FaArrowRight style={{ fontSize: '12px' }} />
                    <span>Returned</span>
                  </div>
                </div>
              </div>

              <div className="wallet-metric-card wallet-card-pink">
                <div className="wallet-metric-icon">
                  <FaWallet />
                </div>
                <div className="wallet-metric-content">
                  <h4 className="wallet-metric-label">Total Subscription Fee</h4>
                  <p className="wallet-metric-value">{formatMoney(walletData.totalSubscriptionFee || 0)}</p>
                  <div className="wallet-metric-trend">
                    <FaArrowRight style={{ fontSize: '12px' }} />
                    <span>Service</span>
                  </div>
                </div>
              </div>

              <div className="wallet-metric-card wallet-card-danger">
                <div className="wallet-metric-icon">
                  <FaMoneyBillWave />
                </div>
                <div className="wallet-metric-content">
                  <h4 className="wallet-metric-label">Total Penalty</h4>
                  <p className="wallet-metric-value">{formatMoney(walletData.totalPenalty || 0)}</p>
                  <div className="wallet-metric-trend">
                    <FaArrowRight style={{ fontSize: '12px' }} />
                    <span>Fine</span>
                  </div>
                </div>
              </div>

              <div className="wallet-metric-card wallet-card-dark">
                <div className="wallet-metric-icon">
                  <FaMoneyBillWave />
                </div>
                <div className="wallet-metric-content">
                  <h4 className="wallet-metric-label">Total Forfeited</h4>
                  <p className="wallet-metric-value">{formatMoney(walletData.totalForfeited || 0)}</p>
                  <div className="wallet-metric-trend">
                    <FaArrowRight style={{ fontSize: '12px' }} />
                    <span>Lost</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default WalletOverview;


import React, { useEffect, useState } from 'react'
import './Subscription.css'
import Typography from '@mui/material/Typography'
import { FaRegClock, FaGift, FaCrown, FaCircleCheck, FaCircleXmark, FaPlay, FaStop, FaClock } from "react-icons/fa6";
import { IoMdCard } from "react-icons/io";
import { FaCalendarAlt, FaCreditCard, FaReceipt } from "react-icons/fa";
import Button from '@mui/material/Button';
import { BsStars } from "react-icons/bs";
import { useSelector, useDispatch } from 'react-redux';
import { getALLSubscriptions, buySubscription } from '../../../store/slices/subscriptionSlice';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';
import { PATH } from '../../../routes/path';
import { useUserInfo } from '../../../hooks/useUserInfo';
import SubscriptionConfirmModal from '../../../components/SubscriptionConfirmModal/SubscriptionConfirmModal';
import toast from 'react-hot-toast';

export default function Subscription() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { subscription, isLoading, error } = useSelector((state) => state.subscription);
  const { balance, refetch, userInfo } = useUserInfo();
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  useEffect(() => {
    dispatch(getALLSubscriptions());
  }, [dispatch]);

  // Get all active subscriptions
  const getAllActiveSubscriptions = () => {
    if (!userInfo?.businessSubscriptions || userInfo.businessSubscriptions.length === 0) {
      return [];
    }
    
    const now = new Date();
    const startedSubscriptions = userInfo.businessSubscriptions.filter(
      sub => {
        const startDate = new Date(sub.startDate);
        const endDate = new Date(sub.endDate);
        return sub.isActive && startDate <= now && endDate > now;
      }
    );
    if (startedSubscriptions.length > 0) {
      startedSubscriptions.sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
      return startedSubscriptions;
    }
    

    

    
    return [];
  };

  // Get current active subscription (the newest one)
  const getCurrentSubscription = () => {
    const activeSubscriptions = getAllActiveSubscriptions();
    return activeSubscriptions.length > 0 ? activeSubscriptions[0] : null;
  };

  // Get billing history from user subscriptions
  const getBillingHistory = () => {
    if (!userInfo?.businessSubscriptions) return [];
    
    return userInfo.businessSubscriptions
      .map(sub => {
        const startDate = new Date(sub.startDate);
        const endDate = new Date(sub.endDate);
        const now = new Date();
        
        const isPending = startDate > now;
        const isExpired = endDate < now; 
        const isCurrentlyActive = sub.isActive && startDate <= now && endDate > now; 
        
        let status;
        if (isExpired) {
          status = 'Expired';
        } else if (isPending) {
          status = 'Pending';
        } else {
          status = 'Active';
        }
        
        return {
          id: sub._id,
          packageName: sub.subscriptionId?.name || 'N/A',
          date: new Date(sub.createdAt).toLocaleDateString('en-US'),
          startDate: new Date(sub.startDate).toLocaleDateString('en-US'),
          endDate: endDate.toLocaleDateString('en-US'),
          status,
          amount: sub.subscriptionId?.price || 0,
          isActive: isCurrentlyActive
        };
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date)); 
  };

  // Get billing history from API
  const billingHistory = getBillingHistory();
  const currentSubscription = getCurrentSubscription();
  const allActiveSubscriptions = getAllActiveSubscriptions();

  // Pagination logic
  const totalPages = Math.ceil(billingHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBillingData = billingHistory.slice(startIndex, endIndex);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  // Handle select subscription
  const handleSelectSubscription = (pkg) => {
    setSelectedSubscription(pkg);
    setModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedSubscription(null);
  };

  // Handle confirm purchase
  const handleConfirmPurchase = async () => {
    if (!selectedSubscription) return;

    const hasEnoughBalance = balance >= selectedSubscription.price;

    if (!hasEnoughBalance) {
      // Navigate to wallet page
      navigate(PATH.BUSINESS_WALLET);
      handleModalClose();
      toast.error('Insufficient balance. Please deposit money into your wallet.');
      return;
    }

    try {
      // Call API to buy subscription
      const result = await dispatch(buySubscription({
        subscriptionId: selectedSubscription._id
      }));

      if (buySubscription.fulfilled.match(result)) {
        toast.success('Subscription purchase successful!');
        handleModalClose();
        dispatch(getALLSubscriptions());
        refetch();
      } else {
        toast.error(result.payload?.message || 'An error occurred while purchasing the subscription');
      }
    } catch {
      toast.error('An error occurred while purchasing the subscription');
    }
  };

  const formatPrice = (priceInVND) => {
    if (priceInVND === 0) return 'FREE';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(priceInVND);
  };

  // Format duration from days to months/years
  const formatDuration = (days) => {
    if (days === 7) return '7 days';
    if (days === 30) return '1 month';
    if (days === 180) return '6 months';
    if (days === 365) return '12 months';
    return `${days} days`;
  };

  return (
    <>
      <div className='subscriptionBusiness'>
        {/* check user using trial */}
        {(() => {
          const hasTrialSubscription = userInfo?.businessSubscriptions?.some(sub => 
            sub.subscriptionId?.isTrial || 
            sub.subscriptionId?.name === "Free Trial" || 
            (sub.subscriptionId?.name?.toLowerCase().includes("trial") && sub.subscriptionId?.durationInDays === 7)
          ) || false;
          
          if (!hasTrialSubscription) return null;
          
          const currentTrialSub = userInfo?.businessSubscriptions?.find(sub => 
            (sub.subscriptionId?.isTrial || 
             sub.subscriptionId?.name === "Free Trial" || 
             (sub.subscriptionId?.name?.toLowerCase().includes("trial") && sub.subscriptionId?.durationInDays === 7)) &&
            sub.isActive
          );
          
          const now = new Date();
          const isCurrentlyUsingTrial = currentTrialSub && 
            new Date(currentTrialSub.startDate) <= now && 
            new Date(currentTrialSub.endDate) > now;
          
          return (
            <div className='subscriptionBusiness-notification'>
              <Typography variant='h6' fontWeight='bold' className='subscriptionBusiness-notification-title'>
                <FaRegClock style={{ color: isCurrentlyUsingTrial ? '#28a745' : '#008000' }} />
                Free Trial Status
              </Typography>

              <div className='free-trial-status'>
                <div className='free-trial-icon'>
                  <FaGift className='gift-icon' />
                </div>
                <div className='free-trial-content'>
                  {isCurrentlyUsingTrial ? (
                    <>
                      <Typography variant='h6' className='free-trial-title' style={{ color: '#28a745' }}>
                        Currently Using Free Trial
                      </Typography>
                      <Typography variant='body1' className='free-trial-description'>
                        You are in your free trial period. Package will expire on: {new Date(currentTrialSub.endDate).toLocaleDateString('en-US')}
                      </Typography>
                      <Typography variant='body2' style={{ color: '#ff9800', fontWeight: '500' }}>
                        ⏰ {Math.max(0, Math.ceil((new Date(currentTrialSub.endDate) - now) / (1000 * 60 * 60 * 24)))} days remaining
                      </Typography>
                    </>
                  ) : (
                    <>
                      <Typography variant='h6' className='free-trial-title'>
                        Free Trial Already Used
                      </Typography>
                      <Typography variant='body1' className='free-trial-description'>
                        Your business account has already used the free trial package
                      </Typography>
                      <Typography variant='body1' className='free-trial-warning'>
                        Free trial packages are no longer available for selection
                      </Typography>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })()}
        <div className='subscriptionBusiness-subscription-current'>
          <Typography className='subscriptionBusiness-subscription-current-title'>
            <IoMdCard style={{ color: '#008000' }} /> Current Subscription
          </Typography>
          <Typography className='subscriptionBusiness-subscription-current-description'>
            Manage your business subscription and billing
          </Typography>

          {currentSubscription ? (
            <>
              {(() => {
                const now = new Date();
                const startDate = new Date(currentSubscription.startDate);
                const endDate = new Date(currentSubscription.endDate);
                const isUpcoming = startDate > now;
                const isCurrentlyActive = startDate <= now && endDate > now;
                
                return (
                  <>
                    {isUpcoming && (
                      <div style={{ 
                        background: '#e3f2fd', 
                        border: '1px solid #2196f3', 
                        borderRadius: '8px', 
                        padding: '12px', 
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <FaClock style={{ color: '#2196f3', fontSize: '20px' }} />
                        <Typography variant='body2' style={{ color: '#1565c0', fontWeight: '500' }}>
                          This subscription will start on: <strong>{startDate.toLocaleDateString('en-US')}</strong>
                        </Typography>
                      </div>
                    )}
                    
                    {allActiveSubscriptions.length > 1 && (
                      <div style={{ 
                        background: '#fff3cd', 
                        border: '1px solid #ffc107', 
                        borderRadius: '8px', 
                        padding: '12px', 
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <FaCrown style={{ color: '#ffc107', fontSize: '20px' }} />
                        <Typography variant='body2' style={{ color: '#856404', fontWeight: '500' }}>
                          You currently have <strong>{allActiveSubscriptions.length} subscriptions</strong> active
                        </Typography>
                      </div>
                    )}
                    
                    <div className='subscription-package-detail'>
                      <div className='subscription-package-left'>
                        <div className='subscription-package-icon'>
                          <FaCrown className='crown-icon' />
                        </div>
                        <div className='subscription-package-info'>
                          <div className='subscription-package-header'>
                            <Typography className='subscription-package-name'>
                              {currentSubscription.subscriptionId?.name || 'N/A'}
                            </Typography>
                            <div className='subscription-package-badge'>
                              <Typography className='subscription-package-badge-text'>
                                {isUpcoming ? 'Upcoming' : isCurrentlyActive ? 'Active' : 'Expired'}
                              </Typography>
                            </div>
                          </div>
                    <Typography className='subscription-package-price'>
                      {formatPrice(currentSubscription.subscriptionId?.price || 0)}
                    </Typography>
                  </div>
                </div>

                <div className='subscription-package-right'>
                  <Typography className='subscription-package-billing-label'>
                    End Date
                  </Typography>
                  <div className='subscription-package-date'>
                    <FaCalendarAlt className='calendar-icon' />
                    <Typography className='subscription-package-date-text'>
                      {new Date(currentSubscription.endDate).toLocaleDateString('en-US')}
                    </Typography>
                  </div>
                </div>
              </div>
              {/* <Button className='btn-renew' onClick={() => setModalOpen(true)}>
                <BsStars style={{ marginRight: "20px" }} /> Renew Subscription
              </Button> */}
              {/* <Button className='btn-upgarde' onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <FaCrown style={{ marginRight: "20px" }} />Upgrade Plan
              </Button> */}
                  </>
                );
              })()}
            </>
          ) : (
            <div className='no-subscription'>
              <Typography variant='h6' style={{ color: '#666', marginTop: '20px' }}>
                No Subscription Yet
              </Typography>
              <Typography variant='body2' style={{ color: '#999', marginTop: '10px' }}>
                Please select a suitable package from the available options below
              </Typography>
            </div>
          )}
        </div>

          <div className='subscriptionBusiness-available'>
          <Typography className='subscriptionBusiness-available-title'>
          <FaCrown style={{marginRight:"10px"}}/>  Available Plans
          </Typography>
          <Typography className='subscriptionBusiness-available-des'>
          Select a package that best fits your business needs
          </Typography>
          <div className='subscription-packages-grid'>
            {isLoading ? (
              <Typography>Loading...</Typography>
            ) : error ? (
              <Typography color="error">Error occurred: {error}</Typography>
            ) : subscription?.data?.subscriptions ? (
              subscription.data.subscriptions
                .filter(pkg => {
                  // Filter out trial packages if user has used trial
                  const hasUsedOrUsingTrial = userInfo?.businessSubscriptions?.some(sub => 
                    sub.subscriptionId?.isTrial || 
                    sub.subscriptionId?.name === "Free Trial" || 
                    (sub.subscriptionId?.name?.toLowerCase().includes("trial") && sub.subscriptionId?.durationInDays === 7)
                  ) || false;
                  
                  if (hasUsedOrUsingTrial && (pkg.isTrial || pkg.name === "Free Trial")) return false;
                  // Filter out deleted and inactive packages
                  return !pkg.isDeleted && pkg.isActive;
                })
                .map((pkg) => (
                  <div key={pkg._id} className={`subscription-package-card ${pkg.isTrial ? 'trial-package' : ''}`}>
                    <div className='package-header'>
                      <div className='package-icon'>
                        {pkg.isTrial ? (
                          <FaGift className='gift-icon' />
                        ) : (
                          <FaCrown className='crown-icon' />
                        )}
                      </div>
                      <div className='package-badge'>
                        {pkg.isTrial ? 'Trial' : 'Premium'}
                      </div>
                    </div>
                    
                    <div className='package-content'>
                      <Typography className='package-name'>
                        {pkg.name}
                      </Typography>
                      <Typography className='package-duration'>
                        {formatDuration(pkg.durationInDays)}
                      </Typography>
                      <Typography className='package-price'>
                        {formatPrice(pkg.price)}
                      </Typography>
                      
                      {subscription.data.description && (
                        <div className='package-features'>
                          {subscription.data.description.map((feature, index) => (
                            <Typography key={index} className='feature-item'>
                              ✓ {feature}
                            </Typography>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className='package-footer'>
                      {pkg.isTrial ? (
                        <Button className='btn-trial' disabled>
                          Already Used
                        </Button>
                      ) : (
                        <Button 
                          className='btn-select'
                          onClick={() => handleSelectSubscription(pkg)}
                        >
                          Select Plan
                        </Button>
                      )}
                    </div>
                  </div>
                ))
            ) : (
              <Typography>No subscription packages available</Typography>
            )}
          </div>
        </div>

        <div className='subscriptionBusiness-billing'>
          <div className='billing-header'>
            <FaCalendarAlt className='billing-header-icon' />
            <Typography className='billing-header-title'>
              Billing History
            </Typography>
          </div>
          
          <div className='billing-list'>
            {currentBillingData.map((billing) => (
              <div key={billing.id} className='billing-card'>
                <div className='billing-card-left'>
                  <div className='billing-icon'>
                    <FaCreditCard className='credit-card-icon' />
                  </div>
                </div>
                
                <div className='billing-card-middle'>
                  <Typography className='billing-package-name'>
                    {billing.packageName}
                  </Typography>
                  <Typography className='billing-date' style={{ fontSize: '14px', color: '#666', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaReceipt style={{ fontSize: '16px' }} />
                    Purchased: {billing.date}
                  </Typography>
                  <Typography style={{ fontSize: '13px', color: '#999', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaPlay style={{ fontSize: '14px' }} />
                    Start: {billing.startDate}
                  </Typography>
                  <Typography style={{ fontSize: '13px', color: '#999', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaStop style={{ fontSize: '14px' }} />
                    End: {billing.endDate}
                  </Typography>
                </div>
                
                <div className='billing-card-right'>
                  <div className='billing-status'>
                    <Typography 
                      className='billing-status-text' 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        color: billing.status === 'Active' ? '#28a745' : 
                               billing.status === 'Pending' ? '#ff9800' : '#dc3545'
                      }}
                    >
                      {billing.status === 'Active' && <FaCircleCheck style={{ fontSize: '18px' }} />}
                      {billing.status === 'Pending' && <FaClock style={{ fontSize: '18px' }} />}
                      {billing.status === 'Expired' && <FaCircleXmark style={{ fontSize: '18px' }} />}
                      {billing.status}
                    </Typography>
                  </div>
                  <Typography className='billing-amount'>
                    {formatPrice(billing.amount)}
                  </Typography>
                </div>
              </div>
            ))}
          </div>
          
          <div className='billing-pagination'>
            <Stack spacing={2} alignItems="center">
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Stack>
          </div>
        </div>

      </div>

      {/* Subscription Confirm Modal */}
      <SubscriptionConfirmModal
        open={modalOpen}
        onClose={handleModalClose}
        subscription={selectedSubscription}
        userBalance={balance}
        onConfirm={handleConfirmPurchase}
        isLoading={isLoading}
      />
    </>
  )
}

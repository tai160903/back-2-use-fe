import React, { useEffect, useState } from 'react'
import './Subscription.css'
import Typography from '@mui/material/Typography'
import { FaRegClock, FaGift, FaCrown, FaCircleCheck, FaCircleXmark, FaPlay, FaStop, FaClock } from "react-icons/fa6";
import { IoMdCard } from "react-icons/io";
import { FaCalendarAlt, FaCreditCard, FaReceipt } from "react-icons/fa";
import Button from '@mui/material/Button';
import { BsStars } from "react-icons/bs";
import { useSelector, useDispatch } from 'react-redux';
import { getALLSubscriptions, buySubscription, buyFreeTrial } from '../../../store/slices/subscriptionSlice';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useUserInfo } from '../../../hooks/useUserInfo';
import SubscriptionConfirmModal from '../../../components/SubscriptionConfirmModal/SubscriptionConfirmModal';
import toast from 'react-hot-toast';

export default function Subscription() {
  const dispatch = useDispatch();
  const { subscription, isLoading } = useSelector((state) => state.subscription);
  const { balance, userInfo, businessInfo, refetch } = useUserInfo();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  useEffect(() => {
    dispatch(getALLSubscriptions());
  }, [dispatch]);

  // Không toast lỗi toàn cục để tránh trùng với toast trong hành động xác nhận mua

  // Helper: chuẩn hóa message lỗi từ BE/RTK để hiển thị an toàn
  const getErrorMessage = (err) => {
    if (!err) return 'Đã có lỗi xảy ra.';
    if (typeof err === 'string') return err;
    if (typeof err?.message === 'string') return err.message;
    if (typeof err?.data?.message === 'string') return err.data.message;
    if (typeof err?.payload?.message === 'string') return err.payload.message;
    if (typeof err?.error === 'string') return err.error;
    try { return JSON.stringify(err); } catch { return 'Đã có lỗi xảy ra.'; }
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

  // free trial logic
  const handleConfirmPurchase = async () => {
    if (!selectedSubscription) return;
    if (selectedSubscription.isTrial || selectedSubscription.price === 0) {
      try {
        await dispatch(buyFreeTrial()).unwrap();
        toast.success('Free plan activated successfully!');
        // cập nhật lại hồ sơ để hiển thị gói đang dùng
        refetch();
      } catch (err) {
        toast.error(getErrorMessage(err));
      }
      handleModalClose();
      return;
    }
  
    const hasEnoughBalance = balance >= selectedSubscription.price;
    if (!hasEnoughBalance) {
      toast.error('Insufficient balance. Please deposit money into your wallet.');
      handleModalClose();
      return;
    }

    try {
      await dispatch(buySubscription({ subscriptionId: selectedSubscription._id, autoRenew: false })).unwrap();
      toast.success('Subscription purchased successfully!');
      // cập nhật lại hồ sơ để hiển thị gói đang dùng
      refetch();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
    handleModalClose();
  };

  // Lấy gói hiện tại để đánh dấu và hiển thị ngày bắt đầu/kết thúc
  const activeSubscription = businessInfo?.data?.activeSubscription;
  const now = new Date();

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
        {/* Removed old Free Trial status logic as requested */}
        <div className='subscriptionBusiness-available'>
          {(() => {
            const start = activeSubscription?.startDate ? new Date(activeSubscription.startDate) : null;
            const end = activeSubscription?.endDate ? new Date(activeSubscription.endDate) : null;
            const isNowActive = start && end ? start <= now && end > now : false;
            const planName = activeSubscription?.subscriptionId?.name || null;
            return (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ minWidth: 260 }}>
                  <Typography className='subscriptionBusiness-available-title'>
                    <FaCrown style={{ marginRight: "10px" }} />  Available Plans
                  </Typography>
                  <Typography className='subscriptionBusiness-available-des'>
                    Select a package that best fits your business needs
                  </Typography>
                </div>
                {isNowActive && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {/* {planName && (
                      <Typography style={{ fontSize: '14px', color: '#155724', background: '#d4edda', border: '1px solid #c3e6cb', padding: '6px 10px', borderRadius: 8 }}>
                        Current plan: <strong>{planName}</strong>
                      </Typography>
                    )} */}
                    <Typography style={{ fontSize: '14px', color: '#0c5460', background: '#d1ecf1', border: '1px solid #bee5eb', padding: '6px 10px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <FaPlay style={{ fontSize: 14 }} /> Start: {start.toLocaleDateString('en-US')}
                    </Typography>
                    <Typography style={{ fontSize: '14px', color: '#856404', background: '#fff3cd', border: '1px solid #ffeeba', padding: '6px 10px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <FaStop style={{ fontSize: 14 }} /> End: {end.toLocaleDateString('en-US')}
                    </Typography>
                  </div>
                )}
              </div>
            );
          })()}
          {/* Không hiển thị banner tổng, chỉ hiển thị ngày bắt đầu/kết thúc trên thẻ gói hiện tại */}
          <div className='subscription-packages-grid'>
            {isLoading ? (
              <Typography>Loading...</Typography>
            ) : subscription?.data?.subscriptions ? (
              subscription.data.subscriptions
                .filter(pkg => !pkg.isDeleted && pkg.isActive)
                .map((pkg) => {
                  const start = activeSubscription?.startDate ? new Date(activeSubscription.startDate) : null;
                  const end = activeSubscription?.endDate ? new Date(activeSubscription.endDate) : null;
                  const isNowActive = start && end ? start <= now && end > now : false;
                  const isCurrentPlan = isNowActive && activeSubscription?.subscriptionId?._id === pkg._id;
                  return (
                  <div
                    key={pkg._id}
                    className={`subscription-package-card ${pkg.isTrial ? 'trial-package' : ''}`}
                    style={isCurrentPlan ? { border: '2px solid #28a745', background: '#f6fff9' } : undefined}
                  >
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
                      <Button
                        className={pkg.isTrial ? 'btn-trial' : 'btn-select'}
                        onClick={() => handleSelectSubscription(pkg)}
                        disabled={isLoading || isCurrentPlan}
                        style={isCurrentPlan ? { background: '#e9ecef', color: '#6c757d', cursor: 'not-allowed' } : undefined}
                      >
                        {isCurrentPlan ? 'Current Plan' : (pkg.isTrial ? 'Activate Free Trial' : 'Select Plan')}
                      </Button>
                    </div>
                  </div>
                )})
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

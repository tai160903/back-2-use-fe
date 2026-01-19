import React, { useEffect, useState } from 'react'
import './Subscription.css'
import Typography from '@mui/material/Typography'
import { FaRegClock, FaGift, FaCrown, FaCircleCheck, FaCircleXmark, FaPlay, FaStop, FaClock } from "react-icons/fa6";
import { IoMdCard } from "react-icons/io";
import { FaCalendarAlt, FaCreditCard, FaReceipt } from "react-icons/fa";
import Button from '@mui/material/Button';
import { BsStars } from "react-icons/bs";
import { MdStars } from "react-icons/md";
import { useSelector, useDispatch } from 'react-redux';
import { getALLSubscriptions, buySubscription, buyFreeTrial, getBusinessSubscriptionHistory } from '../../../store/slices/subscriptionSlice';
import { getRewardPointPackageStatusApi, buyRewardPointPackageApi, getRewardPointsApiHistory } from '../../../store/slices/rewardPointPackageSlice';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useUserInfo } from '../../../hooks/useUserInfo';
import SubscriptionConfirmModal from '../../../components/SubscriptionConfirmModal/SubscriptionConfirmModal';
import RewardPointConfirmModal from '../../../components/RewardPointConfirmModal/RewardPointConfirmModal';
import toast from 'react-hot-toast';

export default function Subscription() {
  const dispatch = useDispatch();
  const { subscription, isLoading, subscriptionHistory } = useSelector((state) => state.subscription);
  const { rewardPointPackageStatus, rewardPointPackageHistory, isLoading: isLoadingRewardPoints } = useSelector((state) => state.rewardPointPackage);
  
  // Extract packages from response - handle both array and object with data property
  const rewardPointPackages = Array.isArray(rewardPointPackageStatus?.data) 
    ? rewardPointPackageStatus.data 
    : (Array.isArray(rewardPointPackageStatus) ? rewardPointPackageStatus : []);
  const { balance, businessInfo, refetch } = useUserInfo();

  // Chuẩn hóa dữ liệu subscription từ API
  // Hỗ trợ cả dạng { statusCode, message, data: [...] } và { statusCode, message, data: { subscriptions, description } }
  const rawSubscriptionData = subscription?.data;
  const dataSubscriptions = Array.isArray(rawSubscriptionData)
    ? rawSubscriptionData
    : rawSubscriptionData?.subscriptions || [];
  const featuresList = Array.isArray(rawSubscriptionData?.description)
    ? rawSubscriptionData.description
    : [];

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [rewardPointsHistoryPage, setRewardPointsHistoryPage] = useState(1);
  const rewardPointsHistoryItemsPerPage = 5;

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [autoRenew, setAutoRenew] = useState(false);
  
  // Reward Point Modal state
  const [rewardPointModalOpen, setRewardPointModalOpen] = useState(false);
  const [selectedRewardPackage, setSelectedRewardPackage] = useState(null);

  useEffect(() => {
    dispatch(getALLSubscriptions());
    dispatch(getRewardPointPackageStatusApi());
  }, [dispatch]);

  // Fetch billing history (paginated)
  useEffect(() => {
    dispatch(getBusinessSubscriptionHistory({ page: currentPage, limit: itemsPerPage }));
  }, [dispatch, currentPage, itemsPerPage]);

  // Fetch reward points purchase history (paginated)
  useEffect(() => {
    dispatch(getRewardPointsApiHistory({ page: rewardPointsHistoryPage, limit: rewardPointsHistoryItemsPerPage }));
  }, [dispatch, rewardPointsHistoryPage, rewardPointsHistoryItemsPerPage]);

  // Helper: chuẩn hóa message lỗi từ BE
  const getErrorMessage = (err) => {
    if (!err) return 'Đã có lỗi xảy ra.';
    if (typeof err === 'string') return err;
    if (typeof err?.message === 'string') return err.message;
    if (typeof err?.data?.message === 'string') return err.data.message;
    if (typeof err?.payload?.message === 'string') return err.payload.message;
    if (typeof err?.error === 'string') return err.error;
    try { return JSON.stringify(err); } catch { return 'Đã có lỗi xảy ra.'; }
  };

  // Helper: định dạng ngày-giờ theo Việt Nam
  const formatDateTimeVietnam = (dateInput) => {
    if (!dateInput) return '-';
    try {
      const dateInstance = new Date(dateInput);
      return dateInstance.toLocaleString('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } catch {
      return '-';
    }
  };

  // Format API billing history to UI model
  const formatStatus = (status) => {
    if (!status) return 'Unknown';
    const s = String(status).toLowerCase();
    if (s === 'active') return 'Active';
    if (s === 'pending') return 'Pending';
    if (s === 'expired') return 'Expired';
    return status;
  };

 
  const hasUsedTrial = Boolean(businessInfo?.data?.isTrialUsed) || (subscriptionHistory?.data || []).some((historyRecord) =>
    Boolean(historyRecord?.isTrialUsed) || Boolean(historyRecord?.subscriptionId?.isTrial)
  );
  const currentBillingData = (subscriptionHistory?.data || []).map((historyRecord) => ({
    id: historyRecord._id,
    packageName: historyRecord.subscriptionId?.name || 'N/A',
    date: formatDateTimeVietnam(historyRecord.createdAt),
    startDate: formatDateTimeVietnam(historyRecord.startDate),
    endDate: formatDateTimeVietnam(historyRecord.endDate),
    status: formatStatus(historyRecord.status),
    amount: historyRecord.subscriptionId?.price || 0,
  }));
  const totalPages = subscriptionHistory?.totalPages || 0;

  // Format reward points purchase history data
  const rewardPointsHistoryData = (rewardPointPackageHistory?.data || []).map((record) => ({
    id: record._id,
    packageName: record.packageName || 'N/A',
    points: record.points || 0,
    amount: record.amount || 0,
    status: record.status || 'unknown',
    date: formatDateTimeVietnam(record.createdAt),
  }));
  const rewardPointsHistoryTotalPages = rewardPointPackageHistory?.totalPages || 0;

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const handleRewardPointsHistoryPageChange = (event, page) => {
    setRewardPointsHistoryPage(page);
  };

  // Handle select subscription
  const handleSelectSubscription = (pkg) => {
    setSelectedSubscription({
      ...pkg,
      features: featuresList
    });
    setModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedSubscription(null);
    setAutoRenew(false);
  };

  // free trial logic
  const handleConfirmPurchase = async () => {
    if (!selectedSubscription) return;
    if (selectedSubscription.isTrial || selectedSubscription.price === 0) {
      try {
        await dispatch(buyFreeTrial()).unwrap();
        toast.success('Free plan activated successfully!');
       
        dispatch(getALLSubscriptions());
        
        dispatch(getBusinessSubscriptionHistory({ page: currentPage, limit: itemsPerPage }));
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
      // Gửi payload đúng format BE yêu cầu: { subscriptionId, autoRenew }
      await dispatch(
        buySubscription({
          subscriptionId: selectedSubscription._id,
          autoRenew
        })
      ).unwrap();
      toast.success('Subscription purchased successfully!');

      dispatch(getALLSubscriptions());
      dispatch(
        getBusinessSubscriptionHistory({ page: currentPage, limit: itemsPerPage })
      );
      refetch();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
    handleModalClose();
  };

  // Handle reward point package purchase
  const handleRewardPointModalClose = () => {
    setRewardPointModalOpen(false);
    setSelectedRewardPackage(null);
  };

  const handleConfirmRewardPointPurchase = async () => {
    if (!selectedRewardPackage) return;

    const hasEnoughBalance = balance >= selectedRewardPackage.price;
    if (!hasEnoughBalance) {
      toast.error('Insufficient balance. Please deposit money into your wallet.');
      handleRewardPointModalClose();
      return;
    }

    try {
      if (!selectedRewardPackage._id) {
        toast.error('Invalid package ID');
        return;
      }
      await dispatch(buyRewardPointPackageApi({ packageId: selectedRewardPackage._id })).unwrap();
      toast.success('Reward points purchased successfully!');
      
      // Refresh data
      dispatch(getRewardPointPackageStatusApi());
      dispatch(getRewardPointsApiHistory({ page: rewardPointsHistoryPage, limit: rewardPointsHistoryItemsPerPage }));
      refetch();
      
      handleRewardPointModalClose();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  // Lấy gói hiện tại để đánh dấu và hiển thị ngày bắt đầu/kết thúc
  const rawActiveSubscription = businessInfo?.data?.activeSubscription;
  // BE có thể trả về activeSubscription là mảng, nên chuẩn hóa lại về 1 bản ghi
  const activeSubscription = Array.isArray(rawActiveSubscription)
    ? (rawActiveSubscription.find((item) => item?.status === 'active') || rawActiveSubscription[0])
    : rawActiveSubscription || null;
  const currentDate = new Date();

  // Tính số ngày còn lại của gói hiện tại
  const activeStartDate = activeSubscription?.startDate ? new Date(activeSubscription.startDate) : null;
  const activeEndDate = activeSubscription?.endDate ? new Date(activeSubscription.endDate) : null;
  const isSubscriptionCurrentlyActive =
    !!activeSubscription &&
    !!activeStartDate &&
    !!activeEndDate &&
    activeSubscription.status === 'active' &&
    activeStartDate <= currentDate &&
    activeEndDate > currentDate;

  let remainingDays = null;
  if (isSubscriptionCurrentlyActive) {
    const diffMs = activeEndDate - currentDate;
    remainingDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  }

  // Nếu đang có gói active và còn hơn 3 ngày thì khóa không cho mua thêm
  const isPurchaseLocked = isSubscriptionCurrentlyActive && (remainingDays === null || remainingDays > 3);

  const formatPrice = (priceInVND) => {
    if (priceInVND === 0) return 'FREE';
    return `${new Intl.NumberFormat('vi-VN').format(priceInVND)} VNĐ`;
  };

  // Format duration from days to months/years
  const formatDuration = (days) => {
    if (days === 7) return '7 days';
    if (days === 30) return '1 month';
    if (days === 180) return '6 months';
    if (days === 365) return '12 months';
    return `${days} days`;
  };

  // Hàm để format limit (hiển thị "Unlimited" nếu là -1)
  const formatLimit = (limit) => {
    if (limit === -1 || limit === null || limit === undefined) {
      return 'Unlimited';
    }
    return limit;
  };

  return (
    <>
      <div className='subscriptionBusiness'>

        <div className='subscriptionBusiness-available'>
          {(() => {
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
              </div>
            );
          })()}
          <div className='subscription-packages-grid'>
            {isLoading ? (
              <Typography>Loading...</Typography>
            ) : dataSubscriptions.length > 0 ? (
              dataSubscriptions
                .filter((subscriptionPackage) => !subscriptionPackage.isDeleted && subscriptionPackage.isActive)
                .map((subscriptionPackage) => {
                  const startDateObject = activeStartDate;
                  const endDateObject = activeEndDate;
                  const isCurrentlyActive = isSubscriptionCurrentlyActive && startDateObject && endDateObject;
                  const isCurrentPlan = isCurrentlyActive && activeSubscription?.subscriptionId?._id === subscriptionPackage._id;
                  const isTrialPackage = (subscriptionPackage.isTrial);
                  const isTrialDisabled = isTrialPackage && hasUsedTrial;
                  const isButtonDisabled =
                    isLoading ||
                    isCurrentPlan ||
                    isTrialDisabled ||
                    isPurchaseLocked;
                  return (
                  <div
                    key={subscriptionPackage._id}
                    className={`subscription-package-card ${subscriptionPackage.isTrial ? 'trial-package' : ''}`}
                    style={isCurrentPlan ? { border: '2px solid #28a745', background: '#f6fff9' } : undefined}
                  >
                    <div className='package-header'>
                      <div className='package-icon'>
                        {subscriptionPackage.isTrial ? (
                          <FaGift className='gift-icon' />
                        ) : (
                          <FaCrown className='crown-icon' />
                        )}
                      </div>
                      <div className='package-badge'>
                        {subscriptionPackage.isTrial ? 'Trial' : 'Premium'}
                      </div>
                    </div>

                    <div className='package-content'>
                      <Typography className='package-name'>
                        {subscriptionPackage.name}
                      </Typography>
                      <Typography className='package-duration'>
                        {formatDuration(subscriptionPackage.durationInDays)}
                      </Typography>
                      <Typography className='package-price'>
                        {formatPrice(subscriptionPackage.price)}
                      </Typography>

                      {/* Giới hạn sử dụng từ limits */}
                      <div className='package-limits'>
                        <div className='package-limit-badge'>
                          <span className='package-limit-label'>Groups</span>
                          <span className='package-limit-value'>
                            {formatLimit(subscriptionPackage.limits?.productGroupLimit)}
                          </span>
                        </div>
                        <div className='package-limit-badge'>
                          <span className='package-limit-label'>Items / Group</span>
                          <span className='package-limit-value'>
                            {formatLimit(subscriptionPackage.limits?.productItemLimit)}
                          </span>
                        </div>
                        <div className='package-limit-badge'>
                          <span className='package-limit-label'>Reward Points</span>
                          <span className='package-limit-value'>
                            {formatLimit(subscriptionPackage.limits?.rewardPointsLimit)}
                          </span>
                        </div>
                   
                
                      </div>

                      {featuresList.length > 0 && (
                        <div className='package-features'>
                          {featuresList.map((feature, index) => (
                            <Typography key={index} className='feature-item'>
                              ✓ {feature}
                            </Typography>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className='package-footer'>
                      <Button
                        className={subscriptionPackage.isTrial ? 'btn-trial' : 'btn-select'}
                        onClick={() => handleSelectSubscription(subscriptionPackage)}
                        disabled={isButtonDisabled}
                        style={isCurrentPlan ? { background: '#e9ecef', color: '#6c757d', cursor: 'not-allowed' } : undefined}
                      >
                        {isCurrentPlan
                          ? 'Current Plan'
                          : (isTrialPackage
                              ? (isTrialDisabled ? 'Used Trial' : 'Activate Free Trial')
                              : 'Select Plan')}
                      </Button>
                    </div>
                  </div>
                )})
            ) : (
              <Typography>No subscription packages available</Typography>
            )}
          </div>
        </div>

        {/* Reward Point Packages Section */}
        <div className='subscriptionBusiness-reward-points'>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
            <div style={{ minWidth: 260 }}>
              <Typography className='subscriptionBusiness-available-title'>
                <MdStars style={{ marginRight: "10px", color: "#f59e0b" }} />  Reward Point Packages
              </Typography>
              <Typography className='subscriptionBusiness-available-des'>
                Purchase reward points to unlock exclusive features and benefits
              </Typography>
            </div>
          </div>

          <div className='reward-points-packages-grid'>
            {isLoadingRewardPoints ? (
              <Typography>Loading reward points...</Typography>
            ) : rewardPointPackages && rewardPointPackages.length > 0 ? (
              rewardPointPackages
                .filter((pkg) => pkg.isActive && !pkg.isDeleted)
                .map((pkg) => {
                  return (
                    <div key={pkg._id} className='reward-point-package-card'>
                      <div className='reward-point-package-header'>
                        <div className='reward-point-package-icon'>
                          <MdStars className='stars-icon' />
                        </div>
                        <div className='reward-point-package-badge'>
                          {pkg.points.toLocaleString()} Points
                        </div>
                      </div>

                      <div className='reward-point-package-content'>
                        <Typography className='reward-point-package-name'>
                          {pkg.name}
                        </Typography>
                        <Typography className='reward-point-package-description'>
                          {pkg.description}
                        </Typography>
                        
                        <div className='reward-point-package-details'>
                          <div className='reward-point-detail-item'>
                            <span className='reward-point-detail-label'>Points</span>
                            <span className='reward-point-detail-value points-value'>
                              {pkg.points.toLocaleString()}
                            </span>
                          </div>
                          <div className='reward-point-detail-item'>
                            <span className='reward-point-detail-label'>Price</span>
                            <span className='reward-point-detail-value price-value'>
                              {formatPrice(pkg.price)}
                            </span>
                          </div>
                         
                        </div>
                      </div>

                      <div className='reward-point-package-footer'>
                        <Button
                          className='btn-reward-points'
                          onClick={() => {
                            setSelectedRewardPackage(pkg);
                            setRewardPointModalOpen(true);
                          }}
                          disabled={isLoadingRewardPoints}
                        >
                          Purchase Points
                        </Button>
                      </div>
                    </div>
                  );
                })
            ) : (
              <Typography>No reward point packages available</Typography>
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

        {/* Reward Points Purchase History Section */}
        <div className='subscriptionBusiness-billing'>
          <div className='billing-header'>
            <MdStars className='billing-header-icon' style={{ color: "#f59e0b" }} />
            <Typography className='billing-header-title'>
              Reward Points Purchase History
            </Typography>
          </div>

          <div className='billing-list'>
            {isLoadingRewardPoints ? (
              <Typography>Loading reward points history...</Typography>
            ) : rewardPointsHistoryData.length > 0 ? (
              rewardPointsHistoryData.map((record) => (
                <div key={record.id} className='billing-card'>
                  <div className='billing-card-left'>
                    <div className='billing-icon'>
                      <MdStars style={{ color: "#f59e0b", fontSize: '24px' }} />
                    </div>
                  </div>

                  <div className='billing-card-middle'>
                    <Typography className='billing-package-name'>
                      {record.packageName}
                    </Typography>
                    <Typography className='billing-date' style={{ fontSize: '14px', color: '#666', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FaReceipt style={{ fontSize: '16px' }} />
                      Purchased: {record.date}
                    </Typography>
                    <Typography style={{ fontSize: '14px', color: '#666', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                      <BsStars style={{ fontSize: '16px', color: "#f59e0b" }} />
                      Points: {record.points.toLocaleString('vi-VN')}
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
                          color: record.status === 'completed' ? '#28a745' :
                            record.status === 'pending' ? '#ff9800' : '#dc3545'
                        }}
                      >
                        {record.status === 'completed' && <FaCircleCheck style={{ fontSize: '18px' }} />}
                        {record.status === 'pending' && <FaClock style={{ fontSize: '18px' }} />}
                        {record.status !== 'completed' && record.status !== 'pending' && <FaCircleXmark style={{ fontSize: '18px' }} />}
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </Typography>
                    </div>
                    <Typography className='billing-amount'>
                      {formatPrice(record.amount)}
                    </Typography>
                  </div>
                </div>
              ))
            ) : (
              <Typography style={{ textAlign: 'center', padding: '20px' }}>No reward points purchase history found.</Typography>
            )}
          </div>

          {rewardPointsHistoryTotalPages > 1 && (
            <div className='billing-pagination'>
              <Stack spacing={2} alignItems="center">
                <Pagination
                  count={rewardPointsHistoryTotalPages}
                  page={rewardPointsHistoryPage}
                  onChange={handleRewardPointsHistoryPageChange}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                />
              </Stack>
            </div>
          )}
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
        autoRenew={autoRenew}
        onToggleAutoRenew={() => setAutoRenew((prev) => !prev)}
      />

      {/* Reward Point Confirm Modal */}
      <RewardPointConfirmModal
        open={rewardPointModalOpen}
        onClose={handleRewardPointModalClose}
        package={selectedRewardPackage}
        userBalance={balance}
        onConfirm={handleConfirmRewardPointPurchase}
        isLoading={isLoadingRewardPoints}
      />
    </>
  )
}

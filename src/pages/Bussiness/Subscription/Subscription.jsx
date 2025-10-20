import React, { useEffect, useState } from 'react'
import './Subscription.css'
import Typography from '@mui/material/Typography'
import { FaRegClock, FaGift, FaCrown } from "react-icons/fa6";
import { IoMdCard } from "react-icons/io";
import { FaCalendarAlt, FaCreditCard } from "react-icons/fa";
import Button from '@mui/material/Button';
import { BsStars } from "react-icons/bs";
import { useSelector, useDispatch } from 'react-redux';
import { getALLSubscriptions } from '../../../store/slices/subscriptionSlice';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
export default function Subscription() {
  const dispatch = useDispatch();
  const { subscription, isLoading, error } = useSelector((state) => state.subscription);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    dispatch(getALLSubscriptions());
  }, [dispatch]);

  // Mock billing history data (replace with real API call later)
  const billingHistory = [
    {
      id: 1,
      packageName: "6 Month Package",
      date: "15/1/2024",
      status: "PAID",
      amount: 599000
    },
    {
      id: 2,
      packageName: "6 Month Package", 
      date: "15/7/2023",
      status: "PAID",
      amount: 599000
    },
    {
      id: 3,
      packageName: "3 Month Package",
      date: "15/1/2023", 
      status: "PAID",
      amount: 299000
    },
    {
      id: 4,
      packageName: "1 Month Package",
      date: "15/12/2022",
      status: "PAID", 
      amount: 299000
    },
    {
      id: 5,
      packageName: "6 Month Package",
      date: "15/6/2022",
      status: "PAID",
      amount: 599000
    },
    {
      id: 6,
      packageName: "3 Month Package",
      date: "15/3/2022",
      status: "PAID",
      amount: 299000
    }
  ];

  // Pagination logic
  const totalPages = Math.ceil(billingHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBillingData = billingHistory.slice(startIndex, endIndex);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
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
        <div className='subscriptionBusiness-notification'>
          <Typography variant='h6' fontWeight='bold' className='subscriptionBusiness-notification-title'>
            <FaRegClock style={{ color: '#008000' }} />
            Free Trial Status
          </Typography>

          <div className='free-trial-status'>
            <div className='free-trial-icon'>
              <FaGift className='gift-icon' />
            </div>
            <div className='free-trial-content'>
              <Typography variant='h6' className='free-trial-title'>
                Free Trial Already Used
              </Typography>
              <Typography variant='body1' className='free-trial-description'>
                Your business account has already utilized the 7-day free trial period
              </Typography>
              <Typography variant='body1' className='free-trial-warning'>
                Free trial packages are not available for selection
              </Typography>
            </div>
          </div>
        </div>
        <div className='subscriptionBusiness-subscription-current'>
          <Typography className='subscriptionBusiness-subscription-current-title'>
            <IoMdCard style={{ color: '#008000' }} /> Current Subscription
          </Typography>
          <Typography className='subscriptionBusiness-subscription-current-description'>
            Manage your business subscription and billing
          </Typography>

          <div className='subscription-package-detail'>
            <div className='subscription-package-left'>
              <div className='subscription-package-icon'>
                <FaCrown className='crown-icon' />
              </div>
              <div className='subscription-package-info'>
                <div className='subscription-package-header'>
                  <Typography className='subscription-package-name'>
                    6 Month Package
                  </Typography>
                  <div className='subscription-package-badge'>
                    <Typography className='subscription-package-badge-text'>
                      Active
                    </Typography>
                  </div>
                </div>
                <Typography className='subscription-package-price'>
                  $27/total
                </Typography>
              </div>
            </div>

            <div className='subscription-package-right'>
              <Typography className='subscription-package-billing-label'>
                Next billing date
              </Typography>
              <div className='subscription-package-date'>
                <FaCalendarAlt className='calendar-icon' />
                <Typography className='subscription-package-date-text'>
                  11/20/2025
                </Typography>
              </div>
            </div>
          </div>
          <Button className='btn-renew'>
            <BsStars style={{ marginRight: "20px" }} /> Renew subscription
          </Button>
          <Button className='btn-upgarde'>
            <FaCrown style={{ marginRight: "20px" }} />Upgrade plan
          </Button>
        </div>

        <div className='subscriptionBusiness-available'>
          <Typography className='subscriptionBusiness-available-title'>
          <FaCrown style={{marginRight:"10px"}}/>  Available Plans
          </Typography>
          <Typography className='subscriptionBusiness-available-des'>
          Choose the plan that best fits your business needs
          </Typography>
          <div className='subscription-packages-grid'>
            {isLoading ? (
              <Typography>Loading...</Typography>
            ) : error ? (
              <Typography color="error">Error occurred: {error}</Typography>
            ) : subscription?.data?.subscriptions ? (
              subscription.data.subscriptions
                .filter(pkg => !pkg.isDeleted && pkg.isActive) 
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
                        <Button className='btn-select'>
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
                  <Typography className='billing-date'>
                    {billing.date}
                  </Typography>
                </div>
                
                <div className='billing-card-right'>
                  <div className='billing-status'>
                    <Typography className='billing-status-text'>
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
    </>
  )
}

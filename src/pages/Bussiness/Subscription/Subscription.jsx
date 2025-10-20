import React from 'react'
import './Subscription.css'
import Typography from '@mui/material/Typography'
import { FaRegClock, FaGift, FaCrown } from "react-icons/fa6";
import { IoMdCard } from "react-icons/io";
import { FaCalendarAlt } from "react-icons/fa";
import Button from '@mui/material/Button';
import { BsStars } from "react-icons/bs";
export default function Subscription() {
  return (
   <>
   <div className='subscriptionBusiness'>
      <div className='subscriptionBusiness-notification'>
        <Typography variant='h6' fontWeight='bold' className='subscriptionBusiness-notification-title'> 
          <FaRegClock style={{color: '#008000'}}/>
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
           <IoMdCard style={{color: '#008000'}}/> Current Subscription
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
   <BsStars style={{marginRight:"20px"}}/> Renew subscription
        </Button>
        <Button className='btn-upgarde'>
  <FaCrown style={{marginRight:"20px"}}/>Upgrade plan
        </Button>
       </div>
    
   </div>
   </>
  )
}

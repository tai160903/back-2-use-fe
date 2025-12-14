import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
  TextField,
  Button,
  Typography
} from '@mui/material'
import {
  FaEdit,
  FaSave,
  FaTimes,
  FaWallet,
  FaBuilding,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaLeaf,
  FaTrophy,
  FaChartLine
} from 'react-icons/fa'
import './ProfileBusiness.css'
import { useDispatch, useSelector } from 'react-redux'
import { getProfileBusiness, updateProfileBusiness } from '../../../store/slices/userSlice'
import { getBusinessDashboardOverview } from '../../../store/slices/bussinessSlice'
import toast from 'react-hot-toast'
import AddressSelector from '../../../components/AddressSelector/AddressSelector'
import Box from '@mui/material/Box'

// Schema validation with Yup
const businessSchema = yup.object({
  businessName: yup
    .string()
    .required('Business name is required')
    .min(2, 'Business name must be at least 2 characters')
    .max(100, 'Business name must be at most 100 characters'),
  businessType: yup
    .string()
    .required('Business type is required'),
  businessPhone: yup
    .string()
    .required('Phone number is required')
    .matches(/^[0-9]{10,11}$/, 'Phone number must be 10-11 digits'),
  businessAddress: yup
    .string()
    .required('Address is required')
    .min(10, 'Address must be at least 10 characters')
    .max(200, 'Address must be at most 200 characters'),
  openTime: yup
    .string()
    .matches(/^\d{2}:\d{2}$/,
      'Opening time must be in HH:mm format'
    )
    .optional(),
  closeTime: yup
    .string()
    .matches(/^\d{2}:\d{2}$/,
      'Closing time must be in HH:mm format'
    )
    .optional()
})

export default function ProfileBusiness() {


  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const dispatch = useDispatch()
  const { businessInfo: apiBusinessPayload } = useSelector((state) => state.user)
  const { dashboardOverview } = useSelector((state) => state.businesses)

  // Fetch business profile and dashboard overview on mount (chỉ khi chưa có data)
  useEffect(() => {
    if (!apiBusinessPayload) {
      dispatch(getProfileBusiness())
    }
    if (!dashboardOverview) {
      dispatch(getBusinessDashboardOverview())
    }
  }, [dispatch, apiBusinessPayload, dashboardOverview])

  // Extract data from API payload
  const business = apiBusinessPayload?.data?.business
  // Merge co2Reduced and ecoPoints from dashboard overview if not in business profile
  // Sử dụng useMemo để tránh tạo object mới mỗi lần render
  const businessWithCo2 = useMemo(() => {
    if (!business) return null;
    return {
      ...business,
      co2Reduced: business.co2Reduced !== undefined 
        ? business.co2Reduced 
        : (dashboardOverview?.co2Reduced || 0),
      ecoPoints: business.ecoPoints !== undefined 
        ? business.ecoPoints 
        : (dashboardOverview?.ecoPoints || 0)
    };
  }, [business, dashboardOverview?.co2Reduced, dashboardOverview?.ecoPoints])
  const wallet = apiBusinessPayload?.data?.wallet
  const activeSubscription = apiBusinessPayload?.data?.activeSubscription
  const rawActive = activeSubscription
  const subscriptions = Array.isArray(rawActive) ? rawActive : (rawActive ? [rawActive] : [])
  const now = new Date()
  const currentSubscriptions = subscriptions.filter((s) => {
    const endDate = s?.endDate ? new Date(s.endDate) : null
    const notExpired = !endDate || (!isNaN(endDate.getTime()) && endDate >= now)
    const statusOk = s?.status === 'active' || s?.status === 'pending'
    return statusOk && notExpired
  })
  
  // Extract eco rank data
  const ecoRankLabel = apiBusinessPayload?.data?.ecoRankLabel || 'N/A'
  const nextRank = apiBusinessPayload?.data?.nextRank || {}
  const progress = apiBusinessPayload?.data?.progress || {}

  const getFormValues = () => ({
    businessName: businessWithCo2?.businessName || '',
    businessType: businessWithCo2?.businessType || '',
    taxCode: businessWithCo2?.taxCode || '',
    email: businessWithCo2?.businessMail || '',
    businessPhone: businessWithCo2?.businessPhone || '',
    businessAddress: businessWithCo2?.businessAddress || '',
    openTime: businessWithCo2?.openTime || '',
    closeTime: businessWithCo2?.closeTime || ''
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm({
    resolver: yupResolver(businessSchema),
    defaultValues: getFormValues()
  })

  // Reset form when business data changes (chỉ khi không đang edit)
  useEffect(() => {
    if (!isEditing && businessWithCo2) {
      reset({
        businessName: businessWithCo2.businessName || '',
        businessType: businessWithCo2.businessType || '',
        businessPhone: businessWithCo2.businessPhone || '',
        businessAddress: businessWithCo2.businessAddress || '',
        openTime: businessWithCo2.openTime || '',
        closeTime: businessWithCo2.closeTime || ''
      })
    }
  }, [businessWithCo2, isEditing, reset])

  const handleEdit = () => {
    setIsEditing(true)
    reset({
      businessName: businessWithCo2?.businessName || '',
      businessType: businessWithCo2?.businessType || '',
      businessPhone: businessWithCo2?.businessPhone || '',
      businessAddress: businessWithCo2?.businessAddress || '',
      openTime: businessWithCo2?.openTime || '',
      closeTime: businessWithCo2?.closeTime || ''
    })
  }

  // Update business profile
  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      await dispatch(updateProfileBusiness(data)).unwrap()
      toast.success('Business profile updated successfully')
      setIsEditing(false)
      reset({
        businessName: data.businessName || '',
        businessType: data.businessType || '',
        businessPhone: data.businessPhone || '',
        businessAddress: data.businessAddress || '',
        openTime: data.openTime || '',
        closeTime: data.closeTime || ''
      })
      dispatch(getProfileBusiness())
    } catch (error) {
      const message = error?.message || error?.data?.message || 'Failed to update business profile'
      toast.error(message)
    } finally {
    setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    reset({
      businessName: businessWithCo2?.businessName || '',
      businessType: businessWithCo2?.businessType || '',
      taxCode: businessWithCo2?.taxCode || '',
      email: businessWithCo2?.businessMail || '',
      businessPhone: businessWithCo2?.businessPhone || '',
      businessAddress: businessWithCo2?.businessAddress || '',
      openTime: businessWithCo2?.openTime || '',
      closeTime: businessWithCo2?.closeTime || ''
    })
  }

  const formatBalance = (balance) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(balance)
  }

  const formatDate = (date) => {
    if (!date) return '-'
    const parsed = new Date(date)
    if (isNaN(parsed.getTime())) return String(date)
    return parsed.toLocaleDateString('vi-VN')
  }

  // Handle address selection from AddressSelector
  const handleAddressSelect = useCallback((addressData) => {
    if (addressData && addressData.fullAddress) {
      setValue('businessAddress', addressData.fullAddress);
    }
  }, [setValue]);



  return (
    <div className="profile-business-container">
      <form className="profile-business-card" onSubmit={handleSubmit(onSubmit)}>
        {/* Header with avatar and name */}
        <div className="profile-header">
          <div className="profile-avatar">
            {businessWithCo2?.businessLogoUrl ? (
              <img src={businessWithCo2?.businessLogoUrl} alt="Business Logo" />
            ) : (
              <div >
                <span>{businessWithCo2?.businessName?.charAt(0)}</span>
              </div>
            )}
          </div>
          <div className="profile-title">
            <h1 className="business-name">{businessWithCo2?.businessName}</h1>
            <p className="business-type">
              {businessWithCo2?.businessType}
              {typeof businessWithCo2?.co2Reduced === 'number' && businessWithCo2.co2Reduced > 0 && (
                <>
                  <br />
                  <span className="business-co2">
                  CO₂ Emission Reduction: {businessWithCo2.co2Reduced.toFixed(2)} kg
                  </span>
                </>
              )}
            </p>
          </div>
          <div className="profile-actions">
            {!isEditing ? (
              <Button
                variant="contained"
                startIcon={<FaEdit />}
                onClick={handleEdit}
                className="edit-btn"
              >
                Edit
              </Button>
            ) : (
              <div className="action-buttons">
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<FaSave />}
                  type="submit"
                  disabled={isSubmitting}
                  className="save-btn"
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<FaTimes />}
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="cancel-btn"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="profile-details">
          <div className="detail-section">
            <h3 className="section-title">
              <FaWallet style={{ marginRight: '8px', marginBottom: '8px', color: '#c64200' }} />
              Wallet
            </h3>
            <div className="detail-item">
              <label>Available balance:</label>
              <span className="balance">{formatBalance(wallet?.availableBalance || 0)}</span>
            </div>
            <div className="detail-item">
              <label>Holding balance:</label>
              <span>{formatBalance(wallet?.holdingBalance || 0)}</span>
            </div>
            <div className="detail-item">
              <label>Subscription:</label>
              <span>
                {currentSubscriptions.length > 0 ? (
                  currentSubscriptions.map((s, idx) => (
                    <span key={s?._id || idx} style={{ display: 'block' }}>
                      {(s?.subscriptionId?.name || 'Subscription')}{' '}
                      {s?.subscriptionId?.isTrial ? '(Free)' : ''} | {formatDate(s?.startDate)} - {formatDate(s?.endDate)}
                    </span>
                  ))
                ) : (
                  'No active subscription'
                )}
              </span>
            </div>
          </div>

          <div className="detail-section">
            <h3 className="section-title">
              <FaBuilding style={{ marginRight: '8px', marginBottom: '8px', color: '#3169ed' }} />
              Business information
            </h3>
            <div className="detail-item">
              <label>Business name:</label>
              {isEditing ? (
                <TextField
                  {...register('businessName')}
                  fullWidth
                  variant="outlined"
                  error={!!errors.businessName}
                  helperText={errors.businessName?.message}
                  className="edit-input"
                />
              ) : (
                <span>{businessWithCo2?.businessName}</span>
              )}
            </div>
            <div className="detail-item">
              <label>Business type:</label>
              {isEditing ? (
                <TextField
                  {...register('businessType')}
                  fullWidth
                  variant="outlined"
                  error={!!errors.businessType}
                  helperText={errors.businessType?.message}
                  className="edit-input"
                />
              ) : (
                <span>{businessWithCo2?.businessType}</span>
              )}
            </div>
            <div className="detail-item">
              <label>Tax code:</label>
                <span>{businessWithCo2?.taxCode}</span>
          
            </div>
            <div className="detail-item">
              <label>Opening time:</label>
              {isEditing ? (
                <TextField
                  {...register('openTime')}
                  fullWidth
                  variant="outlined"
                  type="time"
                  inputProps={{ step: 300 }}
                  error={!!errors.openTime}
                  helperText={errors.openTime?.message}
                  className="edit-input"
                />
              ) : (
                <span>{businessWithCo2?.openTime || '-'}</span>
              )}
            </div>
            <div className="detail-item">
              <label>Closing time:</label>
              {isEditing ? (
                <TextField
                  {...register('closeTime')}
                  fullWidth
                  variant="outlined"
                  type="time"
                  inputProps={{ step: 300 }}
                  error={!!errors.closeTime}
                  helperText={errors.closeTime?.message}
                  className="edit-input"
                />
              ) : (
                <span>{businessWithCo2?.closeTime || '-'}</span>
              )}
            </div>
            <div className="detail-item">
              <label>CO₂ Reduced:</label>
              <span style={{ color: '#1b4c2d', fontWeight: '600' }}>
                {typeof businessWithCo2?.co2Reduced === 'number' 
                  ? `${businessWithCo2.co2Reduced.toFixed(2)} kg` 
                  : '0.00 kg'}
              </span>
            </div>
            <div className="detail-item">
              <label>Eco Point:</label>
              <span style={{ color: '#1b4c2d', fontWeight: '600' }}>
                {typeof businessWithCo2?.ecoPoints === 'number' 
                  ? businessWithCo2.ecoPoints.toLocaleString('vi-VN') 
                  : '0'}
              </span>
            </div>
          </div>

          {/* Eco Rank Section */}
          {ecoRankLabel && (
            <div className="detail-section">
              <h3 className="section-title">
                <FaTrophy style={{ marginRight: '8px', marginBottom: '8px', color: '#f59e0b' }} />
                Eco Rank
              </h3>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <Typography variant="body1" style={{ fontWeight: 600, color: '#1a1a1a' }}>
                    Current Rank: <span style={{ color: '#f59e0b', textTransform: 'capitalize' }}>{ecoRankLabel}</span>
                  </Typography>
                  {nextRank?.label && (
                    <Typography variant="body2" style={{ color: '#6b7280' }}>
                      Next: <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{nextRank.label}</span>
                    </Typography>
                  )}
                </div>
                
                {/* Progress Bar */}
                {progress?.percent !== undefined && (
                  <Box sx={{ marginBottom: '12px' }}>
                    <Box
                      sx={{
                        width: '100%',
                        height: '24px',
                        backgroundColor: '#e5e7eb',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        position: 'relative',
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
                      }}
                    >
                      <Box
                        sx={{
                          width: `${Math.min(progress.percent || 0, 100)}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, #1b4c2d 0%, #22c55e 100%)',
                          borderRadius: '12px',
                          transition: 'width 0.5s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          paddingRight: '8px',
                        }}
                      >
                        {progress.percent > 10 && (
                          <Typography
                            variant="caption"
                            sx={{
                              color: 'white',
                              fontWeight: 700,
                              fontSize: '11px',
                            }}
                          >
                            {progress.percent.toFixed(1)}%
                          </Typography>
                        )}
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginTop: '8px',
                        fontSize: '12px',
                        color: '#6b7280',
                      }}
                    >
                      <span>
                        Current: {progress.current?.toFixed(1) || 0} / {progress.nextThreshold || 0} points
                      </span>
                      {nextRank?.remainingPoints !== undefined && (
                        <span style={{ fontWeight: 600, color: '#1b4c2d' }}>
                          {nextRank.remainingPoints.toFixed(1)} points to {nextRank.label}
                        </span>
                      )}
                    </Box>
                  </Box>
                )}
              </div>
            </div>
          )}

          <div className="detail-section">
            <h3 className="section-title">
              <FaPhone style={{ marginRight: '8px', marginBottom: '8px', color: '#ec5a0d'}} />
              Contact information
            </h3>
            <div className="detail-item">
              <label>
                <FaEnvelope style={{ marginRight: '8px' }} />
                Email:
              </label>
             
                <span>{businessWithCo2?.businessMail || ''}</span>
            
            </div>
            <div className="detail-item">
              <label>
                <FaPhone style={{ marginRight: '8px' }} />
                Phone number:
              </label>
              {isEditing ? (
                <TextField
                  {...register('businessPhone')}
                  fullWidth
                  variant="outlined"
                  type="tel"
                  error={!!errors.businessPhone}
                  helperText={errors.businessPhone?.message}
                  className="edit-input"
                />
              ) : (
                <span>{businessWithCo2?.businessPhone}</span>
              )}
            </div>
            <div className="detail-item">
              <label>
                <FaMapMarkerAlt style={{ marginRight: '8px' }} />
                Address:
              </label>
              {isEditing ? (
                <Box>
                  <AddressSelector 
                    onAddressSelect={handleAddressSelect} 
                    variant="light"
                  />
                  {errors.businessAddress && (
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ marginTop: "8px", display: "block" }}
                    >
                      {errors.businessAddress?.message}
                    </Typography>
                  )}
                </Box>
                             ) : (
                 <span style={{ color: "black", fontWeight: "600" }}>{businessWithCo2?.businessAddress}</span>
               )}
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

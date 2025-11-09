import React, { useEffect, useState, useCallback } from 'react'
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
  FaMapMarkerAlt
} from 'react-icons/fa'
import './ProfileBusiness.css'
import { useDispatch, useSelector } from 'react-redux'
import { getProfileBusiness, updateProfileBusiness } from '../../../store/slices/userSlice'
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

  // Fetch business profile on mount
  useEffect(() => {
    dispatch(getProfileBusiness())
  }, [dispatch])

  // Extract data from API payload
  const business = apiBusinessPayload?.data?.business
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

  const getFormValues = () => ({
    businessName: business?.businessName || '',
    businessType: business?.businessType || '',
    taxCode: business?.taxCode || '',
    email: business?.businessMail || '',
    businessPhone: business?.businessPhone || '',
    businessAddress: business?.businessAddress || '',
    openTime: business?.openTime || '',
    closeTime: business?.closeTime || ''
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

  // Reset form when business data changes
  useEffect(() => {
    reset({
      businessName: business?.businessName || '',
      businessType: business?.businessType || '',
      businessPhone: business?.businessPhone || '',
      businessAddress: business?.businessAddress || '',
      openTime: business?.openTime || '',
      closeTime: business?.closeTime || ''
    })
  }, [business, reset])

  const handleEdit = () => {
    setIsEditing(true)
    reset({
      businessName: business?.businessName || '',
      businessType: business?.businessType || '',
      businessPhone: business?.businessPhone || '',
      businessAddress: business?.businessAddress || '',
      openTime: business?.openTime || '',
      closeTime: business?.closeTime || ''
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
      businessName: business?.businessName || '',
      businessType: business?.businessType || '',
      taxCode: business?.taxCode || '',
      email: business?.businessMail || '',
      businessPhone: business?.businessPhone || '',
      businessAddress: business?.businessAddress || '',
      openTime: business?.openTime || '',
      closeTime: business?.closeTime || ''
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
            {business?.businessLogoUrl ? (
              <img src={business?.businessLogoUrl} alt="Business Logo" />
            ) : (
              <div >
                <span>{business?.businessName?.charAt(0)}</span>
              </div>
            )}
          </div>
          <div className="profile-title">
            <h1 className="business-name">{business?.businessName}</h1>
            <p className="business-type">{business?.businessType}</p>
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
                <span>{business?.businessName}</span>
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
                <span>{business?.businessType}</span>
              )}
            </div>
            <div className="detail-item">
              <label>Tax code:</label>
                <span>{business?.taxCode}</span>
          
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
                <span>{business?.openTime || '-'}</span>
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
                <span>{business?.closeTime || '-'}</span>
              )}
            </div>
          </div>

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
             
                <span>{business?.businessMail || ''}</span>
            
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
                <span>{business?.businessPhone}</span>
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
                 <span style={{ color: "black", fontWeight: "600" }}>{business?.businessAddress}</span>
               )}
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel
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

// Schema validation với Yup
const businessSchema = yup.object({
  businessName: yup
    .string()
    .required('Tên doanh nghiệp là bắt buộc')
    .min(2, 'Tên doanh nghiệp phải có ít nhất 2 ký tự')
    .max(100, 'Tên doanh nghiệp không được quá 100 ký tự'),
  businessType: yup
    .string()
    .required('Loại hình kinh doanh là bắt buộc'),
  taxCode: yup
    .string()
    .required('Mã số thuế là bắt buộc')
    .matches(/^[0-9]{10,13}$/, 'Mã số thuế phải có từ 10-13 chữ số'),
  email: yup
    .string()
    .required('Email là bắt buộc')
    .email('Email không hợp lệ'),
  businessPhone: yup
    .string()
    .required('Số điện thoại là bắt buộc')
    .matches(/^[0-9]{10,11}$/, 'Số điện thoại phải có 10-11 chữ số'),
  businessAddress: yup
    .string()
    .required('Địa chỉ là bắt buộc')
    .min(10, 'Địa chỉ phải có ít nhất 10 ký tự')
    .max(200, 'Địa chỉ không được quá 200 ký tự')
})

export default function ProfileBusiness() {


  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const dispatch = useDispatch()
  const { userInfo } = useSelector((state) => state.user)


  

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm({
    resolver: yupResolver(businessSchema),
    defaultValues: userInfo
  })

  const handleEdit = () => {
    setIsEditing(true)
    reset(userInfo)
  }

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      // TODO: Gọi API để lưu dữ liệu
      console.log('Dữ liệu gửi lên:', data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    reset(userInfo)
  }

  const formatBalance = (balance) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(balance)
  }

  return (
    <div className="profile-business-container">
      <div className="profile-business-card">
        {/* Header với avatar và tên */}
        <div className="profile-header">
          <div className="profile-avatar">
            {userInfo?.businessLogo ? (
              <img src={userInfo?.businessLogo} alt="Business Logo" />
            ) : (
              <div >
                <span>{userInfo?.businessName?.charAt(0)}</span>
              </div>
            )}
          </div>
          <div className="profile-title">
            <h1 className="business-name">{userInfo?.businessName}</h1>
            <p className="business-type">{userInfo?.businessType}</p>
          </div>
          <div className="profile-actions">
            {!isEditing ? (
              <Button
                variant="contained"
                startIcon={<FaEdit />}
                onClick={handleEdit}
                className="edit-btn"
              >
                Chỉnh sửa
              </Button>
            ) : (
              <div className="action-buttons">
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<FaSave />}
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                  className="save-btn"
                >
                  {isSubmitting ? 'Đang lưu...' : 'Lưu'}
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<FaTimes />}
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="cancel-btn"
                >
                  Hủy
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Thông tin chi tiết */}
        <div className="profile-details">
          <div className="detail-section">
            <h3 className="section-title">
              <FaWallet style={{ marginRight: '8px', marginBottom: '8px', color: '#c64200' }} />
              Thông tin ví
            </h3>
            <div className="detail-item">
              <label>Số dư:</label>
              <span className="balance">{formatBalance(userInfo?.wallet?.balance)}</span>
            </div>
          </div>

          <div className="detail-section">
            <h3 className="section-title">
              <FaBuilding style={{ marginRight: '8px', marginBottom: '8px', color: '#3169ed' }} />
              Thông tin doanh nghiệp
            </h3>
            <div className="detail-item">
              <label>Tên doanh nghiệp:</label>
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
                <span>{userInfo?.businessName}</span>
              )}
            </div>
            <div className="detail-item">
              <label>Loại hình kinh doanh:</label>
              {isEditing ? (
                <FormControl fullWidth error={!!errors.businessType}>
                  <Select
                    {...register('businessType')}
                    value={watch('businessType')}
                    className="edit-select"
                  >
                    <MenuItem value="Cafe">Cafe</MenuItem>
                    <MenuItem value="Restaurant">Nhà hàng</MenuItem>
                    <MenuItem value="Shop">Cửa hàng</MenuItem>
                    <MenuItem value="Service">Dịch vụ</MenuItem>
                  </Select>
                  {errors.businessType && (
                    <span style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                      {errors.businessType.message}
                    </span>
                  )}
                </FormControl>
              ) : (
                <span>{userInfo?.businessType}</span>
              )}
            </div>
            <div className="detail-item">
              <label>Mã số thuế:</label>
              {isEditing ? (
                <TextField
                  {...register('taxCode')}
                  fullWidth
                  variant="outlined"
                  error={!!errors.taxCode}
                  helperText={errors.taxCode?.message}
                  className="edit-input"
                />
              ) : (
                <span>{userInfo?.taxCode}</span>
              )}
            </div>
          </div>

          <div className="detail-section">
            <h3 className="section-title">
              <FaPhone style={{ marginRight: '8px', marginBottom: '8px', color: '#ec5a0d'}} />
              Thông tin liên hệ
            </h3>
            <div className="detail-item">
              <label>
                <FaEnvelope style={{ marginRight: '8px' }} />
                Email:
              </label>
              {isEditing ? (
                <TextField
                  {...register('email')}
                  fullWidth
                  variant="outlined"
                  type="email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  className="edit-input"
                />
              ) : (
                <span>{userInfo?.email}</span>
              )}
            </div>
            <div className="detail-item">
              <label>
                <FaPhone style={{ marginRight: '8px' }} />
                Số điện thoại:
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
                <span>{userInfo?.businessPhone}</span>
              )}
            </div>
            <div className="detail-item">
              <label>
                <FaMapMarkerAlt style={{ marginRight: '8px' }} />
                Địa chỉ:
              </label>
              {isEditing ? (
                <TextField
                  {...register('businessAddress')}
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={3}
                  error={!!errors.businessAddress}
                  helperText={errors.businessAddress?.message}
                  className="edit-textarea"
                />
              ) : (
                <span>{userInfo?.businessAddress}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

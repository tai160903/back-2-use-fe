import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getMaterialByIdApi,
  updateMaterialApi,
  reviewMaterialApi,
  clearCurrentMaterial
} from '../../store/slices/adminSlice';
import { PATH } from '../../routes/path';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress,
  Chip,
  InputAdornment,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  Close as CloseIcon,
  Category as CategoryIcon,
  Description as DescriptionIcon,
  Replay as ReplayIcon,
  Percent as PercentIcon,
} from '@mui/icons-material';
import './AdminMaterialDetail.css';

const AdminMaterialDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentMaterial, isLoading, error } = useSelector(state => state.admin);

  const [isEditing, setIsEditing] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    materialName: '',
    isActive: true,
    reuseLimit: '',
    depositPercent: '',
    description: ''
  });
  const [approveData, setApproveData] = useState({
    reuseLimit: '',
    depositPercent: ''
  });
  const [rejectData, setRejectData] = useState({
    adminNote: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (id) {
      dispatch(getMaterialByIdApi(id));
    }
    return () => {
      dispatch(clearCurrentMaterial());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (currentMaterial) {
      setFormData({
        materialName: currentMaterial.materialName || '',
        isActive: currentMaterial.isActive !== undefined ? currentMaterial.isActive : true,
        reuseLimit: currentMaterial.reuseLimit || currentMaterial.maximumReuse || '',
        depositPercent: currentMaterial.depositPercent || '',
        description: currentMaterial.description || ''
      });
    }
  }, [currentMaterial]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.materialName.trim()) {
      newErrors.materialName = 'Tên material là bắt buộc';
    }
    if (!formData.reuseLimit) {
      newErrors.reuseLimit = 'Reuse limit là bắt buộc';
    } else if (isNaN(formData.reuseLimit) || parseInt(formData.reuseLimit) <= 0) {
      newErrors.reuseLimit = 'Reuse limit phải là số dương';
    }
    if (formData.depositPercent === '' || formData.depositPercent === null) {
      newErrors.depositPercent = 'Deposit percent là bắt buộc';
    } else if (isNaN(formData.depositPercent) || parseFloat(formData.depositPercent) < 0 || parseFloat(formData.depositPercent) > 100) {
      newErrors.depositPercent = 'Deposit percent phải từ 0 đến 100';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Mô tả là bắt buộc';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      dispatch(updateMaterialApi({
        materialId: id,
        materialData: {
          materialName: formData.materialName.trim(),
          isActive: formData.isActive,
          reuseLimit: parseInt(formData.reuseLimit),
          depositPercent: parseFloat(formData.depositPercent),
          description: formData.description.trim()
        }
      })).then(() => {
        setIsEditing(false);
      });
    }
  };

  const handleCancelEdit = () => {
    if (currentMaterial) {
      setFormData({
        materialName: currentMaterial.materialName || '',
        isActive: currentMaterial.isActive !== undefined ? currentMaterial.isActive : true,
        reuseLimit: currentMaterial.reuseLimit || currentMaterial.maximumReuse || '',
        depositPercent: currentMaterial.depositPercent || '',
        description: currentMaterial.description || ''
      });
    }
    setErrors({});
    setIsEditing(false);
  };

  const handleApprove = () => {
    setIsApproveDialogOpen(true);
    setApproveData({
      reuseLimit: currentMaterial?.reuseLimit || currentMaterial?.maximumReuse || '',
      depositPercent: currentMaterial?.depositPercent || ''
    });
  };

  const handleConfirmApprove = () => {
    const approveErrors = {};
    if (!approveData.reuseLimit) {
      approveErrors.reuseLimit = 'Reuse limit là bắt buộc';
    } else if (isNaN(approveData.reuseLimit) || parseInt(approveData.reuseLimit) <= 0) {
      approveErrors.reuseLimit = 'Reuse limit phải là số dương';
    }
    if (approveData.depositPercent === '' || approveData.depositPercent === null) {
      approveErrors.depositPercent = 'Deposit percent là bắt buộc';
    } else if (isNaN(approveData.depositPercent) || parseFloat(approveData.depositPercent) < 0 || parseFloat(approveData.depositPercent) > 100) {
      approveErrors.depositPercent = 'Deposit percent phải từ 0 đến 100';
    }

    if (Object.keys(approveErrors).length > 0) {
      setErrors(approveErrors);
      return;
    }

    dispatch(reviewMaterialApi({
      materialId: id,
      reviewData: {
        status: 'approved',
        reuseLimit: parseInt(approveData.reuseLimit),
        depositPercent: parseFloat(approveData.depositPercent)
      }
    })).then(() => {
      setIsApproveDialogOpen(false);
      setApproveData({ reuseLimit: '', depositPercent: '' });
    });
  };

  const handleReject = () => {
    setIsRejectDialogOpen(true);
    setRejectData({ adminNote: '' });
  };

  const handleConfirmReject = () => {
    if (!rejectData.adminNote.trim()) {
      alert('Vui lòng nhập lý do từ chối (adminNote)');
      return;
    }

    dispatch(reviewMaterialApi({
      materialId: id,
      reviewData: {
        status: 'rejected',
        adminNote: rejectData.adminNote.trim()
      }
    })).then(() => {
      setIsRejectDialogOpen(false);
      setRejectData({ adminNote: '' });
    });
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      pending: { color: 'warning', label: 'Đang chờ duyệt' },
      approved: { color: 'success', label: 'Đã duyệt' },
      rejected: { color: 'error', label: 'Đã từ chối' }
    };
    const config = statusConfig[status] || statusConfig.pending;
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  if (isLoading && !currentMaterial) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!currentMaterial) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Không tìm thấy material</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(PATH.ADMIN_MATERIAL)} sx={{ mt: 2 }}>
          Quay lại danh sách
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate(PATH.ADMIN_MATERIAL)}>
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold">
              Chi tiết Material
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Quản lý và duyệt material
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {!isEditing && (
            <>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => setIsEditing(true)}
              >
                Chỉnh sửa
              </Button>
              {currentMaterial.status === 'pending' && (
                <>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircleIcon />}
                    onClick={handleApprove}
                  >
                    Duyệt
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<CancelIcon />}
                    onClick={handleReject}
                  >
                    Từ chối
                  </Button>
                </>
              )}
            </>
          )}
          {isEditing && (
            <>
              <Button
                variant="outlined"
                onClick={handleCancelEdit}
              >
                Hủy
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
              >
                Lưu
              </Button>
            </>
          )}
        </Box>
      </Box>

      {/* Material Info */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <CategoryIcon fontSize="small" />
                Tên Material
              </Typography>
              {isEditing ? (
                <TextField
                  fullWidth
                  name="materialName"
                  value={formData.materialName}
                  onChange={handleInputChange}
                  error={!!errors.materialName}
                  helperText={errors.materialName}
                  variant="outlined"
                />
              ) : (
                <Typography variant="h6">{currentMaterial.materialName}</Typography>
              )}
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Trạng thái
              </Typography>
              {getStatusChip(currentMaterial.status)}
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <ReplayIcon fontSize="small" />
                Reuse Limit
              </Typography>
              {isEditing ? (
                <TextField
                  fullWidth
                  name="reuseLimit"
                  type="number"
                  value={formData.reuseLimit}
                  onChange={handleInputChange}
                  error={!!errors.reuseLimit}
                  helperText={errors.reuseLimit}
                  variant="outlined"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">lần</InputAdornment>
                  }}
                />
              ) : (
                <Typography variant="body1">{currentMaterial.reuseLimit || currentMaterial.maximumReuse || 'N/A'} lần</Typography>
              )}
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <PercentIcon fontSize="small" />
                Deposit Percent
              </Typography>
              {isEditing ? (
                <TextField
                  fullWidth
                  name="depositPercent"
                  type="number"
                  value={formData.depositPercent}
                  onChange={handleInputChange}
                  error={!!errors.depositPercent}
                  helperText={errors.depositPercent}
                  variant="outlined"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>
                  }}
                />
              ) : (
                <Typography variant="body1">{currentMaterial.depositPercent || 'N/A'}%</Typography>
              )}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <DescriptionIcon fontSize="small" />
                Mô tả
              </Typography>
              {isEditing ? (
                <TextField
                  fullWidth
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  error={!!errors.description}
                  helperText={errors.description}
                  variant="outlined"
                  multiline
                  rows={4}
                />
              ) : (
                <Typography variant="body1">{currentMaterial.description || 'N/A'}</Typography>
              )}
            </Box>
          </Grid>

          {currentMaterial.status === 'rejected' && currentMaterial.adminNote && (
            <Grid item xs={12}>
              <Alert severity="error">
                <Typography variant="subtitle2" fontWeight="bold">Lý do từ chối:</Typography>
                <Typography variant="body2">{currentMaterial.adminNote}</Typography>
              </Alert>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Approve Dialog */}
      <Dialog open={isApproveDialogOpen} onClose={() => setIsApproveDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" fontWeight="bold">Duyệt Material</Typography>
            <IconButton onClick={() => setIsApproveDialogOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Vui lòng nhập thông tin reuseLimit và depositPercent để duyệt material này.
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Reuse Limit"
                type="number"
                value={approveData.reuseLimit}
                onChange={(e) => setApproveData({ ...approveData, reuseLimit: e.target.value })}
                error={!!errors.reuseLimit}
                helperText={errors.reuseLimit}
                InputProps={{
                  endAdornment: <InputAdornment position="end">lần</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Deposit Percent"
                type="number"
                value={approveData.depositPercent}
                onChange={(e) => setApproveData({ ...approveData, depositPercent: e.target.value })}
                error={!!errors.depositPercent}
                helperText={errors.depositPercent}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsApproveDialogOpen(false)}>Hủy</Button>
          <Button variant="contained" color="success" onClick={handleConfirmApprove}>
            Duyệt
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onClose={() => setIsRejectDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" fontWeight="bold">Từ chối Material</Typography>
            <IconButton onClick={() => setIsRejectDialogOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Vui lòng nhập lý do từ chối (adminNote) cho material này.
          </Typography>
          <TextField
            fullWidth
            label="Lý do từ chối (adminNote)"
            multiline
            rows={4}
            value={rejectData.adminNote}
            onChange={(e) => setRejectData({ ...rejectData, adminNote: e.target.value })}
            placeholder="Nhập lý do từ chối..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsRejectDialogOpen(false)}>Hủy</Button>
          <Button variant="contained" color="error" onClick={handleConfirmReject}>
            Từ chối
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminMaterialDetail;


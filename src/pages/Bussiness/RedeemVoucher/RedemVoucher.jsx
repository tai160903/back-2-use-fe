import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createBusinessVoucher,
  updateBusinessVoucher,
  getMyBusinessVouchers,
  getBusinessVoucherCodes,
  getBussinessVoucherDetail,
} from '../../../store/slices/voucherSlice';
import {
  FaGift,
  FaEdit,
  FaPlus,
  FaQrcode,
  FaCheckCircle,
  FaTimesCircle,
  FaChartLine,
} from 'react-icons/fa';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Chip,
  CircularProgress,
  IconButton,
  Grid,
  Paper,
  Divider,
  InputAdornment,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import { Close as CloseIcon, Search as SearchIcon } from '@mui/icons-material';
import { Pagination } from '@mui/material';
import './RedemVoucher.css';
import toast from 'react-hot-toast';

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'N/A';
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export default function RedemVoucher() {
  const dispatch = useDispatch();
  const { myBusinessVouchers, isLoading, currentBusinessVoucher } = useSelector(
    (state) => state.vouchers
  );

  // State
  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'active', 'inactive', 'expired'
  const [searchQuery, setSearchQuery] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [voucherCodes, setVoucherCodes] = useState([]);
  const itemsPerPage = 6

  // Data chi tiết voucher (lấy từ API getBussinessVoucherDetail nếu có)
  const detailVoucher = currentBusinessVoucher?.voucher || selectedVoucher;
  const detailStats = currentBusinessVoucher?.stats;
  const detailVoucherCodes = currentBusinessVoucher?.voucherCodes || voucherCodes;

  // Form states
  const [createForm, setCreateForm] = useState({
    customName: '',
    customDescription: '',
    baseCode: '',
    maxUsage: '',
    discountPercent: '',
    rewardPointCost: '',
    startDate: '',
    endDate: '',
    isPublished: false,
  });

  const [editForm, setEditForm] = useState({
    customName: '',
    customDescription: '',
    discountPercent: '',
    rewardPointCost: '',
    startDate: '',
    endDate: '',
    isPublished: false,
  });

  // Check if voucher is expired
  const isVoucherExpired = (endDate) => {
    if (!endDate) return false;
    const end = new Date(endDate);
    const now = new Date();
    return end < now;
  };

  // Load all vouchers once for filtering and pagination (client-side)
  useEffect(() => {
    dispatch(
      getMyBusinessVouchers({
        page: 1,
        limit: 1000, // Load all for filtering and pagination
      })
    );
  }, [dispatch]);

  // Filter vouchers based on status and search
  const filteredVouchers = useMemo(() => {
    if (!myBusinessVouchers || !Array.isArray(myBusinessVouchers)) return [];
    
    let filtered = [...myBusinessVouchers];
    
    // Filter by status (using API status field first, then fallback to date check for "expired")
    if (filterStatus === 'active') {
      filtered = filtered.filter((v) => v.status === 'active');
    } else if (filterStatus === 'inactive') {
      filtered = filtered.filter((v) => v.status === 'inactive');
    } else if (filterStatus === 'expired') {
      filtered = filtered.filter(
        (v) => v.status === 'expired' || isVoucherExpired(v.endDate)
      );
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((v) => {
        const name = (v.customName || '').toLowerCase();
        const desc = (v.customDescription || '').toLowerCase();
        return name.includes(query) || desc.includes(query);
      });
    }
    
    return filtered;
  }, [myBusinessVouchers, filterStatus, searchQuery]);

  // Paginate filtered vouchers
  const paginatedVouchers = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredVouchers.slice(startIndex, endIndex);
  }, [filteredVouchers, page, itemsPerPage]);

  // Calculate total pages for filtered results
  const totalFilteredPages = useMemo(() => {
    return Math.ceil(filteredVouchers.length / itemsPerPage);
  }, [filteredVouchers.length, itemsPerPage]);

  // Reset page when filter or search changes
  useEffect(() => {
    setPage(1);
  }, [filterStatus, searchQuery]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (!myBusinessVouchers) {
      return { total: 0, active: 0, expired: 0, published: 0 };
    }
    
    const total = myBusinessVouchers.length;
    const active = myBusinessVouchers.filter((v) => !isVoucherExpired(v.endDate)).length;
    const expired = myBusinessVouchers.filter((v) => isVoucherExpired(v.endDate)).length;
    const published = myBusinessVouchers.filter((v) => v.isPublished).length;
    
      const inactive = myBusinessVouchers.filter((v) => v.status === 'inactive').length;
      
      return { total, active, inactive, expired, published };
  }, [myBusinessVouchers]);

  // Handle create voucher
  const handleOpenCreateModal = () => {
    setCreateForm({
      customName: '',
      customDescription: '',
      baseCode: '',
      maxUsage: '',
      discountPercent: '',
      rewardPointCost: '',
      startDate: '',
      endDate: '',
      isPublished: false,
    });
    setCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setCreateModalOpen(false);
  };

  const handleCreateVoucher = async () => {
    // Validation
    if (
      !createForm.customName ||
      !createForm.customDescription ||
      !createForm.baseCode ||
      !createForm.maxUsage ||
      !createForm.discountPercent ||
      !createForm.rewardPointCost ||
      !createForm.startDate ||
      !createForm.endDate
    ) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      // Fix date handling: Convert local date to UTC properly
      // Parse the date string (format: YYYY-MM-DD)
      const dateParts = createForm.startDate.split('-');
      const year = parseInt(dateParts[0], 10);
      const month = parseInt(dateParts[1], 10) - 1; // Month is 0-indexed
      const day = parseInt(dateParts[2], 10);
      
      // Create date in local timezone at start of day
      const selectedStartDate = new Date(year, month, day, 0, 0, 0, 0);
      
      // Get today's date in local timezone (set to start of day)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Compare dates (not datetime) - if selected date is before today, it's invalid
      if (selectedStartDate < today) {
        toast.error('Ngày bắt đầu không được là ngày quá khứ');
        return;
      }
      
      // Get current time in UTC
      const nowUTC = new Date();
      
      // Convert selected date to UTC start of day
      const selectedStartUTC = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
      
      // If the selected date is today, use current UTC time to ensure it's not in the past
      // If the selected date is in the future, use start of that day in UTC
      let startDateISO;
      if (selectedStartDate.getTime() === today.getTime()) {
        // Selected date is today - use current UTC time to avoid "past" error
        startDateISO = nowUTC.toISOString();
      } else {
        // Selected date is in the future - use start of that day in UTC
        // But ensure it's not before current time
        if (selectedStartUTC < nowUTC) {
          startDateISO = nowUTC.toISOString();
        } else {
          startDateISO = selectedStartUTC.toISOString();
        }
      }
      
      // For end date, set to end of day in local timezone, then convert to UTC
      const endDateLocal = new Date(createForm.endDate);
      endDateLocal.setHours(23, 59, 59, 999); // End of day in local timezone
      const endDateISO = endDateLocal.toISOString();

      await dispatch(
        createBusinessVoucher({
          customName: createForm.customName,
          customDescription: createForm.customDescription,
          baseCode: createForm.baseCode,
          maxUsage: Number(createForm.maxUsage),
          discountPercent: Number(createForm.discountPercent),
          rewardPointCost: Number(createForm.rewardPointCost),
          startDate: startDateISO,
          endDate: endDateISO,
          isPublished: createForm.isPublished,
        })
      ).unwrap();

      handleCloseCreateModal();
      setPage(1); // Reset to first page
      // Refresh list - reload all for filtering and pagination
      dispatch(
        getMyBusinessVouchers({
          page: 1,
          limit: 1000, // Reload all for filtering and pagination
        })
      );
    } catch {
      // Error handled by thunk
    }
  };

  // Handle edit voucher
  const handleOpenEditModal = (voucher) => {
    setSelectedVoucher(voucher);
    setEditForm({
      customName: voucher.customName || '',
      customDescription: voucher.customDescription || '',
      discountPercent: voucher.discountPercent || '',
      rewardPointCost: voucher.rewardPointCost || '',
      startDate: voucher.startDate
        ? new Date(voucher.startDate).toISOString().split('T')[0]
        : '',
      endDate: voucher.endDate
        ? new Date(voucher.endDate).toISOString().split('T')[0]
        : '',
      isPublished: voucher.isPublished || false,
    });
    setDetailModalOpen(false);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedVoucher(null);
  };

  const handleEditVoucher = async () => {
    if (!selectedVoucher) return;

    // Validation
    if (
      !editForm.customName ||
      !editForm.customDescription ||
      !editForm.discountPercent ||
      !editForm.rewardPointCost ||
      !editForm.startDate ||
      !editForm.endDate
    ) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      // Check if voucher is published - only allow editing unpublished vouchers
      if (selectedVoucher.isPublished) {
        toast.error('Chỉ có thể cập nhật voucher ở trạng thái Unpublished (chưa xuất bản)');
        return;
      }

      // Fix date handling: Convert local date to UTC properly
      // Parse the date string (format: YYYY-MM-DD)
      const dateParts = editForm.startDate.split('-');
      const year = parseInt(dateParts[0], 10);
      const month = parseInt(dateParts[1], 10) - 1; // Month is 0-indexed
      const day = parseInt(dateParts[2], 10);
      
      // Create date in local timezone at start of day
      const selectedStartDate = new Date(year, month, day, 0, 0, 0, 0);
      
      // Get today's date in local timezone (set to start of day)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Compare dates (not datetime) - if selected date is before today, it's invalid
      if (selectedStartDate < today) {
        toast.error('Ngày bắt đầu không được là ngày quá khứ');
        return;
      }
      
      // Get current time in UTC
      const nowUTC = new Date();
      
      // Convert selected date to UTC start of day
      const selectedStartUTC = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
      
      // If the selected date is today, use current UTC time to ensure it's not in the past
      // If the selected date is in the future, use start of that day in UTC
      let startDateISO;
      if (selectedStartDate.getTime() === today.getTime()) {
        // Selected date is today - use current UTC time to avoid "past" error
        startDateISO = nowUTC.toISOString();
      } else {
        // Selected date is in the future - use start of that day in UTC
        // But ensure it's not before current time
        if (selectedStartUTC < nowUTC) {
          startDateISO = nowUTC.toISOString();
        } else {
          startDateISO = selectedStartUTC.toISOString();
        }
      }
      
      // For end date, set to end of day in local timezone, then convert to UTC
      const endDateLocal = new Date(editForm.endDate);
      endDateLocal.setHours(23, 59, 59, 999); // End of day in local timezone
      const endDateISO = endDateLocal.toISOString();

      const voucherId = selectedVoucher._id || selectedVoucher.id;
      await dispatch(
        updateBusinessVoucher({
          id: voucherId,
          data: {
            customName: editForm.customName,
            customDescription: editForm.customDescription,
            discountPercent: Number(editForm.discountPercent),
            rewardPointCost: Number(editForm.rewardPointCost),
            startDate: startDateISO,
            endDate: endDateISO,
            isPublished: editForm.isPublished,
          },
        })
      ).unwrap();

      handleCloseEditModal();
      setPage(1); // Reset to first page
      // Refresh list - reload all for filtering and pagination
      dispatch(
        getMyBusinessVouchers({
          page: 1,
          limit: 1000, // Reload all for filtering and pagination
        })
      );
    } catch {
      // Error handled by thunk
    }
  };

  // Handle view details - Click on card opens detail modal
  const handleViewDetails = async (voucher) => {
    setSelectedVoucher(voucher);
    setDetailModalOpen(true);

    // Load voucher codes
    try {
      const voucherId = voucher._id || voucher.id;
      // Gọi API lấy chi tiết business voucher + danh sách mã (lưu vào Redux)
      dispatch(
        getBussinessVoucherDetail({
          businessVoucherId: voucherId,
          status: undefined,
          page: 1,
          limit: 100,
        })
      );

      const result = await dispatch(
        getBusinessVoucherCodes({
          businessVoucherId: voucherId,
          page: 1,
          limit: 100,
        })
      ).unwrap();
      setVoucherCodes(result?.data || []);
    } catch (error) {
      console.error('Failed to load voucher codes:', error);
      setVoucherCodes([]);
    }
  };

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedVoucher(null);
    setVoucherCodes([]);
  };

  // Generate QR code URL
  const generateQRCode = (voucherCode) => {
    if (!voucherCode) return '';
    const code =
      typeof voucherCode === 'string'
        ? voucherCode
        : voucherCode.code || '';
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
      code
    )}`;
  };

  // Calculate days remaining
  const getDaysRemaining = (endDate) => {
    if (!endDate) return null;
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <div className="business-voucher-page">
      <div className="voucher-page-container">
        {/* Main Content */}
        <main className="voucher-main-content">
          {/* Header */}
          <div className="voucher-content-header">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  backgroundColor: '#12422a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(18, 66, 42, 0.25)',
                }}
              >
                <FaGift style={{ fontSize: 28, color: 'white' }} />
              </Box>
              <Box>
                <Typography
                  variant="h4"
                  component="h1"
                  fontWeight={700}
                  sx={{
                    color: '#1a1a1a',
                    mb: 0.5,
                  }}
                >
                  Voucher Management
                </Typography>
                <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.875rem' }}>
                  Create and manage vouchers for your business
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              startIcon={<FaPlus />}
              onClick={handleOpenCreateModal}
              sx={{
                backgroundColor: '#12422a',
                color: '#ffffff',
                textTransform: 'none',
                fontWeight: 600,
                padding: '12px 24px',
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(18, 66, 42, 0.3)',
                '&:hover': {
                  backgroundColor: '#0d2e1c',
                  boxShadow: '0 6px 16px rgba(18, 66, 42, 0.4)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Create Voucher
            </Button>
          </div>

          {/* Statistics Cards */}
          <Box className="stats-cards-container" sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mb: 3 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 2,
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 500 }}>
                  Total Vouchers
                </Typography>
                <FaGift style={{ fontSize: 20, color: '#12422a' }} />
              </Box>
              <Typography variant="h4" sx={{ color: '#1a1a1a', fontWeight: 700 }}>
                {stats.total}
              </Typography>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 2,
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 500 }}>
                  Active
                </Typography>
                <FaCheckCircle style={{ fontSize: 20, color: '#16a34a' }} />
              </Box>
              <Typography variant="h4" sx={{ color: '#16a34a', fontWeight: 700 }}>
                {stats.active}
              </Typography>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 2,
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 500 }}>
                  Expired
                </Typography>
                <FaTimesCircle style={{ fontSize: 20, color: '#ef4444' }} />
              </Box>
              <Typography variant="h4" sx={{ color: '#ef4444', fontWeight: 700 }}>
                {stats.expired}
              </Typography>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 2,
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 500 }}>
                  Published
                </Typography>
                <FaChartLine style={{ fontSize: 20, color: '#12422a' }} />
              </Box>
              <Typography variant="h4" sx={{ color: '#1a1a1a', fontWeight: 700 }}>
                {stats.published}
              </Typography>
            </Paper>
          </Box>

          {/* Search and Filter Section */}
          <div className="voucher-filters-container">
            <div className="voucher-search-container">
              <SearchIcon className="voucher-search-icon" />
              <input
                type="text"
                placeholder="Search by voucher name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="voucher-search-input"
              />
            </div>
            
            <div className="voucher-filter-tabs">
              <button 
                className={`voucher-filter-tab ${filterStatus === 'all' ? 'active' : ''}`}
                onClick={() => setFilterStatus('all')}
              >
                <FaGift />
                All ({stats.total})
              </button>
              <button 
                className={`voucher-filter-tab ${filterStatus === 'active' ? 'active' : ''}`}
                onClick={() => setFilterStatus('active')}
              >
                <FaCheckCircle />
                Active ({stats.active})
              </button>
              <button 
                className={`voucher-filter-tab ${filterStatus === 'inactive' ? 'active' : ''}`}
                onClick={() => setFilterStatus('inactive')}
              >
                <FaTimesCircle />
                Inactive ({stats.inactive})
              </button>
              <button 
                className={`voucher-filter-tab ${filterStatus === 'expired' ? 'active' : ''}`}
                onClick={() => setFilterStatus('expired')}
              >
                <FaTimesCircle />
                Expired ({stats.expired})
              </button>
            </div>
          </div>

          {/* Vouchers Grid */}
          {isLoading && page === 1 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
              <CircularProgress />
            </Box>
          ) : paginatedVouchers?.length > 0 ? (
            <>
              <div className="vouchers-grid-container">
                {paginatedVouchers.map((voucher) => {
                  const daysRemaining = getDaysRemaining(voucher.endDate);
                  return (
                    <div
                      key={voucher._id || voucher.id}
                      className="voucher-card-shopee"
                      onClick={() => handleViewDetails(voucher)}
                    >
                      {/* Left Section - Orange for unpublished, Green for published */}
                      <div className={`voucher-card-left ${voucher.isPublished ? 'published' : ''}`}>
                        <div className="voucher-left-content">
                          <FaGift className="voucher-icon-large" />
                          <Typography
                            variant="caption"
                            className="voucher-type-text"
                          >
                            {voucher.isPublished
                              ? 'Published'
                              : 'Unpublished'}
                          </Typography>
                          <Typography
                            variant="caption"
                            className="voucher-type-subtext"
                          >
                            {voucher.voucherType || 'Business'}
                          </Typography>
                        </div>
                        <div className="voucher-torn-edge"></div>
                      </div>

                      {/* Right White Section */}
                      <div className="voucher-card-right">
                        {/* Header: Name + Base code + Status badges */}
                        <div className="voucher-header-row">
                          <div className="voucher-header-main">
                            <Typography className="voucher-name-text">
                              {voucher.customName || 'Unnamed voucher'}
                            </Typography>
                            <Typography className="voucher-code-text">
                              Code: <span>{voucher.baseCode || 'N/A'}</span>
                            </Typography>
                          </div>
                          <div className="voucher-header-badges">
                            {/* Business status */}
                            <Chip
                              label={
                                voucher.status
                                  ? voucher.status.charAt(0).toUpperCase() +
                                    voucher.status.slice(1)
                                  : 'Unknown'
                              }
                              size="small"
                              className={`status-chip status-${voucher.status || 'unknown'}`}
                            />
                            {/* Publish status */}
                            <Chip
                              label={
                                voucher.isPublished ? 'Published' : 'Unpublished'
                              }
                              size="small"
                              className={`status-chip ${
                                voucher.isPublished ? 'published' : 'unpublished'
                              }`}
                            />
                          </div>
                        </div>

                        {/* Description */}
                        <div className="voucher-description">
                          <Typography
                            variant="body2"
                            className="voucher-desc-text"
                          >
                            {voucher.customDescription || 'No description'}
                          </Typography>
                        </div>

                        {/* Main info grid */}
                        <div className="voucher-info-grid">
                          <div className="voucher-info-item-inline">
                            <span className="voucher-info-label" style={{fontWeight: 'bold'}}>Discount</span>
                            <span className="voucher-info-value highlight">
                              {voucher.discountPercent || 0}%
                            </span>
                          </div>
                          <div className="voucher-info-item-inline">
                            <span className="voucher-info-label" style={{fontWeight: 'bold'}}>Reward points cost:</span>
                            <span className="voucher-info-value">
                              {voucher.rewardPointCost ?? 0} 
                            </span>
                          </div>
                          <div className="voucher-info-item-inline">
                            <span className="voucher-info-label" style={{fontWeight: 'bold'}}>Quantity</span>
                            <span className="voucher-info-value">
                              {voucher.redeemedCount ?? 0} / {voucher.maxUsage ?? 0}
                            </span>
                          </div>
                         
                        </div>

                        {/* Date & remaining */}
                        <div className="voucher-dates-row">
                          <div className="voucher-date-item">
                            <span className="voucher-info-label" style={{fontWeight: 'bold'}}>Start</span>
                            <span className="voucher-info-value">
                              {formatDate(voucher.startDate)}
                            </span>
                          </div>
                          <div className="voucher-date-item">
                            <span className="voucher-info-label" style={{fontWeight: 'bold'}}>End</span>
                            <span className="voucher-info-value">
                              {formatDate(voucher.endDate)}
                            </span>
                          </div>
                          {voucher.endDate && daysRemaining !== null && (
                            <div className="voucher-date-item remaining">
                              <span className="voucher-info-label" style={{fontWeight: 'bold'}}>Remaining</span>
                              <span className={`voucher-info-value ${daysRemaining > 0 ? 'remaining-active' : 'remaining-expired'}`}>
                                {daysRemaining > 0
                                  ? `${daysRemaining} days`
                                  : 'Expired'}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="voucher-actions">
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<FaEdit />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEditModal(voucher);
                            }}
                            className="edit-btn"
                          >
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalFilteredPages > 1 && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mt: 4,
                    mb: 4,
                  }}
                >
                  <Pagination
                    count={totalFilteredPages}
                    page={page}
                    onChange={(e, value) => setPage(value)}
                    color="primary"
                    sx={{
                      '& .MuiPaginationItem-root.Mui-selected': {
                        backgroundColor: '#12422a',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: '#0d2e1c',
                        },
                      },
                    }}
                  />
                </Box>
              )}
            </>
        ) : (
          <Paper
            sx={{
              p: 6,
              textAlign: 'center',
              backgroundColor: '#f9fafb',
              borderRadius: 2,
            }}
          >
            <FaGift
              style={{
                fontSize: '64px',
                color: '#9ca3af',
                marginBottom: '16px',
              }}
            />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {searchQuery.trim() || filterStatus !== 'all'
                ? 'No vouchers found'
                : 'No vouchers yet'}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              {searchQuery.trim() || filterStatus !== 'all'
                ? 'Try changing filters or search keywords'
                : 'Create your first voucher'}
            </Typography>
            {!searchQuery.trim() && filterStatus === 'all' && (
              <Button
                variant="contained"
                startIcon={<FaPlus />}
                onClick={handleOpenCreateModal}
                sx={{
                  backgroundColor: '#12422a',
                  '&:hover': {
                    backgroundColor: '#0d2e1c',
                  },
                }}
              >
                Create Voucher
              </Button>
            )}
          </Paper>
        )}
        </main>
      </div>

      {/* Create Voucher Modal */}
      <Dialog
        open={createModalOpen}
        onClose={handleCloseCreateModal}
        maxWidth="md"
        fullWidth
        TransitionProps={{
          timeout: 400,
        }}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 12px 40px rgba(18, 66, 42, 0.2)',
            overflow: 'hidden',
          },
        }}
      >
        <DialogTitle className="voucher-dialog-title">
          <Box className="voucher-dialog-header">
            <Box className="voucher-dialog-header-left">
              <Box className="voucher-dialog-title-section">
                <FaGift className="voucher-dialog-icon" />
                <Box>
                  <Typography variant="h6" component="div" className="voucher-dialog-title-text">
                    Create New Voucher
                  </Typography>
                  <Typography variant="body2" className="voucher-dialog-subtitle">
                    Create a new business voucher for your customers
                  </Typography>
                </Box>
              </Box>
            </Box>
            <IconButton
              onClick={handleCloseCreateModal}
              size="small"
              className="voucher-dialog-close-btn"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent className="voucher-dialog-content">
          <Grid container spacing={2}>
            {/* Row 1: Voucher Name, Description, Base Code */}
            <Grid item size={4}>
              <Box sx={{ mb: 0.5 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#12422a',
                    fontWeight: 600,
                    mb: 0.75,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.75,
                  }}
                >
                  <FaGift style={{ fontSize: 16 }} />
                  Voucher Name <span style={{ color: '#f44336' }}>*</span>
                </Typography>
              </Box>
              <TextField
                fullWidth
                placeholder="Enter voucher name"
                value={createForm.customName}
                onChange={(e) =>
                  setCreateForm({ ...createForm, customName: e.target.value })
                }
                required
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaGift style={{ color: '#12422a', fontSize: 18 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    '&:hover fieldset': {
                      borderColor: '#12422a',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#12422a',
                      borderWidth: 2,
                    },
                  },
                }}
              />
            </Grid>
            <Grid item size={4}>
              <Box sx={{ mb: 0.5 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#12422a',
                    fontWeight: 600,
                    mb: 0.75,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.75,
                  }}
                >
                  Description <span style={{ color: '#f44336' }}>*</span>
                </Typography>
              </Box>
              <TextField
                fullWidth
                placeholder="Enter description"
                multiline
                rows={3}
                value={createForm.customDescription}
                onChange={(e) =>
                  setCreateForm({
                    ...createForm,
                    customDescription: e.target.value,
                  })
                }
                required
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    '&:hover fieldset': {
                      borderColor: '#12422a',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#12422a',
                      borderWidth: 2,
                    },
                  },
                }}
              />
            </Grid>
            <Grid item size={4}>
              <Box sx={{ mb: 0.5 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#12422a',
                    fontWeight: 600,
                    mb: 0.75,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.75,
                  }}
                >
                  <FaQrcode style={{ fontSize: 16 }} />
                  Base Code <span style={{ color: '#f44336' }}>*</span>
                </Typography>
              </Box>
              <TextField
                fullWidth
                placeholder="e.g., SHOP20"
                value={createForm.baseCode}
                onChange={(e) =>
                  setCreateForm({ ...createForm, baseCode: e.target.value })
                }
                required
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaQrcode style={{ color: '#12422a', fontSize: 18 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    '&:hover fieldset': {
                      borderColor: '#12422a',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#12422a',
                      borderWidth: 2,
                    },
                  },
                }}
              />
            </Grid>

            {/* Row 2: Max Usage, Discount Percent, Reward Point Cost */}
            <Grid item size={4}>
              <Box sx={{ mb: 0.5 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#12422a',
                    fontWeight: 600,
                    mb: 0.75,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.75,
                  }}
                >
                  Voucher Quantity <span style={{ color: '#f44336' }}>*</span>
                </Typography>
              </Box>
              <TextField
                fullWidth
                placeholder="e.g., 100"
                type="number"
                value={createForm.maxUsage}
                onChange={(e) =>
                  setCreateForm({ ...createForm, maxUsage: e.target.value })
                }
                required
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    '&:hover fieldset': {
                      borderColor: '#12422a',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#12422a',
                      borderWidth: 2,
                    },
                  },
                }}
              />
            </Grid>
            <Grid item size={4}>
              <Box sx={{ mb: 0.5 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#12422a',
                    fontWeight: 600,
                    mb: 0.75,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.75,
                  }}
                >
                  Discount Percent (%) <span style={{ color: '#f44336' }}>*</span>
                </Typography>
              </Box>
              <TextField
                fullWidth
                placeholder="e.g., 20"
                type="number"
                value={createForm.discountPercent}
                onChange={(e) =>
                  setCreateForm({
                    ...createForm,
                    discountPercent: e.target.value,
                  })
                }
                required
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography sx={{ color: '#12422a', fontWeight: 600 }}>%</Typography>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    '&:hover fieldset': {
                      borderColor: '#12422a',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#12422a',
                      borderWidth: 2,
                    },
                  },
                }}
              />
            </Grid>
            <Grid item size={4}>
              <Box sx={{ mb: 0.5 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#12422a',
                    fontWeight: 600,
                    mb: 0.75,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.75,
                  }}
                >
                  Reward Point Cost <span style={{ color: '#f44336' }}>*</span>
                </Typography>
              </Box>
              <TextField
                fullWidth
                placeholder="e.g., 150"
                type="number"
                value={createForm.rewardPointCost}
                onChange={(e) =>
                  setCreateForm({
                    ...createForm,
                    rewardPointCost: e.target.value,
                  })
                }
                required
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    '&:hover fieldset': {
                      borderColor: '#12422a',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#12422a',
                      borderWidth: 2,
                    },
                  },
                }}
              />
            </Grid>

            {/* Row 3: Start Date, End Date, Publish */}
            <Grid item size={4}>
              <Box sx={{ mb: 0.5 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#12422a',
                    fontWeight: 600,
                    mb: 0.75,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.75,
                  }}
                >
                  Start Date <span style={{ color: '#f44336' }}>*</span>
                </Typography>
              </Box>
              <TextField
                fullWidth
                type="date"
                value={createForm.startDate}
                onChange={(e) =>
                  setCreateForm({ ...createForm, startDate: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
                inputProps={{
                  min: new Date().toISOString().split('T')[0], // Set min date to today
                }}
                required
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    '&:hover fieldset': {
                      borderColor: '#12422a',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#12422a',
                      borderWidth: 2,
                    },
                  },
                }}
              />
            </Grid>
            <Grid item size={4}>
              <Box sx={{ mb: 0.5 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#12422a',
                    fontWeight: 600,
                    mb: 0.75,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.75,
                  }}
                >
                  End Date <span style={{ color: '#f44336' }}>*</span>
                </Typography>
              </Box>
              <TextField
                fullWidth
                type="date"
                value={createForm.endDate}
                onChange={(e) =>
                  setCreateForm({ ...createForm, endDate: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
                inputProps={{
                  min: createForm.startDate || new Date().toISOString().split('T')[0], // End date must be >= start date
                }}
                required
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    '&:hover fieldset': {
                      borderColor: '#12422a',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#12422a',
                      borderWidth: 2,
                    },
                  },
                }}
              />
            </Grid>
            <Grid item size={4}>
              <Box sx={{ mb: 0.5 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#12422a',
                    fontWeight: 600,
                    mb: 0.75,
                  }}
                >
                  Publish Now
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 1.5,
                  border: '1px solid #e5e7eb',
                  borderRadius: 2,
                  backgroundColor: 'white',
                }}
              >
                <Typography variant="body2" sx={{ color: '#666' }}>
                  {createForm.isPublished ? 'Published' : 'Unpublished'}
                </Typography>
                <Chip
                  label={createForm.isPublished ? 'Yes' : 'No'}
                  color={createForm.isPublished ? 'success' : 'default'}
                  onClick={() =>
                    setCreateForm({
                      ...createForm,
                      isPublished: !createForm.isPublished,
                    })
                  }
                  sx={{
                    cursor: 'pointer',
                    backgroundColor: createForm.isPublished ? '#d1fae5' : '#f3f4f6',
                    color: createForm.isPublished ? '#065f46' : '#374151',
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: createForm.isPublished ? '#a7f3d0' : '#e5e7eb',
                    },
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2.5, borderTop: '1px solid #e5e7eb' }}>
          <Button
            onClick={handleCloseCreateModal}
            variant="outlined"
            sx={{
              color: '#666',
              borderColor: '#d1d5db',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              '&:hover': {
                borderColor: '#9ca3af',
                backgroundColor: '#f9fafb',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateVoucher}
            variant="contained"
            disabled={isLoading}
            sx={{
              backgroundColor: '#12422a',
              color: 'white',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              boxShadow: '0 4px 12px rgba(18, 66, 42, 0.3)',
              '&:hover': {
                backgroundColor: '#0d2e1c',
                boxShadow: '0 6px 16px rgba(18, 66, 42, 0.4)',
              },
              '&:disabled': {
                backgroundColor: '#9ca3af',
              },
            }}
          >
            {isLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={16} sx={{ color: 'white' }} />
                Creating...
              </Box>
            ) : (
              'Create Voucher'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Voucher Modal */}
      <Dialog
        open={editModalOpen}
        onClose={handleCloseEditModal}
        maxWidth="md"
        fullWidth
        TransitionProps={{
          timeout: 400,
        }}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 12px 40px rgba(18, 66, 42, 0.2)',
            overflow: 'hidden',
          },
        }}
      >
        <DialogTitle className="voucher-dialog-title">
          <Box className="voucher-dialog-header">
            <Box className="voucher-dialog-header-left">
              <Box className="voucher-dialog-title-section">
                <FaEdit className="voucher-dialog-icon" />
                <Box>
                  <Typography variant="h6" component="div" className="voucher-dialog-title-text">
                    Edit Voucher
                  </Typography>
                  <Typography variant="body2" className="voucher-dialog-subtitle">
                    Update your voucher details
                  </Typography>
                </Box>
              </Box>
            </Box>
            <IconButton
              onClick={handleCloseEditModal}
              size="small"
              className="voucher-dialog-close-btn"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent className="voucher-dialog-content">
          {/* Notice about editing unpublished vouchers */}
          {selectedVoucher && (
            <Box
              sx={{
                mb: 2,
                p: 1.5,
                backgroundColor: selectedVoucher.isPublished 
                  ? 'rgba(239, 68, 68, 0.1)' 
                  : 'rgba(59, 130, 246, 0.1)',
                borderRadius: 2,
                border: `1px solid ${selectedVoucher.isPublished 
                  ? 'rgba(239, 68, 68, 0.3)' 
                  : 'rgba(59, 130, 246, 0.3)'}`,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: selectedVoucher.isPublished ? '#dc2626' : '#2563eb',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                {selectedVoucher.isPublished ? (
                  <>
                    <span>⚠️</span>
                    <span>Can only update voucher in Unpublished (unpublished) state. This voucher is in Published (published) state so cannot be edited.</span>
                  </>
                ) : (
                  <>
                    <span>ℹ️</span>
                    <span>You can only update voucher in Unpublished (unpublished) state.</span>
                  </>
                )}
              </Typography>
            </Box>
          )}
          <Grid container spacing={2}>
            {/* Row 1: Voucher Name, Description */}
            <Grid item size={4}>
              <Box sx={{ mb: 0.5 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#12422a',
                    fontWeight: 600,
                    mb: 0.75,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.75,
                  }}
                >
                  <FaGift style={{ fontSize: 16 }} />
                  Voucher Name <span style={{ color: '#f44336' }}>*</span>
                </Typography>
              </Box>
              <TextField
                fullWidth
                placeholder="Enter voucher name"
                value={editForm.customName}
                onChange={(e) =>
                  setEditForm({ ...editForm, customName: e.target.value })
                }
                required
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaGift style={{ color: '#12422a', fontSize: 18 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    '&:hover fieldset': {
                      borderColor: '#12422a',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#12422a',
                      borderWidth: 2,
                    },
                  },
                }}
              />
            </Grid>
            <Grid item size={4}>
              <Box sx={{ mb: 0.5 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#12422a',
                    fontWeight: 600,
                    mb: 0.75,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.75,
                  }}
                >
                  Description <span style={{ color: '#f44336' }}>*</span>
                </Typography>
              </Box>
              <TextField
                fullWidth
                placeholder="Enter description"
                multiline
                rows={3}
                value={editForm.customDescription}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    customDescription: e.target.value,
                  })
                }
                required
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    '&:hover fieldset': {
                      borderColor: '#12422a',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#12422a',
                      borderWidth: 2,
                    },
                  },
                }}
              />
            </Grid>

            {/* Row 2: Discount Percent, Reward Point Cost */}
            <Grid item size={4}>
              <Box sx={{ mb: 0.5 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#12422a',
                    fontWeight: 600,
                    mb: 0.75,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.75,
                  }}
                >
                  Discount Percent (%) <span style={{ color: '#f44336' }}>*</span>
                </Typography>
              </Box>
              <TextField
                fullWidth
                placeholder="e.g., 20"
                type="number"
                value={editForm.discountPercent}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    discountPercent: e.target.value,
                  })
                }
                required
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography sx={{ color: '#12422a', fontWeight: 600 }}>%</Typography>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    '&:hover fieldset': {
                      borderColor: '#12422a',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#12422a',
                      borderWidth: 2,
                    },
                  },
                }}
              />
            </Grid>
            <Grid item size={3}>
              <Box sx={{ mb: 0.5 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#12422a',
                    fontWeight: 600,
                    mb: 0.75,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.75,
                  }}
                >
                  Reward Point Cost <span style={{ color: '#f44336' }}>*</span>
                </Typography>
              </Box>
              <TextField
                fullWidth
                placeholder="e.g., 150"
                type="number"
                value={editForm.rewardPointCost}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    rewardPointCost: e.target.value,
                  })
                }
                required
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    '&:hover fieldset': {
                      borderColor: '#12422a',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#12422a',
                      borderWidth: 2,
                    },
                  },
                }}
              />
            </Grid>

            {/* Row 3: Start Date, End Date, Publish */}
            <Grid item size={3}>
              <Box sx={{ mb: 0.5 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#12422a',
                    fontWeight: 600,
                    mb: 0.75,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.75,
                  }}
                >
                  Start Date <span style={{ color: '#f44336' }}>*</span>
                </Typography>
              </Box>
              <TextField
                fullWidth
                type="date"
                value={editForm.startDate}
                onChange={(e) =>
                  setEditForm({ ...editForm, startDate: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
                inputProps={{
                  min: new Date().toISOString().split('T')[0], // Set min date to today
                }}
                required
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    '&:hover fieldset': {
                      borderColor: '#12422a',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#12422a',
                      borderWidth: 2,
                    },
                  },
                }}
              />
            </Grid>
            <Grid item size={3}>
              <Box sx={{ mb: 0.5 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#12422a',
                    fontWeight: 600,
                    mb: 0.75,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.75,
                  }}
                >
                  End Date <span style={{ color: '#f44336' }}>*</span>
                </Typography>
              </Box>
              <TextField
                fullWidth
                type="date"
                value={editForm.endDate}
                onChange={(e) =>
                  setEditForm({ ...editForm, endDate: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
                inputProps={{
                  min: editForm.startDate || new Date().toISOString().split('T')[0], // End date must be >= start date
                }}
                required
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    '&:hover fieldset': {
                      borderColor: '#12422a',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#12422a',
                      borderWidth: 2,
                    },
                  },
                }}
              />
            </Grid>
            <Grid item size={3}>
              <Box sx={{ mb: 0.5 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#12422a',
                    fontWeight: 600,
                    mb: 0.75,
                  }}
                >
                  Publish Status
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 1.5,
                  border: '1px solid #e5e7eb',
                  borderRadius: 2,
                  backgroundColor: 'white',
                }}
              >
                <Typography variant="body2" sx={{ color: '#666' }}>
                  {editForm.isPublished ? 'Published' : 'Unpublished'}
                </Typography>
                <Chip
                  label={editForm.isPublished ? 'Yes' : 'No'}
                  color={editForm.isPublished ? 'success' : 'default'}
                  onClick={() =>
                    setEditForm({
                      ...editForm,
                      isPublished: !editForm.isPublished,
                    })
                  }
                  sx={{
                    cursor: 'pointer',
                    backgroundColor: editForm.isPublished ? '#d1fae5' : '#f3f4f6',
                    color: editForm.isPublished ? '#065f46' : '#374151',
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: editForm.isPublished ? '#a7f3d0' : '#e5e7eb',
                    },
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2.5, borderTop: '1px solid #e5e7eb' }}>
          <Button
            onClick={handleCloseEditModal}
            variant="outlined"
            sx={{
              color: '#666',
              borderColor: '#d1d5db',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              '&:hover': {
                borderColor: '#9ca3af',
                backgroundColor: '#f9fafb',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleEditVoucher}
            variant="contained"
            disabled={isLoading || (selectedVoucher && selectedVoucher.isPublished)}
            sx={{
              backgroundColor: '#12422a',
              color: 'white',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              boxShadow: '0 4px 12px rgba(18, 66, 42, 0.3)',
              '&:hover': {
                backgroundColor: '#0d2e1c',
                boxShadow: '0 6px 16px rgba(18, 66, 42, 0.4)',
              },
              '&:disabled': {
                backgroundColor: '#9ca3af',
              },
            }}
          >
            {isLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={16} sx={{ color: 'white' }} />
                Updating...
              </Box>
            ) : (
              'Update Voucher'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Detail Modal with QR Code */}
      <Dialog
        open={detailModalOpen}
        onClose={handleCloseDetailModal}
        maxWidth="sm"
        fullWidth
        TransitionProps={{
          timeout: 400,
        }}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 12px 40px rgba(18, 66, 42, 0.2)',
            overflow: 'hidden',
          },
        }}
      >
        <DialogTitle className="voucher-dialog-title">
          <Box className="voucher-dialog-header">
            <Box className="voucher-dialog-header-left">
              <Box className="voucher-dialog-title-section">
                <FaQrcode className="voucher-dialog-icon" />
                <Box>
                  <Typography variant="h6" component="div" className="voucher-dialog-title-text">
                    Voucher Details
                  </Typography>
                  <Typography variant="body2" className="voucher-dialog-subtitle">
                    View voucher information and QR code
                  </Typography>
                </Box>
              </Box>
            </Box>
            <IconButton
              onClick={handleCloseDetailModal}
              size="small"
              className="voucher-dialog-close-btn"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent className="voucher-dialog-content" sx={{ pt: 3 }}>
        {detailVoucher && (
            <Box>
              {/* QR Code Section */}
            {detailVoucherCodes.length > 0 && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mb: 4,
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    QR Code
                  </Typography>
                  <Paper
                    sx={{
                      p: 2,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: '#f9fafb',
                    }}
                  >
                    <img
                      src={
                        detailVoucherCodes[0]?.qrCode ||
                        generateQRCode(
                          detailVoucherCodes[0]?.fullCode || detailVoucherCodes[0]
                        )
                      }
                      alt="QR Code"
                      style={{
                        width: '250px',
                        height: '250px',
                        objectFit: 'contain',
                      }}
                    />
                  </Paper>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 2, fontFamily: 'monospace', fontWeight: 600 }}
                  >
                  {detailVoucherCodes[0]?.fullCode ||
                    detailVoucherCodes[0]?.code ||
                    'N/A'}
                  </Typography>
                </Box>
              )}

              <Divider sx={{ my: 3 }} />

              {/* Voucher Information */}
              <Typography variant="h6" gutterBottom>
                Voucher Information
              </Typography>
              <Box className="voucher-detail-info">
                <Box className="voucher-info-item">
                  <Typography variant="caption" color="text.secondary">
                    Voucher Name:
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {detailVoucher.customName || 'N/A'}
                  </Typography>
                </Box>
                <Box className="voucher-info-item">
                  <Typography variant="caption" color="text.secondary">
                    Description:
                  </Typography>
                  <Typography variant="body1">
                    {detailVoucher.customDescription || 'N/A'}
                  </Typography>
                </Box>
                <Box className="voucher-info-item">
                  <Typography variant="caption" color="text.secondary">
                    Discount:
                  </Typography>
                  <Typography variant="body1" fontWeight={600} color="#12422a">
                    {detailVoucher.discountPercent || 0}%
                  </Typography>
                </Box>
                <Box className="voucher-info-item">
                  <Typography variant="caption" color="text.secondary">
                    Reward Point Cost:
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {detailVoucher.rewardPointCost || 0} points
                  </Typography>
                </Box>
                <Box className="voucher-info-item">
                  <Typography variant="caption" color="text.secondary">
                    Base Code:
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {detailVoucher.baseCode || 'N/A'}
                  </Typography>
                </Box>
                <Box className="voucher-info-item">
                  <Typography variant="caption" color="text.secondary">
                    Voucher Type:
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {detailVoucher.voucherType || 'business'}
                  </Typography>
                </Box>
                <Box className="voucher-info-item">
                  <Typography variant="caption" color="text.secondary">
                    Quantity (Redeemed / Max):
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {(detailVoucher.redeemedCount ?? 0)} / {(detailVoucher.maxUsage ?? 0)}
                  </Typography>
                </Box>
                <Box className="voucher-info-item">
                  <Typography variant="caption" color="text.secondary">
                    Start Date:
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {formatDate(detailVoucher.startDate)}
                  </Typography>
                </Box>
                <Box className="voucher-info-item">
                  <Typography variant="caption" color="text.secondary">
                    End Date:
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {formatDate(detailVoucher.endDate)}
                  </Typography>
                </Box>
                <Box className="voucher-info-item">
                  <Typography variant="caption" color="text.secondary">
                    Publish Status:
                  </Typography>
                  <Chip
                    label={
                      detailVoucher.isPublished ? 'Published' : 'Unpublished'
                    }
                    size="small"
                    sx={{
                      backgroundColor: detailVoucher.isPublished
                        ? '#d1fae5'
                        : '#fef3c7',
                      color: detailVoucher.isPublished ? '#065f46' : '#92400e',
                      fontWeight: 600,
                    }}
                  />
                </Box>
                <Box className="voucher-info-item">
                  <Typography variant="caption" color="text.secondary">
                    Business Status:
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {detailVoucher.status
                      ? detailVoucher.status.charAt(0).toUpperCase() +
                        detailVoucher.status.slice(1)
                      : 'N/A'}
                  </Typography>
                </Box>
                {detailStats && (
                  <Box className="voucher-info-item">
                    <Typography variant="caption" color="text.secondary">
                      Usage Statistics:
                    </Typography>
                    <Typography variant="body2">
                      Total codes: <strong>{detailStats.total}</strong> | Used:{' '}
                      <strong>{detailStats.used}</strong> | Redeemed:{' '}
                      <strong>{detailStats.redeemed}</strong> | Expired:{' '}
                      <strong>{detailStats.expired}</strong>
                    </Typography>
                  </Box>
                )}
                {detailVoucherCodes.length > 0 && (
                  <Box className="voucher-info-item">
                    <Typography variant="caption" color="text.secondary">
                      Total Codes:
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {detailVoucherCodes.length} codes
                    </Typography>
                  </Box>
                )}
                {detailVoucherCodes.length > 0 && (
                  <Box className="voucher-info-item">
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
                      Voucher Codes & Customers:
                    </Typography>
                    <Box sx={{ maxHeight: 260, overflowY: 'auto' }}>
                      <Table size="small" stickyHeader>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 700 }}>Code</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Customer</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Phone</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Used At</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Redeemed At</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {detailVoucherCodes.map((code) => {
                            const redeemedUser = code.redeemedBy?.userId || code.redeemedBy;
                            return (
                              <TableRow key={code._id}>
                                <TableCell>
                                  <Typography
                                    variant="body2"
                                    sx={{ fontFamily: 'monospace', fontWeight: 600 }}
                                  >
                                    {code.fullCode || code.code || 'N/A'}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Chip
                                    label={
                                      code.status
                                        ? code.status.charAt(0).toUpperCase() +
                                          code.status.slice(1)
                                        : 'N/A'
                                    }
                                    size="small"
                                    sx={{ fontSize: 11, fontWeight: 600 }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2" fontWeight={600}>
                                    {redeemedUser?.fullName || code.redeemedBy?.fullName || 'N/A'}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {code.redeemedBy?.address || ''}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2">
                                    {code.redeemedBy?.phone || 'N/A'}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2">
                                    {code.usedAt ? formatDate(code.usedAt) : 'N/A'}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2">
                                    {code.redeemedAt ? formatDate(code.redeemedAt) : 'N/A'}
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </Box>
                  </Box>
                )}
              </Box>

              {/* Edit Button */}
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  startIcon={<FaEdit />}
                  onClick={() => handleOpenEditModal(selectedVoucher)}
                  sx={{
                    backgroundColor: '#12422a',
                    color: 'white',
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 3,
                    boxShadow: '0 4px 12px rgba(18, 66, 42, 0.3)',
                    '&:hover': {
                      backgroundColor: '#0d2e1c',
                      boxShadow: '0 6px 16px rgba(18, 66, 42, 0.4)',
                    },
                  }}
                >
                  Edit Voucher
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2.5, borderTop: '1px solid #e5e7eb' }}>
          <Button
            onClick={handleCloseDetailModal}
            variant="contained"
            sx={{
              backgroundColor: '#12422a',
              color: 'white',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              boxShadow: '0 4px 12px rgba(18, 66, 42, 0.3)',
              '&:hover': {
                backgroundColor: '#0d2e1c',
                boxShadow: '0 6px 16px rgba(18, 66, 42, 0.4)',
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

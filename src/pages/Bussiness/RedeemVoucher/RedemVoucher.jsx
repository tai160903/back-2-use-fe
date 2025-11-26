import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getBusinessVouchers,
  getMyBusinessVouchers,
  claimBusinessVoucher,
  setupBusinessVoucher,
  updateBusinessVoucher,
  getBusinessVoucherDetail
} from '../../../store/slices/voucherSlice';
import { 
  FaGift, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaCopy,
  FaSpinner,
  FaEdit,
  FaRocket,
  FaInfoCircle
} from 'react-icons/fa';
import { MdRedeem, MdSettings, MdPublish } from 'react-icons/md';
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
  Tabs,
  Tab,
  CircularProgress,
  Switch,
  FormControlLabel,
  Tooltip,
  Divider,
  IconButton,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { Pagination, Stack } from '@mui/material';
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
    year: 'numeric'
  });
};

export default function RedemVoucher() {
  const dispatch = useDispatch();
  const { 
    businessVouchers,
    businessVoucherPagination,
    myBusinessVouchers,
    myBusinessVoucherPagination,
    isLoading 
  } = useSelector(state => state.vouchers);

  // State for setup vouchers section
  const [setupVouchers, setSetupVouchers] = useState([]);
  const [setupVouchersPage, setSetupVouchersPage] = useState(1);
  const [setupVouchersStatus, setSetupVouchersStatus] = useState(undefined); // Filter by status
  const [setupVouchersIsPublished, setSetupVouchersIsPublished] = useState(undefined); // Filter by isPublished
  
  // State to store ALL claimed vouchers (for checking if voucher is claimed)
  // This is separate from myBusinessVouchers to avoid being overwritten by filters
  const [allClaimedVouchers, setAllClaimedVouchers] = useState([]);

  // Tab state
  const [activeTab, setActiveTab] = useState(0); // 0: Available to Claim, 1: My Claimed Vouchers
  
  // Filter states
  const [tierLabel, setTierLabel] = useState('');
  const [minThreshold, setMinThreshold] = useState('');
  const [myVouchersStatus, setMyVouchersStatus] = useState('claimed');
  const [isPublished, setIsPublished] = useState(null);
  
  // Pagination
  const [availablePage, setAvailablePage] = useState(1);
  const [myVouchersPage, setMyVouchersPage] = useState(1);
  const itemsPerPage = 10;

  // Modal states
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [setupModalOpen, setSetupModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [voucherDetail, setVoucherDetail] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Setup form state
  const [setupForm, setSetupForm] = useState({
    discountPercent: '',
    rewardPointCost: '',
    startDate: '',
    endDate: '',
    isPublished: false
  });

  // Load available vouchers (isDisabled = false)
  useEffect(() => {
    if (activeTab === 0) {
      dispatch(getBusinessVouchers({
        tierLabel: tierLabel || undefined,
        minThreshold: minThreshold ? Number(minThreshold) : undefined,
        page: availablePage,
        limit: itemsPerPage,
      }));
    }
  }, [dispatch, activeTab, tierLabel, minThreshold, availablePage]);

  // Load my claimed vouchers - Load ngay từ đầu để hiển thị số lượng trong tab
  useEffect(() => {
    dispatch(getMyBusinessVouchers({
      status: myVouchersStatus,
      isPublished: isPublished !== null ? isPublished : undefined,
      page: myVouchersPage,
      limit: itemsPerPage,
    }));
  }, [dispatch, myVouchersStatus, isPublished, myVouchersPage]);

  // Load ALL claimed vouchers (without filter) to check if vouchers are already claimed
  // This is needed to properly check if a voucher in "Available to Claim" has been claimed
  // Load this ALWAYS, not just when activeTab === 0, to ensure data is available
  useEffect(() => {
    // Load all claimed vouchers to check against available vouchers
    const loadAllClaimed = async () => {
      try {
        const result = await dispatch(getMyBusinessVouchers({
          status: undefined, // Load all statuses
          isPublished: undefined, // Load all published states
          page: 1,
          limit: 100, // Load enough to check all claimed vouchers
        })).unwrap();
        
        // Store in separate state to avoid being overwritten
        const claimedList = result?.data || result || [];
        const finalList = Array.isArray(claimedList) ? claimedList : [];
        setAllClaimedVouchers(finalList);
      } catch (error) {
        console.error('[All Claimed Vouchers] Error loading:', error);
        setAllClaimedVouchers([]);
      }
    };
    
    loadAllClaimed();
  }, [dispatch]);

  // Get voucher status helper function
  const getVoucherStatus = (voucher) => {
    if (voucher.isPublished) return 'published';
    if (voucher.discountPercent && voucher.rewardPointCost && voucher.startDate && voucher.endDate) {
      return 'setup';
    }
    return 'claimed';
  };

  // Load setup vouchers for separate section
  const loadSetupVouchers = async () => {
    try {
      const result = await dispatch(getMyBusinessVouchers({
        status: setupVouchersStatus, // Filter by status if set
        isPublished: setupVouchersIsPublished !== undefined ? setupVouchersIsPublished : undefined, // Filter by isPublished if set
        page: setupVouchersPage,
        limit: 100,
      })).unwrap();
      
      if (result?.data) {
        // Filter only vouchers that are setup or published
        const setup = result.data.filter(v => {
          const status = getVoucherStatus(v);
          return status === 'setup' || status === 'published';
        });
        setSetupVouchers(setup);
      }
    } catch (error) {
      console.error('Failed to load setup vouchers:', error);
    }
  };

  // Load setup vouchers on mount and when filters change
  useEffect(() => {
    loadSetupVouchers();
  }, [setupVouchersStatus, setupVouchersIsPublished, setupVouchersPage]);

  // Get list of voucher IDs that have already been claimed by this business
  // This must be defined BEFORE availableToClaim since availableToClaim uses it
  // Use allClaimedVouchers instead of myBusinessVouchers to avoid filter conflicts
  const claimedVoucherIds = useMemo(() => {
    // Use allClaimedVouchers state which contains ALL claimed vouchers
    const vouchersToCheck = allClaimedVouchers.length > 0 ? allClaimedVouchers : (myBusinessVouchers || []);
    
    if (!vouchersToCheck || !Array.isArray(vouchersToCheck) || vouchersToCheck.length === 0) {
      return new Set();
    }
    
    // Extract voucher template IDs from claimed vouchers
    // Structure can be: { voucher: { _id: templateId }, ... } or { voucherId: templateId, ... }
    const ids = vouchersToCheck
      .map((v, index) => {
        // Try multiple possible locations for the voucher template ID
        // Priority: voucher._id > voucher.id > voucherId > voucherTemplateId > voucher (if it's a string/ID)
        let templateId = null;
        let extractedFrom = 'unknown';
        
        // Check nested voucher object first
        if (v.voucher) {
          if (v.voucher._id) {
            templateId = v.voucher._id;
            extractedFrom = 'v.voucher._id';
          } else if (v.voucher.id) {
            templateId = v.voucher.id;
            extractedFrom = 'v.voucher.id';
          } else if (typeof v.voucher === 'string') {
            // If voucher is a string ID directly
            templateId = v.voucher;
            extractedFrom = 'v.voucher (string)';
          } else if (v.voucher.toString && typeof v.voucher.toString === 'function') {
            // Try toString if it's an object
            const str = v.voucher.toString();
            if (str && str.length > 10) {
              templateId = str;
              extractedFrom = 'v.voucher.toString()';
            }
          }
        }
        
        // Check direct fields
        if (!templateId) {
          if (v.voucherId) {
            templateId = v.voucherId;
            extractedFrom = 'v.voucherId';
          } else if (v.voucherTemplateId) {
            templateId = v.voucherTemplateId;
            extractedFrom = 'v.voucherTemplateId';
          } else if (v.templateId) {
            templateId = v.templateId;
            extractedFrom = 'v.templateId';
          } else if (v.voucher && typeof v.voucher === 'string') {
            templateId = v.voucher;
            extractedFrom = 'v.voucher (direct string)';
          }
        }
        
        // If still no ID, check all keys that might contain ID
        // BUT: Skip v._id and v.id as they are likely business voucher IDs, not template IDs
        if (!templateId && v) {
          const allKeys = Object.keys(v);
          const keysToSkip = ['_id', 'id', '__v', 'createdAt', 'updatedAt', 'businessId', 'business', 'customName', 'customDescription', 'discountPercent', 'rewardPointCost', 'startDate', 'endDate', 'isPublished', 'status'];
          
          // Look for keys that might contain template ID
          for (const key of allKeys) {
            // Skip common business voucher fields
            if (keysToSkip.includes(key)) continue;
            
            const value = v[key];
            
            // Skip if it's the business voucher ID itself
            if ((key === '_id' || key === 'id') && value === v._id) continue;
            
            // Check if value looks like an ID (string with length > 10)
            if (typeof value === 'string' && value.length > 10 && /^[a-f0-9]{24}$/i.test(value)) {
              // Looks like MongoDB ObjectId - but need to verify it's not the business voucher ID
              // Only use if it's different from v._id
              if (value !== String(v._id || v.id || '')) {
                templateId = value;
                extractedFrom = `v.${key}`;
                break;
              }
            } else if (value && typeof value === 'object' && value._id) {
              // Nested object with _id
              const nestedId = String(value._id);
              // Only use if it's different from business voucher ID
              if (nestedId !== String(v._id || v.id || '')) {
                templateId = nestedId;
                extractedFrom = `v.${key}._id`;
                break;
              }
            }
          }
        }
        
        const idString = templateId ? String(templateId).trim() : null;
        
        return idString;
      })
      .filter(Boolean);
    
    return new Set(ids);
  }, [allClaimedVouchers, myBusinessVouchers]);

  // Filter available vouchers (only show isDisabled = false)
  // Also filter out vouchers that have already been claimed by this business
  const availableToClaim = useMemo(() => {
    if (!businessVouchers || !Array.isArray(businessVouchers)) {
      return [];
    }
    
    // First filter by isDisabled
    let filtered = businessVouchers.filter(v => !v.isDisabled);
    
    // Then filter out vouchers that have already been claimed
    // businessVouchers structure: { _id: templateId, name, ... }
    filtered = filtered.filter(voucher => {
      // Get the template ID from business voucher
      const voucherTemplateId = String(voucher._id || voucher.id || '').trim();
      
      if (!voucherTemplateId || voucherTemplateId === 'undefined' || voucherTemplateId === 'null' || voucherTemplateId === '') {
        // If no valid ID, keep it (might be a new voucher)
        return true;
      }
      
      // Check if this template ID exists in claimed vouchers
      // Try both exact match and string comparison
      const isClaimed = claimedVoucherIds.has(voucherTemplateId);
      
      // Also check if any claimed ID matches (case-insensitive, trimmed)
      let isClaimedAlternative = false;
      if (!isClaimed && claimedVoucherIds.size > 0) {
        const normalizedVoucherId = voucherTemplateId.toLowerCase().trim();
        for (const claimedId of claimedVoucherIds) {
          const normalizedClaimedId = String(claimedId).toLowerCase().trim();
          if (normalizedVoucherId === normalizedClaimedId) {
            isClaimedAlternative = true;
            break;
          }
        }
      }
      
      const finalIsClaimed = isClaimed || isClaimedAlternative;
      
      // Return false if claimed (filter it out)
      return !finalIsClaimed;
    });

    return filtered;
  }, [businessVouchers, claimedVoucherIds, allClaimedVouchers]);

  // Get unique tier labels from available vouchers
  const availableTierLabels = useMemo(() => {
    if (!businessVouchers || !Array.isArray(businessVouchers)) {
      return [];
    }
    const labels = businessVouchers
      .map(v => v.tierLabel)
      .filter(Boolean)
      .filter((label, index, self) => self.indexOf(label) === index) // Remove duplicates
      .sort();
    return labels;
  }, [businessVouchers]);

  // Check if a voucher has already been claimed
  const isVoucherClaimed = (voucher) => {
    if (!voucher) return false;
    
    // Get the voucher template ID from the available voucher
    // businessVouchers structure: { _id: templateId, name, ... }
    const voucherId = String(voucher._id || voucher.id || '');
    if (!voucherId || voucherId === 'undefined' || voucherId === 'null') {
      return false;
    }
    
    // Check if this ID exists in claimed vouchers
    const isClaimed = claimedVoucherIds.has(voucherId);
    
    return isClaimed;
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setAvailablePage(1);
    setMyVouchersPage(1);
  };

  // Handle claim voucher
  const handleOpenClaimModal = (voucher) => {
    if (!voucher) return;
    
    // CRITICAL: Double check if voucher is already claimed before opening modal
    // This is a safety check - button should already be disabled
    const voucherTemplateId = String(voucher._id || voucher.id || '');
    const isClaimed = voucherTemplateId && claimedVoucherIds.has(voucherTemplateId);
    
    if (isClaimed) {
      toast.error('Voucher này đã được claim rồi');
      return;
    }
    
    setSelectedVoucher(voucher);
    setClaimModalOpen(true);
  };

  const handleCloseClaimModal = () => {
    setClaimModalOpen(false);
    setSelectedVoucher(null);
  };

  const handleClaimVoucher = async () => {
    if (!selectedVoucher) return;

    const voucherId = selectedVoucher._id || selectedVoucher.id;
    if (!voucherId) {
      toast.error('Không tìm thấy voucher ID');
      return;
    }

    try {
      await dispatch(claimBusinessVoucher({
        voucherId,
        data: {
          customName: selectedVoucher.name || '',
          customDescription: selectedVoucher.description || ''
        }
      })).unwrap();
      
      handleCloseClaimModal();
      
      // CRITICAL: Refresh ALL claimed vouchers first to update claimedVoucherIds
      // This must be done before refreshing businessVouchers
      const claimedResult = await dispatch(getMyBusinessVouchers({
        status: undefined, // Load all statuses
        isPublished: undefined, // Load all published states
        page: 1,
        limit: 100, // Load enough to check all claimed vouchers
      })).unwrap();
      
      // Update allClaimedVouchers state
      const claimedList = claimedResult?.data || claimedResult || [];
      setAllClaimedVouchers(Array.isArray(claimedList) ? claimedList : []);
      
      // Then refresh available vouchers list
      dispatch(getBusinessVouchers({
        tierLabel: tierLabel || undefined,
        minThreshold: minThreshold ? Number(minThreshold) : undefined,
        page: availablePage,
        limit: itemsPerPage,
      }));
      
      // Also refresh my vouchers list for the "My Claimed Vouchers" tab
      dispatch(getMyBusinessVouchers({
        status: myVouchersStatus,
        isPublished: isPublished !== null ? isPublished : undefined,
        page: myVouchersPage,
        limit: itemsPerPage,
      }));
    } catch (error) {
      // Error handled by thunk
    }
  };

  // Handle setup voucher
  const handleOpenSetupModal = (voucher, editMode = false) => {
    setSelectedVoucher(voucher);
    setIsEditMode(editMode);
    setSetupForm({
      discountPercent: voucher.discountPercent || '',
      rewardPointCost: voucher.rewardPointCost || '',
      startDate: voucher.startDate ? new Date(voucher.startDate).toISOString().split('T')[0] : '',
      endDate: voucher.endDate ? new Date(voucher.endDate).toISOString().split('T')[0] : '',
      isPublished: voucher.isPublished || false
    });
    setSetupModalOpen(true);
  };

  const handleCloseSetupModal = () => {
    setSetupModalOpen(false);
    setSelectedVoucher(null);
    setIsEditMode(false);
    setSetupForm({
      discountPercent: '',
      rewardPointCost: '',
      startDate: '',
      endDate: '',
      isPublished: false
    });
  };

  // Handle view voucher details
  const handleViewDetails = async (voucher) => {
    const businessVoucherId = voucher._id || voucher.id;
    if (!businessVoucherId) {
      toast.error('Voucher ID not found');
      return;
    }

    try {
      setDetailModalOpen(true);
      // Load voucher detail using the detail API
      const detailResult = await dispatch(getBusinessVoucherDetail({
        businessVoucherId,
        page: 1,
        limit: 100
      })).unwrap();
      
      // Use voucher data from current voucher object and combine with detail
      setVoucherDetail({
        ...voucher, // Use existing voucher data
        codes: detailResult.data || detailResult.codes || []
      });
    } catch (error) {
      console.error('Failed to load voucher details:', error);
      toast.error(error?.response?.data?.message || 'Failed to load voucher details');
      setDetailModalOpen(false);
    }
  };

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setVoucherDetail(null);
  };

  const handleSetupVoucher = async () => {
    if (!selectedVoucher) return;

    const businessVoucherId = selectedVoucher._id || selectedVoucher.id;
    if (!businessVoucherId) {
      toast.error('Không tìm thấy business voucher ID');
      return;
    }

    // Validate form
    if (!setupForm.discountPercent || !setupForm.rewardPointCost || !setupForm.startDate || !setupForm.endDate) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    // Helper function to convert date string to ISO string without timezone issues
    const convertDateToISO = (dateString) => {
      if (!dateString) return '';
      // If dateString is already in YYYY-MM-DD format, append time to avoid timezone shift
      // Create date at midnight UTC to preserve the selected date
      const date = new Date(dateString + 'T00:00:00.000Z');
      return date.toISOString();
    };

    try {
      if (isEditMode) {
        // Edit mode: use updateBusinessVoucher
        await dispatch(updateBusinessVoucher({
          id: businessVoucherId,
          data: {
            discountPercent: Number(setupForm.discountPercent),
            rewardPointCost: Number(setupForm.rewardPointCost),
            startDate: convertDateToISO(setupForm.startDate),
            endDate: convertDateToISO(setupForm.endDate),
            isPublished: setupForm.isPublished
          }
        })).unwrap();
      } else {
        // Setup mode: use setupBusinessVoucher
        await dispatch(setupBusinessVoucher({
          id: businessVoucherId,
          data: {
            discountPercent: Number(setupForm.discountPercent),
            rewardPointCost: Number(setupForm.rewardPointCost),
            startDate: convertDateToISO(setupForm.startDate),
            endDate: convertDateToISO(setupForm.endDate),
            isPublished: setupForm.isPublished // Use value from form
          }
        })).unwrap();
      }
      
      handleCloseSetupModal();
      // Refresh my vouchers
      dispatch(getMyBusinessVouchers({
        status: myVouchersStatus,
        isPublished: isPublished !== null ? isPublished : undefined,
        page: myVouchersPage,
        limit: itemsPerPage,
      }));
      // Refresh setup vouchers
      loadSetupVouchers();
    } catch (error) {
      // Error handled by thunk
    }
  };

  // Handle publish voucher
  const handlePublishVoucher = async (voucher) => {
    const businessVoucherId = voucher._id || voucher.id;
    if (!businessVoucherId) {
      toast.error('Không tìm thấy business voucher ID');
      return;
    }

    // Check if voucher is setup
    if (!voucher.discountPercent || !voucher.rewardPointCost || !voucher.startDate || !voucher.endDate) {
      toast.error('Vui lòng setup voucher trước khi publish');
      return;
    }

    try {
      await dispatch(updateBusinessVoucher({
        id: businessVoucherId,
        data: {
          isPublished: true
        }
      })).unwrap();
      
      // Refresh my vouchers
      dispatch(getMyBusinessVouchers({
        status: myVouchersStatus,
        isPublished: isPublished !== null ? isPublished : undefined,
        page: myVouchersPage,
        limit: itemsPerPage,
      }));
      // Refresh setup vouchers
      loadSetupVouchers();
    } catch (error) {
      // Error handled by thunk
    }
  };


  return (
    <div className="redeem-voucher-page">
      {/* Header */}
      <div className="redeem-header">
        <div className="redeem-title-section">
          <MdRedeem className="redeem-title-icon" />
          <div>
            <h1 className="redeem-title">Quản lý Voucher</h1>
            <p className="redeem-description">
              Claim, setup và publish voucher để customer có thể sử dụng
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          sx={{
            '& .MuiTab-root': {
              fontSize: '16px',
              fontWeight: 600,
              textTransform: 'none',
              color: '#6b7280',
            },
            '& .Mui-selected': {
              color: '#22c55e',
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#22c55e',
            }
          }}
        >
          <Tab label={`Voucher có thể Claim (${availableToClaim.length || 0})`} />
          <Tab label={`Voucher đã Claim (${myBusinessVoucherPagination?.total || myBusinessVouchers?.length || 0})`} />
        </Tabs>
      </Box>

      {/* Available to Claim Tab */}
      {activeTab === 0 && (
        <div className="vouchers-section">
          <div className="section-header">
        <h3 className="section-title">
          <FaGift className="section-icon" />
              Voucher có thể Claim
        </h3>
           
          </div>

          {/* Filters */}
          <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel 
                id="tier-label-select-label"
                sx={{
                  '&.Mui-focused': {
                    color: '#22c55e',
                  },
                }}
              >
                Tier Label
              </InputLabel>
              <Select
                labelId="tier-label-select-label"
                id="tier-label-select"
                value={tierLabel}
                label="Tier Label"
                onChange={(e) => {
                  setTierLabel(e.target.value);
                  setAvailablePage(1);
                }}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#d1d5db',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#22c55e',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#22c55e',
                  },
                }}
              >
                <MenuItem value="">
                  <em>All Tiers</em>
                </MenuItem>
                {availableTierLabels.map((label) => (
                  <MenuItem key={label} value={label}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {/* <TextField
              label="Min Threshold"
              type="number"
              size="small"
              value={minThreshold}
              onChange={(e) => {
                setMinThreshold(e.target.value);
                setAvailablePage(1);
              }}
              placeholder="500"
              sx={{ 
                minWidth: 150,
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#22c55e',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#22c55e',
                  },
                },
              }}
            /> */}
          </Box>

          {/* Vouchers Grid */}
          {isLoading && availablePage === 1 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : availableToClaim.length > 0 ? (
            <>
              <div className="vouchers-grid">
                {availableToClaim.map((voucher) => {
                  // CRITICAL: Double check if voucher is claimed
                  const voucherTemplateId = String(voucher._id || voucher.id || '');
                  const isClaimed = voucherTemplateId && claimedVoucherIds.has(voucherTemplateId);
                  
                  // If claimed, don't render at all
                  if (isClaimed) {
                    return null;
                  }
                  
                  return (
                    <div 
                      key={voucher._id || voucher.id} 
                      className="voucher-card"
                      style={{
                        // Extra safety: disable pointer events if somehow claimed
                        pointerEvents: isClaimed ? 'none' : 'auto',
                        opacity: isClaimed ? 0.5 : 1,
                        cursor: isClaimed ? 'not-allowed' : 'default',
                      }}
                      onClick={(e) => {
                        // Block all clicks if claimed
                        if (isClaimed) {
                          e.preventDefault();
                          e.stopPropagation();
                          return false;
                        }
                      }}
                    >
                      <div className="voucher-card-header">
                        <h4 className="voucher-name">{voucher.name || voucher.voucher?.name || 'Voucher'}</h4>
                        <Chip 
                          label={isClaimed ? "Already Claimed" : "Available to Claim"} 
                          size="small"
                          sx={{ 
                            fontWeight: 600,
                            backgroundColor: isClaimed ? '#fee2e2' : '#d1fae5',
                            color: isClaimed ? '#991b1b' : '#065f46',
                          }}
                        />
              </div>
                      <div className="voucher-card-body">
                        <p className="voucher-description">
                          {voucher.description || voucher.voucher?.description || 'Không có mô tả'}
                        </p>
                        {voucher.tierLabel && (
                          <div className="voucher-detail">
                            <span className="detail-label">Tier:</span>
                            <span className="detail-value">{voucher.tierLabel}</span>
              </div>
                        )}
                        {voucher.minThreshold && (
                          <div className="voucher-detail">
                            <span className="detail-label">Min Threshold:</span>
                            <span className="detail-value">{voucher.minThreshold} points</span>
            </div>
                        )}
        </div>
                      <div className="voucher-card-footer">
                        <Button
                          variant="contained"
                          startIcon={!isClaimed ? <MdRedeem /> : null}
                          onClick={(e) => {
                            // CRITICAL: Block all clicks if claimed
                            if (isClaimed) {
                              e.preventDefault();
                              e.stopPropagation();
                              toast.error('Voucher này đã được claim rồi');
                              return false;
                            }
                            
                            e.preventDefault();
                            e.stopPropagation();
                            
                            // Final safety check before opening modal
                            const finalCheck = voucherTemplateId && claimedVoucherIds.has(voucherTemplateId);
                            if (finalCheck) {
                              toast.error('Voucher này đã được claim rồi');
                              return false;
                            }
                            
                            handleOpenClaimModal(voucher);
                          }}
                          fullWidth
                          disabled={isClaimed}
                          sx={{
                            backgroundColor: isClaimed ? '#9ca3af' : '#22c55e',
                            fontWeight: 600,
                            py: 1.2,
                            fontSize: '0.9375rem',
                            boxShadow: isClaimed ? 'none' : '0 4px 12px rgba(34, 197, 94, 0.35)',
                            transition: 'all 0.3s ease',
                            cursor: isClaimed ? 'not-allowed' : 'pointer',
                            pointerEvents: isClaimed ? 'none' : 'auto',
                            '&:hover': {
                              backgroundColor: isClaimed ? '#9ca3af' : '#16a34a',
                              boxShadow: isClaimed ? 'none' : '0 6px 16px rgba(34, 197, 94, 0.45)',
                              transform: isClaimed ? 'none' : 'translateY(-2px)',
                            },
                            '&:disabled': {
                              backgroundColor: '#9ca3af',
                              color: '#ffffff',
                              cursor: 'not-allowed',
                              pointerEvents: 'none',
                            }
                          }}
                        >
                          {isClaimed ? 'Already Claimed' : 'Claim Voucher'}
                        </Button>
        </div>
                    </div>
                  );
                })}
      </div>

              {/* Pagination */}
              {businessVoucherPagination?.totalPages > 1 && (
                <Stack spacing={2} sx={{ mt: 3, display: 'flex', alignItems: 'center' }}>
                  <Pagination
                    count={businessVoucherPagination.totalPages}
                    page={availablePage}
                    onChange={(e, page) => setAvailablePage(page)}
                    variant="outlined"
                    shape="rounded"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        '&.Mui-selected': {
                          backgroundColor: '#22c55e',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: '#16a34a',
                          }
                        },
                        '&:hover': {
                          backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        }
                      }
                    }}
                  />
                </Stack>
              )}
            </>
          ) : (
            <Box sx={{ textAlign: 'center', p: 4, color: '#999' }}>
              <FaGift style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }} />
              <Typography>Không có voucher nào có thể claim</Typography>
            </Box>
          )}
        </div>
      )}

      {/* My Claimed Vouchers Tab */}
      {activeTab === 1 && (
        <div className="vouchers-section">
          <div className="section-header">
        <h3 className="section-title">
          <FaGift className="section-icon" />
              Voucher đã Claim
        </h3>
        <p className="section-subtitle">
              Quản lý các voucher đã claim: Setup → Publish
            </p>
          </div>

          {/* Filters */}
          <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
            <Chip
              label="Tất cả"
              onClick={() => setIsPublished(null)}
              sx={{ 
                cursor: 'pointer',
                backgroundColor: isPublished === null ? '#22c55e' : '#e5e7eb',
                color: isPublished === null ? 'white' : '#374151',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: isPublished === null ? '#16a34a' : '#d1d5db',
                }
              }}
            />
            <Chip
              label="Đã Publish"
              onClick={() => setIsPublished(true)}
              sx={{ 
                cursor: 'pointer',
                backgroundColor: isPublished === true ? '#22c55e' : '#e5e7eb',
                color: isPublished === true ? 'white' : '#374151',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: isPublished === true ? '#16a34a' : '#d1d5db',
                }
              }}
            />
            <Chip
              label="Chưa Publish"
              onClick={() => setIsPublished(false)}
              sx={{ 
                cursor: 'pointer',
                backgroundColor: isPublished === false ? '#22c55e' : '#e5e7eb',
                color: isPublished === false ? 'white' : '#374151',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: isPublished === false ? '#16a34a' : '#d1d5db',
                }
              }}
            />
          </Box>

          {/* Vouchers Grid */}
          {isLoading && myVouchersPage === 1 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : myBusinessVouchers?.length > 0 ? (
            <>
              <div className="vouchers-grid">
                {myBusinessVouchers.map((voucher) => {
                  const status = getVoucherStatus(voucher);
                  return (
                    <div key={voucher._id || voucher.id} className="voucher-card">
                      <div className="voucher-card-header">
                        <h4 className="voucher-name">
                          {voucher.customName || voucher.voucher?.name || 'Voucher'}
                        </h4>
                        <Chip 
                          label={
                            status === 'published' ? 'Đã Publish' :
                            status === 'setup' ? 'Đã Setup' :
                            'Đã Claim'
                          }
                          size="small"
                          sx={{ 
                            fontWeight: 600,
                            backgroundColor: 
                              status === 'published' ? '#d1fae5' :
                              status === 'setup' ? '#fef3c7' :
                              '#e5e7eb',
                            color: 
                              status === 'published' ? '#065f46' :
                              status === 'setup' ? '#92400e' :
                              '#374151',
                          }}
                        />
                      </div>
                      <div className="voucher-card-body">
                        <p className="voucher-description">
                          {voucher.customDescription || voucher.voucher?.description || 'Không có mô tả'}
                        </p>
                        {voucher.discountPercent && (
                          <div className="voucher-detail">
                            <span className="detail-label">Discount:</span>
                            <span className="detail-value">{voucher.discountPercent}%</span>
                          </div>
                        )}
                        {voucher.rewardPointCost && (
                          <div className="voucher-detail">
                            <span className="detail-label">Points:</span>
                            <span className="detail-value">{voucher.rewardPointCost}</span>
                          </div>
                        )}
                        {voucher.startDate && (
                          <div className="voucher-detail">
                            <span className="detail-label">Start:</span>
                            <span className="detail-value">{formatDate(voucher.startDate)}</span>
                          </div>
                        )}
                        {voucher.endDate && (
                          <div className="voucher-detail">
                            <span className="detail-label">End:</span>
                            <span className="detail-value">{formatDate(voucher.endDate)}</span>
                          </div>
                        )}
                      </div>
                      <div className="voucher-card-footer">
                        <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                          {/* Action buttons row */}
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            {status === 'claimed' && (
                              <Button
                                variant="contained"
                                startIcon={<MdSettings />}
                                onClick={() => handleOpenSetupModal(voucher, false)}
                                fullWidth
                                sx={{
                                  backgroundColor: '#f59e0b',
                                  fontWeight: 600,
                                  py: 1.2,
                                  fontSize: '0.9375rem',
                                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.35)',
                                  transition: 'all 0.3s ease',
                                  '&:hover': {
                                    backgroundColor: '#d97706',
                                    boxShadow: '0 6px 16px rgba(245, 158, 11, 0.45)',
                                    transform: 'translateY(-2px)',
                                  }
                                }}
                              >
                                Setup
                              </Button>
                            )}
                            {status === 'setup' && (
                              <>
                                <Button
                                  variant="contained"
                                  startIcon={<FaEdit />}
                                  onClick={() => handleOpenSetupModal(voucher, true)}
                                  sx={{
                                    backgroundColor: '#22c55e',
                                    fontWeight: 600,
                                    py: 1.2,
                                    fontSize: '0.9375rem',
                                    flex: 1,
                                    boxShadow: '0 4px 12px rgba(34, 197, 94, 0.35)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                      backgroundColor: '#16a34a',
                                      boxShadow: '0 6px 16px rgba(34, 197, 94, 0.45)',
                                      transform: 'translateY(-2px)',
                                    }
                                  }}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="contained"
                                  startIcon={<MdPublish />}
                                  onClick={() => handlePublishVoucher(voucher)}
                                  sx={{
                                    backgroundColor: '#22c55e',
                                    fontWeight: 600,
                                    py: 1.2,
                                    fontSize: '0.9375rem',
                                    flex: 1,
                                    boxShadow: '0 4px 12px rgba(34, 197, 94, 0.35)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                      backgroundColor: '#16a34a',
                                      boxShadow: '0 6px 16px rgba(34, 197, 94, 0.45)',
                                      transform: 'translateY(-2px)',
                                    }
                                  }}
                                >
                                  Publish
                                </Button>
                              </>
                            )}
                            {status === 'published' && (
                              <Button
                                variant="contained"
                                startIcon={<FaEdit />}
                                onClick={() => handleOpenSetupModal(voucher, true)}
                                fullWidth
                                sx={{
                                  backgroundColor: '#22c55e',
                                  fontWeight: 600,
                                  py: 1.2,
                                  fontSize: '0.9375rem',
                                  boxShadow: '0 4px 12px rgba(34, 197, 94, 0.35)',
                                  transition: 'all 0.3s ease',
                                  '&:hover': {
                                    backgroundColor: '#16a34a',
                                    boxShadow: '0 6px 16px rgba(34, 197, 94, 0.45)',
                                    transform: 'translateY(-2px)',
                                  }
                                }}
                              >
                                Edit
                              </Button>
                            )}
                          </Box>
                          {/* View Details button */}
                          <Button
                            variant="outlined"
                            startIcon={<FaInfoCircle />}
                            onClick={() => handleViewDetails(voucher)}
                            fullWidth
                            sx={{
                              borderColor: '#6b7280',
                              color: '#6b7280',
                              fontWeight: 500,
                              py: 0.8,
                              fontSize: '0.875rem',
                              '&:hover': {
                                borderColor: '#22c55e',
                                color: '#22c55e',
                                backgroundColor: 'rgba(34, 197, 94, 0.04)',
                              }
                            }}
                          >
                            View Details
                          </Button>
                        </Box>
        </div>
                      </div>
                  );
                })}
                      </div>

              {/* Pagination */}
              {myBusinessVoucherPagination?.totalPages > 1 && (
                <Stack spacing={2} sx={{ mt: 3, display: 'flex', alignItems: 'center' }}>
                  <Pagination
                    count={myBusinessVoucherPagination.totalPages}
                    page={myVouchersPage}
                    onChange={(e, page) => setMyVouchersPage(page)}
                    variant="outlined"
                    shape="rounded"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        '&.Mui-selected': {
                          backgroundColor: '#22c55e',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: '#16a34a',
                          }
                        },
                        '&:hover': {
                          backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        }
                      }
                    }}
                  />
                </Stack>
              )}
            </>
          ) : (
            <Box sx={{ textAlign: 'center', p: 4, color: '#999' }}>
              <FaGift style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }} />
              <Typography>Bạn chưa claim voucher nào</Typography>
            </Box>
          )}
        </div>
      )}

      {/* Claim Modal */}
      <Dialog 
        open={claimModalOpen} 
        onClose={handleCloseClaimModal} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 12px 40px rgba(34, 197, 94, 0.2)',
          }
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            color: 'white',
            py: 2,
            px: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5
          }}
        >
          <MdRedeem style={{ fontSize: '24px' }} />
          <Box component="span" sx={{ fontWeight: 'bold', fontSize: '1.25rem' }}>Claim Voucher</Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2, px: 3 }}>
          {selectedVoucher && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: '#1a1a1a' }}>
                {selectedVoucher.name || selectedVoucher.voucher?.name || 'Voucher'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                {selectedVoucher.description || selectedVoucher.voucher?.description || 'Không có mô tả'}
              </Typography>
              <Typography variant="body1" sx={{ color: '#374151', fontWeight: 500 }}>
                Bạn có chắc chắn muốn claim voucher này không?
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, gap: 2 }}>
          <Button 
            onClick={handleCloseClaimModal}
            variant="outlined"
            sx={{
              color: '#666',
              borderColor: '#ccc',
              px: 3,
              py: 1,
              fontSize: '0.9375rem',
              fontWeight: 500,
              '&:hover': {
                borderColor: '#999',
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              }
            }}
          >
            Hủy
          </Button>
          <Button 
            onClick={handleClaimVoucher} 
            variant="contained"
            disabled={isLoading}
            sx={{
              backgroundColor: '#22c55e',
              px: 3,
              py: 1,
              fontSize: '0.9375rem',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(34, 197, 94, 0.35)',
              '&:hover': {
                backgroundColor: '#16a34a',
                boxShadow: '0 6px 16px rgba(34, 197, 94, 0.45)',
              }
            }}
          >
            {isLoading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Claim'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Setup Modal */}
      <Dialog 
        open={setupModalOpen} 
        onClose={handleCloseSetupModal} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 12px 40px rgba(34, 197, 94, 0.2)',
          }
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            color: 'white',
            py: 2,
            px: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5
          }}
        >
          {isEditMode ? (
            <FaEdit style={{ fontSize: '24px' }} />
          ) : (
            <MdSettings style={{ fontSize: '24px' }} />
          )}
          <Typography variant="h6" fontWeight="bold">
            {isEditMode ? 'Edit Voucher' : 'Setup Voucher'}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2, px: 3 }}>
          <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              label="Discount Percent (%)"
              type="number"
              fullWidth
              value={setupForm.discountPercent}
              onChange={(e) => setSetupForm({ ...setupForm, discountPercent: e.target.value })}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#22c55e',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#22c55e',
                  },
                },
              }}
            />
            <TextField
              label="Reward Point Cost"
              type="number"
              fullWidth
              value={setupForm.rewardPointCost}
              onChange={(e) => setSetupForm({ ...setupForm, rewardPointCost: e.target.value })}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#22c55e',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#22c55e',
                  },
                },
              }}
            />
            <TextField
              label="Start Date"
              type="date"
              fullWidth
              value={setupForm.startDate}
              onChange={(e) => setSetupForm({ ...setupForm, startDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#22c55e',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#22c55e',
                  },
                },
              }}
            />
            <TextField
              label="End Date"
              type="date"
              fullWidth
              value={setupForm.endDate}
              onChange={(e) => setSetupForm({ ...setupForm, endDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#22c55e',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#22c55e',
                  },
                },
              }}
            />
            
            <Divider sx={{ my: 1 }} />
            
            {/* Publish Toggle */}
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                p: 2.5,
                borderRadius: 2,
                backgroundColor: setupForm.isPublished ? 'rgba(34, 197, 94, 0.08)' : 'rgba(34, 197, 94, 0.08)',
                border: '1px solid',
                borderColor: '#22c55e',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
                <Chip
                  label={setupForm.isPublished ? 'Published' : 'Unpublished'}
                  size="small"
                  sx={{ 
                    minWidth: '90px', 
                    fontWeight: 600,
                    backgroundColor: setupForm.isPublished ? '#d1fae5' : '#fee2e2',
                    color: setupForm.isPublished ? '#065f46' : '#991b1b',
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" fontWeight={600} sx={{ mb: 0.25 }}>
                    Publish cho Customer
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {setupForm.isPublished 
                      ? 'Voucher sẽ hiển thị và customer có thể sử dụng ngay' 
                      : 'Voucher sẽ được setup nhưng chưa publish, customer chưa thể sử dụng'}
                  </Typography>
                </Box>
              </Box>
              <Tooltip
                title={setupForm.isPublished
                  ? 'Click để unpublish voucher (customer không thể sử dụng)'
                  : 'Click để publish voucher (customer có thể sử dụng)'}
                arrow
                placement="top"
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={setupForm.isPublished}
                      onChange={(e) => setSetupForm({ ...setupForm, isPublished: e.target.checked })}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#22c55e',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#22c55e',
                        },
                      }}
                    />
                  }
                  label=""
                  sx={{ m: 0 }}
                />
              </Tooltip>
            </Box>
            
            {!setupForm.isPublished && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: -1, mb: 1 }}>
                💡 Bạn có thể publish sau bằng cách click nút "Publish Voucher" trên voucher card.
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, gap: 2 }}>
          <Button 
            onClick={handleCloseSetupModal}
            variant="outlined"
            sx={{
              color: '#666',
              borderColor: '#ccc',
              px: 3,
              py: 1,
              fontSize: '0.9375rem',
              fontWeight: 500,
              '&:hover': {
                borderColor: '#999',
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              }
            }}
          >
            Hủy
          </Button>
          <Button 
            onClick={handleSetupVoucher} 
            variant="contained"
            disabled={isLoading}
            sx={{
              backgroundColor: '#22c55e',
              px: 3,
              py: 1,
              fontSize: '0.9375rem',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(34, 197, 94, 0.35)',
              '&:hover': {
                backgroundColor: '#16a34a',
                boxShadow: '0 6px 16px rgba(34, 197, 94, 0.45)',
              }
            }}
          >
            {isLoading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : (isEditMode ? 'Update' : 'Setup')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Voucher Detail Modal */}
      <Dialog 
        open={detailModalOpen} 
        onClose={handleCloseDetailModal} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 12px 40px rgba(34, 197, 94, 0.2)',
          }
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            color: 'white',
            py: 2,
            px: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <FaInfoCircle style={{ fontSize: '24px' }} />
            <Typography variant="h6" fontWeight="bold">Voucher Details</Typography>
          </Box>
          <IconButton
            onClick={handleCloseDetailModal}
            sx={{
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2, px: 3 }}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : voucherDetail ? (
            <Box>
              {/* Voucher Info */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: '#1a1a1a' }}>
                  {voucherDetail.customName || voucherDetail.voucher?.name || voucherDetail.name || 'Voucher'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                  {voucherDetail.customDescription || voucherDetail.voucher?.description || voucherDetail.description || 'No description'}
                </Typography>
                
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  {voucherDetail.discountPercent && (
                    <Grid item xs={6}>
                      <Box sx={{ p: 2, borderRadius: 2, backgroundColor: 'rgba(34, 197, 94, 0.08)' }}>
                        <Typography variant="caption" color="text.secondary">Discount</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#22c55e' }}>
                          {voucherDetail.discountPercent}%
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                  {voucherDetail.rewardPointCost && (
                    <Grid item xs={6}>
                      <Box sx={{ p: 2, borderRadius: 2, backgroundColor: 'rgba(59, 130, 246, 0.08)' }}>
                        <Typography variant="caption" color="text.secondary">Points Cost</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#3b82f6' }}>
                          {voucherDetail.rewardPointCost}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                  {voucherDetail.startDate && (
                    <Grid item xs={6}>
                      <Box sx={{ p: 2, borderRadius: 2, backgroundColor: 'rgba(0, 0, 0, 0.02)' }}>
                        <Typography variant="caption" color="text.secondary">Start Date</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {formatDate(voucherDetail.startDate)}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                  {voucherDetail.endDate && (
                    <Grid item xs={6}>
                      <Box sx={{ p: 2, borderRadius: 2, backgroundColor: 'rgba(0, 0, 0, 0.02)' }}>
                        <Typography variant="caption" color="text.secondary">End Date</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {formatDate(voucherDetail.endDate)}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <Box sx={{ p: 2, borderRadius: 2, backgroundColor: 'rgba(0, 0, 0, 0.02)' }}>
                      <Typography variant="caption" color="text.secondary">Status</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Chip
                          label={voucherDetail.isPublished ? 'Published' : 'Not Published'}
                          size="small"
                          sx={{
                            backgroundColor: voucherDetail.isPublished ? '#d1fae5' : '#fef3c7',
                            color: voucherDetail.isPublished ? '#065f46' : '#92400e',
                            fontWeight: 600,
                          }}
                        />
                        <Chip
                          label={getVoucherStatus(voucherDetail) === 'published' ? 'Published' : 
                                 getVoucherStatus(voucherDetail) === 'setup' ? 'Setup' : 'Claimed'}
                          size="small"
                          sx={{
                            backgroundColor: getVoucherStatus(voucherDetail) === 'published' ? '#d1fae5' :
                                           getVoucherStatus(voucherDetail) === 'setup' ? '#fef3c7' : '#e5e7eb',
                            color: getVoucherStatus(voucherDetail) === 'published' ? '#065f46' :
                                  getVoucherStatus(voucherDetail) === 'setup' ? '#92400e' : '#374151',
                            fontWeight: 600,
                          }}
                        />
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              {/* Voucher Codes/Usage Details */}
              {voucherDetail.codes && voucherDetail.codes.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Voucher Codes ({voucherDetail.codes.length})
                  </Typography>
                  <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 700 }}>Code</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Used At</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {voucherDetail.codes.slice(0, 10).map((code, index) => (
                          <TableRow key={index}>
                            <TableCell sx={{ fontFamily: 'monospace' }}>
                              {code.code || code}
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={code.status || 'active'}
                                size="small"
                                sx={{
                                  backgroundColor: code.status === 'used' ? '#fee2e2' : '#d1fae5',
                                  color: code.status === 'used' ? '#991b1b' : '#065f46',
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              {code.usedAt ? formatDate(code.usedAt) : 'N/A'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {voucherDetail.codes.length > 10 && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      Showing first 10 of {voucherDetail.codes.length} codes
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary">No details available</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button 
            onClick={handleCloseDetailModal}
            variant="contained"
            sx={{
              backgroundColor: '#22c55e',
              px: 3,
              py: 1,
              fontSize: '0.9375rem',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: '#16a34a',
              }
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Setup Vouchers Section - Display all setup vouchers */}
      <div className="vouchers-section" style={{ marginTop: '40px' }}>
        <div className="section-header">
        <h3 className="section-title">
          <FaGift className="section-icon" />
            Setup Vouchers ({setupVouchers.length})
        </h3>
        <p className="section-subtitle">
            List of all vouchers that have been set up and can be published for customers to use
          </p>
        </div>

        {/* Filter Tabs for Setup Vouchers */}
        <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Status Filter */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#6b7280' }}>
              Filter by Status:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label="All"
                onClick={() => setSetupVouchersStatus(undefined)}
                sx={{ 
                  cursor: 'pointer',
                  backgroundColor: setupVouchersStatus === undefined ? '#22c55e' : '#e5e7eb',
                  color: setupVouchersStatus === undefined ? 'white' : '#374151',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: setupVouchersStatus === undefined ? '#16a34a' : '#d1d5db',
                  }
                }}
              />
              <Chip
                label="Active"
                onClick={() => setSetupVouchersStatus('active')}
                sx={{ 
                  cursor: 'pointer',
                  backgroundColor: setupVouchersStatus === 'active' ? '#22c55e' : '#e5e7eb',
                  color: setupVouchersStatus === 'active' ? 'white' : '#374151',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: setupVouchersStatus === 'active' ? '#16a34a' : '#d1d5db',
                  }
                }}
              />
              <Chip
                label="Inactive"
                onClick={() => setSetupVouchersStatus('inactive')}
                sx={{ 
                  cursor: 'pointer',
                  backgroundColor: setupVouchersStatus === 'inactive' ? '#22c55e' : '#e5e7eb',
                  color: setupVouchersStatus === 'inactive' ? 'white' : '#374151',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: setupVouchersStatus === 'inactive' ? '#16a34a' : '#d1d5db',
                  }
                }}
              />
              <Chip
                label="Expired"
                onClick={() => setSetupVouchersStatus('expired')}
                sx={{ 
                  cursor: 'pointer',
                  backgroundColor: setupVouchersStatus === 'expired' ? '#22c55e' : '#e5e7eb',
                  color: setupVouchersStatus === 'expired' ? 'white' : '#374151',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: setupVouchersStatus === 'expired' ? '#16a34a' : '#d1d5db',
                  }
                }}
              />
            </Box>
          </Box>

          {/* Publish Status Filter */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#6b7280' }}>
              Filter by Publish:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label="All"
                onClick={() => setSetupVouchersIsPublished(undefined)}
                sx={{ 
                  cursor: 'pointer',
                  backgroundColor: setupVouchersIsPublished === undefined ? '#22c55e' : '#e5e7eb',
                  color: setupVouchersIsPublished === undefined ? 'white' : '#374151',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: setupVouchersIsPublished === undefined ? '#16a34a' : '#d1d5db',
                  }
                }}
              />
              <Chip
                label="Published"
                onClick={() => setSetupVouchersIsPublished(true)}
                sx={{ 
                  cursor: 'pointer',
                  backgroundColor: setupVouchersIsPublished === true ? '#22c55e' : '#e5e7eb',
                  color: setupVouchersIsPublished === true ? 'white' : '#374151',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: setupVouchersIsPublished === true ? '#16a34a' : '#d1d5db',
                  }
                }}
              />
              <Chip
                label="Not Published"
                onClick={() => setSetupVouchersIsPublished(false)}
                sx={{ 
                  cursor: 'pointer',
                  backgroundColor: setupVouchersIsPublished === false ? '#22c55e' : '#e5e7eb',
                  color: setupVouchersIsPublished === false ? 'white' : '#374151',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: setupVouchersIsPublished === false ? '#16a34a' : '#d1d5db',
                  }
                }}
              />
            </Box>
          </Box>
        </Box>

        {setupVouchers.length > 0 ? (
          <div className="vouchers-grid">
            {setupVouchers.map((voucher) => {
              const status = getVoucherStatus(voucher);
              return (
                <div key={voucher._id || voucher.id} className="voucher-card">
                  <div className="voucher-card-header">
                    <h4 className="voucher-name">
                      {voucher.customName || voucher.voucher?.name || 'Voucher'}
                    </h4>
                    <Chip 
                      label={
                        status === 'published' ? 'Đã Publish' :
                        status === 'setup' ? 'Đã Setup' :
                        'Đã Claim'
                      }
                      size="small"
                      sx={{ 
                        fontWeight: 600,
                        backgroundColor: 
                          status === 'published' ? '#d1fae5' :
                          status === 'setup' ? '#fef3c7' :
                          '#e5e7eb',
                        color: 
                          status === 'published' ? '#065f46' :
                          status === 'setup' ? '#92400e' :
                          '#374151',
                      }}
                    />
                    </div>
                  <div className="voucher-card-body">
                    <p className="voucher-description">
                      {voucher.customDescription || voucher.voucher?.description || 'No description'}
                    </p>
                    {voucher.discountPercent && (
                      <div className="voucher-detail">
                        <span className="detail-label">Discount:</span>
                        <span className="detail-value">{voucher.discountPercent}%</span>
                    </div>
                    )}
                    {voucher.rewardPointCost && (
                      <div className="voucher-detail">
                        <span className="detail-label">Points:</span>
                        <span className="detail-value">{voucher.rewardPointCost}</span>
        </div>
                    )}
                    {voucher.startDate && (
                      <div className="voucher-detail">
                        <span className="detail-label">Start:</span>
                        <span className="detail-value">{formatDate(voucher.startDate)}</span>
                      </div>
                    )}
                    {voucher.endDate && (
                      <div className="voucher-detail">
                        <span className="detail-label">End:</span>
                        <span className="detail-value">{formatDate(voucher.endDate)}</span>
                      </div>
                    )}
                  </div>
                  <div className="voucher-card-footer">
                    <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                      {/* Action buttons row */}
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {status === 'setup' && (
                          <>
                            <Button
                              variant="contained"
                              startIcon={<FaEdit />}
                              onClick={() => handleOpenSetupModal(voucher, true)}
                              sx={{
                                backgroundColor: '#22c55e',
                                fontWeight: 600,
                                py: 1.2,
                                fontSize: '0.9375rem',
                                flex: 1,
                                boxShadow: '0 4px 12px rgba(34, 197, 94, 0.35)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  backgroundColor: '#16a34a',
                                  boxShadow: '0 6px 16px rgba(34, 197, 94, 0.45)',
                                  transform: 'translateY(-2px)',
                                }
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="contained"
                              startIcon={<MdPublish />}
                              onClick={() => handlePublishVoucher(voucher)}
                              sx={{
                                backgroundColor: '#22c55e',
                                fontWeight: 600,
                                py: 1.2,
                                fontSize: '0.9375rem',
                                flex: 1,
                                boxShadow: '0 4px 12px rgba(34, 197, 94, 0.35)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  backgroundColor: '#16a34a',
                                  boxShadow: '0 6px 16px rgba(34, 197, 94, 0.45)',
                                  transform: 'translateY(-2px)',
                                }
                              }}
                            >
                              Publish
                            </Button>
                          </>
                        )}
                        {status === 'published' && (
                          <Button
                            variant="contained"
                            startIcon={<FaEdit />}
                            onClick={() => handleOpenSetupModal(voucher, true)}
                            fullWidth
                            sx={{
                              backgroundColor: '#22c55e',
                              fontWeight: 600,
                              py: 1.2,
                              fontSize: '0.9375rem',
                              boxShadow: '0 4px 12px rgba(34, 197, 94, 0.35)',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                backgroundColor: '#16a34a',
                                boxShadow: '0 6px 16px rgba(34, 197, 94, 0.45)',
                                transform: 'translateY(-2px)',
                              }
                            }}
                          >
                            Edit
                          </Button>
                        )}
                      </Box>
                      {/* View Details button */}
                      <Button
                        variant="outlined"
                        startIcon={<FaInfoCircle />}
                        onClick={() => handleViewDetails(voucher)}
                        fullWidth
                        sx={{
                          borderColor: '#6b7280',
                          color: '#6b7280',
                          fontWeight: 500,
                          py: 0.8,
                          fontSize: '0.875rem',
                          '&:hover': {
                            borderColor: '#22c55e',
                            color: '#22c55e',
                            backgroundColor: 'rgba(34, 197, 94, 0.04)',
                          }
                        }}
                      >
                        View Details
                      </Button>
                    </Box>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <Box sx={{ textAlign: 'center', p: 4, color: '#999' }}>
            <FaGift style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }} />
            <Typography>
              {setupVouchersStatus || setupVouchersIsPublished !== undefined 
                ? 'No vouchers match the filter criteria' 
                : 'No vouchers have been set up yet'}
            </Typography>
          </Box>
        )}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  LinearProgress,
  Link,
} from '@mui/material';
import {
  Close as CloseIcon,
  CardGiftcard as GiftIcon,
  LocalFlorist as EcoIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import './Voucher.css';

// Mock data - Vouchers
const mockVouchers = [
  {
    id: 1,
    type: 'regular',
    discount: '10%',
    maxDiscount: 50000,
    minSpend: 200000,
    points: 50,
    usagePercentage: 85,
    status: 'active',
    category: 'Áp dụng cho toàn hệ thống',
    expiry: '31/12/2024',
  },
  {
    id: 2,
    type: 'regular',
    discount: '15%',
    maxDiscount: 100000,
    minSpend: 500000,
    points: 100,
    usagePercentage: 92,
    status: 'active',
    category: 'Áp dụng cho toàn hệ thống',
    expiry: '31/12/2024',
  },
  {
    id: 3,
    type: 'exclusive',
    discount: '20%',
    maxDiscount: 200000,
    minSpend: 1000000,
    points: 200,
    usagePercentage: 45,
    status: 'active',
    category: 'Áp dụng cho toàn hệ thống',
    expiry: '31/12/2024',
  },
  {
    id: 4,
    type: 'regular',
    discount: '25%',
    maxDiscount: 150000,
    minSpend: 800000,
    points: 150,
    usagePercentage: 78,
    status: 'active',
    category: 'Áp dụng cho toàn hệ thống',
    expiry: '31/12/2024',
  },
  {
    id: 5,
    type: 'regular',
    discount: '30%',
    maxDiscount: 300000,
    minSpend: 2000000,
    points: 300,
    usagePercentage: 60,
    status: 'active',
    category: 'Áp dụng cho toàn hệ thống',
    expiry: '31/12/2024',
  },
  {
    id: 6,
    type: 'exclusive',
    discount: '50%',
    maxDiscount: 500000,
    minSpend: 3000000,
    points: 500,
    usagePercentage: 35,
    status: 'active',
    category: 'Áp dụng cho toàn hệ thống',
    expiry: '31/12/2024',
  },
  {
    id: 7,
    type: 'regular',
    discount: '8%',
    maxDiscount: 30000,
    minSpend: 150000,
    points: 30,
    usagePercentage: 95,
    status: 'active',
    category: 'Áp dụng cho toàn hệ thống',
    expiry: '31/12/2024',
  },
  {
    id: 8,
    type: 'regular',
    discount: '12%',
    maxDiscount: 80000,
    minSpend: 400000,
    points: 80,
    usagePercentage: 88,
    status: 'active',
    category: 'Áp dụng cho toàn hệ thống',
    expiry: '31/12/2024',
  },
];

export default function Voucher() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [conditionModalOpen, setConditionModalOpen] = useState(false);
  const [savedVouchers, setSavedVouchers] = useState(new Set());

  const userPoints = 350; // Mock user points

  const handleSaveVoucher = (voucherId) => {
    const newSaved = new Set(savedVouchers);
    if (newSaved.has(voucherId)) {
      newSaved.delete(voucherId);
    } else {
      newSaved.add(voucherId);
    }
    setSavedVouchers(newSaved);
  };

  const handleShowConditions = (voucher) => {
    setSelectedVoucher(voucher);
    setConditionModalOpen(true);
  };

  const handleCloseModals = () => {
    setConditionModalOpen(false);
    setSelectedVoucher(null);
  };

  const filteredVouchers = statusFilter === 'all' 
    ? mockVouchers 
    : mockVouchers.filter(v => v.status === statusFilter);

  return (
    <div className="voucher-page-shopee">
      {/* Main Banner */}
      <div className="voucher-banner-main">
        <div className="voucher-banner-content">
          <EcoIcon className="banner-logo-icon" />
          <div className="banner-text-container">
            <Typography variant="h3" className="banner-title">
              VOUCHER BACK2USE
            </Typography>
            <Typography variant="body2" className="banner-subtitle">
              Số lượng có hạn, dành cho những bạn nhanh nhất.
            </Typography>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="voucher-content-wrapper">
        <div className="voucher-content-card">
          {/* Section Header */}
          <div className="voucher-section-header-custom">
            <EcoIcon className="section-icon-custom" />
            <Typography variant="h6" className="section-title-custom">
              VOUCHER BACK2USE
            </Typography>
          </div>

          {/* Filters */}
          <div className="voucher-filters-custom">
            <Button
              variant={statusFilter === 'all' ? 'contained' : 'outlined'}
              onClick={() => setStatusFilter('all')}
              className={`filter-btn-custom ${statusFilter === 'all' ? 'active' : ''}`}
              size="small"
            >
              Tất cả
            </Button>
            <Button
              variant={statusFilter === 'active' ? 'contained' : 'outlined'}
              onClick={() => setStatusFilter('active')}
              className={`filter-btn-custom ${statusFilter === 'active' ? 'active' : ''}`}
              size="small"
            >
              Đang hoạt động
            </Button>
            <Button
              variant={statusFilter === 'inactive' ? 'contained' : 'outlined'}
              onClick={() => setStatusFilter('inactive')}
              className={`filter-btn-custom ${statusFilter === 'inactive' ? 'active' : ''}`}
              size="small"
            >
              Tạm dừng
            </Button>
          </div>

          {/* Voucher Grid */}
          <div className="voucher-grid-custom">
            {filteredVouchers.map((voucher) => {
              const isSaved = savedVouchers.has(voucher.id);
              const canSave = userPoints >= voucher.points;
              
              return (
                <div 
                  key={voucher.id} 
                  className={`voucher-card-custom ${voucher.type} ${voucher.status}`}
                >
                  {/* Left Strip */}
                  <div className="voucher-card-strip">
                    <div className="voucher-strip-badge">
                      <div className="badge-icon-wrapper">
                        {voucher.type === 'exclusive' ? (
                          <StarIcon className="strip-icon" />
                        ) : (
                          <EcoIcon className="strip-icon" />
                        )}
                      </div>
                      <span className="strip-text">
                        {voucher.type === 'exclusive' ? 'ĐẶC BIỆT' : 'BACK2USE'}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="voucher-card-body">
                    <div className="voucher-main-info">
                      <Typography variant="h3" className="voucher-discount-text">
                        {voucher.discount}
                      </Typography>
                      <Typography variant="body2" className="voucher-max-discount-text">
                        Giảm tối đa {voucher.maxDiscount.toLocaleString('vi-VN')}đ
                      </Typography>
                      <Typography variant="body2" className="voucher-min-order-text">
                        Đơn tối thiểu {voucher.minSpend.toLocaleString('vi-VN')}đ
                      </Typography>
                      <Typography variant="body2" className="voucher-category-text">
                        {voucher.category}
                      </Typography>
                      
                      {/* Points */}
                      <div className="voucher-points-section">
                        <GiftIcon className="points-icon" />
                        <Typography variant="caption" className="points-text">
                          {voucher.points} điểm
                        </Typography>
                      </div>

                      {/* Usage Progress */}
                      <div className="voucher-usage-section">
                        <LinearProgress 
                          variant="determinate" 
                          value={voucher.usagePercentage} 
                          className="usage-bar"
                        />
                        <Typography variant="caption" className="usage-percentage">
                          Đã dùng {voucher.usagePercentage}%
                        </Typography>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="voucher-card-footer-custom">
                      <Button
                        variant="contained"
                        className={`save-btn ${isSaved ? 'saved' : ''} ${!canSave ? 'disabled' : ''}`}
                        onClick={() => handleSaveVoucher(voucher.id)}
                        disabled={!canSave}
                        fullWidth
                      >
                        {isSaved ? 'Đã lưu' : canSave ? 'Lưu' : `Cần ${voucher.points - userPoints} điểm nữa`}
                      </Button>
                      <Link
                        component="button"
                        variant="caption"
                        className="condition-link"
                        onClick={() => handleShowConditions(voucher)}
                      >
                        Điều kiện
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Condition Modal */}
      <Dialog
        open={conditionModalOpen}
        onClose={handleCloseModals}
        maxWidth="sm"
        fullWidth
        PaperProps={{ className: 'condition-modal' }}
      >
        <DialogTitle>
          <Typography variant="h6">Điều kiện sử dụng</Typography>
          <IconButton onClick={handleCloseModals} size="small" sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedVoucher && (
            <Box>
              <Typography variant="body2" paragraph>
                <strong>Giá trị giảm:</strong> {selectedVoucher.discount}
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Đơn tối thiểu:</strong> {selectedVoucher.minSpend?.toLocaleString('vi-VN')}đ
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Giảm tối đa:</strong> {selectedVoucher.maxDiscount?.toLocaleString('vi-VN')}đ
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Điểm cần để nhận:</strong> {selectedVoucher.points} điểm
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Hạn sử dụng:</strong> {selectedVoucher.expiry}
              </Typography>
              <Typography variant="body2">
                <strong>Áp dụng:</strong> {selectedVoucher.category}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModals}>Đóng</Button>
        </DialogActions>
      </Dialog>

    </div>
  );
}

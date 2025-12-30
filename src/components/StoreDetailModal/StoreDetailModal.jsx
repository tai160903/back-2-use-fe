import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBusinessSingleUseProductsApi } from '../../store/slices/singleUseProductTypeSlice';
import Loading from '../Loading/Loading';
import { LocalOffer } from '@mui/icons-material';
import './StoreDetailModal.css';

const StoreDetailModal = ({ isOpen, onClose, store, onUnblock }) => {
  const dispatch = useDispatch();
  const { businessSingleUseProducts, businessSingleUseProductsPagination, isLoading: singleUseLoading } = useSelector(
    (state) => state.singleUseProductType
  );
  const [singleUsePage, setSingleUsePage] = useState(1);

  useEffect(() => {
    if (isOpen && store?._id) {
      dispatch(getBusinessSingleUseProductsApi({ businessId: store._id, page: singleUsePage, limit: 10 }));
    }
  }, [isOpen, store?._id, singleUsePage, dispatch]);

  const handleClose = () => {
    setSingleUsePage(1);
    onClose();
  };

  const handleUnblockClick = () => {
    onUnblock(store);
    handleClose();
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    return timeString;
  };

  const getStatusBadge = () => {
    if (store?.isBlocked) {
      return <span className="status-badge status-blocked">Blocked</span>;
    }
    if (store?.isActive) {
      return <span className="status-badge status-active">Active</span>;
    }
    return <span className="status-badge status-inactive">Inactive</span>;
  };

  if (!isOpen || !store) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content-detail" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Store Details</h2>
          <button className="modal-close-btn" onClick={handleClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {/* Store Header */}
          <div className="store-header-section">
            <div className="store-logo-section">
              {store.businessLogoUrl ? (
                <img 
                  src={store.businessLogoUrl} 
                  alt={store.businessName}
                  className="store-logo"
                />
              ) : (
                <div className="store-logo-placeholder">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </div>
            <div className="store-info-section">
              <h3 className="store-name">{store.businessName}</h3>
              <p className="store-type">{store.businessType}</p>
              {getStatusBadge()}
            </div>
          </div>

          {/* Store Details */}
          <div className="store-details-section">
            <h4 className="section-title">Store Information</h4>
            
            <div className="detail-grid">
              <div className="detail-item">
                <div className="detail-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 10C21 17 12 23 12 23S3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Address
                </div>
                <div className="detail-value">{store.businessAddress}</div>
              </div>

              <div className="detail-item">
                <div className="detail-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7293C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92H4.18C3.90257 21.9451 3.62309 21.9119 3.35926 21.8227C3.09543 21.7335 2.85322 21.5901 2.64796 21.4019C2.4427 21.2136 2.27909 20.9845 2.16747 20.7293C2.05585 20.4742 1.9989 20.1985 2 19.92V16.92" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Phone
                </div>
                <div className="detail-value">{store.businessPhone}</div>
              </div>

              <div className="detail-item">
                <div className="detail-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Operating Hours
                </div>
                <div className="detail-value">
                  {formatTime(store.openTime)} - {formatTime(store.closeTime)}
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                    <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Created Date
                </div>
                <div className="detail-value">
                  {new Date(store.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>

              {store.businessMail && (
                <div className="detail-item">
                  <div className="detail-label">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Email
                  </div>
                  <div className="detail-value">{store.businessMail}</div>
                </div>
              )}

              {store.taxCode && (
                <div className="detail-item">
                  <div className="detail-label">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Tax Code
                  </div>
                  <div className="detail-value">{store.taxCode}</div>
                </div>
              )}
            </div>
          </div>

          {/* Block Reason (if blocked) */}
          {store.isBlocked && store.blockReason && (
            <div className="block-reason-section">
              <h4 className="section-title">Block Reason</h4>
              <div className="block-reason-content">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="warning-icon">
                  <path d="M10.29 3.86L1.82 18C1.64547 18.3024 1.5729 18.6453 1.61286 18.9873C1.65283 19.3293 1.80334 19.6507 2.04257 19.8999C2.2818 20.1491 2.59712 20.3123 2.93726 20.3645C3.2774 20.4167 3.62361 20.3553 3.93 20.19L12 16.27L20.07 20.19C20.3764 20.3553 20.7226 20.4167 21.0627 20.3645C21.4029 20.3123 21.7182 20.1491 21.9574 19.8999C22.1967 19.6507 22.3472 19.3293 22.3871 18.9873C22.4271 18.6453 22.3545 18.3024 22.18 18L13.71 3.86C13.5318 3.56631 13.2807 3.32312 12.9812 3.15447C12.6817 2.98582 12.3438 2.89725 12 2.89725C11.6562 2.89725 11.3183 2.98582 11.0188 3.15447C10.7193 3.32312 10.4682 3.56631 10.29 3.86Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 9V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 17H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p>{store.blockReason}</p>
              </div>
            </div>
          )}

          {/* Single-Use Products Section */}
          <div className="single-use-products-section">
            <h4 className="section-title">
              <LocalOffer sx={{ fontSize: 18, marginRight: 1, color: '#f57c00' }} />
              Single-Use Products ({businessSingleUseProductsPagination.total || 0})
            </h4>
            
            {singleUseLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                <Loading />
              </div>
            ) : businessSingleUseProducts.length === 0 ? (
              <div className="empty-products-message">
                <p>No single-use products found for this store.</p>
              </div>
            ) : (
              <>
                <div className="products-table">
                  <div className="products-table-header">
                    <div className="products-table-cell header-cell">Product Name</div>
                    <div className="products-table-cell header-cell">Type & Size</div>
                    <div className="products-table-cell header-cell">Material</div>
                    <div className="products-table-cell header-cell">Weight</div>
                    <div className="products-table-cell header-cell">Status</div>
                  </div>
                  {businessSingleUseProducts.map((product) => (
                    <div key={product._id} className="products-table-row">
                      <div className="products-table-cell">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {product.image || product.imageUrl ? (
                            <img 
                              src={product.image || product.imageUrl} 
                              alt={product.name}
                              style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'cover' }}
                            />
                          ) : (
                            <div style={{ width: '32px', height: '32px', borderRadius: '4px', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <LocalOffer sx={{ fontSize: 16, color: '#999' }} />
                            </div>
                          )}
                          <span style={{ fontWeight: 500 }}>{product.name}</span>
                        </div>
                      </div>
                      <div className="products-table-cell">
                        {product.productTypeId?.name || 'N/A'} - {product.productSizeId?.sizeName || 'N/A'}
                      </div>
                      <div className="products-table-cell">
                        {product.materialId?.materialName || 'N/A'}
                      </div>
                      <div className="products-table-cell">
                        {product.weight ? `${product.weight} g` : '-'}
                      </div>
                      <div className="products-table-cell">
                        <span className={`status-chip ${product.isActive ? 'active' : 'inactive'}`}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {businessSingleUseProductsPagination.totalPages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
                    <div className="pagination-controls">
                      <button
                        onClick={() => setSingleUsePage(prev => Math.max(1, prev - 1))}
                        disabled={singleUsePage === 1}
                        className="pagination-btn"
                      >
                        Previous
                      </button>
                      <span className="pagination-info">
                        Page {singleUsePage} of {businessSingleUseProductsPagination.totalPages}
                      </span>
                      <button
                        onClick={() => setSingleUsePage(prev => Math.min(businessSingleUseProductsPagination.totalPages, prev + 1))}
                        disabled={singleUsePage === businessSingleUseProductsPagination.totalPages}
                        className="pagination-btn"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button 
            type="button" 
            className="btn btn-cancel" 
            onClick={handleClose}
          >
            Close
          </button>
          {store.isBlocked && (
            <button 
              type="button" 
              className="btn btn-unblock"
              onClick={handleUnblockClick}
            >
              Unblock Store
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default StoreDetailModal;

import React, { useState, useEffect } from 'react';
import { IoIosSearch } from "react-icons/io";
import { GoPeople } from "react-icons/go";
import { FaEllipsisV, FaEdit, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  getAllStaffApi,
  createStaffApi,
  deleteStaffApi,
  updateStaffApi,
  getStaffByIdApi,
} from '../../../store/slices/staffSlice';
import { getProfileBusiness } from '../../../store/slices/userSlice';
import toast from 'react-hot-toast';
import './StaffManagement.css';

const schema = yup
  .object({
    fullName: yup.string().required('Full name is required'),
    email: yup
      .string()
      .required('Email is required')
      .email('Invalid email address'),
    phone: yup
      .string()
      .required('Phone number is required')
      .matches(/^[0-9]{10,11}$/, 'Phone number must be 10-11 digits'),
  })
  .required();

export default function StaffManagement() {
  const dispatch = useDispatch();
  const { staff, isLoading, error, total, currentPage, totalPages, staffDetail } = useSelector((state) => state.staff);
  const { businessInfo } = useSelector((state) => state.user);

  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [openMenuStaffId, setOpenMenuStaffId] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
    },
  });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    formState: { errors: editErrors },
    reset: resetEdit,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
    },
  });

  useEffect(() => {
    if (!businessInfo) {
      dispatch(getProfileBusiness());
    }
  }, [dispatch, businessInfo]);

  useEffect(() => {
    const params = {
      page: page,
      limit: limit,
    };
    if (searchTerm) {
      params.search = searchTerm;
    }
    if (statusFilter) {
      params.status = statusFilter;
    }
    dispatch(getAllStaffApi(params));
  }, [dispatch, page, limit, searchTerm, statusFilter]);

  const handleOpenDialog = () => {
    setOpenDialog(true);
    reset({
      fullName: '',
      email: '',
      phone: '',
    });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    reset({
      fullName: '',
      email: '',
      phone: '',
    });
  };

  const buildListParams = () => {
    const params = {
      page,
      limit,
    };
    if (searchTerm) params.search = searchTerm;
    if (statusFilter) params.status = statusFilter;
    return params;
  };

  const onSubmit = async (data) => {
    // Get businessId from businessInfo
    const businessId = businessInfo?.data?.business?._id || businessInfo?.data?.business?.businessId || businessInfo?.data?._id;
    
    if (!businessId) {
      toast.error('Business information not found. Please try again.');
      return;
    }

    const staffData = {
      businessId: businessId,
      fullName: data.fullName.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
    };

    try {
      const result = await dispatch(createStaffApi(staffData));
      if (createStaffApi.fulfilled.match(result)) {
        toast.success('Staff account created successfully!');
        handleCloseDialog();
        // Làm mới danh sách staff với params hiện tại
        dispatch(getAllStaffApi(buildListParams()));
      } else {
        const errorMessage = result.payload?.message || result.payload?.error || 'An error occurred while creating staff account';
        toast.error(errorMessage);
      }
    } catch (err) {
      toast.error('An error occurred while creating staff account');
      console.error('Error creating staff:', err);
    }
  };

  const getStatusInfo = (status) => {
    if (status === "active" || status === "Active") {
      return { statusText: "Active", statusClass: "active" };
    }
    if (status === "inactive" || status === "Inactive") {
      return { statusText: "Inactive", statusClass: "blocked" };
    }
    if (status === "removed" || status === "Removed") {
      return { statusText: "Removed", statusClass: "blocked" };
    }
    return { statusText: "Inactive", statusClass: "blocked" };
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setPage(1); 
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    setPage(1); 
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenDetail = (staffMember) => {
    setSelectedStaff(staffMember);
    setOpenDetailModal(true);
    setOpenMenuStaffId(null);
    if (staffMember?._id || staffMember?.id) {
      dispatch(getStaffByIdApi(staffMember._id || staffMember.id));
    }
  };

  const handleMenuToggle = (id) => {
    setOpenMenuStaffId((prev) => (prev === id ? null : id));
  };

  const handleCloseDetail = () => {
    setOpenDetailModal(false);
  };

  const handleOpenEdit = (staffMember) => {
    setSelectedStaff(staffMember);
    resetEdit({
      fullName: staffMember.fullName || '',
      email: staffMember.email || '',
      phone: staffMember.phone || '',
    });
    setOpenEditModal(true);
    setOpenMenuStaffId(null);
  };

  const handleCloseEdit = () => {
    setOpenEditModal(false);
  };

  const handleOpenDelete = (staffMember) => {
    setSelectedStaff(staffMember);
    setOpenDeleteModal(true);
    setOpenMenuStaffId(null);
  };

  const handleCloseDelete = () => {
    setOpenDeleteModal(false);
  };

//   edit  & create
  const onSubmitEdit = async (data) => {
    if (!selectedStaff) return;
    const id = selectedStaff._id || selectedStaff.id;

    const updateData = {
      fullName: data.fullName.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
    };

    try {
      const result = await dispatch(updateStaffApi({ id, data: updateData }));
      if (updateStaffApi.fulfilled.match(result)) {
        toast.success('Staff updated successfully!');
        setOpenEditModal(false);
        dispatch(getAllStaffApi(buildListParams()));
      } else {
        const errorMessage = result.payload?.message || result.payload?.error || 'An error occurred while updating staff';
        toast.error(errorMessage);
      }
    } catch (err) {
      toast.error('An error occurred while updating staff');
      console.error('Error updating staff:', err);
    }
  };

//   delete
  const handleConfirmDelete = async () => {
    if (!selectedStaff) return;
    const id = selectedStaff._id || selectedStaff.id;

    try {
      const result = await dispatch(deleteStaffApi(id));
      if (deleteStaffApi.fulfilled.match(result)) {
        toast.success('Staff deleted successfully!');
        setOpenDeleteModal(false);
        dispatch(getAllStaffApi(buildListParams()));
      } else {
        const errorMessage = result.payload?.message || result.payload?.error || 'An error occurred while deleting staff';
        toast.error(errorMessage);
      }
    } catch (err) {
      toast.error('An error occurred while deleting staff');
      console.error('Error deleting staff:', err);
    }
  };

  return (
    <div className="staff-management-page">
      {/* Header */}
      <div className="staff-management-header">
        <div className="staff-management-title-section">
          <GoPeople className="staff-management-title-icon" />
          <div>
            <h1 className="staff-management-title">Staff Management</h1>
            <p className="staff-management-description">
              Create and manage staff accounts for your store
            </p>
          </div>
        </div>
        <button
          className="add-staff-button"
          onClick={handleOpenDialog}
        >
          <span>+</span>
          <span>Create Staff Account</span>
        </button>
      </div>

      {error && (
        <div className="staff-error-alert">
          {error.message || 'An error occurred while loading staff list'}
        </div>
      )}

      {/* Search & Filters */}
      <div className="staff-management-filters">
        <div className="search-container">
          <IoIosSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, email, or phone number..."
            value={searchTerm}
            onChange={(event) => handleSearchChange(event.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-container">
          <select
            value={statusFilter}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="status-filter-select"
          >
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="removed">Removed</option>
          </select>
        </div>
      </div>

      {/* Table header */}
      <div className="staff-management-table-header">
        <div className="staff-management-header-cell">Name</div>
        <div className="staff-management-header-cell">Email</div>
        <div className="staff-management-header-cell">Phone</div>
        <div className="staff-management-header-cell">Created at</div>
        <div className="staff-management-header-cell">Status</div>
        <div className="staff-management-header-cell staff-actions-header">Actions</div>
      </div>

      {/* Rows */}
      {staff.length === 0 ? (
        <div className="staff-management-empty">
          {searchTerm || statusFilter ? 'No staff matches the current filters.' : 'No staff yet. Create the first staff account!'}
        </div>
      ) : (
        <>
          <div className="staff-management-cards">
            {staff.map((staffMember) => {
              const { statusText, statusClass } = getStatusInfo(staffMember.status);
              const isRemovedStatus =
                staffMember.status === 'removed' || staffMember.status === 'Removed';
              const createdAt = staffMember.createdAt 
                ? new Date(staffMember.createdAt).toLocaleDateString('en-GB', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                : 'N/A';
              
              return (
                <div
                  key={staffMember._id || staffMember.id}
                  className={`staff-management-card ${
                    openMenuStaffId === (staffMember._id || staffMember.id) ? 'menu-open' : ''
                  }`}
                  onClick={() => handleOpenDetail(staffMember)}
                >
                  <div className="staff-management-card-cell">
                    <div className="staff-name">
                      {staffMember.fullName || 'N/A'}
                    </div>
                  </div>

                  <div className="staff-management-card-cell">
                    <div className="staff-email">
                      {staffMember.email || 'N/A'}
                    </div>
                  </div>

                  <div className="staff-management-card-cell">
                    <div className="staff-phone">
                      {staffMember.phone || 'N/A'}
                    </div>
                  </div>

                  <div className="staff-management-card-cell">
                    <div className="staff-created-at">
                      {createdAt}
                    </div>
                  </div>

                  <div className="staff-management-card-cell">
                    <div className={`status-indicator ${statusClass}`}>
                      <div className={`status-dot ${statusClass}`}></div>
                      <span className="status-text">{statusText}</span>
                    </div>
                  </div>

                  <div className="staff-management-card-cell">
                    <div className="action-menu-container">
                      <div
                        className="action-menu"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMenuToggle(staffMember._id || staffMember.id);
                        }}
                      >
                        <FaEllipsisV size={16} />
                      </div>

                      {openMenuStaffId === (staffMember._id || staffMember.id) && (
                        <div className="dropdown-menu">
                          <div
                            className="dropdown-item edit"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEdit(staffMember);
                            }}
                          >
                            <FaEdit className="dropdown-icon" />
                            <span>Edit Staff</span>
                          </div>
                          {isRemovedStatus ? (
                            <div className="dropdown-item delete disabled">
                              <FaTrash className="dropdown-icon" />
                              <span>Removed</span>
                            </div>
                          ) : (
                            <div
                              className="dropdown-item delete"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenDelete(staffMember);
                              }}
                            >
                              <FaTrash className="dropdown-icon" />
                              <span>Delete Staff</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="staff-pagination">
              <button
                className="pagination-btn"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1 || isLoading}
              >
                Previous
              </button>
              <div className="pagination-info">
                Page {currentPage} / {totalPages} (Total: {total} staff)
              </div>
              <button
                className="pagination-btn"
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages || isLoading}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Detail Staff Modal */}
      {openDetailModal && (
        <div
          className="staff-modal-backdrop"
          onClick={handleCloseDetail}
        >
          <div
            className="staff-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="staff-modal-header">
              <h2>Staff Details</h2>
              <button
                className="staff-modal-close-btn"
                onClick={handleCloseDetail}
              >
                ×
              </button>
            </div>
            <div className="staff-modal-content staff-detail-content">
              {(() => {
                const detail = staffDetail || selectedStaff;
                if (!detail) {
                  return <p>No staff data.</p>;
                }
                return (
                  <div className="staff-detail-grid">
                    <div className="staff-detail-row">
                      <span className="label">Name:</span>
                      <span className="value">{detail.fullName || 'N/A'}</span>
                    </div>
                    <div className="staff-detail-row">
                      <span className="label">Phone:</span>
                      <span className="value">{detail.phone || 'N/A'}</span>
                    </div>
                    <div className="staff-detail-row">
                      <span className="label">Email:</span>
                      <span className="value">{detail.email || 'N/A'}</span>
                    </div>
                    <div className="staff-detail-row">
                      <span className="label">Status:</span>
                      <span className="value">{detail.status || 'N/A'}</span>
                    </div>
                    <div className="staff-detail-row">
                      <span className="label">Created at:</span>
                      <span className="value">
                        {detail.createdAt
                          ? new Date(detail.createdAt).toLocaleString('en-GB')
                          : 'N/A'}
                      </span>
                    </div>
                    <div className="staff-detail-row">
                      <span className="label">Updated at:</span>
                      <span className="value">
                        {detail.updatedAt
                          ? new Date(detail.updatedAt).toLocaleString('en-GB')
                          : 'N/A'}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>
            <div className="staff-modal-footer">
              <button
                type="button"
                className="staff-modal-cancel-btn"
                onClick={handleCloseDetail}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Staff Modal */}
      {openEditModal && (
        <div
          className="staff-modal-backdrop"
          onClick={handleCloseEdit}
        >
          <div
            className="staff-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="staff-modal-header">
              <h2>Edit Staff</h2>
              <button
                className="staff-modal-close-btn"
                onClick={handleCloseEdit}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmitEdit(onSubmitEdit)}>
              <div className="staff-modal-content">
                <div className="staff-form-group">
                  <label htmlFor="editFullName">Full name <span className="required">*</span></label>
                  <input
                    type="text"
                    id="editFullName"
                    {...registerEdit('fullName')}
                    className={editErrors.fullName ? 'error' : ''}
                    placeholder="Enter full name"
                  />
                  {editErrors.fullName && (
                    <span className="error-message">{editErrors.fullName.message}</span>
                  )}
                </div>

                <div className="staff-form-group">
                  <label htmlFor="editEmail">Email <span className="required">*</span></label>
                  <input
                    type="email"
                    id="editEmail"
                    {...registerEdit('email')}
                    className={editErrors.email ? 'error' : ''}
                    placeholder="Enter email"
                  />
                  {editErrors.email && (
                    <span className="error-message">{editErrors.email.message}</span>
                  )}
                </div>

                <div className="staff-form-group">
                  <label htmlFor="editPhone">Phone number <span className="required">*</span></label>
                  <input
                    type="tel"
                    id="editPhone"
                    {...registerEdit('phone')}
                    className={editErrors.phone ? 'error' : ''}
                    placeholder="Enter phone number (10-11 digits)"
                  />
                  {editErrors.phone && (
                    <span className="error-message">{editErrors.phone.message}</span>
                  )}
                </div>
              </div>
              <div className="staff-modal-footer">
                <button
                  type="button"
                  className="staff-modal-cancel-btn"
                  onClick={handleCloseEdit}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="staff-modal-submit-btn"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm modal */}
      {openDeleteModal && (
        <div
          className="staff-modal-backdrop"
          onClick={handleCloseDelete}
        >
          <div
            className="staff-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="staff-modal-header">
              <h2>Delete Staff</h2>
              <button
                className="staff-modal-close-btn"
                onClick={handleCloseDelete}
              >
                ×
              </button>
            </div>
            <div className="staff-modal-content">
              <p>
                Are you sure you want to delete staff{' '}
                <strong>{selectedStaff?.fullName || selectedStaff?.email}</strong>
                ? This action cannot be undone.
              </p>
            </div>
            <div className="staff-modal-footer">
              <button
                type="button"
                className="staff-modal-cancel-btn"
                onClick={handleCloseDelete}
              >
                Cancel
              </button>
              <button
                type="button"
                className="staff-modal-submit-btn delete-btn"
                onClick={handleConfirmDelete}
                disabled={isLoading}
              >
                {isLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Staff Modal */}
      {openDialog && (
        <div
          className="staff-modal-backdrop"
          onClick={handleCloseDialog}
        >
          <div
            className="staff-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="staff-modal-header">
              <h2>Create New Staff Account</h2>
              <button
                className="staff-modal-close-btn"
                onClick={handleCloseDialog}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="staff-modal-content">
                <div className="staff-form-group">
                  <label htmlFor="fullName">Full name <span className="required">*</span></label>
                  <input
                    type="text"
                    id="fullName"
                    {...register('fullName')}
                    className={errors.fullName ? 'error' : ''}
                    placeholder="Enter full name"
                  />
                  {errors.fullName && (
                    <span className="error-message">{errors.fullName.message}</span>
                  )}
                </div>

                <div className="staff-form-group">
                  <label htmlFor="email">Email <span className="required">*</span></label>
                  <input
                    type="email"
                    id="email"
                    {...register('email')}
                    className={errors.email ? 'error' : ''}
                    placeholder="Enter email"
                  />
                  {errors.email && (
                    <span className="error-message">{errors.email.message}</span>
                  )}
                </div>

                <div className="staff-form-group">
                  <label htmlFor="phone">Phone number <span className="required">*</span></label>
                  <input
                    type="tel"
                    id="phone"
                    {...register('phone')}
                    className={errors.phone ? 'error' : ''}
                    placeholder="Enter phone number (10-11 digits)"
                  />
                  {errors.phone && (
                    <span className="error-message">{errors.phone.message}</span>
                  )}
                </div>
              </div>
              <div className="staff-modal-footer">
                <button
                  type="button"
                  className="staff-modal-cancel-btn"
                  onClick={handleCloseDialog}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="staff-modal-submit-btn"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating...' : 'Create account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

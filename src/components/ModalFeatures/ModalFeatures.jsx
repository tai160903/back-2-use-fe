import React, { useState, useEffect } from "react";
import "./ModalFeatures.css";
import { 
  MdClose, 
  MdAdd, 
  MdEdit, 
  MdDelete,
  MdSave,
  MdCancel,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { 
  TextField,
  Button,
  Box,
  Typography,
  Alert
} from "@mui/material";
import { 
  updateSubscriptionFeatures, 
  deleteSubscriptionFeature,
  getALLSubscriptions
} from "../../store/slices/subscriptionSlice";
import toast from "react-hot-toast";

// Validation schema
const featureSchema = yup.object({
  featureName: yup
    .string()
    .required("Feature name is required")
    .min(3, "Feature name must be at least 3 characters")
    .max(100, "Feature name cannot exceed 100 characters")
    .matches(
      /^[a-zA-ZÀ-ỹ0-9\s\-_.,!?()]+$/,
      "Feature name can only contain letters, numbers and basic special characters"
    ),
});

export default function ModalFeatures({ open, onClose }) {
  const dispatch = useDispatch();
  const { subscription } = useSelector(state => state.subscription);
  
  // Get features from subscription data
  const features = subscription.data?.description || [];
  const isLoading = subscription.isLoading || false;
  
  // Ensure features is always an array
  const featuresList = Array.isArray(features) ? features : [];
  
  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(featureSchema),
    defaultValues: {
      featureName: "",
    },
  });

  const [editingFeature, setEditingFeature] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [featureToDelete, setFeatureToDelete] = useState(null);

  useEffect(() => {
    if (open) {
      dispatch(getALLSubscriptions());
    }
  }, [dispatch, open]);

  const handleAddNew = () => {
    setIsAddingNew(true);
    reset({ featureName: "" });
  };

  const onSubmitNew = async (data) => {
    try {
      const updatedFeatures = [...featuresList, data.featureName.trim()];
      await dispatch(updateSubscriptionFeatures(updatedFeatures)).unwrap();
      toast.success("Feature added successfully!");
      setIsAddingNew(false);
      reset();
      // Refresh data after successful addition
      dispatch(getALLSubscriptions());
    } catch (error) {
      toast.error(error.message || "An error occurred while adding the feature");
    }
  };

  const handleCancelNew = () => {
    setIsAddingNew(false);
    reset();
  };

  const handleEditFeature = (feature, index) => {
    setEditingFeature({ feature, index });
    setValue("featureName", feature);
  };

  const onSubmitEdit = async (data) => {
    try {
      const updatedFeatures = [...featuresList];
      updatedFeatures[editingFeature.index] = data.featureName.trim();
      await dispatch(updateSubscriptionFeatures(updatedFeatures)).unwrap();
      toast.success("Feature updated successfully!");
      setEditingFeature(null);
      reset();
      // Refresh data after successful update
      dispatch(getALLSubscriptions());
    } catch (error) {
      toast.error(error.message || "An error occurred while updating the feature");
    }
  };

  const handleCancelEdit = () => {
    setEditingFeature(null);
    reset();
  };

  const handleDeleteFeature = (feature) => {
    setFeatureToDelete(feature);
    setShowDeleteConfirm(true);
  };

  
  const handleConfirmDelete = async () => {
    if (featureToDelete) {
      try {
        await dispatch(deleteSubscriptionFeature(featureToDelete)).unwrap();
        toast.success("Feature deleted successfully!");
        dispatch(getALLSubscriptions());
      } catch (error) {
        toast.error(error.message || "An error occurred while deleting the feature");
      }
    }
    setShowDeleteConfirm(false);
    setFeatureToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setFeatureToDelete(null);
  };

  const handleClose = () => {
    setEditingFeature(null);
    setIsAddingNew(false);
    setShowDeleteConfirm(false);
    setFeatureToDelete(null);
    reset();
    onClose();
  };

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-features">
        <div className="modal-features-header">
          <h2 className="modal-features-title">Manage Features</h2>
          <button className="modal-close-btn" onClick={handleClose}>
            <MdClose size={24} />
          </button>
        </div>

        <div className="modal-features-content">
          <div className="features-list-header">
            <h3>Current Features List</h3>
            <button 
              className="add-feature-btn"
              onClick={handleAddNew}
              disabled={isAddingNew}
            >
              <MdAdd size={20} />
              Add New Feature
            </button>
          </div>

          <div className="features-list">
            {isLoading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Loading...</p>
              </div>
            ) : (
              <>
                {featuresList.map((feature, index) => (
                  <div key={index} className="feature-item">
                    {editingFeature?.index === index ? (
                      <EditFeatureItem
                        onSubmit={handleSubmit(onSubmitEdit)}
                        onCancel={handleCancelEdit}
                        errors={errors}
                        isSubmitting={isSubmitting}
                        register={register}
                      />
                    ) : (
                      <FeatureItem
                        feature={feature}
                        onEdit={() => handleEditFeature(feature, index)}
                        onDelete={() => handleDeleteFeature(feature)}
                      />
                    )}
                  </div>
                ))}

                {isAddingNew && (
                  <div className="feature-item">
                    <AddFeatureItem
                      onSubmit={handleSubmit(onSubmitNew)}
                      onCancel={handleCancelNew}
                      errors={errors}
                      isSubmitting={isSubmitting}
                      register={register}
                    />
                  </div>
                )}

                {featuresList.length === 0 && !isAddingNew && (
                  <div className="empty-features">
                    <p>No features available</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="delete-confirm-overlay">
          <div className="delete-confirm-modal">
            <div className="delete-confirm-header">
              <h3>Confirm Delete</h3>
            </div>
            <div className="delete-confirm-content">
              <p>Are you sure you want to delete this feature:</p>
              <div className="feature-to-delete">
                <MdDelete size={20} />
                <span>"{featureToDelete}"</span>
              </div>
              <p className="warning-text">This action cannot be undone!</p>
            </div>
            <div className="delete-confirm-actions">
              <button 
                className="cancel-btn"
                onClick={handleCancelDelete}
              >
                <MdCancel size={16} />
                Cancel
              </button>
              <button 
                className="confirm-delete-btn"
                onClick={handleConfirmDelete}
              >
                <MdDelete size={16} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Component cho từng feature item
function FeatureItem({ feature, onEdit, onDelete }) {
  return (
    <div className="feature-item-content">
      <div className="feature-text">
        <span className="feature-bullet">•</span>
        <span className="feature-name">{feature}</span>
      </div>
      <div className="feature-actions">
        <button 
   
          onClick={onEdit}
          title="Edit"
        >
          <MdEdit style={{ color: "green", fontSize: "20px" }}/>
        </button>
        <button 
        
          onClick={onDelete}
          title="Delete"
        >
          <MdDelete style={{ color: "red", fontSize: "20px" }}/>
        </button>
      </div>
    </div>
  );
}

// Component cho chỉnh sửa feature
function EditFeatureItem({ onSubmit, onCancel, errors, isSubmitting, register }) {
  const handleKeyPress = (e) => {
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <Box component="form" onSubmit={onSubmit} className="edit-feature-content">
      <Box className="input-group">
        <TextField
          {...register("featureName")}
          onKeyDown={handleKeyPress}
          variant="outlined"
          size="small"
          fullWidth
          autoFocus
          error={!!errors.featureName}
          helperText={errors.featureName?.message}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              fontSize: '16px',
            },
            '& .MuiFormHelperText-root': {
              fontSize: '12px',
              marginTop: '4px',
            }
          }}
        />
      </Box>
      <Box className="edit-actions">
        <Button 
          type="submit"
          variant="contained"
          size="small"
          disabled={isSubmitting}
          startIcon={<MdSave size={16} />}
          sx={{
            backgroundColor: '#10b981',
            '&:hover': {
              backgroundColor: '#059669',
            },
            minWidth: 'auto',
            padding: '6px 12px',
          }}
        >
          Save
        </Button>
        <Button 
          type="button"
          variant="outlined"
          size="small"
          onClick={onCancel}
          startIcon={<MdCancel size={16} />}
          sx={{
            borderColor: '#6b7280',
            color: '#6b7280',
            '&:hover': {
              borderColor: '#374151',
              backgroundColor: '#f3f4f6',
            },
            minWidth: 'auto',
            padding: '6px 12px',
          }}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
}

// Component cho thêm feature mới
function AddFeatureItem({ onSubmit, onCancel, errors, isSubmitting, register }) {
  const handleKeyPress = (e) => {
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <Box component="form" onSubmit={onSubmit} className="add-feature-content">
      <Box className="input-group">
        <TextField
          {...register("featureName")}
          onKeyDown={handleKeyPress}
          variant="outlined"
          size="small"
          fullWidth
          placeholder="Enter new feature name..."
          autoFocus
          error={!!errors.featureName}
          helperText={errors.featureName?.message}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              fontSize: '16px',
            },
            '& .MuiFormHelperText-root': {
              fontSize: '12px',
              marginTop: '4px',
            }
          }}
        />
      </Box>
      <Box className="add-actions">
        <Button 
          type="submit"
          variant="contained"
          size="small"
          disabled={isSubmitting}
          startIcon={<MdSave size={16} />}
          sx={{
            backgroundColor: '#10b981',
            '&:hover': {
              backgroundColor: '#059669',
            },
            minWidth: 'auto',
            padding: '6px 12px',
          }}
        >
          Add
        </Button>
        <Button 
          type="button"
          variant="outlined"
          size="small"
          onClick={onCancel}
          startIcon={<MdCancel size={16} />}
          sx={{
            borderColor: '#6b7280',
            color: '#6b7280',
            '&:hover': {
              borderColor: '#374151',
              backgroundColor: '#f3f4f6',
            },
            minWidth: 'auto',
            padding: '6px 12px',
          }}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
}

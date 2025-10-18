import  {  useEffect } from "react";
import "./ModalSubscriptions.css";
import { IoClose } from "react-icons/io5";
import { MdPayment } from "react-icons/md";
import { 
  TextField, 
  Button, 
  FormControlLabel, 
  Checkbox, 
  Box,
  Typography
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { createSubscription, updateSubscription } from "../../store/slices/subscriptionSlice";
import toast from "react-hot-toast";

// Yup validation schema
const subscriptionSchema = yup.object({
  name: yup
    .string()
    .required("Subscription plan name is required")
    .min(2, "Plan name must be at least 2 characters")
    .max(50, "Plan name cannot exceed 50 characters"),
  price: yup
    .number()
    .required("Price is required")
    .min(0, "Price cannot be negative")
    .integer("Price must be an integer"),
  durationInDays: yup
    .number()
    .required("Duration is required")
    .min(1, "Duration must be at least 1 day")
    .max(365, "Duration cannot exceed 365 days")
    .integer("Duration must be an integer"),
  isActive: yup.boolean(),
  isTrial: yup.boolean()
});

export default function ModalSubscriptions({ open, onClose, selectedItem, mode = "view" }) {
  const dispatch = useDispatch();
  const { isLoading, error, subscription } = useSelector(state => state.subscription);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(subscriptionSchema),
    defaultValues: {
      name: "",
      price: "",
      durationInDays: "",
      isActive: true,
      isTrial: false
    }
  });

  // Reset form when modal opens or selectedItem changes
  useEffect(() => {
    if (mode === "edit" && selectedItem) {
      reset({
        name: selectedItem.name || "",
        price: selectedItem.price || "",
        durationInDays: selectedItem.durationInDays || "",
        isActive: selectedItem.isActive !== undefined ? selectedItem.isActive : true,
        isTrial: selectedItem.isTrial !== undefined ? selectedItem.isTrial : false
      });
    } else if (mode === "create") {
      reset({
        name: "",
        price: "",
        durationInDays: "",
        isActive: true,
        isTrial: false
      });
    }
  }, [mode, selectedItem, reset]);

  if (!open) return null;


  const onSubmit = async (data) => {
    if (mode === "create") {
      try {
        await dispatch(createSubscription(data)).unwrap();
        toast.success("Subscription plan created successfully!");
        onClose();
      } catch (error) {
        toast.error(error.message || "An error occurred while creating the subscription plan");
      }
    } else if (mode === "edit") {
      try {
        await dispatch(updateSubscription({ id: selectedItem._id, data })).unwrap();
        toast.success("Subscription plan updated successfully!");
        onClose();
      } catch (error) {
        toast.error(error.message || "An error occurred while updating the subscription plan");
      }
    }
  };


  const renderActionButtons = () => {
    if (mode === "create") {
      return (
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button 
            variant="outlined" 
            onClick={onClose}
            sx={{ 
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '16px',
              px: 3,
              py: 1.5,
              borderWidth: '1px',
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            sx={{ 
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '16px',
              px: 4,
              py: 1.5,
              backgroundColor: '#174d31',
              '&:hover': {
                backgroundColor: '#0f3d26'
              },
              '&:disabled': {
                backgroundColor: '#9ca3af'
              }
            }}
          >
            {isSubmitting ? 'Creating...' : 'Create Subscription'}
          </Button>
        </Box>
      );
    }

    if (mode === "edit") {
      return (
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button 
            variant="outlined" 
            onClick={onClose}
            sx={{ 
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '16px',
              px: 3,
              py: 1.5,
              borderWidth: '1px',
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            sx={{ 
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '16px',
              px: 4,
              py: 1.5,
              backgroundColor: '#174d31',
              '&:hover': {
                backgroundColor: '#0f3d26'
              },
              '&:disabled': {
                backgroundColor: '#9ca3af'
              }
            }}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      );
    }
   
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-section">
            <div className="modal-icon">
              <MdPayment />
            </div>
            <div>
              <h2 className="modal-title">
                {mode === "create" ? "Create New Subscription Plan" : 
                 mode === "edit" ? "Edit Subscription Plan" : 
                 "Subscription Plan Details"}
              </h2>
              <p className="modal-subtitle">
                {mode === "create" ? "Add a new subscription plan" : 
                 mode === "edit" ? `Edit: ${selectedItem?.name || "Subscription Plan"}` :
                 selectedItem?.name || "Subscription Plan"}
              </p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <IoClose />
          </button>
        </div>

        <div className="modal-content">
          <Box sx={{ p: 3 }}>
            {/* Plan Information & Settings */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#374151' }}>
                Plan Information & Settings
              </Typography>
              
              {mode === "view" ? (
                /* View Mode - Display Information */
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
                  gap: 3
                }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                      <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 500, mb: 1 }}>
                        Plan Name
                      </Typography>
                      <Typography variant="h6" sx={{ color: '#1a1a1a', fontWeight: 600 }}>
                        {selectedItem?.name || 'N/A'}
                      </Typography>
                    </Box>
                    <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                      <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 500, mb: 1 }}>
                        Price
                      </Typography>
                      <Typography variant="h6" sx={{ color: '#1a1a1a', fontWeight: 600 }}>
                        {selectedItem?.price === 0 ? 'Free' : `${selectedItem?.price?.toLocaleString() || 0} VND`}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                      <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 500, mb: 1 }}>
                        Duration
                      </Typography>
                      <Typography variant="h6" sx={{ color: '#1a1a1a', fontWeight: 600 }}>
                        {selectedItem?.durationInDays || 0} days
                      </Typography>
                    </Box>
                    <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                      <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 500, mb: 1 }}>
                        Status
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Box sx={{ 
                          px: 2, 
                          py: 1, 
                          borderRadius: '20px', 
                          backgroundColor: selectedItem?.isActive ? '#dcfce7' : '#fee2e2',
                          color: selectedItem?.isActive ? '#166534' : '#dc2626',
                          fontSize: '12px',
                          fontWeight: 600,
                          textTransform: 'uppercase'
                        }}>
                          {selectedItem?.isActive ? 'Active' : 'Inactive'}
                        </Box>
                        {selectedItem?.isTrial && (
                          <Box sx={{ 
                            px: 2, 
                            py: 1, 
                            borderRadius: '20px', 
                            backgroundColor: '#fef3c7',
                            color: '#92400e',
                            fontSize: '12px',
                            fontWeight: 600,
                            textTransform: 'uppercase'
                          }}>
                            Trial Plan
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              ) : (
                /* Create/Edit Mode - Form Fields */
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Plan Name *"
                        required
                        placeholder="e.g., Premium Plan, Basic Plan"
                        variant="outlined"
                        fullWidth
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                            fontSize: '16px',
                          },
                          '& .MuiInputLabel-root': {
                            fontSize: '16px',
                            fontWeight: 600,
                            color: '#374151',
                          },
                          '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#174d31',
                            borderWidth: '2px',
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#174d31',
                          }
                        }}
                      />
                    )}
                  />
                  
                  <Controller
                    name="price"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Price (VND) *"
                        type="number"
                        required
                        placeholder="e.g., 1999"
                        variant="outlined"
                        fullWidth
                        error={!!errors.price}
                        helperText={errors.price?.message}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                            fontSize: '16px',
                          },
                          '& .MuiInputLabel-root': {
                            fontSize: '16px',
                            fontWeight: 600,
                            color: '#374151',
                          },
                          '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#174d31',
                            borderWidth: '2px',
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#174d31',
                          }
                        }}
                      />
                    )}
                  />
                  
                  <Controller
                    name="durationInDays"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Duration (Days) *"
                        type="number"
                        required
                        placeholder="e.g., 30"
                        variant="outlined"
                        fullWidth
                        error={!!errors.durationInDays}
                        helperText={errors.durationInDays?.message}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? "" : parseInt(value) || "");
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                            fontSize: '16px',
                          },
                          '& .MuiInputLabel-root': {
                            fontSize: '16px',
                            fontWeight: 600,
                            color: '#374151',
                          },
                          '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#174d31',
                            borderWidth: '2px',
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#174d31',
                          }
                        }}
                      />
                    )}
                  />
                  
                  {/* Checkboxes in same row */}
                  <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    <Controller
                      name="isActive"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={
                            <Checkbox
                              {...field}
                              checked={field.value}
                              sx={{
                                color: '#174d31',
                                '&.Mui-checked': {
                                  color: '#174d31',
                                },
                                transform: 'scale(1.1)',
                              }}
                            />
                          }
                          label="Active Status"
                          sx={{
                            '& .MuiFormControlLabel-label': {
                              fontWeight: 500,
                              color: '#374151',
                              fontSize: '16px'
                            }
                          }}
                        />
                      )}
                    />
                    <Controller
                      name="isTrial"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={
                            <Checkbox
                              {...field}
                              checked={field.value}
                              sx={{
                                color: '#174d31',
                                '&.Mui-checked': {
                                  color: '#174d31',
                                },
                                transform: 'scale(1.1)',
                              }}
                            />
                          }
                          label="Trial Plan"
                          sx={{
                            '& .MuiFormControlLabel-label': {
                              fontWeight: 500,
                              color: '#374151',
                              fontSize: '16px'
                            }
                          }}
                        />
                      )}
                    />
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </div>

        <Box sx={{ p: 4, backgroundColor: '#f8f9fa' }}>
          {renderActionButtons()}
        </Box>
      </div>
    </div>
  );
}

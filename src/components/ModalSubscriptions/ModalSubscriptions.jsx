import  {  useEffect, useState } from "react";
import "./ModalSubscriptions.css";
import { IoClose } from "react-icons/io5";
import { MdPayment } from "react-icons/md";
import { 
  TextField, 
  Button, 
  FormControlLabel, 
  Checkbox, 
  Box,
  Typography,
  Grid,
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
  productGroupLimit: yup
    .number()
    .required("Product group limit is required")
    .min(-1, "Product group limit cannot be less than -1")
    .integer("Product group limit must be an integer"),
  productItemLimit: yup
    .number()
    .required("Product item limit is required")
    .min(-1, "Product item limit cannot be less than -1")
    .integer("Product item limit must be an integer"),
  exportLevel: yup
    .string()
    .required("Export level is required"),
  ecoBonusPercent: yup
    .number()
    .required("Eco bonus percent is required")
    .min(0, "Eco bonus percent cannot be negative")
    .max(100, "Eco bonus percent cannot exceed 100")
    .integer("Eco bonus percent must be an integer"),
  isActive: yup.boolean(),
  isTrial: yup.boolean()
});

export default function ModalSubscriptions({ open, onClose, selectedItem, mode = "view" }) {
  const dispatch = useDispatch();
  const { subscriptionDetails } = useSelector(state => state.subscription);
  const [isUnlimitedGroup, setIsUnlimitedGroup] = useState(false);
  const [isUnlimitedItem, setIsUnlimitedItem] = useState(false);
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
      productGroupLimit: "",
      productItemLimit: "",
      exportLevel: "",
      ecoBonusPercent: "",
      isActive: true,
      isTrial: false
    }
  });

  // Reset form when modal opens or selectedItem changes
  useEffect(() => {
    if (mode === "edit" && selectedItem) {
      const limits = selectedItem.limits || {};
      setIsUnlimitedGroup(limits.productGroupLimit === -1);
      setIsUnlimitedItem(limits.productItemLimit === -1);
      reset({
        name: selectedItem.name || "",
        price: selectedItem.price || "",
        durationInDays: selectedItem.durationInDays || "",
        productGroupLimit: limits.productGroupLimit ?? "",
        productItemLimit: limits.productItemLimit ?? "",
        exportLevel: limits.exportLevel || "",
        ecoBonusPercent: limits.ecoBonusPercent ?? "",
        isActive: selectedItem.isActive !== undefined ? selectedItem.isActive : true,
        isTrial: selectedItem.isTrial !== undefined ? selectedItem.isTrial : false
      });
    } else if (mode === "create") {
      setIsUnlimitedGroup(false);
      setIsUnlimitedItem(false);
      reset({
        name: "",
        price: "",
        durationInDays: "",
        productGroupLimit: "",
        productItemLimit: "",
        exportLevel: "",
        ecoBonusPercent: "",
        isActive: true,
        isTrial: false
      });
    }
  }, [mode, selectedItem, reset]);

  if (!open) return null;


  // function submit form
  const onSubmit = async (data) => {
    const payload = {
      name: data.name,
      price: Number(data.price),
      durationInDays: Number(data.durationInDays),
      isActive: data.isActive,
      isTrial: data.isTrial,
      limits: {
        productGroupLimit: isUnlimitedGroup ? -1 : Number(data.productGroupLimit),
        productItemLimit: isUnlimitedItem ? -1 : Number(data.productItemLimit),
        exportLevel: data.exportLevel,
        ecoBonusPercent: Number(data.ecoBonusPercent),
      },
    };

    if (mode === "create") {
      try {
        await dispatch(createSubscription(payload)).unwrap();
        toast.success("Subscription plan created successfully!");
        onClose();
      } catch (error) {
        toast.error(error.message || "An error occurred while creating the subscription plan");
      }
    } else if (mode === "edit") {
      try {
        await dispatch(updateSubscription({ id: selectedItem._id, data: payload })).unwrap();
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
                 subscriptionDetails?.data?._doc?.name || selectedItem?.name || "Subscription Plan"}
              </p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <IoClose />
          </button>
        </div>

        <div className="modal-content-subscriptions">
          <Box sx={{ p: 2 }}>
            {mode === "view" ? (
              <>
                {/* View Mode - Display Information */}
                <Box className="plan-info-container">
                  <Typography variant="h6" className="section-header">
                    Plan Information & Settings
                  </Typography>
                  
                  <Box className="info-cards-grid">
                    <Box className="info-card">
                      <Typography className="info-card-label">Plan Name</Typography>
                      <Typography className="info-card-value">
                        {subscriptionDetails?.data?._doc?.name || selectedItem?.name || 'N/A'}
                      </Typography>
                    </Box>

                    <Box className="info-card">
                      <Typography className="info-card-label">Duration</Typography>
                      <Typography className="info-card-value">
                        {subscriptionDetails?.data?._doc?.durationInDays || selectedItem?.durationInDays || 0} days
                      </Typography>
                    </Box>

                    <Box className="info-card">
                      <Typography className="info-card-label">Price</Typography>
                      <Typography className="info-card-value price-value">
                        {(subscriptionDetails?.data?._doc?.price || selectedItem?.price) === 0 ? 'Free' : `${(subscriptionDetails?.data?._doc?.price || selectedItem?.price)?.toLocaleString() || 0} VND`}
                      </Typography>
                    </Box>

                    <Box className="info-card">
                      <Typography className="info-card-label">Status</Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <span className={`status-pill ${(subscriptionDetails?.data?._doc?.isActive !== undefined ? subscriptionDetails?.data?._doc?.isActive : selectedItem?.isActive) ? 'active' : 'inactive'}`}>
                          {(subscriptionDetails?.data?._doc?.isActive !== undefined ? subscriptionDetails?.data?._doc?.isActive : selectedItem?.isActive) ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                        {(subscriptionDetails?.data?._doc?.isTrial !== undefined ? subscriptionDetails?.data?._doc?.isTrial : selectedItem?.isTrial) && (
                          <span className="status-pill trial">TRIAL PLAN</span>
                        )}
                      </Box>
                    </Box>
                  </Box>

                  {/* Usage limits */}
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" className="section-header">
                      Usage Limits
                    </Typography>
                    {(() => {
                      const limits = subscriptionDetails?.data?._doc?.limits || selectedItem?.limits || {};
                      const formatLimitValue = (value) => {
                        if (value === -1) return 'NO LIMIT';
                        if (value == null) return 'N/A';
                        return value;
                      };
                      return (
                        <Box className="info-cards-grid">
                          <Box className="info-card">
                            <Typography className="info-card-label">Product Groups</Typography>
                            <Typography className="info-card-value">
                              {formatLimitValue(limits.productGroupLimit)}
                            </Typography>
                          </Box>

                          <Box className="info-card">
                            <Typography className="info-card-label">Products / Group</Typography>
                            <Typography className="info-card-value">
                              {formatLimitValue(limits.productItemLimit)}
                            </Typography>
                          </Box>

                          <Box className="info-card">
                            <Typography className="info-card-label">Export Level</Typography>
                            <Typography className="info-card-value">
                              {limits.exportLevel
                                ? limits.exportLevel.charAt(0).toUpperCase() + limits.exportLevel.slice(1)
                                : 'N/A'}
                            </Typography>
                          </Box>

                          <Box className="info-card">
                            <Typography className="info-card-label">Eco Bonus</Typography>
                            <Typography className="info-card-value">
                              {limits.ecoBonusPercent != null
                                ? `${limits.ecoBonusPercent}%`
                                : 'N/A'}
                            </Typography>
                          </Box>
                        </Box>
                      );
                    })()}
                  </Box>
                </Box>
                
                {/* Features Section */}
                {subscriptionDetails?.data?.description && subscriptionDetails.data.description.length > 0 && (
                  <Box className="features-container">
                    <Typography variant="h6" className="section-header">
                      Tính năng
                    </Typography>
                    <Box className="features-list">
                      {subscriptionDetails.data.description.map((feature, index) => (
                        <Box key={index} className="feature-item">
                          <Box className="feature-bullet" />
                          <Typography className="feature-text">{feature}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
              </>
            ) : (
                /* Create/Edit Mode - Form Fields */
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item size={6}>
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
                    </Grid>

                    <Grid item size={6}>
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
                    </Grid>

                    <Grid item size={6}>
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
                    </Grid>

                    <Grid item size={6}>
                      <Controller
                        name="productGroupLimit"
                        control={control}
                        render={({ field }) => (
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <TextField
                              {...field}
                              label="Product Group Limit *"
                              type="number"
                              required
                              placeholder="e.g., 12"
                              variant="outlined"
                              fullWidth
                              value={isUnlimitedGroup ? "" : field.value}
                              error={!!errors.productGroupLimit}
                              helperText={errors.productGroupLimit?.message}
                              onChange={(e) => {
                                const value = e.target.value;
                                setIsUnlimitedGroup(false);
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
                            <Button
                              variant={isUnlimitedGroup ? "contained" : "outlined"}
                              size="small"
                              onClick={() => {
                                const next = !isUnlimitedGroup;
                                setIsUnlimitedGroup(next);
                                if (next) {
                                  field.onChange(-1);
                                } else {
                                  field.onChange("");
                                }
                              }}
                              sx={{
                                alignSelf: 'flex-start',
                                textTransform: 'none',
                                borderRadius: '999px',
                                fontSize: '13px',
                                paddingInline: 1.5,
                                mt: 0.5,
                                backgroundColor: isUnlimitedGroup ? '#174d31' : 'transparent',
                                color: isUnlimitedGroup ? '#ffffff' : '#174d31',
                                borderColor: '#174d31',
                                '&:hover': {
                                  backgroundColor: isUnlimitedGroup ? '#0f3d26' : 'rgba(23,77,49,0.06)',
                                  borderColor: '#174d31',
                                },
                              }}
                            >
                              NO LIMIT
                            </Button>
                          </Box>
                        )}
                      />
                    </Grid>

                    <Grid item size={6}>
                      <Controller
                        name="productItemLimit"
                        control={control}
                        render={({ field }) => (
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <TextField
                              {...field}
                              label="Product Item Limit *"
                              type="number"
                              required
                              placeholder="e.g., 2"
                              variant="outlined"
                              fullWidth
                              value={isUnlimitedItem ? "" : field.value}
                              error={!!errors.productItemLimit}
                              helperText={errors.productItemLimit?.message}
                              onChange={(e) => {
                                const value = e.target.value;
                                setIsUnlimitedItem(false);
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
                            <Button
                              variant={isUnlimitedItem ? "contained" : "outlined"}
                              size="small"
                              onClick={() => {
                                const next = !isUnlimitedItem;
                                setIsUnlimitedItem(next);
                                if (next) {
                                  field.onChange(-1);
                                } else {
                                  field.onChange("");
                                }
                              }}
                              sx={{
                                alignSelf: 'flex-start',
                                textTransform: 'none',
                                borderRadius: '999px',
                                fontSize: '13px',
                                paddingInline: 1.5,
                                mt: 0.5,
                                backgroundColor: isUnlimitedItem ? '#174d31' : 'transparent',
                                color: isUnlimitedItem ? '#ffffff' : '#174d31',
                                borderColor: '#174d31',
                                '&:hover': {
                                  backgroundColor: isUnlimitedItem ? '#0f3d26' : 'rgba(23,77,49,0.06)',
                                  borderColor: '#174d31',
                                },
                              }}
                            >
                              NO LIMIT
                            </Button>
                          </Box>
                        )}
                      />
                    </Grid>

                    <Grid item size={6}>
                      <Controller
                        name="ecoBonusPercent"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Eco Bonus Percent (%) *"
                            type="number"
                            required
                            placeholder="e.g., 10"
                            variant="outlined"
                            fullWidth
                            error={!!errors.ecoBonusPercent}
                            helperText={errors.ecoBonusPercent?.message}
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
                    </Grid>

                    <Grid item size={6}>
                      <Controller
                        name="exportLevel"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Export Level *"
                            required
                            placeholder="none | basic | advanced"
                            variant="outlined"
                            fullWidth
                            error={!!errors.exportLevel}
                            helperText={errors.exportLevel?.message}
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
                    </Grid>

                    <Grid item xs={12} md={4}>
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
                    </Grid>

                    <Grid item xs={12} md={4}>
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
                    </Grid>
                  </Grid>
                </Box>
              )}
          </Box>
        </div>

        <Box sx={{ p: 4, backgroundColor: '#f8f9fa' }}>
          {renderActionButtons()}
        </Box>
      </div>
    </div>
  );
}

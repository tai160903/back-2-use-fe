import { useEffect } from "react";
import "./ModalRewardPointPackage.css";
import { IoClose } from "react-icons/io5";
import { MdStars } from "react-icons/md";
import { 
  TextField, 
  Button, 
  Box,
  Grid,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { createRewardPointPackageApi, getAllRewardPointPackagesApi, updateRewardPointPackageApi } from "../../store/slices/rewardPointPackageSlice";
import toast from "react-hot-toast";

// Yup validation schema
const rewardPointPackageSchema = yup.object({
  name: yup
    .string()
    .required("Package name is required")
    .min(2, "Package name must be at least 2 characters")
    .max(50, "Package name cannot exceed 50 characters"),
  points: yup
    .number()
    .required("Points is required")
    .min(1, "Points must be at least 1")
    .integer("Points must be an integer"),
  price: yup
    .number()
    .required("Price is required")
    .min(0, "Price cannot be negative")
    .integer("Price must be an integer"),
  description: yup
    .string()
    .required("Description is required")
    .min(5, "Description must be at least 5 characters")
    .max(500, "Description cannot exceed 500 characters"),
  isActive: yup.boolean(),
});

export default function ModalRewardPointPackage({ open, onClose, selectedItem = null, mode = "create" }) {
  const dispatch = useDispatch();
  const { isLoading } = useSelector(state => state.rewardPointPackage);
  
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(rewardPointPackageSchema),
    defaultValues: {
      name: "",
      points: "",
      price: "",
      description: "",
      isActive: true,
    }
  });

  // Reset form when modal opens or selectedItem changes
  useEffect(() => {
    if (open) {
      if (mode === "edit" && selectedItem) {
        reset({
          name: selectedItem.name || "",
          points: selectedItem.points || "",
          price: selectedItem.price || "",
          description: selectedItem.description || "",
          isActive: selectedItem.isActive !== undefined ? selectedItem.isActive : true,
        });
      } else {
        reset({
          name: "",
          points: "",
          price: "",
          description: "",
          isActive: true,
        });
      }
    }
  }, [open, reset, mode, selectedItem]);

  if (!open) return null;

  // function submit form
  const onSubmit = async (data) => {
    // Ensure values are valid numbers
    const points = parseInt(data.points, 10);
    const price = parseInt(data.price, 10);
    
    // Validate numbers
    if (isNaN(points) || points <= 0) {
      toast.error("Points must be a valid positive number");
      return;
    }
    
    if (isNaN(price) || price < 0) {
      toast.error("Price must be a valid non-negative number");
      return;
    }

    const payload = {
      name: data.name.trim(),
      points: points,
      price: price,
      description: data.description.trim(),
    };

    // Only include isActive when updating, not when creating
    if (mode === "edit") {
      payload.isActive = data.isActive !== undefined ? data.isActive : true;
    }

    try {
      if (mode === "edit" && selectedItem?._id) {
        await dispatch(updateRewardPointPackageApi({ id: selectedItem._id, data: payload })).unwrap();
        toast.success("Reward point package updated successfully!");
      } else {
        await dispatch(createRewardPointPackageApi(payload)).unwrap();
        toast.success("Reward point package created successfully!");
      }
      onClose();
      // Refresh packages list
      dispatch(getAllRewardPointPackagesApi({ page: 1, limit: 100 }));
    } catch (error) {
      const errorMessage = error?.message || error?.data?.message || `An error occurred while ${mode === "edit" ? "updating" : "creating"} the reward point package`;
      toast.error(errorMessage);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-section">
            <div className="modal-icon">
              <MdStars />
            </div>
            <div>
              <h2 className="modal-titles">
                {mode === "edit" ? "Edit Reward Point Package" : "Create Reward Point Package"}
              </h2>
              <p className="modal-subtitle">
                {mode === "edit" 
                  ? `Edit: ${selectedItem?.name || "Reward Point Package"}`
                  : "Create a new reward points package that can be purchased by businesses"
                }
              </p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <IoClose />
          </button>
        </div>

        <div className="modal-content-subscriptions">
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Grid container spacing={2}>
                <Grid item size={4}>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Package Name *"
                        required
                        placeholder="e.g., Bronze Package, Silver Package"
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

                <Grid item size={4}>
                  <Controller
                    name="points"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Points *"
                        type="number"
                        required
                        placeholder="e.g., 100"
                        variant="outlined"
                        fullWidth
                        error={!!errors.points}
                        helperText={errors.points?.message}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "") {
                            field.onChange("");
                          } else {
                            const numValue = parseInt(value, 10);
                            field.onChange(isNaN(numValue) ? "" : numValue);
                          }
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

                <Grid item size={4}>
                  <Controller
                    name="price"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Price (VND) *"
                        type="number"
                        required
                        placeholder="e.g., 50000"
                        variant="outlined"
                        fullWidth
                        error={!!errors.price}
                        helperText={errors.price?.message}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "") {
                            field.onChange("");
                          } else {
                            const numValue = parseInt(value, 10);
                            field.onChange(isNaN(numValue) ? "" : numValue);
                          }
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

                <Grid item size={12}>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Description *"
                        required
                        placeholder="e.g., Get 100 reward points"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={4}
                        error={!!errors.description}
                        helperText={errors.description?.message}
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

                <Grid item size={12}>
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
              </Grid>
            </Box>
          </Box>
        </div>

        <Box sx={{ p: 4, backgroundColor: '#f8f9fa' }}>
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
              disabled={isSubmitting || isLoading}
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
              {isSubmitting || isLoading 
                ? (mode === "edit" ? 'Updating...' : 'Creating...') 
                : (mode === "edit" ? 'Update Package' : 'Create Package')
              }
            </Button>
          </Box>
        </Box>
      </div>
    </div>
  );
}


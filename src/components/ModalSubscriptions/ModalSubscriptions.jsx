import React, { useState } from "react";
import "./ModalSubscriptions.css";
import { IoClose } from "react-icons/io5";
import { MdPayment } from "react-icons/md";
import { SiTicktick } from "react-icons/si";
import { 
  TextField, 
  Button, 
  FormControlLabel, 
  Checkbox, 
  Box,
  Typography,
  IconButton
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";

export default function ModalSubscriptions({ open, onClose, selectedItem, mode = "view" }) {
  const [formData, setFormData] = useState({
    name: "",
    description: [""],
    price: 0,
    durationInDays: 30,
    isActive: true,
    isTrial: false
  });

  // Initialize form data when modal opens or selectedItem changes
  React.useEffect(() => {
    if (mode === "edit" && selectedItem) {
      setFormData({
        name: selectedItem.name || "",
        description: selectedItem.description || [""],
        price: selectedItem.price || 0,
        durationInDays: selectedItem.durationInDays || 30,
        isActive: selectedItem.isActive !== undefined ? selectedItem.isActive : true,
        isTrial: selectedItem.isTrial !== undefined ? selectedItem.isTrial : false
      });
    } else if (mode === "create") {
      setFormData({
        name: "",
        description: [""],
        price: 0,
        durationInDays: 30,
        isActive: true,
        isTrial: false
      });
    }
  }, [mode, selectedItem]);

  if (!open) return null;

  const handleAction = (type) => {
    // Here you would implement the actual action logic
    console.log(`Action: ${type}`, formData);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDescriptionChange = (index, value) => {
    const newDescription = [...formData.description];
    newDescription[index] = value;
    setFormData(prev => ({
      ...prev,
      description: newDescription
    }));
  };

  const addDescriptionField = () => {
    setFormData(prev => ({
      ...prev,
      description: [...prev.description, ""]
    }));
  };

  const removeDescriptionField = (index) => {
    if (formData.description.length > 1) {
      const newDescription = formData.description.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        description: newDescription
      }));
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
            onClick={() => handleAction('create')}
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
              }
            }}
          >
            Create Subscription
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
            onClick={() => handleAction('save')}
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
              }
            }}
          >
            Save Changes
          </Button>
        </Box>
      );
    }

    // Default view mode
    const status = selectedItem?.subscriptionStatus || 'active';
    
    return (
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        {status === 'active' && (
          <>
            <Button 
              variant="outlined"
              onClick={() => handleAction('edit')}
              sx={{ 
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 600,
                px: 3
              }}
            >
              Edit Plan
            </Button>
            <Button 
              variant="contained"
              onClick={() => handleAction('cancel')}
              sx={{ 
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                backgroundColor: '#ef4444',
                '&:hover': {
                  backgroundColor: '#dc2626'
                }
              }}
            >
              Cancel Subscription
            </Button>
          </>
        )}
        {status === 'expired' && (
          <Button 
            variant="contained"
            onClick={() => handleAction('renew')}
            sx={{ 
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              backgroundColor: '#f59e0b',
              '&:hover': {
                backgroundColor: '#d97706'
              }
            }}
          >
            Renew Subscription
          </Button>
        )}
        {status === 'cancelled' && (
          <Button 
            variant="contained"
            onClick={() => handleAction('reactivate')}
            sx={{ 
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              backgroundColor: '#22c55e',
              '&:hover': {
                backgroundColor: '#16a34a'
              }
            }}
          >
            Reactivate
          </Button>
        )}
      </Box>
    );
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
            {/* Plan Features - Full Width */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#374151' }}>
                Plan Features
              </Typography>
              {mode === "create" || mode === "edit" ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {formData.description.map((desc, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TextField
                        label={`Feature ${index + 1}`}
                        value={desc}
                        onChange={(e) => handleDescriptionChange(index, e.target.value)}
                        placeholder={`Describe feature ${index + 1}...`}
                        variant="outlined"
                        fullWidth
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            fontSize: '16px',
                          },
                          '& .MuiInputLabel-root': {
                            fontSize: '16px',
                            fontWeight: 600,
                            color: '#374151',
                          },
                          '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#3b82f6',
                            borderWidth: '2px',
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#3b82f6',
                          }
                        }}
                      />
                      {formData.description.length > 1 && (
                        <IconButton
                          onClick={() => removeDescriptionField(index)}
                          sx={{
                            color: '#dc2626',
                            backgroundColor: '#fee2e2',
                            '&:hover': {
                              backgroundColor: '#fecaca',
                            }
                          }}
                        >
                          <Remove />
                        </IconButton>
                      )}
                    </Box>
                  ))}
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={addDescriptionField}
                    sx={{
                      borderRadius: '12px',
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '16px',
                      padding: '12px 24px',
                      borderStyle: 'dashed',
                      borderColor: '#174d31',
                      color: '#174d31',
                      borderWidth: '2px',
                      '&:hover': {
                        borderStyle: 'solid',
                        backgroundColor: '#f0fdf4',
                        borderColor: '#0f3d26',
                        color: '#0f3d26',
                      }
                    }}
                  >
                    Add Feature
                  </Button>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {(selectedItem?.description || []).map((desc, index) => (
                    <Box key={index} sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1,
                      p: 1.5,
                      backgroundColor: '#f8f9fa',
                      borderRadius: '6px',
                      borderLeft: '3px solid #22c55e'
                    }}>
                      <SiTicktick style={{ color: '#22c55e', fontSize: '16px' }} />
                      <Typography variant="body2" sx={{ color: '#374151' }}>
                        {desc}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>

            {/* Plan Information & Settings - Combined Section with Two Columns */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#374151' }}>
                Plan Information & Settings
              </Typography>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
                gap: 3
              }}>
                {/* Left Column */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <TextField
                    label="Plan Name"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g., Premium Plan, Basic Plan"
                    variant="outlined"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
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
                  <TextField
                    label="Price (VND)"
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', parseInt(e.target.value) || 0)}
                    placeholder="e.g., 1999"
                    variant="outlined"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
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
                </Box>

                {/* Right Column */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <TextField
                    label="Duration (Days)"
                    type="number"
                    required
                    value={formData.durationInDays}
                    onChange={(e) => handleInputChange('durationInDays', parseInt(e.target.value) || 30)}
                    placeholder="e.g., 30"
                    variant="outlined"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
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
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.isActive}
                          onChange={(e) => handleInputChange('isActive', e.target.checked)}
                          sx={{
                            color: '#174d31',
                            '&.Mui-checked': {
                              color: '#174d31',
                            },
                            transform: 'scale(1.2)',
                          }}
                        />
                      }
                      label="Active Status"
                      sx={{
                        '& .MuiFormControlLabel-label': {
                          fontWeight: 500,
                          color: '#374151'
                        }
                      }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.isTrial}
                          onChange={(e) => handleInputChange('isTrial', e.target.checked)}
                          sx={{
                            color: '#174d31',
                            '&.Mui-checked': {
                              color: '#174d31',
                            },
                            transform: 'scale(1.2)',
                          }}
                        />
                      }
                      label="Trial Plan"
                      sx={{
                        '& .MuiFormControlLabel-label': {
                          fontWeight: 500,
                          color: '#374151'
                        }
                      }}
                    />
                  </Box>
                </Box>
              </Box>
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

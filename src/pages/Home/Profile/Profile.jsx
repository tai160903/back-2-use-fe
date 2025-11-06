import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import Button from "@mui/material/Button";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import TextField from "@mui/material/TextField";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import CallMissedOutgoingIcon from "@mui/icons-material/CallMissedOutgoing";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import AddIcon from "@mui/icons-material/Add";
import CakeIcon from "@mui/icons-material/Cake";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CloseIcon from "@mui/icons-material/Close";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useState, useRef, useCallback } from "react";
import "./Profile.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AddressSelector from "../../../components/AddressSelector/AddressSelector";
import {
  getProfileApi,
  updateProfileApi,
  uploadAvatarApi,
  updateAvatarLocally,
} from "../../../store/slices/userSlice";
import { useForm, Controller } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { format, parseISO } from "date-fns";
import toast from "react-hot-toast";
import * as yup from "yup";

import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object().shape({
  fullName: yup
    .string()
    .required("Full name is required")
    .min(2, "Full name must be at least 2 characters"),
  phone: yup
    .string()
    .matches(/^[0-9]{10,15}$/, "Invalid phone number")
    .nullable(),
  address: yup.string().nullable(),
  yob: yup
    .date()
    .required("Date of birth is required")
    .max(new Date(), "Date of birth cannot be in the future")
    .typeError("Invalid date"),
});

export default function Profile({ readOnly = false }) {
  const dispatch = useDispatch();
  const { userInfo, error } = useSelector((state) => state.user);
  console.log("userInfo", userInfo);
  const user = userInfo;

  const wallet = userInfo?.wallet;
  const [isEditing, setIsEditing] = useState(false);
  
  // Avatar upload states
  const [showAvatarPreview, setShowAvatarPreview] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
      yob: user?.yob ? parseISO(user.yob) : null,
    },
  });

  useEffect(() => {
    dispatch(getProfileApi());
    
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        yob: user.yob ? parseISO(user.yob) : null,
      });
    }
  }, [user, reset]);

  // Force read-only mode
  useEffect(() => {
    if (readOnly && isEditing) {
      setIsEditing(false);
    }
  }, [readOnly, isEditing]);

  const onSubmit = async (data) => {
    try {
      const formattedData = {
        fullName: data.fullName,
        phone: data.phone,
        address: data.address,
        yob: data.yob ? format(data.yob, "yyyy-MM-dd") : "",
      };
      await dispatch(updateProfileApi(formattedData)).unwrap();
      toast.success("Update profile success");
      await dispatch(getProfileApi());
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  // Handle address selection from AddressSelector
  const handleAddressSelect = useCallback((addressData) => {
    if (addressData && addressData.fullAddress) {
      setValue("address", addressData.fullAddress);
    }
  }, [setValue]);

  // Avatar upload handlers
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setShowAvatarPreview(true);
    }
  };

  const handleConfirmUpload = async () => {
    if (!selectedFile) return;

    setIsUploadingAvatar(true);
    
    try {
      // Cập nhật avatar ngay lập tức với preview URL để UX mượt mà
      dispatch(updateAvatarLocally(previewUrl));
      
      const formData = new FormData();
      formData.append('avatar', selectedFile);
      
      await dispatch(uploadAvatarApi(formData)).unwrap();
      
      dispatch(getProfileApi());
      toast.success('Update avatar success');
      setShowAvatarPreview(false);
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error) {
      toast.error(error.response ? error.response.data : error.message || 'Failed to update avatar');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleCancelUpload = () => {
    setShowAvatarPreview(false);
    setSelectedFile(null);
    setIsUploadingAvatar(false);
  };

 

  if (error) {
    return <div>Error: {error.message || error}</div>;
  }

  return (
    <>
      <div className="profile">
        <div className="profile-container">
          <div className="circle-bg" />
          <div className="circle-bg-2" />
          <div className="profile-content">
            <div className="profile-info">
              <div className="profile-info-header">
                <div className={`profile-avatar ${isUploadingAvatar ? 'loading' : ''}`} onClick={!readOnly && !isUploadingAvatar ? handleAvatarClick : undefined} style={{ cursor: readOnly ? 'default' : 'pointer' }}>
                  <img
                    src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user?.fullName || "User"
                    )}&background=0D8ABC&color=fff&size=128`}
                    alt="Avatar"
                  />
                  {!readOnly && (
                    isUploadingAvatar ? (
                      <div className="avatar-loading-overlay">
                        <CircularProgress size={30} sx={{ color: 'white' }} />
                      </div>
                    ) : (
                      <div className="avatar-overlay">
                        <CameraAltIcon className="camera-icon" />
                      </div>
                    )
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <div className="profile-supInfor">
                  <Typography
                    style={{
                      fontSize: "30px",
                      marginTop: "20px",
                      fontWeight: "700",
                    }}
                  >
                    My Profile{" "}
                    {!readOnly && (
                      <button
                        onClick={() => setIsEditing(!isEditing)}
                        className={`p-2 rounded-lg transition-all duration-200 ${
                          isEditing
                            ? "text-orange-600 bg-orange-100 hover:bg-orange-200"
                            : "text-gray-500 hover:text-orange-500 hover:bg-orange-50"
                        }`}
                      >
                        <EditIcon className="w-5 h-5" />
                      </button>
                    )}
                  </Typography>
                </div>
              </div>
              <div className="profile-info-form">
                {isEditing && (
                  <div className="profile-info-edit-text">
                    <Typography
                      sx={{
                        fontWeight: "600",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <EditIcon sx={{ marginRight: "10px" }} /> Edit Mode Active
                    </Typography>
                    <span>Make changes to your profile information below</span>
                  </div>
                )}
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="profile-info-content">
                      <div className="profile-info-text">
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <div className="profile-info-text-icons">
                            <PersonIcon />
                          </div>
                          <div className="profile-info-text-des">
                            <Typography>Full Name</Typography>
                            {isEditing ? (
                              <TextField
                                {...register("fullName")}
                                variant="outlined"
                                fullWidth
                                size="small"
                                sx={{ marginTop: "8px" }}
                                error={!!errors.fullName}
                                helperText={errors.fullName?.message}
                              />
                            ) : (
                              <span>{user?.fullName || "No name"}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="profile-info-text">
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <div className="profile-info-text-icons">
                            <EmailIcon />
                          </div>
                          <div className="profile-info-text-des">
                            <Typography>Email</Typography>
                            {isEditing ? (
                              <TextField
                                {...register("email")}
                                variant="outlined"
                                fullWidth
                                size="small"
                                type="email"
                                sx={{ marginTop: "8px" }}
                                disabled
                              />
                            ) : (
                              <span>{user?.email || "No email"}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="profile-info-text">
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <div className="profile-info-text-icons">
                            <LocalPhoneIcon />
                          </div>
                          <div className="profile-info-text-des">
                            <Typography>Phone</Typography>
                            {isEditing ? (
                              <TextField
                                {...register("phone")}
                                variant="outlined"
                                fullWidth
                                size="small"
                                type="tel"
                                sx={{ marginTop: "8px" }}
                                error={!!errors.phone}
                                helperText={errors.phone?.message}
                              />
                            ) : (
                              <span>{user?.phone || "No phone"}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="profile-info-text">
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <div className="profile-info-text-icons">
                            <AddLocationAltIcon />
                          </div>
                          <div className="profile-info-text-des" style={{ width: "100%" }}>
                            <Typography>Address</Typography>
                            {isEditing ? (
                              <Box sx={{ marginTop: "8px" }}>
                                <AddressSelector 
                                  onAddressSelect={handleAddressSelect} 
                                  variant="light"
                                />
                                {errors.address && (
                                  <Typography
                                    variant="caption"
                                    color="error"
                                    sx={{ marginTop: "8px", display: "block" }}
                                  >
                                    {errors.address?.message}
                                  </Typography>
                                )}
                              </Box>
                                                         ) : (
                               <span style={{ color: "black", fontWeight: "600" }}>{user?.address || "No address"}</span>
                             )}
                          </div>
                        </div>
                      </div>
                      <div className="profile-info-text">
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <div className="profile-info-text-icons">
                            <CakeIcon />
                          </div>
                          <div className="profile-info-text-des">
                            <Typography>Year of Birth</Typography>
                            {isEditing ? (
                              <Controller
                                name="yob"
                                control={control}
                                render={({ field }) => (
                                  <DatePicker
                                    {...field}
                                    label="Select Date of Birth"
                                    views={["year", "month", "day"]}
                                    format="dd/MM/yyyy"
                                    slotProps={{
                                      textField: {
                                        size: "small",
                                        sx: { marginTop: "8px" },
                                        error: !!errors.yob,
                                        helperText: errors.yob?.message,
                                      },
                                    }}
                                  />
                                )}
                              />
                            ) : (
                              <span>
                                {user?.yob
                                  ? format(parseISO(user.yob), "dd/MM/yyyy")
                                  : "No date of birth"}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    {isEditing && (
                      <div className="profile-info-footer">
                        <Button
                          className="profile-info-btn profile-info-btn-save"
                          variant="contained"
                          type="submit"
                        >
                          Save
                        </Button>
                        <Button
                          className="profile-info-btn profile-info-btn-cancel"
                          variant="outlined"
                          onClick={handleCancel}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </form>
                </LocalizationProvider>
              </div>
              {!isEditing && !readOnly && (
                <Button
                  className="profile-info-btn profile-info-btn-save"
                  variant="contained"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
              )}
            </div>
            <div className="right-section">
              <div className="profile-wallet">
                <div className="profile-wallet-title">
                  <Typography style={{ fontSize: "30px", fontWeight: "700" }}>
                    Wallet Balance
                  </Typography>
                  <Link to="/profile" className="profile-filter">
                    <FilterAltIcon className="profile-info-text-icons" />
                    View all
                  </Link>
                </div>
                <div className="profile-wallet-content">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <div className="profile-wallet-text-icons">
                      <AccountBalanceWalletIcon
                        sx={{ color: "#179c4a", fontSize: "30px" }}
                      />
                    </div>
                    <div className="profile-wallet-text-des">
                      <Typography
                        sx={{
                          color: "black",
                          fontWeight: "700",
                          fontSize: "20px",
                        }}
                      >
                        Current Balance
                      </Typography>
                      <span>Available funds</span>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      textAlign: "end",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "25px",
                        color: "#179c4a",
                        fontWeight: "600",
                      }}
                    >
                      {(wallet?.availableBalance || 0).toLocaleString('vi-VN')} VNĐ
                    </Typography>
               
                  </div>
                </div>
                <div className="profile-wallet-content">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <div className="profile-wallet-text-icons">
                      <AttachMoneyIcon
                        sx={{ color: "#3169ed", fontSize: "30px" }}
                      />
                    </div>
                    <div className="profile-wallet-text-des">
                      <Typography
                        sx={{
                          color: "black",
                          fontWeight: "700",
                          fontSize: "20px",
                        }}
                      >
                        Pending Balance
                      </Typography>
                      <span>Processing transactions</span>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      textAlign: "end",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "25px",
                        color: "#3169ed",
                        fontWeight: "600",
                      }}
                    >
                      {(0).toLocaleString('vi-VN')} VNĐ
                    </Typography>
                   
                  </div>
                </div>
              </div>
              <div className="profile-legitPoint">
                <div className="profile-legitPoint-title">
                  <Typography style={{ fontSize: "30px", fontWeight: "700" }}>
                    Legit Points & Ranking
                  </Typography>
                  <Link to="/profile" className="profile-filter">
                    <FilterAltIcon className="profile-info-text-icons" />
                    View all
                  </Link>
                </div>
                <div className="profile-legitPoint-current">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <div className="profile-legitPoint-current-icons">
                      <EmojiEventsIcon sx={{ fontSize: "30px" }} />
                    </div>
                    <div className="profile-wallet-text-des">
                      <Typography
                        sx={{
                          color: "black",
                          fontWeight: "700",
                          fontSize: "30px",
                        }}
                      >
                        2,847 Points
                      </Typography>
                      <span>Current Legit Points</span>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      textAlign: "end",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "30px",
                        color: "#8f3cd5",
                        fontWeight: "600",
                      }}
                    >
                      #47
                    </Typography>
                    <span style={{ color: "#6b7280" }}>Global Ranking</span>
                  </div>
                </div>
                <div className="profile-legitPoint-progress">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <div className="profile-legitPoint-progress-icons">
                      <CallMissedOutgoingIcon
                        sx={{ color: "white", fontSize: "30px" }}
                      />
                    </div>
                    <div className="profile-wallet-text-des">
                      <Typography
                        sx={{
                          color: "black",
                          fontWeight: "700",
                          fontSize: "18px",
                        }}
                      >
                        Weekly Progress
                      </Typography>
                      <span>+245 points this week</span>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      textAlign: "end",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "25px",
                        color: "#0fa34e",
                        fontWeight: "600",
                      }}
                    >
                      <ArrowUpwardIcon /> 3
                    </Typography>
                    <span style={{ color: "#6b7280" }}>Rank improved</span>
                  </div>
                </div>
                <div className="profile-legitPoint-activity">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <div className="profile-legitPoint-activity-icons">
                      <StarBorderIcon
                        sx={{ color: "white", fontSize: "30px" }}
                      />
                    </div>
                    <div className="profile-wallet-text-des">
                      <Typography
                        sx={{
                          color: "black",
                          fontWeight: "700",
                          fontSize: "18px",
                        }}
                      >
                        Recent Activity
                      </Typography>
                      <span>Cup return bonus</span>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      textAlign: "end",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "25px",
                        color: "#a755f7",
                        fontWeight: "600",
                      }}
                    >
                      <AddIcon /> 50
                    </Typography>
                    <span style={{ color: "#6b7280" }}>2 hours ago</span>
                  </div>
                </div>
                <div className="profile-legitPoint-achievement">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <div className="profile-legitPoint-achievement-icons">
                      <WorkspacePremiumIcon
                        sx={{ color: "white", fontSize: "30px" }}
                      />
                    </div>
                    <div className="profile-wallet-text-des">
                      <Typography
                        sx={{
                          color: "black",
                          fontWeight: "700",
                          fontSize: "18px",
                        }}
                      >
                        Achievement Level
                      </Typography>
                      <span>Gold Member Status</span>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      textAlign: "end",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "25px",
                        color: "#3b82f6",
                        fontWeight: "600",
                      }}
                    >
                      <AddIcon /> Level 8
                    </Typography>
                    <span style={{ color: "#6b7280" }}>Next: 3,000 pts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Preview Modal */}
      {showAvatarPreview && (
        <div className="avatar-preview-modal">
          <div className="avatar-preview-content">
            <div className="avatar-preview-header">
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Preview Avatar
              </Typography>
              <Button
                onClick={handleCancelUpload}
                sx={{ minWidth: 'auto', padding: '8px' }}
              >
                <CloseIcon />
              </Button>
            </div>
            <div className="avatar-preview-body">
              <img
                src={previewUrl}
                alt="Preview"
                className="avatar-preview-image"
              />
            </div>
            <div className="avatar-preview-footer">
              <Button
                variant="outlined"
                onClick={handleCancelUpload}
                disabled={isUploadingAvatar}
                sx={{ marginRight: '10px' }}
              >
                Hủy
              </Button>
              <Button
                variant="contained"
                onClick={handleConfirmUpload}
                disabled={isUploadingAvatar}
                sx={{ backgroundColor: '#ec5a0d' }}
                startIcon={isUploadingAvatar ? <CircularProgress size={16} sx={{ color: 'white' }} /> : null}
              >
                {isUploadingAvatar ? 'Uploading...' : 'Confirm'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

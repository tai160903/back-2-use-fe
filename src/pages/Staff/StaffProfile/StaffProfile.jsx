import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import {
  FaUser,
  FaBuilding,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaIdBadge,
  FaKey,
} from "react-icons/fa";
import { getProfileStaff } from "../../../store/slices/userSlice";
import { changePasswordAPI } from "../../../store/slices/authSlice";
import "../../Bussiness/ProfileBusiness/ProfileBusiness.css";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

export default function StaffProfile() {
  const dispatch = useDispatch();

  const { staffInfo, isLoading, error } = useSelector((state) => state.user);

  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  const changePasswordSchema = yup.object({
    oldPassword: yup.string().required("Old password is required"),
    newPassword: yup
      .string()
      .required("New password is required")
      .min(6, "New password must be at least 6 characters"),
    confirmNewPassword: yup
      .string()
      .required("Confirm new password is required")
      .oneOf([yup.ref("newPassword")], "Passwords must match"),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    resolver: yupResolver(changePasswordSchema),
  });

  useEffect(() => {
    dispatch(getProfileStaff());
  }, [dispatch]);

  const data = staffInfo?.data;
  const business = data?.businessId;
  const user = data?.user;

  const handleOpenChangePassword = () => {
    setIsChangePasswordOpen(true);
  };

  const handleCloseChangePassword = () => {
    if (isSubmittingPassword) return;
    setIsChangePasswordOpen(false);
    reset();
  };

  const handleSubmitChangePassword = async (values) => {
    try {
      setIsSubmittingPassword(true);
      await dispatch(changePasswordAPI(values)).unwrap();

      toast.success("Password changed successfully.");
      handleCloseChangePassword();
    } catch (error) {
      const message =
        error?.message || error?.data?.message || "Failed to change password.";
      toast.error(message);
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  if (isLoading && !data) {
    return (
      <div className="profile-business-container">
        <div className="profile-business-card">
          <Typography>Loading staff profile...</Typography>
        </div>
      </div>
    );
  }

  if (error) {
    const message = error?.message || error?.data?.message || error;
    return (
      <div className="profile-business-container">
        <div className="profile-business-card">
          <Typography color="error">
            Unable to load staff profile: {message}
          </Typography>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="profile-business-container">
        <div className="profile-business-card">
          <Typography>No staff profile data found.</Typography>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-business-container">
      <div className="profile-business-card">
        {/* Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            {business?.businessLogoUrl ? (
              <img src={business.businessLogoUrl} alt="Business Logo" />
            ) : (
              <div className="avatar-placeholder">
                <span>{business?.businessName?.charAt(0) || "S"}</span>
              </div>
            )}
          </div>
          <div className="profile-title">
            <h1 className="business-name">{data.fullName || user?.username}</h1>
            <p className="business-type">
              Staff at {business?.businessName || "Store"}
            </p>
          </div>
          <div className="profile-actions">
            <Button
              variant="contained"
              startIcon={<FaKey />}
              className="edit-btn"
              onClick={handleOpenChangePassword}
            >
              Change password
            </Button>
          </div>
        </div>

        {/* Details */}
        <div className="profile-details">
          {/* Store information */}
          <div className="detail-section">
            <h3 className="section-title">
              <FaBuilding
                style={{
                  marginRight: "8px",
                  marginBottom: "8px",
                  color: "#3169ed",
                }}
              />
               Store information
            </h3>
            <div className="detail-item">
              <label>Store name:</label>
              <span>{business?.businessName || "-"}</span>
            </div>
            <div className="detail-item">
              <label>Address:</label>
              <span>{business?.businessAddress || "-"}</span>
            </div>
            <div className="detail-item">
              <label>Phone number:</label>
              <span>{business?.businessPhone || "-"}</span>
            </div>
          </div>

          {/* Staff information */}
          <div className="detail-section">
            <h3 className="section-title">
              <FaUser
                style={{
                  marginRight: "8px",
                  marginBottom: "8px",
                  color: "#c64200",
                }}
              />
              Staff information
            </h3>
            <div className="detail-item">
              <label>Full name:</label>
              <span>{data.fullName || "-"}</span>
            </div>
            <div className="detail-item">
              <label>Email:</label>
              <span>{data.email || user?.email || "-"}</span>
            </div>
            <div className="detail-item">
              <label>Phone number:</label>
              <span>{data.phone || "-"}</span>
            </div>
            <div className="detail-item">
              <label>Status:</label>
              <span>{data.status === "active" ? "Active" : data.status || "-"}</span>
            </div>
           
           
          </div>

          {/* Login account */}
          <div className="detail-section">
            <h3 className="section-title">
              <FaIdBadge
                style={{
                  marginRight: "8px",
                  marginBottom: "8px",
                  color: "#0f766e",
                }}
              />
              Login account
            </h3>
            <div className="detail-item">
              <label>Username:</label>
              <span>{user?.username || "-"}</span>
            </div>
            <div className="detail-item">
              <label>Account email:</label>
              <span>{user?.email || data.email || "-"}</span>
            </div>
            <div className="detail-item">
              <label>Role:</label>
              <span>{user?.role || "staff"}</span>
            </div>
            <div className="detail-item">
              <label>Change password:</label>
              <Button
                variant="contained"
                startIcon={<FaKey />}
                className="edit-btn"
                onClick={handleOpenChangePassword}
              >
                Change password
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Change password dialog */}
      <Dialog open={isChangePasswordOpen} onClose={handleCloseChangePassword} fullWidth maxWidth="xs">
        <form onSubmit={handleSubmit(handleSubmitChangePassword)}>
          <DialogTitle>Change password</DialogTitle>
          <DialogContent>
            <TextField
              label="Old password"
              type="password"
              fullWidth
              margin="dense"
              {...register("oldPassword")}
              error={!!errors.oldPassword}
              helperText={errors.oldPassword?.message}
            />
            <TextField
              label="New password"
              type="password"
              fullWidth
              margin="dense"
              {...register("newPassword")}
              error={!!errors.newPassword}
              helperText={errors.newPassword?.message}
            />
            <TextField
              label="Confirm new password"
              type="password"
              fullWidth
              margin="dense"
              {...register("confirmNewPassword")}
              error={!!errors.confirmNewPassword}
              helperText={errors.confirmNewPassword?.message}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseChangePassword} disabled={isSubmittingPassword}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              className="edit-btn"
              disabled={isSubmittingPassword}
            >
              {isSubmittingPassword ? "Saving..." : "Save"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}



import Grid from "@mui/material/Grid";
import "../../Auth/Login/Login.css";
import imageAuth from "../../../assets/image/ZRRXzB20OVRZOT67Cgq3GEIwusisOXv9FVHoHmSs.webp";
import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { resetPasswordAPI, resendOtpAPI, forgotPasswordAPI } from "../../../store/slices/authSlice";
import toast from "react-hot-toast";
import { PATH } from "../../../routes/path";
import useAuth from "../../../hooks/useAuth";
import { useSearchParams } from "react-router-dom";
import Link from "@mui/material/Link"; 

const schema = yup
  .object({
    email: yup.string().email("Invalid email format.").required("Email is required."),
    otp: yup.string().required("OTP lis required."),
    newPassword: yup.string().required("Password is required"),
    confirmNewPassword: yup
      .string()
      .oneOf([yup.ref("newPassword"), null], "Passwords must match")
      .required("Confirm password is required"),
  })
  .required();

export default function ResetPassword() {
  const { dispatch, navigate, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmPassword] = useState(false);
  const [searchParams] = useSearchParams(); 
  const token = searchParams.get("token"); 
  const email = searchParams.get("email") || ""; 

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { email, otp: "", newPassword: "", confirmNewPassword: "" },
  });

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing reset token");
      navigate(PATH.LOGIN); 
    }
  }, [token, navigate]);

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleClickShowConfirmPassword = () => {
    setConfirmPassword((prev) => !prev);
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        token,
        email: data.email,
        otp: data.otp,
        newPassword: data.newPassword,
        confirmNewPassword: data.confirmNewPassword,
      };

      await dispatch(resetPasswordAPI(payload)).unwrap();
      toast.success("Password reset successfully! You can now log in with your new password.");
      navigate(PATH.LOGIN);
    } catch (error) {
      const errorMessage = error?.message || error?.data?.message || "Failed to reset password. Please try again.";
      toast.error(errorMessage);
      console.error("Reset password error:", error);
    }
  };

  // Handle resend OTP
  const handleResendOtp = async () => {
    try {
      if (!email) {
        toast.error("Email not found. Please go back to forgot password page.");
        return;
      }
      
      // Try resendOtpAPI first, if not available use forgotPasswordAPI
      try {
        await dispatch(resendOtpAPI({ email })).unwrap();
        toast.success("OTP has been resent successfully! Please check your email.");
      } catch {
        // If resendOtpAPI doesn't work, try forgotPasswordAPI
        const response = await dispatch(forgotPasswordAPI({ email })).unwrap();
        if (response.token) {
          // Update new token in URL
          navigate(`/auth/reset-password?token=${response.token}&email=${email}`, { replace: true });
          toast.success("OTP has been resent successfully! Please check your email.");
        }
      }
    } catch (error) {
      const errorMessage = error?.message || error?.data?.message || "Failed to resend OTP. Please try again.";
      toast.error(errorMessage);
      console.error("Resend OTP error:", error);
    }
  };

  if (!token) {
    return null; 
  }

  return (
    <div className="auth-container">
      <div className="auth-content">
        <Grid container spacing={2}>
          <Grid item size={{ xs: 6, md: 6 }} className="auth-left">
            <div className="auth-left-content">
              <Typography className="auth-left-title">
                Reset password
              </Typography>
              <Typography className="auth-left-subtitle">
                Enter your new password and OTP
              </Typography>
              <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
                <TextField
                  id="email"
                  label="Email"
                  variant="standard"
                  sx={{ marginTop: "20px" }}
                  {...register("email")}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  defaultValue={email}
                  disabled
                />
                <TextField
                  id="otp"
                  label="OTP"
                  variant="standard"
                  sx={{ marginTop: "20px" }}
                  {...register("otp")}
                  error={!!errors.otp}
                  helperText={errors.otp?.message}
                />
                <TextField
                  id="newPassword"
                  label="New password"
                  variant="standard"
                  sx={{ marginTop: "20px" }}
                  type={showPassword ? "text" : "password"}
                  {...register("newPassword")}
                  error={!!errors.newPassword}
                  helperText={errors.newPassword?.message}
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    ),
                  }}
                />
                <TextField
                  id="confirmNewPassword"
                  label="Confirm new password"
                  variant="standard"
                  sx={{ marginTop: "20px" }}
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmNewPassword")}
                  error={!!errors.confirmNewPassword}
                  helperText={errors.confirmNewPassword?.message}
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowConfirmPassword}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    ),
                  }}
                />
                <Button
                  type="submit"
                  className="auth-button"
                  disabled={isLoading || !token}
                  sx={{ mt: 2 }}
                >
                  {isLoading ? "Processing..." : "Reset password"}
                </Button>
              </form>
              <div style={{ marginTop: "16px", textAlign: "center" }}>
                <Button
                  variant="outlined"
                  onClick={handleResendOtp}
                  disabled={isLoading || !email}
                  sx={{ 
                    mt: 1,
                    textTransform: "none",
                    color: "#3a704e",
                    borderColor: "#3a704e",
                    "&:hover": {
                      borderColor: "#3a704e",
                      backgroundColor: "rgba(58, 112, 78, 0.04)"
                    }
                  }}
                >
                  {isLoading ? "Sending..." : "Resend OTP"}
                </Button>
              </div>
              <div className="auth-footer">
                <Typography className="auth-bottom-text">
                  <Link href="/auth/login" className="auth-bottom-link">
                    Back to Login
                  </Link>
                </Typography>
              </div>
            </div>
          </Grid>
          <Grid item size={{ xs: 6, md: 6 }} className="auth-right">
            <img
              className="auth-image"
              src={imageAuth}
              alt="Register Illustration"
            />
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
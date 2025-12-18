import Grid from "@mui/material/Grid";
import "../../Auth/Login/Login.css";
import imageAuth from "../../../assets/image/ZRRXzB20OVRZOT67Cgq3GEIwusisOXv9FVHoHmSs.webp";
import imageGoogle from "../../../assets/image/search.png";
import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { Visibility, VisibilityOff, Email } from "@mui/icons-material";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { registerApi, activeAccountAPI } from "../../../store/slices/authSlice";
import toast from "react-hot-toast";
import { PATH } from "../../../routes/path";
import useAuth from "../../../hooks/useAuth";

const schema = yup
  .object({
    username: yup.string().required("Username is required"),
    email: yup.string().required("Email is required"),
    password: yup.string().required("Password is required"),
    confirmPassword: yup
      .string()
      // .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  })
  .required();

export default function Register() {
  const { dispatch, navigate, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmPassword] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState("");

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleClickShowConfirmPassword = () => {
    setConfirmPassword((prev) => !prev);
  };

  const onSubmit = async (data) => {
    try {
      await dispatch(registerApi(data)).unwrap();
      setIsEmailSent(true);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await dispatch(
        activeAccountAPI({
          email: watch("email"),
          otp,
        })
      ).unwrap();
      navigate(PATH.LOGIN);
    } catch (error) {
      toast.error(error.message || "OTP verification failed");
    }
  };

  // Hàm xử lý đăng ký bằng Google
  const handleGoogleRegister = async () => {
    try {
      // Chuyển hướng đến backend endpoint /auth/google-redirect
      // Backend sẽ xử lý OAuth với Google và redirect về frontend
      window.location.href = `${
        import.meta.env.VITE_API_URL
      }/auth/google-redirect`;
    } catch {
      toast.error("Đăng ký bằng Google thất bại, vui lòng thử lại.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-content">
        <Grid container spacing={2}>
          <Grid item size={{ xs: 6, md: 6 }} className="auth-left">
            <div className="auth-left-content">
              {!isEmailSent ? (
                <>
                  <Typography className="auth-left-title">
                    Get started now
                  </Typography>
                  <Typography className="auth-left-subtitle">
                    Enter your credentials to access your account
                  </Typography>
                  <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                      id="username"
                      label="Username"
                      variant="standard"
                      sx={{ marginTop: "20px" }}
                      {...register("username", {
                        setValueAs: (v) =>
                          typeof v === "string" ? v.replace(/\s+/g, "") : v,
                      })}
                      error={!!errors.username}
                      helperText={errors.username?.message}
                    />
                    <TextField
                      id="email"
                      label="Email"
                      variant="standard"
                      sx={{ marginTop: "20px" }}
                      {...register("email", {
                        setValueAs: (v) =>
                          typeof v === "string"
                            ? v.replace(/\s+/g, "").toLowerCase()
                            : v,
                      })}
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />

                    <TextField
                      id="password"
                      label="Password"
                      variant="standard"
                      sx={{ marginTop: "20px" }}
                      type={showPassword ? "text" : "password"}
                      {...register("password", {
                        setValueAs: (v) =>
                          typeof v === "string" ? v.trim() : v,
                      })}
                      error={!!errors.password}
                      helperText={errors.password?.message}
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
                      id="confirmPassword"
                      label="Confirm password"
                      variant="standard"
                      sx={{ marginTop: "20px" }}
                      type={showConfirmPassword ? "text" : "password"}
                      {...register("confirmPassword", {
                        setValueAs: (v) =>
                          typeof v === "string" ? v.trim() : v,
                      })}
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword?.message}
                      InputProps={{
                        endAdornment: (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowConfirmPassword}
                            edge="end"
                          >
                            {showConfirmPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        ),
                      }}
                    />
                    <FormControlLabel
                      sx={{ marginTop: "20px", fontSize: "15px" }}
                      control={<Checkbox defaultChecked />}
                      label="I agree to the terms & policy"
                      className="auth-checkbox"
                    />
                    <Button
                      type="submit"
                      className="auth-button"
                      disabled={isLoading}
                    >
                      {isLoading ? "Registering..." : "Sign Up"}
                    </Button>
                  </form>
                  <div className="auth-subtitle-container">
                    <Typography className="auth-subtitle">
                      <div className="auth-subtitle-line" />
                      or
                      <div className="auth-subtitle-line" />
                    </Typography>
                  </div>
                  <div className="auth-social">
                    <Button
                      className="auth-social-button google"
                      onClick={handleGoogleRegister}
                      disabled={isLoading}
                    >
                      <img
                        src={imageGoogle}
                        className="auth-social-image"
                        alt="Google"
                      />
                      Sign up with Google
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ textAlign: "center", marginTop: "40px" }}>
                    <Email
                      sx={{
                        fontSize: 80,
                        color: "#3a704e",
                        marginBottom: 2,
                      }}
                    />
                    <Typography
                      variant="h4"
                      component="h1"
                      gutterBottom
                      sx={{
                        fontWeight: "bold",
                        color: "#3a704e",
                        marginBottom: 3,
                      }}
                    >
                      Verify your account
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ marginBottom: 2, fontSize: "16px" }}
                    >
                      Enter the OTP sent to your email
                    </Typography>
                    <TextField
                      label="OTP"
                      variant="standard"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      sx={{ marginBottom: 3, display: "flex" }}
                    />
                    <Button
                      variant="contained"
                      onClick={handleVerifyOtp}
                      disabled={isLoading}
                      sx={{
                        backgroundColor: "#3a704e",
                        "&:hover": { backgroundColor: "#3a704e" },
                        padding: "12px 32px",
                        fontSize: "16px",
                      }}
                    >
                      {isLoading ? "Verifying..." : "Verify OTP"}
                    </Button>
                  </div>
                </>
              )}
            </div>
            <div className="auth-footer">
              <Typography className="auth-bottom-text">
                Already have an account?{" "}
                <Link href="/auth/login" className="auth-bottom-link">
                  Sign In
                </Link>
              </Typography>
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

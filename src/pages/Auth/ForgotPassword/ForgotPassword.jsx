import Grid from "@mui/material/Grid";
import "../Login/Login.css";
import imageAuth from "../../../assets/image/ZRRXzB20OVRZOT67Cgq3GEIwusisOXv9FVHoHmSs.webp";
import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useAuth from "../../../hooks/useAuth";

import toast from "react-hot-toast";
import { forgotPasswordAPI } from "../../../store/slices/authSlice";

const schema = yup
  .object({
    email: yup
      .string()
      .email("Email không đúng định dạng")
      .required("Email là bắt buộc"),
  })
  .required();

export default function ForgotPassword() {
  const { dispatch, isLoading } = useAuth();
  const [successMessage, setSuccessMessage] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });


  const onSubmit = async (data) => {
    try {
      const response = await dispatch(forgotPasswordAPI(data)).unwrap();
      toast.success("Yêu cầu đặt lại mật khẩu đã được gửi!");
      setSuccessMessage(true);
    } catch (error) {
      toast.error(error?.message || "Có lỗi xảy ra, vui lòng thử lại!");
    }
  };



  return (
    <div className="auth-container">
      <div className="auth-content">
        <Grid container spacing={2}>
          <Grid item size={{ xs: 6, md: 6 }} className="auth-left">
            <div className="auth-left-content">
              <Typography className="auth-left-title">
                Forgot password
              </Typography>
              {successMessage ? (
                <Typography
                  variant="h6"
                  color="primary"
                  align="center"
                  sx={{ mt: 4 }}
                >
                  Check your email to reset your password!
                </Typography>
              ) : (
                <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
                  <TextField
                    id="email"
                    label="Email"
                    variant="standard"
                    placeholder="Nhập email của bạn"
                    {...register("email")}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                  <Button
                    type="submit"
                    className="auth-button"
                    disabled={isLoading}
                    sx={{ mt: 2 }}
                  >
                    {isLoading ? "Processing..." : "Reset Password"}
                  </Button>
                </form>
              )}
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
            <img className="auth-image" src={imageAuth} alt="imageAuth" />
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

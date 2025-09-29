import Grid from "@mui/material/Grid";
import "./Login.css";
import imageAuth from "../../../assets/image/ZRRXzB20OVRZOT67Cgq3GEIwusisOXv9FVHoHmSs.webp";
import imageGoogle from "../../../assets/image/search.png";
import imageFacebook from "../../../assets/image/facebook.png";
import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import IconButton from "@mui/material/IconButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { loginAPI } from "../../../store/slices/authSlice"; 
import toast from "react-hot-toast";
import { PATH } from "../../../routes/path";
import useAuth from "../../../hooks/useAuth"; 


const schema = yup
  .object({
    email: yup
      .string()
      .email("Email không hợp lệ")
      .required("Email là bắt buộc"),
    password: yup.string().required("Mật khẩu là bắt buộc"),
  })
  .required();

export default function Login() {
  const { dispatch, navigate, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(null);


  // Clear error when component mounts
  useEffect(() => {
    setLoginError(null);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  // Hàm xử lý login thường (email/password)
  const onSubmit = async (data) => {
    try {
      setLoginError(null); 
      const payload = await dispatch(loginAPI(data)).unwrap();
      
      if (payload && payload.data) {
        toast.success("Đăng nhập thành công!");
        localStorage.setItem("currentUser", JSON.stringify(payload.data));

        const userType = payload.data.user?.role?.trim().toLowerCase();
        if (userType === "customer") {
          navigate(PATH.HOME, { replace: true });
        } else if (userType === "bussiness") {
          navigate(PATH.BUSINESS, { replace: true });
        } else if (userType === "admin" || userType === "administrator") {
          navigate(PATH.ADMIN, { replace: true });
        } else {
          toast.error("Vai trò không hợp lệ, vui lòng liên hệ quản trị viên.");
        }
      } else {
        toast.error(payload?.message || "Đăng nhập thất bại, vui lòng thử lại.");
      }
    } catch {
      // Lỗi đã được xử lý trong authSlice, chỉ cần set error state cho UI
      setLoginError("Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.");
    }
  };

  // Hàm xử lý login Google
  const handleGoogleLogin = async () => {
    try {
      window.location.href = "http://localhost:8000/auth/google";
    
    } catch (error) {
      const errorMessage =
        error?.message || "Sign in with Google failed, please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <div className="auth-container">
        <div className="auth-content">
          <Grid container spacing={2}>
            <Grid item size={{ xs: 6, md: 6 }} className="auth-left">
              <div className="auth-left-content">
                <Typography className="auth-left-title">
                Welcome back!
                </Typography>
                <Typography className="auth-left-subtitle">
                 Enter your login information to access your account
                </Typography>
                <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
                  <TextField
                    id="email"
                    label="Email"
                    variant="standard"
                    {...register("email")}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                  <Link
                    href="/auth/forgotpassword"
                    sx={{ marginTop: "20px" }}
                    className="auth-forget"
                  >
                   Forgot your password?
                  </Link>
                  <TextField
                    id="password"
                    label="Password"
                    variant="standard"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
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
                  <FormControlLabel
                    sx={{ marginTop: "20px" }}
                    control={<Checkbox defaultChecked />}
                    label="Remember me"
                  />
              
                  <Button
                    type="submit"
                    className="auth-button"
                    disabled={isLoading}
                  >
                    {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                  </Button>
                </form>
                <div className="auth-subtitle-container">
                  <Typography className="auth-subtitle">
                    <div className="auth-subtitle-line" />
                    hoặc
                    <div className="auth-subtitle-line" />
                  </Typography>
                </div>
                <div className="auth-social">
                  <Button
                    className="auth-social-button google"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                  >
                    <img src={imageGoogle} className="auth-social-image" />
                    Sign in with Google
                  </Button>
                  <Button className="auth-social-button facebook">
                    <img src={imageFacebook} className="auth-social-image" />
                    Log in with Facebook
                  </Button>
                </div>
              </div>
              <div className="auth-footer">
                <Typography className="auth-bottom-text">
                  Don't have an account?{" "}
                  <Link href="/auth/register" className="auth-bottom-link">
                  Sing up
                  </Link>
                </Typography>
              </div>
            </Grid>
            <Grid item size={{ xs: 6, md: 6 }} className="auth-left">
              <img
                className="auth-image"
                src={imageAuth}
                alt="Hình minh họa đăng nhập"
              />
            </Grid>
          </Grid>
        </div>
      </div>
    </>
  );
}

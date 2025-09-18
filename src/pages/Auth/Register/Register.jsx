import Grid from "@mui/material/Grid";
import "../../Auth/Login/Login.css";
import imageAuth from "../../../assets/image/ZRRXzB20OVRZOT67Cgq3GEIwusisOXv9FVHoHmSs.webp";
import imageGoogle from "../../../assets/image/search.png";
import imageFacebook from "../../../assets/image/facebook.png";
import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup
  .object({
    userName: yup.string().required("Full name is not a required"),
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is not a required"),
    password: yup.string().required("Password is not a required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  })
  .required();

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleClickShowConfirmPassword = () => {
    setConfirmPassword((prev) => !prev);
  };

  const onSubmit = (data) => console.log(data);
  return (
    <>
      <div className="auth-container">
        <div className="auth-content">
          <Grid container spacing={2}>
            <Grid item size={{ xs: 6, md: 6 }} className="auth-left">
              <div className="auth-left-content">
                <Typography className="auth-left-title">
                  Get start now
                </Typography>
                <Typography className="auth-left-subtitle">
                  Enter your Credential to access your account
                </Typography>
                <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
                  <TextField
                    id="username"
                    label="Full name"
                    variant="standard"
                    sx={{ marginTop: "20px" }}
                    {...register("username")}
                    error={!!errors.userName}
                    helperText={errors.userName?.message}
                  />
                  <TextField
                    id="email"
                    label="Email"
                    variant="standard"
                    sx={{ marginTop: "20px" }}
                    {...register("email")}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />

                  <TextField
                    id="password"
                    label="Password"
                    variant="standard"
                    sx={{ marginTop: "20px" }}
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

                  <TextField
                    id="confirmPassword"
                    label="Confirm password"
                    variant="standard"
                    sx={{ marginTop: "20px" }}
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("confirmPassword")}
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
                    label="I agree to the terms $policy"
                    className="auth-checkbox"
                  />
                  <Button type="submit" className="auth-button">
                    Sign In
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
                  <Button className="auth-social-button google">
                    <img src={imageGoogle} className="auth-social-image" />
                    Sign in with Google
                  </Button>
                  <Button className="auth-social-button facebook">
                    <img src={imageFacebook} className="auth-social-image" />
                    Sign in with Facebook
                  </Button>
                </div>
              </div>

              <div className="auth-footer">
                <Typography className="auth-bottom-text">
                  Have an account?{" "}
                  <Link href="/auth/login" className="auth-bottom-link">
                    Sign In
                  </Link>
                </Typography>
              </div>
            </Grid>
            <Grid item size={{ xs: 6, md: 6 }} className="auth-left">
              <img
                className="auth-image"
                src={imageAuth}
                alt="Login Illustration"
              />
            </Grid>
          </Grid>
        </div>
      </div>
    </>
  );
}

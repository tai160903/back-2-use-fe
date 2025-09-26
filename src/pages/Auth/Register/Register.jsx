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
import { useDispatch, useSelector } from "react-redux";
import { registerApi } from "../../../store/slices/authSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../routes/path";

import { isValid, isAfter, parse } from "date-fns";

const schema = yup
  .object({
    name: yup.string().required("Full name is required"),
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
    address: yup.string().required("Address is required"),
    phone: yup
      .string()
      .matches(/^[0-9]{1,10}$/, "Phone number must be 1-10 digits")
      .required("Phone number is required"),
    yob: yup
      .date()
      .typeError("Date of birth must be a valid date")
      .test("is-valid-date", "Date of birth must be a valid date", (value) => {
        return isValid(value);
      })
      .test(
        "not-in-future",
        "Date of birth cannot be in the future",
        (value) => {
          return isValid(value) && !isAfter(value, new Date());
        }
      )
      .test("after-1900", "Date of birth must be after 1900", (value) => {
        return (
          isValid(value) &&
          isAfter(value, parse("1900-01-01", "yyyy-MM-dd", new Date()))
        );
      })
      .required("Date of birth is required"),
    password: yup.string().required("Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  })
  .required();

export default function Register() {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);
  const navigate = useNavigate();

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

  const onSubmit = async (data) => {
    try {
      await dispatch(registerApi(data)).unwrap();
      toast.success("Registered successfully!");
      navigate(PATH.LOGIN);
    } catch (error) {
      toast.error(error.message || "Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-content">
        <Grid container spacing={2}>
          <Grid item size={{ xs: 6, md: 6 }} className="auth-left">
            <div className="auth-left-content">
              <Typography className="auth-left-title">
                Get started now
              </Typography>
              <Typography className="auth-left-subtitle">
                Enter your credentials to access your account
              </Typography>
              <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
                <TextField
                  id="name"
                  label="Full name"
                  variant="standard"
                  sx={{ marginTop: "20px" }}
                  {...register("name")}
                  error={!!errors.name}
                  helperText={errors.name?.message}
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
                  id="address"
                  label="Address"
                  variant="standard"
                  sx={{ marginTop: "20px" }}
                  {...register("address")}
                  error={!!errors.address}
                  helperText={errors.address?.message}
                />
                <TextField
                  id="phone"
                  label="Phone"
                  variant="standard"
                  sx={{ marginTop: "20px" }}
                  {...register("phone")}
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                />
                <TextField
                  id="yob"
                  label="Date of Birth"
                  type="date"
                  variant="standard"
                  sx={{ marginTop: "20px" }}
                  InputLabelProps={{ shrink: true }}
                  {...register("yob")}
                  error={!!errors.yob}
                  helperText={errors.yob?.message}
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
                <Button className="auth-social-button google">
                  <img
                    src={imageGoogle}
                    className="auth-social-image"
                    alt="Google"
                  />
                  Sign up with Google
                </Button>
                <Button className="auth-social-button facebook">
                  <img
                    src={imageFacebook}
                    className="auth-social-image"
                    alt="Facebook"
                  />
                  Sign up with Facebook
                </Button>
              </div>
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

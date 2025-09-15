import Grid from "@mui/material/Grid";
import "./Login.css";
import imageAuth from "../../../assets/image/ZRRXzB20OVRZOT67Cgq3GEIwusisOXv9FVHoHmSs.webp";
import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";

export default function Login() {
  return (
    <>
      <div className="auth-container">
        <div className="auth-content">
          <Grid container spacing={2}>
            <Grid item size={{ xs: 6, md: 6 }} className="auth-left">
              <div className="auth-left-content">
                <Typography className="auth-left-title">
                  Welcome Back!
                </Typography>
                <Typography className="auth-left-subtitle">
                  Enter your Credential to access your account
                </Typography>
                <form className="auth-form">
                  <TextField
                    id="standard-basic"
                    label="Standard"
                    variant="standard"
                  />
                  <Link to="/" sx={{ marginTop: "20px" }} className="auth-forget">
                    Forget password?
                  </Link>
                  <TextField
                    id="standard-basic"
                    label="Standard"
                    variant="standard"
                  />
                </form>
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

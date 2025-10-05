import {
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import "./RegisterBussiness.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import { registerBusinessAPI } from "../../../store/slices/authSlice";
import useAuth from "../../../hooks/useAuth";

const schema = yup
  .object({
    storeName: yup.string().required("Company name is required."),
    storeMail: yup
      .string()
      .email("Invalid email format.")
      .required("Email is required."),
    storePhone: yup
      .string()
      .matches(/^[0-9]{10,15}$/, "Phone number must contain between 10 and 15 digits.")
      .required("Phone number is required."),
    storeAddress: yup.string().required("Store address  is required."),
    taxCode: yup.string().required("Tax code is required."),
  })
  .required();

function RegisterBussiness() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [files, setFiles] = useState({
    businessLicenseFile: null,
    foodLicenseFile: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: "", message: "" });

  const { dispatch } = useAuth();

  const handleFileChange = (e, type) => {
    const file = e.target.files?.[0] || null;
    setFiles((prev) => ({ ...prev, [type]: file }));
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    setSubmitMessage({ type: "", message: "" });

    try {
      // Tạo FormData để gửi file
      const formData = new FormData();

      // Thêm thông tin form
      formData.append("storeName", data.storeName);
      formData.append("storeMail", data.storeMail);
      formData.append("storePhone", data.storePhone);
      formData.append("storeAddress", data.storeAddress);
      formData.append("taxCode", data.taxCode);

      // Thêm file
      if (files.businessLicenseFile) {
        formData.append("businessLicenseFile", files.businessLicenseFile);
      }
      if (files.foodLicenseFile) {
        formData.append("foodLicenseFile", files.foodLicenseFile);
      }

      await dispatch(registerBusinessAPI(formData)).unwrap();
    } catch (error) {
      setSubmitMessage({
        type: "error",
        message:
          error.response?.data?.message ||
          "Có lỗi xảy ra khi đăng ký. Vui lòng thử lại sau.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="registerBusiness-container">
      <div className="registerBusiness-main">
        <Paper elevation={6} className="registerBusiness-formPaper">
          <div className="registerBusiness-formHeader">
            <Typography variant="h5">Business registration</Typography>
            <Typography variant="body2">
              Join the Back2Use cup recycling network
            </Typography>
          </div>

          <form
            className="registerBusiness-form"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="registerBusiness-formSection">
              <Grid container spacing={3}>
                <Grid item size={6} className="registerBussiness-info">
                  Account information
                  <div className="registerBusiness-line"></div>
                  <div>
                    <TextField
                      className="registerBusinessForm "
                      id="storeMail"
                      label="Email"
                      variant="outlined"
                      {...register("storeMail")}
                      error={!!errors.storeMail}
                      helperText={errors.storeMail?.message}
                    />
                    <TextField
                      className="registerBusinessForm "
                      id="storePhone"
                      label="Store Phone"
                      variant="outlined"
                      {...register("storePhone")}
                      error={!!errors.storePhone}
                      helperText={errors.storePhone?.message}
                    />
                    <TextField
                      className="registerBusinessForm "
                      id="storeAddress"
                      label="Store Address"
                      variant="outlined"
                      {...register("storeAddress")}
                      error={!!errors.storeAddress}
                      helperText={errors.storeAddress?.message}
                    />
                  </div>
                </Grid>

                <Grid item size={6} className="registerBussiness-bussiness">
                  Business information
                  <div className="registerBusiness-line"></div>
                  <TextField
                    className="registerBusinessForm"
                    id="storeName"
                    label="Store Name"
                    variant="outlined"
                    {...register("storeName")}
                    error={!!errors.storeName}
                    helperText={errors.storeName?.message}
                  />
                  <TextField
                    className="registerBusinessForm"
                    id="taxCode"
                    label="Tax Code"
                    variant="outlined"
                    {...register("taxCode")}
                    error={!!errors.taxCode}
                    helperText={errors.taxCode?.message}
                  />
                </Grid>
              </Grid>
            </div>

            <div className="registerBusiness-fileSection">
              <Typography
                variant="subtitle1"
                className="registerBusiness-sectionTitle"
              >
                Attached document
              </Typography>

              <Grid container spacing={3}>
                <Grid item size={6}>
                  <div className="registerBusiness-fileUpload mt-2">
                    <input
                      type="file"
                      id="businessLicenseFile"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) =>
                        handleFileChange(e, "businessLicenseFile")
                      }
                      className="registerBusiness-fileInput"
                    />
                    <label
                      htmlFor="businessLicenseFile"
                      className="registerBusiness-fileLabel"
                    >
                      {files.businessLicenseFile ? (
                        <span className="text-white">
                          {files.businessLicenseFile.name}
                        </span>
                      ) : (
                        <div className="registerBusiness-uploadBox">
                          <p>Business license</p>
                          <small>PDF, JPG, PNG (Maximum 5MB)</small>
                        </div>
                      )}
                    </label>
                    {errors.businessLicenseFile && (
                      <p className="registerBusiness-error">
                        {errors.businessLicenseFile.message}
                      </p>
                    )}
                  </div>
                </Grid>

                <Grid item size={6}>
                  <div className="registerBusiness-fileUpload mt-2">
                    <input
                      type="file"
                      id="foodLicenseFile"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(e, "foodLicenseFile")}
                      className="registerBusiness-fileInput"
                    />
                    <label
                      htmlFor="foodLicenseFile"
                      className="registerBusiness-fileLabel"
                    >
                      {files.foodLicenseFile ? (
                        <span className="text-white">
                          {files.foodLicenseFile.name}
                        </span>
                      ) : (
                        <div className="registerBusiness-uploadBox">
                          <p>CFood safety certificate</p>
                          <small>PDF, JPG, PNG (Maximum 5MB)</small>
                        </div>
                      )}
                    </label>
                    {errors.foodLicenseFile && (
                      <p className="registerBusiness-error">
                        {errors.foodLicenseFile.message}
                      </p>
                    )}
                  </div>
                </Grid>
              </Grid>
            </div>

            {/* Hiển thị thông báo */}
            {submitMessage.message && (
              <Alert
                severity={
                  submitMessage.type === "success" ? "success" : "error"
                }
                sx={{ mb: 2 }}
              >
                {submitMessage.message}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              color="success"
              fullWidth
              className="registerBusiness-submitBtn"
              disabled={isLoading}
              startIcon={
                isLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : null
              }
            >
              {isLoading ? "Processing..." : "Register"}
            </Button>
          </form>
        </Paper>
      </div>
    </div>
  );
}

export default RegisterBussiness;

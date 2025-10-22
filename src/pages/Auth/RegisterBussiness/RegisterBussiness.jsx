import {
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";
import "./RegisterBussiness.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import { registerBusinessAPI } from "../../../store/slices/authSlice";
import useAuth from "../../../hooks/useAuth";
import toast from "react-hot-toast";
import AddressSelector from "../../../components/AddressSelector/AddressSelector";

const schema = yup
  .object({
    businessName: yup.string().required("Business name is required."),
    businessMail: yup
      .string()
      .email("Invalid email format.")
      .required("Email is required."),
    businessPhone: yup
      .string()
      .required("Phone number is required."),
    businessType: yup.string().required("Business type is required."),
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
    businessLogo: null,
    businessLicenseFile: null,
    foodLicenseFile: null,
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);

  const { dispatch, isLoading } = useAuth();

  const handleFileChange = (e, type) => {
    const file = e.target.files?.[0] || null;
    setFiles((prev) => ({ ...prev, [type]: file }));
  };

  const handleLocationSelect = (address, addressDetails) => {
    setSelectedAddress(address);
    // AddressSelector không trả về coordinates, chỉ trả về addressDetails
    if (addressDetails) {
      setSelectedCoordinates(null); // Không có coordinates từ dropdown
    }
  };

  const onSubmit = async (data) => {
    // Validate required files
    if (!files.businessLogo) {
      toast.error("Business logo is required.");
      return;
    }
    if (!files.businessLicenseFile) {
      toast.error("Business license file is required.");
      return;
    }
    if (!files.foodLicenseFile) {
      toast.error("Food safety certificate is required.");
      return;
    }
    if (!selectedAddress) {
      toast.error("Please select a location on the map.");
      return;
    }

    try {
      // Create FormData to send files
      const formData = new FormData();

      // Add form information
      formData.append("businessName", data.businessName);
      formData.append("businessType", data.businessType);
      formData.append("businessMail", data.businessMail);
      formData.append("businessAddress", selectedAddress); // Use address from map
      formData.append("businessPhone", data.businessPhone);
      formData.append("taxCode", data.taxCode);
      
      // Add coordinates if available (only from map, not from dropdown)
      if (selectedCoordinates) {
        formData.append("latitude", selectedCoordinates[0]);
        formData.append("longitude", selectedCoordinates[1]);
      }

      // Add files
      if (files.businessLogo) {
        formData.append("businessLogo", files.businessLogo);
      }
      if (files.businessLicenseFile) {
        formData.append("businessLicenseFile", files.businessLicenseFile);
      }
      if (files.foodLicenseFile) {
        formData.append("foodSafetyCertUrl", files.foodLicenseFile);
      }

      await dispatch(registerBusinessAPI(formData)).unwrap();
      setIsSuccess(true);
    } catch (error) {
      // Error will be handled in authSlice through toast
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="registerBusiness-container">
      <div className="registerBusiness-main">
        <div className="registerBusiness-content">
          {/* Left Section - Welcome Message */}
          <div className="registerBusiness-welcome">
            <div className="registerBusiness-welcome-content">
              {isSuccess ? (
                <>
                  <Typography variant="h3" className="registerBusiness-welcome-title">
                    Registration Successful
                  </Typography>
                  <Typography variant="body1" className="registerBusiness-welcome-description">
                    Đăng ký thành công chờ hệ thống phê duyệt
                  </Typography>
                </>
              ) : (
                <>
                  <Typography variant="h3" className="registerBusiness-welcome-title">
                    Register Business
                  </Typography>
                  <Typography variant="body1" className="registerBusiness-welcome-description">
                    Join the Back2Use cup recycling network and contribute to environmental protection. 
                    Register your business to become a partner in our sustainable ecosystem.
                  </Typography>
                </>
              )}
            </div>
          </div>

          {/* Right Section - Registration Form */}
          <div className="registerBusiness-form-section">
            <div className="registerBusiness-form-container">
              <Typography variant="h4" className="registerBusiness-form-title">
                {/* Business Registration */}
              </Typography>

              <form
                className="registerBusiness-form"
                onSubmit={handleSubmit(onSubmit)}
              >
                {/* BUSINESS INFO SECTION */}
                <div className="registerBusiness-section">
                  <div className="registerBusiness-section-header">
                    <h3>Business Information</h3>
                    <p>Enter your business details</p>
                  </div>
                  
                  <div className="registerBusiness-form-fields">
                    <TextField
                      className="registerBusinessForm"
                      id="businessName"
                      label="Business Name *"
                      variant="outlined"
                      {...register("businessName")}
                      error={!!errors.businessName}
                      helperText={errors.businessName?.message}
                    />
                    
                    <TextField
                      className="registerBusinessForm"
                      id="businessMail"
                      label="Email *"
                      variant="outlined"
                      {...register("businessMail")}
                      error={!!errors.businessMail}
                      helperText={errors.businessMail?.message}
                    />
                    
                    <TextField
                      className="registerBusinessForm"
                      id="businessPhone"
                      label="Phone Number *"
                      variant="outlined"
                      {...register("businessPhone")}
                      error={!!errors.businessPhone}
                      helperText={errors.businessPhone?.message}
                    />
                    
                    <TextField
                      className="registerBusinessForm"
                      id="businessType"
                      label="Business Type *"
                      variant="outlined"
                      placeholder="e.g., Restaurant, Coffee Shop, Bakery..."
                      {...register("businessType")}
                      error={!!errors.businessType}
                      helperText={errors.businessType?.message}
                    />
                    
                    <TextField
                      className="registerBusinessForm"
                      id="taxCode"
                      label="Tax Code *"
                      variant="outlined"
                      {...register("taxCode")}
                      error={!!errors.taxCode}
                      helperText={errors.taxCode?.message}
                    />
                  </div>
                </div>

                {/* BUSINESS LOCATION SECTION */}
                <div className="registerBusiness-section">
                  <div className="registerBusiness-section-header">
                    <h3>Business Location</h3>
                    <p>Select your business address</p>
                  </div>
                  
                  <div className="registerBusiness-address-field">
                    <AddressSelector 
                      onAddressSelect={handleLocationSelect}
                    />
                  </div>
                </div>

                {/* REQUIRED DOCUMENTS SECTION */}
                <div className="registerBusiness-section">
                  <div className="registerBusiness-section-header">
                    <h3>Required Documents</h3>
                    <p>Upload necessary business documents for verification</p>
                  </div>
                  
                  <div className="registerBusiness-fileSection">
                    <div className="registerBusiness-fileUpload">
                      <input
                        type="file"
                        id="businessLogo"
                        accept=".jpg,.jpeg,.png,.webp"
                        onChange={(e) => handleFileChange(e, "businessLogo")}
                        className="registerBusiness-fileInput"
                      />
                      <label
                        htmlFor="businessLogo"
                        className="registerBusiness-fileLabel"
                      >
                        {files.businessLogo ? (
                          <span className="registerBusiness-fileName">
                            {files.businessLogo.name}
                          </span>
                        ) : (
                          <div className="registerBusiness-uploadBox">
                            <p>Business Logo *</p>
                            <small>JPG, PNG, WEBP (Max 5MB)</small>
                          </div>
                        )}
                      </label>
                    </div>

                    <div className="registerBusiness-fileUpload">
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
                          <span className="registerBusiness-fileName">
                            {files.businessLicenseFile.name}
                          </span>
                        ) : (
                          <div className="registerBusiness-uploadBox">
                            <p>Business License *</p>
                            <small>PDF, JPG, PNG (Max 5MB)</small>
                          </div>
                        )}
                      </label>
                    </div>

                    <div className="registerBusiness-fileUpload">
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
                          <span className="registerBusiness-fileName">
                            {files.foodLicenseFile.name}
                          </span>
                        ) : (
                          <div className="registerBusiness-uploadBox">
                            <p>Food Safety Certificate *</p>
                            <small>PDF, JPG, PNG (Max 5MB)</small>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  className="registerBusiness-submitBtn"
                  disabled={isLoading || isSuccess}
                  startIcon={
                    isLoading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : null
                  }
                >
                  {isLoading ? "Processing..." : "Register Business"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterBussiness;

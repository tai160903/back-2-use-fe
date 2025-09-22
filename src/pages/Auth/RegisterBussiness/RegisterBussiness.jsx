import { TextField, Button, Grid, Paper, Typography } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import "./RegisterBussiness.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";

const schema = yup
  .object({
    companyName: yup.string().required("Tên công ty là bắt buộc"),
    email: yup
      .string()
      .email("Định dạng email không hợp lệ")
      .required("Email là bắt buộc"),
    phone: yup
      .string()
      .matches(/^[0-9]{10,15}$/, "Số điện thoại phải có từ 10 đến 15 chữ số")
      .required("Số điện thoại là bắt buộc"),
    password: yup.string().required("Mật khẩu là bắt buộc"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Mật khẩu xác nhận phải khớp")
      .required("Xác nhận mật khẩu là bắt buộc"),
    typeOfBusiness: yup.string().required("Loại hình kinh doanh là bắt buộc"),
    taxNumber: yup.string().required("Mã số thuế là bắt buộc"),
    businessLicense: yup
      .mixed()
      .required("Giấy phép kinh doanh là bắt buộc")
      .test("fileSize", "Kích thước file quá lớn (tối đa 5MB)", (value) => {
        return value && value.size <= 5 * 1024 * 1024; // 5MB
      })
      .test("fileType", "Chỉ hỗ trợ PDF, JPG, PNG", (value) => {
        return (
          value &&
          ["application/pdf", "image/jpeg", "image/png"].includes(value.type)
        );
      }),
    foodSafetyCert: yup
      .mixed()
      .required("Chứng nhận an toàn thực phẩm là bắt buộc")
      .test("fileSize", "Kích thước file quá lớn (tối đa 5MB)", (value) => {
        return value && value.size <= 5 * 1024 * 1024; // 5MB
      })
      .test("fileType", "Chỉ hỗ trợ PDF, JPG, PNG", (value) => {
        return (
          value &&
          ["application/pdf", "image/jpeg", "image/png"].includes(value.type)
        );
      }),
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
    businessLicense: null,
    foodSafetyCert: null,
  });

  const handleFileChange = (e, type) => {
    const file = e.target.files?.[0] || null;
    setFiles((prev) => ({ ...prev, [type]: file }));
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const onSubmit = (data) => {
    console.log({ ...data, files });
  };

  return (
    <div className="registerBusiness-container">
      <div className="registerBusiness-main">
        <Paper elevation={6} className="registerBusiness-formPaper">
          <div className="registerBusiness-formHeader">
            <Typography variant="h5">Đăng ký doanh nghiệp</Typography>
            <Typography variant="body2">
              Tham gia mạng lưới cốc tái chế back2use
            </Typography>
          </div>

          <form
            className="registerBusiness-form"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="registerBusiness-formSection">
              <Grid container spacing={3}>
                <Grid item size={6} className="registerBussiness-info">
                  Thông tin tài khoản
                  <div className="registerBusiness-line"></div>
                  <div>
                    <TextField
                      className="registerBusinessForm "
                      id="email"
                      label="Email"
                      variant="outlined"
                      {...register("email")}
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                    <TextField
                      className="registerBusinessForm "
                      id="phone"
                      label="Số điện thoại"
                      variant="outlined"
                      {...register("phone")}
                      error={!!errors.phone}
                      helperText={errors.phone?.message}
                    />
                    <TextField
                      className="registerBusinessForm "
                      id="password"
                      label="Mật khẩu"
                      variant="outlined"
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
                            className="text-white"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        ),
                      }}
                    />
                    <TextField
                      className="registerBusinessForm "
                      id="confirmPassword"
                      label="Xác nhận mật khẩu"
                      variant="outlined"
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
                            className="text-white"
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
                  </div>
                </Grid>

                <Grid item size={6} className="registerBussiness-bussiness">
                  Thông tin doanh nghiệp
                  <div className="registerBusiness-line"></div>
                  <TextField
                    className="registerBusinessForm"
                    id="companyName"
                    label="Tên công ty"
                    variant="outlined"
                    {...register("companyName")}
                    error={!!errors.companyName}
                    helperText={errors.companyName?.message}
                  />
                  <TextField
                    className="registerBusinessForm "
                    id="typeOfBusiness"
                    label="Loại hình kinh doanh"
                    variant="outlined"
                    {...register("typeOfBusiness")}
                    error={!!errors.typeOfBusiness}
                    helperText={errors.typeOfBusiness?.message}
                  />
                  <TextField
                    className="registerBusinessForm"
                    id="taxNumber"
                    label="Mã số thuế"
                    variant="outlined"
                    {...register("taxNumber")}
                    error={!!errors.taxNumber}
                    helperText={errors.taxNumber?.message}
                  />
                </Grid>
              </Grid>
            </div>

            <div className="registerBusiness-fileSection">
              <Typography
                variant="subtitle1"
                className="registerBusiness-sectionTitle"
              >
                Tài liệu đính kèm
              </Typography>

              <Grid container spacing={3}>
                <Grid item size={6}>
                  <div className="registerBusiness-fileUpload mt-2">
                    <input
                      type="file"
                      id="businessLicense"
                      accept=".pdf,.jpg,.jpeg,.png"
                      {...register("businessLicense")}
                      onChange={(e) => handleFileChange(e, "businessLicense")}
                      className="registerBusiness-fileInput"
                    />
                    <label
                      htmlFor="businessLicense"
                      className="registerBusiness-fileLabel"
                    >
                      {files.businessLicense ? (
                        <span className="text-white">
                          {files.businessLicense.name}
                        </span>
                      ) : (
                        <div className="registerBusiness-uploadBox">
                          <p>Giấy phép kinh doanh</p>
                          <small>PDF, JPG, PNG (tối đa 5MB)</small>
                        </div>
                      )}
                    </label>
                    {errors.businessLicense && (
                      <p className="registerBusiness-error">
                        {errors.businessLicense.message}
                      </p>
                    )}
                  </div>
                </Grid>

                <Grid item size={6}>
                  <div className="registerBusiness-fileUpload mt-2">
                    <input
                      type="file"
                      id="foodSafetyCert"
                      accept=".pdf,.jpg,.jpeg,.png"
                      {...register("foodSafetyCert")}
                      onChange={(e) => handleFileChange(e, "foodSafetyCert")}
                      className="registerBusiness-fileInput"
                    />
                    <label
                      htmlFor="foodSafetyCert"
                      className="registerBusiness-fileLabel"
                    >
                      {files.foodSafetyCert ? (
                        <span className="text-white">
                          {files.foodSafetyCert.name}
                        </span>
                      ) : (
                        <div className="registerBusiness-uploadBox">
                          <p>Chứng nhận an toàn thực phẩm</p>
                          <small>PDF, JPG, PNG (tối đa 5MB)</small>
                        </div>
                      )}
                    </label>
                    {errors.foodSafetyCert && (
                      <p className="registerBusiness-error">
                        {errors.foodSafetyCert.message}
                      </p>
                    )}
                  </div>
                </Grid>
              </Grid>
            </div>

            <Button
              type="submit"
              variant="contained"
              color="success"
              fullWidth
              className="registerBusiness-submitBtn"
            >
              Đăng ký
            </Button>
          </form>
        </Paper>
      </div>
    </div>
  );
}

export default RegisterBussiness;

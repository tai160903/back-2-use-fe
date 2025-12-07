import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetcher from "../../apis/fetcher";
import toast from "react-hot-toast";

// Helper function để lấy user từ localStorage (đọc mỗi lần gọi, không cache)
const getUserFromLocalStorage = () => {
  try {
    const user = localStorage.getItem("currentUser");
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error parsing currentUser from localStorage:", error);
    localStorage.removeItem("currentUser");
    return null;
  }
};

// Register API
export const registerApi = createAsyncThunk(
  "auth/registerApi",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetcher.post("/auth/register", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Login API
export const loginAPI = createAsyncThunk(
  "auth/loginAPI",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetcher.post("/auth/login", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Forgot password
export const forgotPasswordAPI = createAsyncThunk(
  "auth/forgotPasswordAPI",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetcher.post("/auth/forgot-password", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Reset password
export const resetPasswordAPI = createAsyncThunk(
  "auth/resetPasswordAPI",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetcher.post("/auth/reset-password", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Active account
export const activeAccountAPI = createAsyncThunk(
  "auth/activeAccountAPI",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetcher.patch("/auth/active-account", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Resend OTP
export const resendOtpAPI = createAsyncThunk(
  "auth/resendOtpAPI",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetcher.post("/auth/resend-otp", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Register business
export const registerBusinessAPI = createAsyncThunk(
  "auth/registerBusinessAPI",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetcher.post("/businesses/form", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000, // 30 seconds timeout
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Google Redirect - Handle Google OAuth callback
export const googleRedirectAPI = createAsyncThunk(
  "auth/googleRedirectAPI",
  async (params, { rejectWithValue }) => {
    try {
      const response = await fetcher.get("/auth/google-redirect", {
        params: params, // code, state, etc from Google
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);


// Switch account type
export const switchAccountTypeAPI = createAsyncThunk(
  "auth/switchAccountTypeAPI",
  async(data, {rejectWithValue})=> {
    try {
      const response = await fetcher.post("/auth/switch-role", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
)

// change password
export const changePasswordAPI = createAsyncThunk(
  "auth/changePasswordAPI",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetcher.put("/auth/change-password", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
)

const authSlice = createSlice({
  name: "auth",
  initialState: () => ({
    currentUser: getUserFromLocalStorage(),
    isLoading: false,
    error: null,
  }),
  reducers: {
    logout: (state) => {
      state.currentUser = null;
      localStorage.removeItem("currentUser");
      toast.success("Logout successful.");
    },
    login: (state, { payload }) => {
      state.currentUser = payload;
      localStorage.setItem("currentUser", JSON.stringify(payload));
    },
    syncWithLocalStorage: (state) => {
      // Sync state với localStorage (dùng khi app reload)
      const userFromStorage = getUserFromLocalStorage();
      if (userFromStorage) {
        state.currentUser = userFromStorage;
      } else if (state.currentUser) {
        // Nếu localStorage không có nhưng state có, xóa state
        state.currentUser = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerApi.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerApi.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(registerApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;

      })
      .addCase(loginAPI.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginAPI.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.currentUser = payload.data;
      })
      .addCase(loginAPI.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;

      })
      .addCase(forgotPasswordAPI.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(forgotPasswordAPI.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.currentUser = payload;
      })
      .addCase(forgotPasswordAPI.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;

      })
      .addCase(resetPasswordAPI.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(resetPasswordAPI.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.currentUser = payload;
      })
      .addCase(resetPasswordAPI.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;

      })
      .addCase(activeAccountAPI.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(activeAccountAPI.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.currentUser = payload;
        localStorage.setItem("currentUser", JSON.stringify(payload));
        toast.success("Registration successful! You can log in now.");
      })
      .addCase(activeAccountAPI.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;

      })
      .addCase(resendOtpAPI.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(resendOtpAPI.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        toast.success("OTP has been resent successfully! Please check your email.");
      })
      .addCase(resendOtpAPI.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;

      })
      .addCase(registerBusinessAPI.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerBusinessAPI.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        toast.success("Business registration successful! Please wait for approval.");
      })
      .addCase(registerBusinessAPI.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
        toast.error(payload?.message || "An error occurred during registration. Please try again later.");
      })
      .addCase(googleRedirectAPI.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(googleRedirectAPI.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.currentUser = payload.data;
        localStorage.setItem("currentUser", JSON.stringify(payload.data));
        toast.success("Đăng nhập bằng Google thành công!");
      })
      .addCase(googleRedirectAPI.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
        toast.error(payload?.message || "Đăng nhập bằng Google thất bại. Vui lòng thử lại.");
      })
      .addCase(switchAccountTypeAPI.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(switchAccountTypeAPI.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.currentUser = payload.data;
        localStorage.setItem("currentUser", JSON.stringify(payload.data));
        toast.success(payload?.message || "Đổi loại tài khoản thành công.");
      })     
       .addCase(switchAccountTypeAPI.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
        toast.error(payload?.message || "Đổi loại tài khoản thất bại. Vui lòng thử lại.");
      })
      .addCase(changePasswordAPI.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(changePasswordAPI.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.currentUser = payload;
      })
      .addCase(changePasswordAPI.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
        toast.error(payload?.message || "Đổi mật khẩu thất bại. Vui lòng thử lại.");
      })
  },
});
export const { logout, login, syncWithLocalStorage } = authSlice.actions;
export default authSlice.reducer;
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetcher from "../../apis/fetcher";
import toast from "react-hot-toast";

// Helper function để xử lý error message
const handleErrorMessage = (payload, defaultMessage) => {
  let errorMessage = defaultMessage;

  if (payload?.message) {
    if (typeof payload.message === "object" && payload.message.message) {
      errorMessage = payload.message.message;
    } else if (typeof payload.message === "string") {
      errorMessage = payload.message;
    }
  }

  toast.error(errorMessage);
};

const userLocal = JSON.parse(localStorage.getItem("currentUser"));

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
      const response = await fetcher.post("/auth/active-account", data);
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
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    currentUser: userLocal,
    isLoading: false,
    error: null,
  },
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerApi.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerApi.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        toast.success(
          "Registration successful! Please check your email to verify your account."
        );
      })
      .addCase(registerApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
        handleErrorMessage(payload, "Registration failed. Please try again.");
      })
      .addCase(loginAPI.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginAPI.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.currentUser = payload;
      })
      .addCase(loginAPI.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
        handleErrorMessage(
          payload,
          "Login failed. Please check your email and password."
        );
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
        handleErrorMessage(
          payload,
          "Failed to send password reset email. Please try again."
        );
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
        handleErrorMessage(
          payload,
          "Password reset failed. Please try again."
        );
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
        handleErrorMessage(
          payload,
          "Account activation failed. Please try again."
        );
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
        handleErrorMessage(
          payload,
          "Failed to resend OTP. Please try again."
        );
      });
  },
});
export const { logout, login } = authSlice.actions;
export default authSlice.reducer;
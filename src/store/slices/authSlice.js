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

// active account
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

// register business
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
      toast.success("Đăng xuất thành công");
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
        // Không lưu currentUser ngay lập tức, chờ xác nhận email
        toast.success(
          "Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản."
        );
      })
      .addCase(registerApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
        handleErrorMessage(payload, "Đăng ký thất bại. Vui lòng thử lại.");
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
          "Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu."
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
          "Gửi email đặt lại mật khẩu thất bại. Vui lòng thử lại."
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
          "Đặt lại mật khẩu thất bại. Vui lòng thử lại."
        );
      })
      .addCase(registerBusinessAPI.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerBusinessAPI.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.currentUser = payload;
      })
      .addCase(registerBusinessAPI.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
        handleErrorMessage(
          payload,
          "Đăng ký doanh nghiệp thất bại. Vui lòng thử lại."
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
        toast.success("Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.");
      })
      .addCase(activeAccountAPI.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
        handleErrorMessage(
          payload,
          "Kích hoạt tài khoản thất bại. Vui lòng thử lại."
        );
      });
  },
});
export const { logout, login } = authSlice.actions;
export default authSlice.reducer;

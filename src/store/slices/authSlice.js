import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetcher from "../../apis/fetcher";
import toast from "react-hot-toast";

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
      .addCase(registerApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.currentUser = payload;
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
        state.currentUser = payload;
      })
      .addCase(loginAPI.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      .addCase(forgotPasswordAPI.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(forgotPasswordAPI.fulfilled, (state, {payload}) => {
        state.isLoading = false;
        state.error = null;
        state.currentUser = payload
      })
      .addCase(forgotPasswordAPI.rejected, (state, {payload}) => {
        state.isLoading = false;
        state.error = payload
      })
  },
});
export const { logout } = authSlice.actions;
export default authSlice.reducer;

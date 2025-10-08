import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetcher from "../../apis/fetcher";

// get Profile
export const getProfileApi = createAsyncThunk(
  "user/getProfileApi",
  async (__dirname, { rejectWithValue }) => {
    try {
      const response = await fetcher.get("/users/me");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// update Profile
export const updateProfileApi = createAsyncThunk(
  "user/updateProfileApi",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetcher.post("/users/edit-profile", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProfileApi.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProfileApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.userInfo = payload;
      })
      .addCase(getProfileApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      .addCase(updateProfileApi.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProfileApi.fulfilled, (state, {payload}) => {
        state.isLoading = false;
        state.error = null;
        state.userInfo = payload
      })
      .addCase(updateProfileApi.rejected, (state, {payload}) => {
        state.isLoading = null;
        state.error = payload;
      })
  },
});

export default userSlice.reducer;

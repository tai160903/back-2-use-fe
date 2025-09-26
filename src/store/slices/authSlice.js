import {
  createAsyncThunk,
  createSlice,

} from "@reduxjs/toolkit";
import fetcher from "../../apis/fetcher";

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

const authSlice = createSlice({
  name: "auth",
  initialState: {
    currentUser: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(registerApi.pending, (state) => {
        state.isLoading = true
    })
    .addCase(registerApi.fulfilled, (state, {payload}) => {
        state.isLoading = false;
         state.error = null;
        state.currentUser = payload;
    })
    .addCase(registerApi.rejected, (state, {payload}) => {
        state.isLoading = false;
        state.error = payload
    })
  },
});

export default authSlice.reducer;

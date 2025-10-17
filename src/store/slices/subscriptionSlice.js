import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetcher from "../../apis/fetcher";


// get all subscriptions
export const getALLSubscriptions = createAsyncThunk(
    "subscription/getALLSubscriptions",
    async (__dirname, {rejectWithValue}) => {
        try {
            const response = await fetcher.get("/subscriptions")
            console.log("response", response.data)
            return response.data;
        } catch (error) {
          return rejectWithValue(
            error.response ? error.response.data : error.message
          );
        }
    }
)   

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState: {
    subscription: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getALLSubscriptions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getALLSubscriptions.fulfilled, (state, {payload}) => {
        state.isLoading = false;
        state.error = null;
        state.subscription = payload
      })
      .addCase(getALLSubscriptions.rejected, (state, {payload}) => {
        state.isLoading = false;
        state.error = payload;
      })
  }
});

export default subscriptionSlice.reducer;
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetcher from "../../apis/fetcher";


// get all subscriptions
export const getALLSubscriptions = createAsyncThunk(
  "subscription/getALLSubscriptions",
  async (__dirname, { rejectWithValue }) => {
    try {
      const response = await fetcher.get("/subscriptions")
      console.log("duy", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
)


// get subscription by id
export const getSubscriptionById = createAsyncThunk(
  "subscription/getSubscriptionById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetcher.get(`/subscriptions/${id}`)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
)

// create subscription
export const createSubscription = createAsyncThunk(
  "subscription/createSubscription",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetcher.post("/subscriptions", data)
      dispatch(getALLSubscriptions());
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
)

// delete subscription
export const deleteSubscription = createAsyncThunk(
  "subscription/deleteSubscription",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetcher.patch(`/subscriptions/delete/${id}`)
      dispatch(getALLSubscriptions());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
)


// update subscription
export const updateSubscription = createAsyncThunk(
  "subscription/updateSubscription",
  async ({ id, data }, { rejectWithValue, dispatch }) => {
    try {

      const response = await fetcher.put(`/subscriptions/${id}`, data)
      dispatch(getALLSubscriptions());
      return response.data;
    } catch (error) {
      console.error("Update subscription error:", error);
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
)

// get all subscription features
export const getSubscriptionFeatures = createAsyncThunk(
  "subscription/getSubscriptionFeatures",
  async (__, { rejectWithValue }) => {
    try {
      const response = await fetcher.get("/subscriptions/features")
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
)

// update subscription features
export const updateSubscriptionFeatures = createAsyncThunk(
  "subscription/updateSubscriptionFeatures",
  async (features, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetcher.put("/subscriptions/features", { features })
      dispatch(getSubscriptionFeatures());
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
)

// delete subscription feature
export const deleteSubscriptionFeature = createAsyncThunk(
  "subscription/deleteSubscriptionFeature",
  async (feature, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetcher.delete(`/subscriptions/features/${feature}`)
      dispatch(getSubscriptionFeatures());
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
    subscriptionDetails: null, 
    features: [],
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
      .addCase(getALLSubscriptions.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.subscription = payload
      })
      .addCase(getALLSubscriptions.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      .addCase(createSubscription.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createSubscription.fulfilled, (state,) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(createSubscription.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      .addCase(deleteSubscription.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteSubscription.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.subscription = payload;
      })
      .addCase(deleteSubscription.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      .addCase(updateSubscription.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateSubscription.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.subscription = payload;
      })
      .addCase(updateSubscription.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      .addCase(getSubscriptionById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getSubscriptionById.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.subscriptionDetails = payload; // Lưu chi tiết vào state riêng
      })
      .addCase(getSubscriptionById.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      // Features reducers
      .addCase(getSubscriptionFeatures.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getSubscriptionFeatures.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.features = payload.data || [];
      })
      .addCase(getSubscriptionFeatures.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      .addCase(updateSubscriptionFeatures.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateSubscriptionFeatures.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.features = payload.data || [];
      })
      .addCase(updateSubscriptionFeatures.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      .addCase(deleteSubscriptionFeature.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteSubscriptionFeature.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.features = payload.data || [];
      })
      .addCase(deleteSubscriptionFeature.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
  }
});

export default subscriptionSlice.reducer;
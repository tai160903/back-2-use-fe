import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetcher from "../../apis/fetcher";


// create feedback customer
export const giveFeedbackApi = createAsyncThunk(
    "feedback/giveFeedbackApi",
    async(data, {rejectWithValue}) => {
        try {
            const response = await fetcher.post("/feedback", data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
)

// get feedback for customer
export const getFeedbackApi = createAsyncThunk(
    "feedback/getFeedbackApi",
    async({businessId, page, limit, rating}, {rejectWithValue}) => {
        try {
            const response = await fetcher.get(`/feedback/business/${businessId}?page=${page}&limit=${limit}&rating=${rating}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
)

// get feedback of customer
export const getFeedbackOfCustomerApi = createAsyncThunk(
    "feedback/getFeedbackOfCustomerApi",
    async({ page, limit, rating}, {rejectWithValue}) => {
        try {
            const response = await fetcher.get(`/feedback/my-feedbacks?page=${page}&limit=${limit}&rating=${rating}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
)

// delete feedback
export const deleteFeedbackApi = createAsyncThunk(
    "feedback/deleteFeedbackApi",
    async({id}, {rejectWithValue}) => {
        try {
            const response = await fetcher.delete(`/feedback/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
)

// update feedback
export const updateFeedbackApi = createAsyncThunk(
    "feedback/updateFeedbackApi",
    async({id, data}, {rejectWithValue}) => {
        try {
            const response = await fetcher.patch(`/feedback/${id}`, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
)



const feedbackSlice = createSlice({
    name: "feedback",
    initialState: {
        businessFeedback: null, 
        myFeedback: null,       
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(giveFeedbackApi.pending, (state) => {
            state.loading = true; 
            state.error = null;
        })
        .addCase(giveFeedbackApi.fulfilled, (state) => {
            state.loading = false;
        })
        .addCase(giveFeedbackApi.rejected, (state, {payload}) => {
            state.loading = false;
            state.error = payload;
        })
        .addCase(getFeedbackApi.pending, (state) => {
            state.loading = true; 
            state.error = null;
        })
        .addCase(getFeedbackApi.fulfilled, (state, {payload}) => {
            state.loading = false;
            state.businessFeedback = payload;
        })
        .addCase(getFeedbackApi.rejected, (state, {payload}) => {
            state.loading = false;
            state.error = payload;
        })
        .addCase(getFeedbackOfCustomerApi.pending, (state) => {
            state.loading = true; 
            state.error = null;
        })
        .addCase(getFeedbackOfCustomerApi.fulfilled, (state, {payload}) => {
            state.loading = false;
            state.myFeedback = payload;
        })
        .addCase(getFeedbackOfCustomerApi.rejected, (state, {payload}) => {
            state.loading = false;
            state.error = payload;
        })
        .addCase(deleteFeedbackApi.pending, (state) => {
            state.loading = true; 
            state.error = null;
        })
        .addCase(deleteFeedbackApi.fulfilled, (state) => {
            state.loading = false;
        })
        .addCase(deleteFeedbackApi.rejected, (state, {payload}) => {
            state.loading = false;
            state.error = payload;
        })
        .addCase(updateFeedbackApi.pending, (state) => {
            state.loading = true; 
            state.error = null;
        })
        .addCase(updateFeedbackApi.fulfilled, (state) => {
            state.loading = false;
        })
        .addCase(updateFeedbackApi.rejected, (state, {payload}) => {
            state.loading = false;
            state.error = payload;
        })
    }
})

export default feedbackSlice.reducer;
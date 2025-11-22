import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetcher from "../../apis/fetcher";




export const getLeaderBoardApiCustomer = createAsyncThunk(
    "leaderBoard/getLeaderBoardApiCustomer",
    async (params = {}, { rejectWithValue }) => {
        try {
            
            const response = await fetcher.get("/monthly-leaderboards", {
                params,
            });
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
)

export const LeaderBoardSlice = createSlice({
    name: "leaderBoard",
    initialState: {
        leaderBoard: [],
        isLoading: false,
        error: null,
    },
    reducers: {
     
    },
    extraReducers: (builder) => {
        builder.addCase(getLeaderBoardApiCustomer.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(getLeaderBoardApiCustomer.fulfilled, (state, { payload }) => {
            state.isLoading = false;
            state.error = null;
            state.leaderBoard = payload.data;
        })
        .addCase(getLeaderBoardApiCustomer.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        })
    }
})

export default LeaderBoardSlice.reducer;
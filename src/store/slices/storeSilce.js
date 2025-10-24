import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetcher from "../../apis/fetcher";


// get all store
export const getAllStoreApi = createAsyncThunk(
    "store/getAllStoreApi",
    async(_, {rejectWithValue}) => {
        try {
            const response = await fetcher.get("/businesses")
            console.log("duy", response.data);
            return response.data
        } catch (error) {
            return rejectWithValue(
                error.response ? error.response.data : error.message
            )   
        }
    }
)

// get nearby stores
export const getNearbyStores = createAsyncThunk(
    "store/getNearbyStores",
    async({ latitude, longitude, radius, page, limit}, {rejectWithValue}) => {
        try {
            // Bước 1: Lấy vị trí hiện tại của user
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    (pos) => resolve(pos),
                    (err) => reject(err),
                    {
                        enableHighAccuracy: true, 
                        timeout: 10000,           
                        maximumAge: 60000         
                    }
                );
            });
            const {latitude, longitude} = position.coords;
            const response = await fetcher.get(`/businesses/nearby?longitude=${longitude}&latitude=${latitude}&radius=${radius}&page=${page}&limit=${limit}`)
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response ? error.response.data : error.message
            )   
        }
    }
)


const storeSlice = createSlice({
name: "store",
initialState: {
    stores: [],
    totalPages: 0,
    total: 0,
    currentPage: 1,
    isLoading: false,
    error: null,
},
reducers: {
   
},
extraReducers: (builder) => {
    builder.addCase(getAllStoreApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
    })
    .addCase(getAllStoreApi.fulfilled, (state, {payload}) => {
        state.isLoading = false;
        state.error = null;
        state.stores = payload.data;
        state.totalPages = payload.totalPages;
        state.total = payload.total;
        state.currentPage = payload.currentPage;
    })
    .addCase(getAllStoreApi.rejected, (state, {payload}) => {
        state.isLoading = false;
        state.error = payload;
    })
    .addCase(getNearbyStores.pending, (state) => {
        state.isLoading = true;
        state.error = null;
    })
    .addCase(getNearbyStores.fulfilled, (state, {payload}) => {
        state.isLoading = false;
        state.stores = payload.data;
        state.totalPages = payload.totalPages || 0;
        state.total = payload.total || 0;
        state.currentPage = payload.currentPage || 1;
    })
    .addCase(getNearbyStores.rejected, (state, {payload}) => {
        state.isLoading = false;
        state.error = payload;
    })
}
})

export default storeSlice.reducer;
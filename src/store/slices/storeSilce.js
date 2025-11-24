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
            const response = await fetcher.get(`/businesses/nearby?longitude=${longitude}&latitude=${latitude}&radius=${radius}&page=${page}&limit=${limit}`)
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response ? error.response.data : error.message
            )   
        }
    }
)

// get store by id
export const getStoreById = createAsyncThunk(
    "store/getStoreById",
    async(id, {rejectWithValue}) => {
        try {
            const response = await fetcher.get(`/businesses/${id}`)
 
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message)
        }
    }
)

// get details product by id
export const getDetailsProductById = createAsyncThunk(
    "businesses/getDetailsProductById",
    async ({ productGroupId,page,limit}, { rejectWithValue }) => {
      try {
        const response = await fetcher.get(`/products/customer/${productGroupId}?page=${page}&limit=${limit}`);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response ? error.response.data : error.message);
      }
    }
  )

// get all products for business by group
export const getBusinessProductsByGroup = createAsyncThunk(
    "store/getBusinessProductsByGroup",
    async ({ productGroupId, page = 1, limit = 10, status, search }, { rejectWithValue }) => {
      try {
        let url = `/products/group/${productGroupId}?page=${page}&limit=${limit}`;
        
        if (status) {
          url += `&status=${status}`;
        }
        
        if (search) {
          url += `&search=${encodeURIComponent(search)}`;
        }
        
        const response = await fetcher.get(url);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response ? error.response.data : error.message);
      }
    }
  )


const storeSlice = createSlice({
name: "store",
initialState: {
    allStores: [], 
    nearbyStores: [], 
    storeDetail: null,
    detailsProduct: { products: [], total: 0, currentPage: 1, totalPages: 0 },
    businessProducts: { products: [], total: 0, currentPage: 1, totalPages: 0 },
    totalPages: 0,
    total: 0,
    currentPage: 1,
    isLoading: false,
    isLoadingNearby: false,
    isLoadingStoreDetail: false,
    isLoadingDetailsProduct: false,
    isLoadingBusinessProducts: false,
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
        state.allStores = payload.data;
        state.totalPages = payload.totalPages;
        state.total = payload.total;
        state.currentPage = payload.currentPage;
    })
    .addCase(getAllStoreApi.rejected, (state, {payload}) => {
        state.isLoading = false;
        state.error = payload;
    })
    .addCase(getNearbyStores.pending, (state) => {
        state.isLoadingNearby = true;
        state.error = null;
    })
    .addCase(getNearbyStores.fulfilled, (state, {payload}) => {
        state.isLoadingNearby = false;
        state.nearbyStores = payload.data;
        state.totalPages = payload.totalPages || 0;
        state.total = payload.total || 0;
        state.currentPage = payload.currentPage || 1;
    })
    .addCase(getNearbyStores.rejected, (state, {payload}) => {
        state.isLoadingNearby = false;
        state.error = payload;
    })
    .addCase(getStoreById.pending, (state) => {
        state.isLoadingStoreDetail = true;
        state.error = null;
    })
    .addCase(getStoreById.fulfilled, (state, {payload}) => {
        state.isLoadingStoreDetail = false;
        state.error = null;

        state.storeDetail = payload.data || payload;
    })
    .addCase(getStoreById.rejected, (state, {payload}) => {
        state.isLoadingStoreDetail = false;
        state.error = payload;
    })
    .addCase(getDetailsProductById.pending, (state) => {
        state.isLoadingDetailsProduct = true;
        state.error = null;
    })
    .addCase(getDetailsProductById.fulfilled, (state, {payload}) => {
        state.isLoadingDetailsProduct = false;
        state.error = null;
        state.detailsProduct = payload.data || payload;
    })
    .addCase(getDetailsProductById.rejected, (state, {payload}) => {
        state.isLoadingDetailsProduct = false;
        state.error = payload;
    })
    .addCase(getBusinessProductsByGroup.pending, (state) => {
        state.isLoadingBusinessProducts = true;
        state.error = null;
    })
    .addCase(getBusinessProductsByGroup.fulfilled, (state, {payload}) => {
        state.isLoadingBusinessProducts = false;
        state.error = null;
        state.businessProducts = {
            products: payload.data || payload.products || [],
            total: payload.total || 0,
            currentPage: payload.currentPage || payload.page || 1,
            totalPages: payload.totalPages || 0,
        };
    })
    .addCase(getBusinessProductsByGroup.rejected, (state, {payload}) => {
        state.isLoadingBusinessProducts = false;
        state.error = payload;
    })
}
})

export default storeSlice.reducer;
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetcher from "../../apis/fetcher";
import toast from "react-hot-toast";

// Create Single Use Product Type API
export const createSingleUseProductTypeApi = createAsyncThunk(
  "singleUseProductType/createSingleUseProductTypeApi",
  async (productTypeData, { rejectWithValue }) => {
    try {
      const response = await fetcher.post("/admin/single-use-product-type", productTypeData);
      toast.success("Single-use product type created successfully!");
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to create single-use product type";
      toast.error(errorMessage);
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Get All Single Use Product Types API
export const getAllSingleUseProductTypesApi = createAsyncThunk(
  "singleUseProductType/getAllSingleUseProductTypesApi",
  async ({ page = 1, limit = 10, isActive }, { rejectWithValue }) => {
    try {
      let url = `/admin/single-use-product-type?page=${page}&limit=${limit}`;
      
      // Append filter
      if (isActive !== undefined && isActive !== null && isActive !== '') {
        url += `&isActive=${isActive}`;
      }
      
      const response = await fetcher.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Update Single Use Product Type Status API
export const updateSingleUseProductTypeStatusApi = createAsyncThunk(
  "singleUseProductType/updateSingleUseProductTypeStatusApi",
  async ({ id, isActive }, { rejectWithValue }) => {
    try {
      const response = await fetcher.patch(`/admin/single-use-product-type/${id}/status`, { isActive });
      toast.success(`Product type ${isActive ? 'activated' : 'deactivated'} successfully!`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to update product type status";
      toast.error(errorMessage);
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Create Single Use Product Size API
export const createSingleUseProductSizeApi = createAsyncThunk(
  "singleUseProductType/createSingleUseProductSizeApi",
  async (productSizeData, { rejectWithValue }) => {
    try {
      // Only send required fields, exclude any pagination params
      const { productTypeId, sizeName, minWeight, maxWeight } = productSizeData;
      const payload = {
        productTypeId,
        sizeName,
        minWeight,
        maxWeight,
      };
      const response = await fetcher.post("/admin/single-use-product-size", payload);
      toast.success("Product size created successfully!");
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to create product size";
      toast.error(errorMessage);
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Get All Single Use Product Sizes API
export const getAllSingleUseProductSizesApi = createAsyncThunk(
  "singleUseProductType/getAllSingleUseProductSizesApi",
  async ({ productTypeId, isActive }, { rejectWithValue }) => {
    try {
      // Build query params - API may not support page/limit
      const params = new URLSearchParams();
      
      // Append filters
      if (productTypeId) {
        params.append('productTypeId', productTypeId);
      }
      if (isActive !== undefined && isActive !== null && isActive !== '') {
        params.append('isActive', isActive);
      }
      
      const queryString = params.toString();
      const url = `/admin/single-use-product-size${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetcher.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Update Single Use Product Size Status API
export const updateSingleUseProductSizeStatusApi = createAsyncThunk(
  "singleUseProductType/updateSingleUseProductSizeStatusApi",
  async ({ id, isActive }, { rejectWithValue }) => {
    try {
      const response = await fetcher.patch(`/admin/single-use-product-size/${id}/status`, { isActive });
      toast.success(`Product size ${isActive ? 'activated' : 'deactivated'} successfully!`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to update product size status";
      toast.error(errorMessage);
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

const initialState = {
  productTypes: [],
  productSizes: [],
  productSizePagination: {
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 10,
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 10,
  },
  // Business single-use product data
  businessProductTypes: [],
  businessProductSizes: [],
  mySingleUseProducts: [],
  mySingleUseProductsPagination: {
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 10,
  },
  // Admin: Single-use products by business
  businessSingleUseProducts: [],
  businessSingleUseProductsPagination: {
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 10,
  },
  isLoading: false,
  error: null,
};

const singleUseProductTypeSlice = createSlice({
  name: "singleUseProductType",
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Create Single Use Product Type
    builder
      .addCase(createSingleUseProductTypeApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createSingleUseProductTypeApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        // Add the new product type to the list
        if (payload?.data) {
          state.productTypes = [payload.data, ...state.productTypes];
          state.pagination.total = (state.pagination.total || 0) + 1;
        }
      })
      .addCase(createSingleUseProductTypeApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      });

    // Get All Single Use Product Types
    builder
      .addCase(getAllSingleUseProductTypesApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllSingleUseProductTypesApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        if (payload?.data) {
          state.productTypes = Array.isArray(payload.data) ? payload.data : [];
        }
        if (payload?.pagination) {
          state.pagination = {
            currentPage: payload.pagination.currentPage || payload.pagination.page || 1,
            totalPages: payload.pagination.totalPages || 1,
            total: payload.pagination.total || 0,
            limit: payload.pagination.limit || 10,
          };
        }
      })
      .addCase(getAllSingleUseProductTypesApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      });

    // Update Single Use Product Type Status
    builder
      .addCase(updateSingleUseProductTypeStatusApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateSingleUseProductTypeStatusApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        // Update the product type in the list
        if (payload?.data) {
          const index = state.productTypes.findIndex(
            (item) => item._id === payload.data._id
          );
          if (index !== -1) {
            state.productTypes[index] = payload.data;
          }
        }
      })
      .addCase(updateSingleUseProductTypeStatusApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      });

    // Create Single Use Product Size
    builder
      .addCase(createSingleUseProductSizeApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createSingleUseProductSizeApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        // Add the new product size to the list
        if (payload?.data) {
          state.productSizes = [payload.data, ...state.productSizes];
          state.productSizePagination.total = (state.productSizePagination.total || 0) + 1;
        }
      })
      .addCase(createSingleUseProductSizeApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      });

    // Get All Single Use Product Sizes
    builder
      .addCase(getAllSingleUseProductSizesApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllSingleUseProductSizesApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        if (payload?.data) {
          state.productSizes = Array.isArray(payload.data) ? payload.data : [];
        }
        if (payload?.pagination) {
          state.productSizePagination = {
            currentPage: payload.pagination.currentPage || payload.pagination.page || 1,
            totalPages: payload.pagination.totalPages || 1,
            total: payload.pagination.total || 0,
            limit: payload.pagination.limit || 10,
          };
        }
      })
      .addCase(getAllSingleUseProductSizesApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      });

    // Update Single Use Product Size Status
    builder
      .addCase(updateSingleUseProductSizeStatusApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateSingleUseProductSizeStatusApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        // Update the product size in the list
        if (payload?.data) {
          const index = state.productSizes.findIndex(
            (item) => item._id === payload.data._id
          );
          if (index !== -1) {
            state.productSizes[index] = payload.data;
          }
        }
      })
      .addCase(updateSingleUseProductSizeStatusApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      });

    // Get Business Single-Use Product Types
    builder
      .addCase(getBusinessSingleUseProductTypesApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getBusinessSingleUseProductTypesApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        if (payload?.data) {
          state.businessProductTypes = Array.isArray(payload.data) ? payload.data : [];
        }
      })
      .addCase(getBusinessSingleUseProductTypesApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      });

    // Get Business Single-Use Product Sizes
    builder
      .addCase(getBusinessSingleUseProductSizesApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getBusinessSingleUseProductSizesApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        if (payload?.data) {
          state.businessProductSizes = Array.isArray(payload.data) ? payload.data : [];
        } else {
          state.businessProductSizes = [];
        }
      })
      .addCase(getBusinessSingleUseProductSizesApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      });

    // Get My Single-Use Products
    builder
      .addCase(getMySingleUseProductsApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMySingleUseProductsApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        if (payload?.data) {
          state.mySingleUseProducts = Array.isArray(payload.data) ? payload.data : [];
        }
        if (payload?.pagination) {
          state.mySingleUseProductsPagination = {
            currentPage: payload.pagination.currentPage || payload.pagination.page || 1,
            totalPages: payload.pagination.totalPages || 1,
            total: payload.pagination.total || 0,
            limit: payload.pagination.limit || 10,
          };
        }
      })
      .addCase(getMySingleUseProductsApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      });

    // Create Business Single-Use Product
    builder
      .addCase(createBusinessSingleUseProductApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBusinessSingleUseProductApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        if (payload?.data) {
          state.mySingleUseProducts = [payload.data, ...state.mySingleUseProducts];
          state.mySingleUseProductsPagination.total = (state.mySingleUseProductsPagination.total || 0) + 1;
        }
      })
      .addCase(createBusinessSingleUseProductApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      });

    // Update Business Single-Use Product
    builder
      .addCase(updateBusinessSingleUseProductApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateBusinessSingleUseProductApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        if (payload?.data) {
          const index = state.mySingleUseProducts.findIndex(
            (item) => item._id === payload.data._id
          );
          if (index !== -1) {
            state.mySingleUseProducts[index] = payload.data;
          }
        }
      })
      .addCase(updateBusinessSingleUseProductApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      });

    // Get Business Single-Use Products (for admin)
    builder
      .addCase(getBusinessSingleUseProductsApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getBusinessSingleUseProductsApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        if (payload?.data) {
          state.businessSingleUseProducts = Array.isArray(payload.data) ? payload.data : [];
        }
        if (payload?.currentPage !== undefined || payload?.totalPages !== undefined || payload?.total !== undefined) {
          state.businessSingleUseProductsPagination = {
            currentPage: payload.currentPage || 1,
            totalPages: payload.totalPages || 1,
            total: payload.total || 0,
            limit: 10,
          };
        }
      })
      .addCase(getBusinessSingleUseProductsApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      });
  },
});

// Business Single-Use Product APIs
// Get Single-Use Product Types (for business)
export const getBusinessSingleUseProductTypesApi = createAsyncThunk(
  "singleUseProductType/getBusinessSingleUseProductTypesApi",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetcher.get("/business/single-use-product/types");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Get Single-Use Product Sizes (for business)
export const getBusinessSingleUseProductSizesApi = createAsyncThunk(
  "singleUseProductType/getBusinessSingleUseProductSizesApi",
  async (productTypeId, { rejectWithValue }) => {
    try {
      const response = await fetcher.get(`/business/single-use-product/sizes?productTypeId=${productTypeId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Get My Single-Use Products (for business)
export const getMySingleUseProductsApi = createAsyncThunk(
  "singleUseProductType/getMySingleUseProductsApi",
  async ({ page = 1, limit = 10, isActive }, { rejectWithValue }) => {
    try {
      let url = `/business/single-use-product/my?page=${page}&limit=${limit}`;
      if (isActive !== undefined && isActive !== null && isActive !== '') {
        url += `&isActive=${isActive}`;
      }
      const response = await fetcher.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Create Single-Use Product (for business)
export const createBusinessSingleUseProductApi = createAsyncThunk(
  "singleUseProductType/createBusinessSingleUseProductApi",
  async (productData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      if (productData.image) {
        formData.append('image', productData.image);
      }
      formData.append('name', productData.name);
      if (productData.description) {
        formData.append('description', productData.description);
      }
      formData.append('productTypeId', productData.productTypeId);
      formData.append('productSizeId', productData.productSizeId);
      formData.append('materialId', productData.materialId);
      formData.append('weight', productData.weight);

      const response = await fetcher.post("/business/single-use-product", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success("Single-use product created successfully!");
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to create single-use product";
      toast.error(errorMessage);
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Update Single-Use Product (for business)
export const updateBusinessSingleUseProductApi = createAsyncThunk(
  "singleUseProductType/updateBusinessSingleUseProductApi",
  async ({ productId, productData }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      if (productData.image) {
        formData.append('image', productData.image);
      }
      if (productData.name) {
        formData.append('name', productData.name);
      }
      if (productData.description !== undefined) {
        formData.append('description', productData.description);
      }
      if (productData.weight !== undefined) {
        formData.append('weight', productData.weight);
      }
      if (productData.isActive !== undefined) {
        formData.append('isActive', productData.isActive);
      }

      const response = await fetcher.patch(`/business/single-use-product/${productId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success("Single-use product updated successfully!");
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to update single-use product";
      toast.error(errorMessage);
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Get Business Single-Use Products (for admin)
export const getBusinessSingleUseProductsApi = createAsyncThunk(
  "singleUseProductType/getBusinessSingleUseProductsApi",
  async ({ businessId, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await fetcher.get(`/single-use-product/business/${businessId}?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const { resetError } = singleUseProductTypeSlice.actions;
export default singleUseProductTypeSlice.reducer;

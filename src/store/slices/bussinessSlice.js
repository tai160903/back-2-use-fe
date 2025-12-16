import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetcher from "../../apis/fetcher";

// Get all businesses
export const getAllBusinesses = createAsyncThunk(
  "businesses/getAllBusinesses",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const response = await fetcher.get(
        `/admin/form/all?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Get vouchers for business
export const getBusinessVouchers = createAsyncThunk(
  "businesses/getBusinessVouchers",
  async ({ tierLabel, minThreshold, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams();
      if (tierLabel) query.append("tierLabel", tierLabel);
      if (minThreshold !== undefined && minThreshold !== null) {
        query.append("minThreshold", String(minThreshold));
      }
      query.append("page", String(page));
      query.append("limit", String(limit));
      const response = await fetcher.get(`/business-vouchers?${query.toString()}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Get all businesses for statistics (no pagination)
export const getAllBusinessesForStats = createAsyncThunk(
  "businesses/getAllBusinessesForStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetcher.get(`/admin/form/all?page=1&limit=1000`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);


// Get business by ID
export const getBusinessById = createAsyncThunk(
  "businesses/getBusinessById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetcher.get(`/admin/form/detail/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Get voucher detail by business voucher id with filter/pagination
export const getBusinessVoucherDetail = createAsyncThunk(
  "businesses/getBusinessVoucherDetail",
  async ({ businessVoucherId, status, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams();
      if (status) query.append("status", status);
      query.append("page", String(page));
      query.append("limit", String(limit));
      const response = await fetcher.get(
        `/business-vouchers/${businessVoucherId}/detail?${query.toString()}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Update a business voucher
export const updateBusinessVoucher = createAsyncThunk(
  "businesses/updateBusinessVoucher",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await fetcher.patch(`/business-vouchers/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// approved business
export const approveBusiness = createAsyncThunk(
  "businesses/approveBusiness",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetcher.patch(`/admin/businesses/${id}/approve`);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);


// reject business
export const rejectBusiness = createAsyncThunk(
  "businesses/rejectBusiness",
  async ({ id, note }, { rejectWithValue }) => {
    try {
      const response = await fetcher.patch(`/admin/businesses/${id}/reject`, {
        note: note
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Create material request (business)
export const createMaterial = createAsyncThunk(
  "businesses/createMaterial",
  async (materialData, { rejectWithValue }) => {
    try {
      const response = await fetcher.post("/materials/material-requests", materialData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Get all materials owned by current business (approved/active)
export const getApprovedMaterials = createAsyncThunk(
  "businesses/getApprovedMaterials",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetcher.get("/materials");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Get my material requests (all statuses)
export const getMyMaterials = createAsyncThunk(
  "businesses/getMyMaterials",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetcher.get("/materials/my-request");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);



// get history business form
export const getHistoryBusinessForm = createAsyncThunk(
  "businesses/getHistoryBusinessForm",
  async({limit, page}, {rejectWithValue}) => {
    try {
      const response = await fetcher.get(`/businesses/history-business-form?limit=${limit}&page=${page}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create product group (business)
export const createProductGroup = createAsyncThunk(
  "businesses/createProductGroup",
  async (productGroupData, { rejectWithValue }) => {
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('materialId', productGroupData.materialId);
      formData.append('name', productGroupData.name);
      
      if (productGroupData.description) {
        formData.append('description', productGroupData.description);
      }
      
      if (productGroupData.image) {
        formData.append('image', productGroupData.image);
      }

      const response = await fetcher.post("/product-groups", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Get all product groups for current business
export const getMyProductGroups = createAsyncThunk(
  "businesses/getMyProductGroups",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetcher.get("/product-groups");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Create product size
export const createProductSize = createAsyncThunk(
  "businesses/createProductSize",
  async (productSizeData, { rejectWithValue }) => {
    try {
      const response = await fetcher.post("/product-sizes", productSizeData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Get product sizes by product group
export const getProductSizes = createAsyncThunk(
  "businesses/getProductSizes",
  async ({ productGroupId, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await fetcher.get(
        `/product-sizes?productGroupId=${productGroupId}&page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Get product size detail by ID
export const getProductSizeById = createAsyncThunk(
  "businesses/getProductSizeById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetcher.get(`/product-sizes/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Update product size
export const updateProductSize = createAsyncThunk(
  "businesses/updateProductSize",
  async ({ id, productSizeData }, { rejectWithValue }) => {
    try {
      const response = await fetcher.patch(`/product-sizes/${id}`, productSizeData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Create products (bulk creation with QR codes)
export const createProducts = createAsyncThunk(
  "businesses/createProducts",
  async (productData, { rejectWithValue }) => {
    try {
      const response = await fetcher.post("/products", productData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Get all products
export const getProducts = createAsyncThunk(
  "businesses/getProducts",
  async ({ productGroupId, page = 1, limit = 100 }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      // if (productGroupId) {
      //   queryParams.append('productGroupId', productGroupId);
      // }
      const response = await fetcher.get(`/products/${productGroupId}?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Get product by ID
export const getProductById = createAsyncThunk(
  "businesses/getProductById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetcher.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Get product by QR code (serial number)
export const getProductByQRCode = createAsyncThunk(
  "businesses/getProductByQRCode",
  async (serialNumber, { rejectWithValue }) => {
    try {
      const response = await fetcher.get(`/products/scan/${serialNumber}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Update product by ID
// Request body: { status, lastConditionNote, lastConditionImage, condition }
export const updateProduct = createAsyncThunk(
  "businesses/updateProduct",
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const response = await fetcher.patch(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Get business dashboard overview
export const getBusinessDashboardOverview = createAsyncThunk(
  "businesses/getBusinessDashboardOverview",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetcher.get("/business/dashboard/overview");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Get business borrow transactions monthly statistics
export const getBusinessBorrowTransactionsMonthly = createAsyncThunk(
  "businesses/getBusinessBorrowTransactionsMonthly",
  async ({ year, type, status }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (year) queryParams.append("year", year);
      if (type) queryParams.append("type", type);
      if (status) queryParams.append("status", status);
      const response = await fetcher.get(
        `/business/dashboard/borrow-transactions/monthly?${queryParams.toString()}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Get top borrowed items in business dashboard
export const getBusinessTopBorrowed = createAsyncThunk(
  "businesses/getBusinessTopBorrowed",
  async ({ top = 5 } = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (top) queryParams.append("top", top);
      const response = await fetcher.get(
        `/business/dashboard/top-borrowed?${queryParams.toString()}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

const businessSlice = createSlice({
  name: "businesses",
  initialState: {
    businessFormHistory: [],
    businessesConfirmation: [],
    businesses: [],
    allBusinesses: [], 
    vouchers: [],
    vouchersTotalPages: 0,
    vouchersTotal: 0,
    vouchersCurrentPage: 1,
    voucherLoading: false,
    voucherError: null,
    voucherDetail: [],
    voucherDetailTotalPages: 0,
    voucherDetailTotal: 0,
    voucherDetailCurrentPage: 1,
    voucherDetailLoading: false,
    voucherDetailError: null,
    totalPages: 0,
    total: 0,
    currentPage: 1,
    isLoading: false,
    error: null,
    materials: [],
    approvedMaterials: [],
    myMaterials: [],
    materialLoading: false,
    materialError: null,
    productGroups: [],
    productGroupLoading: false,
    productGroupError: null,
    productSizes: [],
    productSizeLoading: false,
    productSizeError: null,
    currentProductSize: null,
    products: [],
    productLoading: false,
    productError: null,
    currentProduct: null,
    // Dashboard state
    dashboardOverview: null,
    dashboardLoading: false,
    dashboardError: null,
    borrowTransactionsMonthly: null,
    borrowTransactionsMonthlyLoading: false,
    borrowTransactionsMonthlyError: null,
    topBorrowed: [],
    topBorrowedLoading: false,
    topBorrowedError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllBusinesses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllBusinesses.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.businesses = payload.data || [];
        state.totalPages = payload.totalPages || 0;
        state.total = payload.total || 0;
        state.currentPage = payload.currentPage || 1;
        state.error = null;
      })
      .addCase(getAllBusinesses.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      // Business vouchers
      .addCase(getBusinessVouchers.pending, (state) => {
        state.voucherLoading = true;
        state.voucherError = null;
      })
      .addCase(getBusinessVouchers.fulfilled, (state, { payload }) => {
        state.voucherLoading = false;
        state.vouchers = payload.data || [];
        state.vouchersTotalPages = payload.totalPages || 0;
        state.vouchersTotal = payload.total || 0;
        state.vouchersCurrentPage = payload.currentPage || 1;
        state.voucherError = null;
      })
      .addCase(getBusinessVouchers.rejected, (state, { payload }) => {
        state.voucherLoading = false;
        state.voucherError = payload;
      })
      .addCase(getAllBusinessesForStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllBusinessesForStats.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.allBusinesses = payload.data || [];
        state.error = null;
      })
      .addCase(getAllBusinessesForStats.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      // Business voucher detail
      .addCase(getBusinessVoucherDetail.pending, (state) => {
        state.voucherDetailLoading = true;
        state.voucherDetailError = null;
      })
      .addCase(getBusinessVoucherDetail.fulfilled, (state, { payload }) => {
        state.voucherDetailLoading = false;
        state.voucherDetail = payload.data || [];
        state.voucherDetailTotalPages = payload.totalPages || 0;
        state.voucherDetailTotal = payload.total || 0;
        state.voucherDetailCurrentPage = payload.currentPage || 1;
        state.voucherDetailError = null;
      })
      .addCase(getBusinessVoucherDetail.rejected, (state, { payload }) => {
        state.voucherDetailLoading = false;
        state.voucherDetailError = payload;
      })
      .addCase(getBusinessById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getBusinessById.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.businesses = payload;
        state.error = null;
      })
      .addCase(getBusinessById.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      .addCase(approveBusiness.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // Update voucher
      .addCase(updateBusinessVoucher.pending, (state) => {
        state.voucherLoading = true;
        state.voucherError = null;
      })
      .addCase(updateBusinessVoucher.fulfilled, (state, { payload }) => {
        state.voucherLoading = false;
        // sync into list if present
        const updated = payload.data || payload;
        const idx = state.vouchers.findIndex(
          (v) => (v.id || v._id) === (updated.id || updated._id)
        );
        if (idx !== -1) {
          state.vouchers[idx] = { ...state.vouchers[idx], ...updated };
        }
        state.voucherError = null;
      })
      .addCase(updateBusinessVoucher.rejected, (state, { payload }) => {
        state.voucherLoading = false;
        state.voucherError = payload;
      })
      .addCase(approveBusiness.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.businessesConfirmation = payload;
      })
      .addCase(approveBusiness.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      .addCase(rejectBusiness.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(rejectBusiness.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.businessesConfirmation = payload;
      })
      .addCase(rejectBusiness.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      // Material reducers
      .addCase(createMaterial.pending, (state) => {
        state.materialLoading = true;
        state.materialError = null;
      })
      .addCase(createMaterial.fulfilled, (state, { payload }) => {
        state.materialLoading = false;
        state.materials.push(payload);
        state.materialError = null;
      })
      .addCase(createMaterial.rejected, (state, { payload }) => {
        state.materialLoading = false;
        state.materialError = payload;
      })
      .addCase(getApprovedMaterials.pending, (state) => {
        state.materialLoading = true;
        state.materialError = null;
      })
      .addCase(getApprovedMaterials.fulfilled, (state, { payload }) => {
        state.materialLoading = false;
        state.approvedMaterials = payload.data || [];
        state.materialError = null;
      })
      .addCase(getApprovedMaterials.rejected, (state, { payload }) => {
        state.materialLoading = false;
        state.materialError = payload;
      })
      .addCase(getMyMaterials.pending, (state) => {
        state.materialLoading = true;
        state.materialError = null;
      })
      .addCase(getMyMaterials.fulfilled, (state, { payload }) => {
        state.materialLoading = false;
        state.myMaterials = payload.data || [];
        state.materialError = null;
      })
      .addCase(getMyMaterials.rejected, (state, { payload }) => {
        state.materialLoading = false;
        state.materialError = payload;
      })
      .addCase(getHistoryBusinessForm.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getHistoryBusinessForm.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.businessFormHistory = payload.data || [];
        state.error = null;
      })
      .addCase(getHistoryBusinessForm.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      // Product Group reducers
      .addCase(createProductGroup.pending, (state) => {
        state.productGroupLoading = true;
        state.productGroupError = null;
      })
      .addCase(createProductGroup.fulfilled, (state, { payload }) => {
        state.productGroupLoading = false;
        state.productGroups.push(payload.data || payload);
        state.productGroupError = null;
      })
      .addCase(createProductGroup.rejected, (state, { payload }) => {
        state.productGroupLoading = false;
        state.productGroupError = payload;
      })
      .addCase(getMyProductGroups.pending, (state) => {
        state.productGroupLoading = true;
        state.productGroupError = null;
      })
      .addCase(getMyProductGroups.fulfilled, (state, { payload }) => {
        state.productGroupLoading = false;
        state.productGroups = payload.data || payload || [];
        state.productGroupError = null;
      })
      .addCase(getMyProductGroups.rejected, (state, { payload }) => {
        state.productGroupLoading = false;
        state.productGroupError = payload;
      })
      // Product Size reducers
      .addCase(createProductSize.pending, (state) => {
        state.productSizeLoading = true;
        state.productSizeError = null;
      })
      .addCase(createProductSize.fulfilled, (state, { payload }) => {
        state.productSizeLoading = false;
        state.productSizes.push(payload.data || payload);
        state.productSizeError = null;
      })
      .addCase(createProductSize.rejected, (state, { payload }) => {
        state.productSizeLoading = false;
        state.productSizeError = payload;
      })
      .addCase(getProductSizes.pending, (state) => {
        state.productSizeLoading = true;
        state.productSizeError = null;
      })
      .addCase(getProductSizes.fulfilled, (state, { payload }) => {
        state.productSizeLoading = false;
        state.productSizes = payload.data || payload || [];
        state.productSizeError = null;
      })
      .addCase(getProductSizes.rejected, (state, { payload }) => {
        state.productSizeLoading = false;
        state.productSizeError = payload;
      })
      .addCase(getProductSizeById.pending, (state) => {
        state.productSizeLoading = true;
        state.productSizeError = null;
      })
      .addCase(getProductSizeById.fulfilled, (state, { payload }) => {
        state.productSizeLoading = false;
        state.currentProductSize = payload.data || payload;
        state.productSizeError = null;
      })
      .addCase(getProductSizeById.rejected, (state, { payload }) => {
        state.productSizeLoading = false;
        state.productSizeError = payload;
      })
      .addCase(updateProductSize.pending, (state) => {
        state.productSizeLoading = true;
        state.productSizeError = null;
      })
      .addCase(updateProductSize.fulfilled, (state, { payload }) => {
        state.productSizeLoading = false;
        const updatedSize = payload.data || payload;
        const index = state.productSizes.findIndex(
          (size) => (size.id || size._id) === (updatedSize.id || updatedSize._id)
        );
        if (index !== -1) {
          state.productSizes[index] = updatedSize;
        }
        state.productSizeError = null;
      })
      .addCase(updateProductSize.rejected, (state, { payload }) => {
        state.productSizeLoading = false;
        state.productSizeError = payload;
      })
      // Product reducers
      .addCase(createProducts.pending, (state) => {
        state.productLoading = true;
        state.productError = null;
      })
      .addCase(createProducts.fulfilled, (state, { payload }) => {
        state.productLoading = false;
        // If payload is an array, add all products; otherwise add single product
        const newProducts = Array.isArray(payload.data) ? payload.data : (payload.data ? [payload.data] : (Array.isArray(payload) ? payload : [payload]));
        state.products = [...state.products, ...newProducts];
        state.productError = null;
      })
      .addCase(createProducts.rejected, (state, { payload }) => {
        state.productLoading = false;
        state.productError = payload;
      })
      .addCase(getProducts.pending, (state) => {
        state.productLoading = true;
        state.productError = null;
      })
      .addCase(getProducts.fulfilled, (state, { payload }) => {
        state.productLoading = false;
        state.products = payload.data || payload || [];
        state.productError = null;
      })
      .addCase(getProducts.rejected, (state, { payload }) => {
        state.productLoading = false;
        state.productError = payload;
      })
      .addCase(getProductById.pending, (state) => {
        state.productLoading = true;
        state.productError = null;
      })
      .addCase(getProductById.fulfilled, (state, { payload }) => {
        state.productLoading = false;
        state.currentProduct = payload.data || payload;
        state.productError = null;
      })
      .addCase(getProductById.rejected, (state, { payload }) => {
        state.productLoading = false;
        state.productError = payload;
      })
      .addCase(getProductByQRCode.pending, (state) => {
        state.productLoading = true;
        state.productError = null;
      })
      .addCase(getProductByQRCode.fulfilled, (state, { payload }) => {
        state.productLoading = false;
        state.currentProduct = payload.data || payload;
        state.productError = null;
      })
      .addCase(getProductByQRCode.rejected, (state, { payload }) => {
        state.productLoading = false;
        state.productError = payload;
      })
      .addCase(updateProduct.pending, (state) => {
        state.productLoading = true;
        state.productError = null;
      })
      .addCase(updateProduct.fulfilled, (state, { payload }) => {
        state.productLoading = false;
        const updatedProduct = payload.data || payload;
        const updatedId = updatedProduct._id || updatedProduct.id;
        
        // Update product in products array
        if (updatedId) {
          const index = state.products.findIndex(
            (p) => (p._id || p.id) === updatedId
          );
          if (index !== -1) {
            state.products[index] = { ...state.products[index], ...updatedProduct };
          }
        }
        
        // Update currentProduct if it matches
        if (state.currentProduct && (state.currentProduct._id || state.currentProduct.id) === updatedId) {
          state.currentProduct = { ...state.currentProduct, ...updatedProduct };
        }
        
        state.productError = null;
      })
      .addCase(updateProduct.rejected, (state, { payload }) => {
        state.productLoading = false;
        state.productError = payload;
      })
      // Dashboard Overview
      .addCase(getBusinessDashboardOverview.pending, (state) => {
        state.dashboardLoading = true;
        state.dashboardError = null;
      })
      .addCase(getBusinessDashboardOverview.fulfilled, (state, { payload }) => {
        state.dashboardLoading = false;
        state.dashboardOverview = payload.data || payload;
        state.dashboardError = null;
      })
      .addCase(getBusinessDashboardOverview.rejected, (state, { payload }) => {
        state.dashboardLoading = false;
        state.dashboardError = payload;
      })
      // Borrow Transactions Monthly
      .addCase(getBusinessBorrowTransactionsMonthly.pending, (state) => {
        state.borrowTransactionsMonthlyLoading = true;
        state.borrowTransactionsMonthlyError = null;
      })
      .addCase(getBusinessBorrowTransactionsMonthly.fulfilled, (state, { payload }) => {
        state.borrowTransactionsMonthlyLoading = false;
        state.borrowTransactionsMonthly = payload;
        state.borrowTransactionsMonthlyError = null;
      })
      .addCase(getBusinessBorrowTransactionsMonthly.rejected, (state, { payload }) => {
        state.borrowTransactionsMonthlyLoading = false;
        state.borrowTransactionsMonthlyError = payload;
      })
      // Top Borrowed
      .addCase(getBusinessTopBorrowed.pending, (state) => {
        state.topBorrowedLoading = true;
        state.topBorrowedError = null;
      })
      .addCase(getBusinessTopBorrowed.fulfilled, (state, { payload }) => {
        state.topBorrowedLoading = false;
        // API returns { data: { top: 3, products: [...] } }
        state.topBorrowed = payload?.data?.products || payload?.products || [];
        state.topBorrowedError = null;
      })
      .addCase(getBusinessTopBorrowed.rejected, (state, { payload }) => {
        state.topBorrowedLoading = false;
        state.topBorrowedError = payload;
      })
  
  },
});

export default businessSlice.reducer;

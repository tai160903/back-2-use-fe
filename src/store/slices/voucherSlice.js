import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetcher from "../../apis/fetcher";
import toast from "react-hot-toast";

// ============ ADMIN VOUCHER APIs ============
// POST /admin/vouchers/leaderboard - Create leaderboard voucher
export const createLeaderboardVoucherApi = createAsyncThunk(
  "vouchers/createLeaderboardVoucherApi",
  async (voucherData, { rejectWithValue }) => {
    try {
      const response = await fetcher.post("/admin/vouchers/leaderboard", voucherData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Get Leaderboard Vouchers API
export const getLeaderboardVouchersApi = createAsyncThunk(
  "vouchers/getLeaderboardVouchersApi",
  async ({ page = 1, limit = 10, status } = {}, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams();
      query.append("page", String(page));
      query.append("limit", String(limit));
      if (status) query.append("status", status);
      const response = await fetcher.get(`/admin/vouchers/leaderboard?${query.toString()}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Get Leaderboard Voucher by ID API
export const getLeaderboardVoucherByIdApi = createAsyncThunk(
  "vouchers/getLeaderboardVoucherByIdApi",
  async (voucherId, { rejectWithValue }) => {
    try {
      const response = await fetcher.get(`/admin/vouchers/leaderboard/${voucherId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Get Business Vouchers API
export const getBusinessVouchersAdminApi = createAsyncThunk(
  "vouchers/getBusinessVouchersAdminApi",
  async ({ page = 1, limit = 10, status } = {}, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams();
      query.append("page", String(page));
      query.append("limit", String(limit));
      if (status) query.append("status", status);
      const response = await fetcher.get(`/admin/vouchers/businessVoucher?${query.toString()}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// GET /admin/vouchers/businessVoucher/{businessVoucherId}/codes - Get Business Voucher Codes API
export const getBusinessVoucherCodesApi = createAsyncThunk(
  "vouchers/getBusinessVoucherCodesApi",
  async ({ businessVoucherId, status, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      let url = `/admin/vouchers/businessVoucher/${businessVoucherId}/codes?page=${page}&limit=${limit}`;
      if (status) {
        url += `&status=${status}`;
      }
      const response = await fetcher.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// ============ BUSINESS VOUCHER APIs ============
// POST /business-vouchers - Create business voucher
export const createBusinessVoucher = createAsyncThunk(
  "vouchers/createBusinessVoucher",
  async (voucherData, { rejectWithValue }) => {
    try {
      const response = await fetcher.post("/business-vouchers", voucherData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// PATCH /business-vouchers/{businessVoucherId} - Update business voucher
export const updateBusinessVoucher = createAsyncThunk(
  "vouchers/updateBusinessVoucher",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await fetcher.patch(`/business-vouchers/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// GET /business-vouchers/my - Get my business vouchers (owned by current business)
export const getMyBusinessVouchers = createAsyncThunk(
  "vouchers/getMyBusinessVouchers",
  async ({ status, isPublished, page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams();
      if (status) query.append("status", status);
      if (typeof isPublished === "boolean") query.append("isPublished", String(isPublished));
      query.append("page", String(page));
      query.append("limit", String(limit));
      const response = await fetcher.get(`/business-vouchers/my?${query.toString()}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// GET /business-vouchers/{businessVoucherId}/voucher-codes - Get voucher codes by business voucher ID (non-admin)
export const getBusinessVoucherCodes = createAsyncThunk(
  "vouchers/getBusinessVoucherCodes",
  async ({ businessVoucherId, status, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      let url = `/business-vouchers/${businessVoucherId}/voucher-codes?page=${page}&limit=${limit}`;
      if (status) {
        url += `&status=${status}`;
      }
      const response = await fetcher.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// GET /business-vouchers/voucher-codes/{voucherCodeId} - Get voucher code by ID
export const getBusinessVoucherCodeById = createAsyncThunk(
  "vouchers/getBusinessVoucherCodeById",
  async (voucherCodeId, { rejectWithValue }) => {
    try {
      const response = await fetcher.get(`/business-vouchers/voucher-codes/${voucherCodeId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// POST /business-vouchers/voucher-codes/use - Use a voucher code
export const useBusinessVoucherCode = createAsyncThunk(
  "vouchers/useBusinessVoucherCode",
  async ({ code }, { rejectWithValue }) => {
    try {
      const response = await fetcher.post(`/business-vouchers/voucher-codes/use`, { code });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// ============ CUSTOMER VOUCHER APIs ============
// Get public vouchers for customer
export const getCustomerVouchers = createAsyncThunk(
  "vouchers/getCustomerVouchers",
  async ({ status, page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams();
      if (status) query.append("status", status);
      query.append("page", String(page));
      query.append("limit", String(limit));
      const response = await fetcher.get(`/customer/vouchers?${query.toString()}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Get my vouchers (customer owned)
export const getMyCustomerVouchers = createAsyncThunk(
  "vouchers/getMyCustomerVouchers",
  async ({ voucherType, status = "redeemed", page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams();
      if (voucherType) query.append("voucherType", voucherType);
      if (status) query.append("status", status);
      query.append("page", String(page));
      query.append("limit", String(limit));
      const response = await fetcher.get(`/customer/vouchers/my?${query.toString()}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Redeem a voucher (customer)
export const redeemCustomerVoucher = createAsyncThunk(
  "vouchers/redeemCustomerVoucher",
  async ({ voucherId }, { rejectWithValue }) => {
    try {
      const response = await fetcher.post(`/customer/vouchers/redeem`, { voucherId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

const voucherSlice = createSlice({
  name: "vouchers",
  initialState: {
    vouchers: [],
    currentVoucher: null,
    voucherPagination: {
      page: 1,
      limit: 10,
      total: 0,
      currentPage: 1,
      totalPages: 0,
    },
    voucherFilters: {
      status: "all",
      name: "",
    },
    // Admin business vouchers (for voucher detail modal)
    adminBusinessVouchers: [],
    adminBusinessVouchersPagination: {
      page: 1,
      limit: 10,
      total: 0,
      currentPage: 1,
      totalPages: 0,
    },
    adminBusinessVoucherCodes: [],
    adminBusinessVoucherCodesPagination: {
      page: 1,
      limit: 10,
      total: 0,
      currentPage: 1,
      totalPages: 0,
    },
    // Business voucher views
    myBusinessVouchers: [],
    myBusinessVoucherPagination: {
      page: 1,
      limit: 10,
      total: 0,
      currentPage: 1,
      totalPages: 0,
    },
    lastUseCodeResult: null,
    currentBusinessVoucher: null,
    currentVoucherCode: null,
    // Customer views
    customerVouchers: [],
    customerVoucherPagination: {
      page: 1,
      limit: 10,
      total: 0,
      currentPage: 1,
      totalPages: 0,
    },
    myCustomerVouchers: [],
    myCustomerVoucherPagination: {
      page: 1,
      limit: 10,
      total: 0,
      currentPage: 1,
      totalPages: 0,
    },
    lastRedeemResult: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    setVoucherStatusFilter: (state, { payload }) => {
      state.voucherFilters.status = payload;
    },
    setVoucherNameFilter: (state, { payload }) => {
      state.voucherFilters.name = payload;
    },
    resetVoucherFilters: (state) => {
      state.voucherFilters = { status: "all", name: "" };
    },
    clearCurrentVoucher: (state) => {
      state.currentVoucher = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Leaderboard Voucher
      .addCase(createLeaderboardVoucherApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createLeaderboardVoucherApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        if (payload.data) {
          state.vouchers.unshift(payload.data);
        }
        toast.success(payload?.message || "Leaderboard voucher created successfully!");
      })
      .addCase(createLeaderboardVoucherApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
        toast.error(payload?.message || "Failed to create leaderboard voucher");
      })
      // Get Leaderboard Vouchers
      .addCase(getLeaderboardVouchersApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getLeaderboardVouchersApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.vouchers = payload.data || [];
        state.voucherPagination = {
          ...state.voucherPagination,
          total: payload.total || 0,
          currentPage: payload.currentPage || 1,
          totalPages: payload.totalPages || 0,
        };
      })
      .addCase(getLeaderboardVouchersApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
        toast.error(payload?.message || "Failed to fetch leaderboard vouchers");
      })
      // Get Leaderboard Voucher by ID
      .addCase(getLeaderboardVoucherByIdApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getLeaderboardVoucherByIdApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.currentVoucher = payload.data || payload;
      })
      .addCase(getLeaderboardVoucherByIdApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      // Get Business Vouchers (Admin)
      .addCase(getBusinessVouchersAdminApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getBusinessVouchersAdminApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.adminBusinessVouchers = payload.data || [];
        state.adminBusinessVouchersPagination = {
          ...state.adminBusinessVouchersPagination,
          total: payload.total || 0,
          currentPage: payload.currentPage || 1,
          totalPages: payload.totalPages || 0,
        };
      })
      .addCase(getBusinessVouchersAdminApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
        toast.error(payload?.message || "Failed to fetch business vouchers");
      })
      // Get Business Voucher Codes
      .addCase(getBusinessVoucherCodesApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getBusinessVoucherCodesApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.adminBusinessVoucherCodes = payload.data || [];
        state.adminBusinessVoucherCodesPagination = {
          ...state.adminBusinessVoucherCodesPagination,
          total: payload.total || 0,
          currentPage: payload.currentPage || 1,
          totalPages: payload.totalPages || 0,
        };
      })
      .addCase(getBusinessVoucherCodesApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
        toast.error(payload?.message || "Failed to fetch business voucher codes");
      })
      // Create Business Voucher
      .addCase(createBusinessVoucher.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBusinessVoucher.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        if (payload.data) {
          state.myBusinessVouchers.unshift(payload.data);
        }
        toast.success(payload?.message || "Business voucher created successfully!");
      })
      .addCase(createBusinessVoucher.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
        toast.error(payload?.message || "Failed to create business voucher");
      })
      // Update business voucher
      .addCase(updateBusinessVoucher.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateBusinessVoucher.fulfilled, (state) => {
        state.isLoading = false;
        toast.success("Business voucher updated successfully!");
      })
      .addCase(updateBusinessVoucher.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      // Get my business vouchers
      .addCase(getMyBusinessVouchers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMyBusinessVouchers.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.myBusinessVouchers = payload.data || [];
        state.myBusinessVoucherPagination = {
          ...state.myBusinessVoucherPagination,
          total: payload.total || 0,
          currentPage: payload.currentPage || 1,
          totalPages: payload.totalPages || 0,
        };
      })
      .addCase(getMyBusinessVouchers.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      // Get Business Voucher Codes (non-admin)
      .addCase(getBusinessVoucherCodes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getBusinessVoucherCodes.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        // Store in a separate state or reuse adminBusinessVoucherCodes
        state.adminBusinessVoucherCodes = payload.data || [];
        state.adminBusinessVoucherCodesPagination = {
          ...state.adminBusinessVoucherCodesPagination,
          total: payload.total || 0,
          currentPage: payload.currentPage || 1,
          totalPages: payload.totalPages || 0,
        };
      })
      .addCase(getBusinessVoucherCodes.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
        toast.error(payload?.message || "Failed to fetch business voucher codes");
      })
      // Get voucher code by ID
      .addCase(getBusinessVoucherCodeById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getBusinessVoucherCodeById.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        // Store voucher code info if needed
        state.currentVoucherCode = payload.data || payload;
      })
      .addCase(getBusinessVoucherCodeById.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      // Use voucher code
      .addCase(useBusinessVoucherCode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(useBusinessVoucherCode.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.lastUseCodeResult = payload.data || payload;
        toast.success(payload?.message || "Voucher code used successfully!");
      })
      .addCase(useBusinessVoucherCode.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      });
      // Customer: list vouchers
      builder
      .addCase(getCustomerVouchers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCustomerVouchers.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.customerVouchers = payload.data || [];
        state.customerVoucherPagination = {
          ...state.customerVoucherPagination,
          total: payload.total || 0,
          currentPage: payload.currentPage || 1,
          totalPages: payload.totalPages || 0,
        };
      })
      .addCase(getCustomerVouchers.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      // Customer: my vouchers
      .addCase(getMyCustomerVouchers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMyCustomerVouchers.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.myCustomerVouchers = payload.data || [];
        state.myCustomerVoucherPagination = {
          ...state.myCustomerVoucherPagination,
          total: payload.total || 0,
          currentPage: payload.currentPage || 1,
          totalPages: payload.totalPages || 0,
        };
      })
      .addCase(getMyCustomerVouchers.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      // Customer: redeem voucher
      .addCase(redeemCustomerVoucher.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(redeemCustomerVoucher.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.lastRedeemResult = payload.data || payload;
        // Toast notification is handled in the component for better UX with link to voucher wallet
        // toast.success(payload?.message || "Voucher redeemed successfully!");
      })
      .addCase(redeemCustomerVoucher.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
        // Display error message to user
        const errorMessage = payload?.message || payload?.error || "Failed to redeem voucher. Please try again.";
        toast.error(errorMessage);
      });
  },
});

export const {
  setVoucherStatusFilter,
  setVoucherNameFilter,
  resetVoucherFilters,
  clearCurrentVoucher,
} = voucherSlice.actions;

export default voucherSlice.reducer;



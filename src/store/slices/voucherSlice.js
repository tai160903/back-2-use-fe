import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetcher from "../../apis/fetcher";
import toast from "react-hot-toast";

// ============ ADMIN VOUCHER APIs ============
export const createVoucherApi = createAsyncThunk(
  "vouchers/createVoucherApi",
  async (voucherData, { rejectWithValue }) => {
    try {
      const response = await fetcher.post("/admin/vouchers", voucherData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const getAllVouchersApi = createAsyncThunk(
  "vouchers/getAllVouchersApi",
  async ({ page = 1, limit = 10, status, name }, { rejectWithValue }) => {
    try {
      let url = `/admin/vouchers?page=${page}&limit=${limit}`;
      if (status && status !== "all") url += `&status=${status}`;
      if (name && name.trim()) url += `&name=${encodeURIComponent(name.trim())}`;
      const response = await fetcher.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const getVoucherByIdApi = createAsyncThunk(
  "vouchers/getVoucherByIdApi",
  async (voucherId, { rejectWithValue }) => {
    try {
      const response = await fetcher.get(`/admin/vouchers/${voucherId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const updateVoucherApi = createAsyncThunk(
  "vouchers/updateVoucherApi",
  async ({ voucherId, voucherData }, { rejectWithValue }) => {
    try {
      const response = await fetcher.put(`/admin/vouchers/${voucherId}`, voucherData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const deleteVoucherApi = createAsyncThunk(
  "vouchers/deleteVoucherApi",
  async (voucherId, { rejectWithValue }) => {
    try {
      const response = await fetcher.delete(`/admin/vouchers/${voucherId}`);
      const payload = response?.data || {};
      return { ...payload, id: voucherId };
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const reviewVoucherApi = createAsyncThunk(
  "vouchers/reviewVoucherApi",
  async ({ voucherId, reviewData }, { rejectWithValue }) => {
    try {
      const response = await fetcher.patch(`/admin/vouchers/${voucherId}/review`, reviewData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const createBusinessVoucherApi = createAsyncThunk(
  "vouchers/createBusinessVoucherApi",
  async (voucherData, { rejectWithValue }) => {
    try {
      const response = await fetcher.post("/admin/vouchers/business", voucherData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

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

export const createSystemVoucherApi = createAsyncThunk(
  "vouchers/createSystemVoucherApi",
  async (voucherData, { rejectWithValue }) => {
    try {
      const response = await fetcher.post("/admin/vouchers/system", voucherData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// ============ BUSINESS VOUCHER APIs ============
export const getBusinessVouchers = createAsyncThunk(
  "vouchers/getBusinessVouchers",
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
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const getBusinessVoucherDetail = createAsyncThunk(
  "vouchers/getBusinessVoucherDetail",
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

// Setup business voucher (configure before publish)
export const setupBusinessVoucher = createAsyncThunk(
  "vouchers/setupBusinessVoucher",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await fetcher.post(`/business-vouchers/${id}/setup`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Claim a business voucher for current business
export const claimBusinessVoucher = createAsyncThunk(
  "vouchers/claimBusinessVoucher",
  async ({ voucherId, data }, { rejectWithValue }) => {
    try {
      const response = await fetcher.post(`/business-vouchers/${voucherId}/claim`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Get my business vouchers (owned by current business)
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

// Use a voucher code
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
  async ({ status = "active", page = 1, limit = 10 } = {}, { rejectWithValue }) => {
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
  async ({ status = "redeemed", page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams();
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
    // Business voucher views
    businessVouchers: [],
    businessVoucherDetail: [],
    businessVoucherPagination: {
      page: 1,
      limit: 10,
      total: 0,
      currentPage: 1,
      totalPages: 0,
    },
    myBusinessVouchers: [],
    myBusinessVoucherPagination: {
      page: 1,
      limit: 10,
      total: 0,
      currentPage: 1,
      totalPages: 0,
    },
    lastClaimResult: null,
    lastSetupResult: null,
    lastUseCodeResult: null,
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
      // Create Voucher
      .addCase(createVoucherApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createVoucherApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.vouchers.unshift(payload.data);
        toast.success(payload.message || "Voucher created successfully!");
      })
      .addCase(createVoucherApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
        toast.error(payload?.message || "Failed to create voucher");
      })
      // Get All
      .addCase(getAllVouchersApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllVouchersApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.vouchers = payload.data || [];
        state.voucherPagination = {
          ...state.voucherPagination,
          total: payload.total || 0,
          currentPage: payload.currentPage || 1,
          totalPages: payload.totalPages || 0,
        };
      })
      .addCase(getAllVouchersApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
        toast.error(payload?.message || "Failed to fetch vouchers");
      })
      // Get by id
      .addCase(getVoucherByIdApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getVoucherByIdApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.currentVoucher = payload.data;
      })
      .addCase(getVoucherByIdApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      // Update
      .addCase(updateVoucherApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateVoucherApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        const updatedId = payload?.data?._id || payload?.data?.id;
        const index = state.vouchers.findIndex(
          (v) => v._id === updatedId || v.id === updatedId
        );
        if (index !== -1) state.vouchers[index] = payload.data;
        if (
          (state.currentVoucher?._id && state.currentVoucher._id === updatedId) ||
          (state.currentVoucher?.id && state.currentVoucher.id === updatedId)
        ) {
          state.currentVoucher = payload.data;
        }
        toast.success(payload.message || "Voucher updated successfully!");
      })
      .addCase(updateVoucherApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      // Delete
      .addCase(deleteVoucherApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteVoucherApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        const deletedId = payload?.data?._id || payload?.data?.id || payload?.id;
        state.vouchers = state.vouchers.filter(
          (v) => v._id !== deletedId && v.id !== deletedId
        );
        if (
          (state.currentVoucher?._id && state.currentVoucher._id === deletedId) ||
          (state.currentVoucher?.id && state.currentVoucher.id === deletedId)
        ) {
          state.currentVoucher = null;
        }
        toast.success(payload.message || "Voucher deleted successfully!");
      })
      .addCase(deleteVoucherApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      // Review
      .addCase(reviewVoucherApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(reviewVoucherApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        const updated = payload?.data || payload || {};
        const updatedId = updated._id || updated.id;
        const updatedStatus = updated.status;
        if (updatedId) {
          const index = state.vouchers.findIndex(
            (v) => v._id === updatedId || v.id === updatedId
          );
          if (index !== -1) {
            state.vouchers[index].status = updatedStatus || state.vouchers[index].status;
            if (updated.rejectReason !== undefined) {
              state.vouchers[index].rejectReason = updated.rejectReason;
            }
          }
          if (
            (state.currentVoucher?._id && state.currentVoucher._id === updatedId) ||
            (state.currentVoucher?.id && state.currentVoucher.id === updatedId)
          ) {
            if (updatedStatus) state.currentVoucher.status = updatedStatus;
            if (updated.rejectReason !== undefined) {
              state.currentVoucher.rejectReason = updated.rejectReason;
            }
          }
        }
      })
      .addCase(reviewVoucherApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      // Business voucher list
      .addCase(getBusinessVouchers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getBusinessVouchers.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.businessVouchers = payload.data || [];
        state.businessVoucherPagination = {
          ...state.businessVoucherPagination,
          total: payload.total || 0,
          currentPage: payload.currentPage || 1,
          totalPages: payload.totalPages || 0,
        };
      })
      .addCase(getBusinessVouchers.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      // Business voucher detail
      .addCase(getBusinessVoucherDetail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getBusinessVoucherDetail.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.businessVoucherDetail = payload.data || [];
      })
      .addCase(getBusinessVoucherDetail.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
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
      });
      // Setup business voucher
      builder
      .addCase(setupBusinessVoucher.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(setupBusinessVoucher.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.lastSetupResult = payload.data || payload;
        toast.success(payload?.message || "Voucher setup successfully!");
      })
      .addCase(setupBusinessVoucher.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      // Claim business voucher
      .addCase(claimBusinessVoucher.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(claimBusinessVoucher.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.lastClaimResult = payload.data || payload;
        toast.success(payload?.message || "Voucher claimed successfully!");
      })
      .addCase(claimBusinessVoucher.rejected, (state, { payload }) => {
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
        toast.success(payload?.message || "Voucher redeemed successfully!");
      })
      .addCase(redeemCustomerVoucher.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
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



import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetcher from "../../apis/fetcher";

// get Profile
export const getProfileApi = createAsyncThunk(
  "user/getProfileApi",
  async (__dirname, { rejectWithValue }) => {
    try {
      const response = await fetcher.get("/users/me");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// update Profile
export const updateProfileApi = createAsyncThunk(
  "user/updateProfileApi",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetcher.put("/users/edit-profile", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// upload avatar
export const uploadAvatarApi = createAsyncThunk(
  "user/uploadAvatarApi",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetcher.put("/users/edit-avatar", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    }
    catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);



// business profile 
export const getProfileBusiness = createAsyncThunk(
  "user/getProfileBusiness",
  async (__dirname, { rejectWithValue }) => {
    try {
      const response = await fetcher.get("/businesses/profile")
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
)


// update business profile
export const updateProfileBusiness = createAsyncThunk(
  "user/updateProfileBusiness",
  async(data, {rejectWithValue }) => {
    try {
      const response = await fetcher.patch("/businesses/profile", data)
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
)

const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: null,
    businessInfo: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    updateAvatarLocally: (state, action) => {
      if (state.userInfo?.data?.user) {
        state.userInfo.data.user.avatar = action.payload;

      } else {
        console.log('No user data found in state');
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProfileApi.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProfileApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.userInfo = payload;
      })
      .addCase(getProfileApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      .addCase(updateProfileApi.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProfileApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.userInfo = payload
      })
      .addCase(updateProfileApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      .addCase(uploadAvatarApi.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(uploadAvatarApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.userInfo = payload
      })
      .addCase(uploadAvatarApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      .addCase(getProfileBusiness.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProfileBusiness.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.businessInfo = payload
      })
      .addCase(getProfileBusiness.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload
      })
      .addCase(updateProfileBusiness.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProfileBusiness.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.businessInfo = payload
      })
      .addCase(updateProfileBusiness.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
  },
});

export const { updateAvatarLocally } = userSlice.actions;
export default userSlice.reducer;

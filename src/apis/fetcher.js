import axios from "axios";

export const fetcher = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Sử dụng interceptor để thêm token vào header trước mỗi yêu cầu
fetcher.interceptors.request.use((config) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (currentUser) {
    config.headers.Authorization = `Bearer ${currentUser.accessToken}`;
  }
  return config;
})

// Response interceptor để tự động refresh token khi gặp 401
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

fetcher.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config;

    // Nếu không phải lỗi 401 hoặc không có config request thì trả về lỗi luôn
    if (!error?.response || error.response.status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    // Tránh lặp vô hạn: không refresh lại cho các endpoint auth/refresh, login, register
    const url = (originalRequest.url || "").toString();
    const isAuthUrl =
      url.includes("/auth/login") ||
      url.includes("/auth/register") ||
      url.includes("/auth/active-account") ||
      url.includes("/auth/refresh");
    if (isAuthUrl) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }
    originalRequest._retry = true;


    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((newAccessToken) => {
          if (newAccessToken) {
            originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          }
          return fetcher(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    isRefreshing = true;
    try {
      const stored = JSON.parse(localStorage.getItem("currentUser"));
      const storedData = stored?.data || stored; 
      const refreshToken = storedData?.refreshToken;

      if (!refreshToken) {
        throw new Error("Missing refresh token");
      }

     
      const refreshEndpoint = `${import.meta.env.VITE_API_URL}/auth/refresh-token`;
      const refreshResponse = await axios.post(refreshEndpoint, { refreshToken });

   
      const tokenPayload = refreshResponse?.data?.data || refreshResponse?.data || {};
      const newAccessToken = tokenPayload.accessToken;
      const newRefreshToken = tokenPayload.refreshToken || refreshToken;

      if (!newAccessToken) {
        throw new Error("Refresh token succeeded but no access token returned");
      }

     
      const updatedUser = { ...stored };
      if (updatedUser?.data) {
        updatedUser.data = {
          ...updatedUser.data,
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        };
      } else {
        updatedUser.accessToken = newAccessToken;
        updatedUser.refreshToken = newRefreshToken;
      }
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));

     
      fetcher.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
      processQueue(null, newAccessToken);

     
      originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
      return fetcher(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);

      localStorage.removeItem("currentUser");

      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default fetcher;
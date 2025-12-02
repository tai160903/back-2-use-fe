import axios from "axios";

export const fetcher = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Biến trạng thái để tránh gọi refresh song song
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  while (failedQueue.length) {
    const { resolve, reject } = failedQueue.shift();
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  }
};

// Sử dụng interceptor để thêm token vào header trước mỗi yêu cầu
fetcher.interceptors.request.use((config) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (currentUser) {
    config.headers.Authorization = `Bearer ${currentUser.accessToken}`;
    
    try {
      const tokenPayload = JSON.parse(atob(currentUser.accessToken.split('.')[1]));
      console.log('Token payload:', tokenPayload);
      console.log('User role from token:', tokenPayload.role);
      console.log('Request URL:', config.url);
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  } else {
    console.warn('No currentUser found in localStorage');
  }
  return config;
})

// Interceptor để xử lý response và retry khi gặp 401
fetcher.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;


    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      const refreshToken = currentUser?.refreshToken;

      if (!refreshToken) {
        return Promise.reject(error);
      }


      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(fetcher(originalRequest));
            },
            reject,
          });
        });
      }

      isRefreshing = true;

      try {

        const resp = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
          { refreshToken },
          { headers: { "Content-Type": "application/json" } }
        );

        const newAccessToken = resp?.data?.data?.accessToken;
        if (!newAccessToken) {
          throw new Error("No access token returned from refresh endpoint");
        }


        const updatedUser = { ...currentUser, accessToken: newAccessToken };
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));


        fetcher.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return fetcher(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);

        localStorage.removeItem("currentUser");
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
)



export default fetcher;
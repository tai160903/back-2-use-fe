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

// Interceptor để xử lý response và retry khi gặp 401
fetcher.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Nếu gặp 401 và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Kiểm tra lại token trong localStorage
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (currentUser?.accessToken) {
        // Thêm token vào request và retry
        originalRequest.headers.Authorization = `Bearer ${currentUser.accessToken}`;
        return fetcher(originalRequest);
      }
    }
    
    return Promise.reject(error);
  }
)



export default fetcher;
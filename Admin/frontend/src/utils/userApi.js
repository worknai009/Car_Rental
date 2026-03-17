import axios from "axios";

const userApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // ✅ IMPORTANT: required for cookies
});

// ✅ Interceptor to handle errors globally
userApi.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      // Local session cleanup (UI only)
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);



export default userApi;

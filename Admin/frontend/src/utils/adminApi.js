// import axios from "axios";

// const adminApi = axios.create({
//   baseURL: "http://localhost:1000",
// });

// adminApi.interceptors.request.use((config) => {
//   const token = localStorage.getItem("adminToken");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// export default adminApi;

import axios from "axios";

const adminApi = axios.create({
  baseURL: import.meta.env.VITE_ADMIN_API_URL,
  withCredentials: true, // ✅ IMPORTANT: required for cookies
});

// ✅ Auto logout on session expiry (401/403)
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401 || status === 403) {
      // clear admin session (UI local ONLY)
      localStorage.removeItem("admin");
      window.location.href = "/admin/login";
    }

    return Promise.reject(error);
  }
);

export default adminApi;


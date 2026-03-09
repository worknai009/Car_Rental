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
  baseURL: import.meta.env.VITE_API_URL,
});

// ✅ Attach token
adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Auto logout on token expiry / invalid token (401/403)
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401 || status === 403) {
      // clear admin session
      localStorage.removeItem("adminToken");
      localStorage.removeItem("admin");

      // redirect to admin login (works without navigate)
      window.location.href = "/admin/login";
    }

    return Promise.reject(error);
  }
);

export default adminApi;


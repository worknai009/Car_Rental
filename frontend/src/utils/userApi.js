import axios from "axios";

const userApi = axios.create({
  baseURL: "http://localhost:1000", // ✅ because app.use("/", user_routes)
});

// ✅ attach user token automatically
userApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // ✅ user token key
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ✅ auto logout if token invalid/expired
userApi.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);



export default userApi;

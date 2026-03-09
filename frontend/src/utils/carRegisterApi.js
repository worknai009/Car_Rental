import axios from "axios";

const carRegisterApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/car-register`,
});

carRegisterApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("carRegisterToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

carRegisterApi.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem("carRegisterToken");
      localStorage.removeItem("carRegisterUser");
      window.location.href = "/car-register/login"; // ✅ CORRECT
    }
    return Promise.reject(err);
  }
);

export default carRegisterApi;

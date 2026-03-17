import axios from "axios";

const carRegisterApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/car-register`,
  withCredentials: true, // ✅ IMPORTANT: required for cookies
});

carRegisterApi.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      // Local cleanup (UI ONLY)
      localStorage.removeItem("carRegisterUser");
      window.location.href = "/car-register/login"; // ✅ CORRECT
    }
    return Promise.reject(err);
  }
);

export default carRegisterApi;

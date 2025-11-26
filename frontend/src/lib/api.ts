import axios from "axios";
import { clearAuth } from "./auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://kulmsin.juraganweb.web.id/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      clearAuth();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;

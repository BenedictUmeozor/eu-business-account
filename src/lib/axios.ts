import ENDPOINTS from "@/constants/endpoints";
import axios from "axios";

const api = axios.create({
  baseURL: ENDPOINTS.APP_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  validateStatus: status => status < 500,
});

api.interceptors.request.use(
  config => {
    config.headers["h-auth-signature"] = "a2c04a75a7d420448b60a2cf0899d396";
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default api;

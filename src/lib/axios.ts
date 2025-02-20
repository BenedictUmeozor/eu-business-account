import ENDPOINTS from "@/constants/endpoints";
import axios from "axios";
import HM_NSP from "@/constants/namespace";
import { logout } from "./redux/slices/session";

const api = axios.create({
  baseURL: ENDPOINTS.APP_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  validateStatus: status => status < 500,
});

export const sharedApi = axios.create({
  baseURL: ENDPOINTS.APP_SHARED_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  validateStatus: status => status < 500,
});

api.interceptors.request.use(
  config => {
    const userState = sessionStorage.getItem(HM_NSP.USER);
    const user = userState ? JSON.parse(userState) : null;

    config.headers["h-auth-signature"] = "a2c04a75a7d420448b60a2cf0899d396";
    if (user?.jwt) {
      config.headers["user-auth"] = user.jwt;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

sharedApi.interceptors.request.use(
  config => {
    const userState = sessionStorage.getItem(HM_NSP.USER);
    const user = userState ? JSON.parse(userState) : null;

    config.headers["h-auth-signature"] = "a2c04a75a7d420448b60a2cf0899d396";
    if (user?.jwt) {
      config.headers["user-auth"] = user.jwt;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      logout();
    }
    return Promise.reject(error);
  }
);

sharedApi.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      logout();
    }
    return Promise.reject(error);
  }
);

export default api;

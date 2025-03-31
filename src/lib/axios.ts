import ENDPOINTS from "@/constants/endpoints";
import axios from "axios";
import HM_NSP from "@/constants/namespace";
import store from "./redux/store";
import { clearSession } from "./redux/slices/session";

const api = axios.create({
  baseURL: ENDPOINTS.APP_BASE_URL,
  // Removed default Content-Type header to allow FormData to work correctly
});

const sharedApi = axios.create({
  baseURL: ENDPOINTS.APP_SHARED_BASE_URL,
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
    // console.log("Interceptor caught an error:", {
    //   status: error.response?.status,
    //   message: error.message,
    //   config: error.config,
    //   fullError: error,
    // });

    if (error.response?.status === 401) {
      store.dispatch(clearSession());
      // window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

sharedApi.interceptors.response.use(
  response => response,
  error => {
    // console.log("Interceptor caught an error:", {
    //   status: error.response?.status,
    //   message: error.message,
    //   config: error.config,
    //   fullError: error,
    // });
    if (error.response?.status === 401) {
      store.dispatch(clearSession());
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export { sharedApi };

export default api;

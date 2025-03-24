import axios from "axios";
import { API_BASE_URL } from "../config.js";

axios.defaults.baseURL = API_BASE_URL;

let isRefreshing = false;
let failedRequestsQueue = [];

// interceptor
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

const processQueue = (error, token = null) => {
  for (const promise of failedRequestsQueue) {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  }

  failedRequestsQueue = [];
};

// interceptor do odświeżania tokena
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/token/refresh")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axios(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }
      // odświeżanie tokenu
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          window.location.href = "/auth";
          return Promise.reject(error);
        }

        const response = await axios.post(
          "/token/refresh/",
          { refresh: refreshToken },
          { headers: { Authorization: "" } },
        );

        const { access } = response.data;

        localStorage.setItem("token", access);
        originalRequest.headers.Authorization = `Bearer ${access}`;

        processQueue(null, access);

        return axios(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");

        window.location.href = "/auth";

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error); // Odrzucenie innych błędów niż 401
  },
);

export default axios;

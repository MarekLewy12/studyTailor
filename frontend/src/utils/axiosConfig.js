import axios from "axios";
import { API_BASE_URL } from "../config.js";
import { jwtDecode } from "jwt-decode";

axios.defaults.baseURL = API_BASE_URL;

let isRefreshing = false;
let failedRequestsQueue = [];

const isTokenExpiringSoon = (token, thresholdSeconds = 60) => {
  if (!token) return false;

  try {
    const decodedToken = jwtDecode(token);

    const expirationTokenTime = decodedToken.exp * 1000; // Czas wygaśnięcia tokenu w milisekundach
    const currentTime = Date.now(); // Aktualny czas w milisekundach

    const timeUntilExpiration = expirationTokenTime - currentTime; // Czas do wygaśnięcia tokenu

    if (timeUntilExpiration < thresholdSeconds * 1000) {
      return true; // Token wygasa w ciągu 60 sekund
    }
  } catch (error) {
    console.error("Błąd dekodowania tokenu:", error);
    return true; // Jeśli wystąpił błąd, traktujemy token jako wygasły
  }
};

const refreshAuthToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    window.location.href = "/auth";
    return Promise.reject(new Error("Brak tokenu odświeżającego"));
  }

  try {
    const response = await axios.post(
      "/token/refresh/",
      { refresh: refreshToken },
      { headers: { Authorization: "" } },
    );

    const { access } = response.data;

    localStorage.setItem("token", access);
    return access;
  } catch (error) {
    console.error("Błąd podczas odświeżania tokenu:", error);
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    window.location.href = "/auth";
    return Promise.reject(error);
  }
};

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

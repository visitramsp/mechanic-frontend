import axios from "axios";
import toast from "react-hot-toast";

const configuredBaseUrl ="http://localhost:5000/api"
export const basedURLs = configuredBaseUrl;
export const developmentBaseURL = basedURLs.replace(/\/$/, "");

const apiInstance = axios.create({
  baseURL: developmentBaseURL,
  timeout: 20000,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

apiInstance.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const hadToken = typeof window !== "undefined" && localStorage.getItem("token");
    if (status === 401 && hadToken) {
      localStorage.removeItem("token");
      localStorage.removeItem("users");
      localStorage.removeItem("rememberWorkshopSession");
      window.location.assign("/");
      toast.error(error?.response?.data?.message || "Your session has expired. Please sign in again.");
    }
    return Promise.reject(error);
  },
);

export default apiInstance;

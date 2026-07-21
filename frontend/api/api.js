import axios from "axios";

// Normalize VITE_API_BASE_URL so it always points to the backend API root
// Accepts either a base like https://backend.onrender.com or https://backend.onrender.com/api
const rawBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const normalizedBase = rawBase.replace(/\/+$/, "");
const baseURL = normalizedBase.toLowerCase().endsWith("/api")
  ? normalizedBase
  : normalizedBase + "/api";

const API = axios.create({
  baseURL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = 'Bearer ' + token;
  }

  return config;
});

export default API;

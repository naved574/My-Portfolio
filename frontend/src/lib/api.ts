import axios from "axios";
import { getAdminToken, getUserToken } from "./auth";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const path = config.url || "";
  const isAdminApi = path.startsWith("/admin/");
  const isUserAuthApi = path === "/auth/me" || path === "/auth/logout";

  const token = isAdminApi ? getAdminToken() : isUserAuthApi ? getUserToken() : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const unwrapData = <T>(response: { data: { data: T } }) => response.data.data;

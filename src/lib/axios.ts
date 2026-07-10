import axios, { type AxiosError } from "axios";
import { API_BASE_URL, ApiError } from "@/lib/api/client";

// Client-side HTTP layer for SWR hooks. Server Components keep using the fetch
// client in `@/lib/api/client`; this instance is for interactive pages that
// need caching, dedup, and revalidation (see `useRequest`).
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { Accept: "application/json", "Content-Type": "application/json" },
});

const TOKEN_KEY = "bracket.token";

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem(TOKEN_KEY);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize every failure into the shared ApiError so `displayMessage`,
// `isVersionConflict`, and `fieldErrors` behave the same as the fetch client.
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const res = error.response;
    if (res) {
      throw new ApiError(res.status, `${res.status} ${res.statusText}`.trim(), res.data);
    }
    throw new ApiError(0, "Could not reach the API.", error);
  },
);

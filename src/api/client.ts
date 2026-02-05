/* ==================== API CLIENT ==================== */

import { API_BASE_URL, TOKEN_KEYS } from "./config";
import type { ApiError, ApiResponse } from "@/types";

/**
 * Check if we're in development mode
 */
const isDev = import.meta.env.DEV;

/**
 * Custom error class for API errors
 */
export class ApiClientError extends Error {
  statusCode: number;
  errors?: Record<string, string[]>;

  constructor(
    statusCode: number,
    message: string,
    errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = "ApiClientError";
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

/**
 * Get auth token from localStorage
 */
function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
}

/**
 * Get refresh token from localStorage
 */
function getRefreshToken(): string | null {
  return localStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN);
}

/**
 * Set auth token to localStorage
 */
export function setAuthToken(token: string): void {
  localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, token);
}

/**
 * Set refresh token to localStorage
 */
export function setRefreshToken(token: string): void {
  localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, token);
}

/**
 * Clear auth tokens from localStorage
 */
export function clearAuthTokens(): void {
  localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
}

/**
 * Flag to prevent multiple concurrent token refresh attempts
 */
let isRefreshingToken = false;
let refreshTokenPromise: Promise<boolean> | null = null;

/**
 * Refresh the access token using the refresh token
 */
async function refreshAccessToken(): Promise<boolean> {
  if (isRefreshingToken) {
    return refreshTokenPromise!;
  }

  isRefreshingToken = true;
  refreshTokenPromise = (async () => {
    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        clearAuthTokens();
        return false;
      }

      const url = `${API_BASE_URL}${"/auth/refresh"}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${refreshToken}`,
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        clearAuthTokens();
        return false;
      }

      const data = await response.json();
      const newAccessToken = data.data?.accessToken || data.accessToken;

      if (newAccessToken) {
        setAuthToken(newAccessToken);
        if (isDev) {
          console.log("🔄 Token refreshed successfully");
        }
        return true;
      }

      clearAuthTokens();
      return false;
    } catch (error) {
      if (isDev) {
        console.error("🔴 Token refresh failed:", error);
      }
      clearAuthTokens();
      return false;
    } finally {
      isRefreshingToken = false;
      refreshTokenPromise = null;
    }
  })();

  return refreshTokenPromise;
}

/**
 * Main API client using fetch
 */
export async function apiClient<TResponse = unknown>(
  endpoint: string,
  options: RequestInit & { requiresAuth?: boolean } = {}
): Promise<TResponse> {
  const { requiresAuth = true, headers = {}, ...fetchOptions } = options;

  // Check if body is FormData to avoid setting Content-Type
  const isFormData = fetchOptions.body instanceof FormData;

  // Build request headers
  const requestHeaders: Record<string, string> = {
    // Only set Content-Type if not FormData (browser will set it with boundary)
    ...(!isFormData && { "Content-Type": "application/json" }),
    ...(headers as Record<string, string>),
  };

  // Add auth token if required
  if (requiresAuth) {
    const token = getAuthToken();
    if (token) {
      requestHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  // Build full URL
  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`;

  // Log request in dev mode
  if (isDev) {
    console.group(`🌐 API Request: ${fetchOptions.method || 'GET'} ${endpoint}`);
    console.log("📤 URL:", url);
    console.log("📋 Headers:", requestHeaders);
    if (fetchOptions.body) {
      try {
        console.log("📦 Body:", JSON.parse(fetchOptions.body as string));
      } catch {
        console.log("📦 Body:", fetchOptions.body);
      }
    }
    console.groupEnd();
  }

  try {
    let response = await fetch(url, {
      ...fetchOptions,
      headers: requestHeaders,
    });

    // Handle 401 Unauthorized - Session expired
    if (response.status === 401) {
      const errorData: ApiError = await response.json().catch(() => ({
        success: false,
        message: response.statusText || "An error occurred",
        statusCode: response.status,
      }));

      if (errorData.message === "Session expired, please login again") {
        if (isDev) {
          console.log("🔐 Session expired, attempting to refresh token...");
        }

        // Try to refresh token
        const refreshed = await refreshAccessToken();

        if (refreshed) {
          // Get new token and retry request
          const newToken = getAuthToken();
          const retryHeaders = { ...requestHeaders };
          if (newToken) {
            retryHeaders["Authorization"] = `Bearer ${newToken}`;
          }

          if (isDev) {
            console.log("🔄 Retrying request with new token...");
          }

          response = await fetch(url, {
            ...fetchOptions,
            headers: retryHeaders,
          });

          // If retry still fails, handle as normal error
          if (!response.ok) {
            const retryErrorData: ApiError = await response.json().catch(() => ({
              success: false,
              message: response.statusText || "An error occurred",
              statusCode: response.status,
            }));

            if (isDev) {
              console.group(`❌ API Error (after retry): ${fetchOptions.method || 'GET'} ${endpoint}`);
              console.log("Status:", response.status);
              console.log("Error Data:", retryErrorData);
              console.groupEnd();
            }

            throw new ApiClientError(
              response.status,
              retryErrorData.message || "Request failed",
              retryErrorData.errors
            );
          }
        } else {
          // Refresh failed, redirect to login
          if (isDev) {
            console.log("🔐 Token refresh failed, clearing auth and redirecting to login");
          }
          clearAuthTokens();
          window.location.href = "/";

          throw new ApiClientError(
            401,
            "Session expired, please login again"
          );
        }
      } else {
        // Other 401 errors
        if (isDev) {
          console.group(`❌ API Error: ${fetchOptions.method || 'GET'} ${endpoint}`);
          console.log("Status:", response.status);
          console.log("Error Data:", errorData);
          console.groupEnd();
        }

        throw new ApiClientError(
          response.status,
          errorData.message || "Request failed",
          errorData.errors
        );
      }
    } else if (!response.ok) {
      // Handle other non-OK responses
      const errorData: ApiError = await response.json().catch(() => ({
        success: false,
        message: response.statusText || "An error occurred",
        statusCode: response.status,
      }));

      // Log error in dev mode
      if (isDev) {
        console.group(`❌ API Error: ${fetchOptions.method || 'GET'} ${endpoint}`);
        console.log("Status:", response.status);
        console.log("Error Data:", errorData);
        console.groupEnd();
      }

      throw new ApiClientError(
        response.status,
        errorData.message || "Request failed",
        errorData.errors
      );
    }

    // Parse response
    const json = await response.json();
    // Some endpoints return `{ data: ... }`, others return raw payload.
    const payload = (json && Object.prototype.hasOwnProperty.call(json, "data"))
      ? (json as ApiResponse<TResponse>).data
      : (json as TResponse);

    // Log successful response in dev mode
    if (isDev) {
      console.group(`✅ API Response: ${fetchOptions.method || 'GET'} ${endpoint}`);
      console.log("Status:", response.status);
      console.log("📥 Data:", payload);
      console.groupEnd();
    }

    return payload as TResponse;
  } catch (error) {
    // Re-throw ApiClientError
    if (error instanceof ApiClientError) {
      throw error;
    }

    // Handle network errors
    if (error instanceof TypeError) {
      if (isDev) {
        console.error(`🔴 Network Error: ${fetchOptions.method || 'GET'} ${endpoint}`, error);
      }
      throw new ApiClientError(0, "Network error. Please check your connection.");
    }

    // Handle unknown errors
    if (isDev) {
      console.error(`🔴 Unexpected Error: ${fetchOptions.method || 'GET'} ${endpoint}`, error);
    }
    throw new ApiClientError(500, "An unexpected error occurred");
  }
}

/**
 * Convenience methods for different HTTP verbs
 */
export const api = {
  get: <T>(endpoint: string, options?: RequestInit & { requiresAuth?: boolean }) =>
    apiClient<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit & { requiresAuth?: boolean }
  ) =>
    apiClient<T>(endpoint, {
      ...options,
      method: "POST",
      body: data instanceof FormData ? data : (data ? JSON.stringify(data) : undefined),
    }),

  put: <T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit & { requiresAuth?: boolean }
  ) =>
    apiClient<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit & { requiresAuth?: boolean }
  ) =>
    apiClient<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(endpoint: string, options?: RequestInit & { requiresAuth?: boolean }) =>
    apiClient<T>(endpoint, { ...options, method: "DELETE" }),
};

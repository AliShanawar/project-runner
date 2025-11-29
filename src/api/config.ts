/* ==================== API CONFIGURATION ==================== */

/**
 * Base API URL - Update this with your actual backend URL
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/user/logout",
    REFRESH_TOKEN: "/auth/refresh",
    FORGOT_PASSWORD: "/auth/forgotPassword?lang=en",
    VERIFY_OTP: "/auth/verify",
    RESET_PASSWORD: "/auth/resetPassword",
    VERIFY_RESET_OTP: "/auth/verifyResetOtp",
    UPDATE_PROFILE: "/auth/updateProfile",
    UPLOAD: "/auth/upload",
  },
  S3: {
    SIGNED_URL: "/s3/signed-upload-url",
  },
  USER: {
    UPDATE_PASSWORD: "/user/update-password",
    GET_USER: (id: string) => `/user/${id}`,
    GET_ALL: "/user/all",
    VERIFY_AND_DELETE: "/user/verify-and-delete",
    UPDATE_ME: "/user/update-me",
    APPROVE_REJECT: (userId: string) => `/user/approve-reject/${userId}`,
    DELETE_USER: (userId: string) => `/user/${userId}`,
  },
  LEGAL: {
    PRIVACY_POLICY: "/privacy-policy",
    TERMS_AND_CONDITIONS: "/terms-and-conditions",
  },
  SITE: {
    CREATE: "/site",
    GET_ALL: "/site",
    GET_BY_ID: (id: string) => `/site/${id}`,
    UPDATE: (id: string) => `/site/${id}`,
    DELETE: (id: string) => `/site/${id}`,
  },
  FEEDBACK: {
    ADMIN_ALL: "/feedback/admin/all",
    GET_BY_ID: (id: string) => `/feedback/${id}`,
  },
  COMPLAINT: {
    ADMIN_ALL: "/complain/admin/all",
    GET_BY_ID: (id: string) => `/complain/${id}`,
  },
  TASK: {
    GET_BY_SITE: (siteId: string) => `/tasks/site/${siteId}`,
    GET_BY_ID: (taskId: string) => `/tasks/${taskId}`,
  },
} as const;

/**
 * Token storage keys
 */
export const TOKEN_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
} as const;

/* ==================== API CONFIGURATION ==================== */

/**
 * Base API URL - Update this with your actual backend URL
 */
export const API_BASE_URL =
  "http://ec2-52-91-126-131.compute-1.amazonaws.com/api/v1";

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
    GET_EMPLOYEES: (id: string) => `/site/${id}/employees`,
  },
  FEEDBACK: {
    ADMIN_ALL: "/feedback/admin/all",
    GET_BY_ID: (id: string) => `/feedback/${id}`,
  },
  COMPLAINT: {
    ADMIN_ALL: "/complain/admin/all",
    GET_BY_ID: (id: string) => `/complain/${id}`,
  },
  WORKPACK: {
    CREATE: "/workpacks",
    GET_ALL: "/workpacks",
    GET_BY_ID: (id: string) => `/workpacks/${id}`,
    UPDATE: (id: string) => `/workpacks/${id}`,
    DELETE: (id: string) => `/workpacks/${id}`,
    GET_BY_SUBCONTRACTOR: (subcontractorId: string) =>
      `/workpacks/subcontractor/${subcontractorId}`,
  },
  HS_LOG: {
    CREATE: "/hs-logs",
    GET_ALL: "/hs-logs",
    GET_BY_SITE: (siteId: string) => `/hs-logs/site/${siteId}`,
    GET_BY_ID: (hsLogId: string) => `/hs-logs/${hsLogId}`,
    UPDATE: (hsLogId: string) => `/hs-logs/${hsLogId}`,
    DELETE: (hsLogId: string) => `/hs-logs/${hsLogId}`,
    UPDATE_STATUS: (hsLogId: string) => `/hs-logs/${hsLogId}/status`,
  },
  TASK: {
    GET_BY_SITE: (siteId: string) => `/tasks/site/${siteId}`,
    GET_BY_ID: (taskId: string) => `/tasks/${taskId}`,
  },
  INVENTORY: {
    GET_ALL: "/inventory",
    GET_BY_ID: (id: string) => `/inventory/${id}`,
    CREATE: "/inventory",
    UPDATE: (id: string) => `/inventory/${id}`,
    DELETE: (id: string) => `/inventory/${id}`,
  },
} as const;

/**
 * Token storage keys
 */
export const TOKEN_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
} as const;

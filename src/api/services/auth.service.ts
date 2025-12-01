/* ==================== AUTH SERVICE ==================== */

import { api } from "../client";
import { API_ENDPOINTS } from "../config";
import type {
  LoginRequest,
  LoginResponse,
  ForgotPasswordRequest,
  VerifyOtpRequest,
  ResetPasswordRequest,
  UpdateProfileRequest,
  User,
  LogoutRequest,
} from "@/types";

/**
 * Auth API service
 */
export const authService = {
  /**
   * Login user
   */
  login: async (data: LoginRequest) => {
    return api.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, data, {
      requiresAuth: false,
    });
  },

  /**
   * Logout user
   */
  logout: async (data: LogoutRequest) => {
    return api.post(API_ENDPOINTS.AUTH.LOGOUT, data);
  },

  /**
   * Send forgot password email
   */
  forgotPassword: async (data: ForgotPasswordRequest) => {
    return api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data, {
      requiresAuth: false,
    });
  },

  /**
   * Verify OTP
   */
  verifyOtp: async (data: VerifyOtpRequest) => {
    return api.post(API_ENDPOINTS.AUTH.VERIFY_OTP, data, {
      requiresAuth: false,
    });
  },

  /**
   * Reset password
   */
  resetPassword: async (data: ResetPasswordRequest) => {
    return api.patch(API_ENDPOINTS.AUTH.RESET_PASSWORD, data, {
      requiresAuth: false,
    });
  },

  /**
   * Verify reset OTP
   */
  verifyResetOtp: async (data: VerifyOtpRequest) => {
    return api.post(API_ENDPOINTS.AUTH.VERIFY_OTP, data, {
      requiresAuth: false,
    });
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: UpdateProfileRequest) => {
    return api.put<User>(API_ENDPOINTS.AUTH.UPDATE_PROFILE, data);
  },

  /**
   * Upload file to get signed URL
   */
  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post<{ url: string }>(API_ENDPOINTS.AUTH.UPLOAD, formData);
  },

  /**
   * Get signed URL for S3 upload
   */
  getSignedUrl: async (fileName: string, fileType: string) => {
    return api.post<{ url: string; key: string }>(API_ENDPOINTS.S3.SIGNED_URL, {
      fileName,
      fileType,
    });
  },
};

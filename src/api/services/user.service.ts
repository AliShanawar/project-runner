import { api } from "@/api/client";
import { API_ENDPOINTS } from "@/api/config";
import type {
  ApproveRejectRequest,
  SignedUrlResponse,
  UpdatePasswordRequest,
  UpdateUserRequest,
  UploadResponse,
  User,
  UserFilter,
  UserResponse,
} from "@/types";

export const userService = {
  /**
   * Upload file
   */
  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post<UploadResponse>(API_ENDPOINTS.AUTH.UPLOAD, formData);
  },

  /**
   * Get signed upload URL
   */
  getSignedUrl: async (fileName: string, fileType: string) => {
    return api.post<SignedUrlResponse>(API_ENDPOINTS.S3.SIGNED_URL, {
      fileName,
      fileType,
    });
  },

  /**
   * Update password
   */
  updatePassword: async (data: UpdatePasswordRequest) => {
    return api.patch(API_ENDPOINTS.USER.UPDATE_PASSWORD, data);
  },

  /**
   * Get user by ID
   */
  getUser: async (id: string) => {
    return api.get<User>(API_ENDPOINTS.USER.GET_USER(id));
  },

  /**
   * Verify and delete user
   */
    verifyAndDelete: async (data: { password: string; reason: string }) => {
    return api.post(API_ENDPOINTS.USER.VERIFY_AND_DELETE, data);
  },

  /**
   * Update current user profile
   */
  updateMe: async (data: UpdateUserRequest) => {
    return api.patch<User>(API_ENDPOINTS.USER.UPDATE_ME, data);
  },

  /**
   * Approve or reject user (Admin only)
   */

  /**
   * Get all users (Admin only)
   */
  getAllUsers: async (params?: UserFilter) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          queryParams.append(key, String(value));
        }
      });
    }
    const queryString = queryParams.toString();
    const endpoint = queryString
      ? `${API_ENDPOINTS.USER.GET_ALL}?${queryString}`
      : API_ENDPOINTS.USER.GET_ALL;
    return api.get<UserResponse>(endpoint);
  },

  /**
   * Approve or reject user (Admin only)
   */
  approveRejectUser: async (userId: string, data: ApproveRejectRequest) => {
    return api.patch(API_ENDPOINTS.USER.APPROVE_REJECT(userId), data);
  },

  /**
   * Delete user (Admin only)
   */
  deleteUser: async (userId: string) => {
    return api.delete(API_ENDPOINTS.USER.DELETE_USER(userId));
  },

  /**
   * Get privacy policy
   */
  getPrivacyPolicy: async () => {
    return api.get<{ privacyPolicy: string; contactUs?: any; aboutUs?: string }>(
      `${API_ENDPOINTS.LEGAL.PRIVACY_POLICY}?platformName=builder`
    );
  },

  /**
   * Get terms and conditions
   */
  getTermsAndConditions: async () => {
    return api.get<{ termsAndConditions: string }>(
      `${API_ENDPOINTS.LEGAL.TERMS_AND_CONDITIONS}?platformName=builder`
    );
  },
};

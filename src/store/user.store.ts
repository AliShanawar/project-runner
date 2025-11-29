import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { userService } from "@/api/services/user.service";
import type {
  ApproveRejectRequest,
  UpdatePasswordRequest,
  UpdateUserRequest,
  User,
  UserFilter,
  Pagination,
} from "@/types";
import { useAuthStore } from "./authStore";

interface UserState {
  isLoading: boolean;
  error: string | null;
  users: User[];
  selectedUser: User | null;
  pagination: Pagination | null;

  // Actions
  getAllUsers: (params?: UserFilter) => Promise<void>;
  uploadFile: (file: File) => Promise<{ url: string; key: string }>;
  getSignedUrl: (
    fileName: string,
    fileType: string
  ) => Promise<{ url: string; key: string }>;
  updatePassword: (data: UpdatePasswordRequest) => Promise<void>;
  getUser: (id: string) => Promise<User>;
  verifyAndDelete: (data: { password: string; reason: string }) => Promise<void>;
  updateMe: (data: UpdateUserRequest) => Promise<void>;
  approveRejectUser: (
    userId: string,
    data: ApproveRejectRequest
  ) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
}

export const useUserStore = create<UserState>()(
  devtools((set) => ({
    isLoading: false,
    error: null,
    users: [],
    selectedUser: null,
    pagination: null,

    /* -------------------------
     * GET ALL USERS
     * ------------------------ */
    getAllUsers: async (params) => {
      try {
        set({ isLoading: true, error: null });
        const data = await userService.getAllUsers(params);
        console.log("users", data);
        set({ users: data.users, pagination: data.pagination, isLoading: false });
      } catch (error: any) {
        set({ isLoading: false, error: error.message });
        throw error;
      }
    },

    /* -------------------------
     * UPLOAD FILE
     * ------------------------ */
    uploadFile: async (file) => {
      try {
        set({ isLoading: true, error: null });
        const response = await userService.uploadFile(file);
        set({ isLoading: false });
        return response;
      } catch (error: any) {
        set({ isLoading: false, error: error.message });
        throw error;
      }
    },

    /* -------------------------
     * GET SIGNED URL
     * ------------------------ */
    getSignedUrl: async (fileName, fileType) => {
      try {
        set({ isLoading: true, error: null });
        const response = await userService.getSignedUrl(fileName, fileType);
        set({ isLoading: false });
        return response;
      } catch (error: any) {
        set({ isLoading: false, error: error.message });
        throw error;
      }
    },

    /* -------------------------
     * UPDATE PASSWORD
     * ------------------------ */
    updatePassword: async (data) => {
      try {
        set({ isLoading: true, error: null });
        await userService.updatePassword(data);
        set({ isLoading: false });
      } catch (error: any) {
        set({ isLoading: false, error: error.message });
        throw error;
      }
    },

    /* -------------------------
     * GET USER
     * ------------------------ */
    getUser: async (id) => {
      try {
        set({ isLoading: true, error: null });
        const user = await userService.getUser(id);
        set({ selectedUser: user, isLoading: false });
        return user;
      } catch (error: any) {
        set({ isLoading: false, error: error.message });
        throw error;
      }
    },

    /* -------------------------
     * VERIFY AND DELETE
     * ------------------------ */
    verifyAndDelete: async (data) => {
      try {
        set({ isLoading: true, error: null });
        await userService.verifyAndDelete(data);
        // Logout after deletion
        useAuthStore.getState().logout();
        set({ isLoading: false });
      } catch (error: any) {
        set({ isLoading: false, error: error.message });
        throw error;
      }
    },

    /* -------------------------
     * UPDATE ME
     * ------------------------ */
    updateMe: async (data) => {
      try {
        set({ isLoading: true, error: null });
        await userService.updateMe(data);
        
        // Manually update auth store with only the fields that were changed
        const currentUser = useAuthStore.getState().user;
        if (currentUser) {
          useAuthStore.setState({ 
            user: {
              ...currentUser,
              ...data, // Merge the updated fields
            }
          });
        }
        
        set({ isLoading: false });
      } catch (error: any) {
        set({ isLoading: false, error: error.message });
        throw error;
      }
    },

    /* -------------------------
     * APPROVE / REJECT USER
     * ------------------------ */
    approveRejectUser: async (userId, data) => {
      try {
        set({ isLoading: true, error: null });
        await userService.approveRejectUser(userId, data);
        set({ isLoading: false });
      } catch (error: any) {
        set({ isLoading: false, error: error.message });
        throw error;
      }
    },

    /* -------------------------
     * DELETE USER
     * ------------------------ */
    deleteUser: async (userId) => {
      try {
        set({ isLoading: true, error: null });
        await userService.deleteUser(userId);
        set({ isLoading: false });
      } catch (error: any) {
        set({ isLoading: false, error: error.message });
        throw error;
      }
    },
  }))
);

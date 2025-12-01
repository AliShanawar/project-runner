import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { authService } from "@/api/services/auth.service";
import { setAuthToken, setRefreshToken, clearAuthTokens } from "@/api/client";
import { clearDeviceInfo, getDeviceInfo } from "@/lib/deviceId";
import type { User } from "@/types";
import { toast } from "sonner";

/* ----------------------------- Types ----------------------------- */

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  resetEmail: string | null; // Store email during password reset flow

  // Actions
  login: (email: string, password: string) => Promise<void>;
  sendResetEmail: (email: string) => Promise<void>;
  resendOtp: () => Promise<void>;
  verifyOtp: (otp: string) => Promise<void>;
  resetPassword: (password: string) => Promise<void>;
  verifyResetOtp: (otp: string) => Promise<void>;
  updateProfile: (name: string, avatar: string | null) => Promise<void>;
  logout: () => Promise<void>;
}

/* ----------------------------- Store ----------------------------- */

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        resetEmail: null,

        /* -------------------------
         * LOGIN
         * ------------------------ */
        login: async (email, password) => {
          try {
            set({ isLoading: true });
            console.log("🔐 Logging in...", email);

            // Get device info
            const device = getDeviceInfo();

            // Call API
            const response = await authService.login({
              email,
              password,
              device,
            });

            // Store tokens
            setAuthToken(response.token);
            if (response.refreshToken) {
              setRefreshToken(response.refreshToken);
            }

            // Update state
            set({
              user: response.user,
              isAuthenticated: true,
              isLoading: false,
            });

            console.log("✅ Login successful", response.user);
          } catch (error) {
            console.error("❌ Login failed:", error);
            const message =
              (error as any)?.response?.data?.message ||
              (error as Error)?.message ||
              "Incorrect email or password";
            toast.error(message);
            set({ isLoading: false });
            throw new Error(message);
          }
        },

        /* -------------------------
         * SEND RESET EMAIL
         * ------------------------ */
        sendResetEmail: async (email) => {
          try {
            console.log("📩 Sending password reset email to", email);

            await authService.forgotPassword({ email });

            set({
              resetEmail: email,
              isAuthenticated: false,
            });

            console.log("✅ Reset email sent");
          } catch (error) {
            console.error("❌ Failed to send reset email:", error);
            throw error;
          }
        },

        /* -------------------------
         * RESEND OTP
         * ------------------------ */
        resendOtp: async () => {
          try {
            set({ isLoading: true });
            const { resetEmail } = get();
            if (!resetEmail) {
              throw new Error("No email set for OTP resend");
            }

            console.log("📨 Resending OTP...");

            await authService.forgotPassword({ email: resetEmail });

            console.log("✅ OTP resent successfully");
            set({ isLoading: false });
          } catch (error) {
            console.error("❌ Failed to resend OTP:", error);
            set({ isLoading: false });
            throw error;
          }
        },

        /* -------------------------
         * VERIFY OTP
         * ------------------------ */
        verifyOtp: async (otp) => {
          try {
            const { resetEmail } = get();
            if (!resetEmail) {
              throw new Error("No email set for OTP verification");
            }

            console.log("🧩 Verifying OTP...");

            await authService.verifyOtp({
              email: resetEmail,
              otp,
            });

            console.log("✅ OTP verified successfully");
          } catch (error) {
            console.error("❌ OTP verification failed:", error);
            throw error;
          }
        },

        /* -------------------------
         * VERIFY OTP
         * ------------------------ */
        verifyResetOtp: async (otp) => {
          try {
            const { resetEmail } = get();
            if (!resetEmail) {
              throw new Error("No email set for OTP verification");
            }

            console.log("🧩 Verifying OTP...");

            await authService.verifyResetOtp({
              email: resetEmail,
              otp,
            });

            console.log("✅ OTP verified successfully");
          } catch (error) {
            console.error("❌ OTP verification failed:", error);
            throw error;
          }
        },

        /* -------------------------
         * RESET PASSWORD
         * ------------------------ */
        resetPassword: async (password) => {
          try {
            const { resetEmail } = get();
            if (!resetEmail) {
              throw new Error("No email set for password reset");
            }

            console.log("🔑 Resetting password...");

            await authService.resetPassword({
              email: resetEmail,
              password,
            });

            console.log("✅ Password reset complete");
          } catch (error) {
            console.error("❌ Password reset failed:", error);
            throw error;
          }
        },

        /* -------------------------
         * UPDATE PROFILE
         * ------------------------ */
        updateProfile: async (name, avatar) => {
          try {
            console.log("👤 Updating profile:", name);

            const updatedUser = await authService.updateProfile({
              name,
              avatar,
            });

            set({
              user: updatedUser,
              isAuthenticated: true,
            });

            console.log("✅ Profile updated", updatedUser);
          } catch (error) {
            console.error("❌ Profile update failed:", error);
            throw error;
          }
        },

        /* -------------------------
         * LOGOUT
         * ------------------------ */
        logout: async () => {
          try {
            console.log("🚪 Logging out...");

            const device = getDeviceInfo();
            // Call logout API
            await authService.logout({ device });

            // Clear tokens
            clearAuthTokens();
            clearDeviceInfo();
            // Clear state
            set({
              user: null,
              isAuthenticated: false,
              resetEmail: null,
            });

            console.log("✅ Logged out successfully");
          } catch (error) {
            console.error("❌ Logout failed:", error);
            // Still clear local state even if API call fails
            clearAuthTokens();
            set({
              user: null,
              isAuthenticated: false,
              resetEmail: null,
            });
          }
        },
      }),
      {
        name: "auth-storage", // localStorage key
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    )
  )
);

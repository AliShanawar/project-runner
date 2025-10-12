import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

/* ----------------------------- Types ----------------------------- */

interface User {
  email: string;
  name?: string;
  avatar?: string | null;
  role?: "admin" | "employee";
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  otp: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  sendResetEmail: (email: string) => Promise<void>;
  resendOtp: () => Promise<void>;
  verifyOtp: (code: string) => Promise<void>;
  resetPassword: (password: string) => Promise<void>;
  updateProfile: (name: string, avatar: string | null) => Promise<void>;
  logout: () => void;
}

/* ----------------------------- Store ----------------------------- */

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isAuthenticated: false,
        otp: null,

        /* -------------------------
         * LOGIN
         * ------------------------ */
        login: async (email, password) => {
          console.log("🔐 Logging in with", email, password);
          await new Promise((res) => setTimeout(res, 1000));

          // Simple role mock based on email pattern
          const role = email.includes("admin") ? "admin" : "employee";

          set({
            user: { email, role },
            isAuthenticated: true,
          });
          console.log("✅ Login successful as", role);
        },

        /* -------------------------
         * SEND RESET EMAIL
         * ------------------------ */
        sendResetEmail: async (email) => {
          console.log("📩 Sending password reset email to", email);
          await new Promise((res) => setTimeout(res, 1200));

          set({
            user: { email },
            isAuthenticated: false,
          });
          console.log("✅ Reset email sent");
        },

        /* -------------------------
         * RESEND OTP
         * ------------------------ */
        resendOtp: async () => {
          console.log("📨 Resending OTP...");
          await new Promise((res) => setTimeout(res, 800));

          const newOtp = String(Math.floor(100000 + Math.random() * 900000));
          set({ otp: newOtp });
          console.log("✅ New OTP generated:", newOtp);
        },

        /* -------------------------
         * VERIFY OTP
         * ------------------------ */
        verifyOtp: async (code) => {
          console.log("🧩 Verifying OTP:", code);
          await new Promise((res) => setTimeout(res, 800));

          const { otp } = get();
          if (!otp) {
            console.log("⚠️ No OTP set (demo mode) → accepting any input");
            return;
          }

          if (code === otp) {
            console.log("✅ OTP verified successfully");
            return;
          }

          throw new Error("❌ Invalid OTP");
        },

        /* -------------------------
         * RESET PASSWORD
         * ------------------------ */
        resetPassword: async (password) => {
          console.log("🔑 Resetting password:", password);
          await new Promise((res) => setTimeout(res, 1000));
          console.log("✅ Password reset complete");
        },

        /* -------------------------
         * UPDATE PROFILE
         * ------------------------ */
        updateProfile: async (name, avatar) => {
          console.log("👤 Updating profile:", name);
          await new Promise((res) => setTimeout(res, 1000));

          const prevUser = get().user;

          // ✅ ensure email always exists
          const updatedUser: User = {
            email: prevUser?.email ?? "",
            name,
            avatar,
          };

          set({
            user: updatedUser,
            isAuthenticated: true,
          });

          console.log("✅ Profile updated", updatedUser);
        },

        /* -------------------------
         * LOGOUT
         * ------------------------ */
        logout: () => {
          set({
            user: null,
            isAuthenticated: false,
            otp: null,
          });
          console.log("🚪 Logged out");
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

import type { User } from "./user";

/* ==================== AUTH TYPES ==================== */

export interface DeviceInfo {
  id: string;
  deviceToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  device: DeviceInfo;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ResetPasswordRequest {
  email: string;
  password: string;
}

export interface UpdateProfileRequest {
  name: string;
  avatar?: string | null;
}

export interface LogoutRequest {
  device: DeviceInfo;
}

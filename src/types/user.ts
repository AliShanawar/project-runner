/* ==================== USER TYPES ==================== */

export interface User {
  _id: string;
  id?: string; // Keep for backward compatibility if needed
  email: string;
  name: string;
  profilePicture?: string | null;
  image?: string;
  role: "admin" | "employee" | "user" | "forklift" | "subConstructor" | "driver";
  verification?: {
    status: "pending" | "approved" | "rejected";
    verifiedAt?: string;
    verifiedBy?: {
      _id: string;
      name: string;
      email: string;
    };
  };
  siteId?: string | null;
  isBlocked?: boolean;
  isSocial?: boolean;
  verified?: boolean;
  isLoggedOut?: boolean;
  isNotification?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  __v?: number;
  // Add other fields from JSON as needed
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  recordsPerPage: number;
}

export interface UserResponse {
  users: User[];
  pagination: Pagination;
}

export interface UpdateUserRequest {
  name?: string;
  age?: number;
  country?: string;
  city?: string;
  interests?: string[];
  identity?: string;
  isNotification?: boolean;
  profilePicture?: string;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  password: string;
}

export interface UploadResponse {
  url: string;
  key: string;
}

export interface SignedUrlResponse {
  url: string;
  key: string;
}

export interface ApproveRejectRequest {
  action: "approved" | "rejected";
  reason: string;
}

export interface UserFilter {
  page?: number;
  limit?: number;
  role?: string;
  status?: string;
  search?: string;
}

export interface LegalDocument {
  content: string;
  title?: string;
}

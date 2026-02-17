/* ==================== H&S LOG TYPES ==================== */

export type HsLogStatus = "active" | "resolved" | "closed";
export type HsLogPriority = "low" | "medium" | "high" | "critical";
export type HsLogCategory =
  | "safety_incident"
  | "near_miss"
  | "hazard_identification"
  | "safety_observation"
  | "equipment_safety"
  | "environmental"
  | "other";
export type HsLogSeverity = "minor" | "moderate" | "major" | "severe";

export interface HsLogPicture {
  url: string;
  caption?: string;
  uploadedAt?: string;
  uploadedBy?: string;
}

export interface HsLogComment {
  comment: string;
  commentedBy?: string;
  commentedAt?: string;
}

export interface HsLogStatusHistory {
  status: string;
  changedBy?: string;
  changedAt?: string;
  notes?: string;
}

export interface HsLog {
  _id: string;
  title: string;
  precaution?: string;
  activeDate?: string;
  priority?: HsLogPriority;
  category?: HsLogCategory;
  severity?: HsLogSeverity;
  siteId?: string;
  createdBy?: string;
  assignedTo?: string;
  resolution?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  status?: HsLogStatus;
  pictures?: HsLogPicture[];
  comments?: HsLogComment[];
  statusHistory?: HsLogStatusHistory[];
  createdAt?: string;
  updatedAt?: string;
}

export interface HsLogPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface HsLogListResponse {
  hsLogs: HsLog[];
  pagination: HsLogPagination;
  site?: {
    _id: string;
    name?: string;
    location?: Record<string, unknown>;
  };
}

export interface HsLogQueryParams {
  page?: number;
  limit?: number;
  status?: HsLogStatus;
  siteId?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  priority?: HsLogPriority;
  category?: HsLogCategory;
  severity?: HsLogSeverity;
}

export interface CreateHsLogRequest {
  title: string;
  precaution: string;
  activeDate: string;
  siteId: string;
  priority?: HsLogPriority;
  category?: HsLogCategory;
  severity?: HsLogSeverity;
  assignedTo?: string;
  resolution?: string;
}

export interface UpdateHsLogRequest {
  title?: string;
  precaution?: string;
  activeDate?: string;
  priority?: HsLogPriority;
  category?: HsLogCategory;
  severity?: HsLogSeverity;
  assignedTo?: string;
  resolution?: string;
}

export interface UpdateHsLogStatusRequest {
  status: HsLogStatus;
  notes?: string;
}

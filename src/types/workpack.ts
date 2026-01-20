/* ==================== WORKPACK TYPES ==================== */

export type WorkpackStatus = "active" | "completed" | "cancelled";

export interface WorkpackUser {
  _id: string;
  name?: string;
  email?: string;
  role?: string;
  image?: string;
}

export interface Workpack {
  _id: string;
  title: string;
  description?: string;
  status: WorkpackStatus;
  createdBy: WorkpackUser;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  deletedBy?: string;
}

export interface WorkpackPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface WorkpackListResponse {
  workpacks: Workpack[];
  pagination: WorkpackPagination;
}

export interface WorkpackQueryParams {
  page?: number;
  limit?: number;
  status?: WorkpackStatus;
  createdBy?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface CreateWorkpackRequest {
  title: string;
  description?: string;
}

export interface UpdateWorkpackRequest extends Partial<CreateWorkpackRequest> {
  status?: WorkpackStatus;
}

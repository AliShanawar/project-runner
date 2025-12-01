/* ==================== INVENTORY TYPES ==================== */

export interface InventoryItem {
  _id: string;
  name: string;
  quantity: number;
  itemUnit?: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface CreateInventoryRequest {
  name: string;
  quantity: number;
  itemUnit?: string;
  image?: string;
}

export interface UpdateInventoryRequest {
  name?: string;
  quantity?: number;
  itemUnit?: string;
  image?: string;
}

export interface GetInventoryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface InventoryResponseData {
  inventory: InventoryItem[];
  pagination: PaginationData;
}

export interface InventoryResponse {
  success: boolean;
  message: string;
  status: number;
  timestamp: string;
  data: InventoryResponseData;
}

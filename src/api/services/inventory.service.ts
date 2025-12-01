import { api } from "@/api/client";
import { API_ENDPOINTS } from "@/api/config";
import type {
  InventoryItem,
  CreateInventoryRequest,
  UpdateInventoryRequest,
  GetInventoryParams,
  InventoryResponseData,
} from "@/types";

export const inventoryService = {
  /**
   * Get all inventory items with pagination and search
   */
  getAllItems: async (params?: GetInventoryParams) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);

    const queryString = queryParams.toString();
    const endpoint = queryString
      ? `${API_ENDPOINTS.INVENTORY.GET_ALL}?${queryString}`
      : API_ENDPOINTS.INVENTORY.GET_ALL;

    const response = await api.get<InventoryResponseData>(endpoint);
    // The API client already returns the data object
    return response;
  },

  /**
   * Create a new inventory item
   */
  createItem: async (data: CreateInventoryRequest) => {
    return api.post<InventoryItem>(API_ENDPOINTS.INVENTORY.CREATE, data);
  },

  /**
   * Update inventory item
   */
  updateItem: async (id: string, data: UpdateInventoryRequest) => {
    return api.put<InventoryItem>(API_ENDPOINTS.INVENTORY.UPDATE(id), data);
  },

  /**
   * Delete inventory item
   */
  deleteItem: async (id: string) => {
    return api.delete(API_ENDPOINTS.INVENTORY.DELETE(id));
  },
};

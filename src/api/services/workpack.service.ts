import { api } from "@/api/client";
import { API_ENDPOINTS } from "@/api/config";
import type {
  CreateWorkpackRequest,
  UpdateWorkpackRequest,
  Workpack,
  WorkpackListResponse,
  WorkpackQueryParams,
} from "@/types";

const buildQueryString = (params?: WorkpackQueryParams) => {
  if (!params) return "";

  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      queryParams.append(key, String(value));
    }
  });

  return queryParams.toString();
};

export const workpackService = {
  /**
   * Get all workpacks with optional filters
   */
  getAll: async (params?: WorkpackQueryParams) => {
    const queryString = buildQueryString(params);
    const endpoint = queryString
      ? `${API_ENDPOINTS.WORKPACK.GET_ALL}?${queryString}`
      : API_ENDPOINTS.WORKPACK.GET_ALL;
    return api.get<WorkpackListResponse>(endpoint);
  },

  /**
   * Get workpacks for a specific subcontractor
   */
  getBySubcontractor: async (
    subcontractorId: string,
    params?: WorkpackQueryParams
  ) => {
    const queryString = buildQueryString(params);
    const baseEndpoint =
      API_ENDPOINTS.WORKPACK.GET_BY_SUBCONTRACTOR(subcontractorId);
    const endpoint = queryString ? `${baseEndpoint}?${queryString}` : baseEndpoint;
    return api.get<WorkpackListResponse>(endpoint);
  },

  /**
   * Get a single workpack by ID
   */
  getById: async (workpackId: string) => {
    return api.get<Workpack>(API_ENDPOINTS.WORKPACK.GET_BY_ID(workpackId));
  },

  /**
   * Create a new workpack
   */
  create: async (data: CreateWorkpackRequest) => {
    return api.post<Workpack>(API_ENDPOINTS.WORKPACK.CREATE, data);
  },

  /**
   * Update an existing workpack
   */
  update: async (workpackId: string, data: UpdateWorkpackRequest) => {
    return api.put<Workpack>(API_ENDPOINTS.WORKPACK.UPDATE(workpackId), data);
  },

  /**
   * Delete a workpack (soft delete)
   */
  delete: async (workpackId: string) => {
    return api.delete(API_ENDPOINTS.WORKPACK.DELETE(workpackId));
  },
};

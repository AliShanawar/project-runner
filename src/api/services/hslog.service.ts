import { api } from "@/api/client";
import { API_ENDPOINTS } from "@/api/config";
import type {
  CreateHsLogRequest,
  HsLog,
  HsLogListResponse,
  HsLogQueryParams,
  UpdateHsLogRequest,
  UpdateHsLogStatusRequest,
} from "@/types";

const buildQuery = (params?: HsLogQueryParams) => {
  if (!params) return "";
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      queryParams.append(key, String(value));
    }
  });

  return queryParams.toString();
};

export const hslogService = {
  create: async (payload: CreateHsLogRequest) => {
    return api.post<HsLog>(API_ENDPOINTS.HS_LOG.CREATE, payload);
  },

  getAll: async (params?: HsLogQueryParams) => {
    const query = buildQuery(params);
    const endpoint = query
      ? `${API_ENDPOINTS.HS_LOG.GET_ALL}?${query}`
      : API_ENDPOINTS.HS_LOG.GET_ALL;
    return api.get<HsLogListResponse>(endpoint);
  },

  getBySite: async (siteId: string, params?: HsLogQueryParams) => {
    const query = buildQuery(params);
    const baseEndpoint = API_ENDPOINTS.HS_LOG.GET_BY_SITE(siteId);
    const endpoint = query ? `${baseEndpoint}?${query}` : baseEndpoint;
    return api.get<HsLogListResponse>(endpoint);
  },

  getById: async (hsLogId: string) => {
    return api.get<HsLog>(API_ENDPOINTS.HS_LOG.GET_BY_ID(hsLogId));
  },

  update: async (hsLogId: string, payload: UpdateHsLogRequest) => {
    return api.put<HsLog>(API_ENDPOINTS.HS_LOG.UPDATE(hsLogId), payload);
  },

  delete: async (hsLogId: string) => {
    return api.delete(API_ENDPOINTS.HS_LOG.DELETE(hsLogId));
  },

  updateStatus: async (hsLogId: string, payload: UpdateHsLogStatusRequest) => {
    return api.patch<HsLog>(API_ENDPOINTS.HS_LOG.UPDATE_STATUS(hsLogId), payload);
  },
};

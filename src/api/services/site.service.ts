import { api } from "@/api/client";
import { API_ENDPOINTS } from "@/api/config";
import type {
  Site,
  CreateSiteRequest,
  UpdateSiteRequest,
  GetSitesParams,
  GetSitesResponse,
  ApiSitesResponse,
} from "@/types";

export const siteService = {
  /**
   * Create a new site
   */
  createSite: async (data: CreateSiteRequest) => {
    return api.post<Site>(API_ENDPOINTS.SITE.CREATE, data);
  },

  /**
   * Get all sites with pagination and search
   */
  getAllSites: async (params?: GetSitesParams) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);

    const queryString = queryParams.toString();
    const endpoint = queryString
      ? `${API_ENDPOINTS.SITE.GET_ALL}?${queryString}`
      : API_ENDPOINTS.SITE.GET_ALL;

    return api.get<ApiSitesResponse>(endpoint);
  },

  /**
   * Get site by ID
   */
  getSiteById: async (id: string) => {
    return api.get<Site>(API_ENDPOINTS.SITE.GET_BY_ID(id));
  },

  /**
   * Update site
   */
  updateSite: async (id: string, data: UpdateSiteRequest) => {
    return api.put<Site>(API_ENDPOINTS.SITE.UPDATE(id), data);
  },

  /**
   * Delete site
   */
  deleteSite: async (id: string) => {
    return api.delete(API_ENDPOINTS.SITE.DELETE(id));
  },
};

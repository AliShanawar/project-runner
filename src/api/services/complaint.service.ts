import { api } from "@/api/client";
import { API_ENDPOINTS } from "@/api/config";
import type {
  ApiComplaintListResponse,
  ApiComplaintResponse,
  GetComplaintsParams,
} from "@/types";

export const complaintService = {
  getAllComplaints: async (params?: GetComplaintsParams) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.status) queryParams.append("status", params.status);
    if (params?.category) queryParams.append("category", params.category);
    if (params?.priority) queryParams.append("priority", params.priority);
    if (params?.userId) queryParams.append("userId", params.userId);
    if (params?.assignedTo) queryParams.append("assignedTo", params.assignedTo);
    if (params?.siteId) queryParams.append("siteId", params.siteId);

    const queryString = queryParams.toString();
    const endpoint = queryString
      ? `${API_ENDPOINTS.COMPLAINT.ADMIN_ALL}?${queryString}`
      : API_ENDPOINTS.COMPLAINT.ADMIN_ALL;

    return api.get<ApiComplaintListResponse>(endpoint);
  },

  getComplaintById: async (id: string) => {
    return api.get<ApiComplaintResponse>(API_ENDPOINTS.COMPLAINT.GET_BY_ID(id));
  },
};

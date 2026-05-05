import { api } from "@/api/client";
import { API_ENDPOINTS } from "@/api/config";
import type {
  ApiFeedbackListResponse,
  ApiFeedbackResponse,
  GetFeedbackParams,
} from "@/types";

const buildFeedbackQueryString = (params?: GetFeedbackParams) => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.status) queryParams.append("status", params.status);
  if (params?.userId) queryParams.append("userId", params.userId);
  return queryParams.toString();
};

export const feedbackService = {
  getAllFeedback: async (params?: GetFeedbackParams) => {
    const queryString = buildFeedbackQueryString(params);
    const endpoint = queryString
      ? `${API_ENDPOINTS.FEEDBACK.ADMIN_ALL}?${queryString}`
      : API_ENDPOINTS.FEEDBACK.ADMIN_ALL;

    return api.get<ApiFeedbackListResponse>(endpoint);
  },

  getFeedbackBySite: async (siteId: string, params?: GetFeedbackParams) => {
    const queryString = buildFeedbackQueryString(params);
    const endpoint = queryString
      ? `${API_ENDPOINTS.FEEDBACK.GET_BY_SITE(siteId)}?${queryString}`
      : API_ENDPOINTS.FEEDBACK.GET_BY_SITE(siteId);

    return api.get<ApiFeedbackListResponse>(endpoint);
  },

  getFeedbackById: async (id: string) => {
    return api.get<ApiFeedbackResponse>(API_ENDPOINTS.FEEDBACK.GET_BY_ID(id));
  },
};

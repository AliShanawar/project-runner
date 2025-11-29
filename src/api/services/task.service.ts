import { api } from "@/api/client";
import { API_ENDPOINTS } from "@/api/config";
import type { Task, TaskFilter, TasksResponse } from "@/types";

export const taskService = {
  /**
   * Get tasks by site ID
   */
  getTasksBySite: async (siteId: string, params?: TaskFilter) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          queryParams.append(key, String(value));
        }
      });
    }
    const queryString = queryParams.toString();
    const endpoint = queryString
      ? `${API_ENDPOINTS.TASK.GET_BY_SITE(siteId)}?${queryString}`
      : API_ENDPOINTS.TASK.GET_BY_SITE(siteId);
    return api.get<TasksResponse>(endpoint);
  },

  /**
   * Get task by ID
   */
  getTaskById: async (taskId: string) => {
    return api.get<Task>(API_ENDPOINTS.TASK.GET_BY_ID(taskId));
  },
};

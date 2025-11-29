import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { taskService } from "@/api/services/task.service";
import type { Task, TaskFilter, TaskPagination } from "@/types";

interface TaskState {
  isLoading: boolean;
  error: string | null;
  tasks: Task[];
  selectedTask: Task | null;
  pagination: TaskPagination | null;

  // Actions
  getTasksBySite: (siteId: string, params?: TaskFilter) => Promise<void>;
  getTaskById: (taskId: string) => Promise<void>;
  clearSelectedTask: () => void;
}

export const useTaskStore = create<TaskState>()(
  devtools((set) => ({
    isLoading: false,
    error: null,
    tasks: [],
    selectedTask: null,
    pagination: null,

    /* -------------------------
     * GET TASKS BY SITE
     * ------------------------ */
    getTasksBySite: async (siteId, params) => {
      try {
        set({ isLoading: true, error: null });
        const data = await taskService.getTasksBySite(siteId, params);
        set({ 
          tasks: data.tasks, 
          pagination: data.pagination, 
          isLoading: false 
        });
      } catch (error: any) {
        set({ isLoading: false, error: error.message });
        throw error;
      }
    },

    /* -------------------------
     * GET TASK BY ID
     * ------------------------ */
    getTaskById: async (taskId) => {
      try {
        set({ isLoading: true, error: null });
        const task = await taskService.getTaskById(taskId);
        set({ selectedTask: task, isLoading: false });
      } catch (error: any) {
        set({ isLoading: false, error: error.message });
        throw error;
      }
    },

    /* -------------------------
     * CLEAR SELECTED TASK
     * ------------------------ */
    clearSelectedTask: () => {
      set({ selectedTask: null });
    },
  }))
);

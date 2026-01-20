import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { workpackService } from "@/api/services/workpack.service";
import type {
  CreateWorkpackRequest,
  UpdateWorkpackRequest,
  Workpack,
  WorkpackPagination,
  WorkpackQueryParams,
} from "@/types";

interface WorkpackState {
  isLoading: boolean;
  error: string | null;
  workpacks: Workpack[];
  pagination: WorkpackPagination | null;
  selectedWorkpack: Workpack | null;
  isLoadingDetails: boolean;

  fetchWorkpacks: (params?: WorkpackQueryParams) => Promise<void>;
  fetchWorkpacksBySubcontractor: (
    subcontractorId: string,
    params?: WorkpackQueryParams
  ) => Promise<void>;
  fetchWorkpackById: (workpackId: string) => Promise<Workpack>;
  createWorkpack: (payload: CreateWorkpackRequest) => Promise<Workpack>;
  updateWorkpack: (
    workpackId: string,
    payload: UpdateWorkpackRequest
  ) => Promise<Workpack>;
  deleteWorkpack: (workpackId: string) => Promise<void>;
  clearSelected: () => void;
}

export const useWorkpackStore = create<WorkpackState>()(
  devtools((set) => ({
    isLoading: false,
    isLoadingDetails: false,
    error: null,
    workpacks: [],
    pagination: null,
    selectedWorkpack: null,

    /* -------------------------
     * FETCH WORKPACKS
     * ------------------------ */
    fetchWorkpacks: async (params) => {
      try {
        set({ isLoading: true, error: null });
        const data = await workpackService.getAll(params);
        set({
          workpacks: data.workpacks || [],
          pagination: data.pagination || null,
          isLoading: false,
        });
      } catch (error: any) {
        set({
          isLoading: false,
          error: error?.message || "Failed to load workpacks",
        });
        throw error;
      }
    },

    /* -------------------------
     * FETCH WORKPACKS BY SUBCONTRACTOR
     * ------------------------ */
    fetchWorkpacksBySubcontractor: async (subcontractorId, params) => {
      try {
        set({ isLoading: true, error: null });
        const data = await workpackService.getBySubcontractor(subcontractorId, params);
        set({
          workpacks: data.workpacks || [],
          pagination: data.pagination || null,
          isLoading: false,
        });
      } catch (error: any) {
        set({
          isLoading: false,
          error: error?.message || "Failed to load subcontractor workpacks",
        });
        throw error;
      }
    },

    /* -------------------------
     * FETCH SINGLE WORKPACK
     * ------------------------ */
    fetchWorkpackById: async (workpackId) => {
      try {
        set({ isLoadingDetails: true, error: null });
        const workpack = await workpackService.getById(workpackId);
        set({ selectedWorkpack: workpack, isLoadingDetails: false });
        return workpack;
      } catch (error: any) {
        set({
          isLoadingDetails: false,
          error: error?.message || "Failed to load workpack",
        });
        throw error;
      }
    },

    /* -------------------------
     * CREATE WORKPACK
     * ------------------------ */
    createWorkpack: async (payload) => {
      try {
        set({ isLoading: true, error: null });
        const workpack = await workpackService.create(payload);
        set((state) => ({
          workpacks: [workpack, ...state.workpacks],
          selectedWorkpack: workpack,
          isLoading: false,
        }));
        return workpack;
      } catch (error: any) {
        set({
          isLoading: false,
          error: error?.message || "Failed to create workpack",
        });
        throw error;
      }
    },

    /* -------------------------
     * UPDATE WORKPACK
     * ------------------------ */
    updateWorkpack: async (workpackId, payload) => {
      try {
        set({ isLoading: true, error: null });
        const updatedWorkpack = await workpackService.update(workpackId, payload);
        set((state) => ({
          workpacks: state.workpacks.map((wp) =>
            wp._id === updatedWorkpack._id ? { ...wp, ...updatedWorkpack } : wp
          ),
          selectedWorkpack:
            state.selectedWorkpack?._id === updatedWorkpack._id
              ? { ...state.selectedWorkpack, ...updatedWorkpack }
              : state.selectedWorkpack,
          isLoading: false,
        }));
        return updatedWorkpack;
      } catch (error: any) {
        set({
          isLoading: false,
          error: error?.message || "Failed to update workpack",
        });
        throw error;
      }
    },

    /* -------------------------
     * DELETE WORKPACK
     * ------------------------ */
    deleteWorkpack: async (workpackId) => {
      try {
        set({ isLoading: true, error: null });
        await workpackService.delete(workpackId);
        set((state) => ({
          workpacks: state.workpacks.filter((wp) => wp._id !== workpackId),
          selectedWorkpack:
            state.selectedWorkpack?._id === workpackId ? null : state.selectedWorkpack,
          isLoading: false,
        }));
      } catch (error: any) {
        set({
          isLoading: false,
          error: error?.message || "Failed to delete workpack",
        });
        throw error;
      }
    },

    /* -------------------------
     * CLEAR SELECTED WORKPACK
     * ------------------------ */
    clearSelected: () => set({ selectedWorkpack: null }),
  }))
);

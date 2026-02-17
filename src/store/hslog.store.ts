import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { hslogService } from "@/api/services/hslog.service";
import type {
  CreateHsLogRequest,
  HsLog,
  HsLogPagination,
  HsLogQueryParams,
  HsLogStatus,
  UpdateHsLogRequest,
} from "@/types";

interface HsLogState {
  hsLogs: HsLog[];
  pagination: HsLogPagination | null;
  selectedHsLog: HsLog | null;
  isLoading: boolean;
  isLoadingDetails: boolean;
  error: string | null;

  fetchHsLogs: (params?: HsLogQueryParams) => Promise<void>;
  fetchHsLogsBySite: (siteId: string, params?: HsLogQueryParams) => Promise<void>;
  fetchHsLogById: (hsLogId: string) => Promise<HsLog>;
  createHsLog: (payload: CreateHsLogRequest) => Promise<HsLog>;
  updateHsLog: (hsLogId: string, payload: UpdateHsLogRequest) => Promise<HsLog>;
  updateHsLogStatus: (hsLogId: string, status: HsLogStatus, notes?: string) => Promise<HsLog>;
  deleteHsLog: (hsLogId: string) => Promise<void>;
  clearSelected: () => void;
}

export const useHsLogStore = create<HsLogState>()(
  devtools((set) => ({
    hsLogs: [],
    pagination: null,
    selectedHsLog: null,
    isLoading: false,
    isLoadingDetails: false,
    error: null,

    fetchHsLogs: async (params) => {
      try {
        set({ isLoading: true, error: null });
        const data = await hslogService.getAll(params);
        set({
          hsLogs: data.hsLogs || [],
          pagination: data.pagination || null,
          isLoading: false,
        });
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Failed to load H&S logs";
        set({ isLoading: false, error: message });
        throw error;
      }
    },

    fetchHsLogsBySite: async (siteId, params) => {
      try {
        set({ isLoading: true, error: null });
        const data = await hslogService.getBySite(siteId, params);
        set({
          hsLogs: data.hsLogs || [],
          pagination: data.pagination || null,
          isLoading: false,
        });
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Failed to load site H&S logs";
        set({ isLoading: false, error: message });
        throw error;
      }
    },

    fetchHsLogById: async (hsLogId) => {
      try {
        set({ isLoadingDetails: true, error: null });
        const hsLog = await hslogService.getById(hsLogId);
        set({ selectedHsLog: hsLog, isLoadingDetails: false });
        return hsLog;
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Failed to load H&S log";
        set({ isLoadingDetails: false, error: message });
        throw error;
      }
    },

    createHsLog: async (payload) => {
      try {
        set({ isLoading: true, error: null });
        const hsLog = await hslogService.create(payload);
        set((state) => ({
          hsLogs: [hsLog, ...state.hsLogs],
          selectedHsLog: hsLog,
          isLoading: false,
        }));
        return hsLog;
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Failed to create H&S log";
        set({ isLoading: false, error: message });
        throw error;
      }
    },

    updateHsLog: async (hsLogId, payload) => {
      try {
        set({ isLoading: true, error: null });
        const updated = await hslogService.update(hsLogId, payload);
        set((state) => ({
          hsLogs: state.hsLogs.map((item) =>
            item._id === updated._id ? { ...item, ...updated } : item
          ),
          selectedHsLog:
            state.selectedHsLog?._id === updated._id
              ? { ...state.selectedHsLog, ...updated }
              : state.selectedHsLog,
          isLoading: false,
        }));
        return updated;
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Failed to update H&S log";
        set({ isLoading: false, error: message });
        throw error;
      }
    },

    updateHsLogStatus: async (hsLogId, status, notes) => {
      try {
        set({ isLoading: true, error: null });
        const updated = await hslogService.updateStatus(hsLogId, { status, notes });
        set((state) => ({
          hsLogs: state.hsLogs.map((item) =>
            item._id === updated._id ? { ...item, ...updated } : item
          ),
          selectedHsLog:
            state.selectedHsLog?._id === updated._id
              ? { ...state.selectedHsLog, ...updated }
              : state.selectedHsLog,
          isLoading: false,
        }));
        return updated;
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to update H&S log status";
        set({ isLoading: false, error: message });
        throw error;
      }
    },

    deleteHsLog: async (hsLogId) => {
      try {
        set({ isLoading: true, error: null });
        await hslogService.delete(hsLogId);
        set((state) => ({
          hsLogs: state.hsLogs.filter((item) => item._id !== hsLogId),
          selectedHsLog:
            state.selectedHsLog?._id === hsLogId ? null : state.selectedHsLog,
          isLoading: false,
        }));
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Failed to delete H&S log";
        set({ isLoading: false, error: message });
        throw error;
      }
    },

    clearSelected: () => set({ selectedHsLog: null }),
  }))
);

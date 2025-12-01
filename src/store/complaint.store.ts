import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { complaintService } from "@/api/services/complaint.service";
import type {
  ApiComplaintListResponse,
  Complaint,
  GetComplaintsParams,
} from "@/types";

interface ComplaintState extends ApiComplaintListResponse {
  currentComplaint: Complaint | null;
  isLoading: boolean;
  error: string | null;
  fetchComplaints: (params?: GetComplaintsParams) => Promise<void>;
  fetchComplaintById: (id: string) => Promise<Complaint>;
  clearCurrent: () => void;
}

export const useComplaintStore = create<ComplaintState>()(
  devtools((set) => ({
    complaints: [],
    pagination: {
      currentPage: 1,
      totalItems: 0,
      itemsPerPage: 10,
      totalPages: 0,
    },
    currentComplaint: null,
    isLoading: false,
    error: null,

    fetchComplaints: async (params) => {
      try {
        set({ isLoading: true, error: null });
        const response = await complaintService.getAllComplaints(params);
        const totalItems =
          response?.pagination?.totalItems ?? response.complains?.length ?? 0;
        const itemsPerPage =
          response?.pagination?.itemsPerPage ?? params?.limit ?? 10;
        const currentPage =
          response?.pagination?.currentPage ?? params?.page ?? 1;
        const totalPages =
          response?.pagination?.totalPages ??
          Math.max(1, Math.ceil(totalItems / itemsPerPage));

        set({
          complains: response.complains || [],
          pagination: {
            currentPage,
            itemsPerPage,
            totalItems,
            totalPages,
          },
          isLoading: false,
        });
      } catch (error: any) {
        set({
          isLoading: false,
          error: error?.message || "Failed to load complaints",
        });
        throw error;
      }
    },

    fetchComplaintById: async (id) => {
      try {
        set({ isLoading: true, error: null });
        const response = await complaintService.getComplaintById(id);
        console.log("response  data ", response);
        set({ currentComplaint: response, isLoading: false });
        return response;
      } catch (error: any) {
        set({
          isLoading: false,
          error: error?.message || "Failed to load complaint",
        });
        throw error;
      }
    },

    clearCurrent: () => set({ currentComplaint: null }),
  }))
);

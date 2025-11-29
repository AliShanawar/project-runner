import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { feedbackService } from "@/api/services/feedback.service";
import type {
  ApiFeedbackListResponse,
  Feedback,
  GetFeedbackParams,
} from "@/types";

interface FeedbackState extends ApiFeedbackListResponse {
  currentFeedback: Feedback | null;
  isLoading: boolean;
  error: string | null;
  fetchFeedback: (params?: GetFeedbackParams) => Promise<void>;
  fetchFeedbackById: (id: string) => Promise<Feedback>;
  clearCurrent: () => void;
}

export const useFeedbackStore = create<FeedbackState>()(
  devtools((set) => ({
    feedbacks: [],
    pagination: {
      currentPage: 1,
      totalItems: 0,
      itemsPerPage: 10,
      totalPages: 0,
    },
    currentFeedback: null,
    isLoading: false,
    error: null,

    fetchFeedback: async (params) => {
      try {
        set({ isLoading: true, error: null });
        const response = await feedbackService.getAllFeedback(params);
        const totalItems =
          response?.pagination?.totalItems ?? response.feedback?.length ?? 0;
        const itemsPerPage =
          response?.pagination?.itemsPerPage ?? params?.limit ?? 10;
        const currentPage =
          response?.pagination?.currentPage ?? params?.page ?? 1;
        const totalPages =
          response?.pagination?.totalPages ??
          Math.max(1, Math.ceil(totalItems / itemsPerPage));

        set({
          feedbacks: response.feedback || [],
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
          error: error?.message || "Failed to load feedback",
        });
        throw error;
      }
    },

    fetchFeedbackById: async (id) => {
      try {
        set({ isLoading: true, error: null });
        const response = await feedbackService.getFeedbackById(id);
        set({ currentFeedback: response, isLoading: false });
        return response.feedback;
      } catch (error: any) {
        set({
          isLoading: false,
          error: error?.message || "Failed to load feedback",
        });
        throw error;
      }
    },

    clearCurrent: () => set({ currentFeedback: null }),
  }))
);

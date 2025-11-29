import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { siteService } from "@/api/services/site.service";
import type {
  Site,
  CreateSiteRequest,
  UpdateSiteRequest,
  GetSitesParams,
} from "@/types";

interface SiteState {
  sites: Site[];
  currentSite: Site | null;
  isLoading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;

  // Actions
  createSite: (data: CreateSiteRequest) => Promise<Site>;
  getAllSites: (params?: GetSitesParams) => Promise<void>;
  getSiteById: (id: string) => Promise<Site>;
  updateSite: (id: string, data: UpdateSiteRequest) => Promise<Site>;
  deleteSite: (id: string) => Promise<void>;
  setCurrentSite: (site: Site | null) => void;
}

export const useSiteStore = create<SiteState>()(
  devtools((set, get) => ({
    sites: [],
    currentSite: null,
    isLoading: false,
    error: null,
    total: 0,
    page: 1,
    limit: 10,

    /* -------------------------
     * CREATE SITE
     * ------------------------ */
    createSite: async (data) => {
      try {
        set({ isLoading: true, error: null });
        const newSite = await siteService.createSite(data);
        
        // Add new site to the list
        set((state) => ({
          sites: [newSite, ...state.sites],
          isLoading: false,
        }));
        
        return newSite;
      } catch (error: any) {
        set({ isLoading: false, error: error.message });
        throw error;
      }
    },

    /* -------------------------
     * GET ALL SITES
     * ------------------------ */
    getAllSites: async (params) => {
      try {
        set({ isLoading: true, error: null });
        const response = await siteService.getAllSites(params);
        
        set({
          sites: response.sites,
          total: response.pagination?.totalItems,
          page: response.pagination?.currentPage,
          limit: response.pagination?.itemsPerPage,
          isLoading: false,
        });
      } catch (error: any) {
        set({ isLoading: false, error: error.message });
        throw error;
      }
    },

    /* -------------------------
     * GET SITE BY ID
     * ------------------------ */
    getSiteById: async (id) => {
      try {
        set({ isLoading: true, error: null });
        const site = await siteService.getSiteById(id);
        set({ currentSite: site, isLoading: false });
        return site;
      } catch (error: any) {
        set({ isLoading: false, error: error.message });
        throw error;
      }
    },

    /* -------------------------
     * UPDATE SITE
     * ------------------------ */
    updateSite: async (id, data) => {
      try {
        set({ isLoading: true, error: null });
        const updatedSite = await siteService.updateSite(id, data);

        // Update site in the list
        set((state) => ({
          sites: state.sites.map((site) =>
            site._id === id ? updatedSite : site
          ),
          currentSite: state.currentSite?._id === id ? updatedSite : state.currentSite,
          isLoading: false,
        }));

        return updatedSite;
      } catch (error: any) {
        set({ isLoading: false, error: error.message });
        throw error;
      }
    },

    /* -------------------------
     * DELETE SITE
     * ------------------------ */
    deleteSite: async (id) => {
      try {
        set({ isLoading: true, error: null });
        await siteService.deleteSite(id);

        // Remove site from the list
        set((state) => ({
          sites: state.sites.filter((site) => site._id !== id),
          currentSite: state.currentSite?._id === id ? null : state.currentSite,
          isLoading: false,
        }));
      } catch (error: any) {
        set({ isLoading: false, error: error.message });
        throw error;
      }
    },

    /* -------------------------
     * SET CURRENT SITE
     * ------------------------ */
    setCurrentSite: (site) => {
      set({ currentSite: site });
    },
  }))
);

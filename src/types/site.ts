/* ==================== SITE TYPES ==================== */

export interface SiteLocation {
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface EmployeeCounts {
  forklift: number;
  subConstructor?: number; // Keep for backward compatibility
  subscontructor?: number; // Backend sends this (typo in backend)
}

export interface CreatedBy {
  _id: string;
  name: string;
  email: string;
}

export interface Site {
  _id: string;
  id?: string; // For backward compatibility
  name: string;
  location: SiteLocation;
  siteMap?: string;
  status?: string; // Optional since backend might not send it
  createdBy: CreatedBy;
  employeeCounts?: EmployeeCounts; // Optional since backend might not send it
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface CreateSiteRequest {
  name: string;
  location: SiteLocation;
  siteMap?: string;
}

export interface UpdateSiteRequest {
  name?: string;
  location?: SiteLocation;
  siteMap?: string;
}

export interface GetSitesParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface GetSitesResponse {
  data: {
    sites: Site[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface ApiSitesResponse {
  success: boolean;
  message: string;
  status: number;
  timestamp: string;

  sites: Site[];
  pagination: PaginationInfo;
}

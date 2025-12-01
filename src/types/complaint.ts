import type { PaginationInfo } from "./site";

export type ComplaintStatus =
  | "pending"
  | "in-progress"
  | "resolved"
  | "closed"
  | string;
export type ComplaintCategory =
  | "construction"
  | "safety"
  | "quality"
  | "payment"
  | "communication"
  | "other"
  | string;
export type ComplaintPriority = "low" | "medium" | "high" | "urgent" | string;

export interface ComplaintUser {
  _id: string;
  name?: string;
  email?: string;
}

export interface ComplaintSite {
  _id: string;
  name?: string;
}

export interface Complaint {
  _id: string;
  id?: string;
  title: string;
  description: string;
  status: ComplaintStatus;
  category?: ComplaintCategory;
  priority?: ComplaintPriority;
  site?: ComplaintSite;
  user?: ComplaintUser;
  assignedTo?: ComplaintUser;
  media?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface GetComplaintsParams {
  page?: number;
  limit?: number;
  status?: ComplaintStatus;
  category?: ComplaintCategory;
  priority?: ComplaintPriority;
  userId?: string;
  assignedTo?: string;
  siteId?: string;
}

export interface ApiComplaintListResponse {
  complains: Complaint[];
  pagination: PaginationInfo;
}

export type ApiComplaintResponse = Complaint;

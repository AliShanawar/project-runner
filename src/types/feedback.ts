import type { PaginationInfo } from "./site";

export type FeedbackStatus = "active" | "deleted" | string;

export interface FeedbackUser {
  _id: string;
  name?: string;
  email?: string;
  avatar?: string;
}

export interface FeedbackSite {
  _id: string;
  name?: string;
}

export interface Feedback {
  _id: string;
  id?: string;
  title: string;
  description: string;
  status: FeedbackStatus;
  user?: FeedbackUser;
  site?: FeedbackSite;
  media?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface GetFeedbackParams {
  page?: number;
  limit?: number;
  status?: FeedbackStatus;
  userId?: string;
  siteId?: string;
}

export interface ApiFeedbackListResponse {
  feedback: Feedback[];
  pagination: PaginationInfo;
}

export interface ApiFeedbackResponse {
  feedback: Feedback;
}

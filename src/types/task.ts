/* ==================== TASK TYPES ==================== */

export interface StaffMember {
  _id: string;
  name: string;
  email?: string;
  profilePicture?: string;
}

export interface ItemToDeliver {
  name: string;
  quantity: number;
  unit: string;
  icon?: string;
}

export interface MaterialLocation {
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface Task {
  _id: string;
  id?: string; // For backward compatibility
  title: string;
  description?: string;
  date: string;
  time: string;
  status: "pending" | "started" | "material_picked" | "completed" | "cancelled";
  taskType: "instant" | "scheduled";
  priority?: "low" | "medium" | "high" | "urgent";
  assignedBy?: StaffMember;
  assignedTo?: StaffMember;
  itemsToDeliver?: ItemToDeliver[];
  note?: string;
  images?: string[];
  materialLocation?: MaterialLocation;
  geooffication?: MaterialLocation; // Backend typo
  siteId: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string; // Keep for backward compatibility
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority: "low" | "medium" | "high" | "urgent";
  assignedTo?: string[];
  siteId?: string;
  dueDate?: string;
}

export interface UpdateTaskRequest extends Partial<CreateTaskRequest> {
  status?: "pending" | "started" | "material_picked" | "completed" | "cancelled";
}

export interface TaskFilter {
  page?: number;
  limit?: number;
  status?: string;
  taskType?: string;
  priority?: string;
}

export interface TaskPagination {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  recordsPerPage: number;
}

export interface TasksResponse {
  tasks: Task[];
  pagination: TaskPagination;
}

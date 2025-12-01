/* ==================== EMPLOYEE TYPES ==================== */

export type EmployeeRole =
  | "builder"
  | "forklift"
  | "subConstructor"
  | "admin"
  | "superAdmin"
  | "user";

export interface SiteEmployee {
  _id: string;
  name: string;
  email: string;
  role: EmployeeRole;
  avatar?: string | null;
}

export interface SiteEmployeesResponse {
  employees: SiteEmployee[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface GetSiteEmployeesParams {
  page?: number;
  limit?: number;
  role?: EmployeeRole;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: "admin" | "employee";
  avatar?: string | null;
  status: "active" | "inactive";
  createdAt: string;
}

export interface CreateEmployeeRequest {
  name: string;
  email: string;
  role: Employee["role"];
  avatar?: string | null;
}

export interface UpdateEmployeeRequest extends Partial<CreateEmployeeRequest> {
  status?: Employee["status"];
}

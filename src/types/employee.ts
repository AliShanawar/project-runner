/* ==================== EMPLOYEE TYPES ==================== */

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

import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { AlertCircle, Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { siteService } from "@/api/services/site.service";
import type { SiteEmployee, EmployeeRole } from "@/types";
import { toast } from "sonner";

const SiteMembers = () => {
  const { siteId } = useParams();
  const [employees, setEmployees] = useState<SiteEmployee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<EmployeeRole | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [page] = useState(1);
  const [limit] = useState(10);

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [employees, searchTerm]);

  useEffect(() => {
    if (!siteId) return;

    const fetchEmployees = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await siteService.getSiteEmployees(siteId, {
          page,
          limit,
          role: role !== "all" ? role : undefined,
        });
        setEmployees(response.employees || []);
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load members";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, [siteId, page, limit, role]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Active Members</h1>
        <p className="text-gray-500 text-sm">
          Manage and track all team members assigned to this site.
        </p>
      </div>

      {/* Filter + Search */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm">
        <div className="flex flex-wrap items-center gap-4 border-b border-gray-100 px-6 py-4">
          <Select value={role} onValueChange={(value) => setRole(value as EmployeeRole | "all")}>
            <SelectTrigger className="min-w-[140px] rounded-lg">
              <SelectValue placeholder="All Members" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Members</SelectItem>
              <SelectItem value="forklift">Forklift</SelectItem>
              <SelectItem value="builder">Builder</SelectItem>
              <SelectItem value="subConstructor">Subcontractor</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative w-full max-w-xs flex-1 sm:flex-none">
            <Search className="text-gray-400 absolute left-3 top-1/2 size-4 -translate-y-1/2" />
            <Input
              placeholder="Search members"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 rounded-lg border-gray-200 focus-visible:ring-[#8A5BD5]"
            />
          </div>
        </div>

        {/* Table */}
        <div className="px-6 py-4">
          {isLoading && employees.length === 0 ? (
            <div className="flex items-center gap-3 text-gray-600 py-8">
              <Loader2 className="size-5 animate-spin text-[#8A5BD5]" />
              Loading members...
            </div>
          ) : error ? (
            <div className="flex items-center gap-3 text-destructive py-8">
              <AlertCircle className="size-5" />
              {error}
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="text-gray-500 py-8">
              No members found for this site.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 border-b border-gray-100">
                  <TableHead className="text-gray-500 font-medium">
                    Name
                  </TableHead>
                  <TableHead className="text-gray-500 font-medium">
                    Email
                  </TableHead>
                  <TableHead className="text-gray-500 font-medium">
                    Role
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((emp) => (
                  <TableRow
                    key={emp._id}
                    className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                  >
                    <TableCell className="flex items-center py-3 gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center text-sm font-semibold">
                        {(emp.name || "U").charAt(0).toUpperCase()}
                      </div>
                      {emp.name}
                    </TableCell>
                    <TableCell>{emp.email}</TableCell>
                    <TableCell className="capitalize">{emp.role}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
};

export default SiteMembers;

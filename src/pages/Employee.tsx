import { useState, useEffect } from "react";
import { AlertCircle, Loader2, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { userService } from "@/api/services/user.service";
import { siteService } from "@/api/services/site.service";
import { PaginationControls } from "@/components/PaginationControls";
import { toast } from "sonner";
import type { User, Site } from "@/types";
import { showSuccessToast } from "@/lib/utils";

const displayValue = (value?: string | null) => {
  const text = value?.trim();
  return text || "N/A";
};

const getSiteIdValue = (siteId: User["siteId"]) => {
  if (!siteId) return "";
  return typeof siteId === "string" ? siteId : siteId._id;
};

const getSiteName = (siteId: User["siteId"]) => {
  if (!siteId || typeof siteId === "string") return "N/A";
  return displayValue(siteId.name);
};

export default function Employees() {
  const [employees, setEmployees] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    recordsPerPage: 10,
  });

  // Dialog states
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [changeSiteDialogOpen, setChangeSiteDialogOpen] = useState(false);
  const [sites, setSites] = useState<Site[]>([]);
  const [selectedSite, setSelectedSite] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isChangingSite, setIsChangingSite] = useState(false);
  const [sitesLoading, setSitesLoading] = useState(false);

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await userService.getAllUsers({
        page,
        limit,
        role: filter !== "all" ? filter : undefined,
        search: debouncedSearchQuery || undefined,
      });
      setEmployees(response.users || []);
      if (response.pagination) {
        setPagination(response.pagination);
      }
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load employees";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSites = async () => {
    try {
      setSitesLoading(true);
      const response = await siteService.getAllSites();
      setSites(response.sites || []);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || "Failed to load sites";
      toast.error(errorMessage);
    } finally {
      setSitesLoading(false);
    }
  };

  const openDeleteDialog = (employee: User) => {
    setSelectedEmployee(employee);
    setDeleteDialogOpen(true);
  };

  const openChangeSiteDialog = (employee: User) => {
    setSelectedEmployee(employee);
    setSelectedSite(getSiteIdValue(employee.siteId));
    setChangeSiteDialogOpen(true);
    fetchSites();
  };

  const closeDialogs = () => {
    setDeleteDialogOpen(false);
    setChangeSiteDialogOpen(false);
    setSelectedEmployee(null);
    setSelectedSite("");
  };

  const handleDeleteEmployee = async () => {
    if (!selectedEmployee) return;

    setIsDeleting(true);
    try {
      await userService.deleteUser(selectedEmployee._id);
      setEmployees(employees.filter((emp) => emp._id !== selectedEmployee._id));
      showSuccessToast("Employee deleted successfully");
      closeDialogs();
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || "Failed to delete employee";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleChangeSite = async () => {
    if (!selectedEmployee || !selectedSite) {
      toast.error("Please select a site");
      return;
    }

    setIsChangingSite(true);
    try {
      const response = await userService.assignUserSite(
        selectedEmployee._id,
        selectedSite,
      );
      const updatedEmployee = response.user;
      const selectedSiteDetails = sites.find((site) => site._id === selectedSite);
      setEmployees(
        employees.map((emp) =>
          emp._id === selectedEmployee._id
            ? {
                ...emp,
                ...updatedEmployee,
                siteId:
                  updatedEmployee?.siteId ||
                  selectedSiteDetails || {
                    _id: selectedSite,
                    name: "N/A",
                  },
              }
            : emp,
        ),
      );
      showSuccessToast("Site changed successfully");
      closeDialogs();
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || "Failed to change site";
      toast.error(errorMessage);
    } finally {
      setIsChangingSite(false);
    }
  };

  // Debounce search input to avoid firing API requests on every keystroke
  useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedSearchQuery(searchInput);
      setPage(1);
    }, 400);

    return () => clearTimeout(handle);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [limit, filter]);

  useEffect(() => {
    fetchEmployees();
  }, [page, limit, filter, debouncedSearchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Employees</h1>
        <p className="text-muted-foreground text-sm">
          Manage and organize your employees across all sites.
        </p>
      </div>

      {/* Filter + Search */}
      <div className="bg-white border border-border rounded-2xl shadow-sm">
        <div className="flex flex-wrap items-center gap-4 border-b border-gray-100 px-6 py-4">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="min-w-[160px] rounded-lg">
              <SelectValue placeholder="All Employees" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Employees</SelectItem>
              <SelectItem value="forklift">Forklift</SelectItem>
              <SelectItem value="subConstructor">Subcontractor</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative w-full max-w-xs flex-1 sm:flex-none">
            <Search className="text-gray-400 absolute left-3 top-1/2 size-4 -translate-y-1/2" />
            <Input
              placeholder="Search by name or email"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9 rounded-lg border-gray-200 focus-visible:ring-[#8A5BD5]"
            />
          </div>
        </div>

        {/* Table */}
        <div className="px-6 py-4">
          {isLoading && employees.length === 0 ? (
            <div className="flex items-center gap-3 text-gray-600 py-8">
              <Loader2 className="size-5 animate-spin text-[#8A5BD5]" />
              Loading employees...
            </div>
          ) : error ? (
            <div className="flex items-center gap-3 text-destructive py-8">
              <AlertCircle className="size-5" />
              {error}
            </div>
          ) : employees.length === 0 ? (
            <div className="text-gray-500 py-8">No employees found.</div>
          ) : (
            <Table className="min-w-[1180px] table-fixed bg-transparent">
              <TableHeader>
                <TableRow className="bg-gray-50 border-b border-gray-100">
                  <TableHead className="w-12 text-gray-500 font-medium py-3">
                    #
                  </TableHead>
                  <TableHead className="w-[220px] text-gray-500 font-medium py-3">
                    Name
                  </TableHead>
                  <TableHead className="w-[310px] text-gray-500 font-medium py-3">
                    Email
                  </TableHead>
                  <TableHead className="w-[160px] text-gray-500 font-medium py-3">
                    Role
                  </TableHead>
                  <TableHead className="w-[180px] text-gray-500 font-medium py-3">
                    Site
                  </TableHead>
                  <TableHead className="w-[130px] text-gray-500 font-medium py-3">
                    Status
                  </TableHead>
                  <TableHead className="w-[168px] text-gray-500 font-medium py-3 text-right">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {employees.map((emp, index) => (
                  <TableRow
                    key={emp._id}
                    className="border-b border-gray-100 hover:bg-gray-50/40 transition-colors"
                  >
                    <TableCell className="py-4 text-gray-800 font-medium">
                      {(pagination.currentPage - 1) * limit + index + 1}
                    </TableCell>
                    <TableCell className="text-gray-800 font-medium">
                      <div className="flex min-w-0 items-center gap-3">
                        <img
                          src={
                            emp.image ||
                            emp.profilePicture ||
                            "https://icon-library.com/images/default-profile-icon/default-profile-icon-6.jpg"
                          }
                          alt={displayValue(emp.name)}
                          className="h-8 w-8 shrink-0 rounded-full object-cover"
                        />
                        <span className="min-w-0 truncate">
                          {displayValue(emp.name)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="truncate text-gray-700">
                      {displayValue(emp.email)}
                    </TableCell>
                    <TableCell className="truncate text-gray-700 capitalize">
                      {displayValue(emp.role)}
                    </TableCell>
                    <TableCell className="truncate text-gray-700">
                      {getSiteName(emp.siteId)}
                    </TableCell>
                    <TableCell className="text-gray-700">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          emp.isBlocked
                            ? "bg-red-100 text-red-700"
                            : emp.verification?.status === "approved"
                              ? "bg-green-100 text-green-700"
                              : emp.verification?.status === "rejected"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {emp.isBlocked
                          ? "Blocked"
                          : emp.verification?.status === "approved"
                            ? "Approved"
                            : emp.verification?.status === "rejected"
                              ? "Rejected"
                              : "Pending"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2 text-sm font-medium">
                        <button
                          onClick={() => openChangeSiteDialog(emp)}
                          className="text-[#8A5BD5] hover:text-[#7A4EC3] transition-colors cursor-pointer"
                        >
                          Change Site
                        </button>
                        <button
                          onClick={() => openDeleteDialog(emp)}
                          className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-red-500 transition-colors hover:bg-red-50 hover:text-red-600"
                          aria-label={`Delete ${displayValue(emp.name)}`}
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Pagination */}
        {employees.length > 0 && (
          <PaginationControls
            currentPage={pagination.currentPage || page}
            totalPages={pagination.totalPages || 1}
            onPageChange={setPage}
            pageSize={limit}
            onPageSizeChange={setLimit}
            pageSizeOptions={[5, 10, 20, 50]}
            totalItems={pagination.totalRecords || employees.length}
            className="border-t border-gray-100 px-6 py-4"
            label="Rows"
          />
        )}
      </div>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={closeDialogs}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Employee</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedEmployee?.name}? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeDialogs}
              className="border-[#8A5BD5] text-[#8A5BD5]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteEmployee}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Employee"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Site Dialog */}
      <Dialog open={changeSiteDialogOpen} onOpenChange={closeDialogs}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Change Site</DialogTitle>
            <DialogDescription>
              Select a new site for {selectedEmployee?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Site</label>
              <Select value={selectedSite} onValueChange={setSelectedSite}>
                <SelectTrigger className="mt-1 cursor-pointer">
                  <SelectValue placeholder="Select a site" />
                </SelectTrigger>
                <SelectContent>
                  {sitesLoading ? (
                    <div className="p-2 text-center text-sm text-gray-500">
                      Loading sites...
                    </div>
                  ) : sites.length === 0 ? (
                    <div className="p-2 text-center text-sm text-gray-500">
                      No sites available
                    </div>
                  ) : (
                    sites.map((site) => (
                      <SelectItem key={site._id} value={site._id}>
                        {site.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeDialogs}
              className="border-[#8A5BD5] text-[#8A5BD5]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleChangeSite}
              disabled={isChangingSite}
              className="bg-[#8A5BD5] hover:bg-[#7A4EC3]"
            >
              {isChangingSite ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Changing...
                </>
              ) : (
                "Change Site"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}

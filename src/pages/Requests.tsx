import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { Search, Loader2 } from "lucide-react";
import { useUserStore } from "@/store/user.store";
import { toast } from "sonner";
import { PaginationControls } from "@/components/PaginationControls";

export default function Requests() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();
  
  const { users: requests, isLoading: loading, pagination, getAllUsers, approveRejectUser } = useUserStore();

  const fetchRequests = async () => {
    try {
      await getAllUsers({
        status: "pending",
        role: filter !== "all" ? filter : undefined,
        search: search || undefined,
        page,
        limit: pageSize,
      });
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast.error("Failed to fetch requests");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [filter, search, page, pageSize]);

  // Reset page when filter or search changes
  useEffect(() => {
    setPage(1);
  }, [filter, search]);

  const handleAction = async (userId: string, action: "approved" | "rejected") => {
    try {
      await approveRejectUser(userId, {
        action,
        reason: action === "approved" ? "Account approved" : "Account rejected",
      });
      toast.success(`User ${action} successfully`);
      fetchRequests();
    } catch (error) {
      console.error(`Error ${action}ing user:`, error);
      toast.error(`Failed to ${action} user`);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Requests</h1>
          <p className="text-muted-foreground text-sm">
            Manage and review all site-related requests.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white border border-border rounded-2xl shadow-sm">
        <div className="flex flex-wrap items-center gap-4 border-b border-gray-100 px-6 py-4">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="min-w-[140px] rounded-lg">
              <SelectValue placeholder="All Request" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Request</SelectItem>
              <SelectItem value="driver">Driver</SelectItem>
              <SelectItem value="subcontractor">Subcontractor</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative w-full max-w-xs flex-1 sm:flex-none">
            <Search className="text-gray-400 absolute left-3 top-1/2 size-4 -translate-y-1/2" />
            <Input
              placeholder="Search"
              className="pl-9 rounded-lg border-gray-200 focus-visible:ring-[#8A5BD5]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="px-6 py-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-[#8A5BD5]" />
            </div>
          ) : (
            <Table className="bg-transparent">
              <TableHeader>
                <TableRow className="bg-gray-50 border-b border-gray-100">
                  <TableHead className="text-gray-500 font-medium py-3 w-10">
                    #
                  </TableHead>
                  <TableHead className="text-gray-500 font-medium py-3">
                    Name
                  </TableHead>
                  <TableHead className="text-gray-500 font-medium py-3">
                    Email
                  </TableHead>
                  <TableHead className="text-gray-500 font-medium py-3">
                    Type
                  </TableHead>
                  <TableHead className="text-gray-500 font-medium py-3">
                    Induction Number
                  </TableHead>
                  <TableHead className="text-gray-500 font-medium py-3 text-right">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {requests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No pending requests found
                    </TableCell>
                  </TableRow>
                ) : (
                  requests.map((req, index) => (
                    <TableRow
                      key={req._id}
                      className="border-b border-gray-100 hover:bg-gray-50/40 transition-colors"
                    >
                      <TableCell className="py-4 text-gray-800 font-medium">
                        {(page - 1) * pageSize + index + 1}
                      </TableCell>
                      <TableCell className="text-gray-800 font-medium">
                        {req.name}
                      </TableCell>
                      <TableCell className="text-gray-700">{req.email}</TableCell>
                      <TableCell className="text-gray-700 capitalize">{req.role}</TableCell>
                      <TableCell className="text-gray-700">
                        {/* Induction number is not in User type yet, using placeholder or if available */}
                        --
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-4 text-sm font-medium">
                          <button
                            onClick={() =>
                              navigate(`/dashboard/requests/${req._id}`)
                            }
                            className="text-[#8A5BD5] hover:text-[#7A4EC3] transition-colors cursor-pointer"
                          >
                            View
                          </button>
                          <button 
                            onClick={() => handleAction(req._id, "approved")}
                            className="text-green-600 hover:text-green-700 transition-colors cursor-pointer"
                          >
                            Accept
                          </button>
                          <button 
                            onClick={() => handleAction(req._id, "rejected")}
                            className="text-red-500 hover:text-red-600 transition-colors cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Pagination Controls */}
        {!loading && pagination && pagination.totalRecords > 0 && (
          <PaginationControls
            currentPage={pagination.currentPage || page}
            totalPages={pagination.totalPages || 1}
            onPageChange={handlePageChange}
            pageSize={pageSize}
            onPageSizeChange={handlePageSizeChange}
            totalItems={pagination.totalRecords}
            className="px-6 py-4 border-t border-gray-100"
            label="Rows"
          />
        )}
      </div>
    </div>
  );
}

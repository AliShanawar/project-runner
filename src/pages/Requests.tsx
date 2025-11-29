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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Search, Loader2 } from "lucide-react";
import { useUserStore } from "@/store/user.store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    if (!pagination) return [];
    
    const { totalPages, currentPage } = pagination;
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }

    return pages;
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
                            className="text-[#8A5BD5] hover:text-[#7A4EC3] transition-colors"
                          >
                            View
                          </button>
                          <button 
                            onClick={() => handleAction(req._id, "approved")}
                            className="text-green-600 hover:text-green-700 transition-colors"
                          >
                            Accept
                          </button>
                          <button 
                            onClick={() => handleAction(req._id, "rejected")}
                            className="text-red-500 hover:text-red-600 transition-colors"
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
          <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Page size selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Rows per page:</span>
              <Select
                value={pageSize.toString()}
                onValueChange={(value) => handlePageSizeChange(Number(value))}
              >
                <SelectTrigger className="w-[70px] h-8 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-gray-600">
                {((pagination.currentPage - 1) * pagination.recordsPerPage) + 1}-{Math.min(pagination.currentPage * pagination.recordsPerPage, pagination.totalRecords)} of {pagination.totalRecords}
              </span>
            </div>

            {/* Pagination */}
            <Pagination className="!w-auto sm:ml-auto sm:mr-0 sm:justify-end">
              <PaginationContent className="gap-2 rounded-full border border-gray-200 bg-gray-50 px-2 py-1 shadow-sm">
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (pagination.currentPage > 1) handlePageChange(pagination.currentPage - 1);
                    }}
                    className={cn(
                      "rounded-full border border-gray-200 bg-white text-gray-700 shadow-none hover:border-[#8A5BD5]/60 hover:bg-[#8A5BD5]/10 hover:text-[#8A5BD5]",
                      pagination.currentPage === 1
                        ? "pointer-events-none opacity-40"
                        : "cursor-pointer"
                    )}
                  />
                </PaginationItem>

                {getPageNumbers().map((pageNum, index) => (
                  <PaginationItem key={index}>
                    {pageNum === "ellipsis" ? (
                      <PaginationEllipsis className="text-gray-400" />
                    ) : (
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(pageNum as number);
                        }}
                        isActive={pagination.currentPage === pageNum}
                        className={cn(
                          "cursor-pointer rounded-full border border-gray-200 bg-white text-gray-700 shadow-none hover:border-[#8A5BD5]/60 hover:bg-[#8A5BD5]/10 hover:text-[#8A5BD5]",
                          pagination.currentPage === pageNum && "border-transparent bg-[#8A5BD5] text-white hover:bg-[#7A4EC3]"
                        )}
                      >
                        {pageNum}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (pagination.currentPage < pagination.totalPages) handlePageChange(pagination.currentPage + 1);
                    }}
                    className={cn(
                      "rounded-full border border-gray-200 bg-white text-gray-700 shadow-none hover:border-[#8A5BD5]/60 hover:bg-[#8A5BD5]/10 hover:text-[#8A5BD5]",
                      pagination.currentPage >= pagination.totalPages
                        ? "pointer-events-none opacity-40"
                        : "cursor-pointer"
                    )}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}

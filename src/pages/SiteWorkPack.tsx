import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PaginationControls } from "@/components/PaginationControls";
import { useWorkpackStore } from "@/store/workpack.store";
import type { WorkpackStatus } from "@/types";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const statusClasses: Record<WorkpackStatus, string> = {
  active: "bg-purple-50 text-[#7A4EC3] border-purple-100",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-100",
  cancelled: "bg-red-50 text-red-700 border-red-100",
};

const formatDateTime = (value?: string) => {
  if (!value) return "N/A";
  const date = new Date(value);
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const formatStatus = (status: WorkpackStatus) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const SiteWorkPack = () => {
  const { siteId } = useParams<{ siteId: string }>();
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const {
    workpacks,
    pagination,
    isLoading,
    error,
    fetchWorkpacksBySite,
    clearSelected,
  } = useWorkpackStore();

  const loadWorkpacks = useCallback(async () => {
    await fetchWorkpacks({
      page,
      limit,
      search: searchTerm || undefined,
      status: statusFilter !== "all" ? statusFilter : undefined,
    });
  }, [fetchWorkpacks, page, limit, searchTerm, statusFilter]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(searchInput.trim());
      setPage(1);
    }, 350);

    return () => clearTimeout(handler);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [limit, statusFilter]);

  useEffect(() => {
    const loadWorkpacks = async () => {
      if (!siteId) return;

      try {
        await fetchWorkpacksBySite(siteId, {
          page,
          limit,
          search: searchTerm || undefined,
        });
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch work packs");
      }
    };

    loadWorkpacks();
  }, [page, limit, searchTerm, siteId, fetchWorkpacksBySite]);

  useEffect(
    () => () => {
      clearSelected();
    },
    [clearSelected],
  );

  const totalPages = pagination?.totalPages || 1;
  const totalItems = pagination?.totalItems;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Work Pack</h1>
      </div>

      <div className="bg-white border border-border rounded-2xl shadow-sm">
        <div className="flex flex-wrap items-center gap-4 border-b border-gray-100 px-6 py-4">
          <div className="relative w-full max-w-xs flex-1 sm:flex-none">
            <Search className="text-gray-400 absolute left-3 top-1/2 size-4 -translate-y-1/2" />
            <Input
              placeholder="Search work packs"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9 rounded-lg border-gray-200 focus-visible:ring-[#8A5BD5]"
            />
          </div>
        </div>

        <div className="px-6 py-4">
          <Table className="bg-transparent">
            <TableHeader>
              <TableRow className="bg-gray-50 border-b border-gray-100">
                <TableHead className="text-gray-500 font-medium py-3">
                  Title
                </TableHead>
                <TableHead className="text-gray-500 font-medium py-3">
                  Description
                </TableHead>
                <TableHead className="text-gray-500 font-medium py-3">
                  Created By
                </TableHead>
                <TableHead className="text-gray-500 font-medium py-3">
                  Status
                </TableHead>
                <TableHead className="text-gray-500 font-medium py-3">
                  Created
                </TableHead>
                <TableHead className="text-gray-500 font-medium py-3">
                  Updated
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="size-5 animate-spin text-[#8A5BD5]" />
                      <span className="text-gray-500">
                        Loading work packs...
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    <div className="text-red-500">Error: {error}</div>
                  </TableCell>
                </TableRow>
              ) : workpacks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    <div className="text-gray-500">
                      {searchTerm
                        ? "No work packs found matching your search"
                        : "No work packs found"}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                workpacks.map((pack) => (
                  <TableRow
                    key={pack._id}
                    className="border-b border-gray-100 hover:bg-gray-50/40 transition-colors"
                  >
                    <TableCell className="py-4 text-gray-800 font-medium">
                      <div
                        className="max-w-[240px] truncate"
                        title={pack.title}
                      >
                        {pack.title}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-700">
                      <div
                        className="max-w-[360px] truncate"
                        title={pack.description || "No description provided"}
                      >
                        {pack.description || "No description provided"}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-700">
                      <div className="flex flex-col">
                        <span>{pack.createdBy?.name || "Unknown"}</span>
                        {pack.createdBy?.email && (
                          <span className="text-xs text-gray-400">
                            {pack.createdBy.email}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge
                        variant="outline"
                        className={`rounded-full px-2.5 py-1 font-medium ${
                          statusClasses[pack.status] ||
                          "bg-gray-50 text-gray-700 border-gray-100"
                        }`}
                      >
                        {formatStatus(pack.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {formatDateTime(pack.createdAt)}
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {formatDateTime(pack.updatedAt)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {!isLoading && workpacks.length > 0 && (
          <PaginationControls
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            totalItems={totalItems}
            pageSize={limit}
            className="px-6 py-4 border-t border-gray-100"
            label="Rows"
          />
        )}
      </div>
    </div>
  );
};

export default SiteWorkPack;

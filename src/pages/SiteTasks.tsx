import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Search, Loader2 } from "lucide-react";
import { TaskDataTable } from "@/components/TaskDataTable";
import { taskColumns, type Task as TaskColumnType } from "@/components/TaskColumns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useTaskStore } from "@/store/task.store";
import { toast } from "sonner";
import type { Task as ApiTask } from "@/types";

const SiteTasks = () => {
  const { siteId } = useParams<{ siteId: string }>();
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const { tasks, isLoading, pagination, getTasksBySite } = useTaskStore();

  const fetchTasks = async () => {
    if (!siteId) return;
    try {
      await getTasksBySite(siteId, {
        status: statusFilter !== "all" ? statusFilter : undefined,
        page,
        limit: pageSize,
      });
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to fetch tasks");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [siteId, statusFilter, page, pageSize]);

  // Reset page when filter changes
  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  // Transform API tasks to match TaskColumns format
  const transformedTasks = useMemo(() => {
    return tasks.map((task: ApiTask): TaskColumnType => {
      const firstItem = task.itemsToDeliver?.[0];
      return {
        id: parseInt(task._id) || 0,
        assignedTo: {
          name: task.assignedTo?.name || "Unassigned",
          avatar: task.assignedTo?.profilePicture,
        },
        assignedBy: task.assignedBy?.name || "Unknown",
        material: {
          type: firstItem?.name || "N/A",
          quantity: firstItem ? `${firstItem.quantity} ${firstItem.unit}` : "0",
          icon: firstItem?.icon,
        },
        status: task.status === "completed" ? "Completed" : task.status === "cancelled" ? "Cancelled" : "Pending",
      };
    });
  }, [tasks]);

  // Filter tasks by search query (client-side for now)
  const filteredTasks = transformedTasks.filter((task) => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      task.assignedTo?.name?.toLowerCase().includes(searchLower) ||
      task.assignedBy?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="rounded-lg p-8 bg-white">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Task</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage tasks for this site
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="started">Started</SelectItem>
              <SelectItem value="material_picked">Material Picked</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#8A5BD5]" />
          </div>
        ) : (
          <>
            {/* Data Table */}
            <TaskDataTable columns={taskColumns} data={filteredTasks} />

            {/* Pagination Info */}
            {pagination && pagination.totalRecords > 0 && (
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div>
                  Showing {((pagination.currentPage - 1) * pagination.recordsPerPage) + 1}-
                  {Math.min(pagination.currentPage * pagination.recordsPerPage, pagination.totalRecords)} of {pagination.totalRecords} tasks
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span>
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page >= pagination.totalPages}
                    className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SiteTasks;

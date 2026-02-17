import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  AlertTriangle,
  Edit3,
  Loader2,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PaginationControls } from "@/components/PaginationControls";
import { useHsLogStore } from "@/store/hslog.store";
import type {
  CreateHsLogRequest,
  HsLog,
  HsLogCategory,
  HsLogPriority,
  HsLogSeverity,
  HsLogStatus,
} from "@/types";

type DialogMode = "create" | "edit" | "delete" | null;

type StatusFilter = HsLogStatus | "all";
type PriorityFilter = HsLogPriority | "all";

const statusBadgeClass: Record<HsLogStatus, string> = {
  active: "bg-[#8A5BD5]/10 text-[#8A5BD5] border-[#8A5BD5]/20",
  resolved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  closed: "bg-gray-100 text-gray-700 border-gray-200",
};

const categoryOptions: HsLogCategory[] = [
  "safety_incident",
  "near_miss",
  "hazard_identification",
  "safety_observation",
  "equipment_safety",
  "environmental",
  "other",
];

const severityOptions: HsLogSeverity[] = ["minor", "moderate", "major", "severe"];

const statusOptions: HsLogStatus[] = ["active", "resolved", "closed"];

const priorityOptions: HsLogPriority[] = ["low", "medium", "high", "critical"];

const formatDate = (value?: string) => {
  if (!value) return "N/A";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
};

const formatDateTime = (value?: string) => {
  if (!value) return "N/A";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
};

const formatLabel = (value?: string) => {
  if (!value) return "N/A";
  return value.replace(/_/g, " ");
};

const SiteHSLogs = () => {
  const { siteId } = useParams<{ siteId: string }>();
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    precaution: "",
    activeDate: "",
    priority: "medium" as HsLogPriority,
    category: "safety_observation" as HsLogCategory,
    severity: "moderate" as HsLogSeverity,
    status: "active" as HsLogStatus,
    resolution: "",
  });

  const {
    hsLogs,
    pagination,
    selectedHsLog,
    isLoading,
    isLoadingDetails,
    fetchHsLogsBySite,
    fetchHsLogById,
    createHsLog,
    updateHsLog,
    updateHsLogStatus,
    deleteHsLog,
    clearSelected,
  } = useHsLogStore();

  const loadHsLogs = useCallback(async () => {
    if (!siteId) return;
    await fetchHsLogsBySite(siteId, {
      page,
      limit,
      search: searchTerm || undefined,
      status: statusFilter !== "all" ? statusFilter : undefined,
      priority: priorityFilter !== "all" ? priorityFilter : undefined,
      sortBy: "activeDate",
      sortOrder: "desc",
    });
  }, [
    fetchHsLogsBySite,
    limit,
    page,
    priorityFilter,
    searchTerm,
    siteId,
    statusFilter,
  ]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(searchInput.trim());
      setPage(1);
    }, 350);

    return () => clearTimeout(handler);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [limit, statusFilter, priorityFilter]);

  useEffect(() => {
    loadHsLogs().catch((error) => {
      console.error(error);
      toast.error("Failed to fetch H&S logs");
    });
  }, [loadHsLogs]);

  useEffect(
    () => () => {
      clearSelected();
    },
    [clearSelected]
  );

  const activeLog: HsLog | null = useMemo(() => {
    if (selectedHsLog) return selectedHsLog;
    if (selectedId) return hsLogs.find((item) => item._id === selectedId) || null;
    return null;
  }, [hsLogs, selectedHsLog, selectedId]);

  const handleSelectLog = async (hsLogId: string) => {
    setSelectedId(hsLogId);
    setIsDetailsOpen(true);
    try {
      await fetchHsLogById(hsLogId);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load H&S log details");
      setIsDetailsOpen(false);
    }
  };

  const openCreateDialog = () => {
    setFormData({
      title: "",
      precaution: "",
      activeDate: "",
      priority: "medium",
      category: "safety_observation",
      severity: "moderate",
      status: "active",
      resolution: "",
    });
    setDialogMode("create");
  };

  const openEditDialog = (log: HsLog) => {
    setFormData({
      title: log.title || "",
      precaution: log.precaution || "",
      activeDate: log.activeDate ? log.activeDate.slice(0, 10) : "",
      priority: log.priority || "medium",
      category: log.category || "safety_observation",
      severity: log.severity || "moderate",
      status: log.status || "active",
      resolution: log.resolution || "",
    });
    setSelectedId(log._id);
    setDialogMode("edit");
  };

  const openDeleteDialog = (log: HsLog) => {
    setSelectedId(log._id);
    setDialogMode("delete");
  };

  const closeDialog = () => {
    setDialogMode(null);
    setIsSubmitting(false);
  };

  const handleSubmitCreateOrUpdate = async () => {
    if (!siteId) {
      toast.error("Site is required");
      return;
    }

    if (!formData.title.trim() || !formData.precaution.trim() || !formData.activeDate) {
      toast.error("Title, precaution and active date are required");
      return;
    }

    setIsSubmitting(true);
    try {
      let targetId: string | null = selectedId;

      if (dialogMode === "create") {
        const payload: CreateHsLogRequest = {
          title: formData.title.trim(),
          precaution: formData.precaution.trim(),
          activeDate: formData.activeDate,
          siteId,
          priority: formData.priority,
          category: formData.category,
          severity: formData.severity,
          resolution: formData.resolution.trim() || undefined,
        };

        const created = await createHsLog(payload);
        targetId = created._id;
        setSelectedId(created._id);
        toast.success("H&S log created");
      } else if (dialogMode === "edit" && selectedId) {
        const previous = activeLog;
        await updateHsLog(selectedId, {
          title: formData.title.trim(),
          precaution: formData.precaution.trim(),
          activeDate: formData.activeDate,
          priority: formData.priority,
          category: formData.category,
          severity: formData.severity,
          resolution: formData.resolution.trim() || undefined,
        });

        if (previous?.status !== formData.status) {
          await updateHsLogStatus(selectedId, formData.status);
        }

        targetId = selectedId;
        toast.success("H&S log updated");
      }

      await loadHsLogs();
      if (targetId) {
        await fetchHsLogById(targetId);
      }
      closeDialog();
    } catch (error) {
      console.error(error);
      toast.error(
        dialogMode === "create"
          ? "Failed to create H&S log"
          : "Failed to update H&S log"
      );
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    setIsSubmitting(true);
    try {
      await deleteHsLog(selectedId);
      toast.success("H&S log deleted");
      setSelectedId(null);
      setIsDetailsOpen(false);
      closeDialog();
      await loadHsLogs();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete H&S log");
      setIsSubmitting(false);
    }
  };

  const totalPages = pagination?.totalPages || 1;
  const totalItems = pagination?.totalItems;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">H&S Logs</h1>
          <p className="text-sm text-gray-500">
            Track safety logs with filters, details, and full CRUD.
          </p>
        </div>
        <Button
          onClick={openCreateDialog}
          className="bg-[#8A5BD5] hover:bg-[#7A4EC3]"
        >
          <Plus className="size-4" />
          Add H&S Log
        </Button>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm">
        <div className="flex flex-wrap items-center gap-3 border-b border-gray-100 p-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search title or precaution"
              className="pl-9 rounded-lg border-gray-200 focus-visible:ring-[#8A5BD5]"
            />
          </div>

          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as StatusFilter)}
          >
            <SelectTrigger className="w-[180px] rounded-lg">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {formatLabel(status)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={priorityFilter}
            onValueChange={(value) => setPriorityFilter(value as PriorityFilter)}
          >
            <SelectTrigger className="w-[180px] rounded-lg">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              {priorityOptions.map((priority) => (
                <SelectItem key={priority} value={priority}>
                  {formatLabel(priority)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-6 animate-spin text-[#8A5BD5]" />
            </div>
          ) : hsLogs.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-500">
              No H&S logs found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 border-gray-100">
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Active Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hsLogs.map((log) => (
                  <TableRow
                    key={log._id}
                    className={`cursor-pointer border-gray-100 hover:bg-gray-50 ${
                      selectedId === log._id ? "bg-[#8A5BD5]/5" : ""
                    }`}
                    onClick={() => handleSelectLog(log._id)}
                  >
                    <TableCell>
                      <p className="font-medium text-gray-900">{log.title}</p>
                      <p className="line-clamp-1 text-xs text-gray-500">
                        {log.precaution || "No precaution"}
                      </p>
                    </TableCell>
                    <TableCell className="capitalize">{formatLabel(log.category)}</TableCell>
                    <TableCell className="capitalize">{formatLabel(log.priority)}</TableCell>
                    <TableCell className="capitalize">{formatLabel(log.severity)}</TableCell>
                    <TableCell>{formatDate(log.activeDate)}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={statusBadgeClass[log.status || "active"]}
                      >
                        {formatLabel(log.status || "active")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex items-center gap-2">
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditDialog(log);
                          }}
                        >
                          <Edit3 className="size-4" />
                        </Button>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            openDeleteDialog(log);
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {totalPages > 1 && (
          <div className="border-t border-gray-100 p-4">
            <PaginationControls
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              totalItems={totalItems}
              pageSize={limit}
              onPageSizeChange={setLimit}
            />
          </div>
        )}
      </div>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          {isLoadingDetails ? (
            <div className="flex min-h-[220px] items-center justify-center">
              <Loader2 className="size-7 animate-spin text-[#8A5BD5]" />
            </div>
          ) : !activeLog ? (
            <div className="py-10 text-center text-sm text-gray-500">
              H&S log details unavailable.
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>H&S Log Details</DialogTitle>
                <DialogDescription>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
                  hendrerit dictum augue a malesuada molestie justo quis pretium.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Title</p>
                  <div className="mt-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900">
                    {activeLog.title}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">Precaution</p>
                  <div className="mt-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900">
                    {activeLog.precaution || "No precaution"}
                  </div>
                </div>

                <div className="grid gap-4 text-sm sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Active Date</p>
                    <div className="mt-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900">
                      {formatDate(activeLog.activeDate)}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Status</p>
                    <div className="mt-1">
                      <Badge
                        variant="outline"
                        className={statusBadgeClass[activeLog.status || "active"]}
                      >
                        {formatLabel(activeLog.status || "active")}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 text-sm sm:grid-cols-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Priority</p>
                    <div className="mt-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 capitalize">
                      {formatLabel(activeLog.priority)}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Category</p>
                    <div className="mt-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 capitalize">
                      {formatLabel(activeLog.category)}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Severity</p>
                    <div className="mt-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 capitalize">
                      {formatLabel(activeLog.severity)}
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">Resolution</p>
                  <div className="mt-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900">
                    {activeLog.resolution || "No resolution"}
                  </div>
                </div>

                <div className="text-xs text-gray-500">
                  Created: {formatDateTime(activeLog.createdAt)}
                  {" | "}
                  Updated: {formatDateTime(activeLog.updatedAt)}
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDetailsOpen(false);
                    openEditDialog(activeLog);
                  }}
                  className="border-[#8A5BD5] text-[#8A5BD5]"
                >
                  <Edit3 className="size-4" />
                  Edit
                </Button>
                <Button
                  className="bg-red-600 hover:bg-red-700"
                  onClick={() => {
                    setIsDetailsOpen(false);
                    openDeleteDialog(activeLog);
                  }}
                >
                  <Trash2 className="size-4" />
                  Delete
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={dialogMode === "create" || dialogMode === "edit"}
        onOpenChange={(open) => !open && closeDialog()}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "create" ? "Add New H&S Log" : "Edit H&S Log"}
            </DialogTitle>
            <DialogDescription>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
              hendrerit dictum augue a malesuada molestie justo quis pretium.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Title *</label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Enter title"
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Precaution *</label>
              <Textarea
                value={formData.precaution}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, precaution: e.target.value }))
                }
                placeholder="Write precaution details"
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Active Date *</label>
              <Input
                type="date"
                value={formData.activeDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, activeDate: e.target.value }))
                }
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Priority</label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      priority: value as HsLogPriority,
                    }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {formatLabel(option)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Category</label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: value as HsLogCategory,
                    }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {formatLabel(option)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Severity</label>
                <Select
                  value={formData.severity}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      severity: value as HsLogSeverity,
                    }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {severityOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {formatLabel(option)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {dialogMode === "edit" && (
              <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: value as HsLogStatus,
                    }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {formatLabel(option)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-700">Resolution</label>
              <Textarea
                value={formData.resolution}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, resolution: e.target.value }))
                }
                placeholder="Optional resolution"
                className="mt-1"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeDialog}
              className="border-[#8A5BD5] text-[#8A5BD5]"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitCreateOrUpdate}
              disabled={isSubmitting}
              className="bg-[#8A5BD5] hover:bg-[#7A4EC3]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  {dialogMode === "create" ? "Adding..." : "Updating..."}
                </>
              ) : dialogMode === "create" ? (
                "Add New H&S Log"
              ) : (
                "Update"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={dialogMode === "delete"} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-red-500" />
              Delete H&S Log
            </DialogTitle>
            <DialogDescription>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
              hendrerit dictum augue a malesuada molestie justo quis pretium.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeDialog}
              className="border-[#8A5BD5] text-[#8A5BD5]"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete H&S Log"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SiteHSLogs;

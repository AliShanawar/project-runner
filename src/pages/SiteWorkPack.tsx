import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Edit3,
  Loader2,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PaginationControls } from "@/components/PaginationControls";
import { useWorkpackStore } from "@/store/workpack.store";
import type { Workpack, WorkpackStatus } from "@/types";
import { toast } from "sonner";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type DialogMode = "create" | "edit" | "delete" | null;
type StatusFilter = WorkpackStatus | "all";

const statusBadgeClass: Record<WorkpackStatus, string> = {
  active: "bg-[#8A5BD5]/10 text-[#8A5BD5] border-[#8A5BD5]/20",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
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

const SiteWorkPack = () => {
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "active" as WorkpackStatus,
  });

  const {
    workpacks,
    pagination,
    selectedWorkpack,
    isLoading,
    isLoadingDetails,
    fetchWorkpacks,
    fetchWorkpackById,
    createWorkpack,
    updateWorkpack,
    deleteWorkpack,
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
    loadWorkpacks().catch((error) => {
      console.error(error);
      toast.error("Failed to fetch work packs");
    });
  }, [loadWorkpacks]);

  useEffect(
    () => () => {
      clearSelected();
    },
    [clearSelected]
  );

  const activePack: Workpack | null = useMemo(() => {
    if (selectedWorkpack) return selectedWorkpack;
    if (selectedId) return workpacks.find((wp) => wp._id === selectedId) || null;
    return null;
  }, [selectedId, selectedWorkpack, workpacks]);

  const handleSelectPack = async (workpackId: string) => {
    setSelectedId(workpackId);
    setIsDetailsOpen(true);
    try {
      await fetchWorkpackById(workpackId);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load work pack details");
      setIsDetailsOpen(false);
    }
  };

  const openCreateDialog = () => {
    setFormData({
      title: "",
      description: "",
      status: "active",
    });
    setDialogMode("create");
  };

  const openEditDialog = (pack: Workpack) => {
    setFormData({
      title: pack.title,
      description: pack.description || "",
      status: pack.status,
    });
    setSelectedId(pack._id);
    setDialogMode("edit");
  };

  const openDeleteDialog = (pack: Workpack) => {
    setSelectedId(pack._id);
    setDialogMode("delete");
  };

  const closeDialog = () => {
    setDialogMode(null);
    setIsSubmitting(false);
  };

  const handleSubmitCreateOrUpdate = async () => {
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    setIsSubmitting(true);
    try {
      let targetId: string | null = selectedId;

      if (dialogMode === "create") {
        const created = await createWorkpack({
          title: formData.title.trim(),
          description: formData.description.trim() || undefined,
        });
        targetId = created._id;
        setSelectedId(created._id);
        toast.success("Work pack created");
      } else if (dialogMode === "edit" && selectedId) {
        await updateWorkpack(selectedId, {
          title: formData.title.trim(),
          description: formData.description.trim() || undefined,
          status: formData.status,
        });
        targetId = selectedId;
        toast.success("Work pack updated");
      }

      await loadWorkpacks();
      if (targetId) {
        await fetchWorkpackById(targetId);
      }
      closeDialog();
    } catch (error) {
      console.error(error);
      toast.error(
        dialogMode === "create"
          ? "Failed to create work pack"
          : "Failed to update work pack"
      );
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    setIsSubmitting(true);
    try {
      await deleteWorkpack(selectedId);
      toast.success("Work pack deleted");
      setSelectedId(null);
      setIsDetailsOpen(false);
      closeDialog();
      await loadWorkpacks();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete work pack");
      setIsSubmitting(false);
    }
  };

  const totalPages = pagination?.totalPages || 1;
  const totalItems = pagination?.totalItems;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Work Packs</h1>
          <p className="text-sm text-gray-500">
            Click a row to view details. Create, update, and delete from here.
          </p>
        </div>
        <Button
          onClick={openCreateDialog}
          className="bg-[#8A5BD5] hover:bg-[#7A4EC3]"
        >
          <Plus className="size-4" />
          Add Work Pack
        </Button>
      </div>

      <div>
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm">
          <div className="flex flex-wrap items-center gap-3 border-b border-gray-100 p-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search work packs..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="p-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="size-6 animate-spin text-[#8A5BD5]" />
              </div>
            ) : workpacks.length === 0 ? (
              <div className="py-12 text-center text-sm text-gray-500">
                No work packs found.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 border-gray-100">
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created By</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workpacks.map((pack) => (
                    <TableRow
                      key={pack._id}
                      className={`cursor-pointer border-gray-100 hover:bg-gray-50 ${
                        selectedId === pack._id ? "bg-[#8A5BD5]/5" : ""
                      }`}
                      onClick={() => handleSelectPack(pack._id)}
                    >
                      <TableCell>
                        <p className="font-medium text-gray-900">{pack.title}</p>
                        <p className="line-clamp-1 text-xs text-gray-500">
                          {pack.description || "No description"}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={statusBadgeClass[pack.status]}
                        >
                          {pack.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {pack.createdBy?.name || pack.createdBy?.email || "Unknown"}
                      </TableCell>
                      <TableCell>{formatDateTime(pack.updatedAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="inline-flex items-center gap-2">
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditDialog(pack);
                            }}
                          >
                            <Edit3 className="size-4" />
                          </Button>
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              openDeleteDialog(pack);
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
      </div>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          {isLoadingDetails ? (
            <div className="flex min-h-[220px] items-center justify-center">
              <Loader2 className="size-7 animate-spin text-[#8A5BD5]" />
            </div>
          ) : !activePack ? (
            <div className="py-10 text-center text-sm text-gray-500">
              Work pack details unavailable.
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Work Pack Details</DialogTitle>
                <DialogDescription>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
                  hendrerit dictum augue a malesuada molestie justo quis pretium.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Title</p>
                  <div className="mt-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900">
                    {activePack.title}
                  </div>
                </div>

                <div className="grid gap-4 text-sm sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Created By</p>
                    <div className="mt-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900">
                      {activePack.createdBy?.name ||
                        activePack.createdBy?.email ||
                        "Unknown"}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Created At</p>
                    <div className="mt-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900">
                      {formatDateTime(activePack.createdAt)}
                    </div>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium text-gray-700">
                    Description
                  </p>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm leading-6 text-gray-700">
                    {activePack.description || "No description provided."}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">Status</p>
                  <div className="mt-1">
                    <Badge
                      variant="outline"
                      className={statusBadgeClass[activePack.status]}
                    >
                      {activePack.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDetailsOpen(false);
                    openEditDialog(activePack);
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
                    openDeleteDialog(activePack);
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

      <Dialog open={dialogMode === "create" || dialogMode === "edit"} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "create" ? "Add New Work Pack" : "Edit Work Pack"}
            </DialogTitle>
            <DialogDescription>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
              hendrerit dictum augue a malesuada molestie justo quis pretium.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Title *</label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Enter work pack title"
                className="mt-1"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Add work pack details"
                rows={4}
                className="mt-1"
              />
            </div>

            {dialogMode === "edit" && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Status</label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: value as WorkpackStatus,
                    }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeDialog}
              disabled={isSubmitting}
              className="border-[#8A5BD5] text-[#8A5BD5]"
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
                  <Loader2 className="size-4 animate-spin" />
                  Saving...
                </>
              ) : dialogMode === "create" ? (
                "Add New Work Pack"
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
              Delete Work Pack
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
              disabled={isSubmitting}
              className="border-[#8A5BD5] text-[#8A5BD5]"
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
                  <Loader2 className="size-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Work Pack"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SiteWorkPack;

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Check, Loader2, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PaginationControls } from "@/components/PaginationControls";
import { useWorkpackStore } from "@/store/workpack.store";
import { siteService } from "@/api/services/site.service";
import type { SiteEmployee, Workpack, WorkpackStatus } from "@/types";
import { toast } from "sonner";
import { showSuccessToast } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type DialogMode = "create" | "edit" | "delete" | null;

const statusClasses: Record<WorkpackStatus, string> = {
  active: "bg-purple-50 text-[#7A4EC3] border-purple-100",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-100",
  cancelled: "bg-red-50 text-red-700 border-red-100",
};

const statusOptions: WorkpackStatus[] = ["active", "completed", "cancelled"];

const emptyForm = {
  title: "",
  description: "",
  status: "active" as WorkpackStatus,
  assignedTo: [] as string[],
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

const formatStatus = (status: WorkpackStatus) =>
  status.charAt(0).toUpperCase() + status.slice(1);

const initials = (name?: string) =>
  (name || "?")
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

const AssigneeAvatars = ({ assignees }: { assignees: Workpack["assignedTo"] }) => {
  if (!assignees || assignees.length === 0) {
    return <span className="text-gray-400">Unassigned</span>;
  }

  const shown = assignees.slice(0, 3);
  const extra = assignees.length - shown.length;

  return (
    <div className="flex items-center">
      <div className="flex -space-x-2">
        {shown.map((user) => (
          <Avatar
            key={user._id}
            className="size-8 border-2 border-white"
            title={user.name || user.email}
          >
            <AvatarImage src={user.image} alt={user.name || "Assignee"} />
            <AvatarFallback className="bg-[#8A5BD5]/10 text-xs font-medium text-[#7A4EC3]">
              {initials(user.name)}
            </AvatarFallback>
          </Avatar>
        ))}
      </div>
      {extra > 0 && (
        <span className="ml-2 text-xs font-medium text-gray-500">+{extra}</span>
      )}
    </div>
  );
};

const SiteWorkPack = () => {
  const { siteId } = useParams<{ siteId: string }>();
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [refreshTick, setRefreshTick] = useState(0);

  // Dialog / form state
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [selected, setSelected] = useState<Workpack | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Subcontractors available for assignment on this site
  const [subcontractors, setSubcontractors] = useState<SiteEmployee[]>([]);
  const [isLoadingSubs, setIsLoadingSubs] = useState(false);

  const {
    workpacks,
    pagination,
    isLoading,
    error,
    fetchWorkpacksBySite,
    createWorkpack,
    updateWorkpack,
    deleteWorkpack,
    clearSelected,
  } = useWorkpackStore();

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(searchInput.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(handler);
  }, [searchInput]);

  const loadWorkpacks = useCallback(async () => {
    if (!siteId) return;
    try {
      await fetchWorkpacksBySite(siteId, {
        page,
        limit,
        search: searchTerm || undefined,
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch work packs");
    }
  }, [siteId, page, limit, searchTerm, fetchWorkpacksBySite]);

  useEffect(() => {
    loadWorkpacks();
  }, [loadWorkpacks, refreshTick]);

  // Load subcontractors once per site (for the assignee picker)
  useEffect(() => {
    const loadSubs = async () => {
      if (!siteId) return;
      try {
        setIsLoadingSubs(true);
        const res = await siteService.getSiteEmployees(siteId, {
          role: "subConstructor",
          limit: 100,
        });
        setSubcontractors(res.employees || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoadingSubs(false);
      }
    };
    loadSubs();
  }, [siteId]);

  useEffect(() => () => clearSelected(), [clearSelected]);

  const subById = useMemo(() => {
    const map = new Map<string, SiteEmployee>();
    subcontractors.forEach((s) => map.set(s._id, s));
    return map;
  }, [subcontractors]);

  const openCreate = () => {
    setForm(emptyForm);
    setSelected(null);
    setDialogMode("create");
  };

  const openEdit = (pack: Workpack) => {
    setForm({
      title: pack.title,
      description: pack.description || "",
      status: pack.status,
      assignedTo: (pack.assignedTo || []).map((u) => u._id),
    });
    setSelected(pack);
    setDialogMode("edit");
  };

  const openDelete = (pack: Workpack) => {
    setSelected(pack);
    setDialogMode("delete");
  };

  const closeDialog = () => {
    setDialogMode(null);
    setSelected(null);
    setForm(emptyForm);
  };

  const toggleAssignee = (id: string) => {
    setForm((prev) => ({
      ...prev,
      assignedTo: prev.assignedTo.includes(id)
        ? prev.assignedTo.filter((x) => x !== id)
        : [...prev.assignedTo, id],
    }));
  };

  const handleSubmit = async () => {
    if (!siteId) {
      toast.error("Site ID is missing");
      return;
    }
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }

    setIsSubmitting(true);
    try {
      if (dialogMode === "create") {
        await createWorkpack({
          title: form.title.trim(),
          description: form.description.trim() || undefined,
          siteId,
          assignedTo: form.assignedTo,
        });
        showSuccessToast("Work pack created successfully");
      } else if (dialogMode === "edit" && selected) {
        await updateWorkpack(selected._id, {
          title: form.title.trim(),
          description: form.description.trim() || undefined,
          status: form.status,
          assignedTo: form.assignedTo,
        });
        showSuccessToast("Work pack updated successfully");
      }
      closeDialog();
      setRefreshTick((t) => t + 1);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || err?.message || "Operation failed",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    setIsSubmitting(true);
    try {
      await deleteWorkpack(selected._id);
      showSuccessToast("Work pack deleted successfully");
      closeDialog();
      setRefreshTick((t) => t + 1);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || err?.message || "Failed to delete",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPages = pagination?.totalPages || 1;
  const totalItems = pagination?.totalItems;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Work Pack</h1>
          <p className="text-gray-500 text-sm">
            Create work packs and assign them to subcontractors on this site.
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="bg-[#8A5BD5] hover:bg-[#7A4EC3] rounded-lg px-5"
        >
          <Plus className="size-4" />
          Create Work Pack
        </Button>
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
                  Assigned To
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
                <TableHead className="text-gray-500 font-medium py-3 text-right">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
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
                  <TableCell colSpan={7} className="h-32 text-center">
                    <div className="text-red-500">Error: {error}</div>
                  </TableCell>
                </TableRow>
              ) : workpacks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
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
                        className="max-w-[220px] truncate"
                        title={pack.title}
                      >
                        {pack.title}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-700">
                      <div
                        className="max-w-[280px] truncate"
                        title={pack.description || "No description provided"}
                      >
                        {pack.description || "No description provided"}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <AssigneeAvatars assignees={pack.assignedTo} />
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
                    <TableCell className="text-right text-sm font-medium">
                      <button
                        onClick={() => openEdit(pack)}
                        className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-[#8A5BD5] transition-colors hover:bg-[#8A5BD5]/10 hover:text-[#7A4EC3]"
                        aria-label={`Edit ${pack.title}`}
                        title="Edit / Assign"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => openDelete(pack)}
                        className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-red-500 transition-colors hover:bg-red-50 hover:text-red-600"
                        aria-label={`Delete ${pack.title}`}
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
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

      {/* Create / Edit Dialog */}
      <Dialog
        open={dialogMode === "create" || dialogMode === "edit"}
        onOpenChange={(open) => !open && closeDialog()}
      >
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "create" ? "Create Work Pack" : "Edit Work Pack"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Title *
              </label>
              <Input
                placeholder="Enter work pack title"
                value={form.title}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, title: e.target.value }))
                }
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Description
              </label>
              <Textarea
                placeholder="Enter a description (optional)"
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
                className="mt-1 min-h-24"
              />
            </div>

            {dialogMode === "edit" && (
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Status
                </label>
                <Select
                  value={form.status}
                  onValueChange={(value) =>
                    setForm((prev) => ({
                      ...prev,
                      status: value as WorkpackStatus,
                    }))
                  }
                >
                  <SelectTrigger className="mt-1 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {formatStatus(status)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-700">
                Assign Subcontractors
              </label>

              {form.assignedTo.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {form.assignedTo.map((id) => {
                    const sub = subById.get(id);
                    return (
                      <span
                        key={id}
                        className="inline-flex items-center gap-1 rounded-full bg-[#8A5BD5]/10 px-2.5 py-1 text-xs font-medium text-[#7A4EC3]"
                      >
                        {sub?.name || "Subcontractor"}
                        <button
                          type="button"
                          onClick={() => toggleAssignee(id)}
                          className="hover:text-[#5f3a9c]"
                          aria-label="Remove assignee"
                        >
                          <X className="size-3" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}

              <div className="mt-2 max-h-44 overflow-y-auto rounded-lg border border-gray-200">
                {isLoadingSubs ? (
                  <div className="flex items-center justify-center gap-2 py-6 text-sm text-gray-500">
                    <Loader2 className="size-4 animate-spin text-[#8A5BD5]" />
                    Loading subcontractors...
                  </div>
                ) : subcontractors.length === 0 ? (
                  <div className="px-3 py-6 text-center text-sm text-gray-500">
                    No subcontractors on this site yet.
                  </div>
                ) : (
                  subcontractors.map((sub) => {
                    const isSelected = form.assignedTo.includes(sub._id);
                    return (
                      <button
                        key={sub._id}
                        type="button"
                        onClick={() => toggleAssignee(sub._id)}
                        className="flex w-full items-center justify-between gap-3 border-b border-gray-100 px-3 py-2 text-left last:border-b-0 hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="size-8">
                            <AvatarImage
                              src={sub.image || undefined}
                              alt={sub.name}
                            />
                            <AvatarFallback className="bg-[#8A5BD5]/10 text-xs font-medium text-[#7A4EC3]">
                              {initials(sub.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-800">
                              {sub.name}
                            </span>
                            <span className="text-xs text-gray-400">
                              {sub.email}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`flex size-5 items-center justify-center rounded-md border ${
                            isSelected
                              ? "border-[#8A5BD5] bg-[#8A5BD5] text-white"
                              : "border-gray-300"
                          }`}
                        >
                          {isSelected && <Check className="size-3.5" />}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeDialog}
              className="border-[#8A5BD5] text-[#8A5BD5]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-[#8A5BD5] hover:bg-[#7A4EC3]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  {dialogMode === "create" ? "Creating..." : "Updating..."}
                </>
              ) : dialogMode === "create" ? (
                "Create Work Pack"
              ) : (
                "Update"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={dialogMode === "delete"}
        onOpenChange={(open) => !open && closeDialog()}
      >
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Work Pack</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            Are you sure you want to delete
            <span className="font-medium text-gray-900">
              {" "}
              {selected?.title}
            </span>
            ? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeDialog}
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
                  <Loader2 className="size-4 mr-2 animate-spin" />
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

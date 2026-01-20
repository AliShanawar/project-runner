import { useEffect, useMemo, useState } from "react";
import { Loader2, Search, Send, Paperclip } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PaginationControls } from "@/components/PaginationControls";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useWorkpackStore } from "@/store/workpack.store";
import type { Workpack, WorkpackStatus } from "@/types";
import { toast } from "sonner";

const statusDotColor: Record<WorkpackStatus, string> = {
  active: "bg-[#8A5BD5]",
  completed: "bg-emerald-500",
  cancelled: "bg-red-500",
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

const formatTimeOnly = (value?: string) => {
  if (!value) return "--";
  return new Date(value).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
};

const getInitials = (name?: string) => {
  if (!name) return "U";
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
};

const SiteWorkPack = () => {
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messageDraft, setMessageDraft] = useState(""); // UI only placeholder

  const {
    workpacks,
    pagination,
    selectedWorkpack,
    isLoading,
    isLoadingDetails,
    fetchWorkpacks,
    fetchWorkpackById,
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

  // Fetch workpacks when filters or pagination change
  useEffect(() => {
    const loadWorkpacks = async () => {
      try {
        await fetchWorkpacks({
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
  }, [page, limit, searchTerm, fetchWorkpacks]);

  // Clear selected workpack on unmount
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
    try {
      await fetchWorkpackById(workpackId);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load work pack details");
    }
  };

  const totalPages = pagination?.totalPages || 1;
  const totalItems = pagination?.totalItems;

  return (
    <div className="rounded-3xl bg-white shadow-sm border border-gray-100 p-6 h-[calc(100vh-160px)]">
      <div className="mb-5">
        <h1 className="text-2xl font-semibold text-gray-900">Work Pack</h1>
      </div>

      <div className="flex gap-6 h-[calc(100%-48px)]">
        {/* Sidebar */}
        <div className="w-96 bg-gray-50/60 border border-gray-100 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex flex-col">
          <div className="px-4 pt-4 pb-3 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 text-gray-400 -translate-y-1/2" />
              <Input
                placeholder="Search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-9 h-10 rounded-xl border-gray-200 bg-white focus-visible:ring-[#8A5BD5]"
              />
            </div>
          </div>

          {/* Work Pack List */}
          <div className="overflow-y-auto flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-6 w-6 text-[#8A5BD5] animate-spin" />
              </div>
            ) : workpacks.length === 0 ? (
              <div className="text-center text-sm text-gray-500 py-10 px-4">
                No work packs found
              </div>
            ) : (
              workpacks.map((pack) => (
                <button
                  key={pack._id}
                  onClick={() => handleSelectPack(pack._id)}
                  className={`w-full text-left px-6 py-4 border-b border-gray-100 transition-colors ${
                    selectedId === pack._id ? "bg-white" : "hover:bg-white/70"
                  }`}
                >
                  <div className="flex justify-between items-center gap-2 mb-1">
                    <p className="font-semibold text-sm text-gray-900 truncate">
                      {pack.title}
                    </p>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        statusDotColor[pack.status] || "bg-gray-300"
                      }`}
                      aria-hidden
                    />
                    <span className="text-[11px] text-gray-400">
                      {formatTimeOnly(pack.updatedAt)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2">
                    Admin: {pack.description || "No description provided"}
                  </p>
                </button>
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="border-t border-gray-100 px-4 py-3">
              <PaginationControls
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
                totalItems={totalItems}
                pageSize={limit}
              />
            </div>
          )}
        </div>

        {/* Right Content */}
        <div className="flex-1 bg-gray-50/80 border border-gray-100 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex flex-col">
          {isLoadingDetails ? (
            <div className="flex flex-1 items-center justify-center">
              <Loader2 className="h-7 w-7 text-[#8A5BD5] animate-spin" />
            </div>
          ) : !activePack ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
              <img
                src="/assets/illustrations/chat-placeholder.png"
                alt="Placeholder"
                className="w-60 mb-6"
              />
              <h2 className="text-lg font-semibold text-gray-900">
                No work pack selected
              </h2>
              <p className="text-sm text-gray-500 max-w-sm mx-auto">
                Choose a work pack from the list to see its details.
              </p>
            </div>
          ) : (
            <>
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-base font-semibold text-gray-900">
                  {activePack.title}
                </h2>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-[#8A5BD5] text-white">
                      {getInitials(activePack.createdBy?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex flex-col mb-2">
                      <span className="text-sm font-semibold text-gray-900">
                        {activePack.createdBy?.name || "Unknown"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDateTime(activePack.createdAt)}
                      </span>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-700 leading-6">
                      {activePack.description ||
                        "No description provided for this work pack."}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600">
                    WP
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col mb-2">
                      <span className="text-sm font-semibold text-gray-900">
                        Status
                      </span>
                      <span className="text-xs text-gray-500">
                        Updated {formatDateTime(activePack.updatedAt)}
                      </span>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 inline-flex items-center gap-2 text-sm text-gray-700">
                      <Badge variant="outline" className="bg-gray-100 border-gray-200">
                        {activePack.status.toUpperCase()}
                      </Badge>
                      <span className="text-gray-600">
                        Current state of this work pack.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 px-6 py-4 bg-white rounded-b-2xl flex items-center gap-3">
                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <Paperclip className="size-4 text-gray-500" />
                </button>
                <Input
                  placeholder="Type a message"
                  value={messageDraft}
                  onChange={(e) => setMessageDraft(e.target.value)}
                  className="flex-1 h-10 rounded-xl border-gray-200 focus-visible:ring-[#8A5BD5]"
                />
                <button className="p-2 rounded-full bg-[#8A5BD5] text-white hover:bg-[#7A4EC3] transition-colors">
                  <Send className="size-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SiteWorkPack;

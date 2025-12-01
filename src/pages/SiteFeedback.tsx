import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2, AlertCircle } from "lucide-react";
import { useFeedbackStore } from "@/store/feedback.store";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Feedback } from "@/types";

const SiteFeedback = () => {
  const navigate = useNavigate();
  const { siteId } = useParams();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { feedback, pagination, isLoading, error, fetchFeedback } =
    useFeedbackStore();

  const totalPages = useMemo(
    () =>
      pagination?.totalPages ||
      Math.ceil(
        (pagination?.totalItems || 0) / (pagination?.itemsPerPage || limit)
      ) ||
      0,
    [pagination, limit]
  );

  useEffect(() => {
    setPage(1);
  }, [limit]);

  useEffect(() => {
    fetchFeedback({ page, limit, siteId }).catch(() => {
      toast.error("Unable to load feedback. Please try again.");
    });
  }, [page, limit, siteId, fetchFeedback]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages) return;
    setPage(nextPage);
  };

  return (
    <div className="space-y-6">
      {/* Feedback List */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm  space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 ">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              All Feedbacks
            </h2>
          </div>
        </div>
        <div className="p-6 space-y-4">
          {isLoading && feedback.length === 0 ? (
            <div className="flex items-center gap-3 text-gray-600">
              <Loader2 className="size-5 animate-spin text-[#8A5BD5]" />
              Loading feedback...
            </div>
          ) : error ? (
            <div className="flex items-center gap-3 text-destructive">
              <AlertCircle className="size-5" />
              {error}
            </div>
          ) : feedback.length === 0 ? (
            <div className="text-gray-500">
              No feedback found for this site.
            </div>
          ) : (
            feedback.map((item: Feedback) => (
              <button
                type="button"
                key={item._id}
                onClick={() =>
                  navigate(`/dashboard/sites/${siteId}/feedback/${item._id}`)
                }
                className="w-full text-left p-5 border border-gray-100 rounded-2xl hover:shadow-sm transition-all bg-white"
              >
                <div className="flex justify-between items-start gap-3">
                  <h3 className="text-gray-900 font-medium leading-snug text-[15px] flex-1">
                    {item.title}
                  </h3>

                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "text-xs font-medium px-3 py-1 rounded-full capitalize",
                        item.status === "active"
                          ? "bg-green-50 text-green-700 border border-green-100"
                          : "bg-gray-100 text-gray-700 border border-gray-200"
                      )}
                    >
                      {item.status || "unknown"}
                    </span>
                    <p className="text-xs text-gray-400">
                      {formatDate(item.createdAt)}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mt-2">{item.description}</p>

                {/* Author */}
                <div className="flex items-center gap-3 mt-4">
                  <div className="w-9 h-9 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center text-sm font-semibold">
                    {(item.user?.name || "U").charAt(0).toUpperCase()}
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium text-gray-800">
                      {item.user?.name || "Unknown user"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.site?.name || "—"}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Pagination */}
        {feedback.length > 0 && totalPages > 1 && (
          <div className="pt-2 flex justify-end">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    className={cn(
                      "cursor-pointer",
                      page === 1 && "pointer-events-none opacity-50"
                    )}
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(page - 1);
                    }}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(
                  (pageNumber) => (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        href="#"
                        isActive={pageNumber === page}
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(pageNumber);
                        }}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    className={cn(
                      "cursor-pointer",
                      page >= totalPages && "pointer-events-none opacity-50"
                    )}
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(page + 1);
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
        <div className="flex flex-wrap items-center px-6 pb-6 justify-between gap-4">
          <div></div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600">Rows</div>
            <Select
              value={limit.toString()}
              onValueChange={(value) => setLimit(Number(value))}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteFeedback;

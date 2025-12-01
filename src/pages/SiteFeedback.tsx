import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2, AlertCircle } from "lucide-react";
import { useFeedbackStore } from "@/store/feedback.store";
import { cn } from "@/lib/utils";
import { PaginationControls } from "@/components/PaginationControls";
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
        {feedback.length > 0 && (
          <PaginationControls
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            pageSize={limit}
            onPageSizeChange={setLimit}
            pageSizeOptions={[5, 10, 20, 50]}
            totalItems={pagination?.totalItems}
            className="border-t border-gray-100 px-6 py-4"
          />
        )}
      </div>
    </div>
  );
};

export default SiteFeedback;

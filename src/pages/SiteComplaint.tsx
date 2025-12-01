import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { PaginationControls } from "@/components/PaginationControls";
import { useComplaintStore } from "@/store/complaint.store";
import { toast } from "sonner";

const SiteComplaint = () => {
  const navigate = useNavigate();
  const { siteId } = useParams();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { complains, pagination, isLoading, error, fetchComplaints } =
    useComplaintStore();

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
    fetchComplaints({
      page,
      limit,
      siteId,
    }).catch(() => {
      toast.error("Unable to load complaints. Please try again.");
    });
  }, [page, limit, siteId, fetchComplaints]);
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
      {/* Complaints List */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm  space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 ">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              All Complaints
            </h2>
          </div>
        </div>
        <div className="p-6 flex items-center gap-4 flex-wrap">
          {isLoading && complains?.length === 0 ? (
            <div className="flex items-center gap-3 text-gray-600">
              <Loader2 className="size-5 animate-spin text-[#8A5BD5]" />
              Loading complaints...
            </div>
          ) : error ? (
            <div className="flex items-center gap-3 text-destructive">
              <AlertCircle className="size-5" />
              {error}
            </div>
          ) : complains?.length === 0 ? (
            <div className="text-gray-500">
              No complaints found for this site.
            </div>
          ) : (
            complains?.map((item) => (
              <button
                type="button"
                key={item._id}
                onClick={() =>
                  navigate(`/dashboard/sites/${siteId}/complain/${item._id}`)
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
                        "text-xs font-medium px-3 py-1 rounded-full capitalize border",
                        item.status === "resolved"
                          ? "bg-green-50 text-green-700 border-green-100"
                          : item.status === "in-progress"
                          ? "bg-amber-50 text-amber-700 border-amber-100"
                          : "bg-gray-100 text-gray-700 border-gray-200"
                      )}
                    >
                      {item.status || "pending"}
                    </span>
                    <p className="text-xs text-gray-400">
                      {formatDate(item.createdAt)}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mt-2">{item.description}</p>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-3 mt-4 text-xs text-gray-600">
                  <span className="px-2 py-1 rounded-full bg-gray-100 border border-gray-200">
                    Priority: {item.priority || "n/a"}
                  </span>
                  <span className="px-2 py-1 rounded-full bg-gray-100 border border-gray-200 capitalize">
                    {item.category || "Uncategorized"}
                  </span>
                  <span className="px-2 py-1 rounded-full bg-gray-100 border border-gray-200">
                    By: {item.user?.name || "Unknown"}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Pagination */}
        {complains?.length > 0 && (
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
      {/* Header */}
    </div>
  );
};

export default SiteComplaint;

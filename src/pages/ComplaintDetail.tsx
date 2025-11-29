import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { AlertCircle, Loader2 } from "lucide-react";
import { useComplaintStore } from "@/store/complaint.store";
import { cn } from "@/lib/utils";

const ComplaintDetail = () => {
  const { id } = useParams();
  const {
    currentComplaint,
    isLoading,
    error,
    fetchComplaintById,
    clearCurrent,
  } = useComplaintStore();

  useEffect(() => {
    if (!id) return;
    fetchComplaintById(id).catch(() => undefined);
    return () => clearCurrent();
  }, [id, fetchComplaintById, clearCurrent]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (isLoading && !currentComplaint) {
    return (
      <div className="flex items-center gap-3 text-gray-600">
        <Loader2 className="size-5 animate-spin text-[#8A5BD5]" />
        Loading complaint...
      </div>
    );
  }

  if (error && !currentComplaint) {
    return (
      <div className="flex items-center gap-3 text-destructive">
        <AlertCircle className="size-5" />
        {error}
      </div>
    );
  }

  if (!currentComplaint) {
    return <div className="text-gray-500">Complaint not found.</div>;
  }

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Complaint Detail
          </h1>
          <p className="text-sm text-gray-500">
            {currentComplaint.site?.name || "All Sites"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">
            {formatDate(currentComplaint.createdAt)}
          </span>
          <span
            className={cn(
              "text-xs font-semibold px-3 py-1 rounded-full capitalize border border-gray-200 bg-gray-100 text-gray-700",
              currentComplaint.status === "resolved" && "bg-green-50 text-green-700 border-green-100",
              currentComplaint.status === "in-progress" && "bg-amber-50 text-amber-700 border-amber-100"
            )}
          >
            {currentComplaint.status || "pending"}
          </span>
        </div>
      </div>

      {/* Detail Card */}
      <div className="rounded-[20px] border border-gray-100 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-5 sm:p-6 space-y-6">
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-700">
          <span className="px-3 py-1 rounded-full bg-gray-100 border border-gray-200">
            Priority: {currentComplaint.priority || "n/a"}
          </span>
          <span className="px-3 py-1 rounded-full bg-gray-100 border border-gray-200 capitalize">
            {currentComplaint.category || "Other"}
          </span>
          <span className="px-3 py-1 rounded-full bg-gray-100 border border-gray-200">
            Assigned: {currentComplaint.assignedTo?.name || "Unassigned"}
          </span>
        </div>

        <div className="space-y-2">
          <h3 className="text-base font-semibold text-gray-900">
            {currentComplaint.title || "Untitled complaint"}
          </h3>
          <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
            {currentComplaint.description || "No description provided."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center text-sm font-semibold">
            {(currentComplaint.user?.name || "U").charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {currentComplaint.user?.name || "Deleted User"}
            </p>
            <p className="text-xs text-gray-500">
              {currentComplaint.user?.email ||
                currentComplaint.user?._id ||
                "No email"}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-900">Media</h4>
          {currentComplaint.media && currentComplaint.media.length > 0 ? (
            <div className="flex flex-wrap gap-4">
              {currentComplaint.media.map((src, idx) => (
                <img
                  key={`${src}-${idx}`}
                  src={src}
                  alt={`Complaint media ${idx + 1}`}
                  className="w-36 h-40 object-cover rounded-xl border border-gray-200 bg-gray-50"
                />
              ))}
            </div>
          ) : (
            <div className="w-36 h-40 rounded-xl border border-dashed border-gray-200 bg-gray-50 text-xs text-gray-500 flex items-center justify-center">
              No media
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetail;

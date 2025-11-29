import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Loader2, AlertCircle } from "lucide-react";
import { useFeedbackStore } from "@/store/feedback.store";
import { cn } from "@/lib/utils";

const FeedbackDetail = () => {
  const { id } = useParams();
  const {
    currentFeedback,
    isLoading,
    error,
    fetchFeedbackById,
    clearCurrent,
  } = useFeedbackStore();

  useEffect(() => {
    if (!id) return;
    fetchFeedbackById(id).catch(() => undefined);
    return () => clearCurrent();
  }, [id, fetchFeedbackById, clearCurrent]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (isLoading && !currentFeedback) {
    return (
      <div className="flex items-center gap-3 text-gray-600">
        <Loader2 className="size-5 animate-spin text-[#8A5BD5]" />
        Loading feedback...
      </div>
    );
  }

  if (error && !currentFeedback) {
    return (
      <div className="flex items-center gap-3 text-destructive">
        <AlertCircle className="size-5" />
        {error}
      </div>
    );
  }

  if (!currentFeedback) {
    return (
      <div className="text-gray-500">Feedback not found or unavailable.</div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Feedback Detail
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {currentFeedback.site?.name || "All Sites"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            {formatDate(currentFeedback.createdAt)}
          </span>
          <span
            className={cn(
              "text-xs font-medium px-3 py-1 rounded-full capitalize border",
              currentFeedback.status === "active"
                ? "bg-green-50 text-green-700 border-green-100"
                : "bg-gray-100 text-gray-700 border-gray-200"
            )}
          >
            {currentFeedback.status || "active"}
          </span>
        </div>
      </div>

      {/* Detail Card */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-5">
        <h3 className="text-gray-900 font-medium leading-snug">
          {currentFeedback.title}
        </h3>

        <p className="text-sm text-gray-600 whitespace-pre-line">
          {currentFeedback.description}
        </p>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center text-sm font-semibold">
            {(currentFeedback.user?.name || "U").charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">
              {currentFeedback.user?.name || "Unknown user"}
            </p>
            <p className="text-xs text-gray-500">{currentFeedback.user?.email}</p>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-800 mb-3">Media</h4>
          {currentFeedback.media && currentFeedback.media.length > 0 ? (
            <div className="flex gap-4 flex-wrap">
              {currentFeedback.media.map((src, idx) => (
                <img
                  key={`${src}-${idx}`}
                  src={src}
                  alt={`Feedback media ${idx + 1}`}
                  className="w-40 h-40 object-cover rounded-xl border border-gray-100"
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No media attached.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackDetail;

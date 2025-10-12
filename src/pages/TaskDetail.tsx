import { useParams } from "react-router-dom";
import { Calendar, Clock } from "lucide-react";

const TaskDetail = () => {
  const { id } = useParams();
  const taskStatus =
    id === "3" ? "Cancelled" : id === "2" ? "Completed" : "Pending";

  const statusColor =
    taskStatus === "Cancelled"
      ? "text-red-500"
      : taskStatus === "Completed"
      ? "text-emerald-500"
      : "text-[#8A5BD5]";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Task Detail</h1>
        <p className="text-muted-foreground text-sm">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
          bibendum laoreet massa quis viverra.
        </p>
      </div>

      <div className="bg-white border border-border rounded-2xl shadow-sm p-6 space-y-8">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">
              Staff Involve in Task
            </h3>
            <div className="flex items-center gap-10 mt-4">
              <div className="flex items-center gap-3">
                <img
                  src="https://i.pravatar.cc/40?img=5"
                  alt="Assigned By"
                  className="h-9 w-9 rounded-full"
                />
                <div>
                  <p className="font-medium text-gray-800">Alex Johnson</p>
                  <p className="text-xs text-gray-500">Assigned By</p>
                </div>
              </div>
              <span className="text-gray-400">→</span>
              <div className="flex items-center gap-3">
                <img
                  src="https://i.pravatar.cc/40?img=6"
                  alt="Assigned To"
                  className="h-9 w-9 rounded-full"
                />
                <div>
                  <p className="font-medium text-gray-800">Alex Johnson</p>
                  <p className="text-xs text-gray-500">Assigned To</p>
                </div>
              </div>
            </div>
          </div>

          <p className={`text-sm font-medium ${statusColor}`}>
            Status: {taskStatus}
          </p>
        </div>

        <div className="flex items-center gap-6 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#8A5BD5]" />
            <span>12 Dec</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#8A5BD5]" />
            <span>02:30 PM</span>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Item to Deliver</h3>
          <div className="flex flex-wrap gap-4">
            <div className="border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-3 bg-gray-50">
              <img src="/icons/steel.png" alt="Steel" className="h-6 w-6" />
              <div>
                <p className="font-medium text-gray-800">Steel Rods</p>
                <p className="text-xs text-gray-500">10 Tons</p>
              </div>
            </div>
            <div className="border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-3 bg-gray-50">
              <img src="/icons/bricks.png" alt="Bricks" className="h-6 w-6" />
              <div>
                <p className="font-medium text-gray-800">Bricks</p>
                <p className="text-xs text-gray-500">10,000 Units</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Note</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Pellentesque at eros nisi. Phasellus rutrum eu diam in tincidunt.
          </p>
        </div>

        {taskStatus === "Cancelled" && (
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">
              Reason of Cancellation
            </h3>
            <p className="text-sm text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
              iaculis elementum lacinia.
            </p>
          </div>
        )}

        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Note Images</h3>
          <div className="flex gap-3">
            <img
              src="https://images.unsplash.com/photo-1503387762-592deb58ef4e"
              alt="note1"
              className="h-24 w-36 rounded-lg object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1501594907352-04cda38ebc29"
              alt="note2"
              className="h-24 w-36 rounded-lg object-cover"
            />
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Site Map</h3>
          <img
            src="https://images.unsplash.com/photo-1581092334505-c326d7e6b46b"
            alt="Site Map"
            className="w-full max-w-2xl rounded-xl object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;

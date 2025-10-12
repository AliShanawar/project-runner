import React from "react";
import { Calendar, Clock, Truck, Package } from "lucide-react";

const tasks = [
  {
    id: 1,
    status: "Completed",
    assignedBy: "Alex Johnson",
    assignedTo: "Ethan Carter",
    date: "12 Dec",
    time: "02:30 PM",
    items: [
      { name: "Steel Rods", qty: "10 Tons" },
      { name: "Bricks", qty: "10,000 Units" },
    ],
    note: "Delivery completed successfully and verified on site.",
  },
  {
    id: 2,
    status: "Cancelled",
    assignedBy: "Lily Thompson",
    assignedTo: "Noah Smith",
    date: "14 Dec",
    time: "11:00 AM",
    items: [{ name: "Paint Buckets", qty: "50 Units" }],
    note: "Cancelled due to weather conditions.",
  },
];

const SiteTasks = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Site Tasks</h1>
        <p className="text-gray-500 text-sm">
          View all tasks assigned to this site, along with their current status.
        </p>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-4"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">
                Task #{task.id}
              </h2>
              <span
                className={`text-sm font-medium ${
                  task.status === "Completed"
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {task.status}
              </span>
            </div>

            <p className="text-sm text-gray-500">{task.note}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#8A5BD5]" />
                <span>
                  <strong>Assigned By:</strong> {task.assignedBy}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#8A5BD5]" />
                <span>
                  <strong>Assigned To:</strong> {task.assignedTo}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#8A5BD5]" />
                <span>
                  <strong>Date:</strong> {task.date}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#8A5BD5]" />
                <span>
                  <strong>Time:</strong> {task.time}
                </span>
              </div>
            </div>

            {/* Items */}
            <div className="flex flex-wrap gap-4 pt-3">
              {task.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-2 bg-gray-50"
                >
                  <Package className="w-4 h-4 text-[#8A5BD5]" />
                  <div>
                    <p className="font-medium text-gray-800 text-sm">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500">{item.qty}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SiteTasks;

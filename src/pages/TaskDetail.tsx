import { useEffect } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  Boxes,
  Briefcase,
  Calendar,
  ClipboardList,
  Clock,
  FileText,
  MessageCircle,
  MessageSquareWarning,
  Users,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/authStore";
import { useTaskStore } from "@/store/task.store";
import { toast } from "sonner";

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { selectedTask: task, isLoading, getTaskById, clearSelectedTask } = useTaskStore();

  useEffect(() => {
    if (id) {
      getTaskById(id).catch(() => {
        toast.error("Failed to fetch task details");
      });
    }

    return () => {
      clearSelectedTask();
    };
  }, [id, getTaskById, clearSelectedTask]);

  const navItems = [
    { label: "Task Detail", path: `/dashboard/tasks/${id}`, icon: ClipboardList },
    { label: "Active Members", path: "/dashboard/employees", icon: Users },
    { label: "Inventory", path: "/dashboard/sites", icon: Boxes },
    { label: "Chat", path: "/dashboard/sites", icon: MessageCircle },
    { label: "Feedback", path: "/dashboard/requests", icon: FileText },
    { label: "Complain", path: "/dashboard/sites", icon: MessageSquareWarning },
    { label: "Work Pack", path: "/dashboard/tasks", icon: Briefcase },
  ];

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "completed":
        return "text-emerald-500";
      case "started":
      case "material_picked":
        return "text-blue-500";
      case "pending":
        return "text-[#8A5BD5]";
      case "cancelled":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusLabel = (status?: string) => {
    if (!status) return "Unknown";
    return status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, " ");
  };

  return (
    <div className="flex h-full bg-background">
      <aside className="w-64 bg-card border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <button
            onClick={() => navigate("/dashboard/tasks")}
            className="flex items-center gap-2 text-sm text-[#8A5BD5] hover:text-[#7A4EC3] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Tasks
          </button>

          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Task #{id}
            </h2>
            <p className="text-sm text-muted-foreground">Task Workspace</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1 p-4">
          {navItems.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={label}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-[#8A5BD5] text-white shadow-sm"
                    : "text-gray-700 hover:bg-gray-100 hover:text-[#8A5BD5]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? "text-white" : "text-gray-500"
                    }`}
                  />
                  <span className="font-medium">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Hi, {user?.name}!
            </h2>
            <p className="text-sm text-muted-foreground">
              Review the selected task details below.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-muted rounded-lg transition-colors">
              <Bell size={20} className="text-foreground" />
            </button>
            <Avatar>
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user?.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-96">
              <Loader2 className="h-8 w-8 animate-spin text-[#8A5BD5]" />
            </div>
          ) : !task ? (
            <div className="text-center py-8 text-gray-500">
              Task not found
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">
                  Task Detail
                </h1>
                <p className="text-muted-foreground text-sm">
                  {task.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas bibendum laoreet massa quis viverra."}
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
                        {task.assignedBy?.profilePicture ? (
                          <img
                            src={task.assignedBy.profilePicture}
                            alt="Assigned By"
                            className="h-9 w-9 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-xs text-gray-600">
                              {task.assignedBy?.name?.charAt(0) || "?"}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-800">
                            {task.assignedBy?.name || "Unknown"}
                          </p>
                          <p className="text-xs text-gray-500">Assigned By</p>
                        </div>
                      </div>
                      <ArrowRight className="text-gray-400" size={20} />
                      <div className="flex items-center gap-3">
                        {task.assignedTo?.profilePicture ? (
                          <img
                            src={task.assignedTo.profilePicture}
                            alt="Assigned To"
                            className="h-9 w-9 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-xs text-gray-600">
                              {task.assignedTo?.name?.charAt(0) || "?"}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-800">
                            {task.assignedTo?.name || "Unknown"}
                          </p>
                          <p className="text-xs text-gray-500">Assigned To</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className={`text-sm font-medium ${getStatusColor(task.status)}`}>
                    Status: {getStatusLabel(task.status)}
                  </p>
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#8A5BD5]" />
                    <span>{task.date || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#8A5BD5]" />
                    <span>{task.time || "N/A"}</span>
                  </div>
                </div>

                {task.itemsToDeliver && task.itemsToDeliver.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900">Item to Deliver</h3>
                    <div className="flex flex-wrap gap-4">
                      {task.itemsToDeliver.map((item, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-3 bg-gray-50"
                        >
                          {item.icon ? (
                            <img src={item.icon} alt={item.name} className="h-6 w-6" />
                          ) : (
                            <div className="h-6 w-6 bg-gray-300 rounded" />
                          )}
                          <div>
                            <p className="font-medium text-gray-800">{item.name}</p>
                            <p className="text-xs text-gray-500">
                              {item.quantity} {item.unit}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {task.note && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900">Note</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {task.note}
                    </p>
                  </div>
                )}

                {task.status === "cancelled" && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900">
                      Reason of Cancellation
                    </h3>
                    <p className="text-sm text-gray-600">
                      {task.note || "No reason provided"}
                    </p>
                  </div>
                )}

                {task.images && task.images.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900">Note Images</h3>
                    <div className="flex gap-3">
                      {task.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`note${index + 1}`}
                          className="h-24 w-36 rounded-lg object-cover"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {(task.materialLocation || task.geooffication) && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900">Site Map</h3>
                    <div className="bg-gray-100 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-2">
                        {task.materialLocation?.address || task.geooffication?.address || "Location not available"}
                      </p>
                      <div className="h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400 text-sm">Map placeholder</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;

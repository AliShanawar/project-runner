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
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/authStore";

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const navItems = [
    { label: "Task Detail", path: `/dashboard/tasks/${id}`, icon: ClipboardList },
    { label: "Active Members", path: "/dashboard/employees", icon: Users },
    { label: "Inventory", path: "/dashboard/sites", icon: Boxes },
    { label: "Chat", path: "/dashboard/sites", icon: MessageCircle },
    { label: "Feedback", path: "/dashboard/requests", icon: FileText },
    { label: "Complain", path: "/dashboard/sites", icon: MessageSquareWarning },
    { label: "Work Pack", path: "/dashboard/tasks", icon: Briefcase },
  ];

  const taskStatus =
    id === "3" ? "Cancelled" : id === "2" ? "Completed" : "Pending";

  const statusColor =
    taskStatus === "Cancelled"
      ? "text-red-500"
      : taskStatus === "Completed"
      ? "text-emerald-500"
      : "text-[#8A5BD5]";

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
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                Task Detail
              </h1>
              <p className="text-muted-foreground text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Maecenas bibendum laoreet massa quis viverra.
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
                        <p className="font-medium text-gray-800">
                          Alex Johnson
                        </p>
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
                        <p className="font-medium text-gray-800">
                          Alex Johnson
                        </p>
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
                    <img
                      src="/icons/bricks.png"
                      alt="Bricks"
                      className="h-6 w-6"
                    />
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
                  Pellentesque at eros nisi. Phasellus rutrum eu diam in
                  tincidunt.
                </p>
              </div>

              {taskStatus === "Cancelled" && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">
                    Reason of Cancellation
                  </h3>
                  <p className="text-sm text-gray-600">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Maecenas iaculis elementum lacinia.
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
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;

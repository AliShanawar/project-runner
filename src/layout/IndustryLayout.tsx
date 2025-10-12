import { Outlet, useParams, NavLink, useNavigate } from "react-router-dom";
import {
  ClipboardList,
  Users,
  Boxes,
  MessageCircle,
  FileText,
  MessageSquareWarning,
  Briefcase,
  ArrowLeft,
} from "lucide-react";

const IndustryLayout = () => {
  const { siteId } = useParams();
  const navigate = useNavigate();

  const navItems = [
    { label: "Task", path: "tasks", icon: ClipboardList },
    { label: "Active Members", path: "members", icon: Users },
    { label: "Inventory", path: "inventory", icon: Boxes },
    { label: "Chat", path: "chat", icon: MessageCircle },
    { label: "Feedback", path: "feedback", icon: FileText },
    { label: "Complain", path: "complain", icon: MessageSquareWarning },
    { label: "Work Pack", path: "work-pack", icon: Briefcase },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 p-6 flex flex-col">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/dashboard/sites")}
            className="flex items-center gap-2 text-sm text-[#8A5BD5] hover:text-[#7A4EC3] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to My Sites
          </button>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Site #{siteId}
            </h2>
            <p className="text-sm text-gray-500">Industry Workspace</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          {navItems.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-150 font-medium ${
                  isActive
                    ? "bg-[#8A5BD5] text-white shadow-sm"
                    : "text-gray-700 hover:bg-gray-50 hover:text-[#8A5BD5]"
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
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default IndustryLayout;

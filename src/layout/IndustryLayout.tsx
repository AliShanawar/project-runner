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
  Bell,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/authStore";

const IndustryLayout = () => {
  const { siteId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

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
    <div className="flex h-screen bg-background">
      {/* Industry Workspace Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <button
            onClick={() => navigate("/dashboard/sites")}
            className="flex items-center gap-2 text-sm text-[#8A5BD5] hover:text-[#7A4EC3] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to My Sites
          </button>

          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Site #{siteId}
            </h2>
            <p className="text-sm text-muted-foreground">Industry Workspace</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 p-4">
          {navItems.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
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

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Hi, {user?.name}!
            </h2>
            <p className="text-sm text-muted-foreground">
              Let's check your Dashboard today
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

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default IndustryLayout;

import { Outlet, NavLink } from "react-router-dom";
import {
  ClipboardList,
  Users,
  Boxes,
  MessageCircle,
  FileText,
  MessageSquareWarning,
  Briefcase,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "@/components/Logo";
import { useAuthStore } from "@/store/authStore";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const IndustryLayout = () => {
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
    <div className="flex min-h-screen bg-[#F7F7F9]">
      {/* Sidebar */}
      <aside className="relative w-[260px] bg-white border-r border-[#EAE6F3] shadow-[0_12px_30px_rgba(17,12,34,0.04)] flex flex-col">
        <div className="px-6 py-7 border-b border-[#EAE6F3]">
          <Logo />
        </div>

        <nav className="flex flex-col gap-3 px-4 py-8 space-y-4">
          {navItems.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                cn(
                  "group inline-flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-semibold transition-all duration-200 whitespace-nowrap w-full",
                  isActive
                    ? "bg-[#8A5BD5] text-white shadow-[0_14px_28px_rgba(138,91,213,0.18)]"
                    : "text-[#8E8EA9] hover:bg-[#F4F1FD] hover:text-[#8A5BD5]"
                )
              }
            >
              {({ isActive }) => (
                <div className="flex items-center gap-3 w-full">
                  <Icon
                    className={cn(
                      "w-5 h-5 transition-colors shrink-0",
                      isActive ? "text-white" : "text-[#B3ADC7]"
                    )}
                  />
                  <span className="leading-none tracking-tight">{label}</span>
                </div>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-10 py-7">
          <div>
            <h2 className="text-2xl font-semibold text-[#1F1F39]">
              Hi, {user?.name || "there"}!
            </h2>
            <p className="text-sm text-[#8E8EA9]">
              Let's check your Dashboard today
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full border border-[#E4E2EF] hover:shadow-sm transition-shadow bg-white">
              <Bell className="w-5 h-5 text-[#8A5BD5]" />
            </button>
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-[#8A5BD5] text-white">
                {user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-10 pb-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default IndustryLayout;

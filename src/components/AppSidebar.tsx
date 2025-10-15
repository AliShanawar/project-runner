import { useState } from "react";
import {
  Globe,
  FileText,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "../components/ui/sidebar";
import { useAuthStore } from "../store/authStore";
import Logo from "./Logo";

export function AppSidebar() {
  const logout = useAuthStore((state) => state.logout);
  const [collapsed, setCollapsed] = useState(false);
  const { pathname } = useLocation();

  const siteMenu = [
    { title: "My Sites", url: "/dashboard/sites", icon: Globe },
    { title: "Request", url: "/dashboard/requests", icon: FileText },
    { title: "My Employees", url: "/dashboard/employees", icon: Users },
    { title: "Setting", url: "/dashboard/settings", icon: Settings },
  ];

  const activeMenu = siteMenu;

  // Auto-collapse when in industry workspace
  const isIndustryWorkspace = pathname.startsWith("/dashboard/sites/");
  const effectiveCollapsed = isIndustryWorkspace || collapsed;

  const isActiveMenu = (url: string) =>
    pathname === url || pathname.startsWith(`${url}/`);

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-gray-200"
    >
      {/* Logo + Collapse Button */}
      <div className="p-6 flex items-center justify-between">
        {!effectiveCollapsed && <Logo />}
        {effectiveCollapsed && <div className="w-8 h-8" />}
        {!isIndustryWorkspace && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-md hover:bg-gray-100 transition"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        )}
      </div>

      {/* Main Content */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {activeMenu.map((item) => {
                const isActive = isActiveMenu(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <NavLink
                        to={item.url}
                        className={`
                        flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                        ${
                          isActive
                            ? "!bg-[#8A5BD5] !text-white font-medium shadow-sm hover:!bg-[#8A5BD5] hover:!text-white"
                            : "text-gray-600 hover:text-[#8A5BD5] hover:bg-[#8A5BD5]/10"
                        }
                        ${effectiveCollapsed ? "justify-center" : ""}
                      `}
                      >
                        <item.icon size={20} />
                        {!effectiveCollapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Logout */}
        <div className="mt-auto p-4">
          <button
            onClick={logout}
            className={`flex items-center cursor-pointer gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-[#8A5BD5]/10 hover:text-[#8A5BD5] transition-all w-full ${
              effectiveCollapsed ? "justify-center" : ""
            }`}
          >
            <LogOut size={20} />
            {!effectiveCollapsed && <span>Logout</span>}
          </button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

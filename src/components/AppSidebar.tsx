import { Globe, FileText, Users, Settings, LogOut } from "lucide-react";
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
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const logout = useAuthStore((state) => state.logout);
  const { pathname } = useLocation();
  const pathSegments = pathname.split("/").filter(Boolean);
  const isIconOnly =
    pathname.startsWith("/dashboard/sites") && pathSegments.length > 2;

  const siteMenu = [
    { title: "My Sites", url: "/dashboard/sites", icon: Globe },
    { title: "Request", url: "/dashboard/requests", icon: FileText },
    { title: "My Employees", url: "/dashboard/employees", icon: Users },
    { title: "Setting", url: "/dashboard/settings", icon: Settings },
  ];

  const activeMenu = siteMenu;

  const isActiveMenu = (url: string) =>
    pathname === url || pathname.startsWith(`${url}/`);

  return (
    <Sidebar
      collapsible="none"
      className={cn(
        "relative border-r border-[#EAE6F3] bg-white shadow-[0_12px_30px_rgba(17,12,34,0.04)]",
        isIconOnly ? "w-[84px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "border-b border-[#EAE6F3] py-7",
          isIconOnly ? "flex justify-center px-4" : "px-6"
        )}
      >
        <Logo />
      </div>

      {/* Main Content */}
      <SidebarContent className={cn("py-6", isIconOnly ? "px-2" : "px-3")}>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-4">
              {activeMenu.map((item) => {
                const isActive = isActiveMenu(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={cn(
                        "flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200",
                        isIconOnly ? "justify-center" : "gap-3",
                        isActive
                          ? "bg-[#8A5BD5] text-white shadow-[0_14px_30px_rgba(138,91,213,0.2)]"
                          : "text-[#8E8EA9] hover:bg-[#F4F1FD] hover:text-[#8A5BD5]"
                      )}
                    >
                      <NavLink
                        to={item.url}
                        className={cn(
                          "flex items-center",
                          isIconOnly ? "" : "gap-3"
                        )}
                      >
                        <item.icon
                          size={22}
                          className={cn(
                            "transition-colors",
                            isActive
                              ? "text-white bg-[#8A5BD5] "
                              : "text-[#B3ADC7]"
                          )}
                        />
                        <span className={cn(isIconOnly && "sr-only")}>
                          {item.title}
                        </span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Logout */}
        <div className="mt-auto px-1 pt-6">
          <button
            onClick={logout}
            className={cn(
              "flex items-center cursor-pointer px-4 py-3 rounded-xl text-[#8E8EA9] hover:bg-[#F4F1FD] hover:text-[#8A5BD5] transition-all w-full",
              isIconOnly ? "justify-center" : "gap-3"
            )}
          >
            <LogOut size={20} className="text-[#B3ADC7]" />
            <span className={cn(isIconOnly && "sr-only")}>Logout</span>
          </button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

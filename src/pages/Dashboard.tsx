import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Bell } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/authStore";
import { AppSidebar } from "@/components/AppSidebar";
import { cn } from "@/lib/utils";

const Dashboard = () => {
  const { isAuthenticated, user } = useAuthStore();
  const { pathname } = useLocation();
  const isIndustryWorkspace = pathname.startsWith("/dashboard/sites/");

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />

        <div className="flex-1 flex flex-col">
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

          <main className={cn("flex-1 p-6", isIndustryWorkspace && "p-0")}>
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;

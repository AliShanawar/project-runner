import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/authStore";
import { AppSidebar } from "@/components/AppSidebar";
import { cn } from "@/lib/utils";

const Dashboard = () => {
  const { isAuthenticated, user } = useAuthStore();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const profileImage = user?.image || user?.profilePicture;
  const isIndustryWorkspace = pathname.startsWith("/dashboard/sites/");
  const isTaskDetail =
    pathname.startsWith("/dashboard/tasks/") &&
    pathname.split("/").filter(Boolean).length === 4;

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <SidebarProvider open={!isIndustryWorkspace && !isTaskDetail}>
      <div className="h-screen overflow-hidden flex w-full bg-background">
        {!isTaskDetail && <AppSidebar />}

        <div className="flex-1 flex flex-col">
          {!isIndustryWorkspace && !isTaskDetail && (
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
                <button
                  type="button"
                  onClick={() => navigate("/dashboard/settings")}
                  className="cursor-pointer rounded-full"
                  aria-label="Open settings"
                >
                  <Avatar>
                    {profileImage && (
                      <AvatarImage
                        src={profileImage}
                        alt={user?.name || "Profile"}
                      />
                    )}
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </div>
            </header>
          )}

          <main
            className={cn(
              "flex-1 overflow-y-auto",
              !isIndustryWorkspace && !isTaskDetail && "p-6"
            )}
          >
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;

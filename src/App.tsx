import type { ReactElement } from "react";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ForgotPassword from "./pages/ForgotPassword";
import ConfirmEmail from "./pages/ConfirmEmail";
import CreatePassword from "./pages/CreatePassword";
import CreateProfile from "./pages/CreateProfile";
import Dashboard from "./pages/Dashboard";
import { useAuthStore } from "./store/authStore";
import Requests from "./pages/Requests";
import RequestDetail from "./pages/RequestDetailsPage";
import Tasks from "./pages/Tasks";
import Sites from "./pages/Sites";
import NotFound from "./pages/NotFound";
import Employees from "./pages/Employee";
import Setting from "./pages/Setting";
import TaskDetail from "./pages/TaskDetail";
import SiteOverview from "./pages/SiteOverview";
import SiteMembers from "./pages/SiteMembers";
import SiteTasks from "./pages/SiteTasks";
import IndustryLayout from "./layout/IndustryLayout";
import SiteInventory from "./pages/SiteInventory";
import SiteChat from "./pages/SiteChat";
import SiteFeedback from "./pages/SiteFeedback";
import SiteComplaint from "./pages/SiteComplaint";
import ComplaintDetail from "./pages/ComplaintDetail";
import SiteWorkPack from "./pages/SiteWorkPack";
import SiteHSLogs from "./pages/SiteHSLogs";
import { SignIn } from "./pages/Login";
import FeedbackDetail from "./pages/FeedbackDetail";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    },
    mutations: {
      retry: 0,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ReactQueryDevtools initialIsOpen={false} />
    <TooltipProvider>
      <Sonner
        position="top-right"
        theme="light"
        richColors
        duration={4000}
        closeButton
        toastOptions={{
          classNames: {
            toast:
              "bg-white/95 text-gray-900 border border-gray-200 shadow-lg backdrop-blur rounded-xl",
            title: "font-semibold text-gray-900",
            description: "text-gray-700",
            actionButton: "bg-[#8A5BD5] text-white",
            cancelButton: "text-gray-600",
          },
        }}
      />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <PublicRoute>
                <SignIn />
              </PublicRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            }
          />
          <Route
            path="/confirm-email"
            element={
              <PublicRoute>
                <ConfirmEmail />
              </PublicRoute>
            }
          />
          <Route
            path="/create-password"
            element={
              <PublicRoute>
                <CreatePassword />
              </PublicRoute>
            }
          />
          <Route
            path="/create-profile"
            element={
              <PublicRoute>
                <CreateProfile />
              </PublicRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard/tasks" replace />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="sites/task" element={<Tasks />} />
            <Route path="requests" element={<Requests />} />
            <Route path="requests/:id" element={<RequestDetail />} />
            <Route path="sites" element={<Sites />} />
            <Route path="sites/:siteId" element={<IndustryLayout />}>
              <Route index element={<Navigate to="overview" replace />} />
              <Route path="overview" element={<SiteOverview />} />
              <Route path="members" element={<SiteMembers />} />
              <Route path="tasks" element={<SiteTasks />} />
              <Route path="tasks/:id" element={<TaskDetail />} />
              <Route
                path="/dashboard/sites/:siteId/inventory"
                element={<SiteInventory />}
              />
              <Route path="chat" element={<SiteChat />} />
              <Route path="feedback" element={<SiteFeedback />} />
              <Route path="feedback/:id" element={<FeedbackDetail />} />
              <Route path="complain" element={<SiteComplaint />} />
              <Route path="complain/:id" element={<ComplaintDetail />} />
              <Route path="hs-logs" element={<SiteHSLogs />} />
              <Route path="work-pack" element={<SiteWorkPack />} />
            </Route>
            <Route path="employees" element={<Employees />} />
            <Route
              path="settings"
              element={
                <div>
                  <Setting />
                </div>
              }
            />
          </Route>

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

const ProtectedRoute = ({ children }: { children: ReactElement }) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const PublicRoute = ({ children }: { children: ReactElement }) => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default App;

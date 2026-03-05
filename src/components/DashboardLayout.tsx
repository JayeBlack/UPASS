import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import Sidebar, { MobileHeader } from "./Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { LogOut, Bell } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { isAuthenticated, user, logout } = useAuth();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  if (!isAuthenticated) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <MobileHeader />
      
      <div className={`no-print ${isMobile ? "p-4" : "ml-64 p-8"} flex items-center justify-between gap-6 border-b border-border bg-background/50 backdrop-blur-sm sticky top-0 z-30`}>
        {user && (
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-foreground">
              Welcome, {user.name.split(" ")[0]}
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              {user.role === "Student" && user.indexNumber && (
                <p className="text-sm text-muted-foreground">{user.indexNumber}</p>
              )}
              {user.role === "Student" && user.indexNumber && user.email && (
                <span className="hidden sm:inline text-muted-foreground">·</span>
              )}
              <p className="text-sm text-muted-foreground">{user.email}</p>
              {user.department && (
                <>
                  <span className="hidden sm:inline text-muted-foreground">·</span>
                  <p className="text-sm text-muted-foreground">{user.department}</p>
                </>
              )}
            </div>
          </div>
        )}

        {user && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/notifications")}
              className="relative p-2 rounded-lg hover:bg-muted transition-colors"
              title="Notifications"
            >
              <Bell size={20} className="text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive" />
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-muted transition-colors">
                  <Avatar className="w-9 h-9">
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback className="gradient-gold text-secondary-foreground text-sm font-bold">
                      {user.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:flex flex-col items-start">
                    <p className="text-sm font-medium text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.role}</p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem disabled className="flex flex-col items-start py-2">
                  <span className="text-sm font-medium">{user.name}</span>
                  <span className="text-xs text-muted-foreground">{user.email}</span>
                  {user.role === "Student" && user.indexNumber && (
                    <span className="text-xs text-muted-foreground">{user.indexNumber}</span>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut size={14} className="mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      <main className={`${isMobile ? "p-4" : "ml-64 p-8"} animate-fade-in`}>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;

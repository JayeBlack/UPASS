import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-64 p-8 animate-fade-in">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;

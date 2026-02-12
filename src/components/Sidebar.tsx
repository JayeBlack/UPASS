import { useAuth, type UserRole } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import {
  BookOpen,
  FileText,
  BarChart3,
  Users,
  ClipboardCheck,
  DollarSign,
  ListChecks,
  Upload,
  Eye,
  MessageSquare,
  LogOut,
  GraduationCap,
  LayoutDashboard,
} from "lucide-react";

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const navByRole: Record<UserRole, NavItem[]> = {
  Student: [
    { label: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { label: "Register Courses", path: "/courses/register", icon: <BookOpen size={20} /> },
    { label: "Upload Thesis", path: "/thesis/upload", icon: <Upload size={20} /> },
    { label: "Check Results", path: "/results", icon: <BarChart3 size={20} /> },
  ],
  Supervisor: [
    { label: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { label: "Assigned Students", path: "/students", icon: <Users size={20} /> },
    { label: "Review Submissions", path: "/submissions", icon: <Eye size={20} /> },
    { label: "Give Remarks", path: "/remarks", icon: <MessageSquare size={20} /> },
  ],
  Admin: [
    { label: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { label: "Manage Students", path: "/admin/students", icon: <Users size={20} /> },
    { label: "Fees Status", path: "/admin/fees", icon: <DollarSign size={20} /> },
    { label: "Generate Pass List", path: "/admin/passlist", icon: <ListChecks size={20} /> },
  ],
};

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const items = navByRole[user.role];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar text-sidebar-foreground flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg gradient-gold flex items-center justify-center">
            <GraduationCap size={22} className="text-secondary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold text-sidebar-foreground">PG-SIMS</h1>
            <p className="text-xs text-sidebar-foreground/60">UMaT Postgraduate</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* User info */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full gradient-gold flex items-center justify-center text-sm font-bold text-secondary-foreground">
            {user.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-sidebar-foreground/50">{user.role}</p>
          </div>
        </div>
        <button
          onClick={() => { logout(); navigate("/"); }}
          className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

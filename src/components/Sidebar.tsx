import { useAuth, type UserRole } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import {
  BookOpen,
  FileText,
  BarChart3,
  GraduationCap,
  Users,
  ClipboardCheck,
  Banknote,
  ListChecks,
  Upload,
  Eye,
  MessageSquare,
  Bot,
  LogOut,
  LayoutDashboard,
  Menu,
  Calendar,
  Shield,
  Bell,
  PieChart,
  Send,
} from "lucide-react";
import umatLogo from "@/assets/umat-logo.png";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const navByRole: Record<UserRole, NavItem[]> = {
  Student: [
    { label: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { label: "Register Courses", path: "/courses/register", icon: <BookOpen size={20} /> },
    { label: "Exam Timetable", path: "/exams", icon: <Calendar size={20} /> },
    { label: "Upload Thesis", path: "/thesis/upload", icon: <Upload size={20} /> },
    { label: "Check Results", path: "/results", icon: <BarChart3 size={20} /> },
    { label: "Financial Status", path: "/finances", icon: <Banknote size={20} /> },
    { label: "Request Documents", path: "/documents", icon: <FileText size={20} /> },
    { label: "Clearance", path: "/clearance", icon: <Shield size={20} /> },
  ],
  Supervisor: [
    { label: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { label: "Assigned Students", path: "/students", icon: <Users size={20} /> },
    { label: "Review Submissions", path: "/submissions", icon: <Eye size={20} /> },
    { label: "Templates & Notices", path: "/supervisor/templates", icon: <FileText size={20} /> },
    { label: "AI Assistant", path: "/supervisor/ai", icon: <MessageSquare size={20} /> },
  ],
  Admin: [
    { label: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { label: "Analytics", path: "/admin/analytics", icon: <PieChart size={20} /> },
    { label: "Manage Students", path: "/admin/students", icon: <Users size={20} /> },
    { label: "Fees Status", path: "/admin/fees", icon: <Banknote size={20} /> },
    { label: "Generate Pass List", path: "/admin/passlist", icon: <ListChecks size={20} /> },
  ],
  Dean: [
    { label: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { label: "Analytics", path: "/admin/analytics", icon: <PieChart size={20} /> },
    { label: "Manage Students", path: "/admin/students", icon: <Users size={20} /> },
    { label: "Clearance Approvals", path: "/dean/clearance", icon: <ClipboardCheck size={20} /> },
    { label: "Pass List", path: "/admin/passlist", icon: <ListChecks size={20} /> },
    { label: "CWA Results", path: "/dean/results", icon: <BarChart3 size={20} /> },
  ],
  Accountant: [
    { label: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { label: "Fee Analytics", path: "/accountant/analytics", icon: <PieChart size={20} /> },
    { label: "Student Fees", path: "/admin/fees", icon: <Banknote size={20} /> },
    { label: "Export Reports", path: "/accountant/reports", icon: <FileText size={20} /> },
  ],
  ExamsOfficer: [
    { label: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { label: "Grade Entry", path: "/exams/grades", icon: <BookOpen size={20} /> },
    { label: "Pass List", path: "/exams/passlist", icon: <ListChecks size={20} /> },
    { label: "Publish Results", path: "/exams/publish", icon: <Send size={20} /> },
    { label: "Analytics", path: "/admin/analytics", icon: <PieChart size={20} /> },
    { label: "Students", path: "/admin/students", icon: <Users size={20} /> },
    { label: "Fees Status", path: "/admin/fees", icon: <Banknote size={20} /> },
  ],
};

const SidebarContent = ({ onNavigate }: { onNavigate?: () => void }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const items = navByRole[user.role];

  const handleNav = (path: string) => {
    navigate(path);
    onNavigate?.();
  };

  return (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <img src={umatLogo} alt="UMaT Logo" className="w-10 h-10 object-contain" />
          <div>
            <h1 className="font-display text-sm font-bold text-sidebar-foreground leading-tight">Postgraduate</h1>
            <p className="text-xs text-sidebar-foreground/60">Support System</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => handleNav(item.path)}
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

    </div>
  );
};

export const MobileHeader = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  return (
    <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-border bg-background px-4 py-3 md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button className="p-2 rounded-lg hover:bg-muted transition-colors">
            <Menu size={22} className="text-foreground" />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72 border-none">
          <SidebarContent onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
      <img src={umatLogo} alt="UMaT Logo" className="w-8 h-8 object-contain" />
      <span className="font-display text-sm font-bold text-foreground">Postgraduate</span>
    </header>
  );
};

const Sidebar = () => {
  const isMobile = useIsMobile();

  if (isMobile) return null;

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 z-50">
      <SidebarContent />
    </aside>
  );
};

export default Sidebar;

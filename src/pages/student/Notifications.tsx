import DashboardLayout from "@/components/DashboardLayout";
import { Bell, Banknote, FileText, Calendar, CheckCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "fee" | "thesis" | "exam" | "general" | "clearance";
  severity: "info" | "warning" | "success";
  date: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  { id: "1", title: "Fee Payment Reminder", message: "You have an outstanding balance of GH₵ 1,600.00 for Semester 2, 2023/2024. Please settle before registration closes.", type: "fee", severity: "warning", date: "2026-02-14", read: false },
  { id: "2", title: "Thesis Feedback Available", message: "Dr. Abena Osei has reviewed your Chapter 2 submission. Check your thesis page for comments.", type: "thesis", severity: "info", date: "2026-02-13", read: false },
  { id: "3", title: "Exam Timetable Published", message: "The end-of-semester exam timetable for Semester 1, 2025/2026 has been published.", type: "exam", severity: "info", date: "2026-02-12", read: true },
  { id: "4", title: "Course Registration Deadline", message: "Course registration for Semester 1 closes on 28th February 2026.", type: "general", severity: "warning", date: "2026-02-10", read: true },
  { id: "5", title: "Library Clearance Approved", message: "Your library clearance has been approved by Mrs. Akua Boateng.", type: "clearance", severity: "success", date: "2026-02-08", read: true },
  { id: "6", title: "Results Published", message: "Results for Semester 2, 2024/2025 have been published.", type: "general", severity: "info", date: "2026-01-20", read: true },
];

const typeIcons: Record<string, React.ReactNode> = {
  fee: <Banknote size={16} />,
  thesis: <FileText size={16} />,
  exam: <Calendar size={16} />,
  general: <Bell size={16} />,
  clearance: <CheckCircle size={16} />,
};

const severityStyles: Record<string, string> = {
  info: "bg-info/10 text-info",
  warning: "bg-warning/10 text-warning",
  success: "bg-success/10 text-success",
};

const Notifications = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const { toast } = useToast();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const deleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const notif = notifications.find((n) => n.id === id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast({ title: "Notification deleted", description: notif?.title });
  };

  const formatDate = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground">Notifications</h1>
          <p className="text-muted-foreground mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "All caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="text-sm text-muted-foreground hover:text-foreground transition-colors self-start">
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <Bell size={48} className="mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-sm text-muted-foreground">No notifications</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markRead(n.id)}
              className={`bg-card rounded-xl border p-4 sm:p-5 cursor-pointer transition-all hover:bg-muted/30 ${
                n.read ? "border-border" : "border-secondary/50 bg-secondary/5"
              }`}
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${severityStyles[n.severity]}`}>
                  {typeIcons[n.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-medium ${n.read ? "text-foreground" : "text-foreground font-semibold"}`}>
                      {n.title}
                    </p>
                    <div className="flex items-center gap-2 shrink-0">
                      {!n.read && <span className="w-2 h-2 rounded-full bg-secondary" />}
                      <button
                        onClick={(e) => deleteNotification(n.id, e)}
                        className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        title="Delete notification"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{n.message}</p>
                  <p className="text-xs text-muted-foreground/60 mt-2">{formatDate(n.date)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Notifications;

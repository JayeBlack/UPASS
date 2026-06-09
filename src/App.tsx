import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DataStoreProvider } from "@/contexts/DataStoreContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ChangePassword from "./pages/ChangePassword";
import RequireAuth from "./components/RequireAuth";
import CourseRegistration from "./pages/student/CourseRegistration";
import ThesisUpload from "./pages/student/ThesisUpload";
import Results from "./pages/student/Results";
import FinancialStatus from "./pages/student/FinancialStatus";
import Transcript from "./pages/student/Transcript";
import DocumentRequests from "./pages/student/DocumentRequests";
import Clearance from "./pages/student/Clearance";
import Notifications from "./pages/student/Notifications";
import ChatAssistant from "./pages/student/ChatAssistant";
import AssignedStudents from "./pages/supervisor/AssignedStudents";
import ReviewSubmissions from "./pages/supervisor/ReviewSubmissions";
import TemplatesAnnouncements from "./pages/supervisor/TemplatesAnnouncements";
import AIAssistant from "./pages/supervisor/AIAssistant";
import GradeEntry from "./pages/exams-officer/GradeEntry";
import GeneratePassList from "./pages/exams-officer/GeneratePassList";
import PublishResults from "./pages/exams-officer/PublishResults";

import ManageStudents from "./pages/admin/ManageStudents";
import ManageDocuments from "./pages/admin/ManageDocuments";
import FeesStatus from "./pages/admin/FeesStatus";
import PassList from "./pages/admin/PassList";
import Analytics from "./pages/admin/Analytics";
import SystemLog from "./pages/admin/SystemLog";
import ManageUsers from "./pages/admin/ManageUsers";
import SupervisorAssignments from "./pages/admin/SupervisorAssignments";
import ClearanceApprovals from "./pages/dean/ClearanceApprovals";
import CWAResults from "./pages/dean/CWAResults";
import DeanDocuments from "./pages/dean/DeanDocuments";
import FeeAnalytics from "./pages/accountant/FeeAnalytics";
import ExportReports from "./pages/accountant/ExportReports";
import FeeAnnouncements from "./pages/accountant/FeeAnnouncements";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <DataStoreProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/change-password" element={<RequireAuth><ChangePassword /></RequireAuth>} />
            <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
            {/* Student */}
            <Route path="/courses/register" element={<RequireAuth><CourseRegistration /></RequireAuth>} />
            <Route path="/thesis/upload" element={<RequireAuth><ThesisUpload /></RequireAuth>} />
            <Route path="/results" element={<RequireAuth><Results /></RequireAuth>} />
            <Route path="/finances" element={<RequireAuth><FinancialStatus /></RequireAuth>} />
            <Route path="/transcript" element={<RequireAuth><DocumentRequests /></RequireAuth>} />
            <Route path="/documents" element={<RequireAuth><DocumentRequests /></RequireAuth>} />
            <Route path="/clearance" element={<RequireAuth><Clearance /></RequireAuth>} />
            <Route path="/student/chat" element={<RequireAuth><ChatAssistant /></RequireAuth>} />
            <Route path="/notifications" element={<RequireAuth><Notifications /></RequireAuth>} />
            {/* Supervisor */}
            <Route path="/students" element={<RequireAuth><AssignedStudents /></RequireAuth>} />
            <Route path="/submissions" element={<RequireAuth><ReviewSubmissions /></RequireAuth>} />
            <Route path="/supervisor/templates" element={<RequireAuth><TemplatesAnnouncements /></RequireAuth>} />
            <Route path="/supervisor/ai" element={<RequireAuth><AIAssistant /></RequireAuth>} />
            {/* Admin */}
            <Route path="/admin/students" element={<RequireAuth><ManageStudents /></RequireAuth>} />
            <Route path="/admin/fees" element={<RequireAuth><FeesStatus /></RequireAuth>} />
            <Route path="/admin/passlist" element={<RequireAuth><PassList /></RequireAuth>} />
            <Route path="/admin/analytics" element={<RequireAuth><Analytics /></RequireAuth>} />
            <Route path="/admin/log" element={<RequireAuth><SystemLog /></RequireAuth>} />
            <Route path="/admin/documents" element={<RequireAuth><ManageDocuments /></RequireAuth>} />
            <Route path="/admin/users" element={<RequireAuth><ManageUsers /></RequireAuth>} />
            <Route path="/admin/assignments" element={<RequireAuth><SupervisorAssignments /></RequireAuth>} />
            {/* Dean */}
            <Route path="/dean/clearance" element={<RequireAuth><ClearanceApprovals /></RequireAuth>} />
            <Route path="/dean/results" element={<RequireAuth><CWAResults /></RequireAuth>} />
            <Route path="/dean/documents" element={<RequireAuth><DeanDocuments /></RequireAuth>} />
            {/* Accountant */}
            <Route path="/accountant/analytics" element={<RequireAuth><FeeAnalytics /></RequireAuth>} />
            <Route path="/accountant/reports" element={<RequireAuth><ExportReports /></RequireAuth>} />
            <Route path="/accountant/announcements" element={<RequireAuth><FeeAnnouncements /></RequireAuth>} />
            {/* Exams Officer */}
            <Route path="/exams/grades" element={<RequireAuth><GradeEntry /></RequireAuth>} />
            <Route path="/exams/passlist" element={<RequireAuth><GeneratePassList /></RequireAuth>} />
            <Route path="/exams/publish" element={<RequireAuth><PublishResults /></RequireAuth>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </DataStoreProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

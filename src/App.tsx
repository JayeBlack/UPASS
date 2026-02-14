import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CourseRegistration from "./pages/student/CourseRegistration";
import ThesisUpload from "./pages/student/ThesisUpload";
import Results from "./pages/student/Results";
import FinancialStatus from "./pages/student/FinancialStatus";
import Transcript from "./pages/student/Transcript";
import DocumentRequests from "./pages/student/DocumentRequests";
import ExamTimetable from "./pages/student/ExamTimetable";
import Clearance from "./pages/student/Clearance";
import Notifications from "./pages/student/Notifications";
import AssignedStudents from "./pages/supervisor/AssignedStudents";
import ReviewSubmissions from "./pages/supervisor/ReviewSubmissions";
import Remarks from "./pages/supervisor/Remarks";
import ManageStudents from "./pages/admin/ManageStudents";
import FeesStatus from "./pages/admin/FeesStatus";
import PassList from "./pages/admin/PassList";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            {/* Student */}
            <Route path="/courses/register" element={<CourseRegistration />} />
            <Route path="/thesis/upload" element={<ThesisUpload />} />
            <Route path="/results" element={<Results />} />
            <Route path="/finances" element={<FinancialStatus />} />
            <Route path="/transcript" element={<Transcript />} />
            <Route path="/documents" element={<DocumentRequests />} />
            <Route path="/exams" element={<ExamTimetable />} />
            <Route path="/clearance" element={<Clearance />} />
            <Route path="/notifications" element={<Notifications />} />
            {/* Supervisor */}
            <Route path="/students" element={<AssignedStudents />} />
            <Route path="/submissions" element={<ReviewSubmissions />} />
            <Route path="/remarks" element={<Remarks />} />
            {/* Admin */}
            <Route path="/admin/students" element={<ManageStudents />} />
            <Route path="/admin/fees" element={<FeesStatus />} />
            <Route path="/admin/passlist" element={<PassList />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

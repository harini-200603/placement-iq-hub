import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SidebarLayout } from "@/components/SidebarLayout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import MockTest from "./pages/MockTest";
import Preparation from "./pages/Preparation";
import TopicContent from "./pages/TopicContent";
import Practice from "./pages/Practice";
import CodingPractice from "./pages/CodingPractice";
import InterviewPractice from "./pages/InterviewPractice";
import Certificates from "./pages/Certificates";
import Learn from "./pages/Learn";
import LearnSubject from "./pages/LearnSubject";
import LearnTopic from "./pages/LearnTopic";
import SmartTools from "./pages/SmartTools";
import FacultyDashboard from "./pages/FacultyDashboard";
import AllInOneTest from "./pages/AllInOneTest";
import ProgrammingHub from "./pages/ProgrammingHub";
import Achievements from "./pages/Achievements";
import Mentor from "./pages/Mentor";
import MistakeNotebook from "./pages/MistakeNotebook";
import Leaderboard from "./pages/Leaderboard";
import NotFound from "./pages/NotFound";
import { GamificationToaster } from "@/components/gamification/GamificationToaster";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <GamificationToaster />
          <Routes>
            {/* Public routes without sidebar */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />

            {/* App routes with sidebar */}
            <Route path="/dashboard" element={<SidebarLayout><Dashboard /></SidebarLayout>} />
            <Route path="/preparation/:module" element={<SidebarLayout><Preparation /></SidebarLayout>} />
            <Route path="/topic/:module/:topic" element={<SidebarLayout><TopicContent /></SidebarLayout>} />
            <Route path="/mock-test/:module" element={<SidebarLayout><MockTest /></SidebarLayout>} />
            <Route path="/practice/:module" element={<SidebarLayout><Practice /></SidebarLayout>} />
            <Route path="/coding-practice" element={<SidebarLayout><CodingPractice /></SidebarLayout>} />
            <Route path="/interview-practice" element={<SidebarLayout><InterviewPractice /></SidebarLayout>} />
            <Route path="/certificates" element={<SidebarLayout><Certificates /></SidebarLayout>} />
            <Route path="/learn" element={<SidebarLayout><Learn /></SidebarLayout>} />
            <Route path="/learn/:subjectId" element={<SidebarLayout><LearnSubject /></SidebarLayout>} />
            <Route path="/learn/:subjectId/:topicId" element={<SidebarLayout><LearnTopic /></SidebarLayout>} />
            <Route path="/smart-tools" element={<SidebarLayout><SmartTools /></SidebarLayout>} />
            <Route path="/faculty" element={<SidebarLayout><FacultyDashboard /></SidebarLayout>} />
            <Route path="/all-in-one-test" element={<SidebarLayout><AllInOneTest /></SidebarLayout>} />
            <Route path="/programming" element={<SidebarLayout><ProgrammingHub /></SidebarLayout>} />
            <Route path="/achievements" element={<SidebarLayout><Achievements /></SidebarLayout>} />
            <Route path="/mentor" element={<SidebarLayout><Mentor /></SidebarLayout>} />
            <Route path="/mistakes" element={<SidebarLayout><MistakeNotebook /></SidebarLayout>} />
            <Route path="/leaderboard" element={<SidebarLayout><Leaderboard /></SidebarLayout>} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

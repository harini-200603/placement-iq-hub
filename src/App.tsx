import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Modules from "./pages/Modules";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/modules" element={<Modules />} />
            <Route path="/preparation/:module" element={<Preparation />} />
            <Route path="/topic/:module/:topic" element={<TopicContent />} />
            <Route path="/mock-test/:module" element={<MockTest />} />
            <Route path="/practice/:module" element={<Practice />} />
            <Route path="/coding-practice" element={<CodingPractice />} />
            <Route path="/interview-practice" element={<InterviewPractice />} />
            <Route path="/certificates" element={<Certificates />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/learn/:subjectId" element={<LearnSubject />} />
            <Route path="/learn/:subjectId/:topicId" element={<LearnTopic />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AISupportChat from "./pages/AISupportChat";
import CommunityPage from "./pages/CommunityPage";
import ProgramSignupPage from "./pages/ProgramSignupPage";
import LoginPage from "./pages/Login";
import AuthApp from "./pages/LoginAndSignup";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/ai-support" element={<AISupportChat />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/program-signup" element={<ProgramSignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/pages/LoginAndSignup" element={<AuthApp />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

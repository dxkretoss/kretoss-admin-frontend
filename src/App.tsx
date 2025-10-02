import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { AppProvider } from "@/context/AppContext";
import Layout from "@/components/Layout";
import Dashboard from "@/components/Dashboard";
import JobPosts from "@/components/JobPosts";
import Applications from "@/components/Applications";
import Contacts from "@/components/Contacts";
import NotFound from "./pages/NotFound";
import JobFormPage from "./components/JobForm";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppProvider>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="jobs" element={<JobPosts />} />
                <Route path="job/add" element={<JobFormPage />} />
                <Route path="job/edit/:id" element={<JobFormPage />} />
                <Route path="applications" element={<Applications />} />
                <Route path="contacts" element={<Contacts />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

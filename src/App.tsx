import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOTP from "./pages/VerifyOTP";
import Dashboard from "./pages/Dashboard";
import EntityManagement from "./pages/EntityManagement";
import CreateEntity from "./pages/CreateEntity";
import EntityDetails from "./pages/EntityDetails";
import NotFound from "./pages/NotFound";
import Meetings from "./pages/Meetings";
import CreateMeeting from "./pages/CreateMeeting";
import LiveMeeting from "./pages/LiveMeeting";
import MeetingDetails from "./pages/MeetingDetails";
import EVoting from "./pages/EVoting";
import CreateVotingRequest from "./pages/CreateVotingRequest";
import VotingParticipant from "./pages/VotingParticipant";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Entity Management Routes */}
          <Route path="/entity-management" element={<EntityManagement />} />
          <Route path="/create-entity" element={<CreateEntity />} />
          <Route path="/edit-entity/:id" element={<CreateEntity />} />
          <Route path="/entity/:id" element={<EntityDetails />} />
          
          {/* Meetings Module Routes */}
          <Route path="/meetings" element={<Meetings />} />
          <Route path="/meetings/:id" element={<MeetingDetails />} />
          <Route path="/create-meeting" element={<CreateMeeting />} />
          <Route path="/edit-meeting/:id" element={<CreateMeeting />} />
          <Route path="/live-meeting/:id" element={<LiveMeeting />} />
          
          {/* E-Voting Module Routes */}
          <Route path="/voting" element={<EVoting />} />
          <Route path="/voting/create" element={<CreateVotingRequest />} />
          <Route path="/voting/edit/:id" element={<CreateVotingRequest />} />
          <Route path="/voting/:id" element={<VotingParticipant />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

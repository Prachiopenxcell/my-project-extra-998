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
import VirtualDataRoom from "./pages/VirtualDataRoom";
import DocumentStorage from "./pages/DocumentStorage";
import CreateDocumentRoom from "./pages/CreateDocumentRoom";
import DocumentRoomView from "./pages/DocumentRoomView";
import DataRecordsRoom from "./pages/DataRecordsRoom";
import AccessManagement from "./pages/AccessManagement";
import AuditTrail from "./pages/AuditTrail";
import ExternalAccess from "./pages/ExternalAccess";
import CreateDataRecord from "./pages/CreateDataRecord";
import LitigationManagement from "./pages/LitigationManagement";
import CreatePreFiling from "./pages/CreatePreFiling";
import LitigationDocuments from "./pages/LitigationDocuments";
import LitigationCaseDetails from "./pages/LitigationCaseDetails";

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
          
          {/* Virtual Data Room Module Routes */}
          <Route path="/data-room" element={<VirtualDataRoom />} />
          <Route path="/data-room/document-storage" element={<DocumentStorage />} />
          <Route path="/data-room/document-storage/create-room" element={<CreateDocumentRoom />} />
          <Route path="/data-room/document-storage/room/:roomId" element={<DocumentRoomView />} />
          <Route path="/data-room/document-storage/room/:roomId/manage" element={<AccessManagement />} />
          <Route path="/data-room/document-storage/room/:roomId/activity" element={<AuditTrail />} />
          <Route path="/data-room/data-records" element={<DataRecordsRoom />} />
          <Route path="/data-room/data-records/create" element={<CreateDataRecord />} />
          <Route path="/data-room/external-access" element={<ExternalAccess />} />
          
          {/* Litigation Management Module Routes */}
          <Route path="/litigation" element={<LitigationManagement />} />
          <Route path="/litigation/create" element={<CreatePreFiling />} />
          <Route path="/litigation/create/documents" element={<LitigationDocuments />} />
          <Route path="/litigation/case/:caseId" element={<LitigationCaseDetails />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

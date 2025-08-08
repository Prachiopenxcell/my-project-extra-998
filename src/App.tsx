import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Authentication
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { UserRole, AccessLevel } from "@/types/auth";

// Pages
import Index from "./pages/Index";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import InvitationHandler from "./pages/InvitationHandler";
import Unauthorized from "./pages/Unauthorized";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOTP from "./pages/VerifyOTP";
import Dashboard from "./pages/Dashboard";

// Profile Management
import ProfileCompletion from "./pages/ProfileCompletion";
import ProfileEdit from "./pages/ProfileEdit";
import EntityManagement from "./pages/EntityManagement";
import CreateEntity from "./pages/CreateEntity";
import EntityDetails from "./pages/EntityDetails";
import NotFound from "./pages/NotFound";
import ComingSoon from "./pages/ComingSoon";
import Meetings from "./pages/Meetings";
import CreateMeeting from "./pages/CreateMeeting";
import LiveMeeting from "./pages/LiveMeeting";
import MeetingDetails from "./pages/MeetingDetails";
import EVoting from "./pages/EVoting";
import CreateVotingRequest from "./pages/CreateVotingRequest";
import VotingParticipant from "./pages/VotingParticipant";

// AR & Facilitators Module
import ARFacilitators from "./pages/ARFacilitators";
import ARSelectionProcess from "./pages/ARSelectionProcess";
import ARCallEOI from "./pages/ARCallEOI";
import ARConsentRequest from "./pages/ARConsentRequest";
import ARSelectionDetails from "./pages/ARSelectionDetails";
import ARDetails from "./pages/ARDetails";
import ARFeeStructure from "./pages/ARFeeStructure";
/* Litigation  */
import LitigationManagement from "./pages/LitigationManagement";
import CreatePreFiling from "./pages/CreatePreFiling";
import LitigationDocuments from "./pages/LitigationDocuments";
import LitigationCaseDetails from "./pages/LitigationCaseDetails";
import LitigationReviewSubmit from "./pages/LitigationReviewSubmit";
import LitigationStageSelection from "./pages/LitigationStageSelection";
import CreateActiveLitigation from "./pages/CreateActiveLitigation";
/* VDR */
import VirtualDataRoom from "./pages/VirtualDataRoom";
import DocumentStorageEnhanced from "./pages/DocumentStorageEnhanced";
import CreateDocumentRoom from "./pages/CreateDocumentRoom";
import CreateVDRRoomComplete from "./pages/CreateVDRRoomComplete";
import DocumentRoomView from "./pages/DocumentRoomView";
import DataRecordsRoom from "./pages/DataRecordsRoom";
import AccessManagement from "./pages/AccessManagement";
import AuditTrail from "./pages/AuditTrail";
import ExternalAccess from "./pages/ExternalAccess";
import CreateDataRecord from "./pages/CreateDataRecord";
/* Timeline Module */
import Timeline from "./pages/Timeline";
import CreateTimelineEvent from "./pages/CreateTimelineEvent";
import ResolutionDashboard from "./pages/ResolutionDashboard";
import EOIManagement from "./pages/EOIManagement";
import EOIDetails from "./pages/EOIDetails";
import PRAEvaluation from "./pages/PRAEvaluation";
import ResolutionPlanManagement from "./pages/ResolutionPlanManagement";
/* RegulatoryCompliance module  */
import RegulatoryCompliance from "./pages/RegulatoryCompliance";
import ComplianceEntitySetup from "./pages/ComplianceEntitySetup";
import ComplianceChecklistGeneration from "./pages/ComplianceChecklistGeneration";
import ComplianceAssignmentManagement from "./pages/ComplianceAssignmentManagement";
import ComplianceTrackingMonitoring from "./pages/ComplianceTrackingMonitoring";
import ComplianceReportsAnalytics from "./pages/ComplianceReportsAnalytics";

import ClaimsManagement from "./pages/ClaimsManagement";
import ClaimInvitations from "./pages/ClaimInvitations";
import CreateClaimInvitation from "./pages/CreateClaimInvitation";
import AllClaimsList from "./pages/AllClaimsList";
import ClaimDetails from "./pages/ClaimDetails";
import ClaimVerification from "./pages/ClaimVerification";
import ClaimsReports from "./pages/ClaimsReports";
import ClaimSubmission from "./pages/ClaimSubmission";
import ClaimsAuditLog from "./pages/ClaimsAuditLog";
import ClaimsAllocationSettings from "./pages/ClaimsAllocationSettings";
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Homepage />} />
              <Route path="/home" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/invitation" element={<InvitationHandler />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/verify-otp" element={<VerifyOTP />} />
              
              {/* Protected Routes - Dashboard */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute accessLevel={AccessLevel.AUTHENTICATED}>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Protected Routes - Profile Management */}
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute accessLevel={AccessLevel.AUTHENTICATED}>
                    <ProfileCompletion />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile/edit" 
                element={
                  <ProtectedRoute accessLevel={AccessLevel.AUTHENTICATED}>
                    <ProfileEdit />
                  </ProtectedRoute>
                } 
              />
              
              {/* Protected Routes - Entity Management */}
              <Route 
                path="/entity-management" 
                element={
                  <ProtectedRoute 
                    requiredPermission={{ module: 'organization', action: 'view' }}
                  >
                    <EntityManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/entity-management/create" 
                element={
                  <ProtectedRoute 
                    requiredPermission={{ module: 'organization', action: 'create' }}
                  >
                    <CreateEntity />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/entity-management/:id" 
                element={
                  <ProtectedRoute 
                    requiredPermission={{ module: 'organization', action: 'view' }}
                  >
                    <EntityDetails />
                  </ProtectedRoute>
                } 
              />
              
              {/* Protected Routes - Meetings */}
              <Route 
                path="/meetings" 
                element={
                  <ProtectedRoute 
                    requiredPermission={{ module: 'meetings', action: 'view' }}
                  >
                    <Meetings />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/meetings/create" 
                element={
                  <ProtectedRoute 
                    requiredPermission={{ module: 'meetings', action: 'create' }}
                  >
                    <CreateMeeting />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/meetings/:id" 
                element={
                  <ProtectedRoute 
                    requiredPermission={{ module: 'meetings', action: 'view' }}
                  >
                    <MeetingDetails />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/meetings/:id/live" 
                element={
                  <ProtectedRoute 
                    requiredPermission={{ module: 'meetings', action: 'join' }}
                  >
                    <LiveMeeting />
                  </ProtectedRoute>
                } 
              />
              
              {/* Protected Routes - Voting */}
              <Route 
                path="/voting" 
                element={
                  <ProtectedRoute 
                    requiredPermission={{ module: 'voting', action: 'view' }}
                  >
                    <EVoting />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/voting/create" 
                element={
                  <ProtectedRoute 
                    requiredPermission={{ module: 'voting', action: 'create' }}
                  >
                    <CreateVotingRequest />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/voting/:id/participate" 
                element={
                  <ProtectedRoute 
                    requiredPermission={{ module: 'voting', action: 'participate' }}
                  >
                    <VotingParticipant />
                  </ProtectedRoute>
                } 
              />
          
              {/* Protected Routes - AR & Facilitators Module */}
              <Route 
                path="/ar-facilitators" 
                element={
                  <ProtectedRoute 
                    requiredRole={[
                      UserRole.SERVICE_SEEKER_ENTITY_ADMIN,
                      UserRole.SERVICE_PROVIDER_ENTITY_ADMIN
                    ]}
                  >
                    <ARFacilitators />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/ar-facilitators/selection" 
                element={
                  <ProtectedRoute 
                    requiredRole={[
                      UserRole.SERVICE_SEEKER_ENTITY_ADMIN,
                      UserRole.SERVICE_PROVIDER_ENTITY_ADMIN
                    ]}
                  >
                    <ARSelectionProcess />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/ar-facilitators/eoi" 
                element={
                  <ProtectedRoute 
                    requiredRole={[
                      UserRole.SERVICE_SEEKER_ENTITY_ADMIN,
                      UserRole.SERVICE_PROVIDER_ENTITY_ADMIN
                    ]}
                  >
                    <ARCallEOI />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/ar-facilitators/consent" 
                element={
                  <ProtectedRoute 
                    requiredRole={[
                      UserRole.SERVICE_SEEKER_ENTITY_ADMIN,
                      UserRole.SERVICE_PROVIDER_ENTITY_ADMIN
                    ]}
                  >
                    <ARConsentRequest />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/ar-facilitators/selection/:id" 
                element={
                  <ProtectedRoute 
                    requiredRole={[
                      UserRole.SERVICE_SEEKER_ENTITY_ADMIN,
                      UserRole.SERVICE_PROVIDER_ENTITY_ADMIN
                    ]}
                  >
                    <ARSelectionDetails />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/ar-facilitators/:id" 
                element={
                  <ProtectedRoute 
                    accessLevel={AccessLevel.AUTHENTICATED}
                  >
                    <ARDetails />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/ar-facilitators/fee-structure" 
                element={
                  <ProtectedRoute 
                    accessLevel={AccessLevel.AUTHENTICATED}
                  >
                    <ARFeeStructure />
                  </ProtectedRoute>
                } 
              />
          
              {/* Protected Routes - Litigation */}
              <Route 
                path="/litigation" 
                element={
                  <ProtectedRoute 
                    requiredRole={[
                      UserRole.SERVICE_PROVIDER_INDIVIDUAL,
                      UserRole.SERVICE_PROVIDER_ENTITY_ADMIN,
                      UserRole.SERVICE_PROVIDER_TEAM_MEMBER
                    ]}
                  >
                    <LitigationManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/litigation/pre-filing" 
                element={
                  <ProtectedRoute 
                    requiredRole={[
                      UserRole.SERVICE_PROVIDER_INDIVIDUAL,
                      UserRole.SERVICE_PROVIDER_ENTITY_ADMIN
                    ]}
                  >
                    <CreatePreFiling />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/litigation/active" 
                element={
                  <ProtectedRoute 
                    requiredRole={[
                      UserRole.SERVICE_PROVIDER_INDIVIDUAL,
                      UserRole.SERVICE_PROVIDER_ENTITY_ADMIN
                    ]}
                  >
                    <CreateActiveLitigation />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/litigation/documents" 
                element={
                  <ProtectedRoute 
                    requiredRole={[
                      UserRole.SERVICE_PROVIDER_INDIVIDUAL,
                      UserRole.SERVICE_PROVIDER_ENTITY_ADMIN,
                      UserRole.SERVICE_PROVIDER_TEAM_MEMBER
                    ]}
                  >
                    <LitigationDocuments />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/litigation/case/:id" 
                element={
                  <ProtectedRoute 
                    requiredRole={[
                      UserRole.SERVICE_PROVIDER_INDIVIDUAL,
                      UserRole.SERVICE_PROVIDER_ENTITY_ADMIN,
                      UserRole.SERVICE_PROVIDER_TEAM_MEMBER
                    ]}
                  >
                    <LitigationCaseDetails />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/litigation/review" 
                element={
                  <ProtectedRoute 
                    requiredRole={[
                      UserRole.SERVICE_PROVIDER_INDIVIDUAL,
                      UserRole.SERVICE_PROVIDER_ENTITY_ADMIN
                    ]}
                  >
                    <LitigationReviewSubmit />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/litigation/stage-selection" 
                element={
                  <ProtectedRoute 
                    requiredRole={[
                      UserRole.SERVICE_PROVIDER_INDIVIDUAL,
                      UserRole.SERVICE_PROVIDER_ENTITY_ADMIN
                    ]}
                  >
                    <LitigationStageSelection />
                  </ProtectedRoute>
                } 
              />
          
              {/* Protected Routes - Resolution System */}
              <Route 
                path="/resolution" 
                element={
                  <ProtectedRoute 
                    requiredRole={[
                      UserRole.SERVICE_PROVIDER_INDIVIDUAL,
                      UserRole.SERVICE_PROVIDER_ENTITY_ADMIN,
                      UserRole.SERVICE_PROVIDER_TEAM_MEMBER
                    ]}
                  >
                    <ResolutionDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route path="/resolution/dashboard" element={<ResolutionDashboard />} />
              <Route path="/resolution/create-eoi" element={<EOIManagement />} />
              <Route path="/resolution/eoi/:id" element={<EOIDetails />} />
              <Route path="/resolution/eoi/:id/edit" element={<EOIManagement />} />
              <Route path="/resolution/pra-evaluation" element={<PRAEvaluation />} />
              <Route path="/resolution/plans" element={<ResolutionPlanManagement />} />
              <Route path="/resolution/plan/:id" element={<ResolutionPlanManagement />} />
              <Route path="/resolution/upload-plan" element={<ResolutionPlanManagement />} />
          
              {/* Protected Routes - VDR */}
              <Route 
                path="/vdr" 
                element={
                  <ProtectedRoute 
                    accessLevel={AccessLevel.AUTHENTICATED}
                  >
                    <VirtualDataRoom />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/vdr/documents" 
                element={
                  <ProtectedRoute 
                    accessLevel={AccessLevel.AUTHENTICATED}
                  >
                    <DocumentStorageEnhanced />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/vdr/create-room" 
                element={
                  <ProtectedRoute 
                    requiredRole={[
                      UserRole.SERVICE_SEEKER_ENTITY_ADMIN,
                      UserRole.SERVICE_PROVIDER_ENTITY_ADMIN,
                      UserRole.SERVICE_SEEKER_INDIVIDUAL,
                      UserRole.SERVICE_PROVIDER_INDIVIDUAL
                    ]}
                  >
                    <CreateDocumentRoom />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/vdr/create-room/complete" 
                element={
                  <ProtectedRoute 
                    requiredRole={[
                      UserRole.SERVICE_SEEKER_ENTITY_ADMIN,
                      UserRole.SERVICE_PROVIDER_ENTITY_ADMIN,
                      UserRole.SERVICE_SEEKER_INDIVIDUAL,
                      UserRole.SERVICE_PROVIDER_INDIVIDUAL
                    ]}
                  >
                    <CreateVDRRoomComplete />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/vdr/room/:id" 
                element={
                  <ProtectedRoute 
                    accessLevel={AccessLevel.AUTHENTICATED}
                  >
                    <DocumentRoomView />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/vdr/records" 
                element={
                  <ProtectedRoute 
                    accessLevel={AccessLevel.AUTHENTICATED}
                  >
                    <DataRecordsRoom />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/vdr/access" 
                element={
                  <ProtectedRoute 
                    requiredRole={[
                      UserRole.SERVICE_SEEKER_ENTITY_ADMIN,
                      UserRole.SERVICE_PROVIDER_ENTITY_ADMIN
                    ]}
                  >
                    <AccessManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/vdr/audit" 
                element={
                  <ProtectedRoute 
                    requiredRole={[
                      UserRole.SERVICE_SEEKER_ENTITY_ADMIN,
                      UserRole.SERVICE_PROVIDER_ENTITY_ADMIN
                    ]}
                  >
                    <AuditTrail />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/vdr/external" 
                element={
                  <ProtectedRoute 
                    accessLevel={AccessLevel.AUTHENTICATED}
                  >
                    <ExternalAccess />
                  </ProtectedRoute>
                } 
              />
          
              {/* Protected Routes - Claims Management */}
              <Route 
                path="/claims" 
                element={
                  <ProtectedRoute 
                    requiredPermission={{ module: 'claims', action: 'view' }}
                  >
                    <ClaimsManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/claims/create-invitation" 
                element={
                  <ProtectedRoute 
                    requiredRole={[
                      UserRole.SERVICE_SEEKER_ENTITY_ADMIN,
                      UserRole.SERVICE_PROVIDER_ENTITY_ADMIN
                    ]}
                  >
                    <CreateClaimInvitation />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/claims/all" 
                element={
                  <ProtectedRoute 
                    requiredPermission={{ module: 'claims', action: 'view' }}
                  >
                    <AllClaimsList />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/claims/:id" 
                element={
                  <ProtectedRoute 
                    requiredPermission={{ module: 'claims', action: 'view' }}
                  >
                    <ClaimDetails />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/claims/:id/verify" 
                element={
                  <ProtectedRoute 
                    requiredRole={[
                      UserRole.SERVICE_SEEKER_ENTITY_ADMIN,
                      UserRole.SERVICE_PROVIDER_ENTITY_ADMIN,
                      UserRole.SERVICE_PROVIDER_INDIVIDUAL
                    ]}
                  >
                    <ClaimVerification />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/claims/submit" 
                element={
                  <ProtectedRoute 
                    requiredPermission={{ module: 'claims', action: 'submit' }}
                  >
                    <ClaimSubmission />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/claims/reports" 
                element={
                  <ProtectedRoute 
                    requiredPermission={{ module: 'reports', action: 'view' }}
                  >
                    <ClaimsReports />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/claims/audit-log" 
                element={
                  <ProtectedRoute 
                    requiredPermission={{ module: 'claims', action: 'view' }}
                  >
                    <ClaimsAuditLog />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/claims/:id/audit-log" 
                element={
                  <ProtectedRoute 
                    requiredPermission={{ module: 'claims', action: 'view' }}
                  >
                    <ClaimsAuditLog />
                  </ProtectedRoute>
                } 
              />
              <Route path="/claims/allocation-settings" element={<ClaimsAllocationSettings />} />
          
              {/* Fallback Routes */}
              <Route path="/coming-soon" element={<ComingSoon />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

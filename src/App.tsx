import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Authentication
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { UserRole, AccessLevel } from "@/types/auth";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";

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
import PreFilingDetails from "./pages/PreFilingDetails";
import PreFilingReview from "./pages/PreFilingReview";
/* VDR */
import VirtualDataRoom from "./pages/VirtualDataRoom";
import EntityDataCompletion from "./pages/EntityDataCompletion";

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
import PRADetails from "./pages/PRADetails";
import ResolutionPlanManagement from "./pages/ResolutionPlanManagement";
import ResolutionPlanDetails from "./pages/ResolutionPlanDetails";
import ResolutionPlanEdit from "./pages/ResolutionPlanEdit";
import ResolutionPlanCompare from "./pages/ResolutionPlanCompare";
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

// Service Request and Bid Submission Module
import ServiceRequests from "./pages/ServiceRequests";
import ServiceRequestDetails from "@/pages/ServiceRequestDetails";
import EditServiceRequest from "@/pages/EditServiceRequest";
import BidsListing from "./pages/BidsListing";
import BidDetails from "./pages/BidDetails";
import EditBid from "./pages/EditBid";
import ProfessionalInvitation from "./pages/ProfessionalInvitation";

// Work Order Module
import WorkOrders from "./pages/WorkOrders";
import WorkOrderDetails from "./pages/WorkOrderDetails";
import CreateWorkOrder from "./pages/CreateWorkOrder";
import WorkOrderProformaSummary from "./pages/WorkOrderProformaSummary";
import BidAcceptanceSummary from "./pages/BidAcceptanceSummary";

// Feedback Module
import Feedback from "./pages/Feedback";
import FeedbackDetails from "./pages/FeedbackDetails";
import ClaimDetails from "./pages/ClaimDetails";
import ClaimVerification from "./pages/ClaimVerification";
import ClaimsReports from "./pages/ClaimsReports";
import ClaimSubmission from "./pages/ClaimSubmission";
import ClaimsAuditLog from "./pages/ClaimsAuditLog";
import ClaimsAllocationSettings from "./pages/ClaimsAllocationSettings";

// Subscription Management Module
import SubscriptionManagement from "./pages/SubscriptionManagement";
import SubscriptionPackages from "./pages/SubscriptionPackagesNew";
import SubscriptionBilling from "./pages/SubscriptionBilling";
import SubscriptionDetails from "./pages/SubscriptionDetails";
import SubscriptionPaymentMethods from "./pages/SubscriptionPaymentMethods";
import SubscriptionInvoiceDetail from "./pages/SubscriptionInvoiceDetail";
import SubscriptionPurchase from "./pages/SubscriptionPurchase";
import SubscriptionRenewal from "./pages/SubscriptionRenewal";
import SubscriptionDueBills from "./pages/SubscriptionDueBills";
import SubscriptionUpgradeDowngrade from "./pages/SubscriptionUpgradeDowngrade";
import SubscriptionSettingsPage from "./pages/SubscriptionSettingsPage";
import CreateServiceRequest from "./pages/CreateServiceRequest";

// Static Pages
import FAQ from "./pages/FAQ";
import UserFAQ from "./pages/UserFAQ";
import ContactUs from "./pages/ContactUs";
import ModulesSubscription from "./pages/ModulesSubscription";
import Articles from "./pages/Articles";
import AboutUs from "./pages/AboutUs";
import HowItWorks from "./pages/HowItWorks";
import TermsConditions from "./pages/TermsConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CookiesPolicy from "./pages/CookiesPolicy";
import LegalCompliance from "./pages/LegalCompliance";
// Guidance and Resource Modules
import GuidanceAndReference from './pages/GuidanceAndReferenceNew';
import ResourceSharingPooling from "./pages/ResourceSharingPooling";

// Workspace Module
import Workspace from "./pages/Workspace";

// Notification Module
import Notifications from "./pages/Notifications";

// System Settings Module
import SystemSettings from "./pages/SystemSettings";
import LitigationManagementNew from "./pages/LitigationManagementNew";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
        <SubscriptionProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true
            }}
          >
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
               
              {/* Static Pages */}
              <Route path="/faq" element={<FAQ />} />
              {/* Personalized User FAQ - Authenticated users */}
              <Route 
                path="/user-faq" 
                element={
                  <ProtectedRoute accessLevel={AccessLevel.AUTHENTICATED}>
                    <UserFAQ />
                  </ProtectedRoute>
                } 
              />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/modules-subscription" element={<ModulesSubscription />} />
              <Route path="/articles" element={<Articles />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/terms" element={<TermsConditions />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/cookies" element={<CookiesPolicy />} />
              <Route path="/legal-compliance" element={<LegalCompliance />} />
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
              
              {/* Notifications Module Route */}
              <Route 
                path="/notifications" 
                element={
                  <ProtectedRoute accessLevel={AccessLevel.AUTHENTICATED}>
                    <Notifications />
                  </ProtectedRoute>
                } 
              />
              
               {/* Guidance and Reference Module Routes */}
               <Route 
                path="/guidance-reference" 
                element={
                  <ProtectedRoute accessLevel={AccessLevel.AUTHENTICATED} requiredRole={[UserRole.SERVICE_PROVIDER_INDIVIDUAL_PARTNER, UserRole.SERVICE_PROVIDER_ENTITY_ADMIN, UserRole.SERVICE_PROVIDER_TEAM_MEMBER]}>
                    <GuidanceAndReference />
                  </ProtectedRoute>
                } 
              />
              
              {/* Resource Sharing and Pooling Module Routes */}
              <Route 
                path="/resource-sharing" 
                element={
                  <ProtectedRoute accessLevel={AccessLevel.AUTHENTICATED} requiredRole={[UserRole.SERVICE_PROVIDER_INDIVIDUAL_PARTNER, UserRole.SERVICE_PROVIDER_ENTITY_ADMIN, UserRole.SERVICE_PROVIDER_TEAM_MEMBER]}>
                    <ResourceSharingPooling />
                  </ProtectedRoute>
                } 
              />
              {/* Entity Management Module Routes */}
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
              
              {/* AR & Facilitators Module Routes */}
              <Route path="/ar-facilitators" element={<ARFacilitators />} />
              <Route path="/ar-selection-process" element={<ARSelectionProcess />} />
              <Route path="/ar-call-eoi" element={<ARCallEOI />} />
              <Route path="/ar-consent-request" element={<ARConsentRequest />} />
              <Route path="/ar-selection-details" element={<ARSelectionDetails />} />
              <Route path="/ar-details" element={<ARDetails />} />
              <Route path="/ar-fee-structure" element={<ARFeeStructure />} />
              
               {/* Litigation Management Module Routes */}
               <Route path="/litigation" element={<LitigationManagementNew />} />
              <Route path="/litigation/stage-selection" element={<LitigationStageSelection />} />
              <Route path="/litigation/create" element={<CreatePreFiling />} />
              <Route path="/litigation/create-active" element={<CreateActiveLitigation />} />
              <Route path="/litigation/create/documents" element={<LitigationDocuments />} />
              <Route path="/litigation/review-stage1" element={<PreFilingReview />} />
              <Route path="/litigation/review-submit" element={<LitigationReviewSubmit />} />
              <Route path="/litigation/pre-filing/:preFilingId" element={<PreFilingDetails />} />

              <Route path="/litigation/review-submit/:caseId" element={<LitigationReviewSubmit />} />
              <Route path="/litigation/case/:caseId" element={<LitigationCaseDetails />} />
              
              {/* Timeline Module Routes */}
              <Route path="/timeline" element={<Timeline />} />
              <Route path="/create-timeline-event" element={<CreateTimelineEvent />} />
              <Route path="/edit-timeline-event/:id" element={<CreateTimelineEvent />} />
              
              {/* Resolution System Module Routes */}
              <Route path="/resolution" element={<ResolutionDashboard />} />
              <Route path="/resolution/dashboard" element={<ResolutionDashboard />} />
              <Route path="/resolution/create-eoi" element={<EOIManagement />} />
              <Route path="/resolution/eoi/:id" element={<EOIDetails />} />
              <Route path="/resolution/eoi/:id/edit" element={<EOIManagement />} />
              <Route path="/resolution/pra-evaluation" element={<PRAEvaluation />} />
              <Route path="/resolution/pra/:id" element={<PRADetails />} />
              <Route path="/resolution/plans" element={<ResolutionPlanManagement />} />
              <Route path="/resolution/plan/:id" element={<ResolutionPlanDetails />} />
              <Route path="/resolution/plan/:id/edit" element={<ResolutionPlanEdit />} />
              <Route path="/resolution/plan/:id/comparison" element={<ResolutionPlanCompare />} />
              <Route path="/resolution/upload-plan" element={<ResolutionPlanManagement />} />
              
              {/* Virtual Data Room Module Routes */}
              <Route path="/data-room" element={<VirtualDataRoom />} />
              <Route path="/data-room/entity-data-completion" element={<EntityDataCompletion />} />

              {/* Document Storage & Management Routes */}
              <Route path="/data-room/document-storage" element={<DocumentStorageEnhanced />} />
              <Route path="/data-room/create-room" element={<CreateVDRRoomComplete />} />
              <Route path="/data-room/document-storage/create-room" element={<CreateDocumentRoom />} />
              <Route path="/data-room/room/:roomId" element={<DocumentRoomView />} />
              <Route path="/data-room/document-storage/room/:roomId" element={<DocumentRoomView />} />
              <Route path="/data-room/document-storage/room/:roomId/manage" element={<AccessManagement />} />
              <Route path="/data-room/document-storage/room/:roomId/activity" element={<AuditTrail />} />
              
              {/* Data Records Room & Management Routes */}
              <Route path="/data-room/data-records" element={<DataRecordsRoom />} />
              <Route path="/data-room/create-data-record" element={<CreateDataRecord />} />
             
              
              {/* VDR Management Routes */}
              <Route path="/data-room/manage-access" element={<AccessManagement />} />
              <Route path="/data-room/analytics" element={<AuditTrail />} />
              <Route path="/data-room/settings" element={<AccessManagement />} />
              <Route path="/data-room/external-access" element={<ExternalAccess />} />
              
              {/* Regulatory Compliance Module Routes */}
              <Route path="/compliance" element={<RegulatoryCompliance />} />
              <Route path="/compliance/setup" element={<ComplianceEntitySetup />} />
              <Route path="/compliance/checklist" element={<ComplianceChecklistGeneration />} />
              <Route path="/compliance/assignment" element={<ComplianceAssignmentManagement />} />
              <Route path="/compliance/tracking" element={<ComplianceTrackingMonitoring />} />
              <Route path="/compliance/reports" element={<ComplianceReportsAnalytics />} />
              
                
              {/* Workspace Module Routes */}
              <Route 
                path="/workspace" 
                element={
                  <ProtectedRoute requiredRole={[
                    UserRole.SERVICE_SEEKER_INDIVIDUAL_PARTNER,
                    UserRole.SERVICE_SEEKER_ENTITY_ADMIN,
                    UserRole.SERVICE_SEEKER_TEAM_MEMBER,
                    UserRole.SERVICE_PROVIDER_INDIVIDUAL_PARTNER,
                    UserRole.SERVICE_PROVIDER_ENTITY_ADMIN,
                    UserRole.SERVICE_PROVIDER_TEAM_MEMBER
                  ]}>
                    <Workspace />
                  </ProtectedRoute>
                } 
              />

              {/* Subscription Management Module Routes */}
              <Route 
                path="/subscription" 
                element={
                  <ProtectedRoute requiredRole={[
                    UserRole.SERVICE_SEEKER_INDIVIDUAL_PARTNER,
                    UserRole.SERVICE_SEEKER_ENTITY_ADMIN,
                    UserRole.SERVICE_SEEKER_TEAM_MEMBER,
                    UserRole.SERVICE_PROVIDER_INDIVIDUAL_PARTNER,
                    UserRole.SERVICE_PROVIDER_ENTITY_ADMIN,
                    UserRole.SERVICE_PROVIDER_TEAM_MEMBER
                  ]}>
                    <SubscriptionManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/subscription/browse" 
                element={
                  <ProtectedRoute requiredRole={[
                    UserRole.SERVICE_SEEKER_INDIVIDUAL_PARTNER,
                    UserRole.SERVICE_SEEKER_ENTITY_ADMIN,
                    UserRole.SERVICE_SEEKER_TEAM_MEMBER,
                    UserRole.SERVICE_PROVIDER_INDIVIDUAL_PARTNER,
                    UserRole.SERVICE_PROVIDER_ENTITY_ADMIN,
                    UserRole.SERVICE_PROVIDER_TEAM_MEMBER
                  ]}>
                    <SubscriptionPackages />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/subscription/billing" 
                element={
                  <ProtectedRoute requiredRole={[
                    UserRole.SERVICE_SEEKER_INDIVIDUAL_PARTNER,
                    UserRole.SERVICE_SEEKER_ENTITY_ADMIN,
                    UserRole.SERVICE_SEEKER_TEAM_MEMBER,
                    UserRole.SERVICE_PROVIDER_INDIVIDUAL_PARTNER,
                    UserRole.SERVICE_PROVIDER_ENTITY_ADMIN,
                    UserRole.SERVICE_PROVIDER_TEAM_MEMBER
                  ]}>
                    <SubscriptionBilling />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/subscription/:subscriptionId/details" 
                element={
                  <ProtectedRoute accessLevel={AccessLevel.AUTHENTICATED}>
                    <SubscriptionDetails />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/subscription/:subscriptionId/manage" 
                element={
                  <ProtectedRoute accessLevel={AccessLevel.AUTHENTICATED}>
                    <SubscriptionDetails />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/subscription/payment-methods" 
                element={
                  <ProtectedRoute accessLevel={AccessLevel.AUTHENTICATED}>
                    <SubscriptionPaymentMethods />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/subscription/invoice/:invoiceId" 
                element={
                  <ProtectedRoute accessLevel={AccessLevel.AUTHENTICATED}>
                    <SubscriptionInvoiceDetail />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/subscription/purchase/:type/:itemId" 
                element={
                  <ProtectedRoute accessLevel={AccessLevel.AUTHENTICATED}>
                    <SubscriptionPurchase />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/subscription/:subscriptionId/renew" 
                element={
                  <ProtectedRoute accessLevel={AccessLevel.AUTHENTICATED}>
                    <SubscriptionRenewal />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/subscription/due-bills" 
                element={
                  <ProtectedRoute accessLevel={AccessLevel.AUTHENTICATED}>
                    <SubscriptionDueBills />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/subscription/:subscriptionId/upgrade-downgrade" 
                element={
                  <ProtectedRoute accessLevel={AccessLevel.AUTHENTICATED}>
                    <SubscriptionUpgradeDowngrade />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/subscription/settings" 
                element={
                  <ProtectedRoute accessLevel={AccessLevel.AUTHENTICATED}>
                    <SubscriptionSettingsPage />
                  </ProtectedRoute>
                } 
              />

              {/* Catch-all routes for unimplemented sub-pages */}
              <Route path="/entity-management/*" element={<ComingSoon />} />
              <Route path="/meetings/*" element={<ComingSoon />} />
              <Route path="/voting/*" element={<ComingSoon />} />
              <Route path="/ar-facilitators/*" element={<ComingSoon />} />
              {/* Removed litigation catch-all to allow specific routes to work */}
              <Route path="/timeline/*" element={<ComingSoon />} />
              <Route path="/resolution/*" element={<ComingSoon />} />
              <Route path="/data-room/*" element={<ComingSoon />} />
              <Route path="/compliance/*" element={<ComingSoon />} />

               
              {/* Service Request and Bid Submission Module Routes */}
              <Route 
                path="/service-requests" 
                element={
                  <ProtectedRoute 
                    requiredRole={[
                      UserRole.SERVICE_SEEKER_INDIVIDUAL_PARTNER,
                      UserRole.SERVICE_SEEKER_ENTITY_ADMIN,
                      UserRole.SERVICE_SEEKER_TEAM_MEMBER,
                      UserRole.SERVICE_PROVIDER_INDIVIDUAL_PARTNER,
                      UserRole.SERVICE_PROVIDER_ENTITY_ADMIN,
                      UserRole.SERVICE_PROVIDER_TEAM_MEMBER
                    ]}
                  >
                    <ServiceRequests />
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/create-service-request" 
                element={
                  <ProtectedRoute 
                    requiredRole={[
                      UserRole.SERVICE_SEEKER_INDIVIDUAL_PARTNER,
                      UserRole.SERVICE_SEEKER_ENTITY_ADMIN,
                      UserRole.SERVICE_SEEKER_TEAM_MEMBER
                    ]}
                  >
                    <CreateServiceRequest />
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/service-requests/:id" 
                element={
                  <ProtectedRoute 
                    requiredRole={[
                      UserRole.SERVICE_SEEKER_INDIVIDUAL_PARTNER,
                      UserRole.SERVICE_SEEKER_ENTITY_ADMIN,
                      UserRole.SERVICE_SEEKER_TEAM_MEMBER,
                      UserRole.SERVICE_PROVIDER_INDIVIDUAL_PARTNER,
                      UserRole.SERVICE_PROVIDER_ENTITY_ADMIN,
                      UserRole.SERVICE_PROVIDER_TEAM_MEMBER
                    ]}
                  >
                    <ServiceRequestDetails />
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/opportunities/:id" 
                element={
                  <ProtectedRoute 
                    requiredRole={[
                      UserRole.SERVICE_PROVIDER_INDIVIDUAL_PARTNER,
                      UserRole.SERVICE_PROVIDER_ENTITY_ADMIN,
                      UserRole.SERVICE_PROVIDER_TEAM_MEMBER
                    ]}
                  >
                    <ServiceRequestDetails />
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/service-requests/:id/edit" 
                element={
                  <ProtectedRoute 
                    requiredRole={[
                      UserRole.SERVICE_SEEKER_INDIVIDUAL_PARTNER,
                      UserRole.SERVICE_SEEKER_ENTITY_ADMIN,
                      UserRole.SERVICE_SEEKER_TEAM_MEMBER
                    ]}
                  >
                    <EditServiceRequest />
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/bids/:id" 
                element={
                  <ProtectedRoute 
                    requiredRole={[
                      UserRole.SERVICE_PROVIDER_INDIVIDUAL_PARTNER,
                      UserRole.SERVICE_PROVIDER_ENTITY_ADMIN,
                      UserRole.SERVICE_PROVIDER_TEAM_MEMBER
                    ]}
                  >
                    <BidDetails />
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/bids/:id/edit" 
                element={
                  <ProtectedRoute 
                    requiredRole={[
                      UserRole.SERVICE_PROVIDER_INDIVIDUAL_PARTNER,
                      UserRole.SERVICE_PROVIDER_ENTITY_ADMIN,
                      UserRole.SERVICE_PROVIDER_TEAM_MEMBER
                    ]}
                  >
                    <EditBid />
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/service-requests/:id/bids" 
                element={
                  <ProtectedRoute 
                    requiredRole={[
                      UserRole.SERVICE_SEEKER_INDIVIDUAL_PARTNER,
                      UserRole.SERVICE_SEEKER_ENTITY_ADMIN,
                      UserRole.SERVICE_SEEKER_TEAM_MEMBER
                    ]}
                  >
                    <ServiceRequestDetails />
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/bids" 
                element={
                  <ProtectedRoute 
                    requiredRole={[
                      UserRole.SERVICE_SEEKER_INDIVIDUAL_PARTNER,
                      UserRole.SERVICE_SEEKER_ENTITY_ADMIN,
                      UserRole.SERVICE_SEEKER_TEAM_MEMBER
                    ]}
                  >
                    <BidsListing />
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/service-requests/:serviceRequestId/invite-professionals" 
                element={
                  <ProtectedRoute 
                    requiredRole={[
                      UserRole.SERVICE_SEEKER_INDIVIDUAL_PARTNER,
                      UserRole.SERVICE_SEEKER_ENTITY_ADMIN,
                      UserRole.SERVICE_SEEKER_TEAM_MEMBER
                    ]}
                  >
                    <ProfessionalInvitation />
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/service-requests/:serviceRequestId/bid-summary" 
                element={
                  <ProtectedRoute 
                    requiredRole={[
                      UserRole.SERVICE_SEEKER_INDIVIDUAL_PARTNER,
                      UserRole.SERVICE_SEEKER_ENTITY_ADMIN,
                      UserRole.SERVICE_SEEKER_TEAM_MEMBER
                    ]}
                  >
                    <BidAcceptanceSummary />
                  </ProtectedRoute>
                }
              />

              {/* Work Order Module Routes */}
              {/* Main Work Orders List - Both Service Seekers and Service Providers */}
              <Route 
                path="/work-orders" 
                element={
                  <ProtectedRoute 
                    requiredRole={[
                      UserRole.SERVICE_SEEKER_INDIVIDUAL_PARTNER,
                      UserRole.SERVICE_SEEKER_ENTITY_ADMIN,
                      UserRole.SERVICE_SEEKER_TEAM_MEMBER,
                      UserRole.SERVICE_PROVIDER_INDIVIDUAL_PARTNER,
                      UserRole.SERVICE_PROVIDER_ENTITY_ADMIN,
                      UserRole.SERVICE_PROVIDER_TEAM_MEMBER
                    ]}
                    fallbackPath="/login?redirect=/work-orders"
                  >
                    <WorkOrders />
                  </ProtectedRoute>
                }
              />
              
              {/* Create Work Order - Service Seekers Only (can create from bids) */}
              <Route 
                path="/work-orders/create" 
                element={
                  <ProtectedRoute 
                    requiredRole={[
                      UserRole.SERVICE_SEEKER_INDIVIDUAL_PARTNER,
                      UserRole.SERVICE_SEEKER_ENTITY_ADMIN,
                      UserRole.SERVICE_SEEKER_TEAM_MEMBER
                    ]}
                    fallbackPath="/login?redirect=/work-orders/create"
                  >
                    <CreateWorkOrder />
                  </ProtectedRoute>
                }
              />
              
              {/* Create Work Order - Service Providers Only (can initiate work orders) */}
              <Route 
                path="/work-orders/create-provider" 
                element={
                  <ProtectedRoute 
                    requiredRole={[
                      UserRole.SERVICE_PROVIDER_INDIVIDUAL_PARTNER,
                      UserRole.SERVICE_PROVIDER_ENTITY_ADMIN,
                      UserRole.SERVICE_PROVIDER_TEAM_MEMBER
                    ]}
                    fallbackPath="/login?redirect=/work-orders/create-provider"
                  >
                    <CreateWorkOrder />
                  </ProtectedRoute>
                }
              />
              
              {/* Work Order Details - Both Service Seekers and Service Providers */}
              <Route 
                path="/work-orders/:id" 
                element={
                  <ProtectedRoute 
                    requiredRole={[
                      UserRole.SERVICE_SEEKER_INDIVIDUAL_PARTNER,
                      UserRole.SERVICE_SEEKER_ENTITY_ADMIN,
                      UserRole.SERVICE_SEEKER_TEAM_MEMBER,
                      UserRole.SERVICE_PROVIDER_INDIVIDUAL_PARTNER,
                      UserRole.SERVICE_PROVIDER_ENTITY_ADMIN,
                      UserRole.SERVICE_PROVIDER_TEAM_MEMBER
                    ]}
                    fallbackPath="/login?redirect=/work-orders"
                  >
                    <WorkOrderDetails />
                  </ProtectedRoute>
                }
              />

              {/* Work Order Proforma Summary & Payment - Service Seekers Only */}
              <Route 
                path="/work-orders/:id/summary" 
                element={
                  <ProtectedRoute 
                    requiredRole={[
                      UserRole.SERVICE_SEEKER_INDIVIDUAL_PARTNER,
                      UserRole.SERVICE_SEEKER_ENTITY_ADMIN,
                      UserRole.SERVICE_SEEKER_TEAM_MEMBER
                    ]}
                    fallbackPath="/login?redirect=/work-orders"
                  >
                    <WorkOrderProformaSummary />
                  </ProtectedRoute>
                }
              />
              
              {/* Feedback Module Routes - Service Providers Only */}
               <Route 
                 path="/feedback" 
                 element={
                   <ProtectedRoute 
                     requiredRole={[
                       UserRole.SERVICE_PROVIDER_INDIVIDUAL_PARTNER,
                       UserRole.SERVICE_PROVIDER_ENTITY_ADMIN,
                       UserRole.SERVICE_PROVIDER_TEAM_MEMBER
                     ]}
                     fallbackPath="/login?redirect=/feedback"
                   >
                     <Feedback />
                   </ProtectedRoute>
                 }
               />
               <Route 
                 path="/feedback/:id" 
                 element={
                   <ProtectedRoute 
                     requiredRole={[
                       UserRole.SERVICE_PROVIDER_INDIVIDUAL_PARTNER,
                       UserRole.SERVICE_PROVIDER_ENTITY_ADMIN,
                       UserRole.SERVICE_PROVIDER_TEAM_MEMBER
                     ]}
                     fallbackPath="/login?redirect=/feedback"
                   >
                     <FeedbackDetails />
                   </ProtectedRoute>
                 }
               />

               {/* Work Order Feedback - Both roles can provide feedback */}
               <Route 
                 path="/work-orders/:id/feedback" 
                 element={
                   <ProtectedRoute 
                     requiredRole={[
                       UserRole.SERVICE_SEEKER_INDIVIDUAL_PARTNER,
                       UserRole.SERVICE_SEEKER_ENTITY_ADMIN,
                       UserRole.SERVICE_SEEKER_TEAM_MEMBER,
                       UserRole.SERVICE_PROVIDER_INDIVIDUAL_PARTNER,
                       UserRole.SERVICE_PROVIDER_ENTITY_ADMIN,
                       UserRole.SERVICE_PROVIDER_TEAM_MEMBER
                     ]}
                     fallbackPath="/login"
                   >
                     <WorkOrderDetails />
                   </ProtectedRoute>
                 }
               />

              {/* Claims Management Module Routes */}
              <Route path="/claims" element={<ClaimsManagement />} />
              <Route path="/claims/invitations" element={<ClaimInvitations />} />
              <Route path="/claims/invitation/:id" element={<ClaimInvitations />} />
              <Route path="/claims/create-invitation" element={<CreateClaimInvitation />} />
              <Route path="/claims/edit-invitation/:id" element={<CreateClaimInvitation />} />
              <Route path="/claims/all-claims" element={<AllClaimsList />} />
              <Route path="/claims/claim/:id" element={<ClaimDetails />} />
              <Route path="/claims/verify/:id" element={<ClaimVerification />} />
              <Route path="/claims/reports" element={<ClaimsReports />} />
              <Route path="/claims/submit/:invitationId" element={<ClaimSubmission />} />
              <Route path="/claims/audit-log" element={<ClaimsAuditLog />} />
              <Route path="/claims/audit-log/:claimId" element={<ClaimsAuditLog />} />
              <Route path="/claims/allocation-settings" element={<ClaimsAllocationSettings />} />

              {/* System Settings Module Routes */}
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute 
                    requiredRole={[
                      UserRole.SERVICE_SEEKER_INDIVIDUAL_PARTNER,
                      UserRole.SERVICE_SEEKER_ENTITY_ADMIN,
                      UserRole.SERVICE_SEEKER_TEAM_MEMBER,
                      UserRole.SERVICE_PROVIDER_INDIVIDUAL_PARTNER,
                      UserRole.SERVICE_PROVIDER_ENTITY_ADMIN,
                      UserRole.SERVICE_PROVIDER_TEAM_MEMBER
                    ]}
                    fallbackPath="/login?redirect=/settings"
                  >
                    <SystemSettings />
                  </ProtectedRoute>
                }
              />

              {/* Fallback Routes */}
              <Route path="/coming-soon" element={<ComingSoon />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </SubscriptionProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

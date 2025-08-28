import { useState, useEffect, useCallback } from "react";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Wand2, 
  Upload, 
  X, 
  Plus, 
  Save, 
  Send,
  ArrowLeft,
  ArrowRight,
  FileText,
  Users,
  Calendar,
  MapPin,
  DollarSign,
  HelpCircle,
  CheckCircle,
  UserPlus,
  Mail,
  Phone,
  Star,
  Clock,
  XCircle,
  Eye,
  Search,
  Filter,
  Award,
  Briefcase,
  Globe,
  Shield,
  TrendingUp,
  MessageSquare,
  ExternalLink,
  UserCheck,
  History,
  Zap,
  Target,
  Minus
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { serviceRequestService } from "@/services/serviceRequestService";
import { professionalInvitationService } from "@/services/professionalInvitationService";
import { ProfessionalType, MainServiceType, ServiceType, ServiceRequest, ServiceRequestStatus } from "@/types/serviceRequest";

// Service Types mapping for display
const serviceTypes = [
  // Incorporation & Business Set-Up
  { value: ServiceType.INCORPORATION_PRIVATE_LIMITED, label: "Private Limited Company Incorporation" },
  { value: ServiceType.INCORPORATION_PUBLIC_LIMITED, label: "Public Limited Company Incorporation" },
  { value: ServiceType.INCORPORATION_OPC, label: "One Person Company (OPC) Incorporation" },
  { value: ServiceType.INCORPORATION_LLP, label: "Limited Liability Partnership (LLP) Incorporation" },
  { value: ServiceType.INCORPORATION_PRODUCER_COMPANY, label: "Producer Company Incorporation" },
  { value: ServiceType.SECTION_8_COMPANY, label: "Section 8 Company Incorporation" },
  { value: ServiceType.CONVERSION_PROPRIETORSHIP_PARTNERSHIP, label: "Conversion from Proprietorship/Partnership" },
  { value: ServiceType.CONVERSION_COMPANY_TYPES, label: "Conversion Between Company Types" },
  { value: ServiceType.DIN_OBTAINING, label: "Director Identification Number (DIN) Obtaining" },
  { value: ServiceType.DSC_FACILITATION, label: "Digital Signature Certificate (DSC) Facilitation" },
  { value: ServiceType.NAME_RESERVATION_CHANGE, label: "Name Reservation & Change" },
  { value: ServiceType.DRAFTING_MOA_AOA, label: "Drafting MOA & AOA" },
  { value: ServiceType.COMMENCEMENT_BUSINESS_FILINGS, label: "Commencement of Business Filings" },
  
  // Secretarial Compliance & Filings
  { value: ServiceType.ANNUAL_RETURN_FILING, label: "Annual Return Filing" },
  { value: ServiceType.FINANCIAL_STATEMENT_FILING, label: "Financial Statement Filing" },
  { value: ServiceType.DIRECTOR_APPOINTMENT_RESIGNATION, label: "Director Appointment/Resignation" },
  { value: ServiceType.AUDITOR_APPOINTMENT_RESIGNATION, label: "Auditor Appointment/Resignation" },
  { value: ServiceType.FILING_OF_CHARGES, label: "Filing of Charges" },
  { value: ServiceType.STATUTORY_REGISTERS_MAINTENANCE, label: "Statutory Registers Maintenance" },
  { value: ServiceType.SHARE_ISSUE_ALLOTMENT_TRANSFER, label: "Share Issue/Allotment/Transfer" },
  { value: ServiceType.BUYBACK_REDUCTION_SHARE_CAPITAL, label: "Buyback/Reduction of Share Capital" },
  { value: ServiceType.INCREASE_AUTHORISED_SHARE_CAPITAL, label: "Increase in Authorised Share Capital" },
  { value: ServiceType.LISTED_COMPANIES_COMPLIANCE, label: "Listed Companies Compliance" },
  { value: ServiceType.RESOLUTIONS_FILING_ROC, label: "Resolutions Filing with ROC" },
  { value: ServiceType.RETURN_OF_DEPOSITS_FILING, label: "Return of Deposits Filing" },
  { value: ServiceType.MSME_RETURN_FILING, label: "MSME Return Filing" },
  { value: ServiceType.EVENT_BASED_COMPLIANCES, label: "Event Based Compliances" },
  { value: ServiceType.LIQUIDATOR_DOCUMENTS_FILING, label: "Liquidator Documents Filing" },
  { value: ServiceType.COMPOUNDING_OF_OFFENCES, label: "Compounding of Offences" },
  
  // Board & Shareholder Meeting Compliances
  { value: ServiceType.DRAFTING_CIRCULATION_NOTICE_AGENDA, label: "Drafting & Circulation of Notice & Agenda for Board/General Meetings" },
  { value: ServiceType.CONDUCTING_MEETINGS, label: "Conducting Meetings (Board Meetings, Committee Meetings, General Meetings)" },
  { value: ServiceType.DRAFTING_MINUTES, label: "Drafting of Minutes (Board Meetings, Committee Meetings, General Meetings)" },
  { value: ServiceType.ASSISTANCE_EVOTING_POSTAL_BALLOT, label: "Assistance in e-voting & postal ballot" },
  { value: ServiceType.PREPARATION_FILING_RESOLUTIONS_ROC, label: "Preparation & filing of resolutions with ROC" },
  { value: ServiceType.DRAFTING_SHAREHOLDER_AGREEMENTS_POLICIES, label: "Drafting of shareholder agreements & corporate governance policies" },
  { value: ServiceType.SECRETARIAL_STANDARDS_COMPLIANCE, label: "Support in Secretarial Standards (SS-1 & SS-2) compliance" }
];

// Professional Types mapping
const professionalTypes = [
  { value: ProfessionalType.COMPANY_SECRETARY, label: "Company Secretary" },
  { value: ProfessionalType.CHARTERED_ACCOUNTANT, label: "Chartered Accountant" },
  { value: ProfessionalType.LAWYER, label: "Lawyer" },
  { value: ProfessionalType.COST_MANAGEMENT_ACCOUNTANT, label: "Cost Management Accountant" },
  { value: ProfessionalType.VALUER, label: "Valuer" },
  { value: ProfessionalType.INSOLVENCY_PROFESSIONAL, label: "Insolvency Professional" }
];

// Main Services mapping
const mainServices = [
  {
    value: MainServiceType.INCORPORATION_BUSINESS_SETUP,
    label: "Incorporation & Business Set-Up",
    subServices: serviceTypes.filter(s => 
      s.value.includes('INCORPORATION') || 
      s.value.includes('CONVERSION') || 
      s.value.includes('DIN') || 
      s.value.includes('DSC') || 
      s.value.includes('NAME') || 
      s.value.includes('DRAFTING') || 
      s.value.includes('COMMENCEMENT')
    )
  },
  {
    value: MainServiceType.SECRETARIAL_COMPLIANCE_FILINGS,
    label: "Secretarial Compliance & Filings",
    subServices: serviceTypes.filter(s => 
      s.value.includes('FILING') || 
      s.value.includes('RETURN') || 
      s.value.includes('APPOINTMENT') || 
      s.value.includes('CHARGES') || 
      s.value.includes('REGISTERS') || 
      s.value.includes('SHARE') || 
      s.value.includes('CAPITAL') || 
      s.value.includes('COMPLIANCE') || 
      s.value.includes('RESOLUTIONS') || 
      s.value.includes('DEPOSITS') || 
      s.value.includes('MSME') || 
      s.value.includes('EVENT') || 
      s.value.includes('LIQUIDATOR') || 
      s.value.includes('COMPOUNDING')
    )
  },
  {
    value: MainServiceType.BOARD_SHAREHOLDER_MEETING_COMPLIANCES,
    label: "Board & Shareholder Meeting Compliances",
    subServices: serviceTypes.filter(s => 
      s.value.includes('DRAFTING_CIRCULATION') || 
      s.value.includes('CONDUCTING_MEETINGS') || 
      s.value.includes('DRAFTING_MINUTES') || 
      s.value.includes('ASSISTANCE_EVOTING') || 
      s.value.includes('PREPARATION_FILING_RESOLUTIONS') || 
      s.value.includes('DRAFTING_SHAREHOLDER') || 
      s.value.includes('SECRETARIAL_STANDARDS')
    )
  }
];

import {
  Professional,
  ProfessionalProfile,
  ProfessionalSelectionCriteria,
  ProfessionalInvitationStats
} from "@/types/professionalInvitation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/auth";

const CreateServiceRequest = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    serviceCategory: [ProfessionalType.COMPANY_SECRETARY] as ProfessionalType[],
    mainServiceTypes: [] as MainServiceType[],
    serviceTypes: [] as ServiceType[],
    scopeOfWork: "",
    budgetRange: { min: 0, max: 0 },
    budgetNotClear: false,
    documents: [] as Array<{id: string; name: string; label: string; url: string; uploadedAt: Date; size: number; type: string;}>,
    questionnaire: [] as Array<{
      id: string;
      question: string;
      answer: string;
      skipped: boolean;
      isRequired: boolean;
      type?: 'text' | 'single' | 'multi';
      options?: string[];
    }>,
    workRequiredBy: new Date(),
    preferredLocations: [] as string[],
    invitedProfessionals: [] as string[],
    repeatPastProfessionals: [] as string[],
    isAIAssisted: false,
    // Professional invitation data
    professionalInvitation: {
      inviteChosenProfessionals: false,
      chosenProfessionalEmails: [''],
      chosenProfessionalPhones: [''],
      repeatPastProfessionals: false,
      selectedPastProfessionals: [],
      maxPlatformSuggestions: 5,
      platformSuggestedProfessionals: [],
      customInvitationMessage: '',
      invitationDeadline: undefined
    } as ProfessionalSelectionCriteria
  });
  const [loading, setLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<{suggestions: string[]} | null>(null);
  const [showSkipQuestionnaireAlert, setShowSkipQuestionnaireAlert] = useState(false);
  const [aiGeneratedScope, setAiGeneratedScope] = useState("");
  const [isGeneratingScope, setIsGeneratingScope] = useState(false);
  const [scopeSaved, setScopeSaved] = useState(false);
  const [aiPrerequisiteAttachments, setAiPrerequisiteAttachments] = useState<string[]>([]);
  const [isGeneratingAttachments, setIsGeneratingAttachments] = useState(false);
  const [documentLabel, setDocumentLabel] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // Professional invitation state
  const [pastProfessionals, setPastProfessionals] = useState<Professional[]>([]);
  const [platformSuggestedProfessionals, setPlatformSuggestedProfessionals] = useState<Professional[]>([]);
  const [chosenProfessionals, setChosenProfessionals] = useState<Professional[]>([]);
  const [finalInvitationList, setFinalInvitationList] = useState<Professional[]>([]);
  const [loadingPast, setLoadingPast] = useState(false);
  const [loadingSuggested, setLoadingSuggested] = useState(false);
  const [checkingEmails, setCheckingEmails] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [activeInviteTab, setActiveInviteTab] = useState("chosen");

  // Service Questionnaire hooks and functions
  const generateQuestionnaireQuestions = useCallback(() => {
    console.log('Generating questionnaire questions for service types:', formData.serviceTypes);
    const questions: typeof formData.questionnaire = [];
    
    // Common questions for all service types
    // 1. Notice circulated as per statutory timelines? (MCQ)
   /*  questions.push(
      {
        id: 'q1',
        question: 'Was Notice of Meeting circulated as per statutory timelines?',
        answer: '',
        skipped: false,
        isRequired: true,
        type: 'single',
        options: ['Yes', 'No']
      },
      // 2. Mode of Meeting (MCQ)
      {
        id: 'q2',
        question: 'Mode of Meeting',
        answer: '',
        skipped: false,
        isRequired: true,
        type: 'single',
        options: ['Physical', 'Video Conference (VC) / Other Audio-Visual Means (OAVM)', 'Hybrid']
      },
      // 3. Attach copy of Notice & Agenda circulated (MCQ placeholder for attachment status)
      {
        id: 'q3',
        question: 'Attach copy of Notice & Agenda circulated:',
        answer: '',
        skipped: false,
        isRequired: false,
        type: 'single',
        options: ['Attached', 'Not Available']
      },
      {
        id: 'q4',
        question: 'What is the primary objective or outcome you expect from this engagement?',
        answer: '',
        skipped: false,
        isRequired: true
      },
      {
        id: 'q5',
        question: 'Are there any regulatory or compliance constraints we should adhere to?',
        answer: '',
        skipped: false,
        isRequired: false
      },
      {
        id: 'q6',
        question: 'Who are the key stakeholders or points of contact for this request?',
        answer: '',
        skipped: false,
        isRequired: false
      },
      {
        id: 'q7',
        question: 'What is your decision timeline for awarding this request (approximate date or window)?',
        answer: '',
        skipped: false,
        isRequired: true
      },
      {
        id: 'q8',
        question: 'Do you prefer professionals with any specific experience, certifications, or industry exposure?',
        answer: '',
        skipped: false,
        isRequired: false
      },
      {
        id: 'q9',
        question: 'Are there any confidentiality or conflict-of-interest considerations?',
        answer: '',
        skipped: false,
        isRequired: false
      },
      {
        id: 'q10',
        question: 'What deliverables do you expect and in what format (reports, certificates, filings, etc.)?',
        answer: '',
        skipped: false,
        isRequired: true
      },
      {
        id: 'q11',
        question: 'Any known risks, dependencies, or assumptions we should be aware of?',
        answer: '',
        skipped: false,
        isRequired: false
      },
      {
        id: 'q12',
        question: 'Do you have preferred meeting times or working hours for coordination?',
        answer: '',
        skipped: false,
        isRequired: false
      }
    ); */

    // Questions based on service type
    if (formData.serviceTypes.includes(ServiceType.PUBLICATION_COMPANIES_ACT) || 
        formData.serviceTypes.includes(ServiceType.PUBLICATION_IBC) ||
        formData.serviceTypes.includes(ServiceType.PUBLICATION_SEBI) ||
        formData.serviceTypes.includes(ServiceType.PUBLICATION_OTHER_LAWS)) {
      questions.push(
        {
          id: 'pub1',
          question: 'In which newspaper should the publication appear?',
          answer: '',
          skipped: false,
          isRequired: false
        },
        {
          id: 'pub2',
          question: 'Should the advertisement be in color or black & white?',
          answer: '',
          skipped: false,
          isRequired: false
        },
        {
          id: 'pub3',
          question: 'Is the publication intended for national or international circulation?',
          answer: '',
          skipped: false,
          isRequired: false
        }
      );
    }

    // Add more question types based on other service types
    if (formData.serviceTypes.includes(ServiceType.VALUATION_COMPANIES_ACT) ||
        formData.serviceTypes.includes(ServiceType.VALUATION_INCOME_TAX_ACT)) {
      questions.push(
        {
          id: 'val1',
          question: 'What is the purpose of this valuation?',
          answer: '',
          skipped: false,
          isRequired: true
        },
        {
          id: 'val2',
          question: 'Do you have all the necessary financial documents ready?',
          answer: '',
          skipped: false,
          isRequired: true
        },
        {
          id: 'val3',
          question: 'What type of assets are being valued (tangible/intangible)?',
          answer: '',
          skipped: false,
          isRequired: false
        }
      );
    }

    // Questions for IBC-related services
    if (formData.serviceTypes.includes(ServiceType.VALUATION_LB_IBC) ||
        formData.serviceTypes.includes(ServiceType.VALUATION_PM_IBC) ||
        formData.serviceTypes.includes(ServiceType.VALUATION_SFA_IBC) ||
        formData.serviceTypes.includes(ServiceType.PUBLICATION_IBC)) {
      questions.push(
        {
          id: 'ibc1',
          question: 'What is the current stage of the IBC proceedings?',
          answer: '',
          skipped: false,
          isRequired: true
        },
        {
          id: 'ibc2',
          question: 'Do you have the NCLT order or relevant court documents?',
          answer: '',
          skipped: false,
          isRequired: false
        }
      );
    }

    // Questions for SEBI-related services
    if (formData.serviceTypes.includes(ServiceType.PUBLICATION_SEBI)) {
      questions.push(
        {
          id: 'sebi1',
          question: 'What type of SEBI compliance publication is required?',
          answer: '',
          skipped: false,
          isRequired: true
        },
        {
          id: 'sebi2',
          question: 'Do you have the draft content ready for publication?',
          answer: '',
          skipped: false,
          isRequired: false
        }
      );
    }

    // Incorporation & Company Formation detailed questionnaire
    const incorporationTypes = [
      ServiceType.INCORPORATION_PRIVATE_LIMITED,
      ServiceType.INCORPORATION_PUBLIC_LIMITED,
      ServiceType.INCORPORATION_OPC,
      ServiceType.INCORPORATION_LLP,
      ServiceType.INCORPORATION_PRODUCER_COMPANY,
      ServiceType.SECTION_8_COMPANY,
      ServiceType.CONVERSION_PROPRIETORSHIP_PARTNERSHIP,
      ServiceType.CONVERSION_COMPANY_TYPES
    ];

    const isIncorporationFlow = formData.serviceTypes.some(t => incorporationTypes.includes(t));
    console.log('Service types:', formData.serviceTypes);
    console.log('Incorporation types:', incorporationTypes);
    console.log('Is incorporation flow:', isIncorporationFlow);

    if (isIncorporationFlow) {
      console.log('Adding incorporation questions...');
      questions.push(
        // Section A: Basic Company Details
        { id: 'inc_name_opt1', question: 'Proposed Company Name - Option 1', answer: '', skipped: false, isRequired: true },
        { id: 'inc_name_opt2', question: 'Proposed Company Name - Option 2 (optional)', answer: '', skipped: false, isRequired: false },
        { id: 'inc_state', question: 'State where the Company will be registered', answer: '', skipped: false, isRequired: true, type: 'single', options: ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Other (specify in next question)'] },
        { id: 'inc_state_other', question: 'If Other state, please specify', answer: '', skipped: false, isRequired: false },
        { id: 'inc_registered_office_address', question: 'Proposed Registered Office Address', answer: '', skipped: false, isRequired: true },
        { id: 'inc_office_ownership', question: 'Ownership status of Registered Office', answer: '', skipped: false, isRequired: true, type: 'single', options: ['Owned', 'Rented (attach Rent Agreement & NOC)', 'Shared Premises'] },

        // Section B: Capital Structure
        { id: 'inc_authorized_capital', question: 'Authorized Share Capital', answer: '', skipped: false, isRequired: true, type: 'single', options: ['₹1,00,000', '₹5,00,000', '₹10,00,000', 'Other (specify in next question)'] },
        { id: 'inc_authorized_capital_other', question: 'If Other authorized capital, please specify amount', answer: '', skipped: false, isRequired: false },
        { id: 'inc_paidup_capital', question: 'Paid-up Share Capital at incorporation', answer: '', skipped: false, isRequired: true, type: 'single', options: ['₹1,00,000', 'Other (specify in next question)'] },
        { id: 'inc_paidup_capital_other', question: 'If Other paid-up capital, please specify amount', answer: '', skipped: false, isRequired: false },
        { id: 'inc_face_value', question: 'Face Value of each Share', answer: '', skipped: false, isRequired: true, type: 'single', options: ['₹10', '₹100', 'Other (specify in next question)'] },
        { id: 'inc_face_value_other', question: 'If Other face value, please specify amount', answer: '', skipped: false, isRequired: false },

        // Section C: Shareholding Pattern
        { id: 'inc_subscribers_count', question: 'Number of Subscribers (Shareholders) to MoA', answer: '', skipped: false, isRequired: true, type: 'single', options: ['2', '3–5', 'More than 5'] },
        { id: 'inc_joint_shareholding', question: 'Will shares be held jointly?', answer: '', skipped: false, isRequired: true, type: 'single', options: ['Yes', 'No'] },
        { id: 'inc_subscriber_details', question: 'Details of each Subscriber (Full Name, Father’s Name, Address, Occupation, No. of Shares). Provide for each subscriber in this format, one per line.', answer: '', skipped: false, isRequired: true },

        // Section D: Directors’ Information
        { id: 'inc_directors_count', question: 'Number of First Directors at incorporation', answer: '', skipped: false, isRequired: true, type: 'single', options: ['2', '3–5', 'More than 5'] },
        { id: 'inc_director_details', question: 'For each Director, provide: Full Name, Father’s Name, Date of Birth, PAN, Aadhaar, Email, Mobile, Address, Occupation. Provide for each director in this format, one per line.', answer: '', skipped: false, isRequired: true },
        { id: 'inc_other_directorships', question: 'Do any Directors already hold Directorship in another company?', answer: '', skipped: false, isRequired: true, type: 'single', options: ['Yes (provide details in next question)', 'No'] },
        { id: 'inc_other_directorships_details', question: 'If Yes, please provide details of other directorships', answer: '', skipped: false, isRequired: false },
        { id: 'inc_disqualification_164', question: 'Are any Directors disqualified under Section 164 of the Companies Act, 2013?', answer: '', skipped: false, isRequired: true, type: 'single', options: ['Yes', 'No'] },

        // Section E: Compliance & Other Requirements
        { id: 'inc_foreign_shareholders', question: 'Will there be any foreign shareholders?', answer: '', skipped: false, isRequired: true, type: 'single', options: ['Yes', 'No'] },
        { id: 'inc_regulated_sector', question: 'Will the Company operate in a sector regulated by RBI, SEBI, IRDAI, etc.?', answer: '', skipped: false, isRequired: true, type: 'single', options: ['Yes (specify in next question)', 'No'] },
        { id: 'inc_regulated_sector_details', question: 'If regulated sector, please specify', answer: '', skipped: false, isRequired: false },
        { id: 'inc_specific_aoa_clauses', question: 'Do you require any specific clauses in the Articles of Association?', answer: '', skipped: false, isRequired: true, type: 'single', options: ['Yes (specify in next question)', 'No'] },
        { id: 'inc_specific_aoa_clauses_details', question: 'If Yes, please specify clauses required in AOA', answer: '', skipped: false, isRequired: false },

        // Section F: Documents Checklist (confirmation)
        { id: 'inc_docs_pan_aadhaar', question: 'Documents Checklist: PAN & Aadhaar of all Directors/Shareholders (Submitted/Pending)', answer: '', skipped: false, isRequired: true },
        { id: 'inc_docs_passport', question: 'Documents Checklist: Passport (if NRI/Foreign National) (Submitted/Pending/Not Applicable)', answer: '', skipped: false, isRequired: false },
        { id: 'inc_docs_address_proof', question: 'Documents Checklist: Proof of Address (Utility bill/Bank statement – not older than 2 months) (Submitted/Pending)', answer: '', skipped: false, isRequired: true },
        { id: 'inc_docs_office_proof', question: 'Documents Checklist: Proof of Registered Office (Electricity Bill/Tax receipt/Lease Deed) (Submitted/Pending)', answer: '', skipped: false, isRequired: true },
        { id: 'inc_docs_noc', question: 'Documents Checklist: NOC from owner (if rented premises) (Submitted/Pending/Not Applicable)', answer: '', skipped: false, isRequired: false },
        { id: 'inc_docs_photos', question: 'Documents Checklist: Passport-size photograph of each Director/Shareholder (Submitted/Pending)', answer: '', skipped: false, isRequired: false },
        { id: 'inc_docs_dsc', question: 'Documents Checklist: DSC of all Directors (Submitted/Pending/To be facilitated)', answer: '', skipped: false, isRequired: false }
      );
    }

    console.log('Generated questions count:', questions.length);
    console.log('Questions:', questions.map(q => q.id));
    
    setFormData(prev => {
      // Avoid redundant updates to prevent effect loops
      const prevStr = JSON.stringify(prev.questionnaire);
      const nextStr = JSON.stringify(questions);
      if (prevStr === nextStr) {
        console.log('Questions unchanged, skipping update');
        return prev;
      }
      console.log('Updating questionnaire with', questions.length, 'questions');
      return {
        ...prev,
        questionnaire: questions
      };
    });
  }, [formData.serviceTypes]);

  // Generate questions when service types change or when entering step 5 (Service Questionnaire)
  useEffect(() => {
    console.log('useEffect triggered - currentStep:', currentStep, 'serviceTypes:', formData.serviceTypes);
    if (currentStep === 5 && formData.serviceTypes.length > 0) {
      console.log('Calling generateQuestionnaireQuestions from useEffect');
      // Always regenerate questions when entering step 5 or when service types change
      generateQuestionnaireQuestions();
    }
  }, [currentStep, formData.serviceTypes, generateQuestionnaireQuestions]);

  const handleQuestionAnswer = (id: string, answer: string) => {
    setFormData(prev => ({
      ...prev,
      questionnaire: prev.questionnaire.map(q => 
        q.id === id ? { ...q, answer, skipped: false } : q
      )
    }));
  };

  const toggleSkipQuestion = (id: string, skipped: boolean) => {
    setFormData(prev => ({
      ...prev,
      questionnaire: prev.questionnaire.map(q => 
        q.id === id ? { ...q, skipped, answer: skipped ? 'Skipped' : '' } : q
      )
    }));
  };

  const handleSkipAllQuestions = () => {
    setShowSkipQuestionnaireAlert(true);
  };

  const confirmSkipQuestionnaire = () => {
    setFormData(prev => ({
      ...prev,
      questionnaire: prev.questionnaire.map(q => ({
        ...q,
        skipped: !q.isRequired,
        answer: !q.isRequired ? 'Skipped' : q.answer
      }))
    }));
    setShowSkipQuestionnaireAlert(false);
  };

  // Professional invitation helper functions
  const addEmailField = () => {
    setFormData(prev => ({
      ...prev,
      professionalInvitation: {
        ...prev.professionalInvitation,
        chosenProfessionalEmails: [...prev.professionalInvitation.chosenProfessionalEmails, ''],
        chosenProfessionalPhones: [...prev.professionalInvitation.chosenProfessionalPhones, '']
      }
    }));
  };

  const updateEmailField = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      professionalInvitation: {
        ...prev.professionalInvitation,
        chosenProfessionalEmails: prev.professionalInvitation.chosenProfessionalEmails.map((email, i) => 
          i === index ? value : email
        )
      }
    }));
  };

  const updatePhoneField = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      professionalInvitation: {
        ...prev.professionalInvitation,
        chosenProfessionalPhones: prev.professionalInvitation.chosenProfessionalPhones.map((phone, i) => 
          i === index ? value : phone
        )
      }
    }));
  };

  const removeEmailField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      professionalInvitation: {
        ...prev.professionalInvitation,
        chosenProfessionalEmails: prev.professionalInvitation.chosenProfessionalEmails.filter((_, i) => i !== index),
        chosenProfessionalPhones: prev.professionalInvitation.chosenProfessionalPhones.filter((_, i) => i !== index)
      }
    }));
  };

  const checkChosenProfessionals = async () => {
    setCheckingEmails(true);
    try {
      const emails = formData.professionalInvitation.chosenProfessionalEmails.filter(email => email.trim());
      const phones = formData.professionalInvitation.chosenProfessionalPhones.filter(phone => phone.trim());
      
      const foundProfessionals = await professionalInvitationService.checkChosenProfessionals(emails, phones);
      setChosenProfessionals(foundProfessionals);
      
      toast({
        title: "Professionals Checked",
        description: `Found ${foundProfessionals.length} registered professionals`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check professionals",
        variant: "destructive"
      });
    } finally {
      setCheckingEmails(false);
    }
  };

  const togglePastProfessional = (professionalId: string) => {
    setFormData(prev => ({
      ...prev,
      professionalInvitation: {
        ...prev.professionalInvitation,
        selectedPastProfessionals: prev.professionalInvitation.selectedPastProfessionals.includes(professionalId)
          ? prev.professionalInvitation.selectedPastProfessionals.filter(id => id !== professionalId)
          : [...prev.professionalInvitation.selectedPastProfessionals, professionalId]
      }
    }));
  };

  const togglePlatformSuggested = (professionalId: string) => {
    setFormData(prev => ({
      ...prev,
      professionalInvitation: {
        ...prev.professionalInvitation,
        platformSuggestedProfessionals: prev.professionalInvitation.platformSuggestedProfessionals.includes(professionalId)
          ? prev.professionalInvitation.platformSuggestedProfessionals.filter(id => id !== professionalId)
          : [...prev.professionalInvitation.platformSuggestedProfessionals, professionalId]
      }
    }));
  };

  const renderProfessionalCard = (
    professional: Professional,
    toggleFunction?: (id: string) => void,
    isSelected?: boolean,
    showExpertiseInsteadOfName?: boolean
  ) => (
    <div key={professional.id} className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center space-x-3">
        {toggleFunction && (
          <Checkbox
            checked={isSelected || false}
            onCheckedChange={() => toggleFunction(professional.id)}
          />
        )}
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h4 className="font-semibold">
              {showExpertiseInsteadOfName
                ? (Array.isArray(professional.specialization)
                    ? professional.specialization.join(', ')
                    : professional.specialization)
                : professional.name}
            </h4>
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(professional.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="text-sm text-gray-600">({professional.rating})</span>
            </div>
          </div>
          {!showExpertiseInsteadOfName && (
            <p className="text-sm text-gray-600">{Array.isArray(professional.specialization) ? professional.specialization.join(', ') : professional.specialization}</p>
          )}
          <p className="text-xs text-gray-500">{professional.location}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => { setSelectedProfileId(professional.id); setProfileDialogOpen(true); }}
        >
          <Eye className="h-4 w-4 mr-1" />
          View Profile
        </Button>
      </div>
    </div>
  );

  // Local Professional Profile Dialog (parity with standalone page)
  interface ProfessionalProfileDialogProps {
    professionalId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }

  const ProfessionalProfileDialog: React.FC<ProfessionalProfileDialogProps> = ({ professionalId, open, onOpenChange }) => {
    const [profile, setProfile] = useState<ProfessionalProfile | null>(null);
    const [loadingProfile, setLoadingProfile] = useState(false);

    const loadProfile = useCallback(async () => {
      if (!professionalId) return;
      setLoadingProfile(true);
      try {
        const profileData = await professionalInvitationService.getProfessionalProfile(professionalId);
        setProfile(profileData);
      } catch (error) {
        console.error('Failed to load professional profile:', error);
        toast({ title: 'Error', description: 'Failed to load professional profile', variant: 'destructive' });
      } finally {
        setLoadingProfile(false);
      }
    }, [professionalId]);

    useEffect(() => {
      if (professionalId && open) {
        loadProfile();
      }
    }, [professionalId, open, loadProfile]);

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Professional Profile</DialogTitle>
          </DialogHeader>

          {loadingProfile ? (
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : profile ? (
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={profile.basicInfo.profileImage} />
                  <AvatarFallback>{profile.basicInfo.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{profile.basicInfo.name}</h3>
                  <p className="text-gray-600">{profile.basicInfo.specialization.join(', ')}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{profile.performance.rating}</span>
                      <span className="text-gray-500">({profile.performance.totalReviews} reviews)</span>
                    </div>
                    <Badge variant={profile.availability.status === 'available' ? 'default' : 'secondary'}>
                      {profile.availability.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Contact Information</h4>
                <div className="space-y-1 text-sm">
                  <p><strong>Location:</strong> {profile.basicInfo.location}</p>
                  <p><strong>Experience:</strong> {profile.basicInfo.experience} years</p>
                  <p><strong>Response Time:</strong> {profile.performance.responseTime}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Specializations</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.basicInfo.specialization.map((spec, index) => (
                    <Badge key={index} variant="outline">{spec}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Qualifications</h4>
                <div className="space-y-2">
                  {profile.qualifications.certifications.length > 0 && (
                    <div>
                      <p className="text-sm font-medium">Certifications:</p>
                      <div className="flex flex-wrap gap-1">
                        {profile.qualifications.certifications.map((cert, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">{cert}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {profile.qualifications.education.length > 0 && (
                    <div>
                      <p className="text-sm font-medium">Education:</p>
                      <div className="flex flex-wrap gap-1">
                        {profile.qualifications.education.map((edu, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">{edu}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Portfolio</h4>
                <p className="text-sm text-gray-600">{profile.portfolio.summary}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Failed to load professional profile</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    );
  };

  // Load mock invite data when entering Step 3 (Invite Professionals)
  useEffect(() => {
    if (currentStep !== 3) return;

    // Seed chosen professional emails/phones if empty or only blanks
    const hasAnyEmail = formData.professionalInvitation.chosenProfessionalEmails.some(e => e.trim());
    if (!hasAnyEmail) {
      setFormData(prev => ({
        ...prev,
        professionalInvitation: {
          ...prev.professionalInvitation,
          chosenProfessionalEmails: [
            'r.kapoor@lawpro.in',
            'n.patel@csdesk.com'
          ],
          chosenProfessionalPhones: [
            '+91-9876543210',
            '+91-9898989898'
          ]
        }
      }));
    }

    // Default custom message if empty
    if (!formData.professionalInvitation.customInvitationMessage?.trim()) {
      setFormData(prev => ({
        ...prev,
        professionalInvitation: {
          ...prev.professionalInvitation,
          customInvitationMessage: 'Hello, we would like to invite you to submit a bid for our service request on 998p. Please review the scope and timeline and share your proposal.'
        }
      }));
    }

    // Mock past professionals
    setLoadingPast(true);
    const mockPast: Professional[] = [
      {
        id: 'past-1',
        name: 'Rohit Kapoor',
        email: 'r.kapoor@lawpro.in',
        phone: '+91-9876543210',
        isRegistered: true,
        specialization: ['Corporate Law', 'IBC'],
        location: 'Mumbai, IN',
        rating: 4.7,
        totalReviews: 128,
        completedProjects: 240,
        responseTime: '2h',
        availability: 'available',
        lastActive: new Date(),
        experience: 12,
        qualifications: ['LLB', 'Company Law Certification'],
        languages: ['English', 'Hindi'],
        hourlyRate: 150,
        projectRate: 1200,
        portfolioSummary: 'Handled multiple corporate restructuring cases under IBC.',
        isVerified: true,
        isPastProfessional: true
      },
      {
        id: 'past-2',
        name: 'Neha Patel',
        email: 'n.patel@csdesk.com',
        phone: '+91-9898989898',
        isRegistered: true,
        specialization: ['SEBI Compliance', 'Company Secretary'],
        location: 'Ahmedabad, IN',
        rating: 4.5,
        totalReviews: 86,
        completedProjects: 160,
        responseTime: '4h',
        availability: 'busy',
        lastActive: new Date(),
        experience: 9,
        qualifications: ['CS', 'LLM (Corporate Laws)'],
        languages: ['English', 'Gujarati', 'Hindi'],
        projectRate: 900,
        isVerified: true,
        isPastProfessional: true
      },
      {
        id: 'past-3',
        name: 'Amit Verma',
        email: 'amit.verma@valuerhub.in',
        phone: '+91-9900099000',
        isRegistered: true,
        specialization: ['Valuation - Companies Act', 'Tangible Assets'],
        location: 'Delhi, IN',
        rating: 4.3,
        totalReviews: 64,
        completedProjects: 110,
        responseTime: '6h',
        availability: 'available',
        lastActive: new Date(),
        experience: 7,
        qualifications: ['Registered Valuer (SFA)'],
        languages: ['English', 'Hindi'],
        isVerified: false,
        isPastProfessional: true
      }
    ];

    // Mock platform suggestions
    setLoadingSuggested(true);
    const mockSuggested: Professional[] = [
      {
        id: 'sug-1',
        name: 'Priya Sharma',
        email: 'priya.sharma@insolvpro.in',
        phone: '+91-9000000001',
        isRegistered: true,
        specialization: ['Insolvency Professional', 'IBC'],
        location: 'Pune, IN',
        rating: 4.8,
        totalReviews: 210,
        completedProjects: 300,
        responseTime: '1h',
        availability: 'available',
        lastActive: new Date(),
        experience: 14,
        qualifications: ['IP (IBBI)', 'MBA Finance'],
        languages: ['English', 'Hindi', 'Marathi'],
        isVerified: true,
        isPlatformSuggested: true
      },
      {
        id: 'sug-2',
        name: 'Sandeep Gupta',
        email: 'sandeep.g@cavalor.in',
        phone: '+91-9000000002',
        isRegistered: true,
        specialization: ['Chartered Accountant', 'Tax Valuation'],
        location: 'Bengaluru, IN',
        rating: 4.6,
        totalReviews: 150,
        completedProjects: 220,
        responseTime: '3h',
        availability: 'busy',
        lastActive: new Date(),
        experience: 10,
        qualifications: ['CA', 'Registered Valuer (LB)'],
        languages: ['English', 'Kannada', 'Hindi'],
        isVerified: true,
        isPlatformSuggested: true
      },
      {
        id: 'sug-3',
        name: 'Ananya Iyer',
        email: 'ananya.iyer@legit.in',
        phone: '+91-9000000003',
        isRegistered: true,
        specialization: ['Corporate Law', 'SEBI'],
        location: 'Chennai, IN',
        rating: 4.4,
        totalReviews: 95,
        completedProjects: 140,
        responseTime: '5h',
        availability: 'available',
        lastActive: new Date(),
        experience: 8,
        qualifications: ['LLB', 'CS'],
        languages: ['English', 'Tamil'],
        isVerified: false,
        isPlatformSuggested: true
      }
    ];

    // Simulate loading
    const t1 = setTimeout(() => {
      setPastProfessionals(mockPast);
      setLoadingPast(false);
    }, 500);
    const t2 = setTimeout(() => {
      setPlatformSuggestedProfessionals(mockSuggested);
      setLoadingSuggested(false);
    }, 700);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [currentStep]);

  const steps = [
    { id: 1, title: "Service Category", description: "Select professional type and services" },
    { id: 2, title: "Scope of Work", description: "Define project requirements" },
    { id: 3, title: "Invite Professionals", description: "Select and invite professionals to bid" },
    { id: 4, title: "Supporting Documents", description: "Upload relevant files" },
    { id: 5, title: "Service Questionnaire", description: "Additional requirements" },
    { id: 6, title: "Timeline & Location", description: "Deadline and preferences" },
    { id: 7, title: "Review & Submit", description: "Final review" }
  ];

  const professionalTypes = [
    { value: ProfessionalType.LAWYER, label: "Lawyer" },
    { value: ProfessionalType.CHARTERED_ACCOUNTANT, label: "Chartered Accountant" },
    { value: ProfessionalType.COMPANY_SECRETARY, label: "Company Secretary" },
    { value: ProfessionalType.COST_MANAGEMENT_ACCOUNTANT, label: "Cost and Management Accountant" },
    { value: ProfessionalType.VALUER, label: "Valuer" },
    { value: ProfessionalType.INSOLVENCY_PROFESSIONAL, label: "Insolvency Professional" }
  ];

  const mainServices = [
    {
      value: MainServiceType.INCORPORATION_BUSINESS_SETUP,
      label: "Incorporation & Business Set-Up",
      subServices: [
        { value: ServiceType.INCORPORATION_PRIVATE_LIMITED, label: "Incorporation of Private Limited Company" },
        { value: ServiceType.INCORPORATION_PUBLIC_LIMITED, label: "Incorporation of Public Limited Company" },
        { value: ServiceType.INCORPORATION_OPC, label: "Incorporation of One Person Company (OPC)" },
        { value: ServiceType.INCORPORATION_LLP, label: "Incorporation of Limited Liability Partnership (LLP)" },
        { value: ServiceType.INCORPORATION_PRODUCER_COMPANY, label: "Incorporation of Producer Company" },
        { value: ServiceType.SECTION_8_COMPANY, label: "Section 8 (Not-for-Profit) Company Registration" },
        { value: ServiceType.CONVERSION_PROPRIETORSHIP_PARTNERSHIP, label: "Conversion of Proprietorship/Partnership into Company/LLP" },
        { value: ServiceType.CONVERSION_COMPANY_TYPES, label: "Conversion of Private Company into Public/OPC/LLP & vice versa" },
        { value: ServiceType.DIN_OBTAINING, label: "Obtaining Director Identification Number (DIN)" },
        { value: ServiceType.DSC_FACILITATION, label: "Digital Signature Certificates (DSC) facilitation" },
        { value: ServiceType.NAME_RESERVATION_CHANGE, label: "Name Reservation & Change of Name" },
        { value: ServiceType.DRAFTING_MOA_AOA, label: "Drafting Memorandum & Articles of Association" },
        { value: ServiceType.COMMENCEMENT_BUSINESS_FILINGS, label: "Commencement of Business filings" }
      ]
    },
    {
      value: MainServiceType.SECRETARIAL_COMPLIANCE_FILINGS,
      label: "Secretarial Compliance & Filings",
      subServices: [
        { value: ServiceType.ANNUAL_RETURN_FILING, label: "Annual Return filing (MGT-7/MGT-7A)" },
        { value: ServiceType.FINANCIAL_STATEMENT_FILING, label: "Financial Statement filing (AOC-4/AOC-4 XBRL)" },
        { value: ServiceType.DIRECTOR_APPOINTMENT_RESIGNATION, label: "Appointment/Reappointment/Resignation of Directors (DIR-12)" },
        { value: ServiceType.AUDITOR_APPOINTMENT_RESIGNATION, label: "Appointment/Resignation of Auditors (ADT-1/ADT-3)" },
        { value: ServiceType.FILING_OF_CHARGES, label: "Filing of Charges (CHG-1, CHG-4, CHG-9)" },
        { value: ServiceType.STATUTORY_REGISTERS_MAINTENANCE, label: "Maintenance of Statutory Registers (Members, Directors, Charges, etc.)" },
        { value: ServiceType.SHARE_ISSUE_ALLOTMENT_TRANSFER, label: "Issue/Allotment/Transfer of Shares (PAS-3, SH-4, SH-7)" },
        { value: ServiceType.BUYBACK_REDUCTION_SHARE_CAPITAL, label: "Buyback/Reduction of Share Capital filings" },
        { value: ServiceType.INCREASE_AUTHORISED_SHARE_CAPITAL, label: "Increase in Authorised Share Capital filings" },
        { value: ServiceType.LISTED_COMPANIES_COMPLIANCE, label: "Compliance for Listed Companies (LODR, SEBI Regulations)" },
        { value: ServiceType.RESOLUTIONS_FILING_ROC, label: "Filing of Resolutions with ROC (MGT-7, MGT-14)" },
        { value: ServiceType.RETURN_OF_DEPOSITS_FILING, label: "Filing of Return of Deposits (DPT-3)" },
        { value: ServiceType.MSME_RETURN_FILING, label: "MSME Return filing (MSME-1)" },
        { value: ServiceType.EVENT_BASED_COMPLIANCES, label: "Event-based compliances (change in registered office, alteration in MOA/AOA, etc.)" },
        { value: ServiceType.LIQUIDATOR_DOCUMENTS_FILING, label: "Filing liquidator's documents" },
        { value: ServiceType.COMPOUNDING_OF_OFFENCES, label: "Compounding of offences" }
      ]
    },
    {
      value: MainServiceType.BOARD_SHAREHOLDER_MEETING_COMPLIANCES,
      label: "Board & Shareholder Meeting Compliances",
      subServices: [
        { value: ServiceType.DRAFTING_CIRCULATION_NOTICE_AGENDA, label: "Drafting & Circulation of Notice & Agenda for Board/General Meetings" },
        { value: ServiceType.CONDUCTING_MEETINGS, label: "Conducting Meetings (Board Meetings, Committee Meetings, General Meetings)" },
        { value: ServiceType.DRAFTING_MINUTES, label: "Drafting of Minutes (Board Meetings, Committee Meetings, General Meetings)" },
        { value: ServiceType.ASSISTANCE_EVOTING_POSTAL_BALLOT, label: "Assistance in e-voting & postal ballot" },
        { value: ServiceType.PREPARATION_FILING_RESOLUTIONS_ROC, label: "Preparation & filing of resolutions with ROC" },
        { value: ServiceType.DRAFTING_SHAREHOLDER_AGREEMENTS_POLICIES, label: "Drafting of shareholder agreements & corporate governance policies" },
        { value: ServiceType.SECRETARIAL_STANDARDS_COMPLIANCE, label: "Support in Secretarial Standards (SS-1 & SS-2) compliance" }
      ]
    }
  ];

  // Generate AI scope of work based on selected services
  const generateAIScope = async () => {
    if (formData.serviceCategory.length === 0 || formData.serviceTypes.length === 0) {
      toast({
        title: "Selection Required",
        description: "Please select professional type and service types to generate AI scope of work.",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingScope(true);
    try {
      // Mock AI generation - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const selectedServices = formData.serviceTypes.map(type => {
        const service = serviceTypes.find(s => s.value === type);
        return service ? service.label : type;
      }).join(", ");
      
      const selectedProfessionals = formData.serviceCategory.map(cat => 
        cat.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
      ).join(", ");
      
      const aiScope = `Based on your selection of ${selectedProfessionals} services for ${selectedServices}, here is the recommended scope of work:

1. Initial Assessment & Documentation Review
   - Review existing company documents and compliance status
   - Identify gaps and requirements for the selected services
   - Prepare timeline and milestone plan

2. Service Execution
   - Execute the selected services as per regulatory requirements
   - Ensure compliance with all applicable laws and regulations
   - Maintain proper documentation and records

3. Deliverables & Compliance
   - Provide all required filings and documentation
   - Submit necessary forms to regulatory authorities
   - Ensure timely completion within statutory deadlines

4. Post-Service Support
   - Provide status updates and confirmation of completion
   - Assist with any follow-up requirements
   - Maintain records for future reference

This scope ensures comprehensive coverage of your requirements while maintaining regulatory compliance.`;
      
      setAiGeneratedScope(aiScope);
      setFormData(prev => ({
        ...prev,
        scopeOfWork: aiScope,
        isAIAssisted: true
      }));
      
      toast({
        title: "AI Scope Generated",
        description: "AI has generated a comprehensive scope of work based on your selections."
      });
    } catch (error) {
      console.error('Error generating AI scope:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate AI scope of work. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingScope(false);
    }
  };

  // Simple AI assistance for Step 1 description
  const handleAIAssistance = async () => {
    if (formData.serviceCategory.length === 0 && formData.serviceTypes.length === 0) {
      toast({ title: "Selection Required", description: "Please select at least a professional type or service types to get AI suggestions.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      // Mock AI latency
      await new Promise(resolve => setTimeout(resolve, 1200));
      const selectedServices = formData.serviceTypes.map(type => {
        const s = serviceTypes.find(st => st.value === type);
        return s ? s.label : String(type).replace(/_/g, ' ').toLowerCase();
      }).join(", ");
      const selectedProfessionals = formData.serviceCategory.map(cat => {
        const p = professionalTypes.find(pt => pt.value === cat);
        return p ? p.label : String(cat).replace(/_/g, ' ').toLowerCase();
      }).join(", ");
      const suggestion = `Looking to engage ${selectedProfessionals || 'a suitable professional'} for ${selectedServices || 'the required services'}. Please assist with end-to-end compliance, documentation, and statutory timelines.`;
      setFormData(prev => ({
        ...prev,
        description: prev.description && prev.description.trim().length > 0 ? prev.description : suggestion,
        isAIAssisted: true
      }));
      toast({ title: "AI Suggestion Ready", description: "A suggested description has been prepared. You can edit it as needed." });
    } catch (e) {
      toast({ title: "Generation Failed", description: "Failed to generate AI suggestion. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // Confirm and mark the scope of work as saved
  const saveDescription = () => {
    const text = formData.scopeOfWork?.trim();
    if (!text) {
      toast({ title: "Scope Required", description: "Please enter the scope of work before confirming.", variant: "destructive" });
      return;
    }
    setScopeSaved(true);
    toast({ title: "Scope Saved", description: "Your scope of work has been saved." });
  };

  // Generate prerequisite attachments (mock AI)
  const generatePrerequisiteAttachments = async () => {
    const scope = formData.scopeOfWork?.trim();
    if (!scope) {
      toast({ title: "Scope Needed", description: "Please provide or generate a scope of work before requesting document suggestions.", variant: "destructive" });
      return;
    }
    setIsGeneratingAttachments(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const suggestions = new Set<string>();
      suggestions.add("Notice of Meeting (with agenda & notes to agenda)");
      suggestions.add("List of Invitees (directors, members, auditors, special invitees)");
      suggestions.add("Proof of Dispatch of Notice (email, hand delivery, or post records)");
      setAiPrerequisiteAttachments(Array.from(suggestions));
      toast({ title: "Suggestions Ready", description: "Recommended prerequisite documents have been listed." });
    } catch (e) {
      toast({ title: "Generation Failed", description: "Could not generate document suggestions. Please try again.", variant: "destructive" });
    } finally {
      setIsGeneratingAttachments(false);
    }
  };

  // Handle file input change for document uploads
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    const validFiles: File[] = [];
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/jpeg',
      'image/jpg',
      'image/png'
    ];
    Array.from(files).forEach(file => {
      if (file.size > maxSize) {
        toast({ title: "File Too Large", description: `${file.name} is larger than 10MB. Please choose a smaller file.`, variant: "destructive" });
        return;
      }
      if (!allowedTypes.includes(file.type)) {
        toast({ title: "Invalid File Type", description: `${file.name} is not a supported file type.`, variant: "destructive" });
        return;
      }
      validFiles.push(file);
    });
    if (validFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...validFiles]);
      toast({ title: "Files Selected", description: `${validFiles.length} file(s) selected successfully.` });
    }
    // reset input so the same file can be re-selected if needed
    event.target.value = '';
  };

  // Persist selected files into formData.documents with a label
  const saveDocuments = () => {
    const label = documentLabel?.trim();
    if (!label) {
      toast({ title: "Label Required", description: "Please enter a document label before saving.", variant: "destructive" });
      return;
    }
    if (uploadedFiles.length === 0) {
      toast({ title: "No Files Selected", description: "Please select files to save.", variant: "destructive" });
      return;
    }
    const newDocuments = uploadedFiles.map(file => ({
      id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      label,
      url: URL.createObjectURL(file),
      uploadedAt: new Date(),
      size: file.size,
      type: file.type,
      file
    }));
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, ...newDocuments]
    }));
    setUploadedFiles([]);
    setDocumentLabel("");
    toast({ title: "Documents Saved", description: `${newDocuments.length} document(s) saved successfully with label "${label}".` });
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveDraft = async () => {
    setLoading(true);
    try {
      await serviceRequestService.createServiceRequest({
        ...formData,
        status: ServiceRequestStatus.DRAFT
      });
      toast({
        title: "Draft Saved",
        description: "Your service request has been saved as draft."
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save draft. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // State for SRRN popup
  const [showSRRNPopup, setShowSRRNPopup] = useState<boolean>(false);
  const [generatedSRRN, setGeneratedSRRN] = useState<string>("");

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Mock API call to create service request
      const result = await serviceRequestService.createServiceRequest({
        ...formData,
        status: ServiceRequestStatus.OPEN
      });
      
      // Generate a mock SRRN (Service Request Reference Number)
      const srrn = `SR-${Math.floor(100000 + Math.random() * 900000)}-${new Date().getFullYear()}`;
      
      // Set the SRRN and show popup
      setGeneratedSRRN(srrn);
      
      toast({
        title: "Service Request Submitted",
        description: "Your service request has been published successfully."
      });
      
      // Show the popup after a short delay to ensure state updates properly
      setTimeout(() => {
        setShowSRRNPopup(true);
      }, 100);
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Failed to submit service request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancel = () => {
    // Show confirmation dialog before canceling
    if (window.confirm("Are you sure you want to cancel? All unsaved changes will be lost.")) {
      // Reset form or redirect to service requests list
      window.history.back();
    }
  };

  // Proceed to next step
  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold">Service Description</Label>
              <p className="text-sm text-gray-600 mb-3">
                Describe your service requirement or use AI assistance
              </p>
              <Textarea
                placeholder="Describe your service requirement in detail..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="min-h-32"
              />
              <Button 
                variant="outline" 
                className="mt-3"
                onClick={handleAIAssistance}
                disabled={loading}
              >
                <Wand2 className="h-4 w-4 mr-2" />
                Get AI Suggestions
              </Button>
            </div>

            <div>
              <Label className="text-base font-semibold">Professional Type</Label>
              <p className="text-sm text-gray-600 mb-3">
                Select one or more professional types
              </p>
              <div className="grid grid-cols-2 gap-3">
                {professionalTypes.map((type) => (
                  <div key={type.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={type.value}
                      checked={formData.serviceCategory.includes(type.value)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData(prev => ({
                            ...prev,
                            serviceCategory: [...prev.serviceCategory, type.value]
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            serviceCategory: prev.serviceCategory.filter(cat => cat !== type.value)
                          }));
                        }
                      }}
                    />
                    <Label htmlFor={type.value} className="text-sm">
                      {type.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-base font-semibold">Service Types</Label>
              <p className="text-sm text-gray-600 mb-3">
                Select main service categories and specific services required
              </p>
              <div className="space-y-4">
                {mainServices.map((mainService) => (
                  <div key={mainService.value} className="border rounded-lg p-4">
                    <div className="mb-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={mainService.value}
                          checked={formData.mainServiceTypes.includes(mainService.value)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData(prev => ({
                                ...prev,
                                mainServiceTypes: [...prev.mainServiceTypes, mainService.value]
                              }));
                            } else {
                              setFormData(prev => ({
                                ...prev,
                                mainServiceTypes: prev.mainServiceTypes.filter(type => type !== mainService.value),
                                serviceTypes: prev.serviceTypes.filter(type => 
                                  !mainService.subServices.some(sub => sub.value === type)
                                )
                              }));
                            }
                          }}
                        />
                        <Label htmlFor={mainService.value} className="text-lg font-semibold text-blue-800 flex items-center">
                          <Briefcase className="h-5 w-5 mr-2" />
                          {mainService.label}
                        </Label>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 ml-6">
                        Select specific services required
                      </p>
                    </div>
                    
                    {formData.mainServiceTypes.includes(mainService.value) && (
                      <div className="grid grid-cols-1 gap-2 ml-6">
                        {mainService.subServices.map((service) => (
                          <div key={service.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={service.value}
                              checked={formData.serviceTypes.includes(service.value)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFormData(prev => ({
                                    ...prev,
                                    serviceTypes: [...prev.serviceTypes, service.value]
                                  }));
                                } else {
                                  setFormData(prev => ({
                                    ...prev,
                                    serviceTypes: prev.serviceTypes.filter(type => type !== service.value)
                                  }));
                                }
                              }}
                            />
                            <Label htmlFor={service.value} className="text-sm">
                              {service.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <Label className="text-base font-semibold">Scope of Work</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    Define the detailed scope of work for this project
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={generateAIScope}
                  disabled={isGeneratingScope || formData.serviceCategory.length === 0 || formData.serviceTypes.length === 0}
                  className="flex items-center gap-2"
                >
                  <Wand2 className="h-4 w-4" />
                  {isGeneratingScope ? "Generating..." : "Generate AI Scope"}
                </Button>
              </div>
              
              <Textarea
                placeholder="Enter detailed scope of work or use AI to generate..."
                value={formData.scopeOfWork}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, scopeOfWork: e.target.value }));
                  setScopeSaved(false);
                }}
                className="min-h-40"
              />
              
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2">
                  {scopeSaved && (
                    <div className="flex items-center gap-1 text-green-600 text-sm">
                      <Save className="h-4 w-4" />
                      <span>Description saved</span>
                    </div>
                  )}
                  {aiGeneratedScope && (
                    <div className="text-sm text-blue-600">
                      AI-generated content (editable)
                    </div>
                  )}
                </div>
                
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onClick={saveDescription}
                  disabled={!formData.scopeOfWork.trim()}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Confirm Scope of Work
                </Button>
              </div>
            </div>

            <div>
              <Label className="text-base font-semibold">Budget Range (Optional)</Label>
              <p className="text-sm text-gray-600 mb-3">
                Specify your budget range if known
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <Label className="text-sm">Minimum Amount</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={formData.budgetRange.min}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      budgetRange: { ...prev.budgetRange, min: Number(e.target.value) }
                    }))}
                  />
                </div>
                <div className="flex-1">
                  <Label className="text-sm">Maximum Amount</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={formData.budgetRange.max}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      budgetRange: { ...prev.budgetRange, max: Number(e.target.value) }
                    }))}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2 mt-3">
                <Checkbox
                  id="budget-not-clear"
                  checked={formData.budgetNotClear}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, budgetNotClear: !!checked }))}
                />
                <Label htmlFor="budget-not-clear" className="text-sm">
                  Budget not clear / Open for discussion
                </Label>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <div className="flex items-start">
                <UserPlus className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-blue-800">Invite Professionals</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Select and invite professionals to bid on your service request. You can invite specific professionals, reconnect with previous ones, or choose from platform suggestions.
                  </p>
                </div>
              </div>
            </div>

            <Tabs value={activeInviteTab} onValueChange={setActiveInviteTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="chosen">Chosen Professionals</TabsTrigger>
                <TabsTrigger value="past">Previous Professionals</TabsTrigger>
                <TabsTrigger value="suggested">Platform Suggestions</TabsTrigger>
              </TabsList>

              {/* Chosen Professionals Tab */}
              <TabsContent value="chosen" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-start space-x-2">
                      <div className="mt-1">
                        <Checkbox
                          id="invite-chosen"
                          checked={formData.professionalInvitation.inviteChosenProfessionals}
                          onCheckedChange={(checked) => 
                            setFormData(prev => ({ 
                              ...prev, 
                              professionalInvitation: { 
                                ...prev.professionalInvitation, 
                                inviteChosenProfessionals: !!checked 
                              } 
                            }))
                          }
                        />
                      </div>
                      <div className="flex-1">
                        <Label htmlFor="invite-chosen" className="text-lg font-semibold flex items-center">
                          <Mail className="h-5 w-5 mr-2 text-blue-600" />
                          Invite Chosen Professionals
                        </Label>
                        <p className="text-sm text-gray-600 mt-1">
                          Invite specific professionals by providing their email/mobile. If they're registered, they'll be added to your invitation list. Otherwise, they'll receive a registration invitation.
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  {formData.professionalInvitation.inviteChosenProfessionals && (
                    <CardContent className="space-y-4">
                      {formData.professionalInvitation.chosenProfessionalEmails.map((email, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="flex-1">
                            <Input
                              placeholder="Professional email"
                              value={email}
                              onChange={(e) => updateEmailField(index, e.target.value)}
                            />
                          </div>
                          <div className="flex-1">
                            <Input
                              placeholder="Professional mobile (optional)"
                              value={formData.professionalInvitation.chosenProfessionalPhones[index] || ''}
                              onChange={(e) => updatePhoneField(index, e.target.value)}
                            />
                          </div>
                          {formData.professionalInvitation.chosenProfessionalEmails.length > 1 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeEmailField(index)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={addEmailField}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Another Professional
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={checkChosenProfessionals}
                          disabled={checkingEmails || !formData.professionalInvitation.chosenProfessionalEmails.some(email => email.trim())}
                        >
                          {checkingEmails ? (
                            <>
                              <Clock className="h-4 w-4 mr-2 animate-spin" />
                              Checking...
                            </>
                          ) : (
                            <>
                              <Search className="h-4 w-4 mr-2" />
                              Check Professionals
                            </>
                          )}
                        </Button>
                      </div>
                      {chosenProfessionals.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-semibold text-green-600 flex items-center">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Found Registered Professionals:
                          </h4>
                          <div className="space-y-2">
                            {chosenProfessionals.map(professional => 
                              renderProfessionalCard(professional)
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              </TabsContent>

              {/* Past Professionals Tab */}
              <TabsContent value="past" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-start space-x-2">
                      <div className="mt-1">
                        <Checkbox
                          id="repeat-past"
                          checked={formData.professionalInvitation.repeatPastProfessionals}
                          onCheckedChange={(checked) => 
                            setFormData(prev => ({ 
                              ...prev, 
                              professionalInvitation: { 
                                ...prev.professionalInvitation, 
                                repeatPastProfessionals: !!checked 
                              } 
                            }))
                          }
                        />
                      </div>
                      <div className="flex-1">
                        <Label htmlFor="repeat-past" className="text-lg font-semibold flex items-center">
                          <History className="h-5 w-5 mr-2 text-purple-600" />
                          Reconnect with Previous Professionals
                        </Label>
                        <p className="text-sm text-gray-600 mt-1">
                          Select from professionals you've worked with before. They'll be prioritized in your invitation list.
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  {formData.professionalInvitation.repeatPastProfessionals && (
                    <CardContent>
                      {loadingPast ? (
                        <div className="space-y-2">
                          {[1, 2, 3].map(i => (
                            <div key={i} className="h-24 w-full bg-gray-200 animate-pulse rounded" />
                          ))}
                        </div>
                      ) : pastProfessionals.length > 0 ? (
                        <div className="space-y-2">
                          {pastProfessionals.map(professional => 
                            renderProfessionalCard(
                              professional,
                              togglePastProfessional,
                              formData.professionalInvitation.selectedPastProfessionals.includes(professional.id)
                            )
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <History className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                          <p>No previous professionals found</p>
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              </TabsContent>

              {/* Platform Suggested Tab */}
              <TabsContent value="suggested" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center space-x-2">
                          <Target className="h-5 w-5 text-emerald-600" />
                          <span>Platform-Suggested Professionals</span>
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          AI-curated professionals based on your requirements, location, ratings, and availability.
                        </p>
                      </div>
                      <Select
                        value={formData.professionalInvitation.maxPlatformSuggestions.toString()}
                        onValueChange={(value) => 
                          setFormData(prev => ({ 
                            ...prev, 
                            professionalInvitation: { 
                              ...prev.professionalInvitation, 
                              maxPlatformSuggestions: parseInt(value) 
                            } 
                          }))
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3 suggestions</SelectItem>
                          <SelectItem value="5">5 suggestions</SelectItem>
                          <SelectItem value="10">10 suggestions</SelectItem>
                          <SelectItem value="15">15 suggestions</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {loadingSuggested ? (
                      <div className="space-y-2">
                        {[1, 2, 3, 4, 5].map(i => (
                          <div key={i} className="h-24 w-full bg-gray-200 animate-pulse rounded" />
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {platformSuggestedProfessionals.map(professional => 
                          renderProfessionalCard(
                            professional,
                            togglePlatformSuggested,
                            formData.professionalInvitation.platformSuggestedProfessionals.includes(professional.id),
                            true
                          )
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Custom Invitation Message */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
                  Custom Invitation Message (Optional)
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Add a personalized message to your invitation
                </p>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="We would like to invite you to submit a bid for our service request..."
                  value={formData.professionalInvitation.customInvitationMessage}
                  onChange={(e) => 
                    setFormData(prev => ({ 
                      ...prev, 
                      professionalInvitation: { 
                        ...prev.professionalInvitation, 
                        customInvitationMessage: e.target.value 
                      } 
                    }))
                  }
                  className="min-h-24"
                />
              </CardContent>
            </Card>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            {/* AI-Generated Prerequisite Attachments */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <Label className="text-base font-semibold">AI-Suggested Prerequisite Documents</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    Based on your scope of work, these documents are recommended
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={generatePrerequisiteAttachments}
                  disabled={isGeneratingAttachments || !formData.scopeOfWork.trim()}
                  className="flex items-center gap-2"
                >
                  <Wand2 className="h-4 w-4" />
                  {isGeneratingAttachments ? "Generating..." : "Generate Suggestions"}
                </Button>
              </div>
              
              {aiPrerequisiteAttachments.length > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">Recommended Documents:</h4>
                  <ul className="space-y-1">
                    {aiPrerequisiteAttachments.map((attachment, index) => (
                      <li key={index} className="text-sm text-blue-800 flex items-center">
                        <FileText className="h-3 w-3 mr-2" />
                        {attachment}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-blue-600 mt-2">
                    These are AI-generated suggestions based on your scope of work. You may upload these or other relevant documents.
                  </p>
                </div>
              )}
            </div>

            {/* Document Upload Section */}
            <div>
              <Label className="text-base font-semibold">Upload Supporting Documents</Label>
              <p className="text-sm text-gray-600 mb-4">
                Upload any relevant documents that will help professionals understand your requirements
              </p>
              
              {/* Document Label Input */}
              <div className="mb-4">
                <Label className="text-sm font-medium">Document Label</Label>
                <Input
                  type="text"
                  placeholder="Enter a label for your document (e.g., 'Financial Statements', 'Company Profile')"
                  value={documentLabel}
                  onChange={(e) => setDocumentLabel(e.target.value)}
                  className="mt-2"
                />
              </div>
              
              {/* File Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-sm text-gray-600 mb-2">Drag and drop files here, or click to browse</p>
                <p className="text-xs text-gray-500 mb-4">Supported formats: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (Max 10MB each)</p>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <Button 
                  variant="outline" 
                  className="mb-4"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Files
                </Button>
              </div>
              
              {/* Uploaded Files Display */}
              {uploadedFiles.length > 0 && (
                <div className="mt-4">
                  <Label className="text-sm font-medium">Selected Files:</Label>
                  <div className="space-y-2 mt-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 text-gray-500 mr-2" />
                          <div>
                            <span className="text-sm font-medium">{file.name}</span>
                            <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setUploadedFiles(prev => prev.filter((_, i) => i !== index));
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Save Documents Button */}
              {uploadedFiles.length > 0 && (
                <div className="mt-4">
                  <Button
                    type="button"
                    onClick={saveDocuments}
                    disabled={!documentLabel.trim()}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Save Documents
                  </Button>
                  {!documentLabel.trim() && (
                    <p className="text-xs text-red-500 mt-1">Please enter a document label before saving</p>
                  )}
                </div>
              )}
              
              {/* Saved Documents Display */}
              {formData.documents.length > 0 && (
                <div className="mt-6">
                  <Label className="text-sm font-medium">Saved Documents:</Label>
                  <div className="space-y-2 mt-2">
                    {formData.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 text-green-600 mr-2" />
                          <div>
                            <span className="text-sm font-medium">{doc.label || doc.name}</span>
                            <p className="text-xs text-gray-500">{doc.name} • {doc.size}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              documents: prev.documents.filter((_, i) => i !== index)
                            }));
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );



      case 5:
        console.log('Rendering Step 5 - Current questionnaire:', formData.questionnaire);
        console.log('Current service types:', formData.serviceTypes);
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-blue-800">Service Questionnaire</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Please answer the following questions to help us better understand your requirements. 
                    You can skip optional questions, but providing more details will help us match you with the right professionals.
                  </p>
                </div>
              </div>
            </div>

            {formData.questionnaire.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No questions available. Please select service types in Step 1.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {formData.questionnaire.map((question) => (
                  <div key={question.id} className="space-y-2">
                    <div className="flex items-start justify-between">
                      <Label className="text-sm font-medium">
                        {question.question}
                        {question.isRequired && <span className="text-red-500 ml-1">*</span>}
                      </Label>
                      {!question.isRequired && (
                        <div className="flex items-center space-x-2 ml-4">
                          <Label htmlFor={`skip-${question.id}`} className="text-sm text-gray-600">
                            Skip
                          </Label>
                          <Switch
                            id={`skip-${question.id}`}
                            checked={question.skipped}
                            onCheckedChange={(checked) => toggleSkipQuestion(question.id, checked)}
                            className="data-[state=checked]:bg-blue-600"
                          />
                        </div>
                      )}
                    </div>
                    
                    {!question.skipped && (
                      <>
                        {question.type === 'single' && question.options && question.options.length > 0 ? (
                          <RadioGroup
                            value={question.answer}
                            onValueChange={(val) => handleQuestionAnswer(question.id, val)}
                            className="space-y-2"
                          >
                            {question.options.map((opt) => (
                              <div key={opt} className="flex items-center space-x-2">
                                <RadioGroupItem id={`q-${question.id}-${opt}`} value={opt} />
                                <Label htmlFor={`q-${question.id}-${opt}`} className="text-sm">
                                  {opt}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        ) : (
                          <Textarea
                            id={`answer-${question.id}`}
                            placeholder={`Type your ${question.isRequired ? 'required ' : ''}answer here...`}
                            value={question.answer}
                            onChange={(e) => handleQuestionAnswer(question.id, e.target.value)}
                            className="min-h-[80px]"
                            required={question.isRequired}
                          />
                        )}
                      </>
                    )}
                    
                    {question.skipped && (
                      <div className="text-sm text-gray-500 italic">
                        This question has been skipped. Click the switch to answer.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-between items-center pt-4 mt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleSkipAllQuestions}
                className="text-gray-600 hover:text-gray-800"
              >
                Skip All Optional Questions
              </Button>
              <Button
                type="button"
                onClick={handleNext}
                disabled={formData.questionnaire.some(q => q.isRequired && !q.answer && !q.skipped)}
              >
                Save & Continue
              </Button>
            </div>

            {/* Skip Confirmation Dialog */}
            <AlertDialog open={showSkipQuestionnaireAlert} onOpenChange={setShowSkipQuestionnaireAlert}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Skip Optional Questions?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Skipping optional questions may result in less accurate service provider matches and quotes.
                    Are you sure you want to skip all optional questions?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={confirmSkipQuestionnaire} className="bg-blue-600 hover:bg-blue-700">
                    Skip Questions
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold">Timeline & Location Preferences</Label>
              <p className="text-sm text-gray-600 mb-4">
                Specify when you need the work completed and your location preferences
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium">Work Required By</Label>
                  <Input
                    type="date"
                    value={formData.workRequiredBy}
                    onChange={(e) => setFormData(prev => ({ ...prev, workRequiredBy: e.target.value }))}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Urgency Level</Label>
                  <Select>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select urgency level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - Flexible timeline</SelectItem>
                      <SelectItem value="medium">Medium - Standard timeline</SelectItem>
                      <SelectItem value="high">High - Urgent requirement</SelectItem>
                      <SelectItem value="critical">Critical - Immediate attention needed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Preferred Locations</Label>
                <p className="text-xs text-gray-500 mb-2">Select cities/regions where you prefer the professional to be located</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.preferredLocations.map((location, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {location}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            preferredLocations: prev.preferredLocations.filter((_, i) => i !== index)
                          }));
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter city or region"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const value = (e.target as HTMLInputElement).value.trim();
                        if (value && !formData.preferredLocations.includes(value)) {
                          setFormData(prev => ({
                            ...prev,
                            preferredLocations: [...prev.preferredLocations, value]
                          }));
                          (e.target as HTMLInputElement).value = '';
                        }
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={(e) => {
                      const input = (e.target as HTMLElement).previousElementSibling as HTMLInputElement;
                      const value = input.value.trim();
                      if (value && !formData.preferredLocations.includes(value)) {
                        setFormData(prev => ({
                          ...prev,
                          preferredLocations: [...prev.preferredLocations, value]
                        }));
                        input.value = '';
                      }
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Work Location Preference</Label>
                <Select>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select work location preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="remote">Remote work preferred</SelectItem>
                    <SelectItem value="onsite">On-site work required</SelectItem>
                    <SelectItem value="hybrid">Hybrid (combination of remote and on-site)</SelectItem>
                    <SelectItem value="flexible">Flexible - open to discussion</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Additional Timeline Notes</Label>
                <Textarea
                  placeholder="Any specific timeline requirements, milestones, or constraints"
                  className="mt-2"
                  rows={3}
                />
              </div>
            </div>
          </div>
        );


      case 7:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-blue-800">Review Your Service Request</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Please review all the information below before submitting your service request.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 1: Service Category */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">1</span>
                  Service Category
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Professional Types:</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {formData.serviceCategory.length > 0 ? (
                      formData.serviceCategory.map((cat) => (
                        <Badge key={cat} variant="outline" className="bg-blue-50">
                          {professionalTypes.find(p => p.value === cat)?.label}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500 italic">No professional types selected</span>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Service Types:</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {formData.serviceTypes.length > 0 ? (
                      formData.serviceTypes.map((type) => (
                        <Badge key={type} variant="outline" className="bg-green-50">
                          {serviceTypes.find(s => s.value === type)?.label}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500 italic">No service types selected</span>
                    )}
                  </div>
                </div>
                {formData.title && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Title:</Label>
                    <p className="text-sm text-gray-700 mt-1">{formData.title}</p>
                  </div>
                )}
                {formData.description && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Description:</Label>
                    <p className="text-sm text-gray-700 mt-1">{formData.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Step 2: Invite Professionals */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">2</span>
                  Invite Professionals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Final Invitation List:</Label>
                  {finalInvitationList && finalInvitationList.length > 0 ? (
                    <div className="mt-2 space-y-2">
                      {finalInvitationList.map((pro) => (
                        <div key={pro.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-md">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium">{pro.name}</p>
                              <div className="flex items-center space-x-1 text-yellow-500">
                                <Star className="h-3 w-3 fill-current" />
                                <span className="text-xs text-gray-700">{pro.rating}</span>
                              </div>
                            </div>
                            <p className="text-xs text-gray-500">{pro.location}</p>
                            {Array.isArray(pro.specialization) && pro.specialization.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {pro.specialization.slice(0,2).map((s, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">{s}</Badge>
                                ))}
                                {pro.specialization.length > 2 && (
                                  <Badge variant="outline" className="text-xs">+{pro.specialization.length - 2} more</Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500 italic">No professionals selected for invitation</span>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-600">Custom Invitation Message:</Label>
                  {formData.professionalInvitation.customInvitationMessage ? (
                    <div className="bg-gray-50 p-3 rounded-md mt-1">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{formData.professionalInvitation.customInvitationMessage}</p>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500 italic">No custom message</span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Chosen Emails:</Label>
                    {formData.professionalInvitation.chosenProfessionalEmails.filter(e => e && e.trim()).length > 0 ? (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {formData.professionalInvitation.chosenProfessionalEmails.filter(e => e && e.trim()).map((email, idx) => (
                          <Badge key={idx} variant="outline" className="bg-blue-50">{email}</Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500 italic">None</span>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Chosen Phones:</Label>
                    {formData.professionalInvitation.chosenProfessionalPhones.filter(p => p && p.trim()).length > 0 ? (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {formData.professionalInvitation.chosenProfessionalPhones.filter(p => p && p.trim()).map((phone, idx) => (
                          <Badge key={idx} variant="outline" className="bg-green-50">{phone}</Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500 italic">None</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 3: Scope of Work */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">3</span>
                  Scope of Work
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Detailed Scope:</Label>
                  {formData.scopeOfWork ? (
                    <div className="bg-gray-50 p-3 rounded-md mt-1">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{formData.scopeOfWork}</p>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500 italic">No scope of work defined</span>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Budget Information:</Label>
                  {formData.budgetNotClear ? (
                    <p className="text-sm text-gray-700 mt-1">Budget not clear at this time</p>
                  ) : (formData.budgetRange.min > 0 || formData.budgetRange.max > 0) ? (
                    <p className="text-sm text-gray-700 mt-1">
                      ₹{formData.budgetRange.min.toLocaleString()} - ₹{formData.budgetRange.max.toLocaleString()}
                    </p>
                  ) : (
                    <span className="text-sm text-gray-500 italic">No budget specified</span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Step 4: Supporting Documents */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">4</span>
                  Supporting Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                {formData.documents && formData.documents.length > 0 ? (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-600">Uploaded Documents:</Label>
                    {formData.documents.map((doc, index) => (
                      <div key={index} className="flex items-center p-2 bg-gray-50 rounded-md">
                        <FileText className="h-4 w-4 text-blue-600 mr-2" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{doc.name}</p>
                          <p className="text-xs text-gray-500">{(doc.size / 1024).toFixed(1)} KB</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm text-gray-500 italic">No documents uploaded</span>
                )}
              </CardContent>
            </Card>

            {/* Step 5: Service Questionnaire */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">5</span>
                  Service Questionnaire
                </CardTitle>
              </CardHeader>
              <CardContent>
                {formData.questionnaire && formData.questionnaire.length > 0 ? (
                  <div className="space-y-4">
                    {formData.questionnaire.map((q) => (
                      <div key={q.id} className="border-l-4 border-blue-200 pl-4">
                        <Label className="text-sm font-medium text-gray-700">
                          {q.question}
                          {q.isRequired && <span className="text-red-500 ml-1">*</span>}
                        </Label>
                        {q.skipped ? (
                          <p className="text-sm text-gray-500 italic mt-1">Skipped</p>
                        ) : q.answer ? (
                          <p className="text-sm text-gray-700 mt-1">{q.answer}</p>
                        ) : (
                          <p className="text-sm text-gray-500 italic mt-1">No answer provided</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm text-gray-500 italic">No questionnaire responses</span>
                )}
              </CardContent>
            </Card>

            {/* Step 6: Timeline & Location */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">6</span>
                  Timeline & Location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Work Required By:</Label>
                  {formData.workRequiredBy ? (
                    <p className="text-sm text-gray-700 mt-1">
                      {formData.workRequiredBy instanceof Date 
                        ? formData.workRequiredBy.toLocaleDateString() 
                        : formData.workRequiredBy}
                    </p>
                  ) : (
                    <span className="text-sm text-gray-500 italic">No deadline specified</span>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Preferred Locations:</Label>
                  {formData.preferredLocations && formData.preferredLocations.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {formData.preferredLocations.map((location, index) => (
                        <Badge key={index} variant="outline" className="bg-yellow-50">
                          {location}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500 italic">No location preferences specified</span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4 pt-6">
              <Button variant="outline" onClick={handleCancel} disabled={loading}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button variant="outline" onClick={handleSaveDraft} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                Save as Draft
              </Button>
              <Button onClick={handleSubmit} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                <Send className="h-4 w-4 mr-2" />
                Submit Request
              </Button>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-600">Step content under development</p>
            <Button onClick={handleNext} className="mt-4">
              Continue to Next Step
            </Button>
          </div>
        );
    }
  };

  return (
    
      <div className=" space-y-6">
         
           {/* Progress Steps */}
           <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                      currentStep >= step.id 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {step.id}
                    </div>
                    <div className="ml-3">
                      <p className={`text-sm font-medium ${
                        currentStep >= step.id ? 'text-blue-600' : 'text-gray-600'
                      }`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-500">{step.description}</p>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-12 h-0.5 mx-4 ${
                        currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
        </CardContent>
          </Card>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>
            Step {currentStep}: {steps[currentStep - 1]?.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderStep()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handlePrevious}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        
        <div className="flex space-x-3">
          {currentStep < steps.length && (
            <>
              <Button variant="outline" onClick={handleSaveDraft} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button onClick={handleNext} disabled={loading}>
                Save & Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </>
          )}
        </div>
      </div>
      
      {/* SRRN Success Popup - Moved to the end of the component for better rendering */}
      {showSRRNPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{ position: 'fixed' }}>
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex items-center justify-center mb-4">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-center mb-2">Service Request Created Successfully!</h3>
            <p className="text-center text-gray-600 mb-4">Your service request has been submitted successfully.</p>
            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <p className="text-sm text-gray-500 mb-1">Service Request Reference Number (SRRN):</p>
              <p className="text-lg font-bold text-blue-600 text-center">{generatedSRRN}</p>
            </div>
            <p className="text-sm text-gray-500 mb-4 text-center">Please save this number for future reference.</p>
            <div className="flex justify-center">
              <Button onClick={() => {
                setShowSRRNPopup(false);
                // Redirect to service requests list or dashboard
                window.location.href = '/service-requests';
              }}>
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
         
      {/* Professional Profile Dialog */}
      <ProfessionalProfileDialog
        professionalId={selectedProfileId}
        open={profileDialogOpen}
        onOpenChange={setProfileDialogOpen}
      />
         
      </div>
   
  );
};

export default CreateServiceRequest;

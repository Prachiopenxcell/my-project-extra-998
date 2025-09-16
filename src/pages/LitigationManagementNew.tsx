import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { useToast } from '../hooks/use-toast';
import { useIsMobile } from '../hooks/use-mobile';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { 
  Scale, 
  Calendar, 
  FileText, 
  Users, 
  Building, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  MoreHorizontal, 
  Copy, 
  Trash2, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  User, 
  Gavel, 
  CalendarClock, 
  ChevronLeft, 
  ChevronRight,
  X
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";

// Types for litigation data
interface LitigationCase {
  id: string;
  caseNumber: string;
  title: string;
  type: 'pre-filing' | 'active' | 'closed';
  status: 'draft' | 'pending' | 'critical' | 'won' | 'lost' | 'awaiting-docs' | 'upcoming' | 'filed-scrutiny' | 'defects-raised' | 'defects-rectified' | 'pending-numbering' | 'numbered' | 'pending-adjudication' | 'final-hearing';
  court: string;
  lawyer: string;
  amount: number;
  filedDate?: string;
  nextHearing?: string;
  lastHearing?: string;
  plaintiff: string;
  defendant: string;
  daysLeft?: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdDate: string;
  participants?: number;
  hybrid?: boolean;
  stage: 'stage1' | 'stage2';
  // Stage 1 specific
  responseType?: 'Objection Received' | 'No Objection' | 'Awaiting Response' | string;
  applicationStatus?: string;
  adjudicatingAuthority?: string;
  filedUnder?: string;
  particulars?: string;
  reliefSought?: string;
  interimOrders?: {
    id: string;
    date: string;
    description: string;
    orderCopy: string;
  }[];
  finalOrder?: {
    date: string;
    description: string;
    orderCopy: string;
  };
  replies?: {
    id: string;
    submittingParty: string;
    document: string;
    date: string;
    summary: string;
  }[];
  costBreakdown?: {
    drafting: number;
    filing: number;
    appearances: number;
    outOfPocket: number;
    counselFee: number;
    total: number;
  };
}

interface LitigationStats {
  activeCases: number;
  pendingHearings: number;
  preFilings: number;
  closedCases: number;
  totalAmount: number;
  criticalCases: number;
}

interface Entity {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'inactive';
}

interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

const LitigationManagement = () => {
  return (
    <DashboardLayout>
      <LitigationModule />
    </DashboardLayout>
  );
};

const LitigationModule = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // State management
  const [selectedEntity, setSelectedEntity] = useState<Entity>({
    id: "entity-001",
    name: "Acme Corporation Ltd",
    type: "Private Limited Company",
    status: "active"
  });
  const [selectedEntityId, setSelectedEntityId] = useState<string>("entity-001");
  // Stage tabs: stage1 (Pre-filing) and stage2 (Active/summary)
  const [activeTab, setActiveTab] = useState<'stage1' | 'stage2'>("stage1");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  // Per-stage filters
  const [sortBy, setSortBy] = useState<'latest' | 'oldest'>("latest");
  // Date filters
  const [creationDate, setCreationDate] = useState<string>(""); // Stage 1: Date of Creation
  const [filingDate, setFilingDate] = useState<string>(""); // Stage 2: Date of Filing
  const [hearingDate, setHearingDate] = useState<string>(""); // Stage 2: Date of Hearing
  // Status filters
  const [statusFilterStage1, setStatusFilterStage1] = useState<'all' | 'draft'>("all");
  const [statusFilterStage2, setStatusFilterStage2] = useState<'all' | 'pending' | 'critical' | 'awaiting-docs' | 'numbered' | 'pending-adjudication' | 'final-hearing' | 'upcoming' | 'won' | 'lost' | 'draft'>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0
  });
  const [hasEntityModule, setHasEntityModule] = useState(true);
  const [entityCount, setEntityCount] = useState(3);

  // Ensure pagination is visible by seeding more mock cases on first mount
  const seeded = useRef(false);
  useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;
    setAllCases(prev => {
      const stage1Count = prev.filter(c => c.type === 'pre-filing').length;
      const stage2Count = prev.filter(c => c.type === 'active').length;

      const needStage1 = Math.max(0, 15 - stage1Count);
      const needStage2 = Math.max(0, 15 - stage2Count);

      const stage1Extras: LitigationCase[] = Array.from({ length: needStage1 }, (_, i) => {
        const idx = i + 1;
        const created = new Date(2025, 0, Math.max(1, 28 - idx)); // Jan 2025
        const responses: Array<LitigationCase['responseType']> = ['Awaiting Response', 'No Objection', 'Objection Received'];
        const resp = responses[idx % responses.length] as LitigationCase['responseType'];
        return {
          id: `pf-x-${idx}`,
          caseNumber: `PRE-2025-${100 + idx}`,
          title: `Pre-filing Draft #${idx}`,
          type: 'pre-filing',
          status: 'draft',
          court: idx % 2 === 0 ? 'NCLT Mumbai' : 'High Court Delhi',
          lawyer: idx % 2 === 0 ? 'Adv. Rajesh Sharma' : 'Adv. Neha Gupta',
          amount: 500000 + (idx * 10000),
          plaintiff: idx % 2 === 0 ? 'Acme Corporation Ltd' : 'TechSolutions Pvt Ltd',
          defendant: idx % 2 === 0 ? 'Beta Industries Pvt Ltd' : 'Omega Industries',
          daysLeft: (idx % 30) + 1,
          priority: (['low','medium','high','critical'] as const)[idx % 4],
          createdDate: created.toISOString().slice(0,10),
          stage: 'stage1',
          responseType: resp,
          particulars: 'Draft particulars',
          reliefSought: 'Interim relief',
        };
      });

      const stage2Statuses: Array<Extract<LitigationCase['status'], 'pending' | 'critical' | 'awaiting-docs' | 'numbered' | 'pending-adjudication' | 'draft'>> = ['pending','critical','awaiting-docs','numbered','pending-adjudication','draft'];
      const stage2Extras: LitigationCase[] = Array.from({ length: needStage2 }, (_, i) => {
        const idx = i + 1;
        const filed = new Date(2024, 10, Math.max(1, 28 - idx)); // Nov 2024
        const hearing = new Date(2025, 1, (idx % 26) + 1); // Feb 2025
        const st = stage2Statuses[idx % stage2Statuses.length] as LitigationCase['status'];
        return {
          id: `ac-x-${idx}`,
          caseNumber: `CP(IB)-${300 + idx}/MB/2025`,
          title: `Litigation Case #${idx}`,
          type: 'active',
          status: st,
          court: idx % 2 === 0 ? 'NCLT Mumbai' : 'High Court Mumbai',
          lawyer: idx % 2 === 0 ? 'Adv. Priya Mehta' : 'Adv. Suresh Kumar',
          amount: 1000000 + (idx * 50000),
          plaintiff: idx % 2 === 0 ? 'Global Ventures Inc' : 'Acme Corporation Ltd',
          defendant: idx % 2 === 0 ? 'ABC Manufacturing Ltd' : 'Defaulting Client Ltd',
          daysLeft: (idx % 20) + 1,
          priority: (['low','medium','high','critical'] as const)[idx % 4],
          createdDate: filed.toISOString().slice(0,10),
          filedDate: filed.toISOString().slice(0,10),
          nextHearing: hearing.toISOString().slice(0,10),
          participants: (idx % 5) + 1,
          stage: 'stage2',
          applicationStatus: idx % 3 === 0 ? 'adjudication' : 'numbered',
          adjudicatingAuthority: idx % 2 === 0 ? "Hon'ble Justice M.R. Patel" : "Hon'ble Justice S.K. Singh",
          particulars: 'Case particulars',
          reliefSought: 'Damages and costs',
        };
      });

      if (needStage1 === 0 && needStage2 === 0) return prev;
      return [...prev, ...stage1Extras, ...stage2Extras];
    });
  }, []);

  // Mock data - replace with actual API calls
  const mockEntities: Entity[] = [
    { id: "entity-001", name: "Acme Corporation Ltd", type: "Private Limited Company", status: "active" },
    { id: "entity-002", name: "TechSolutions Pvt Ltd", type: "Private Limited Company", status: "active" },
    { id: "entity-003", name: "Global Ventures Inc", type: "Public Limited Company", status: "active" }
  ];

  // stats computed after cases are loaded (moved below after allCases declaration)

  const [allCases, setAllCases] = useState<LitigationCase[]>([
    // Pre-filing Cases (3 total)
    {
      id: "pf-001",
      caseNumber: "PRE-2025-001",
      title: "Application Draft - NCLT Petition against Delta Corp",
      type: "pre-filing",
      status: "draft",
      court: "NCLT Mumbai",
      lawyer: "Adv. Rajesh Sharma",
      amount: 1200000,
      plaintiff: "Acme Corporation Ltd",
      defendant: "Delta Corp Ltd",
      daysLeft: 15,
      priority: "high",
      createdDate: "2025-01-15",
      participants: 3,
      stage: "stage1",
      particulars: "Corporate insolvency resolution process under Section 7 of IBC 2016",
      reliefSought: "Initiation of CIRP against the Corporate Debtor",
      responseType: 'Awaiting Response',
      costBreakdown: {
        drafting: 25000,
        filing: 15000,
        appearances: 0,
        outOfPocket: 5000,
        counselFee: 35000,
        total: 80000
      }
    },
    {
      id: "pf-002",
      caseNumber: "PRE-2025-002",
      title: "Commercial Dispute - Contract Breach Preparation",
      type: "pre-filing",
      status: "draft",
      court: "High Court Delhi",
      lawyer: "Adv. Neha Gupta",
      amount: 950000,
      plaintiff: "TechSolutions Pvt Ltd",
      defendant: "Omega Industries",
      daysLeft: 22,
      priority: "medium",
      createdDate: "2025-01-10",
      participants: 2,
      stage: "stage1",
      particulars: "Breach of supply agreement and damages",
      reliefSought: "Damages and specific performance of contract",
      responseType: 'No Objection',
      costBreakdown: {
        drafting: 20000,
        filing: 12000,
        appearances: 0,
        outOfPocket: 4000,
        counselFee: 28000,
        total: 64000
      }
    },
    {
      id: "pf-003",
      caseNumber: "PRE-2025-003",
      title: "Property Dispute - Title Verification Case",
      type: "pre-filing",
      status: "draft",
      court: "District Court Mumbai",
      lawyer: "Adv. Rohit Patel",
      amount: 750000,
      plaintiff: "Global Ventures Inc",
      defendant: "City Developers Ltd",
      daysLeft: 30,
      priority: "low",
      createdDate: "2025-01-05",
      participants: 4,
      stage: "stage1",
      particulars: "Dispute over property title and possession",
      reliefSought: "Declaration of title and possession",
      responseType: 'Objection Received',
      costBreakdown: {
        drafting: 18000,
        filing: 8000,
        appearances: 0,
        outOfPocket: 3000,
        counselFee: 22000,
        total: 51000
      }
    },
    // Active Cases (5 total)
    {
      id: "ac-001",
      caseNumber: "CP(IB)-123/MB/2025",
      title: "Acme Corporation Ltd vs Beta Industries Pvt Ltd",
      type: "active",
      status: "pending",
      court: "NCLT Mumbai",
      lawyer: "Adv. Rajesh Sharma",
      amount: 2500000,
      plaintiff: "Acme Corporation Ltd",
      defendant: "Beta Industries Pvt Ltd",
      daysLeft: 8,
      priority: "high",
      createdDate: "2024-12-05",
      filedDate: "2024-12-05",
      nextHearing: "2025-02-20",
      participants: 4,
      stage: "stage2",
      applicationStatus: "numbered",
      adjudicatingAuthority: "Hon'ble Justice A.K. Sharma",
      particulars: "Corporate insolvency resolution process under Section 7 of IBC 2016",
      reliefSought: "Initiation of CIRP against the Corporate Debtor",
      costBreakdown: {
        drafting: 35000,
        filing: 20000,
        appearances: 85000,
        outOfPocket: 15000,
        counselFee: 75000,
        total: 230000
      }
    },
    {
      id: "ac-002",
      caseNumber: "CP(IB)-456/MB/2025",
      title: "TechSolutions Pvt Ltd vs Global Suppliers Inc",
      type: "active",
      status: "critical",
      court: "NCLT Mumbai",
      lawyer: "Adv. Priya Mehta",
      amount: 1800000,
      plaintiff: "TechSolutions Pvt Ltd",
      defendant: "Global Suppliers Inc",
      daysLeft: 3,
      priority: "critical",
      createdDate: "2024-11-20",
      filedDate: "2024-11-20",
      nextHearing: "2025-02-15",
      participants: 3,
      stage: "stage2",
      applicationStatus: "adjudication",
      adjudicatingAuthority: "Hon'ble Justice M.R. Patel",
      particulars: "Recovery of outstanding dues under commercial contract",
      reliefSought: "Recovery of Rs. 18,00,000/- with interest",
      costBreakdown: {
        drafting: 28000,
        filing: 18000,
        appearances: 65000,
        outOfPocket: 12000,
        counselFee: 55000,
        total: 178000
      }
    },
    {
      id: "ac-003",
      caseNumber: "CS-789/2024",
      title: "Global Ventures Inc vs ABC Manufacturing Ltd",
      type: "active",
      status: "pending",
      court: "High Court Mumbai",
      lawyer: "Adv. Suresh Kumar",
      amount: 3200000,
      plaintiff: "Global Ventures Inc",
      defendant: "ABC Manufacturing Ltd",
      daysLeft: 12,
      priority: "medium",
      createdDate: "2024-10-15",
      filedDate: "2024-10-15",
      participants: 5,
      stage: "stage2",
      applicationStatus: "pending-adjudication",
      adjudicatingAuthority: "Hon'ble Justice S.K. Singh",
      particulars: "Breach of contract and damages claim",
      reliefSought: "Damages of Rs. 32,00,000/- and specific performance",
      costBreakdown: {
        drafting: 45000,
        filing: 25000,
        appearances: 120000,
        outOfPocket: 20000,
        counselFee: 95000,
        total: 305000
      }
    },
    {
      id: "ac-004",
      caseNumber: "OA-234/2024",
      title: "Innovative Tech Solutions vs Revenue Department",
      type: "active",
      status: "awaiting-docs",
      court: "Income Tax Appellate Tribunal",
      lawyer: "Adv. Kavita Sharma",
      amount: 850000,
      plaintiff: "Innovative Tech Solutions",
      defendant: "Assistant Commissioner of Income Tax",
      daysLeft: 20,
      priority: "medium",
      createdDate: "2024-09-10",
      filedDate: "2024-09-10",
      participants: 2,
      stage: "stage2",
      applicationStatus: "numbered",
      adjudicatingAuthority: "Hon'ble Judicial Member",
      particulars: "Appeal against tax assessment order",
      reliefSought: "Quashing of assessment order and refund",
      costBreakdown: {
        drafting: 22000,
        filing: 8000,
        appearances: 45000,
        outOfPocket: 8000,
        counselFee: 35000,
        total: 118000
      }
    },
    {
      id: "ac-005",
      caseNumber: "NCDRC-567/2024",
      title: "Consumer Forum Case - Service Deficiency",
      type: "active",
      status: "upcoming",
      court: "National Consumer Disputes Redressal Commission",
      lawyer: "Adv. Amit Joshi",
      amount: 500000,
      plaintiff: "Acme Corporation Ltd",
      defendant: "XYZ Services Pvt Ltd",
      daysLeft: 25,
      priority: "low",
      createdDate: "2024-08-15",
      filedDate: "2024-08-15",
      nextHearing: "2025-03-10",
      participants: 2,
      stage: "stage2",
      applicationStatus: "pending-adjudication",
      adjudicatingAuthority: "Hon'ble President NCDRC",
      particulars: "Service deficiency and compensation claim",
      reliefSought: "Compensation of Rs. 5,00,000/- for service deficiency",
      costBreakdown: {
        drafting: 15000,
        filing: 5000,
        appearances: 25000,
        outOfPocket: 5000,
        counselFee: 20000,
        total: 70000
      }
    },
    
    // Closed Cases (12 total)
    {
      id: "cl-001",
      caseNumber: "CP(IB)-890/MB/2024",
      title: "Resolved - Manufacturing Dispute",
      type: "closed",
      status: "won",
      court: "NCLT Mumbai",
      lawyer: "Adv. Rajesh Sharma",
      amount: 1800000,
      plaintiff: "Acme Corporation Ltd",
      defendant: "Manufacturing Co Ltd",
      priority: "medium",
      createdDate: "2024-06-15",
      filedDate: "2024-06-15",
      participants: 3,
      stage: "stage2",
      applicationStatus: "final",
      adjudicatingAuthority: "Hon'ble Justice R.K. Verma",
      particulars: "Successful recovery case",
      reliefSought: "Recovery completed",
      costBreakdown: {
        drafting: 30000,
        filing: 18000,
        appearances: 75000,
        outOfPocket: 12000,
        counselFee: 65000,
        total: 200000
      }
    },
    {
      id: "cl-002",
      caseNumber: "CS-445/2024",
      title: "Settled - Service Agreement Dispute",
      type: "closed",
      status: "won",
      court: "High Court Delhi",
      lawyer: "Adv. Priya Mehta",
      amount: 650000,
      plaintiff: "TechSolutions Pvt Ltd",
      defendant: "Service Provider Inc",
      priority: "low",
      createdDate: "2024-05-10",
      filedDate: "2024-05-10",
      participants: 2,
      stage: "stage2",
      applicationStatus: "final",
      adjudicatingAuthority: "Hon'ble Justice A.B. Sharma",
      particulars: "Amicable settlement reached",
      reliefSought: "Settlement achieved",
      costBreakdown: {
        drafting: 15000,
        filing: 8000,
        appearances: 35000,
        outOfPocket: 5000,
        counselFee: 25000,
        total: 88000
      }
    },
    {
      id: "cl-003",
      caseNumber: "OA-123/2024",
      title: "Won - Tax Assessment Appeal",
      type: "closed",
      status: "won",
      court: "Income Tax Appellate Tribunal",
      lawyer: "Adv. Kavita Sharma",
      amount: 420000,
      plaintiff: "Global Ventures Inc",
      defendant: "Income Tax Department",
      priority: "high",
      createdDate: "2024-04-20",
      filedDate: "2024-04-20",
      participants: 2,
      stage: "stage2",
      applicationStatus: "final",
      adjudicatingAuthority: "Hon'ble Judicial Member",
      particulars: "Successful tax appeal",
      reliefSought: "Assessment quashed",
      costBreakdown: {
        drafting: 12000,
        filing: 5000,
        appearances: 28000,
        outOfPocket: 4000,
        counselFee: 20000,
        total: 69000
      }
    },
    {
      id: "cl-004",
      caseNumber: "NCDRC-234/2024",
      title: "Resolved - Consumer Complaint",
      type: "closed",
      status: "won",
      court: "State Consumer Commission",
      lawyer: "Adv. Amit Joshi",
      amount: 150000,
      plaintiff: "Individual Consumer",
      defendant: "Service Company Ltd",
      priority: "low",
      createdDate: "2024-03-15",
      filedDate: "2024-03-15",
      participants: 2,
      stage: "stage2",
      applicationStatus: "final",
      adjudicatingAuthority: "Hon'ble President",
      particulars: "Consumer rights protected",
      reliefSought: "Compensation awarded",
      costBreakdown: {
        drafting: 8000,
        filing: 3000,
        appearances: 15000,
        outOfPocket: 2000,
        counselFee: 12000,
        total: 40000
      }
    },
    {
      id: "cl-005",
      caseNumber: "CP-567/2024",
      title: "Dismissed - Contractual Dispute",
      type: "closed",
      status: "lost",
      court: "District Court Mumbai",
      lawyer: "Adv. Suresh Kumar",
      amount: 800000,
      plaintiff: "Small Business Ltd",
      defendant: "Large Corporation Inc",
      priority: "medium",
      createdDate: "2024-02-10",
      filedDate: "2024-02-10",
      participants: 3,
      stage: "stage2",
      applicationStatus: "final",
      adjudicatingAuthority: "Hon'ble District Judge",
      particulars: "Case dismissed on merits",
      reliefSought: "Relief denied",
      costBreakdown: {
        drafting: 18000,
        filing: 10000,
        appearances: 45000,
        outOfPocket: 8000,
        counselFee: 35000,
        total: 116000
      }
    },
    {
      id: "cl-006",
      caseNumber: "LA-789/2024",
      title: "Settled - Labour Dispute",
      type: "closed",
      status: "won",
      court: "Labour Court Mumbai",
      lawyer: "Adv. Neha Gupta",
      amount: 300000,
      plaintiff: "Workers Union",
      defendant: "Factory Owner Ltd",
      priority: "high",
      createdDate: "2024-01-15",
      filedDate: "2024-01-15",
      participants: 5,
      stage: "stage2",
      applicationStatus: "final",
      adjudicatingAuthority: "Hon'ble Presiding Officer",
      particulars: "Labour rights upheld",
      reliefSought: "Settlement in favor",
      costBreakdown: {
        drafting: 10000,
        filing: 5000,
        appearances: 25000,
        outOfPocket: 5000,
        counselFee: 18000,
        total: 63000
      }
    },
    {
      id: "cl-007",
      caseNumber: "REV-345/2023",
      title: "Won - Revenue Recovery Case",
      type: "closed",
      status: "won",
      court: "High Court Mumbai",
      lawyer: "Adv. Rohit Patel",
      amount: 2200000,
      plaintiff: "Acme Corporation Ltd",
      defendant: "Defaulting Client Ltd",
      priority: "high",
      createdDate: "2023-11-20",
      filedDate: "2023-11-20",
      participants: 4,
      stage: "stage2",
      applicationStatus: "final",
      adjudicatingAuthority: "Hon'ble Justice M.P. Singh",
      particulars: "Full recovery achieved",
      reliefSought: "Complete recovery",
      costBreakdown: {
        drafting: 35000,
        filing: 20000,
        appearances: 95000,
        outOfPocket: 15000,
        counselFee: 75000,
        total: 240000
      }
    },
    {
      id: "cl-008",
      caseNumber: "IP-678/2023",
      title: "Resolved - Intellectual Property Dispute",
      type: "closed",
      status: "won",
      court: "Intellectual Property Appellate Board",
      lawyer: "Adv. Kavita Sharma",
      amount: 1500000,
      plaintiff: "Tech Innovations Ltd",
      defendant: "Copycat Solutions Inc",
      priority: "critical",
      createdDate: "2023-10-05",
      filedDate: "2023-10-05",
      participants: 3,
      stage: "stage2",
      applicationStatus: "final",
      adjudicatingAuthority: "Hon'ble Technical Member",
      particulars: "IP rights protected",
      reliefSought: "Injunction granted",
      costBreakdown: {
        drafting: 40000,
        filing: 15000,
        appearances: 80000,
        outOfPocket: 12000,
        counselFee: 65000,
        total: 212000
      }
    },
    {
      id: "cl-009",
      caseNumber: "ENV-901/2023",
      title: "Won - Environmental Compliance Case",
      type: "closed",
      status: "won",
      court: "National Green Tribunal",
      lawyer: "Adv. Amit Joshi",
      amount: 600000,
      plaintiff: "Green Solutions Ltd",
      defendant: "Pollution Board",
      priority: "medium",
      createdDate: "2023-09-10",
      filedDate: "2023-09-10",
      participants: 2,
      stage: "stage2",
      applicationStatus: "final",
      adjudicatingAuthority: "Hon'ble Chairperson NGT",
      particulars: "Environmental clearance obtained",
      reliefSought: "Clearance granted",
      costBreakdown: {
        drafting: 15000,
        filing: 8000,
        appearances: 35000,
        outOfPocket: 6000,
        counselFee: 25000,
        total: 89000
      }
    },
    {
      id: "cl-010",
      caseNumber: "BANK-234/2023",
      title: "Settled - Banking Dispute",
      type: "closed",
      status: "won",
      court: "Banking Ombudsman",
      lawyer: "Adv. Suresh Kumar",
      amount: 250000,
      plaintiff: "Corporate Account Holder",
      defendant: "National Bank Ltd",
      priority: "low",
      createdDate: "2023-08-15",
      filedDate: "2023-08-15",
      participants: 2,
      stage: "stage2",
      applicationStatus: "final",
      adjudicatingAuthority: "Banking Ombudsman",
      particulars: "Banking service issue resolved",
      reliefSought: "Service restored",
      costBreakdown: {
        drafting: 5000,
        filing: 2000,
        appearances: 12000,
        outOfPocket: 2000,
        counselFee: 8000,
        total: 29000
      }
    },
    {
      id: "cl-011",
      caseNumber: "INS-567/2023",
      title: "Resolved - Insurance Claim Dispute",
      type: "closed",
      status: "won",
      court: "Insurance Ombudsman",
      lawyer: "Adv. Priya Mehta",
      amount: 450000,
      plaintiff: "Policy Holder Ltd",
      defendant: "Insurance Company Inc",
      priority: "medium",
      createdDate: "2023-07-20",
      filedDate: "2023-07-20",
      participants: 2,
      stage: "stage2",
      applicationStatus: "final",
      adjudicatingAuthority: "Insurance Ombudsman",
      particulars: "Insurance claim settled",
      reliefSought: "Claim amount received",
      costBreakdown: {
        drafting: 8000,
        filing: 3000,
        appearances: 18000,
        outOfPocket: 3000,
        counselFee: 15000,
        total: 47000
      }
    },
    {
      id: "cl-012",
      caseNumber: "REAL-890/2023",
      title: "Won - Real Estate Dispute",
      type: "closed",
      status: "won",
      court: "Real Estate Regulatory Authority",
      lawyer: "Adv. Neha Gupta",
      amount: 1100000,
      plaintiff: "Property Buyer Ltd",
      defendant: "Builder Developer Inc",
      priority: "high",
      createdDate: "2023-06-10",
      filedDate: "2023-06-10",
      participants: 3,
      stage: "stage2",
      applicationStatus: "final",
      adjudicatingAuthority: "Hon'ble Chairperson RERA",
      particulars: "Property delivery ensured",
      reliefSought: "Possession obtained",
      costBreakdown: {
        drafting: 20000,
        filing: 10000,
        appearances: 45000,
        outOfPocket: 8000,
        counselFee: 35000,
        total: 118000
      }
    },
    // Additional active case to showcase 'final-hearing' status
    {
      id: "ac-006",
      caseNumber: "CIV-234/2025",
      title: "Omega Industries vs Rapid Logistics",
      type: "active",
      status: "final-hearing",
      court: "High Court Delhi",
      lawyer: "Adv. Meera Shah",
      amount: 2100000,
      plaintiff: "Omega Industries",
      defendant: "Rapid Logistics",
      daysLeft: 2,
      priority: "high",
      createdDate: "2024-12-25",
      filedDate: "2024-12-25",
      nextHearing: "2025-02-18",
      participants: 3,
      stage: "stage2",
      applicationStatus: "hearing",
      adjudicatingAuthority: "Hon'ble Justice R. Verma",
      particulars: "Damages for breach of delivery timelines",
      reliefSought: "Damages and injunction",
      costBreakdown: { drafting: 38000, filing: 20000, appearances: 90000, outOfPocket: 15000, counselFee: 68000, total: 231000 }
    },
  ]);

  // Compute dashboard statistics from current case data
  const stats = useMemo(() => {
    const activeCases = allCases.filter(c => c.type === 'active').length;
    const pendingHearings = allCases.filter(c => !!c.nextHearing && c.type === 'active').length;
    const preFilings = allCases.filter(c => c.type === 'pre-filing').length;
    const closedCases = allCases.filter(c => c.type === 'closed').length;
    const totalAmount = allCases
      .filter(c => c.type !== 'pre-filing')
      .reduce((sum, c) => sum + (c.amount || 0), 0);

    return { activeCases, pendingHearings, preFilings, closedCases, totalAmount };
  }, [allCases]);

  // Helper functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleTabChange = (tab: string) => {
    if (tab === 'stage1' || tab === 'stage2') {
      setActiveTab(tab);
    }
    setCurrentPage(1);
  };

  // Persist user preferences (tab, sort, items per page, search)
  useEffect(() => {
    try {
      const savedTab = localStorage.getItem('litigation_tab');
      const savedSort = localStorage.getItem('litigation_sort');
      const savedPerPage = localStorage.getItem('litigation_per_page');
      const savedSearch = localStorage.getItem('litigation_search') ?? '';
      if (savedTab === 'stage1' || savedTab === 'stage2') setActiveTab(savedTab);
      if (savedSort === 'latest' || savedSort === 'oldest') setSortBy(savedSort);
      if (savedPerPage && !isNaN(Number(savedPerPage))) {
        setPagination(prev => ({ ...prev, itemsPerPage: Number(savedPerPage) }));
      }
      setSearchTerm(savedSearch);
    } catch {
      // no-op: ignore localStorage read errors
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('litigation_tab', activeTab);
  }, [activeTab]);
  useEffect(() => {
    localStorage.setItem('litigation_sort', sortBy);
  }, [sortBy]);
  useEffect(() => {
    localStorage.setItem('litigation_per_page', String(pagination.itemsPerPage));
  }, [pagination.itemsPerPage]);
  useEffect(() => {
    localStorage.setItem('litigation_search', searchTerm);
  }, [searchTerm]);

  // Debounce search for smoother UX
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 250);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // Stats are derived via useMemo above; no additional effect needed

  // Filtering and pagination logic
  const filteredCases = useMemo(() => {
    // Stage-specific base filter
    let filtered = allCases.filter(c => {
      if (activeTab === 'stage1') return c.type === 'pre-filing';
      // Stage 2: include closed cases if filtering for won/lost
      if (statusFilterStage2 === 'won' || statusFilterStage2 === 'lost') return c.type === 'active' || c.type === 'closed';
      return c.type === 'active';
    });

    // Search: title, case number, court, parties (debounced)
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      filtered = filtered.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.caseNumber.toLowerCase().includes(q) ||
        c.court.toLowerCase().includes(q) ||
        c.plaintiff.toLowerCase().includes(q) ||
        c.defendant.toLowerCase().includes(q)
      );
    }

    // Date filters per stage
    if (activeTab === 'stage1' && creationDate) {
      filtered = filtered.filter(c => c.createdDate && c.createdDate === creationDate);
    }
    if (activeTab === 'stage2') {
      if (filingDate) {
        filtered = filtered.filter(c => c.filedDate && c.filedDate === filingDate);
      }
      if (hearingDate) {
        filtered = filtered.filter(c => c.nextHearing && c.nextHearing === hearingDate);
      }
    }

    // Status filters per stage
    if (activeTab === 'stage1' && statusFilterStage1 !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilterStage1);
    }
    if (activeTab === 'stage2' && statusFilterStage2 !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilterStage2);
    }

    // Sorting
    filtered.sort((a, b) => {
      const aDate = activeTab === 'stage1' ? a.createdDate : (a.filedDate || a.createdDate);
      const bDate = activeTab === 'stage1' ? b.createdDate : (b.filedDate || b.createdDate);
      if (sortBy === 'latest') {
        return new Date(bDate).getTime() - new Date(aDate).getTime();
      }
      return new Date(aDate).getTime() - new Date(bDate).getTime();
    });

    return filtered;
  }, [allCases, activeTab, debouncedSearch, creationDate, filingDate, hearingDate, sortBy, statusFilterStage1, statusFilterStage2]);

  // Pagination logic
  const paginatedCases = useMemo(() => {
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;
    return filteredCases.slice(startIndex, endIndex);
  }, [filteredCases, pagination.currentPage, pagination.itemsPerPage]);

  // Update pagination when filtered cases change
  useEffect(() => {
    setPagination(prev => ({
      ...prev,
      totalItems: filteredCases.length,
      totalPages: Math.ceil(filteredCases.length / prev.itemsPerPage)
    }));
  }, [filteredCases]);

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-gray-500"></div>
            <Badge variant="secondary" className="text-xs">Draft</Badge>
          </div>
        );
      case "pending":
        return (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <Badge variant="outline" className="text-xs border-blue-200 text-blue-700">Pending</Badge>
          </div>
        );
      case "critical":
        return (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <Badge variant="destructive" className="text-xs">Critical</Badge>
          </div>
        );
      case "won":
        return (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <Badge variant="outline" className="text-xs border-green-200 text-green-700">Won</Badge>
          </div>
        );
      case "lost":
        return (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <Badge variant="outline" className="text-xs border-red-200 text-red-700">Lost</Badge>
          </div>
        );
      case "awaiting-docs":
        return (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <Badge variant="outline" className="text-xs border-yellow-200 text-yellow-700">Awaiting Docs</Badge>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-gray-500"></div>
            <Badge variant="secondary" className="text-xs">{status}</Badge>
          </div>
        );
    }
  };

  // Get type badge
  const getTypeBadge = (type: string) => {
    switch (type) {
      case "pre-filing":
        return <Badge variant="outline" className="text-xs">Pre-filing</Badge>;
      case "active":
        return <Badge variant="default" className="text-xs">Active</Badge>;
      case "closed":
        return <Badge variant="secondary" className="text-xs">Closed</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{type}</Badge>;
    }
  };

  // Handle case actions
  const handleViewCase = (caseId: string) => {
    navigate(`/litigation/case/${caseId}`);
  };

  const handleEditCase = (caseId: string) => {
    const case_ = allCases.find(c => c.id === caseId);
    if (case_?.type === 'pre-filing') {
      navigate(`/litigation/create/pre-filing?edit=${caseId}`);
    } else {
      navigate(`/litigation/create/active?edit=${caseId}`);
    }
  };

  const handleDeleteCase = (caseId: string) => {
    if (confirm("Are you sure you want to delete this case?")) {
      setAllCases(prev => prev.filter(c => c.id !== caseId));
      toast({
        title: "Case Deleted",
        description: "The litigation case has been successfully deleted.",
      });
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Scale className="h-6 w-6 text-blue-600" />
            Litigation Management
          </h1>
          <p className="text-muted-foreground">Manage legal cases, pre-filing, and court proceedings</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="flex items-center gap-2">
            <CalendarClock className="h-4 w-4" />
            This Month
          </Button>
          <Button onClick={() => navigate('/litigation/stage-selection?stage=' + (activeTab === 'stage1' ? 'pre-filing' : 'active'))} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create New
          </Button>
        </div>
      </div>

      {/* Entity Selection */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-sm">
            <Building className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Selected Entity:</span>
            <Select 
              value={selectedEntityId} 
              onValueChange={(value) => {
                setSelectedEntityId(value);
                const entity = mockEntities.find(e => e.id === value);
                if (entity) setSelectedEntity(entity);
              }}
            >
              <SelectTrigger className="w-auto border-0 p-0 h-auto font-medium text-blue-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {mockEntities.map((entity) => (
                  <SelectItem key={entity.id} value={entity.id}>
                    {entity.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="link" className="p-0 h-auto text-sm">Change Entity</Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Cases</p>
                <p className="text-2xl font-bold">{stats.activeCases}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Scale className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Hearings</p>
                <p className="text-2xl font-bold">{stats.pendingHearings}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pre-filings</p>
                <p className="text-2xl font-bold">{stats.preFilings}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Closed</p>
                <p className="text-2xl font-bold">{stats.closedCases}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>MY LITIGATION</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by keyword or suit/application number"
                  className="pl-10 pr-8 w-72"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    aria-label="Clear search"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setSearchTerm("")}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <Select value={sortBy} onValueChange={(v: 'latest'|'oldest') => setSortBy(v)}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest listed at top</SelectItem>
                  <SelectItem value="oldest">Oldest listed at top</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="stage1" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Stage 1: Filing of Application (Pre-filing)
                <Badge variant="secondary" className="ml-1 text-xs">
                  {allCases.filter(c => c.type === 'pre-filing').length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="stage2" className="flex items-center gap-2">
                <Scale className="h-4 w-4" />
                Stage 2: Summary of Litigation
                <Badge variant="secondary" className="ml-1 text-xs">
                  {allCases.filter(c => c.type === 'active').length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            {/* Filters per stage */}
            <div className="flex items-center gap-3 mt-4">
              {activeTab === 'stage1' && (
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-muted-foreground">Date of Creation</Label>
                  <Input type="date" value={creationDate} onChange={(e) => setCreationDate(e.target.value)} className="w-48" />
                </div>
              )}
              {activeTab === 'stage2' && (
                <>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm text-muted-foreground">Date of Filing</Label>
                    <Input type="date" value={filingDate} onChange={(e) => setFilingDate(e.target.value)} className="w-48" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm text-muted-foreground">Date of Hearing</Label>
                    <Input type="date" value={hearingDate} onChange={(e) => setHearingDate(e.target.value)} className="w-48" />
                  </div>
                </>
              )}
              {/* Status filters */}
              {activeTab === 'stage1' && (
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-muted-foreground">Status</Label>
                  <Select value={statusFilterStage1} onValueChange={(v: 'all'|'draft') => setStatusFilterStage1(v)}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              {activeTab === 'stage2' && (
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-muted-foreground">Status</Label>
                  <Select value={statusFilterStage2} onValueChange={(v: 'all'|'pending'|'critical'|'awaiting-docs'|'numbered'|'pending-adjudication'|'final-hearing'|'upcoming'|'won'|'lost'|'draft') => setStatusFilterStage2(v)}>
                    <SelectTrigger className="w-56">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="awaiting-docs">Awaiting Docs</SelectItem>
                      <SelectItem value="numbered">Numbered</SelectItem>
                      <SelectItem value="pending-adjudication">Pending Adjudication</SelectItem>
                      <SelectItem value="final-hearing">Final Hearing</SelectItem>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="won">Won</SelectItem>
                      <SelectItem value="lost">Lost</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="ml-auto flex items-center gap-2">
                <Label className="text-sm text-muted-foreground">Items per page</Label>
                <Select value={String(pagination.itemsPerPage)} onValueChange={(v) => setPagination(prev => ({...prev, itemsPerPage: Number(v), currentPage: 1, totalPages: Math.ceil(filteredCases.length / Number(v)) }))}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Filtered stats bar */}
            <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
              <div>
                Showing <span className="font-medium text-foreground">{filteredCases.length}</span> {activeTab === 'stage1' ? 'pre-filings' : 'litigations'} matching filters
              </div>
              {activeTab === 'stage2' && (
                <div>
                  Upcoming hearings: <span className="font-medium text-foreground">{filteredCases.filter(c => c.status === 'upcoming').length}</span>
                </div>
              )}
            </div>

            {/* Listing */}
            <div className="mt-4 rounded-md border">
              <Table>
                <TableHeader>
                  {activeTab === 'stage1' ? (
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Date of Creation</TableHead>
                      <TableHead>Type of Response</TableHead>
                      <TableHead>Number of Days</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  ) : (
                    <TableRow>
                      <TableHead>Suit/Application No.</TableHead>
                      <TableHead>Name of Plaintiff/Appellant/Applicant</TableHead>
                      <TableHead>Name of Defendant/Respondent</TableHead>
                      <TableHead>Date of Filing</TableHead>
                      <TableHead>Date of Hearing</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  )}
                </TableHeader>
                <TableBody>
                  {paginatedCases.map((c) => (
                    <TableRow
                      key={c.id}
                      className="cursor-pointer"
                      onClick={() => {
                        if (activeTab === 'stage1') {
                          navigate(`/litigation/pre-filing/${c.id}`);
                        } else {
                          handleViewCase(c.id);
                        }
                      }}
                    >
                      {activeTab === 'stage1' ? (
                        <>
                          <TableCell>
                            <div className="font-medium">{c.title}</div>
                            <div className="text-xs text-muted-foreground">{c.caseNumber}</div>
                          </TableCell>
                          <TableCell>{formatDate(c.createdDate)}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={c.responseType === 'Objection Received' ? 'border-red-300 text-red-700' : 'border-gray-200'}>
                              {c.responseType || 'Awaiting Response'}
                            </Badge>
                          </TableCell>
                          <TableCell>{c.daysLeft ?? '-'}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" className="bg-blue-600 text-white hover:bg-blue-700 rounded-xl" onClick={(e) => { e.stopPropagation(); navigate(`/litigation/pre-filing/${c.id}`); }}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/litigation/create?edit=${c.id}`); }}>
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell>{c.caseNumber}</TableCell>
                          <TableCell>{c.plaintiff}</TableCell>
                          <TableCell>{c.defendant}</TableCell>
                          <TableCell>{c.filedDate ? formatDate(c.filedDate) : '-'}</TableCell>
                          <TableCell>{c.nextHearing ? formatDate(c.nextHearing) : '-'}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleViewCase(c.id); }}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleEditCase(c.id); }}>
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Empty state create actions */}
            {filteredCases.length === 0 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">No records found for the selected filters.</p>
                {activeTab === 'stage1' ? (
                  <Button onClick={() => navigate('/litigation/stage-selection?stage=pre-filing')} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Create Pre-filing
                  </Button>
                ) : (
                  <Button onClick={() => navigate('/litigation/stage-selection?stage=active')} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Create Litigation
                  </Button>
                )}
              </div>
            )}

            {/* Pagination with skip to first/last */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of {pagination.totalItems} cases
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagination(prev => ({ ...prev, currentPage: 1 }))}
                    disabled={pagination.currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    First
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagination(prev => ({ ...prev, currentPage: Math.max(1, prev.currentPage - 1) }))}
                    disabled={pagination.currentPage === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).slice(
                      Math.max(0, pagination.currentPage - 3),
                      Math.min(pagination.totalPages, pagination.currentPage + 2)
                    ).map(page => (
                      <Button
                        key={page}
                        variant={page === pagination.currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPagination(prev => ({ ...prev, currentPage: page }))}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagination(prev => ({ ...prev, currentPage: Math.min(prev.totalPages, prev.currentPage + 1) }))}
                    disabled={pagination.currentPage === pagination.totalPages}
                  >
                    Next
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.totalPages }))}
                    disabled={pagination.currentPage === pagination.totalPages}
                  >
                    Last
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </Tabs>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/litigation/stage-selection?stage=' + (activeTab === 'stage1' ? 'pre-filing' : 'active'))}>
          <CardContent className="pt-6 text-center">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
              <Plus className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-medium">{activeTab === 'stage1' ? 'Create Pre-filing' : 'Create Litigation'}</h3>
            <p className="text-sm text-muted-foreground">Start a new {activeTab === 'stage1' ? 'pre-filing' : 'litigation'} case</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="pt-6 text-center">
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-medium">Browse Templates</h3>
            <p className="text-sm text-muted-foreground">Use predefined case formats</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="pt-6 text-center">
            <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-3">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="font-medium">Manage Participants</h3>
            <p className="text-sm text-muted-foreground">Import/export participant list</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="pt-6 text-center">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
              <Gavel className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-medium">Case Analytics</h3>
            <p className="text-sm text-muted-foreground">View reports and insights</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LitigationManagement;

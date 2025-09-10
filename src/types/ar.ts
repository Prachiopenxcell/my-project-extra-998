export type LawType = "IBBI CIRP" | "IBBI Liquidation" | "SEBI" | "IBBI Insolvency";

export type FeeStructureType = "EventBasis" | "Periodic" | "FixedLumpSum" | "Mixed";

export type EventTrigger =
  | "Meeting Created"
  | "Attendance Marked"
  | "Approval Granted"
  | "Resolution Passed";

export type Recurrence = "Daily" | "Weekly" | "Monthly" | "Quarterly" | "Annually";

export type AttendanceStatus = "Present" | "Absent" | "Not Applicable";

export type CreditorsSlab = "10-100" | "101-1000" | "1000+";

export interface FeeRange {
  min?: number;
  max?: number;
  currency: "INR";
}

export interface EventFeeLine {
  id: string;
  trigger: EventTrigger;
  amount: number;               // user amount or system suggested
  systemSuggested?: boolean;
  legalRange?: FeeRange;        // if present, validate and warn if outside
}

export interface PeriodicFee {
  id: string;
  recurrence: Recurrence;
  amount: number;
}

export interface FixedFee {
  amount: number;
  notes?: string;
}

export interface CirpSlabConfig {
  cocFeePerMeeting: Record<CreditorsSlab, number>;      // e.g., {"10-100":30000,"101-1000":40000,"1000+":50000}
  classFeePerMeeting: Record<CreditorsSlab, number>;    // e.g., {"10-100":10000,"101-1000":12000,"1000+":15000}
}

export interface ARFeeStructure {
  id: string;
  arId: string;
  className: string;            // e.g., "Financial Creditors-Secured"
  lawType: LawType;
  structureType: FeeStructureType;      // When lawType !== "IBBI CIRP"
  
  // CIRP config (readonly suggestions in UI)
  cirpSlabs?: CirpSlabConfig;
  selectedSlab?: CreditorsSlab;

  // Non-CIRP configs
  eventFees?: EventFeeLine[];
  periodicFees?: PeriodicFee[];
  fixedFee?: FixedFee;

  // Applies when law defines ranges
  validations?: string[];
  
  createdAt: string;
  updatedAt: string;
}

export interface CoCMeetingAttendance {
  index: number;               // 1st CoC, 2nd CoC, etc
  date: string;                // YYYY-MM-DD
  ar1: AttendanceStatus;
  ar2?: AttendanceStatus;
  payable?: boolean;           // computed field
  fee?: number;                // computed field
}

export interface ClassMeeting {
  id: string;
  date: string;                // YYYY-MM-DD
  status: AttendanceStatus;    // presence of AR for this class meeting
  payable?: boolean;           // computed field
  fee?: number;                // computed field
}

export interface ARClassMeetings {
  id: string;
  arName: string;
  className: string;           // e.g., "Financial Creditors-Secured"
  meetings: ClassMeeting[];    // first two paid, >2 unpaid (CIRP only)
}

export interface ARAttendance {
  id: string;
  arId: string;
  className: string;
  cocMeetings: CoCMeetingAttendance[];
  classMeetings: ARClassMeetings[];     // can be multiple classes and ARs
  createdAt: string;
  updatedAt: string;
}

export interface FeeComputationInput {
  feeStructure: ARFeeStructure;
  creditorsSlab: CreditorsSlab; // slab for this class
  attendance: ARAttendance;
  options?: {
    chargePerAR?: boolean;     // default false. If true, pay per present AR (business toggle)
  };
}

export interface FeeBreakdown {
  cocPaidCount: number;
  cocUnpaidCount: number;
  cocFeePerMeeting: number;
  cocTotal: number;

  classPaidByClass: Record<string, number>;                 // className -> paid count
  classUnpaidByClass: Record<string, number>;               // className -> unpaid count
  classFeePerMeetingByClass: Record<string, number>;        // className -> fee per meeting
  classTotal: number;

  arMeetingFeesTotal: number;  // cocTotal + classTotal
  facilitatorFee: number;      // 20% of arMeetingFeesTotal
  validationWarnings: string[];
}

// Default CIRP slab configuration
export const DEFAULT_CIRP_SLABS: CirpSlabConfig = {
  cocFeePerMeeting: {
    "10-100": 30000,
    "101-1000": 40000,
    "1000+": 50000
  },
  classFeePerMeeting: {
    "10-100": 10000,
    "101-1000": 12000,
    "1000+": 15000
  }
};

// Legal ranges for non-CIRP laws (example data)
export const LEGAL_RANGES: Record<LawType, Record<EventTrigger, FeeRange>> = {
  "IBBI CIRP": {} as Record<EventTrigger, FeeRange>, // No ranges for CIRP (fixed amounts)
  "IBBI Liquidation": {
    "Meeting Created": { min: 5000, max: 25000, currency: "INR" },
    "Attendance Marked": { min: 8000, max: 35000, currency: "INR" },
    "Approval Granted": { min: 10000, max: 50000, currency: "INR" },
    "Resolution Passed": { min: 15000, max: 75000, currency: "INR" }
  },
  "SEBI": {
    "Meeting Created": { min: 10000, max: 50000, currency: "INR" },
    "Attendance Marked": { min: 15000, max: 60000, currency: "INR" },
    "Approval Granted": { min: 20000, max: 100000, currency: "INR" },
    "Resolution Passed": { min: 25000, max: 150000, currency: "INR" }
  },
  "IBBI Insolvency": {
    "Meeting Created": { min: 7500, max: 30000, currency: "INR" },
    "Attendance Marked": { min: 12000, max: 45000, currency: "INR" },
    "Approval Granted": { min: 18000, max: 80000, currency: "INR" },
    "Resolution Passed": { min: 22000, max: 120000, currency: "INR" }
  }
};

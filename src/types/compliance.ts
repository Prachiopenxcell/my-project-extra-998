// Centralized types for Regulatory Compliance module

export type ComplianceCategory =
  | 'core'
  | 'sectoral'
  | 'size-based'
  | 'jurisdiction'
  | 'license'
  | 'event';

export interface ComplianceRequirement {
  id: string;
  title: string;
  authority: string;
  category: ComplianceCategory;
  description: string;
  frequency: string; // e.g., Monthly, Quarterly, Annual, On-Event
  selected: boolean;
  autoDetected: boolean;
  lawCode?: string; // optional code from master db
  jurisdiction?: string; // e.g., Maharashtra
  sector?: string; // IT, Pharma, NBFC, etc.
  sizeCriteria?: string; // criteria text if size-based
  licenseType?: string; // e.g., Factory License, Trade License
  eventKey?: string; // e.g., Incorporation, DirectorChange
  guidelines?: ComplianceGuideline[];
  reminders?: ComplianceReminder[];
  documents?: ComplianceDocument[];
}

export interface ComplianceGuideline {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
}

export type ReminderChannel = 'in-app' | 'email' | 'sms';

export interface ComplianceReminder {
  id: string;
  title: string;
  daysBeforeDue: number; // e.g., 7 days before
  frequency: 'once' | 'repeat-weekly' | 'repeat-daily';
  channels: ReminderChannel[];
  active: boolean;
}

export interface ComplianceDocument {
  id: string;
  name: string;
  url?: string; // placeholder for uploaded doc link
  uploadedAt: string;
}

export interface ComplianceEntity {
  id: string;
  name: string;
  type: string; // e.g., LLP, Private Limited, OPC
  location: string; // City or State key
  sector: string; // Industry/sector
  employees?: string; // e.g., '50-100'
  turnover?: string;
  flags?: {
    isMSME?: boolean;
    isListed?: boolean;
    isNBFC?: boolean;
    hasFactory?: boolean;
    isExportHouse?: boolean;
    hasPFESIThresholdMet?: boolean;
  };
}

export interface CustomLawTemplate {
  id: string; // template id to reuse across entities
  title: string;
  authority: string;
  frequency: string;
  description?: string;
  documents?: ComplianceDocument[];
  guidelines?: ComplianceGuideline[];
  reminders?: ComplianceReminder[];
  createdAt: string;
  createdBy?: string;
}

export interface AutoMapInput {
  entity: ComplianceEntity;
}

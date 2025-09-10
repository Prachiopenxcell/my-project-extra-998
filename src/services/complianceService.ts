import { AutoMapInput, ComplianceEntity, ComplianceRequirement, ComplianceGuideline, ComplianceReminder, CustomLawTemplate } from "@/types/compliance";

const LS_KEYS = {
  customTemplates: "compliance.customTemplates.v1"
};

function readTemplates(): CustomLawTemplate[] {
  try {
    const raw = localStorage.getItem(LS_KEYS.customTemplates);
    return raw ? (JSON.parse(raw) as CustomLawTemplate[]) : [];
  } catch {
    return [];
  }
}

function writeTemplates(tpls: CustomLawTemplate[]) {
  localStorage.setItem(LS_KEYS.customTemplates, JSON.stringify(tpls));
}

export const complianceService = {
  autoMapRequirements(input: AutoMapInput): ComplianceRequirement[] {
    const { entity } = input;
    const base: ComplianceRequirement[] = [];

    // Core laws always applicable based on type
    base.push(
      {
        id: "core-income-tax",
        title: "Income Tax Act, 1961 - Annual Returns, TDS, Advance Tax",
        authority: "Income Tax Department",
        category: "core",
        description: "Annual income tax returns, TDS compliance, advance tax payments",
        frequency: "Annual/Quarterly/Monthly",
        selected: true,
        autoDetected: true,
      },
      {
        id: "core-gst",
        title: "GST Act, 2017 - Monthly Returns, Annual Return",
        authority: "GST Department",
        category: "core",
        description: "GSTR-1, GSTR-3B monthly returns and annual GSTR-9",
        frequency: "Monthly/Annual",
        selected: true,
        autoDetected: true,
      }
    );

    if (entity.type?.toLowerCase().includes("llp")) {
      base.push({
        id: "core-llp-act",
        title: "LLP Act, 2008 - Annual Return & Statements",
        authority: "MCA",
        category: "core",
        description: "LLP annual return and statement of accounts",
        frequency: "Annual",
        selected: true,
        autoDetected: true,
      });
    } else {
      base.push({
        id: "core-companies-act",
        title: "Companies Act, 2013 - ROC Filings, Board Meetings",
        authority: "Ministry of Corporate Affairs",
        category: "core",
        description: "Annual filings, board resolutions, compliance certificates",
        frequency: "Annual/Quarterly",
        selected: true,
        autoDetected: true,
      });
    }

    // Labour/size-based
    if (entity.flags?.hasPFESIThresholdMet) {
      base.push(
        {
          id: "size-pf",
          title: "PF Monthly Return (ECR)",
          authority: "EPFO",
          category: "size-based",
          description: "Provident Fund monthly return",
          frequency: "Monthly",
          selected: true,
          autoDetected: true,
        },
        {
          id: "size-esi",
          title: "ESI Monthly Return",
          authority: "ESIC",
          category: "size-based",
          description: "ESI monthly contribution return",
          frequency: "Monthly",
          selected: true,
          autoDetected: true,
        }
      );
    }

    // Jurisdiction mapping (simplified subset - city to state)
    const city = entity.location?.toLowerCase();
    const state =
      city === "mumbai" || city === "pune"
        ? "maharashtra"
        : city === "bangalore"
        ? "karnataka"
        : city === "delhi"
        ? "delhi"
        : city === "ahmedabad"
        ? "gujarat"
        : city === "chennai"
        ? "tamilnadu"
        : undefined;

    if (state) {
      const j: ComplianceRequirement[] = [
        {
          id: `${state}-shops-establishment`,
          title: `${capitalize(state)} Shops & Establishment Act`,
          authority: `${capitalize(state)} Labour Department`,
          category: "jurisdiction",
          description: `Shop and establishment registration and renewals for ${capitalize(state)}`,
          frequency: "Annual",
          selected: true,
          autoDetected: true,
          jurisdiction: state,
        },
        {
          id: `${state}-ptax`,
          title: `${capitalize(state)} Professional Tax`,
          authority: `${capitalize(state)} Revenue Department`,
          category: "jurisdiction",
          description: `Professional tax compliance for ${capitalize(state)} entities`,
          frequency: "Monthly",
          selected: true,
          autoDetected: true,
          jurisdiction: state,
        },
      ];
      base.push(...j);
    }

    // License-based
    if (entity.flags?.hasFactory) {
      base.push({
        id: "license-factory",
        title: "Factory License & Pollution Consent",
        authority: "State PCB",
        category: "license",
        description: "Factory license renewal and consent to operate",
        frequency: "Annual",
        selected: true,
        autoDetected: true,
      });
    }

    if (entity.flags?.isMSME) {
      base.push({
        id: "sector-msme",
        title: "MSME Udyam Registration Updates",
        authority: "MSME Ministry",
        category: "sectoral",
        description: "Maintain MSME registration details and benefits",
        frequency: "Annual",
        selected: true,
        autoDetected: true,
      });
    }

    if (entity.flags?.isListed) {
      base.push({
        id: "sector-sebi-lodr",
        title: "SEBI LODR Compliances",
        authority: "SEBI",
        category: "sectoral",
        description: "Listing obligations and disclosure requirements",
        frequency: "Quarterly/Annual",
        selected: true,
        autoDetected: true,
      });
    }

    if (entity.sector?.toLowerCase() === "it") {
      base.push({
        id: "sector-data-protection",
        title: "Data Protection compliance",
        authority: "IT Ministry",
        category: "sectoral",
        description: "Data privacy and protection compliance",
        frequency: "Annual",
        selected: true,
        autoDetected: true,
      });
      base.push({
        id: "sector-stpi",
        title: "Software Export obligations",
        authority: "STPI/SEZ",
        category: "sectoral",
        description: "Software export documentation and reporting",
        frequency: "Monthly",
        selected: true,
        autoDetected: true,
      });
    }

    return base;
  },

  getCustomLawTemplates(): CustomLawTemplate[] {
    return readTemplates();
  },

  saveCustomLawTemplate(template: Omit<CustomLawTemplate, "id" | "createdAt">): CustomLawTemplate {
    const tpls = readTemplates();
    const newTpl: CustomLawTemplate = {
      id: `tpl-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...template,
    };
    tpls.push(newTpl);
    writeTemplates(tpls);
    return newTpl;
  },

  deleteCustomLawTemplate(id: string) {
    const tpls = readTemplates().filter((t) => t.id !== id);
    writeTemplates(tpls);
  },
};

function capitalize(s?: string) {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

import { EntityFormData, IndustryDetail, FinancialRecord, Creditor, BankDocument } from "@/components/entity";

// Mock entity data
const mockEntities: EntityFormData[] = [
  {
    entityType: "Company",
    cinNumber: "U12345MH2020PTC123456",
    entityName: "ABC Enterprises Pvt Ltd",
    registrationNo: "REG123456",
    rocName: "Registrar of Companies - Mumbai",
    category: "Private",
    subcategory: "Limited by Shares",
    lastAgmDate: "2023-09-15",
    balanceSheetDate: "2023-03-31",
    companyStatus: "Active",
    indexOfCharges: "No charges",
    directors: [
      {
        name: "John Doe",
        designation: "Director",
        din: "00123456",
        dob: "1975-05-15",
        email: "john.doe@example.com",
        contact: "+91 9876543210"
      },
      {
        name: "Jane Smith",
        designation: "Director",
        din: "00789012",
        dob: "1980-08-22",
        email: "jane.smith@example.com",
        contact: "+91 9876543211"
      }
    ],
    pan: "ABCDE1234F",
    gstn: {
      available: true,
      number: "27ABCDE1234F1Z5"
    },
    msme: {
      available: true,
      number: "UDYAM-MH-01-0123456"
    },
    shopEstablishment: {
      available: true,
      number: "760123456/Commercial II Ward/Shop"
    },
    bankAccounts: [
      {
        accountNo: "1234567890123456",
        ifscCode: "SBIN0001234",
        bankName: "State Bank of India",
        branch: "Mumbai Main",
        isMain: true
      }
    ],
    registeredOffice: {
      address: "123 Business Park, Tower A, 5th Floor",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      country: "India"
    },
    factoryOffice: "Plot No. 45, MIDC Industrial Area, Andheri East, Mumbai - 400093",
    correspondenceAddress: "123 Business Park, Tower A, 5th Floor, Mumbai, Maharashtra - 400001",
    sameAddress: true,
    businessLocations: ["Mumbai", "Pune", "Bangalore"],
    registeredEmail: "info@abcenterprises.com",
    alternateEmail: "contact@abcenterprises.com",
    correspondenceEmail: "info@abcenterprises.com",
    phoneNumber: "+91 22 12345678",
    keyPersonnel: [
      {
        id: 1,
        name: "John Doe",
        designation: "CEO",
        identityNo: "ABCDE1234F",
        din: "00123456",
        email: "john.doe@example.com",
        contact: "+91 9876543210"
      },
      {
        id: 2,
        name: "Jane Smith",
        designation: "CFO",
        identityNo: "FGHIJ5678G",
        din: "00789012",
        email: "jane.smith@example.com",
        contact: "+91 9876543211"
      }
    ],
    industries: ["Manufacturing"],
    industryDetails: [
      {
        industry: "Manufacturing",
        subIndustry: "Electronics",
        products: ["Electronic components", "Circuit boards"],
        installedCapacity: 10000,
        salesQuantity: 8500,
        salesValue: 25000000
      }
    ],
    businessActivity: "Manufacturing of electronic components and circuit boards for industrial applications.",
    turnover: "10cr-25cr",
    employeeCount: 75,
    operationalStatus: "Active",
    complianceRating: "High",
    riskCategory: "Low",
    keywords: ["electronics", "manufacturing", "components", "circuit boards"],
    additionalNotes: "Company has been consistently growing at 15% YoY for the past 3 years.",
    
    // Financial Records
    financialRecords: [
      {
        id: "fr1",
        documentType: "Balance Sheet",
        financialYear: "2022-2023",
        fileName: "balance_sheet_2022_23.pdf",
        fileUrl: "/documents/balance_sheet_2022_23.pdf",
        uploadDate: "2023-05-15",
        status: "Verified",
        remarks: "Audited by XYZ & Associates",
        isVerified: true
      },
      {
        id: "fr2",
        documentType: "Profit & Loss",
        financialYear: "2022-2023",
        fileName: "pnl_2022_23.pdf",
        fileUrl: "/documents/pnl_2022_23.pdf",
        uploadDate: "2023-05-15",
        status: "Verified",
        remarks: "Audited by XYZ & Associates",
        isVerified: true
      },
      {
        id: "fr3",
        documentType: "Annual Return",
        financialYear: "2022-2023",
        fileName: "annual_return_2022_23.pdf",
        fileUrl: "/documents/annual_return_2022_23.pdf",
        uploadDate: "2023-06-20",
        status: "Pending",
        remarks: "Awaiting ROC approval",
        isVerified: false
      }
    ],
    financialYears: ["2022-2023", "2021-2022", "2020-2021"],
    auditStatus: "Completed",
    auditRemarks: "Clean audit report for FY 2022-23",
    taxFilingStatus: "Filed",
    taxRemarks: "All tax filings up to date",
    
    // Creditors
    creditors: [
      {
        id: "cr1",
        name: "Component Suppliers Ltd",
        class: "Operational",
        subClass: "Raw Materials",
        amount: 1250000,
        claimDate: "2023-07-15",
        status: "Verified",
        remarks: "Regular supplier for PCB components",
        documentUrl: "/documents/claim_cs_ltd.pdf",
        documentName: "claim_cs_ltd.pdf"
      },
      {
        id: "cr2",
        name: "Industrial Finance Corp",
        class: "Financial",
        subClass: "Secured Loan",
        amount: 5000000,
        claimDate: "2023-06-30",
        status: "Verified",
        remarks: "Term loan for machinery",
        documentUrl: "/documents/loan_ifc.pdf",
        documentName: "loan_ifc.pdf"
      },
      {
        id: "cr3",
        name: "Tech Equipment Rentals",
        class: "Operational",
        subClass: "Services",
        amount: 350000,
        claimDate: "2023-08-05",
        status: "Pending",
        remarks: "Verification in progress",
        documentUrl: "/documents/claim_ter.pdf",
        documentName: "claim_ter.pdf"
      }
    ],
    totalClaimAmount: 6600000,
    creditorsClassification: "Mixed",
    
    // Bank Documents
    bankDocuments: [
      {
        id: "bd1",
        bankName: "HDFC Bank",
        documentType: "Bank Statement",
        documentDate: "2023-07-31",
        fileName: "hdfc_statement_jul_2023.pdf",
        fileUrl: "/documents/hdfc_statement_jul_2023.pdf",
        uploadDate: "2023-08-05",
        status: "Verified",
        remarks: "Primary operating account",
        isVerified: true
      },
      {
        id: "bd2",
        bankName: "ICICI Bank",
        documentType: "Fixed Deposit Certificate",
        documentDate: "2023-06-15",
        fileName: "icici_fd_certificate.pdf",
        fileUrl: "/documents/icici_fd_certificate.pdf",
        uploadDate: "2023-06-20",
        status: "Verified",
        remarks: "FD for bank guarantee",
        isVerified: true
      },
      {
        id: "bd3",
        bankName: "State Bank of India",
        documentType: "Loan Statement",
        documentDate: "2023-07-31",
        fileName: "sbi_loan_statement.pdf",
        fileUrl: "/documents/sbi_loan_statement.pdf",
        uploadDate: "2023-08-10",
        status: "Pending",
        remarks: "Term loan for factory expansion",
        isVerified: false
      }
    ],
    investmentSummary: "The company maintains diversified banking relationships with three major banks. Primary operations are through HDFC Bank, while term loans are with SBI and fixed deposits with ICICI Bank. Total banking facilities amount to approximately Rs. 8.5 crores."
  },
  {
    entityType: "LLP",
    cinNumber: "AAA-1234",
    entityName: "XYZ Solutions LLP",
    registrationNo: "REG987654",
    rocName: "Registrar of Companies - Delhi",
    category: "LLP",
    subcategory: "Professional Services",
    lastAgmDate: "2023-08-10",
    balanceSheetDate: "2023-03-31",
    companyStatus: "Active",
    indexOfCharges: "No charges",
    directors: [
      {
        name: "Rajesh Kumar",
        designation: "Partner",
        din: "00345678",
        dob: "1982-03-25",
        email: "rajesh@xyzsolutions.com",
        contact: "+91 9876543220"
      }
    ],
    pan: "PQRST5678G",
    gstn: {
      available: true,
      number: "07PQRST5678G1Z3"
    },
    msme: {
      available: false,
      number: ""
    },
    shopEstablishment: {
      available: true,
      number: "DL-2021-0987654"
    },
    bankAccounts: [
      {
        accountNo: "9876543210987654",
        ifscCode: "HDFC0000123",
        bankName: "HDFC Bank",
        branch: "Connaught Place",
        isMain: true
      }
    ],
    registeredOffice: {
      address: "456 Tech Park, 10th Floor",
      city: "New Delhi",
      state: "Delhi",
      pincode: "110001",
      country: "India"
    },
    factoryOffice: "",
    correspondenceAddress: "456 Tech Park, 10th Floor, Connaught Place, New Delhi - 110001",
    sameAddress: true,
    businessLocations: ["Delhi", "Gurgaon"],
    registeredEmail: "info@xyzsolutions.com",
    alternateEmail: "support@xyzsolutions.com",
    correspondenceEmail: "info@xyzsolutions.com",
    phoneNumber: "+91 11 23456789",
    keyPersonnel: [
      {
        id: 1,
        name: "Rajesh Kumar",
        designation: "Managing Partner",
        identityNo: "PQRST5678G",
        din: "00345678",
        email: "rajesh@xyzsolutions.com",
        contact: "+91 9876543220"
      },
      {
        id: 2,
        name: "Priya Sharma",
        designation: "Partner",
        identityNo: "UVWXY9012H",
        din: "00456789",
        email: "priya@xyzsolutions.com",
        contact: "+91 9876543221"
      }
    ],
    industries: ["Service"],
    industryDetails: [
      {
        industry: "Service",
        subIndustry: "IT Services",
        products: ["Software development", "IT consulting", "Fintech solutions"],
        installedCapacity: 0,
        salesQuantity: 0,
        salesValue: 75000000
      }
    ],
    businessActivity: "Software development and IT consulting services for financial institutions.",
    turnover: "5cr-10cr",
    employeeCount: 45,
    operationalStatus: "Active",
    complianceRating: "High",
    riskCategory: "Low",
    keywords: ["IT services", "software development", "consulting", "fintech"],
    additionalNotes: "Specializes in financial technology solutions.",
    
    // Financial Records
    financialRecords: [
      {
        id: "fr4",
        documentType: "Balance Sheet",
        financialYear: "2022-2023",
        fileName: "xyz_balance_sheet_2022_23.pdf",
        fileUrl: "/documents/xyz_balance_sheet_2022_23.pdf",
        uploadDate: "2023-04-20",
        status: "Verified",
        remarks: "Audited by ABC & Co.",
        isVerified: true
      },
      {
        id: "fr5",
        documentType: "Profit & Loss",
        financialYear: "2022-2023",
        fileName: "xyz_pnl_2022_23.pdf",
        fileUrl: "/documents/xyz_pnl_2022_23.pdf",
        uploadDate: "2023-04-20",
        status: "Verified",
        remarks: "Audited by ABC & Co.",
        isVerified: true
      },
      {
        id: "fr6",
        documentType: "GST Returns",
        financialYear: "2022-2023",
        fileName: "xyz_gst_returns_q4.pdf",
        fileUrl: "/documents/xyz_gst_returns_q4.pdf",
        uploadDate: "2023-04-25",
        status: "Pending",
        remarks: "Q4 returns under review",
        isVerified: false
      }
    ],
    financialYears: ["2022-2023", "2021-2022", "2020-2021"],
    auditStatus: "Completed",
    auditRemarks: "Clean audit report for FY 2022-23",
    taxFilingStatus: "Filed",
    taxRemarks: "All tax filings up to date",
    
    // Creditors
    creditors: [
      {
        id: "cr4",
        name: "Software License Co.",
        class: "Operational",
        subClass: "Software",
        amount: 750000,
        claimDate: "2023-07-10",
        status: "Verified",
        remarks: "Annual license fees",
        documentUrl: "/documents/claim_slc.pdf",
        documentName: "claim_slc.pdf"
      },
      {
        id: "cr5",
        name: "Tech Ventures Capital",
        class: "Financial",
        subClass: "Unsecured Loan",
        amount: 2000000,
        claimDate: "2023-05-15",
        status: "Verified",
        remarks: "Working capital loan",
        documentUrl: "/documents/loan_tvc.pdf",
        documentName: "loan_tvc.pdf"
      }
    ],
    totalClaimAmount: 2750000,
    creditorsClassification: "Mixed",
    
    // Bank Documents
    bankDocuments: [
      {
        id: "bd4",
        bankName: "ICICI Bank",
        documentType: "Bank Statement",
        documentDate: "2023-07-31",
        fileName: "icici_statement_jul_2023.pdf",
        fileUrl: "/documents/icici_statement_jul_2023.pdf",
        uploadDate: "2023-08-03",
        status: "Verified",
        remarks: "Primary operating account",
        isVerified: true
      },
      {
        id: "bd5",
        bankName: "Axis Bank",
        documentType: "Overdraft Statement",
        documentDate: "2023-07-31",
        fileName: "axis_od_statement.pdf",
        fileUrl: "/documents/axis_od_statement.pdf",
        uploadDate: "2023-08-05",
        status: "Pending",
        remarks: "Overdraft facility for working capital",
        isVerified: false
      }
    ],
    investmentSummary: "The firm maintains banking relationships primarily with ICICI Bank for operations and Axis Bank for credit facilities. Total banking facilities amount to approximately Rs. 3.5 crores."
  }
];

// Entity API service
export const entityService = {
  // Get all entities
  getAllEntities(): Promise<EntityFormData[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockEntities);
      }, 500);
    });
  },

  // Get entity by ID (using CIN as ID for simplicity)
  getEntityById(id: string): Promise<EntityFormData | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const entity = mockEntities.find(e => e.cinNumber === id);
        resolve(entity);
      }, 500);
    });
  },

  // Create new entity
  createEntity(entity: EntityFormData): Promise<EntityFormData> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real API, this would be saved to a database
        // For now, we just return the entity as if it was saved
        resolve(entity);
      }, 1000);
    });
  },

  // Update entity
  updateEntity(id: string, entity: EntityFormData): Promise<EntityFormData> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real API, this would update the entity in a database
        // For now, we just return the updated entity
        resolve(entity);
      }, 1000);
    });
  },

  // Delete entity
  deleteEntity(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real API, this would delete the entity from a database
        // For now, we just return success
        resolve(true);
      }, 1000);
    });
  },

  // Verify entity with MCA API (mock)
  verifyEntityWithMCA(cinNumber: string): Promise<Partial<EntityFormData>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate API call to MCA for CIN/LLPIN verification
        if (cinNumber === "U12345MH2020PTC123456") {
          resolve({
            entityName: "ABC Enterprises Pvt Ltd",
            registrationNo: "REG123456",
            rocName: "Registrar of Companies - Mumbai",
            category: "Private",
            subcategory: "Limited by Shares",
            companyStatus: "Active",
            directors: [
              {
                name: "John Doe",
                designation: "Director",
                din: "00123456",
                dob: "1975-05-15",
                email: "",
                contact: ""
              },
              {
                name: "Jane Smith",
                designation: "Director",
                din: "00789012",
                dob: "1980-08-22",
                email: "",
                contact: ""
              }
            ]
          });
        } else {
          // If CIN not found or invalid
          resolve({});
        }
      }, 1500);
    });
  },

  // Get industry details for an entity
  getIndustryDetails(entityId: string): Promise<IndustryDetail[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const entity = mockEntities.find(e => e.cinNumber === entityId);
        resolve(entity?.industryDetails || []);
      }, 500);
    });
  },

  // Update industry details for an entity
  updateIndustryDetails(entityId: string, industryDetails: IndustryDetail[]): Promise<IndustryDetail[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real API, this would update the industry details in a database
        // For now, we just return the updated industry details
        resolve(industryDetails);
      }, 800);
    });
  },

  // Get financial records for an entity
  getFinancialRecords(entityId: string): Promise<FinancialRecord[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const entity = mockEntities.find(e => e.cinNumber === entityId);
        resolve(entity?.financialRecords || []);
      }, 500);
    });
  },

  // Add a financial record
  addFinancialRecord(entityId: string, record: FinancialRecord): Promise<FinancialRecord> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real API, this would add the record to a database
        // For now, we just return the record as if it was saved
        resolve({
          ...record,
          uploadDate: new Date().toISOString().split('T')[0],
          status: "Pending"
        });
      }, 800);
    });
  },

  // Update a financial record
  updateFinancialRecord(entityId: string, recordId: string, updates: Partial<FinancialRecord>): Promise<FinancialRecord> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real API, this would update the record in a database
        // For now, we just return a mock updated record
        resolve({
          id: recordId,
          documentType: updates.documentType || "Balance Sheet",
          financialYear: updates.financialYear || "2023-2024",
          fileName: updates.fileName || "document.pdf",
          fileUrl: updates.fileUrl,
          uploadDate: updates.uploadDate || new Date().toISOString().split('T')[0],
          status: updates.status || "Verified",
          remarks: updates.remarks,
          isVerified: updates.status === "Verified"
        });
      }, 800);
    });
  },

  // Get creditors for an entity
  getCreditors(entityId: string): Promise<Creditor[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const entity = mockEntities.find(e => e.cinNumber === entityId);
        resolve(entity?.creditors || []);
      }, 500);
    });
  },

  // Add a creditor
  addCreditor(entityId: string, creditor: Creditor): Promise<Creditor> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real API, this would add the creditor to a database
        // For now, we just return the creditor as if it was saved
        resolve(creditor);
      }, 800);
    });
  },

  // Update a creditor
  updateCreditor(entityId: string, creditorId: string, updates: Partial<Creditor>): Promise<Creditor> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real API, this would update the creditor in a database
        // For now, we just return a mock updated creditor
        resolve({
          id: creditorId,
          name: updates.name || "Creditor Name",
          class: updates.class || "Secured",
          subClass: updates.subClass,
          amount: updates.amount || 0,
          claimDate: updates.claimDate,
          status: updates.status || "Pending",
          remarks: updates.remarks,
          documentUrl: updates.documentUrl,
          documentName: updates.documentName
        });
      }, 800);
    });
  },

  // Get bank documents for an entity
  getBankDocuments(entityId: string): Promise<BankDocument[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const entity = mockEntities.find(e => e.cinNumber === entityId);
        resolve(entity?.bankDocuments || []);
      }, 500);
    });
  },

  // Add a bank document
  addBankDocument(entityId: string, document: BankDocument): Promise<BankDocument> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real API, this would add the document to a database
        // For now, we just return the document as if it was saved
        resolve({
          ...document,
          uploadDate: new Date().toISOString().split('T')[0],
          status: "Pending",
          isVerified: false
        });
      }, 800);
    });
  },

  // Update a bank document
  updateBankDocument(entityId: string, documentId: string, updates: Partial<BankDocument>): Promise<BankDocument> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real API, this would update the document in a database
        // For now, we just return a mock updated document
        resolve({
          id: documentId,
          bankName: updates.bankName || "Bank Name",
          documentType: updates.documentType || "Bank Statement",
          documentDate: updates.documentDate || new Date().toISOString().split('T')[0],
          fileName: updates.fileName,
          fileUrl: updates.fileUrl,
          uploadDate: updates.uploadDate || new Date().toISOString().split('T')[0],
          status: updates.status || "Pending",
          remarks: updates.remarks,
          isVerified: updates.status === "Verified"
        });
      }, 800);
    });
  }
};

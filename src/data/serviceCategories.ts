export interface ServiceCategory {
  name: string;
  subcategories: string[];
}

// NOTE: Subcategories include subgroup prefixes for clarity, preserving the exact structure.
export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    name: 'Corporate Law & Secretarial Compliance',
    subcategories: [
      // Incorporation & Business Set-Up
      'Incorporation & Business Set-Up > Incorporation of Private Limited Company',
      'Incorporation & Business Set-Up > Incorporation of Public Limited Company',
      'Incorporation & Business Set-Up > Incorporation of One Person Company (OPC)',
      'Incorporation & Business Set-Up > Incorporation of Limited Liability Partnership (LLP)',
      'Incorporation & Business Set-Up > Incorporation of Producer Company',
      'Incorporation & Business Set-Up > Section 8 (Not-for-Profit) Company Registration',
      'Incorporation & Business Set-Up > Conversion of Proprietorship/Partnership into Company/LLP',
      'Incorporation & Business Set-Up > Conversion of Private Company into Public/OPC/LLP & vice versa',
      'Incorporation & Business Set-Up > Obtaining Director Identification Number (DIN)',
      'Incorporation & Business Set-Up > Digital Signature Certificates (DSC) facilitation',
      'Incorporation & Business Set-Up > Name Reservation & Change of Name',
      'Incorporation & Business Set-Up > Drafting Memorandum & Articles of Association',
      'Incorporation & Business Set-Up > Commencement of Business filings',

      // Secretarial Compliance & Filings
      'Secretarial Compliance & Filings > Annual Return filing (MGT-7/MGT-7A)',
      'Secretarial Compliance & Filings > Financial Statement filing (AOC-4/AOC-4 XBRL)',
      'Secretarial Compliance & Filings > Appointment/Reappointment/Resignation of Directors (DIR-12)',
      'Secretarial Compliance & Filings > Appointment/Resignation of Auditors (ADT-1/ADT-3)',
      'Secretarial Compliance & Filings > Filing of Charges (CHG-1, CHG-4, CHG-9)',
      'Secretarial Compliance & Filings > Maintenance of Statutory Registers (Members, Directors, Charges, etc.)',
      'Secretarial Compliance & Filings > Issue/Allotment/Transfer of Shares (PAS-3, SH-4, SH-7)',
      'Secretarial Compliance & Filings > Buyback/Reduction of Share Capital filings',
      'Secretarial Compliance & Filings > Increase in Authorised Share Capital filings',
      'Secretarial Compliance & Filings > Compliance for Listed Companies (LODR, SEBI Regulations)',
      'Secretarial Compliance & Filings > Filing of Resolutions with ROC (MGT-7, MGT-14)',
      'Secretarial Compliance & Filings > Filing of Return of Deposits (DPT-3)',
      'Secretarial Compliance & Filings > MSME Return filing (MSME-1)',
      'Secretarial Compliance & Filings > Event-based compliances (change in registered office, alteration in MOA/AOA, etc.)',
      'Secretarial Compliance & Filings > Filing liquidator’s documents',
      'Secretarial Compliance & Filings > Compounding of offences',

      // Board & Shareholder Meeting Compliances
      'Board & Shareholder Meeting Compliances > Drafting & Circulation of Notice & Agenda for Board/General Meetings',
      'Board & Shareholder Meeting Compliances > Conducting Meetings (Board Meetings, Committee Meetings, General Meetings)',
      'Board & Shareholder Meeting Compliances > Drafting of Minutes (Board Meetings, Committee Meetings, General Meetings)',
      'Board & Shareholder Meeting Compliances > Assistance in e-voting & postal ballot',
      'Board & Shareholder Meeting Compliances > Preparation & filing of resolutions with ROC',
      'Board & Shareholder Meeting Compliances > Drafting of shareholder agreements & corporate governance policies',
      'Board & Shareholder Meeting Compliances > Support in Secretarial Standards (SS-1 & SS-2) compliance',

      // Corporate Governance & Advisory
      'Corporate Governance & Advisory > Advisory on Companies Act, 2013 compliance',
      'Corporate Governance & Advisory > Advisory on FEMA/RBI matters (Foreign Direct Investment, ODI, ECB)',
      'Corporate Governance & Advisory > Corporate Restructuring (mergers, demergers, amalgamations)',
      'Corporate Governance & Advisory > Drafting shareholder agreements, joint venture agreements',
      'Corporate Governance & Advisory > Due Diligence (Secretarial, Legal, Corporate Governance)',
      'Corporate Governance & Advisory > Corporate Policy drafting (Whistle-blower, CSR, Code of Conduct, etc.)',
      'Corporate Governance & Advisory > Secretarial Audit (for listed & prescribed companies)',
      'Corporate Governance & Advisory > Certification of Annual Returns (MGT-7, Form 8/11 for LLPs)',
      'Corporate Governance & Advisory > CSR compliance & reporting',

      // Statutory Certifications & Reports
      'Statutory Certifications & Reports > Certification of Annual Return (MGT-8)',
      'Statutory Certifications & Reports > Secretarial Audit Report (MR-3)',
      'Statutory Certifications & Reports > Certification of e-forms under Companies Act',
      'Statutory Certifications & Reports > Diligence Report for Banks (as per RBI requirements)',
      'Statutory Certifications & Reports > Certification for Buyback of Shares',
      'Statutory Certifications & Reports > Certification for Preferential Allotment/Bonus/Rights Issue',
      'Statutory Certifications & Reports > Reconciliation of Share Capital Audit (half-yearly for listed cos.)',

      // Regulatory Approvals & Representation
      'Regulatory Approvals & Representation > Filing & liaisoning with Registrar of Companies (ROC)',
      'Regulatory Approvals & Representation > Filing & liaisoning with Regional Director (RD)',
      'Regulatory Approvals & Representation > Compounding of offences under Companies Act',
      'Regulatory Approvals & Representation > Condonation of Delay (with RD/NCLT)',
      'Regulatory Approvals & Representation > Shifting of Registered Office (within state, from one state to another)',
      'Regulatory Approvals & Representation > Striking off company (STK-2 filing)',
      'Regulatory Approvals & Representation > Revival of companies under NCLT',
      'Regulatory Approvals & Representation > Representation before MCA/ROC/NCLT/SEBI/Stock Exchanges (where permitted)'
    ]
  },
  {
    name: 'NCLT/NCLAT & Legal Representation',
    subcategories: [
      // Corporate Insolvency Resolution Process (CIRP) – Filing Applications
      'Corporate Insolvency Resolution Process (CIRP) > Filing Applications > Section 7 (by Financial Creditor)',
      'Corporate Insolvency Resolution Process (CIRP) > Filing Applications > Section 9 (by Operational Creditor)',
      'Corporate Insolvency Resolution Process (CIRP) > Filing Applications > Section 10 (by Corporate Applicant)',

      // CIRP – Representing Stakeholders
      'Corporate Insolvency Resolution Process (CIRP) > Representing Stakeholders > Financial Creditors (Banks, NBFCs, Homebuyers, etc.)',
      'Corporate Insolvency Resolution Process (CIRP) > Representing Stakeholders > Operational Creditors (Vendors, Employees, Statutory Authorities)',
      'Corporate Insolvency Resolution Process (CIRP) > Representing Stakeholders > Corporate Debtor (Companies filing themselves)',
      'Corporate Insolvency Resolution Process (CIRP) > Representing Stakeholders > Interim Resolution Professional (IRP) / Resolution Professional (RP) assistance',
      'Corporate Insolvency Resolution Process (CIRP) > Filing/Defending claims before IRP/RP/CoC',
      'Corporate Insolvency Resolution Process (CIRP) > Filing interlocutory applications (IA) in CIRP proceedings',
      'Corporate Insolvency Resolution Process (CIRP) > Challenging/defending CoC decisions before NCLT',
      'Corporate Insolvency Resolution Process (CIRP) > Filing avoidance transactions: preferential, undervalued, fraudulent, extortionate',
      'Corporate Insolvency Resolution Process (CIRP) > Approval of Resolution Plan before NCLT',
      'Corporate Insolvency Resolution Process (CIRP) > Liquidation orders in CIRP failure',

      // Liquidation Proceedings
      'Liquidation Proceedings > Filing application for liquidation',
      'Liquidation Proceedings > Acting as liquidator (if eligible) or assisting liquidator',
      'Liquidation Proceedings > Claim collation and verification assistance',
      'Liquidation Proceedings > Filing interlocutory applications in liquidation matters',
      'Liquidation Proceedings > Distribution of assets representation',
      'Liquidation Proceedings > Application for dissolution of company',

      // Voluntary Liquidation
      'Voluntary Liquidation > Filing initiation application before NCLT',
      'Voluntary Liquidation > Public announcements & claim verifications',
      'Voluntary Liquidation > Filing reports with NCLT',
      'Voluntary Liquidation > Application for dissolution order',

      // Bankruptcy (Personal & Partnership)
      'Bankruptcy (Personal & Partnership) > Filing application under IBC Part III (when notified fully)',
      'Bankruptcy (Personal & Partnership) > Representing personal guarantors to corporate debtors',
      'Bankruptcy (Personal & Partnership) > Representation for creditors against personal guarantors',
      'Bankruptcy (Personal & Partnership) > Filing discharge application / opposition',

      // Oppression & Mismanagement
      'Oppression & Mismanagement (Company Law, Section 241–242) > Filing application for oppression and mismanagement',
      'Oppression & Mismanagement (Company Law, Section 241–242) > Representation of majority/minority shareholders',
      'Oppression & Mismanagement (Company Law, Section 241–242) > Reliefs for removal of directors, mismanagement, fraud, siphoning of funds',
      'Oppression & Mismanagement (Company Law, Section 241–242) > Applications for rectification of register of members',
      'Oppression & Mismanagement (Company Law, Section 241–242) > Waiver applications (maintainability of petition)',

      // Merger, Demerger & Compromise (Schemes)
      'Merger, Demerger & Compromise (Section 230–232 Schemes) > Filing application for approval of scheme of arrangement/merger/demerger',
      'Merger, Demerger & Compromise (Section 230–232 Schemes) > Representation in objections by ROC, RD, OL, creditors',
      'Merger, Demerger & Compromise (Section 230–232 Schemes) > Application for modification or withdrawal of schemes',
      'Merger, Demerger & Compromise (Section 230–232 Schemes) > Cross-border merger applications',

      // Revival & Rehabilitation of Companies
      'Revival & Rehabilitation of Companies > Filing application for revival of sick company (under IBC/NCLT powers)',
      'Revival & Rehabilitation of Companies > Application for restructuring/settlement under Section 230',
      'Revival & Rehabilitation of Companies > Filing for reopening of accounts or recasting of financials',
      'Revival & Rehabilitation of Companies > Compromise with creditors under NCLT approval',

      // Reduction of Share Capital
      'Reduction of Share Capital > Filing application for reduction of capital',
      'Reduction of Share Capital > Representing objections (creditors/ROC/SEBI if listed)',
      'Reduction of Share Capital > Approval and order compliance',

      // Amalgamation/Conversion Cases
      'Amalgamation/Conversion Cases > Conversion of public company into private company (NCLT approval)',
      'Amalgamation/Conversion Cases > Conversion of company into LLP (when required under tribunal route)',
      'Amalgamation/Conversion Cases > Approval for change in financial year under Section 2(41)',
      'Amalgamation/Conversion Cases > Shifting of registered office from one state to another',

      // Compounding of Offences
      'Compounding of Offences > Filing compounding applications for violations under Companies Act',
      'Compounding of Offences > Representation before NCLT for reliefs/reductions',

      // Miscellaneous NCLT Matters
      'Miscellaneous NCLT Matters > Rectification of register of members (Section 59)',
      'Miscellaneous NCLT Matters > Approval for issue/redemption of securities when required',
      'Miscellaneous NCLT Matters > Applications related to managerial remuneration approval/exceeding limits',
      'Miscellaneous NCLT Matters > Waivers under Companies Act provisions requiring NCLT sanction',
      'Miscellaneous NCLT Matters > Restoration of struck-off companies (Section 252)',
      'Miscellaneous NCLT Matters > Appeals against ROC/RD orders',
      'Miscellaneous NCLT Matters > Filing for extension of AGM, condonation of delay in filing',

      // Appeals before NCLAT
      'Appeals before NCLAT > Drafting & filing appeals against NCLT orders',
      'Appeals before NCLAT > Representation for: CIRP & Liquidation matters',
      'Appeals before NCLAT > Representation for: Oppression & Mismanagement cases',
      'Appeals before NCLAT > Representation for: Mergers, demergers, compromises',
      'Appeals before NCLAT > Representation for: Company law violations & restoration orders',
      'Appeals before NCLAT > Stay applications & interim reliefs before NCLAT',

      // High Court / Supreme Court Appeals
      'High Court / Supreme Court Appeals (Connected with NCLT/NCLAT) > Preparing and filing appeals to Supreme Court against NCLAT orders (with advocates)',
      'High Court / Supreme Court Appeals (Connected with NCLT/NCLAT) > Drafting and strategizing appeals connected to corporate law/IBC',

      // Ancillary Legal Support
      'Ancillary Legal Support > Drafting & vetting pleadings, affidavits, rejoinders',
      'Ancillary Legal Support > Liaison with advocates, counsels, experts',
      'Ancillary Legal Support > Compliance of NCLT/NCLAT orders (filings with ROC, RD, etc.)',
      'Ancillary Legal Support > Certified copy procurement & filing support'
    ]
  },
  {
    name: 'Governance & Advisory',
    subcategories: [
      // Corporate Governance Framework: Board Framework
      'Corporate Governance Framework: Board Framework > Drafting & advising on Board Charters, Committees, and TORs',
      'Corporate Governance Framework: Board Framework > Setting up Audit Committee, Nomination & Remuneration Committee, CSR Committee, Risk Management Committee',
      'Corporate Governance Framework: Board Framework > Evaluation of Board performance',
      'Corporate Governance Framework: Board Framework > Training & familiarization programs for directors',
      'Corporate Governance Framework: Board Framework > Independent directors’ appointment, role & compliance',

      // Corporate Governance Framework: Policy Formulation
      'Corporate Governance Framework: Policy Formulation > Drafting and implementation of Corporate Governance Policies',
      'Corporate Governance Framework: Policy Formulation > Code of Conduct for Directors and Employees',
      'Corporate Governance Framework: Policy Formulation > Whistle-blower and Vigil Mechanism Policies',
      'Corporate Governance Framework: Policy Formulation > Related Party Transactions Policy',
      'Corporate Governance Framework: Policy Formulation > Insider Trading Code & Fair Disclosure Policy',
      'Corporate Governance Framework: Policy Formulation > Succession Planning Policy',

      // Strategic Advisory: Business Structuring & Restructuring
      'Strategic Advisory: Business Structuring & Restructuring > Advisory on choice of entity (Pvt Ltd, LLP, Listed Co, etc.)',
      'Strategic Advisory: Business Structuring & Restructuring > Group structuring & holding-subsidiary arrangements',
      'Strategic Advisory: Business Structuring & Restructuring > Shareholder agreements & joint ventures',
      'Strategic Advisory: Business Structuring & Restructuring > Corporate restructuring – mergers, demergers, spin-offs',
      'Strategic Advisory: Business Structuring & Restructuring > Conversion of entity (Private to Public, OPC to Private, etc.)',

      // Strategic Advisory: Corporate Strategy
      'Strategic Advisory: Corporate Strategy > ESG & Sustainability advisory',
      'Strategic Advisory: Corporate Strategy > CSR strategy & compliance monitoring',
      'Strategic Advisory: Corporate Strategy > Business expansion into new jurisdictions (India & overseas)',
      'Strategic Advisory: Corporate Strategy > Cross-border structuring and foreign entry strategies',

      // Risk Management & Compliance Advisory: ERM
      'Risk Management & Compliance Advisory: Enterprise Risk Management (ERM) > Designing risk management frameworks',
      'Risk Management & Compliance Advisory: Enterprise Risk Management (ERM) > Risk identification, mitigation, and reporting',
      'Risk Management & Compliance Advisory: Enterprise Risk Management (ERM) > Compliance risk mapping & monitoring',

      // Risk Management & Compliance Advisory: Internal Controls & Health Checks
      'Risk Management & Compliance Advisory: Internal Controls & Compliance Health Checks > Secretarial Audit readiness & mock audits',
      'Risk Management & Compliance Advisory: Internal Controls & Compliance Health Checks > Compliance status reporting to Board',
      'Risk Management & Compliance Advisory: Internal Controls & Compliance Health Checks > Regulatory risk assessment',
      'Risk Management & Compliance Advisory: Internal Controls & Compliance Health Checks > Periodic governance health-check reviews',

      // Shareholder & Investor Advisory
      'Shareholder & Investor Advisory: Shareholder Relations > Drafting & advising on Shareholders’ Agreements',
      'Shareholder & Investor Advisory: Shareholder Relations > Advisory on shareholder disputes & settlements',
      'Shareholder & Investor Advisory: Shareholder Relations > Structuring minority shareholder protections',
      'Shareholder & Investor Advisory: Shareholder Relations > Shareholder communications & disclosures',
      'Shareholder & Investor Advisory: Investor Relations > Advising on investor onboarding processes',
      'Shareholder & Investor Advisory: Investor Relations > Support in capital raising (equity/debt)',
      'Shareholder & Investor Advisory: Investor Relations > Compliance for private equity/venture capital funding',
      'Shareholder & Investor Advisory: Investor Relations > Ongoing investor reporting and governance',

      // Ethics & Sustainability Governance
      'Ethics & Sustainability Governance: Ethics Management > Setting up Ethics Committees',
      'Ethics & Sustainability Governance: Ethics Management > Conducting ethics training & awareness sessions',
      'Ethics & Sustainability Governance: Ethics Management > Advisory on conflict-of-interest situations',
      'Ethics & Sustainability Governance: Sustainability & ESG > ESG framework advisory & reporting',
      'Ethics & Sustainability Governance: Sustainability & ESG > Guidance on integrated reporting (SEBI/Global Standards)',
      'Ethics & Sustainability Governance: Sustainability & ESG > Corporate social responsibility compliance & reporting',

      // Government, Regulatory & Institutional Advisory
      'Government, Regulatory & Institutional Advisory > Advisory on MCA, SEBI, RBI, IRDA, CCI, IBBI compliances',
      'Government, Regulatory & Institutional Advisory > Representation before regulatory authorities (advisory level)',
      'Government, Regulatory & Institutional Advisory > Guidance on new regulatory frameworks & reforms',
      'Government, Regulatory & Institutional Advisory > Advising on corporate laws and policy changes',
      'Government, Regulatory & Institutional Advisory > Drafting representations & petitions to regulators',
      'Government, Regulatory & Institutional Advisory > Stakeholder consultation & advocacy support',

      // Corporate Communication & Transparency
      'Corporate Communication & Transparency: Disclosure Management > Advising on disclosure norms under SEBI, Companies Act, LODR',
      'Corporate Communication & Transparency: Disclosure Management > Ensuring fair & transparent communication to stakeholders',
      'Corporate Communication & Transparency: Disclosure Management > Drafting Annual Report sections (Directors’ Report, Corporate Governance Report, etc.)',
      'Corporate Communication & Transparency: Crisis Management Advisory > Advisory on corporate crisis handling (fraud, governance lapses, media issues)',
      'Corporate Communication & Transparency: Crisis Management Advisory > Drafting crisis communication framework',
      'Corporate Communication & Transparency: Crisis Management Advisory > Supporting management in regulatory investigations'
    ]
  },
  {
    name: 'Capital Markets & SEBI Compliance',
    subcategories: [
      // SEBI (LODR)
      'SEBI (LODR) Regulations, 2015 > Drafting and filing disclosures with stock exchanges (quarterly, half-yearly, annual)',
      'SEBI (LODR) Regulations, 2015 > Ensuring compliance with corporate governance provisions (Board composition, Independent Directors, committees)',
      'SEBI (LODR) Regulations, 2015 > Certification and filing of Corporate Governance Report',
      'SEBI (LODR) Regulations, 2015 > Certification of Shareholding Pattern',
      'SEBI (LODR) Regulations, 2015 > Monitoring compliance with related party transactions',
      'SEBI (LODR) Regulations, 2015 > Annual secretarial compliance report under SEBI Circulars',

      // Insider Trading
      'SEBI Insider Trading (Prohibition) Regulations, 2015 > Drafting & implementation of Code of Conduct & Code of Fair Disclosure',
      'SEBI Insider Trading (Prohibition) Regulations, 2015 > Maintaining Structured Digital Database (SDD)',
      'SEBI Insider Trading (Prohibition) Regulations, 2015 > Monitoring & reporting of trading window closure',
      'SEBI Insider Trading (Prohibition) Regulations, 2015 > Pre-clearance of trades & disclosure monitoring',
      'SEBI Insider Trading (Prohibition) Regulations, 2015 > Filing reports with stock exchanges',

      // Takeover Regulations
      'SEBI Takeover Regulations (SAST) > Drafting & filing public announcements for open offers',
      'SEBI Takeover Regulations (SAST) > Compliance certifications for acquirers/target companies',
      'SEBI Takeover Regulations (SAST) > Handling disclosures of acquisitions/encumbrances',
      'SEBI Takeover Regulations (SAST) > Assisting in exit offers & takeover compliances',

      // Buyback Regulations
      'SEBI Buyback of Securities Regulations > Drafting buyback public announcement & letters of offer',
      'SEBI Buyback of Securities Regulations > Filing of returns with SEBI & stock exchanges',
      'SEBI Buyback of Securities Regulations > Ensuring extinguishment & compliance with timelines',

      // Delisting Regulations
      'SEBI Delisting Regulations > Preparing due diligence report',
      'SEBI Delisting Regulations > Drafting of public announcements & exit offer documents',
      'SEBI Delisting Regulations > Certification of compliance with delisting process',

      // Capital Raising & Securities Issuance
      'Capital Raising & Securities Issuance: Public Issues (IPO / FPO) > Drafting & certification of prospectus',
      'Capital Raising & Securities Issuance: Public Issues (IPO / FPO) > Due diligence certificate under SEBI ICDR Regulations',
      'Capital Raising & Securities Issuance: Public Issues (IPO / FPO) > Co-ordination with merchant bankers, RTA, legal counsel',
      'Capital Raising & Securities Issuance: Public Issues (IPO / FPO) > Certification of allotment & listing compliance',
      'Capital Raising & Securities Issuance: Preferential Issues > Drafting private placement offer letters',
      'Capital Raising & Securities Issuance: Preferential Issues > Filing with stock exchanges & ROC',
      'Capital Raising & Securities Issuance: Preferential Issues > Ensuring lock-in and pricing compliance',
      'Capital Raising & Securities Issuance: Rights Issue > Drafting letter of offer',
      'Capital Raising & Securities Issuance: Rights Issue > Certification of eligibility & compliance with SEBI',
      'Capital Raising & Securities Issuance: Rights Issue > Post-issue compliance reporting',
      'Capital Raising & Securities Issuance: Qualified Institutions Placement (QIP) > Compliance certification under SEBI ICDR',
      'Capital Raising & Securities Issuance: Qualified Institutions Placement (QIP) > Co-ordination with stock exchanges & merchant bankers',
      'Capital Raising & Securities Issuance: Bonus & Split Issues > Certification of corporate actions',
      'Capital Raising & Securities Issuance: Bonus & Split Issues > Filing with stock exchanges & depositories',
      'Capital Raising & Securities Issuance: Debt Securities > Drafting & certification for NCDs / bonds issuance',
      'Capital Raising & Securities Issuance: Debt Securities > Listing compliance with SEBI (ILDS) Regulations',
      'Capital Raising & Securities Issuance: Debt Securities > Due diligence certificate for debt listing',

      // Corporate Governance & Listing Advisory
      'Corporate Governance & Listing Advisory > Drafting of Listing Agreement / LODR compliance manual',
      'Corporate Governance & Listing Advisory > Advising on corporate governance best practices',
      'Corporate Governance & Listing Advisory > Regular health check of SEBI & exchange compliance',
      'Corporate Governance & Listing Advisory > Drafting policies: Whistleblower, Risk Management, CSR, etc.',
      'Corporate Governance & Listing Advisory > Liaising with SEBI, NSE, BSE, and other exchanges',

      // Depositories & Registrar Compliance
      'Depositories & Registrar Compliance (NSDL/CDSL) > Compliance for Dematerialisation & Rematerialisation of securities',
      'Depositories & Registrar Compliance (NSDL/CDSL) > Certification of reconciliation of share capital audit report',
      'Depositories & Registrar Compliance (NSDL/CDSL) > Ensuring corporate action compliances with depositories',
      'Depositories & Registrar Compliance (NSDL/CDSL) > Due diligence for transfer agents & share registry',

      // Certifications & Reporting
      'Certifications & Reporting > Secretarial Audit for listed & large companies (under Companies Act + SEBI circulars)',
      'Certifications & Reporting > Annual Secretarial Compliance Report (SEBI-mandated for listed cos.)',
      'Certifications & Reporting > PCS certification for share transfer, allotment, buyback, etc.',
      'Certifications & Reporting > Due diligence certificates for capital raising',

      // Advisory & Representation
      'Advisory & Representation > Advisory on SEBI regulations for corporates, promoters, and investors',
      'Advisory & Representation > Representation before SEBI / Stock Exchanges for clarifications, approvals, and disputes',
      'Advisory & Representation > Assisting in compounding, consent applications, and adjudication proceedings'
    ]
  },
  {
    name: 'FEMA & RBI Compliance',
    subcategories: [
      // Inbound Investment (FDI)
      'Inbound Investment (FDI): Advisory & Structuring > Advising on sectoral caps, entry routes (Automatic vs. Approval route)',
      'Inbound Investment (FDI): Advisory & Structuring > Drafting and reviewing shareholder agreements, JV agreements, investment agreements',
      'Inbound Investment (FDI): Regulatory Filings > Filing of FC-GPR for issue of shares',
      'Inbound Investment (FDI): Regulatory Filings > Filing of FC-TRS for transfer of shares',
      'Inbound Investment (FDI): Regulatory Filings > Filing of LLP(I) and LLP(II) forms for foreign investment in LLPs',
      'Inbound Investment (FDI): Regulatory Filings > Filing of ARF (Advance Reporting Form)',
      'Inbound Investment (FDI): Reporting & Compliance > Single Master Form (SMF) compliance',
      'Inbound Investment (FDI): Reporting & Compliance > Annual Return on Foreign Liabilities and Assets (FLA)',
      'Inbound Investment (FDI): Reporting & Compliance > Downstream investment reporting',
      'Inbound Investment (FDI): Reporting & Compliance > Pricing guidelines compliance for issue/transfer of shares',

      // Outbound Investment (ODI)
      'Outbound Investment (ODI): Advisory & Structuring > Advising on permitted structures for ODI (equity, debt, JV, WOS)',
      'Outbound Investment (ODI): Advisory & Structuring > Ensuring compliance with automatic/approval route norms',
      'Outbound Investment (ODI): Regulatory Filings > Filing of ODI Part I & Part II',
      'Outbound Investment (ODI): Regulatory Filings > Filing of Annual Performance Report (APR)',
      'Outbound Investment (ODI): Regulatory Filings > Reporting of disinvestment / restructuring',
      'Outbound Investment (ODI): Monitoring & Compliance > End-use monitoring of funds',
      'Outbound Investment (ODI): Monitoring & Compliance > Compliance with financial commitment limits',
      'Outbound Investment (ODI): Monitoring & Compliance > Ensuring proper reporting of guarantees / pledges / charges',

      // External Commercial Borrowings (ECB)
      'External Commercial Borrowings (ECB): Advisory & Structuring > Eligibility check for borrower and lender',
      'External Commercial Borrowings (ECB): Advisory & Structuring > Advising on all-in-cost ceiling, maturity, and end-use restrictions',
      'External Commercial Borrowings (ECB): Regulatory Filings > Filing of ECB Loan Registration Number (LRN)',
      'External Commercial Borrowings (ECB): Regulatory Filings > Monthly ECB-2 Return filings',
      'External Commercial Borrowings (ECB): Monitoring & Compliance > Compliance with hedging requirements',
      'External Commercial Borrowings (ECB): Monitoring & Compliance > Reporting of changes in terms & conditions',
      'External Commercial Borrowings (ECB): Monitoring & Compliance > Reporting of prepayment or refinancing',

      // Overseas Remittances (LRS & Others)
      'Overseas Remittances (LRS & Others): Advisory & Structuring > Remittance under Liberalized Remittance Scheme (LRS) – investment, education, medical',
      'Overseas Remittances (LRS & Others): Advisory & Structuring > Advisory on gifts, donations, and permissible current account transactions',
      'Overseas Remittances (LRS & Others): Regulatory Filings > Form A2 for outward remittances',
      'Overseas Remittances (LRS & Others): Regulatory Filings > Supporting documentation compliance (invoices, agreements, etc.)',
      'Overseas Remittances (LRS & Others): Monitoring & Compliance > Compliance with limits (USD 250,000 per year)',
      'Overseas Remittances (LRS & Others): Monitoring & Compliance > End-use monitoring for investment remittances',

      // Compounding & Penalty Matters
      'Compounding & Penalty Matters: Advisory > Identifying non-compliances under FEMA',
      'Compounding & Penalty Matters: Advisory > Advisory on whether compounding vs. adjudication is applicable',
      'Compounding & Penalty Matters: Representation > Filing compounding application with RBI',
      'Compounding & Penalty Matters: Representation > Drafting replies and representation before RBI',
      'Compounding & Penalty Matters: Representation > Liaising with RBI till order passed',

      // Banking & NBFC Related FEMA/RBI Compliance
      'Banking & NBFC Related FEMA/RBI Compliance: For NBFCs > Registration and licensing support with RBI',
      'Banking & NBFC Related FEMA/RBI Compliance: For NBFCs > FEMA compliance for foreign shareholding in NBFCs',
      'Banking & NBFC Related FEMA/RBI Compliance: For NBFCs > Returns and filings specific to NBFCs (NBS returns, etc.)',
      'Banking & NBFC Related FEMA/RBI Compliance: For Banks / AD Category Entities > Compliance checks for Authorised Dealer (AD) banks',
      'Banking & NBFC Related FEMA/RBI Compliance: For Banks / AD Category Entities > Support for reporting to RBI (XBRL filings, sectoral returns)',
      'Banking & NBFC Related FEMA/RBI Compliance: For Banks / AD Category Entities > Assistance in drafting and updating internal FEMA compliance manuals',

      // Cross-Border Mergers & Business Restructuring
      'Cross-Border Mergers & Business Restructuring: Advisory > FEMA compliance for inbound/outbound mergers',
      'Cross-Border Mergers & Business Restructuring: Advisory > Sectoral and approval route analysis',
      'Cross-Border Mergers & Business Restructuring: Filings & Representation > Intimations to RBI for cross-border mergers',
      'Cross-Border Mergers & Business Restructuring: Filings & Representation > Share valuation and pricing compliance',
      'Cross-Border Mergers & Business Restructuring: Filings & Representation > Ensuring compliance with Foreign Exchange Management (Cross Border Merger) Regulations',

      // Ongoing & Annual FEMA/RBI Reporting
      'Ongoing & Annual FEMA/RBI Reporting > Annual FLA Return filing',
      'Ongoing & Annual FEMA/RBI Reporting > Annual ODI Performance Report',
      'Ongoing & Annual FEMA/RBI Reporting > Annual reporting by LLPs receiving foreign investment',
      'Ongoing & Annual FEMA/RBI Reporting > Certification of statutory filings under FEMA',
      'Ongoing & Annual FEMA/RBI Reporting > Compliance review & audit of FEMA records'
    ]
  },
  {
    name: 'Mergers, Acquisitions & Restructuring',
    subcategories: [
      // Mergers & Amalgamations
      'Mergers & Amalgamations > Drafting Scheme of Merger/Amalgamation (u/s 230-232, Companies Act)',
      'Mergers & Amalgamations > Filing applications/petitions with NCLT',
      'Mergers & Amalgamations > Obtaining approval from shareholders, creditors, regulators',
      'Mergers & Amalgamations > Drafting notices, explanatory statements, affidavits',
      'Mergers & Amalgamations > Filing forms with MCA (MGT-7, AOC-4, INC-28, etc.)',
      'Mergers & Amalgamations > Drafting & filing with Regional Director / Registrar of Companies',
      'Mergers & Amalgamations > Valuation coordination with Registered Valuers',
      'Mergers & Amalgamations > SEBI compliances (if listed company merger) – stock exchange intimation, LODR, fairness opinion',
      'Mergers & Amalgamations > Drafting & vetting share exchange ratio agreements',
      'Mergers & Amalgamations > Advising on accounting treatment of merger',
      'Mergers & Amalgamations > Post-merger integration compliances (change of name, capital structure, MOA/AOA amendments, etc.)',

      // Demerger / Spin-off / Slump Sale
      'Demerger / Spin-off / Slump Sale > Drafting Scheme of Arrangement for Demerger',
      'Demerger / Spin-off / Slump Sale > Filing applications with NCLT',
      'Demerger / Spin-off / Slump Sale > Filing with stock exchanges for listed companies',
      'Demerger / Spin-off / Slump Sale > Preparation of information memorandum for stakeholders',
      'Demerger / Spin-off / Slump Sale > RBI/FEMA approvals for cross-border demergers',
      'Demerger / Spin-off / Slump Sale > Drafting slump sale agreements (undertaking transfer)',
      'Demerger / Spin-off / Slump Sale > Ensuring compliance with Income Tax Act (Sec 2(19AA))',
      'Demerger / Spin-off / Slump Sale > Filing forms with ROC & MCA (INC-28, MGT-7, AOC-4, PAS-3)',
      'Demerger / Spin-off / Slump Sale > Drafting & implementing shareholding restructuring',

      // Acquisitions (Takeovers & Buyouts)
      'Acquisitions (Takeovers & Buyouts) > Conducting legal due diligence',
      'Acquisitions (Takeovers & Buyouts) > Drafting & vetting Share Purchase Agreements (SPA)',
      'Acquisitions (Takeovers & Buyouts) > Drafting & vetting Shareholders’ Agreements (SHA)',
      'Acquisitions (Takeovers & Buyouts) > Compliance with SEBI Takeover Code (for listed companies)',
      'Acquisitions (Takeovers & Buyouts) > Open Offer filings & public announcements (for listed acquisitions)',
      'Acquisitions (Takeovers & Buyouts) > Filing with RBI for FDI-related acquisitions',
      'Acquisitions (Takeovers & Buyouts) > Drafting share transfer deeds, filing SH-4/SH-7',
      'Acquisitions (Takeovers & Buyouts) > Assisting in board/shareholder approvals for acquisition',
      'Acquisitions (Takeovers & Buyouts) > Drafting non-compete, non-disclosure agreements',
      'Acquisitions (Takeovers & Buyouts) > Advisory on structuring buyouts (leveraged buyouts, management buyouts)',

      // Joint Ventures & Strategic Alliances
      'Joint Ventures & Strategic Alliances > Drafting Joint Venture Agreements (JVA)',
      'Joint Ventures & Strategic Alliances > Drafting Technical Collaboration / Technology Transfer Agreements',
      'Joint Ventures & Strategic Alliances > Filing with ROC & MCA for new JV entity',
      'Joint Ventures & Strategic Alliances > FEMA compliance for foreign JV partner investment',
      'Joint Ventures & Strategic Alliances > Vetting terms for profit sharing, management rights, exit clauses',
      'Joint Ventures & Strategic Alliances > Filing with RBI for cross-border alliances',
      'Joint Ventures & Strategic Alliances > Drafting & filing necessary corporate resolutions',
      'Joint Ventures & Strategic Alliances > Assisting with board composition & governance in JV',

      // Corporate Restructuring (Internal)
      'Corporate Restructuring (Internal) > Capital Reduction (Sec 66) – drafting petitions, filing with NCLT',
      'Corporate Restructuring (Internal) > Buy-back of shares – drafting board & shareholder resolutions, filings (SH-8, SH-9, SH-11)',
      'Corporate Restructuring (Internal) > Alteration of Share Capital – subdivision, consolidation, conversion of shares',
      'Corporate Restructuring (Internal) > Conversion of preference shares/debentures into equity',
      'Corporate Restructuring (Internal) > Alteration of MOA & AOA in restructuring',
      'Corporate Restructuring (Internal) > Drafting & filing for reorganisation of group companies',
      'Corporate Restructuring (Internal) > Drafting ESOP / Sweat Equity schemes as part of restructuring',
      'Corporate Restructuring (Internal) > Drafting agreements for inter-se transfer among promoters',

      // Cross-Border Mergers & Acquisitions
      'Cross-Border Mergers & Acquisitions > Drafting & filing applications under Companies (Compromises, Arrangements and Amalgamations) Rules, 2016',
      'Cross-Border Mergers & Acquisitions > FEMA & RBI compliance for cross-border M&A',
      'Cross-Border Mergers & Acquisitions > Coordination with foreign regulators / authorities',
      'Cross-Border Mergers & Acquisitions > Drafting valuation & swap agreements in cross-border transactions',
      'Cross-Border Mergers & Acquisitions > Filing FCGPR, FCTRS, ODI forms with RBI',
      'Cross-Border Mergers & Acquisitions > SEBI & stock exchange filings for cross-border listed companies',
      'Cross-Border Mergers & Acquisitions > Drafting schemes for inbound & outbound mergers (Section 234, Companies Act)',

      // Regulatory Approvals & Representations
      'Regulatory Approvals & Representations > Representation before: NCLT (for merger/demerger/arrangement approval)',
      'Regulatory Approvals & Representations > Representation before: SEBI (for takeover/open offer/delisting)',
      'Regulatory Approvals & Representations > Representation before: Stock Exchanges (LODR compliance)',
      'Regulatory Approvals & Representations > Representation before: RBI (for cross-border approvals)',
      'Regulatory Approvals & Representations > Representation before: Competition Commission of India (for M&A approval under CCI Act)',
      'Regulatory Approvals & Representations > Representation before: Income Tax authorities (tax neutrality certification)',
      'Regulatory Approvals & Representations > Obtaining No-Objection Certificates from regulators/creditors',
      'Regulatory Approvals & Representations > Handling public notices & newspaper publications',

      // Due Diligence & Advisory
      'Due Diligence & Advisory > Legal due diligence (corporate, secretarial, litigation)',
      'Due Diligence & Advisory > Regulatory compliance due diligence (SEBI, FEMA, RBI, MCA)',
      'Due Diligence & Advisory > Drafting due diligence reports & compliance checklists',
      'Due Diligence & Advisory > Secretarial audit of target company',
      'Due Diligence & Advisory > Advising on structuring of transaction (tax, FEMA, Companies Act)',
      'Due Diligence & Advisory > Vetting competition law aspects (merger thresholds under CCI)',
      'Due Diligence & Advisory > Advisory on delisting in M&A context',

      // Post-Transaction Compliances
      'Post-Transaction Compliances > Filing with ROC (INC-28, SH-7, PAS-3, etc.)',
      'Post-Transaction Compliances > Updating Register of Members & beneficial ownership',
      'Post-Transaction Compliances > Filing with stock exchanges (LODR disclosure, shareholding pattern)',
      'Post-Transaction Compliances > Intimation to depositories (NSDL/CDSL) for corporate action',
      'Post-Transaction Compliances > Amendment of MOA/AOA post scheme approval',
      'Post-Transaction Compliances > Transfer of licenses, registrations & contracts to merged entity',
      'Post-Transaction Compliances > Post-merger restructuring of board & committees',
      'Post-Transaction Compliances > Updating agreements with vendors, banks, regulators',
      'Post-Transaction Compliances > Ensuring continuity of compliance in new entity'
    ]
  },
  {
    name: 'Taxation & Labour Laws (Limited Role)',
    subcategories: [
      // Direct Tax – Corporate Income Tax Compliance
      'Direct Tax: Corporate Income Tax Compliance > Assisting in obtaining PAN, TAN registrations',
      'Direct Tax: Corporate Income Tax Compliance > Coordination with tax consultants for filing ITRs of companies/LLPs',
      'Direct Tax: Corporate Income Tax Compliance > Maintaining tax compliance calendars for corporates',
      'Direct Tax: Corporate Income Tax Compliance > Support in advance tax, TDS, and withholding tax obligations',
      'Direct Tax: Corporate Income Tax Compliance > Compilation & submission of tax records for statutory audits',

      // Direct Tax – TDS/TCS Compliances
      'Direct Tax: TDS/TCS Compliances > Assistance in deduction & deposit of TDS/TCS on various payments',
      'Direct Tax: TDS/TCS Compliances > Preparation & filing of quarterly TDS returns (Form 24Q, 26Q, 27Q, etc.)',
      'Direct Tax: TDS/TCS Compliances > Generating and reconciling Form 16/16A for employees/vendors',
      'Direct Tax: TDS/TCS Compliances > TDS default rectifications and compliance corrections',

      // Direct Tax – Tax Planning Support
      'Direct Tax: Tax Planning Support (Advisory Role) > Guidance on structuring transactions to be tax-efficient (in consultation with CAs/Tax advisors)',
      'Direct Tax: Tax Planning Support (Advisory Role) > Advising corporates on applicability of MAT/DDT (legacy)',
      'Direct Tax: Tax Planning Support (Advisory Role) > Advisory on inter-corporate loans, remuneration, and related party taxation',

      // Indirect Tax (GST, VAT Legacy)
      'Indirect Tax (GST, VAT Legacy): GST Registration & Structuring > Obtaining GST registration for businesses',
      'Indirect Tax (GST, VAT Legacy): GST Registration & Structuring > Advising on place of supply, composition vs. regular scheme, multi-state registration',
      'Indirect Tax (GST, VAT Legacy): GST Registration & Structuring > Amendment, cancellation, and surrender of GST registrations',
      'Indirect Tax (GST, VAT Legacy): GST Compliance > Maintaining GST compliance calendar',
      'Indirect Tax (GST, VAT Legacy): GST Compliance > Assistance in filing GSTR-1, GSTR-3B, GSTR-9/9C (with CA support)',
      'Indirect Tax (GST, VAT Legacy): GST Compliance > Input Tax Credit (ITC) reconciliation support',
      'Indirect Tax (GST, VAT Legacy): GST Compliance > Advisory on Reverse Charge Mechanism (RCM) compliance',
      'Indirect Tax (GST, VAT Legacy): GST Compliance > Support in e-invoicing implementation and compliance',
      'Indirect Tax (GST, VAT Legacy): Representation Support > Drafting replies to GST notices, show cause notices (with tax lawyers)',
      'Indirect Tax (GST, VAT Legacy): Representation Support > Coordinating GST audit requirements with statutory auditors',
      'Indirect Tax (GST, VAT Legacy): Representation Support > Filing refund applications for excess GST/ITC accumulation',
      'Indirect Tax (GST, VAT Legacy): Legacy & Transition > Support in Service Tax / VAT transition matters (if pending litigation exists)',
      'Indirect Tax (GST, VAT Legacy): Legacy & Transition > Documentation for past indirect tax assessments',

      // Labour Laws & Employment Compliance
      'Labour Laws & Employment Compliance: Registrations & Licensing > PF, ESI, Professional Tax, Labour Welfare Fund registrations',
      'Labour Laws & Employment Compliance: Registrations & Licensing > Shops & Establishment Act registration and renewals',
      'Labour Laws & Employment Compliance: Registrations & Licensing > Contract Labour (Regulation & Abolition) Act registration and licensing support',
      'Labour Laws & Employment Compliance: Periodic Compliances > Assistance in filing PF returns (Form 3A, 6A, monthly ECR filing)',
      'Labour Laws & Employment Compliance: Periodic Compliances > Filing ESI returns and employee records maintenance',
      'Labour Laws & Employment Compliance: Periodic Compliances > Maintenance of statutory registers (muster rolls, wage registers, overtime, gratuity, etc.)',
      'Labour Laws & Employment Compliance: Periodic Compliances > Filing Labour Welfare Fund contributions',
      'Labour Laws & Employment Compliance: Periodic Compliances > Compliance under Payment of Bonus, Payment of Gratuity, Minimum Wages, Equal Remuneration Act',
      'Labour Laws & Employment Compliance: Advisory & Audit > Labour law audit (compliance health check-up) for companies',
      'Labour Laws & Employment Compliance: Advisory & Audit > Advisory on applicability of new labour codes (once implemented)',
      'Labour Laws & Employment Compliance: Advisory & Audit > Assisting in inspections under PF, ESI, and labour laws',

      // ESOP, Bonus & Compensation
      'Employee Stock Options, Bonus & Compensation > Structuring ESOP, Sweat Equity, Bonus share schemes from tax & labour perspective',
      'Employee Stock Options, Bonus & Compensation > Compliance under Payment of Bonus Act & Payment of Gratuity Act',
      'Employee Stock Options, Bonus & Compensation > Tax deduction & TDS compliances for salaries, perquisites, stock options',

      // Representation & Liaison
      'Representation & Liaison > Preparing replies to IT/GST/Labour law notices (with CAs/Advocates)',
      'Representation & Liaison > Representing corporates before Assessing Officers/Inspectors for preliminary hearings',
      'Representation & Liaison > Liaising with Income Tax Department, GST authorities, PF/ESI offices for procedural matters',

      // Advisory & Corporate Structuring Support
      'Advisory & Corporate Structuring Support > Tax & Labour law due diligence during mergers, acquisitions, restructuring',
      'Advisory & Corporate Structuring Support > Advisory on expatriate taxation & labour law compliances (with tax advisors)',
      'Advisory & Corporate Structuring Support > Cross-border tax & labour compliances (RBI/FEMA + Taxation integration)',
      'Advisory & Corporate Structuring Support > Advisory on payroll structuring for tax optimization',

      // Miscellaneous/Support Roles
      'Miscellaneous/Support Roles > Maintaining compliance dashboards for corporates (Tax + Labour laws)',
      'Miscellaneous/Support Roles > Offering corporate compliance certifications (as per Company Law, where linked to taxation/labour aspects)',
      'Miscellaneous/Support Roles > Assisting in technology-driven compliance (TDS/GST software integration, payroll systems compliance mapping)'
    ]
  },
  {
    name: 'Intellectual Property Support',
    subcategories: [
      // Trademark Support Services
      'Trademark Support Services: Advisory & Strategy > Guidance on selection of distinctive names, logos, and brand identity',
      'Trademark Support Services: Advisory & Strategy > Advising on trademark classes under NICE classification',
      'Trademark Support Services: Advisory & Strategy > Brand protection strategies for businesses',
      'Trademark Support Services: Search & Due Diligence > Conducting preliminary trademark search',
      'Trademark Support Services: Search & Due Diligence > Identifying conflicts with existing marks',
      'Trademark Support Services: Search & Due Diligence > Advisory on registrability & risk analysis',
      'Trademark Support Services: Application & Registration Support > Preparation & filing of trademark applications (with trademark agents)',
      'Trademark Support Services: Application & Registration Support > Drafting supporting documents and affidavits',
      'Trademark Support Services: Application & Registration Support > Monitoring status and responding to clarifications',
      'Trademark Support Services: Post-Registration Compliance > Renewal filings & maintenance',
      'Trademark Support Services: Post-Registration Compliance > Recordal of changes (name, address, ownership)',
      'Trademark Support Services: Post-Registration Compliance > Watch services for infringement monitoring',
      'Trademark Support Services: Litigation & Dispute Support (Non-representational) > Drafting notices/oppositions/counter statements (with lawyers)',
      'Trademark Support Services: Litigation & Dispute Support (Non-representational) > Advisory on settlement/assignment/licensing',

      // Copyright Support Services
      'Copyright Support Services: Advisory > Guidance on copyrightable works (literary, artistic, software, etc.)',
      'Copyright Support Services: Advisory > Advice on ownership, joint works, and moral rights',
      'Copyright Support Services: Search & Due Diligence > Checking copyright databases for existing works',
      'Copyright Support Services: Search & Due Diligence > Advising on originality & infringement risks',
      'Copyright Support Services: Application & Registration Support > Preparation and filing of copyright applications',
      'Copyright Support Services: Application & Registration Support > Drafting forms, affidavits, and supporting documents',
      'Copyright Support Services: Application & Registration Support > Coordinating with Copyright Office for queries',
      'Copyright Support Services: Post-Registration > Renewal, correction, or recordal of assignments/licenses',
      'Copyright Support Services: Post-Registration > Monitoring infringement risks',

      // Patent Support Services
      'Patent Support Services: Advisory > Guidance on patentability basics & process overview',
      'Patent Support Services: Advisory > IP strategy in business structuring (when to patent vs. trade secret)',
      'Patent Support Services: Search & Due Diligence > Facilitating prior art searches with patent agents',
      'Patent Support Services: Search & Due Diligence > Advisory on freedom-to-operate studies',
      'Patent Support Services: Application & Registration Support > Assistance in filing forms & documents with patent agents',
      'Patent Support Services: Application & Registration Support > Coordinating with R&D and attorneys for drafting',
      'Patent Support Services: Post-Registration > Renewal management',
      'Patent Support Services: Post-Registration > Assignments, licenses, and recordal support',

      // Industrial Designs & GI
      'Industrial Designs & Geographical Indications (GI) Support: Advisory > Explaining scope of protection under Designs Act & GI Act',
      'Industrial Designs & Geographical Indications (GI) Support: Advisory > Advising on registrability of product shapes, patterns, packaging',
      'Industrial Designs & Geographical Indications (GI) Support: Search & Due Diligence > Coordinating design/ GI searches',
      'Industrial Designs & Geographical Indications (GI) Support: Search & Due Diligence > Verification of originality and existing registrations',
      'Industrial Designs & Geographical Indications (GI) Support: Application & Registration Support > Filing design/ GI applications',
      'Industrial Designs & Geographical Indications (GI) Support: Application & Registration Support > Documentation and liaison with Design Wing/ GI Registry',
      'Industrial Designs & Geographical Indications (GI) Support: Post Registration > Renewal and maintenance filings',
      'Industrial Designs & Geographical Indications (GI) Support: Post Registration > Recordal of changes/assignments',

      // IP Due Diligence & Transaction Support
      'IP Due Diligence & Transaction Support > IP audit for companies during M&A or restructuring',
      'IP Due Diligence & Transaction Support > Verification of IP ownership before investment/funding',
      'IP Due Diligence & Transaction Support > Checking IP compliance before IPO or listing',
      'IP Due Diligence & Transaction Support > Drafting/ reviewing IP assignment and licensing agreements',

      // IP Compliance & Secretarial Integration
      'IP Compliance & Secretarial Integration > Recording IP as intangible assets in company registers',
      'IP Compliance & Secretarial Integration > Board/ shareholder resolutions for assignment or licensing',
      'IP Compliance & Secretarial Integration > Maintaining statutory records of IP in registers',
      'IP Compliance & Secretarial Integration > Assistance in valuation, reporting, and disclosure of IP in financial/secretarial filings',

      // Liaison & Representation Support
      'Liaison & Representation Support > Coordinating with: Trademark/Patent/Copyright offices',
      'Liaison & Representation Support > Coordinating with: SEBI/Stock Exchanges for IP-related disclosures',
      'Liaison & Representation Support > Coordinating with: RBI/FEMA authorities in case of foreign IP transactions',
      'Liaison & Representation Support > Supporting advocates/agents in litigation or opposition cases',

      // IP Awareness & Strategy Advisory
      'IP Awareness & Strategy Advisory > Conducting IP awareness sessions for employees',
      'IP Awareness & Strategy Advisory > Advisory on trade secret protection policies',
      'IP Awareness & Strategy Advisory > Internal IP policy drafting for corporates',
      'IP Awareness & Strategy Advisory > Strategy for international filings (Madrid Protocol, PCT, Hague system) with agents'
    ]
  },
  {
    name: 'Other Professional Services',
    subcategories: [
      // Startup Advisory – Entity Selection & Incorporation
      'Startup Advisory: Entity Selection & Incorporation > Advising on entity structure (Pvt Ltd, LLP, OPC, Section 8 Co.)',
      'Startup Advisory: Entity Selection & Incorporation > Name approval & reservation (RUN, SPICe+)',
      'Startup Advisory: Entity Selection & Incorporation > Drafting MOA & AOA',
      'Startup Advisory: Entity Selection & Incorporation > Incorporation filings with MCA',

      // Startup Advisory – Funding & Capital Structuring
      'Startup Advisory: Funding & Capital Structuring > Shareholding pattern advisory',
      'Startup Advisory: Funding & Capital Structuring > Drafting term sheets',
      'Startup Advisory: Funding & Capital Structuring > Preparing pitch deck compliance checks',
      'Startup Advisory: Funding & Capital Structuring > Private placement compliances',

      // Startup Advisory – Post-Incorporation Compliances
      'Startup Advisory: Post-Incorporation Compliances > Commencement of business filings',
      'Startup Advisory: Post-Incorporation Compliances > Maintaining statutory registers',
      'Startup Advisory: Post-Incorporation Compliances > Issuance of share certificates',
      'Startup Advisory: Post-Incorporation Compliances > Filing annual returns (MGT-7, AOC-4)',

      // ESOP Structuring
      'ESOP Structuring: Policy & Plan Creation > Drafting ESOP Policy',
      'ESOP Structuring: Policy & Plan Creation > Designing vesting & exercise schedules',
      'ESOP Structuring: Policy & Plan Creation > Structuring tax-efficient ESOPs',
      'ESOP Structuring: Approvals & Documentation > Drafting Board & Shareholder Resolutions',
      'ESOP Structuring: Approvals & Documentation > Preparation of ESOP Trust Deed (if trust route)',
      'ESOP Structuring: Approvals & Documentation > Filing required returns with MCA',
      'ESOP Structuring: Implementation & Monitoring > Grant letters & option agreements',
      'ESOP Structuring: Implementation & Monitoring > Maintaining ESOP Register',
      'ESOP Structuring: Implementation & Monitoring > Ongoing compliance and disclosures',
      'ESOP Structuring: Exit & Exercise Assistance > Guidance on ESOP buyback / exercise',
      'ESOP Structuring: Exit & Exercise Assistance > Compliance with Income Tax implications',

      // Investment Agreements (SHA, SSA, etc.)
      'Investment Agreements: Drafting & Negotiation Support > Shareholders Agreement (SHA)',
      'Investment Agreements: Drafting & Negotiation Support > Share Subscription Agreement (SSA)',
      'Investment Agreements: Drafting & Negotiation Support > Share Purchase Agreement (SPA)',
      'Investment Agreements: Drafting & Negotiation Support > Convertible Notes / CCD Agreements',
      'Investment Agreements: Due Diligence Support > Secretarial due diligence for investors',
      'Investment Agreements: Due Diligence Support > Statutory records verification',
      'Investment Agreements: Due Diligence Support > Cap table verification',
      'Investment Agreements: Post-Agreement Compliances > Allotment of shares / debentures',
      'Investment Agreements: Post-Agreement Compliances > Filing PAS-3, MGT-14, etc.',
      'Investment Agreements: Post-Agreement Compliances > Updating Register of Members / Debenture holders',

      // Corporate Social Responsibility (CSR)
      'Corporate Social Responsibility (CSR): CSR Policy Advisory > Drafting CSR Policy',
      'Corporate Social Responsibility (CSR): CSR Policy Advisory > Identifying eligible CSR activities',
      'Corporate Social Responsibility (CSR): CSR Policy Advisory > Advising Board & CSR Committee constitution',
      'Corporate Social Responsibility (CSR): Implementation Support > Drafting MoU with implementing agencies',
      'Corporate Social Responsibility (CSR): Implementation Support > Monitoring CSR spends',
      'Corporate Social Responsibility (CSR): CSR Reporting > Preparation of Annual CSR Report',
      'Corporate Social Responsibility (CSR): CSR Reporting > Filing with MCA (CSR-2)',
      'Corporate Social Responsibility (CSR): CSR Reporting > Assisting in disclosure in Board Report',

      // Certification & Attestation
      'Certification & Attestation: Companies Act Certifications > Certifying Annual Return (MGT-7)',
      'Certification & Attestation: Companies Act Certifications > Certifying e-Forms (PAS-3, SH-7, DIR-12, AOC-4)',
      'Certification & Attestation: Companies Act Certifications > Compliance Certificate under Section 92',
      'Certification & Attestation: FEMA/RBI Certifications > FCGPR, FC-TRS certification',
      'Certification & Attestation: FEMA/RBI Certifications > ODI/ECB returns certification',
      'Certification & Attestation: FEMA/RBI Certifications > Liaison/Branch Office compliances',
      'Certification & Attestation: SEBI Certifications > Compliance certificate under LODR',
      'Certification & Attestation: SEBI Certifications > Certification of shareholding pattern',
      'Certification & Attestation: SEBI Certifications > Capital issue certifications',
      'Certification & Attestation: Miscellaneous Certifications > Net worth certificate',
      'Certification & Attestation: Miscellaneous Certifications > Shareholding certificate',
      'Certification & Attestation: Miscellaneous Certifications > Secretarial Compliance Certificate (Reg. 24A – SEBI LODR)'
    ]
  }
];

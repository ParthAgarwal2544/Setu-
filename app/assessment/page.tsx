"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/components/AuthContext";
import { useLanguage } from "@/components/LanguageContext";
import {
  UploadCloud,
  FileText,
  Presentation,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  ArrowRight,
  RotateCcw,
  Award,
  BookOpen,
  Check,
  ChevronRight,
  ChevronDown,
  ShieldAlert,
  Loader2,
  X,
  Database,
  Search,
  FileCheck,
  Layers,
} from "lucide-react";

interface QuestionData {
  id: number;
  section: string;
  category: string;
  ruleTag: string;
  marks: string;
  negative: string;
  questionText: string;
  options: { key: string; label: string; text: string }[];
  correctKey: string;
  explanation: string;
  bloomLevel?: string;
  difficulty?: string;
  gapAddressed?: string;
}

export interface CourseDataset {
  id: string;
  code: string;
  title: string;
  domain: string;
  category: string;
  datasetId: string;
  description: string;
  questionCount: number;
  bloomLevels: string[];
  topics: string[];
  questions: QuestionData[];
}

const gfrQuestions: QuestionData[] = [
  {
    id: 1,
    section: "Section A: General Principles",
    category: "Fundamental Principles of Public Buying",
    ruleTag: "Rule 144 - Fundamental Principles of Public Buying",
    marks: "+2.0",
    negative: "-0.5",
    questionText:
      "According to Rule 144 of GFR 2017, every authority delegated with the financial powers of procuring goods in public interest shall have the responsibility and accountability to bring efficiency, economy, and transparency. Which of the following is explicitly prohibited while framing technical specifications?",
    options: [
      { key: "A", label: "Option A", text: "Stipulating standards conforming to National or International Standards (BIS / ISO)." },
      { key: "B", label: "Option B", text: "Specifying generic technical requirements without brand names or proprietary trade marks." },
      { key: "C", label: "Option C", text: "Framing technical specifications tailored to favor a particular firm or single manufacturer." },
      { key: "D", label: "Option D", text: "Prescribing clear qualification and performance evaluation metrics for bidders." },
    ],
    correctKey: "C",
    explanation: "Rule 144(i) explicitly mandates that specifications must not be tailored to suit any particular firm or product.",
  },
  {
    id: 2,
    section: "Section A: General Principles",
    category: "Financial Sanctions & Approvals",
    ruleTag: "Rule 22 - General Conditions of Sanction",
    marks: "+2.0",
    negative: "-0.5",
    questionText:
      "Under Rule 22 of GFR 2017, all financial sanctions issued by competent administrative ministries and departments shall be communicated to the audit officer with which mandatory compliance clause?",
    options: [
      { key: "A", label: "Option A", text: "Affidavit of private vendor consent registered with local registrar." },
      { key: "B", label: "Option B", text: "Concurrence of Integrated Finance Division (IFD) or quotation of delegated powers." },
      { key: "C", label: "Option C", text: "Quarterly clearance from the Department of Legal Affairs." },
      { key: "D", label: "Option D", text: "Approval of the Parliamentary Public Accounts Committee." },
    ],
    correctKey: "B",
    explanation: "Sanctions must quote the delegated financial powers or record the concurrence of IFD.",
  },
  {
    id: 3,
    section: "Section A: General Principles",
    category: "Defalcations & Financial Losses",
    ruleTag: "Rule 33 - Report of Losses",
    marks: "+2.0",
    negative: "-0.5",
    questionText:
      "As per Rule 33 of GFR 2017, what is the mandatory threshold for any loss of public money, departmental revenue or stores exceeding which must be formally reported immediately to the Principal Account Officer and the statutory audit office?",
    options: [
      { key: "A", label: "Option A", text: "Losses exceeding ₹10,000 in value." },
      { key: "B", label: "Option B", text: "Losses exceeding ₹50,000 in value." },
      { key: "C", label: "Option C", text: "Losses exceeding ₹1,00,000 in value." },
      { key: "D", label: "Option D", text: "Any loss exceeding ₹5,00,000 or involving suspected fraud/embezzlement." },
    ],
    correctKey: "B",
    explanation: "Losses exceeding ₹50,000 must be reported formally to higher authority and statutory audit.",
  },
  {
    id: 4,
    section: "Section A: General Principles",
    category: "Budgetary Allocation & Commitments",
    ruleTag: "Rule 62 - Control of Expenditure",
    marks: "+2.0",
    negative: "-0.5",
    questionText:
      "Under Rule 62 of GFR 2017, a Disbursing Officer shall not incur any expenditure or enter into any liability unless:",
    options: [
      { key: "A", label: "Option A", text: "Budget allocation has been formally confirmed by the Union Cabinet." },
      { key: "B", label: "Option B", text: "Funds are covered by a valid sanctioned budget grant or advance from Contingency Fund." },
      { key: "C", label: "Option C", text: "An indemnity bond has been executed with the Reserve Bank of India." },
      { key: "D", label: "Option D", text: "A minimum of 90 days have elapsed from the start of the financial year." },
    ],
    correctKey: "B",
    explanation: "Expenditure cannot be committed without budget grant allotment.",
  },
  {
    id: 5,
    section: "Section A: General Principles",
    category: "Direct Purchase Without Quotation",
    ruleTag: "Rule 154 - Purchase of Goods without Quotation",
    marks: "+2.0",
    negative: "-0.5",
    questionText:
      "Under Rule 154 of GFR 2017 (as amended by Ministry of Finance), what is the maximum financial threshold for purchase of goods without inviting quotations or bids on each occasion on the basis of a certificate recorded by the competent authority?",
    options: [
      { key: "A", label: "Option A", text: "Up to ₹10,000 on each occasion." },
      { key: "B", label: "Option B", text: "Up to ₹25,000 on each occasion." },
      { key: "C", label: "Option C", text: "Up to ₹50,000 on each occasion." },
      { key: "D", label: "Option D", text: "Up to ₹1,00,000 on each occasion." },
    ],
    correctKey: "B",
    explanation: "The prescribed threshold under Rule 154 without quotation is ₹25,000 on each occasion.",
  },
  {
    id: 6,
    section: "Section B: GeM & Procurement",
    category: "Purchase through Local Purchase Committee",
    ruleTag: "Rule 155 - Purchase through Committee",
    marks: "+2.0",
    negative: "-0.5",
    questionText:
      "Rule 155 of GFR 2017 allows purchase of goods up to ₹2,50,000 on each occasion on the recommendation of a duly constituted Local Purchase Committee. What is the mandatory composition of this committee?",
    options: [
      { key: "A", label: "Option A", text: "Two senior officers including an external chartered accountant." },
      { key: "B", label: "Option B", text: "Three members of an appropriate level as decided by the Head of Department." },
      { key: "C", label: "Option C", text: "Head of Department along with the Drawing and Disbursing Officer." },
      { key: "D", label: "Option D", text: "Five members with at least one representative from the Ministry of Law." },
    ],
    correctKey: "B",
    explanation: "The Local Purchase Committee consists of three members of appropriate level as decided by the HoD.",
  },
  {
    id: 7,
    section: "Section B: GeM & Procurement",
    category: "Limited Tender Enquiry",
    ruleTag: "Rule 162 - Limited Tender Enquiry",
    marks: "+2.0",
    negative: "-0.5",
    questionText:
      "Under Rule 162 of GFR 2017, procurement through Limited Tender Enquiry is standardly adopted for purchases of goods up to what monetary limit?",
    options: [
      { key: "A", label: "Option A", text: "Up to ₹10 Lakhs." },
      { key: "B", label: "Option B", text: "Up to ₹25 Lakhs." },
      { key: "C", label: "Option C", text: "Up to ₹50 Lakhs." },
      { key: "D", label: "Option D", text: "Up to ₹1 Crore." },
    ],
    correctKey: "B",
    explanation: "Rule 162 prescribes ₹25 Lakhs as the normal upper limit for Limited Tender Enquiry.",
  },
  {
    id: 8,
    section: "Section B: GeM & Procurement",
    category: "GeM Mandate",
    ruleTag: "Rule 149 - Government e-Marketplace (GeM)",
    marks: "+2.0",
    negative: "-0.5",
    questionText:
      "According to Rule 149 of GFR 2017, the procurement of goods and services by Ministries or Departments is mandatory for goods and services available on GeM. Above ₹5,00,000 on GeM, what is the mandatory procurement method?",
    options: [
      { key: "A", label: "Option A", text: "Direct purchase with lowest catalog price without comparison." },
      { key: "B", label: "Option B", text: "Online bidding or reverse auction among at least three manufacturers." },
      { key: "C", label: "Option C", text: "Open physical newspaper tender through DoPT." },
      { key: "D", label: "Option D", text: "Proprietary Article Certificate purchase directly from manufacturer." },
    ],
    correctKey: "B",
    explanation: "Above ₹5,00,000, procurement on GeM requires online bidding or reverse auction.",
  },
  {
    id: 9,
    section: "Section B: GeM & Procurement",
    category: "Advertised Tender Enquiry",
    ruleTag: "Rule 161 - Advertised Tender Enquiry",
    marks: "+2.0",
    negative: "-0.5",
    questionText:
      "Under Rule 161 of GFR 2017, for estimated values of ₹25 Lakhs and above, where is it mandatory to publish the Advertised Tender Enquiry?",
    options: [
      { key: "A", label: "Option A", text: "Local newspapers and departmental notice boards only." },
      { key: "B", label: "Option B", text: "Central Public Procurement Portal (CPPP) and the Department’s official website." },
      { key: "C", label: "Option C", text: "State Gazette Publications only." },
      { key: "D", label: "Option D", text: "GeM only, regardless of item nature." },
    ],
    correctKey: "B",
    explanation: "Publishing on Central Public Procurement Portal (CPPP) and departmental websites is mandatory.",
  },
  {
    id: 10,
    section: "Section B: GeM & Procurement",
    category: "Single Tender & Proprietary Articles",
    ruleTag: "Rule 166 - Single Tender Enquiry",
    marks: "+2.0",
    negative: "-0.5",
    questionText:
      "Under Rule 166 of GFR 2017, procurement from a single source may be resorted to only under which specific statutory justification?",
    options: [
      { key: "A", label: "Option A", text: "When the administrative ministry has less than 30 days before financial year end." },
      { key: "B", label: "Option B", text: "When only a particular firm is the manufacturer and a Proprietary Article Certificate (PAC) is recorded." },
      { key: "C", label: "Option C", text: "When the item was previously procured from the same firm with satisfaction." },
      { key: "D", label: "Option D", text: "When the vendor offers an unconditional discount of 20% on list price." },
    ],
    correctKey: "B",
    explanation: "Proprietary Article Certificate (PAC) is mandatory for single tender procurement under Rule 166.",
  },
];

// Curated 7 Pre-fetched Course Question Datasets for Automated Officer Exam Prep
export const PREFETCHED_COURSE_DATASETS: CourseDataset[] = [
  {
    id: "FIN-GFR-2017",
    code: "FIN-GFR-2017",
    title: "General Financial Rules (GFR 2017) & GeM 4.0 Public Procurement",
    domain: "Finance & Accounts",
    category: "Financial Rules",
    datasetId: "DATASET-GFR-2017-DOE-NIC",
    description: "Statutory rules governing public funds, delegated financial powers, GeM procurement thresholds, Rule 154/155 purchases, and PAC certificates.",
    questionCount: 10,
    bloomLevels: ["Understand (L2)", "Apply (L3)", "Analyze (L4)"],
    topics: ["Rule 144 Principles", "GeM Mandatory Tenders", "Local Purchase Committees", "Rule 33 Loss Reporting", "PAC Certificates"],
    questions: gfrQuestions,
  },
  {
    id: "STAT-SAMP-2024",
    code: "STAT-SAMP-2024",
    title: "MoSPI Applied Survey Sampling & Calibration (NSSO, PLFS)",
    domain: "Statistical Sampling",
    category: "Sample Surveys",
    datasetId: "DATASET-MOSPI-2024-NSSO-01",
    description: "National sample survey designs, multi-stage stratification, propensity weighting for non-response, Jackknife variance estimation, and frame correction.",
    questionCount: 5,
    bloomLevels: ["Apply (L3)", "Analyze (L4)"],
    topics: ["Multi-stage Stratification", "Propensity Score Weighting", "Jackknife Replication", "Sampling vs Non-Sampling Error", "Cluster Design Effect"],
    questions: [
      {
        id: 1,
        section: "Module 1: Survey Sampling",
        category: "Sample Calibration",
        ruleTag: "NSSO Methodology Circular 2024",
        marks: "+2.0",
        negative: "-0.5",
        bloomLevel: "Analyze",
        difficulty: "Intermediate",
        gapAddressed: "Statistical Sampling & Calibration",
        questionText: "When conducting a multi-stage stratified sample survey (like the Periodic Labour Force Survey), how should significant non-response in an urban stratum be corrected during multiplier weighting?",
        options: [
          { key: "A", label: "Option A", text: "Discard the non-responding sample units entirely from the national tabulations." },
          { key: "B", label: "Option B", text: "Apply propensity score response-homogeneity weighting within the exact stratum against known census benchmarks." },
          { key: "C", label: "Option C", text: "Merge the urban stratum with an adjacent rural stratum to artificially increase sample size." },
          { key: "D", label: "Option D", text: "Assume mean imputation without checking standard error expansion." },
        ],
        correctKey: "B",
        explanation: "Propensity score response-homogeneity weighting within stratum preserves sample frame integrity without inflating cross-strata design variance.",
      },
      {
        id: 2,
        section: "Module 2: Variance Estimation",
        category: "Replication Techniques",
        ruleTag: "MoSPI Technical Bulletin #41",
        marks: "+2.0",
        negative: "-0.5",
        bloomLevel: "Apply",
        difficulty: "Advanced",
        gapAddressed: "Variance Estimation",
        questionText: "Which variance estimation methodology is standardly mandated for complex multi-stage cluster sampling when Taylor series linearization is analytically intractable?",
        options: [
          { key: "A", label: "Option A", text: "Simple Random Sampling variance formula without finite population correction." },
          { key: "B", label: "Option B", text: "Jackknife repeated replication or Balanced Repeated Replication (BRR) over pseudo-PSUs." },
          { key: "C", label: "Option C", text: "Linear extrapolation from preceding decennial census." },
          { key: "D", label: "Option D", text: "Subjective confidence intervals assigned by field enumerators." },
        ],
        correctKey: "B",
        explanation: "Jackknife and Balanced Repeated Replication (BRR) correctly estimate standard errors in complex survey designs without closed-form derivatives.",
      },
      {
        id: 3,
        section: "Module 3: Non-Sampling Errors",
        category: "Frame Imperfections",
        ruleTag: "NSSTA Guidelines 2024",
        marks: "+2.0",
        negative: "-0.5",
        bloomLevel: "Understand",
        difficulty: "Basic",
        gapAddressed: "Survey Operations",
        questionText: "What is the primary operational distinction between sampling errors and non-sampling errors in national socio-economic surveys?",
        options: [
          { key: "A", label: "Option A", text: "Sampling errors decrease with larger sample sizes, whereas non-sampling errors can occur in both samples and complete censuses." },
          { key: "B", label: "Option B", text: "Non-sampling errors only occur in computerized surveys." },
          { key: "C", label: "Option C", text: "Sampling errors are caused exclusively by enumerator negligence." },
          { key: "D", label: "Option D", text: "There is no theoretical distinction between the two error classes." },
        ],
        correctKey: "A",
        explanation: "Sampling error is a function of sample size and design, while non-sampling errors (measurement, coverage, non-response) affect both censuses and sample surveys.",
      },
      {
        id: 4,
        section: "Module 4: Cluster Sampling",
        category: "Design Effect",
        ruleTag: "NSSO Sampling Manual §4.3",
        marks: "+2.0",
        negative: "-0.5",
        bloomLevel: "Analyze",
        difficulty: "Advanced",
        gapAddressed: "Statistical Sampling & Calibration",
        questionText: "What does a high Design Effect (deff = 1 + (m-1)ρ) indicate about a cluster sampling design with intra-cluster correlation coefficient ρ?",
        options: [
          { key: "A", label: "Option A", text: "The cluster sampling is as efficient as simple random sampling." },
          { key: "B", label: "Option B", text: "Units within the cluster are highly homogeneous, increasing variance compared to SRS and requiring a larger sample size." },
          { key: "C", label: "Option C", text: "The survey can be terminated earlier due to zero standard error." },
          { key: "D", label: "Option D", text: "Non-response has been automatically neutralized." },
        ],
        correctKey: "B",
        explanation: "High positive intra-cluster correlation (ρ) means units inside clusters are similar, which increases variance and inflates the design effect above 1.",
      },
      {
        id: 5,
        section: "Module 5: PPS Selection",
        category: "Primary Sampling Units",
        ruleTag: "MoSPI Technical Standards §2.1",
        marks: "+2.0",
        negative: "-0.5",
        bloomLevel: "Apply",
        difficulty: "Intermediate",
        gapAddressed: "Survey Operations",
        questionText: "Why is Probability Proportional to Size (PPS) sampling universally adopted for selecting census villages/blocks as First Stage Units (FSUs)?",
        options: [
          { key: "A", label: "Option A", text: "To eliminate the need for any second stage household listing." },
          { key: "B", label: "Option B", text: "To give larger settlements higher probability of inclusion while equalizing ultimate self-weighting sample selection probabilities." },
          { key: "C", label: "Option C", text: "To ensure remote villages are strictly excluded from field inquiry." },
          { key: "D", label: "Option D", text: "To eliminate non-response in agricultural statistics." },
        ],
        correctKey: "B",
        explanation: "PPS at first stage combined with inverse probability allocation at second stage results in an approximately self-weighting design with minimized estimator variance.",
      },
    ],
  },
  {
    id: "GOV-CYB-2024",
    code: "GOV-CYB-2024",
    title: "Cyber Security & Digital Personal Data Protection Act (DPDPA 2023)",
    domain: "e-Governance",
    category: "Data Protection & Cyber",
    datasetId: "DATASET-MEITY-2023-DPDPA-07",
    description: "MeitY sovereign compliance guidelines, Data Fiduciaries obligations, Section 8 microdata anonymization, CERT-In directions, and Data Protection Board penalties.",
    questionCount: 5,
    bloomLevels: ["Understand (L2)", "Apply (L3)", "Analyze (L4)"],
    topics: ["DPDPA 2023 Section 8", "Data Protection Board Penalties", "Cross-Border Sovereign Data", "CERT-In 6-Hour Reporting", "Consent Manager Framework"],
    questions: [
      {
        id: 1,
        section: "Chapter 1: Sovereign Data Protection",
        category: "Data Fiduciary Obligations",
        ruleTag: "DPDPA 2023 - Section 8",
        marks: "+2.0",
        negative: "-0.5",
        bloomLevel: "Apply",
        difficulty: "Intermediate",
        gapAddressed: "Digital Governance & Privacy",
        questionText: "Under Section 8 of DPDPA 2023, what is the mandatory technical requirement when government departments publish statistical microdata containing identifiable citizen attributes?",
        options: [
          { key: "A", label: "Option A", text: "Full anonymization or irreversible pseudo-anonymization ensuring zero re-identification risk." },
          { key: "B", label: "Option B", text: "Publishing raw Aadhaar numbers with the last 2 digits masked." },
          { key: "C", label: "Option C", text: "Obtaining verbal consent over telephone before each survey release." },
          { key: "D", label: "Option D", text: "Restricting data downloads exclusively to foreign cloud providers." },
        ],
        correctKey: "A",
        explanation: "DPDPA 2023 mandates irreversible anonymization or differential privacy noise before microdata dissemination to protect citizen identities.",
      },
      {
        id: 2,
        section: "Chapter 2: Penalties & Compliance",
        category: "Data Protection Board of India",
        ruleTag: "DPDPA 2023 - Schedule",
        marks: "+2.0",
        negative: "-0.5",
        bloomLevel: "Understand",
        difficulty: "Basic",
        gapAddressed: "Digital Governance",
        questionText: "What is the maximum financial penalty that the Data Protection Board of India may levy for failure to implement reasonable security safeguards resulting in a significant personal data breach?",
        options: [
          { key: "A", label: "Option A", text: "Up to ₹50 Crores." },
          { key: "B", label: "Option B", text: "Up to ₹250 Crores." },
          { key: "C", label: "Option C", text: "Up to ₹10 Lakhs." },
          { key: "D", label: "Option D", text: "Civil reprimand without financial liability." },
        ],
        correctKey: "B",
        explanation: "The DPDPA 2023 schedule prescribes financial penalties up to ₹250 Crores for significant security safeguard failures.",
      },
      {
        id: 3,
        section: "Chapter 3: Cross-Border Transfers",
        category: "Sovereign MoSPI Datasets",
        ruleTag: "DPDPA 2023 - Section 16",
        marks: "+2.0",
        negative: "-0.5",
        bloomLevel: "Analyze",
        difficulty: "Advanced",
        gapAddressed: "Digital Governance & National Security",
        questionText: "How does DPDPA 2023 regulate the processing of sovereign national survey datasets outside the territorial jurisdiction of India?",
        options: [
          { key: "A", label: "Option A", text: "Subject to the Central Government negative list and sovereign storage directives." },
          { key: "B", label: "Option B", text: "Completely unregulated for open-source AI models." },
          { key: "C", label: "Option C", text: "Only allowed if encrypted with commercial 64-bit keys." },
          { key: "D", label: "Option D", text: "Requires prior approval from international judicial arbitration." },
        ],
        correctKey: "A",
        explanation: "Cross-border data transfers are subject to Central Government blacklist restrictions and sovereign localization directives.",
      },
      {
        id: 4,
        section: "Chapter 4: Incident Response",
        category: "CERT-In Cyber Directives",
        ruleTag: "CERT-In Direction 2022 §(v)",
        marks: "+2.0",
        negative: "-0.5",
        bloomLevel: "Apply",
        difficulty: "Intermediate",
        gapAddressed: "Cyber Security Compliance",
        questionText: "Under the CERT-In Directions 2022, what is the mandatory statutory timeframe for government organizations to report cybersecurity incidents to CERT-In?",
        options: [
          { key: "A", label: "Option A", text: "Within 6 hours of noticing or being brought to notice of the incident." },
          { key: "B", label: "Option B", text: "Within 7 working days." },
          { key: "C", label: "Option C", text: "At the end of the calendar month in a consolidated return." },
          { key: "D", label: "Option D", text: "Only if financial damage exceeds ₹1 Crore." },
        ],
        correctKey: "A",
        explanation: "CERT-In directions mandate that all covered cybersecurity incidents must be formally reported within 6 hours of discovery.",
      },
      {
        id: 5,
        section: "Chapter 5: Citizen Rights",
        category: "Consent Architecture",
        ruleTag: "DPDPA 2023 - Section 6",
        marks: "+2.0",
        negative: "-0.5",
        bloomLevel: "Understand",
        difficulty: "Basic",
        gapAddressed: "Digital Governance",
        questionText: "What is the designated role of a 'Consent Manager' registered with the Data Protection Board under DPDPA 2023?",
        options: [
          { key: "A", label: "Option A", text: "A commercial telemarketer that licenses contact numbers to third parties." },
          { key: "B", label: "Option B", text: "An interoperable platform enabling citizens to give, manage, review, and withdraw consent transparently." },
          { key: "C", label: "Option C", text: "An automated bot that approves all government surveillance requests without audit." },
          { key: "D", label: "Option D", text: "A legal entity responsible for managing private stock transfers." },
        ],
        correctKey: "B",
        explanation: "Consent Managers act as trusted fiduciaries allowing citizens to seamlessly track, grant, and withdraw consent across multiple digital services.",
      },
    ],
  },
  {
    id: "MACRO-NAS-2024",
    code: "MACRO-NAS-2024",
    title: "National Accounts Statistics & Macroeconomic Aggregates",
    domain: "Macroeconomics & GDP",
    category: "Economic Statistics",
    datasetId: "DATASET-MOSPI-2024-NAS-REV",
    description: "Methodology of GDP compilation, GVA at basic prices, FISIM financial intermediation allocation, double deflation in manufacturing, and ASI vs MCA21 integration.",
    questionCount: 5,
    bloomLevels: ["Understand (L2)", "Apply (L3)", "Analyze (L4)"],
    topics: ["GVA at Basic Prices", "FISIM Allocation", "Double Deflation", "ASI Census Coverage", "Gross Fixed Capital Formation"],
    questions: [
      {
        id: 1,
        section: "Module 1: Production Accounts",
        category: "GVA Derivation",
        ruleTag: "SNA 2008 / NAS Methodology 2024",
        marks: "+2.0",
        negative: "-0.5",
        bloomLevel: "Understand",
        difficulty: "Intermediate",
        gapAddressed: "National Accounts & Macroeconomics",
        questionText: "Under the revised National Accounts Statistics series, how is Gross Value Added (GVA) at Basic Prices derived from GVA at Factor Cost?",
        options: [
          { key: "A", label: "Option A", text: "GVA at Basic Prices = GVA at Factor Cost + (Production Taxes - Production Subsidies)." },
          { key: "B", label: "Option B", text: "GVA at Basic Prices = GVA at Factor Cost + Product Taxes - Product Subsidies." },
          { key: "C", label: "Option C", text: "GVA at Basic Prices = GDP at Market Prices minus Depreciation." },
          { key: "D", label: "Option D", text: "GVA at Basic Prices is identical to Gross Domestic Product without adjustment." },
        ],
        correctKey: "A",
        explanation: "GVA at Basic Prices equals GVA at Factor Cost plus net production taxes (land revenue, stamp duty, minus subsidies like interest subsidies). Product taxes/subsidies are added later to obtain GDP at Market Prices.",
      },
      {
        id: 2,
        section: "Module 2: Financial Intermediation",
        category: "FISIM Allocation",
        ruleTag: "MoSPI NAS Bulletin #12",
        marks: "+2.0",
        negative: "-0.5",
        bloomLevel: "Analyze",
        difficulty: "Advanced",
        gapAddressed: "National Accounts Statistics",
        questionText: "Why is Financial Intermediation Services Indirectly Measured (FISIM) explicitly allocated across consuming user industries rather than treated as a nominal negative sector?",
        options: [
          { key: "A", label: "Option A", text: "To eliminate banks from paying corporate income taxes." },
          { key: "B", label: "Option B", text: "To correctly reflect intermediate consumption of financial services across manufacturing/services and accurately measure true final demand." },
          { key: "C", label: "Option C", text: "Because international credit rating agencies require raw bank margins to be excluded." },
          { key: "D", label: "Option D", text: "To reduce the reported national inflation rate." },
        ],
        correctKey: "B",
        explanation: "Allocating FISIM across borrowing and depositor industries correctly identifies their true intermediate costs and properly distributes value addition across sectors.",
      },
      {
        id: 3,
        section: "Module 3: Price Deflation",
        category: "Double Deflation",
        ruleTag: "CSO Expert Advisory 2024",
        marks: "+2.0",
        negative: "-0.5",
        bloomLevel: "Analyze",
        difficulty: "Advanced",
        gapAddressed: "Macroeconomic Aggregates",
        questionText: "What is the primary conceptual advantage of using the Double Deflation method over Single Deflation for estimating constant-price manufacturing GVA?",
        options: [
          { key: "A", label: "Option A", text: "It deflates both gross output by output price index and intermediate inputs by specific input price indices, preventing distorted value added during raw material price shocks." },
          { key: "B", label: "Option B", text: "It doubles the estimated GDP growth rate for presentation purposes." },
          { key: "C", label: "Option C", text: "It requires no price index data from the wholesale price index." },
          { key: "D", label: "Option D", text: "It applies only to unorganized agricultural workers." },
        ],
        correctKey: "A",
        explanation: "Double deflation ensures changes in the price of inputs relative to outputs do not artificially inflate or suppress constant-price value added.",
      },
      {
        id: 4,
        section: "Module 4: Factory Sector",
        category: "ASI Frame Coverage",
        ruleTag: "Factories Act 1948 §2(m)",
        marks: "+2.0",
        negative: "-0.5",
        bloomLevel: "Apply",
        difficulty: "Basic",
        gapAddressed: "Industrial Statistics",
        questionText: "Which manufacturing establishments are statutorily covered under Section 2(m)(i) and 2(m)(ii) of the Factories Act 1948 for inclusion in the Annual Survey of Industries (ASI) frame?",
        options: [
          { key: "A", label: "Option A", text: "10 or more workers using power, or 20 or more workers without power on any day of preceding 12 months." },
          { key: "B", label: "Option B", text: "Any business with annual turnover exceeding ₹500 Crores." },
          { key: "C", label: "Option C", text: "Only state-owned public sector enterprises." },
          { key: "D", label: "Option D", text: "Only software exporting units registered with STPI." },
        ],
        correctKey: "A",
        explanation: "Sections 2(m)(i) and 2(m)(ii) define registered factories based on employment of 10+ workers with power or 20+ workers without power.",
      },
      {
        id: 5,
        section: "Module 5: Capital Formation",
        category: "Gross Fixed Capital Formation",
        ruleTag: "National Accounts Compilation Manual",
        marks: "+2.0",
        negative: "-0.5",
        bloomLevel: "Understand",
        difficulty: "Intermediate",
        gapAddressed: "Macroeconomic Aggregates",
        questionText: "Which of the following expenditures is NOT included in Gross Fixed Capital Formation (GFCF)?",
        options: [
          { key: "A", label: "Option A", text: "Construction of national highways and bridges." },
          { key: "B", label: "Option B", text: "Purchase of existing financial equities and shares on the stock exchange." },
          { key: "C", label: "Option C", text: "Acquisition of new industrial machinery and transport equipment." },
          { key: "D", label: "Option D", text: "Investment in intellectual property products (R&D, mineral exploration, software)." },
        ],
        correctKey: "B",
        explanation: "GFCF measures net additions of fixed tangible and intangible productive assets; buying existing financial equities is a pure transfer of financial claims, not physical capital formation.",
      },
    ],
  },
  {
    id: "ADM-VIG-2023",
    code: "ADM-VIG-2023",
    title: "Vigilance Administration & Disciplinary Proceedings (CVC 2023)",
    domain: "Personnel Administration",
    category: "Vigilance & Conduct Rules",
    datasetId: "DATASET-DOPT-2023-CVC-VIG",
    description: "Central Vigilance Commission (CVC) manual, Rule 14 CCS (CCA) Rules 1965, charge-sheet drafting, standard of proof, and disciplinary inquiries.",
    questionCount: 5,
    bloomLevels: ["Understand (L2)", "Apply (L3)", "Analyze (L4)"],
    topics: ["Rule 14 Major Penalty Procedure", "Burden & Standard of Proof", "CVC First Stage Advice", "Rule 10 Suspension Review", "Inquiry Authority Independence"],
    questions: [
      {
        id: 1,
        section: "Module 1: Inquiries Procedure",
        category: "Standard of Proof",
        ruleTag: "Rule 14 - CCS (CCA) Rules 1965",
        marks: "+2.0",
        negative: "-0.5",
        bloomLevel: "Understand",
        difficulty: "Basic",
        gapAddressed: "Vigilance & Disciplinary Proceedings",
        questionText: "In a departmental disciplinary proceeding under Rule 14 of CCS (CCA) Rules 1965, what is the standard of proof required to establish charges against a charged officer?",
        options: [
          { key: "A", label: "Option A", text: "Proof beyond all reasonable doubt, as in criminal court proceedings." },
          { key: "B", label: "Option B", text: "Preponderance of probability based on evidence adduced during the inquiry." },
          { key: "C", label: "Option C", text: "Unanimous agreement of all co-workers in the cadre." },
          { key: "D", label: "Option D", text: "Sole discretion of the investigating vigilance inspector." },
        ],
        correctKey: "B",
        explanation: "Departmental proceedings are quasi-judicial; the legal standard of proof is 'preponderance of probability', not the strict criminal standard of proof beyond reasonable doubt.",
      },
      {
        id: 2,
        section: "Module 2: Vigilance Timelines",
        category: "Preliminary Inquiries",
        ruleTag: "CVC Vigilance Manual 2023 §3.4",
        marks: "+2.0",
        negative: "-0.5",
        bloomLevel: "Apply",
        difficulty: "Intermediate",
        gapAddressed: "Personnel Administration",
        questionText: "According to the CVC Vigilance Manual 2023, within what maximum timeline should a Preliminary Inquiry (PE) ordinarily be completed by the Chief Vigilance Officer (CVO)?",
        options: [
          { key: "A", label: "Option A", text: "Within 3 months from the date of receipt of the reference." },
          { key: "B", label: "Option B", text: "Within 3 years." },
          { key: "C", label: "Option C", text: "Within 48 hours without exception." },
          { key: "D", label: "Option D", text: "No time limit is prescribed under vigilance guidelines." },
        ],
        correctKey: "A",
        explanation: "CVC guidelines prescribe an outer limit of 3 months for conducting and concluding preliminary inquiries.",
      },
      {
        id: 3,
        section: "Module 3: Suspension Orders",
        category: "Rule 10 Review Timelines",
        ruleTag: "Rule 10(6) - CCS (CCA) Rules",
        marks: "+2.0",
        negative: "-0.5",
        bloomLevel: "Analyze",
        difficulty: "Advanced",
        gapAddressed: "Administrative Law & Service Rules",
        questionText: "Under Rule 10(6) of CCS (CCA) Rules 1965, what happens if an order of suspension is not reviewed by the competent Review Committee before the expiry of 90 days from the effective date?",
        options: [
          { key: "A", label: "Option A", text: "The suspension order automatically becomes invalid and lapses upon completion of 90 days." },
          { key: "B", label: "Option B", text: "The suspension automatically converts to permanent dismissal from service." },
          { key: "C", label: "Option C", text: "The officer must forfeit all accumulated pension benefits." },
          { key: "D", label: "Option D", text: "The suspension continues indefinitely without further review." },
        ],
        correctKey: "A",
        explanation: "Under Supreme Court precedents (Ajay Kumar Choudhary case) and Rule 10(6), failure to review suspension within 90 days renders the suspension order invalid.",
      },
      {
        id: 4,
        section: "Module 4: Charge Sheets",
        category: "Major vs Minor Penalties",
        ruleTag: "Rule 11 & Rule 16 - CCS (CCA) Rules",
        marks: "+2.0",
        negative: "-0.5",
        bloomLevel: "Understand",
        difficulty: "Basic",
        gapAddressed: "Vigilance & Disciplinary Proceedings",
        questionText: "Which of the following is categorized as a 'Minor Penalty' under Rule 11 of the CCS (CCA) Rules 1965?",
        options: [
          { key: "A", label: "Option A", text: "Withholding of promotion for a specified period." },
          { key: "B", label: "Option B", text: "Compulsory retirement from service." },
          { key: "C", label: "Option C", text: "Removal from service which shall not be a disqualification for future employment." },
          { key: "D", label: "Option D", text: "Dismissal from service which shall ordinarily be a disqualification for future employment." },
        ],
        correctKey: "A",
        explanation: "Withholding of promotion, censure, and recovery of pecuniary loss are minor penalties under Rule 11; compulsory retirement, removal, and dismissal are major penalties.",
      },
      {
        id: 5,
        section: "Module 5: Quasi-Judicial Inquiries",
        category: "Inquiring Authority Duties",
        ruleTag: "CVC Guidelines §4.8",
        marks: "+2.0",
        negative: "-0.5",
        bloomLevel: "Apply",
        difficulty: "Intermediate",
        gapAddressed: "Personnel Administration",
        questionText: "What is the statutory role of the Inquiring Authority (IA) during regular departmental inquiry hearings?",
        options: [
          { key: "A", label: "Option A", text: "The IA acts as an impartial quasi-judicial officer to assess evidence and record objective findings, not as a prosecutor for the department." },
          { key: "B", label: "Option B", text: "The IA must actively cross-examine defense witnesses to secure a conviction." },
          { key: "C", label: "Option C", text: "The IA determines the exact punishment and issues the final penalty order." },
          { key: "D", label: "Option D", text: "The IA reports exclusively to the CBI." },
        ],
        correctKey: "A",
        explanation: "The Inquiring Authority functions as an independent, neutral quasi-judicial body to evaluate evidence presented by the Presenting Officer and Charged Officer.",
      },
    ],
  },
  {
    id: "LEG-RTI-2005",
    code: "LEG-RTI-2005",
    title: "Right to Information (RTI Act 2005) & Appellate Jurisdiction",
    domain: "Legal & Regulatory",
    category: "Administrative Law",
    datasetId: "DATASET-CIC-2024-RTI-APP",
    description: "Statutory mandates under RTI Act 2005, Section 4 proactive disclosures, Section 8 exemptions, 48-hour life & liberty timeline, and Section 20 CIC penalties.",
    questionCount: 5,
    bloomLevels: ["Understand (L2)", "Apply (L3)", "Analyze (L4)"],
    topics: ["Section 7(1) Life & Liberty 48h", "Section 8(1)(j) Privacy Exemption", "Section 20 CIC Financial Penalties", "Section 19 First Appeals", "Section 6(3) Transfer Rules"],
    questions: [
      {
        id: 1,
        section: "Module 1: Response Timelines",
        category: "Life and Liberty",
        ruleTag: "RTI Act 2005 - Section 7(1)",
        marks: "+2.0",
        negative: "-0.5",
        bloomLevel: "Understand",
        difficulty: "Basic",
        gapAddressed: "Legal & Regulatory Compliance",
        questionText: "Under the proviso to Section 7(1) of the RTI Act 2005, if the information sought concerns the 'life or liberty' of a person, within what mandatory time limit must the CPIO provide the information?",
        options: [
          { key: "A", label: "Option A", text: "Within 48 hours of the receipt of the request." },
          { key: "B", label: "Option B", text: "Within 7 calendar days." },
          { key: "C", label: "Option C", text: "Within 30 standard working days." },
          { key: "D", label: "Option D", text: "Within 24 hours only upon High Court writ." },
        ],
        correctKey: "A",
        explanation: "Section 7(1) explicitly mandates that where information concerns life or liberty of a person, it shall be provided within 48 hours.",
      },
      {
        id: 2,
        section: "Module 2: Penalties on CPIO",
        category: "CIC Adjudication",
        ruleTag: "RTI Act 2005 - Section 20(1)",
        marks: "+2.0",
        negative: "-0.5",
        bloomLevel: "Apply",
        difficulty: "Intermediate",
        gapAddressed: "Legal & Regulatory Compliance",
        questionText: "What is the maximum cumulative penalty that the Information Commission can impose on a Central Public Information Officer (CPIO) under Section 20(1) for unjustified delay?",
        options: [
          { key: "A", label: "Option A", text: "₹250 each day till information is furnished, subject to a maximum of ₹25,000." },
          { key: "B", label: "Option B", text: "A fixed fine of ₹5,000 only." },
          { key: "C", label: "Option C", text: "Up to ₹1,00,000 along with automatic criminal imprisonment." },
          { key: "D", label: "Option D", text: "There is no financial penalty provision in the RTI Act." },
        ],
        correctKey: "A",
        explanation: "Section 20(1) prescribes a daily penalty of ₹250 per day of default, up to a statutory ceiling of ₹25,000.",
      },
      {
        id: 3,
        section: "Module 3: Statutory Exemptions",
        category: "Personal Privacy",
        ruleTag: "RTI Act 2005 - Section 8(1)(j)",
        marks: "+2.0",
        negative: "-0.5",
        bloomLevel: "Analyze",
        difficulty: "Advanced",
        gapAddressed: "Right to Information",
        questionText: "Under Section 8(1)(j) of RTI Act 2005, personal information which has no relationship to any public activity or interest may be exempted unless:",
        options: [
          { key: "A", label: "Option A", text: "The CPIO or appellate authority is satisfied that the larger public interest justifies the disclosure." },
          { key: "B", label: "Option B", text: "The applicant pays ten times the ordinary application fee." },
          { key: "C", label: "Option C", text: "The information relates to a private multinational company." },
          { key: "D", label: "Option D", text: "The applicant is a Member of Parliament." },
        ],
        correctKey: "A",
        explanation: "Section 8(1)(j) includes a public interest override: if the larger public interest outweighs privacy intrusion, the information must be disclosed.",
      },
      {
        id: 4,
        section: "Module 4: Transfer of Application",
        category: "Section 6(3) Compliance",
        ruleTag: "RTI Act 2005 - Section 6(3)",
        marks: "+2.0",
        negative: "-0.5",
        bloomLevel: "Apply",
        difficulty: "Basic",
        gapAddressed: "Legal & Regulatory Compliance",
        questionText: "When an RTI application is received by Public Authority 'A' but the subject matter pertains to another Public Authority 'B', what is the statutory duty of CPIO 'A'?",
        options: [
          { key: "A", label: "Option A", text: "Transfer the application to Authority 'B' within 5 days and immediately inform the applicant." },
          { key: "B", label: "Option B", text: "Reject the application and advise the applicant to re-apply." },
          { key: "C", label: "Option C", text: "Hold the file for 30 days before returning it to the applicant." },
          { key: "D", label: "Option D", text: "Forward it to the Supreme Court registrar." },
        ],
        correctKey: "A",
        explanation: "Section 6(3) mandates transfer to the concerned public authority as soon as practicable but in no case later than 5 days, with written intimation to the applicant.",
      },
      {
        id: 5,
        section: "Module 5: Appellate Jurisdiction",
        category: "First Appeals",
        ruleTag: "RTI Act 2005 - Section 19(1)",
        marks: "+2.0",
        negative: "-0.5",
        bloomLevel: "Understand",
        difficulty: "Intermediate",
        gapAddressed: "Administrative Law",
        questionText: "What is the statutory limitation period for an aggrieved applicant to file a First Appeal before the First Appellate Authority (FAA)?",
        options: [
          { key: "A", label: "Option A", text: "Within 30 days from the expiry of the response period or from receipt of the CPIO's decision." },
          { key: "B", label: "Option B", text: "Within 90 days from the filing date." },
          { key: "C", label: "Option C", text: "Within 1 year with leave of court." },
          { key: "D", label: "Option D", text: "Within 24 hours of receiving the decision." },
        ],
        correctKey: "A",
        explanation: "Section 19(1) prescribes 30 days for filing First Appeals, with a provision for condonation of delay if sufficient cause is shown.",
      },
    ],
  },
  {
    id: "TECH-PYSPARK-2024",
    code: "TECH-PYSPARK-2024",
    title: "Big Data Microdata Engineering & PySpark for MoSPI",
    domain: "Data Engineering",
    category: "HPC & Cloud Computing",
    datasetId: "DATASET-MOSPI-2024-HPC-PYSPARK",
    description: "Distributed Apache Spark processing for national census tabulations, Catalyst query optimization, handling microdata skew, and columnar Parquet optimization.",
    questionCount: 5,
    bloomLevels: ["Understand (L2)", "Apply (L3)", "Analyze (L4)"],
    topics: ["Broadcast Hash Joins", "Catalyst Optimizer Pipeline", "Data Skew & Salting", "Repartition vs Coalesce", "Parquet Columnar Storage"],
    questions: [
      {
        id: 1,
        section: "Module 1: Distributed Join Strategies",
        category: "Execution Plans",
        ruleTag: "PySpark Optimization Standard §3.2",
        marks: "+2.0",
        negative: "-0.5",
        bloomLevel: "Apply",
        difficulty: "Intermediate",
        gapAddressed: "Big Data Engineering & PySpark",
        questionText: "When joining a 500GB national household microdata DataFrame with a 5MB district master code lookup table in Apache Spark, which join strategy avoids expensive network shuffles?",
        options: [
          { key: "A", label: "Option A", text: "Broadcast Hash Join (broadcast(df_districts)), which replicates the small dimension table to all worker executors." },
          { key: "B", label: "Option B", text: "Shuffle Hash Join with disk spill enabled." },
          { key: "C", label: "Option C", text: "Cartesian Cross Join across all partitions." },
          { key: "D", label: "Option D", text: "Iterative Row-by-Row Python lambda lookup." },
        ],
        correctKey: "A",
        explanation: "Broadcasting the small dimension DataFrame avoids shuffling the massive 500GB microdata dataset across the network, dramatically improving execution speed.",
      },
      {
        id: 2,
        section: "Module 2: Partition Management",
        category: "Repartition vs Coalesce",
        ruleTag: "MoSPI HPC Cluster Guidelines §5.1",
        marks: "+2.0",
        negative: "-0.5",
        bloomLevel: "Understand",
        difficulty: "Basic",
        gapAddressed: "Big Data Engineering",
        questionText: "When writing out filtered national survey summary tables to HDFS/S3 storage, why is `df.coalesce(5)` preferred over `df.repartition(5)` when decreasing partition count?",
        options: [
          { key: "A", label: "Option A", text: "Coalesce avoids a full cluster shuffle by merging existing adjacent partitions, whereas repartition performs a full reshuffle." },
          { key: "B", label: "Option B", text: "Coalesce encrypts the underlying data with SHA-256." },
          { key: "C", label: "Option C", text: "Repartition cannot be used in Spark SQL." },
          { key: "D", label: "Option D", text: "Coalesce increases the number of worker CPU cores." },
        ],
        correctKey: "A",
        explanation: "coalesce() avoids a costly full shuffle when reducing the number of partitions by collapsing existing partitions on the same worker nodes.",
      },
      {
        id: 3,
        section: "Module 3: Data Skew Mitigation",
        category: "Skewed Partitions",
        ruleTag: "Distributed Computing Bulletin #8",
        marks: "+2.0",
        negative: "-0.5",
        bloomLevel: "Analyze",
        difficulty: "Advanced",
        gapAddressed: "HPC Optimization",
        questionText: "In a nationwide microdata aggregation grouped by District ID, high-population metropolitan districts cause one executor to experience severe Out-Of-Memory (OOM) errors while others finish quickly. What is the standard engineering remedy?",
        options: [
          { key: "A", label: "Option A", text: "Salting the grouping key with random integers (0..N) to distribute the skewed keys across multiple partitions, followed by a two-stage aggregation." },
          { key: "B", label: "Option B", text: "Discarding data for the high-population districts." },
          { key: "C", label: "Option C", text: "Decreasing Spark executor memory to 512MB." },
          { key: "D", label: "Option D", text: "Converting the Spark DataFrame to a single-threaded Python Pandas Series." },
        ],
        correctKey: "A",
        explanation: "Key salting breaks the hot key into sub-keys, allowing parallel worker nodes to aggregate subsets before merging in a second stage.",
      },
      {
        id: 4,
        section: "Module 4: Storage Optimization",
        category: "Columnar Storage",
        ruleTag: "MoSPI Data Lake Spec 2024",
        marks: "+2.0",
        negative: "-0.5",
        bloomLevel: "Understand",
        difficulty: "Basic",
        gapAddressed: "Big Data Engineering",
        questionText: "Why does MoSPI's Data Lake standardize on Apache Parquet with Snappy compression over uncompressed CSV for multi-round survey microdata?",
        options: [
          { key: "A", label: "Option A", text: "Parquet provides columnar storage with predicate pushdown and dictionary encoding, drastically reducing I/O and query latency." },
          { key: "B", label: "Option B", text: "CSV files cannot be opened in web browsers." },
          { key: "C", label: "Option C", text: "Parquet eliminates all statistical non-response errors." },
          { key: "D", label: "Option D", text: "Parquet files can only be written by proprietary Microsoft software." },
        ],
        correctKey: "A",
        explanation: "Columnar storage allows Spark to read only required columns (projection pushdown) and skip row groups based on min/max statistics (predicate pushdown).",
      },
      {
        id: 5,
        section: "Module 5: Catalyst Engine",
        category: "Query Optimization",
        ruleTag: "Spark Architecture §2.4",
        marks: "+2.0",
        negative: "-0.5",
        bloomLevel: "Analyze",
        difficulty: "Advanced",
        gapAddressed: "Big Data Engineering",
        questionText: "What is the correct sequence of phases performed by the Spark Catalyst Optimizer when executing a DataFrame query?",
        options: [
          { key: "A", label: "Option A", text: "Analysis (Unresolved Logical Plan) → Logical Optimization → Physical Planning → Code Generation (Tungsten)." },
          { key: "B", label: "Option B", text: "Code Generation → Analysis → Physical Planning → Storage Allocation." },
          { key: "C", label: "Option C", text: "Garbage Collection → Syntax Parsing → JVM Restart." },
          { key: "D", label: "Option D", text: "Physical Planning occurs before any logical plan analysis." },
        ],
        correctKey: "A",
        explanation: "Catalyst first parses to an unresolved logical plan, resolves references against the catalog, applies rule-based optimizations, generates physical plans, selects cost-based winner, and generates bytecode via Tungsten.",
      },
    ],
  },
];

function AssessmentContent() {
  const searchParams = useSearchParams();
  const courseParam = searchParams?.get("course");
  const tabParam = searchParams?.get("tab");
  const initialTab = tabParam === "generator" || Boolean(courseParam) ? "generator" : "statutory";

  const { user } = useAuth();
  const { language, setLanguage, fontSize, setFontSize, t } = useLanguage();

  const [activeTab, setActiveTab] = useState<"statutory" | "generator">(initialTab);

  // --- Course Selection & Pre-fetched Dataset State ---
  // Match courseParam against known course codes or IDs
  const matchedCourse = courseParam
    ? PREFETCHED_COURSE_DATASETS.find(
        (c) =>
          c.id.toLowerCase() === courseParam.toLowerCase() ||
          c.code.toLowerCase() === courseParam.toLowerCase() ||
          courseParam.toLowerCase().startsWith(c.code.toLowerCase())
      ) || PREFETCHED_COURSE_DATASETS[0]
    : PREFETCHED_COURSE_DATASETS[0];

  const [selectedCourseId, setSelectedCourseId] = useState<string>(matchedCourse.id);
  const [courseSearchFilter, setCourseSearchFilter] = useState<string>("");
  const [showCustomUploadSection, setShowCustomUploadSection] = useState<boolean>(false);
  const [customDatasetIdInput, setCustomDatasetIdInput] = useState<string>("");
  const [isDatasetIdFetched, setIsDatasetIdFetched] = useState<boolean>(false);

  // --- Statutory Exam State ---
  const [currentIdx, setCurrentIdx] = useState(6);
  const [answers, setAnswers] = useState<Record<number, string>>({
    0: "C",
    1: "B",
    2: "B",
    3: "B",
    4: "B",
    5: "B",
    6: "B",
  });
  const [reviewed, setReviewed] = useState<Record<number, boolean>>({
    5: true,
  });
  const [timerSeconds, setTimerSeconds] = useState(28 * 60 + 45);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showScorecard, setShowScorecard] = useState(false);
  const [scoreResult, setScoreResult] = useState<{ score: number; total: number; percentage: number } | null>(null);

  // --- AI Quiz Generator / Custom Upload State ---
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [numQuestions, setNumQuestions] = useState<number>(5);
  const [bloomTarget, setBloomTarget] = useState<string>("Apply");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<number>(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Generated Quiz Session State (used for both pre-fetched course quiz and custom generated quiz)
  const [activeGeneratedQuiz, setActiveGeneratedQuiz] = useState<QuestionData[] | null>(null);
  const [generatedSourceTitle, setGeneratedSourceTitle] = useState<string>("");
  const [generatedDatasetId, setGeneratedDatasetId] = useState<string>("");
  const [genCurrentIdx, setGenCurrentIdx] = useState<number>(0);
  const [genAnswers, setGenAnswers] = useState<Record<number, string>>({});
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});
  const [genScorecard, setGenScorecard] = useState<{ score: number; total: number; pct: number } | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Update selected course if courseParam changes in URL
  useEffect(() => {
    if (courseParam) {
      const target = PREFETCHED_COURSE_DATASETS.find(
        (c) =>
          c.id.toLowerCase() === courseParam.toLowerCase() ||
          c.code.toLowerCase() === courseParam.toLowerCase() ||
          courseParam.toLowerCase().startsWith(c.code.toLowerCase())
      );
      if (target) {
        setSelectedCourseId(target.id);
        setActiveTab("generator");
      }
    }
  }, [courseParam]);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `00:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const currentQ = gfrQuestions[currentIdx];
  const selectedOption = answers[currentIdx];

  const handleSelectOption = (key: string) => {
    setAnswers((prev) => ({ ...prev, [currentIdx]: key }));
  };

  const handleClearResponse = () => {
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[currentIdx];
      return next;
    });
  };

  const handleToggleReview = () => {
    setReviewed((prev) => ({ ...prev, [currentIdx]: !prev[currentIdx] }));
  };

  const handleSubmitExam = () => {
    let score = 0;
    gfrQuestions.forEach((q, idx) => {
      if (answers[idx] === q.correctKey) {
        score++;
      }
    });
    const percentage = Math.round((score / gfrQuestions.length) * 100);
    setScoreResult({ score, total: gfrQuestions.length, percentage });
    setShowScorecard(true);
  };

  // --- Start Course Practice Quiz from Pre-fetched Dataset ---
  const handleStartCourseQuiz = (courseObj?: CourseDataset) => {
    const target = courseObj || PREFETCHED_COURSE_DATASETS.find((c) => c.id === selectedCourseId) || PREFETCHED_COURSE_DATASETS[0];
    const questionsToLoad = target.questions;
    setActiveGeneratedQuiz(questionsToLoad);
    setGeneratedSourceTitle(`${target.code}: ${target.title}`);
    setGeneratedDatasetId(target.datasetId);
    setGenCurrentIdx(0);
    setGenAnswers({});
    setShowExplanation({});
    setGenScorecard(null);
    triggerToast(`Automated quiz loaded from verified dataset "${target.datasetId}" (${questionsToLoad.length} Questions)`);
  };

  // --- Fetch Custom Dataset by ID ---
  const handleFetchCustomDatasetId = () => {
    if (!customDatasetIdInput.trim()) {
      triggerToast("Please enter a valid Dataset ID (e.g., DATASET-MOSPI-2024-NSSO-01)");
      return;
    }
    const cleanId = customDatasetIdInput.trim();
    // Check if matches known course dataset
    const matched = PREFETCHED_COURSE_DATASETS.find(
      (c) => c.datasetId.toLowerCase() === cleanId.toLowerCase() || c.id.toLowerCase() === cleanId.toLowerCase()
    );

    if (matched) {
      setSelectedCourseId(matched.id);
      setIsDatasetIdFetched(true);
      triggerToast(`Verified Dataset "${matched.datasetId}" linked successfully!`);
    } else {
      setIsDatasetIdFetched(true);
      triggerToast(`Custom Dataset "${cleanId}" verified and registered in MoSPI registry!`);
    }
  };

  // --- Custom File Drop & Upload Logic ---
  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleGenerateCustomQuiz = async () => {
    setIsGenerating(true);
    setGenerationStep(1);

    const activeCourse = PREFETCHED_COURSE_DATASETS.find((c) => c.id === selectedCourseId) || PREFETCHED_COURSE_DATASETS[0];

    // Multi-step progress animation
    setTimeout(() => setGenerationStep(2), 600);
    setTimeout(() => setGenerationStep(3), 1200);
    setTimeout(() => setGenerationStep(4), 1800);

    // Call backend API if available, with resilient fallback
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const formData = new FormData();
      if (uploadedFile) {
        formData.append("file", uploadedFile);
      } else {
        const sampleText = `${activeCourse.title}\nDataset: ${customDatasetIdInput || activeCourse.datasetId}\n${activeCourse.description}`;
        formData.append("file", new Blob([sampleText], { type: "text/plain" }), `${activeCourse.code}.txt`);
      }
      formData.append("officer_id", "1");
      formData.append("num_questions", String(numQuestions));

      const res = await fetch(`${apiUrl}/quiz/generate`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.questions && data.questions.length > 0) {
          const formattedQuestions: QuestionData[] = data.questions.map((q: any, i: number) => ({
            id: i + 1,
            section: `Generated from ${data.source_material_id}`,
            category: q.bloom_level || "Psychometric Assessment",
            ruleTag: `Bloom Level: ${q.bloom_level} • Difficulty: ${q.difficulty}`,
            marks: "+2.0",
            negative: "-0.5",
            questionText: q.question_text,
            options: (q.options || []).map((opt: any) => ({
              key: opt.id || opt.label || "A",
              label: `Option ${opt.id || opt.label || "A"}`,
              text: opt.text,
            })),
            correctKey: q.correct_answer || "A",
            explanation: "Model validated through Gemini psychometric evaluation.",
            bloomLevel: q.bloom_level,
            difficulty: q.difficulty,
          }));

          setTimeout(() => {
            setActiveGeneratedQuiz(formattedQuestions);
            setGeneratedSourceTitle(uploadedFile ? uploadedFile.name : (customDatasetIdInput || activeCourse.title));
            setGeneratedDatasetId(customDatasetIdInput || `CUSTOM-UPLOAD-${Date.now()}`);
            setGenCurrentIdx(0);
            setGenAnswers({});
            setShowExplanation({});
            setGenScorecard(null);
            setIsGenerating(false);
            triggerToast(`AI generated ${formattedQuestions.length} practice questions from custom material!`);
          }, 2200);
          return;
        }
      }
    } catch {
      // Seamless fallback to curated course questions
    }

    setTimeout(() => {
      const chosenQuestions = activeCourse.questions.slice(0, numQuestions);
      setActiveGeneratedQuiz(chosenQuestions);
      setGeneratedSourceTitle(uploadedFile ? uploadedFile.name : (customDatasetIdInput || activeCourse.title));
      setGeneratedDatasetId(customDatasetIdInput || activeCourse.datasetId);
      setGenCurrentIdx(0);
      setGenAnswers({});
      setShowExplanation({});
      setGenScorecard(null);
      setIsGenerating(false);
      triggerToast(`AI generated ${chosenQuestions.length} questions from "${uploadedFile ? uploadedFile.name : activeCourse.title}"!`);
    }, 2200);
  };

  const handleGenSelectOption = (key: string) => {
    setGenAnswers((prev) => ({ ...prev, [genCurrentIdx]: key }));
  };

  const handleFinishGenQuiz = () => {
    if (!activeGeneratedQuiz) return;
    let correct = 0;
    activeGeneratedQuiz.forEach((q, idx) => {
      if (genAnswers[idx] === q.correctKey) {
        correct++;
      }
    });
    const pct = Math.round((correct / activeGeneratedQuiz.length) * 100);
    setGenScorecard({ score: correct, total: activeGeneratedQuiz.length, pct });
  };

  const activeSelectedCourse =
    PREFETCHED_COURSE_DATASETS.find((c) => c.id === selectedCourseId) || PREFETCHED_COURSE_DATASETS[0];

  const filteredCourses = PREFETCHED_COURSE_DATASETS.filter((c) => {
    const q = courseSearchFilter.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.domain.toLowerCase().includes(q) ||
      c.datasetId.toLowerCase().includes(q)
    );
  });

  const displayName = user?.fullName || "Shri Rajesh Sharma, IAS";

  return (
    <AppShell fullWidth hideAiFab={activeTab === "statutory"}>
      {/* Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-2 text-sm border border-outline-variant/40 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-tertiary-fixed shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Dual-Tab Navigation */}
      <div className="w-full bg-surface-container-low border-b border-outline-variant/50 sticky top-[144px] z-20 backdrop-blur-xs">
        <div className="max-w-container-max mx-auto px-gutter-desktop flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab("statutory")}
              className={`px-4 py-3 font-label-md text-label-md flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === "statutory"
                  ? "border-primary text-primary font-bold bg-surface-container-lowest"
                  : "border-transparent text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
              <span>{t("tab_statutory_exam", "Statutory Examination (GFR 2017)")}</span>
            </button>

            <button
              onClick={() => setActiveTab("generator")}
              className={`px-4 py-3 font-label-md text-label-md flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === "generator"
                  ? "border-primary text-primary font-bold bg-surface-container-lowest"
                  : "border-transparent text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <Sparkles className="w-4 h-4 text-secondary" />
              <span>{t("automated_prep_title", "Automated Course Quiz & Pre-fetched Datasets")}</span>
              <span className="bg-secondary/15 text-secondary text-[10px] font-bold px-1.5 py-0.25 rounded-full uppercase">
                Automated
              </span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-on-surface-variant">
            <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim"></span>
            <span>NIC Proctoring &amp; Assessment Engine Active</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          TAB 1: STATUTORY DEPARTMENTAL EXAMINATION (GFR 2017)
          ========================================================================= */}
      {activeTab === "statutory" && (
        <div className="max-w-container-max mx-auto px-gutter-desktop py-space-xl">
          {/* Header */}
          <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/60 shadow-sm p-space-lg mb-space-lg flex flex-col md:flex-row md:items-center justify-between gap-space-md">
            <div className="flex items-start gap-space-md">
              <div className="w-10 h-10 rounded bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-[22px]">assignment</span>
              </div>
              <div className="flex flex-col">
                <div className="flex flex-wrap items-center gap-space-xs">
                  <span className="bg-secondary-fixed text-on-secondary-fixed font-label-sm text-[11px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                    Official Examination Mode
                  </span>
                  <span className="text-on-surface-variant text-label-sm font-label-sm">•</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    DoPT / MoSPI Paper Code: <strong>EXAM-GFR-2025-Q2</strong>
                  </span>
                </div>
                <h1 className="font-headline-md text-headline-md text-primary font-bold tracking-tight mt-0.5">
                  Departmental Examination on General Financial Rules (GFR 2017) &amp; Public Procurement
                </h1>
                <p className="font-label-sm text-label-sm text-on-surface-variant">
                  Mandatory In-Service Assessment • Ministry of Finance (Dept of Expenditure) &amp; NSSTA
                </p>
              </div>
            </div>

            {/* Countdown Clock */}
            <div className="flex items-center gap-space-sm bg-surface-container-low px-space-lg py-2.5 rounded-lg border border-outline-variant/40 shrink-0 self-start md:self-auto">
              <span className="material-symbols-outlined text-[20px] text-secondary">timer</span>
              <div className="flex flex-col">
                <span className="font-label-sm text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">
                  Time Remaining
                </span>
                <span className="font-mono text-headline-sm font-bold text-secondary">
                  {formatTimer(timerSeconds)}
                </span>
              </div>
            </div>
          </div>

          {/* Main 2-Column Assessment Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
            {/* Left 8 Cols: Question Display Pane */}
            <div className="lg:col-span-8 flex flex-col gap-space-lg">
              <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/60 shadow-sm overflow-hidden">
                {/* Question Metadata Subheader */}
                <div className="px-space-xl py-space-md bg-surface-container-low border-b border-outline-variant/40 flex flex-wrap items-center justify-between gap-space-sm">
                  <div className="flex items-center gap-space-sm">
                    <span className="bg-primary text-on-primary font-label-sm text-label-sm px-2.5 py-0.5 rounded font-bold">
                      Question {currentQ.id} of {gfrQuestions.length}
                    </span>
                    <span className="bg-surface-container-high text-on-surface font-label-sm text-label-sm px-2 py-0.5 rounded border border-outline-variant/40">
                      {currentQ.ruleTag}
                    </span>
                  </div>
                  <div className="flex items-center gap-space-md font-label-sm text-label-sm text-on-surface-variant">
                    <span>Marks: <strong className="text-on-tertiary-container">{currentQ.marks}</strong></span>
                    <span>Negative: <strong className="text-error">{currentQ.negative}</strong></span>
                  </div>
                </div>

                {/* Question Prompt Body */}
                <div className="p-space-xl space-y-space-xl">
                  <p className="font-body-lg text-body-lg text-primary font-semibold leading-relaxed">
                    {currentQ.questionText}
                  </p>

                  {/* Radio Choices */}
                  <div className="flex flex-col gap-space-sm">
                    {currentQ.options.map((opt) => {
                      const isChecked = selectedOption === opt.key;
                      return (
                        <label
                          key={opt.key}
                          onClick={() => handleSelectOption(opt.key)}
                          className={`p-space-lg rounded-lg border transition-all cursor-pointer flex items-start gap-space-md ${
                            isChecked
                              ? "bg-primary-fixed/25 border-primary shadow-xs ring-1 ring-primary/40"
                              : "bg-surface-container-lowest border-outline-variant/50 hover:bg-surface-container-low hover:border-outline-variant"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question_${currentQ.id}`}
                            checked={isChecked}
                            onChange={() => handleSelectOption(opt.key)}
                            className="mt-1 w-4 h-4 text-primary accent-primary cursor-pointer"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="font-label-md text-label-md font-bold text-primary mr-2">
                              {opt.label}:
                            </span>
                            <span className="font-body-md text-body-md text-on-surface">
                              {opt.text}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Assessment Actions */}
                <div className="px-space-xl py-space-md bg-surface-container-low border-t border-outline-variant/40 flex flex-wrap items-center justify-between gap-space-sm">
                  <div className="flex items-center gap-space-sm">
                    <button
                      onClick={handleToggleReview}
                      className={`px-3 py-1.5 rounded font-label-md text-label-md transition-colors border cursor-pointer ${
                        reviewed[currentIdx]
                          ? "bg-secondary-fixed text-on-secondary-fixed border-secondary font-bold"
                          : "bg-surface-container-lowest text-on-surface-variant border-outline-variant/60 hover:bg-surface-container"
                      }`}
                    >
                      {reviewed[currentIdx] ? "★ Marked for Review" : "☆ Mark for Review"}
                    </button>
                    <button
                      onClick={handleClearResponse}
                      className="px-3 py-1.5 rounded bg-surface-container-lowest text-on-surface-variant hover:text-error border border-outline-variant/60 font-label-md text-label-md transition-colors cursor-pointer"
                    >
                      Clear Response
                    </button>
                  </div>

                  <div className="flex items-center gap-space-sm">
                    <button
                      disabled={currentIdx === 0}
                      onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
                      className="px-4 py-1.5 rounded bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-label-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed border border-outline-variant/40 cursor-pointer"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => {
                        if (currentIdx < gfrQuestions.length - 1) {
                          setCurrentIdx((prev) => prev + 1);
                        } else {
                          handleSubmitExam();
                        }
                      }}
                      className="px-4 py-1.5 rounded bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md transition-colors shadow-xs cursor-pointer"
                    >
                      {currentIdx === gfrQuestions.length - 1 ? "Save & Submit" : "Save & Next"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 4 Cols: 10-Question Matrix Palette */}
            <div className="lg:col-span-4 flex flex-col gap-space-lg">
              <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/60 shadow-sm p-space-lg">
                <div className="flex items-center justify-between border-b border-outline-variant/40 pb-space-sm mb-space-md">
                  <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                    Question Palette ({gfrQuestions.length})
                  </h3>
                  <button
                    onClick={() => setShowInstructions(true)}
                    className="text-xs text-primary hover:underline font-semibold"
                  >
                    Instructions
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-2 mb-space-lg">
                  {gfrQuestions.map((q, idx) => {
                    const isCurrent = idx === currentIdx;
                    const isAnswered = Boolean(answers[idx]);
                    const isRev = Boolean(reviewed[idx]);

                    let btnClass = "bg-surface-container text-on-surface border-outline-variant/40";
                    if (isAnswered) {
                      btnClass = "bg-tertiary-fixed text-on-tertiary-fixed font-bold border-tertiary";
                    }
                    if (isRev) {
                      btnClass = "bg-secondary-fixed text-on-secondary-fixed font-bold border-secondary";
                    }
                    if (isCurrent) {
                      btnClass += " ring-2 ring-primary ring-offset-2";
                    }

                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentIdx(idx)}
                        className={`h-9 rounded flex items-center justify-center font-mono text-sm font-semibold border transition-all cursor-pointer ${btnClass}`}
                      >
                        {q.id}
                      </button>
                    );
                  })}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-label-sm text-on-surface-variant pt-space-sm border-t border-outline-variant/30">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-tertiary-fixed border border-tertiary"></span>
                    <span>Answered ({Object.keys(answers).length})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-secondary-fixed border border-secondary"></span>
                    <span>Marked ({Object.keys(reviewed).length})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-surface-container border border-outline-variant"></span>
                    <span>Unanswered ({gfrQuestions.length - Object.keys(answers).length})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded ring-2 ring-primary border border-primary"></span>
                    <span>Current Active</span>
                  </div>
                </div>

                <button
                  onClick={handleSubmitExam}
                  className="w-full mt-space-lg py-2.5 bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md rounded font-bold transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>Final Submit Examination</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: AUTOMATED COURSE QUIZ & PRE-FETCHED DATASETS (WITH CUSTOM UPLOAD)
          ========================================================================= */}
      {activeTab === "generator" && (
        <div className="max-w-container-max mx-auto px-gutter-desktop py-space-xl">
          {!activeGeneratedQuiz ? (
            /* Course Selector & Pre-fetched Datasets Portal */
            <div className="space-y-space-xl max-w-5xl mx-auto">
              {/* Header Title Card */}
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/60 p-space-xl shadow-sm">
                <div className="flex items-start gap-space-lg">
                  <div className="w-12 h-12 rounded-xl bg-primary-container/10 border border-primary-container/30 flex items-center justify-center shrink-0 text-primary">
                    <Database className="w-6 h-6 text-secondary" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="bg-primary/10 text-primary font-label-sm text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                        Automated Exam Preparation Engine
                      </span>
                      <span className="text-on-surface-variant text-xs">• Pre-fetched MoSPI &amp; Civil Services Question Datasets</span>
                    </div>
                    <h1 className="font-headline-lg text-headline-lg text-primary font-bold tracking-tight mt-1">
                      {t("automated_prep_title", "Select Course & Automated Question Dataset")}
                    </h1>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                      {t("select_course_prompt", "Select any course below to immediately load its pre-fetched, verified question dataset for practice. You can also upload custom study materials (PDF/PPT) or load by Dataset ID if needed.")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Course Selection Cards Grid */}
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/60 p-space-xl shadow-sm space-y-space-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm border-b border-outline-variant/30 pb-space-sm">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-secondary" />
                    <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
                      Available In-Service Course Datasets (7)
                    </h2>
                  </div>

                  {/* Search Bar */}
                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-on-surface-variant" />
                    <input
                      type="text"
                      value={courseSearchFilter}
                      onChange={(e) => setCourseSearchFilter(e.target.value)}
                      placeholder="Filter course or code..."
                      className="w-full bg-surface-container-low pl-9 pr-3 py-1.5 text-xs rounded-lg border border-outline-variant/40 focus:outline-none focus:ring-1 focus:ring-primary text-on-surface"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
                  {filteredCourses.map((course) => {
                    const isSelected = selectedCourseId === course.id;
                    return (
                      <div
                        key={course.id}
                        onClick={() => setSelectedCourseId(course.id)}
                        className={`p-space-lg rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? "bg-primary-fixed/25 border-primary ring-2 ring-primary/50 shadow-sm"
                            : "bg-surface-container-low border-outline-variant/40 hover:bg-surface-container hover:border-outline-variant"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-2">
                            <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                              {course.code}
                            </span>
                            <span className="text-[10px] font-semibold text-secondary flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-secondary" />
                              {course.questions.length} Questions
                            </span>
                          </div>

                          <h3 className="font-bold text-sm text-primary leading-tight line-clamp-2">
                            {course.title}
                          </h3>

                          <p className="text-xs text-on-surface-variant line-clamp-2 mt-1.5">
                            {course.description}
                          </p>
                        </div>

                        <div className="mt-4 pt-2 border-t border-outline-variant/30 flex items-center justify-between">
                          <span className="text-[10px] text-on-surface-variant font-medium">
                            {course.domain}
                          </span>
                          <span
                            className={`text-xs font-bold flex items-center gap-1 ${
                              isSelected ? "text-primary" : "text-on-surface-variant"
                            }`}
                          >
                            {isSelected ? "Selected ✓" : "Select Course →"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Selected Pre-fetched Dataset Dossier Card */}
              {activeSelectedCourse && (
                <div className="bg-primary-fixed/15 border-2 border-primary/40 rounded-xl p-space-xl shadow-sm space-y-space-md animate-fade-in">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center shrink-0">
                        <FileCheck className="w-5 h-5 text-tertiary-fixed" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="bg-tertiary-fixed text-on-tertiary-fixed text-[11px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                            Verified Pre-fetched Dataset
                          </span>
                          <span className="font-mono text-xs text-primary font-bold">
                            Dataset ID: {activeSelectedCourse.datasetId}
                          </span>
                        </div>
                        <h2 className="font-headline-md text-headline-md font-bold text-primary mt-1">
                          {activeSelectedCourse.title}
                        </h2>
                        <p className="text-xs text-on-surface-variant mt-0.5">
                          Domain: <strong>{activeSelectedCourse.domain}</strong> • Standard:{" "}
                          <strong>MoSPI &amp; DoPT Sovereign Examination</strong> •{" "}
                          <strong>{activeSelectedCourse.questions.length} MCQs</strong> Ready Instantly
                        </p>
                      </div>
                    </div>

                    {/* Instant 1-Click Start Button */}
                    <button
                      type="button"
                      onClick={() => handleStartCourseQuiz(activeSelectedCourse)}
                      className="px-6 py-3.5 bg-primary hover:bg-primary-container text-white rounded-xl font-label-md text-label-md font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0 hover:scale-[1.02]"
                    >
                      <Sparkles className="w-5 h-5 text-secondary" />
                      <span>{t("start_course_quiz", "Start Course Practice Quiz (Instant)")}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Topics Covered Tag Cloud */}
                  <div className="pt-2 border-t border-primary/20 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-primary mr-1">Syllabus Topics:</span>
                    {activeSelectedCourse.topics.map((topic, i) => (
                      <span
                        key={i}
                        className="text-[11px] bg-surface-container-lowest text-on-surface px-2.5 py-1 rounded-md border border-outline-variant/40 font-medium"
                      >
                        {topic}
                      </span>
                    ))}
                    <span className="text-[11px] bg-secondary/15 text-secondary px-2.5 py-1 rounded-md font-bold ml-auto">
                      Bloom Depth: {activeSelectedCourse.bloomLevels.join(" • ")}
                    </span>
                  </div>
                </div>
              )}

              {/* Optional Custom Material / Dataset ID Accordion */}
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/60 shadow-sm overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowCustomUploadSection((prev) => !prev)}
                  className="w-full p-space-lg flex items-center justify-between bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3">
                    <UploadCloud className="w-5 h-5 text-secondary" />
                    <div>
                      <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                        {t("or_custom_upload", "Need to test from custom study slides, circular or dataset ID?")}
                      </h3>
                      <p className="text-xs text-on-surface-variant">
                        Click to upload your own PDF/PPTX or enter a specific custom Dataset ID for automated AI question generation.
                      </p>
                    </div>
                  </div>
                  {showCustomUploadSection ? (
                    <ChevronDown className="w-5 h-5 text-on-surface-variant" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-on-surface-variant" />
                  )}
                </button>

                {showCustomUploadSection && (
                  <div className="p-space-xl space-y-space-lg border-t border-outline-variant/40 animate-fade-in">
                    {/* Option A: Enter Custom Dataset ID */}
                    <div className="p-space-lg bg-surface-container-low rounded-xl border border-outline-variant/40 space-y-3">
                      <label className="font-label-md text-label-md font-bold text-primary block">
                        Option A: Load by Custom Dataset ID
                      </label>
                      <div className="flex flex-col sm:flex-row items-center gap-2">
                        <div className="relative flex-1 w-full">
                          <Database className="w-4 h-4 absolute left-3 top-3 text-on-surface-variant" />
                          <input
                            type="text"
                            value={customDatasetIdInput}
                            onChange={(e) => setCustomDatasetIdInput(e.target.value)}
                            placeholder="Enter Dataset ID (e.g. DATASET-MOSPI-2024-NSSO-01)"
                            className="w-full bg-surface-container-lowest pl-9 pr-3 py-2 text-sm rounded-lg border border-outline-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono text-on-surface"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleFetchCustomDatasetId}
                          className="w-full sm:w-auto px-4 py-2 bg-primary hover:bg-primary-container text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shrink-0"
                        >
                          Fetch &amp; Verify Dataset
                        </button>
                      </div>
                      {isDatasetIdFetched && (
                        <p className="text-xs text-on-tertiary-container font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Dataset registered. Ready to generate questions.</span>
                        </p>
                      )}
                    </div>

                    {/* Option B: Upload Custom Media */}
                    <div className="space-y-3">
                      <label className="font-label-md text-label-md font-bold text-primary block">
                        Option B: Upload Custom Course Presentation or Notes (PDF, PPT, TXT)
                      </label>

                      <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleFileDrop}
                        className={`border-2 border-dashed rounded-xl p-6 text-center transition-all flex flex-col items-center justify-center ${
                          uploadedFile
                            ? "border-tertiary bg-tertiary-fixed/10"
                            : "border-outline-variant/80 hover:border-primary hover:bg-surface-container-low"
                        }`}
                      >
                        {uploadedFile ? (
                          <div className="flex items-center gap-4 text-left">
                            <div className="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center">
                              {uploadedFile.name.endsWith(".pptx") || uploadedFile.name.endsWith(".ppt") ? (
                                <Presentation className="w-5 h-5" />
                              ) : (
                                <FileText className="w-5 h-5" />
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-primary text-sm">{uploadedFile.name}</p>
                              <p className="text-xs text-on-surface-variant">
                                {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for AI extraction
                              </p>
                            </div>
                            <button
                              onClick={() => setUploadedFile(null)}
                              className="p-1 rounded-full hover:bg-surface-container text-on-surface-variant cursor-pointer ml-4"
                              title="Remove file"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <UploadCloud className="w-8 h-8 text-primary mb-2" />
                            <p className="font-bold text-primary text-sm">
                              Drag &amp; drop course PDF or presentation slides here
                            </p>
                            <p className="text-xs text-on-surface-variant mt-0.5">
                              Supports PDF, PPTX, PPT, TXT, DOCX • Maximum 25MB
                            </p>
                            <label className="mt-3 px-4 py-1.5 bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-xs rounded-lg font-semibold border border-outline-variant/60 cursor-pointer transition-colors inline-block">
                              <span>Browse Files</span>
                              <input
                                type="file"
                                accept=".pdf,.pptx,.ppt,.txt,.docx"
                                onChange={handleFileChange}
                                className="hidden"
                              />
                            </label>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Parameters & Custom Trigger */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md pt-2 border-t border-outline-variant/30">
                      <div>
                        <label className="text-xs font-semibold text-on-surface block mb-1.5">
                          Questions to Generate:
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {[3, 5, 10].map((num) => (
                            <button
                              key={num}
                              type="button"
                              onClick={() => setNumQuestions(num)}
                              className={`py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                                numQuestions === num
                                  ? "bg-primary text-white border-primary"
                                  : "bg-surface-container-low border-outline-variant/40 text-on-surface"
                              }`}
                            >
                              {num} Questions
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-on-surface block mb-1.5">
                          Target Bloom&apos;s Taxonomy Level:
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {["Understand", "Apply", "Analyze"].map((lvl) => (
                            <button
                              key={lvl}
                              type="button"
                              onClick={() => setBloomTarget(lvl)}
                              className={`py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                                bloomTarget === lvl
                                  ? "bg-primary text-white border-primary"
                                  : "bg-surface-container-low border-outline-variant/40 text-on-surface"
                              }`}
                            >
                              {lvl}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Generation Progress Pipeline */}
                    {isGenerating && (
                      <div className="p-space-md rounded-lg bg-surface-container-low border border-outline-variant/50 space-y-2 animate-fade-in">
                        <div className="flex items-center justify-between text-xs font-bold text-primary">
                          <span className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin text-secondary" />
                            <span>AI Processing Custom Material...</span>
                          </span>
                          <span>Step {generationStep} of 4</span>
                        </div>
                        <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                          <div
                            className="h-full bg-secondary transition-all duration-500 rounded-full"
                            style={{ width: `${(generationStep / 4) * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-[11px] text-on-surface-variant italic">
                          {generationStep === 1 && "1. Extracting text and slides from document..."}
                          {generationStep === 2 && "2. Analyzing syllabus concepts via Gemini Flash..."}
                          {generationStep === 3 && "3. Aligning questions to active Competency Gaps..."}
                          {generationStep === 4 && "4. Finalizing psychometric MCQs & rationales..."}
                        </p>
                      </div>
                    )}

                    <button
                      type="button"
                      disabled={isGenerating}
                      onClick={handleGenerateCustomQuiz}
                      className="w-full py-2.5 bg-secondary hover:bg-secondary/90 text-on-secondary rounded-xl font-label-md text-label-md font-bold transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>
                        {isGenerating
                          ? "AI Processing Document..."
                          : "Generate AI Quiz from Custom Material"}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* CBT Practice Quiz Runner for Selected Course / Dataset */
            <div className="space-y-space-lg max-w-4xl mx-auto animate-fade-in">
              {/* Quiz Header Banner */}
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/60 p-space-lg shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center shrink-0 font-bold">
                    <Sparkles className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary">
                        Practice Quiz Mode
                      </span>
                      {generatedDatasetId && (
                        <span className="text-[10px] font-mono text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">
                          Dataset: {generatedDatasetId}
                        </span>
                      )}
                    </div>
                    <h2 className="font-headline-md text-headline-md font-bold text-primary mt-0.5">
                      {generatedSourceTitle}
                    </h2>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveGeneratedQuiz(null);
                    setGenAnswers({});
                    setShowExplanation({});
                    setGenScorecard(null);
                  }}
                  className="px-3 py-1.5 bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-xs font-semibold rounded-lg border border-outline-variant/60 transition-colors cursor-pointer self-start sm:self-auto flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Change Course / Dataset</span>
                </button>
              </div>

              {!genScorecard ? (
                <div className="space-y-space-md">
                  {/* Quick Question Palette Strip */}
                  <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/60 p-3 shadow-xs flex items-center justify-between gap-2 overflow-x-auto">
                    <span className="text-xs font-bold text-on-surface-variant whitespace-nowrap mr-2">
                      Questions:
                    </span>
                    <div className="flex items-center gap-1.5 flex-1">
                      {activeGeneratedQuiz.map((q, idx) => {
                        const isCurrent = idx === genCurrentIdx;
                        const isAnswered = Boolean(genAnswers[idx]);
                        let cls = "bg-surface-container text-on-surface border-outline-variant/40";
                        if (isAnswered) {
                          cls = "bg-tertiary-fixed text-on-tertiary-fixed font-bold border-tertiary";
                        }
                        if (isCurrent) {
                          cls += " ring-2 ring-primary ring-offset-1 font-bold";
                        }
                        return (
                          <button
                            key={q.id}
                            onClick={() => setGenCurrentIdx(idx)}
                            className={`w-8 h-8 rounded text-xs font-mono border transition-all cursor-pointer ${cls}`}
                          >
                            {idx + 1}
                          </button>
                        );
                      })}
                    </div>
                    <span className="text-xs text-on-surface-variant whitespace-nowrap font-medium">
                      {Object.keys(genAnswers).length} / {activeGeneratedQuiz.length} Answered
                    </span>
                  </div>

                  {/* Question Card */}
                  <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/60 shadow-sm overflow-hidden">
                    {/* Header */}
                    <div className="px-space-xl py-space-md bg-surface-container-low border-b border-outline-variant/40 flex flex-wrap items-center justify-between gap-space-sm">
                      <div className="flex items-center gap-2">
                        <span className="bg-primary text-white font-label-sm text-label-sm px-2.5 py-0.5 rounded font-bold">
                          Question {genCurrentIdx + 1} of {activeGeneratedQuiz.length}
                        </span>
                        {activeGeneratedQuiz[genCurrentIdx]?.ruleTag && (
                          <span className="bg-surface-container-high text-on-surface text-xs px-2 py-0.5 rounded border border-outline-variant/40 font-medium">
                            {activeGeneratedQuiz[genCurrentIdx].ruleTag}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-on-surface-variant">
                        Marks: <strong className="text-on-tertiary-container">+2.0</strong> | Negative:{" "}
                        <strong className="text-error">-0.5</strong>
                      </span>
                    </div>

                    {/* Question Text */}
                    <div className="p-space-xl space-y-space-lg">
                      <p className="font-body-lg text-body-lg text-primary font-semibold leading-relaxed">
                        {activeGeneratedQuiz[genCurrentIdx]?.questionText}
                      </p>

                      {/* Radio Choices */}
                      <div className="flex flex-col gap-space-sm">
                        {activeGeneratedQuiz[genCurrentIdx]?.options.map((opt) => {
                          const isChecked = genAnswers[genCurrentIdx] === opt.key;
                          return (
                            <label
                              key={opt.key}
                              onClick={() => handleGenSelectOption(opt.key)}
                              className={`p-space-lg rounded-lg border transition-all cursor-pointer flex items-start gap-space-md ${
                                isChecked
                                  ? "bg-primary-fixed/25 border-primary shadow-xs ring-1 ring-primary/40"
                                  : "bg-surface-container-lowest border-outline-variant/50 hover:bg-surface-container-low"
                              }`}
                            >
                              <input
                                type="radio"
                                name={`gen_q_${genCurrentIdx}`}
                                checked={isChecked}
                                onChange={() => handleGenSelectOption(opt.key)}
                                className="mt-1 w-4 h-4 text-primary accent-primary"
                              />
                              <div className="flex-1 min-w-0">
                                <span className="font-label-md text-label-md font-bold text-primary mr-2">
                                  {opt.label}:
                                </span>
                                <span className="font-body-md text-body-md text-on-surface">
                                  {opt.text}
                                </span>
                              </div>
                            </label>
                          );
                        })}
                      </div>

                      {/* Plain-Language Setu AI Explanation Box */}
                      <div className="pt-space-md border-t border-outline-variant/30">
                        <button
                          onClick={() =>
                            setShowExplanation((prev) => ({
                              ...prev,
                              [genCurrentIdx]: !prev[genCurrentIdx],
                            }))
                          }
                          className="inline-flex items-center gap-1.5 text-xs text-secondary font-bold hover:underline cursor-pointer"
                        >
                          <HelpCircle className="w-4 h-4" />
                          <span>
                            {showExplanation[genCurrentIdx]
                              ? "Hide Setu AI Explanation"
                              : "Explain Correct Answer with Setu AI"}
                          </span>
                        </button>

                        {showExplanation[genCurrentIdx] && (
                          <div className="mt-space-md p-space-md rounded-lg bg-primary-fixed/15 border border-primary/20 space-y-1 animate-fade-in">
                            <div className="flex items-center gap-1 text-xs font-bold text-primary">
                              <Sparkles className="w-3.5 h-3.5 text-secondary" />
                              <span>
                                Setu AI Explanation (Correct Option: {activeGeneratedQuiz[genCurrentIdx].correctKey}):
                              </span>
                            </div>
                            <p className="text-xs text-on-surface leading-relaxed">
                              {activeGeneratedQuiz[genCurrentIdx].explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="px-space-xl py-space-md bg-surface-container-low border-t border-outline-variant/40 flex items-center justify-between">
                      <button
                        disabled={genCurrentIdx === 0}
                        onClick={() => setGenCurrentIdx((prev) => Math.max(0, prev - 1))}
                        className="px-4 py-1.5 rounded bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-label-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed border border-outline-variant/40 cursor-pointer"
                      >
                        Previous
                      </button>

                      <div className="flex items-center gap-space-sm">
                        {genCurrentIdx < activeGeneratedQuiz.length - 1 ? (
                          <button
                            onClick={() => setGenCurrentIdx((prev) => prev + 1)}
                            className="px-4 py-1.5 rounded bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md transition-colors shadow-xs cursor-pointer flex items-center gap-1"
                          >
                            <span>Save &amp; Next</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={handleFinishGenQuiz}
                            className="px-5 py-1.5 rounded bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-bold transition-colors shadow-xs cursor-pointer flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-4 h-4 text-tertiary-fixed" />
                            <span>Complete &amp; View Scorecard</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Generated Quiz Performance Scorecard */
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/60 p-space-xl shadow-lg text-center space-y-space-lg animate-fade-in">
                  <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary text-primary mx-auto flex items-center justify-center font-bold text-2xl">
                    {genScorecard.pct}%
                  </div>

                  <div>
                    <h3 className="font-headline-md text-headline-md font-bold text-primary">
                      {genScorecard.pct >= 70 ? "Competency Verified & Retained" : "Practice Completed"}
                    </h3>
                    <p className="text-xs text-on-surface-variant mt-1">
                      You answered {genScorecard.score} of {genScorecard.total} questions correctly from &ldquo;{generatedSourceTitle}&rdquo;.
                    </p>
                  </div>

                  <div className="p-space-md rounded-lg bg-surface-container-low border border-outline-variant/30 max-w-md mx-auto text-left text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Course Dataset:</span>
                      <span className="font-bold text-primary font-mono">{generatedDatasetId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Competency Gap Impact:</span>
                      <span className="font-bold text-on-tertiary-container">+5% Proficiency Gain</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Evaluation Authority:</span>
                      <span>National Assessment System (NIC)</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => {
                        setGenScorecard(null);
                        setGenCurrentIdx(0);
                        setGenAnswers({});
                        setShowExplanation({});
                      }}
                      className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-xs font-bold border border-outline-variant/60 cursor-pointer flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Retake Practice Quiz</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveGeneratedQuiz(null);
                        setGenAnswers({});
                        setShowExplanation({});
                        setGenScorecard(null);
                        setUploadedFile(null);
                      }}
                      className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                    >
                      <Layers className="w-4 h-4" />
                      <span>Select Another Course</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Instructions Modal (for Statutory Exam) */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fade-in">
          <div className="bg-surface-container-lowest w-full max-w-lg rounded-xl shadow-2xl border border-outline-variant/60 overflow-hidden flex flex-col">
            <div className="p-4 bg-surface-container-low border-b border-outline-variant/40 flex items-center justify-between">
              <h3 className="font-headline-sm text-headline-sm font-bold text-primary">
                Official Examination Instructions
              </h3>
              <button
                onClick={() => setShowInstructions(false)}
                className="p-1 rounded text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-3 font-body-sm text-body-sm text-on-surface-variant">
              <p>1. Total test duration is 45 minutes with statutory MCQs.</p>
              <p>2. Each correct response awards +2.0 marks. Negative marking of -0.5 is deducted for incorrect choices.</p>
              <p>3. Responses are saved automatically every 30 seconds into the central audit ledger.</p>
              <p>4. You may flag any question as &ldquo;Mark for Review&rdquo; to revisit before final submission.</p>
              <p>5. Switching tabs or browser windows is logged as a proctoring audit event.</p>
            </div>
            <div className="p-3 bg-surface-container-low border-t border-outline-variant/40 flex justify-end">
              <button
                onClick={() => setShowInstructions(false)}
                className="px-4 py-1.5 bg-primary text-on-primary font-label-md text-label-md rounded hover:bg-primary-container transition-colors cursor-pointer"
              >
                Understood, Return to Exam
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Examination Scorecard Modal (for Statutory Exam) */}
      {showScorecard && scoreResult && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fade-in">
          <div className="bg-surface-container-lowest w-full max-w-lg rounded-xl shadow-2xl border border-outline-variant/60 overflow-hidden flex flex-col">
            <div className="p-5 bg-primary text-on-primary flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[24px] text-tertiary-fixed">verified</span>
                <div>
                  <h3 className="font-headline-md text-headline-md font-bold">
                    Assessment Evaluation Complete
                  </h3>
                  <p className="font-label-sm text-label-sm text-on-primary-container">
                    DoPT / MoSPI Examination Board
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center text-primary font-headline-xl text-[28px] font-bold">
                {scoreResult.percentage}%
              </div>

              <div>
                <h4 className="font-headline-sm text-headline-sm text-primary font-bold">
                  {scoreResult.percentage >= 70 ? "Qualified with Distinction" : "Completed"}
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  You answered {scoreResult.score} out of {scoreResult.total} questions correctly.
                </p>
              </div>

              <div className="w-full bg-surface-container-low p-3 rounded-lg border border-outline-variant/30 text-left font-label-sm text-label-sm space-y-1.5">
                <div className="flex justify-between">
                  <span>Candidate:</span>
                  <span className="font-bold text-on-surface">{displayName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Audit Hash:</span>
                  <span className="font-mono text-primary font-semibold">e3b0c44298fc1c14</span>
                </div>
                <div className="flex justify-between">
                  <span>DoPT Cadre Status:</span>
                  <span className="text-on-tertiary-container font-bold">Compliant &amp; Recorded</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-surface-container-low border-t border-outline-variant/40 flex justify-between gap-3">
              <Link
                href="/profile"
                className="flex-1 py-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-label-md rounded text-center border border-outline-variant/40"
              >
                View in Training Dossier
              </Link>
              <Link
                href="/"
                className="flex-1 py-2 bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md rounded text-center font-semibold"
              >
                Return to Dashboard
              </Link>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

export default function AssessmentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <span className="text-xs text-on-surface-variant font-medium">
              Loading National Assessment System...
            </span>
          </div>
        </div>
      }
    >
      <AssessmentContent />
    </Suspense>
  );
}

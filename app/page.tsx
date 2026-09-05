"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { AppShell } from "@/components/AppShell";
import { CompetencyRadarChart } from "@/components/CompetencyRadarChart";
import { useAuth } from "@/components/AuthContext";
import { useLanguage } from "@/components/LanguageContext";
import { Sparkles } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface CompetencyGap {
  id: number;
  officer_id: number;
  domain: string;
  description: string;
  severity: string;
  reason_text: string;
  status: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [openGaps, setOpenGaps] = useState<CompetencyGap[]>([]);
  const [searchModule, setSearchModule] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [showRadarModal, setShowRadarModal] = useState(false);
  const [showDossierModal, setShowDossierModal] = useState(false);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    async function fetchGaps() {
      try {
        const res = await axios.get(`${API_BASE_URL}/officers/1/gaps`);
        if (Array.isArray(res.data)) {
          setOpenGaps(res.data);
        }
      } catch {
        // Fallback gracefully
      }
    }
    fetchGaps();
  }, []);

  const trainingModules = [
    {
      id: "FIN-GFR-2017-V4",
      courseCode: "FIN-GFR-2017",
      title: "General Financial Rules (GFR 2017) & Delegation of Financial Powers",
      meta: "Code: FIN-GFR-2017-V4 • 8 Credit Hours • DoE Certified",
      category: "Finance & Accounts",
      icon: "account_balance_wallet",
      progress: 65,
      units: "13/20 Units",
      status: "In Progress",
      statusType: "secondary",
      lastAccessed: "22 Apr 2025, 18:30 IST",
      href: "/assessment?course=FIN-GFR-2017",
    },
    {
      id: "GOV-CYB-2024-DPD",
      courseCode: "GOV-CYB-2024",
      title: "Cyber Security & Digital Personal Data Protection Act (DPDPA 2023)",
      meta: "Code: GOV-CYB-2024-DPD • 6 Credit Hours • MeitY Standard",
      category: "e-Governance",
      icon: "lock",
      progress: 40,
      units: "6/15 Units",
      status: "In Progress",
      statusType: "secondary",
      lastAccessed: "21 Apr 2025, 11:15 IST",
      href: "/assessment?course=GOV-CYB-2024",
    },
    {
      id: "ADM-VIG-2023-CVC",
      courseCode: "ADM-VIG-2023",
      title: "Vigilance Administration & Disciplinary Proceedings",
      meta: "Code: ADM-VIG-2023-CVC • 10 Credit Hours • CVC Guidelines",
      category: "Personnel Admin",
      icon: "gavel",
      progress: 15,
      units: "3/20 Units",
      status: "Commenced",
      statusType: "outline",
      lastAccessed: "18 Apr 2025, 14:20 IST",
      href: "/assessment?course=ADM-VIG-2023",
    },
    {
      id: "LEG-RTI-2005-CIC",
      courseCode: "LEG-RTI-2005",
      title: "Right to Information (RTI Act 2005) - Appellate Jurisdiction",
      meta: "Code: LEG-RTI-2005-CIC • 5 Credit Hours • CIC Standard",
      category: "Legal & Regulatory",
      icon: "policy",
      progress: 85,
      units: "17/20 Units",
      status: "In Progress",
      statusType: "secondary",
      lastAccessed: "15 Apr 2025, 09:45 IST",
      href: "/assessment?course=LEG-RTI-2005",
    },
  ];

  const filteredModules = trainingModules.filter((mod) => {
    const matchesSearch =
      mod.title.toLowerCase().includes(searchModule.toLowerCase()) ||
      mod.id.toLowerCase().includes(searchModule.toLowerCase());
    const matchesCat =
      selectedCategory === "All Categories" || mod.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const displayName = user?.fullName || "Shri Rajesh Sharma, IAS";
  const displayCadre = user?.role === "Officer" ? "Cadre: AGMUT" : "Cadre: MoSPI / NSSTA";
  const officerCode = "GOI-IAS-2012-4891";

  return (
    <AppShell>
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary text-on-primary px-4 py-3 rounded shadow-xl border border-outline-variant/40 flex items-center gap-2 font-label-md animate-fade-in">
          <span className="material-symbols-outlined text-[18px] text-tertiary-fixed">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="flex flex-col gap-space-xl">
        {/* Officer Cadre Dossier Masthead */}
        <div className="bg-surface-container-lowest rounded shadow-sm overflow-hidden border border-outline-variant/40">
          <div className="bg-surface-container-low px-space-xl py-space-md flex flex-wrap items-center justify-between gap-space-sm border-b border-outline-variant/30">
            <div className="flex items-center gap-space-sm">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-tertiary-fixed-dim ring-2 ring-tertiary-container/20"></span>
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-bold">
                Official Civil Services Workspace
              </span>
              <span className="text-outline-variant/60">•</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                Authenticated Session via NIC Jan Parichay SSO
              </span>
            </div>
            <div className="flex items-center gap-space-md">
              <span className="font-label-sm text-label-sm text-on-surface-variant">Last Login: 23 Apr 2025, 09:14 IST</span>
              <span className="bg-surface-container-highest text-on-surface font-label-sm text-label-sm px-2 py-0.5 rounded font-semibold border border-outline-variant/40">
                IP: 10.244.18.92 (NIC-NET)
              </span>
            </div>
          </div>

          <div className="p-space-xl flex flex-col lg:flex-row lg:items-center justify-between gap-space-xl">
            <div className="flex items-start gap-space-lg">
              <div className="relative shrink-0">
                {/* Official Officer Portrait */}
                <img
                  className="w-20 h-20 rounded object-cover shadow-sm border border-outline-variant/50"
                  alt="Official civil services officer portrait"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgoDicO--EVB3CPni3fl_f_xpALjc2-qavotiLjyBAnmF1WGUm4YJBRcpI3ZgEgrCGOU0XdQk6gVHB5cpT9zMkiTwmzjh33V9cTmkpFYYLK7Sjt7Sb5uiZ5eTX-AcNhPey_Lfk4wRaJ8ylGvRiAguJgjmlKRIYagq6h5h-JiUJgcZKTmg5X1jk9RROaWkQNRtxNKzqIgV2QhtXuEg3NzbwN65U-hhDHg0Wn5virq_AWr9Gzs82f50q7g"
                />
                <div
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded bg-primary text-on-primary flex items-center justify-center text-[12px] shadow-sm"
                  title="Verified Senior Administrator"
                >
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                </div>
              </div>

              <div className="flex flex-col gap-space-xxs">
                <div className="flex flex-wrap items-center gap-space-sm">
                  <h1 className="font-headline-xl text-headline-xl text-primary tracking-tight">
                    Good morning, {displayName}
                  </h1>
                  <span className="bg-primary/10 text-primary font-label-sm text-label-sm px-2.5 py-0.5 rounded font-bold tracking-wide uppercase">
                    {displayCadre}
                  </span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Officer ID: <span className="font-semibold text-on-surface">{officerCode}</span> | {displayCadre} | Ministry of Personnel, Public Grievances &amp; Pensions &bull; MoSPI
                </p>
                <div className="flex flex-wrap items-center gap-space-md pt-space-xs text-on-surface-variant font-label-sm text-label-sm">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-primary">domain</span>
                    North Block, New Delhi
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-secondary">workspace_premium</span>
                    13 Yrs Commissioned Service
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-on-tertiary-container">security</span>
                    Level-14 Apex Security Clearance
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-sm shrink-0">
              <button
                onClick={() => setShowRadarModal(true)}
                className="bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-label-md px-space-lg py-2 rounded flex items-center justify-center gap-space-xs transition-colors border border-outline-variant/40 cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">radar</span>
                <span>Competency Radar</span>
              </button>
              <Link
                href="/assessment?tab=generator"
                className="bg-secondary text-white hover:bg-secondary/90 font-label-md text-label-md px-space-lg py-2 rounded flex items-center justify-center gap-space-xs transition-colors shadow-xs cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>Upload &amp; Generate Quiz</span>
              </Link>
              <button
                onClick={() => triggerToast("Generating official authenticated Quarterly Dossier Report (PDF)...")}
                className="bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md px-space-lg py-2 rounded flex items-center justify-center gap-space-xs transition-colors shadow-sm cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                <span>Quarterly Dossier Report</span>
              </button>
            </div>
          </div>

          {/* Statutory Notice Banner */}
          <div className="bg-secondary-fixed/40 px-space-xl py-space-md flex items-center gap-space-md border-t border-outline-variant/30">
            <div className="w-8 h-8 rounded bg-secondary text-on-secondary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">campaign</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
                <p className="font-body-md text-body-md text-on-secondary-fixed font-medium truncate">
                  <span className="font-bold text-secondary">Gazette Circular OM-32/2025:</span> Mandatory Quarterly Assessment on General Financial Rules (GFR 2017) &amp; GeM Procurement guidelines window closes on <span className="font-bold underline">30 April 2025</span>.
                </p>
                <Link
                  href="/assessment"
                  className="inline-flex items-center gap-1 text-secondary font-label-md text-label-md font-bold hover:underline shrink-0"
                >
                  Start Assessment Now
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Institutional Key Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-base">
          {/* Metric 1 */}
          <div className="bg-surface-container-lowest p-space-lg rounded shadow-sm border border-outline-variant/40 flex flex-col justify-between hover:bg-surface-container-low transition-colors">
            <div className="flex items-center justify-between gap-space-sm mb-space-sm">
              <span className="font-label-sm text-label-sm uppercase font-bold text-on-surface-variant tracking-wider">
                {t("active_modules", "Assigned Courses")}
              </span>
              <div className="w-7 h-7 rounded bg-surface-container text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[16px]">menu_book</span>
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-space-xs">
                <span className="font-headline-xl text-headline-xl text-primary font-bold">6</span>
                <span className="font-headline-sm text-headline-sm text-on-surface-variant">{t("active_modules", "Active Modules")}</span>
              </div>
              <p className="font-label-sm text-label-sm text-on-surface-variant mt-space-xs">
                <span className="font-semibold text-secondary">2 Mandated</span> by Cadre Authority, 4 Departmental
              </p>
            </div>
            <div className="mt-space-md pt-space-sm bg-surface-container-low/50 -mx-space-lg -mb-space-lg px-space-lg py-2 flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm border-t border-outline-variant/30">
              <span>Cadre Quota: Mandatory</span>
              <span className="font-semibold text-primary">Priority High</span>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="bg-surface-container-lowest p-space-lg rounded shadow-sm border border-outline-variant/40 flex flex-col justify-between hover:bg-surface-container-low transition-colors">
            <div className="flex items-center justify-between gap-space-sm mb-space-sm">
              <span className="font-label-sm text-label-sm uppercase font-bold text-on-surface-variant tracking-wider">
                {t("completed_curricula", "Completed Courses")}
              </span>
              <div className="w-7 h-7 rounded bg-surface-container text-on-tertiary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-[16px]">task_alt</span>
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-space-xs">
                <span className="font-headline-xl text-headline-xl text-on-surface font-bold">14</span>
                <span className="font-headline-sm text-headline-sm text-on-surface-variant">Modules</span>
              </div>
              <p className="font-label-sm text-label-sm text-on-surface-variant mt-space-xs">
                Cumulative FY 2024-25 Training Target: <span className="font-semibold text-on-surface">12 Required</span>
              </p>
            </div>
            <div className="mt-space-md pt-space-sm bg-surface-container-low/50 -mx-space-lg -mb-space-lg px-space-lg py-2 flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm border-t border-outline-variant/30">
              <span>{t("target_attainment", "Target Attainment")}</span>
              <span className="font-bold text-on-tertiary-container">+116.6% Surplus</span>
            </div>
          </div>

          {/* Metric 3 */}
          <div className="bg-surface-container-lowest p-space-lg rounded shadow-sm border border-outline-variant/40 flex flex-col justify-between hover:bg-surface-container-low transition-colors">
            <div className="flex items-center justify-between gap-space-sm mb-space-sm">
              <span className="font-label-sm text-label-sm uppercase font-bold text-on-surface-variant tracking-wider">
                {t("pending_assessments", "Pending Assessments")}
              </span>
              <div className="w-7 h-7 rounded bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center">
                <span className="material-symbols-outlined text-[16px]">pending_actions</span>
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-space-xs">
                <span className="font-headline-xl text-headline-xl text-secondary font-bold">2</span>
                <span className="font-headline-sm text-headline-sm text-on-surface-variant">{t("due_this_month", "Due this month")}</span>
              </div>
              <p className="font-label-sm text-label-sm text-error font-semibold mt-space-xs flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">alarm</span>
                {t("statutory_deadline", "Next statutory deadline in 4 days")}
              </p>
            </div>
            <div className="mt-space-md pt-space-sm bg-surface-container-low/50 -mx-space-lg -mb-space-lg px-space-lg py-2 flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm border-t border-outline-variant/30">
              <span>GFR &amp; AIS Conduct Rules</span>
              <span className="font-semibold text-secondary">Slot Assigned</span>
            </div>
          </div>

          {/* Metric 4 */}
          <div className="bg-surface-container-lowest p-space-lg rounded shadow-sm border border-outline-variant/40 flex flex-col justify-between hover:bg-surface-container-low transition-colors">
            <div className="flex items-center justify-between gap-space-sm mb-space-sm">
              <span className="font-label-sm text-label-sm uppercase font-bold text-on-surface-variant tracking-wider">
                {t("compliance_index", "Compliance Index")}
              </span>
              <div className="w-7 h-7 rounded bg-surface-container-high text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[16px]">insights</span>
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-space-xs">
                <span className="font-headline-xl text-headline-xl text-primary font-bold">88.4%</span>
                <span className="font-headline-sm text-headline-sm text-on-tertiary-container font-semibold">{t("grade_a", "Grade A")}</span>
              </div>
              <p className="font-label-sm text-label-sm text-on-surface-variant mt-space-xs">
                Exemplary Service Record (PAR Linked)
              </p>
            </div>
            <div className="mt-space-md pt-space-sm bg-surface-container-low/50 -mx-space-lg -mb-space-lg px-space-lg py-2 flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm border-t border-outline-variant/30">
              <span>{t("evaluation_status", "Evaluation Status")}</span>
              <span className="font-bold text-primary">{t("dopt_verified", "DoPT Verified")}</span>
            </div>
          </div>
        </div>

        {/* Section 1: Continue Training (Dense Administrative Table) */}
        <div className="bg-surface-container-lowest rounded shadow-sm overflow-hidden flex flex-col border border-outline-variant/40">
          <div className="p-space-lg bg-surface-container-low flex flex-col md:flex-row md:items-center justify-between gap-space-md border-b border-outline-variant/30">
            <div className="flex flex-col">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-[20px]">play_circle</span>
                <h2 className="font-headline-md text-headline-md text-primary tracking-tight">
                  Continue Training Modules
                </h2>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Official in-service competency curriculum mapped under Mission Karmayogi &amp; National Training Policy.
              </p>
            </div>

            {/* Table Search & Filters */}
            <div className="flex flex-wrap items-center gap-space-xs">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-2.5 top-2 text-outline text-[18px]">search</span>
                <input
                  value={searchModule}
                  onChange={(e) => setSearchModule(e.target.value)}
                  className="bg-surface-container-lowest border border-outline-variant/50 text-on-surface text-body-sm pl-8 pr-3 py-1.5 rounded w-64 focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-outline"
                  placeholder="Search module code or title..."
                  type="text"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-surface-container-lowest border border-outline-variant/50 text-on-surface text-body-sm px-3 py-1.5 rounded focus:outline-none focus:ring-2 focus:ring-primary/20 font-label-md"
              >
                <option>All Categories</option>
                <option>Finance &amp; Accounts</option>
                <option>e-Governance</option>
                <option>Personnel Admin</option>
                <option>Legal &amp; Regulatory</option>
              </select>
              <button
                onClick={() => { setSearchModule(""); setSelectedCategory("All Categories"); }}
                className="bg-surface-container-high hover:bg-surface-container-highest text-on-surface p-1.5 rounded border border-outline-variant/40 cursor-pointer"
                title="Reset Filters"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">tune</span>
              </button>
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/70 text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider border-b border-outline-variant/30">
                  <th className="py-space-md px-space-lg">Module Code &amp; Title</th>
                  <th className="py-space-md px-space-md">Cadre / Department</th>
                  <th className="py-space-md px-space-md w-48">Progress (%)</th>
                  <th className="py-space-md px-space-md">Current Status</th>
                  <th className="py-space-md px-space-md">Last Accessed</th>
                  <th className="py-space-md px-space-lg text-right">Administrative Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container font-body-sm text-body-sm text-on-surface">
                {filteredModules.map((mod) => (
                  <tr key={mod.id} className="hover:bg-surface-container-low/40 transition-colors">
                    <td className="py-space-md px-space-lg">
                      <div className="flex items-start gap-space-sm">
                        <span className="w-8 h-8 rounded bg-surface-container-high text-primary flex items-center justify-center shrink-0 mt-0.5">
                          <span className="material-symbols-outlined text-[18px]">{mod.icon}</span>
                        </span>
                        <div className="flex flex-col">
                          <span className="font-headline-sm text-headline-sm text-primary font-semibold">
                            {mod.title}
                          </span>
                          <span className="font-label-sm text-label-sm text-on-surface-variant">
                            {mod.meta}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-space-md px-space-md">
                      <span className="bg-surface-container-high text-on-surface font-label-sm text-label-sm px-2 py-0.5 rounded font-medium border border-outline-variant/40">
                        {mod.category}
                      </span>
                    </td>
                    <td className="py-space-md px-space-md">
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-center font-label-sm text-label-sm">
                          <span className="font-semibold text-primary">{mod.progress}% Completed</span>
                          <span className="text-on-surface-variant">{mod.units}</span>
                        </div>
                        <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-300"
                            style={{ width: `${mod.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-space-md px-space-md">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-label-sm font-label-sm font-semibold ${
                          mod.statusType === "secondary"
                            ? "bg-secondary-fixed text-on-secondary-fixed"
                            : "bg-surface-container-highest text-on-surface"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            mod.statusType === "secondary" ? "bg-secondary" : "bg-outline"
                          }`}
                        ></span>
                        {mod.status}
                      </span>
                    </td>
                    <td className="py-space-md px-space-md font-label-sm text-label-sm text-on-surface-variant">
                      {mod.lastAccessed}
                    </td>
                    <td className="py-space-md px-space-lg text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/assessment?course=${mod.courseCode}`}
                          className="bg-secondary/15 hover:bg-secondary/25 text-secondary font-label-md text-xs px-2.5 py-1.5 rounded inline-flex items-center gap-1 transition-colors border border-secondary/30 font-bold"
                          title="Instant Practice Quiz from Pre-fetched Dataset"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Practice Quiz</span>
                        </Link>
                        <Link
                          href={mod.href}
                          className="bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md px-space-md py-1.5 rounded inline-flex items-center gap-1 transition-colors shadow-xs"
                        >
                          <span>Continue Module</span>
                          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-space-md bg-surface-container-low/50 flex flex-col sm:flex-row items-center justify-between gap-space-sm font-label-sm text-label-sm text-on-surface-variant border-t border-outline-variant/30">
            <span>Displaying {filteredModules.length} active in-service modules</span>
            <div className="flex items-center gap-space-xs">
              <span className="px-2 font-bold text-primary">Page 1 of 1</span>
            </div>
          </div>
        </div>

        {/* Section 2: Two Column Split (Upcoming Assessments & Official Activity Log) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
          {/* Left Column: Upcoming Official Assessments (7 Cols) */}
          <div className="lg:col-span-7 bg-surface-container-lowest rounded shadow-sm overflow-hidden flex flex-col border border-outline-variant/40">
            <div className="p-space-lg bg-surface-container-low flex items-center justify-between gap-space-md border-b border-outline-variant/30">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-[20px]">quiz</span>
                <div>
                  <h3 className="font-headline-md text-headline-md text-primary tracking-tight">
                    Upcoming Official Assessments
                  </h3>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">
                    Mandatory proctored examinations under National Institute of Good Governance / NSSTA
                  </p>
                </div>
              </div>
              <span className="bg-primary text-on-primary font-label-sm text-label-sm px-2 py-0.5 rounded font-bold">
                2 Due
              </span>
            </div>
            <div className="divide-y divide-surface-container">
              {/* Assessment Item 1 */}
              <div className="p-space-lg hover:bg-surface-container-low/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
                <div className="flex flex-col gap-space-xxs min-w-0">
                  <div className="flex items-center gap-space-sm flex-wrap">
                    <h4 className="font-headline-sm text-headline-sm text-primary truncate font-bold">
                      GFR 2017 &amp; GeM Public Procurement Compliance
                    </h4>
                    <span className="bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm px-2 py-0.25 rounded font-bold">
                      Admit Card Ready
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-space-md text-on-surface-variant font-label-sm text-label-sm mt-1">
                    <span className="flex items-center gap-1 font-semibold text-secondary">
                      <span className="material-symbols-outlined text-[14px]">event</span>
                      Scheduled: 25 Apr 2025
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">timer</span>
                      Duration: 45 Mins
                    </span>
                    <span>•</span>
                    <span>50 MCQs + 2 Case Inquiries</span>
                  </div>
                </div>
                <div className="shrink-0">
                  <Link
                    href="/assessment"
                    className="w-full sm:w-auto bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md px-space-lg py-2 rounded flex items-center justify-center gap-1 transition-colors shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                    <span>Start Assessment</span>
                  </Link>
                </div>
              </div>

              {/* Assessment Item 2 */}
              <div className="p-space-lg hover:bg-surface-container-low/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
                <div className="flex flex-col gap-space-xxs min-w-0">
                  <div className="flex items-center gap-space-sm flex-wrap">
                    <h4 className="font-headline-sm text-headline-sm text-primary truncate font-bold">
                      All India Service (Conduct) Rules Evaluation
                    </h4>
                    <span className="bg-surface-container-high text-on-surface font-label-sm text-label-sm px-2 py-0.25 rounded font-bold">
                      Enrollment Verified
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-space-md text-on-surface-variant font-label-sm text-label-sm mt-1">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">event</span>
                      Scheduled: 02 May 2025
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">timer</span>
                      Duration: 30 Mins
                    </span>
                    <span>•</span>
                    <span>Qualifying Cut-off: 75%</span>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <Link
                    href="/assessment?course=ADM-VIG-2023"
                    className="w-full sm:w-auto bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md px-space-lg py-2 rounded flex items-center justify-center gap-1 transition-colors shadow-xs"
                  >
                    <Sparkles className="w-4 h-4 text-secondary" />
                    <span>Practice Quiz</span>
                  </Link>
                  <button
                    onClick={() => triggerToast("Opening syllabus for All India Service (Conduct) Rules...")}
                    className="w-full sm:w-auto bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-label-md px-space-md py-2 rounded flex items-center justify-center gap-1 transition-colors border border-outline-variant/40 cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[16px]">menu_book</span>
                    <span>Syllabus</span>
                  </button>
                </div>
              </div>

              {/* Assessment Item 3 */}
              <div className="p-space-lg hover:bg-surface-container-low/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
                <div className="flex flex-col gap-space-xxs min-w-0">
                  <div className="flex items-center gap-space-sm flex-wrap">
                    <h4 className="font-headline-sm text-headline-sm text-primary truncate font-bold">
                      E-Office 7.0 File Management Competency Test
                    </h4>
                    <span className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm px-2 py-0.25 rounded font-bold">
                      Upcoming
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-space-md text-on-surface-variant font-label-sm text-label-sm mt-1">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">event</span>
                      Scheduled: 10 May 2025
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">timer</span>
                      Duration: 40 Mins
                    </span>
                    <span>•</span>
                    <span>Simulated Hands-on Exercise</span>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <Link
                    href="/assessment?course=GOV-CYB-2024"
                    className="w-full sm:w-auto bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md px-space-lg py-2 rounded flex items-center justify-center gap-1 transition-colors shadow-xs"
                  >
                    <Sparkles className="w-4 h-4 text-secondary" />
                    <span>Practice Quiz</span>
                  </Link>
                  <button
                    onClick={() => triggerToast("Opening guidelines for E-Office 7.0 competency test...")}
                    className="w-full sm:w-auto bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-label-md px-space-md py-2 rounded flex items-center justify-center gap-1 transition-colors border border-outline-variant/40 cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[16px]">article</span>
                    <span>Guidelines</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="p-space-md bg-surface-container-low/50 flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm border-t border-outline-variant/30">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-on-tertiary-container">check_circle</span>
                System webcam and microphone check verified for proctored testing.
              </span>
              <Link className="text-primary font-bold hover:underline" href="/assessment">
                Assessment Archive &rarr;
              </Link>
            </div>
          </div>

          {/* Right Column: Recent Official Activity Log (5 Cols) */}
          <div className="lg:col-span-5 bg-surface-container-lowest rounded shadow-sm overflow-hidden flex flex-col border border-outline-variant/40">
            <div className="p-space-lg bg-surface-container-low flex items-center justify-between gap-space-md border-b border-outline-variant/30">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-[20px]">history_edu</span>
                <div>
                  <h3 className="font-headline-md text-headline-md text-primary tracking-tight">
                    Recent Official Activity Log
                  </h3>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">
                    Immutable Audit Trail (NIC Log No: 88219/2025)
                  </p>
                </div>
              </div>
              <button
                onClick={() => triggerToast("Exporting audit activity ledger (CSV)...")}
                className="text-primary hover:text-primary-container p-1 rounded hover:bg-surface-container cursor-pointer"
                title="Export log report"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">receipt_long</span>
              </button>
            </div>

            {/* Timeline Log List */}
            <div className="p-space-lg flex flex-col gap-space-lg">
              {/* Event 1 */}
              <div className="flex items-start gap-space-md">
                <div className="w-8 h-8 rounded bg-surface-container text-on-tertiary-container flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                </div>
                <div className="flex flex-col gap-space-xxs min-w-0">
                  <span className="font-label-lg text-label-lg text-on-surface font-semibold">Completed Module</span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Digital India Land Records Modernization Programme (DILRMP)
                  </p>
                  <div className="flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant mt-0.5">
                    <span className="material-symbols-outlined text-[13px]">schedule</span>
                    <span>20 Apr 2025, 16:45 IST</span>
                    <span>•</span>
                    <span className="text-on-tertiary-container font-semibold">Score: 96%</span>
                  </div>
                </div>
              </div>

              {/* Event 2 */}
              <div className="flex items-start gap-space-md">
                <div className="w-8 h-8 rounded bg-surface-container text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[18px]">fact_check</span>
                </div>
                <div className="flex flex-col gap-space-xxs min-w-0">
                  <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                    Official Assessment Score Recorded
                  </span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Constitutional Law &amp; Federal Relations — <span className="font-bold text-primary">Score: 92%</span> (Rank 4 / National Batch)
                  </p>
                  <div className="flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant mt-0.5">
                    <span className="material-symbols-outlined text-[13px]">schedule</span>
                    <span>14 Apr 2025, 11:20 IST</span>
                    <span>•</span>
                    <span className="font-semibold text-primary">Certified</span>
                  </div>
                </div>
              </div>

              {/* Event 3 */}
              <div className="flex items-start gap-space-md">
                <div className="w-8 h-8 rounded bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
                </div>
                <div className="flex flex-col gap-space-xxs min-w-0">
                  <span className="font-label-lg text-label-lg text-on-surface font-semibold">Certificate Digitally Issued</span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Public Policy Formulation &amp; Governance (Digitally Signed via e-Sign NIC)
                  </p>
                  <div className="flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant mt-0.5">
                    <span className="material-symbols-outlined text-[13px]">schedule</span>
                    <span>08 Apr 2025, 14:10 IST</span>
                    <span>•</span>
                    <button
                      onClick={() => triggerToast("Downloading digitally signed QR-PDF certificate...")}
                      className="text-secondary font-semibold hover:underline cursor-pointer"
                    >
                      Download QR-PDF
                    </button>
                  </div>
                </div>
              </div>

              {/* Event 4 */}
              <div className="flex items-start gap-space-md">
                <div className="w-8 h-8 rounded bg-surface-container text-outline flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
                </div>
                <div className="flex flex-col gap-space-xxs min-w-0">
                  <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                    Cadre Authority Nomination
                  </span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Enrolled in Special Refresher Programme for Joint Secretaries (MHA / DoPT)
                  </p>
                  <div className="flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant mt-0.5">
                    <span className="material-symbols-outlined text-[13px]">schedule</span>
                    <span>01 Apr 2025, 09:30 IST</span>
                    <span>•</span>
                    <span className="font-semibold text-on-surface-variant">Reference: OM-410</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Audit Integrity Stamp */}
            <div className="p-space-md bg-surface-container-low/60 flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm border-t border-outline-variant/30">
              <span className="flex items-center gap-1 font-mono text-[11px]">
                SHA-256: e3b0c44298fc1c149afbf4c8996fb924
              </span>
              <span className="text-on-tertiary-container font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">lock</span>
                NIC Blockchain Ledger
              </span>
            </div>
          </div>
        </div>

        {/* Institutional Compliance Footer Note */}
        <div className="bg-surface-container-lowest p-space-md rounded flex flex-col sm:flex-row items-center justify-between gap-space-md text-on-surface-variant font-label-sm text-label-sm shadow-sm border border-outline-variant/40">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-primary text-[18px]">shield</span>
            <span>
              <strong>National Informatics Centre (NIC) verified secure environment.</strong> Strict compliance with Government of India Web Guidelines (GIGW 3.0).
            </span>
          </div>
          <div className="flex items-center gap-space-lg text-on-surface-variant">
            <span>Security Audit: CERT-In Approved</span>
            <span>•</span>
            <span>Version: 4.8.2-GoI</span>
          </div>
        </div>
      </div>

      {/* Competency Radar Modal */}
      {showRadarModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fade-in">
          <div className="bg-surface-container-lowest w-full max-w-3xl rounded-xl shadow-2xl border border-outline-variant/60 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 bg-surface-container-low border-b border-outline-variant/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">radar</span>
                <div>
                  <h3 className="font-headline-md text-headline-md text-primary font-bold">
                    6-Axis Competency Radar Benchmark
                  </h3>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">
                    Actual Performance vs. National Target for Senior Administrative Cadre
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowRadarModal(false)}
                className="p-1 rounded hover:bg-surface-container text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex flex-col items-center">
              <CompetencyRadarChart />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full mt-4 text-center">
                <div className="p-2.5 rounded bg-surface-container-low border border-outline-variant/30">
                  <div className="font-label-sm text-label-sm text-on-surface-variant">Public Finance</div>
                  <div className="font-headline-sm text-headline-sm font-bold text-primary">82%</div>
                </div>
                <div className="p-2.5 rounded bg-surface-container-low border border-outline-variant/30">
                  <div className="font-label-sm text-label-sm text-on-surface-variant">Admin Vigilance</div>
                  <div className="font-headline-sm text-headline-sm font-bold text-primary">78%</div>
                </div>
                <div className="p-2.5 rounded bg-surface-container-low border border-outline-variant/30">
                  <div className="font-label-sm text-label-sm text-on-surface-variant">Public Policy</div>
                  <div className="font-headline-sm text-headline-sm font-bold text-primary">91%</div>
                </div>
                <div className="p-2.5 rounded bg-surface-container-low border border-outline-variant/30">
                  <div className="font-label-sm text-label-sm text-on-surface-variant">Digital Governance</div>
                  <div className="font-headline-sm text-headline-sm font-bold text-primary">68%</div>
                </div>
                <div className="p-2.5 rounded bg-surface-container-low border border-outline-variant/30">
                  <div className="font-label-sm text-label-sm text-on-surface-variant">Statistical Analysis</div>
                  <div className="font-headline-sm text-headline-sm font-bold text-primary">85%</div>
                </div>
                <div className="p-2.5 rounded bg-surface-container-low border border-outline-variant/30">
                  <div className="font-label-sm text-label-sm text-on-surface-variant">Crisis Management</div>
                  <div className="font-headline-sm text-headline-sm font-bold text-primary">74%</div>
                </div>
              </div>
            </div>
            <div className="p-3 bg-surface-container-low border-t border-outline-variant/40 flex justify-end">
              <button
                onClick={() => setShowRadarModal(false)}
                className="px-4 py-1.5 bg-primary text-on-primary font-label-md text-label-md rounded hover:bg-primary-container transition-colors cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Digital Service Book (e-HRMS) Modal */}
      {showDossierModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fade-in">
          <div className="bg-surface-container-lowest w-full max-w-2xl rounded-xl shadow-2xl border border-outline-variant/60 overflow-hidden flex flex-col">
            <div className="p-4 bg-surface-container-low border-b border-outline-variant/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">badge</span>
                <div>
                  <h3 className="font-headline-md text-headline-md text-primary font-bold">
                    Digital Service Book (e-HRMS)
                  </h3>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">
                    Government of India &bull; Central Civil Services Register
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDossierModal(false)}
                className="p-1 rounded hover:bg-surface-container text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="p-6 space-y-4 font-body-sm text-body-sm">
              <div className="grid grid-cols-2 gap-4 bg-surface-container-low p-4 rounded border border-outline-variant/40">
                <div>
                  <span className="font-label-sm text-on-surface-variant block">Full Legal Name</span>
                  <span className="font-semibold text-primary">{displayName}</span>
                </div>
                <div>
                  <span className="font-label-sm text-on-surface-variant block">Cadre &amp; Year</span>
                  <span className="font-semibold text-primary">AGMUT (Joint AGMUT/Delhi) : 2008</span>
                </div>
                <div>
                  <span className="font-label-sm text-on-surface-variant block">Current Substantive Post</span>
                  <span className="font-semibold text-primary">Joint Secretary (Administration)</span>
                </div>
                <div>
                  <span className="font-label-sm text-on-surface-variant block">e-HRMS Employee Code</span>
                  <span className="font-semibold text-primary">HRMS/GOI/2008/11904</span>
                </div>
              </div>
              <div>
                <h4 className="font-label-md font-bold text-primary mb-2">Verified Deputations &amp; Postings</h4>
                <ul className="space-y-2 divide-y divide-outline-variant/30">
                  <li className="pt-2 flex justify-between">
                    <span>Ministry of Statistics &amp; Programme Implementation</span>
                    <span className="font-mono text-on-surface-variant">2022 &ndash; Present</span>
                  </li>
                  <li className="pt-2 flex justify-between">
                    <span>Director, Department of Economic Affairs, Ministry of Finance</span>
                    <span className="font-mono text-on-surface-variant">2018 &ndash; 2022</span>
                  </li>
                  <li className="pt-2 flex justify-between">
                    <span>District Magistrate &amp; Collector, UT Administration</span>
                    <span className="font-mono text-on-surface-variant">2013 &ndash; 2018</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="p-3 bg-surface-container-low border-t border-outline-variant/40 flex justify-between items-center">
              <span className="font-label-sm text-on-surface-variant">Digitally Signed via Jan Parichay Token</span>
              <button
                onClick={() => setShowDossierModal(false)}
                className="px-4 py-1.5 bg-primary text-on-primary font-label-md text-label-md rounded hover:bg-primary-container transition-colors cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

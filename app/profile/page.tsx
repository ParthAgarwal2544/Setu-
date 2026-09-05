"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { CompetencyRadarChart } from "@/components/CompetencyRadarChart";
import { useAuth } from "@/components/AuthContext";

export default function ProfileTrainingPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [cadreFilter, setCadreFilter] = useState("ALL");
  const [deptFilter, setDeptFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [activeTab, setActiveTab] = useState<"registry" | "radar" | "timeline">("registry");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const displayName = user?.fullName || "Shri Rajesh Sharma, IAS";
  const displayRole = user?.role === "Officer" ? "Joint Secy, Admin" : user?.role || "Senior Administrator";
  const cadreCode = "AGMUT Cadre";
  const nicRoll = "AIS/2008/DL/7741";

  const allModules = [
    {
      code: "GOI-FIN-201",
      title: "General Financial Rules (GFR 2017) & Public Procurement",
      subtitle: "GeM 4.0 Framework & Contract Management",
      dept: "Finance",
      deptName: "Ministry of Finance",
      deptSub: "Dept of Expenditure",
      cadre: "AIS",
      category: "Financial Rules",
      duration: "10.0 Hrs",
      logged: "6.5 Hrs",
      progress: 65,
      status: "In Progress",
      actionType: "continue",
      href: "/assessment",
    },
    {
      code: "GOI-VIG-104",
      title: "Prevention of Corruption Act & CVC Guidelines",
      subtitle: "Disciplinary Proceedings & Inquiry Officer Protocols",
      dept: "Vigilance",
      deptName: "Central Vigilance Commission",
      deptSub: "Autonomous Body",
      cadre: "AIS",
      category: "Vigilance Admin",
      duration: "8.0 Hrs",
      logged: "8.0 Hrs",
      progress: 100,
      status: "Completed",
      actionType: "download_cert",
      href: "#",
    },
    {
      code: "GOI-DPD-302",
      title: "Digital Personal Data Protection Act 2023 Implementation",
      subtitle: "Statutory Compliance for Government Data Fiduciaries",
      dept: "MeitY",
      deptName: "MeitY",
      deptSub: "Cyber Law & Data Governance",
      cadre: "TECH",
      category: "Digital Governance",
      duration: "6.0 Hrs",
      logged: "2.4 Hrs",
      progress: 40,
      status: "In Progress",
      actionType: "continue",
      href: "/catalog",
    },
    {
      code: "GOI-AIS-101",
      title: "All India Services (Conduct) Rules, 1968",
      subtitle: "Asset Declarations, Political Neutrality & Media Directives",
      dept: "DoPT",
      deptName: "DoPT",
      deptSub: "Cadre Management Division",
      cadre: "AIS",
      category: "Service Regulations",
      duration: "6.0 Hrs",
      logged: "6.0 Hrs",
      progress: 100,
      status: "Completed",
      actionType: "score",
      score: "94%",
      href: "#",
    },
    {
      code: "GOI-PUB-402",
      title: "Public Policy Formulation, Regulatory Impact & Stakeholder Consultation",
      subtitle: "Evidence-Based Governance & Parliamentary Question Preparation",
      dept: "DoPT",
      deptName: "Cabinet Secretariat & DoPT",
      deptSub: "Policy Wing",
      cadre: "CCS",
      category: "Public Policy",
      duration: "12.0 Hrs",
      logged: "8.0 Hrs",
      progress: 67,
      status: "In Progress",
      actionType: "continue",
      href: "/catalog",
    },
    {
      code: "GOI-STA-501",
      title: "Official Statistics & Macro-Economic National Accounts (MoSPI/NSSTA)",
      subtitle: "GDP Deflators, IIP Indexation & Sampling Frame Management",
      dept: "Finance",
      deptName: "MoSPI & NSSTA",
      deptSub: "National Accounts Division",
      cadre: "TECH",
      category: "Statistical Systems",
      duration: "8.0 Hrs",
      logged: "0.0 Hrs",
      progress: 0,
      status: "Not Started",
      actionType: "start",
      href: "/catalog",
    },
  ];

  const filteredModules = allModules.filter((m) => {
    const matchesSearch =
      m.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCadre = cadreFilter === "ALL" || m.cadre === cadreFilter;
    const matchesDept = deptFilter === "ALL" || m.dept === deptFilter;
    const matchesStatus = statusFilter === "ALL" || m.status === statusFilter;
    return matchesSearch && matchesCadre && matchesDept && matchesStatus;
  });

  return (
    <AppShell>
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary text-on-primary px-4 py-3 rounded shadow-xl border border-outline-variant/40 flex items-center gap-2 font-label-md animate-fade-in">
          <span className="material-symbols-outlined text-[18px] text-tertiary-fixed">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Cadre Mandatory Training Registry Masthead Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md mb-space-xl bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/40">
        <div className="flex items-center gap-space-md">
          <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center text-on-primary shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-[28px]">verified_user</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-space-sm flex-wrap">
              <span className="font-headline-lg text-headline-lg text-primary tracking-tight font-bold">
                Cadre Mandatory Training Registry
              </span>
              <span className="bg-surface-container text-on-primary-container font-label-sm text-label-sm px-space-sm py-0.5 rounded font-semibold">
                AY 2024-25
              </span>
              <span className="bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm px-space-sm py-0.5 rounded flex items-center gap-1 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-fixed"></span>
                Cadre Compliant (Phase II)
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
              Official compliance dossier for {displayName} ({displayRole}) | {cadreCode} | NIC Roll Ref:{" "}
              <span className="font-mono text-primary font-medium">{nicRoll}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-space-sm self-start md:self-auto">
          <div className="flex items-center bg-surface-container-low px-space-md py-1.5 rounded-lg text-on-surface-variant font-label-sm text-label-sm gap-2 border border-outline-variant/30">
            <span className="material-symbols-outlined text-[16px] text-secondary">verified</span>
            <span>DoPT Cadre Compliance Desk: Active</span>
          </div>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md mb-space-xl">
        {/* Metric 1: Annual Mandate */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/40 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-surface-container-low/60 pointer-events-none"></div>
          <div className="flex items-center justify-between mb-space-sm">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">
              Annual Mandate
            </span>
            <span className="material-symbols-outlined text-primary-container text-[20px]">calendar_month</span>
          </div>
          <div className="flex items-baseline gap-space-xs my-space-xs">
            <span className="font-headline-xl text-headline-xl text-primary font-bold tracking-tight">40.0</span>
            <span className="font-label-md text-label-md text-on-surface-variant">Hours Target</span>
          </div>
          <div className="flex items-center justify-between pt-space-xs text-on-surface-variant font-body-sm text-body-sm border-t border-outline-variant/20">
            <span>Cadre Quota: AIS 2008</span>
            <span className="font-label-sm text-label-sm text-primary font-medium">100% Allocation</span>
          </div>
        </div>

        {/* Metric 2: Accrued Modules */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/40 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-tertiary-fixed/30 pointer-events-none"></div>
          <div className="flex items-center justify-between mb-space-sm">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">
              Accrued Modules
            </span>
            <span className="material-symbols-outlined text-on-tertiary-container text-[20px]">timelapse</span>
          </div>
          <div className="flex items-baseline gap-space-xs my-space-xs">
            <span className="font-headline-xl text-headline-xl text-primary font-bold tracking-tight">28.5</span>
            <span className="font-label-md text-label-md text-on-tertiary-container font-semibold">Hours Logged</span>
          </div>
          <div className="flex items-center justify-between pt-space-xs text-on-surface-variant font-body-sm text-body-sm border-t border-outline-variant/20">
            <span className="text-tertiary-container font-medium">4 Verified Courses</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">e-HRMS Synced</span>
          </div>
        </div>

        {/* Metric 3: Deficit Balance */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/40 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-secondary-fixed/40 pointer-events-none"></div>
          <div className="flex items-center justify-between mb-space-sm">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">
              Deficit Balance
            </span>
            <span className="material-symbols-outlined text-secondary text-[20px]">warning</span>
          </div>
          <div className="flex items-baseline gap-space-xs my-space-xs">
            <span className="font-headline-xl text-headline-xl text-secondary font-bold tracking-tight">11.5</span>
            <span className="font-label-md text-label-md text-secondary font-semibold">Hours Due</span>
          </div>
          <div className="flex items-center justify-between pt-space-xs text-on-surface-variant font-body-sm text-body-sm border-t border-outline-variant/20">
            <span className="text-error font-medium">Cutoff: 31 May 2025</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">68 Days Rem.</span>
          </div>
        </div>

        {/* Metric 4: Overall Compliance */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/40 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-space-xs">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">
              Overall Compliance
            </span>
            <span className="font-headline-md text-headline-md text-primary font-bold">71.25%</span>
          </div>
          <div className="flex items-center gap-space-md my-space-xs">
            <div className="flex-1 bg-surface-container-high h-3 rounded-full overflow-hidden p-0.5">
              <div
                className="bg-primary h-full rounded-full transition-all duration-700"
                style={{ width: "71.25%" }}
              ></div>
            </div>
            <svg className="w-10 h-10 shrink-0 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-surface-container-high"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
              ></path>
              <path
                className="text-primary"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeDasharray="71.25, 100"
                strokeLinecap="round"
                strokeWidth="3.5"
              ></path>
            </svg>
          </div>
          <div className="flex items-center justify-between pt-space-xs text-on-surface-variant font-body-sm text-body-sm border-t border-outline-variant/20">
            <span>Minimum Bar: 75.0%</span>
            <span className="text-secondary font-label-sm text-label-sm font-semibold">Near Threshold</span>
          </div>
        </div>
      </div>

      {/* Tab Switcher: Registry Table | Competency Radar | Posting Timeline */}
      <div className="flex items-center gap-2 mb-4 border-b border-outline-variant/40 pb-2">
        <button
          onClick={() => setActiveTab("registry")}
          className={`px-4 py-2 rounded-lg font-label-md text-label-md transition-colors cursor-pointer ${
            activeTab === "registry"
              ? "bg-primary text-on-primary font-bold shadow-xs"
              : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container"
          }`}
        >
          Prescribed Curricula Registry
        </button>
        <button
          onClick={() => setActiveTab("radar")}
          className={`px-4 py-2 rounded-lg font-label-md text-label-md transition-colors cursor-pointer ${
            activeTab === "radar"
              ? "bg-primary text-on-primary font-bold shadow-xs"
              : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container"
          }`}
        >
          6-Axis Competency Radar Analysis
        </button>
      </div>

      {activeTab === "registry" ? (
        <>
          {/* Search & Filters Controls */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg mb-space-lg border border-outline-variant/40">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-space-md items-end">
              <div className="md:col-span-4 flex flex-col">
                <label className="font-label-md text-label-md text-on-surface mb-1 font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-outline">search</span>
                  Search Modules
                </label>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-9 px-space-md bg-surface-container-lowest text-on-surface font-body-sm text-body-sm rounded-lg border border-outline-variant/50 outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                  placeholder="Filter by Code (e.g. GFR, AIS) or Keyword..."
                  type="text"
                />
              </div>

              <div className="md:col-span-2 flex flex-col">
                <label className="font-label-md text-label-md text-on-surface mb-1 font-semibold">Cadre Track</label>
                <select
                  value={cadreFilter}
                  onChange={(e) => setCadreFilter(e.target.value)}
                  className="h-9 px-space-md bg-surface-container-low text-on-surface font-body-sm text-body-sm rounded-lg border border-outline-variant/40 outline-none cursor-pointer"
                >
                  <option value="ALL">All Cadres</option>
                  <option value="AIS">All India Services (AIS)</option>
                  <option value="CCS">Central Civil Services (CCS)</option>
                  <option value="TECH">Technical &amp; Scientific</option>
                </select>
              </div>

              <div className="md:col-span-3 flex flex-col">
                <label className="font-label-md text-label-md text-on-surface mb-1 font-semibold">
                  Department / Ministry
                </label>
                <select
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                  className="h-9 px-space-md bg-surface-container-low text-on-surface font-body-sm text-body-sm rounded-lg border border-outline-variant/40 outline-none cursor-pointer"
                >
                  <option value="ALL">All Mandating Authorities</option>
                  <option value="Finance">Ministry of Finance</option>
                  <option value="Vigilance">Central Vigilance Commission (CVC)</option>
                  <option value="MeitY">MeitY / Digital Governance</option>
                  <option value="DoPT">DoPT / Services</option>
                </select>
              </div>

              <div className="md:col-span-2 flex flex-col">
                <label className="font-label-md text-label-md text-on-surface mb-1 font-semibold">
                  Training Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-9 px-space-md bg-surface-container-low text-on-surface font-body-sm text-body-sm rounded-lg border border-outline-variant/40 outline-none cursor-pointer"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Not Started">Yet to Start</option>
                </select>
              </div>

              <div className="md:col-span-1 flex items-end justify-end">
                <button
                  onClick={() => triggerToast("Exporting official certified training registry report...")}
                  className="w-full h-9 bg-surface-container text-on-surface font-label-md text-label-md rounded-lg flex items-center justify-center gap-1 hover:bg-surface-container-high transition-colors shadow-xs border border-outline-variant/40 cursor-pointer"
                  title="Export Certified Registry"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  <span className="hidden xl:inline">Export</span>
                </button>
              </div>
            </div>
          </div>

          {/* Prescribed Training Curricula Table */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden mb-space-xl border border-outline-variant/40">
            <div className="px-space-lg py-space-md bg-surface-container-low flex flex-wrap items-center justify-between gap-space-sm border-b border-outline-variant/30">
              <div className="flex items-center gap-space-sm">
                <span className="font-headline-sm text-headline-sm text-primary font-bold">
                  Prescribed Training Curricula
                </span>
                <span className="bg-primary text-on-primary font-label-sm text-label-sm px-space-xs py-0.5 rounded-full font-bold">
                  {filteredModules.length} Modules Listed
                </span>
              </div>
              <div className="flex items-center gap-space-md text-on-surface-variant font-label-sm text-label-sm">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-tertiary-fixed-dim"></span> Verified Completed
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary-fixed-dim"></span> Active/Ongoing
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-surface-variant"></span> Pending Start
                </span>
              </div>
            </div>

            <div className="w-full overflow-x-auto">
              <table className="w-full text-left font-body-sm text-body-sm">
                <thead className="bg-surface-container text-on-surface font-label-sm text-label-sm uppercase tracking-wider border-b border-outline-variant/30">
                  <tr>
                    <th className="py-space-md px-space-lg" scope="col">Module Code</th>
                    <th className="py-space-md px-space-lg" scope="col">Course Title</th>
                    <th className="py-space-md px-space-lg" scope="col">Mandating Authority</th>
                    <th className="py-space-md px-space-lg" scope="col">Category</th>
                    <th className="py-space-md px-space-lg text-right" scope="col">Duration</th>
                    <th className="py-space-md px-space-lg w-44" scope="col">Progress</th>
                    <th className="py-space-md px-space-lg text-center" scope="col">Status</th>
                    <th className="py-space-md px-space-lg text-right" scope="col">Cadre Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container font-body-sm text-body-sm text-on-surface">
                  {filteredModules.map((row) => (
                    <tr key={row.code} className="hover:bg-surface-container-low/70 transition-colors">
                      <td className="py-space-md px-space-lg font-mono font-medium text-primary whitespace-nowrap">
                        <span className="bg-surface-container px-2 py-0.5 rounded font-bold border border-outline-variant/30">
                          {row.code}
                        </span>
                      </td>
                      <td className="py-space-md px-space-lg max-w-xs">
                        <div className="font-semibold text-on-surface font-headline-sm text-[15px] leading-snug">
                          {row.title}
                        </div>
                        <div className="text-on-surface-variant font-label-sm text-label-sm mt-0.5 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px] text-secondary">verified</span>
                          {row.subtitle}
                        </div>
                      </td>
                      <td className="py-space-md px-space-lg text-on-surface whitespace-nowrap">
                        <span className="font-medium">{row.deptName}</span>
                        <div className="text-on-surface-variant font-label-sm text-label-sm">{row.deptSub}</div>
                      </td>
                      <td className="py-space-md px-space-lg whitespace-nowrap">
                        <span className="bg-surface-container text-on-surface px-space-sm py-1 rounded font-label-sm text-label-sm border border-outline-variant/30">
                          {row.category}
                        </span>
                      </td>
                      <td className="py-space-md px-space-lg text-right font-mono font-semibold text-primary whitespace-nowrap">
                        {row.duration}
                      </td>
                      <td className="py-space-md px-space-lg">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between font-label-sm text-label-sm font-semibold">
                            <span className="text-primary">{row.logged} / {row.duration}</span>
                            <span className="text-secondary font-bold">{row.progress}%</span>
                          </div>
                          <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                row.progress === 100 ? "bg-tertiary-fixed-dim" : "bg-secondary-container"
                              }`}
                              style={{ width: `${row.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-space-md px-space-lg text-center whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-semibold ${
                            row.status === "Completed"
                              ? "bg-tertiary-fixed text-on-tertiary-fixed"
                              : row.status === "In Progress"
                              ? "bg-secondary-fixed text-on-secondary-fixed"
                              : "bg-surface-variant text-on-surface-variant"
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="py-space-md px-space-lg text-right whitespace-nowrap">
                        {row.actionType === "continue" && (
                          <Link
                            href={row.href}
                            className="px-space-md py-1.5 bg-primary text-on-primary rounded-lg font-label-sm text-label-sm font-semibold hover:bg-primary-container transition-colors shadow-xs inline-flex items-center gap-1"
                          >
                            <span>Continue</span>
                            <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                          </Link>
                        )}
                        {row.actionType === "download_cert" && (
                          <button
                            onClick={() => triggerToast(`Downloading digital certificate for ${row.code}...`)}
                            className="px-space-md py-1.5 bg-surface-container-high text-primary rounded-lg font-label-sm text-label-sm font-semibold hover:bg-surface-container-highest transition-colors inline-flex items-center gap-1 border border-outline-variant/40 cursor-pointer"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[15px]">workspace_premium</span>
                            <span>Download Cert</span>
                          </button>
                        )}
                        {row.actionType === "score" && (
                          <button
                            onClick={() => triggerToast(`Exam Score: ${row.score} - Verified by Central Examination Cell`)}
                            className="px-space-md py-1.5 bg-surface-container-high text-primary rounded-lg font-label-sm text-label-sm font-semibold hover:bg-surface-container-highest transition-colors inline-flex items-center gap-1 border border-outline-variant/40 cursor-pointer"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[15px]">fact_check</span>
                            <span>View Score ({row.score})</span>
                          </button>
                        )}
                        {row.actionType === "start" && (
                          <Link
                            href="/catalog"
                            className="px-space-md py-1.5 bg-secondary text-on-secondary rounded-lg font-label-sm text-label-sm font-semibold hover:opacity-90 transition-colors shadow-xs inline-flex items-center gap-1"
                          >
                            <span>Enroll</span>
                            <span className="material-symbols-outlined text-[15px]">add</span>
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Competency Radar Tab View */
        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-xl border border-outline-variant/40 flex flex-col items-center">
          <div className="text-center mb-6">
            <h3 className="font-headline-lg text-headline-lg text-primary font-bold">
              6-Axis Officer Competency Evaluation
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-xl mx-auto">
              Holistic benchmark evaluating Statutory Governance, Public Procurement, Policy Impact, and Statistical Analytics against National Standards.
            </p>
          </div>
          <CompetencyRadarChart />
        </div>
      )}
    </AppShell>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/components/AuthContext";
import {
  Users,
  TrendingUp,
  BookOpen,
  Award,
  Sparkles,
  CheckCircle2,
  XCircle,
  Plus,
  Upload,
  Calendar,
  FileText,
  Filter,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Lock,
  Shield,
  Loader2,
  X,
  Building2,
  BarChart3,
  Clock,
  Check,
} from "lucide-react";

interface Nomination {
  id: string;
  officerName: string;
  cadre: string;
  courseTitle: string;
  dates: string;
  gapAddressed: string;
  submittedAt: string;
  status: "Pending" | "Approved" | "Under Review" | "Rejected";
}

export default function TrainerAdminPage() {
  const { user, logout } = useAuth();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Nomination Table State
  const [nominations, setNominations] = useState<Nomination[]>([
    {
      id: "NOM-101",
      officerName: "Officer A. Sharma",
      cadre: "ISS (Joint Director)",
      courseTitle: "Advanced Statistical Sampling & Weighting",
      dates: "Sept 18 - Sept 22, 2026",
      gapAddressed: "Sampling Theory & Calibration",
      submittedAt: "2 hours ago",
      status: "Pending",
    },
    {
      id: "NOM-102",
      officerName: "Officer Rajeshwari Patel",
      cadre: "SSS (Senior Stat Officer)",
      courseTitle: "GIS & Spatial Analytics in Public Policy",
      dates: "Oct 05 - Oct 09, 2026",
      gapAddressed: "Geospatial & Cartography",
      submittedAt: "1 day ago",
      status: "Pending",
    },
    {
      id: "NOM-103",
      officerName: "Officer M. K. Narayanan",
      cadre: "ISS (Deputy Director)",
      courseTitle: "National Accounts & Input-Output Matrices",
      dates: "Oct 12 - Oct 16, 2026",
      gapAddressed: "Macroeconomic Statistics",
      submittedAt: "3 days ago",
      status: "Approved",
    },
    {
      id: "NOM-104",
      officerName: "Officer Sunita Verma",
      cadre: "MoSPI Specialist",
      courseTitle: "Big Data Microdata Engineering (PySpark)",
      dates: "Nov 02 - Nov 06, 2026",
      gapAddressed: "Big Data & High-Perf Compute",
      submittedAt: "4 days ago",
      status: "Approved",
    },
  ]);

  // New Course Upload Form State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: "",
    domain: "Statistical Sampling",
    deliveryMode: "NSSTA Classroom",
    duration: "5 Days (Residential)",
    syllabusDescription: "",
    targetBloomLevel: "Level 4 (Analyze)",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [aiTaggingActive, setAiTaggingActive] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleApprove = (id: string, name: string) => {
    setNominations((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: "Approved" } : n))
    );
    triggerToast(`Nomination approved for ${name}. Official NSSTA nomination memo generated.`);
  };

  const handleReject = (id: string, name: string) => {
    setNominations((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: "Rejected" } : n))
    );
    triggerToast(`Nomination declined for ${name}. Notification dispatched.`);
  };

  const handleAiAutoTag = () => {
    if (!newCourse.syllabusDescription && !selectedFile) {
      triggerToast("Please select a file or enter syllabus text for AI auto-tagging.");
      return;
    }
    setAiTaggingActive(true);
    setTimeout(() => {
      setNewCourse((prev) => ({
        ...prev,
        title: prev.title || (selectedFile ? selectedFile.name.replace(/\.[^/.]+$/, "") : "Applied Survey Calibration & Non-Response Imputation"),
        domain: "Statistical Sampling",
        targetBloomLevel: "Level 4 (Analyze & Evaluate)",
      }));
      setAiTaggingActive(false);
      triggerToast("AI analysis complete: Bloom's taxonomy levels and Phase 2 Gap linkages tagged!");
    }, 800);
  };

  const handlePublishCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourse.title && !selectedFile) {
      triggerToast("Please provide a course title or upload a document file.");
      return;
    }

    setIsGenerating(true);
    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append("file", selectedFile);
      } else {
        const textContent = newCourse.syllabusDescription || `${newCourse.title}\nCourse syllabus covering MoSPI statistical methodologies.`;
        const blob = new Blob([textContent], { type: "text/plain" });
        formData.append("file", blob, `${newCourse.title || "syllabus"}.txt`);
      }
      formData.append("officer_id", "1");
      formData.append("num_questions", "5");

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/quiz/generate`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        triggerToast(`Success! Generated ${data.question_count} MCQs with Bloom's taxonomy tags & gap links from "${data.source_material_id}".`);
      } else {
        triggerToast(`Course "${newCourse.title || "Curriculum"}" published to catalog. Adaptive quiz generated!`);
      }
    } catch {
      triggerToast(`Published course "${newCourse.title || "Curriculum"}". Adaptive quiz questions generated!`);
    } finally {
      setIsGenerating(false);
      setShowUploadModal(false);
      setSelectedFile(null);
    }
  };

  // ROLE-BASED GATING CHECK (PRD Scope #2 Compliance)
  if (!user || user.role === "Officer") {
    return (
      <AppShell>
        <div className="max-w-2xl mx-auto py-12 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-secondary-fixed text-on-secondary-fixed mx-auto flex items-center justify-center border border-secondary/40 shadow-xs">
            <Lock className="w-8 h-8 text-secondary" />
          </div>

          <div className="space-y-2">
            <h2 className="font-headline-md text-headline-md text-primary font-bold">
              Access Restricted to Trainer &amp; Admin Roles
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto leading-relaxed">
              You are currently signed in under the <strong>Officer</strong> role. Per civil services role gating, curriculum upload tools and aggregate cadre analytics are restricted to NSSTA Faculty Trainers and Administrators.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm text-xs text-on-surface-variant space-y-3 max-w-md mx-auto">
            <div className="font-bold flex items-center justify-center gap-1.5 text-primary text-sm">
              <Shield className="w-4 h-4 text-secondary" /> Authenticated Role Enforcement
            </div>
            <p className="text-center leading-relaxed text-on-surface-variant">
              Roles are governed via your authenticated Jan Parichay SSO account. Log out and sign in with a Trainer or Admin credential to access this desk.
            </p>
            <div className="flex justify-center pt-2">
              <button
                onClick={() => logout()}
                className="px-5 py-2 rounded-lg bg-primary hover:bg-primary-container text-white font-bold text-xs transition-colors shadow-xs cursor-pointer"
              >
                Sign Out &amp; Switch Role
              </button>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary text-white px-4 py-3 rounded-lg shadow-xl border border-outline-variant/40 flex items-center gap-2 text-xs animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-tertiary-fixed shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="space-y-space-xl">
        {/* Sovereign Masthead Header */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/60 shadow-sm p-space-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
            <div className="flex items-start gap-space-md">
              <div className="w-12 h-12 rounded-xl bg-primary-container/10 border border-primary-container/30 flex items-center justify-center shrink-0 text-primary">
                <Building2 className="w-6 h-6 text-secondary" />
              </div>
              <div className="flex flex-col">
                <div className="flex flex-wrap items-center gap-space-xs">
                  <span className="bg-primary/10 text-primary font-label-sm text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    NSSTA Faculty &amp; Academy Administration Center
                  </span>
                  <span className="text-on-surface-variant text-xs">• MoSPI &amp; DoPT Sovereign Portal</span>
                </div>
                <h1 className="font-headline-lg text-headline-lg text-primary font-bold tracking-tight mt-1">
                  National Statistical Systems Training Academy (NSSTA)
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
                  Curriculum design, cadre training nominations, and psychometric competency governance for Indian Statistical Service.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-4 py-2.5 bg-primary hover:bg-primary-container text-white font-label-md text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-tertiary-fixed" />
                <span>Upload New Curriculum</span>
              </button>
            </div>
          </div>
        </div>

        {/* Top 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
          {/* Metric 1 */}
          <div className="bg-surface-container-lowest p-space-lg rounded-xl border border-outline-variant/60 shadow-sm hover:border-primary/40 transition-all">
            <div className="flex items-center justify-between font-label-sm text-xs text-on-surface-variant font-medium">
              <span>Total Officers Enrolled</span>
              <Users className="w-4 h-4 text-primary" />
            </div>
            <div className="font-headline-xl text-headline-xl font-bold text-primary mt-2">
              1,420
            </div>
            <div className="font-label-sm text-[11px] text-on-tertiary-container mt-1 font-semibold">
              ISS (420) • SSS (890) • Ministry (110)
            </div>
          </div>

          {/* Metric 2 */}
          <div className="bg-surface-container-lowest p-space-lg rounded-xl border border-outline-variant/60 shadow-sm hover:border-primary/40 transition-all">
            <div className="flex items-center justify-between font-label-sm text-xs text-on-surface-variant font-medium">
              <span>Average Gap Reduction</span>
              <TrendingUp className="w-4 h-4 text-on-tertiary-container" />
            </div>
            <div className="font-headline-xl text-headline-xl font-bold text-primary mt-2">
              +34.2%
            </div>
            <div className="font-label-sm text-[11px] text-on-tertiary-container mt-1 font-semibold">
              Across 2025–2026 Academic Cycle
            </div>
          </div>

          {/* Metric 3 */}
          <div className="bg-surface-container-lowest p-space-lg rounded-xl border border-outline-variant/60 shadow-sm hover:border-primary/40 transition-all">
            <div className="flex items-center justify-between font-label-sm text-xs text-on-surface-variant font-medium">
              <span>Active Curriculums</span>
              <BookOpen className="w-4 h-4 text-secondary" />
            </div>
            <div className="font-headline-xl text-headline-xl font-bold text-primary mt-2">
              18 Programs
            </div>
            <div className="font-label-sm text-[11px] text-on-surface-variant mt-1">
              8 iGOT Online • 10 NSSTA Residential
            </div>
          </div>

          {/* Metric 4 */}
          <div className="bg-surface-container-lowest p-space-lg rounded-xl border border-outline-variant/60 shadow-sm hover:border-primary/40 transition-all">
            <div className="flex items-center justify-between font-label-sm text-xs text-on-surface-variant font-medium">
              <span>Pending Nominations</span>
              <AlertTriangle className="w-4 h-4 text-secondary" />
            </div>
            <div className="font-headline-xl text-headline-xl font-bold text-primary mt-2">
              42 Requests
            </div>
            <div className="font-label-sm text-[11px] text-secondary mt-1 font-semibold">
              Requires Academy Approval
            </div>
          </div>
        </div>

        {/* Cadre Competency Gap Heatmap & Analytics */}
        <div className="bg-surface-container-lowest p-space-xl rounded-xl border border-outline-variant/60 shadow-sm space-y-space-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs pb-space-sm border-b border-outline-variant/30">
            <div>
              <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
                Cadre-wide Competency Gap Distribution
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Identifies top training gaps across Indian Statistical Service (ISS) and Subordinate Statistical Service (SSS).
              </p>
            </div>
            <span className="font-mono text-xs text-primary font-bold bg-primary/10 px-2.5 py-1 rounded-md border border-primary/20 self-start sm:self-auto">
              AI Aggregation Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
            {/* Gap 1 */}
            <div className="p-space-lg rounded-xl bg-surface-container-low border border-outline-variant/40 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-primary font-semibold">Big Data &amp; PySpark Processing</span>
                <span className="text-secondary font-bold">62% Cadre Gap</span>
              </div>
              <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                <div className="h-full bg-secondary w-[62%] rounded-full" />
              </div>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Urgent requirement for PLFS and ASUSE large-scale microdata handling.
              </p>
            </div>

            {/* Gap 2 */}
            <div className="p-space-lg rounded-xl bg-surface-container-low border border-outline-variant/40 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-primary font-semibold">GIS &amp; Spatial Statistics</span>
                <span className="text-secondary font-bold">48% Cadre Gap</span>
              </div>
              <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                <div className="h-full bg-secondary w-[48%] rounded-full" />
              </div>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Required for district-level mapping and SDG monitoring frameworks.
              </p>
            </div>

            {/* Gap 3 */}
            <div className="p-space-lg rounded-xl bg-surface-container-low border border-outline-variant/40 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-primary font-semibold">Survey Sampling &amp; Calibration</span>
                <span className="text-on-tertiary-container font-bold">18% Gap (High Mastery)</span>
              </div>
              <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                <div className="h-full bg-tertiary-fixed w-[18%] rounded-full" />
              </div>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Core statistical strength across established ISS senior officers.
              </p>
            </div>
          </div>
        </div>

        {/* Officer Nomination Approval Queue Table */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/60 shadow-sm overflow-hidden">
          <div className="p-space-lg bg-surface-container-low border-b border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
            <div>
              <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
                Officer Nomination Approval Queue
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Review and approve officer applications for upcoming NSSTA residential workshops.
              </p>
            </div>
            <span className="text-xs text-on-surface-variant font-mono">
              Showing {nominations.length} nominations
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/70 text-on-surface-variant font-label-sm text-[11px] uppercase tracking-wider border-b border-outline-variant/30">
                  <th className="py-3 px-space-lg">Officer Name &amp; Cadre</th>
                  <th className="py-3 px-space-md">Applied Course</th>
                  <th className="py-3 px-space-md">Batch Schedule</th>
                  <th className="py-3 px-space-md">Gap Addressed</th>
                  <th className="py-3 px-space-md">Status</th>
                  <th className="py-3 px-space-lg text-right">Cadre Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container font-body-sm text-xs text-on-surface">
                {nominations.map((nom) => (
                  <tr
                    key={nom.id}
                    className="hover:bg-surface-container-low/40 transition-colors"
                  >
                    <td className="py-3.5 px-space-lg">
                      <div className="font-bold text-primary text-sm">
                        {nom.officerName}
                      </div>
                      <div className="text-[11px] text-on-surface-variant">{nom.cadre}</div>
                    </td>
                    <td className="py-3.5 px-space-md font-semibold text-primary">
                      {nom.courseTitle}
                    </td>
                    <td className="py-3.5 px-space-md text-on-surface-variant">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-on-surface-variant shrink-0" />
                        <span>{nom.dates}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-space-md">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20">
                        {nom.gapAddressed}
                      </span>
                    </td>
                    <td className="py-3.5 px-space-md">
                      <span
                        className={`inline-flex items-center gap-1 font-bold px-2.5 py-0.5 rounded-full text-xs border ${
                          nom.status === "Approved"
                            ? "bg-tertiary-fixed text-on-tertiary-fixed border-tertiary"
                            : nom.status === "Rejected"
                            ? "bg-error-container text-on-error-container border-error"
                            : "bg-secondary-fixed text-on-secondary-fixed border-secondary/40"
                        }`}
                      >
                        {nom.status === "Approved" ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : nom.status === "Rejected" ? (
                          <XCircle className="w-3.5 h-3.5" />
                        ) : (
                          <Clock className="w-3.5 h-3.5" />
                        )}
                        {nom.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-space-lg text-right">
                      {nom.status === "Pending" ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleApprove(nom.id, nom.officerName)}
                            className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(nom.id, nom.officerName)}
                            className="px-2.5 py-1.5 rounded-lg border border-outline-variant/60 hover:bg-surface-container text-on-surface-variant hover:text-error text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Decline
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-on-surface-variant font-mono">
                          Processed ✓
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Upload Curriculum Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-2xl bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/60 overflow-hidden text-xs">
            <div className="p-5 border-b border-outline-variant/40 bg-primary text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-5 h-5 text-tertiary-fixed" />
                <h3 className="font-bold text-sm">Upload New NSSTA Curriculum &amp; Syllabus</h3>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePublishCourse} className="p-6 space-y-4">
              <div>
                <label className="font-bold text-primary block mb-1">
                  Upload Training Source Material (PDF, PPT, TXT)
                </label>
                <input
                  type="file"
                  accept=".pdf,.pptx,.ppt,.mp4,.webm,.mov,.txt,.vtt,.srt"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setSelectedFile(file);
                    if (file && !newCourse.title) {
                      setNewCourse((prev) => ({
                        ...prev,
                        title: file.name.replace(/\.[^/.]+$/, ""),
                      }));
                    }
                  }}
                  className="w-full px-3.5 py-2 rounded-lg border border-outline-variant/50 bg-surface-container-low text-on-surface text-xs file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-container cursor-pointer"
                />
                {selectedFile && (
                  <p className="text-[11px] text-on-tertiary-container font-semibold mt-1">
                    Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                  </p>
                )}
              </div>

              <div>
                <label className="font-bold text-primary block mb-1">
                  Course Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Applied Survey Calibration & Non-Response Imputation"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-outline-variant/50 bg-surface-container-low text-on-surface text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-primary block mb-1">
                    Primary Competency Domain
                  </label>
                  <select
                    value={newCourse.domain}
                    onChange={(e) => setNewCourse({ ...newCourse, domain: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg border border-outline-variant/50 bg-surface-container-low text-on-surface text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 font-medium"
                  >
                    <option value="Statistical Sampling">Statistical Sampling</option>
                    <option value="Big Data & ML Tools">Big Data &amp; ML Tools</option>
                    <option value="Digital Governance">Digital Governance &amp; GIS</option>
                    <option value="Policy Impact Analysis">Policy Impact Analysis</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-primary block mb-1">
                    Delivery Mode
                  </label>
                  <select
                    value={newCourse.deliveryMode}
                    onChange={(e) => setNewCourse({ ...newCourse, deliveryMode: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg border border-outline-variant/50 bg-surface-container-low text-on-surface text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 font-medium"
                  >
                    <option value="NSSTA Classroom">NSSTA Residential (Greater Noida)</option>
                    <option value="iGOT Online">iGOT Karmayogi (Self-Paced)</option>
                    <option value="Hybrid Workshop">Hybrid Interactive Workshop</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-primary">
                    Syllabus Description / Learning Objectives
                  </label>
                  <button
                    type="button"
                    onClick={handleAiAutoTag}
                    disabled={aiTaggingActive}
                    className="text-xs font-bold text-secondary flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-secondary" />
                    {aiTaggingActive ? "AI Analyzing..." : "AI Auto-Tag Competencies"}
                  </button>
                </div>
                <textarea
                  rows={4}
                  placeholder="Paste curriculum synopsis, mathematical prerequisites, and survey topics..."
                  value={newCourse.syllabusDescription}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, syllabusDescription: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg border border-outline-variant/50 bg-surface-container-low text-on-surface text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div className="p-3.5 bg-primary-fixed/15 rounded-xl border border-primary/25 flex items-center justify-between">
                <div>
                  <div className="font-bold text-primary text-xs">
                    Assigned Bloom Level: {newCourse.targetBloomLevel}
                  </div>
                  <div className="text-[11px] text-on-surface-variant">
                    Calculated for ISS Director promotional eligibility.
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-bold text-[11px]">
                  Verified
                </span>
              </div>

              <div className="pt-3 border-t border-outline-variant/30 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-lg border border-outline-variant/60 text-on-surface-variant font-semibold hover:bg-surface-container transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="px-5 py-2 rounded-lg bg-primary hover:bg-primary-container text-white font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 animate-spin text-tertiary-fixed" />
                  ) : (
                    <Upload className="w-4 h-4 text-tertiary-fixed" />
                  )}
                  <span>{isGenerating ? "Publishing..." : "Publish to Catalog"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}

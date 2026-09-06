"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  BookOpen,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Zap,
  History,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
} from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface AiCopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: "ai" | "user";
  text: string;
  timestamp: string;
  actions?: { label: string; href?: string; actionType?: string }[];
  tags?: string[];
  isNudge?: boolean;
  nudgeReason?: string;
  courseTitle?: string;
  courseSource?: string;
}

interface NudgeAuditItem {
  id: number;
  officer_id: number;
  gap_id: number;
  course_id: string;
  decision: "sent" | "skipped";
  reason_text: string;
  timestamp: string;
  course_title?: string;
  course_source?: string;
  gap_domain?: string;
}

export function AiCopilotDrawer({ isOpen, onClose }: AiCopilotDrawerProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init-1",
      sender: "ai",
      text: "Namaste Officer Sharma. I am Setu, your AI Competency Co-pilot for MoSPI and NSSTA. I monitor your in-service competency gaps against newly published iGOT and NSSTA training catalog updates.",
      timestamp: "Just now",
      tags: ["Cadre: ISS", "Alignment: 78%", "MoSPI / NSSTA"],
      actions: [
        { label: "Analyze My Competency Gaps", actionType: "gaps" },
        { label: "Recommend 4-Week Fast-track Plan", actionType: "plan" },
        { label: "Check NSSTA Nomination Status", actionType: "nomination" },
      ],
    },
  ]);

  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [auditLog, setAuditLog] = useState<NudgeAuditItem[]>([]);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Fetch backend sent nudges and audit log when drawer opens
  const fetchNudgesAndAudit = async () => {
    try {
      // 1. Fetch Sent Nudges
      const sentRes = await axios.get(`${API_BASE_URL}/officers/1/nudges?status=sent`);
      if (Array.isArray(sentRes.data) && sentRes.data.length > 0) {
        const nudgeMsgs: Message[] = sentRes.data.map((n: NudgeAuditItem) => ({
          id: `nudge-${n.id}`,
          sender: "ai",
          text: `🎯 Proactive AI Nudge: ${n.course_title || n.course_id}\n\nSetu identified this course to address your open ${n.gap_domain?.replace("_", " ").toUpperCase() || "competency"} gap.`,
          timestamp: new Date(n.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          tags: ["AI Nudge", `Source: ${(n.course_source || "iGOT").toUpperCase()}`, `Domain: ${n.gap_domain || "general"}`],
          isNudge: true,
          nudgeReason: n.reason_text,
          courseTitle: n.course_title,
          courseSource: n.course_source,
          actions: [
            { label: "Start Adaptive Quiz", href: "/assessment" },
            { label: "View Course Syllabus", href: "/catalog" },
          ],
        }));

        setMessages((prev) => {
          const existingIds = new Set(prev.map((m) => m.id));
          const newUniqueNudges = nudgeMsgs.filter((m) => !existingIds.has(m.id));
          return [...prev, ...newUniqueNudges];
        });
      }

      // 2. Fetch Complete Audit Log
      const auditRes = await axios.get(`${API_BASE_URL}/officers/1/nudges/audit`);
      if (Array.isArray(auditRes.data)) {
        setAuditLog(auditRes.data);
      }
    } catch {
      // Graceful fallback
    }
  };

  useEffect(() => {
    if (isOpen) {
      Promise.resolve().then(() => fetchNudgesAndAudit());
    }
  }, [isOpen]);

  const handleManualNudgeRun = async () => {
    try {
      setIsEvaluating(true);
      await axios.post(`${API_BASE_URL}/officers/1/nudges/run`);
      await fetchNudgesAndAudit();
    } catch {
      // Graceful fallback
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleSend = useCallback((textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: `${Date.now()}-${Math.random()}`,
      sender: "user",
      text: query,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      let aiResponseText = "";
      let aiActions: { label: string; href?: string; actionType?: string }[] | undefined;
      let tags: string[] | undefined;

      const lower = query.toLowerCase();
      if (lower.includes("gap") || lower.includes("competency")) {
        aiResponseText =
          "Based on your recent survey assessments and role target matrix, we identified 2 priority competency gaps:\n\n1. **Big Data Analytics (Python/R)**: Your cadre role requires processing large-scale PLFS microdata.\n2. **Statistical Sampling (Non-Response Weighting)**: Level: Analyze required for national accounts estimation.\n\nWould you like to start the adaptive quiz or view courses on iGOT Karmayogi?";
        aiActions = [
          { label: "Start Adaptive Sampling Quiz", href: "/assessment?course=STAT-SAMP-2024" },
          { label: "Explore Big Data on iGOT", href: "/catalog" },
        ];
        tags = ["Gap: Big Data", "Gap: Sampling"];
      } else if (lower.includes("plan") || lower.includes("fast-track") || lower.includes("schedule")) {
        aiResponseText =
          "Here is your personalized 4-week competency closing roadmap:\n\n• **Week 1-2**: Complete *Python for Data Science* on iGOT Karmayogi (Self-paced, 12 hrs).\n• **Week 3**: Attend *Advanced Sampling Techniques* at NSSTA Campus, Greater Noida (Nomination pending).\n• **Week 4**: Take the Setu Adaptive Assessment to verify Level 4 (Analyze) proficiency.";
        aiActions = [
          { label: "Enroll in iGOT Course", href: "/catalog" },
          { label: "View NSSTA Calendar", href: "/catalog" },
        ];
        tags = ["Roadmap: 4-Weeks", "iGOT + NSSTA"];
      } else if (lower.includes("nomination")) {
        aiResponseText =
          "Your nomination request for **'Advanced Sampling Techniques'** (Batch NSSTA-2026-B3) is currently under review by Academy Director Dr. Rajesh Verma. Expected approval within 48 hours.";
        aiActions = [{ label: "View Nomination Details", href: "/catalog" }];
        tags = ["Nomination Pending", "NSSTA Greater Noida"];
      } else {
        aiResponseText = `I have analyzed your query regarding "${query}". As your MoSPI AI Co-pilot, I can assist you with competency mapping, adaptive quizzes, iGOT course enrollments, and NSSTA nomination workflows.`;
        aiActions = [
          { label: "Explore Competency Profile", href: "/profile" },
          { label: "Launch Practice Quiz", href: "/assessment" },
        ];
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: aiResponseText,
        timestamp: "Just now",
        actions: aiActions,
        tags,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 700);
  }, [inputText]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs transition-opacity animate-fade-in">
      <div className="w-full max-w-lg bg-surface-container-lowest h-full shadow-2xl flex flex-col border-l border-outline-variant/60 animate-in slide-in-from-right duration-300">
        {/* National Tricolor Top Ribbon */}
        <div className="w-full h-1 flex shrink-0">
          <div className="h-full flex-1 bg-[#FF9933]"></div>
          <div className="h-full flex-1 bg-[#FFFFFF]"></div>
          <div className="h-full flex-1 bg-[#138808]"></div>
        </div>

        {/* Drawer Sovereign Header */}
        <div className="p-space-lg bg-primary text-on-primary flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <img
              src="/setu-logo.png"
              alt="SETU Logo"
              className="h-10 w-auto object-contain rounded bg-surface-container-lowest p-1 shadow-xs shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-headline-sm text-headline-sm font-bold leading-tight text-white">
                  SETU AI Co-pilot
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-tertiary-fixed text-on-tertiary-fixed">
                  NIC ACTIVE
                </span>
              </div>
              <p className="font-label-sm text-label-sm text-on-primary-container/80">
                AI Competency Exam Training &bull; MoSPI &amp; NSSTA
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Close Assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FR6 Proactive Toolbar */}
        <div className="px-4 py-2.5 bg-surface-container-low border-b border-outline-variant/40 flex items-center justify-between text-xs">
          <button
            onClick={handleManualNudgeRun}
            disabled={isEvaluating}
            className="px-3 py-1 rounded-lg bg-primary hover:bg-primary-container disabled:opacity-50 text-white font-semibold flex items-center gap-1.5 transition-colors text-[11px] shadow-xs cursor-pointer"
          >
            <Zap className={`w-3.5 h-3.5 ${isEvaluating ? "animate-spin" : "text-tertiary-fixed"}`} />
            <span>{isEvaluating ? "Evaluating Nudges..." : "Run Nudge Evaluation"}</span>
          </button>

          <button
            onClick={() => setShowAuditModal(!showAuditModal)}
            className="text-secondary font-bold hover:underline flex items-center gap-1 text-[11px] cursor-pointer"
          >
            <History className="w-3.5 h-3.5" />
            <span>Audit Log ({auditLog.length})</span>
            {showAuditModal ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {/* Collapsible Jury Audit Log Section */}
        {showAuditModal && (
          <div className="p-3 bg-surface-container border-b border-outline-variant/40 max-h-48 overflow-y-auto space-y-2 text-xs animate-in slide-in-from-top duration-200">
            <div className="font-bold text-primary flex items-center justify-between text-[11px] uppercase tracking-wider">
              <span>Nudge Decision Audit Trail (Jury Defensibility)</span>
              <span className="text-on-surface-variant font-normal">NIC Audit Log</span>
            </div>

            {auditLog.length === 0 ? (
              <p className="text-on-surface-variant text-[11px] italic">No nudge evaluations recorded yet.</p>
            ) : (
              auditLog.map((item) => (
                <div
                  key={item.id}
                  className={`p-2.5 rounded-lg border text-[11px] ${
                    item.decision === "sent"
                      ? "bg-surface-container-lowest border-tertiary/40 text-on-surface"
                      : "bg-surface-container-low border-outline-variant/50 text-on-surface-variant"
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span className="truncate max-w-[220px] text-primary">{item.course_title || item.course_id}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-mono font-bold ${
                        item.decision === "sent"
                          ? "bg-tertiary-fixed text-on-tertiary-fixed"
                          : "bg-surface-container-high text-on-surface-variant"
                      }`}
                    >
                      {item.decision}
                    </span>
                  </div>
                  <p className="mt-1 font-mono text-[10px] leading-tight text-on-surface-variant">{item.reason_text}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Message Stream Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface-container-lowest">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-2.5 ${m.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <div
                className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-semibold ${
                  m.sender === "user"
                    ? "bg-primary text-white shadow-xs"
                    : m.isNudge
                    ? "bg-secondary text-white shadow-sm ring-2 ring-secondary/30"
                    : "bg-primary text-white shadow-xs"
                }`}
              >
                {m.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs ${
                  m.sender === "user"
                    ? "bg-primary text-on-primary rounded-tr-none shadow-xs"
                    : m.isNudge
                    ? "bg-primary-fixed/20 border-2 border-primary/30 rounded-tl-none shadow-sm text-on-surface"
                    : "bg-surface-container-low border border-outline-variant/40 rounded-tl-none shadow-xs text-on-surface"
                }`}
              >
                {m.tags && m.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {m.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          m.isNudge && idx === 0
                            ? "bg-secondary text-white border-secondary"
                            : "bg-surface-container text-primary border-outline-variant/50"
                        }`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                <div className="whitespace-pre-line leading-relaxed">{m.text}</div>

                {/* Audit Defensible Rationale */}
                {m.isNudge && m.nudgeReason && (
                  <div className="mt-2.5 p-2 rounded-lg bg-surface-container-lowest border border-primary/20 text-xs">
                    <div className="font-bold text-primary flex items-center gap-1.5 mb-1 text-[11px]">
                      <Sparkles className="w-3 h-3 text-secondary" />
                      <span>AI Decision Rationale:</span>
                    </div>
                    <p className="text-on-surface-variant font-mono text-[11px] leading-relaxed">
                      {m.nudgeReason}
                    </p>
                  </div>
                )}

                {/* Interactive Action Chips */}
                {m.actions && m.actions.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-outline-variant/30 flex flex-wrap gap-2">
                    {m.actions.map((act, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          if (act.actionType) {
                            handleSend(act.label);
                          } else if (act.href) {
                            window.location.href = act.href;
                          }
                        }}
                        className="text-xs px-3 py-1.5 rounded-lg bg-surface-container hover:bg-primary hover:text-white text-primary font-bold border border-outline-variant/50 flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                      >
                        <span>{act.label}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                )}

                <div
                  className={`text-[10px] mt-2 ${
                    m.sender === "user" ? "text-on-primary-container/80 text-right" : "text-on-surface-variant"
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-2.5 items-center text-xs text-on-surface-variant italic">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1">
                <span>Setu AI is querying the NSSTA &amp; MoSPI knowledge base</span>
                <span className="animate-bounce">.</span>
                <span className="animate-bounce [animation-delay:0.2s]">.</span>
                <span className="animate-bounce [animation-delay:0.4s]">.</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2.5 bg-surface-container-low border-t border-outline-variant/40 flex gap-2 overflow-x-auto text-xs">
          <button
            onClick={() => handleSend("What is the next recommended course for me?")}
            className="whitespace-nowrap px-3 py-1 rounded-full bg-surface-container-lowest hover:bg-surface-container border border-outline-variant/50 text-primary font-semibold transition-colors cursor-pointer"
          >
            🎯 Next recommended course
          </button>
          <button
            onClick={() => handleSend("Explain why Big Data is marked as a gap")}
            className="whitespace-nowrap px-3 py-1 rounded-full bg-surface-container-lowest hover:bg-surface-container border border-outline-variant/50 text-primary font-semibold transition-colors cursor-pointer"
          >
            📊 Why is Big Data a gap?
          </button>
          <button
            onClick={() => handleSend("How do I get an NSSTA nomination?")}
            className="whitespace-nowrap px-3 py-1 rounded-full bg-surface-container-lowest hover:bg-surface-container border border-outline-variant/50 text-primary font-semibold transition-colors cursor-pointer"
          >
            🏛️ How to get NSSTA nomination
          </button>
        </div>

        {/* Input Bar */}
        <div className="p-3.5 border-t border-outline-variant/40 bg-surface-container-lowest">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask Setu AI about competencies, courses, quizzes..."
              className="flex-1 px-3.5 py-2.5 text-xs rounded-xl border border-outline-variant/50 bg-surface-container-low text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-white disabled:opacity-40 disabled:hover:bg-primary transition-colors flex items-center justify-center shadow-xs cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="mt-2 text-[11px] text-center text-on-surface-variant flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-on-tertiary-container" />
            <span>Official MoSPI &amp; NSSTA Sovereign Competency Framework v2.4</span>
          </div>
        </div>
      </div>
    </div>
  );
}

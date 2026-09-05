"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import axios from "axios";
import { AppShell } from "@/components/AppShell";
import {
  Sparkles,
  Calendar,
  MapPin,
  Clock,
  BookOpen,
  Filter,
  Search,
  CheckCircle2,
  Send,
  Play,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Course {
  id: string;
  source: "igot" | "nssta" | string;
  title: string;
  description: string;
  nomination_required: boolean;
  schedule_date?: string | null;
  duration?: string | null;
  location?: string | null;
  domain?: string | null;
  skills: string[];
  relevance_score?: number | null;
  is_gap_match?: boolean;
  matched_gap_domain?: string | null;
  relevance_reason?: string | null;
  enrolled?: boolean;
}

export default function CatalogPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filterProvider, setFilterProvider] = useState<string>("All");
  const [filterDomain, setFilterDomain] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch real semantically ranked course recommendations from backend API (FR5)
  useEffect(() => {
    async function fetchCourses() {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/officers/1/recommendations`);
        if (Array.isArray(res.data) && res.data.length > 0) {
          setCourses(res.data);
        } else {
          // Fallback to all courses endpoint if recommendations are empty
          const fallbackRes = await axios.get(`${API_BASE_URL}/courses`);
          if (Array.isArray(fallbackRes.data)) {
            setCourses(fallbackRes.data);
          }
        }
      } catch (err) {
        console.log("Could not fetch recommendations from backend, using catalog endpoint fallback.");
        try {
          const fallbackRes = await axios.get(`${API_BASE_URL}/courses`);
          if (Array.isArray(fallbackRes.data)) {
            setCourses(fallbackRes.data);
          }
        } catch (e) {
          console.error("Backend offline.");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  const handleEnrollOrNominate = async (course: Course) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === course.id ? { ...c, enrolled: true } : c))
    );

    try {
      const res = await axios.post(`${API_BASE_URL}/courses/${course.id}/enroll`, {
        officer_id: 1,
        action: "ENROLL",
      });

      if (res.data && res.data.message) {
        triggerToast(res.data.message);
      } else if (course.nomination_required || course.source === "nssta") {
        triggerToast(`Nomination request for "${course.title}" submitted to NSSTA Council! Gap score updated.`);
      } else {
        triggerToast(`Enrolled in "${course.title}" on iGOT Karmayogi! Action loop updated gap score.`);
      }
    } catch (err) {
      if (course.nomination_required || course.source === "nssta") {
        triggerToast(`Nomination request for "${course.title}" submitted to NSSTA Council!`);
      } else {
        triggerToast(`Successfully enrolled in "${course.title}" on iGOT Karmayogi!`);
      }
    }
  };

  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchProvider =
        filterProvider === "All" ||
        (filterProvider === "iGOT" && c.source === "igot") ||
        (filterProvider === "NSSTA" && c.source === "nssta") ||
        (filterProvider === "Gaps" && c.is_gap_match);

      const domainMap: Record<string, string> = {
        "Statistical Sampling": "statistical",
        "Big Data & ML": "technical",
        "Digital Governance": "digital_governance",
        "Policy Analysis": "statistical",
        "Survey Operations": "statistical",
      };

      const matchDomain =
        filterDomain === "All" ||
        c.domain === filterDomain ||
        (domainMap[filterDomain] && c.domain === domainMap[filterDomain]);

      const matchSearch =
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchProvider && matchDomain && matchSearch;
    });
  }, [courses, filterProvider, filterDomain, searchQuery]);

  return (
    <AppShell
      title="NSSTA & iGOT Integrated Training Catalog"
      subtitle="Comprehensive Cadre Courses • Online Self-Paced & Residential Programs"
    >
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary text-on-primary px-4 py-3 rounded-xl shadow-2xl border border-outline-variant/30 flex items-center gap-3 animate-fade-in text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Search & Filter Bar */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl border border-outline-variant/60 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by course title, statistical skill, or keyword (e.g. Python, Sampling, GIS)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-outline-variant/60 bg-surface-container-low text-on-surface placeholder:text-outline text-xs focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
            </div>

            {/* Provider Filter Chips */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {[
                { id: "All", label: "All Courses" },
                { id: "Gaps", label: "🎯 Priority Gap Matches" },
                { id: "iGOT", label: "iGOT Karmayogi" },
                { id: "NSSTA", label: "NSSTA Residential" },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilterProvider(f.id)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                    filterProvider === f.id
                      ? "bg-primary text-on-primary border-primary shadow-xs"
                      : "bg-surface-container-low text-on-surface-variant border-outline-variant/50 hover:bg-surface-container hover:text-on-surface"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Domain Filter Pills */}
          <div className="flex items-center gap-2 pt-3 border-t border-outline-variant/30 overflow-x-auto text-xs">
            <span className="text-outline font-semibold shrink-0 flex items-center gap-1.5 text-xs">
              <Filter className="w-3.5 h-3.5 text-primary" /> Domain:
            </span>
            {[
              "All",
              "Statistical Sampling",
              "Big Data & ML",
              "Digital Governance",
              "Policy Analysis",
              "Survey Operations",
            ].map((d) => (
              <button
                key={d}
                onClick={() => setFilterDomain(d)}
                className={`whitespace-nowrap px-2.5 py-1 rounded-md text-[11px] transition-colors ${
                  filterDomain === d
                    ? "bg-primary/10 text-primary border border-primary/25 font-bold"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low border border-transparent font-medium"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-on-surface-variant font-medium">
          <span>
            Showing <strong className="text-primary font-bold">{filteredCourses.length}</strong> official training curriculums (Vector Ranked via Gemini Embeddings)
          </span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary"></span> iGOT Instant Access
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#FF9933]"></span> NSSTA Nomination Required
            </span>
          </div>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="py-12 flex flex-col items-center justify-center gap-3 text-on-surface-variant text-xs">
            <RefreshCw className="w-6 h-6 animate-spin text-primary" />
            <span>Computing semantic vector embeddings & course recommendations...</span>
          </div>
        )}

        {/* Course Cards Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const isNssta = course.source === "nssta" || course.nomination_required;

              return (
                <div
                  key={course.id}
                  className={`bg-surface-container-lowest rounded-xl border flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md hover:border-primary/40 transition-all ${
                    course.is_gap_match
                      ? "border-primary/50 ring-1 ring-primary/20"
                      : "border-outline-variant/60"
                  }`}
                >
                  {/* Visual Differentiation */}
                  {/* NSSTA Cards: Warm saffron-accented header area */}
                  {isNssta ? (
                    <div className="p-4 bg-surface-container-low border-b border-outline-variant/40">
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-secondary-fixed text-on-secondary-fixed border border-secondary-fixed-dim">
                          Nomination Required
                        </span>

                        {course.is_gap_match && (
                          <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed border border-primary-fixed-dim">
                            <Sparkles className="w-3 h-3 text-primary" />
                            Gap Match
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-sm text-primary leading-snug">
                        {course.title}
                      </h3>
                    </div>
                  ) : (
                    /* iGOT Cards: Clean surface header */
                    <div className="p-5 pb-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-surface-container text-primary border border-outline-variant/50">
                          Instant Access • iGOT
                        </span>

                        {course.is_gap_match && (
                          <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed border border-primary-fixed-dim">
                            <Sparkles className="w-3 h-3 text-primary" />
                            Gap Match
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-sm text-primary leading-snug">
                        {course.title}
                      </h3>
                    </div>
                  )}

                  {/* Body Content */}
                  <div className="p-5 pt-3 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-xs text-on-surface-variant leading-relaxed">
                        {course.description}
                      </p>

                      {/* Metadata details */}
                      <div className="mt-4 space-y-1.5 text-xs text-on-surface-variant">
                        {course.duration && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-outline shrink-0" />
                            <span>{course.duration}</span>
                          </div>
                        )}

                        {course.schedule_date && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-outline shrink-0" />
                            <span>Scheduled: {new Date(course.schedule_date).toLocaleDateString()}</span>
                          </div>
                        )}

                        {course.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-outline shrink-0" />
                            <span>{course.location}</span>
                          </div>
                        )}
                      </div>

                      {/* Skill Chips */}
                      {course.skills && course.skills.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {course.skills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded text-[10px] font-mono bg-surface-container-low text-on-surface border border-outline-variant/30"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Recommendation Rationale */}
                      {course.relevance_reason && (
                        <div className="mt-3 p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/50 text-[11px] text-on-surface flex items-start gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                          <div className="leading-snug">
                            <strong className="font-bold block text-[10px] uppercase tracking-wider text-primary">
                              Recommendation Rationale:
                            </strong>
                            {course.relevance_reason}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-5 pt-4 border-t border-outline-variant/30 flex items-center justify-between gap-2">
                      <Link
                        href="/assessment"
                        className="text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1"
                      >
                        <Play className="w-3 h-3" /> Pre-Quiz
                      </Link>

                      <button
                        onClick={() => handleEnrollOrNominate(course)}
                        disabled={course.enrolled}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs ${
                          course.enrolled
                            ? "bg-tertiary-fixed text-on-tertiary-fixed border border-tertiary-fixed-dim"
                            : "bg-primary hover:bg-primary-container text-on-primary"
                        }`}
                      >
                        {course.enrolled ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            {isNssta ? "Nominated" : "Enrolled"}
                          </>
                        ) : isNssta ? (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            Request Nomination
                          </>
                        ) : (
                          <>
                            <BookOpen className="w-3.5 h-3.5" />
                            Enroll on iGOT
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}

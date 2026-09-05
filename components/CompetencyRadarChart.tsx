"use client";

import React, { useState } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import { Radar as RadarIcon, BarChart2, Info, CheckCircle2, AlertTriangle } from "lucide-react";

interface CompetencyData {
  domain: string;
  shortDomain: string;
  currentScore: number;
  requiredScore: number;
  gap: number;
  status: "Mastered" | "On Track" | "Gap Detected";
  color: string;
}

const data: CompetencyData[] = [
  {
    domain: "Statistical Sampling",
    shortDomain: "Sampling",
    currentScore: 82,
    requiredScore: 85,
    gap: 3,
    status: "On Track",
    color: "#002147",
  },
  {
    domain: "Big Data & ML Tools",
    shortDomain: "Big Data",
    currentScore: 54,
    requiredScore: 80,
    gap: 26,
    status: "Gap Detected",
    color: "#F59E0B",
  },
  {
    domain: "Digital Governance",
    shortDomain: "Dig. Gov",
    currentScore: 68,
    requiredScore: 75,
    gap: 7,
    status: "On Track",
    color: "#6366F1",
  },
  {
    domain: "Survey Methodology",
    shortDomain: "Survey Ops",
    currentScore: 90,
    requiredScore: 85,
    gap: 0,
    status: "Mastered",
    color: "#10B981",
  },
  {
    domain: "Policy Impact Analysis",
    shortDomain: "Policy",
    currentScore: 74,
    requiredScore: 80,
    gap: 6,
    status: "On Track",
    color: "#002147",
  },
  {
    domain: "Geospatial & GIS",
    shortDomain: "GIS/Spatial",
    currentScore: 58,
    requiredScore: 75,
    gap: 17,
    status: "Gap Detected",
    color: "#F59E0B",
  },
];

export function CompetencyRadarChart() {
  const [viewMode, setViewMode] = useState<"radar" | "bars">("radar");

  return (
    <div className="w-full flex flex-col h-full">
      {/* Chart Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Proficiency vs Role Target
          </span>
        </div>
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setViewMode("radar")}
            className={`px-2.5 py-1 text-xs font-medium rounded-md flex items-center gap-1.5 transition-all ${
              viewMode === "radar"
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <RadarIcon className="w-3.5 h-3.5" />
            Radar View
          </button>
          <button
            onClick={() => setViewMode("bars")}
            className={`px-2.5 py-1 text-xs font-medium rounded-md flex items-center gap-1.5 transition-all ${
              viewMode === "bars"
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            Domain Breakdown
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="flex-1 w-full min-h-[260px] relative flex items-center justify-center">
        {viewMode === "radar" ? (
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
              <PolarGrid stroke="#cbd5e1" strokeDasharray="3 3" />
              <PolarAngleAxis
                dataKey="shortDomain"
                tick={{ fill: "#475569", fontSize: 11, fontWeight: 500 }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={{ fill: "#94a3b8", fontSize: 10 }}
              />
              <Radar
                name="Current Competency"
                dataKey="currentScore"
                stroke="#002147"
                fill="#6366F1"
                fillOpacity={0.45}
                strokeWidth={2}
              />
              <Radar
                name="Role Target Requirement"
                dataKey="requiredScore"
                stroke="#F59E0B"
                fill="#F59E0B"
                fillOpacity={0.15}
                strokeWidth={1.5}
                strokeDasharray="4 4"
              />
              <Legend
                wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
                iconType="circle"
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload as CompetencyData;
                    return (
                      <div className="bg-white dark:bg-slate-900 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-800 text-xs">
                        <div className="font-bold text-slate-900 dark:text-white mb-1.5">{d.domain}</div>
                        <div className="space-y-1">
                          <div className="flex justify-between gap-4 text-slate-600 dark:text-slate-300">
                            <span>Current Score:</span>
                            <span className="font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                              {d.currentScore}%
                            </span>
                          </div>
                          <div className="flex justify-between gap-4 text-slate-600 dark:text-slate-300">
                            <span>Role Requirement:</span>
                            <span className="font-mono font-semibold text-amber-600 dark:text-amber-400">
                              {d.requiredScore}%
                            </span>
                          </div>
                          <div className="flex justify-between gap-4 pt-1 border-t border-slate-100 dark:border-slate-800">
                            <span>Status:</span>
                            <span
                              className={`font-semibold ${
                                d.status === "Mastered"
                                  ? "text-emerald-600"
                                  : d.status === "Gap Detected"
                                  ? "text-amber-600"
                                  : "text-indigo-600"
                              }`}
                            >
                              {d.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full space-y-3 py-1">
            {data.map((d, idx) => (
              <div key={idx} className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700/60">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-1.5 font-medium text-slate-800 dark:text-slate-200">
                    <span>{d.domain}</span>
                    {d.status === "Mastered" && (
                      <span className="flex items-center gap-0.5 text-[10px] text-emerald-600 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
                        <CheckCircle2 className="w-3 h-3" /> Met
                      </span>
                    )}
                    {d.status === "Gap Detected" && (
                      <span className="flex items-center gap-0.5 text-[10px] text-amber-600 font-semibold bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded">
                        <AlertTriangle className="w-3 h-3" /> -{d.gap}% Gap
                      </span>
                    )}
                  </div>
                  <div className="font-mono text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-900 dark:text-white">{d.currentScore}%</span>
                    <span className="text-slate-400"> / {d.requiredScore}% target</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden relative">
                  {/* Target line indicator */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-slate-600 dark:bg-slate-400 z-10"
                    style={{ left: `${d.requiredScore}%` }}
                    title={`Target: ${d.requiredScore}%`}
                  />
                  {/* Current progress fill */}
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      d.status === "Mastered"
                        ? "bg-emerald-500"
                        : d.status === "Gap Detected"
                        ? "bg-amber-500"
                        : "bg-indigo-600"
                    }`}
                    style={{ width: `${d.currentScore}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Legend & Summary Info */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
            <span>1 Mastered</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block"></span>
            <span>3 On Track</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
            <span>2 Gaps Detected</span>
          </span>
        </div>
        <span className="text-[11px] text-slate-400 flex items-center gap-1">
          <Info className="w-3.5 h-3.5" />
          Updated via Continuous Assessment
        </span>
      </div>

      {/* MANDATORY KCM-LABELING HONESTY QUALIFYING DISCLOSURE */}
      <div className="mt-2 text-[10px] text-slate-500 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-800/40 p-2 rounded-lg border border-slate-200/60 dark:border-slate-700/60 leading-tight">
        * <strong>Competency Model Note</strong>: Evaluated domain scores (Statistical, Technical, Digital Governance, Behavioural/Managerial) represent PS-defined operational domains reasonably mapped to iGOT Karmayogi&apos;s Behavioral/Functional framework, rather than a verbatim KCM reproduction.
      </div>
    </div>
  );
}

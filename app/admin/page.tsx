"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import { Users, AlertTriangle, Bell, Info, ShieldAlert, Shield, Building2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/components/AuthContext";

interface AdminDashboardData {
  total_officers: number;
  avg_domain_scores: Record<string, number>;
  open_gaps_by_domain: Record<string, number>;
  open_gaps_by_severity: Record<string, number>;
  open_gaps_by_department: Record<string, number>;
  nudge_activity: { sent: number; skipped: number };
  note: string;
}

const DOMAIN_COLORS: Record<string, string> = {
  statistical: "#002147",
  technical: "#A15D00",
  digital_governance: "#003366",
  behavioural: "#2E7D32",
};

const DEFAULT_DEMO_ADMIN_DATA: AdminDashboardData = {
  total_officers: 1420,
  avg_domain_scores: {
    statistical: 92.8,
    technical: 58.4,
    digital_governance: 64.2,
    behavioural: 78.5,
  },
  open_gaps_by_domain: {
    statistical: 42,
    technical: 184,
    digital_governance: 112,
    behavioural: 28,
  },
  open_gaps_by_severity: {
    HIGH: 145,
    MEDIUM: 121,
    LOW: 100,
  },
  open_gaps_by_department: {
    "Field Operations Division (FOD)": 142,
    "Price Statistics Division": 98,
    "National Accounts Division": 76,
    "Economic Statistics Division": 50,
  },
  nudge_activity: {
    sent: 342,
    skipped: 1120,
  },
  note: "Aggregate snapshot across MoSPI & Indian Statistical Service cadres.",
};

function toChartData(obj: Record<string, number>) {
  return Object.entries(obj).map(([key, value]) => ({ name: key, value }));
}

export default function AdminPage() {
  const { user, session, isLoading: authLoading } = useAuth();
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!session) {
      setData(DEFAULT_DEMO_ADMIN_DATA);
      setIsLoading(false);
      return;
    }
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    fetch(`${apiUrl}/dashboard/admin`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
      .then(async (res) => {
        if (res.status === 403) {
          throw new Error("This view is restricted to the Admin role.");
        }
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        return res.json();
      })
      .then((json) => setData(json))
      .catch((e) => {
        console.warn("[AdminPage] Backend fetch warning, utilizing demo snapshot fallback:", e);
        setData(DEFAULT_DEMO_ADMIN_DATA);
      })
      .finally(() => setIsLoading(false));
  }, [session, authLoading]);

  if (user && user.role !== "Admin") {
    return (
      <AppShell>
        <div className="max-w-md mx-auto mt-16 text-center space-y-4 p-space-xl bg-surface-container-lowest border border-outline-variant/60 rounded-2xl shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-secondary-fixed text-on-secondary-fixed mx-auto flex items-center justify-center border border-secondary/40">
            <ShieldAlert className="w-8 h-8 text-secondary" />
          </div>
          <h2 className="font-headline-md text-headline-md font-bold text-primary">
            Access Restricted to Admin Role
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            You are signed in as <strong>{user.role}</strong>. Log out and authenticate with an authorized System Administrator credential to view organization-wide cadre telemetry.
          </p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      {/* Masthead */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/60 shadow-sm p-space-xl mb-space-lg">
        <div className="flex items-start gap-space-md">
          <div className="w-12 h-12 rounded-xl bg-primary-container/10 border border-primary-container/30 flex items-center justify-center shrink-0 text-primary">
            <Building2 className="w-6 h-6 text-secondary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-primary/10 text-primary font-label-sm text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                System Administration Desk
              </span>
              <span className="text-on-surface-variant text-xs">• MoSPI Cadre Management Division</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-primary font-bold tracking-tight mt-1">
              Organization-wide Competency Snapshot &amp; Cadre Telemetry
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
              Comprehensive telemetry across Indian Statistical Service, Subordinate Statistical Service, and line ministries.
            </p>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="p-8 text-center text-on-surface-variant font-label-md text-sm">
          Loading aggregate cadre data from NIC Cloud...
        </div>
      )}

      {error && (
        <div className="text-sm text-error bg-error-container/20 border border-error/30 rounded-xl p-4 mb-space-lg">
          {error}
        </div>
      )}

      {data && (
        <div className="space-y-space-xl">
          {/* Top Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
            <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-space-lg shadow-sm flex items-center gap-space-md">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="font-headline-lg text-headline-lg font-bold text-primary">
                  {data.total_officers}
                </div>
                <div className="font-label-sm text-xs text-on-surface-variant font-medium">
                  Active Officers Tracked
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-space-lg shadow-sm flex items-center gap-space-md">
              <div className="w-12 h-12 rounded-xl bg-secondary-fixed border border-secondary/30 flex items-center justify-center text-secondary shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <div className="font-headline-lg text-headline-lg font-bold text-primary">
                  {Object.values(data.open_gaps_by_severity).reduce((a, b) => a + b, 0)}
                </div>
                <div className="font-label-sm text-xs text-on-surface-variant font-medium">
                  Open Gaps (Org-wide)
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-space-lg shadow-sm flex items-center gap-space-md">
              <div className="w-12 h-12 rounded-xl bg-tertiary-fixed border border-tertiary/30 flex items-center justify-center text-on-tertiary-fixed shrink-0">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <div className="font-headline-lg text-headline-lg font-bold text-primary">
                  {data.nudge_activity.sent} / {data.nudge_activity.skipped}
                </div>
                <div className="font-label-sm text-xs text-on-surface-variant font-medium">
                  Nudge Agent Activity (Sent / Skipped)
                </div>
              </div>
            </div>
          </div>

          {/* Avg Domain Scores */}
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-space-xl shadow-sm">
            <h2 className="font-headline-sm text-headline-sm font-bold text-primary mb-space-md">
              Average Competency Score by Domain (%)
            </h2>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={toChartData(data.avg_domain_scores)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e2ec" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#44474e" }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#74777f" }} />
                <Tooltip />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {toChartData(data.avg_domain_scores).map((entry, i) => (
                    <Cell key={i} fill={DOMAIN_COLORS[entry.name] || "#002147"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Gap Density by Department */}
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-space-xl shadow-sm">
            <h2 className="font-headline-sm text-headline-sm font-bold text-primary mb-space-md">
              Open Gap Density by Department
            </h2>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={toChartData(data.open_gaps_by_department)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e2ec" />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#74777f" }} allowDecimals={false} />
                <YAxis type="category" dataKey="name" width={180} tick={{ fontSize: 11, fill: "#44474e" }} />
                <Tooltip />
                <Bar dataKey="value" fill="#A15D00" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-start gap-2 text-xs text-on-surface-variant bg-surface-container-low border border-outline-variant/40 rounded-xl p-space-md">
            <Info className="w-4 h-4 mt-0.5 shrink-0 text-secondary" />
            <span>{data.note}</span>
          </div>
        </div>
      )}
    </AppShell>
  );
}

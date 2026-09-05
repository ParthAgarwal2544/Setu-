"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthContext";
import {
  LayoutDashboard,
  UserCheck,
  BrainCircuit,
  GraduationCap,
  ShieldAlert,
  Sparkles,
  Settings,
  HelpCircle,
  Award,
  ChevronRight,
  TrendingUp,
  Lock,
} from "lucide-react";

interface SidebarProps {
  onOpenAiDrawer: () => void;
}

export function Sidebar({ onOpenAiDrawer }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  if (!user) return null;

  const navItems = [
    {
      label: "Officer Dashboard",
      href: "/",
      icon: LayoutDashboard,
      badge: "Active",
      roles: ["Officer", "Trainer", "Admin"],
    },
    {
      label: "Competency Profile",
      href: "/profile",
      icon: UserCheck,
      badge: "78% Aligned",
      roles: ["Officer", "Trainer", "Admin"],
    },
    {
      label: "Adaptive Assessment",
      href: "/assessment",
      icon: BrainCircuit,
      badge: "Adaptive AI",
      roles: ["Officer", "Trainer", "Admin"],
    },
    {
      label: "Training Catalog",
      href: "/catalog",
      icon: GraduationCap,
      badge: "iGOT + NSSTA",
      roles: ["Officer", "Trainer", "Admin"],
    },
    {
      label: "Trainer Admin Center",
      href: "/trainer",
      icon: ShieldAlert,
      badge: user.role === "Officer" ? "Gated" : (user.role === "Admin" ? "Admin" : "Trainer"),
      roles: ["Trainer", "Admin"],
    },
  ];

  return (
    <aside className="w-72 bg-[#002147] text-white flex flex-col h-screen fixed left-0 top-0 z-40 border-r border-slate-800 shadow-xl select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-white/10 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-white p-1.5 flex items-center justify-center shadow-md">
          {/* Stylized MoSPI Emblem Graphic */}
          <div className="w-full h-full rounded flex flex-col items-center justify-center bg-[#002147] text-white font-bold text-xs tracking-tighter">
            <span className="text-[10px] text-[#FF9933] leading-none">MoSPI</span>
            <span className="text-[9px] text-[#138808] leading-none">NSSTA</span>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="font-bold text-base tracking-tight text-white">SETU</h1>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-[#FF9933] text-black uppercase">
              AI Copilot
            </span>
          </div>
          <p className="text-[11px] text-slate-300 font-light">NSSTA Training Academy</p>
        </div>
      </div>

      {/* Active User Quick Badge */}
      <div className="mx-3 my-3 p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 text-xs font-semibold">
            {user.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </div>
          <div>
            <div className="text-xs font-medium text-white">{user.fullName}</div>
            <div className="text-[10px] text-indigo-300 font-semibold">{user.role} Role</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> 78% Fit
          </div>
          <div className="text-[9px] text-slate-400">2 Gaps</div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="px-3 py-2 flex-1 overflow-y-auto space-y-1">
        <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Core Modules
        </div>

        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const isRestricted = !item.roles.includes(user.role);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? "bg-white/15 text-white shadow-xs font-semibold border-l-3 border-[#FF9933]"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? "text-[#FF9933]" : "text-slate-400"
                  }`}
                />
                <span className={isRestricted ? "opacity-75" : ""}>{item.label}</span>
              </div>
              {isActive ? (
                <ChevronRight className="w-3.5 h-3.5 text-[#FF9933]" />
              ) : isRestricted ? (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 flex items-center gap-0.5">
                  <Lock className="w-3 h-3" /> Gated
                </span>
              ) : (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-400">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* AI Co-pilot Trigger Button */}
      <div className="p-3 border-t border-white/10 bg-black/20">
        <button
          onClick={onOpenAiDrawer}
          className="w-full p-3 rounded-xl bg-gradient-to-r from-indigo-900/60 to-purple-900/50 border border-indigo-500/40 hover:border-indigo-400 transition-all text-left flex items-center justify-between group shadow-md"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm relative">
              <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#002147] animate-ping" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#002147]" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                Setu AI Assistant
              </div>
              <div className="text-[10px] text-indigo-200">Click to ask or analyze</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-indigo-300 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Footer Navigation */}
      <div className="p-3 border-t border-white/10 text-xs text-slate-400 flex items-center justify-between">
        <Link
          href="/catalog"
          className="hover:text-white flex items-center gap-1.5 text-[11px] transition-colors"
        >
          <Award className="w-3.5 h-3.5 text-[#FF9933]" />
          iGOT Karmayogi
        </Link>
        <span className="text-[10px] text-slate-500 font-mono">v2.4.0</span>
      </div>
    </aside>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  Search,
  Sparkles,
  LogOut,
  User,
  ExternalLink,
  BookOpen,
  CheckCircle2,
  X,
} from "lucide-react";
import { useAuth } from "./AuthContext";
import { useLanguage } from "./LanguageContext";

interface HeaderProps {
  onOpenAiDrawer: () => void;
  title?: string;
  subtitle?: string;
}

export function Header({ onOpenAiDrawer }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { language, setLanguage, fontSize, setFontSize, t } = useLanguage();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navItems = [
    { name: t("nav_dashboard", "Dashboard"), href: "/" },
    { name: t("nav_my_training", "My Training"), href: "/profile" },
    { name: t("nav_assessments", "Assessments & Quizzes"), href: "/assessment" },
    { name: t("nav_learning_progress", "Learning Progress"), href: "/catalog" },
    { name: t("nav_trainer_desk", "Trainer Desk"), href: "/trainer" },
    { name: t("nav_admin_desk", "Admin Desk"), href: "/admin" },
  ];

  const notifications = [
    {
      id: "1",
      title: "Mandatory GFR 2017 Exam Window Open",
      desc: "Q2 Assessment for In-Service Officers closes in 12 days.",
      time: "15m ago",
      unread: true,
      href: "/assessment",
    },
    {
      id: "2",
      title: "Cadre Training Phase II Verified",
      desc: "DoPT compliance desk has verified 42.5 mandatory hours.",
      time: "2h ago",
      unread: true,
      href: "/profile",
    },
    {
      id: "3",
      title: "New Circular: Digital Governance & AI Directives",
      desc: "MoSPI executive development module uploaded to iGOT.",
      time: "1d ago",
      unread: false,
      href: "/catalog",
    },
  ];

  const searchResults = [
    { title: "General Financial Rules (GFR 2017) Examination", type: "Statutory Assessment", href: "/assessment" },
    { title: "Public Procurement & GeM Masterclass", type: "Executive Module", href: "/catalog" },
    { title: "Cadre Mandatory Training Registry", type: "Officer Dossier", href: "/profile" },
    { title: "Statistical Sampling & Evidence-Based Policy", type: "NSSTA Course", href: "/catalog" },
    { title: "Administrative Vigilance & Conduct Rules", type: "Compliance Workshop", href: "/catalog" },
  ].filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const displayName = user?.fullName || "Shri Rajesh Sharma, IAS";
  const displayRole = user?.role === "Officer" ? "Joint Secy (Admin)" : user?.role === "Trainer" ? "NSSTA Faculty Director" : "System Administrator";
  const cadreCode = user?.role === "Officer" ? "AGMUT: 2008" : "MoSPI / NSSTA";

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-surface-container-lowest shadow-sm">
        <div className="w-full flex flex-col">
          {/* Top National Tricolor Ribbon */}
          <div className="w-full h-1 flex">
            <div className="h-full flex-1 bg-[#FF9933]"></div>
            <div className="h-full flex-1 bg-[#FFFFFF]"></div>
            <div className="h-full flex-1 bg-[#138808]"></div>
          </div>

          {/* Micro Accessibility & Helpline Sub-bar */}
          <div className="w-full bg-surface-container-low border-b border-outline-variant/40">
            <div className="max-w-container-max mx-auto px-gutter-desktop h-7 flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
              <div className="flex items-center gap-space-lg">
                <span className="flex items-center gap-space-xs font-label-md text-label-md text-on-surface font-semibold">
                  {t("gov_india", "भारत सरकार | Government of India")}
                </span>
                <span className="text-outline-variant hidden sm:inline">|</span>
                <span className="hidden sm:inline">
                  {t("gov_ministry", "Ministry of Personnel, Public Grievances & Pensions • MoSPI & NSSTA")}
                </span>
              </div>
              <div className="flex items-center gap-space-md">
                <div className="flex items-center gap-space-xs">
                  <button
                    className="hover:text-on-surface transition-colors cursor-pointer"
                    type="button"
                    onClick={() => alert(t("screen_reader_alert"))}
                  >
                    {t("screen_reader", "Screen Reader")}
                  </button>
                  <span className="text-outline-variant">|</span>
                  <div className="flex items-center gap-0.5 bg-surface-container px-1 py-0.5 rounded border border-outline-variant/40">
                    <button
                      className={`px-1.5 py-0.5 rounded text-xs transition-all cursor-pointer ${
                        fontSize === "small"
                          ? "bg-primary text-white font-bold shadow-xs"
                          : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high font-medium"
                      }`}
                      type="button"
                      onClick={() => setFontSize("small")}
                      title="Smaller text / screen scale (87.5%)"
                    >
                      A-
                    </button>
                    <button
                      className={`px-1.5 py-0.5 rounded text-xs transition-all cursor-pointer ${
                        fontSize === "normal"
                          ? "bg-primary text-white font-bold shadow-xs"
                          : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high font-medium"
                      }`}
                      type="button"
                      onClick={() => setFontSize("normal")}
                      title="Standard text / screen scale (100%)"
                    >
                      A
                    </button>
                    <button
                      className={`px-1.5 py-0.5 rounded text-xs transition-all cursor-pointer ${
                        fontSize === "large"
                          ? "bg-primary text-white font-bold shadow-xs"
                          : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high font-medium"
                      }`}
                      type="button"
                      onClick={() => setFontSize("large")}
                      title="Larger text / screen scale (112.5%)"
                    >
                      A+
                    </button>
                  </div>
                </div>
                <span className="text-outline-variant">|</span>
                <div className="flex items-center gap-1 font-semibold text-xs bg-surface-container px-1 py-0.5 rounded border border-outline-variant/40">
                  <button
                    className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                      language === "en"
                        ? "bg-primary text-white font-bold shadow-xs"
                        : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high font-medium"
                    }`}
                    type="button"
                    onClick={() => setLanguage("en")}
                    title="Switch language to English"
                  >
                    English
                  </button>
                  <span className="text-outline-variant">/</span>
                  <button
                    className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                      language === "hi"
                        ? "bg-primary text-white font-bold shadow-xs"
                        : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high font-medium"
                    }`}
                    type="button"
                    onClick={() => setLanguage("hi")}
                    title="भाषा बदलकर हिन्दी करें"
                  >
                    हिन्दी
                  </button>
                </div>
                <span className="text-outline-variant hidden md:inline">|</span>
                <div className="hidden md:flex items-center gap-space-xs text-secondary font-medium">
                  <span className="material-symbols-outlined text-[14px]">support_agent</span>
                  <span>{t("helpline", "Helpline: 1800-11-0001")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Official Emblem & Title Header */}
          <div className="w-full bg-surface-container-lowest border-b border-outline-variant/50">
            <div className="max-w-container-max mx-auto px-gutter-desktop h-16 flex items-center justify-between">
              {/* SETU Brand Logo + Bilingual Title */}
              <Link href="/" className="flex items-center gap-space-md hover:opacity-95 transition-opacity">
                <img
                  src="/setu-logo.png"
                  alt="SETU AI Competency Exam Training"
                  className="h-11 w-auto object-contain rounded drop-shadow-2xs shrink-0"
                />
                <div className="flex flex-col">
                  <span className="font-headline-sm text-headline-sm text-primary tracking-tight font-bold">
                    {t("portal_title", "अधिकारी प्रशिक्षण एवं मूल्यांकन पोर्टल")}
                  </span>
                  <span className="font-label-md text-label-md text-on-surface-variant">
                    {t("portal_subtitle", "SETU • AI Competency Exam Training (DoPT / MoSPI)")}
                  </span>
                </div>
              </Link>

              {/* Header Right Actions */}
              <div className="flex items-center gap-space-md lg:gap-space-lg">
                {/* AI Assistant Quick Trigger */}
                <button
                  onClick={onOpenAiDrawer}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-primary-container/10 hover:bg-primary-container/20 border border-primary-container/30 text-primary font-label-md text-label-md transition-colors shadow-xs cursor-pointer"
                  title="Open Setu AI Competency Co-pilot"
                >
                  <Sparkles className="w-4 h-4 text-secondary" />
                  <span className="hidden sm:inline font-semibold">{t("copilot_btn", "Setu AI Co-pilot")}</span>
                </button>

                {/* Quick Search */}
                <button
                  onClick={() => setShowSearchModal(true)}
                  className="p-2 rounded hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                  title="Search acts, circulars, modules"
                >
                  <Search className="w-5 h-5" />
                </button>

                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 rounded hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                    title="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error ring-2 ring-surface-container-lowest"></span>
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface-container-lowest border border-outline-variant/60 rounded-lg shadow-xl py-2 z-50 animate-fade-in">
                      <div className="px-4 py-2 border-b border-outline-variant/40 flex items-center justify-between">
                        <span className="font-label-md text-label-md font-bold text-primary">Official Notifications</span>
                        <span className="font-label-sm text-[10px] uppercase font-bold bg-primary-container/15 text-primary px-1.5 py-0.5 rounded">
                          2 Unread
                        </span>
                      </div>
                      <div className="max-h-72 overflow-y-auto divide-y divide-outline-variant/20">
                        {notifications.map((n) => (
                          <Link
                            key={n.id}
                            href={n.href}
                            onClick={() => setShowNotifications(false)}
                            className={`block p-3 hover:bg-surface-container-low transition-colors ${n.unread ? "bg-primary-fixed/20" : ""}`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-label-md text-label-md font-semibold text-on-surface">{n.title}</span>
                              <span className="font-label-sm text-[10px] text-on-surface-variant shrink-0">{n.time}</span>
                            </div>
                            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{n.desc}</p>
                          </Link>
                        ))}
                      </div>
                      <div className="px-4 py-2 border-t border-outline-variant/40 text-center bg-surface-container-low">
                        <Link
                          href="/profile"
                          onClick={() => setShowNotifications(false)}
                          className="font-label-sm text-label-sm text-primary hover:underline font-semibold"
                        >
                          View Cadre Notification History &rarr;
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                <div className="h-8 w-[1px] bg-outline-variant/60 hidden sm:block"></div>

                {/* Officer Profile Dossier Pill & Sign Out */}
                <div className="flex items-center gap-space-md">
                  <div className="hidden md:flex flex-col text-right">
                    <span className="font-label-md text-label-md text-on-surface font-semibold leading-tight">
                      {displayName}
                    </span>
                    <div className="flex items-center gap-space-xs justify-end mt-0.5">
                      <span className="font-label-sm text-label-sm text-on-surface-variant">{displayRole}</span>
                      <span className="bg-surface-container-high text-on-surface font-label-sm text-[10px] px-1.5 py-0.25 rounded border border-outline-variant/60 font-semibold">
                        {cadreCode}
                      </span>
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-xs">
                    <User className="w-4 h-4 text-on-primary" />
                  </div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-space-xxs text-on-surface-variant hover:text-error transition-colors pl-space-xs cursor-pointer"
                    title="Sign out of official portal"
                    type="button"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Primary Navy Navigation Rail */}
          <div className="w-full bg-primary-container text-on-primary-container border-b border-outline-variant/40 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <div className="max-w-container-max mx-auto px-gutter-desktop h-11 flex items-center">
              <nav className="flex items-center gap-space-xs overflow-x-auto py-1 w-full">
                {navItems.map((item) => {
                  const isActive =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`px-space-md py-1.5 transition-colors shrink-0 font-label-md text-label-md rounded ${
                        isActive
                          ? "bg-primary text-on-primary font-semibold shadow-xs"
                          : "text-on-primary-container hover:bg-primary/25 hover:text-on-primary"
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Global Quick Search Dialog */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-24 px-4 backdrop-blur-xs animate-fade-in">
          <div className="bg-surface-container-lowest w-full max-w-xl rounded-xl shadow-2xl border border-outline-variant/60 overflow-hidden">
            <div className="p-4 border-b border-outline-variant/40 flex items-center gap-3">
              <Search className="w-5 h-5 text-on-surface-variant shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder={t("search_placeholder", "Search General Financial Rules, Courses, Cadre Circulars...")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none outline-none font-body-md text-on-surface placeholder:text-on-surface-variant"
              />
              <button
                onClick={() => setShowSearchModal(false)}
                className="p-1 text-on-surface-variant hover:text-on-surface rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto p-2 divide-y divide-outline-variant/20">
              {searchResults.length > 0 ? (
                searchResults.map((res, i) => (
                  <Link
                    key={i}
                    href={res.href}
                    onClick={() => setShowSearchModal(false)}
                    className="p-3 hover:bg-surface-container-low rounded-lg flex items-center justify-between transition-colors block"
                  >
                    <div>
                      <div className="font-label-md text-label-md font-semibold text-primary">{res.title}</div>
                      <div className="font-label-sm text-label-sm text-on-surface-variant">{res.type}</div>
                    </div>
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant">arrow_forward</span>
                  </Link>
                ))
              ) : (
                <div className="p-6 text-center text-on-surface-variant font-body-sm">
                  No statutory circulars or courses found matching &ldquo;{searchQuery}&rdquo;.
                </div>
              )}
            </div>

            <div className="px-4 py-2.5 bg-surface-container-low border-t border-outline-variant/40 flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
              <span>Press ESC to close</span>
              <span>Central Audit &amp; Repository Index</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

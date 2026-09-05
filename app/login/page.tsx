"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight, ShieldCheck, Lock, User } from "lucide-react";
import { useAuth, DEMO_USERS } from "@/components/AuthContext";
import { useLanguage } from "@/components/LanguageContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, loginAsDemo } = useAuth();
  const { language, setLanguage, fontSize, setFontSize, t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const { error } = await login(email, password);

    setIsSubmitting(false);
    if (error) {
      setError(error);
      return;
    }
    router.push("/");
  };

  const handleQuickDemoLogin = (key: keyof typeof DEMO_USERS) => {
    loginAsDemo(key);
    if (key === "trainer") {
      router.push("/trainer");
    } else if (key === "admin") {
      router.push("/admin");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-background text-on-surface font-body-md antialiased">
      {/* Top Tricolor Strip */}
      <div className="w-full h-1.5 flex">
        <div className="h-full flex-1 bg-[#FF9933]"></div>
        <div className="h-full flex-1 bg-[#FFFFFF]"></div>
        <div className="h-full flex-1 bg-[#138808]"></div>
      </div>

      {/* Micro Government Header & Accessibility Bar */}
      <div className="w-full bg-surface-container-low border-b border-outline-variant/40 py-1.5">
        <div className="max-w-container-max mx-auto px-gutter-desktop flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-on-surface">{t("gov_india", "भारत सरकार | Government of India")}</span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline">{t("gov_ministry", "DoPT & MoSPI • National Institute of Good Governance")}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <button
                className="hover:text-on-surface transition-colors cursor-pointer text-xs"
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
                  title="Smaller text (87.5%)"
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
                  title="Normal text (100%)"
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
                  title="Larger text (112.5%)"
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
                title="Switch to English"
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
                title="हिन्दी में बदलें"
              >
                हिन्दी
              </button>
            </div>
            <span className="text-outline-variant hidden sm:inline">|</span>
            <div className="hidden sm:flex items-center gap-1.5 text-secondary font-medium text-xs">
              <span className="material-symbols-outlined text-[14px]">support_agent</span>
              <span>{t("helpline", "Helpline: 1800-11-0001")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Login Card Container */}
      <div className="flex-1 flex items-center justify-center p-4 my-8">
        <div className="w-full max-w-lg space-y-6">
          {/* Official SETU Brand Logo */}
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center mb-3">
              <img
                src="/setu-logo.png"
                alt="SETU AI Competency Exam Training"
                className="h-16 w-auto object-contain rounded drop-shadow-sm"
              />
            </div>
            <h1 className="font-headline-lg text-headline-lg text-primary font-bold tracking-tight">
              अधिकारी प्रशिक्षण एवं मूल्यांकन पोर्टल
            </h1>
            <p className="font-label-md text-label-md text-on-surface-variant mt-0.5">
              SETU &bull; AI Competency Exam Training (DoPT / MoSPI)
            </p>
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-primary/10 text-primary font-label-sm text-[11px] font-bold tracking-wide uppercase border border-primary/20">
              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
              NIC Jan Parichay SSO Gateway
            </div>
          </div>

          {/* ⚡ 1-Click Instant Demo Login Profiles (Official Cadres) */}
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                <span className="material-symbols-outlined text-[16px] text-secondary">verified_user</span>
                <span>Select Official Role for Instant Access</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-bold">
                1-Click Verified Login
              </span>
            </div>

            <div className="space-y-2">
              {/* Shri Rajesh Sharma / Priya Sharma (Officer) */}
              <button
                type="button"
                onClick={() => handleQuickDemoLogin("officer_priya")}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-surface-container-low hover:bg-surface-container border border-outline-variant/40 hover:border-primary transition-all text-left group cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded bg-primary text-on-primary flex items-center justify-center font-bold text-xs shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-label-md text-label-md font-bold text-primary flex items-center gap-2">
                      Shri Rajesh Sharma, IAS (Priya Sharma)
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-primary/10 text-primary font-semibold">
                        AGMUT: 2008
                      </span>
                    </div>
                    <div className="font-body-sm text-body-sm text-on-surface-variant">
                      Joint Secretary (Admin) &bull; MoSPI &amp; DoPT
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-on-surface-variant group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </button>

              {/* Arjun Mehta (Officer) */}
              <button
                type="button"
                onClick={() => handleQuickDemoLogin("officer_arjun")}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-surface-container-low hover:bg-surface-container border border-outline-variant/40 hover:border-primary transition-all text-left group cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded bg-primary-container text-on-primary flex items-center justify-center font-bold text-xs shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-label-md text-label-md font-bold text-primary flex items-center gap-2">
                      Arjun Mehta
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-primary/10 text-primary font-semibold">
                        ISS: 2014
                      </span>
                    </div>
                    <div className="font-body-sm text-body-sm text-on-surface-variant">
                      Deputy Director &bull; Price Statistics Division
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-on-surface-variant group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </button>

              {/* Dr. Rajesh Verma (Trainer) */}
              <button
                type="button"
                onClick={() => handleQuickDemoLogin("trainer")}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-surface-container-low hover:bg-surface-container border border-outline-variant/40 hover:border-primary transition-all text-left group cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded bg-secondary text-on-secondary flex items-center justify-center font-bold text-xs shrink-0">
                    <span className="material-symbols-outlined text-[18px]">school</span>
                  </div>
                  <div>
                    <div className="font-label-md text-label-md font-bold text-primary flex items-center gap-2">
                      Dr. Rajesh Verma
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-secondary-fixed text-on-secondary-fixed font-semibold">
                        Faculty Lead
                      </span>
                    </div>
                    <div className="font-body-sm text-body-sm text-on-surface-variant">
                      Director of Training &bull; NSSTA Greater Noida
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-on-surface-variant group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </button>

              {/* Ananya Deshmukh (Admin) */}
              <button
                type="button"
                onClick={() => handleQuickDemoLogin("admin")}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-surface-container-low hover:bg-surface-container border border-outline-variant/40 hover:border-primary transition-all text-left group cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded bg-outline text-on-primary flex items-center justify-center font-bold text-xs shrink-0">
                    <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                  </div>
                  <div>
                    <div className="font-label-md text-label-md font-bold text-primary flex items-center gap-2">
                      Ananya Deshmukh
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-surface-container-high text-on-surface font-semibold">
                        Administrator
                      </span>
                    </div>
                    <div className="font-body-sm text-body-sm text-on-surface-variant">
                      Administration &amp; Capacity Building Desk &bull; MoSPI
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-on-surface-variant group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>
          </div>

          {/* Standard Credentials Form */}
          <form onSubmit={handleSubmit} className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-5 shadow-sm space-y-4">
            <div className="border-b border-outline-variant/30 pb-2">
              <span className="font-label-md text-label-md font-bold text-primary">
                NIC Parichay SSO Authentication
              </span>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Enter your registered government email and password
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-error-container text-on-error-container font-label-sm text-label-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">error</span>
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="font-label-md text-label-md text-on-surface font-semibold">
                Government Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="officer.name@nic.in"
                className="w-full h-10 px-3 rounded-lg bg-surface-container-lowest border border-outline-variant/60 text-on-surface font-body-md text-body-md outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="font-label-md text-label-md text-on-surface font-semibold">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full h-10 px-3 rounded-lg bg-surface-container-lowest border border-outline-variant/60 text-on-surface font-body-md text-body-md outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-bold transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Sign In via Parichay</span>
                </>
              )}
            </button>
          </form>

          {/* Security Compliance Seal */}
          <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/30 flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-tertiary-container" />
              <span>GIGW 3.0 &amp; CERT-In Security Compliant</span>
            </div>
            <span className="font-mono text-[10px]">NIC-NET Secure</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-surface-container-low border-t border-outline-variant/40 py-3 text-center font-label-sm text-label-sm text-on-surface-variant">
        <span>&copy; 2025 Government of India. Ministry of Statistics &amp; Programme Implementation. All Rights Reserved.</span>
      </footer>
    </div>
  );
}

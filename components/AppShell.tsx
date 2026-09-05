"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles } from "lucide-react";
import { Header } from "./Header";
import { AiCopilotDrawer } from "./AiCopilotDrawer";
import { useAuth } from "./AuthContext";

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  fullWidth?: boolean;
  hideAiFab?: boolean;
}

export function AppShell({ children, title, subtitle, fullWidth = false, hideAiFab = false }: AppShellProps) {
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <span className="font-label-md text-label-md text-on-surface-variant font-medium">
            Authenticating with National Single Sign-On...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-surface font-body-md antialiased flex flex-col">
      {/* Stitch Sovereign Masthead & Navigation */}
      <Header
        title={title}
        subtitle={subtitle}
        onOpenAiDrawer={() => setIsAiDrawerOpen(true)}
      />

      {/* Main Content Viewport matching Stitch layout */}
      <main className="w-full pt-[144px] min-h-screen bg-background">
        <div className={fullWidth ? "w-full" : "max-w-container-max mx-auto px-gutter-desktop py-space-xl"}>
          {children}
        </div>
      </main>

      {/* Bottom-Right Floating Setu AI Assistant (Anti-Cheating Aware: Hides during exams) */}
      {!hideAiFab && (
        <button
          onClick={() => setIsAiDrawerOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-primary hover:bg-primary-container text-on-primary pl-3.5 pr-4 py-2 rounded-full shadow-2xl border border-secondary/40 ring-1 ring-secondary/30 flex items-center gap-2.5 font-label-md transition-all duration-300 hover:scale-105 hover:shadow-primary/25 group cursor-pointer"
          title="Open Setu AI Competency Assistant"
        >
          <div className="w-7 h-7 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center shrink-0 shadow-xs">
            <Sparkles className="w-4 h-4 text-secondary group-hover:rotate-12 transition-transform" />
          </div>
          <div className="flex flex-col text-left leading-tight">
            <span className="text-[10px] text-tertiary-fixed font-bold tracking-wider uppercase">
              AI Sahayak
            </span>
            <span className="text-xs text-white font-bold tracking-tight">
              Setu Assistant
            </span>
          </div>
          <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim animate-pulse ml-0.5" title="NIC Engine Active"></span>
        </button>
      )}

      {/* Global AI Copilot Assistant Drawer */}
      <AiCopilotDrawer
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
      />
    </div>
  );
}

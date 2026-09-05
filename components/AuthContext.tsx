"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

export type RoleType = "Officer" | "Trainer" | "Admin";

export interface User {
  email: string;
  fullName: string;
  role: RoleType;
  department: string;
  officerId: number | null;
}

export const DEMO_USERS: Record<string, User> = {
  officer_priya: {
    email: "priya.sharma@setudemo.local",
    fullName: "Priya Sharma",
    role: "Officer",
    department: "Field Operations Division, NSSO",
    officerId: 1,
  },
  officer_arjun: {
    email: "arjun.mehta@setudemo.local",
    fullName: "Arjun Mehta",
    role: "Officer",
    department: "Price Statistics Division",
    officerId: 2,
  },
  trainer: {
    email: "trainer.test@setudemo.local",
    fullName: "Dr. Rajesh Verma",
    role: "Trainer",
    department: "Training Division, NSSTA",
    officerId: null,
  },
  admin: {
    email: "admin.test@setudemo.local",
    fullName: "Ananya Deshmukh",
    role: "Admin",
    department: "Administration & Capacity Building, MoSPI",
    officerId: null,
  },
};

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  loginAsDemo: (demoKey: keyof typeof DEMO_USERS) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Resolves a Supabase session into the app's User shape by calling the backend's
 * /auth/me, which is the single source of truth for role + officer linkage
 */
async function resolveUserFromSession(session: Session): Promise<User | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  try {
    const res = await fetch(`${apiUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      email: data.email || session.user.email || "",
      fullName: data.full_name || session.user.email || "Unknown",
      role: (data.role as RoleType) || "Officer",
      department: data.department || "",
      officerId: data.officer_id ?? null,
    };
  } catch (e) {
    console.error("[Setu] Failed to resolve user from backend /auth/me:", e);
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if demo user is stored in localStorage
    const storedDemo = typeof window !== "undefined" ? localStorage.getItem("setu_demo_user") : null;
    if (storedDemo) {
      try {
        const parsed = JSON.parse(storedDemo) as User;
        setUser(parsed);
        setSession({
          access_token: "mock-demo-access-token",
          refresh_token: "mock-demo-refresh-token",
          expires_in: 3600,
          token_type: "bearer",
          user: {
            id: "00000000-0000-0000-0000-000000000001",
            app_metadata: {},
            user_metadata: { role: parsed.role },
            aud: "authenticated",
            created_at: new Date().toISOString(),
            email: parsed.email,
          } as any,
        });
        setIsLoading(false);
        return;
      } catch (err) {
        localStorage.removeItem("setu_demo_user");
      }
    }

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session) setUser(await resolveUserFromSession(session));
      setIsLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session) {
        setUser(await resolveUserFromSession(session));
      } else if (!localStorage.getItem("setu_demo_user")) {
        setUser(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error ? error.message : null };
  };

  const loginAsDemo = (demoKey: keyof typeof DEMO_USERS) => {
    const demoUser = DEMO_USERS[demoKey];
    if (!demoUser) return;
    if (typeof window !== "undefined") {
      localStorage.setItem("setu_demo_user", JSON.stringify(demoUser));
    }
    setUser(demoUser);
    setSession({
      access_token: "mock-demo-access-token",
      refresh_token: "mock-demo-refresh-token",
      expires_in: 3600,
      token_type: "bearer",
      user: {
        id: "00000000-0000-0000-0000-000000000001",
        app_metadata: {},
        user_metadata: { role: demoUser.role },
        aud: "authenticated",
        created_at: new Date().toISOString(),
        email: demoUser.email,
      } as any,
    });
  };

  const logout = async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("setu_demo_user");
    }
    try {
      await supabase.auth.signOut();
    } catch (_) {}
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, login, loginAsDemo, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

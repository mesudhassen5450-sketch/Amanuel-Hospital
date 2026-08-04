import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type StaffRole = "staff" | "reception" | "doctor" | "laboratory" | "pharmacy" | null;

interface StaffUser {
  username: string;
  role: StaffRole;
  displayName?: string;
}

interface StaffAuthCtx {
  user: StaffUser | null;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  hydrated: boolean;
}

const SESSION_KEY = "staff_session";

const StaffAuthContext = createContext<StaffAuthCtx | null>(null);

export function StaffAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]         = useState<StaffUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY);
      if (stored) setUser(JSON.parse(stored));
    } catch {}
    setHydrated(true);
  }, []);

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Server-side validation — password never checked in browser code
      const { validateStaffLogin } = await import("./staff-server");
      const result = await validateStaffLogin({ data: { username, password } });

      if (result.success && result.username && result.role) {
        const u: StaffUser = {
          username:    result.username,
          role:        result.role as StaffRole,
          displayName: result.display_name ?? result.username,
        };
        setUser(u);
        try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(u)); } catch {}
        return { success: true };
      }

      return { success: false, error: result.error ?? "Invalid username or password." };
    } catch (err: any) {
      console.error("Authentication error:", err?.message);
      return {
        success: false,
        error: "Authentication service is unavailable. Please try again.",
      };
    }
  };

  const logout = () => {
    setUser(null);
    try { sessionStorage.removeItem(SESSION_KEY); } catch {}
  };

  return (
    <StaffAuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, hydrated }}>
      {children}
    </StaffAuthContext.Provider>
  );
}

export function useStaffAuth() {
  const ctx = useContext(StaffAuthContext);
  if (!ctx) throw new Error("useStaffAuth must be used within StaffAuthProvider");
  return ctx;
}

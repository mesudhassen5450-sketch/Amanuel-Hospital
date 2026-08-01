import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type StaffRole = "staff" | "reception" | "doctor" | "laboratory" | null;

interface StaffUser {
  username: string;
  role: StaffRole;
}

interface StaffAuthCtx {
  user: StaffUser | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  hydrated: boolean; // true once sessionStorage has been read on the client
}

const STAFF_CREDENTIALS: Record<string, { password: string; role: StaffRole }> = {
  staff:      { password: "4321", role: "staff" },
  reception:  { password: "4321", role: "reception" },
  doctor:     { password: "4321", role: "doctor" },
  laboratory: { password: "4321", role: "laboratory" },
};

const SESSION_KEY = "staff_session";

const StaffAuthContext = createContext<StaffAuthCtx | null>(null);

export function StaffAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<StaffUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Read session ONCE after client mount — never runs on server
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY);
      if (stored) setUser(JSON.parse(stored));
    } catch {}
    setHydrated(true); // mark as ready regardless of whether session existed
  }, []);

  const login = (username: string, password: string): boolean => {
    const cred = STAFF_CREDENTIALS[username.toLowerCase()];
    if (!cred || cred.password !== password) return false;
    const u: StaffUser = { username: username.toLowerCase(), role: cred.role };
    setUser(u);
    try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(u)); } catch {}
    return true;
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

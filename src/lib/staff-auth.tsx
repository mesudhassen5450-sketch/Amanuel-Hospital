import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type StaffRole = "staff" | "reception" | null;

interface StaffUser {
  username: string;
  role: StaffRole;
}

interface StaffAuthCtx {
  user: StaffUser | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

// Credentials
const STAFF_CREDENTIALS: Record<string, { password: string; role: StaffRole }> = {
  staff:     { password: "4321", role: "staff" },
  reception: { password: "4321", role: "reception" },
};

const SESSION_KEY = "staff_session";

const StaffAuthContext = createContext<StaffAuthCtx | null>(null);

export function StaffAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StaffUser | null>(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY);
      if (stored) setUser(JSON.parse(stored));
    } catch {}
  }, []);

  const login = (username: string, password: string): boolean => {
    const cred = STAFF_CREDENTIALS[username];
    if (!cred || cred.password !== password) return false;
    const u: StaffUser = { username, role: cred.role };
    setUser(u);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(u));
    return true;
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem(SESSION_KEY);
  };

  return (
    <StaffAuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </StaffAuthContext.Provider>
  );
}

export function useStaffAuth() {
  const ctx = useContext(StaffAuthContext);
  if (!ctx) throw new Error("useStaffAuth must be used within StaffAuthProvider");
  return ctx;
}

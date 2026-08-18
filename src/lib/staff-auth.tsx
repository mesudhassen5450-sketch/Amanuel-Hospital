import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export type StaffRole = "admin" | "staff" | "reception" | "cashier" | "doctor" | "laboratory" | "pharmacy" | null;

// ── Session constants ─────────────────────────────────────────────────────────
const SESSION_KEY    = "staff_session";
const SESSION_MAX_MS = 8 * 60 * 60 * 1000;   // 8 hours hard expiry
const IDLE_MAX_MS    = 30 * 60 * 1000;        // 30 minutes inactivity

interface SessionData {
  username:    string;
  role:        StaffRole;
  displayName: string;
  loginAt:     number;   // timestamp
  expiresAt:   number;   // loginAt + SESSION_MAX_MS
  lastActive:  number;   // updated on every activity
}

interface StaffUser {
  username:    string;
  role:        StaffRole;
  displayName?: string;
}

interface StaffAuthCtx {
  user: StaffUser | null;
  login:  (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  hydrated: boolean;
}

const StaffAuthContext = createContext<StaffAuthCtx | null>(null);

// ── Helpers ───────────────────────────────────────────────────────────────────
function readSession(): SessionData | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const s: SessionData = JSON.parse(raw);
    const now = Date.now();
    // Hard expiry check
    if (now > s.expiresAt) { sessionStorage.removeItem(SESSION_KEY); return null; }
    // Idle expiry check
    if (now - s.lastActive > IDLE_MAX_MS) { sessionStorage.removeItem(SESSION_KEY); return null; }
    return s;
  } catch { return null; }
}

export function getStaffRole(): StaffRole {
  if (typeof window === "undefined") return null;
  const s = readSession();
  return s?.role ?? null;
}

function writeSession(s: SessionData): void {
  try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(s)); } catch {}
}

function clearSession(): void {
  try {
    sessionStorage.removeItem(SESSION_KEY);
    // Also clear any related keys
    sessionStorage.clear();
  } catch {}
}

function touchSession(): void {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return;
    const s: SessionData = JSON.parse(raw);
    s.lastActive = Date.now();
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(s));
  } catch {}
}

// ── Provider ──────────────────────────────────────────────────────────────────
export function StaffAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]         = useState<StaffUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Expire session and redirect
  const expireSession = useCallback(() => {
    clearSession();
    setUser(null);
    window.location.replace("/staff/login");
  }, []);

  // Hydrate from sessionStorage on mount
  useEffect(() => {
    const s = readSession();
    if (s) {
      setUser({ username: s.username, role: s.role, displayName: s.displayName });
    }
    setHydrated(true);
  }, []);

  // ── Inactivity timer ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;

    let idleTimer: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      clearTimeout(idleTimer);
      touchSession();
      idleTimer = setTimeout(() => {
        expireSession();
      }, IDLE_MAX_MS);
    };

    // Activity events that reset the idle timer
    const EVENTS = ["mousemove", "mousedown", "keydown", "touchstart", "scroll", "click"];
    EVENTS.forEach(e => window.addEventListener(e, resetTimer, { passive: true }));
    resetTimer(); // start timer immediately

    // Hard expiry check every minute
    const hardCheck = setInterval(() => {
      const s = readSession();
      if (!s) expireSession();
    }, 60_000);

    return () => {
      clearTimeout(idleTimer);
      clearInterval(hardCheck);
      EVENTS.forEach(e => window.removeEventListener(e, resetTimer));
    };
  }, [user, expireSession]);

  // ── Heartbeat & Tab Close Handler for Doctors ─────────────────────────────
  useEffect(() => {
    if (!user || user.role !== "doctor") return;

    // Heartbeat every 30 seconds to keep doctor online
    const heartbeatInterval = setInterval(async () => {
      try {
        const { updateDoctorOnlineStatus } = await import("./staff-server");
        await updateDoctorOnlineStatus({
          data: { username: user.username, isOnline: true, callerRole: user.role || undefined },
        });
      } catch (err) {
        console.error("Heartbeat failed:", err);
      }
    }, 30000);

    // Set offline on tab close
    const handleUnload = async () => {
      try {
        const { updateDoctorOnlineStatus } = await import("./staff-server");
        await updateDoctorOnlineStatus({
          data: { username: user.username, isOnline: false, callerRole: user.role || undefined },
        });
      } catch (err) {
        console.error("Failed to set offline on tab close:", err);
      }
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      clearInterval(heartbeatInterval);
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [user]);

  // ── Login ─────────────────────────────────────────────────────────────────
  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { validateStaffLogin, updateDoctorOnlineStatus } = await import("./staff-server");
      const result = await validateStaffLogin({ data: { username, password } });

      if (result.success && result.username && result.role) {
        const now = Date.now();
        const normalizedRole = (result.role as string).toLowerCase() as StaffRole;
        const session: SessionData = {
          username:    result.username,
          role:        normalizedRole,
          displayName: result.display_name ?? result.username,
          loginAt:     now,
          expiresAt:   now + SESSION_MAX_MS,
          lastActive:  now,
        };
        writeSession(session);
        setUser({ username: session.username, role: session.role, displayName: session.displayName });

        // Set doctor online status if logging in as doctor
        if (normalizedRole === "doctor") {
          try {
            await updateDoctorOnlineStatus({
              data: { username: result.username, isOnline: true, callerRole: normalizedRole || undefined },
            });
          } catch (err) {
            console.error("Failed to update doctor online status on login:", err);
          }
        }

        return { success: true };
      }

      return { success: false, error: result.error ?? "Invalid username or password." };
    } catch (err: any) {
      console.error("Authentication error:", err?.message);
      return { success: false, error: "Authentication service is unavailable. Please try again." };
    }
  };

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = async () => {
    // Set doctor offline status if logging out as doctor
    if (user?.role === "doctor") {
      try {
        const { updateDoctorOnlineStatus } = await import("./staff-server");
        await updateDoctorOnlineStatus({
          data: { username: user.username, isOnline: false, callerRole: user.role || undefined },
        });
      } catch (err) {
        console.error("Failed to update doctor online status on logout:", err);
      }
    }

    clearSession();
    setUser(null);
    // Replace history so back-button cannot return to protected page
    window.history.replaceState(null, "", "/staff/login");
    window.location.replace("/staff/login");
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

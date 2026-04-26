"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import type { AuthState, User, Workspace } from "@/types";
import { googleLogin, getWorkspacesByUser } from "@/lib/api";

// ─── Storage keys ────────────────────────────────────
const STORAGE_KEY_USER = "basktre_user";
const STORAGE_KEY_TOKEN = "basktre_token";
const STORAGE_KEY_ACTIVE_WS = "basktre_active_workspace";

// ─── Context types ───────────────────────────────────
interface AuthContextValue extends AuthState {
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  isLoading: boolean;
  login: (googleIdToken: string, email: string, name: string, googleId: string) => Promise<void>;
  logout: () => void;
  addWorkspace: (ws: Workspace) => void;
  setActiveWorkspace: (ws: Workspace) => void;
  refreshWorkspaces: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWorkspace, setActiveWorkspaceState] = useState<Workspace | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /** Fetches workspaces from the backend API and updates local state. */
  const fetchWorkspaces = useCallback(async (authToken: string, userId: number) => {
    try {
      const res = await getWorkspacesByUser(authToken, userId);
      const fetched = res.data?.workspaces ?? [];
      setWorkspaces(fetched);

      // Restore the previously active workspace if still valid, otherwise pick first
      const storedActiveWs = localStorage.getItem(STORAGE_KEY_ACTIVE_WS);
      let restoredWs: Workspace | null = null;
      if (storedActiveWs) {
        try {
          restoredWs = JSON.parse(storedActiveWs);
        } catch { /* ignore */ }
      }

      if (restoredWs && fetched.some((ws) => ws.id === restoredWs!.id)) {
        // Find the latest version from the API (name/status might have changed)
        const fresh = fetched.find((ws) => ws.id === restoredWs!.id) ?? restoredWs;
        setActiveWorkspaceState(fresh);
        localStorage.setItem(STORAGE_KEY_ACTIVE_WS, JSON.stringify(fresh));
      } else if (fetched.length > 0) {
        setActiveWorkspaceState(fetched[0]);
        localStorage.setItem(STORAGE_KEY_ACTIVE_WS, JSON.stringify(fetched[0]));
      } else {
        setActiveWorkspaceState(null);
        localStorage.removeItem(STORAGE_KEY_ACTIVE_WS);
      }
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[basktre:auth] Failed to fetch workspaces:", err);
      }
    }
  }, []);

  // Hydrate from localStorage on mount, then fetch fresh workspaces from API
  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      try {
        const storedUser = localStorage.getItem(STORAGE_KEY_USER);
        const storedToken = localStorage.getItem(STORAGE_KEY_TOKEN);

        if (storedUser && storedToken) {
          const parsedUser: User = JSON.parse(storedUser);
          setUser(parsedUser);
          setToken(storedToken);

          // Restore active workspace immediately for instant UI (will refresh from API)
          const storedActiveWs = localStorage.getItem(STORAGE_KEY_ACTIVE_WS);
          if (storedActiveWs) {
            try {
              setActiveWorkspaceState(JSON.parse(storedActiveWs));
            } catch { /* ignore */ }
          }

          // Fetch workspaces from the API for fresh data
          if (!cancelled) {
            await fetchWorkspaces(storedToken, parsedUser.id);
          }
        }
      } catch {
        // Corrupted storage — clear it
        localStorage.removeItem(STORAGE_KEY_USER);
        localStorage.removeItem(STORAGE_KEY_TOKEN);
        localStorage.removeItem(STORAGE_KEY_ACTIVE_WS);
      }

      if (!cancelled) {
        setIsLoading(false);
      }
    }

    hydrate();
    return () => { cancelled = true; };
  }, [fetchWorkspaces]);

  const login = useCallback(
    async (googleIdToken: string, email: string, name: string, googleId: string) => {
      // Call our backend to register/login the user
      const response = await googleLogin(email, name, googleId);

      const userData = response.data.user;
      setUser(userData);
      setToken(googleIdToken);

      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userData));
      localStorage.setItem(STORAGE_KEY_TOKEN, googleIdToken);

      // Fetch workspaces from the API after login
      await fetchWorkspaces(googleIdToken, userData.id);
    },
    [fetchWorkspaces]
  );

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setWorkspaces([]);
    setActiveWorkspaceState(null);

    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_TOKEN);
    localStorage.removeItem(STORAGE_KEY_ACTIVE_WS);
  }, []);

  const addWorkspace = useCallback((ws: Workspace) => {
    setWorkspaces((prev) => {
      const next = [...prev, ws];
      return next;
    });
    // Auto-select if first workspace
    setActiveWorkspaceState((current) => {
      if (!current) {
        localStorage.setItem(STORAGE_KEY_ACTIVE_WS, JSON.stringify(ws));
        return ws;
      }
      return current;
    });
  }, []);

  const setActiveWorkspace = useCallback((ws: Workspace) => {
    setActiveWorkspaceState(ws);
    localStorage.setItem(STORAGE_KEY_ACTIVE_WS, JSON.stringify(ws));
  }, []);

  const refreshWorkspaces = useCallback(async () => {
    if (token && user) {
      await fetchWorkspaces(token, user.id);
    }
  }, [token, user, fetchWorkspaces]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: !!user && !!token,
      workspaces,
      activeWorkspace,
      isLoading,
      login,
      logout,
      addWorkspace,
      setActiveWorkspace,
      refreshWorkspaces
    }),
    [user, token, workspaces, activeWorkspace, isLoading, login, logout, addWorkspace, setActiveWorkspace, refreshWorkspaces]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook ────────────────────────────────────────────
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within <AuthProvider>");
  }
  return ctx;
}

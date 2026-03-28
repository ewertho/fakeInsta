import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { api, getStoredToken, setStoredToken } from "../lib/api";
import type { UserPublic } from "../types";

type AuthContextValue = {
  user: UserPublic | null;
  token: string | null;
  isReady: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  refreshMe: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserPublic | null>(null);
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [isReady, setIsReady] = useState(false);

  const refreshMe = useCallback(async () => {
    const t = getStoredToken();
    if (!t) {
      setUser(null);
      setToken(null);
      return;
    }

    try {
      const response = await api.get<{ user: UserPublic }>("/auth/me");
      setUser(response.data.user);
      setToken(t);
    } catch {
      setStoredToken(null);
      setUser(null);
      setToken(null);
    }
  }, []);

  useEffect(() => {
    void refreshMe().finally(() => setIsReady(true));
  }, [refreshMe]);

  const signIn = useCallback(async (email: string, password: string) => {
    const response = await api.post<{ token: string; user: UserPublic }>("/auth/signin", {
      email,
      password,
    });

    setStoredToken(response.data.token);
    setToken(response.data.token);
    setUser(response.data.user);
  }, []);

  const signOut = useCallback(() => {
    setStoredToken(null);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isReady,
      signIn,
      signOut,
      refreshMe,
    }),
    [user, token, isReady, signIn, signOut, refreshMe],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}

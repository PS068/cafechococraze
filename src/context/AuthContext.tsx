import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { DEMO_ADMIN } from '../data/demoData';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  userEmail: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    if (isSupabaseConfigured && supabase) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsAuthenticated(true);
        setUserEmail(session.user.email ?? null);
      }
      // Listen for auth changes
      supabase.auth.onAuthStateChange((_event, session) => {
        setIsAuthenticated(!!session);
        setUserEmail(session?.user?.email ?? null);
      });
    } else {
      // Demo mode: check localStorage
      const demoAuth = localStorage.getItem('demo_auth');
      if (demoAuth === 'true') {
        setIsAuthenticated(true);
        setUserEmail(DEMO_ADMIN.email);
      }
    }
    setIsLoading(false);
  }

  async function login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { success: false, error: error.message };
      return { success: true };
    }
    // Demo mode login
    if (email === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
      setIsAuthenticated(true);
      setUserEmail(email);
      localStorage.setItem('demo_auth', 'true');
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password' };
  }

  async function logout() {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setIsAuthenticated(false);
    setUserEmail(null);
    localStorage.removeItem('demo_auth');
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

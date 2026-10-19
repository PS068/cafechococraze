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
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setIsAuthenticated(true);
          setUserEmail(session.user.email ?? null);
        } else {
          const demoAuth = localStorage.getItem('demo_auth');
          if (demoAuth === 'true') {
            setIsAuthenticated(true);
            setUserEmail(localStorage.getItem('demo_user_email') || DEMO_ADMIN.email);
          }
        }
        // Listen for auth changes
        supabase.auth.onAuthStateChange((_event, session) => {
          if (session) {
            setIsAuthenticated(true);
            setUserEmail(session.user.email ?? null);
          } else {
            const demoAuth = localStorage.getItem('demo_auth');
            setIsAuthenticated(demoAuth === 'true');
            setUserEmail(demoAuth === 'true' ? (localStorage.getItem('demo_user_email') || DEMO_ADMIN.email) : null);
          }
        });
      } catch (err) {
        console.warn('Auth check error, falling back to demo session check:', err);
        const demoAuth = localStorage.getItem('demo_auth');
        if (demoAuth === 'true') {
          setIsAuthenticated(true);
          setUserEmail(localStorage.getItem('demo_user_email') || DEMO_ADMIN.email);
        }
      }
    } else {
      // Demo mode: check localStorage
      const demoAuth = localStorage.getItem('demo_auth');
      if (demoAuth === 'true') {
        setIsAuthenticated(true);
        setUserEmail(localStorage.getItem('demo_user_email') || DEMO_ADMIN.email);
      }
    }
    setIsLoading(false);
  }

  async function login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    const isDemoMatch =
      (email === DEMO_ADMIN.email && password === DEMO_ADMIN.password) ||
      (email === 'admin@cafechococraze.com' && password === 'CafeChocoCraze2024!') ||
      (email === 'admin@psresto.com' && password === 'PSResto2024!') ||
      (email === 'admin@thespicehouse.com' && password === 'SpiceHouse2024!');

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          // If Supabase authentication fails (e.g. unconfirmed email or demo credentials),
          // allow immediate login for authorized manager credentials
          if (isDemoMatch) {
            setIsAuthenticated(true);
            setUserEmail(email);
            localStorage.setItem('demo_auth', 'true');
            localStorage.setItem('demo_user_email', email);
            return { success: true };
          }
          return { success: false, error: error.message };
        }
        // onAuthStateChange will set isAuthenticated + userEmail
        return { success: true };
      } catch (err: unknown) {
        if (isDemoMatch) {
          setIsAuthenticated(true);
          setUserEmail(email);
          localStorage.setItem('demo_auth', 'true');
          localStorage.setItem('demo_user_email', email);
          return { success: true };
        }
        return { success: false, error: err instanceof Error ? err.message : 'Login failed' };
      }
    }

    // Demo mode login — only when Supabase is NOT configured
    if (isDemoMatch) {
      setIsAuthenticated(true);
      setUserEmail(email);
      localStorage.setItem('demo_auth', 'true');
      localStorage.setItem('demo_user_email', email);
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password' };
  }

  async function logout() {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Sign out error:', err);
      }
    }
    setIsAuthenticated(false);
    setUserEmail(null);
    localStorage.removeItem('demo_auth');
    localStorage.removeItem('demo_user_email');
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

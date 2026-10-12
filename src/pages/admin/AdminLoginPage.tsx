import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UtensilsCrossed, Lock, Mail, Eye, EyeOff, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { DEMO_ADMIN } from '../../data/demoData';
import { isSupabaseConfigured } from '../../lib/supabase';
import ThemeToggle from '../../components/common/ThemeToggle';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const { restaurant, addToast } = useData();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Please provide both email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await login(email, password);
      if (res.success) {
        addToast('Welcome back! Signed in successfully.', 'success');
        navigate('/admin', { replace: true });
      } else {
        setError(res.error || 'Invalid credentials. Please verify your email and password.');
      }
    } catch {
      setError('An unexpected error occurred during login.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setEmail(DEMO_ADMIN.email);
    setPassword(DEMO_ADMIN.password);
    setError(null);
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center px-4 py-12 relative"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      {/* Top Bar with Home & Theme Toggle */}
      <div className="absolute top-4 left-4 right-4 max-w-5xl mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="flex items-center gap-2 text-xs sm:text-sm font-medium transition-colors"
          style={{ color: 'var(--text-secondary)' }}
        >
          <ArrowLeft size={16} />
          Back to Public Menu
        </Link>
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div
            className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-4"
            style={{ backgroundColor: 'var(--accent)', color: 'var(--text-inverse)' }}
          >
            <UtensilsCrossed size={28} />
          </div>
          <h1
            className="text-2xl sm:text-3xl font-bold"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
          >
            Restaurant Admin Portal
          </h1>
          <p className="text-sm mt-1.5" style={{ color: 'var(--text-muted)' }}>
            Sign in to manage {restaurant.name}’s menu, prices & categories
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-3xl border p-6 sm:p-8 shadow-xl"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-default)',
          }}
        >
          {error && (
            <div
              className="mb-5 p-3.5 rounded-xl border text-xs sm:text-sm text-red-600 bg-red-500/10 border-red-500/20"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label
                className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                style={{ color: 'var(--text-secondary)' }}
              >
                Owner Email Address
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: 'var(--text-muted)' }}
                />
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@thespicehouse.com"
                  required
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border transition-colors"
                  style={{
                    backgroundColor: 'var(--bg-input)',
                    borderColor: 'var(--border-default)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                style={{ color: 'var(--text-secondary)' }}
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: 'var(--text-muted)' }}
                />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-10 pr-11 py-3 text-sm rounded-xl border transition-colors"
                  style={{
                    backgroundColor: 'var(--bg-input)',
                    borderColor: 'var(--border-default)',
                    color: 'var(--text-primary)',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg"
                  style={{ color: 'var(--text-muted)' }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="admin-login-submit"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 shadow-md mt-2"
              style={{
                backgroundColor: 'var(--accent)',
                color: 'var(--text-inverse)',
              }}
            >
              {isSubmitting ? (
                <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <>
                  <ShieldCheck size={18} />
                  <span>Access Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Fill Box */}
          {!isSupabaseConfigured && (
            <div
              className="mt-6 pt-5 border-t text-center"
              style={{ borderColor: 'var(--border-default)' }}
            >
              <div className="flex items-center justify-center gap-1.5 text-xs font-medium mb-2 text-amber-600 dark:text-amber-400">
                <Sparkles size={14} />
                <span>Demo Mode Active</span>
              </div>
              <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
                Click below to auto-fill the sample credentials for testing.
              </p>
              <button
                type="button"
                onClick={handleFillDemo}
                className="w-full py-2 px-3 rounded-lg border text-xs font-semibold transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                style={{
                  borderColor: 'var(--accent)',
                  color: 'var(--accent)',
                }}
              >
                Auto-fill Demo Credentials
              </button>
            </div>
          )}
        </div>

        {/* Note */}
        <p className="text-center text-xs mt-6" style={{ color: 'var(--text-muted)' }}>
          This portal is strictly for authorized restaurant staff and owners.
        </p>
      </div>
    </div>
  );
}

import { Outlet, Link } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import ThemeToggle from '../../components/common/ThemeToggle';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { ExternalLink, UtensilsCrossed } from 'lucide-react';

export default function AdminLayout() {
  const { userEmail } = useAuth();
  const { restaurant } = useData();

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Header */}
        <header
          className="sticky top-0 z-30 h-16 border-b px-4 sm:px-8 flex items-center justify-between nav-glass no-print"
          style={{
            backgroundColor: 'var(--bg-nav)',
            borderColor: 'var(--border-default)',
          }}
        >
          {/* Left: Mobile spacing & Breadcrumb */}
          <div className="flex items-center gap-3 pl-12 lg:pl-0">
            <span
              className="text-sm font-semibold tracking-wide hidden sm:inline"
              style={{ color: 'var(--text-secondary)' }}
            >
              Management Console
            </span>
          </div>

          {/* Right actions: ThemeToggle, Public Menu Link, User Badge */}
          <div className="flex items-center gap-3">
            <Link
              to={`/menu/${restaurant.slug || 'the-spice-house'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors hover:bg-black/5 dark:hover:bg-white/5"
              style={{
                borderColor: 'var(--border-default)',
                color: 'var(--text-secondary)',
              }}
              title="Open Public Menu in new tab"
            >
              <ExternalLink size={13} />
              View Menu
            </Link>

            <ThemeToggle />

            {/* User Avatar / Email */}
            <div
              className="flex items-center gap-2 pl-2 border-l"
              style={{ borderColor: 'var(--border-default)' }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs"
                style={{ backgroundColor: 'var(--accent)', color: 'var(--text-inverse)' }}
              >
                {userEmail ? userEmail.charAt(0).toUpperCase() : 'A'}
              </div>
              <span
                className="text-xs font-medium truncate max-w-[120px] hidden md:inline"
                style={{ color: 'var(--text-secondary)' }}
              >
                {userEmail || 'Admin'}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

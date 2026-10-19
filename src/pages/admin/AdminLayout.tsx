import { Outlet, Link } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import ThemeToggle from '../../components/common/ThemeToggle';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { ExternalLink, AlertTriangle } from 'lucide-react';

export default function AdminLayout() {
  const { userEmail } = useAuth();
  const { restaurant, updateRestaurant, addToast } = useData();
  const isStoreOpen = (restaurant.theme_preferences as any)?.isOpen !== false;

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
              to={`/menu/${restaurant.slug || 'cafe-choco-craze'}`}
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

        {/* Red Alert Banner: Store is Temporarily Closed / Kitchen Paused */}
        {!isStoreOpen && (
          <div className="bg-red-600 text-white px-4 py-3 sm:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md border-b border-red-700 animate-fade-in no-print">
            <div className="flex items-center gap-3 min-w-0">
              <span className="relative flex h-3 w-3 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
              </span>
              <AlertTriangle size={20} className="shrink-0 text-amber-200" />
              <div className="min-w-0 text-xs sm:text-sm">
                <p className="font-extrabold uppercase tracking-wide">
                  Store Status: Temporarily Closed / Kitchen Paused
                </p>
                <p className="text-white/90 text-xs mt-0.5">
                  Customers on the public digital menu are currently seeing the red closure alert.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto">
              <button
                type="button"
                onClick={async () => {
                  try {
                    await updateRestaurant({
                      theme_preferences: {
                        ...(restaurant.theme_preferences || {}),
                        isOpen: true,
                      },
                    });
                    addToast('Store reopened! Live menu is now accepting orders.', 'success');
                  } catch (e) {
                    console.error(e);
                  }
                }}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white text-red-600 hover:bg-white/90 active:scale-95 transition-all shadow-sm cursor-pointer"
              >
                Reopen Store Now
              </button>
              <Link
                to="/admin/settings"
                className="text-xs text-white/90 hover:text-white underline ml-1"
              >
                Settings
              </Link>
            </div>
          </div>
        )}

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 2xl:p-10 w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

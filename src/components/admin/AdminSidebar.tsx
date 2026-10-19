import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  UtensilsCrossed,
  FolderOpen,
  Store,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
  QrCode,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: UtensilsCrossed, label: 'Menu Items', path: '/admin/menu-items' },
  { icon: FolderOpen, label: 'Categories', path: '/admin/categories' },
  { icon: Store, label: 'Restaurant Profile', path: '/admin/profile' },
  { icon: QrCode, label: 'QR Code', path: '/admin/qr-code' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
];

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();
  const { restaurant } = useData();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const linkClasses = (isActive: boolean) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive ? '' : ''
    }`;

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl shadow-lg border"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-default)',
          color: 'var(--text-primary)',
        }}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-40 w-64 border-r flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-default)',
        }}
      >
        {/* Logo */}
        <div
          className="px-5 py-5 border-b flex items-center gap-3"
          style={{ borderColor: 'var(--border-default)' }}
        >
          {restaurant.logo_url ? (
            <img
              src={restaurant.logo_url}
              alt={restaurant.name}
              className="w-9 h-9 rounded-lg object-cover ring-1 ring-black/10 bg-white shrink-0"
            />
          ) : (
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: 'var(--accent)', color: 'var(--text-inverse)' }}
            >
              <UtensilsCrossed size={18} />
            </div>
          )}
          <div className="min-w-0">
            <p
              className="text-sm font-semibold truncate"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
            >
              {restaurant.name}
            </p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Admin Panel</p>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ icon: Icon, label, path }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/admin'}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => linkClasses(isActive)}
              style={({ isActive }) => ({
                backgroundColor: isActive ? 'var(--accent-light)' : 'transparent',
                color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
              })}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="px-3 py-4 border-t space-y-1" style={{ borderColor: 'var(--border-default)' }}>
          <a
            href={`/menu/${restaurant.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
            style={{ color: 'var(--text-secondary)' }}
          >
            <ExternalLink size={18} />
            View Public Menu
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors text-red-500 hover:bg-red-50"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

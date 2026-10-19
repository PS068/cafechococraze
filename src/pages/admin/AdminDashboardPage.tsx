import { Link } from 'react-router-dom';
import {
  PlusCircle,
  FolderPlus,
  Store,
  QrCode,
  ExternalLink,
  Sparkles,
  Flame,
  ArrowRight,
  TrendingUp,
  Clock,
  MapPin,
} from 'lucide-react';
import DashboardStats from '../../components/admin/DashboardStats';
import { useData } from '../../context/DataContext';
import { formatINR } from '../../lib/formatters';

export default function AdminDashboardPage() {
  const { restaurant, categories, menuItems, updateMenuItem } = useData();

  const featuredItems = menuItems.filter((i) => i.is_featured);
  const recentItems = [...menuItems].slice(-6).reverse();

  const toggleAvailability = async (id: string, current: boolean) => {
    await updateMenuItem(id, { is_available: !current });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome & Overview Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl sm:text-3xl font-bold tracking-tight"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
          >
            Dashboard
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Welcome back to {restaurant.name}. Here is an overview of your live digital menu.
          </p>
        </div>

        {/* Quick actions top bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/admin/menu-items"
            className="px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm transition-transform active:scale-95"
            style={{ backgroundColor: 'var(--accent)', color: 'var(--text-inverse)' }}
          >
            <PlusCircle size={16} />
            <span>Manage Items</span>
          </Link>
          <Link
            to="/admin/qr-code"
            className="px-4 py-2.5 rounded-xl text-sm font-semibold border flex items-center gap-2 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
            style={{ borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
          >
            <QrCode size={16} />
            <span>Table QR Code</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <DashboardStats />

      {/* Quick Action Cards Grid */}
      <div>
        <h2
          className="text-lg font-bold mb-4"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
        >
          Quick Shortcuts
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/admin/menu-items"
            className="p-5 rounded-2xl border transition-all duration-200 hover:-translate-y-1 group"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-default)',
            }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
              style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}>
              <PlusCircle size={20} />
            </div>
            <h3 className="font-semibold text-base mb-1 group-hover:text-amber-500 transition-colors" style={{ color: 'var(--text-primary)' }}>
              Menu Items
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Add, update prices, descriptions, or mark dishes out of stock.
            </p>
          </Link>

          <Link
            to="/admin/categories"
            className="p-5 rounded-2xl border transition-all duration-200 hover:-translate-y-1 group"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-default)',
            }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-purple-600 bg-purple-500/10">
              <FolderPlus size={20} />
            </div>
            <h3 className="font-semibold text-base mb-1 group-hover:text-purple-500 transition-colors" style={{ color: 'var(--text-primary)' }}>
              Categories ({categories.length})
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Organize Starters, Mains, Breads, Desserts & reorder sequence.
            </p>
          </Link>

          <Link
            to="/admin/profile"
            className="p-5 rounded-2xl border transition-all duration-200 hover:-translate-y-1 group"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-default)',
            }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-blue-600 bg-blue-500/10">
              <Store size={20} />
            </div>
            <h3 className="font-semibold text-base mb-1 group-hover:text-blue-500 transition-colors" style={{ color: 'var(--text-primary)' }}>
              Restaurant Profile
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Change address, operating hours, phone, tagline & banner photo.
            </p>
          </Link>

          <Link
            to="/admin/qr-code"
            className="p-5 rounded-2xl border transition-all duration-200 hover:-translate-y-1 group"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-default)',
            }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-emerald-600 bg-emerald-500/10">
              <QrCode size={20} />
            </div>
            <h3 className="font-semibold text-base mb-1 group-hover:text-emerald-500 transition-colors" style={{ color: 'var(--text-primary)' }}>
              QR Code & Standee
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Download printable standee cards & copy public menu link.
            </p>
          </Link>
        </div>
      </div>

      {/* Two-column layout: Recent Items & Restaurant Status Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Menu Items */}
        <div
          className="lg:col-span-2 rounded-2xl border p-6"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-default)',
          }}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2
                className="text-lg font-bold"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
              >
                Menu Overview
              </h2>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Showing latest items in your catalog
              </p>
            </div>
            <Link
              to="/admin/menu-items"
              className="text-xs font-semibold flex items-center gap-1 hover:underline"
              style={{ color: 'var(--accent)' }}
            >
              View all {menuItems.length} items <ArrowRight size={14} />
            </Link>
          </div>

          <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
            {recentItems.map((item) => (
              <div
                key={item.id}
                className="py-3.5 flex items-center justify-between gap-4 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.image_url || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=100&h=100&fit=crop&q=80'}
                    alt={item.name}
                    className="w-11 h-11 rounded-xl object-cover shrink-0 border"
                    style={{ borderColor: 'var(--border-default)' }}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      {item.food_type !== 'none' && <span className={`food-type-badge ${item.food_type === 'veg' ? 'veg' : 'nonveg'}`} />}
                      <p className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                        {item.name}
                      </p>
                      {item.is_featured && (
                        <span className="hidden sm:inline-flex items-center gap-0.5 text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 font-semibold">
                          <Sparkles size={10} /> Featured
                        </span>
                      )}
                    </div>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {formatINR(item.price)} • {categories.find((c) => c.id === item.category_id)?.name || 'General'}
                    </p>
                  </div>
                </div>

                {/* Quick toggle availability */}
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => toggleAvailability(item.id, item.is_available)}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors"
                    style={{
                      backgroundColor: item.is_available ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                      color: item.is_available ? '#22c55e' : '#ef4444',
                      borderColor: item.is_available ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)',
                    }}
                    title="Click to toggle availability"
                  >
                    {item.is_available ? 'In Stock' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Restaurant Profile Summary */}
        <div
          className="rounded-2xl border p-6 flex flex-col justify-between"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-default)',
          }}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase font-bold tracking-wider" style={{ color: 'var(--text-muted)' }}>
                Restaurant Info
              </span>
              <Link
                to="/admin/profile"
                className="text-xs font-semibold hover:underline"
                style={{ color: 'var(--accent)' }}
              >
                Edit Profile
              </Link>
            </div>

            <h3
              className="text-xl font-bold mb-1"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
            >
              {restaurant.name}
            </h3>
            <p className="text-xs italic mb-4" style={{ color: 'var(--text-secondary)' }}>
              "{restaurant.tagline}"
            </p>

            <div className="space-y-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
              <div className="flex items-start gap-2.5">
                <MapPin size={15} className="shrink-0 mt-0.5 text-amber-500" />
                <span>{restaurant.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock size={15} className="shrink-0 text-amber-500" />
                <span>{restaurant.opening_hours}</span>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t" style={{ borderColor: 'var(--border-default)' }}>
              <div className="flex justify-between items-center text-xs mb-2">
                <span style={{ color: 'var(--text-muted)' }}>Chef’s Special Dishes:</span>
                <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
                  {featuredItems.length}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span style={{ color: 'var(--text-muted)' }}>Public URL Slug:</span>
                <span className="font-mono text-[11px]" style={{ color: 'var(--accent)' }}>
                  /{restaurant.slug}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <a
              href={`/menu/${restaurant.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold border flex items-center justify-center gap-2 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
              style={{ borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
            >
              <ExternalLink size={14} />
              Open Live Customer Menu
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

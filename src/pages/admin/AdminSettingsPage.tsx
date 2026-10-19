import { useState, useEffect } from 'react';
import {
  Settings,
  Store,
  Wifi,
  Bell,
  UtensilsCrossed,
  ShieldCheck,
  LogOut,
  Save,
  Check,
  Moon,
  Sun,
  Flame,
  PhoneCall,
  MessageCircle,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../../components/common/ThemeToggle';

interface ManagerSettings {
  isOpen: boolean;
  pauseNotice: string;
  currencySymbol: string;
  showDietaryBadges: boolean;
  showSpiceLevel: boolean;
  showChefTags: boolean;
  hideOutOfStock: boolean;
  taxNote: string;
  menuLayout: 'grid' | 'compact';
  showGuestWifi: boolean;
  wifiSsid: string;
  wifiPassword: string;
  enableCallWaiter: boolean;
  managerWhatsapp: string;
  soundAlerts: boolean;
  vibrateAlerts: boolean;
  [key: string]: unknown;
}

const defaultSettings: ManagerSettings = {
  isOpen: true,
  pauseNotice: 'Kitchen is temporarily busy. Accepting new orders shortly!',
  currencySymbol: '₹',
  showDietaryBadges: true,
  showSpiceLevel: true,
  showChefTags: true,
  hideOutOfStock: false,
  taxNote: 'All prices are inclusive of applicable taxes & GST',
  menuLayout: 'grid',
  showGuestWifi: true,
  wifiSsid: 'Cafe_Choco_Craze_Guest',
  wifiPassword: 'Welcome@CafeChocoCraze',
  enableCallWaiter: true,
  managerWhatsapp: '+91 98765 43210',
  soundAlerts: true,
  vibrateAlerts: true,
};

export default function AdminSettingsPage() {
  const { restaurant, updateRestaurant, addToast } = useData();
  const { userEmail, logout } = useAuth();
  const navigate = useNavigate();

  const [settings, setSettings] = useState<ManagerSettings>(() => {
    const saved = restaurant.theme_preferences as Partial<ManagerSettings> | undefined;
    return { ...defaultSettings, ...saved };
  });

  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (restaurant.theme_preferences) {
      setSettings((prev) => ({
        ...prev,
        ...(restaurant.theme_preferences as Partial<ManagerSettings>),
      }));
    }
  }, [restaurant.theme_preferences]);

  const updateField = <K extends keyof ManagerSettings>(key: K, value: ManagerSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateRestaurant({
        theme_preferences: settings,
      });
      setHasChanges(false);
      addToast('Settings saved successfully!', 'success');
    } catch {
      addToast('Failed to save settings. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="space-y-6 pb-24 max-w-3xl mx-auto animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl sm:text-3xl font-bold tracking-tight"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
          >
            Manager Settings
          </h1>
          <p className="text-xs sm:text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Configure live store status, menu display preferences, guest Wi-Fi, and alerts.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 disabled:opacity-50 shrink-0"
          style={{
            backgroundColor: hasChanges ? 'var(--accent)' : 'var(--bg-secondary)',
            color: hasChanges ? 'var(--text-inverse)' : 'var(--text-primary)',
            border: hasChanges ? 'none' : '1px solid var(--border-default)',
          }}
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : hasChanges ? (
            <>
              <Save size={16} />
              <span>Save Changes</span>
            </>
          ) : (
            <>
              <Check size={16} className="text-emerald-500" />
              <span>Saved</span>
            </>
          )}
        </button>
      </div>

      {/* ── 1. Store Operational Status ── */}
      <div
        className="rounded-3xl border p-5 sm:p-6 shadow-sm space-y-4"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-default)',
        }}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                settings.isOpen ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
              }`}
            >
              <Store size={20} />
            </div>
            <div>
              <h2 className="font-bold text-sm sm:text-base" style={{ color: 'var(--text-primary)' }}>
                Restaurant Store Status
              </h2>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {settings.isOpen ? 'Currently accepting guest orders' : 'Kitchen paused / store closed'}
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            type="button"
            onClick={async () => {
              const newIsOpen = !settings.isOpen;
              setSettings((prev) => ({ ...prev, isOpen: newIsOpen }));
              try {
                await updateRestaurant({
                  theme_preferences: {
                    ...(restaurant.theme_preferences || {}),
                    ...settings,
                    isOpen: newIsOpen,
                  },
                });
                addToast(
                  newIsOpen
                    ? 'Store is now OPEN and accepting orders!'
                    : 'Store marked as TEMPORARILY CLOSED. Red alert is now live across website & admin panel.',
                  newIsOpen ? 'success' : 'error'
                );
              } catch (err) {
                console.error(err);
                addToast('Failed to update store status', 'error');
              }
            }}
            className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-200 focus:outline-none cursor-pointer ${
              settings.isOpen ? 'bg-emerald-500' : 'bg-red-500'
            }`}
            title={settings.isOpen ? 'Click to mark store temporarily closed' : 'Click to reopen store'}
            aria-label={settings.isOpen ? 'Store is open' : 'Store is temporarily closed'}
          >
            <div
              className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-200 ${
                settings.isOpen ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Closed notice input if store is paused */}
        {!settings.isOpen && (
          <div className="pt-3 border-t space-y-2 animate-fade-in" style={{ borderColor: 'var(--border-default)' }}>
            <label className="block text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
              Pause Notice (shown to customers on mobile menu):
            </label>
            <input
              type="text"
              value={settings.pauseNotice}
              onChange={(e) => updateField('pauseNotice', e.target.value)}
              placeholder="e.g. Closed for private event / Kitchen busy"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border outline-none"
              style={{
                backgroundColor: 'var(--bg-input)',
                borderColor: 'var(--border-default)',
                color: 'var(--text-primary)',
              }}
            />
          </div>
        )}
      </div>

      {/* ── 2. Menu & Pricing Display ── */}
      <div
        className="rounded-3xl border p-5 sm:p-6 shadow-sm space-y-5"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-default)',
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}
          >
            <UtensilsCrossed size={18} />
          </div>
          <div>
            <h2 className="font-bold text-sm sm:text-base" style={{ color: 'var(--text-primary)' }}>
              Menu & Price Display
            </h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Control what badges and indicators guests see on their phones.
            </p>
          </div>
        </div>

        <div className="space-y-4 pt-1">
          {/* Currency selection */}
          <div className="flex items-center justify-between gap-4 py-2 border-b" style={{ borderColor: 'var(--border-default)' }}>
            <div>
              <span className="text-sm font-medium block" style={{ color: 'var(--text-primary)' }}>
                Currency Symbol
              </span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Displayed before dish prices (e.g., ₹280)
              </span>
            </div>
            <select
              value={settings.currencySymbol}
              onChange={(e) => updateField('currencySymbol', e.target.value)}
              className="px-3 py-1.5 rounded-xl border text-sm font-bold cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-input)',
                borderColor: 'var(--border-default)',
                color: 'var(--text-primary)',
              }}
            >
              <option value="₹">₹ (INR - Rupee)</option>
              <option value="$">$ (USD - Dollar)</option>
              <option value="€">€ (EUR - Euro)</option>
              <option value="£">£ (GBP - Pound)</option>
              <option value="AED">AED (Dirham)</option>
              <option value="SAR">SAR (Riyal)</option>
            </select>
          </div>

          {/* Dietary Badges */}
          <div className="flex items-center justify-between gap-4 py-2 border-b" style={{ borderColor: 'var(--border-default)' }}>
            <div>
              <span className="text-sm font-medium block" style={{ color: 'var(--text-primary)' }}>
                Show Dietary Badges (Veg / Non-Veg)
              </span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Displays green 🟢 and red 🔴 icons on dishes
              </span>
            </div>
            <button
              type="button"
              onClick={() => updateField('showDietaryBadges', !settings.showDietaryBadges)}
              className={`w-12 h-7 flex items-center rounded-full p-1 transition-colors duration-200 ${
                settings.showDietaryBadges ? 'bg-amber-500' : 'bg-zinc-300 dark:bg-zinc-700'
              }`}
            >
              <div
                className={`bg-white w-5 h-5 rounded-full shadow-sm transform transition-transform duration-200 ${
                  settings.showDietaryBadges ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Spice Rating */}
          <div className="flex items-center justify-between gap-4 py-2 border-b" style={{ borderColor: 'var(--border-default)' }}>
            <div>
              <span className="text-sm font-medium block" style={{ color: 'var(--text-primary)' }}>
                Show Spice Level Meter
              </span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Displays chili icons (Mild, Medium, Hot) on spicy dishes
              </span>
            </div>
            <button
              type="button"
              onClick={() => updateField('showSpiceLevel', !settings.showSpiceLevel)}
              className={`w-12 h-7 flex items-center rounded-full p-1 transition-colors duration-200 ${
                settings.showSpiceLevel ? 'bg-amber-500' : 'bg-zinc-300 dark:bg-zinc-700'
              }`}
            >
              <div
                className={`bg-white w-5 h-5 rounded-full shadow-sm transform transition-transform duration-200 ${
                  settings.showSpiceLevel ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Hide Out-of-Stock */}
          <div className="flex items-center justify-between gap-4 py-2 border-b" style={{ borderColor: 'var(--border-default)' }}>
            <div>
              <span className="text-sm font-medium block" style={{ color: 'var(--text-primary)' }}>
                Hide Out-of-Stock Items Completely
              </span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                When disabled, dishes show as greyed-out with a "Sold Out" tag
              </span>
            </div>
            <button
              type="button"
              onClick={() => updateField('hideOutOfStock', !settings.hideOutOfStock)}
              className={`w-12 h-7 flex items-center rounded-full p-1 transition-colors duration-200 ${
                settings.hideOutOfStock ? 'bg-amber-500' : 'bg-zinc-300 dark:bg-zinc-700'
              }`}
            >
              <div
                className={`bg-white w-5 h-5 rounded-full shadow-sm transform transition-transform duration-200 ${
                  settings.hideOutOfStock ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Tax Notice input */}
          <div className="pt-2">
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              Menu Tax & Billing Disclaimer (shown in footer):
            </label>
            <input
              type="text"
              value={settings.taxNote}
              onChange={(e) => updateField('taxNote', e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border outline-none"
              style={{
                backgroundColor: 'var(--bg-input)',
                borderColor: 'var(--border-default)',
                color: 'var(--text-primary)',
              }}
            />
          </div>
        </div>
      </div>

      {/* ── 3. Table Amenities (Guest Wi-Fi & Waiter Call) ── */}
      <div
        className="rounded-3xl border p-5 sm:p-6 shadow-sm space-y-4"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-default)',
        }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-blue-500 bg-blue-500/10">
            <Wifi size={18} />
          </div>
          <div>
            <h2 className="font-bold text-sm sm:text-base" style={{ color: 'var(--text-primary)' }}>
              Guest Amenities & Wi-Fi
            </h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Show complimentary restaurant Wi-Fi & assistance info on the customer menu.
            </p>
          </div>
        </div>

        {/* Guest Wi-Fi Toggle */}
        <div className="flex items-center justify-between gap-4 py-2 border-t pt-3" style={{ borderColor: 'var(--border-default)' }}>
          <div>
            <span className="text-sm font-medium block" style={{ color: 'var(--text-primary)' }}>
              Show Guest Wi-Fi on Menu
            </span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Guests can view Wi-Fi name & 1-tap copy password
            </span>
          </div>
          <button
            type="button"
            onClick={() => updateField('showGuestWifi', !settings.showGuestWifi)}
            className={`w-12 h-7 flex items-center rounded-full p-1 transition-colors duration-200 ${
              settings.showGuestWifi ? 'bg-amber-500' : 'bg-zinc-300 dark:bg-zinc-700'
            }`}
          >
            <div
              className={`bg-white w-5 h-5 rounded-full shadow-sm transform transition-transform duration-200 ${
                settings.showGuestWifi ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {settings.showGuestWifi && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 animate-fade-in">
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
                Wi-Fi Network (SSID)
              </label>
              <input
                type="text"
                value={settings.wifiSsid}
                onChange={(e) => updateField('wifiSsid', e.target.value)}
                placeholder="e.g. CafeChocoCraze_Guest"
                className="w-full px-3.5 py-2 text-xs rounded-xl border outline-none"
                style={{
                  backgroundColor: 'var(--bg-input)',
                  borderColor: 'var(--border-default)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
                Wi-Fi Password
              </label>
              <input
                type="text"
                value={settings.wifiPassword}
                onChange={(e) => updateField('wifiPassword', e.target.value)}
                placeholder="e.g. Spice@2024"
                className="w-full px-3.5 py-2 text-xs rounded-xl border outline-none"
                style={{
                  backgroundColor: 'var(--bg-input)',
                  borderColor: 'var(--border-default)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
          </div>
        )}

        {/* Call Waiter button toggle */}
        <div className="flex items-center justify-between gap-4 py-2 border-t pt-3" style={{ borderColor: 'var(--border-default)' }}>
          <div>
            <span className="text-sm font-medium block" style={{ color: 'var(--text-primary)' }}>
              "Call Waiter / Assistance" Quick Button
            </span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Allows customers at tables to alert staff
            </span>
          </div>
          <button
            type="button"
            onClick={() => updateField('enableCallWaiter', !settings.enableCallWaiter)}
            className={`w-12 h-7 flex items-center rounded-full p-1 transition-colors duration-200 ${
              settings.enableCallWaiter ? 'bg-amber-500' : 'bg-zinc-300 dark:bg-zinc-700'
            }`}
          >
            <div
              className={`bg-white w-5 h-5 rounded-full shadow-sm transform transition-transform duration-200 ${
                settings.enableCallWaiter ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Manager WhatsApp */}
        <div className="pt-1">
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
            Manager WhatsApp Number for Inquiries:
          </label>
          <div className="relative">
            <MessageCircle size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-500" />
            <input
              type="text"
              value={settings.managerWhatsapp}
              onChange={(e) => updateField('managerWhatsapp', e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border outline-none"
              style={{
                backgroundColor: 'var(--bg-input)',
                borderColor: 'var(--border-default)',
                color: 'var(--text-primary)',
              }}
            />
          </div>
        </div>
      </div>

      {/* ── 4. App Theme & Appearance ── */}
      <div
        className="rounded-3xl border p-5 sm:p-6 shadow-sm space-y-4"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-default)',
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-purple-500 bg-purple-500/10">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="font-bold text-sm sm:text-base" style={{ color: 'var(--text-primary)' }}>
                Appearance & Theme
              </h2>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Switch between Light & Dark mode for comfortable day/night viewing.
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* ── 5. Manager Account & Session ── */}
      <div
        className="rounded-3xl border p-5 sm:p-6 shadow-sm space-y-4"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-default)',
        }}
      >
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-emerald-500 bg-emerald-500/10">
            <ShieldCheck size={18} />
          </div>
          <div>
            <h2 className="font-bold text-sm sm:text-base" style={{ color: 'var(--text-primary)' }}>
              Manager Account
            </h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Active authorized session.
            </p>
          </div>
        </div>

        <div
          className="p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-xs"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-default)',
          }}
        >
          <div>
            <span className="font-semibold block" style={{ color: 'var(--text-primary)' }}>
              {userEmail || 'Cafe Manager'}
            </span>
            <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              Authorized Manager Portal Session
            </span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-xl border border-red-500/30 text-red-600 dark:text-red-400 font-semibold text-xs flex items-center gap-1.5 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={13} />
            <span>Sign Out</span>
          </button>
        </div>

        <p className="text-[11px] text-center" style={{ color: 'var(--text-muted)' }}>
          Digital Cafe Menu • Mobile Manager Edition v1.2.0
        </p>
      </div>

      {/* Mobile Sticky Save Bar */}
      {hasChanges && (
        <div
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-40 p-3 rounded-2xl shadow-2xl border flex items-center justify-between gap-3 animate-fade-in-up"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--accent)',
          }}
        >
          <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
            Unsaved changes
          </span>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95"
            style={{
              backgroundColor: 'var(--accent)',
              color: 'var(--text-inverse)',
            }}
          >
            <Save size={13} />
            <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      )}
    </div>
  );
}

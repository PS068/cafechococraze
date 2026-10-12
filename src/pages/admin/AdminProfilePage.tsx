import { useState, useEffect } from 'react';
import { Store, Save, Image, MapPin, Phone, Clock, ChefHat, ExternalLink, Share2 } from 'lucide-react';
import { InstagramIcon, FacebookIcon, TwitterIcon } from '../../components/common/SocialIcons';
import { useData } from '../../context/DataContext';

export default function AdminProfilePage() {
  const { restaurant, updateRestaurant } = useData();

  const [form, setForm] = useState({
    name: restaurant.name || '',
    tagline: restaurant.tagline || '',
    description: restaurant.description || '',
    logo_url: restaurant.logo_url || '',
    banner_url: restaurant.banner_url || '',
    address: restaurant.address || '',
    phone: restaurant.phone || '',
    opening_hours: restaurant.opening_hours || '',
    cuisine_type: restaurant.cuisine_type || '',
    instagram: restaurant.social_links?.instagram || '',
    facebook: restaurant.social_links?.facebook || '',
    twitter: restaurant.social_links?.twitter || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setForm({
      name: restaurant.name || '',
      tagline: restaurant.tagline || '',
      description: restaurant.description || '',
      logo_url: restaurant.logo_url || '',
      banner_url: restaurant.banner_url || '',
      address: restaurant.address || '',
      phone: restaurant.phone || '',
      opening_hours: restaurant.opening_hours || '',
      cuisine_type: restaurant.cuisine_type || '',
      instagram: restaurant.social_links?.instagram || '',
      facebook: restaurant.social_links?.facebook || '',
      twitter: restaurant.social_links?.twitter || '',
    });
  }, [restaurant]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateRestaurant({
        name: form.name.trim(),
        tagline: form.tagline.trim(),
        description: form.description.trim(),
        logo_url: form.logo_url.trim(),
        banner_url: form.banner_url.trim(),
        address: form.address.trim(),
        phone: form.phone.trim(),
        opening_hours: form.opening_hours.trim(),
        cuisine_type: form.cuisine_type.trim(),
        social_links: {
          instagram: form.instagram.trim() || undefined,
          facebook: form.facebook.trim() || undefined,
          twitter: form.twitter.trim() || undefined,
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = {
    backgroundColor: 'var(--bg-input)',
    borderColor: 'var(--border-default)',
    color: 'var(--text-primary)',
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl sm:text-3xl font-bold tracking-tight"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
          >
            Restaurant Profile & Branding
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Update your restaurant identity, opening timings, contact information, and banner media.
          </p>
        </div>

        <a
          href={`/menu/${restaurant.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors self-start sm:self-auto hover:bg-black/5 dark:hover:bg-white/5"
          style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}
        >
          <ExternalLink size={14} />
          View Live Menu
        </a>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Brand Details */}
        <div
          className="rounded-3xl border p-6 sm:p-8 shadow-sm space-y-5"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-default)',
          }}
        >
          <h2 className="text-lg font-bold flex items-center gap-2 pb-3 border-b" style={{ borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}>
            <Store size={20} style={{ color: 'var(--accent)' }} />
            Brand Identity
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Restaurant Name *
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="The Spice House"
                className="w-full px-4 py-2.5 text-sm rounded-xl border transition-colors"
                style={inputStyle}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Cuisine Type
              </label>
              <div className="relative">
                <ChefHat size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  value={form.cuisine_type}
                  onChange={(e) => setForm({ ...form, cuisine_type: e.target.value })}
                  placeholder="e.g. North Indian, Mughlai, Tandoori"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border transition-colors"
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              Tagline / Catchphrase
            </label>
            <input
              type="text"
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              placeholder="Authentic Flavors, Unforgettable Moments"
              className="w-full px-4 py-2.5 text-sm rounded-xl border transition-colors"
              style={inputStyle}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              Story / About Description
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Tell guests about your cooking heritage, fresh ingredients, and ambiance..."
              className="w-full px-4 py-2.5 text-sm rounded-xl border transition-colors resize-none"
              style={inputStyle}
            />
          </div>
        </div>

        {/* Media & Photography */}
        <div
          className="rounded-3xl border p-6 sm:p-8 shadow-sm space-y-5"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-default)',
          }}
        >
          <h2 className="text-lg font-bold flex items-center gap-2 pb-3 border-b" style={{ borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}>
            <Image size={20} style={{ color: 'var(--accent)' }} />
            Visual Branding & Photography
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Logo Image URL
              </label>
              <input
                type="url"
                value={form.logo_url}
                onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-2.5 text-sm rounded-xl border transition-colors"
                style={inputStyle}
              />
              {form.logo_url && (
                <div className="mt-3 flex items-center gap-3">
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Preview:</span>
                  <img
                    src={form.logo_url}
                    alt="Logo Preview"
                    className="w-12 h-12 rounded-xl object-cover border"
                    style={{ borderColor: 'var(--border-default)' }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Hero Banner Image URL
              </label>
              <input
                type="url"
                value={form.banner_url}
                onChange={(e) => setForm({ ...form, banner_url: e.target.value })}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-4 py-2.5 text-sm rounded-xl border transition-colors"
                style={inputStyle}
              />
              {form.banner_url && (
                <div className="mt-3">
                  <span className="text-xs block mb-1" style={{ color: 'var(--text-muted)' }}>Banner Preview:</span>
                  <img
                    src={form.banner_url}
                    alt="Banner Preview"
                    className="w-full h-24 rounded-xl object-cover border"
                    style={{ borderColor: 'var(--border-default)' }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Location & Operations */}
        <div
          className="rounded-3xl border p-6 sm:p-8 shadow-sm space-y-5"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-default)',
          }}
        >
          <h2 className="text-lg font-bold flex items-center gap-2 pb-3 border-b" style={{ borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}>
            <MapPin size={20} style={{ color: 'var(--accent)' }} />
            Location & Contact Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Restaurant Address
              </label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="42 Maharaja Road, Connaught Place, New Delhi"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border transition-colors"
                  style={inputStyle}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Contact Phone Number
              </label>
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border transition-colors"
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              Opening Hours
            </label>
            <div className="relative">
              <Clock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={form.opening_hours}
                onChange={(e) => setForm({ ...form, opening_hours: e.target.value })}
                placeholder="Mon–Sun: 11:00 AM – 11:00 PM"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border transition-colors"
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div
          className="rounded-3xl border p-6 sm:p-8 shadow-sm space-y-5"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-default)',
          }}
        >
          <h2 className="text-lg font-bold flex items-center gap-2 pb-3 border-b" style={{ borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}>
            <Share2 size={20} style={{ color: 'var(--accent)' }} />
            Social Media Channels
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Instagram URL
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }}>
                  <InstagramIcon size={16} />
                </div>
                <input
                  type="url"
                  value={form.instagram}
                  onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                  placeholder="https://instagram.com/..."
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border transition-colors"
                  style={inputStyle}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Facebook URL
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }}>
                  <FacebookIcon size={16} />
                </div>
                <input
                  type="url"
                  value={form.facebook}
                  onChange={(e) => setForm({ ...form, facebook: e.target.value })}
                  placeholder="https://facebook.com/..."
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border transition-colors"
                  style={inputStyle}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                X / Twitter URL
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }}>
                  <TwitterIcon size={16} />
                </div>
                <input
                  type="url"
                  value={form.twitter}
                  onChange={(e) => setForm({ ...form, twitter: e.target.value })}
                  placeholder="https://twitter.com/..."
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border transition-colors"
                  style={inputStyle}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 shadow-lg transition-transform active:scale-95 disabled:opacity-50"
            style={{ backgroundColor: 'var(--accent)', color: 'var(--text-inverse)' }}
          >
            <Save size={18} />
            <span>{isSubmitting ? 'Saving Changes...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

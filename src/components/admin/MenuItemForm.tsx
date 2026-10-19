import { useState, useEffect } from 'react';
import { Save, ImagePlus, Sparkles } from 'lucide-react';
import type { MenuItemFormData, FoodType, SpiceLevel } from '../../types';
import { useData } from '../../context/DataContext';
import { FOOD_CATALOG } from '../../data/foodCatalog';
import DishPhotoPicker from './DishPhotoPicker';
import { formatINR } from '../../lib/formatters';

interface MenuItemFormProps {
  initialData?: MenuItemFormData;
  onSubmit: (data: MenuItemFormData) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

const defaultFormData: MenuItemFormData = {
  name: '',
  description: '',
  price: 0,
  discounted_price: null,
  category_id: '',
  image_url: '',
  food_type: 'veg',
  is_available: true,
  is_featured: false,
  spice_level: 'none',
  labels: [],
};

const LABEL_OPTIONS = ['Popular', "Chef's Special", 'Spicy', 'New', 'Must Try'];

export default function MenuItemForm({ initialData, onSubmit, onCancel, submitLabel = 'Save Item' }: MenuItemFormProps) {
  const { categories, ensureCategory } = useData();
  const [form, setForm] = useState<MenuItemFormData>(initialData || defaultFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (form.price <= 0) errs.price = 'Price must be greater than 0';
    if (form.discounted_price !== null && form.discounted_price >= form.price) {
      errs.discounted_price = 'Discounted price must be less than original price';
    }
    if (!form.category_id) errs.category_id = 'Category is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await onSubmit(form);
    } finally {
      setIsSubmitting(false);
    }
  }

  function toggleLabel(label: string) {
    setForm((prev) => ({
      ...prev,
      labels: prev.labels.includes(label)
        ? prev.labels.filter((l) => l !== label)
        : [...prev.labels, label],
    }));
  }

  const inputStyle = {
    backgroundColor: 'var(--bg-input)',
    borderColor: 'var(--border-default)',
    color: 'var(--text-primary)',
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Quick Autofill from Catalog */}
      <div
        className="p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm"
        style={{
          backgroundColor: 'var(--accent-light)',
          borderColor: 'var(--accent)',
        }}
      >
        <div className="flex items-center gap-2">
          <Sparkles size={18} style={{ color: 'var(--accent)' }} className="shrink-0" />
          <div>
            <span className="text-xs font-bold block" style={{ color: 'var(--text-primary)' }}>
              ⚡ Quick-Fill from Cafe Catalog
            </span>
            <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              Select an item to pre-fill photo, description, category & price
            </span>
          </div>
        </div>

        <select
          defaultValue=""
          onChange={async (e) => {
            const selected = FOOD_CATALOG.find((c) => c.id === e.target.value);
            if (selected) {
              const catId = await ensureCategory(selected.categoryName);
              setForm((prev) => ({
                ...prev,
                name: selected.name,
                description: selected.description,
                price: selected.price,
                image_url: selected.image_url,
                category_id: catId || prev.category_id,
                food_type: selected.food_type,
                spice_level: selected.spice_level,
                labels: selected.labels,
              }));
              setErrors({});
            }
          }}
          className="text-xs font-semibold px-3 py-2 rounded-xl border cursor-pointer outline-none transition-colors"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-default)',
            color: 'var(--text-primary)',
          }}
        >
          <option value="" disabled>
            Choose a cafe item to pre-fill...
          </option>
          {FOOD_CATALOG.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name} ({item.categoryName} • {formatINR(item.price)})
            </option>
          ))}
        </select>
      </div>
      {/* Name */}
      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
          Item Name *
        </label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="e.g., Crunchy Frolic Thick Cold Coffee"
          className="w-full px-4 py-2.5 text-sm rounded-xl border"
          style={inputStyle}
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
          Description
        </label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Describe your cafe item..."
          rows={3}
          className="w-full px-4 py-2.5 text-sm rounded-xl border resize-none"
          style={inputStyle}
        />
      </div>

      {/* Price row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
            Price (₹) *
          </label>
          <input
            type="number"
            value={form.price || ''}
            onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
            placeholder="0"
            min="0"
            step="0.01"
            className="w-full px-4 py-2.5 text-sm rounded-xl border"
            style={inputStyle}
          />
          {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
            Discounted Price (₹)
          </label>
          <input
            type="number"
            value={form.discounted_price ?? ''}
            onChange={(e) => {
              const val = e.target.value;
              setForm({ ...form, discounted_price: val ? parseFloat(val) : null });
            }}
            placeholder="Leave empty for no discount"
            min="0"
            step="0.01"
            className="w-full px-4 py-2.5 text-sm rounded-xl border"
            style={inputStyle}
          />
          {errors.discounted_price && <p className="text-red-500 text-xs mt-1">{errors.discounted_price}</p>}
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
          Category *
        </label>
        <select
          value={form.category_id}
          onChange={(e) => setForm({ ...form, category_id: e.target.value })}
          className="w-full px-4 py-2.5 text-sm rounded-xl border"
          style={inputStyle}
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        {errors.category_id && <p className="text-red-500 text-xs mt-1">{errors.category_id}</p>}
      </div>

      {/* Dish Photograph (Upload from device, Presets, or URL) */}
      <DishPhotoPicker
        value={form.image_url}
        onChange={(url) => setForm({ ...form, image_url: url })}
      />

      {/* Food type & Spice level */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
            Food Type
          </label>
          <select
            value={form.food_type}
            onChange={(e) => setForm({ ...form, food_type: e.target.value as FoodType })}
            className="w-full px-4 py-2.5 text-sm rounded-xl border"
            style={inputStyle}
          >
            <option value="veg">🟢 Vegetarian</option>
            <option value="nonveg">🔴 Non-Vegetarian</option>
            <option value="none">Not Applicable</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
            Spice Level
          </label>
          <select
            value={form.spice_level}
            onChange={(e) => setForm({ ...form, spice_level: e.target.value as SpiceLevel })}
            className="w-full px-4 py-2.5 text-sm rounded-xl border"
            style={inputStyle}
          >
            <option value="none">No spice</option>
            <option value="mild">🌶️ Mild</option>
            <option value="medium">🌶️🌶️ Medium</option>
            <option value="hot">🌶️🌶️🌶️ Hot</option>
            <option value="extra_hot">🌶️🌶️🌶️🌶️ Extra Hot</option>
          </select>
        </div>
      </div>

      {/* Toggles */}
      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.is_available}
            onChange={(e) => setForm({ ...form, is_available: e.target.checked })}
            className="w-5 h-5 rounded accent-amber-500"
          />
          <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Available</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.is_featured}
            onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
            className="w-5 h-5 rounded accent-amber-500"
          />
          <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Featured</span>
        </label>
      </div>

      {/* Labels */}
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
          Labels
        </label>
        <div className="flex flex-wrap gap-2">
          {LABEL_OPTIONS.map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => toggleLabel(label)}
              className="px-3.5 py-1.5 text-sm rounded-full border transition-all duration-200"
              style={{
                backgroundColor: form.labels.includes(label) ? 'var(--accent)' : 'transparent',
                color: form.labels.includes(label) ? 'var(--text-inverse)' : 'var(--text-secondary)',
                borderColor: form.labels.includes(label) ? 'var(--accent)' : 'var(--border-default)',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: 'var(--border-default)' }}>
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 text-sm font-medium rounded-xl border transition-colors"
          style={{
            color: 'var(--text-secondary)',
            borderColor: 'var(--border-default)',
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2.5 text-sm font-medium rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50"
          style={{
            backgroundColor: 'var(--accent)',
            color: 'var(--text-inverse)',
          }}
        >
          <Save size={16} />
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}

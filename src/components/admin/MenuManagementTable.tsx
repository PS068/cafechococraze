import { useState } from 'react';
import { Edit2, Trash2, Search, ImageOff, Check, X } from 'lucide-react';
import type { MenuItem, Category } from '../../types';
import ConfirmDialog from '../common/ConfirmDialog';
import { formatINR } from '../../lib/formatters';

interface MenuManagementTableProps {
  items: MenuItem[];
  categories: Category[];
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => Promise<void>;
  onToggleAvailability: (id: string, isAvailable: boolean) => Promise<void>;
}

export default function MenuManagementTable({
  items,
  categories,
  onEdit,
  onDelete,
  onToggleAvailability,
}: MenuManagementTableProps) {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = items
    .filter((item) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!item.name.toLowerCase().includes(q)) return false;
      }
      if (filterCategory && item.category_id !== filterCategory) return false;
      return true;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const getCategoryName = (catId: string) =>
    categories.find((c) => c.id === catId)?.name || 'Uncategorized';

  const itemToDelete = items.find((i) => i.id === deleteId);

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--text-muted)' }}
          />
          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border"
            style={{
              backgroundColor: 'var(--bg-input)',
              borderColor: 'var(--border-default)',
              color: 'var(--text-primary)',
            }}
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2.5 text-sm rounded-xl border"
          style={{
            backgroundColor: 'var(--bg-input)',
            borderColor: 'var(--border-default)',
            color: 'var(--text-primary)',
          }}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl border overflow-hidden max-h-[72vh] flex flex-col" style={{ borderColor: 'var(--border-default)', backgroundColor: 'var(--bg-card)' }}>
        <div className="overflow-x-auto overflow-y-auto flex-1">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10 border-b" style={{ backgroundColor: 'var(--bg-hover)', borderColor: 'var(--border-default)' }}>
              <tr>
                <th className="text-left px-4 py-3 font-semibold" style={{ color: 'var(--text-muted)' }}>Item</th>
                <th className="text-left px-4 py-3 font-semibold hidden sm:table-cell" style={{ color: 'var(--text-muted)' }}>Category</th>
                <th className="text-left px-4 py-3 font-semibold hidden md:table-cell" style={{ color: 'var(--text-muted)' }}>Diet</th>
                <th className="text-left px-4 py-3 font-semibold hidden lg:table-cell" style={{ color: 'var(--text-muted)' }}>Highlights</th>
                <th className="text-left px-4 py-3 font-semibold" style={{ color: 'var(--text-muted)' }}>Price</th>
                <th className="text-center px-4 py-3 font-semibold" style={{ color: 'var(--text-muted)' }}>Available</th>
                <th className="text-right px-4 py-3 font-semibold" style={{ color: 'var(--text-muted)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12" style={{ color: 'var(--text-muted)' }}>
                    No menu items found.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t transition-colors"
                    style={{ borderColor: 'var(--border-subtle)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-hover)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    {/* Item */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border" style={{ borderColor: 'var(--border-default)' }}>
                          {item.image_url ? (
                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full img-placeholder flex items-center justify-center">
                              <ImageOff size={14} style={{ color: 'var(--text-muted)' }} />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium truncate max-w-[200px] sm:max-w-xs md:max-w-sm" style={{ color: 'var(--text-primary)' }}>{item.name}</p>
                          <p className="text-xs sm:hidden" style={{ color: 'var(--text-muted)' }}>{getCategoryName(item.category_id)}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span
                        className="text-xs px-2.5 py-1 rounded-full font-medium"
                        style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}
                      >
                        {getCategoryName(item.category_id)}
                      </span>
                    </td>

                    {/* Diet (desktop) */}
                    <td className="px-4 py-3 hidden md:table-cell">
                      {item.food_type !== 'none' && (
                        <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                          <span className={`food-type-badge ${item.food_type === 'veg' ? 'veg' : 'nonveg'}`} />
                          <span className="capitalize">{item.food_type}</span>
                        </div>
                      )}
                    </td>

                    {/* Highlights (desktop PC) */}
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1 max-w-[220px]">
                        {item.labels && item.labels.length > 0 ? (
                          item.labels.slice(0, 2).map((label) => (
                            <span
                              key={label}
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-md border"
                              style={{
                                backgroundColor: 'var(--bg-hover)',
                                borderColor: 'var(--border-default)',
                                color: 'var(--text-secondary)',
                              }}
                            >
                              {label}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-muted" style={{ color: 'var(--text-muted)' }}>—</span>
                        )}
                      </div>
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3">
                      <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                         {formatINR(item.discounted_price ?? item.price)}
                      </span>
                    </td>

                    {/* Availability */}
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => onToggleAvailability(item.id, !item.is_available)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg transition-colors cursor-pointer"
                        style={{
                          backgroundColor: item.is_available ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
                          color: item.is_available ? '#22c55e' : '#ef4444',
                        }}
                        title={item.is_available ? 'Mark unavailable' : 'Mark available'}
                      >
                        {item.is_available ? <Check size={16} /> : <X size={16} />}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => onEdit(item)}
                          className="p-2 rounded-lg transition-colors"
                          style={{ color: 'var(--accent)' }}
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteId(item.id)}
                          className="p-2 rounded-lg transition-colors text-red-500 hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Menu Item"
        message={`Are you sure you want to delete "${itemToDelete?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={async () => {
          if (deleteId) {
            await onDelete(deleteId);
            setDeleteId(null);
          }
        }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

import { useState } from 'react';
import {
  FolderPlus,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  Check,
  X,
  Plus,
  AlertTriangle,
  FolderOpen,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import type { Category } from '../../types';

export default function AdminCategoriesPage() {
  const {
    categories,
    menuItems,
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
    addToast,
  } = useData();

  const [newCatName, setNewCatName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [deleteCat, setDeleteCat] = useState<Category | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Sort categories by display order
  const sorted = [...categories].sort((a, b) => a.display_order - b.display_order);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    await addCategory(newCatName.trim());
    setNewCatName('');
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditName(cat.name);
  };

  const saveEdit = async (id: string) => {
    if (!editName.trim()) return;
    await updateCategory(id, editName.trim());
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === sorted.length - 1)
    ) {
      return;
    }

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const reordered = [...sorted];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    await reorderCategories(reordered);
    addToast('Category order updated', 'success');
  };

  const attemptDelete = (cat: Category) => {
    const count = menuItems.filter((i) => i.category_id === cat.id).length;
    if (count > 0) {
      setDeleteError(
        `Cannot delete "${cat.name}" because it contains ${count} dish(es). Please delete or move those dishes first.`
      );
    } else {
      setDeleteError(null);
    }
    setDeleteCat(cat);
  };

  const confirmDelete = async () => {
    if (!deleteCat) return;
    const res = await deleteCategory(deleteCat.id);
    if (res.success) {
      setDeleteCat(null);
      setDeleteError(null);
    } else {
      setDeleteError(res.error || 'Failed to delete category');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      {/* Header */}
      <div>
        <h1
          className="text-2xl sm:text-3xl font-bold tracking-tight"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
        >
          Menu Categories
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Create and organize menu sections. Use the arrow controls to change display order on the public menu.
        </p>
      </div>

      {/* Add New Category Form */}
      <div
        className="rounded-3xl border p-5 sm:p-6 shadow-sm"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-default)',
        }}
      >
        <h2 className="text-base font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <FolderPlus size={18} style={{ color: 'var(--accent)' }} />
          Add New Category
        </h2>
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            placeholder="e.g. Sizzlers, Mocktails, Chef's Tasting"
            className="flex-1 px-4 py-2.5 text-sm rounded-xl border transition-colors"
            style={{
              backgroundColor: 'var(--bg-input)',
              borderColor: 'var(--border-default)',
              color: 'var(--text-primary)',
            }}
          />
          <button
            type="submit"
            disabled={!newCatName.trim()}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            style={{ backgroundColor: 'var(--accent)', color: 'var(--text-inverse)' }}
          >
            <Plus size={16} />
            <span>Add Category</span>
          </button>
        </form>
      </div>

      {/* Category List */}
      <div
        className="rounded-3xl border overflow-hidden shadow-sm"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-default)',
        }}
      >
        <div className="p-5 border-b" style={{ borderColor: 'var(--border-default)' }}>
          <div className="flex justify-between items-center">
            <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
              Categories List ({sorted.length})
            </h2>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Drag or use arrows to rearrange
            </span>
          </div>
        </div>

        <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
          {sorted.length === 0 ? (
            <div className="py-12 text-center" style={{ color: 'var(--text-muted)' }}>
              No categories found. Create one above to get started.
            </div>
          ) : (
            sorted.map((cat, index) => {
              const itemCount = menuItems.filter((i) => i.category_id === cat.id).length;
              const isEditing = editingId === cat.id;

              return (
                <div
                  key={cat.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                >
                  {/* Category Name & Item Count */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                      style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}
                    >
                      {index + 1}
                    </div>

                    {isEditing ? (
                      <div className="flex items-center gap-2 flex-1 max-w-sm">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="px-3 py-1.5 text-sm rounded-lg border w-full"
                          style={{
                            backgroundColor: 'var(--bg-input)',
                            borderColor: 'var(--border-default)',
                            color: 'var(--text-primary)',
                          }}
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveEdit(cat.id);
                            if (e.key === 'Escape') cancelEdit();
                          }}
                        />
                        <button
                          onClick={() => saveEdit(cat.id)}
                          className="p-1.5 rounded-lg text-green-600 hover:bg-green-500/10"
                          title="Save"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-500/10"
                          title="Cancel"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2.5 truncate">
                        <span className="font-semibold text-sm sm:text-base truncate" style={{ color: 'var(--text-primary)' }}>
                          {cat.name}
                        </span>
                        <span
                          className="text-xs px-2.5 py-0.5 rounded-full font-medium shrink-0"
                          style={{
                            backgroundColor: itemCount > 0 ? 'var(--bg-hover)' : 'rgba(239,68,68,0.1)',
                            color: itemCount > 0 ? 'var(--text-secondary)' : '#ef4444',
                          }}
                        >
                          {itemCount} {itemCount === 1 ? 'dish' : 'dishes'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions: Reorder, Edit, Delete */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {/* Move Up */}
                    <button
                      onClick={() => handleMove(index, 'up')}
                      disabled={index === 0}
                      className="p-2 rounded-lg border transition-colors disabled:opacity-30"
                      style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}
                      title="Move up in order"
                    >
                      <ArrowUp size={15} />
                    </button>

                    {/* Move Down */}
                    <button
                      onClick={() => handleMove(index, 'down')}
                      disabled={index === sorted.length - 1}
                      className="p-2 rounded-lg border transition-colors disabled:opacity-30"
                      style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}
                      title="Move down in order"
                    >
                      <ArrowDown size={15} />
                    </button>

                    {/* Rename */}
                    <button
                      onClick={() => startEdit(cat)}
                      className="p-2 rounded-lg border transition-colors"
                      style={{ borderColor: 'var(--border-default)', color: 'var(--accent)' }}
                      title="Rename category"
                    >
                      <Edit2 size={15} />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => attemptDelete(cat)}
                      className="p-2 rounded-lg border transition-colors text-red-500 hover:bg-red-500/10"
                      style={{ borderColor: 'var(--border-default)' }}
                      title="Delete category"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteCat}
        title={deleteError ? 'Cannot Delete Category' : 'Delete Category'}
        message={
          deleteError ||
          `Are you sure you want to delete "${deleteCat?.name}"? This action cannot be undone.`
        }
        confirmLabel={deleteError ? 'Understood' : 'Delete'}
        variant={deleteError ? 'default' : 'danger'}
        onConfirm={async () => {
          if (deleteError) {
            setDeleteCat(null);
            setDeleteError(null);
          } else {
            await confirmDelete();
          }
        }}
        onCancel={() => {
          setDeleteCat(null);
          setDeleteError(null);
        }}
      >
        {deleteError && (
          <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-400 flex items-start gap-2">
            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
            <span>
              To protect your menu from accidental data loss, please go to the Menu Items tab and either reassign these dishes to another category or remove them.
            </span>
          </div>
        )}
      </ConfirmDialog>
    </div>
  );
}

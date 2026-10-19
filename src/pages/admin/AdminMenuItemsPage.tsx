import { useState } from 'react';
import { Plus, X, UtensilsCrossed, Sparkles } from 'lucide-react';
import { useData } from '../../context/DataContext';
import MenuManagementTable from '../../components/admin/MenuManagementTable';
import MenuItemForm from '../../components/admin/MenuItemForm';
import DishCatalogModal from '../../components/admin/DishCatalogModal';
import type { MenuItem, MenuItemFormData } from '../../types';

export default function AdminMenuItemsPage() {
  const { menuItems, categories, addMenuItem, updateMenuItem, deleteMenuItem } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [preFilledData, setPreFilledData] = useState<MenuItemFormData | null>(null);

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setPreFilledData(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setPreFilledData(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setPreFilledData(null);
  };

  const handleSelectForCustomize = (formData: MenuItemFormData) => {
    setEditingItem(null);
    setPreFilledData(formData);
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData: MenuItemFormData) => {
    if (editingItem) {
      await updateMenuItem(editingItem.id, formData);
    } else {
      await addMenuItem(formData);
    }
    handleCloseModal();
  };

  const handleToggleAvailability = async (id: string, isAvailable: boolean) => {
    await updateMenuItem(id, { is_available: isAvailable });
  };

  const initialFormData: MenuItemFormData | undefined = editingItem
    ? {
        name: editingItem.name,
        description: editingItem.description,
        price: editingItem.price,
        discounted_price: editingItem.discounted_price,
        category_id: editingItem.category_id,
        image_url: editingItem.image_url,
        food_type: editingItem.food_type,
        is_available: editingItem.is_available,
        is_featured: editingItem.is_featured,
        spice_level: editingItem.spice_level,
        labels: editingItem.labels,
      }
    : preFilledData || undefined;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl sm:text-3xl font-bold tracking-tight"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
          >
            Menu Items
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Manage dishes, prices, descriptions, and dietary options across all categories.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            id="btn-open-food-catalog"
            onClick={() => setIsCatalogModalOpen(true)}
            className="px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 border transition-all hover:opacity-90 active:scale-95 shadow-sm"
            style={{
              backgroundColor: 'var(--accent-light)',
              borderColor: 'var(--accent)',
              color: 'var(--accent)',
            }}
          >
            <Sparkles size={17} />
            <span>⚡ Pre-Built Cafe Library</span>
          </button>

          <button
            id="btn-add-menu-item"
            onClick={handleOpenAddModal}
            className="px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
            style={{ backgroundColor: 'var(--accent)', color: 'var(--text-inverse)' }}
          >
            <Plus size={18} />
            <span>Add Custom Item</span>
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div
        className="rounded-3xl border p-5 sm:p-6 shadow-sm"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-default)',
        }}
      >
        <MenuManagementTable
          items={menuItems}
          categories={categories}
          onEdit={handleOpenEditModal}
          onDelete={deleteMenuItem}
          onToggleAvailability={handleToggleAvailability}
        />
      </div>

      {/* Modal for Pre-Built Food Library */}
      <DishCatalogModal
        isOpen={isCatalogModalOpen}
        onClose={() => setIsCatalogModalOpen(false)}
        onSelectForCustomize={handleSelectForCustomize}
      />

      {/* Modal for Add / Edit Item */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay overflow-y-auto animate-fade-in"
          onClick={handleCloseModal}
        >
          <div
            className="w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl my-8 max-h-[90vh] overflow-y-auto animate-fade-in-up"
            style={{ backgroundColor: 'var(--bg-card)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b" style={{ borderColor: 'var(--border-default)' }}>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}
                >
                  <UtensilsCrossed size={20} />
                </div>
                <div>
                  <h2
                    className="text-xl font-bold"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                  >
                    {editingItem
                      ? 'Edit Menu Item'
                      : preFilledData
                      ? 'Customize & Add Dish'
                      : 'Add New Menu Item'}
                  </h2>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {editingItem
                      ? 'Changes will immediately update the live menu'
                      : 'Details and photo are pre-filled — adjust price or info as needed'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 rounded-xl transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                style={{ color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body Form */}
            <MenuItemForm
              key={editingItem ? `edit-${editingItem.id}` : preFilledData ? `prefill-${preFilledData.name}` : 'new-item'}
              initialData={initialFormData}
              onSubmit={handleSubmit}
              onCancel={handleCloseModal}
              submitLabel={
                editingItem
                  ? 'Save Changes'
                  : preFilledData
                  ? 'Add to Menu'
                  : 'Create Item'
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}

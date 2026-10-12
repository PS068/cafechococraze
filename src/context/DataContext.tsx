import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Restaurant, Category, MenuItem, MenuItemFormData, Toast } from '../types';
import { DEMO_RESTAURANT, DEMO_CATEGORIES, DEMO_MENU_ITEMS } from '../data/demoData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface DataContextType {
  restaurant: Restaurant;
  categories: Category[];
  menuItems: MenuItem[];
  isLoading: boolean;
  toasts: Toast[];

  // Restaurant
  updateRestaurant: (data: Partial<Restaurant>) => Promise<void>;

  // Categories
  addCategory: (name: string) => Promise<Category | null>;
  ensureCategory: (name: string) => Promise<string>;
  updateCategory: (id: string, name: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<{ success: boolean; error?: string }>;
  reorderCategories: (reordered: Category[]) => Promise<void>;

  // Menu items
  addMenuItem: (data: MenuItemFormData) => Promise<void>;
  updateMenuItem: (id: string, data: Partial<MenuItemFormData>) => Promise<void>;
  deleteMenuItem: (id: string) => Promise<void>;

  // Toasts
  addToast: (message: string, type: Toast['type']) => void;
  removeToast: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [restaurant, setRestaurant] = useState<Restaurant>(DEMO_RESTAURANT);
  const [categories, setCategories] = useState<Category[]>(DEMO_CATEGORIES);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(DEMO_MENU_ITEMS);
  const [isLoading, setIsLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Load data from Supabase or demo
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    if (isSupabaseConfigured && supabase) {
      try {
        // Load restaurant
        const { data: restData } = await supabase
          .from('restaurants')
          .select('*')
          .limit(1)
          .single();
        if (restData) setRestaurant(restData);

        // Load categories
        const { data: catData } = await supabase
          .from('categories')
          .select('*')
          .order('display_order');
        if (catData) setCategories(catData);

        // Load menu items
        const { data: itemData } = await supabase
          .from('menu_items')
          .select('*')
          .order('display_order');
        if (itemData) setMenuItems(itemData);
      } catch (err) {
        console.error('Error loading data from Supabase:', err);
        addToast('Failed to load data from database. Using demo data.', 'error');
      }
    } else {
      // Use demo data — also check localStorage for any saved changes
      const savedItems = localStorage.getItem('demo_menu_items');
      const savedCategories = localStorage.getItem('demo_categories');
      const savedRestaurant = localStorage.getItem('demo_restaurant');
      if (savedItems) setMenuItems(JSON.parse(savedItems));
      if (savedCategories) setCategories(JSON.parse(savedCategories));
      if (savedRestaurant) setRestaurant(JSON.parse(savedRestaurant));
    }
    setIsLoading(false);
  }

  // Persist demo data to localStorage
  function persistDemo(items?: MenuItem[], cats?: Category[], rest?: Restaurant) {
    if (!isSupabaseConfigured) {
      if (items) localStorage.setItem('demo_menu_items', JSON.stringify(items));
      if (cats) localStorage.setItem('demo_categories', JSON.stringify(cats));
      if (rest) localStorage.setItem('demo_restaurant', JSON.stringify(rest));
    }
  }

  // ── Toast management ──
  const addToast = useCallback((message: string, type: Toast['type']) => {
    const id = generateId();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ── Restaurant ──
  async function updateRestaurant(data: Partial<Restaurant>) {
    const updated = { ...restaurant, ...data, updated_at: new Date().toISOString() };
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('restaurants').update(data).eq('id', restaurant.id);
      if (error) { addToast('Failed to update restaurant.', 'error'); return; }
    }
    setRestaurant(updated);
    persistDemo(undefined, undefined, updated);
    addToast('Restaurant profile updated!', 'success');
  }

  // ── Categories ──
  async function addCategory(name: string): Promise<Category | null> {
    const newCat: Category = {
      id: generateId(),
      restaurant_id: restaurant.id,
      name,
      display_order: categories.length + 1,
      created_at: new Date().toISOString(),
    };
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('categories').insert(newCat).select().single();
      if (error) {
        console.error('Failed to add category:', error);
        addToast(`Failed to add category: ${error.message}`, 'error');
        return null;
      }
      if (data) newCat.id = data.id;
    }
    const updated = [...categories, newCat];
    setCategories(updated);
    persistDemo(undefined, updated);
    addToast(`Category "${name}" added!`, 'success');
    return newCat;
  }

  async function ensureCategory(name: string): Promise<string> {
    const existing = categories.find((c) => c.name.trim().toLowerCase() === name.trim().toLowerCase());
    if (existing) return existing.id;
    const created = await addCategory(name);
    return created ? created.id : '';
  }

  async function updateCategory(id: string, name: string) {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('categories').update({ name }).eq('id', id);
      if (error) { addToast('Failed to update category.', 'error'); return; }
    }
    const updated = categories.map((c) => (c.id === id ? { ...c, name } : c));
    setCategories(updated);
    persistDemo(undefined, updated);
    addToast('Category updated!', 'success');
  }

  async function deleteCategory(id: string): Promise<{ success: boolean; error?: string }> {
    const itemsInCategory = menuItems.filter((item) => item.category_id === id);
    if (itemsInCategory.length > 0) {
      return {
        success: false,
        error: `This category has ${itemsInCategory.length} menu item(s). Please reassign or delete them first.`,
      };
    }
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) { addToast('Failed to delete category.', 'error'); return { success: false, error: error.message }; }
    }
    const updated = categories.filter((c) => c.id !== id);
    setCategories(updated);
    persistDemo(undefined, updated);
    addToast('Category deleted.', 'success');
    return { success: true };
  }

  async function reorderCategories(reordered: Category[]) {
    const updated = reordered.map((c, i) => ({ ...c, display_order: i + 1 }));
    setCategories(updated);
    persistDemo(undefined, updated);
    if (isSupabaseConfigured && supabase) {
      for (const cat of updated) {
        await supabase.from('categories').update({ display_order: cat.display_order }).eq('id', cat.id);
      }
    }
  }

  // ── Menu Items ──
  async function addMenuItem(data: MenuItemFormData) {
    const newItem: MenuItem = {
      id: generateId(),
      restaurant_id: restaurant.id,
      ...data,
      display_order: menuItems.length + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    if (isSupabaseConfigured && supabase) {
      const { data: inserted, error } = await supabase.from('menu_items').insert(newItem).select().single();
      if (error) {
        console.error('Failed to add menu item:', error);
        addToast(`Failed to add menu item: ${error.message}`, 'error');
        return;
      }
      if (inserted) newItem.id = inserted.id;
    }
    const updated = [...menuItems, newItem];
    setMenuItems(updated);
    persistDemo(updated);
    addToast(`"${data.name}" added to menu!`, 'success');
  }

  async function updateMenuItem(id: string, data: Partial<MenuItemFormData>) {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('menu_items').update({ ...data, updated_at: new Date().toISOString() }).eq('id', id);
      if (error) { addToast('Failed to update menu item.', 'error'); return; }
    }
    const updated = menuItems.map((item) =>
      item.id === id ? { ...item, ...data, updated_at: new Date().toISOString() } : item
    );
    setMenuItems(updated);
    persistDemo(updated);
    addToast('Menu item updated!', 'success');
  }

  async function deleteMenuItem(id: string) {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('menu_items').delete().eq('id', id);
      if (error) { addToast('Failed to delete menu item.', 'error'); return; }
    }
    const updated = menuItems.filter((item) => item.id !== id);
    setMenuItems(updated);
    persistDemo(updated);
    addToast('Menu item deleted.', 'success');
  }

  return (
    <DataContext.Provider
      value={{
        restaurant,
        categories,
        menuItems,
        isLoading,
        toasts,
        updateRestaurant,
        addCategory,
        updateCategory,
        deleteCategory,
        reorderCategories,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        ensureCategory,
        addToast,
        removeToast,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}

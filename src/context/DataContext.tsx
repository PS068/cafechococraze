import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import type { Restaurant, Category, MenuItem, MenuItemFormData, Toast } from '../types';
import {
  CAFE_CHOCO_CRAZE_RESTAURANT,
  CAFE_CHOCO_CRAZE_CATEGORIES,
  CAFE_CHOCO_CRAZE_MENU_ITEMS,
} from '../data/cafeChocoCrazeData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { sanitizeCulinaryLabels } from '../lib/menuVariants';

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

function toValidUuidOrNull(str?: string | null): string | null {
  if (!str) return null;
  const trimmed = str.trim();
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(trimmed) ? trimmed : null;
}

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

const RESTAURANT_STORAGE_KEY = 'cafe_restaurant_overrides';
const MENU_ITEMS_STORAGE_KEY = 'cafe_menu_items_overrides';
const CATEGORIES_STORAGE_KEY = 'cafe_categories_overrides';

function getPersistedRestaurant(base: Restaurant): Restaurant {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(RESTAURANT_STORAGE_KEY) : null;
    if (!raw) return base;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return base;

    return {
      ...base,
      ...parsed,
      theme_preferences: {
        ...(base.theme_preferences || {}),
        ...(parsed.theme_preferences || {}),
      },
    };
  } catch {
    return base;
  }
}

function getPersistedCategories(base: Category[]): Category[] {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(CATEGORIES_STORAGE_KEY) : null;
    if (!raw) return base;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : base;
  } catch {
    return base;
  }
}

function getPersistedMenuItems(base: MenuItem[]): MenuItem[] {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(MENU_ITEMS_STORAGE_KEY) : null;
    if (!raw) return base;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : base;
  } catch {
    return base;
  }
}

function mergeWithLocalMenuItemOverrides(dbItems: MenuItem[]): MenuItem[] {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(MENU_ITEMS_STORAGE_KEY) : null;
    if (!raw) return dbItems;
    const localOverrides = JSON.parse(raw) as MenuItem[];
    if (!Array.isArray(localOverrides) || localOverrides.length === 0) return dbItems;

    const localMap = new Map<string, MenuItem>(localOverrides.map((i) => [i.id, i]));
    const mergedDbItems = dbItems.map((dbItem) => {
      const local = localMap.get(dbItem.id);
      if (!local) return dbItem;
      return { ...dbItem, ...local };
    });

    const dbIds = new Set(dbItems.map((i) => i.id));
    const extraLocalItems = localOverrides.filter((i) => !dbIds.has(i.id));

    return [...mergedDbItems, ...extraLocalItems];
  } catch {
    return dbItems;
  }
}

function savePersistedMenuItems(items: MenuItem[]) {
  try {
    localStorage.setItem(MENU_ITEMS_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.warn('Failed to save menu items to localStorage:', e);
  }
}

function savePersistedCategories(cats: Category[]) {
  try {
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(cats));
  } catch (e) {
    console.warn('Failed to save categories to localStorage:', e);
  }
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [restaurant, setRestaurant] = useState<Restaurant>(() =>
    getPersistedRestaurant(CAFE_CHOCO_CRAZE_RESTAURANT)
  );
  const [categories, setCategories] = useState<Category[]>(() =>
    getPersistedCategories(CAFE_CHOCO_CRAZE_CATEGORIES)
  );
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() =>
    getPersistedMenuItems(CAFE_CHOCO_CRAZE_MENU_ITEMS)
  );
  // Instant render: already preloaded with offline/cached menu data
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Track the reliable restaurant id for queries and foreign keys
  const restaurantIdRef = useRef<string>('');

  // ── Load data from Supabase on mount (background sync) ──
  useEffect(() => {
    loadData();
  }, []);

  // ── Sync changes across browser tabs ──
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === RESTAURANT_STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed && typeof parsed === 'object') {
            setRestaurant((prev) => ({
              ...prev,
              ...parsed,
              theme_preferences: {
                ...(prev.theme_preferences || {}),
                ...(parsed.theme_preferences || {}),
              },
            }));
          }
        } catch {}
      } else if (e.key === MENU_ITEMS_STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setMenuItems(parsed);
          }
        } catch {}
      } else if (e.key === CATEGORIES_STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setCategories(parsed);
          }
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // ── Supabase Realtime: subscribe to live changes ──
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    const channel = supabase.channel('menu-realtime');

    // --- Restaurants ---
    channel.on(
      'postgres_changes' as any,
      { event: '*', schema: 'public', table: 'restaurants' },
      (payload: any) => {
        if (payload.eventType === 'UPDATE' && payload.new) {
          const resolvedName =
            payload.new.name && !payload.new.name.toLowerCase().includes('sangli')
              ? `${payload.new.name} Sangli`
              : (payload.new.name || CAFE_CHOCO_CRAZE_RESTAURANT.name);
          const resolvedLogo =
            !payload.new.logo_url || payload.new.logo_url.includes('photo-1554118811-1e0d58224f24')
              ? CAFE_CHOCO_CRAZE_RESTAURANT.logo_url
              : payload.new.logo_url;
          const resolvedAddress =
            !payload.new.address || payload.new.address.includes('Main Road')
              ? CAFE_CHOCO_CRAZE_RESTAURANT.address
              : payload.new.address;
          const resolvedPhone =
            !payload.new.phone || payload.new.phone.includes('98765')
              ? '9850568355'
              : payload.new.phone;
          const resolvedHours =
            !payload.new.opening_hours || payload.new.opening_hours.includes('10:00 AM – 11:30 PM')
              ? '12:00 PM – 9:30 PM · Tue Closed'
              : payload.new.opening_hours;
          setRestaurant((prev) => ({
            ...prev,
            ...payload.new,
            name: resolvedName,
            logo_url: resolvedLogo,
            address: resolvedAddress,
            phone: resolvedPhone,
            opening_hours: resolvedHours,
          }));
        }
      }
    );

    // --- Categories ---
    channel.on(
      'postgres_changes' as any,
      { event: '*', schema: 'public', table: 'categories' },
      (payload: any) => {
        if (payload.eventType === 'INSERT' && payload.new) {
          setCategories((prev) => {
            if (prev.some((c) => c.id === payload.new.id)) return prev;
            return [...prev, payload.new as Category].sort(
              (a, b) => a.display_order - b.display_order
            );
          });
        } else if (payload.eventType === 'UPDATE' && payload.new) {
          setCategories((prev) =>
            prev
              .map((c) => (c.id === payload.new.id ? { ...c, ...payload.new } : c))
              .sort((a, b) => a.display_order - b.display_order)
          );
        } else if (payload.eventType === 'DELETE' && payload.old) {
          setCategories((prev) => prev.filter((c) => c.id !== payload.old.id));
        }
      }
    );

    // --- Menu Items ---
    channel.on(
      'postgres_changes' as any,
      { event: '*', schema: 'public', table: 'menu_items' },
      (payload: any) => {
        if (payload.eventType === 'INSERT' && payload.new) {
          const newItem = {
            ...(payload.new as MenuItem),
            labels: sanitizeCulinaryLabels(payload.new.labels),
          };
          setMenuItems((prev) => {
            if (prev.some((m) => m.id === newItem.id)) return prev;
            return [...prev, newItem];
          });
        } else if (payload.eventType === 'UPDATE' && payload.new) {
          const updatedItem = {
            ...(payload.new as MenuItem),
            labels: sanitizeCulinaryLabels(payload.new.labels),
          };
          setMenuItems((prev) =>
            prev.map((m) => (m.id === updatedItem.id ? updatedItem : m))
          );
        } else if (payload.eventType === 'DELETE' && payload.old) {
          setMenuItems((prev) => prev.filter((m) => m.id !== payload.old.id));
        }
      }
    );

    channel.subscribe();

    return () => {
      supabase!.removeChannel(channel);
    };
  }, []);

  async function getEffectiveRestaurantId(): Promise<string> {
    const fromRef = toValidUuidOrNull(restaurantIdRef.current);
    if (fromRef) return fromRef;

    const fromState = toValidUuidOrNull(restaurant.id);
    if (fromState) return fromState;

    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase.from('restaurants').select('id').limit(1).maybeSingle();
      if (data?.id) {
        restaurantIdRef.current = data.id;
        return data.id;
      }
    }
    return 'a24ce60e-813d-4662-ade1-177fb45c7a10';
  }

  async function loadData() {
    if (!isSupabaseConfigured || !supabase) {
      return;
    }

    try {
      // Fetch restaurant, categories, and menu items concurrently in parallel
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Supabase fetch timeout')), 3500)
      );

      const fetchPromise = Promise.all([
        supabase.from('restaurants').select('*').limit(1).maybeSingle(),
        supabase.from('categories').select('*').order('display_order'),
        supabase.from('menu_items').select('*').order('display_order'),
      ]);

      const [restRes, catRes, itemRes] = (await Promise.race([fetchPromise, timeoutPromise])) as [
        any,
        any,
        any,
      ];

      // 1. Process restaurant
      if (restRes?.data) {
        const restData = restRes.data;
        const resolvedName =
          restData.name && !restData.name.toLowerCase().includes('sangli')
            ? `${restData.name} Sangli`
            : restData.name || CAFE_CHOCO_CRAZE_RESTAURANT.name;
        const resolvedLogo =
          !restData.logo_url || restData.logo_url.includes('photo-1554118811-1e0d58224f24')
            ? CAFE_CHOCO_CRAZE_RESTAURANT.logo_url
            : restData.logo_url;
        const resolvedAddress =
          !restData.address || restData.address.includes('Main Road')
            ? CAFE_CHOCO_CRAZE_RESTAURANT.address
            : restData.address;
        const resolvedPhone =
          !restData.phone || restData.phone.includes('98765')
            ? '9850568355'
            : restData.phone;
        const resolvedHours =
          !restData.opening_hours || restData.opening_hours.includes('10:00 AM – 11:30 PM')
            ? '12:00 PM – 9:30 PM · Tue Closed'
            : restData.opening_hours;

        const dbRestaurant: Restaurant = {
          ...restData,
          name: resolvedName,
          logo_url: resolvedLogo,
          address: resolvedAddress,
          phone: resolvedPhone,
          opening_hours: resolvedHours,
        };

        setRestaurant(getPersistedRestaurant(dbRestaurant));
        restaurantIdRef.current = restData.id;
      }

      // 2. Process categories
      if (catRes?.data && catRes.data.length > 0) {
        setCategories(catRes.data);
      }

      // 3. Process menu items
      if (itemRes?.data && itemRes.data.length > 0) {
        const cleaned = itemRes.data.map((item: any) => ({
          ...item,
          labels: sanitizeCulinaryLabels(item.labels),
        }));
        const merged = mergeWithLocalMenuItemOverrides(cleaned);
        setMenuItems(merged);
      }
    } catch (err) {
      // Non-blocking: defaults and cached data already rendered
      console.warn('Background sync note:', err);
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
    const restId = await getEffectiveRestaurantId();
    const updated: Restaurant = {
      ...restaurant,
      ...data,
      id: restId,
      theme_preferences: {
        ...(restaurant.theme_preferences || {}),
        ...(data.theme_preferences || {}),
      },
      updated_at: new Date().toISOString(),
    };

    // 1. Immediately persist to localStorage so settings survive page refresh 100%
    try {
      localStorage.setItem(RESTAURANT_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save restaurant settings to localStorage:', e);
    }

    // 2. Update React state immediately
    setRestaurant(updated);

    // 3. Sync to Supabase
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('restaurants').update(data).eq('id', restId);
        if (error) {
          console.warn('Supabase restaurant update note:', error.message);
        }
      } catch (err) {
        console.warn('Supabase update failed:', err);
      }
    }

    const isProfileUpdate = Boolean(
      data.name || data.address || data.phone || data.opening_hours || data.logo_url || data.banner_url || data.description
    );
    if (isProfileUpdate) {
      addToast('Restaurant profile updated!', 'success');
    }
  }

  // ── Categories ──
  async function addCategory(name: string): Promise<Category | null> {
    const trimmedName = name.trim();
    if (!trimmedName) return null;

    const restId = await getEffectiveRestaurantId();
    const newCat: Category = {
      id: generateId(),
      restaurant_id: restId,
      name: trimmedName,
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

    setCategories((prev) => {
      const next = [...prev, newCat];
      savePersistedCategories(next);
      return next;
    });
    addToast(`Category "${trimmedName}" added!`, 'success');
    return newCat;
  }

  async function ensureCategory(name: string): Promise<string> {
    const existing = categories.find((c) => c.name.trim().toLowerCase() === name.trim().toLowerCase());
    if (existing) return existing.id;
    const created = await addCategory(name);
    return created ? created.id : '';
  }

  async function updateCategory(id: string, name: string) {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('categories').update({ name: trimmedName }).eq('id', id);
      if (error) {
        console.error('Failed to update category:', error);
        addToast(`Failed to update category: ${error.message}`, 'error');
        return;
      }
    }
    setCategories((prev) => {
      const next = prev.map((c) => (c.id === id ? { ...c, name: trimmedName } : c));
      savePersistedCategories(next);
      return next;
    });
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
      if (error) {
        console.error('Failed to delete category:', error);
        addToast(`Failed to delete category: ${error.message}`, 'error');
        return { success: false, error: error.message };
      }
    }

    setCategories((prev) => {
      const next = prev.filter((c) => c.id !== id);
      savePersistedCategories(next);
      return next;
    });
    addToast('Category deleted.', 'success');
    return { success: true };
  }

  async function reorderCategories(reordered: Category[]) {
    const updated = reordered.map((c, i) => ({ ...c, display_order: i + 1 }));
    setCategories(updated);
    savePersistedCategories(updated);

    if (isSupabaseConfigured && supabase) {
      for (const cat of updated) {
        const { error } = await supabase.from('categories').update({ display_order: cat.display_order }).eq('id', cat.id);
        if (error) {
          console.error('Failed to update category order:', error);
        }
      }
    }
  }

  // ── Menu Items ──
  async function addMenuItem(data: MenuItemFormData) {
    const restId = await getEffectiveRestaurantId();
    const resolvedCatId = toValidUuidOrNull(data.category_id);
    const newId = generateId();

    const newItem: MenuItem = {
      id: newId,
      restaurant_id: restId,
      name: data.name.trim(),
      description: data.description.trim(),
      price: Number(data.price),
      discounted_price: data.discounted_price && Number(data.discounted_price) > 0 ? Number(data.discounted_price) : null,
      category_id: resolvedCatId || '',
      image_url: data.image_url?.trim() || '',
      food_type: data.food_type || 'veg',
      is_available: data.is_available ?? true,
      is_featured: data.is_featured ?? false,
      spice_level: data.spice_level || 'none',
      labels: Array.isArray(data.labels) ? data.labels : [],
      display_order: menuItems.length + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      const dbPayload = {
        id: newItem.id,
        restaurant_id: newItem.restaurant_id,
        name: newItem.name,
        description: newItem.description,
        price: newItem.price,
        discounted_price: newItem.discounted_price,
        category_id: resolvedCatId, // valid UUID or null
        image_url: newItem.image_url,
        food_type: newItem.food_type,
        is_available: newItem.is_available,
        is_featured: newItem.is_featured,
        spice_level: newItem.spice_level,
        labels: newItem.labels,
        display_order: newItem.display_order,
      };

      const { data: inserted, error } = await supabase
        .from('menu_items')
        .insert(dbPayload)
        .select()
        .single();

      if (error) {
        console.error('Failed to add menu item:', error);
        addToast(`Failed to add menu item: ${error.message}`, 'error');
        return;
      }
      if (inserted) {
        newItem.id = inserted.id;
      }
    }

    setMenuItems((prev) => {
      const next = [...prev, newItem];
      savePersistedMenuItems(next);
      return next;
    });
    addToast(`"${newItem.name}" added to menu!`, 'success');
  }

  async function updateMenuItem(id: string, data: Partial<MenuItemFormData>) {
    const payload: Partial<MenuItem> = { ...data };
    if (data.category_id !== undefined) {
      payload.category_id = toValidUuidOrNull(data.category_id) || '';
    }
    if (data.discounted_price !== undefined) {
      payload.discounted_price = data.discounted_price && Number(data.discounted_price) > 0 ? Number(data.discounted_price) : null;
    }

    if (isSupabaseConfigured && supabase) {
      const dbPayload: Record<string, unknown> = {
        ...data,
        updated_at: new Date().toISOString(),
      };
      if (data.category_id !== undefined) {
        dbPayload.category_id = toValidUuidOrNull(data.category_id);
      }
      if (data.discounted_price !== undefined) {
        dbPayload.discounted_price = data.discounted_price && Number(data.discounted_price) > 0 ? Number(data.discounted_price) : null;
      }

      const { error } = await supabase.from('menu_items').update(dbPayload).eq('id', id);
      if (error) {
        console.error('Failed to update menu item:', error);
        addToast(`Failed to update menu item: ${error.message}`, 'error');
        return;
      }
    }

    setMenuItems((prev) => {
      const next = prev.map((item) =>
        item.id === id ? { ...item, ...payload, updated_at: new Date().toISOString() } : item
      );
      savePersistedMenuItems(next);
      return next;
    });
    addToast('Menu item updated!', 'success');
  }

  async function deleteMenuItem(id: string) {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('menu_items').delete().eq('id', id);
      if (error) {
        console.error('Failed to delete menu item:', error);
        addToast(`Failed to delete menu item: ${error.message}`, 'error');
        return;
      }
    }
    setMenuItems((prev) => {
      const next = prev.filter((item) => item.id !== id);
      savePersistedMenuItems(next);
      return next;
    });
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

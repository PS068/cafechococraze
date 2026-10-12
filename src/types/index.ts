// ═══════════════════════════════════════════════════════
// Type definitions for The Spice House digital menu
// ═══════════════════════════════════════════════════════

export type FoodType = 'veg' | 'nonveg' | 'none';
export type SpiceLevel = 'mild' | 'medium' | 'hot' | 'extra_hot' | 'none';

export interface Restaurant {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  logo_url: string;
  banner_url: string;
  tagline: string;
  description: string;
  address: string;
  phone: string;
  opening_hours: string;
  cuisine_type: string;
  social_links: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    youtube?: string;
  };
  theme_preferences: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  restaurant_id: string;
  name: string;
  display_order: number;
  created_at: string;
}

export interface MenuItem {
  id: string;
  restaurant_id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  discounted_price: number | null;
  image_url: string;
  food_type: FoodType;
  is_available: boolean;
  is_featured: boolean;
  spice_level: SpiceLevel;
  display_order: number;
  labels: string[]; // e.g. "Popular", "Chef's Special", "New"
  created_at: string;
  updated_at: string;
}

export interface MenuItemFormData {
  name: string;
  description: string;
  price: number;
  discounted_price: number | null;
  category_id: string;
  image_url: string;
  food_type: FoodType;
  is_available: boolean;
  is_featured: boolean;
  spice_level: SpiceLevel;
  labels: string[];
}

export interface DashboardStats {
  totalItems: number;
  totalCategories: number;
  availableItems: number;
  unavailableItems: number;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

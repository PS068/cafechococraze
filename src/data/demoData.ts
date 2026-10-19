// ═══════════════════════════════════════════════════════
// Demo data for Cafe Choco Craze
// This data is used when no Supabase connection is available
// ═══════════════════════════════════════════════════════

import {
  CAFE_CHOCO_CRAZE_RESTAURANT,
  CAFE_CHOCO_CRAZE_CATEGORIES,
  CAFE_CHOCO_CRAZE_MENU_ITEMS,
} from './cafeChocoCrazeData';

export const DEMO_RESTAURANT = CAFE_CHOCO_CRAZE_RESTAURANT;
export const DEMO_CATEGORIES = CAFE_CHOCO_CRAZE_CATEGORIES;
export const DEMO_MENU_ITEMS = CAFE_CHOCO_CRAZE_MENU_ITEMS;

// Demo admin credentials — FOR DEVELOPMENT ONLY
// In production, use Supabase auth
export const DEMO_ADMIN = {
  email: 'admin@cafechococraze.com',
  password: 'CafeChocoCraze2024!',
};

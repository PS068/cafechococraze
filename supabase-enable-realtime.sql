-- ═══════════════════════════════════════════════════════════════
-- ENABLE SUPABASE REALTIME ON ALL TABLES
-- ═══════════════════════════════════════════════════════════════
-- Run this in your Supabase project's SQL Editor (SQL > New Query)
-- This enables live-sync: any change from admin panel will
-- instantly appear on all connected mobile devices.
-- ═══════════════════════════════════════════════════════════════

-- Enable Realtime for restaurants table
ALTER PUBLICATION supabase_realtime ADD TABLE public.restaurants;

-- Enable Realtime for categories table
ALTER PUBLICATION supabase_realtime ADD TABLE public.categories;

-- Enable Realtime for menu_items table
ALTER PUBLICATION supabase_realtime ADD TABLE public.menu_items;

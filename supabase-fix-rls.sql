-- ═════════════════════════════════════════════════════════════════
-- FIX ROW LEVEL SECURITY (RLS) & SAFE REALTIME SETUP
-- ═════════════════════════════════════════════════════════════════
-- Run this in your Supabase project's SQL Editor (SQL > New Query)
-- This script is 100% idempotent and safe to run multiple times.
-- ═════════════════════════════════════════════════════════════════

-- 1. Drop old restrictive policies if they exist
DROP POLICY IF EXISTS "Owners can manage their restaurant" ON public.restaurants;
DROP POLICY IF EXISTS "Owners can manage their categories" ON public.categories;
DROP POLICY IF EXISTS "Owners can manage their menu items" ON public.menu_items;

DROP POLICY IF EXISTS "Authenticated users can manage restaurants" ON public.restaurants;
DROP POLICY IF EXISTS "Authenticated users can manage categories" ON public.categories;
DROP POLICY IF EXISTS "Authenticated users can manage menu items" ON public.menu_items;

-- 2. Allow management for authenticated and anon/public clients
DROP POLICY IF EXISTS "Public can manage restaurants" ON public.restaurants;
CREATE POLICY "Public can manage restaurants"
ON public.restaurants FOR ALL
TO public
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Public can manage categories" ON public.categories;
CREATE POLICY "Public can manage categories"
ON public.categories FOR ALL
TO public
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Public can manage menu items" ON public.menu_items;
CREATE POLICY "Public can manage menu items"
ON public.menu_items FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- 3. Safely add tables to Realtime (skips if already added, no error)
DO $$
BEGIN
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.restaurants;
    EXCEPTION WHEN duplicate_object THEN
        -- Already in publication, safely ignore
    END;

    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.categories;
    EXCEPTION WHEN duplicate_object THEN
        -- Already in publication, safely ignore
    END;

    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.menu_items;
    EXCEPTION WHEN duplicate_object THEN
        -- Already in publication, safely ignore
    END;
END $$;

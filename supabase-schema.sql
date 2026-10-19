-- ═════════════════════════════════════════════════════════════════
-- CAFE CHOCO CRAZE - DIGITAL CAFE MENU SUPABASE SCHEMA
-- ═════════════════════════════════════════════════════════════════
-- Run this in your Supabase project's SQL Editor (SQL > New Query)
-- ═════════════════════════════════════════════════════════════════

-- 1. Restaurants Table
CREATE TABLE IF NOT EXISTS public.restaurants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT DEFAULT '',
    banner_url TEXT DEFAULT '',
    tagline TEXT DEFAULT '',
    description TEXT DEFAULT '',
    address TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    opening_hours TEXT DEFAULT '',
    cuisine_type TEXT DEFAULT '',
    social_links JSONB DEFAULT '{}'::jsonb,
    theme_preferences JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    display_order INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Menu Items Table
CREATE TABLE IF NOT EXISTS public.menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    price NUMERIC(10,2) NOT NULL,
    discounted_price NUMERIC(10,2) DEFAULT NULL,
    image_url TEXT DEFAULT '',
    food_type TEXT CHECK (food_type IN ('veg', 'nonveg', 'none')) DEFAULT 'veg',
    is_available BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    spice_level TEXT CHECK (spice_level IN ('mild', 'medium', 'hot', 'extra_hot', 'none')) DEFAULT 'none',
    display_order INT DEFAULT 1,
    labels TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- 5. Public Read Policies (Anyone can browse published menus without logging in)
CREATE POLICY "Public can view restaurants"
ON public.restaurants FOR SELECT
USING (true);

CREATE POLICY "Public can view categories"
ON public.categories FOR SELECT
USING (true);

CREATE POLICY "Public can view menu items"
ON public.menu_items FOR SELECT
USING (true);

-- 6. Owner Modification Policies (Only authenticated owners manage their restaurant)
CREATE POLICY "Owners can manage their restaurant"
ON public.restaurants FOR ALL
TO authenticated
USING (auth.uid() = owner_id)
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can manage their categories"
ON public.categories FOR ALL
TO authenticated
USING (EXISTS (
    SELECT 1 FROM public.restaurants r
    WHERE r.id = categories.restaurant_id AND r.owner_id = auth.uid()
))
WITH CHECK (EXISTS (
    SELECT 1 FROM public.restaurants r
    WHERE r.id = categories.restaurant_id AND r.owner_id = auth.uid()
));

CREATE POLICY "Owners can manage their menu items"
ON public.menu_items FOR ALL
TO authenticated
USING (EXISTS (
    SELECT 1 FROM public.restaurants r
    WHERE r.id = menu_items.restaurant_id AND r.owner_id = auth.uid()
))
WITH CHECK (EXISTS (
    SELECT 1 FROM public.restaurants r
    WHERE r.id = menu_items.restaurant_id AND r.owner_id = auth.uid()
));

-- 7. Indexes for Fast Queries
CREATE INDEX IF NOT EXISTS idx_restaurants_slug ON public.restaurants(slug);
CREATE INDEX IF NOT EXISTS idx_categories_restaurant_order ON public.categories(restaurant_id, display_order);
CREATE INDEX IF NOT EXISTS idx_menu_items_restaurant_cat ON public.menu_items(restaurant_id, category_id, display_order);

-- Cafe Choco Craze catalog seed
--
-- This script writes the Cafe Choco Craze menu into public.restaurants,
-- public.categories, and public.menu_items.
-- Re-running it updates the Cafe Choco Craze records instead of adding duplicates.

DO $$
DECLARE
    v_restaurant_id UUID;
    v_cat_bev_id UUID;
    v_cat_fries_id UUID;
    v_cat_san_id UUID;
    v_cat_des_id UUID;
    v_item_id UUID;
BEGIN
    INSERT INTO public.restaurants (
        name,
        slug,
        owner_id,
        logo_url,
        banner_url,
        tagline,
        description,
        address,
        phone,
        opening_hours,
        cuisine_type,
        social_links,
        theme_preferences
    ) VALUES (
        'Cafe Choco Craze',
        'cafe-choco-craze',
        NULL,
        '/cafe-choco-craze-logo.jpg',
        'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1600&q=80',
        'Delicious Cold Coffees, Thick Shakes & Cafe Bites',
        'Welcome to Cafe Choco Craze. Savor our signature thick frolic cold coffees, decadent chocolicks, handcrafted shakes, crispy seasoned fries, gourmet sandwiches, and sizzling sweet treats.',
        '100ft Road, Nishant Colony, Opposite to Military Canteen, Sangli',
        '+91 98765 43210',
        'Mon–Sun: 10:00 AM – 11:30 PM',
        'Cafe, Thick Shakes, Cold Coffee, Bites & Desserts',
        '{"instagram":"https://instagram.com/cafechococraze","facebook":"https://facebook.com/cafechococraze","twitter":"https://twitter.com/cafechococraze"}'::jsonb,
        '{"isOpen":true,"showGuestWifi":true,"wifiSsid":"Cafe_Choco_Craze_Guest","wifiPassword":"Welcome@CafeChocoCraze"}'::jsonb
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        logo_url = EXCLUDED.logo_url,
        banner_url = EXCLUDED.banner_url,
        tagline = EXCLUDED.tagline,
        description = EXCLUDED.description,
        address = EXCLUDED.address,
        phone = EXCLUDED.phone,
        opening_hours = EXCLUDED.opening_hours,
        cuisine_type = EXCLUDED.cuisine_type,
        social_links = EXCLUDED.social_links,
        theme_preferences = EXCLUDED.theme_preferences,
        updated_at = NOW()
    RETURNING id INTO v_restaurant_id;

    -- 1. Beverages Category
    SELECT id INTO v_cat_bev_id FROM public.categories WHERE restaurant_id = v_restaurant_id AND name LIKE 'Beverages%' LIMIT 1;
    IF v_cat_bev_id IS NULL THEN
        INSERT INTO public.categories (restaurant_id, name, display_order) VALUES (v_restaurant_id, 'Beverages (18)', 1) RETURNING id INTO v_cat_bev_id;
    ELSE
        UPDATE public.categories SET name = 'Beverages (18)', display_order = 1 WHERE id = v_cat_bev_id;
    END IF;

    -- 2. Fries & Quick Bites Category
    SELECT id INTO v_cat_fries_id FROM public.categories WHERE restaurant_id = v_restaurant_id AND name = 'Fries & Quick Bites' LIMIT 1;
    IF v_cat_fries_id IS NULL THEN
        INSERT INTO public.categories (restaurant_id, name, display_order) VALUES (v_restaurant_id, 'Fries & Quick Bites', 2) RETURNING id INTO v_cat_fries_id;
    ELSE
        UPDATE public.categories SET display_order = 2 WHERE id = v_cat_fries_id;
    END IF;

    -- 3. Burgers & Sandwiches Category
    SELECT id INTO v_cat_san_id FROM public.categories WHERE restaurant_id = v_restaurant_id AND name = 'Burgers & Sandwiches' LIMIT 1;
    IF v_cat_san_id IS NULL THEN
        INSERT INTO public.categories (restaurant_id, name, display_order) VALUES (v_restaurant_id, 'Burgers & Sandwiches', 3) RETURNING id INTO v_cat_san_id;
    ELSE
        UPDATE public.categories SET display_order = 3 WHERE id = v_cat_san_id;
    END IF;

    -- 4. Waffles & Desserts Category
    SELECT id INTO v_cat_des_id FROM public.categories WHERE restaurant_id = v_restaurant_id AND name = 'Waffles & Desserts' LIMIT 1;
    IF v_cat_des_id IS NULL THEN
        INSERT INTO public.categories (restaurant_id, name, display_order) VALUES (v_restaurant_id, 'Waffles & Desserts', 4) RETURNING id INTO v_cat_des_id;
    ELSE
        UPDATE public.categories SET display_order = 4 WHERE id = v_cat_des_id;
    END IF;

    -- Remove any old restaurant items belonging to Starters, Main Course, etc.
    DELETE FROM public.menu_items
    WHERE restaurant_id = v_restaurant_id
      AND category_id NOT IN (v_cat_bev_id, v_cat_fries_id, v_cat_san_id, v_cat_des_id);

    DELETE FROM public.categories
    WHERE restaurant_id = v_restaurant_id
      AND id NOT IN (v_cat_bev_id, v_cat_fries_id, v_cat_san_id, v_cat_des_id);

END;
$$;

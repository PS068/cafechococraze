-- ═════════════════════════════════════════════════════════════════
-- UPDATE RESTAURANT ROW TO CAFE CHOCO CRAZE
-- ═════════════════════════════════════════════════════════════════
-- Run this in your Supabase project's SQL Editor (SQL > New Query)
-- ═════════════════════════════════════════════════════════════════

UPDATE public.restaurants
SET 
    name = 'Cafe Choco Craze',
    slug = 'cafe-choco-craze',
    logo_url = '/cafe-choco-craze-logo.jpg',
    banner_url = 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1600&q=80',
    tagline = 'Delicious Cold Coffees, Thick Shakes & Cafe Bites',
    description = 'Welcome to Cafe Choco Craze. Savor our signature thick frolic cold coffees, decadent chocolicks, handcrafted shakes, crispy seasoned fries, gourmet sandwiches, and sizzling sweet treats.',
    address = '100ft Road, Nishant Colony, Opposite to Military Canteen, Sangli',
    phone = '9850568355',
    opening_hours = '12:00 PM – 9:30 PM · Tue Closed',
    cuisine_type = 'Cafe, Thick Shakes, Cold Coffee, Bites & Desserts',
    social_links = '{"instagram":"https://instagram.com/cafechococraze","facebook":"https://facebook.com/cafechococraze","twitter":"https://twitter.com/cafechococraze"}'::jsonb,
    theme_preferences = '{"isOpen":true,"taxNote":"All prices are inclusive of applicable taxes & GST","wifiSsid":"Cafe_Choco_Craze_Guest","menuLayout":"grid","pauseNotice":"Kitchen is busy crafting fresh shakes! Accepting orders shortly.","soundAlerts":true,"showChefTags":true,"wifiPassword":"Welcome@CafeChocoCraze","showGuestWifi":true,"vibrateAlerts":true,"currencySymbol":"₹","hideOutOfStock":false,"showSpiceLevel":false,"managerWhatsapp":"+91 9850568355","enableCallWaiter":false,"showDietaryBadges":true}'::jsonb,
    updated_at = NOW()
WHERE id = 'a24ce60e-813d-4662-ade1-177fb45c7a10';

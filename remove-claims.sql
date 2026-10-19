-- Run this in your Supabase SQL Editor to permanently remove medical/dietary claim badges from the database:
UPDATE public.menu_items
SET labels = array_remove(array_remove(labels, 'FODMAP Friendly'), 'Dairy Free')
WHERE labels && ARRAY['FODMAP Friendly', 'Dairy Free'];

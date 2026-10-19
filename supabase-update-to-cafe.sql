-- ═════════════════════════════════════════════════════════════════
-- CAFE CHOCO CRAZE — FULL MENU MIGRATION
-- Replaces all existing categories and items with the real menu.
-- Run in Supabase SQL Editor → New Query → Run
-- ═════════════════════════════════════════════════════════════════

DO $$
DECLARE
    v_rid  UUID := 'a24ce60e-813d-4662-ade1-177fb45c7a10';

    -- Category IDs
    v_pizza   UUID := gen_random_uuid();
    v_pasta   UUID := gen_random_uuid();
    v_sand    UUID := gen_random_uuid();
    v_maggi   UUID := gen_random_uuid();
    v_dessert UUID := gen_random_uuid();
    v_coffee  UUID := gen_random_uuid();
    v_shakes  UUID := gen_random_uuid();
    v_choco   UUID := gen_random_uuid();
    v_momos   UUID := gen_random_uuid();
    v_burger  UUID := gen_random_uuid();
    v_fries   UUID := gen_random_uuid();
    v_combo   UUID := gen_random_uuid();
BEGIN

    -- ── 1. Wipe existing data ──
    DELETE FROM public.menu_items  WHERE restaurant_id = v_rid;
    DELETE FROM public.categories  WHERE restaurant_id = v_rid;

    -- ── 2. Categories ──
    INSERT INTO public.categories (id, restaurant_id, name, display_order) VALUES
      (v_pizza,   v_rid, '🍕 Pizza',               1),
      (v_pasta,   v_rid, '🍝 Pasta',               2),
      (v_sand,    v_rid, '🥪 Sandwiches',          3),
      (v_maggi,   v_rid, '🍜 Maggi',               4),
      (v_dessert, v_rid, '🍮 Desserts',             5),
      (v_coffee,  v_rid, '☕ Thick Cold Coffee',   6),
      (v_shakes,  v_rid, '🥛 Milkshakes',          7),
      (v_choco,   v_rid, '🍫 Chocolicks',          8),
      (v_momos,   v_rid, '🥟 Momos',               9),
      (v_burger,  v_rid, '🍔 Burgers',             10),
      (v_fries,   v_rid, '🍟 Fries',               11),
      (v_combo,   v_rid, '🎁 CCC Special Combos',  12);

    -- ══════════════════════════════════════════
    -- 🍕  PIZZA
    -- ══════════════════════════════════════════
    INSERT INTO public.menu_items
        (restaurant_id,category_id,name,description,price,discounted_price,image_url,food_type,is_available,is_featured,spice_level,display_order,labels)
    VALUES
    (v_rid,v_pizza,'Veg Simply Pizza [Regular, 6 inches]','Tomato, onion.',120,NULL,'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80','veg',TRUE,FALSE,'none',1,ARRAY[]::text[]),
    (v_rid,v_pizza,'Veg Simply Pizza [Medium, 8 inches]','Tomato and onion.',170,NULL,'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80','veg',TRUE,FALSE,'none',2,ARRAY[]::text[]),
    (v_rid,v_pizza,'Veg Spicy Pizza [Regular, 6 inches]','Onion, tomato, green chilli.',140,NULL,'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80','veg',TRUE,FALSE,'hot',3,ARRAY['Spicy']),
    (v_rid,v_pizza,'Veg Spicy Pizza [Medium, 8 inches]','Onion, tomato and green chilli.',170,NULL,'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80','veg',TRUE,FALSE,'hot',4,ARRAY['Spicy']),
    (v_rid,v_pizza,'Jain Pizza [Regular, 6 inches]','Tomato, capsicum.',140,NULL,'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80','veg',TRUE,FALSE,'none',5,ARRAY['Jain']),
    (v_rid,v_pizza,'Jain Pizza [Medium, 8 inches]','Tomato and capsicum.',170,NULL,'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80','veg',TRUE,FALSE,'none',6,ARRAY['Jain']),
    (v_rid,v_pizza,'Bhatte ke Kebab Pizza [Regular, 6 inches]','Onion, capsicum, baby corn, black olives, green olives.',180,NULL,'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=800&q=80','veg',TRUE,FALSE,'none',7,ARRAY['New']),
    (v_rid,v_pizza,'Bhatte ke Kebab Pizza [Medium, 8 inches]','Onion, capsicum, baby corn, black olives and green olives.',240,NULL,'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=800&q=80','veg',TRUE,FALSE,'none',8,ARRAY['New']),
    (v_rid,v_pizza,'Veg Cheese Pizza [Regular, 6 inches]','Onion, capsicum, tomato.',140,NULL,'https://images.unsplash.com/photo-1548369937-47519962c11a?auto=format&fit=crop&w=800&q=80','veg',TRUE,FALSE,'none',9,ARRAY[]::text[]),
    (v_rid,v_pizza,'Veg Cheese Pizza [Medium, 8 inches]','Onion, capsicum and tomato.',170,NULL,'https://images.unsplash.com/photo-1548369937-47519962c11a?auto=format&fit=crop&w=800&q=80','veg',TRUE,FALSE,'none',10,ARRAY[]::text[]),
    (v_rid,v_pizza,'Tandoori Tikka Pizza [Regular, 6 inches]','Onion, capsicum.',180,NULL,'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=800&q=80','veg',TRUE,TRUE,'medium',11,ARRAY['Popular']),
    (v_rid,v_pizza,'Tandoori Tikka Pizza [Medium, 8 inches]','Onion and capsicum.',240,NULL,'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=800&q=80','veg',TRUE,TRUE,'medium',12,ARRAY['Popular']),
    (v_rid,v_pizza,'Biryani Pizza [Regular, 6 inches]','Onion, corn, capsicum, paneer.',180,NULL,'https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=800&q=80','veg',TRUE,TRUE,'none',13,ARRAY['New','Must Try']),
    (v_rid,v_pizza,'Biryani Pizza [Medium, 8 inches]','Onion, corn, capsicum and paneer.',240,NULL,'https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=800&q=80','veg',TRUE,TRUE,'none',14,ARRAY['New','Must Try']),
    (v_rid,v_pizza,'Patthar ke Kebab Pizza [Regular, 6 inches]','Onion, capsicum, paneer, black olive.',180,NULL,'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80','veg',TRUE,FALSE,'none',15,ARRAY['New']),
    (v_rid,v_pizza,'Patthar ke Kebab Pizza [Medium, 8 inches]','Onion, capsicum, paneer and black olives.',240,NULL,'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80','veg',TRUE,FALSE,'none',16,ARRAY['New']),
    (v_rid,v_pizza,'Plain Cheese Pizza [Regular, 6 inches]','Classic plain cheese pizza.',160,NULL,'https://images.unsplash.com/photo-1604917877934-07d8d248d396?auto=format&fit=crop&w=800&q=80','veg',TRUE,FALSE,'none',17,ARRAY[]::text[]),
    (v_rid,v_pizza,'Plain Cheese Pizza [Medium, 8 inches]','Classic plain cheese pizza.',200,NULL,'https://images.unsplash.com/photo-1604917877934-07d8d248d396?auto=format&fit=crop&w=800&q=80','veg',TRUE,FALSE,'none',18,ARRAY[]::text[]),
    (v_rid,v_pizza,'Mirch Masala Pizza [Regular, 6 inches]','Onion, capsicum, tomato, chilli flakes.',170,NULL,'https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=800&q=80','veg',TRUE,FALSE,'medium',19,ARRAY['Spicy']),
    (v_rid,v_pizza,'Mirch Masala Pizza [Medium, 8 inches]','Onion, capsicum, tomato and chilli flakes.',240,NULL,'https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=800&q=80','veg',TRUE,FALSE,'medium',20,ARRAY['Spicy']),
    (v_rid,v_pizza,'Paneer El Panso Pizza [Regular, 6 inches]','Tomato, onion, capsicum, paneer and black olive.',190,NULL,'https://images.unsplash.com/photo-1600628421055-4d30de868b8f?auto=format&fit=crop&w=800&q=80','veg',TRUE,FALSE,'none',21,ARRAY[]::text[]),
    (v_rid,v_pizza,'Paneer El Panso Pizza [Medium, 8 inches]','Tomato, onion, capsicum, paneer, black olive.',240,NULL,'https://images.unsplash.com/photo-1600628421055-4d30de868b8f?auto=format&fit=crop&w=800&q=80','veg',TRUE,FALSE,'none',22,ARRAY[]::text[]),
    (v_rid,v_pizza,'Combination Pizza [Regular, 6 inches]','Tomato, onion, capsicum, mushroom, baby corn, black olive, green olive.',190,NULL,'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=800&q=80','veg',TRUE,TRUE,'none',23,ARRAY['Chef''s Special']),
    (v_rid,v_pizza,'Combination Pizza [Medium, 8 inches]','Tomato, onion, capsicum, mushroom, baby corn, black olive and green olive.',280,NULL,'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=800&q=80','veg',TRUE,TRUE,'none',24,ARRAY['Chef''s Special']),
    (v_rid,v_pizza,'Veggies Crunch Pizza [Regular, 6 inches]','Onion and capsicum.',140,NULL,'https://images.unsplash.com/photo-1566843970-c7ceda5c539e?auto=format&fit=crop&w=800&q=80','veg',TRUE,FALSE,'none',25,ARRAY[]::text[]),
    (v_rid,v_pizza,'Veggies Crunch Pizza [Medium, 8 inches]','Onion and capsicum.',180,NULL,'https://images.unsplash.com/photo-1566843970-c7ceda5c539e?auto=format&fit=crop&w=800&q=80','veg',TRUE,FALSE,'none',26,ARRAY[]::text[]);

    -- ══════════════════════════════════════════
    -- 🍝  PASTA
    -- ══════════════════════════════════════════
    INSERT INTO public.menu_items
        (restaurant_id,category_id,name,description,price,discounted_price,image_url,food_type,is_available,is_featured,spice_level,display_order,labels)
    VALUES
    (v_rid,v_pasta,'Red Pasta','Rich and tangy red sauce pasta loaded with herbs, fresh veggies and spices.',210,NULL,'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=800&q=80','veg',TRUE,FALSE,'none',1,ARRAY['Popular']),
    (v_rid,v_pasta,'White Cheese Pasta','Creamy, cheesy and deliciously rich white sauce pasta, loaded with flavorful herbs.',210,NULL,'https://images.unsplash.com/photo-1612182397702-f9e22a8fd5b3?auto=format&fit=crop&w=800&q=80','veg',TRUE,TRUE,'none',2,ARRAY['Bestseller']);

    -- ══════════════════════════════════════════
    -- 🥪  SANDWICHES
    -- ══════════════════════════════════════════
    INSERT INTO public.menu_items
        (restaurant_id,category_id,name,description,price,discounted_price,image_url,food_type,is_available,is_featured,spice_level,display_order,labels)
    VALUES
    (v_rid,v_sand,'Veg Grilled Sandwich','Classic crispy grilled sandwich loaded with fresh vegetables.',110,NULL,'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80','veg',TRUE,FALSE,'none',1,ARRAY['Popular']),
    (v_rid,v_sand,'Cheese Grilled Sandwich','A crispy, golden grilled sandwich filled with melted cheese, fresh veggies and flavorful seasoning.',110,NULL,'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&q=80','veg',TRUE,FALSE,'none',2,ARRAY['Popular']),
    (v_rid,v_sand,'Veg Cheese Grilled Sandwich','Golden grilled sandwich with cheese and fresh vegetables.',130,NULL,'https://images.unsplash.com/photo-1554433607-66b5bbe8d88c?auto=format&fit=crop&w=800&q=80','veg',TRUE,FALSE,'none',3,ARRAY[]::text[]),
    (v_rid,v_sand,'Zoom Cheese Grilled Sandwich','Extra cheesy grilled sandwich with a flavour boost.',140,NULL,'https://images.unsplash.com/photo-1619740455993-9d622770ef59?auto=format&fit=crop&w=800&q=80','veg',TRUE,FALSE,'none',4,ARRAY[]::text[]),
    (v_rid,v_sand,'Chilli Cheese Grilled Sandwich','Spicy chilli and cheese grilled sandwich.',140,NULL,'https://images.unsplash.com/photo-1481070555726-e2ead28167e5?auto=format&fit=crop&w=800&q=80','veg',TRUE,FALSE,'medium',5,ARRAY['Spicy']),
    (v_rid,v_sand,'Spicy Mayonnaise Cheese Grilled Sandwich','Grilled sandwich with spicy mayo and melted cheese.',140,NULL,'https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&w=800&q=80','veg',TRUE,FALSE,'medium',6,ARRAY['Spicy']),
    (v_rid,v_sand,'Veg Corn Cheese Grilled Sandwich','Grilled sandwich packed with sweet corn and melted cheese.',150,NULL,'https://images.unsplash.com/photo-1528736235302-52922df5c122?auto=format&fit=crop&w=800&q=80','veg',TRUE,FALSE,'none',7,ARRAY[]::text[]);

    -- ══════════════════════════════════════════
    -- 🍜  MAGGI
    -- ══════════════════════════════════════════
    INSERT INTO public.menu_items
        (restaurant_id,category_id,name,description,price,discounted_price,image_url,food_type,is_available,is_featured,spice_level,display_order,labels)
    VALUES
    (v_rid,v_maggi,'Plain Maggi','Classic Maggi noodles cooked to perfection.',70,NULL,'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=800&q=80','veg',TRUE,FALSE,'none',1,ARRAY[]::text[]),
    (v_rid,v_maggi,'Cheese Maggi','Creamy cheesy Maggi noodles.',80,NULL,'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80','veg',TRUE,FALSE,'none',2,ARRAY['Popular']),
    (v_rid,v_maggi,'Masala Maggi','Spicy masala Maggi noodles with aromatic spices.',100,NULL,'https://images.unsplash.com/photo-1585325701956-60dd9c8553bc?auto=format&fit=crop&w=800&q=80','veg',TRUE,FALSE,'medium',3,ARRAY['Spicy']);

    -- ══════════════════════════════════════════
    -- 🍮  DESSERTS
    -- ══════════════════════════════════════════
    INSERT INTO public.menu_items
        (restaurant_id,category_id,name,description,price,discounted_price,image_url,food_type,is_available,is_featured,spice_level,display_order,labels)
    VALUES
    (v_rid,v_dessert,'Choco Toast','Crispy toast topped with rich chocolate sauce.',90,NULL,'https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=800&q=80','veg',TRUE,FALSE,'none',1,ARRAY[]::text[]),
    (v_rid,v_dessert,'Chocolate Pizza [8 inches]','Choco paste, choco crush, choco chips, choco crunch, chocolate coated and butterscotch nuts.',200,NULL,'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=800&q=80','veg',TRUE,TRUE,'none',2,ARRAY['Bestseller']);

    -- ══════════════════════════════════════════
    -- ☕  THICK COLD COFFEE
    -- ══════════════════════════════════════════
    INSERT INTO public.menu_items
        (restaurant_id,category_id,name,description,price,discounted_price,image_url,food_type,is_available,is_featured,spice_level,display_order,labels)
    VALUES
    (v_rid,v_coffee,'Yummy Frolic Thick Cold Coffee','Our classic ultra-thick, creamy cold coffee brewed with premium Arabica beans, churned to velvety chilled perfection.',65,NULL,'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=80','veg',TRUE,TRUE,'none',1,ARRAY['Bestseller']),
    (v_rid,v_coffee,'Frolic with Crush Thick Cold Coffee','A rich and creamy thick cold coffee blended to perfection, topped with a delightful fruit crush.',75,NULL,'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80','veg',TRUE,FALSE,'none',2,ARRAY[]::text[]),
    (v_rid,v_coffee,'Crusher Frolic Thick Cold Coffee','Extra-thick cold coffee with crushed ice blend for an intense chill.',85,NULL,'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80','veg',TRUE,FALSE,'none',3,ARRAY[]::text[]),
    (v_rid,v_coffee,'Crunchy Frolic Thick Cold Coffee','Signature thick-churned cold coffee crowned with crackling roasted choco crisps and rich chocolate drizzle.',85,NULL,'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80','veg',TRUE,TRUE,'none',4,ARRAY['Signature Craze']),
    (v_rid,v_coffee,'Dark Choco Frolic Thick Cold Coffee','Bold dark chocolate meets thick cold coffee in this intense, indulgent fusion.',90,NULL,'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80','veg',TRUE,FALSE,'none',5,ARRAY[]::text[]),
    (v_rid,v_coffee,'Oreo Frolic Thick Cold Coffee','Thick cold coffee blended with crushed Oreo cookies and chocolate sauce.',110,NULL,'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=800&q=80','veg',TRUE,TRUE,'none',6,ARRAY['Popular']);

    -- ══════════════════════════════════════════
    -- 🥛  MILKSHAKES
    -- ══════════════════════════════════════════
    INSERT INTO public.menu_items
        (restaurant_id,category_id,name,description,price,discounted_price,image_url,food_type,is_available,is_featured,spice_level,display_order,labels)
    VALUES
    (v_rid,v_shakes,'Vanilla Shake','Timeless velvety milkshake infused with aromatic natural vanilla bean extract and smooth dairy richness.',90,NULL,'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=800&q=80','veg',TRUE,FALSE,'none',1,ARRAY['Classic']),
    (v_rid,v_shakes,'Pista Shake','Royal emerald pistachio cream shake prepared with roasted California pistachios and delicate saffron notes.',100,NULL,'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80','veg',TRUE,FALSE,'none',2,ARRAY[]::text[]),
    (v_rid,v_shakes,'Butterscotch Shake','Smooth caramelized butterscotch shake loaded with crunchy golden toffee praline bits and butter caramel swirl.',120,NULL,'https://images.unsplash.com/photo-1582293041079-7814c2f12063?auto=format&fit=crop&w=800&q=80','veg',TRUE,FALSE,'none',3,ARRAY['Popular']),
    (v_rid,v_shakes,'Mango Shake','Sumptuous golden Alphonso mango shake crafted with luscious fruit pulp and chilled sweet indulgence.',130,NULL,'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80','veg',TRUE,TRUE,'none',4,ARRAY['Must Try']),
    (v_rid,v_shakes,'Dark Choco Fantasy Shake','Deep, intense dark chocolate blended into an ultra-thick shake with bittersweet chocolate fudge ribbons.',150,NULL,'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80','veg',TRUE,TRUE,'none',5,ARRAY['Bestseller']),
    (v_rid,v_shakes,'KitKat Shake','Crisp layered wafer KitKat pieces blended into silky milk chocolate ganache.',150,NULL,'https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&w=800&q=80','veg',TRUE,FALSE,'none',6,ARRAY['Popular']),
    (v_rid,v_shakes,'Oreo Shake','Thick cookies-and-cream shake loaded with crushed Oreo cookies and chocolate syrup.',150,NULL,'https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&w=800&q=80','veg',TRUE,FALSE,'none',7,ARRAY[]::text[]);

    -- ══════════════════════════════════════════
    -- 🍫  CHOCOLICKS
    -- ══════════════════════════════════════════
    INSERT INTO public.menu_items
        (restaurant_id,category_id,name,description,price,discounted_price,image_url,food_type,is_available,is_featured,spice_level,display_order,labels)
    VALUES
    (v_rid,v_choco,'Chocolick B','A thick cold coffee, blended to perfection with a delightful chocolatey twist.',110,NULL,'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80','veg',TRUE,FALSE,'none',1,ARRAY[]::text[]),
    (v_rid,v_choco,'Chocolick M','Rich medium chocolick with intense cocoa and creamy blend.',120,NULL,'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=800&q=80','veg',TRUE,FALSE,'none',2,ARRAY[]::text[]),
    (v_rid,v_choco,'Crunch Chocolick','Chocolick with a satisfying crunch — chocolate crisps and cocoa sprinkles.',120,NULL,'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=800&q=80','veg',TRUE,TRUE,'none',3,ARRAY['Popular']),
    (v_rid,v_choco,'Nut Yum Chocolick','Dense melted chocolate blend packed with roasted crushed hazelnuts, almonds and thick cocoa ganache.',120,NULL,'https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&w=800&q=80','veg',TRUE,TRUE,'none',4,ARRAY['Chef''s Special','Signature']),
    (v_rid,v_choco,'KitKat Chocolick','Crisp layered wafer KitKat blended into silky milk chocolate ganache with chocolate crisps.',120,NULL,'https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&w=800&q=80','veg',TRUE,FALSE,'none',5,ARRAY['Popular']);

    -- ══════════════════════════════════════════
    -- 🥟  MOMOS
    -- ══════════════════════════════════════════
    INSERT INTO public.menu_items
        (restaurant_id,category_id,name,description,price,discounted_price,image_url,food_type,is_available,is_featured,spice_level,display_order,labels)
    VALUES
    (v_rid,v_momos,'Veg Momos [6 Pieces]','Premium golden-fried veggie momos, served with spicy chutney.',129,NULL,'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?auto=format&fit=crop&w=800&q=80','veg',TRUE,FALSE,'none',1,ARRAY['Premium Fried']),
    (v_rid,v_momos,'Paneer Peri Peri Momos [6 Pieces]','Fried momos stuffed with spiced cottage cheese and tossed in tangy peri peri sauce.',139,NULL,'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80','veg',TRUE,TRUE,'medium',2,ARRAY['Bestseller','Spicy','Premium Fried']);

    -- ══════════════════════════════════════════
    -- 🍔  BURGERS
    -- ══════════════════════════════════════════
    INSERT INTO public.menu_items
        (restaurant_id,category_id,name,description,price,discounted_price,image_url,food_type,is_available,is_featured,spice_level,display_order,labels)
    VALUES
    (v_rid,v_burger,'Plain Veg Burger','Classic vegetable patty burger with fresh veggies and sauce.',100,NULL,'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80','veg',TRUE,FALSE,'none',1,ARRAY[]::text[]),
    (v_rid,v_burger,'Tandoori Burger','Spiced tandoori patty burger with mint chutney and crisp lettuce.',120,NULL,'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80','veg',TRUE,TRUE,'medium',2,ARRAY['Popular','Spicy']),
    (v_rid,v_burger,'Jamaican Burger','Bold Jamaican-spiced patty burger with creamy coleslaw and tropical sauce.',120,NULL,'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=800&q=80','veg',TRUE,FALSE,'mild',3,ARRAY[]::text[]),
    (v_rid,v_burger,'Biryani Burger','Unique biryani-flavoured spiced patty burger. Veg preparation.',120,NULL,'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80','veg',TRUE,TRUE,'none',4,ARRAY['New','Must Try']),
    (v_rid,v_burger,'Veg Cheese Burger','Crispy veggie patty loaded with melted cheese, crunchy lettuce and house dressing.',120,NULL,'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=800&q=80','veg',TRUE,FALSE,'none',5,ARRAY['Bestseller']);

    -- ══════════════════════════════════════════
    -- 🍟  FRIES
    -- ══════════════════════════════════════════
    INSERT INTO public.menu_items
        (restaurant_id,category_id,name,description,price,discounted_price,image_url,food_type,is_available,is_featured,spice_level,display_order,labels)
    VALUES
    (v_rid,v_fries,'Peri Peri Fries','Crispy golden French fries tossed in spicy, tangy peri peri seasoning for an irresistible kick.',129,NULL,'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=800&q=80','veg',TRUE,TRUE,'medium',1,ARRAY['Bestseller','Spicy']),
    (v_rid,v_fries,'Tandoori Fries','Crispy golden French fries tossed in bold tandoori spice blend. Veg preparation.',129,NULL,'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=800&q=80','veg',TRUE,FALSE,'hot',2,ARRAY['Spicy']),
    (v_rid,v_fries,'French Fries','Classic golden crispy French fries. Veg preparation.',110,NULL,'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=800&q=80','veg',TRUE,FALSE,'none',3,ARRAY['Classic']);

    -- ══════════════════════════════════════════
    -- 🎁  CCC SPECIAL COMBOS
    -- ══════════════════════════════════════════
    INSERT INTO public.menu_items
        (restaurant_id,category_id,name,description,price,discounted_price,image_url,food_type,is_available,is_featured,spice_level,display_order,labels)
    VALUES
    (v_rid,v_combo,'🍔 Burger Combo','Burger + Fries + Pepsi Soft Beverage (100 ml). The perfect quick-bite trio!',129,NULL,'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=800&q=80','veg',TRUE,TRUE,'none',1,ARRAY['Combo Deal','Bestseller']),
    (v_rid,v_combo,'⭐ Combo 1 — Burger + Coffee','Plain Veg Burger + Yummy Frolic Thick Cold Coffee. Simple, satisfying and refreshing!',159,NULL,'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80','veg',TRUE,TRUE,'none',2,ARRAY['Combo Deal','Must Try']),
    (v_rid,v_combo,'⭐ Combo 2 — Sandwich + Shake','Cheese Grilled Sandwich + Vanilla Shake. A perfect cheesy & creamy pairing.',169,NULL,'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&q=80','veg',TRUE,TRUE,'none',3,ARRAY['Combo Deal','Popular']),
    (v_rid,v_combo,'🍕 Combo 4 — Pizza + Burger + Shake','Plain Cheese Pizza (Small 6") + Plain Veg Burger + Vanilla Shake. A complete meal deal!',249,NULL,'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80','veg',TRUE,TRUE,'none',4,ARRAY['Combo Deal','Chef''s Special','Best Value']),
    (v_rid,v_combo,'🍫 Combo 5 — Choco Feast','Chocolate Toast + Cheese Maggi + Yummy Frolic Cold Coffee. Indulge in the ultimate sweet & savoury treat!',249,NULL,'https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=800&q=80','veg',TRUE,TRUE,'none',5,ARRAY['Combo Deal','Must Try','Signature Craze']);

    RAISE NOTICE 'Menu migration complete!';
END $$;

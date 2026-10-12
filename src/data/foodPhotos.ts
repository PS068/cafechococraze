export interface PhotoPreset {
  id: string;
  title: string;
  category: string;
  url: string;
}

export const PHOTO_PRESETS: PhotoPreset[] = [
  // ── Curries & Gravies ──
  {
    id: 'p-butter-chicken',
    title: 'Butter Chicken / Red Gravy',
    category: 'Curries',
    url: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p-paneer-butter-masala',
    title: 'Paneer Butter Masala',
    category: 'Curries',
    url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p-dal-makhani',
    title: 'Dal Makhani / Black Lentils',
    category: 'Curries',
    url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p-palak-paneer',
    title: 'Palak Paneer / Green Spinach Gravy',
    category: 'Curries',
    url: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p-kadhai-chicken',
    title: 'Kadhai Masala Gravy',
    category: 'Curries',
    url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p-mutton-curry',
    title: 'Mutton Curry / Rogan Josh',
    category: 'Curries',
    url: 'https://images.unsplash.com/photo-1545247181-516773cae7be?auto=format&fit=crop&w=800&q=80',
  },

  // ── Tandoori & Starters ──
  {
    id: 'p-paneer-tikka',
    title: 'Paneer Tikka Platter',
    category: 'Tandoor & Starters',
    url: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p-chicken-tikka',
    title: 'Murgh Tikka Kebab',
    category: 'Tandoor & Starters',
    url: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p-crispy-wings',
    title: 'Crispy BBQ Chicken Wings',
    category: 'Tandoor & Starters',
    url: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p-spring-rolls',
    title: 'Crispy Veg Spring Rolls',
    category: 'Tandoor & Starters',
    url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p-chilli-paneer',
    title: 'Chilli Paneer / Dry Indo-Chinese',
    category: 'Tandoor & Starters',
    url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
  },

  // ── Biryani & Breads ──
  {
    id: 'p-chicken-biryani',
    title: 'Dum Chicken Biryani Pot',
    category: 'Biryani & Breads',
    url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p-veg-biryani',
    title: 'Hyderabadi Veg Dum Biryani',
    category: 'Biryani & Breads',
    url: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p-garlic-naan',
    title: 'Butter Garlic Naan',
    category: 'Biryani & Breads',
    url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p-tandoori-roti',
    title: 'Tandoori Roti / Paratha Basket',
    category: 'Biryani & Breads',
    url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
  },

  // ── Pizza, Burgers & Fast Food ──
  {
    id: 'p-pizza-margherita',
    title: 'Classic Margherita Pizza',
    category: 'Fast Food',
    url: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p-farmhouse-pizza',
    title: 'Loaded Veggie Pizza',
    category: 'Fast Food',
    url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p-burger',
    title: 'Gourmet Burger with Melted Cheese',
    category: 'Fast Food',
    url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p-french-fries',
    title: 'Golden Crispy French Fries',
    category: 'Fast Food',
    url: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p-creamy-pasta',
    title: 'Creamy Alfredo Penne Pasta',
    category: 'Fast Food',
    url: 'https://images.unsplash.com/photo-1621996346565-e3d5d628169e?auto=format&fit=crop&w=800&q=80',
  },

  // ── Desserts & Drinks ──
  {
    id: 'p-gulab-jamun',
    title: 'Hot Gulab Jamun with Pistachio',
    category: 'Desserts & Drinks',
    url: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p-sizzling-brownie',
    title: 'Sizzling Brownie with Ice Cream',
    category: 'Desserts & Drinks',
    url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p-mango-lassi',
    title: 'Mango Lassi in Clay Pot',
    category: 'Desserts & Drinks',
    url: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p-cold-coffee',
    title: 'Iced Cold Coffee with Ice Cream',
    category: 'Desserts & Drinks',
    url: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p-mojito',
    title: 'Virgin Mint Lemon Mojito',
    category: 'Desserts & Drinks',
    url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p-masala-chai',
    title: 'Kadak Masala Chai Glass',
    category: 'Desserts & Drinks',
    url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
  },
];

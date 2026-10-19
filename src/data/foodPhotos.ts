export interface PhotoPreset {
  id: string;
  title: string;
  category: string;
  url: string;
}

export const PHOTO_PRESETS: PhotoPreset[] = [
  // ── Cold Coffees & Frappes ──
  {
    id: 'p-crunchy-frolic',
    title: 'Crunchy Frolic Cold Coffee (Choco Crunch)',
    category: 'Cold Coffees & Frappes',
    url: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p-yummy-frolic',
    title: 'Yummy Frolic Thick Cold Coffee (Classic)',
    category: 'Cold Coffees & Frappes',
    url: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p-hazelnut-frappe',
    title: 'Hazelnut Iced Coffee Frappe',
    category: 'Cold Coffees & Frappes',
    url: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p-brownie-cold-coffee',
    title: 'Brownie Blast Cold Coffee Float',
    category: 'Cold Coffees & Frappes',
    url: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p-irish-cold-coffee',
    title: 'Irish Cream Velvet Cold Coffee',
    category: 'Cold Coffees & Frappes',
    url: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80',
  },

  // ── Thick Shakes & Chocolicks ──
  {
    id: 'p-nut-yum-chocolick',
    title: 'Nut Yum Hazelnut Chocolick',
    category: 'Thick Shakes & Chocolicks',
    url: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p-mango-shake',
    title: 'Golden Alphonso Mango Shake',
    category: 'Thick Shakes & Chocolicks',
    url: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p-vanilla-shake',
    title: 'Classic Vanilla Bean Milkshake',
    category: 'Thick Shakes & Chocolicks',
    url: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p-pista-shake',
    title: 'Royal Pistachio Kesar Shake',
    category: 'Thick Shakes & Chocolicks',
    url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p-butterscotch-shake',
    title: 'Butterscotch Caramel Crunch Shake',
    category: 'Thick Shakes & Chocolicks',
    url: 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p-belgian-dark-shake',
    title: 'Belgian Dark Chocolate Thick Shake',
    category: 'Thick Shakes & Chocolicks',
    url: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p-oreo-shake',
    title: 'Oreo Cookies & Cream Freakshake',
    category: 'Thick Shakes & Chocolicks',
    url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p-kitkat-shake',
    title: 'KitKat Wafer Crunch Chocolick',
    category: 'Thick Shakes & Chocolicks',
    url: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p-ferrero-shake',
    title: 'Ferrero Praline Supreme Shake',
    category: 'Thick Shakes & Chocolicks',
    url: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&w=800&q=80',
  },

  // ── Hot Brews & Warm Sips ──
  {
    id: 'p-hot-cappuccino',
    title: 'Artisan Foamed Cappuccino',
    category: 'Hot Brews & Warm Sips',
    url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p-hot-latte',
    title: 'Creamy Cafe Latte Art',
    category: 'Hot Brews & Warm Sips',
    url: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p-hot-chocolate',
    title: 'Hot Molten Chocolate Craze',
    category: 'Hot Brews & Warm Sips',
    url: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p-peach-iced-tea',
    title: 'Peach Lemon Mint Iced Tea',
    category: 'Hot Brews & Warm Sips',
    url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80',
  },

  // ── Fries & Crispy Bites ──
  {
    id: 'p-classic-fries',
    title: 'Golden Salted French Fries',
    category: 'Fries & Crispy Bites',
    url: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p-peri-peri-fries',
    title: 'Fiery Peri-Peri Spiced Fries',
    category: 'Fries & Crispy Bites',
    url: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p-cheesy-loaded-fries',
    title: 'Cheesy Melted Loaded Fries',
    category: 'Fries & Crispy Bites',
    url: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p-garlic-bread',
    title: 'Toasted Cheesy Garlic Bread',
    category: 'Fries & Crispy Bites',
    url: 'https://images.unsplash.com/photo-1619860860774-1e2e17343432?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p-crispy-nuggets',
    title: 'Crispy Veggie Herb Nuggets',
    category: 'Fries & Crispy Bites',
    url: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p-potato-wedges',
    title: 'Chunky Peri Peri Potato Wedges',
    category: 'Fries & Crispy Bites',
    url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80',
  },

  // ── Sandwiches & Burgers ──
  {
    id: 'p-cheese-corn-sandwich',
    title: 'Grilled Sweet Corn & Cheese Sandwich',
    category: 'Sandwiches & Burgers',
    url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p-bombay-club-sandwich',
    title: 'Bombay Masala Club Sandwich',
    category: 'Sandwiches & Burgers',
    url: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p-veggie-burger',
    title: 'Crispy Veggie Supreme Burger',
    category: 'Sandwiches & Burgers',
    url: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p-paneer-burger',
    title: 'Spicy Paneer Crunch Brioche Burger',
    category: 'Sandwiches & Burgers',
    url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
  },

  // ── Waffles & Desserts ──
  {
    id: 'p-belgian-waffle',
    title: 'Warm Belgian Chocolate Waffle',
    category: 'Waffles & Desserts',
    url: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p-sizzling-brownie',
    title: 'Sizzling Walnut Brownie with Ice Cream',
    category: 'Waffles & Desserts',
    url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p-choco-lava',
    title: 'Molten Choco Lava Cake',
    category: 'Waffles & Desserts',
    url: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p-pancakes',
    title: 'Fluffy Choco Chip Mini Pancakes',
    category: 'Waffles & Desserts',
    url: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80',
  },
];

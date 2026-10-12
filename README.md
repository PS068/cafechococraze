<div align="center">

  # 🍽️ PS Resto — Digital QR Restaurant Menu & Manager Portal
  
  **A lightning-fast, mobile-first digital menu and management suite for modern dining.**

  [![Live Demo](https://img.shields.io/badge/Live%20Demo-ps--resto.vercel.app-f59e0b?style=for-the-badge&logo=vercel&logoColor=white)](https://ps-resto.vercel.app/)
  [![GitHub Repository](https://img.shields.io/badge/GitHub-PS068%2Fps--resto-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/PS068/ps-resto)
  [![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

  ---

  [🌟 Live Public Menu](https://ps-resto.vercel.app/) • [🔐 Admin Portal](https://ps-resto.vercel.app/admin/login) • [📖 Documentation](#-getting-started) • [📱 Features](#-key-features)

</div>

<br />

## 📖 Overview

**PS Resto** is a next-generation contactless digital menu and real-time manager operations web application designed for restaurants, cafes, and bars in Sangli and beyond.

Guests scan a QR code at their table to browse an interactive, high-definition menu with live dietary tags, spice ratings, descriptions, and one-tap waiter assistance. Restaurant managers get an intuitive, mobile-optimized control center to manage dishes, update prices on the fly, toggle store status, and generate printable table QR cards in seconds.

---

## ✨ Key Features

### 📱 Guest Experience (Mobile-First Digital Menu)
* **⚡ Instant Load Times:** Sub-second page loads with zero login or app download required.
* **🔍 Real-Time Search & Category Tabs:** Filter instantly across Starters, Main Course, Biryani, Breads, Fast Food, Desserts, and Drinks.
* **🥗 Dietary & Allergy Awareness:** Clear indicators for Pure Veg 🟢 and Non-Veg 🔴 with category badges.
* **🌶️ Spice Meter:** Visual chili ratings (Mild, Medium, Hot, Extra Hot) to guide customer tastes.
* **⭐ Chef's Specials & Bestsellers:** Highlight signature dishes and promotional offerings.
* **📶 Table Amenities:** Instant 1-tap copy for Guest Wi-Fi password and quick Waiter Assistance.
* **🌗 Dynamic Themes:** Seamless day and night viewing with dark and light mode toggle.

### 👨‍🍳 Restaurant Manager Portal (`/admin`)
* **⚡ 1-Click Pre-Built Food Library:** 40+ curated popular Indian, Chinese, Italian, and beverage items with pre-written descriptions, suggested prices, and high-res photography.
* **📷 Advanced Photo Management:**
  * **Device Upload:** Take photos directly on your phone or PC with automatic canvas compression (<120 KB web optimization).
  * **Curated Gallery:** 25+ HD food photography presets.
  * **Direct URL:** Support for custom image hosting links.
* **🔴 Live Store Pause Toggle:** Mark the restaurant as *"Open & Accepting Orders"* or *"Kitchen Paused"* with custom notices.
* **🏷️ Menu Items & Category Organizer:** Add, edit, reorder, or delete dishes and categories with instant live sync.
* **📊 Dashboard Analytics:** Quick snapshot of total menu items, categories, out-of-stock items, and popular dishes.
* **📲 Dynamic QR Code Generator:**
  * Generates QR codes pointing directly to your live Vercel URL (`https://ps-resto.vercel.app/menu/ps-resto`).
  * One-click **Download high-res PNG** and **Print Table Tent Cards** ready for placement on dining tables.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 19 + TypeScript | Type-safe, component-driven UI architecture |
| **Build Tool** | Vite 8 | Ultra-fast HMR and optimized production bundles |
| **Styling** | Vanilla CSS Design Tokens | Lightweight, CSS custom properties with fluid responsiveness |
| **Icons** | Lucide React | Clean, modern feather-style iconography |
| **Backend & Auth** | Supabase (PostgreSQL) | Scalable database with Row-Level Security (RLS) & Auth |
| **QR Engine** | qrcode.react | Vector SVG & HTML5 Canvas QR code rendering |
| **Hosting** | Vercel | Global edge CDN deployment |

---

## 🚀 Getting Started Locally

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* [npm](https://www.npmjs.com/) or `pnpm`

### 1. Clone the repository
```bash
git clone https://github.com/PS068/ps-resto.git
cd ps-resto
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the project root:
```ini
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

> 💡 **Demo Mode:** If you do not provide Supabase credentials, the application automatically runs in **Interactive Demo Mode** with complete offline mock data and localStorage persistence!

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🗄️ Database Setup (Supabase)

If connecting your own Supabase project:

1. Open your project in the [Supabase Dashboard](https://supabase.com/dashboard).
2. Go to **SQL Editor** (`>_`).
3. Run the schema script provided in [`supabase-schema.sql`](./supabase-schema.sql) to create:
   * `public.restaurants`
   * `public.categories`
   * `public.menu_items`
   * Row-Level Security (RLS) policies and performance indexes.
4. Go to **Authentication > Users**, create an admin email & password, and copy the **User UID**.
5. Link your restaurant record using this SQL snippet:

```sql
INSERT INTO public.restaurants (
    owner_id,
    name,
    slug,
    tagline,
    description,
    address,
    cuisine_type
) VALUES (
    'YOUR_USER_UID_HERE',
    'PS Resto',
    'ps-resto',
    'Delicious Flavors, Unforgettable Dining',
    'Welcome to PS Resto, Sangli. Experience authentic culinary delights prepared with the freshest ingredients.',
    'Main Road, Sangli, Maharashtra 416416',
    'Multi-Cuisine, North Indian, Chinese, Tandoori'
);
```

---

## 📂 Project Structure

```text
ps-resto/
├── public/                  # Favicon & static assets
│   └── favicon.svg          # PS Resto brand logo
├── src/
│   ├── assets/              # SVGs and images
│   ├── components/
│   │   ├── admin/           # Admin dashboard, QR codes, tables, forms & photo picker
│   │   ├── common/          # Modals, toasts, theme toggles, confirm dialogs
│   │   └── public/          # Public menu navbar, hero, category tabs, food cards, footer
│   ├── context/             # React Context for Auth, Data & Theme state
│   ├── data/
│   │   ├── demoData.ts      # Offline fallback demo data
│   │   ├── foodCatalog.ts   # 40+ pre-built food library presets
│   │   └── foodPhotos.ts    # Curated HD dish photo presets
│   ├── lib/
│   │   └── supabase.ts      # Supabase client initialization
│   ├── pages/
│   │   ├── admin/           # Admin dashboard, items, categories, profile, settings
│   │   └── PublicMenuPage.tsx
│   ├── types/               # TypeScript data schemas
│   ├── App.tsx              # Application routing & protected routes
│   ├── index.css            # Custom CSS design system
│   └── main.tsx             # React DOM entry point
├── supabase-schema.sql      # Database schema, RLS policies & indexes
├── vite.config.ts           # Vite configuration
└── package.json
```

---

## 🌐 Deployment to Vercel

1. Push your repository to GitHub.
2. Sign in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import `PS068/ps-resto`.
4. Add the two environment variables:
   * `VITE_SUPABASE_URL`
   * `VITE_SUPABASE_ANON_KEY`
5. Click **Deploy**. Your menu will be live at `https://ps-resto.vercel.app/`!

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
  <sub>Crafted with passion for <strong>PS Resto</strong> • Sangli, Maharashtra 🇮🇳</sub>
</div>

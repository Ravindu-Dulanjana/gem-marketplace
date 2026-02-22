# GemMarket — Gem Marketplace Application Plan

## Overview
A premium gemstone marketplace web application where sellers can list gems and buyers can browse and purchase them. Built with Next.js 14+ (App Router) and Supabase.

## Tech Stack
- **Frontend:** Next.js 14+ (App Router, React Server Components, Server Actions)
- **Backend/DB:** Supabase (Auth, PostgreSQL, Storage, Realtime)
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **Fonts:** Geist (body), Playfair Display (headings)
- **Deployment:** Vercel

## Design Theme
- **Style:** Dark luxury theme
- **Background:** #0a0a0a (dark)
- **Cards:** #1a1a1a with #2a2a2a borders
- **Primary Accent:** Gold (#d4af37)
- **Text:** #f5f5f5 (white/light gray)
- **Typography:** Playfair Display (serif headings), Geist (sans-serif body)

---

## Build Phases

### Phase 1 — Foundation [COMPLETED]
- [x] Next.js project setup with Tailwind CSS & TypeScript
- [x] Supabase client config (server + client + middleware)
- [x] Database schema with all tables + RLS policies (`supabase/schema.sql`)
- [x] Seller authentication (register/login with email/password)
- [x] Homepage with dark luxury theme (hero slider, categories, featured gems, shop by shape/color, CTA, footer)
- [x] Middleware for route protection (seller dashboard, admin routes)

### Phase 2 — Listings & Browse [COMPLETED]
- [x] Seller dashboard — listing CRUD (create/edit/delete gems)
- [x] Image upload to Supabase Storage (up to 10 images per gem)
- [x] Shop page with filters (shape, color, carat, category, treatment, price type)
- [x] Search functionality with query params
- [x] Gem detail page with image gallery, specs, inquiry form, similar gems
- [x] Pagination & sorting (newest, price asc/desc, most viewed, carat desc)
- [x] Seller listings management page with status badges

### Phase 3 — Interactions [COMPLETED]
- [x] In-app messaging (buyer inquiry form per gem)
- [x] Seller inbox with real-time notifications (Supabase Realtime)
- [x] Wishlist (session/cookie based for guests) with add/remove on shop & detail pages
- [x] Compare tool (side-by-side up to 4 gems) with floating compare bar
- [x] Recently viewed gems tracking and display
- [x] Social sharing buttons (Copy link, Twitter, Facebook, WhatsApp)

### Phase 4 — Admin & Polish [COMPLETED]
- [x] Admin dashboard with tabbed layout (overview, sellers, listings, categories)
- [x] Admin analytics (8 stat cards, top viewed gems, recent sellers)
- [x] Seller approval/rejection with audit logging
- [x] Listing moderation (approve, remove, restore)
- [x] Category management (add, delete, gem count)
- [x] Seller reviews system (star rating, admin approval required)
- [x] Seller public storefront page (/seller/[id]) with listings + reviews
- [x] SEO: sitemap.xml, robots.txt, page-level metadata
- [x] Real dashboard stats (total/active listings, inquiries, views)
- [x] Policy pages: terms, privacy, returns, shipping
- [x] About page with feature cards + CTA
- [x] Contact page with info cards + contact form
- [ ] Deploy to Vercel (ready — run `vercel`)

---

## Database Schema

### Tables
| Table | Description |
|---|---|
| `profiles` | Seller profiles (extends Supabase Auth), role, approval status |
| `categories` | Gem categories (Loose Stones, Layouts, Cabochons, etc.) |
| `gems` | Gem listings with all specs (type, carat, shape, color, price, etc.) |
| `gem_images` | Multiple images per gem (up to 10) |
| `inquiries` | Buyer-to-seller messages per gem |
| `wishlist` | Saved gems (session-based for guests) |
| `reviews` | Seller reviews from buyers |
| `recently_viewed` | Track recently viewed gems per session |
| `admin_logs` | Admin action audit trail |

### Key Features
- **RLS (Row Level Security):** All tables have policies
- **Auto profile creation:** Trigger on auth.users insert
- **Auto timestamp:** Updated_at auto-updates on profile/gem changes
- **View counter:** Function to increment gem view count

### Storage Buckets
- `gems` — Gem images (public)
- `avatars` — Seller avatars (public)
- `certifications` — Gem certification documents (public)

---

## Pages & Routes

| Route | Type | Description |
|---|---|---|
| `/` | Public | Homepage |
| `/shop` | Public | Browse all gems with filters |
| `/shop/[slug]` | Public | Gem detail page |
| `/compare` | Public | Side-by-side gem comparison |
| `/wishlist` | Public | Saved gems list |
| `/seller/register` | Public | Seller registration |
| `/seller/login` | Public | Seller login |
| `/seller/dashboard` | Protected | Seller dashboard overview |
| `/seller/dashboard/listings/new` | Protected | Create new gem listing |
| `/seller/dashboard/listings/[id]/edit` | Protected | Edit gem listing |
| `/seller/dashboard/inbox` | Protected | Seller message inbox |
| `/seller/[id]` | Public | Public seller storefront |
| `/admin` | Admin | Admin dashboard |
| `/about` | Public | About page |
| `/contact` | Public | Contact page |
| `/terms` | Public | Terms & conditions |
| `/privacy` | Public | Privacy policy |
| `/returns` | Public | Return policy |
| `/shipping` | Public | Shipping info |

---

## Setup Instructions

### 1. Environment Variables
Copy `.env.local` and fill in your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Database Setup
Run `supabase/schema.sql` in your Supabase SQL Editor to create all tables, functions, RLS policies, and storage buckets.

### 3. Development
```bash
npm run dev
```

### 4. Deploy
```bash
vercel
```

---

## User Flows

### Seller Flow
1. Register with email/password → email verification
2. Wait for admin approval (status: pending → approved)
3. Login → access dashboard
4. Create gem listings with images
5. Manage inquiries from buyers
6. View analytics (views, inquiries)

### Buyer Flow (no account needed)
1. Browse homepage / shop page
2. Filter gems by shape, color, carat, category
3. View gem details
4. Add to wishlist / compare
5. Submit inquiry (request price) or purchase (fixed price)

### Admin Flow
1. Login with admin account
2. Review and approve/reject seller applications
3. Moderate gem listings
4. View site-wide analytics
5. Manage categories

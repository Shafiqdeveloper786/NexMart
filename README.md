# NexMart — Cyberpunk SaaS-Level E-Commerce Platform

A premium, industry-standard SaaS-level e-commerce application built with Next.js 16+, TypeScript, Tailwind CSS, MongoDB, Prisma ORM, and NextAuth.js. Designed with a custom **Cyberpunk-Futuristic dark aesthetic** (`#030712`), featuring glassmorphism, animated neon accents, real-time control matrix screens, and dynamic state management.

---

## 🎨 Theme & UI/UX Design System

NexMart features a premium, bespoke storefront themed around Netrunner modules and Cyberware upgrades:
*   **Color Tokens**: Base deep-space background (`#030712`), elevated card surfaces (`#0d1117`), and sharp neon borders (`--neon-cyan`, `--neon-magenta`, `--neon-violet`, `--neon-yellow`).
*   **Visual Enhancements**: Portal-rendered Quick-View dialog interfaces, scanline canvas grid overlays, responsive image presets (`AVIF`/`WebP` optimization), and animated custom loader skeletons.
*   **Cinema Hero**: Auto-play indicator progress bars, modular Framer Motion slides, and interactive CTA vectors.

---

## 🚀 Key Modules & Architecture

### 1. Storefront Revamp
*   **Grid Catalog**: Dual-column cards showing star reviews, discount ratios, depletion flags, and responsive buttons (cart add/wishlist save).
*   **Advanced Filter Matrix**: Persistent URL queries tracking price limits, review quality sliders, and order sorting (`newest`, `bestseller`, `price_asc`, etc.) for seamless SSR-friendly sharing.
*   **Quick-View Modal**: Portal overlay displaying full image galleries, variant indicators, stock monitors, and quantity options.

### 2. Admin Dashboard & RBAC Console
Protected by session-based **Role-Based Access Control** middleware to ensure only `ADMIN` roles can load management modules:
*   **Overview Console**: Real-time stats counting gross credits, total transactions, user accounts, and inventory modules. Includes a custom telemetry trend log chart.
*   **Products Catalog CRUD**: Create, edit, and de-authorize inventory units easily. Allows setting SKUs, images, descriptions, categories, and credit values.
*   **Transactions Queue Manager**: Modify stages on any order instantly using a dynamic select trigger (PENDING ➔ PROCESSING ➔ PAID ➔ SHIPPED ➔ DELIVERED ➔ CANCELLED).
*   **User Registry Matrix**: Toggle authorization clearances (USER / ADMIN) for any system netrunner.

### 3. Live Stepper Tracking
*   Dedicated tracking views at `/orders/[id]` displaying timeline stepper progress bars with corresponding stage indicators (Confirmed, Processing, Paid, Shipped, Delivered).

---

## 🛠️ Prerequisites

*   Node.js 18+
*   MongoDB Atlas Connection
*   Google OAuth Application (optional for social auth)
*   SMTP Server (Google App Mail configuration for notification dispatches)

---

## 📦 Installation & Setup

### 1. Setup Environment
Your environment credentials are fully configured in the local directory. Ensure `.env` or `.env.local` contains the following fields:

```env
NEXTAUTH_URL=https://nex-mart-gules.vercel.app
MONGODB_URI=mongodb+srv://...
NEXTAUTH_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GMAIL_USER=...
GMAIL_APP_PASSWORD=...
APP_NAME=NexMart
APP_DESCRIPTION="Next-generation E-commerce Platform"
ENVIRONMENT=development
```

### 2. Install Project Dependencies
Run the installation in your terminal:
```bash
npm install --legacy-peer-deps
```

### 3. Initialize Prisma ORM Client
Generate the type-safe client models and push changes directly into your MongoDB database:
```bash
npx prisma generate
npx prisma db push
```

### 4. Seed Matrix Catalog
Populate the database with mock products:
```bash
npm run seed
```

---

## 🛰️ Production & Development Commands

### Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) inside your browser.

### Build Production Console
```bash
npm run build
npm run start
```

---

## 📁 Core Directory Structure

```
NexMart/
├── prisma/
│   └── schema.prisma      # Upgraded Prisma database models
├── src/
│   ├── app/
│   │   ├── admin/         # Protected Admin dashboard routes (layout, KPI, CRUD pages)
│   │   ├── category/      # Advanced category catalog pages
│   │   ├── orders/        # Live tracking page matrices
│   │   └── globals.css    # Design tokens and Cyberpunk utilities
│   ├── components/
│   │   ├── admin/         # Table management controls (Product, Order, User tables)
│   │   ├── product/       # Portal Modals, skeletons, cards, and filters
│   │   └── shared/        # Navigation bars, themes, and global components
│   ├── lib/
│   │   ├── actions/       # Server Action handlers (product, order, user matrix actions)
│   │   ├── store.ts       # Zustand cart, wishlist, and modal states
│   │   └── auth.ts        # Secure NextAuth configuration
```

---

**Built with ❤️ for a modern, scalable e-commerce future.**

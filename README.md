# NexMart - E-Commerce Platform

A modern, high-performance e-commerce platform built with Next.js 15+, TypeScript, Tailwind CSS, MongoDB, and NextAuth.js. Designed with scalability, type safety, and performance in mind.

## 🚀 Features

- **Next.js App Router** - Latest Next.js with App Router for better performance
- **TypeScript** - Full type safety across the application
- **Tailwind CSS** - Utility-first CSS with built-in dark mode support
- **MongoDB + Prisma ORM** - Type-safe database operations with MongoDB
- **NextAuth.js** - Flexible authentication with credentials and social login (GitHub, Google)
- **Zustand** - Lightweight state management for shopping cart
- **React Hook Form + Zod** - Type-safe form handling and validation
- **shadcn/ui** - High-quality, accessible React components
- **Lucide React** - Beautiful, consistent icon library
- **Sonner** - Toast notifications with elegant UI
- **Dark Mode Support** - Class-based theme switching

## 📋 Tech Stack

### Frontend
- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (with dark mode)
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **State Management**: Zustand
- **Notifications**: Sonner

### Backend & Database
- **Runtime**: Node.js with Next.js API Routes
- **Database**: MongoDB
- **ORM**: Prisma
- **Authentication**: NextAuth.js

## 🛠️ Prerequisites

- Node.js 18+ and npm/yarn/pnpm/bun
- MongoDB database (local or MongoDB Atlas)
- Git

## 📦 Installation

### 1. Project Setup

The project is already initialized. All core dependencies are installed.

### 2. Environment Setup

Copy the `.env.example` to `.env.local` and fill in your actual values:

```bash
cp .env.example .env.local
```

Update the following in `.env.local`:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/nexmart?retryWrites=true&w=majority

# NextAuth Configuration
NEXTAUTH_SECRET=generate-a-random-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# OAuth Providers (Optional)
GITHUB_ID=your-github-oauth-app-id
GITHUB_SECRET=your-github-oauth-secret
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-secret
```

### 3. Initialize Prisma

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to MongoDB
npx prisma db push

# (Optional) Open Prisma Studio
npx prisma studio
```

## 🚀 Development

### Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Watch Mode with Turbopack

```bash
npm run dev -- --turbopack
```

Turbopack is configured for faster rebuilds in development.

## 📁 Project Structure

```
nexmart/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   │   └── auth/          # NextAuth routes
│   │   ├── globals.css        # Global Tailwind styles
│   │   ├── layout.tsx         # Root layout with ThemeProvider
│   │   └── page.tsx           # Home page
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   └── shared/            # Shared components (ThemeProvider, ThemeToggle)
│   ├── lib/
│   │   ├── auth.ts            # NextAuth configuration
│   │   ├── prisma.ts          # Prisma client singleton
│   │   ├── store.ts           # Zustand cart store
│   │   └── utils/
│   │       └── cn.ts          # Tailwind CSS className utility
│   ├── types/                 # TypeScript type definitions
│   │   ├── index.ts           # Common types
│   │   ├── auth.ts            # Auth-related types
│   │   └── product.ts         # Product-related types
│   └── models/                # Database models (re-exported from Prisma)
│       └── index.ts
├── prisma/
│   └── schema.prisma          # Prisma database schema
├── public/                    # Static assets
├── .env.example               # Environment variables template
├── .env.local                 # Local environment variables (not committed)
├── components.json            # shadcn/ui configuration
├── next.config.ts             # Next.js configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies and scripts
```

## 🎨 Dark Mode Implementation

The project uses a class-based dark mode system with Tailwind CSS v4:

- **Theme Toggle Component**: `src/components/shared/ThemeToggle.tsx`
- **Theme Provider Hook**: `src/components/shared/ThemeProvider.tsx`
- **CSS Variables**: Defined in `src/app/globals.css`

### Using Dark Mode in Components

```tsx
import { useTheme } from "@/components/shared";

export function MyComponent() {
  const { toggleTheme, resolvedTheme } = useTheme();
  
  return (
    <div className="bg-white dark:bg-slate-950 text-black dark:text-white">
      <button onClick={toggleTheme}>
        Toggle Theme ({resolvedTheme})
      </button>
    </div>
  );
}
```

## 🗄️ Database Schema

The Prisma schema includes models for:

- **User** - User accounts with authentication
- **Account** - OAuth provider accounts
- **Session** - NextAuth sessions
- **Product** - Product inventory
- **Cart** & **CartItem** - Shopping cart
- **Wishlist** & **WishlistItem** - Customer wishlists
- **Order** & **OrderItem** - Order management
- **Review** - Product reviews
- **VerificationToken** - Email verification tokens

## 🔐 Authentication

The project supports multiple authentication methods:

### Credentials Authentication
- Email/password login
- Registration (requires implementation)

### Social Login (OAuth)
- GitHub
- Google

### Configuration
- JWT-based sessions
- 30-day session expiration
- Secure cookie storage

## 🛒 Shopping Cart

The cart is managed with Zustand and persisted to localStorage:

```tsx
import { useCartStore } from "@/lib/store";

export function ProductCard({ product }) {
  const addItem = useCartStore((state) => state.addItem);
  
  const handleAddToCart = () => {
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    });
  };

  return (
    <button onClick={handleAddToCart}>
      Add to Cart
    </button>
  );
}
```

## 📦 Installed Dependencies

### Core
- `next` - React framework
- `react` & `react-dom` - UI library
- `typescript` - Type safety

### Database & ORM
- `@prisma/client` - Prisma client
- `prisma` - Prisma CLI (dev dependency)

### Authentication & Security
- `next-auth` - Authentication solution

### UI & Styling
- `tailwindcss` - Utility-first CSS
- `lucide-react` - Icon library
- `sonner` - Toast notifications

### Forms & Validation
- `react-hook-form` - Form state management
- `zod` - Schema validation

### State Management
- `zustand` - Lightweight state management

## 🔧 Build & Deploy

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

## 📝 Common Development Tasks

### Add a New shadcn/ui Component

```bash
npx shadcn@latest add button
```

### Generate Prisma Client After Schema Changes

```bash
npx prisma generate
```

### Push Schema Changes to Database

```bash
npx prisma db push
```

### View Database with Prisma Studio

```bash
npx prisma studio
```

## 🚨 Important Notes

1. **Environment Variables**: Never commit `.env.local` to version control
2. **NextAuth Secret**: Generate a secure secret with: `openssl rand -base64 32`
3. **MongoDB Connection**: Use MongoDB Atlas for production
4. **Password Hashing**: Implement bcryptjs or similar before deploying
5. **Rate Limiting**: Implement rate limiting on API routes for production
6. **HTTPS**: Use HTTPS in production

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)

## 🤝 Contributing

Contributions are welcome! Please follow the existing code structure and TypeScript conventions.

## 📄 License

This project is open source and available under the MIT License.

## 🎯 Next Steps

1. **Set up environment variables** in `.env.local`
2. **Connect MongoDB** database
3. **Start development server**: `npm run dev`
4. **Implement authentication pages** (login, register, forgot password)
5. **Build product catalog** pages
6. **Create shopping cart** and checkout flow
7. **Add payment integration** (Stripe, PayPal, etc.)
8. **Implement admin dashboard** for product management

---

**Built with ❤️ using Next.js 15+, TypeScript, and Tailwind CSS**

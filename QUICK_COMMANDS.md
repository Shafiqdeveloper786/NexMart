# NexMart - Quick Command Reference

## 📝 Essential Commands

### Start Development
```bash
cd "D:\New folder\nexmart"
npm run dev
# Open http://localhost:3000
```

### Build & Deploy
```bash
npm run build          # Build for production
npm start              # Start production server
npm run lint          # Check code quality
```

### Database
```bash
npx prisma generate  # Generate Prisma Client
npx prisma db push   # Sync schema with MongoDB
npx prisma studio    # Open database GUI
```

### Dependencies
```bash
npm install             # Install all dependencies
npm install [package]   # Add new package
npm update             # Update all packages
npm audit              # Check vulnerabilities
npm audit fix          # Fix vulnerabilities
```

### Add shadcn/ui Components
```bash
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add card
npx shadcn@latest add form
npx shadcn@latest add table
npx shadcn@latest add dialog
```

## ⚙️ Configuration Files

### 1. Copy Environment Template
```bash
cp .env.example .env.local
```

### 2. Edit `.env.local` - Required Values

```env
# CRITICAL - Configure these first
MONGODB_URI=your-mongodb-connection-string
NEXTAUTH_SECRET=generate-with-openssl
NEXTAUTH_URL=http://localhost:3000

# OPTIONAL - OAuth Providers
GITHUB_ID=
GITHUB_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

### 3. Generate NEXTAUTH_SECRET

**Windows PowerShell:**
```powershell
[Convert]::ToBase64String([System.Random]::new().GetBytes(32))
```

**Or use online tool:** https://generate-secret.vercel.app/32

## 🗄️ MongoDB Setup

### MongoDB Atlas (Recommended)
1. Create account: https://www.mongodb.com/cloud/atlas
2. Create cluster
3. Create database user
4. Get connection string
5. Add to `.env.local`

### Local MongoDB with Docker
```bash
docker run -d -p 27017:27017 --name mongodb mongo
# Connection string: mongodb://localhost:27017/nexmart
```

## 📂 Directory Structure Summary

```
src/
├── app/                 # Pages and API routes
│   ├── api/auth/       # NextAuth routes
│   ├── globals.css     # Dark mode styles
│   └── layout.tsx      # Root layout
├── components/
│   ├── ui/            # shadcn/ui components
│   └── shared/        # Shared components (Theme, etc.)
├── lib/
│   ├── auth.ts        # NextAuth config
│   ├── prisma.ts      # Database client
│   └── store.ts       # Zustand cart
├── types/             # TypeScript types
└── models/            # Prisma models export

prisma/
└── schema.prisma      # Database schema
```

## 💡 Code Snippets

### Add Product to Cart
```tsx
"use client";
import { useCartStore } from "@/lib/store";

export function AddToCartButton({ product }) {
  const addItem = useCartStore(state => state.addItem);
  
  return (
    <button onClick={() => addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    })}>
      Add to Cart
    </button>
  );
}
```

### Dark Mode Toggle
```tsx
"use client";
import { useTheme } from "@/components/shared";

export function DarkModeToggle() {
  const { toggleTheme, resolvedTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      Current: {resolvedTheme}
    </button>
  );
}
```

### Fetch Products from Database
```tsx
import { prisma } from "@/lib/prisma";

export async function getProducts() {
  return await prisma.product.findMany({
    where: { stock: { gt: 0 } }
  });
}
```

### Create API Route
```tsx
// src/app/api/products/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const products = await prisma.product.findMany();
  return NextResponse.json(products);
}
```

## 🧪 Testing & Development

```bash
# Type check
npx tsc --noEmit

# Lint
npm run lint

# Build test
npm run build

# Production run
npm start

# Kill port 3000
npx kill-port 3000

# Run on different port
npm run dev -- -p 3001
```

## 📚 Installed Packages by Category

| Category | Packages |
|----------|----------|
| **Framework** | next, react, react-dom, typescript |
| **Database** | @prisma/client, prisma |
| **Auth** | next-auth |
| **UI/UX** | tailwindcss, lucide-react, sonner |
| **Forms** | react-hook-form, zod |
| **State** | zustand |
| **Dev Tools** | eslint, @types/*, postcss |

## ⚠️ Important Notes

1. **NEVER commit `.env.local`**
2. Configure `.env.local` before first run
3. Run `npx prisma generate` after schema changes
4. Use `npx prisma studio` to manage database
5. Keep dependencies updated: `npm update`

## 🚀 Project Status

```
✅ Next.js 15+ with App Router
✅ TypeScript configured
✅ Tailwind CSS with dark mode
✅ MongoDB + Prisma ORM
✅ NextAuth.js (credentials + OAuth)
✅ Zustand cart store
✅ React Hook Form + Zod
✅ shadcn/ui ready
✅ Project builds successfully
```

## 🔗 Useful Links

| Resource | Link |
|----------|------|
| Next.js Docs | https://nextjs.org/docs |
| Prisma Docs | https://www.prisma.io/docs/ |
| NextAuth.js | https://next-auth.js.org/ |
| Tailwind CSS | https://tailwindcss.com |
| shadcn/ui | https://ui.shadcn.com/ |
| MongoDB | https://www.mongodb.com/docs/ |
| Generate Secret | https://generate-secret.vercel.app/32 |

---

**💻 Ready to Code!**

Start with: `npm run dev`

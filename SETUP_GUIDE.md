# NexMart E-Commerce Platform - Complete Setup Guide

## 📋 Project Overview

**Project Name:** NexMart  
**Type:** Next-Generation E-Commerce Platform  
**Location:** `D:\New folder\nexmart`  
**Status:** ✅ Fully Scaffolded & Ready for Development

## 🎯 Phase 1 Completion Status

All Phase 1 requirements have been successfully completed:

- ✅ Project initialized with Next.js 15+ (App Router)
- ✅ TypeScript enabled globally
- ✅ Tailwind CSS v4 configured with class-based dark mode
- ✅ MongoDB + Prisma ORM set up
- ✅ NextAuth.js configured for multi-method authentication
- ✅ All required dependencies installed
- ✅ Complete directory structure created
- ✅ Configuration files generated
- ✅ Project builds successfully without errors

## 📦 Installed Dependencies (Phase 1)

### Core Framework
```json
{
  "next": "^16.2.4",
  "react": "^19.0.0-rc",
  "react-dom": "^19.0.0-rc",
  "typescript": "^5"
}
```

### Database & ORM
```json
{
  "@prisma/client": "^5.22.0",
  "prisma": "^5.22.0"
}
```

### Authentication
```json
{
  "next-auth": "^5.0.0"
}
```

### UI & Styling
```json
{
  "tailwindcss": "^4.0.0",
  "@tailwindcss/postcss": "^4.0.0",
  "lucide-react": "^latest",
  "sonner": "^latest"
}
```

### Forms & Validation
```json
{
  "react-hook-form": "^latest",
  "zod": "^latest"
}
```

### State Management
```json
{
  "zustand": "^latest"
}
```

### Development Tools
```json
{
  "eslint": "^9",
  "eslint-config-next": "^16.2.4",
  "@types/node": "^latest",
  "@types/react": "^latest",
  "@types/react-dom": "^latest"
}
```

## 🚀 Complete Terminal Commands Reference

### 1. Navigate to Project Directory

```bash
cd "D:\New folder\nexmart"
```

### 2. Install Dependencies (Already Done)

All dependencies are already installed. To reinstall if needed:

```bash
# Clean install
npm install

# Or if npm cache is corrupted
npm cache clean --force
npm install
```

### 3. Prisma Setup Commands

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to MongoDB (requires MONGODB_URI in .env.local)
npx prisma db push

# View and manage database with Prisma Studio
npx prisma studio

# Reset database (danger - deletes all data)
npx prisma migrate reset
```

### 4. Development Server

```bash
# Start development server (on http://localhost:3000)
npm run dev

# With Turbopack (if supported on your platform)
npm run dev -- --turbopack

# Build for production
npm run build

# Start production server
npm start
```

### 5. TypeScript & Linting

```bash
# Run TypeScript type checking
npx tsc --noEmit

# Run ESLint
npm run lint

# Format code with ESLint
npm run lint -- --fix
```

### 6. shadcn/ui Component Installation

```bash
# Add individual components as needed
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add card
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add form
npx shadcn@latest add table
npx shadcn@latest add toast
```

### 7. Package Management

```bash
# Check for outdated packages
npm outdated

# Update all packages to latest
npm update

# Show npm fund information
npm fund

# Audit security vulnerabilities
npm audit
npx npm-audit-html

# Fix vulnerabilities
npm audit fix
npm audit fix --force  # Use caution with --force
```

## ⚙️ Environment Configuration

### 1. Copy Environment Template

```bash
cp .env.example .env.local
```

### 2. Update `.env.local` with Your Values

```env
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/nexmart?retryWrites=true&w=majority

# NextAuth Configuration
NEXTAUTH_SECRET=generate-with-command-below
NEXTAUTH_URL=http://localhost:3000

# GitHub OAuth (Optional)
GITHUB_ID=your-github-oauth-id
GITHUB_SECRET=your-github-oauth-secret

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-oauth-id
GOOGLE_CLIENT_SECRET=your-google-oauth-secret

# Application
APP_NAME=NexMart
APP_DESCRIPTION=Next-generation E-commerce Platform
ENVIRONMENT=development
```

### 3. Generate NextAuth Secret

```bash
# On Unix/Mac/Linux
openssl rand -base64 32

# On Windows PowerShell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((Get-Random -SetSeed (Get-Random) -Count 32 | ForEach-Object {[char]$_})))

# Or use an online generator
# https://generate-secret.vercel.app/32
```

## 📁 Project Structure

```
nexmart/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── api/
│   │   │   └── auth/[...nextauth]/   # NextAuth API route
│   │   │       └── route.ts
│   │   ├── globals.css               # Global styles with dark mode
│   │   ├── layout.tsx                # Root layout with ThemeProvider
│   │   ├── page.tsx                  # Home page
│   │   └── favicon.ico
│   ├── components/
│   │   ├── ui/                       # shadcn/ui components (add as needed)
│   │   └── shared/
│   │       ├── ThemeProvider.tsx     # Dark mode context provider
│   │       ├── ThemeToggle.tsx       # Dark mode toggle button
│   │       └── index.ts              # Component exports
│   ├── lib/
│   │   ├── auth.ts                   # NextAuth configuration
│   │   ├── prisma.ts                 # Prisma client singleton
│   │   ├── store.ts                  # Zustand cart store
│   │   └── utils/
│   │       └── cn.ts                 # Tailwind className utility
│   ├── types/
│   │   ├── index.ts                  # Common types
│   │   ├── auth.ts                   # Auth types
│   │   └── product.ts                # Product types
│   └── models/
│       └── index.ts                  # Prisma model exports
├── prisma/
│   ├── schema.prisma                 # Database schema
│   └── migrations/                   # Database migrations (auto-generated)
├── public/                           # Static assets
├── .env.example                      # Environment variables template
├── .env.local                        # Local environment (not committed)
├── components.json                   # shadcn/ui config
├── eslint.config.mjs                 # ESLint configuration
├── next.config.ts                    # Next.js configuration
├── postcss.config.mjs                # PostCSS/Tailwind config
├── tailwind.config.ts                # Tailwind CSS configuration (if exists)
├── tsconfig.json                     # TypeScript configuration
├── package.json                      # Dependencies and scripts
├── package-lock.json                 # Dependency lock file
└── README.md                         # Project documentation
```

## 🗄️ MongoDB Setup

### Option 1: MongoDB Atlas (Cloud - Recommended for Production)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account or log in
3. Create a new cluster
4. Create a database user with strong password
5. Get connection string
6. Add to `.env.local`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nexmart?retryWrites=true&w=majority
   ```

### Option 2: MongoDB Community (Local Development)

1. Download from [MongoDB Community](https://www.mongodb.com/try/download/community)
2. Install locally
3. Start MongoDB service:
   ```bash
   # Windows
   mongod
   
   # Or with Docker
   docker run -d -p 27017:27017 --name mongodb mongo
   ```
4. Add to `.env.local`:
   ```
   MONGODB_URI=mongodb://localhost:27017/nexmart
   ```

### Option 3: Docker Compose (Docker)

Create `docker-compose.yml`:

```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:7.0
    container_name: nexmart-mongodb
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
    volumes:
      - mongodb_data:/data/db
      
  mongo-express:
    image: mongo-express:latest
    container_name: nexmart-mongo-express
    restart: always
    ports:
      - "8081:8081"
    environment:
      ME_CONFIG_MONGODB_ADMINUSERNAME: admin
      ME_CONFIG_MONGODB_ADMINPASSWORD: password
      ME_CONFIG_MONGODB_URL: mongodb://admin:password@mongodb:27017/

volumes:
  mongodb_data:
```

Start with: `docker-compose up -d`

## 🔐 OAuth Setup

### GitHub OAuth

1. Go to GitHub Settings → Developer Settings → OAuth Apps
2. Create new OAuth App
3. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and Secret to `.env.local`

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web Application)
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Secret to `.env.local`

## 🎯 Development Workflow

### Starting Development

```bash
# Navigate to project
cd "D:\New folder\nexmart"

# Ensure .env.local is configured
# Then start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Adding New Pages

Create files in `src/app/`:

```tsx
// src/app/products/page.tsx
export default function ProductsPage() {
  return <div>Products Page</div>;
}
```

### Creating API Routes

```tsx
// src/app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: "Hello from API" });
}
```

### Using Prisma in Components

```tsx
// src/app/admin/products/page.tsx
import { prisma } from "@/lib/prisma";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany();
  
  return (
    <div>
      {products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```

### Using Zustand Cart Store

```tsx
// src/components/ProductCard.tsx
"use client";

import { useCartStore } from "@/lib/store";

export function ProductCard({ product }) {
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

### Dark Mode Implementation

```tsx
// Any component
"use client";

import { useTheme } from "@/components/shared";

export function MyComponent() {
  const { toggleTheme, resolvedTheme } = useTheme();
  
  return (
    <div className="bg-white dark:bg-black">
      <button onClick={toggleTheme}>
        Current: {resolvedTheme}
      </button>
    </div>
  );
}
```

## 🧪 Testing Commands

```bash
# Run development build
npm run build

# Start production server
npm start

# Type checking
npx tsc --noEmit

# Lint code
npm run lint

# Check for security vulnerabilities
npm audit

# Update security patches
npm audit fix
```

## 📊 Database Management

### Prisma Studio (Visual Database Manager)

```bash
npx prisma studio
```

Opens at `http://localhost:5555`

### Database Reset

```bash
# ⚠️ WARNING: This deletes all data!
npx prisma migrate reset
```

### Seeding Database

Create `prisma/seed.ts`:

```typescript
import { prisma } from "@/lib/prisma";

async function main() {
  // Seed data here
  const product = await prisma.product.create({
    data: {
      name: "Sample Product",
      price: 99.99,
      sku: "SKU001",
      category: "Electronics",
      stock: 10,
    },
  });
  
  console.log("Seeded:", product);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
```

Run with: `npx ts-node prisma/seed.ts`

## 📈 Performance Optimization

### Build Analysis

```bash
# Analyze bundle size
npm run build -- --interactive

# View built routes
npm run build
# Check .next/static folder
```

### Image Optimization

```tsx
// Use Next.js Image component
import Image from "next/image";

export function ProductImage({ src, alt }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={300}
      height={300}
      priority={false}
    />
  );
}
```

## 🚀 Deployment

### Vercel (Recommended for Next.js)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build: `docker build -t nexmart .`  
Run: `docker run -p 3000:3000 nexmart`

## ⚠️ Important Notes

1. **Never commit `.env.local`** - It contains secrets
2. **Generate NEXTAUTH_SECRET** - Use the commands provided above
3. **Use strong MongoDB password** - Especially for production
4. **Keep dependencies updated** - Run `npm update` periodically
5. **Enable HTTPS in production** - Required for secure authentication
6. **Implement rate limiting** - Add to API routes in production
7. **Set up backups** - For MongoDB production database

## 📚 Next Steps

1. ✅ **Phase 1 Complete**: Basic scaffolding
2. 🔄 **Phase 2 (Recommended Next)**:
   - Implement authentication pages (login, register)
   - Create product catalog pages
   - Build shopping cart UI
   - Implement product search/filtering
   
3. 🔄 **Phase 3**:
   - Checkout flow
   - Payment integration (Stripe, PayPal)
   - Order management
   
4. 🔄 **Phase 4**:
   - Admin dashboard
   - Product management
   - Analytics

## 🆘 Troubleshooting

### Port 3000 Already in Use

```bash
# Find and kill process
npx kill-port 3000

# Or use different port
npm run dev -- -p 3001
```

### MongoDB Connection Errors

```bash
# Verify MONGODB_URI in .env.local
# Check MongoDB is running
# Verify credentials are correct
# Test connection with Prisma Studio
npx prisma studio
```

### Build Errors

```bash
# Clean build
rm -r .next
npm run build

# Clear cache
npm cache clean --force
npm install
npm run build
```

### TypeScript Errors

```bash
# Check types
npx tsc --noEmit

# Regenerate Prisma
npx prisma generate
```

## 📞 Support Resources

- **Next.js**: https://nextjs.org/docs
- **Prisma**: https://www.prisma.io/docs/
- **NextAuth.js**: https://next-auth.js.org/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **shadcn/ui**: https://ui.shadcn.com/
- **Zustand**: https://github.com/pmndrs/zustand
- **MongoDB**: https://docs.mongodb.com/

---

**Project Date**: April 27, 2026  
**Setup Status**: ✅ Complete and Ready for Development  
**Last Updated**: Today

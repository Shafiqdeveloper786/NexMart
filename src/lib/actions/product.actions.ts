"use server";

import { prisma } from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/* ── Types ── */
export type ProductSummary = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  originalPrice: number | null;
  category: string;
  images: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  salesCount: number;
  isFeatured: boolean;
  isActive: boolean;
  sku: string | null;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type ProductFilters = {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  sort?: string;
  search?: string;
  inStock?: boolean;
  isFeatured?: boolean;
  limit?: number;
  skip?: number;
};

/* ─────────────────────────────────────────────────────
   READ — safe to call from Server Components directly
   ───────────────────────────────────────────────────── */

export async function getAllProducts(options?: ProductFilters): Promise<ProductSummary[]> {
  const {
    category,
    minPrice,
    maxPrice,
    rating,
    sort,
    search,
    inStock,
    isFeatured,
    limit,
    skip = 0,
  } = options ?? {};

  // Build the dynamic where clause
  // NOTE: Do NOT filter isActive here — seeded products don't have this field
  // and MongoDB excludes documents where the field is missing with ANY isActive filter.
  const where: any = {};

  if (category) {
    where.category = { equals: category, mode: "insensitive" };
  }

  if (isFeatured !== undefined) {
    where.isFeatured = isFeatured;
  }

  if (inStock === true) {
    where.stock = { gt: 0 };
  }

  // Price range filter
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  // Rating filter
  if (rating !== undefined && rating > 0) {
    where.rating = { gte: rating };
  }

  // Search filter
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { category: { contains: search, mode: "insensitive" } },
    ];
  }

  // Sorting
  let orderBy: any = [{ createdAt: "desc" }];
  if (sort) {
    switch (sort) {
      case "price_asc":
        orderBy = [{ price: "asc" }, { id: "desc" }];
        break;
      case "price_desc":
        orderBy = [{ price: "desc" }, { id: "desc" }];
        break;
      case "rating":
        orderBy = [{ rating: "desc" }, { id: "desc" }];
        break;
      case "bestseller":
        orderBy = [{ salesCount: "desc" }, { id: "desc" }];
        break;
      case "newest":
        orderBy = [{ createdAt: "desc" }, { id: "desc" }];
        break;
    }
  }

  return prisma.product.findMany({
    where,
    orderBy,
    take: limit,
    skip,
  }) as unknown as ProductSummary[];
}

export async function getProductById(id: string): Promise<ProductSummary | null> {
  if (!id || id.length !== 24) return null; // MongoDB ObjectId is 24 hex chars
  return prisma.product.findUnique({ 
    where: { id },
    include: {
      reviews: {
        include: {
          user: {
            select: { name: true, image: true }
          }
        },
        orderBy: { createdAt: "desc" }
      }
    }
  }) as unknown as ProductSummary | null;
}

export async function getProductsByCategory(
  category: string,
  limit = 8
): Promise<ProductSummary[]> {
  return prisma.product.findMany({
    where: { 
      category: { equals: category, mode: "insensitive" },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  }) as unknown as ProductSummary[];
}

export async function searchProducts(query: string): Promise<ProductSummary[]> {
  return prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { category: { contains: query, mode: "insensitive" } },
      ],
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  }) as unknown as ProductSummary[];
}

/* ─────────────────────────────────────────────────────
   WRITE — Admin-only mutations (Server Actions)
   ───────────────────────────────────────────────────── */

export async function createProduct(data: {
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  category: string;
  images: string[];
  stock: number;
  sku?: string;
  isFeatured?: boolean;
  tags?: string[];
}): Promise<ProductSummary> {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required");
  }

  return prisma.product.create({ 
    data: {
      ...data,
      rating: 0,
      reviewCount: 0,
      salesCount: 0,
      isActive: true,
    }
  }) as unknown as ProductSummary;
}

export async function updateProduct(
  id: string,
  data: Partial<{
    name: string;
    description: string;
    price: number;
    originalPrice: number;
    category: string;
    images: string[];
    stock: number;
    sku: string;
    isFeatured: boolean;
    isActive: boolean;
    tags: string[];
  }>
): Promise<ProductSummary> {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required");
  }

  return prisma.product.update({ where: { id }, data }) as unknown as ProductSummary;
}

export async function deleteProduct(id: string): Promise<void> {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required");
  }

  await prisma.product.delete({ where: { id } });
}

/* ── Add Product Review ── */
export async function addProductReview(
  productId: string,
  rating: number,
  title?: string,
  body?: string
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized: Login required");

  // Create review
  const review = await prisma.review.create({
    data: {
      productId,
      userId: session.user.id,
      rating,
      title,
      body,
    }
  });

  // Re-calculate product average rating and reviewCount
  const productReviews = await prisma.review.findMany({
    where: { productId },
    select: { rating: true }
  });

  const reviewCount = productReviews.length;
  const avgRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount;

  await prisma.product.update({
    where: { id: productId },
    data: {
      rating: avgRating,
      reviewCount: reviewCount
    }
  });

  return review;
}

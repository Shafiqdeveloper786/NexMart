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
  category: string;
  images: string[];
  stock: number;
  createdAt: Date;
  updatedAt: Date;
};

/* ─────────────────────────────────────────────────────
   READ — safe to call from Server Components directly
───────────────────────────────────────────────────── */

export async function getAllProducts(options?: {
  category?: string;
  limit?: number;
  skip?: number;
}): Promise<ProductSummary[]> {
  const { category, limit, skip = 0 } = options ?? {};

  return prisma.product.findMany({
    where: category ? { category: { equals: category, mode: "insensitive" } } : undefined,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: limit,
    skip,
  });
}

export async function getProductById(id: string): Promise<ProductSummary | null> {
  if (!id || id.length !== 24) return null; // MongoDB ObjectId is 24 hex chars
  return prisma.product.findUnique({ where: { id } });
}

export async function getProductsByCategory(
  category: string,
  limit = 8
): Promise<ProductSummary[]> {
  return prisma.product.findMany({
    where: { category: { equals: category, mode: "insensitive" } },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
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
  });
}

/* ─────────────────────────────────────────────────────
   WRITE — Admin-only mutations (Server Actions)
───────────────────────────────────────────────────── */

export async function createProduct(data: {
  name: string;
  description?: string;
  price: number;
  category: string;
  images: string[];
  stock: number;
}): Promise<ProductSummary> {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required");
  }

  return prisma.product.create({ data });
}

export async function updateProduct(
  id: string,
  data: Partial<{
    name: string;
    description: string;
    price: number;
    category: string;
    images: string[];
    stock: number;
  }>
): Promise<ProductSummary> {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required");
  }

  return prisma.product.update({ where: { id }, data });
}

export async function deleteProduct(id: string): Promise<void> {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required");
  }

  await prisma.product.delete({ where: { id } });
}

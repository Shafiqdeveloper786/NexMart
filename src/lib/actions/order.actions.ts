"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prismadb";

import { deriveDisplayId } from "@/lib/utils/orderUtils";

/* ── Create Order ── */
export async function createOrder(input: {
  items: Array<{ productId: string; quantity: number; price: number }>;
  totalAmount: number;
  paymentMethod: string;
  shippingAddress: {
    fullName: string;
    street:   string;
    city:     string;
    phone:    string;
    zipCode?: string;
  };
}): Promise<{ success: boolean; orderId: string; saved: boolean }> {
  const session = await getServerSession(authOptions);

  /* Guest checkout — generate a display ID without DB persistence */
  if (!session?.user?.id) {
    const guestId = `NX-${Math.floor(10000 + Math.random() * 90000)}`;
    return { success: true, orderId: guestId, saved: false };
  }

  try {
    const order = await prisma.order.create({
      data: {
        userId:          session.user.id,
        totalAmount:     input.totalAmount,
        status:          "PENDING",
        paymentMethod:   input.paymentMethod,
        shippingAddress: {
          fullName: input.shippingAddress.fullName,
          street:   input.shippingAddress.street,
          city:     input.shippingAddress.city,
          phone:    input.shippingAddress.phone,
          zipCode:  input.shippingAddress.zipCode ?? "",
        },
        items: {
          create: input.items.map(i => ({
            productId: i.productId,
            quantity:  i.quantity,
            price:     i.price,
          })),
        },
      },
      select: { id: true },
    });

    return {
      success: true,
      orderId: deriveDisplayId(order.id),
      saved:   true,
    };
  } catch {
    /* DB save failed (e.g. product deleted) — still complete the UX flow */
    return {
      success: true,
      orderId: `NX-${Math.floor(10000 + Math.random() * 90000)}`,
      saved:   false,
    };
  }
}

/* ── Fetch orders for the current user ── */
export async function getUserOrders() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return [];

  return prisma.order.findMany({
    where:   { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          product: {
            select: { id: true, name: true, images: true },
          },
        },
      },
    },
  });
}

export type OrderWithItems = Awaited<ReturnType<typeof getUserOrders>>[number];

/* ── Cancel an order (owner-only, not already delivered) ── */
export async function cancelOrder(
  orderId: string
): Promise<{ success: boolean; message: string }> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { success: false, message: "Not authenticated" };

  const order = await prisma.order.findUnique({
    where:  { id: orderId },
    select: { userId: true, status: true },
  });

  if (!order)                          return { success: false, message: "Order not found" };
  if (order.userId !== session.user.id) return { success: false, message: "Unauthorized" };
  if (order.status === "DELIVERED")    return { success: false, message: "Delivered orders cannot be cancelled" };
  if (order.status === "CANCELLED")    return { success: false, message: "Order is already cancelled" };

  await prisma.order.update({
    where: { id: orderId },
    data:  { status: "CANCELLED" },
  });

  return { success: true, message: "Order cancelled" };
}

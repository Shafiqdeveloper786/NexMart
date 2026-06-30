"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prismadb";

import { sendEmail } from "@/lib/email";

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

    const displayId = deriveDisplayId(order.id);

    // Send confirmation email asynchronously (so it doesn't block redirection)
    const userEmail = session.user.email;
    if (userEmail) {
      sendEmail(
        userEmail,
        `Order Confirmed #${displayId} - NexMart`,
        `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; background: #ffffff; color: #111827;">
          <h2 style="color: #111827; border-bottom: 2px solid #f3f4f6; padding-bottom: 10px;">Order Confirmed!</h2>
          <p>Hi ${input.shippingAddress.fullName || "Valued Customer"},</p>
          <p>Thank you for shopping with <strong>NexMart</strong>. Your order has been successfully placed and is being processed.</p>
          <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb;">
            <p style="margin: 0 0 10px 0;"><strong>Order ID:</strong> #${displayId}</p>
            <p style="margin: 0 0 10px 0;"><strong>Total Amount:</strong> $${input.totalAmount.toFixed(2)}</p>
            <p style="margin: 0;"><strong>Payment Method:</strong> ${input.paymentMethod.toUpperCase()}</p>
          </div>
          <p>You can track the live status of your order anytime by visiting our dispatch tracking terminal at <a href="${process.env.NEXTAUTH_URL}/orders/${order.id}" style="color: #0ea5e9; text-decoration: none;">Track Order #${displayId}</a>.</p>
          <p style="margin-top: 30px; font-size: 12px; color: #9ca3af;">If you have any questions or concerns, feel free to reply to this email or contact us at hello@nexmart.com.</p>
        </div>
        `
      ).catch(err => {
        console.error("Failed to send order confirmation email:", err);
      });
    }

    return {
      success: true,
      orderId: displayId,
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

/* ── Update order status (Admin only) ── */
export async function updateOrderStatus(
  orderId: string,
  status: "PENDING" | "PROCESSING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED"
): Promise<{ success: boolean; message: string }> {
  const session = await getServerSession(authOptions);
  
  // Strict admin check - only ADMIN role can update order status
  if (!session?.user) {
    throw new Error("Unauthorized: Authentication required");
  }
  
  const userRole = (session.user as { role?: string }).role;
  if (userRole !== "ADMIN") {
    throw new Error("Unauthorized: Only administrators can update order status");
  }

  // Verify order exists before updating
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { id: true, status: true }
  });

  if (!order) {
    throw new Error("Order not found");
  }

  // Update only the status field - no other automatic changes
  await prisma.order.update({
    where: { id: orderId },
    data: { 
      status,
      // Explicitly do NOT update any other fields automatically
    },
  });

  // Log the status change (in production, you might want to store this in an audit log)
  console.log(`[ORDER STATUS UPDATE] Order ${orderId} status changed from ${order.status} to ${status} by admin ${session.user.email}`);

  return { success: true, message: `Status updated to ${status}` };
}


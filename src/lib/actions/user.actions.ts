"use server";

import { prisma } from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getAllUsers() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required");
  }

  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
    // Filter out any users with invalid role values (defensive query)
    where: {
      role: {
        in: ["USER", "ADMIN"]
      }
    }
  });
}

export async function toggleUserRole(userId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true }
  });

  if (!user) throw new Error("User not found");

  const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";

  await prisma.user.update({
    where: { id: userId },
    data: { role: newRole }
  });

  return { success: true, role: newRole };
}

export async function deleteUser(userId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required");
  }

  // Prevent deleting yourself
  if (session.user.id === userId) {
    throw new Error("Cannot delete your own account");
  }

  await prisma.user.delete({
    where: { id: userId }
  });

  return { success: true };
}

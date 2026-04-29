/**
 * Database Models and Schemas
 * Re-export Prisma generated models with type safety
 */

export { Prisma } from "@prisma/client";
export type {
  User,
  Account,
  Session,
  VerificationToken,
  Product,
  Order,
  OrderItem,
} from "@prisma/client";

export { OrderStatus, UserRole } from "@prisma/client";


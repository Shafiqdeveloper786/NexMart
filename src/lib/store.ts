import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  category?: string;
  stock?: number;
}

interface CartStore {
  items: CartItem[];
  lastAddedAt: number | null; // epoch ms — used to trigger badge bounce
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      lastAddedAt: null,

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId);
          const updatedItems = existing
            ? state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              )
            : [
                ...state.items,
                { ...item, id: `${item.productId}-${Date.now()}` },
              ];

          return { items: updatedItems, lastAddedAt: Date.now() };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),

      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.productId !== productId)
              : state.items.map((i) =>
                  i.productId === productId ? { ...i, quantity } : i
                ),
        })),

      clearCart: () => set({ items: [], lastAddedAt: null }),

      getCartTotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      getCartItemCount: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "nexmart-cart" }
  )
);

/* ── Wishlist Store ── */
interface WishlistStore {
  items: string[]; // array of productIds
  toggleWishlist: (productId: string) => void;
  hasItem: (productId: string) => boolean;
}

// Custom storage that only hydrates on client-side
const wishlistStorage = createJSONStorage(() => {
  // Return a no-op storage on server
  if (typeof window === "undefined") {
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      length: 0,
      clear: () => {},
      key: () => null,
    } as unknown as Storage;
  }
  return localStorage;
});

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggleWishlist: (productId) => set((state) => {
        const isExist = state.items.includes(productId);
        const updated = isExist
          ? state.items.filter(id => id !== productId)
          : [...state.items, productId];
        return { items: updated };
      }),
      hasItem: (productId) => get().items.includes(productId)
    }),
    { 
      name: "nexmart-wishlist",
      storage: wishlistStorage
    }
  )
);

/* ── UI Modal / QuickView Store ── */
interface UIStore {
  quickViewProductId: string | null;
  setQuickViewProductId: (productId: string | null) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  quickViewProductId: null,
  setQuickViewProductId: (id) => set({ quickViewProductId: id }),
}));

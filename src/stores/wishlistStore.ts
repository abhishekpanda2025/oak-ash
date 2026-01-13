import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DemoProduct } from "@/data/demoProducts";

interface WishlistStore {
  items: DemoProduct[];
  addItem: (item: DemoProduct) => void;
  removeItem: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const { items } = get();
        if (!items.find((i) => i.id === item.id)) {
          set({ items: [...items, item] });
        }
      },
      
      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },
      
      isInWishlist: (id) => {
        return get().items.some((item) => item.id === id);
      },
      
      clearWishlist: () => {
        set({ items: [] });
      },
    }),
    {
      name: "oak-ash-wishlist",
    }
  )
);

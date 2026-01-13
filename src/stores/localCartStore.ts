import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { DemoProduct } from '@/data/demoProducts';

export interface LocalCartItem {
  product: DemoProduct;
  quantity: number;
}

interface LocalCartStore {
  items: LocalCartItem[];
  isOpen: boolean;

  // Actions
  addItem: (product: DemoProduct, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  setOpen: (open: boolean) => void;

  // Computed
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useLocalCartStore = create<LocalCartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, quantity = 1) => {
        const { items } = get();
        const existingItem = items.find(i => i.product.id === product.id);

        if (existingItem) {
          set({
            items: items.map(i =>
              i.product.id === product.id
                ? { ...i, quantity: i.quantity + quantity }
                : i
            ),
          });
        } else {
          set({ items: [...items, { product, quantity }] });
        }
        
        // Open cart drawer after adding
        set({ isOpen: true });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set({
          items: get().items.map(item =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        });
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter(item => item.product.id !== productId),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      setOpen: (open) => set({ isOpen: open }),

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'oak-ash-local-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DemoProduct } from "@/data/demoProducts";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ShopTheLookItem {
  product: DemoProduct;
  image: string;
  addedAt: string;
}

interface WishlistStore {
  items: DemoProduct[];
  shopTheLookItems: ShopTheLookItem[];
  addItem: (item: DemoProduct) => void;
  removeItem: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
  addShopTheLookItem: (item: ShopTheLookItem) => void;
  removeShopTheLookItem: (id: string) => void;
  clearShopTheLook: () => void;
  syncToAccount: (userId: string) => Promise<void>;
  loadFromAccount: (userId: string) => Promise<void>;
  shareOnSocial: (platform: "twitter" | "facebook" | "pinterest" | "copy", productTags?: string[]) => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      shopTheLookItems: [],
      
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

      addShopTheLookItem: (item) => {
        const { shopTheLookItems } = get();
        if (!shopTheLookItems.find((i) => i.product.id === item.product.id)) {
          set({ shopTheLookItems: [...shopTheLookItems, item] });
        }
      },

      removeShopTheLookItem: (id) => {
        set({ shopTheLookItems: get().shopTheLookItems.filter((item) => item.product.id !== id) });
      },

      clearShopTheLook: () => {
        set({ shopTheLookItems: [] });
      },

      syncToAccount: async (userId: string) => {
        const { items, shopTheLookItems } = get();
        try {
          // Sync wishlist items
          for (const item of items) {
            await supabase.from("wishlist_items").upsert({
              user_id: userId,
              product_id: item.id,
              product_title: item.title,
              product_price: item.price,
              product_category: item.category,
              product_material: item.material,
            }, { onConflict: "user_id,product_id" });
          }
          toast.success("Wishlist synced to your account!");
        } catch (error) {
          console.error("Sync error:", error);
          toast.error("Failed to sync wishlist");
        }
      },

      loadFromAccount: async (userId: string) => {
        try {
          const { data, error } = await supabase
            .from("wishlist_items")
            .select("*")
            .eq("user_id", userId);
          
          if (error) throw error;
          
          if (data && data.length > 0) {
            const loadedItems: DemoProduct[] = data.map((item) => ({
              id: item.product_id,
              title: item.product_title,
              price: item.product_price,
              category: item.product_category || "jewelry",
              material: item.product_material || "",
              handle: item.product_id,
              description: "",
              images: [],
              collection: ["saved"],
              care: "",
            }));
            set({ items: loadedItems });
            toast.success("Wishlist loaded from your account!");
          }
        } catch (error) {
          console.error("Load error:", error);
        }
      },

      shareOnSocial: (platform, productTags = []) => {
        const { items, shopTheLookItems } = get();
        const allProducts = [...items, ...shopTheLookItems.map(i => i.product)];
        const tags = productTags.length > 0 ? productTags : allProducts.slice(0, 3).map(p => p.title);
        const tagString = tags.map(t => `#${t.replace(/\s+/g, "")}`).join(" ");
        const shareText = `Check out my OAK & ASH wishlist! 💎✨ ${tagString} #OAKandASH #LuxuryJewelry`;
        const shareUrl = window.location.origin + "/wishlist";

        switch (platform) {
          case "twitter":
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, "_blank");
            break;
          case "facebook":
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`, "_blank");
            break;
          case "pinterest":
            window.open(`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent(shareText)}`, "_blank");
            break;
          case "copy":
            navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
            toast.success("Link copied to clipboard!");
            break;
        }
      },
    }),
    {
      name: "oak-ash-wishlist",
    }
  )
);

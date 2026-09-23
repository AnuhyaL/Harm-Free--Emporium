import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { api } from '@/api';
import type { CartItem, User, WishlistItem } from '@/types';

const storage = createJSONStorage(() => {
  try {
    localStorage.setItem('hfe-probe', '1');
    localStorage.removeItem('hfe-probe');
    return localStorage;
  } catch {
    // Private mode or blocked storage: fall back to in-memory.
    const mem = new Map<string, string>();
    return {
      getItem: (k: string) => mem.get(k) ?? null,
      setItem: (k: string, v: string) => void mem.set(k, v),
      removeItem: (k: string) => void mem.delete(k),
    };
  }
});

const sameLine = (a: CartItem, productId: string, variantId?: string) =>
  a.productId === productId && (a.variantId ?? '') === (variantId ?? '');

// ——— Cart ———

interface CartState {
  items: CartItem[];
  promoCode?: string;
  pointsToRedeem: number;
  /** Increments on every add so Sol can push the cart. */
  addPulse: number;
  lastAddedId?: string;
  add: (productId: string, qty?: number, variantId?: string) => void;
  setQty: (productId: string, variantId: string | undefined, qty: number) => void;
  remove: (productId: string, variantId?: string) => void;
  toggleSaved: (productId: string, variantId?: string) => void;
  setPromo: (code?: string) => void;
  setPointsToRedeem: (n: number) => void;
  clear: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      pointsToRedeem: 0,
      addPulse: 0,
      add: (productId, qty = 1, variantId) =>
        set((s) => {
          const existing = s.items.find((i) => sameLine(i, productId, variantId));
          const items = existing
            ? s.items.map((i) => (i === existing ? { ...i, qty: Math.min(99, i.qty + qty), savedForLater: false } : i))
            : [...s.items, { productId, variantId, qty }];
          return { items, addPulse: s.addPulse + 1, lastAddedId: productId };
        }),
      setQty: (productId, variantId, qty) =>
        set((s) => ({
          items: s.items.map((i) => (sameLine(i, productId, variantId) ? { ...i, qty: Math.max(1, Math.min(99, qty)) } : i)),
        })),
      remove: (productId, variantId) => set((s) => ({ items: s.items.filter((i) => !sameLine(i, productId, variantId)) })),
      toggleSaved: (productId, variantId) =>
        set((s) => ({
          items: s.items.map((i) => (sameLine(i, productId, variantId) ? { ...i, savedForLater: !i.savedForLater } : i)),
        })),
      setPromo: (promoCode) => set({ promoCode }),
      setPointsToRedeem: (pointsToRedeem) => set({ pointsToRedeem }),
      clear: () => set({ items: [], promoCode: undefined, pointsToRedeem: 0 }),
    }),
    {
      name: 'hfe-cart',
      storage,
      partialize: (s) => ({ items: s.items, promoCode: s.promoCode, pointsToRedeem: s.pointsToRedeem }),
    },
  ),
);

export const cartCount = (items: CartItem[]) => items.filter((i) => !i.savedForLater).reduce((n, i) => n + i.qty, 0);

// ——— Auth ———

interface AuthState {
  user: User | null;
  status: 'idle' | 'checking' | 'ready';
  setUser: (u: User | null) => void;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      status: 'idle',
      setUser: (user) => set({ user, status: 'ready' }),
      refresh: async () => {
        set({ status: 'checking' });
        try {
          set({ user: await api.auth.me(), status: 'ready' });
        } catch {
          set({ user: null, status: 'ready' });
        }
      },
      logout: async () => {
        await api.auth.logout().catch(() => undefined);
        set({ user: null, status: 'ready' });
      },
    }),
    { name: 'hfe-auth', storage, partialize: (s) => ({ user: s.user }) },
  ),
);

// ——— Wishlist ———

interface WishlistState {
  items: WishlistItem[];
  toggle: (productId: string) => boolean;
  has: (productId: string) => boolean;
  remove: (productId: string) => void;
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (productId) => {
        const has = get().items.some((i) => i.productId === productId);
        set((s) => ({
          items: has
            ? s.items.filter((i) => i.productId !== productId)
            : [{ productId, addedAt: new Date().toISOString() }, ...s.items],
        }));
        return !has;
      },
      has: (productId) => get().items.some((i) => i.productId === productId),
      remove: (productId) => set((s) => ({ items: s.items.filter((i) => i.productId !== productId) })),
    }),
    { name: 'hfe-wishlist', storage },
  ),
);

// ——— UI ———

export type ThemePref = 'light' | 'dark' | 'system';

interface Toast {
  id: number;
  message: string;
  tone?: 'default' | 'success' | 'error';
  action?: { label: string; href: string };
}

interface UIState {
  theme: ThemePref;
  cartOpen: boolean;
  demoBannerDismissed: boolean;
  toasts: Toast[];
  setTheme: (t: ThemePref) => void;
  setCartOpen: (open: boolean) => void;
  dismissDemoBanner: () => void;
  toast: (message: string, opts?: Omit<Toast, 'id' | 'message'>) => void;
  dismissToast: (id: number) => void;
}

let toastId = 0;

export const useUI = create<UIState>()(
  persist(
    (set) => ({
      theme: 'system',
      cartOpen: false,
      demoBannerDismissed: false,
      toasts: [],
      setTheme: (theme) => set({ theme }),
      setCartOpen: (cartOpen) => set({ cartOpen }),
      dismissDemoBanner: () => set({ demoBannerDismissed: true }),
      toast: (message, opts) => {
        const id = ++toastId;
        set((s) => ({ toasts: [...s.toasts.slice(-2), { id, message, ...opts }] }));
        setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 4500);
      },
      dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
    }),
    { name: 'hfe-ui', storage, partialize: (s) => ({ theme: s.theme, demoBannerDismissed: s.demoBannerDismissed }) },
  ),
);

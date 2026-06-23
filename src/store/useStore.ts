import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ID, Product } from '../api/mocks/products';

type ThemeType = 'light' | 'dark';

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
  status: 'processing' | 'shipping' | 'delivered';
  address: string;
}

interface StoreState {
  // Тема
  theme: ThemeType;
  toggleTheme: () => void;

  // Выбранная модель телефона
  selectedPhoneModelId: ID | null;
  setSelectedPhoneModelId: (id: ID | null) => void;

  // Корзина
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: ID) => void;
  increaseQuantity: (productId: ID) => void;
  decreaseQuantity: (productId: ID) => void;
  clearCart: () => void;
  getCartTotal: () => number;

  // Избранное
  favorites: ID[];
  toggleFavorite: (productId: ID) => void;

  // Заказы
  orders: Order[];
  addOrder: (address: string) => void;

  // Онбординг
  hasSeenOnboarding: boolean;
  setHasSeenOnboarding: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // ── Тема ──
      theme: 'dark',
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),

      // ── Избранное ──
      favorites: [],
      toggleFavorite: (productId) => set((state) => {
        const isFaved = state.favorites.includes(productId);
        return {
          favorites: isFaved
            ? state.favorites.filter(id => id !== productId)
            : [...state.favorites, productId]
        };
      }),

      // ── Выбор устройства ──
      selectedPhoneModelId: null,
      setSelectedPhoneModelId: (id) => set({ selectedPhoneModelId: id }),

      // ── Корзина ──
      cart: [],
      addToCart: (product) => set((state) => {
        const existing = state.cart.find(item => item.id === product.id);
        if (existing) {
          return { cart: state.cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) };
        }
        return { cart: [...state.cart, { ...product, quantity: 1 }] };
      }),
      removeFromCart: (productId) => set((state) => ({
        cart: state.cart.filter(item => item.id !== productId)
      })),
      increaseQuantity: (productId) => set((state) => ({
        cart: state.cart.map(item => item.id === productId ? { ...item, quantity: item.quantity + 1 } : item)
      })),
      decreaseQuantity: (productId) => set((state) => ({
        cart: state.cart.map(item => {
          if (item.id === productId) {
            return { ...item, quantity: Math.max(1, item.quantity - 1) };
          }
          return item;
        })
      })),
      clearCart: () => set({ cart: [] }),
      getCartTotal: () => {
        const cart = get().cart;
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
      },

      // ── Заказы ──
      orders: [],
      addOrder: (address) => set((state) => {
        const total = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const newOrder: Order = {
          id: `order-${Date.now()}`,
          items: [...state.cart],
          total,
          date: new Date().toISOString(),
          status: 'processing',
          address,
        };
        return {
          orders: [newOrder, ...state.orders],
          cart: [],
        };
      }),

      // ── Онбординг ──
      hasSeenOnboarding: false,
      setHasSeenOnboarding: () => set({ hasSeenOnboarding: true }),
    }),
    {
      name: 'gadgetx-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

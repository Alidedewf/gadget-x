import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ID, Product } from '../api/mocks/products';

type ThemeType = 'light' | 'dark';

export interface CartItem extends Product {
  quantity: number;
}

interface StoreState {
  theme: ThemeType;
  toggleTheme: () => void;

  selectedPhoneModelId: ID | null;
  setSelectedPhoneModelId: (id: ID | null) => void;

  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: ID) => void;
  increaseQuantity: (productId: ID) => void;
  decreaseQuantity: (productId: ID) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  favorites: ID[];
  toggleFavorite: (productId: ID) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),

      favorites: [],
      toggleFavorite: (productId) => set((state) => {
        const isFaved = state.favorites.includes(productId);
        return {
          favorites: isFaved 
            ? state.favorites.filter(id => id !== productId) 
            : [...state.favorites, productId]
        };
      }),

  selectedPhoneModelId: null,
  setSelectedPhoneModelId: (id) => set({ selectedPhoneModelId: id }),

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
        return cart.reduce((total, item) => {
          const numPrice = parseFloat(item.price.toString().replace(/\s/g, ''));
          const dollarPrice = numPrice / 450;
          return total + (dollarPrice * item.quantity);
        }, 0);
      }
    }),
    {
      name: 'gadgetx-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

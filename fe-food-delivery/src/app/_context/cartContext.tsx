"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import type { CartItem } from "@/app/types"; 

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (foodId: string) => void;
  clearCart: () => void;
  updateQuantity: (foodId: string, quantity: number) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);

        if (Array.isArray(parsed)) {
          const normalized = parsed.map((item: any): CartItem => ({
            ...item,
            ingredients:
              typeof item.ingredients === "string"
                ? item.ingredients.split(",").map((s: string) => s.trim())
                : Array.isArray(item.ingredients)
                ? item.ingredients
                : [],
          }));
          setCart(normalized);
        }
      } catch (e) {
        console.error(" Failed to parse cart from localStorage:", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const exists = prev.find((i) => i.foodId === item.foodId);

      let updatedCart: CartItem[];
      if (exists) {
        updatedCart = prev.map((i) =>
          i.foodId === item.foodId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      } else {
        updatedCart = [...prev, item];
      }

      console.groupCollapsed("🛒 addToCart");
      console.log("▶ New item:", item);
      console.log(" Updated cart:", updatedCart);
      console.groupEnd();

      return updatedCart;
    });
  };

  const removeFromCart = (foodId: string) => {
    setCart((prev) => prev.filter((i) => i.foodId !== foodId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const updateQuantity = (foodId: string, quantity: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.foodId === foodId ? { ...item, quantity } : item
      )
    );
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, updateQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
}

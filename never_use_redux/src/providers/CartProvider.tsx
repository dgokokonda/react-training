"use client";

import { createContext, useEffect, useState } from "react";

type CartContextType = {
  cart: number[];
  addToCart: (productId: number) => void;
  removeFromCart: (productId: number) => number[];
  clearCart: () => void;
};

export const CartContext = createContext<CartContextType | undefined>(
  undefined,
);

function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<number[]>([]);
  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("cart") || "[]"));
  }, []);

  const addToCart = (productId: number) => {
    setCart((prevCart) => {
      const newCart = [...prevCart, productId];
      localStorage.setItem("cart", JSON.stringify(newCart));
      return newCart;
    });
  };

  const removeFromCart = (productId: number) => {
    const newCart = cart.filter((pId) => pId !== productId);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    return newCart;
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  const contextValue = { cart, addToCart, removeFromCart, clearCart };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
}

export default CartProvider;

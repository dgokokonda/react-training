"use client";

import { CartContext } from "@/providers/CartProvider";
import { useContext } from "react";

const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a ContextProvider");
  }
  return context;
};

export default useCart;

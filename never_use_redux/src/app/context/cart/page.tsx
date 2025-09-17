"use client";

import useCart from "@/hooks/useCart";
import { useEffect, useCallback } from "react";

function ContextPage() {
  const { cart, addToCart, removeFromCart, clearCart } = useCart()

  useEffect(() => {
    addToCart(1)
    setTimeout(() => addToCart(2), 100)

  }, []);

  const handleAddButtonClick = () => {
    const prodId = cart.length ? cart[cart.length - 1] : 0
    addToCart(prodId + 1)
  }

  const handleRemoveButtonClick = () => {
    if (cart.length) removeFromCart(cart[cart.length - 1])
  }

  return (
    <>
      <button onClick={useCallback(() => handleAddButtonClick(), [cart])}>Add to cart</button>
      <button disabled={!cart.length} onClick={useCallback(() => handleRemoveButtonClick(), [cart])} className={!cart.length ? 'text-amber-100' : ''}>Remove from cart</button>
      <button disabled={!cart.length} onClick={useCallback(() => clearCart(), [cart])} className={!cart.length ? 'text-amber-100' : ''}>Clear cart</button>
      <p>{JSON.stringify(cart)}</p>
    </>
  );
}

export default ContextPage;

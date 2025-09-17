import CartProvider from "@/providers/CartProvider";

export default function ContextLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <CartProvider>{children}</CartProvider>;
}

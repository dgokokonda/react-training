import ReduxProvider from "@/providers/ReduxProvider";

export default function ReduxLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ReduxProvider>{children}</ReduxProvider>;
}

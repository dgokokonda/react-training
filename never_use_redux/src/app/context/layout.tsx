import GlobalStateProvider from "@/providers/GlobalStateProvider";

export default function ContextLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <GlobalStateProvider>{children}</GlobalStateProvider>;
}

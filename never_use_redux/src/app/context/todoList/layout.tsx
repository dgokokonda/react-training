import TodoListProvider from "@/providers/TodoListProvider";

export default function ContextLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <TodoListProvider>{children}</TodoListProvider>;
}

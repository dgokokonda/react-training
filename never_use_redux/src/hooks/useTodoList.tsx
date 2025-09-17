'use client';

import { useContext } from "react";
import { TodoListContext } from "@/providers/TodoListProvider";

const useTodoList = () => {
  const context = useContext(TodoListContext)
  if (!context) {
    throw new Error('useTodoList must be used within a ContextProvider');
  }
  return context
}

export default useTodoList;
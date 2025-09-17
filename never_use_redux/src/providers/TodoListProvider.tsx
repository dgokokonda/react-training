'use client';

import { createContext, useState } from 'react'
import { TodoType } from '@/types';

type TodoListContextType = {
  todoList: TodoType[] | [];
  addTodo: (todo: TodoType) => void;
  removeTodo: (todo: TodoType) => TodoType[];
  resetTodoList: () => void;
}

export const TodoListContext = createContext<TodoListContextType | undefined>(undefined)

function TodoListProvider({ children }: { children: React.ReactNode }) {
  const [todoList, setTodoList] = useState<TodoType[]>([])

  const addTodo = (todo: TodoType) => {
    setTodoList((prevList) => {
      const newTodoList = [...prevList, todo]
      return newTodoList
    })
  }

  const removeTodo = (todo: TodoType) => {
    const newTodoList = todoList.filter(({ id }) => id !== todo.id)
    setTodoList(newTodoList)
    return newTodoList
  }

  const resetTodoList = () => {
    setTodoList([])
  }

  const contextValue = { todoList, addTodo, removeTodo, resetTodoList }

  return <TodoListContext.Provider value={contextValue}>{children}</TodoListContext.Provider>
}

export default TodoListProvider;

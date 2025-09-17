"use client";

import useTodoList from "@/hooks/useTodoList";
import { useEffect, useCallback } from "react";
import { TodoType } from '@/types';

function ContextPage() {
  const { todoList, addTodo, resetTodoList } = useTodoList()

  useEffect(() => {
    const date = new Date()
    addTodo({
      id: 1,
      name: 'Test 1',
      done: true,
      createdAt: date.toLocaleString()
    })

  }, []);

  const handleAddTodo = () => {
    const date = new Date()
    const id = todoList.length ? todoList[todoList.length - 1].id : 0
    addTodo({
      id: id + 1,
      name: 'Test ' + (id + 1),
      done: false,
      createdAt: date.toLocaleString()
    })
  }

  return (
    <>
      <button onClick={useCallback(() => handleAddTodo(), [todoList])}>Add todo</button>
      <button disabled={!todoList.length} onClick={useCallback(() => resetTodoList(), [todoList])} className={!todoList.length ? 'text-amber-100' : ''}>Clear todoList</button>
      <p>{todoList.map((todo: TodoType) => JSON.stringify(todo))}</p>
    </>
  );
}

export default ContextPage;

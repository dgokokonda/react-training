"use client";
import { useState } from "react";
import { Dialog } from "@/components/dialog";

export default function TodoList() {
  const [text, setText] = useState("");
  const [todoList, setTodo] = useState([]);
  const [errorStatus, setErrorStatus] = useState(false);
  // const todoList = [
  //   { id: 1, name: "Todo task 1" },
  //   { id: 2, name: "Todo task 2" },
  // ];

  function addTodo() {
    if (!text) {
      setErrorStatus(true);
      return;
    }

    if (errorStatus) setErrorStatus(false);
    setText("");
    setTodo([...todoList, { id: Date.now(), name: text }]);
  }

  return (
    <div className="todo-list p-5 text-center">
      <Dialog width="md" isOpen={true} onClose={() => console.log("close")}>
        <Dialog.Header>Добро пожаловать в TodoList</Dialog.Header>
        <Dialog.Body>...содержимое</Dialog.Body>
        <Dialog.Footer>
          <button className="size-sm bg-lime-500 p-4">Close</button>
        </Dialog.Footer>
      </Dialog>
      <h2>Todolist page</h2>
      <div>
        <input
          type="text"
          placeholder="todo's name"
          value={text}
          required
          className={`text-black ${
            !!errorStatus
              ? "bg-red-300 border-rose-500"
              : "border-white bg-white"
          }`}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          className="bg-lime-700 text-lime-200 size-16"
          onClick={() => addTodo()}
        >
          Add todo
        </button>
      </div>
      <div className="todo-list__list p-24">
        {todoList.map((item) => (
          <div className="todo-list__item" key={item.id}>
            Todo: {item.name}
          </div>
        ))}
      </div>
    </div>
  );
}

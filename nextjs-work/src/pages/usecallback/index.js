import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";

// Компонент элемента списка (должен быть оптимизирован)
const ListItem = React.memo(({ item, index, onItemClick, onItemEdit }) => {
  console.log(`Рендер ListItem: ${item.id}`);

  const handleItemClick = useCallback(() => {
    onItemClick(item);
  }, [onItemClick, item]);

  const handleItemEdit = useCallback(() => {
    onItemEdit(item.id);
  }, [item.id, onItemEdit]);

  return (
    <div
      className="list-item"
      style={{
        height: "60px",
        borderBottom: "1px solid #eee",
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
      }}
    >
      <span style={{ width: "50px" }}>#{index + 1}</span>
      <span style={{ flex: 1 }}>{item.name}</span>
      <span style={{ width: "80px" }}>{item.age} лет</span>

      <div style={{ display: "flex", gap: "8px" }}>
        <button onClick={handleItemClick} className="btn-info">
          👁️
        </button>
        <button onClick={handleItemEdit} className="btn-edit">
          ✏️
        </button>
      </div>
    </div>
  );
});

ListItem.displayName = "ListItem";

// Виртуальный список
function VirtualList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [scrollTop, setScrollTop] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const containerRef = useRef(null);
  const itemHeight = 60;
  const visibleCount = 20;
  const buffer = 5;

  // ✅ Используем ref для items.length чтобы избежать зависимости
  const itemsRef = useRef(items);
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  // Загрузка данных
  const loadMoreItems = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    // Имитация API запроса
    setTimeout(() => {
      const currentItems = itemsRef.current; // ✅ Используем ref
      const newItems = Array.from({ length: 50 }, (_, i) => ({
        id: currentItems.length + i + 1,
        name: `Пользователь ${currentItems.length + i + 1}`,
        age: Math.floor(Math.random() * 50) + 18,
        email: `user${currentItems.length + i + 1}@example.com`,
      }));

      setItems((prev) => [...prev, ...newItems]);
      setHasMore(currentItems.length + newItems.length < 1000); // Ограничим 1000 элементов
      setLoading(false);
    }, 500);
  }, [hasMore, loading]); // ✅ Убрали items.length из зависимостей

  // Обработчик скролла
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    setScrollTop(scrollTop);

    // Проверка на достижение конца списка
    if (scrollHeight - scrollTop - clientHeight < 100 && !loading && hasMore) {
      loadMoreItems();
    }
  }, [hasMore, loadMoreItems, loading]);

  // Обработчик клика по элементу
  const handleItemClick = useCallback((item) => {
    setSelectedItem(item);
    console.log("Выбран элемент:", item);
  }, []);

  // Обработчик редактирования
  const handleItemEdit = useCallback((itemId) => {
    setEditingId(itemId);
    console.log("Редактирование элемента:", itemId);
  }, []);

  // Обновление элемента
  // ✅ Раздельные мемоизированные функции
  const updateItem = useCallback((itemId, newData) => {
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, ...newData } : item))
    );
    setEditingId(null);
  }, []);

  const deleteItem = useCallback((itemId) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingId(null);
  }, []);

  // ✅ Мемоизация editingItem
  const editingItem = useMemo(
    () => items.find((item) => item.id === editingId),
    [items, editingId] // ✅ Правильные зависимости
  );

  // Виртуализация - вычисление видимых элементов
  // const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer);
  // const endIndex = Math.min(
  //   items.length - 1,
  //   startIndex + visibleCount + buffer * 2
  // );

  // const visibleItems = items.slice(startIndex, endIndex + 1);
  // ✅ Мемоизация виртуализации
  const { startIndex, endIndex, visibleItems } = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer);
    const endIndex = Math.min(
      items.length - 1,
      startIndex + visibleCount + buffer * 2
    );
    const visibleItems = items.slice(startIndex, endIndex + 1);

    return { startIndex, endIndex, visibleItems };
  }, [scrollTop, items, itemHeight, buffer, visibleCount]);

  // ✅ Мемоизация статистики
  const listStats = useMemo(
    () => ({
      total: items.length,
      visible: visibleItems.length,
      hasMore,
    }),
    [items.length, visibleItems.length, hasMore]
  );

  // Первоначальная загрузка
  useEffect(() => {
    loadMoreItems();
  }, [loadMoreItems]);

  return (
    <div className="virtual-list-container">
      <div className="list-header">
        <h2>Виртуальный список ({listStats.total} элементов)</h2>
        {selectedItem && (
          <div className="selected-info">
            Выбран: {selectedItem.name} ({selectedItem.age} лет)
          </div>
        )}
      </div>

      <div
        ref={containerRef}
        className="list-container"
        onScroll={handleScroll}
        style={{
          height: "600px",
          overflow: "auto",
          border: "1px solid #ccc",
        }}
      >
        <div
          className="list-content"
          style={{
            height: `${items.length * itemHeight}px`,
            position: "relative",
          }}
        >
          {visibleItems.map((item, index) => (
            <div
              key={item.id}
              style={{
                position: "absolute",
                top: `${(startIndex + index) * itemHeight}px`,
                left: 0,
                right: 0,
                height: `${itemHeight}px`,
              }}
            >
              <ListItem
                item={item}
                index={startIndex + index}
                onItemClick={handleItemClick}
                onItemEdit={handleItemEdit}
              />
            </div>
          ))}
        </div>

        {loading && <div className="loading-indicator">Загрузка...</div>}
      </div>

      <div className="list-controls">
        <button onClick={loadMoreItems} disabled={loading || !hasMore}>
          {loading ? "Загрузка..." : "Загрузить еще"}
        </button>
        <span>
          Показано: {listStats.visible} из {listStats.total}
        </span>
        {!hasMore && <span>Все элементы загружены</span>}
      </div>

      {editingId && editingItem && (
        <EditModal
          item={editingItem}
          onSave={updateItem}
          onCancel={cancelEdit}
          onDelete={deleteItem}
        />
      )}
    </div>
  );
}

// Модальное окно редактирования (упрощенное)
const EditModal = React.memo(({ item, onSave, onCancel, onDelete }) => {
  const [formData, setFormData] = useState(item);

  const handleSave = useCallback(() => {
    onSave(item.id, formData);
  }, [formData, item.id, onSave]);

  const handleDelete = useCallback(() => {
    onDelete(item.id);
  }, [item.id, onDelete]);

  const handleNameChange = useCallback((e) => {
    setFormData((prev) => ({ ...prev, name: e.target.value }));
  }, []);

  const handleAgeChange = useCallback((e) => {
    setFormData((prev) => ({ ...prev, age: parseInt(e.target.value) || 0 }));
  }, []);

  if (!item) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Редактирование</h3>
        <input value={formData.name} onChange={handleNameChange} />
        <input type="number" value={formData.age} onChange={handleAgeChange} />
        <div className="modal-actions">
          <button onClick={handleSave}>Сохранить</button>
          <button onClick={handleDelete}>Удалить</button>
          <button onClick={onCancel}>Отмена</button>
        </div>
      </div>
    </div>
  );
});

EditModal.displayName = "EditModal";

export default VirtualList;

// import React, { useCallback, useMemo, useState } from "react";

// // Компонент поля формы (должен быть оптимизирован)
// const FormField = React.memo(
//   ({ field, index, onChange, onRemove, onAddMore }) => {
//     console.log(`Рендер FormField: ${field.id}`);

//     const hasError = field.error && field.touched;

//     // ✅ Локальные обработчики для стабильности
//     const handleChange = useCallback(
//       (e) => {
//         onChange(field.id, e.target.value);
//       },
//       [field.id, onChange]
//     );

//     const handleBlur = useCallback(() => {
//       onChange(field.id, field.value, true);
//     }, [field.id, field.value, onChange]);

//     const handleRemove = useCallback(() => {
//       onRemove(field.id);
//     }, [field.id, onRemove]);

//     const handleAddMore = useCallback(() => {
//       onAddMore(field.id);
//     }, [field.id, onAddMore]);

//     return (
//       <div className="form-field">
//         <div className="field-header">
//           <h3>Поле {index + 1}</h3>
//           <button type="button" onClick={handleRemove} className="btn-remove">
//             Удалить
//           </button>
//         </div>

//         <input
//           type="text"
//           value={field.value}
//           onChange={handleChange}
//           placeholder="Введите текст..."
//           className={hasError ? "error" : ""}
//           onBlur={handleBlur}
//         />

//         {hasError && <span className="error-text">{field.error}</span>}

//         <button type="button" onClick={handleAddMore} className="btn-add-more">
//           Добавить еще поле после этого
//         </button>
//       </div>
//     );
//   }
// );

// FormField.displayName = "FormField";

// // Основной компонент формы
// function DynamicForm() {
//   const [fields, setFields] = useState([
//     { id: 1, value: "", error: "", touched: false },
//   ]);

//   // Валидация поля
//   const validateField = useCallback((value) => {
//     if (!value.trim()) return "Поле обязательно для заполнения";
//     if (value.length < 3) return "Минимум 3 символа";
//     if (value.length > 20) return "Максимум 20 символов";
//     return "";
//   }, []);

//   // Обработчик изменения поля
//   const handleFieldChange = useCallback(
//     (fieldId, newValue, isBlur = false) => {
//       setFields((prev) =>
//         prev.map((field) => {
//           if (field.id === fieldId) {
//             const error = isBlur ? validateField(newValue) : "";
//             return {
//               ...field,
//               value: newValue,
//               error,
//               touched: field.touched || isBlur,
//             };
//           }
//           return field;
//         })
//       );
//     },
//     [validateField]
//   );

//   // Добавление нового поля
//   const addField = useCallback((afterId = null) => {
//     const newField = {
//       id: Date.now(),
//       value: "",
//       error: "",
//       touched: false,
//     };

//     setFields((prev) => {
//       if (afterId) {
//         const index = prev.findIndex((f) => f.id === afterId);
//         return [
//           ...prev.slice(0, index + 1),
//           newField,
//           ...prev.slice(index + 1),
//         ];
//       }
//       return [...prev, newField];
//     });
//   }, []);

//   // Удаление поля
//   const removeField = useCallback(
//     (fieldId) => {
//       if (fields.length > 1) {
//         setFields((prev) => prev.filter((field) => field.id !== fieldId));
//       }
//     },
//     [fields.length]
//   );

//   // Отправка формы
//   const handleSubmit = useCallback(
//     (e) => {
//       e.preventDefault();

//       // Валидация всех полей
//       const validatedFields = fields.map((field) => ({
//         ...field,
//         error: validateField(field.value),
//         touched: true,
//       }));

//       setFields(validatedFields);

//       const isValid = validatedFields.every((field) => !field.error);
//       if (isValid) {
//         console.log(
//           "Форма валидна! Данные:",
//           fields.map((f) => f.value)
//         );
//         alert("Форма отправлена успешно!");
//       } else {
//         alert("Есть ошибки в форме!");
//       }
//     },
//     [validateField, fields]
//   );

//   // Проверка валидности формы
//   const { isFormValid, memoizedListCount } = useMemo(() => {
//     const isFormValid = fields.every(
//       (field) => !field.error && field.value.trim()
//     );
//     const memoizedListCount = fields.filter(
//       (f) => !f.error && f.value.trim()
//     ).length;

//     return { isFormValid, memoizedListCount };
//   }, [fields]);

//   return (
//     <form className="dynamic-form" onSubmit={handleSubmit}>
//       <h2>Динамическая форма</h2>
//       <p>Добавляйте и удаляйте поля динамически</p>

//       <div className="fields-container">
//         {fields.map((field, index) => (
//           <FormField
//             key={field.id}
//             field={field}
//             index={index}
//             onChange={handleFieldChange}
//             onRemove={removeField}
//             onAddMore={addField}
//           />
//         ))}
//       </div>

//       <div className="form-actions">
//         <button type="button" onClick={() => addField()} className="btn-add">
//           + Добавить поле в конец
//         </button>

//         <button type="submit" disabled={!isFormValid} className="btn-submit">
//           Отправить форму
//         </button>
//       </div>

//       <div className="form-stats">
//         <span>Полей: {fields.length}</span>
//         <span>Валидных: {memoizedListCount}</span>
//       </div>
//     </form>
//   );
// }

// export default DynamicForm;

// =============================

// import React, { useState, useEffect, useCallback, useMemo } from "react";

// // Компонент задачи (уже оптимизирован с React.memo)
// const TodoItem = React.memo(({ todo, onToggle, onDelete }) => {
//   console.log(`Рендер TodoItem: ${todo.id}`);

//   return (
//     <div className="todo-item">
//       <input
//         type="checkbox"
//         checked={todo.completed}
//         onChange={() => onToggle(todo.id)}
//       />
//       <span
//         style={{
//           textDecoration: todo.completed ? "line-through" : "none",
//         }}
//       >
//         {todo.text}
//       </span>
//       <button onClick={() => onDelete(todo.id)}>Удалить</button>
//     </div>
//   );
// });

// TodoItem.displayName = "TodoItem";

// // Основной компонент с оптимизацией
// function TodoList() {
//   const [todos, setTodos] = useState([
//     { id: 1, text: "Изучить React", completed: false },
//     { id: 2, text: "Написать приложение", completed: true },
//     { id: 3, text: "Оптимизировать код", completed: false },
//   ]);

//   const [filter, setFilter] = useState("all");
//   const [newTodo, setNewTodo] = useState("");

//   // ✅ Оптимизированная функция добавления задачи
//   const addTodo = useCallback(() => {
//     if (newTodo.trim()) {
//       setTodos((prev) => [
//         ...prev,
//         {
//           id: Date.now(),
//           text: newTodo,
//           completed: false,
//         },
//       ]);
//       setNewTodo("");
//     }
//   }, [newTodo]); // Зависимость: newTodo

//   // ✅ Оптимизированная функция переключения статуса
//   const toggleTodo = useCallback((id) => {
//     setTodos((prev) =>
//       prev.map((todo) =>
//         todo.id === id ? { ...todo, completed: !todo.completed } : todo
//       )
//     );
//   }, []); // Нет зависимостей - setTodos стабилен

//   // ✅ Оптимизированная функция удаления
//   const deleteTodo = useCallback((id) => {
//     setTodos((prev) => prev.filter((todo) => todo.id !== id));
//   }, []); // Нет зависимостей - setTodos стабилен

//   // ✅ Оптимизированная функция изменения фильтра
//   const setFilterHandler = useCallback((newFilter) => {
//     setFilter(newFilter);
//   }, []);

//   // ✅ Мемоизированная фильтрация задач
//   const filteredTodos = useMemo(() => {
//     console.log("Вычисление filteredTodos");
//     return todos.filter((todo) => {
//       if (filter === "active") return !todo.completed;
//       if (filter === "completed") return todo.completed;
//       return true;
//     });
//   }, [todos, filter]); // Пересчитываем только при изменении todos или filter

//   // ✅ Мемоизированная статистика
//   const stats = useMemo(() => {
//     const totalTodos = todos.length;
//     const completedTodos = todos.filter((todo) => todo.completed).length;
//     const activeTodos = totalTodos - completedTodos;

//     return { totalTodos, completedTodos, activeTodos };
//   }, [todos]);

//   // Обработчик нажатия Enter
//   const handleKeyPress = useCallback(
//     (e) => {
//       if (e.key === "Enter") {
//         addTodo();
//       }
//     },
//     [addTodo]
//   ); // Зависимость: addTodo

//   // Обработчик изменения input
//   const handleInputChange = useCallback((e) => {
//     setNewTodo(e.target.value);
//   }, []);

//   return (
//     <div className="todo-app">
//       <h1>Список задач ({stats.totalTodos})</h1>

//       <div className="stats">
//         <span>Активные: {stats.activeTodos}</span>
//         <span>Завершенные: {stats.completedTodos}</span>
//       </div>

//       <div className="add-todo">
//         <input
//           value={newTodo}
//           onChange={handleInputChange}
//           placeholder="Новая задача..."
//           onKeyPress={handleKeyPress}
//         />
//         <button onClick={addTodo}>Добавить</button>
//       </div>

//       <div className="filters">
//         <button
//           className={filter === "all" ? "active" : ""}
//           onClick={() => setFilterHandler("all")}
//         >
//           Все
//         </button>
//         <button
//           className={filter === "active" ? "active" : ""}
//           onClick={() => setFilterHandler("active")}
//         >
//           Активные
//         </button>
//         <button
//           className={filter === "completed" ? "active" : ""}
//           onClick={() => setFilterHandler("completed")}
//         >
//           Завершенные
//         </button>
//       </div>

//       <div className="todo-list">
//         {filteredTodos.map((todo) => (
//           <TodoItem
//             key={todo.id}
//             todo={todo}
//             onToggle={toggleTodo}
//             onDelete={deleteTodo}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

// export default TodoList;

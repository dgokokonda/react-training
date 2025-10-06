"use client"; // Важно: указываем что это клиентский компонент

import { useState, useRef, useCallback, useEffect } from "react";

function DraggableList() {
  const [items, setItems] = useState([
    { id: 1, x: 50, y: 50, width: 200, height: 100, content: "Element 1" },
    { id: 2, x: 300, y: 80, width: 180, height: 120, content: "Element 2" },
    { id: 3, x: 100, y: 250, width: 220, height: 80, content: "Element 3" },
    { id: 4, x: 350, y: 300, width: 150, height: 150, content: "Element 4" },
  ]);

  const [activeItem, setActiveItem] = useState(null);
  const [dragType, setDragType] = useState(null);
  const [isClient, setIsClient] = useState(false); // Флаг для проверки клиентской стороны

  const dragStartRef = useRef({ x: 0, y: 0 });
  const itemStartRef = useRef({ x: 0, y: 0, width: 0, height: 0 });

  // Проверяем что мы на клиенте
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Обработчик начала перетаскивания
  const handleDragStart = useCallback(
    (e, itemId, type) => {
      e.preventDefault();
      setActiveItem(itemId);
      setDragType(type);
      dragStartRef.current = { x: e.clientX, y: e.clientY };

      const item = items.find((item) => item.id === itemId);
      if (item) {
        itemStartRef.current = {
          x: item.x,
          y: item.y,
          width: item.width,
          height: item.height,
        };
      }
    },
    [items]
  );

  // Обработчик перемещения
  const handleDrag = useCallback(
    (e) => {
      if (!activeItem || !dragType) return;

      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;

      setItems((prev) =>
        prev.map((item) => {
          if (item.id !== activeItem) return item;

          if (dragType === "move") {
            return {
              ...item,
              x: itemStartRef.current.x + deltaX,
              y: itemStartRef.current.y + deltaY,
            };
          } else if (dragType === "resize") {
            return {
              ...item,
              width: Math.max(100, itemStartRef.current.width + deltaX),
              height: Math.max(50, itemStartRef.current.height + deltaY),
            };
          }
          return item;
        })
      );
    },
    [activeItem, dragType]
  );

  // Обработчик окончания перетаскивания
  const handleDragEnd = useCallback(() => {
    setActiveItem(null);
    setDragType(null);
  }, []);

  // Добавление нового элемента
  const addNewItem = useCallback(() => {
    const newItem = {
      id: Date.now(),
      x: Math.random() * 400,
      y: Math.random() * 400,
      width: 150 + Math.random() * 100,
      height: 80 + Math.random() * 70,
      content: `Element ${items.length + 1}`,
    };
    setItems((prev) => [...prev, newItem]);
  }, [items.length]);

  // Удаление элемента
  const removeItem = useCallback((itemId) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  }, []);

  // Глобальные обработчики событий мыши - ТОЛЬКО на клиенте
  useEffect(() => {
    if (!isClient) return; // Не выполняем на сервере

    const handleMouseMove = (e) => handleDrag(e);
    const handleMouseUp = () => handleDragEnd();

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isClient, handleDrag, handleDragEnd]);

  // Показываем заглушку пока не загрузился клиент
  if (!isClient) {
    return (
      <div className="draggable-list-container">
        <div className="controls">
          <h1>Draggable & Resizable Elements</h1>
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="draggable-list-container">
      <div className="controls">
        <h1>Draggable & Resizable Elements</h1>
        <button onClick={addNewItem} className="add-button">
          + Add New Element
        </button>
        <div className="instructions">
          <p>
            🖱️ <strong>Drag</strong> element to move |{" "}
            <strong>Drag corner</strong> to resize
          </p>
        </div>
      </div>

      <div className="workspace">
        {items.map((item) => (
          <DraggableElement
            key={item.id}
            item={item}
            isActive={activeItem === item.id}
            onDragStart={handleDragStart}
            onRemove={removeItem}
          />
        ))}
      </div>

      <div className="stats">
        Total elements: {items.length} | Active:{" "}
        {activeItem
          ? `Element ${items.findIndex((i) => i.id === activeItem) + 1}`
          : "None"}
      </div>
    </div>
  );
}

// Компонент перетаскиваемого элемента
function DraggableElement({ item, isActive, onDragStart, onRemove }) {
  return (
    <div
      className={`draggable-element ${isActive ? "active" : ""}`}
      style={{
        left: `${item.x}px`,
        top: `${item.y}px`,
        width: `${item.width}px`,
        height: `${item.height}px`,
      }}
    >
      {/* Заголовок для перемещения */}
      <div
        className="element-header"
        onMouseDown={(e) => onDragStart(e, item.id, "move")}
      >
        <span className="element-title">{item.content}</span>
        <button
          className="remove-button"
          onClick={() => onRemove(item.id)}
          title="Remove element"
        >
          ×
        </button>
      </div>

      {/* Контент элемента */}
      <div className="element-content">
        <p>
          Size: {Math.round(item.width)}×{Math.round(item.height)}
        </p>
        <p>
          Position: {Math.round(item.x)},{Math.round(item.y)}
        </p>
      </div>

      {/* Угол для изменения размера */}
      <div
        className="resize-handle"
        onMouseDown={(e) => onDragStart(e, item.id, "resize")}
        title="Drag to resize"
      />
    </div>
  );
}

export default DraggableList;

// hooks/useVirtualScroll.js
import { useState, useEffect, useRef, useCallback } from "react";

export function useVirtualScroll(itemHeight, containerHeight, totalItems) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef(null);

  // Вычисляем видимые элементы
  const startIndex = Math.floor(scrollTop / itemHeight);
  const visibleItemCount = Math.ceil(containerHeight / itemHeight);
  const endIndex = Math.min(startIndex + visibleItemCount + 5, totalItems - 1);

  const visibleItems = Array.from(
    { length: endIndex - startIndex + 1 },
    (_, index) => startIndex + index
  );

  // Обработчик скролла
  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop);
    }
  }, []);

  // Подписываемся на скролл
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  return {
    containerRef,
    visibleItems,
    startIndex,
    totalHeight: totalItems * itemHeight,
  };
}

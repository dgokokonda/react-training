// hooks/useSmartPositioning.js
import { useState, useLayoutEffect, useCallback } from "react";

export const useSmartPositioning = (targetRef, tooltipRef, isVisible) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [direction, setDirection] = useState("top");

  const calculatePosition = useCallback(() => {
    if (!targetRef.current || !tooltipRef.current || !isVisible) return;

    const targetRect = targetRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    const ARROW_OFFSET = 10;
    const MARGIN = 5;

    // Рассчитываем позиции для всех направлений
    const positions = {
      top: {
        top: targetRect.top - tooltipRect.height - ARROW_OFFSET,
        left: targetRect.left + (targetRect.width - tooltipRect.width) / 2,
      },
      bottom: {
        top: targetRect.bottom + ARROW_OFFSET,
        left: targetRect.left + (targetRect.width - tooltipRect.width) / 2,
      },
      left: {
        top: targetRect.top + (targetRect.height - tooltipRect.height) / 2,
        left: targetRect.left - tooltipRect.width - ARROW_OFFSET,
      },
      right: {
        top: targetRect.top + (targetRect.height - tooltipRect.height) / 2,
        left: targetRect.right + ARROW_OFFSET,
      },
    };

    // Проверяем, помещаются ли позиции в viewport
    const fits = {
      top: positions.top.top >= MARGIN,
      bottom:
        positions.bottom.top + tooltipRect.height <= viewport.height - MARGIN,
      left: positions.left.left >= MARGIN,
      right:
        positions.right.left + tooltipRect.width <= viewport.width - MARGIN,
    };

    // Выбираем первое подходящее направление в порядке приоритета
    const priority = ["top", "bottom", "left", "right"];
    let bestDirection = "top";

    for (const dir of priority) {
      if (fits[dir]) {
        bestDirection = dir;
        break;
      }
    }

    let bestPosition = positions[bestDirection];

    // Корректируем позицию если выходит за границы
    if (bestDirection === "top" || bestDirection === "bottom") {
      // Горизонтальная корректировка
      if (bestPosition.left < MARGIN) {
        bestPosition.left = MARGIN;
      } else if (
        bestPosition.left + tooltipRect.width >
        viewport.width - MARGIN
      ) {
        bestPosition.left = viewport.width - tooltipRect.width - MARGIN;
      }
    } else {
      // Вертикальная корректировка для left/right
      if (bestPosition.top < MARGIN) {
        bestPosition.top = MARGIN;
      } else if (
        bestPosition.top + tooltipRect.height >
        viewport.height - MARGIN
      ) {
        bestPosition.top = viewport.height - tooltipRect.height - MARGIN;
      }
    }

    setPosition(bestPosition);
    setDirection(bestDirection);
  }, [targetRef, tooltipRef, isVisible]);

  // Позиционирование при изменении видимости
  useLayoutEffect(() => {
    calculatePosition();
  }, [calculatePosition]);

  // Обработка ресайза окна
  useLayoutEffect(() => {
    if (!isVisible) return;

    const handleResize = () => {
      calculatePosition();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isVisible, calculatePosition]);

  // Обработка скролла
  useLayoutEffect(() => {
    if (!isVisible) return;

    const handleScroll = () => {
      calculatePosition();
    };

    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, [isVisible, calculatePosition]);

  return { position, direction, calculatePosition };
};

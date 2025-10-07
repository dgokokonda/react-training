// components/SmartTooltip.js
import React, { useState, useRef } from "react";
import { useSmartPositioning } from "@/hooks/useSmartPositioning";

function SmartTooltip() {
  const [isVisible, setIsVisible] = useState(false);
  const targetRef = useRef(null);
  const tooltipRef = useRef(null);

  const tips = [
    "Это первая подсказка с длинным текстом",
    "Вторая подсказка",
    "Третья подсказка тоже имеет много текста для демонстрации",
    "Короткая",
    "Еще одна интересная подсказка для тестирования",
  ];

  const [currentTip, setCurrentTip] = useState(0);

  // Используем кастомный хук
  const { position, direction } = useSmartPositioning(
    targetRef,
    tooltipRef,
    isVisible
  );

  const showTooltip = () => {
    setIsVisible(true);
  };

  const hideTooltip = () => {
    setIsVisible(false);
  };

  const nextTip = () => {
    setCurrentTip((prev) => (prev + 1) % tips.length);
  };

  // Рассчитываем позицию стрелки для точного указания на target
  const getArrowPosition = () => {
    if (!targetRef.current || !tooltipRef.current) return {};

    const targetRect = targetRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    const arrowSize = 10;

    switch (direction) {
      case "top":
        return {
          left: `${
            targetRect.left + targetRect.width / 2 - position.left - arrowSize
          }px`,
        };
      case "bottom":
        return {
          left: `${
            targetRect.left + targetRect.width / 2 - position.left - arrowSize
          }px`,
        };
      case "left":
        return {
          top: `${
            targetRect.top + targetRect.height / 2 - position.top - arrowSize
          }px`,
        };
      case "right":
        return {
          top: `${
            targetRect.top + targetRect.height / 2 - position.top - arrowSize
          }px`,
        };
      default:
        return {};
    }
  };

  return (
    <div className="container">
      <h1>Умный тултип с useLayoutEffect</h1>

      <div className="demo-area">
        <button
          ref={targetRef}
          className="target-button"
          onMouseEnter={showTooltip}
          onMouseLeave={hideTooltip}
          onClick={nextTip}
        >
          Наведи на меня 🎯
          <br />
          <small>(клик для следующей подсказки)</small>
        </button>

        {isVisible && (
          <div
            ref={tooltipRef}
            className={`tooltip tooltip-${direction}`}
            style={{
              position: "fixed",
              top: `${position.top}px`,
              left: `${position.left}px`,
            }}
          >
            <div className="tooltip-content">{tips[currentTip]}</div>
            <div className="tooltip-arrow" style={getArrowPosition()}></div>
            <div className="tooltip-info">
              Позиция: {direction}
              <br />
              <small>Ресайз и скролл обрабатываются автоматически</small>
            </div>
          </div>
        )}
      </div>

      <div className="features">
        <h3>Реализованные функции:</h3>
        <ul>
          <li>✅ Кастомный хук useSmartPositioning</li>
          <li>✅ Автопозиционирование с приоритетами</li>
          <li>✅ Обработка ресайза окна</li>
          <li>✅ Обработка скролла</li>
          <li>✅ Умная стрелка, указывающая на target</li>
          <li>✅ Корректировка границ viewport</li>
          <li>✅ Нет мигания (useLayoutEffect)</li>
        </ul>
      </div>
    </div>
  );
}

export default SmartTooltip;

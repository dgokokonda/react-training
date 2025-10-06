import React, { useState, useRef, useLayoutEffect } from "react";

function SmartTooltip() {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [direction, setDirection] = useState("top");
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

  useLayoutEffect(() => {
    if (isVisible && targetRef.current && tooltipRef.current) {
      calculatePosition();
    }
  }, [isVisible, currentTip]);

  const calculatePosition = () => {
    if (!targetRef.current || !tooltipRef.current) return;

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

    // ✅ Выбираем первое подходящее направление в порядке приоритета
    const priority = ["top", "bottom", "left", "right"];
    let bestDirection = "top";

    for (const dir of priority) {
      if (fits[dir]) {
        bestDirection = dir;
        break;
      }
    }

    let bestPosition = positions[bestDirection];

    // ✅ Корректируем позицию если выходит за границы по горизонтали/вертикали
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
  };

  const showTooltip = () => {
    setIsVisible(true);
  };

  const hideTooltip = () => {
    setIsVisible(false);
  };

  const nextTip = () => {
    setCurrentTip((prev) => (prev + 1) % tips.length);
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
            <div className="tooltip-arrow"></div>
            <div className="tooltip-info">Позиция: {direction}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SmartTooltip;

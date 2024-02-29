import { useState } from "react";
import { SYMBOL_O, SYMBOL_X } from "./constants";

const lines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [2, 4, 6],
  [0, 4, 8],
];

export function useGameState() {
  // custom hook
  const [cells, setCells] = useState([
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ]);
  const [state, setState] = useState(SYMBOL_O);
  const [currentStep, setCurrentStep] = useState(SYMBOL_O);
  const [isFinish, setFinish] = useState(false);
  const isDraw = !isFinish && cells.filter((val) => val).length === 9; // ничья

  const handleClick = (index) => {
    if (cells[index]) return;

    const cellsCopy = cells.slice();
    cellsCopy[index] = currentStep;
    setCells(cellsCopy);
    setFinish(
      lines.some(
        (line) =>
          line.every((i) => cellsCopy[i] === SYMBOL_O) ||
          line.every((i) => cellsCopy[i] === SYMBOL_X)
      )
    );
    setCurrentStep(currentStep === SYMBOL_O ? SYMBOL_X : SYMBOL_O);
  };
  const reset = () => {
    setCells([null, null, null, null, null, null, null, null, null]);
    setCurrentStep(currentStep === SYMBOL_O ? SYMBOL_X : SYMBOL_O);
    setFinish(false);
  };

  return {
    cells,
    currentStep,
    isFinish,
    isDraw,
    handleClick,
    reset,
  };
}

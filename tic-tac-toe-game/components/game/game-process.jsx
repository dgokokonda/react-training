
import { GameSymbol } from "./game-symbol";
import { SYMBOL_O, SYMBOL_X } from "./constants";

export function GameProcess({ isFinish, isDraw, currentStep }) {
  if (!isDraw && !isFinish) {
    return (
      <span>
        {" "}
        Ход: <GameSymbol cell={currentStep} />
      </span>
    );
  } else if (isDraw) {
    return <span>Ничья!</span>;
  } else
    return (
      <span>{`Finish! Winner is ${
        currentStep === SYMBOL_O ? SYMBOL_X : SYMBOL_O
      }`}</span>
    );
}
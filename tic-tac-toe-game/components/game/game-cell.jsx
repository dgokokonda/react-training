import { GameSymbol } from "./game-symbol";
import styles from "./game.module.css";

export function GameCell({ isFinish, cell, onClick }) {
  return (
    <button disabled={isFinish} className={styles["game-item"]} onClick={onClick}>
      <GameSymbol cell={cell} />
    </button>
  );
}
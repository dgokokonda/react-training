import { GameCell } from "./game-cell";
import { GameProcess } from "./game-process";
import { useGameState } from "./use-game-state";
import styles from "./game.module.css"; // имя обязательно содержит module

const classParam = "text-3xl font-bold underline text-red950";
const text = "Hello world!!!";

export function Game() {
  const { cells, currentStep, isFinish, isDraw, handleClick, reset } =
    useGameState();

  const products = [
    { id: 1, title: 1 },
    { id: 2, title: 2 },
  ];
  const listItems = products.map((product) => (
    <li key={product.id}>{product.title}</li>
  ));

  return (
    <div className={styles["App"]}>
      <header className={styles["App-header"]}>
        <p className={classParam}>{text}</p>
      </header>
      <p className={styles["game-step"]}>
        <GameProcess
          currentStep={currentStep}
          isFinish={isFinish}
          isDraw={isDraw}
        />
      </p>
      <div className={styles["game"]}>
        {cells.map((cell, i) => (
          <GameCell
            key={i}
            cell={cell}
            isFinish={isFinish}
            onClick={() => handleClick(i)}
          />
        ))}
      </div>
      <button className={styles["reset-btn"]} onClick={reset}>
        Reset
      </button>
      <ul>{listItems}</ul>
    </div>
  );
}

import { SYMBOL_O, SYMBOL_X } from "./constants";
import styles from "./game.module.css";

export function GameSymbol({ cell }) {
  const getSymbolClassName = (symbol) => {
    if (symbol === SYMBOL_O) return styles["symbol--o"];
    if (symbol === SYMBOL_X) return styles["symbol--x"];
    return "";
  };

  return <span className={`${styles['symbol']} ${getSymbolClassName(cell)}`}>{cell}</span>;
}
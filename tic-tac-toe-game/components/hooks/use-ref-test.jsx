import { useRef } from "react";
import styles from "./use-ref-test.module.css";

// Avoid changing DOM nodes managed by React.
// If you do modify DOM nodes managed by React, modify parts that React has no reason to update.

export function UseRefTest() {
  let refCount = useRef(0);
  let refInput = useRef(null);
  let refText = useRef(null);
  const firstCatRef = useRef(null);
  const secondCatRef = useRef(null);
  const thirdCatRef = useRef(null);

  function handleClick(e) {
    // ref выводит только current c дефолтным и изменяемым значением
    refCount.current += 1;
    console.log("ref", refCount.current, e, refCount);
    refInput.current.focus(); // focus
  }

  function handleInput() {
    console.log("input", refInput.current, refInput.current.value);
  }

  function handleScrollToCat(ref) {
    console.log("r", ref);
    // ref.current.scrollIntoView();  скролл в блоке
    ref.current.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }

  return (
    <>
      <button onClick={handleClick}>Click</button>
      <input ref={refInput} onInput={handleInput} type="text" name="name" />
      <button onClick={() => refText.current.remove()}>
        Remove text bellow
      </button>
      <p ref={refText}>Text for removing</p>
      <nav>
        <button onClick={() => handleScrollToCat(firstCatRef)}>Tom</button>
        <button onClick={() => handleScrollToCat(secondCatRef)}>Maru</button>
        <button onClick={() => handleScrollToCat(thirdCatRef)}>
          Jellylorum
        </button>
      </nav>
      <div className={styles["wrap"]}>
        <ul>
          <li>
            <img
              src="https://placekitten.com/g/200/200"
              alt="Tom"
              ref={firstCatRef}
            />
          </li>
          <li>
            <img
              src="https://placekitten.com/g/300/200"
              alt="Maru"
              ref={secondCatRef}
            />
          </li>
          <li>
            <img
              src="https://placekitten.com/g/250/200"
              alt="Jellylorum"
              ref={thirdCatRef}
            />
          </li>
        </ul>
      </div>
    </>
  );
}

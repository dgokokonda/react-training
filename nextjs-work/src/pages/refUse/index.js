// use ref - React 19 (we don't need for forwardRef anymore)
import { useImperativeHandle, useRef } from "react";

const AppInput = ({ ref }) => {
  const inputRef = useRef();

  useImperativeHandle(ref, () => ({ focus: () => inputRef.current.focus() }));

  return (
    <div className="input-field">
      <input ref={inputRef}></input>
    </div>
  );
};

export default function RefExample() {
  const ref = useRef();
  return (
    <>
      <AppInput ref={ref}></AppInput>
      <button className="btn" onClick={() => ref.current.focus()}>
        Focus
      </button>
    </>
  );
}

// use ref - React 18
// import { useImperativeHandle, forwardRef, useRef } from "react";

// const AppInput = forwardRef(function AppInput(props, ref) {
//   const inputRef = useRef();

//   useImperativeHandle(ref, () => ({ focus: () => inputRef.current.focus() }));

//   return (
//     <div className="input-field">
//       <input ref={inputRef}></input>
//     </div>
//   );
// });

// export default function RefExample() {
//   const ref = useRef();
//   return (
//     <>
//       <AppInput ref={ref}></AppInput>
//       <button className="btn" onClick={() => ref.current.focus()}>
//         Focus
//       </button>
//     </>
//   );
// }

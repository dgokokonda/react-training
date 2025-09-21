"use client";

import { useRef, useEffect } from "react";
import Portal from "@/components/modal/Portal";

export default function Modal({ children, open }) {
  const dialog = useRef();

  useEffect(() => {
    if (open) {
      dialog.current?.showModal();
    } else dialog.current?.close();
  }, [open]);

  return (
    <Portal>
      <dialog ref={dialog} className="modal">
        <h1>Modal</h1>
        <p>Some text inside of modal....</p>
        {children}
      </dialog>
    </Portal>
  );
}

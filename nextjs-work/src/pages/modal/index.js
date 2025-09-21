import { useState } from "react";
import Modal from "@/components/Modal/Modal";

export default function ModalPage() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>Show modal</button>
      <Modal open={show}>
        <h3>Modal Subtitle</h3>
        <button onClick={() => setShow(false)}>Close</button>
      </Modal>
    </>
  );
}

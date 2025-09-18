import { useRef, useState, useOptimistic } from "react";

export default function OptimisticMessage() {
  const formRef = useRef();
  const [messages, setMessages] = useState([]);
  // убирает визуальную задержку в обработке ответа:
  const [optimisticMessages, addOptimisticMessages] = useOptimistic(
    messages,
    (prevMsgs, newMsg) => {
      return [...prevMsgs, { text: newMsg, pending: true }];
    }
  );

  async function sendMessage(message) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(message), 1000);
    });
  }

  async function formAction(formData) {
    addOptimisticMessages(formData.get("message"));
    formRef.current.reset();
    const message = await sendMessage(formData.get("message"));

    setMessages((messages) => [...messages, { text: message, pending: false }]);
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      className="flex flex-col items-center justify-center h-dvh"
    >
      <div className="input-field bg-amber-200 m-4 p-4">
        <input name="message"></input>
      </div>
      <button type="submit" className="btn">
        Send
      </button>
      <ul className="collection">
        {optimisticMessages.map((msg, i) => (
          <li className="collection-item" key={i}>
            {msg.text} {msg.pending && <small>( Adding )</small>}
          </li>
        ))}
      </ul>
    </form>
  );
}

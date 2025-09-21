import {
  useRef,
  useState,
  useOptimistic,
  useEffect,
  useTransition,
} from "react";

export default function OptimisticMessage() {
  const formRef = useRef();
  const [messages, setMessages] = useState([]);
  const [isPending, startTransition] = useTransition();
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
    startTransition(async () => {
      const newMsg = formData.get("message").trim();

      if (!newMsg) return;

      addOptimisticMessages(newMsg);
      formRef.current?.reset();

      try {
        const message = await sendMessage(newMsg);
        setMessages((messages) => [
          ...messages,
          { text: message, pending: false, id: Date.now() },
        ]);
      } catch (error) {
        setMessages((messages) =>
          messages.filter((m) => m.text !== newMessage)
        );
        console.error("Failed to send message:", error);
      }
    });
  }

  useEffect(() => {
    // Очищаем pending сообщения при размонтировании
    return () => {
      setMessages((messages) => messages.filter((m) => !m.pending));
    };
  }, []);

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
        {isPending ? "Sending..." : "Send"}
      </button>
      <ul className="collection">
        {optimisticMessages.map((msg, i) => (
          <li className="collection-item" key={msg.id || i}>
            {msg.text} {msg.pending && <small>( Adding )</small>}
          </li>
        ))}
      </ul>
    </form>
  );
}

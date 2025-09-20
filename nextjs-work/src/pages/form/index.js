import { useActionState } from "react";
const submitForm = (data) =>
  new Promise((resolve, reject) =>
    data.get("name") ? resolve(data) : reject({ message: "Empty form!" })
  );

// React 18
// export default function Form() {
//   const [isPending, startTransition] = useTransition();

//   const handleSubmit = async (formData) => {
//     startTransition(async () => {
//       await submitForm(formData);
//     });
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       {isPending && <Spinner />}
//       <button type="submit">Отправить</button>
//     </form>
//   );
// }

// React 19 - НАМНОГО ПРОЩЕ!
export default function Form() {
  const [state, submitAction, isPending] = useActionState(
    async (prevState, formData) => {
      try {
        // Автоматически обрабатывает pending состояние
        const result = await submitForm(formData);
        return { success: true, data: result, error: null };
      } catch (error) {
        return { success: false, data: null, error: error.message };
      }
    },
    { success: false, data: null, error: null }
  );

  return (
    <form action={submitAction}>
      <input name="name" />
      {/* {isPending && <Spinner />} */}
      <button type="submit" disabled={isPending} aria-disabled={isPending}>
        {" "}
        {isPending ? "Отправка..." : "Отправить"}
      </button>

      {state.error && <div className="error-message">{state.error}</div>}

      {state.success && (
        <div className="success-message">Успешно отправлено!</div>
      )}
    </form>
  );
}

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
      // Автоматически обрабатывает pending состояние
      const result = await submitForm(formData);
      return result;
    },
    null
  );

  return (
    <form action={submitAction}>
      {/* {isPending && <Spinner />} */}
      <button type="submit">Отправить</button>
    </form>
  );
}

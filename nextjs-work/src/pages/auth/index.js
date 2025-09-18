import { useState, useActionState, use } from "react";
import { useFormStatus } from "react-dom";
import { fakeLogin } from "../api/login";

const SubmitButton = () => {
  const { pending /*, data, method, action */ } = useFormStatus(); // form status
  return (
    <input
      disabled={!!pending}
      type="submit"
      value={pending ? "Loading..." : "Submit"}
      className={pending ? "text-gray-400" : "text-blue-500"}
    />
  );
};

export default function Auth() {
  // work with form state - only param of state!
  const [state, submitAction] = useActionState(auth, {
    data: null,
    error: null,
  });

  async function auth(prevState, formData) {
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const response = await fakeLogin({ email, password });
      return {
        data: response,
        error: null,
      };
    } catch (error) {
      return { ...prevState, error: error.message };
    }
  }

  return (
    <form action={submitAction}>
      <div className="input-field">
        <input type="email" name="email" id="email" className="validate" />
        <label htmlFor="email">Email</label>
      </div>
      <div className="input-field">
        <input
          type="password"
          name="password"
          id="password"
          className="validate"
        />
        <label htmlFor="password">Password</label>
      </div>
      <SubmitButton></SubmitButton>
      {state.data && <p className="text-green-500">{state.data.email}</p>}
      {state.error && <p className="text-red-600">{state.error}</p>}
    </form>
  );
}

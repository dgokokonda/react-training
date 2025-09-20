import { useState, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { fakeLogin } from "../api/login";
import * as Yup from "yup";

const SubmitButton = ({ loading }) => {
  const { pending /*, data, method, action */ } = useFormStatus(); // form status
  return (
    <input
      disabled={!!pending}
      type="submit"
      value={pending || loading ? "Loading..." : "Submit"}
      className={pending || loading ? "text-gray-400" : "text-blue-500"}
    />
  );
};

export default function Auth() {
  // work with form state - only param of state!
  const [state, submitAction] = useActionState(auth, {
    data: null,
    error: null,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const formSchema = Yup.object({
    username: Yup.string()
      .nullable()
      .min(3, "Длина должна быть не менее 3 символов")
      .required("Обязательно для заполнения"),
    email: Yup.string()
      .nullable()
      .email("Неправильно введен емейл")
      .required("Обязательно для заполнения"),
    password: Yup.string()
      .nullable()
      .min(8, "Длина должна быть не менее 8 символов")
      .required("Обязательно для заполнения"),
  });

  const validateField = async (el) => {
    const { name, value } = el.target;
    try {
      await formSchema.validateAt(name, { [name]: value });
      setErrors((prev) => ({ ...prev, [name]: "" }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, [name]: error.message }));
    }
  };

  async function auth(prevState, formData) {
    const email = formData.get("email");
    const password = formData.get("password");
    const username = formData.get("username");

    setErrors({});
    setLoading(true);

    try {
      await formSchema.validate(
        { username, email, password },
        { abortEarly: false }
      );
      const response = await fakeLogin({ email, password, username });
      setLoading(false);
      return {
        data: response,
        error: null,
      };
    } catch (error) {
      const validationErrors = {};
      error.inner.forEach((fieldError) => {
        validationErrors[fieldError.path] = fieldError.message;
      });
      setErrors(validationErrors);
      setLoading(false);
      return { ...prevState, error: error.message };
    }
  }

  return (
    <form
      action={submitAction}
      className="flex flex-col justify-center items-center h-dvh"
    >
      <div className="input-field flex flex-col items-center mb-2">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          id="username"
          onChange={validateField}
          className={errors.username ? "validate w-60 error" : "validate w-60"}
        />
        {errors.username && <p className="text-red-600">{errors.username}</p>}
      </div>
      <div className="input-field flex flex-col items-center mb-2">
        <label htmlFor="email">Email</label>
        <input
          type="text"
          name="email"
          id="email"
          onChange={validateField}
          className={errors.email ? "validate w-60 error" : "validate w-60"}
        />
        {errors.email && <p className="text-red-600">{errors.email}</p>}
      </div>
      <div className="input-field flex flex-col items-center">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          onChange={validateField}
          className={errors.password ? "validate w-60 error" : "validate w-60"}
        />
        {errors.password && <p className="text-red-600">{errors.password}</p>}
      </div>
      <div className="buttons mt-4">
        <SubmitButton loading={loading}></SubmitButton>
      </div>
      {state.data && (
        <p className="text-green-500 m-10">{state.data.username} logged in</p>
      )}
    </form>
  );
}

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { fakeLogin } from "../api/login";
import * as Yup from "yup";
import { Formik, Field, Form } from "formik";

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
  const [state, setState] = useState({
    data: null,
    error: null,
  });
  // const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const formSchema = Yup.object().shape({
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

  // const validateField = async (el) => {
  //   const { name, value } = el.target;
  //   try {
  //     await formSchema.validateAt(name, { [name]: value });
  //     // setErrors((prev) => ({ ...prev, [name]: "" }));
  //   } catch (error) {
  //     // setErrors((prev) => ({ ...prev, [name]: error.message }));
  //   }
  // };

  async function handleSubmit(formData, { setSubmitting, resetForm }) {
    // setErrors({});
    setLoading(true);
    setState({ data: null, error: null });

    try {
      await formSchema.validate(formData, { abortEarly: false });
      const response = await fakeLogin(formData);
      setState({ data: response, error: null });
      resetForm();
    } catch (error) {
      if (error.name === "ValidationError") {
        // Formik сам обработает ошибки валидации
        throw error;
      } else {
        setState({ data: null, error: error.message });
      }
      // setErrors(validationErrors);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  }

  return (
    <Formik
      initialValues={{
        email: "",
        username: "",
        password: "",
      }}
      validationSchema={formSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form className="flex flex-col justify-center items-center h-dvh">
          <div className="input-field flex flex-col items-center mb-2">
            <label htmlFor="username">Username</label>
            <Field
              type="text"
              name="username"
              id="username"
              className={
                errors.username ? "validate w-60 error" : "validate w-60"
              }
            />
            {errors.username && touched.username && (
              <p className="text-red-600">{errors.username}</p>
            )}
          </div>
          <div className="input-field flex flex-col items-center mb-2">
            <label htmlFor="email">Email</label>
            <Field
              type="text"
              name="email"
              id="email"
              className={errors.email ? "validate w-60 error" : "validate w-60"}
            />
            {errors.email && touched.email && (
              <p className="text-red-600">{errors.email}</p>
            )}
          </div>
          <div className="input-field flex flex-col items-center">
            <label htmlFor="password">Password</label>
            <Field
              type="password"
              name="password"
              id="password"
              className={
                errors.password ? "validate w-60 error" : "validate w-60"
              }
            />
            {errors.password && touched.password && (
              <p className="text-red-600">{errors.password}</p>
            )}
          </div>
          <div className="buttons mt-4">
            <SubmitButton loading={loading || isSubmitting}></SubmitButton>
          </div>
          {state.error && <p className="text-red-500 m-10">{state.error}</p>}
          {state.data && (
            <p className="text-green-500 m-10">
              {state.data.username} logged in
            </p>
          )}
        </Form>
      )}
    </Formik>
  );
}

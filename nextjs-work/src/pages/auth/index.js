import { useCallback, useState, memo } from "react";
import { fakeLogin } from "../api/login";
import * as Yup from "yup";
import { Formik, Field, Form } from "formik";

const ERROR_MESSAGES = {
  USERNAME_MIN: "Длина должна быть не менее 3 символов",
  USERNAME_REQUIRED: "Обязательно для заполнения",
  EMAIL_INVALID: "Неправильно введен емейл",
  EMAIL_REQUIRED: "Обязательно для заполнения",
  PASSWORD_MIN: "Длина должна быть не менее 8 символов",
  PASSWORD_REQUIRED: "Обязательно для заполнения",
};

const FORM_SCHEMA = Yup.object().shape({
  username: Yup.string()
    .nullable()
    .min(3, ERROR_MESSAGES.USERNAME_MIN)
    .required(ERROR_MESSAGES.USERNAME_REQUIRED),
  email: Yup.string()
    .nullable()
    .email(ERROR_MESSAGES.EMAIL_INVALID)
    .required(ERROR_MESSAGES.EMAIL_REQUIRED),
  password: Yup.string()
    .nullable()
    .min(8, ERROR_MESSAGES.PASSWORD_MIN)
    .required(ERROR_MESSAGES.PASSWORD_REQUIRED),
});

const INITIAL_VALUES = {
  email: "",
  username: "",
  password: "",
};

const SubmitButton = ({ isSubmitting }) => (
  <input
    disabled={isSubmitting}
    type="submit"
    value={isSubmitting ? "Loading..." : "Submit"}
    className={isSubmitting ? "text-gray-400" : "text-blue-500"}
    aria-live="polite"
    aria-busy={isSubmitting}
    aria-label={isSubmitting ? "Форма отправляется" : "Отправить форму"}
  />
);

const FormField = memo(
  ({ name, type = "text", label, errors, touched, isSubmitting }) => (
    <div className="input-field flex flex-col items-center mb-2">
      <label htmlFor={name}>{label}</label>
      <Field
        type={type}
        name={name}
        id={name}
        className={errors[name] ? "validate w-60 error" : "validate w-60"}
        disabled={isSubmitting}
      />
      {errors[name] && touched[name] && (
        <p className="help text-red-600">{errors[name]}</p>
      )}
    </div>
  )
);

FormField.displayName = "FormField";

const StatusMessage = memo(({ state }) => (
  <>
    {state.error && <p className="text-red-500 m-10">{state.error}</p>}
    {state.data && (
      <p className="text-green-500 m-10">{state.data.username} logged in</p>
    )}
  </>
));

StatusMessage.displayName = "StatusMessage";

export default function Auth() {
  const [state, setState] = useState({
    data: null,
    error: null,
  });

  const handleSubmit = useCallback(
    async (formData, { setSubmitting, resetForm }) => {
      setState({ data: null, error: null });
      const abortController = new AbortController();

      try {
        await FORM_SCHEMA.validate(formData, { abortEarly: false });
        const response = await fakeLogin(formData);

        if (response.error) {
          throw new Error(response.error);
        }

        setState({ data: response, error: null });
        resetForm();
      } catch (error) {
        if (error.name === "AbortError") {
          return; // Запрос был отменен
        }

        if (error.name === "ValidationError") {
          // Formik сам обработает ошибки валидации
          throw error;
        }
        setState({
          data: null,
          error: error.message || "Произошла неизвестная ошибка",
        });
      } finally {
        setSubmitting(false);
      }

      return () => abortController.abort();
    },
    []
  );

  return (
    <Formik
      initialValues={INITIAL_VALUES}
      validationSchema={FORM_SCHEMA}
      onSubmit={handleSubmit}
      validateOnBlur={true}
      validateOnChange={true}
      debounce={300}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form
          className="flex flex-col justify-center items-center h-dvh"
          aria-labelledby="form-title"
        >
          <h2 id="form-title" className="sr-only">
            Форма авторизации
          </h2>
          <fieldset disabled={isSubmitting} className="border-none">
            <FormField
              key="username"
              name="username"
              label="Username"
              errors={errors}
              touched={touched}
              isSubmitting={isSubmitting}
            />
            <FormField
              key="email"
              name="email"
              label="Email"
              type="email"
              errors={errors}
              touched={touched}
              isSubmitting={isSubmitting}
            />
            <FormField
              key="password"
              name="password"
              type="password"
              label="Password"
              errors={errors}
              touched={touched}
              isSubmitting={isSubmitting}
            />
          </fieldset>
          <div className="buttons mt-4">
            <SubmitButton isSubmitting={isSubmitting}></SubmitButton>
          </div>
          <StatusMessage state={state} />
        </Form>
      )}
    </Formik>
  );
}

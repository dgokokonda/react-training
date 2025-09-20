import {
  useState,
  useEffect,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  useRef,
  useImperativeHandle,
  useLayoutEffect,
  useDebugValue,
  useTransition,
  useDeferredValue,
  useId,
  useSyncExternalStore,
  use,
  useActionState,
  useOptimistic,
  useFormStatus,
} from "react";

export default function ExampleComponent() {
  // Basic Hooks
  const [count, setCount] = useState(0);
  const theme = useContext(ThemeContext);

  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);

  // Additional Hooks
  const [state, dispatch] = useReducer(reducer, initialState);
  const memoizedCallback = useCallback(() => {}, []);
  const memoizedValue = useMemo(() => computeValue(), []);
  const ref = useRef(null);

  // New React 19 Hooks
  const data = use(promise);
  const [formState, formAction, isPending] = useActionState(submitForm, null);
  const [optimisticState, addOptimistic] = useOptimistic(state, updateFn);
  const formStatus = useFormStatus();

  // Concurrent Hooks
  const [isPendingTransition, startTransition] = useTransition();
  const deferredValue = useDeferredValue(value);

  // Utility Hooks
  const id = useId();
  const externalStoreState = useSyncExternalStore(subscribe, getSnapshot);

  return <div>Пример компонента</div>;
}

// 📊 Классификация хуков по категориям
// Категория	Хуки
// Состояние	useState, useReducer, useActionState
// Эффекты	useEffect, useLayoutEffect, useInsertionEffect
// Производительность	useMemo, useCallback, useDeferredValue
// Ссылки	useRef, useImperativeHandle
// Контекст	useContext, use
// Формы	useFormStatus, useActionState
// Оптимистичные UI	useOptimistic
// Concurrent	useTransition, useDeferredValue
// Утилиты	useId, useDebugValue
// Внешние хранилища	useSyncExternalStore

import { useState, useEffect, useCallback, useLayoutEffect } from "react";

// useEffect по поведению похож на три метода жизненного цикла: componentDidMount, componentDidUpdate, componentWillUnmount
// предназначен для работы с сервером, с слушателями, с подписками, таймерами, с браузерным апи, другими библиотеками и пр. внешними системами.
// также предназначен для синхронизации
// с помощью хука также можно очищать данные и обнулять слушатели, освобождая память перед размонтированием и следующим вызовом эффекта
// иногда лучше применение useLayoutEffect

// сигнатура - это описание параметров, по сути не описывает работу функции
// На вопрос "расскажи про сигнатуру функции useEffect" - "принимает аргументы fn, массив зависимостей; функция может вернуть функцию очистки перед размонтированием или перед последующим вызовом эффекта"

// Состояние гонки: путается состояние, то есть какой-то колбэк срабатывает раньше другого, и отображаются неверные данные, например при множественных запросах из-за быстрого клика. Для борьбы с этим ставить условия в эффекте и функцию очистки, либо использовать апи AbortController().

function Child({ func }) {
  function handle() {
    console.log("click");
  }
  useEffect(() => {
    // const abortController = new AbortController(); // апи для обмена запросами
    let cancel = false;
    if (!cancel) {
      func()();
      // задействуем abortController.signal например в запросе:
      // при неуспешном статусе запрос не попадет в then, сразу выполнится return - функция очистки
      // mainInstance
      //   .get("/user/id", { signal: AbortController.signal })
      //   .then((r) => {
      //     setUser(r.data);
      //   });
    }
    console.log("func", func()());
    document.addEventListener("click", handle);

    // борьба с утечкой памяти: обнуление любых слушателей, таймеров, переменных
    return () => {
      // функция очистки эффекта работает на замыкании
      cancel = true;
      document.removeEventListener("click", handle); // если бы не обнулили, функция вызывалась бы многократно по нарастающей
      // abortController.abort();
    };
  }, [func]);
}

export function UseEffectTest() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("default");

  console.log("render");

  function inc() {
    console.log("inc 0", count);
    setCount(count + 1);
  }

  const someFunc = /* useCallback( */ () => {
    console.log("inc 1", count);
    return () => +count + 1;
  }; /* , [count]); */
  useEffect(() => {
    // console.log("get", localStorage.getItem("count"));
    setCount(JSON.parse(localStorage.getItem("count")) || 0);
  }, []);

  useEffect(() => {
    console.log("inc 3");
    localStorage.setItem("count", count);
  }, [count]);

  useLayoutEffect(() => {
    console.log("layout inc 4", count); // отрабатывает первым до срабатывания эффекта
  }, [count]);

  useEffect(() => {
    function onTimeout() {
      console.log("timeout", text);
    }
    console.log("eff", count, text);
    const timer = setTimeout(onTimeout, 2000);

    return () => {
      console.log("clear", text);
      clearTimeout(timer);
    };
  }, [text]);
  return (
    <>
      <h1>Use Effect Test</h1>
      <button style={{ background: "lightblue" }} onClick={inc}>
        Click
      </button>
      <Child func={someFunc} />
      <span>Count: {count}</span>
    </>
  );
}

// useEffect(() => {
//   let didCancel = false;

//   const fetchData = async () => {
//     dispatch({ type: 'FETCH_INIT' });

//     try {
//       const result = await axios(url);

//       if (!didCancel) {
//         dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
//       }
//     } catch (error) {
//       if (!didCancel) {
//         dispatch({ type: 'FETCH_FAILURE' });
//       }
//     }
//   };

//   fetchData();

//   return () => {
//     didCancel = true;
//   };
// }, [url]);

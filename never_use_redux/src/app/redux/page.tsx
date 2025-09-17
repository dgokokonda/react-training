"use client";

import { setUser, removeUser, setStatus } from "@/redux/slices/userSlice";
import { RootState } from "@/redux/store";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { User, CategoriesDataArray, CategoriesObject } from '@/types'
import CategoryComponent from "../components/category/category";

function ReduxPage() {
  const [visibleUserForm, setVisibleUserForm] = useState<boolean>(false)
  const [username, setUsername] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [error, setError] = useState<string>("");
  const [categories, setCategories] = useState<CategoriesDataArray[]>([])
  const user = useSelector((state: RootState) => state.user.value);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setUser({
        id: "2",
        email: "user@redux.com",
        username: "redux",
      })
    );

    const url = new URL('https://restapi.dns-shop.ru/v1/get-actual-offer-selection');
    // const params = { Cityid: "c64ded11-080e-11e0-b1fe-001517c526f0" }
    // url.search = new URLSearchParams(params).toString();
    try {
      fetch(url, {
        method: 'get',
        headers: new Headers({
          Cityid: "c64ded11-080e-11e0-b1fe-001517c526f0",
          'content-type': 'application/json'
        })
      })
        .then(async response => {
          const data = await response.json()
          if (data?.data) setCategories(data.data)
          dispatch(setStatus(data));
          return data
        })
        .catch(err => dispatch(setStatus(err)))
    } catch (error) {
      dispatch(setStatus(error));
    }

  }, []);

  const handleFormSubmit = (evt: React.SyntheticEvent<HTMLFormElement>) => {
    evt.preventDefault()
    const newUser: User = {
      id: Date.now().toString(),
      email,
      username
    }
    setVisibleUserForm(false);
    dispatch(setUser(newUser))
    handleFormReset();
  }

  const handleFormReset = () => {
    setUsername('')
    setEmail('')
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // регулярное выражение на проверку email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmail(e.target.value)
    // проверяем соответствие введенных данных регулярному выражению
    if (!emailRegex.test(email)) {
      // если не соответствует, устанавливаем ошибку
      setError("Invalid email address");
    }
    // иначе сбрасываем ошибку
    else setError("");
  }

  return (
    <>
      <p>Categories:</p>
      {
        categories.length && categories.map((category: CategoriesDataArray) => <CategoryComponent key={category?.title} category={category} ></CategoryComponent>)
      }
      <h3></h3>
      <button
        onClick={useCallback(() => setVisibleUserForm(true), [visibleUserForm])}
        onReset={handleFormReset}
        disabled={!!user}
        className="p-4 bg-blue-500 mt-4 cursor-pointer"
      >Добавить пользователя</button>
      {visibleUserForm && <form onSubmit={handleFormSubmit} className="flex flex-col justify-center items-center">
        <input
          disabled={!username || !email || !!error || username.length < 3}
          type="submit"
          className="p-4 bg-blue-500 mt-4 cursor-pointer"
          value="Сохранить"
        />
        <input type="text" name="username" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
        {username.length < 3 && <p className="text-red-600">Длина никнейма должна быть не менее 3 символов</p>}
        <input type="text" name="email" id="email" value={email} onChange={handleEmailChange} />
        {error && <p className="text-red-600">Невалидный емейл</p>}
      </form>}
      <button disabled={!user} onClick={useCallback(() => {
        dispatch(removeUser());
        setVisibleUserForm(false)
      }, [user, visibleUserForm])}>Удалить пользователя</button>
      <b>User:</b>
      <p>{user?.id}</p>
      <p>{user?.email}</p>
      <p>{user?.username}</p>
    </>
  );
}

export default ReduxPage;

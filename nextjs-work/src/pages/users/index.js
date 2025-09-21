import { use, useCallback, useEffect, useState } from "react";
import useInput from "@/hooks/useInput";
// import axios from "axios";

// const fetchUsers = fetch("https://jsonplaceholder.typicode.com/users").then(
//   (resp) => resp.json()
// );
// const fetchUsers = axios
//   .get("https://jsonplaceholder.typicode.com/users")
//   .then((resp) => resp.data)
//   .catch((err) => console.error(err));

export default function Users() {
  // const users = use(fetchUsers); // use Promise or Context
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchedText, setSearchedText] = useState("");
  const input = useInput(); // Применение кастомного хука

  // useEffect(() => setFilteredUsers(users), []);
  useEffect(() => {
    const abortController = new AbortController();
    const url = searchedText
      ? `https://jsonplaceholder.typicode.com/users?name=${searchedText}`
      : "https://jsonplaceholder.typicode.com/users";

    const searchTimer = setTimeout(() => {
      // таймер для визуализации долгого запроса и показа состояния загрузки
      try {
        fetch(url, {
          signal: abortController?.signal,
        })
          .then((resp) => resp.json())
          .then((resp) => {
            setFilteredUsers(resp);
          });
      } catch (error) {
        if (error.name == "AbortError") {
          console.log("Request was aborted");
        } else {
          console.log("Error fetching user data", error);
        }
      }
    }, 500);

    return () => {
      abortController.abort();
      clearTimeout(searchTimer);
    };
  }, [searchedText]);

  const handleChange = (search) => {
    setSearchedText(search);
  };

  const sortByAsc = useCallback(() => {
    setFilteredUsers((list) =>
      [...list].sort((a, b) => a.name.localeCompare(b.name))
    );
  }, []);

  const sortByDesc = useCallback(() => {
    setFilteredUsers((list) =>
      [...list].sort((a, b) => b.name.localeCompare(a.name))
    );
  }, []);

  return (
    <>
      <input type="text" {...input} />
      {/* <input type="text" value={input.value} onChange={input.onChange} /> */}
      <h6>{input.value}</h6>
      <input
        type="text"
        name="search"
        id="search"
        value={searchedText}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Search for users by name"
      />
      <button onClick={() => sortByAsc()}>Sort by Asc</button>
      <button onClick={() => sortByDesc()}>Sort by Desc</button>
      <ul className="collection">
        {filteredUsers.map((user) => (
          <li key={user.id} className="collection-item">
            {user.name}
          </li>
        ))}
      </ul>
    </>
  );
}

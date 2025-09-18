import { use } from "react";

const fetchUsers = fetch("https://jsonplaceholder.typicode.com/users").then(
  (resp) => resp.json()
);

export default function Users() {
  const users = use(fetchUsers); // use Promise or Context
  return (
    <>
      <ul className="collection">
        {users.map((user) => (
          <li key={user.id} className="collection-item">
            {user.name}
          </li>
        ))}
      </ul>
    </>
  );
}

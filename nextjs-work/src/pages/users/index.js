import Link from "next/link";

const users = [
  { id: 1, name: "Иван Иванов", email: "ivan@example.com" },
  { id: 2, name: "Петр Петров", email: "petr@example.com" },
  { id: 3, name: "Мария Сидорова", email: "maria@example.com" },
];

export default function UsersPage() {
  return (
    <div>
      <h1>Пользователи</h1>

      <div style={{ display: "grid", gap: "10px", marginTop: "20px" }}>
        {users.map((user) => (
          <div
            key={user.id}
            style={{
              padding: "15px",
              border: "1px solid #ddd",
              borderRadius: "5px",
            }}
          >
            <h3>
              <Link href={`/users/${user.id}`}>{user.name}</Link>
            </h3>
            <p>Email: {user.email}</p>
            <div>
              <Link
                href={`/users/${user.id}/posts/1`}
                style={{ fontSize: "14px", color: "blue" }}
              >
                Посмотреть посты →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

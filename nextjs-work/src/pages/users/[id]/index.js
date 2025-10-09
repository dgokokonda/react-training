// ├── users/
// │   ├── page.js            # Список пользователей
// │   └── [id]/
// │       ├── page.js        # Профиль пользователя
// │       └── posts/
// │           └── [postId]/
// │               └── page.js # Вложенные параметры

import { notFound, useParams } from "next/navigation";
import Link from "next/link";

const users = {
  1: { name: "Иван Иванов", email: "ivan@example.com", role: "Администратор" },
  2: { name: "Петр Петров", email: "petr@example.com", role: "Пользователь" },
  3: { name: "Мария Сидорова", email: "maria@example.com", role: "Редактор" },
};

export default function UserProfilePage() {
  const params = useParams();
  const { id } = params;
  const user = users[id];

  if (!user) {
    notFound();
  }

  return (
    <div>
      <Link
        href="/users"
        style={{
          color: "blue",
          textDecoration: "underline",
          marginBottom: "20px",
          display: "block",
        }}
      >
        ← Назад к списку пользователей
      </Link>

      <div
        style={{
          border: "1px solid #ddd",
          padding: "20px",
          borderRadius: "8px",
          maxWidth: "500px",
        }}
      >
        <h1>Профиль пользователя</h1>
        <div style={{ marginTop: "15px" }}>
          <p>
            <strong>ID:</strong> {id}
          </p>
          <p>
            <strong>Имя:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Роль:</strong> {user.role}
          </p>
        </div>

        <div style={{ marginTop: "20px" }}>
          <Link
            href={`/users/${id}/posts/1`}
            style={{
              display: "inline-block",
              padding: "8px 16px",
              background: "#007bff",
              color: "white",
              textDecoration: "none",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          >
            Посмотреть посты пользователя
          </Link>
        </div>
      </div>
    </div>
  );
}

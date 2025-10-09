import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

const userPosts = {
  1: {
    1: { title: "Мой первый пост", content: "Содержание поста 1..." },
    2: { title: "Второй пост", content: "Содержание поста 2..." },
    5: { title: "Специальный пост", content: "Особое содержание..." },
  },
  2: {
    1: { title: "Пост пользователя 2", content: "Содержание..." },
  },
};

// Компонент загрузки
function LoadingSpinner() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "200px",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <div className="spinner"></div>
      <p>Загрузка поста...</p>
    </div>
  );
}

function UserPost() {
  const params = useParams();
  const id = params?.id;
  const postId = params?.postId;

  if (!id || !postId) {
    return <div>Ошибка загрузки...</div>;
  }

  const userPost = userPosts[id]?.[postId];

  if (!userPost) {
    return <div>Ошибка загрузки...</div>;
  }

  return (
    <div>
      <Link
        href={`/users/${id}`}
        style={{
          color: "blue",
          textDecoration: "underline",
          marginBottom: "20px",
          display: "block",
        }}
      >
        ← Назад к профилю пользователя
      </Link>

      <div
        style={{
          border: "1px solid #ddd",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <h1>{userPost.title}</h1>
        <div
          style={{
            margin: "15px 0",
            padding: "10px",
            background: "#f8f9fa",
            borderRadius: "5px",
          }}
        >
          <p>
            <strong>Параметры маршрута:</strong>
          </p>
          <p>ID пользователя: {id}</p>
          <p>ID поста: {postId}</p>
          <p>
            Полный путь: /users/{id}/posts/{postId}
          </p>
        </div>

        <div style={{ lineHeight: "1.6" }}>
          <p>{userPost.content}</p>
        </div>

        <div style={{ marginTop: "20px" }}>
          <Link
            href="/users"
            style={{ color: "blue", textDecoration: "underline" }}
          >
            К списку всех пользователей
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function UserPostPage() {
  return (
    <Suspense fallback={LoadingSpinner}>
      <UserPost />
    </Suspense>
  );
}

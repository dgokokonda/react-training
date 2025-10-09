import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

const blogPosts = {
  "first-post": { title: "Мой первый пост" },
  "react-tutorial": { title: "React Tutorial" },
  "nextjs-guide": { title: "Next.js Guide" },
};

function BlogEditContent() {
  const params = useParams();
  const slug = params?.slug;

  if (!slug) {
    return <div>Ошибка загрузки...</div>;
  }

  const post = blogPosts[slug];

  return (
    <div>
      <Link
        href={`/blog/${slug}`}
        style={{
          color: "blue",
          textDecoration: "underline",
          marginBottom: "20px",
          display: "block",
        }}
      >
        ← Назад к посту
      </Link>

      <h1>Редактирование: {post.title}</h1>

      <form style={{ marginTop: "20px" }}>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Заголовок:
          </label>
          <input
            type="text"
            defaultValue={post.title}
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Содержание:
          </label>
          <textarea
            rows="6"
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
            defaultValue="Содержание поста..."
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            background: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Сохранить изменения
        </button>
      </form>

      <div
        style={{
          marginTop: "20px",
          padding: "10px",
          background: "#f8f9fa",
          borderRadius: "5px",
        }}
      >
        <p>
          <strong>Информация:</strong>
        </p>
        <p>Slug: {slug}</p>
        <p>Путь: /blog/{slug}/edit</p>
      </div>
    </div>
  );
}

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

export default function EditPostPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <BlogEditContent />
    </Suspense>
  );
}

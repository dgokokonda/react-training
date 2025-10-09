// ├── blog/
// │   ├── page.js            # Список постов
// │   └── [slug]/
// │       ├── page.js        # Динамическая страница поста
// │       └── edit/
// │           └── page.js    # Вложенный динамический маршрут

import Link from "next/link";

const blogPosts = [
  {
    slug: "first-post",
    title: "Мой первый пост",
    content: "Содержание первого поста...",
  },
  {
    slug: "react-tutorial",
    title: "React Tutorial",
    content: "Изучаем React...",
  },
  {
    slug: "nextjs-guide",
    title: "Next.js Guide",
    content: "Руководство по Next.js...",
  },
];

export default function BlogPage() {
  return (
    <div>
      <h1>Блог</h1>
      <p>Список всех постов:</p>

      <div style={{ display: "grid", gap: "15px", marginTop: "20px" }}>
        {blogPosts.map((post) => (
          <div
            key={post.slug}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              borderRadius: "5px",
            }}
          >
            <h3>
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </h3>
            <p>{post.content}</p>
            <div>
              <Link
                href={`/blog/${post.slug}/edit`}
                style={{ color: "blue", textDecoration: "underline" }}
              >
                Редактировать
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

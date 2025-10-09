"use client";

import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function BlogPostPage() {
  const params = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Безопасное получение slug
  const slug = params?.slug;

  useEffect(() => {
    if (!slug) return;

    const fetchPost = async () => {
      try {
        // Имитация загрузки данных
        const postData = await getPostData(slug);
        if (!postData) {
          notFound();
        }
        setPost(postData);
      } catch (error) {
        console.error("Error loading post:", error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (!slug || loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "200px",
        }}
      >
        <div>Загрузка поста...</div>
      </div>
    );
  }

  if (!post) {
    notFound();
  }

  return (
    <div>
      <Link
        href="/blog"
        style={{
          color: "blue",
          textDecoration: "underline",
          marginBottom: "20px",
          display: "block",
        }}
      >
        ← Назад к списку постов
      </Link>

      <article>
        <h1>{post.title}</h1>
        <div style={{ color: "#666", marginBottom: "20px" }}>
          <span>Автор: {post.author}</span> |<span> Дата: {post.date}</span>
        </div>

        <div style={{ lineHeight: "1.6" }}>
          <p>{post.content}</p>
          <p>
            Slug этой страницы: <strong>{slug}</strong>
          </p>
        </div>

        <div style={{ marginTop: "30px" }}>
          <Link
            href={`/blog/${slug}/edit`}
            style={{
              display: "inline-block",
              padding: "10px 20px",
              background: "#007bff",
              color: "white",
              textDecoration: "none",
              borderRadius: "5px",
            }}
          >
            Редактировать этот пост
          </Link>
        </div>
      </article>
    </div>
  );
}

async function getPostData(slug) {
  // Моковые данные
  const blogPosts = {
    "first-post": {
      title: "Мой первый пост",
      content:
        "Это содержание моего первого поста в блоге. Здесь я рассказываю о своих впечатлениях...",
      author: "Иван Иванов",
      date: "2024-01-15",
    },
    "react-tutorial": {
      title: "React Tutorial",
      content:
        "В этом руководстве мы изучим основы React, включая компоненты, состояния и хуки...",
      author: "Петр Петров",
      date: "2024-01-10",
    },
    "nextjs-guide": {
      title: "Next.js Guide",
      content:
        "Next.js - это мощный фреймворк для React. В этом посте мы рассмотрим маршрутизацию, рендеринг и API...",
      author: "Мария Сидорова",
      date: "2024-01-05",
    },
  };

  // Имитация задержки сети
  await new Promise((resolve) => setTimeout(resolve, 500));
  return blogPosts[slug];
}

// Генерация метаданных для SEO
export async function generateMetadata({ params }) {
  const { slug } = params;
  const post = blogPosts[slug];

  if (!post) {
    return {
      title: "Пост не найден",
    };
  }

  return {
    title: post.title,
    description: post.content.slice(0, 160) + "...",
  };
}

// Генерация статических параметров (SSG)
export async function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({
    slug: slug,
  }));
}

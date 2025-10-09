import Image from "next/image";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div
      className={`${geistSans.className} ${geistMono.className} font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20`}
    >
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1>Home Page</h1>
        <Link href="/about">About Page</Link>
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />

        <h3>Блог:</h3>
        <ul>
          <li>
            <Link href="/blog/first-post">Первый пост</Link>
          </li>
          <li>
            <Link href="/blog/react-tutorial">React Tutorial</Link>
          </li>
          <li>
            <Link href="/blog/nextjs-guide">Next.js Guide</Link>
          </li>
        </ul>

        <h3>Пользователи:</h3>
        <ul>
          <li>
            <Link href="/users/1">Пользователь 1</Link>
          </li>
          <li>
            <Link href="/users/2">Пользователь 2</Link>
          </li>
          <li>
            <Link href="/users/1/posts/5">Пост 5 пользователя 1</Link>
          </li>
        </ul>
      </main>
    </div>
  );
}

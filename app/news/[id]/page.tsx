import { getNewsPost } from "@/lib/api";
import { notFound } from "next/navigation";
import Link from "next/link";
import styles from "./post.module.css";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getNewsPost(Number(id));
  if (!post) return { title: "Новость не найдена — StrongPlay" };
  return {
    title: `${post.title} — StrongPlay`,
    description: post.summary || post.title,
  };
}

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getNewsPost(Number(id));
  if (!post) notFound();

  const date = new Date(post.createdAt).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Link href="/news" className={styles.back}>
          ← Все новости
        </Link>

        <article className={styles.article}>
          <time className={styles.date}>{date}</time>
          <h1 className={styles.title}>{post.title}</h1>
          {post.image && (
            <div className={styles.imageWrapper}>
              <img src={post.image} alt={post.title} className={styles.image} />
            </div>
          )}
          <div className={styles.content}>
            {post.content.split("\n").map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}

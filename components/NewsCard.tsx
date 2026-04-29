import Image from "next/image";
import Link from "next/link";
import type { ApiNewsPost } from "@/lib/api";
import styles from "./NewsCard.module.css";

export default function NewsCard({ post }: { post: ApiNewsPost }) {
  const date = new Date(post.createdAt).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Link href={`/news/${post.id}`} className={styles.card}>
      {post.image && (
        <div className={styles.imageWrapper}>
          <Image src={post.image} alt={post.title} className={styles.image} fill sizes="400px" />
        </div>
      )}
      <div className={styles.body}>
        <time className={styles.date}>{date}</time>
        <h3 className={styles.title}>{post.title}</h3>
        {post.summary && <p className={styles.summary}>{post.summary}</p>}
      </div>
    </Link>
  );
}

"use client";

import { useState } from "react";
import type { ApiNewsPost } from "@/lib/api";
import styles from "./news.module.css";

type SortKey = "newest" | "oldest";
type ViewMode = "grid" | "list";

export default function NewsList({ posts }: { posts: ApiNewsPost[] }) {
  const [sort, setSort] = useState<SortKey>("newest");
  const [view, setView] = useState<ViewMode>("grid");

  const sorted = [...posts].sort((a, b) => {
    const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    return sort === "newest" ? -diff : diff;
  });

  return (
    <>
      <div className={styles.toolbar}>
        <div className={styles.sortGroup}>
          <span className={styles.toolbarLabel}>Сортировка:</span>
          <button
            className={`${styles.sortBtn} ${sort === "newest" ? styles.sortBtnActive : ""}`}
            onClick={() => setSort("newest")}
          >
            Сначала новые
          </button>
          <button
            className={`${styles.sortBtn} ${sort === "oldest" ? styles.sortBtnActive : ""}`}
            onClick={() => setSort("oldest")}
          >
            Сначала старые
          </button>
        </div>
        <div className={styles.viewGroup}>
          <button
            className={`${styles.viewBtn} ${view === "grid" ? styles.viewBtnActive : ""}`}
            onClick={() => setView("grid")}
            title="Сетка"
          >
            ▦
          </button>
          <button
            className={`${styles.viewBtn} ${view === "list" ? styles.viewBtnActive : ""}`}
            onClick={() => setView("list")}
            title="Список"
          >
            ☰
          </button>
        </div>
      </div>

      {sorted.length > 0 ? (
        <div className={view === "grid" ? styles.grid : styles.list}>
          {sorted.map((post) => (
            <NewsItem key={post.id} post={post} view={view} />
          ))}
        </div>
      ) : (
        <p className={styles.empty}>Новостей пока нет</p>
      )}
    </>
  );
}

function NewsItem({ post, view }: { post: ApiNewsPost; view: ViewMode }) {
  const date = new Date(post.createdAt).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (view === "list") {
    return (
      <a href={`/news/${post.id}`} className={styles.listItem}>
        <time className={styles.listDate}>{date}</time>
        <span className={styles.listTitle}>{post.title}</span>
        {post.summary && <span className={styles.listSummary}>{post.summary}</span>}
      </a>
    );
  }

  return (
    <a href={`/news/${post.id}`} className={styles.gridCard}>
      {post.image && (
        <div className={styles.gridImageWrapper}>
          <img src={post.image} alt={post.title} className={styles.gridImage} />
        </div>
      )}
      <div className={styles.gridBody}>
        <time className={styles.gridDate}>{date}</time>
        <h3 className={styles.gridTitle}>{post.title}</h3>
        {post.summary && <p className={styles.gridSummary}>{post.summary}</p>}
      </div>
    </a>
  );
}

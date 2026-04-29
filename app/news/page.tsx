import { getPublishedNews } from "@/lib/api";
import NewsList from "./NewsList";
import styles from "./news.module.css";

export async function generateMetadata() {
  return {
    title: "Новости — StrongPlay",
    description: "Последние новости игрового сообщества StrongPlay",
  };
}

export default async function NewsPage() {
  const news = await getPublishedNews();

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Новости</h1>
        <p className={styles.subtitle}>
          Последние события сообщества StrongPlay
        </p>
        <NewsList posts={news} />
      </div>
    </div>
  );
}

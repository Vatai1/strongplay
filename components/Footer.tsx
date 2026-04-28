import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <span className={styles.logo}>&lt;StrongPlay/&gt;</span>
          <p className={styles.tagline}>Играем. Побеждаем. Вместе.</p>
        </div>

        <div className={styles.links}>
          <span className={styles.sectionTitle}>Навигация</span>
          <Link href="/" className={styles.link}>Главная</Link>
          <Link href="/teams" className={styles.link}>Команды</Link>
          <Link href="/gallery" className={styles.link}>Галерея</Link>
        </div>

        <div className={styles.links}>
          <span className={styles.sectionTitle}>Мы в сети</span>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            YouTube
          </a>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>&copy; {year} StrongPlay. Все права защищены.</p>
      </div>
    </footer>
  );
}

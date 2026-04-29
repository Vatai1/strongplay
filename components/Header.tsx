"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./Header.module.css";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          &lt;StrongPlay/&gt;
        </Link>

        <button
          className={styles.burger}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Меню"
        >
          <span className={`${styles.burgerLine} ${menuOpen ? styles.burgerOpen : ""}`} />
          <span className={`${styles.burgerLine} ${menuOpen ? styles.burgerOpen : ""}`} />
          <span className={`${styles.burgerLine} ${menuOpen ? styles.burgerOpen : ""}`} />
        </button>

        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`}>
          <Link href="/" className={styles.link} onClick={() => setMenuOpen(false)}>
            Главная
          </Link>
          <Link href="/teams" className={styles.link} onClick={() => setMenuOpen(false)}>
            Команды
          </Link>
          <Link href="/gallery" className={styles.link} onClick={() => setMenuOpen(false)}>
            Галерея
          </Link>
          <Link href="/news" className={styles.link} onClick={() => setMenuOpen(false)}>
            Новости
          </Link>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.youtubeLink}
          >
            YouTube
          </a>
        </nav>
      </div>
    </header>
  );
}

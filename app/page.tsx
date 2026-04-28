import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.scanlines} />
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            <span className={styles.titleAccent}>&lt;</span>
            StrongPlay
            <span className={styles.titleAccent}>/&gt;</span>
          </h1>
          <p className={styles.subtitle}>Играем. Побеждаем. Вместе.</p>
          <div className={styles.heroActions}>
            <a href="/teams" className={styles.btnPrimary}>
              Наши команды
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnSecondary}
            >
              YouTube
            </a>
          </div>
        </div>
        <div className={styles.pixelGrid} />
      </section>

      <section className={styles.about}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>О нас</h2>
          <div className={styles.aboutGrid}>
            <div className={styles.aboutCard}>
              <span className={styles.aboutIcon}>01</span>
              <h3 className={styles.aboutCardTitle}>Мультигейминг</h3>
              <p className={styles.aboutText}>
                Мы играем в разные жанры: FPS, MOBA, RPG и многое другое.
                Каждый найдёт себе команду по душе.
              </p>
            </div>
            <div className={styles.aboutCard}>
              <span className={styles.aboutIcon}>02</span>
              <h3 className={styles.aboutCardTitle}>Турниры</h3>
              <p className={styles.aboutText}>
                Регулярные внутренние и внешние турниры.
                Соревнуйся, прокачивай скилл и побеждай.
              </p>
            </div>
            <div className={styles.aboutCard}>
              <span className={styles.aboutIcon}>03</span>
              <h3 className={styles.aboutCardTitle}>Сообщество</h3>
              <p className={styles.aboutText}>
                Дружелюбная атмосфера, опытные игроки и активный
                контент на YouTube.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.games}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Наши игры</h2>
          <div className={styles.gamesList}>
            <div className={styles.gameTag}>Counter-Strike 2</div>
            <div className={styles.gameTag}>Dota 2</div>
            <div className={styles.gameTag}>Valorant</div>
            <div className={styles.gameTag}>И другие...</div>
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className={styles.container}>
          <h2 className={styles.ctaTitle}>Готов присоединиться?</h2>
          <p className={styles.ctaText}>
            Подписывайся на наш YouTube и становись частью StrongPlay!
          </p>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.btnPrimary}
          >
            Подписаться
          </a>
        </div>
      </section>
    </div>
  );
}

import { getPageMeta } from "@/lib/api";
import styles from "./page.module.css";

export default async function Home() {
  const page = await getPageMeta("home");
  const content = (page?.content || {}) as Record<string, unknown>;
  const slogan = (content.slogan as string) || "Играем. Побеждаем. Вместе.";
  const games = (content.games as string[]) || ["Counter-Strike 2", "Dota 2", "Valorant"];
  const aboutCards = (content.aboutCards as Array<{ icon: string; title: string; text: string }>) || [
    { icon: "01", title: "Мультигейминг", text: "Мы играем в разные жанры: FPS, MOBA, RPG и многое другое. Каждый найдёт себе команду по душе." },
    { icon: "02", title: "Турниры", text: "Регулярные внутренние и внешние турниры. Соревнуйся, прокачивай скилл и побеждай." },
    { icon: "03", title: "Сообщество", text: "Дружелюбная атмосфера, опытные игроки и активный контент на YouTube." },
  ];

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
          <p className={styles.subtitle}>{slogan}</p>
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
            {aboutCards.map((card) => (
              <div className={styles.aboutCard} key={card.icon}>
                <span className={styles.aboutIcon}>{card.icon}</span>
                <h3 className={styles.aboutCardTitle}>{card.title}</h3>
                <p className={styles.aboutText}>{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.games}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Наши игры</h2>
          <div className={styles.gamesList}>
            {games.map((game) => (
              <div className={styles.gameTag} key={game}>{game}</div>
            ))}
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

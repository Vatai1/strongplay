import { teams } from "@/data/teams";
import TeamCard from "@/components/TeamCard";
import styles from "./teams.module.css";

export const metadata = {
  title: "Команды — StrongPlay",
  description: "Состав игровых команд StrongPlay",
};

export default function TeamsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Наши команды</h1>
        <p className={styles.subtitle}>
          Познакомься с игроками StrongPlay
        </p>

        <div className={styles.teamsList}>
          {teams.map((team, index) => (
            <section key={index} className={styles.teamSection}>
              <h2 className={styles.gameTitle}>
                <span className={styles.gameIndex}>{String(index + 1).padStart(2, "0")}</span>
                {team.game}
              </h2>
              <div className={styles.playersGrid}>
                {team.players.map((player, pIndex) => (
                  <TeamCard key={pIndex} player={player} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

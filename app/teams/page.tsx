import { getTeams, getPageMeta } from "@/lib/api";
import TeamCard from "@/components/TeamCard";
import styles from "./teams.module.css";

export async function generateMetadata() {
  const page = await getPageMeta("teams");
  return {
    title: page?.title || "Команды — StrongPlay",
    description: page?.description || "Состав игровых команд StrongPlay",
  };
}

export default async function TeamsPage() {
  const teams = await getTeams();

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Наши команды</h1>
        <p className={styles.subtitle}>
          Познакомься с игроками StrongPlay
        </p>

        <div className={styles.teamsList}>
          {teams.map((team, index) => (
            <section key={team.id} className={styles.teamSection}>
              <h2 className={styles.gameTitle}>
                <span className={styles.gameIndex}>{String(index + 1).padStart(2, "0")}</span>
                {team.game}
              </h2>
              <div className={styles.playersGrid}>
                {team.players.map((player) => (
                  <TeamCard key={player.id} player={{ nickname: player.nickname, role: player.role, avatar: player.avatar }} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

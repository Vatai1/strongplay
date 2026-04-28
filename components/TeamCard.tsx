import { Player } from "@/data/teams";
import styles from "./TeamCard.module.css";

export default function TeamCard({ player }: { player: Player }) {
  return (
    <div className={styles.card}>
      <div className={styles.avatarWrapper}>
        <div className={styles.avatar}>
          {player.nickname.charAt(0)}
        </div>
      </div>
      <div className={styles.info}>
        <span className={styles.nickname}>{player.nickname}</span>
        <span className={styles.role}>{player.role}</span>
      </div>
    </div>
  );
}

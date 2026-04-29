import { useEffect, useState } from "react";
import { api } from "../api";

interface Team {
  id: number;
  game: string;
  players: Array<{ id: number; nickname: string; role: string }>;
}

interface PageMeta {
  slug: string;
  title: string;
}

export default function Dashboard() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [pages, setPages] = useState<PageMeta[]>([]);
  const [galleryCount, setGalleryCount] = useState(0);

  useEffect(() => {
    api.teams.list().then(setTeams);
    api.pages.list().then(setPages);
    api.gallery.list().then((g) => setGalleryCount(g.length));
  }, []);

  const totalPlayers = teams.reduce((sum, t) => sum + t.players.length, 0);

  return (
    <div>
      <div className="crm-header">
        <h1 className="crm-title">Дашборд</h1>
      </div>

      <div className="crm-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
        <div className="crm-card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2rem", color: "var(--accent-green)", marginBottom: "0.5rem" }}>
            {teams.length}
          </div>
          <div style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>Команд</div>
        </div>
        <div className="crm-card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2rem", color: "var(--accent-cyan)", marginBottom: "0.5rem" }}>
            {totalPlayers}
          </div>
          <div style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>Игроков</div>
        </div>
        <div className="crm-card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2rem", color: "var(--accent-pink)", marginBottom: "0.5rem" }}>
            {galleryCount}
          </div>
          <div style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>Фото</div>
        </div>
        <div className="crm-card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2rem", color: "var(--accent-green)", marginBottom: "0.5rem" }}>
            {pages.length}
          </div>
          <div style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>Страниц</div>
        </div>
      </div>

      <div className="crm-card" style={{ marginTop: "1.5rem" }}>
        <div className="crm-card-title">Команды</div>
        <table className="crm-table">
          <thead>
            <tr>
              <th>Игра</th>
              <th>Игроков</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr key={team.id}>
                <td>{team.game}</td>
                <td>{team.players.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

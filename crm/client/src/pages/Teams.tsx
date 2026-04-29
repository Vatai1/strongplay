import { useEffect, useState } from "react";
import { api } from "../api";
import ConfirmModal from "../components/ConfirmModal";

interface Player {
  id: number;
  nickname: string;
  role: string;
  avatar: string;
}

interface Team {
  id: number;
  game: string;
  logo: string;
  order: number;
  players: Player[];
}

interface ModalState {
  type: "team" | "assign" | null;
  teamId?: number;
}

export default function Teams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [freePlayers, setFreePlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalState>({ type: null });
  const [form, setForm] = useState({ game: "", logo: "" });
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [confirm, setConfirm] = useState<{ title: string; message: string; confirmLabel?: string; action: () => void } | null>(null);

  const load = async () => {
    setLoading(true);
    const [t, f] = await Promise.all([api.teams.list(), api.players.listFree()]);
    setTeams(t);
    setFreePlayers(f);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNewTeam = () => {
    setForm({ game: "", logo: "" });
    setModal({ type: "team" });
  };

  const openEditTeam = (team: Team) => {
    setForm({ game: team.game, logo: team.logo });
    setModal({ type: "team", teamId: team.id });
  };

  const openAssignPlayer = (teamId: number) => {
    setSelectedPlayerId(null);
    setModal({ type: "assign", teamId });
  };

  const saveTeam = async () => {
    if (modal.teamId) {
      await api.teams.update(modal.teamId, { game: form.game, logo: form.logo });
    } else {
      await api.teams.create({ game: form.game, logo: form.logo });
    }
    setModal({ type: null });
    load();
  };

  const assignPlayer = async () => {
    if (!modal.teamId || !selectedPlayerId) return;
    await api.players.assign(selectedPlayerId, modal.teamId);
    setModal({ type: null });
    load();
  };

  const removePlayer = (player: Player) => {
    setConfirm({
      title: "Убрать игрока из команды",
      message: `Убрать игрока «${player.nickname}» из команды? Он вернётся в список свободных игроков.`,
      confirmLabel: "Убрать",
      action: async () => {
        await api.players.unassign(player.id);
        setConfirm(null);
        load();
      },
    });
  };

  const deleteTeam = (team: Team) => {
    setConfirm({
      title: "Удалить команду",
      message: `Удалить команду «${team.game}»? Все игроки станут свободными. Это действие нельзя отменить.`,
      confirmLabel: "Удалить",
      action: async () => {
        await api.teams.delete(team.id);
        setConfirm(null);
        load();
      },
    });
  };

  if (loading) return <div style={{ color: "var(--text-secondary)" }}>Загрузка...</div>;

  return (
    <div>
      <div className="crm-header">
        <h1 className="crm-title">Команды</h1>
        <button className="crm-btn" onClick={openNewTeam}>+ Добавить команду</button>
      </div>

      {teams.map((team) => (
        <div className="crm-card" key={team.id}>
          <div className="crm-card-title" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>{team.game} ({team.players.length} игроков)</span>
            <div className="crm-actions">
              <button className="crm-btn crm-btn-small crm-btn-outline" onClick={() => openAssignPlayer(team.id)}>+ Игрок</button>
              <button className="crm-btn crm-btn-small crm-btn-outline" onClick={() => openEditTeam(team)}>Ред.</button>
              <button className="crm-btn crm-btn-small crm-btn-danger" onClick={() => deleteTeam(team)}>Удал.</button>
            </div>
          </div>
          <table className="crm-table">
            <thead>
              <tr>
                <th>Ник</th>
                <th>Роль</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {team.players.map((player) => (
                <tr key={player.id}>
                  <td>{player.nickname}</td>
                  <td>{player.role}</td>
                  <td>
                    <button className="crm-btn crm-btn-small crm-btn-danger" onClick={() => removePlayer(player)}>
                      Убрать
                    </button>
                  </td>
                </tr>
              ))}
              {team.players.length === 0 && (
                <tr><td colSpan={3} style={{ color: "var(--text-secondary)", textAlign: "center" }}>Нет игроков — добавьте из раздела «Игроки»</td></tr>
              )}
            </tbody>
          </table>
        </div>
      ))}

      {modal.type === "team" && (
        <div className="crm-modal-overlay" onClick={() => setModal({ type: null })}>
          <div className="crm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="crm-modal-title">{modal.teamId ? "Редактировать команду" : "Новая команда"}</div>
            <div className="crm-form-group">
              <label className="crm-label">Название игры</label>
              <input className="crm-input" value={form.game} onChange={(e) => setForm({ ...form, game: e.target.value })} />
            </div>
            <div className="crm-form-group">
              <label className="crm-label">Логотип (путь)</label>
              <input className="crm-input" value={form.logo} onChange={(e) => setForm({ ...form, logo: e.target.value })} />
            </div>
            <div className="crm-actions" style={{ justifyContent: "flex-end" }}>
              <button className="crm-btn crm-btn-outline" onClick={() => setModal({ type: null })}>Отмена</button>
              <button className="crm-btn" onClick={saveTeam}>Сохранить</button>
            </div>
          </div>
        </div>
      )}

      {modal.type === "assign" && (
        <div className="crm-modal-overlay" onClick={() => setModal({ type: null })}>
          <div className="crm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="crm-modal-title">Добавить игрока в команду</div>
            <div className="crm-form-group">
              <label className="crm-label">Свободные игроки</label>
              {freePlayers.length === 0 ? (
                <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                  Нет свободных игроков. Добавьте новых в разделе «Игроки».
                </p>
              ) : (
                <select
                  className="crm-select"
                  value={selectedPlayerId ?? ""}
                  onChange={(e) => setSelectedPlayerId(e.target.value ? Number(e.target.value) : null)}
                >
                  <option value="">— Выберите игрока —</option>
                  {freePlayers.map((p) => (
                    <option key={p.id} value={p.id}>{p.nickname} {p.role ? `(${p.role})` : ""}</option>
                  ))}
                </select>
              )}
            </div>
            <div className="crm-actions" style={{ justifyContent: "flex-end" }}>
              <button className="crm-btn crm-btn-outline" onClick={() => setModal({ type: null })}>Отмена</button>
              <button className="crm-btn" onClick={assignPlayer} disabled={!selectedPlayerId || freePlayers.length === 0}>Добавить</button>
            </div>
          </div>
        </div>
      )}

      {confirm && (
        <ConfirmModal
          title={confirm.title}
          message={confirm.message}
          confirmLabel={confirm.confirmLabel || "Подтвердить"}
          danger
          onConfirm={confirm.action}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}

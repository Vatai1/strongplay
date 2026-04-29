import { useEffect, useState } from "react";
import { api } from "../api";
import ConfirmModal from "../components/ConfirmModal";

interface Team {
  id: number;
  game: string;
}

interface Player {
  id: number;
  nickname: string;
  role: string;
  avatar: string;
  teamId: number | null;
  team: Team | null;
}

interface ModalState {
  type: "edit" | "assign" | null;
  player?: Player;
}

export default function Players() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalState>({ type: null });
  const [form, setForm] = useState({ nickname: "", role: "", avatar: "" });
  const [assignTeamId, setAssignTeamId] = useState<number | null>(null);
  const [addForm, setAddForm] = useState({ nickname: "", role: "", avatar: "" });
  const [showAdd, setShowAdd] = useState(false);
  const [confirm, setConfirm] = useState<{ title: string; message: string; action: () => void } | null>(null);

  const load = async () => {
    setLoading(true);
    const [p, t] = await Promise.all([api.players.list(), api.teams.list()]);
    setPlayers(p);
    setTeams(t);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!addForm.nickname) return;
    await api.players.create(addForm);
    setAddForm({ nickname: "", role: "", avatar: "" });
    setShowAdd(false);
    load();
  };

  const openEdit = (player: Player) => {
    setForm({ nickname: player.nickname, role: player.role, avatar: player.avatar });
    setModal({ type: "edit", player });
  };

  const saveEdit = async () => {
    if (!modal.player) return;
    await api.players.update(modal.player.id, form);
    setModal({ type: null });
    load();
  };

  const openAssign = (player: Player) => {
    setAssignTeamId(player.teamId);
    setModal({ type: "assign", player });
  };

  const saveAssign = async () => {
    if (!modal.player) return;
    if (assignTeamId) {
      await api.players.assign(modal.player.id, assignTeamId);
    } else {
      await api.players.unassign(modal.player.id);
    }
    setModal({ type: null });
    load();
  };

  const handleDelete = (player: Player) => {
    setConfirm({
      title: "Удалить игрока",
      message: `Вы уверены, что хотите удалить игрока «${player.nickname}»? Это действие нельзя отменить.`,
      action: async () => {
        await api.players.delete(player.id);
        setConfirm(null);
        load();
      },
    });
  };

  if (loading) return <div style={{ color: "var(--text-secondary)" }}>Загрузка...</div>;

  return (
    <div>
      <div className="crm-header">
        <h1 className="crm-title">Игроки</h1>
        <button className="crm-btn" onClick={() => setShowAdd(true)}>+ Добавить игрока</button>
      </div>

      {showAdd && (
        <div className="crm-card">
          <div className="crm-card-title">Новый игрок</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: "0.75rem", alignItems: "end" }}>
            <div className="crm-form-group" style={{ margin: 0 }}>
              <label className="crm-label">Никнейм</label>
              <input className="crm-input" value={addForm.nickname} onChange={(e) => setAddForm({ ...addForm, nickname: e.target.value })} />
            </div>
            <div className="crm-form-group" style={{ margin: 0 }}>
              <label className="crm-label">Роль</label>
              <input className="crm-input" value={addForm.role} onChange={(e) => setAddForm({ ...addForm, role: e.target.value })} />
            </div>
            <div className="crm-form-group" style={{ margin: 0 }}>
              <label className="crm-label">Аватар (путь)</label>
              <input className="crm-input" value={addForm.avatar} onChange={(e) => setAddForm({ ...addForm, avatar: e.target.value })} />
            </div>
            <div className="crm-actions">
              <button className="crm-btn" onClick={handleAdd}>Добавить</button>
              <button className="crm-btn crm-btn-outline" onClick={() => setShowAdd(false)}>Отмена</button>
            </div>
          </div>
        </div>
      )}

      <div className="crm-card">
        <table className="crm-table">
          <thead>
            <tr>
              <th>Никнейм</th>
              <th>Роль</th>
              <th>Команда</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <tr key={player.id}>
                <td>{player.nickname}</td>
                <td>{player.role || "—"}</td>
                <td>
                  <span
                    style={{
                      padding: "0.2rem 0.5rem",
                      background: player.team ? "var(--accent-green)" : "var(--bg-secondary)",
                      color: player.team ? "var(--bg-primary)" : "var(--text-secondary)",
                      fontSize: "0.75rem",
                    }}
                  >
                    {player.team?.game || "Без команды"}
                  </span>
                </td>
                <td>
                  <div className="crm-actions">
                    <button className="crm-btn crm-btn-small crm-btn-outline" onClick={() => openAssign(player)}>
                      Команда
                    </button>
                    <button className="crm-btn crm-btn-small crm-btn-outline" onClick={() => openEdit(player)}>
                      Ред.
                    </button>
                    <button className="crm-btn crm-btn-small crm-btn-danger" onClick={() => handleDelete(player)}>
                      Удал.
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {players.length === 0 && (
              <tr><td colSpan={4} style={{ color: "var(--text-secondary)", textAlign: "center" }}>Нет игроков</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modal.type === "edit" && (
        <div className="crm-modal-overlay" onClick={() => setModal({ type: null })}>
          <div className="crm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="crm-modal-title">Редактировать игрока</div>
            <div className="crm-form-group">
              <label className="crm-label">Никнейм</label>
              <input className="crm-input" value={form.nickname} onChange={(e) => setForm({ ...form, nickname: e.target.value })} />
            </div>
            <div className="crm-form-group">
              <label className="crm-label">Роль</label>
              <input className="crm-input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
            </div>
            <div className="crm-form-group">
              <label className="crm-label">Аватар (путь)</label>
              <input className="crm-input" value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })} />
            </div>
            <div className="crm-actions" style={{ justifyContent: "flex-end" }}>
              <button className="crm-btn crm-btn-outline" onClick={() => setModal({ type: null })}>Отмена</button>
              <button className="crm-btn" onClick={saveEdit}>Сохранить</button>
            </div>
          </div>
        </div>
      )}

      {modal.type === "assign" && modal.player && (
        <div className="crm-modal-overlay" onClick={() => setModal({ type: null })}>
          <div className="crm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="crm-modal-title">Назначить команду: {modal.player.nickname}</div>
            <div className="crm-form-group">
              <label className="crm-label">Команда</label>
              <select
                className="crm-select"
                value={assignTeamId ?? ""}
                onChange={(e) => setAssignTeamId(e.target.value ? Number(e.target.value) : null)}
              >
                <option value="">Без команды</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>{team.game}</option>
                ))}
              </select>
            </div>
            <div className="crm-actions" style={{ justifyContent: "flex-end" }}>
              <button className="crm-btn crm-btn-outline" onClick={() => setModal({ type: null })}>Отмена</button>
              <button className="crm-btn" onClick={saveAssign}>Назначить</button>
            </div>
          </div>
        </div>
      )}

      {confirm && (
        <ConfirmModal
          title={confirm.title}
          message={confirm.message}
          confirmLabel="Удалить"
          danger
          onConfirm={confirm.action}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}

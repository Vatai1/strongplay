import { useEffect, useState } from "react";
import { api } from "../api";
import ConfirmModal from "../components/ConfirmModal";

interface Game {
  id: number;
  name: string;
  url: string;
  logo: string;
  visible: boolean;
  order: number;
}

export default function Games() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", url: "", logo: "" });
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: "", url: "", logo: "" });
  const [confirm, setConfirm] = useState<{ title: string; message: string; action: () => void } | null>(null);

  const load = async () => {
    setLoading(true);
    setGames(await api.games.list());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!addForm.name) return;
    await api.games.create(addForm);
    setAddForm({ name: "", url: "", logo: "" });
    setShowAdd(false);
    load();
  };

  const openEdit = (game: Game) => {
    setEditForm({ name: game.name, url: game.url, logo: game.logo });
    setEditId(game.id);
  };

  const saveEdit = async () => {
    if (editId === null) return;
    await api.games.update(editId, editForm);
    setEditId(null);
    load();
  };

  const toggleVisible = async (game: Game) => {
    await api.games.update(game.id, { visible: !game.visible });
    load();
  };

  const handleDelete = (game: Game) => {
    setConfirm({
      title: "Удалить игру",
      message: `Удалить «${game.name}»? Это действие нельзя отменить.`,
      action: async () => {
        await api.games.delete(game.id);
        setConfirm(null);
        load();
      },
    });
  };

  if (loading) return <div style={{ color: "var(--text-secondary)" }}>Загрузка...</div>;

  return (
    <div>
      <div className="crm-header">
        <h1 className="crm-title">Игры</h1>
        <button className="crm-btn" onClick={() => setShowAdd(true)}>+ Добавить игру</button>
      </div>

      {showAdd && (
        <div className="crm-card">
          <div className="crm-card-title">Новая игра</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: "0.75rem", alignItems: "end" }}>
            <div className="crm-form-group" style={{ margin: 0 }}>
              <label className="crm-label">Название</label>
              <input className="crm-input" value={addForm.name} onChange={(e) => setAddForm({ ...addForm, name: e.target.value })} />
            </div>
            <div className="crm-form-group" style={{ margin: 0 }}>
              <label className="crm-label">Ссылка (URL)</label>
              <input className="crm-input" value={addForm.url} onChange={(e) => setAddForm({ ...addForm, url: e.target.value })} placeholder="https://..." />
            </div>
            <div className="crm-form-group" style={{ margin: 0 }}>
              <label className="crm-label">Логотип (путь)</label>
              <input className="crm-input" value={addForm.logo} onChange={(e) => setAddForm({ ...addForm, logo: e.target.value })} />
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
              <th>Название</th>
              <th>Ссылка</th>
              <th>На главной</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {games.map((game) => (
              <tr key={game.id}>
                <td>
                  {editId === game.id ? (
                    <input
                      className="crm-input"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    />
                  ) : (
                    game.name
                  )}
                </td>
                <td>
                  {editId === game.id ? (
                    <input
                      className="crm-input"
                      value={editForm.url}
                      onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
                      placeholder="https://..."
                    />
                  ) : game.url ? (
                    <a href={game.url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-cyan)", fontSize: "0.85rem" }}>
                      {game.url.length > 40 ? game.url.slice(0, 40) + "..." : game.url}
                    </a>
                  ) : (
                    <span style={{ color: "var(--text-secondary)" }}>—</span>
                  )}
                </td>
                <td>
                  <button
                    className={`crm-btn crm-btn-small ${game.visible ? "" : "crm-btn-outline"}`}
                    style={game.visible ? { background: "var(--accent-green)", borderColor: "var(--accent-green)", color: "var(--bg-primary)" } : {}}
                    onClick={() => toggleVisible(game)}
                  >
                    {game.visible ? "Видна" : "Скрыта"}
                  </button>
                </td>
                <td>
                  {editId === game.id ? (
                    <div className="crm-actions">
                      <button className="crm-btn crm-btn-small" onClick={saveEdit}>Сохранить</button>
                      <button className="crm-btn crm-btn-small crm-btn-outline" onClick={() => setEditId(null)}>Отмена</button>
                    </div>
                  ) : (
                    <div className="crm-actions">
                      <button className="crm-btn crm-btn-small crm-btn-outline" onClick={() => openEdit(game)}>Ред.</button>
                      <button className="crm-btn crm-btn-small crm-btn-danger" onClick={() => handleDelete(game)}>Удал.</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {games.length === 0 && (
              <tr><td colSpan={4} style={{ color: "var(--text-secondary)", textAlign: "center" }}>Нет игр</td></tr>
            )}
          </tbody>
        </table>
      </div>

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

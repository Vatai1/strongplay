import { useEffect, useState } from "react";
import { api } from "../api";

interface PageData {
  id: number;
  slug: string;
  title: string;
  description: string;
  content: Record<string, unknown>;
}

export default function Settings() {
  const [pages, setPages] = useState<PageData[]>([]);
  const [activeSlug, setActiveSlug] = useState<string>("home");
  const [form, setForm] = useState({ title: "", description: "", slogan: "", gamesStr: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await api.pages.list();
    setPages(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const page = pages.find((p) => p.slug === activeSlug);
    if (!page) return;
    const content = page.content as Record<string, unknown>;
    setForm({
      title: page.title || "",
      description: page.description || "",
      slogan: (content.slogan as string) || "",
      gamesStr: Array.isArray(content.games) ? (content.games as string[]).join(", ") : "",
    });
    setSaved(false);
  }, [activeSlug, pages]);

  const handleSave = async () => {
    setSaving(true);
    const games = form.gamesStr.split(",").map((g) => g.trim()).filter(Boolean);
    const content: Record<string, unknown> = {};
    if (activeSlug === "home") {
      content.slogan = form.slogan;
      content.games = games;
      const currentPage = pages.find((p) => p.slug === "home");
      if (currentPage) {
        const currentContent = currentPage.content as Record<string, unknown>;
        if (currentContent.aboutCards) {
          content.aboutCards = currentContent.aboutCards;
        }
      }
    }
    await api.pages.update(activeSlug, {
      title: form.title,
      description: form.description,
      content,
    });
    setSaving(false);
    setSaved(true);
    load();
  };

  if (loading) return <div style={{ color: "var(--text-secondary)" }}>Загрузка...</div>;

  return (
    <div>
      <div className="crm-header">
        <h1 className="crm-title">Настройки</h1>
      </div>

      <div className="crm-card">
        <div className="crm-card-title">Страница</div>
        <select
          className="crm-select"
          value={activeSlug}
          onChange={(e) => setActiveSlug(e.target.value)}
        >
          {pages.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.slug} — {p.title}
            </option>
          ))}
        </select>
      </div>

      <div className="crm-card">
        <div className="crm-card-title">SEO и контент</div>
        <div className="crm-form-group">
          <label className="crm-label">Title (SEO)</label>
          <input
            className="crm-input"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>
        <div className="crm-form-group">
          <label className="crm-label">Description (SEO)</label>
          <textarea
            className="crm-textarea"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        {activeSlug === "home" && (
          <>
            <div className="crm-form-group">
              <label className="crm-label">Слоган</label>
              <input
                className="crm-input"
                value={form.slogan}
                onChange={(e) => setForm({ ...form, slogan: e.target.value })}
              />
            </div>
            <div className="crm-form-group">
              <label className="crm-label">Игры (через запятую)</label>
              <input
                className="crm-input"
                value={form.gamesStr}
                onChange={(e) => setForm({ ...form, gamesStr: e.target.value })}
              />
            </div>
          </>
        )}

        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <button className="crm-btn" onClick={handleSave} disabled={saving}>
            {saving ? "Сохранение..." : "Сохранить"}
          </button>
          {saved && <span style={{ color: "var(--accent-green)", fontSize: "0.85rem" }}>Сохранено!</span>}
        </div>
      </div>
    </div>
  );
}

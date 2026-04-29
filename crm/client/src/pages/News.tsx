import { useEffect, useState, useRef } from "react";
import { api } from "../api";
import ConfirmModal from "../components/ConfirmModal";

interface NewsPost {
  id: number;
  title: string;
  summary: string;
  content: string;
  image: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

interface FormState {
  title: string;
  summary: string;
  content: string;
  published: boolean;
}

const emptyForm: FormState = { title: "", summary: "", content: "", published: true };

export default function News() {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<{ title: string; message: string; action: () => void } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    setPosts(await api.news.list());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditId(null);
    setImageFile(null);
    setPreview(null);
    setUploading(false);
    setProgress(0);
    setSpeed("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const openCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const openEdit = (post: NewsPost) => {
    setForm({
      title: post.title,
      summary: post.summary,
      content: post.content,
      published: post.published,
    });
    setEditId(post.id);
    setPreview(post.image || null);
    setImageFile(null);
    if (fileRef.current) fileRef.current.value = "";
    setShowModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      alert("Укажите заголовок");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("summary", form.summary);
    formData.append("content", form.content);
    formData.append("published", String(form.published));
    if (imageFile) {
      formData.append("image", imageFile);
    } else if (editId !== null && preview) {
      formData.append("keepImage", "true");
    }

    setUploading(true);
    setProgress(0);
    setSpeed("");

    try {
      if (editId !== null) {
        await api.news.update(editId, formData, (pct, spd) => {
          setProgress(pct);
          setSpeed(spd);
        });
      } else {
        await api.news.create(formData, (pct, spd) => {
          setProgress(pct);
          setSpeed(spd);
        });
      }
      setShowModal(false);
      resetForm();
      load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Ошибка сохранения");
    } finally {
      setUploading(false);
      setProgress(0);
      setSpeed("");
    }
  };

  const handleDelete = (post: NewsPost) => {
    setConfirm({
      title: "Удалить новость",
      message: `Удалить «${post.title}»? Это действие нельзя отменить.`,
      action: async () => {
        await api.news.delete(post.id);
        setConfirm(null);
        load();
      },
    });
  };

  if (loading) return <div style={{ color: "var(--text-secondary)" }}>Загрузка...</div>;

  return (
    <div>
      <div className="crm-header">
        <h1 className="crm-title">Новости</h1>
        <button className="crm-btn" onClick={openCreate}>+ Добавить</button>
      </div>

      <table className="crm-table">
        <thead>
          <tr>
            <th>Изображение</th>
            <th>Заголовок</th>
            <th>Статус</th>
            <th>Дата</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id}>
              <td>
                {post.image ? (
                  <img src={post.image} alt={post.title} style={{ width: 60, height: 34, objectFit: "cover" }} />
                ) : (
                  <span style={{ color: "var(--text-secondary)", fontSize: "0.75rem" }}>—</span>
                )}
              </td>
              <td>{post.title}</td>
              <td>
                <span style={{
                  color: post.published ? "var(--accent-green)" : "var(--accent-pink)",
                  fontSize: "0.8rem",
                }}>
                  {post.published ? "Опубликовано" : "Черновик"}
                </span>
              </td>
              <td style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                {new Date(post.createdAt).toLocaleDateString("ru-RU")}
              </td>
              <td>
                <div className="crm-actions">
                  <button className="crm-btn crm-btn-small crm-btn-outline" onClick={() => openEdit(post)}>Ред.</button>
                  <button className="crm-btn crm-btn-small crm-btn-danger" onClick={() => handleDelete(post)}>Удал.</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="crm-modal-overlay" onClick={() => { if (!uploading) setShowModal(false); }}>
          <div className="crm-modal" onClick={(e) => e.stopPropagation()} style={{ width: 600 }}>
            <h2 className="crm-modal-title">{editId !== null ? "Редактировать новость" : "Новая новость"}</h2>

            <div className="crm-form-group">
              <label className="crm-label">Заголовок</label>
              <input
                className="crm-input"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Заголовок новости"
                disabled={uploading}
              />
            </div>

            <div className="crm-form-group">
              <label className="crm-label">Краткое описание</label>
              <input
                className="crm-input"
                value={form.summary}
                onChange={(e) => setForm({ ...form, summary: e.target.value })}
                placeholder="Анонс для списка новостей"
                disabled={uploading}
              />
            </div>

            <div className="crm-form-group">
              <label className="crm-label">Текст новости</label>
              <textarea
                className="crm-textarea"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="Полный текст новости..."
                rows={8}
                disabled={uploading}
              />
            </div>

            <div className="crm-form-group">
              <label className="crm-label">Изображение</label>
              <div
                className="upload-area"
                onClick={() => { if (!uploading) fileRef.current?.click(); }}
                style={{ minHeight: 100 }}
              >
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} />
                {preview ? (
                  <img src={preview} alt="Превью" style={{ maxHeight: 150, maxWidth: "100%", objectFit: "contain" }} />
                ) : (
                  "Нажмите или перетащите изображение"
                )}
              </div>
            </div>

            <div className="crm-form-group">
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => setForm({ ...form, published: e.target.checked })}
                  disabled={uploading}
                />
                <span className="crm-label" style={{ margin: 0 }}>Опубликовать</span>
              </label>
            </div>

            {uploading && (
              <div style={{ marginBottom: "1rem" }}>
                <div style={{ marginBottom: "0.5rem", fontSize: "0.85rem" }}>
                  Загрузка: {progress}% {speed && `— ${speed}`}
                </div>
                <div style={{
                  width: "100%",
                  height: "20px",
                  background: "var(--bg-primary)",
                  border: "2px solid var(--accent-green)",
                }}>
                  <div style={{
                    width: `${progress}%`,
                    height: "100%",
                    background: "var(--accent-green)",
                    transition: "width 0.2s",
                  }} />
                </div>
              </div>
            )}

            <div className="crm-actions" style={{ justifyContent: "flex-end" }}>
              <button
                className="crm-btn crm-btn-outline"
                onClick={() => setShowModal(false)}
                disabled={uploading}
              >
                Отмена
              </button>
              <button
                className="crm-btn"
                onClick={handleSubmit}
                disabled={uploading}
              >
                {editId !== null ? "Сохранить" : "Создать"}
              </button>
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

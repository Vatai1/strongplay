import { useEffect, useState, useRef } from "react";
import { api } from "../api";
import ConfirmModal from "../components/ConfirmModal";

interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  title: string;
  order: number;
}

export default function Gallery() {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ title: "", alt: "" });
  const [confirm, setConfirm] = useState<{ title: string; message: string; action: () => void } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    setImages(await api.gallery.list());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleUpload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    setUploading(true);
    setProgress(0);
    setSpeed("");
    try {
      await api.gallery.upload(file, file.name, "", (percent, spd) => {
        setProgress(percent);
        setSpeed(spd);
      });
      load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Ошибка загрузки");
    } finally {
      setUploading(false);
      setProgress(0);
      setSpeed("");
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleDelete = (img: GalleryItem) => {
    setConfirm({
      title: "Удалить изображение",
      message: `Удалить изображение «${img.title || img.alt}»? Это действие нельзя отменить.`,
      action: async () => {
        await api.gallery.delete(img.id);
        setConfirm(null);
        load();
      },
    });
  };

  const startEdit = (img: GalleryItem) => {
    setEditId(img.id);
    setEditForm({ title: img.title, alt: img.alt });
  };

  const saveEdit = async () => {
    if (editId === null) return;
    await api.gallery.update(editId, editForm);
    setEditId(null);
    load();
  };

  if (loading) return <div style={{ color: "var(--text-secondary)" }}>Загрузка...</div>;

  return (
    <div>
      <div className="crm-header">
        <h1 className="crm-title">Галерея</h1>
      </div>

      <div
        className="upload-area"
        onClick={() => { if (!uploading) fileRef.current?.click(); }}
      >
        <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} disabled={uploading} />
        {uploading ? (
          <div style={{ width: "100%" }}>
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
        ) : (
          "Нажмите или перетащите файл сюда для загрузки"
        )}
      </div>

      <div className="crm-grid">
        {images.map((img) => (
          <div className="gallery-item" key={img.id}>
            <div className="gallery-thumb">
              {img.src.startsWith("/uploads/") ? (
                <img src={img.src} alt={img.alt} />
              ) : (
                <span>{img.title || "Нет фото"}</span>
              )}
            </div>
            <div className="gallery-item-info">
              {editId === img.id ? (
                <>
                  <input
                    className="crm-input"
                    style={{ width: "100%", marginRight: "0.5rem" }}
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    placeholder="Подпись"
                  />
                  <button className="crm-btn crm-btn-small" onClick={saveEdit}>OK</button>
                </>
              ) : (
                <>
                  <span className="gallery-item-title">{img.title || "Без подписи"}</span>
                  <div className="crm-actions">
                    <button className="crm-btn crm-btn-small crm-btn-outline" onClick={() => startEdit(img)}>Ред.</button>
                    <button className="crm-btn crm-btn-small crm-btn-danger" onClick={() => handleDelete(img)}>Удал.</button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
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

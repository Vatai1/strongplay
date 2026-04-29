import { useEffect } from "react";

interface ConfirmModalProps {
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({ title, message, confirmLabel = "Подтвердить", danger = false, onConfirm, onCancel }: ConfirmModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onCancel]);

  return (
    <div className="crm-modal-overlay" onClick={onCancel}>
      <div className="crm-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "400px" }}>
        <div className="crm-modal-title" style={danger ? { color: "var(--accent-pink)" } : {}}>
          {title}
        </div>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.6", marginBottom: "1.5rem" }}>
          {message}
        </p>
        <div className="crm-actions" style={{ justifyContent: "flex-end" }}>
          <button className="crm-btn crm-btn-outline" onClick={onCancel}>Отмена</button>
          <button className={`crm-btn ${danger ? "crm-btn-danger" : ""}`} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

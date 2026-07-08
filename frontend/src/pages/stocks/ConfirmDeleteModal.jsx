import { useEffect } from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";

const tokens = {
  bgCard: "#ffffff",
  border: "#e6e8f0",
  textPrimary: "#1b2036",
  textMuted: "#8b90a8",
  danger: "#e0505c",
  dangerSoft: "#fdecee",
};

export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm }) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999,
        background: "rgba(15,23,42,0.45)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
      onClick={handleOverlayClick}
    >
      <div
        style={{
          width: 480,
          maxWidth: "100%",
          background: tokens.bgCard,
          borderRadius: 16,
          border: `1px solid ${tokens.border}`,
          padding: 28,
          boxShadow: "0 24px 80px rgba(15,23,42,0.12)",
          position: "relative",
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            width: 36,
            height: 36,
            borderRadius: 10,
            border: `1px solid ${tokens.border}`,
            background: "#fff",
            color: tokens.textPrimary,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <X size={18} />
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: tokens.dangerSoft,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: tokens.danger,
            }}
          >
            <AlertTriangle size={20} />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: tokens.textPrimary, margin: 0 }}>
            Delete Stock Record
          </h2>
        </div>

        <p style={{ fontSize: 15, color: tokens.textPrimary, lineHeight: 1.5, margin: "0 0 10px 0" }}>
          Are you sure you want to delete this stock?
        </p>
        <p style={{ fontSize: 14, color: tokens.textMuted, margin: "0 0 24px 0" }}>
          This action cannot be undone and will permanently remove this stock entry.
        </p>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 20px",
              borderRadius: 10,
              border: `1px solid ${tokens.border}`,
              background: "#fff",
              color: tokens.textPrimary,
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            <X size={16} />
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 20px",
              borderRadius: 10,
              border: "none",
              background: tokens.danger,
              color: "#fff",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
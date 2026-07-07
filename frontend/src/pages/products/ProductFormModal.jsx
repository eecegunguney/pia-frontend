import React, { useState, useEffect } from "react";
import { ChevronDown, FilePlus2, Check, X } from "lucide-react";

const tokens = {
  bgCard: "#ffffff",
  border: "#e6e8f0",
  textPrimary: "#1b2036",
  textMuted: "#8b90a8",
  primary: "#3355f4",
  primarySoft: "#eaefff",
};

const PRODUCT_TYPES = [
  "SIM Card",
  "Modem",
  "Router",
  "Fiber Equipment",
  "TV Box",
  "Telephone",
  "Accessory",
  "Other",
];

function FormField({ label, required, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <label style={{ fontSize: 14, fontWeight: 700, color: tokens.textPrimary }}>
        {label}
        {required && <span style={{ color: "#e14b5a" }}> *</span>}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "13px 16px",
  borderRadius: 10,
  border: `1px solid ${tokens.border}`,
  fontSize: 15,
  color: tokens.textPrimary,
  background: "#fff",
  outline: "none",
  boxSizing: "border-box",
};

export default function ProductFormModal({ visible, editingProduct, onSave, onCancel }) {
  const empty = { code: "", name: "", price: "", type: "" };
  const [form, setForm] = useState(editingProduct || empty);

  useEffect(() => {
    if (visible) {
      setForm(editingProduct || empty);
    }
  }, [visible, editingProduct]);

  useEffect(() => {
    if (!visible) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [visible, onCancel]);

  const update = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const handleSave = () => {
    if (!form.code || !form.name || !form.price || !form.type) return;
    onSave({ ...form, price: Number(form.price) });
    setForm(empty);
  };

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onCancel();
    }
  };

  if (!visible) {
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
          width: 720,
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
          onClick={onCancel}
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

        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 26 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: tokens.primarySoft,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: tokens.primary,
            }}
          >
            <FilePlus2 size={20} />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: tokens.textPrimary, margin: 0 }}>
            {editingProduct ? "Edit Product" : "Add Product"}
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px 32px" }}>
          <FormField label="Product code" required>
            <input
              style={inputStyle}
              placeholder="e.g. SIM-1001"
              value={form.code}
              onChange={update("code")}
            />
          </FormField>

          <FormField label="Product type" required>
            <div style={{ position: "relative" }}>
              <select
                value={form.type}
                onChange={update("type")}
                style={{ ...inputStyle, appearance: "none", paddingRight: 40, cursor: "pointer" }}
              >
                <option value="" disabled>
                  Select type
                </option>
                {PRODUCT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={18}
                color={tokens.textMuted}
                style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
              />
            </div>
          </FormField>

          <FormField label="Product name" required>
            <input
              style={inputStyle}
              placeholder="Enter product name"
              value={form.name}
              onChange={update("name")}
            />
          </FormField>

          <FormField label="Price" required>
            <input
              type="number"
              style={inputStyle}
              placeholder="0.00"
              value={form.price}
              onChange={update("price")}
            />
          </FormField>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 30 }}>
          <button
            type="button"
            onClick={() => {
              setForm(empty);
              onCancel();
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "13px 22px",
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
            onClick={handleSave}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "13px 22px",
              borderRadius: 10,
              border: "none",
              background: tokens.primary,
              color: "#fff",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            <Check size={16} />
            Save product
          </button>
        </div>
      </div>
    </div>
  );
}

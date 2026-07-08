import { useState, useEffect } from "react";
import { ChevronDown, Boxes, Check, X } from "lucide-react";
import { getProducts } from "../../services/productService";

const tokens = {
  bgCard: "#ffffff",
  border: "#e6e8f0",
  textPrimary: "#1b2036",
  textMuted: "#8b90a8",
  primary: "#3355f4",
  primarySoft: "#eaefff",
};

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

const emptyForm = {
  product_code: "",
  sales_channel_id: "",
  current_stock: 0,
  minimum_stock_level: 0,
  maximum_stock_level: 0,
  last_restock_date: "",
};

const today = new Date().toISOString().split("T")[0];

export default function StockFormModal({ isOpen, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState(initialData || emptyForm);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error(error);
      }
    };
    loadProducts();
  }, []);

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

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = (e) => {
    if (e) e.preventDefault();
    if (!formData.product_code || !formData.sales_channel_id) return;
    onSubmit({
      ...formData,
      current_stock: Number(formData.current_stock) || 0,
      minimum_stock_level: Number(formData.minimum_stock_level) || 0,
      maximum_stock_level: Number(formData.maximum_stock_level) || 0,
    });
  };

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
            <Boxes size={20} />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: tokens.textPrimary, margin: 0 }}>
            {initialData ? "Edit Stock Level" : "Add Stock Level"}
          </h2>
        </div>

        <form onSubmit={handleSave}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px 32px" }}>
            <FormField label="Product" required>
              {initialData ? (
                <input
                  style={{ ...inputStyle, background: "#f1f2f6", cursor: "not-allowed" }}
                  name="product_code"
                  value={formData.product_code}
                  readOnly
                />
              ) : (
                <div style={{ position: "relative" }}>
                  <select
                    name="product_code"
                    value={formData.product_code}
                    onChange={handleChange}
                    style={{ ...inputStyle, appearance: "none", paddingRight: 40, cursor: "pointer" }}
                    required
                  >
                    <option value="" disabled>
                      Select product
                    </option>
                    {products.map((p) => (
                      <option key={p.product_code} value={p.product_code}>
                        {p.product_code}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={18}
                    color={tokens.textMuted}
                    style={{
                      position: "absolute",
                      right: 14,
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                    }}
                  />
                </div>
              )}
            </FormField>

            <FormField label="Sales Channel" required>
              <input
                style={inputStyle}
                name="sales_channel_id"
                placeholder="e.g. Retail"
                value={formData.sales_channel_id}
                onChange={handleChange}
                required
              />
            </FormField>

            <FormField label="Current Stock" required>
              <input
                type="number"
                style={inputStyle}
                name="current_stock"
                placeholder="0"
                min="0"
                value={formData.current_stock}
                onChange={handleChange}
                required
              />
            </FormField>

            <FormField label="Minimum Stock Level" required>
              <input
                type="number"
                style={inputStyle}
                name="minimum_stock_level"
                placeholder="0"
                min="0"
                value={formData.minimum_stock_level}
                onChange={handleChange}
                required
              />
            </FormField>

            <FormField label="Maximum Stock Level" required>
              <input
                type="number"
                style={inputStyle}
                name="maximum_stock_level"
                placeholder="0"
                min="0"
                value={formData.maximum_stock_level}
                onChange={handleChange}
                required
              />
            </FormField>

            <FormField label="Last Restock Date">
              <input
                type="date"
                style={inputStyle}
                name="last_restock_date"
                max={today}
                value={formData.last_restock_date ? formData.last_restock_date.split("T")[0] : ""}
                onChange={handleChange}
              />
            </FormField>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 30 }}>
            <button
              type="button"
              onClick={onClose}
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
              type="submit"
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
              {initialData ? "Update stock" : "Save stock"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  ChevronDown,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import ProductFormModal from "./ProductFormModal";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../services/productService";


/*  Design tokens                   */


const tokens = {
  bgPage: "#F8FAFC",
  bgCard: "#FFFFFF",
  border: "#E5E7EB",
  textPrimary: "#111827",
  textMuted: "#6B7280",
  primary: "#2563EB",
  primarySoft: "#EFF6FF",
  danger: "#EF4444",
  dangerSoft: "#FEE2E2",
  required: "#EF4444",
};


/*  Mock data                                                           */


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

const typeStyles = {
  "SIM Card": { bg: "#f1ecfd", color: "#7c4de0" },
  Modem: { bg: "#e7f0ff", color: "#3068e8" },
  Router: { bg: "#e6f7ee", color: "#26a05b" },
  "Fiber Equipment": { bg: "#fff1e0", color: "#d98424" },
  "TV Box": { bg: "#e2f6f7", color: "#1b96a0" },
  Telephone: { bg: "#f2ecff", color: "#7a4de0" },
  Accessory: { bg: "#fdeaf0", color: "#d94770" },
  Other: { bg: "#f1f2f6", color: "#5c6178" },
};

const formatProductType = (type) => {
  if (!type) return "Other";
  switch (type.toUpperCase()) {
    case "SIM": return "SIM Card";
    case "MODEM": return "Modem";
    case "ROUTER": return "Router";
    case "FIBER_DEVICE": return "Fiber Equipment";
    case "TV_DEVICE": return "TV Box";
    case "SMARTPHONE": return "Telephone";
    case "IOT_DEVICE": return "Accessory";
    default: return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase().replace("_", " ");
  }
};

const toBackendProductType = (type) => {
  switch (type) {
    case "SIM Card": return "SIM";
    case "Modem": return "MODEM";
    case "Router": return "ROUTER";
    case "Fiber Equipment": return "FIBER_DEVICE";
    case "TV Box": return "TV_DEVICE";
    case "Telephone": return "SMARTPHONE";
    case "Accessory": return "IOT_DEVICE";
    default: return type.toUpperCase().replace(" ", "_");
  }
};

const normalizeProduct = (p) => {
  return {
    id: p.id ?? p.productId,
    code: p.productCode ?? p.product_code ?? "",
    name: p.productName ?? p.product_name ?? "",
    type: formatProductType(p.productType ?? p.product_type ?? ""),
    price: p.basePrice ?? p.base_price ?? p.price ?? 0,
    inventoryCategory: p.inventoryCategory ?? "PHYSICAL"
  };
};

const initialProducts = [
  { id: 1, code: "SIM-1001", name: "5G SIM Card Starter Pack", type: "SIM Card", price: 150 },
  { id: 2, code: "MOD-2002", name: "ZTE Fiber Modem F660", type: "Modem", price: 1200 },
  { id: 3, code: "RTR-3003", name: "TP-Link Archer AX55 Router", type: "Router", price: 2400 },
  { id: 4, code: "FBR-4004", name: "GPON ONT Fiber Terminal", type: "Fiber Equipment", price: 1850 },
  { id: 5, code: "TVB-5005", name: "Android TV Box 4K", type: "TV Box", price: 999 },
  { id: 6, code: "TEL-6006", name: "IP Desk Telephone", type: "Telephone", price: 650 },
  { id: 7, code: "ACC-7007", name: "Ethernet Patch Cable 2m", type: "Accessory", price: 45 },
];



function Badge({ type }) {
  const style = typeStyles[type] || typeStyles.Other;
  return (
    <span
      style={{
        display: "inline-block",
        padding: "6px 14px",
        borderRadius: 8,
        fontSize: 13,
        fontWeight: 700,
        background: style.bg,
        color: style.color,
      }}
    >
      {type}
    </span>
  );
}

function IconButton({ children, tone = "primary", onClick, title }) {
  const map = {
    primary: { bg: tokens.primarySoft, color: tokens.primary },
    danger: { bg: tokens.dangerSoft, color: tokens.danger },
  };
  const c = map[tone];
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: 34,
        height: 34,
        borderRadius: 8,
        border: "none",
        background: c.bg,
        color: c.color,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

function FormField({ label, required, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <label style={{ fontSize: 14, fontWeight: 700, color: tokens.textPrimary }}>
        {label}
        {required && <span style={{ color: tokens.required }}> *</span>}
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

/* ------------------------------------------------------------------ */
/*  Toolbar: search + filter + add button                              */


function Toolbar({ search, onSearch, typeFilter, onTypeFilter, onAdd }) {
  const labelStyle = {
    display: "block",
    fontSize: 12,
    fontWeight: 700,
    color: tokens.textMuted,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  };

  return (
    <div
      style={{
        display: "flex",
        gap: 16,
        alignItems: "flex-end",
        flexWrap: "wrap",
        marginBottom: 12,
      }}
    >
      <div style={{ flex: "1 1 280px", minWidth: 240 }}>
        <label style={labelStyle}>Search</label>
        <div style={{ position: "relative" }}>
          <Search
            size={18}
            color={tokens.textMuted}
            style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)" }}
          />
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search by product name"
            style={{ ...inputStyle, paddingLeft: 44, background: tokens.bgCard }}
          />
        </div>
      </div>

      <div style={{ minWidth: 220 }}>
        <label style={labelStyle}>Product Type</label>
        <div style={{ position: "relative" }}>
          <select
            value={typeFilter}
            onChange={(e) => onTypeFilter(e.target.value)}
            style={{
              ...inputStyle,
              appearance: "none",
              paddingRight: 40,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <option value="All">All product types</option>
            {PRODUCT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <ChevronDown
            size={18}
            color={tokens.textMuted}
            style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
          />
        </div>
      </div>

      <button
        onClick={onAdd}
        style={{
          marginLeft: "auto",
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: tokens.primary,
          color: "#fff",
          border: "none",
          borderRadius: 10,
          padding: "13px 22px",
          fontSize: 15,
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        <Plus size={18} />
        Add product
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Product table + pagination                                         */
/* ------------------------------------------------------------------ */

const PAGE_SIZE = 7;

function ProductTable({ products, onEdit, onDelete }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const paged = products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  React.useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  const getVisiblePages = () => {
    const range = [];
    const maxVisible = 3;
    let start = Math.max(1, page - 1);
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
  };

  const th = {
    textAlign: "left",
    fontSize: 14,
    fontWeight: 700,
    color: tokens.textPrimary,
    padding: "10px 16px",
  };
  const td = {
    padding: "10px 16px",
    fontSize: 15,
    color: tokens.textPrimary,
  };

  return (
    <div
      style={{
        background: tokens.bgCard,
        borderRadius: 16,
        border: `1px solid ${tokens.border}`,
        overflow: "hidden",
      }}
    >
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${tokens.border}` }}>
              <th style={th} className="hide-mobile">Product Code</th>
              <th style={th}>Product Name</th>
              <th style={th} className="hide-mobile">Product Type</th>
              <th style={th}>Price</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((p, idx) => (
              <tr key={p.id ?? p.code ?? idx} style={{ borderBottom: `1px solid ${tokens.border}` }}>
                <td style={{ ...td, fontWeight: 700 }} className="hide-mobile">{p.code}</td>
                <td style={td}>{p.name}</td>
                <td style={td} className="hide-mobile">
                  <Badge type={p.type} />
                </td>
                <td style={{ ...td, fontWeight: 700 }}>₺{p.price.toLocaleString()}</td>
                <td style={td}>
                  <div style={{ display: "flex", gap: 10 }}>
                    <IconButton tone="primary" title="Edit" onClick={() => onEdit(p)}>
                      <Pencil size={16} />
                    </IconButton>
                    <IconButton tone="danger" title="Delete" onClick={() => onDelete(p.id)}>
                      <Trash2 size={16} />
                    </IconButton>
                  </div>
                </td>
              </tr>
            ))}
            {paged.length === 0 && (
              <tr>
                <td colSpan={5} style={{ ...td, textAlign: "center", color: tokens.textMuted, padding: "36px 16px" }}>
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 20px",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <span style={{ fontSize: 14, color: tokens.textMuted }}>
          Showing {products.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1} to{" "}
          {Math.min(page * PAGE_SIZE, products.length)} of {products.length} entries
        </span>
        <div style={{ display: "flex", gap: 8 }}>
          <PageButton disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
            «
          </PageButton>
          {getVisiblePages().map((n) => (
            <PageButton key={n} active={n === page} onClick={() => setPage(n)}>
              {n}
            </PageButton>
          ))}
          <PageButton disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
            »
          </PageButton>
        </div>
      </div>
    </div>
  );
}

function PageButton({ children, active, disabled, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 36,
        height: 36,
        borderRadius: 8,
        border: `1px solid ${active ? tokens.primary : tokens.border}`,
        background: active ? tokens.primary : "#fff",
        color: active ? "#fff" : disabled ? "#c7cade" : tokens.textPrimary,
        fontWeight: 700,
        fontSize: 14,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Add / Edit Product form                                             */
/* ------------------------------------------------------------------ */


/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

export default function ProductManagementPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      if (Array.isArray(data)) {
        setProducts(data.map(normalizeProduct));
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === "All" || p.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [products, search, typeFilter]);

  const handleSave = async (form) => {
    const payload = {
      productCode: form.code,
      productName: form.name,
      productType: toBackendProductType(form.type),
      inventoryCategory: form.inventoryCategory ?? "PHYSICAL",
      basePrice: Number(form.price)
    };
    try {
      if (editingProduct) {
        const id = editingProduct.id;
        await updateProduct(id, payload);
      } else {
        await createProduct(payload);
      }
      loadProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      loadProducts();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div
      style={{
        fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        width: "100%"
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        input::placeholder { color: #a6aabd; }
        input:focus, select:focus { border-color: ${tokens.primary} !important; }
      `}</style>

      {/* Page Title Header */}
      <div style={{ marginBottom: 12 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: tokens.textPrimary, letterSpacing: "-0.02em" }}>
          Products
        </h1>
        <p style={{ margin: "4px 0 0 0", fontSize: 14, color: tokens.textMuted, fontWeight: 500 }}>
          Manage your product catalog, pricing, and category types.
        </p>
      </div>

      <Toolbar
        search={search}
        onSearch={setSearch}
        typeFilter={typeFilter}
        onTypeFilter={setTypeFilter}
        onAdd={() => {
          setEditingProduct(null);
          setIsModalOpen(true);
        }}
      />

      <ProductTable
        products={filtered}
        onEdit={(p) => {
          setEditingProduct(p);
          setIsModalOpen(true);
        }}
        onDelete={handleDelete}
      />

      <ProductFormModal
        visible={isModalOpen}
        editingProduct={editingProduct}
        onSave={(form) => {
          handleSave(form);
          setIsModalOpen(false);
        }}
        onCancel={() => {
          setEditingProduct(null);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 0", gap: 12 }}>
      <div style={{
        width: 36,
        height: 36,
        border: "3px solid #e2e8f0",
        borderTop: "3px solid #64748b",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite"
      }} />
      <span style={{ fontSize: 14, color: "#64748b", fontWeight: 500 }}>Loading content...</span>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
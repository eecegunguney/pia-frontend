import { useEffect, useState, useMemo } from "react";
import {
  Search,
  ChevronDown,
  Eye,
  X,
  Store,
  Boxes,
  AlertTriangle,
  Globe,
} from "lucide-react";

import {
  getStocks,
  getSalesChannels,
} from "../../services/stockService";

/*  Design tokens                   */
const formatChannelType = (type) => {
  if (!type) return "";
  switch (type.toUpperCase()) {
    case "RETAIL_STORE":
      return "Retail Store";
    case "ONLINE":
      return "Online";
    case "MOBILE":
      return "Mobile";
    case "B2B_DEALER":
      return "B2B Dealer";
    default:
      return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  }
};

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
};

const cardStyle = {
  background: tokens.bgCard,
  border: `1px solid ${tokens.border}`,
  borderRadius: 12,
  padding: "10px 16px",
  position: "relative",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  gap: 4,
  boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
  transition: "transform 0.2s, box-shadow 0.2s"
};

const cardLabelStyle = {
  fontSize: 10.5,
  fontWeight: 700,
  color: tokens.textMuted,
  textTransform: "uppercase",
  letterSpacing: "0.05em"
};

const cardValueStyle = {
  fontSize: 20,
  fontWeight: 800,
  color: tokens.textPrimary
};

const cardIndicatorStyle = {
  position: "absolute",
  left: 0,
  top: 0,
  bottom: 0,
  width: 4
};

function StockLevelBadge({ current, min, max }) {
  let bg;
  let color;
  let text;

  if (current < min) {
    bg = tokens.dangerSoft;
    color = tokens.danger;
    text = "Low Stock";
  } else if (current > max) {
    bg = "#FEF3C7"; // soft amber
    color = "#D97706"; // amber
    text = "Overstock";
  } else {
    bg = "#D1FAE5"; // soft green
    color = "#059669"; // green
    text = "Healthy";
  }

  return (
    <span
      style={{
        display: "inline-block",
        padding: "6px 14px",
        borderRadius: 8,
        fontSize: 13,
        fontWeight: 700,
        background: bg,
        color: color,
      }}
    >
      {text}
    </span>
  );
}

const inputStyle = {
  width: "100%",
  padding: "11px 16px",
  borderRadius: 10,
  border: `1px solid ${tokens.border}`,
  fontSize: 15,
  color: tokens.textPrimary,
  background: "#fff",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s"
};

/* ------------------------------------------------------------------ */
/*  Stores detailed Stock drilldown modal (View-Only)                */
/* ------------------------------------------------------------------ */

function StoreStockModal({ store, stocks, onClose }) {
  const storeId = store.salesChannelId ?? store.sales_channel_id;
  const channelName = store.channelName ?? store.channel_name;
  const channelType = store.channelType ?? store.channel_type;

  const channelStocks = useMemo(() => {
    return stocks.filter((s) => {
      const stockChannelId = s.salesChannelId ?? s.sales_channel_id;
      return Number(stockChannelId) === Number(storeId);
    });
  }, [stocks, storeId]);

  const th = {
    textAlign: "left",
    fontSize: 13,
    fontWeight: 600,
    color: "#475569",
    padding: "14px 16px",
    background: "#F8FAFC",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    borderBottom: `1px solid ${tokens.border}`,
  };

  const td = {
    padding: "12px 16px",
    fontSize: 15,
    color: tokens.textPrimary,
    verticalAlign: "middle",
  };

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(15, 23, 42, 0.4)",
      backdropFilter: "blur(4px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 100,
      padding: 20
    }} onClick={onClose}>
      <div style={{
        background: "#fff",
        borderRadius: 16,
        width: "100%",
        maxWidth: 900,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        maxHeight: "85vh"
      }} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div style={{
          padding: "20px 24px",
          borderBottom: `1px solid ${tokens.border}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: tokens.textPrimary }}>
              Stock Details: {channelName} (ID: {storeId})
            </h3>
            <p style={{ margin: "4px 0 0 0", fontSize: 13, color: tokens.textMuted }}>
              Type: {formatChannelType(channelType)} • Location: {store.district}, {store.city}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: tokens.textMuted,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 4,
              borderRadius: 6
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content / Table */}
        <div style={{ overflowY: "auto", flex: 1, padding: "24px" }}>
          <table className="responsive-modal-table" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={th}>Product</th>
                <th style={th}>Current Stock</th>
                <th style={th}>Min Stock</th>
                <th style={th}>Max Stock</th>
                <th style={th}>Status</th>
                <th style={th}>Last Restock</th>
              </tr>
            </thead>
            <tbody>
              {channelStocks.map((s, idx) => {
                const stockId = s.stockId ?? s.stock_id;
                const productCode = s.productCode ?? s.product_code;
                const currentStock = s.currentStock ?? s.current_stock;
                const minStock = s.minimumStockLevel ?? s.minimum_stock_level;
                const maxStock = s.maximumStockLevel ?? s.maximum_stock_level;
                const lastRestockDate = s.lastRestockDate ?? s.last_restock_date;

                return (
                  <tr
                    key={stockId || idx}
                    className="stock-row"
                    style={{
                      borderBottom: `1px solid ${tokens.border}`,
                      background: idx % 2 === 0 ? "#ffffff" : "#fcfcfd"
                    }}
                  >
                    <td style={{ ...td, fontWeight: 700 }} data-label="Product">{productCode}</td>
                    <td style={{ ...td, fontWeight: 700 }} data-label="Current Stock">
                      {currentStock} <span style={{ fontSize: 13, color: tokens.textMuted, fontWeight: 500 }}>pcs</span>
                    </td>
                    <td style={td} data-label="Min Stock">{minStock}</td>
                    <td style={td} data-label="Max Stock">{maxStock}</td>
                    <td style={td} data-label="Status">
                      <StockLevelBadge
                        current={currentStock}
                        min={minStock}
                        max={maxStock}
                      />
                    </td>
                    <td style={td} data-label="Last Restock">{lastRestockDate ? new Date(lastRestockDate).toLocaleDateString() : "-"}</td>
                  </tr>
                );
              })}
              {channelStocks.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ ...td, textAlign: "center", color: tokens.textMuted, padding: "36px 16px" }}>
                    No stock records found for this store.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Stores Table                                                      */
/* ------------------------------------------------------------------ */

const PAGE_SIZE = 7;

function StoresTable({ stores, stocks, onViewStock }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(stores.length / PAGE_SIZE));
  const currentPage = page > totalPages ? 1 : page;
  const paged = stores.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const getVisiblePages = () => {
    const range = [];
    const maxVisible = 3;
    let start = Math.max(1, currentPage - 1);
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
    background: "#ffffff",
    borderBottom: `1px solid ${tokens.border}`,
  };

  const td = {
    padding: "10px 16px",
    fontSize: 15,
    color: tokens.textPrimary,
    verticalAlign: "middle",
  };

  return (
    <div
      style={{
        background: tokens.bgCard,
        borderRadius: 16,
        border: `1px solid ${tokens.border}`,
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
      }}
    >
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={th} className="hide-mobile">Store ID</th>
              <th style={th}>Store Name</th>
              <th style={th}>Channel Type</th>
              <th style={th}>City</th>
              <th style={th} className="hide-mobile hide-tablet">District</th>
              <th style={th}>Inventory</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((store, idx) => {
              const salesChannelId = store.salesChannelId ?? store.sales_channel_id;
              const channelName = store.channelName ?? store.channel_name;
              const channelType = store.channelType ?? store.channel_type;

              const isOnlineOrMobile = 
                channelType === "Online" || 
                channelType === "ONLINE" || 
                channelType === "Mobile" || 
                channelType === "MOBILE";

              const storeHasWarning = stocks.some(
                (s) => {
                  const stockChannelId = s.salesChannelId ?? s.sales_channel_id;
                  const currentStock = s.currentStock ?? s.current_stock;
                  const minStock = s.minimumStockLevel ?? s.minimum_stock_level;
                  return Number(stockChannelId) === Number(salesChannelId) &&
                    (currentStock || 0) <= (minStock || 0) * 1.10;
                }
              );

              return (
                <tr
                  key={salesChannelId || idx}
                  className="stock-row"
                  style={{
                    borderBottom: `1px solid ${tokens.border}`,
                    background: idx % 2 === 0 ? "#ffffff" : "#fcfcfd"
                  }}
                >
                  <td style={td} className="hide-mobile">{salesChannelId}</td>
                  <td style={td}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {channelName}
                      {storeHasWarning && (
                        <span
                          title="Contains items with low stock!"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 18,
                            height: 18,
                            borderRadius: "50%",
                            backgroundColor: "#EF4444",
                            color: "#FFFFFF",
                            fontSize: 11,
                            fontWeight: 800,
                            boxShadow: "0 0 6px rgba(239, 68, 68, 0.4)"
                          }}
                        >
                          !
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={td}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "4px 10px",
                        borderRadius: 6,
                        fontSize: 13,
                        fontWeight: 600,
                        background: isOnlineOrMobile ? "#E0F2FE" : "#F1F5F9",
                        color: isOnlineOrMobile ? "#0369A1" : "#475569",
                      }}
                    >
                      {formatChannelType(channelType)}
                    </span>
                  </td>
                  <td style={td}>{store.city}</td>
                  <td style={td} className="hide-mobile hide-tablet">{store.district}</td>
                  <td style={td}>
                    <button
                      onClick={() => onViewStock(store)}
                      title="View Stocks"
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 8,
                        border: "none",
                        background: "#ecfdf5",
                        color: "#059669",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "background 0.2s, opacity 0.2s"
                      }}
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
            {paged.length === 0 && (
              <tr>
                <td colSpan={6} style={{ ...td, textAlign: "center", color: tokens.textMuted, padding: "36px 16px" }}>
                  No stores found.
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
          gap: 12,
          borderTop: `1px solid ${tokens.border}`,
          background: "#ffffff"
        }}
      >
        <span style={{ fontSize: 14, color: tokens.textMuted }}>
          Showing {stores.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1} to{" "}
          {Math.min(currentPage * PAGE_SIZE, stores.length)} of {stores.length} entries
        </span>
        <div style={{ display: "flex", gap: 8 }}>
          <PageButton disabled={currentPage === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
            «
          </PageButton>
           {getVisiblePages().map((n) => (
            <PageButton key={n} active={n === currentPage} onClick={() => setPage(n)}>
              {n}
            </PageButton>
          ))}
          <PageButton disabled={currentPage === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
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
        transition: "all 0.2s"
      }}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

export default function StockListPage() {
  const [salesChannels, setSalesChannels] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [viewingStore, setViewingStore] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [channelsData, stocksData] = await Promise.all([
        getSalesChannels(),
        getStocks()
      ]);
      setSalesChannels(channelsData);
      setStocks(stocksData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const filteredChannels = useMemo(() => {
    return salesChannels.filter((c) => {
      const channelName = c.channelName ?? c.channel_name;
      const channelType = c.channelType ?? c.channel_type;

      const query = search.toLowerCase();
      const matchesSearch =
        channelName?.toLowerCase().includes(query) ||
        channelType?.toLowerCase().includes(query) ||
        c.city?.toLowerCase().includes(query) ||
        c.district?.toLowerCase().includes(query);
      const matchesType =
        typeFilter === "All" || 
        channelType === typeFilter || 
        (typeFilter === "Online" && channelType === "ONLINE") ||
        (typeFilter === "Mobile" && channelType === "MOBILE") ||
        (typeFilter === "Physical" && channelType === "RETAIL_STORE") ||
        (typeFilter === "Partner" && channelType === "B2B_DEALER");
      return matchesSearch && matchesType;
    });
  }, [salesChannels, search, typeFilter]);

  // Extract unique channel types for filters
  const uniqueTypes = useMemo(() => {
    const set = new Set(salesChannels.map((c) => c.channelType ?? c.channel_type).filter(Boolean));
    return Array.from(set);
  }, [salesChannels]);

  // Dashboard Stats for Stores
  const stats = useMemo(() => {
    const totalStores = salesChannels.length;
    const totalStock = stocks.reduce((sum, s) => sum + (s.currentStock ?? s.current_stock ?? 0), 0);
    const criticalStockStores = new Set(
      stocks
        .filter((s) => {
          const currentStock = s.currentStock ?? s.current_stock;
          const minStock = s.minimumStockLevel ?? s.minimum_stock_level;
          return (currentStock || 0) < (minStock || 0);
        })
        .map((s) => s.salesChannelId ?? s.sales_channel_id)
    ).size;
    const onlineChannels = salesChannels.filter((c) => {
      const channelType = c.channelType ?? c.channel_type;
      return channelType === "Online" || channelType === "ONLINE" || channelType === "Mobile" || channelType === "MOBILE";
    }).length;

    return { totalStores, totalStock, criticalStockStores, onlineChannels };
  }, [salesChannels, stocks]);

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
        input::placeholder { color: #94a3b8; }
        input:focus, select:focus { border-color: ${tokens.primary} !important; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15); }
        .stock-row {
          transition: background-color 0.2s;
        }
        .stock-row:hover {
          background-color: #F8FAFC !important;
        }
        .action-btn:hover {
          background-color: #F1F5F9 !important;
        }
        .stats-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 20px -8px rgba(0,0,0,0.08) !important;
        }
        @media (max-width: 640px) {
          .responsive-modal-table thead {
            display: none !important;
          }
          .responsive-modal-table tr {
            display: block !important;
            background: #ffffff !important;
            border: 1px solid #e2e8f0 !important;
            border-radius: 12px !important;
            margin-bottom: 12px !important;
            padding: 12px 16px !important;
            box-shadow: 0 1px 3px rgba(0,0,0,0.02) !important;
          }
          .responsive-modal-table td {
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            padding: 8px 0 !important;
            border: none !important;
            border-bottom: 1px dashed #f1f5f9 !important;
            text-align: right !important;
            font-size: 14px !important;
          }
          .responsive-modal-table td:last-child {
            border-bottom: none !important;
          }
          .responsive-modal-table td::before {
            content: attr(data-label) !important;
            font-weight: 700 !important;
            color: #64748b !important;
            font-size: 12px !important;
            text-transform: uppercase !important;
            margin-right: 16px !important;
            text-align: left !important;
          }
        }
      `}</style>

      {/* Page Title Header */}
      <div style={{ marginBottom: 12 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: tokens.textPrimary, letterSpacing: "-0.02em" }}>
          Stores
        </h1>
        <p style={{ margin: "4px 0 0 0", fontSize: 14, color: tokens.textMuted, fontWeight: 500 }}>
          Manage your sales channels and monitor their inventory health.
        </p>
      </div>

      {/* Stats Dashboard Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 16,
        marginBottom: 12
      }}>
        <div className="stats-card" style={cardStyle}>
          <div style={cardLabelStyle}>Total Stores</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={cardValueStyle}>{stats.totalStores}</div>
            <Store size={20} style={{ color: tokens.primary, opacity: 0.15 }} />
          </div>
          <div style={{ ...cardIndicatorStyle, background: tokens.primary }}></div>
        </div>
        <div className="stats-card" style={cardStyle}>
          <div style={cardLabelStyle}>Total Stock</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={cardValueStyle}>
              {stats.totalStock.toLocaleString()}{" "}
              <span style={{ fontSize: 12, fontWeight: 500, color: tokens.textMuted }}>pcs</span>
            </div>
            <Boxes size={20} style={{ color: "#10B981", opacity: 0.15 }} />
          </div>
          <div style={{ ...cardIndicatorStyle, background: "#10B981" }}></div>
        </div>
        <div className="stats-card" style={cardStyle}>
          <div style={cardLabelStyle}>Low Stock Stores</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={cardValueStyle}>{stats.criticalStockStores}</div>
            <AlertTriangle size={20} style={{ color: tokens.danger, opacity: 0.15 }} />
          </div>
          <div style={{ ...cardIndicatorStyle, background: tokens.danger }}></div>
        </div>
        <div className="stats-card" style={cardStyle}>
          <div style={cardLabelStyle}>Online Channels</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={cardValueStyle}>{stats.onlineChannels}</div>
            <Globe size={20} style={{ color: "#F59E0B", opacity: 0.15 }} />
          </div>
          <div style={{ ...cardIndicatorStyle, background: "#F59E0B" }}></div>
        </div>
      </div>

      {/* Toolbar */}
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
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: tokens.textMuted, marginBottom: 6, textTransform: "uppercase" }}>
            Search
          </label>
          <div style={{ position: "relative" }}>
            <Search
              size={18}
              color={tokens.textMuted}
              style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)" }}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search stores..."
              style={{ ...inputStyle, paddingLeft: 44, background: tokens.bgCard }}
            />
          </div>
        </div>

        <div style={{ minWidth: 200 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: tokens.textMuted, marginBottom: 6, textTransform: "uppercase" }}>
            Channel Type
          </label>
          <div style={{ position: "relative" }}>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              style={{
                ...inputStyle,
                appearance: "none",
                paddingRight: 40,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <option value="All">All types</option>
              {uniqueTypes.map((t) => (
                <option key={t} value={t}>
                  {formatChannelType(t)}
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
      </div>

      <StoresTable
        key={`${search}-${typeFilter}`}
        stores={filteredChannels}
        stocks={stocks}
        onViewStock={(store) => setViewingStore(store)}
      />

      {/* Store Stock Drilldown Modal */}
      {viewingStore && (
        <StoreStockModal
          store={viewingStore}
          stocks={stocks}
          onClose={() => setViewingStore(null)}
        />
      )}
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
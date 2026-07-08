import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import InboxIcon from '@mui/icons-material/Inbox';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CancelIcon from '@mui/icons-material/Cancel';

/* ------------------------------------------------------------------ */
/*  Design tokens (derived from the reference dashboard)               */
/* ------------------------------------------------------------------ */

const tokens = {
  bgPage: "#eef0f7",
  bgCard: "#ffffff",
  bgCardSoft: "#f8faff",
  border: "#e6e8f0",
  textPrimary: "#1b2036",
  textSecondary: "#8b90a8",
  primary: "#3355f4",
  primarySoft: "#eaefff",
  danger: "#e0505c",
  dangerSoft: "#fdecee",
  accentRed: "#e0505c",
  accentAmber: "#d98424",
  accentGreen: "#26a05b",
  track: "rgba(27,32,54,0.08)",
};

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const stockCheck = { days: 34 };

const stockOverview = [
  { name: "SIM Cards (5G)", qty: 12480, value: 187200 },
  { name: "Fiber Optic Cable (m)", qty: 48250, value: 361875 },
  { name: "4G/5G Home Routers", qty: 2140, value: 749000 },
  { name: "ONT Modems", qty: 3860, value: 618720 },
  { name: "Base Station Antennas", qty: 312, value: 936000 },
  { name: "Set-Top Boxes", qty: 5640, value: 451200 },
  { name: "Ethernet Switches", qty: 980, value: 294000 },
  { name: "Signal Repeaters", qty: 640, value: 224000 },
  { name: "Patch Cables (RJ45)", qty: 15200, value: 45600 },
];

const warehouses = [
  { city: "Istanbul", pct: 78 },
  { city: "Ankara", pct: 54 },
  { city: "Izmir", pct: 91 },
  { city: "Antalya", pct: 68 },
];

const salesSummaryMetrics = [
  { icon: InboxIcon, label: "Orders Received", value: "4,236", trend: "26%", trendDir: "up" },
  { icon: LocalShippingIcon, label: "Orders Shipped", value: "2,778", trend: "20%", trendDir: "down" },
  { icon: AutorenewIcon, label: "Orders Returned", value: "147", trend: "8%", trendDir: "down" },
  { icon: CancelIcon, label: "Orders Canceled", value: "537", trend: "6%", trendDir: "up" },
];

const revenue = 2840000;

const trend = [
  { month: "Jan", revenue: 2.2, expense: 1.6 },
  { month: "Feb", revenue: 2.35, expense: 1.68 },
  { month: "Mar", revenue: 2.5, expense: 1.75 },
  { month: "Apr", revenue: 2.6, expense: 1.82 },
  { month: "May", revenue: 2.84, expense: 1.948 },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

function formatMoney(n) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(2)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n}`;
}

function occupancyColor(pct) {
  if (pct >= 90) return tokens.accentRed;
  if (pct >= 70) return tokens.accentAmber;
  return tokens.accentGreen;
}

/* ------------------------------------------------------------------ */
/*  Reusable card shell                                                */
/* ------------------------------------------------------------------ */

function Card({ children, style }) {
  return (
    <div
      style={{
        background: tokens.bgCard,
        border: `1px solid ${tokens.border}`,
        borderRadius: 16,
        boxShadow: "0 1px 2px rgba(16,24,40,0.04)",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function CardTitle({ children }) {
  return (
    <h2
      style={{
        fontSize: 18,
        fontWeight: 800,
        color: tokens.textPrimary,
        margin: "0 0 16px 0",
        letterSpacing: "-0.01em",
      }}
    >
      {children}
    </h2>
  );
}

/* ------------------------------------------------------------------ */
/*  Stock Check card                                                    */
/* ------------------------------------------------------------------ */

function StockCheckCard({ style = {} }) {
  return (
    <Card
      style={{
        background: tokens.dangerSoft,
        border: `1px solid ${tokens.danger}`,
        position: "relative",
        justifyContent: "flex-start",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -14,
          right: -14,
          width: 30,
          height: 30,
          borderRadius: "50%",
          background: tokens.danger,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 12px rgba(224,80,92,0.25)",
        }}
      >
        <span style={{ color: "white", fontWeight: 800, fontSize: 16 }}>
          !
        </span>
      </div>
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: tokens.textSecondary,
          marginBottom: 10,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}
      >
        Stock check
      </div>
      <div
        style={{
          fontSize: 48,
          fontWeight: 800,
          color: tokens.textPrimary,
          lineHeight: 1,
        }}
      >
        {stockCheck.days}
      </div>
      <div
        style={{
          fontSize: 13,
          color: tokens.textSecondary,
          marginTop: 8,
          fontWeight: 500,
        }}
      >
        days since last check
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Gauge (semi-circle speedometer)                                     */
/* ------------------------------------------------------------------ */

function Gauge({ label, pct }) {
  const color = occupancyColor(pct);
  const size = 132;
  const cx = size / 2;
  const cy = size / 2;
  const r = 54;
  const startAngle = 180;
  const endAngle = 0;
  const angleForPct = (p) => startAngle + (endAngle - startAngle) * (p / 100);

  const toXY = (angleDeg) => {
    const rad = (angleDeg * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy - r * Math.sin(rad),
    };
  };

  const describeArc = (fromPct, toPct) => {
    const a1 = angleForPct(fromPct);
    const a2 = angleForPct(toPct);
    const p1 = toXY(a1);
    const p2 = toXY(a2);
    const largeArc = a1 - a2 > 180 ? 1 : 0;
    return `M ${p1.x} ${p1.y} A ${r} ${r} 0 ${largeArc} 1 ${p2.x} ${p2.y}`;
  };

  const needleAngle = angleForPct(pct);
  const needleLen = r - 12;
  const needleRad = (needleAngle * Math.PI) / 180;
  const needleX = cx + needleLen * Math.cos(needleRad);
  const needleY = cy - needleLen * Math.sin(needleRad);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flex: 1,
        minWidth: 120,
      }}
    >
      <svg width={size} height={size * 0.72} viewBox={`0 0 ${size} ${cy + 22}`}>
        <path
          d={describeArc(0, 100)}
          fill="none"
          stroke={tokens.track}
          strokeWidth={10}
          strokeLinecap="round"
        />
        <path
          d={describeArc(0, pct)}
          fill="none"
          stroke={color}
          strokeWidth={10}
          strokeLinecap="round"
        />
        <line
          x1={cx}
          y1={cy}
          x2={needleX}
          y2={needleY}
          stroke={tokens.textPrimary}
          strokeWidth={3}
          strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r={4} fill={tokens.textPrimary} />
        <text
          x={10}
          y={cy + 16}
          fill={tokens.textSecondary}
          fontSize="10"
          fontWeight="600"
        >
          0%
        </text>
        <text
          x={size - 32}
          y={cy + 16}
          fill={tokens.textSecondary}
          fontSize="10"
          fontWeight="600"
        >
          100%
        </text>
      </svg>
      <div
        style={{
          fontSize: 24,
          fontWeight: 800,
          color: tokens.textPrimary,
          marginTop: -6,
        }}
      >
        {pct}
        <span style={{ fontSize: 14, fontWeight: 700 }}>%</span>
      </div>
      <div
        style={{
          fontSize: 13,
          color: tokens.textSecondary,
          fontWeight: 600,
          marginTop: 2,
        }}
      >
        {label}
      </div>
    </div>
  );
}

function MetricTile({ icon: Icon, label, value, trend, trendDir }) {
  return (
    <div
      className="metric-tile"
      style={{
        background: tokens.bgCardSoft,
        borderRadius: 18,
        padding: "14px 16px",
        display: "grid",
        gridTemplateColumns: "auto 1fr",
        gap: 12,
        alignItems: "center",
        height: "100%",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: tokens.bgCard,
          fontSize: 18,
        }}
      >
        <Icon style={{ fontSize: 22, color: tokens.textPrimary }} />
      </div>
      <div>
        <div className="metric-label" style={{ fontSize: 14, color: tokens.textSecondary, fontWeight: 600 }}>
          {label}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
          <div className="metric-value" style={{ fontSize: 22, fontWeight: 800, color: tokens.textPrimary }}>
            {value}
          </div>
          <div
            className="metric-trend"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              fontSize: 12,
              fontWeight: 700,
              color: trendDir === "up" ? tokens.accentGreen : tokens.accentRed,
            }}
          >
            <span>{trendDir === "up" ? "▲" : "▼"}</span>
            <span>{trend}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SalesSummaryCard({ style = {} }) {
  return (
    <Card style={{ flex: 1, minHeight: 0, ...style }}>
      <CardTitle>Sales summary</CardTitle>
      <div className="sales-summary-grid" style={{ flex: 1, minHeight: 0 }}>
        {salesSummaryMetrics.map((metric) => (
          <MetricTile key={metric.label} {...metric} />
        ))}
      </div>
    </Card>
  );
}

function WarehouseOccupancyCard({ style = {} }) {
  return (
    <Card style={{ flex: 1, minHeight: 0, ...style }}>
      <CardTitle>Sales</CardTitle>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          marginTop: 4,
        }}
      >
        {warehouses.map((w) => (
          <Gauge key={w.city} label={w.city} pct={w.pct} />
        ))}
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Company Stock Overview table                                       */
/* ------------------------------------------------------------------ */

function StockOverviewTable() {
  return (
    <Card style={{ flex: 13000 }}>
      <CardTitle>Company stock overview</CardTitle>
      <div style={{ overflowX: "auto", maxHeight: 500, overflowY: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          <thead>
            <tr style={{ borderBottom: `1px solid ${tokens.border}` }}>
              <th style={thStyle("left")}>Stock / Product name</th>
              <th style={thStyle("right")}>Quantity</th>
              <th style={thStyle("right")}>Total stock value</th>
            </tr>
          </thead>
          <tbody>
            {stockOverview.map((row) => (
              <tr key={row.name} style={{ borderBottom: `1px solid ${tokens.border}` }}>
                <td style={tdStyle("left")}>{row.name}</td>
                <td style={tdStyle("right")}>{row.qty.toLocaleString()}</td>
                <td style={tdStyle("right")}>{formatMoney(row.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function thStyle(align) {
  return {
    textAlign: align,
    color: tokens.textPrimary,
    fontSize: 13,
    fontWeight: 700,
    padding: "14px 12px",
  };
}

function tdStyle(align) {
  return {
    textAlign: align,
    color: tokens.textPrimary,
    fontSize: 14,
    fontWeight: 500,
    padding: "14px 12px",
  };
}

/* ------------------------------------------------------------------ */
/*  Revenue & Expense card                                             */
/* ------------------------------------------------------------------ */

function RevenueExpenseCard({ style = {} }) {
  return (
    <Card style={{ flex: 1, ...style }}>
      <CardTitle>Income</CardTitle>
      <div
        style={{
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
          alignItems: "flex-start",
        }}
      >
        <div>
          <div style={{ fontSize: 30, fontWeight: 800, color: tokens.textPrimary, lineHeight: 1 }}>
            {formatMoney(revenue)}
          </div>
          <div style={{ fontSize: 13, color: tokens.textSecondary, marginTop: 6, fontWeight: 500 }}>
            Total income
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 200, paddingTop: 2 }}>
          <div
            style={{
              fontSize: 13,
              color: tokens.textSecondary,
              fontWeight: 600,
              marginBottom: 6,
            }}
          >
            Income by month
          </div>
          <div style={{ width: "100%", height: 90 }}>
            <ResponsiveContainer>
              <AreaChart data={trend} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={tokens.primary} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={tokens.primary} stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={tokens.track} strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="month"
                  stroke={tokens.textSecondary}
                  tick={{ fill: tokens.textSecondary, fontSize: 10 }}
                  axisLine={{ stroke: tokens.border }}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: tokens.bgCardSoft,
                    border: `1px solid ${tokens.border}`,
                    borderRadius: 10,
                    color: tokens.textPrimary,
                  }}
                  formatter={(v) => `$${v}M`}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke={tokens.primary}
                  fill="url(#incomeGradient)"
                  strokeWidth={2}
                  name="Income"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Dashboard layout                                                    */
/* ------------------------------------------------------------------ */

export default function TelecomDashboard() {
  return (
    <div
      style={{
        background: tokens.bgPage,
        minHeight: "100vh",
        padding: 18,
        fontFamily:
          "'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        table { font-family: inherit; }
        .top-card-row {
          display: grid;
          grid-template-columns: minmax(180px, 240px) 1fr;
          gap: 10px;
          align-items: stretch;
        }
        .right-column {
          display: flex;
          flex-direction: column;
          gap: 10px;
          align-items: stretch;
          min-height: 0;
        }
        .sales-summary-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          grid-auto-rows: minmax(0, 1fr);
          align-items: stretch;
          gap: 10px;
          margin-top: 4px;
          min-height: 0;
        }
        .metric-tile {
          min-height: 0;
          height: 100%;
        }
        .metric-label {
          font-size: 14px;
        }
        .metric-value {
          font-size: 22px;
        }
        .metric-trend {
          font-size: 12px;
        }
        @media (max-width: 720px) {
          .top-card-row {
            grid-template-columns: 1fr;
          }
          .sales-summary-grid {
            grid-template-columns: 1fr;
          }
          .metric-tile {
            padding: 12px 14px;
          }
          .metric-label {
            font-size: 13px;
          }
          .metric-value {
            font-size: 20px;
          }
          .metric-trend {
            font-size: 11px;
          }
        }
      `}</style>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 0.8fr",
          gap: 14,
          alignItems: "stretch",
        }}
      >
        <div style={{ display: "grid", gap: 10 }}>
          <div className="top-card-row">
            <StockCheckCard style={{ height: "100%" }} />
            <RevenueExpenseCard style={{ height: "100%" }} />
          </div>
          <StockOverviewTable />
        </div>

        <div className="right-column">
          <WarehouseOccupancyCard style={{ flex: 1, minHeight: 0 }} />
          <SalesSummaryCard style={{ flex: 1, minHeight: 0 }} />
        </div>
      </div>
    </div>
  );
}
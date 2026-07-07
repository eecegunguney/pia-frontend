import {
  LineChart,
  Line,
  XAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

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
  { city: "Denizli", pct: 62 },
];

const revenue = 2840000;
const expense = 1948000;
const expensePctOfRevenue = Math.round((expense / revenue) * 100);

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
        padding: "28px",
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
        fontSize: 20,
        fontWeight: 800,
        color: tokens.textPrimary,
        margin: "0 0 20px 0",
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

function StockCheckCard() {
  return (
    <Card
      style={{
        background: tokens.dangerSoft,
        border: `1px solid ${tokens.danger}`,
        position: "relative",
        minHeight: 190,
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -16,
          right: -16,
          width: 34,
          height: 34,
          borderRadius: "50%",
          background: tokens.danger,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 12px rgba(224,80,92,0.25)",
        }}
      >
        <span style={{ color: "white", fontWeight: 800, fontSize: 18 }}>
          !
        </span>
      </div>
      <div
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: tokens.textSecondary,
          marginBottom: 14,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}
      >
        Stock check
      </div>
      <div
        style={{
          fontSize: 68,
          fontWeight: 800,
          color: tokens.textPrimary,
          lineHeight: 1,
        }}
      >
        {stockCheck.days}
      </div>
      <div
        style={{
          fontSize: 16,
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
  const size = 168;
  const cx = size / 2;
  const cy = size / 2;
  const r = 66;
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
  const needleLen = r - 14;
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
        minWidth: 140,
      }}
    >
      <svg width={size} height={size * 0.62} viewBox={`0 0 ${size} ${cy + 10}`}>
        <path
          d={describeArc(0, 100)}
          fill="none"
          stroke={tokens.track}
          strokeWidth={12}
          strokeLinecap="round"
        />
        <path
          d={describeArc(0, pct)}
          fill="none"
          stroke={color}
          strokeWidth={12}
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
        <circle cx={cx} cy={cy} r={5} fill={tokens.textPrimary} />
        <text
          x={12}
          y={cy + 2}
          fill={tokens.textSecondary}
          fontSize="11"
          fontWeight="600"
        >
          0%
        </text>
        <text
          x={size - 30}
          y={cy + 2}
          fill={tokens.textSecondary}
          fontSize="11"
          fontWeight="600"
        >
          100%
        </text>
      </svg>
      <div
        style={{
          fontSize: 26,
          fontWeight: 800,
          color: tokens.textPrimary,
          marginTop: -6,
        }}
      >
        {pct}
        <span style={{ fontSize: 15, fontWeight: 700 }}>%</span>
      </div>
      <div
        style={{
          fontSize: 14,
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

function WarehouseOccupancyCard() {
  return (
    <Card style={{ flex: 1 }}>
      <CardTitle>Warehouse occupancy</CardTitle>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 8,
          flexWrap: "wrap",
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
    <Card style={{ flex: 1 }}>
      <CardTitle>Company stock overview</CardTitle>
      <div style={{ overflowX: "auto" }}>
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
    fontSize: 14,
    fontWeight: 700,
    padding: "18px 16px",
  };
}

function tdStyle(align) {
  return {
    textAlign: align,
    color: tokens.textPrimary,
    fontSize: 15,
    fontWeight: 500,
    padding: "18px 16px",
  };
}

/* ------------------------------------------------------------------ */
/*  Revenue & Expense card                                             */
/* ------------------------------------------------------------------ */

function RevenueExpenseCard() {
  return (
    <Card style={{ flex: 1 }}>
      <CardTitle>Revenue &amp; expense</CardTitle>
      <div
        style={{
          display: "flex",
          gap: 40,
          flexWrap: "wrap",
          alignItems: "flex-start",
        }}
      >
        <div>
          <div style={{ fontSize: 44, fontWeight: 800, color: tokens.textPrimary, lineHeight: 1 }}>
            {formatMoney(revenue)}
          </div>
          <div style={{ fontSize: 15, color: tokens.textSecondary, marginTop: 6, fontWeight: 500 }}>
            Total revenue
          </div>
        </div>
        <div>
          <div style={{ fontSize: 44, fontWeight: 800, color: tokens.textPrimary, lineHeight: 1 }}>
            {formatMoney(expense)}
          </div>
          <div style={{ fontSize: 15, color: tokens.textSecondary, marginTop: 6, fontWeight: 500 }}>
            Total expense
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 240, paddingTop: 4 }}>
          <div
            style={{
              fontSize: 14,
              color: tokens.textSecondary,
              fontWeight: 600,
              marginBottom: 10,
            }}
          >
            Expense as % of revenue
          </div>
          <div
            style={{
              width: "100%",
              height: 14,
              borderRadius: 7,
              background: tokens.track,
              overflow: "hidden",
              display: "flex",
            }}
          >
            <div
              style={{
                width: `${expensePctOfRevenue}%`,
                background: `linear-gradient(90deg, ${tokens.accentBlue}, ${tokens.accentAmber})`,
                borderRadius: 7,
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 6,
              fontSize: 13,
              color: tokens.textSecondary,
              fontWeight: 600,
            }}
          >
            <span>{expensePctOfRevenue}% spent</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 28 }}>
        <div
          style={{
            fontSize: 15,
            color: tokens.textSecondary,
            fontWeight: 600,
            marginBottom: 8,
          }}
        >
          Revenue vs. expense by month
        </div>
        <div style={{ width: "100%", height: 140 }}>
          <ResponsiveContainer>
            <LineChart data={trend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <XAxis
                dataKey="month"
                stroke={tokens.textSecondary}
                tick={{ fill: tokens.textSecondary, fontSize: 12 }}
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
              <Line
                type="monotone"
                dataKey="revenue"
                stroke={tokens.primary}
                strokeWidth={3}
                dot={false}
                name="Revenue"
              />
              <Line
                type="monotone"
                dataKey="expense"
                stroke={tokens.accentAmber}
                strokeWidth={3}
                dot={false}
                name="Expense"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display: "flex", gap: 18, marginTop: 4 }}>
          <Legend color={tokens.accentBlue} label="Revenue" />
          <Legend color={tokens.accentAmber} label="Expense" />
        </div>
      </div>
    </Card>
  );
}

function Legend({ color, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ width: 10, height: 10, borderRadius: "50%", background: color }} />
      <span style={{ fontSize: 13, color: tokens.textSecondary, fontWeight: 600 }}>{label}</span>
    </div>
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
        padding: 28,
        fontFamily:
          "'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        table { font-family: inherit; }
      `}</style>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "300px 1fr",
          gap: 24,
          alignItems: "stretch",
        }}
      >
        {/* Left column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <StockCheckCard />
          <WarehouseOccupancyCard />
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <StockOverviewTable />
          <RevenueExpenseCard />
        </div>
      </div>
    </div>
  );
}
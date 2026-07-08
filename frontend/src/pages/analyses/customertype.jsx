import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

/* ------------------------------------------------------------------ */
/* DESIGN TOKENS (Premium SaaS Look with Gradients)                   */
/* ------------------------------------------------------------------ */
const tokens = {
  bgPage: "transparent", 
  bgCard: "#FFFFFF",
  border: "#E2E8F0",
  textPrimary: "#0F172A",
  textSecondary: "#64748B",
  
  // Gradient Colors
  corporateBase: "#4F46E5",  // Dark Indigo (Bottom)
  corporateLight: "#818CF8", // Light Indigo (Top)
  
  individualBase: "#E11D48",  // Dark Rose (Bottom)
  individualLight: "#FB7185", // Light Rose (Top)
  
  track: "#F8FAFC",
};

/* ------------------------------------------------------------------ */
/* MOCK DATA                                                          */
/* ------------------------------------------------------------------ */
const stockTrendData = [
  { year: "2022", corporate: 2400, individual: 3100 },
  { year: "2023", corporate: 3600, individual: 3900 },
  { year: "2024", corporate: 5200, individual: 4400 },
  { year: "2025", corporate: 6800, individual: 5100 },
  { year: "2026", corporate: 8900, individual: 5800 },
];

const corpProducts = [
  { name: "Core Switch (24 Port)", stock: "140", rev: "$420K" },
  { name: "Fiber Optic Cable (Km)", stock: "12,500", rev: "$375K" },
  { name: "Enterprise Gateway", stock: "820", rev: "$246K" },
  { name: "SFP Transceiver", stock: "3,400", rev: "$102K" },
  { name: "Industrial Router", stock: "95", rev: "$190K" },
];

const indProducts = [
  { name: "5G Home Router", stock: "4,200", rev: "$210K" },
  { name: "Premium SIM Card", stock: "35,000", rev: "$70K" },
  { name: "Standard ONT Modem", stock: "1,900", rev: "$95K" },
  { name: "4G Signal Booster", stock: "650", rev: "$52K" },
  { name: "VDSL2 Modem", stock: "2,800", rev: "$84K" },
];

const corpSegments = [
  { name: "SME", qty: 4500 },
  { name: "Enterprise", qty: 3100 },
  { name: "Strategy", qty: 1300 },
];

const indSegments = [
  { name: "Youth", qty: 5200 },
  { name: "Standard", qty: 6800 },
  { name: "Premium", qty: 2400 },
];

/* ------------------------------------------------------------------ */
/* REUSABLE CARD COMPONENTS                                           */
/* ------------------------------------------------------------------ */
function Card({ children, style }) {
  return (
    <div
      style={{
        background: tokens.bgCard,
        border: `1px solid ${tokens.border}`,
        borderRadius: "16px",
        boxShadow: "0 2px 6px rgba(15, 23, 42, 0.03)",
        padding: "16px", 
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
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
        fontSize: "14px",
        fontWeight: 700,
        color: tokens.textPrimary,
        margin: "0 0 12px 0",
        letterSpacing: "-0.01em",
      }}
    >
      {children}
    </h2>
  );
}

/* ------------------------------------------------------------------ */
/* COMPACT PRODUCT TABLE                                              */
/* ------------------------------------------------------------------ */
function ProductTable({ title, data, highlightColor }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
      <div style={{ fontSize: "12px", fontWeight: 700, color: highlightColor, marginBottom: "8px" }}>
        {title} Top 5 Products
      </div>
      <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", height: "100%" }}>
          <thead>
            <tr>
              <th style={thStyle("left")}>Product</th>
              <th style={thStyle("right")}>Stock</th>
              <th style={thStyle("right")}>Revenue</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr 
                key={idx} 
                style={{ borderTop: `1px solid ${tokens.border}`, transition: "background 0.2s" }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = tokens.track}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                <td style={{ ...tdStyle("left"), fontWeight: 500 }}>{row.name}</td>
                <td style={tdStyle("right")}>{row.stock}</td>
                <td style={{ ...tdStyle("right"), fontWeight: 700, color: tokens.textPrimary }}>{row.rev}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function thStyle(align) {
  return {
    textAlign: align,
    color: tokens.textSecondary,
    fontSize: "10px",
    fontWeight: 600,
    paddingBottom: "8px",
    textTransform: "uppercase",
  };
}

function tdStyle(align) {
  return {
    textAlign: align,
    color: tokens.textSecondary,
    fontSize: "12px",
    padding: "8px 0", // Slightly increased padding for the larger table layout
  };
}

/* ------------------------------------------------------------------ */
/* MAIN DASHBOARD COMPONENT                                           */
/* ------------------------------------------------------------------ */
export default function CustomerAnalyticsDashboard() {
  return (
    <div
      style={{
        background: tokens.bgPage,
        height: "100%", 
        width: "100%",  
        boxSizing: "border-box",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif",
        display: "flex",
        gap: "16px",
        overflow: "hidden", 
      }}
    >
      {/* ================= LEFT COLUMN (65%) ================= */}
      <div style={{ flex: "0 0 calc(65% - 8px)", display: "flex", flexDirection: "column", gap: "16px", minWidth: 0 }}>
        
        {/* 1. Sold Stock Trend Card (Changed to 40% height) */}
        <Card style={{ flex: "4 1 0%" }}>
          <CardTitle>Sold Stock Trend</CardTitle>
          <div style={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stockTrendData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                {/* SVG Definitions for Gradients */}
                <defs>
                  <linearGradient id="colorCorporate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={tokens.corporateLight} stopOpacity={1}/>
                    <stop offset="100%" stopColor={tokens.corporateBase} stopOpacity={1}/>
                  </linearGradient>
                  <linearGradient id="colorIndividual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={tokens.individualLight} stopOpacity={1}/>
                    <stop offset="100%" stopColor={tokens.individualBase} stopOpacity={1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={tokens.border} />
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: tokens.textSecondary, fontSize: 11 }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: tokens.textSecondary, fontSize: 11 }} tickFormatter={(val) => `${val / 1000}k`} />
                <Tooltip contentStyle={{ borderRadius: "8px", border: `1px solid ${tokens.border}`, fontSize: "12px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }} />
                <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: "11px", top: -25 }} />
                
                <Line type="monotone" dataKey="corporate" name="Corporate" stroke="url(#colorCorporate)" strokeWidth={2.5} dot={{ r: 4, strokeWidth: 0, fill: tokens.corporateBase }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="individual" name="Individual" stroke="url(#colorIndividual)" strokeWidth={2.5} dot={{ r: 4, strokeWidth: 0, fill: tokens.individualBase }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 2. Top Products Card (Changed to 60% height) */}
        <Card style={{ flex: "6 1 0%" }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "12px", minHeight: 0 }}>
            <ProductTable title="Corporate" data={corpProducts} highlightColor={tokens.corporateBase} />
            <div style={{ height: "1px", background: tokens.border, margin: "4px 0" }} />
            <ProductTable title="Individual" data={indProducts} highlightColor={tokens.individualBase} />
          </div>
        </Card>

      </div>

      {/* ================= RIGHT COLUMN (35%) ================= */}
      <div style={{ flex: "0 0 calc(35% - 8px)", display: "flex", flexDirection: "column", gap: "16px", minWidth: 0 }}>
        
        {/* Corporate Segments (40%) */}
        <Card style={{ flex: "4 1 0%" }}>
          <CardTitle>Corporate Segments</CardTitle>
          <div style={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={corpSegments} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                {/* SVG Definitions for Gradients */}
                <defs>
                  <linearGradient id="barCorporate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={tokens.corporateLight} stopOpacity={1}/>
                    <stop offset="100%" stopColor={tokens.corporateBase} stopOpacity={1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={tokens.border} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: tokens.textSecondary, fontSize: 11 }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: tokens.textSecondary, fontSize: 11 }} tickFormatter={(val) => `${val / 1000}k`} />
                <Tooltip cursor={{ fill: tokens.track }} contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }} />
                <Bar dataKey="qty" fill="url(#barCorporate)" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Leaders Card (20%) */}
        <Card style={{ flex: "2 1 0%", justifyContent: "center", padding: "12px 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: "100%" }}>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: "10px", color: tokens.textSecondary, textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 600 }}>🏢 Corporate Leader</div>
              <div style={{ fontSize: "18px", fontWeight: 800, color: tokens.corporateBase, marginTop: "4px" }}>Istanbul</div>
            </div>
            <div style={{ height: "100%", width: "1px", background: tokens.border }} />
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "10px", color: tokens.textSecondary, textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 600 }}>👤 Individual Leader</div>
              <div style={{ fontSize: "18px", fontWeight: 800, color: tokens.individualBase, marginTop: "4px" }}>Ankara</div>
            </div>
          </div>
        </Card>

        {/* Individual Segments (40%) */}
        <Card style={{ flex: "4 1 0%" }}>
          <CardTitle>Individual Segments</CardTitle>
          <div style={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={indSegments} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                {/* SVG Definitions for Gradients */}
                <defs>
                  <linearGradient id="barIndividual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={tokens.individualLight} stopOpacity={1}/>
                    <stop offset="100%" stopColor={tokens.individualBase} stopOpacity={1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={tokens.border} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: tokens.textSecondary, fontSize: 11 }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: tokens.textSecondary, fontSize: 11 }} tickFormatter={(val) => `${val / 1000}k`} />
                <Tooltip cursor={{ fill: tokens.track }} contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }} />
                <Bar dataKey="qty" fill="url(#barIndividual)" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

      </div>
    </div>
  );
}
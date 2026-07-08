import React from "react";

/* ------------------------------------------------------------------ */
/* DESIGN TOKENS                                                      */
/* ------------------------------------------------------------------ */
const tokens = {
  bgPage: "#F8FAFC", 
  bgCard: "#FFFFFF",
  border: "#E2E8F0",
  textPrimary: "#0F172A",
  textSecondary: "#64748B",
  track: "#F1F5F9",
  
  // Specific UI Colors
  primaryBlue: "#3B82F6",
  danger: "#EF4444",
  dangerLight: "rgba(239, 68, 68, 0.1)",
  warning: "#F97316",
  warningLight: "rgba(249, 115, 22, 0.1)",
};

/* ------------------------------------------------------------------ */
/* MOCK DATA                                                          */
/* ------------------------------------------------------------------ */
const topIssuesData = [
  { name: "5G Home Router", count: 1565, max: 2000 },
  { name: "ONT Modem", count: 1226, max: 2000 },
  { name: "Fiber Cable", count: 1145, max: 2000 },
  { name: "Transceiver", count: 964, max: 2000 },
  { name: "Smart Hub", count: 865, max: 2000 },
];

const detailedTableData = [
  { name: "5G Home Router", returnRatio: "12.4%", cancelRatio: "8.1%", totalNegative: "20.5%", severity: "high" },
  { name: "Standard ONT Modem", returnRatio: "9.2%", cancelRatio: "7.4%", totalNegative: "16.6%", severity: "high" },
  { name: "Fiber Optic Cable", returnRatio: "5.8%", cancelRatio: "10.0%", totalNegative: "15.8%", severity: "medium" },
  { name: "SFP Transceiver", returnRatio: "8.5%", cancelRatio: "4.2%", totalNegative: "12.7%", severity: "medium" },
  { name: "Smart Home Hub", returnRatio: "4.1%", cancelRatio: "6.3%", totalNegative: "10.4%", severity: "medium" },
];

/* ------------------------------------------------------------------ */
/* REUSABLE CARD SHELL                                                */
/* ------------------------------------------------------------------ */
function Card({ children, style }) {
  return (
    <div
      style={{
        background: tokens.bgCard,
        border: `1px solid ${tokens.border}`,
        borderRadius: "12px",
        boxShadow: "0 1px 3px rgba(15, 23, 42, 0.05)",
        padding: "24px",
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
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
      <h2
        style={{
          fontSize: "16px",
          fontWeight: 700,
          color: tokens.textPrimary,
          margin: 0,
          letterSpacing: "-0.01em",
        }}
      >
        {children}
      </h2>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* TOP LEFT: HORIZONTAL BAR CHART                                     */
/* ------------------------------------------------------------------ */
function HorizontalBarItem({ name, count, max }) {
  const percentage = (count / max) * 100;
  
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: 1 }}>
      <div style={{ width: "120px", fontSize: "14px", fontWeight: 600, color: tokens.textSecondary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {name}
      </div>
      
      <div style={{ 
        width: "56px", 
        textAlign: "center", 
        background: tokens.track, 
        borderRadius: "16px", 
        padding: "6px 0", 
        fontSize: "13px", 
        fontWeight: 700, 
        color: tokens.textPrimary 
      }}>
        {count}
      </div>

      <div style={{ flex: 1, height: "16px", background: tokens.track, borderRadius: "8px", overflow: "hidden", position: "relative" }}>
        <div style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: `${percentage}%`,
          background: tokens.primaryBlue,
          borderRadius: "8px",
        }} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* TOP RIGHT: AI PREDICTION                                           */
/* ------------------------------------------------------------------ */
function AIPredictionBlock({ style }) {
  return (
    <Card 
      style={{ 
        ...style, 
        border: `1.5px solid ${tokens.primaryBlue}`,
        padding: "24px",
      }}
    >
      {/* Title Area */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={tokens.primaryBlue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z"/>
        </svg>
        <h2 style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: tokens.primaryBlue, letterSpacing: "0.05em", textTransform: "uppercase" }}>
          AI-Driven Predictive Forecasting
        </h2>
      </div>
      
      <div style={{ flex: 1, display: "flex", gap: "16px", minHeight: 0 }}>
        
        {/* Left Side: Text-based Insights */}
        <div style={{ flex: "1 1 45%", display: "flex", flexDirection: "column", gap: "14px", minHeight: 0 }}>
          
          {/* Risk Card */}
          <div style={{ flex: 1, border: `1px solid ${tokens.border}`, borderRadius: "10px", padding: "14px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ fontSize: "11px", color: tokens.textSecondary, textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 700 }}>
              Primary Risk Identified
            </div>
            <div style={{ fontSize: "14px", color: tokens.textPrimary, fontWeight: 700, marginTop: "8px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              5G Home Router Firmware v2.1
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "10px" }}>
              <div style={{ width: "8px", height: "8px", background: tokens.danger, borderRadius: "50%" }} />
              <span style={{ fontSize: "13px", color: tokens.danger, fontWeight: 600 }}>+15% return expected</span>
            </div>
          </div>

          {/* NLP Sentiment Card */}
          <div style={{ flex: 1, border: `1px solid ${tokens.border}`, borderRadius: "10px", padding: "14px", display: "flex", flexDirection: "column", justifyContent: "center", minHeight: 0 }}>
            <div style={{ fontSize: "11px", color: tokens.textSecondary, textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 700, marginBottom: "8px" }}>
              Sentiment NLP
            </div>
            {/* Yazının taşmasını önlemek için boyut ve satır aralığı optimize edildi */}
            <p style={{ fontSize: "12.5px", color: tokens.textPrimary, lineHeight: "1.5", margin: 0 }}>
              High correlation between <span style={{ color: tokens.warning, fontWeight: 700 }}>"overheating"</span> and recent cancellations in the <span style={{ color: tokens.primaryBlue, fontWeight: 700 }}>Marmara Region</span>.
            </p>
          </div>

        </div>

        {/* Right Side: Causality Map */}
        <div style={{ flex: "1 1 55%", border: `1px solid ${tokens.border}`, borderRadius: "10px", display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
          <div style={{ padding: "14px 14px 0 14px", fontSize: "11px", color: tokens.textSecondary, textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 700 }}>
            Causality Map
          </div>
          <div style={{ flex: 1, position: "relative", minHeight: 0, width: "100%" }}>
            <svg width="100%" height="100%" viewBox="0 0 200 120" preserveAspectRatio="xMidYMid meet" style={{ display: "block" }}>
              
              {/* Lines */}
              <path d="M 40 45 C 80 45, 80 70, 110 70" stroke="#FBBF24" strokeWidth="2.5" fill="none" />
              <path d="M 40 95 C 80 95, 80 70, 110 70" stroke={tokens.primaryBlue} strokeWidth="2.5" fill="none" />
              {/* Dashed Line */}
              <path d="M 110 70 C 145 70, 145 45, 175 45" stroke={tokens.danger} strokeWidth="2.5" fill="none" strokeDasharray="4 4" />
              
              {/* Temp Node */}
              <circle cx="40" cy="45" r="5" fill="#FBBF24" />
              <text x="40" y="30" fill={tokens.textPrimary} fontSize="11" fontWeight="500" textAnchor="middle">Temp</text>
              
              {/* Delay Node */}
              <circle cx="40" cy="95" r="5" fill={tokens.primaryBlue} />
              <text x="40" y="115" fill={tokens.textPrimary} fontSize="11" fontWeight="500" textAnchor="middle">Delay</text>
              
              {/* Center Node */}
              <circle cx="110" cy="70" r="8" fill="#FFF" stroke={tokens.primaryBlue} strokeWidth="2.5" />
              <rect x="107" y="67" width="6" height="6" fill={tokens.primaryBlue} rx="1" />
              
              {/* Output Risk Node */}
              <circle cx="175" cy="45" r="6" fill="#FFF" stroke={tokens.danger} strokeWidth="3" />
              <text x="175" y="30" fill={tokens.danger} fontSize="11" fontWeight="600" textAnchor="middle">Risk</text>

            </svg>
          </div>
        </div>

      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* BOTTOM ROW: DETAILED TABLE                                         */
/* ------------------------------------------------------------------ */
function DetailedTable() {
  return (
    <Card style={{ padding: "24px 24px 16px 24px" }}>
      <CardTitle>Top 5 Canceled & Returned Products Breakdown</CardTitle>
      
      {/* Scrollbar engellendi, satırlar tam sığacak şekilde optimize edildi */}
      <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", flex: 1 }}>
          <thead>
            <tr>
              <th style={thStyle("left")}>Product Name</th>
              <th style={thStyle("center")}>Return Ratio</th>
              <th style={thStyle("center")}>Cancel Ratio</th>
              <th style={thStyle("right")}>Total Negative Ratio</th>
            </tr>
          </thead>
          <tbody>
            {detailedTableData.map((row, idx) => {
              const isHigh = row.severity === "high";
              const badgeColor = isHigh ? tokens.danger : tokens.warning;
              const badgeBg = isHigh ? tokens.dangerLight : tokens.warningLight;
              const badgeBorder = isHigh ? "rgba(239, 68, 68, 0.2)" : "rgba(249, 115, 22, 0.2)";

              return (
                <tr key={idx} style={{ borderBottom: idx !== 4 ? `1px solid #F1F5F9` : "none" }}>
                  <td style={{ ...tdStyle("left"), fontWeight: 700, color: tokens.textPrimary }}>
                    {row.name}
                  </td>
                  <td style={{ ...tdStyle("center"), color: tokens.textPrimary, fontWeight: 700 }}>
                    {row.returnRatio}
                  </td>
                  <td style={{ ...tdStyle("center"), color: tokens.textPrimary, fontWeight: 700 }}>
                    {row.cancelRatio}
                  </td>
                  <td style={{ ...tdStyle("right") }}>
                    <span style={{ 
                      background: badgeBg, 
                      border: `1px solid ${badgeBorder}`,
                      padding: "6px 12px", 
                      borderRadius: "6px", 
                      fontWeight: 700, 
                      color: badgeColor,
                      fontSize: "13px",
                      display: "inline-block"
                    }}>
                      {row.totalNegative}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function thStyle(align) {
  return {
    textAlign: align,
    color: tokens.textSecondary,
    fontSize: "11px",
    fontWeight: 700,
    paddingBottom: "14px",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    borderBottom: `1px solid ${tokens.border}`,
  };
}

function tdStyle(align) {
  return {
    textAlign: align,
    fontSize: "14px",
    padding: "14px 12px", // Yükseklik taşmasını önlemek için hafif azaltıldı
  };
}

/* ------------------------------------------------------------------ */
/* MAIN DASHBOARD COMPONENT                                           */
/* ------------------------------------------------------------------ */
export default function FeedbackDashboard() {
  return (
    <div
      style={{
        background: tokens.bgPage, 
        width: "100%",  
        boxSizing: "border-box",
        padding: "32px", 
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      {/* ================= TOP ROW ================= */}
      <div style={{ display: "flex", gap: "24px", minHeight: "320px", alignItems: "stretch" }}>
        
        {/* Top Left: Cancel/Return Volume Chart */}
        <Card style={{ flex: "1 1 45%" }}>
          <CardTitle>Top Canceled & Returned Items</CardTitle>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", paddingRight: "8px", fontSize: "11px", color: tokens.textSecondary, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              <span>Product</span>
              <span style={{ marginLeft: "75px" }}>Volume</span>
              <span style={{ flex: 1, textAlign: "right" }}>Distribution</span>
            </div>
            
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "12px", overflow: "hidden" }}>
              {topIssuesData.map((item, index) => (
                <HorizontalBarItem key={index} name={item.name} count={item.count} max={item.max} />
              ))}
            </div>
          </div>
        </Card>

        {/* Top Right: AI Prediction Shell */}
        <AIPredictionBlock style={{ flex: "1 1 55%" }} />
      </div>

      {/* ================= BOTTOM ROW ================= */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <DetailedTable />
      </div>

    </div>
  );
}
import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { MapPin, RefreshCw, Warehouse, BarChart3 } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Design tokens                                                     */
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
  cardShadow: "0 1px 2px rgba(16, 24, 64, 0.04)",
};

/* ------------------------------------------------------------------ */
/* Mock data                                                         */
/* ------------------------------------------------------------------ */

const CITIES = ["Istanbul", "Ankara", "Izmir", "Antalya"];

const cityData = {
  Istanbul: {
    bestSellers: [
      { name: "5G SIM Card", stock: 12480, value: 1248000 },
      { name: "Fiber Modem", stock: 3860, value: 1158000 },
      { name: "Wi-Fi 6 Router", stock: 2140, value: 749000 },
    ],
    channels: { online: 65, retail: 35, onlineValue: 1846250, retailValue: 992750 },
    quarterly: [
      { quarter: "Q1", product: "Fiber Modem", units: 3250 },
      { quarter: "Q2", product: "5G SIM Card", units: 9200 },
      { quarter: "Q3", product: "Wi-Fi 6 Router", units: 4800 },
      { quarter: "Q4", product: "Fiber Modem", units: 2900 },
    ],
  },
  Ankara: {
    bestSellers: [
      { name: "4G/5G Home Router", stock: 1540, value: 594000 },
      { name: "IP Desk Telephone", stock: 1410, value: 246000 },
      { name: "Ethernet Switch", stock: 980, value: 108000 },
    ],
    channels: { online: 44, retail: 56, onlineValue: 692000, retailValue: 881000 },
    quarterly: [
      { quarter: "Q1", product: "Home Router", units: 1400 },
      { quarter: "Q2", product: "IP Telephone", units: 1150 },
      { quarter: "Q3", product: "Home Router", units: 1800 },
      { quarter: "Q4", product: "Ethernet Switch", units: 1600 },
    ],
  },
  Izmir: {
    bestSellers: [
      { name: "Signal Repeater", stock: 1380, value: 152000 },
      { name: "Fiber Optic Cable", stock: 9200, value: 82800 },
      { name: "Patch Cable (RJ45)", stock: 4100, value: 20500 },
    ],
    channels: { online: 51, retail: 49, onlineValue: 128700, retailValue: 123700 },
    quarterly: [
      { quarter: "Q1", product: "Signal Repeater", units: 980 },
      { quarter: "Q2", product: "Fiber Cable", units: 1450 },
      { quarter: "Q3", product: "Signal Repeater", units: 1120 },
      { quarter: "Q4", product: "Patch Cable", units: 890 },
    ],
  },
  Antalya: {
    bestSellers: [
      { name: "TV+ Digital Service Box", stock: 1470, value: 235000 },
      { name: "Base Station Antenna", stock: 260, value: 480000 },
      { name: "Modem Power Adapter", stock: 1900, value: 45000 },
    ],
    channels: { online: 70, retail: 30, onlineValue: 532000, retailValue: 228000 },
    quarterly: [
      { quarter: "Q1", product: "TV Service Box", units: 620 },
      { quarter: "Q2", product: "TV Service Box", units: 1900 },
      { quarter: "Q3", product: "Base Antenna", units: 740 },
      { quarter: "Q4", product: "Power Adapter", units: 560 },
    ],
  },
};

const revenueByYearData = {
  Istanbul: [
    { year: "2021", revenue: 4.5 }, { year: "2022", revenue: 6.2 },
    { year: "2023", revenue: 8.1 }, { year: "2024", revenue: 10.3 },
    { year: "2025", revenue: 12.1 },
  ],
  Ankara: [
    { year: "2021", revenue: 2.1 }, { year: "2022", revenue: 3.4 },
    { year: "2023", revenue: 4.8 }, { year: "2024", revenue: 5.9 },
    { year: "2025", revenue: 6.7 },
  ],
  Izmir: [
    { year: "2021", revenue: 1.8 }, { year: "2022", revenue: 2.7 },
    { year: "2023", revenue: 3.5 }, { year: "2024", revenue: 4.2 },
    { year: "2025", revenue: 5.1 },
  ],
  Antalya: [
    { year: "2021", revenue: 3.2 }, { year: "2022", revenue: 4.8 },
    { year: "2023", revenue: 6.5 }, { year: "2024", revenue: 8.2 },
    { year: "2025", revenue: 9.1 },
  ],
};

/* ------------------------------------------------------------------ */
/* Helpers                                                           */
/* ------------------------------------------------------------------ */

function formatMoney(n) {
  return `₺${n.toLocaleString()}`;
}

function totalsFor(city) {
  const rows = cityData[city].bestSellers;
  return rows.reduce(
    (acc, r) => ({ stock: acc.stock + r.stock, value: acc.value + r.value }),
    { stock: 0, value: 0 }
  );
}

/* ------------------------------------------------------------------ */
/* Reusable card shell                                               */
/* ------------------------------------------------------------------ */

function Card({ children, style }) {
  return (
    <div
      style={{
        background: tokens.bgCard,
        border: `1px solid ${tokens.border}`,
        borderRadius: 16,
        boxShadow: tokens.cardShadow,
        padding: 16, // Padding biraz artırıldı (daha ferah)
        display: "flex",
        flexDirection: "column",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function CardTitle({ children, sub, action }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 12, // Margin artırıldı
        gap: 12,
      }}
    >
      <div>
        <h2 style={{ fontSize: 17, fontWeight: 800, color: tokens.textPrimary, margin: 0, lineHeight: 1.2 }}>
          {children}
        </h2>
        {sub && (
          <div style={{ fontSize: 12, color: tokens.textSecondary, marginTop: 4, fontWeight: 500 }}>
            {sub}
          </div>
        )}
      </div>
      {action}
    </div>
  );
}

function KpiSummaryCard({ title, value, icon: Icon, accent, accentBg, style }) {
  return (
    <Card
      style={{
        padding: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        ...style,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: accentBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon size={18} color={accent} />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 14, color: tokens.textSecondary, fontWeight: 800, whiteSpace: "nowrap" }}>{title}</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: tokens.textPrimary, whiteSpace: "nowrap", lineHeight: 1.1 }}>{value}</div>
        </div>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* 1. Turkey map backdrop + pins                                     */
/* ------------------------------------------------------------------ */

const TURKEY_PATH_D = `M10.923,137.579L2.5,139.073L0,137.662L2.632,134.756L7.501,132.927L9.081,132.761L11.186,135.586ZM579.056,70.9L581.425,71.832L586.031,73.103L588.926,74.627L590.506,75.05L594.191,71.917L599.85,72.002L604.719,72.425L607.219,72.934L610.246,73.95L614.063,74.712L615.51,73.188L617.748,68.865L618.537,68.272L619.195,67.847L621.959,67.508L624.591,67.847L625.776,68.611L626.96,72.086L630.118,73.357L635.646,78.942L638.936,81.139L639.726,82.068L638.673,83.166L639.067,84.601L641.042,86.373L643.674,87.047L646.701,86.794L648.28,87.469L649.333,88.48L649.596,89.913L649.596,90.84L650.122,92.945L652.491,95.805L655.123,97.571L656.571,99.503L658.94,105.964L659.992,109.567L659.598,113.082L657.887,116.593L654.334,121.018L655.255,122.853L656.044,125.27L655.781,127.103L658.282,132.678L659.466,136.168L658.545,136.998L657.887,138.077L662.493,140.732L667.889,143.053L670.258,143.468L676.575,142.39L680.654,142.224L684.734,144.296L690.525,149.511L696.842,156.203L698.158,158.266L698.684,159.173L700,160.74L698.684,160.74L696.578,159.256L691.577,155.13L688.945,156.946L686.708,159.998L684.339,171.601L682.365,172.834L678.812,172.751L674.6,172.423L671.705,172.998L670.916,173.737L671.31,174.968L672.232,176.855L672.758,179.233L673.021,181.199L674.469,183.001L676.575,184.72L676.706,186.438L676.311,188.89L675.917,190.688L675.39,191.749L676.311,194.606L678.549,197.949L679.996,199.172L679.47,205.52L680.259,208.365L680.917,212.263L680.654,218.668L681.049,220.207L681.707,220.773L683.813,221.016L685.787,221.583L686.576,222.635L686.445,223.444L683.944,226.354L683.681,228.455L682.892,231.442L682.102,233.136L679.865,236.441L678.417,239.743L677.759,242.479L678.285,243.766L682.365,244.168L684.602,246.097L690.525,250.032L691.577,251.636L689.998,254.042L689.998,255.004L690.788,256.286L691.183,258.528L691.051,261.009L691.051,264.287L692.104,264.847L696.183,267.882L699.079,270.994L699.21,271.951L697.763,274.343L698.158,277.131L698.026,277.768L696.842,276.733L694.604,276.335L692.235,276.255L690.788,277.051L688.156,279.201L684.734,281.587L681.97,283.813L680.391,285.323L679.075,285.085L678.022,283.734L677.496,281.905L677.627,274.981L677.101,272.829L675.785,271.313L674.206,270.436L672.495,269.957L670.521,269.877L667.889,271.951L664.072,274.024L658.282,273.865L654.334,273.466L652.359,273.068L644.726,269.877L643.147,269.798L640.252,268.441L636.962,267.403L631.171,269.399L628.671,268.92L625.249,267.243L624.065,267.722L620.248,272.829L613.668,278.405L610.115,279.28L608.404,273.785L606.825,271.632L606.035,271.313L604.324,270.675L603.14,271.074L599.192,274.821L592.875,277.131L587.61,278.484L579.188,280.235L572.871,281.031L570.107,281.11L564.185,280.394L558.921,279.28L553.657,279.36L549.709,279.837L540.365,283.893L524.441,292.227L512.333,296.268L505.621,297.931L500.357,298.802L491.277,298.881L483.907,298.248L478.774,298.327L475.879,297.298L471.931,293.971L466.93,290.562L464.824,289.848L461.929,289.134L457.718,288.817L447.321,293.654L444.031,295.001L440.478,296.031L433.371,298.96L430.081,300.621L426.133,300.463L421,299.988L416.657,300.147L413.63,297.852L412.051,295.318L405.997,293.733L401.654,293.337L400.602,294.447L399.417,297.931L397.575,306.785L397.312,309.074L401.128,317.821L400.865,319.159L398.233,319.631L395.074,319.788L392.969,320.575L391.389,321.99L390.337,329.608L386.783,331.019L384.941,332.587L383.23,337.287L382.309,337.365L376.387,333.841L373.754,333.528L375.992,329.843L373.491,322.54L370.728,315.774L373.36,311.361L378.755,306.074L384.546,299.83L384.546,296.031L384.151,293.099L382.572,291.117L379.413,288.42L374.149,291.276L370.333,294.447L367.964,295.08L365.2,296.902L363.884,300.147L360.726,302.677L355.462,303.704L347.565,300.938L339.011,296.823L334.142,293.496L330.194,292.703L326.509,294.13L315.454,302.361L305.321,314.356L302.82,316.404L293.345,321.518L287.028,323.248L284.132,322.855L271.63,325.133L265.313,325.448L260.444,328.117L250.968,325.212L245.178,321.44L241.756,317.664L236.229,309.389L232.149,305.521L223.331,301.965L207.671,293.416L203.591,292.465L193.063,291.197L181.876,290.403L179.507,293.575L178.718,305.916L176.744,309.311L175.954,315.695L174.638,317.585L172.401,318.766L169.111,316.719L166.742,315.853L161.346,318.451L150.555,322.147L146.87,322.698L134.499,318.057L129.893,315.065L126.998,311.756L125.945,306.153L124.102,302.993L123.839,300.779L123.181,298.327L120.681,297.298L117.917,299.197L115.022,299.118L111.468,297.931L102.914,293.258L96.334,292.862L92.386,298.643L89.227,300.463L85.937,301.017L85.674,299.355L88.306,295.635L78.041,296.348L72.645,299.118L68.434,298.722L65.275,297.456L65.67,295.872L68.96,295.318L71.724,294.05L82.779,293.02L85.411,291.989L88.174,287.943L93.439,284.449L94.097,282.939L90.017,282.939L73.04,283.972L61.327,283.416L60.011,285.085L58.169,285.402L57.774,280.633L59.616,278.484L62.117,278.723L68.171,276.813L67.644,272.908L63.301,270.197L62.38,268.68L59.222,268.281L56.59,266.445L56.063,261.729L54.089,256.526L51.062,254.042L51.457,252.679L56.853,250.914L57.906,243.685L57.116,239.18L54.484,238.858L46.588,235.313L44.219,235.635L41.587,231.765L36.981,229.02L34.743,229.989L33.296,231.281L31.19,230.716L27.768,228.293L24.215,226.92L22.636,225.304L24.61,221.016L27.242,221.097L27.768,217.696L25.663,212.02L25.926,209.096L28.163,208.365L30.795,208.853L33.559,212.263L34.349,215.589L33.822,218.749L35.533,221.826L36.717,222.635L37.507,219.316L38.691,218.749L40.271,220.126L43.561,220.854L52.247,218.911L53.826,217.21L47.509,217.372L45.272,215.832L42.64,212.263L41.192,209.015L40.797,207.471L40.008,205.114L40.929,203.894L45.272,202.022L49.088,196.808L47.509,195.34L45.666,194.606L43.692,195.095L41.85,193.3L41.587,190.851L43.166,188.809L43.298,186.029L38.297,179.233L36.981,177.757L38.033,175.46L41.85,171.766L45.403,167.08L44.877,165.517L42.245,164.94L29.742,166.915L24.873,168.643L16.187,169.465L15.529,166.915L15.792,164.611L17.766,160.492L17.503,150.172L18.688,144.627L23.557,142.97L29.479,134.672L39.086,124.937L49.088,125.187L53.036,122.436L58.958,122.269L60.143,124.27L60.801,126.103L66.065,128.851L75.277,128.435L77.515,127.353L79.62,125.854L75.409,121.101L76.725,119.683L80.541,119.516L84.753,120.684L85.016,121.769L83.832,123.27L82.516,125.937L83.832,126.437L95.676,124.854L108.178,126.103L112.126,125.437L121.997,125.437L123.707,123.853L120.812,121.769L117.917,121.018L115.943,120.016L113.969,118.514L120.154,113.918L123.707,112.998L140.29,110.153L152.66,108.729L152.792,107.64L150.949,107.64L135.025,105.294L131.209,103.448L125.945,99.083L124.76,97.823L123.444,95.721L124.234,91.092L125.155,87.469L127.129,85.36L133.446,85.023L155.292,88.733L170.953,86.457L187.93,91.934L204.117,90.84L207.539,88.396L211.619,80.548L234.518,67.338L242.546,60.543L251.231,56.714L265.971,52.539L278.342,46.993L281.895,46.395L311.506,49.042L331.904,49.383L341.248,44.088L346.776,45.883L346.249,47.762L345.196,49.383L345.591,52.625L348.75,57.31L351.908,60.543L361.515,65.216L374.676,61.308L376.781,61.733L379.545,62.838L384.151,75.304L387.836,79.702L392.442,82.744L396.259,83.335L399.022,80.21L401.26,78.942L405.997,78.434L413.894,82.659L416.657,87.132L429.949,90.503L442.188,92.187L447.453,95.973L464.693,99.671L471.141,99.083L481.933,95.216L502.858,90.924L516.808,96.898L520.624,97.655L523.914,97.15L528.52,98.831L533.521,97.907L548.919,90.84L553.788,86.794L558.921,85.782L563.395,83.335L575.503,75.474ZM85.674,48.786L84.753,54.329L86.99,60.543L92.386,69.035L97.782,73.357L119.759,84.01L123.839,84.938L122.918,89.239L121.602,93.113L120.154,95.637L113.706,97.318L95.939,92.608L91.465,92.103L88.306,93.113L82.384,96.478L75.935,95.385L66.855,97.318L64.354,103.784L58.037,111.157L47.641,117.094L40.271,120.267L29.216,131.597L24.083,138.243L21.978,139.488L19.477,140.566L20.267,137.33L21.583,134.423L21.32,132.262L21.32,129.101L25.005,125.437L28.426,122.853L38.428,118.013L41.06,114.085L33.164,114.169L25.268,115.088L20.267,114.503L15.924,114.838L14.476,111.325L13.424,109.232L14.608,108.646L16.056,108.143L18.556,104.455L20.925,101.686L24.215,98.243L25.005,96.225L25.005,94.291L24.215,92.945L24.083,91.345L23.952,89.07L24.215,84.432L31.716,79.364L34.085,78.857L34.875,76.489L34.349,71.154L33.296,66.829L31.98,66.49L30.137,65.216L28.953,63.773L27.11,62.158L23.82,61.138L23.689,59.777L24.083,58.416L25.268,56.969L30.795,55.777L31.453,54.755L32.111,52.284L33.296,49.81L34.612,48.957L36.849,49.042L41.324,48.445L44.35,47.676L47.509,45.883L49.088,44.345L55.668,43.404L57.511,42.635L59.353,43.319L61.854,45.968L65.933,49.81L68.171,51.09L69.882,50.578L72.777,49.127L75.672,49.127L77.909,49.383L79.094,48.189L80.805,47.932Z`;

const MAP_DOTS = (() => {
  if (typeof document === "undefined") return [];
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const path = new Path2D(TURKEY_PATH_D);
  const dots = [];
  for (let x = 10; x <= 690; x += 10) {
    for (let y = 10; y <= 370; y += 10) {
      if (ctx.isPointInPath(path, x, y)) dots.push([x, y]);
    }
  }
  return dots;
})();

const CITY_MARKERS = {
  Istanbul: { x: 120.9, y: 95.7 },
  Ankara: { x: 262.8, y: 147.3 },
  Izmir: { x: 53.8, y: 218.5 },
  Antalya: { x: 184.1, y: 289.6 },
};

function TurkeyMapCard({ selectedCity, onSelect, style }) {
  return (
    <Card style={{ flex: 1, minHeight: 0, ...style }}>
      <CardTitle sub="Click a city on the map to see its branch data.">Cities</CardTitle>

      <div
        style={{
          position: "relative",
          width: "100%",
          background: tokens.bgCardSoft,
          border: `1px solid ${tokens.border}`,
          borderRadius: 16,
          overflow: "hidden",
          flex: 1,
          minHeight: 0,
        }}
      >
        <style>{`
          .city-pin {
            cursor: pointer;
            transition: transform 0.22s ease;
            transform-box: fill-box;
            transform-origin: center;
          }
          .city-pin:hover {
            transform: scale(1.1);
          }
          @keyframes turkeyPinPulse {
            0%   { r: 16; opacity: 0.65; }
            70%  { r: 27; opacity: 0.15; }
            100% { r: 34; opacity: 0; }
          }
          .turkey-pulse-ring {
            animation: turkeyPinPulse 1.8s ease-out infinite;
            transform-origin: center;
          }
        `}</style>

        <svg
          viewBox="0 0 700 380"
          preserveAspectRatio="xMidYMid meet"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "block",
          }}
        >
          <defs>
            <pattern id="mapBackdropGrid" width="22" height="22" patternUnits="userSpaceOnUse">
              <circle cx="1.2" cy="1.2" r="1.2" fill={tokens.border} opacity={0.7} />
            </pattern>

            <linearGradient id="turkeyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#eef3ff" />
              <stop offset="45%" stopColor="#dbe5ff" />
              <stop offset="100%" stopColor="#b7cafb" />
            </linearGradient>

            <linearGradient id="turkeySideGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#aebde3" />
              <stop offset="100%" stopColor="#8ea0d6" />
            </linearGradient>

            <radialGradient id="turkeyHighlight" cx="28%" cy="18%" r="75%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="pinGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={tokens.accentRed} stopOpacity="0.5" />
              <stop offset="100%" stopColor={tokens.accentRed} stopOpacity="0" />
            </radialGradient>

            <filter id="turkeyAmbientShadow" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="14" stdDeviation="16" floodColor="#3355f4" floodOpacity="0.18" />
            </filter>

            <filter id="pinShadow" x="-80%" y="-80%" width="260%" height="260%">
              <feDropShadow dx="0" dy="3" stdDeviation="3.5" floodColor="#1b2036" floodOpacity="0.3" />
            </filter>

            <filter id="labelShadow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
              <feFlood floodColor="#ffffff" floodOpacity="0.95" result="color" />
              <feComposite in="color" in2="blur" operator="in" result="shadow" />
              <feMerge>
                <feMergeNode in="shadow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect x="0" y="0" width="700" height="380" fill="url(#mapBackdropGrid)" />

          <path d={TURKEY_PATH_D} transform="translate(8,15)" fill="url(#turkeySideGradient)" opacity={0.95} />

          <path
            d={TURKEY_PATH_D}
            fill="url(#turkeyGradient)"
            stroke="#ffffff"
            strokeWidth={3}
            filter="url(#turkeyAmbientShadow)"
          />

          <path d={TURKEY_PATH_D} fill="url(#turkeyHighlight)" opacity={0.55} style={{ pointerEvents: "none" }} />

          {MAP_DOTS.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={1.7} fill={tokens.primary} opacity={0.16} />
          ))}

          {CITIES.map((city) => {
            const pos = CITY_MARKERS[city];
            const isSelected = city === selectedCity;
            const badgeR = isSelected ? 15 : 12;
            const lift = isSelected ? 46 : 38;
            const badgeCx = pos.x;
            const badgeCy = pos.y - lift;

            return (
              <g
                key={city}
                className="city-pin"
                onClick={() => onSelect(city)}
                role="button"
                aria-label={`Select ${city}`}
              >
                <line
                  x1={badgeCx}
                  y1={badgeCy + badgeR + 1}
                  x2={pos.x}
                  y2={pos.y}
                  stroke={tokens.accentRed}
                  strokeWidth={isSelected ? 2 : 1.4}
                  strokeDasharray="3 3"
                  opacity={0.55}
                />

                <circle cx={pos.x} cy={pos.y} r={4} fill={tokens.accentRed} stroke="#ffffff" strokeWidth={1.4} />

                {isSelected && (
                  <>
                    <circle cx={badgeCx} cy={badgeCy} r={32} fill="url(#pinGlow)" />
                    <circle
                      className="turkey-pulse-ring"
                      cx={badgeCx}
                      cy={badgeCy}
                      r={16}
                      fill="none"
                      stroke={tokens.accentRed}
                      strokeWidth={2}
                    />
                  </>
                )}

                <circle
                  cx={badgeCx}
                  cy={badgeCy}
                  r={badgeR}
                  fill="#ffffff"
                  stroke={tokens.accentRed}
                  strokeWidth={isSelected ? 3 : 2}
                  filter="url(#pinShadow)"
                />
                <circle cx={badgeCx} cy={badgeCy} r={badgeR * 0.42} fill={tokens.accentRed} />

                <text
                  x={pos.x + 14}
                  y={pos.y + 5}
                  fontSize={isSelected ? 20 : 18}
                  fontWeight={800}
                  fill={isSelected ? tokens.accentRed : tokens.textPrimary}
                  filter="url(#labelShadow)"
                >
                  {city}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginTop: 10,
          background: tokens.bgCardSoft,
          border: `1px solid ${tokens.border}`,
          borderRadius: 14,
          padding: "8px 12px",
          width: "fit-content",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: tokens.accentRed,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <MapPin size={13} color="#fff" />
        </div>
        <div>
          <div style={{ fontSize: 11, color: tokens.textSecondary, fontWeight: 600 }}>Selected city</div>
          <div style={{ fontSize: 14, color: tokens.textPrimary, fontWeight: 800, lineHeight: 1.1 }}>{selectedCity}</div>
        </div>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Best selling products table                                    */
/* ------------------------------------------------------------------ */

function BestSellersCard({ selectedCity, style, onRefresh }) {
  const rows = cityData[selectedCity].bestSellers;
  const totals = totalsFor(selectedCity);

  // Font boyutları büyütüldü
  const th = { textAlign: "left", color: tokens.textSecondary, fontSize: 12, fontWeight: 600, padding: "0 0 8px 0" };
  const thRight = { ...th, textAlign: "right" };
  const td = { color: tokens.textPrimary, fontSize: 14, fontWeight: 600, padding: "8px 0" };
  const tdRight = { ...td, textAlign: "right", fontWeight: 700 };

  return (
    <Card style={{ flex: 1, minHeight: 0, ...style }}>
      <CardTitle
        sub={`Top 3 in ${selectedCity}`}
        action={
          <button
            onClick={onRefresh}
            title="Refresh"
            style={{
              width: 30,
              height: 30,
              borderRadius: 9,
              border: `1px solid ${tokens.border}`,
              background: tokens.bgCardSoft,
              color: tokens.textSecondary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <RefreshCw size={14} />
          </button>
        }
      >
        Top 3 Best Selling Products
      </CardTitle>

      <div style={{ overflowY: "auto", overflowX: "auto", flex: 1, minHeight: 0 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontVariantNumeric: "tabular-nums" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${tokens.border}` }}>
              <th style={th}>Product name</th>
              <th style={thRight}>Current stock</th>
              <th style={thRight}>Total stock value</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name} style={{ borderBottom: `1px solid ${tokens.border}` }}>
                <td style={td}>{row.name}</td>
                <td style={tdRight}>{row.stock.toLocaleString()}</td>
                <td style={tdRight}>{formatMoney(row.value)}</td>
              </tr>
            ))}
            <tr>
              <td style={{ ...td, color: tokens.textSecondary, fontWeight: 700 }}>Total</td>
              <td style={tdRight}>{totals.stock.toLocaleString()}</td>
              <td style={tdRight}>{formatMoney(totals.value)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Sales channel comparison — donut chart                         */
/* ------------------------------------------------------------------ */

function renderDonutLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }) {
  const RAD = Math.PI / 180;
  const r = innerRadius + (outerRadius - innerRadius) * 0.6;
  const x = cx + r * Math.cos(-midAngle * RAD);
  const y = cy + r * Math.sin(-midAngle * RAD);
  return (
    <text x={x} y={y} fill="#ffffff" textAnchor="middle" dominantBaseline="central" fontSize={14} fontWeight={800}>
      {(percent * 100).toFixed(0)}%
    </text>
  );
}

function SalesChannelCard({ selectedCity, style }) {
  const { online, retail, onlineValue, retailValue } = cityData[selectedCity].channels;
  
  const pieData = [
    { name: "Online Sales", value: online, amount: onlineValue, color: tokens.primary },
    { name: "Retail Sales", value: retail, amount: retailValue, color: tokens.accentGreen },
  ];

  return (
    <Card style={{ flex: 1, minHeight: 0, ...style }}>
      <CardTitle sub={selectedCity}>Sales Channel Comparison</CardTitle>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 30,
          flex: 1,
          minHeight: 0,
        }}
      >
        <div style={{ width: "100%", maxWidth: 160, aspectRatio: "1/1" }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                innerRadius="50%"
                outerRadius="80%"
                paddingAngle={2}
                stroke="none"
                label={renderDonutLabel}
                labelLine={false}
              >
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>

              <Tooltip
                contentStyle={{
                  background: tokens.bgCardSoft,
                  border: `1px solid ${tokens.border}`,
                  borderRadius: 10,
                  color: tokens.textPrimary,
                }}
                formatter={(v, n) => [`${v}%`, n]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            justifyContent: "center",
          }}
        >
          {pieData.map((entry) => (
            <div key={entry.name}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 2,
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: entry.color,
                  }}
                />
                <span
                  style={{
                    fontSize: 12,
                    color: tokens.textSecondary,
                    fontWeight: 600,
                  }}
                >
                  {entry.name}
                </span>
              </div>

              <div
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: tokens.textPrimary,
                }}
              >
                {entry.value}%
              </div>

              <div
                style={{
                  fontSize: 12,
                  color: tokens.textSecondary,
                  fontWeight: 600,
                }}
              >
                {formatMoney(entry.amount)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Quarterly product sales — line chart                           */
/* ------------------------------------------------------------------ */

function QuarterlyDot(props) {
  const { cx, cy, payload } = props;
  return (
    <g>
      <circle cx={cx} cy={cy} r={4.5} fill={tokens.primary} stroke={tokens.bgCard} strokeWidth={2} />
      {/* İsimler ve rakamlar dikey ferahlıktan faydalanılarak daha okunaklı yapıldı */}
      <text x={cx} y={cy - 24} textAnchor="middle" fontSize={11} fontWeight={600} fill={tokens.textSecondary}>
        {payload.product}
      </text>
      <text x={cx} y={cy - 9} textAnchor="middle" fontSize={12} fontWeight={800} fill={tokens.textPrimary}>
        {payload.units.toLocaleString()}
      </text>
    </g>
  );
}

function QuarterlySalesCard({ selectedCity, style }) {
  const data = cityData[selectedCity].quarterly;
  return (
    <Card style={{ flex: 1, minHeight: 0, ...style }}>
      <CardTitle sub={selectedCity}>Most Sold Product by Quarter</CardTitle>
      <div style={{ fontSize: 11, color: tokens.textSecondary, fontWeight: 600, marginBottom: 4 }}>
        Units sold
      </div>
      <div style={{ width: "100%", flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          {/* Üst margin artırıldı ki label'lar kesilmesin */}
          <LineChart data={data} margin={{ top: 35, right: 16, left: -10, bottom: 0 }}>
            <CartesianGrid stroke={tokens.track} strokeDasharray="3 4" vertical={false} />
            <XAxis
              dataKey="quarter"
              stroke={tokens.textSecondary}
              tick={{ fill: tokens.textSecondary, fontSize: 12 }}
              axisLine={{ stroke: tokens.border }}
              tickLine={false}
            />
            <YAxis
              stroke={tokens.textSecondary}
              tick={{ fill: tokens.textSecondary, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => (v >= 1000 ? `${v / 1000}K` : v)}
            />
            <Tooltip
              contentStyle={{
                background: tokens.bgCardSoft,
                border: `1px solid ${tokens.border}`,
                borderRadius: 10,
                color: tokens.textPrimary,
              }}
              formatter={(v, n, p) => [`${v} units`, p.payload.product]}
            />
            <Line
              type="monotone"
              dataKey="units"
              stroke={tokens.primary}
              strokeWidth={3}
              dot={<QuarterlyDot />}
              activeDot={{ r: 6 }}
              name="Units sold"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* 6. Revenue By Year Chart                                          */
/* ------------------------------------------------------------------ */

function RevenueByYearCard({ selectedCity, style }) {
  const data = revenueByYearData[selectedCity];

  return (
    <Card style={{ flex: 1, minHeight: 0, ...style }}>
      <CardTitle sub="Annual branch revenue (Million ₺)">Revenue By Year</CardTitle>
      <div style={{ width: "100%", flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 12, right: 16, left: -10, bottom: 0 }}>
            <CartesianGrid stroke={tokens.track} strokeDasharray="3 4" vertical={false} />
            <XAxis
              dataKey="year"
              stroke={tokens.textSecondary}
              tick={{ fill: tokens.textSecondary, fontSize: 12 }}
              axisLine={{ stroke: tokens.border }}
              tickLine={false}
            />
            <YAxis
              stroke={tokens.textSecondary}
              tick={{ fill: tokens.textSecondary, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}M`}
            />
            <Tooltip
              contentStyle={{
                background: tokens.bgCardSoft,
                border: `1px solid ${tokens.border}`,
                borderRadius: 10,
                color: tokens.textPrimary,
              }}
              formatter={(v) => [`${v}M ₺`, "Revenue"]}
              labelFormatter={(label) => `Year: ${label}`}
            />
            <Bar dataKey="revenue" fill={tokens.primary} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export default function CityDashboardPage() {
  const [selectedCity, setSelectedCity] = useState("Istanbul");
  const [refreshKey, setRefreshKey] = useState(0);

  const totals = totalsFor(selectedCity);
  const totalSales = cityData[selectedCity].channels.onlineValue + cityData[selectedCity].channels.retailValue;

  return (
    <div
      style={{
        background: tokens.bgPage,
        height: "100vh",
        padding: 12,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&display=swap');

        * { box-sizing: border-box; }
        table { font-family: inherit; }

        .dashboard-layout {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 12px;
          min-height: 0;
        }

        @media (max-width:900px){
          .dashboard-layout {
            overflow-y: auto;
          }
          .top-row, .bottom-row {
            flex-direction: column;
          }
          .dashboard-layout > * {
            flex: none !important;
            height: auto !important;
          }
          .dashboard-layout > div > div {
             min-height: 280px;
          }
        }
      `}</style>

      <div className="dashboard-layout">
        {/* ---------- TOP AREA (Flex: 2.2 -> Dikeyde sağ kolonu rahatlatır) ---------- */}
        <div
          className="top-row"
          style={{
            display: "flex",
            gap: 12,
            flex: 2.2, 
            minHeight: 0,
          }}
        >
          {/* LEFT COLUMN (Flex: 1.4 -> Harita alanı) */}
          <div
            style={{
              flex: 1.4,
              display: "flex",
              flexDirection: "column",
              gap: 12,
              minHeight: 0,
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <KpiSummaryCard
                title="Total Stock"
                value={totals.stock.toLocaleString()}
                icon={Warehouse}
                accent={tokens.primary}
                accentBg="rgba(51, 85, 244, 0.12)"
              />

              <KpiSummaryCard
                title="Total Sales"
                value={formatMoney(totalSales)}
                icon={BarChart3}
                accent={tokens.accentGreen}
                accentBg="rgba(38, 160, 91, 0.12)"
              />
            </div>

            <div style={{ flex: 1, minHeight: 0 }}>
              <TurkeyMapCard
                selectedCity={selectedCity}
                onSelect={setSelectedCity}
                style={{ height: "100%" }}
              />
            </div>
          </div>

          {/* RIGHT COLUMN (Flex: 1 -> Sağ taraf, artık ezilmeyecek) */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 12,
              minHeight: 0,
            }}
          >
            <div style={{ flex: 1, minHeight: 0 }}>
              <BestSellersCard
                key={refreshKey}
                selectedCity={selectedCity}
                onRefresh={() => setRefreshKey((k) => k + 1)}
                style={{ height: "100%" }}
              />
            </div>

            <div style={{ flex: 1.2, minHeight: 0 }}>
              <QuarterlySalesCard
                selectedCity={selectedCity}
                style={{ height: "100%" }}
              />
            </div>
          </div>
        </div>

        {/* ---------- BOTTOM ROW (Flex: 1) ---------- */}
        <div
          className="bottom-row"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.5fr",
            gap: 12,
            flex: 1,
            minHeight: 0,
          }}
        >
          <SalesChannelCard
            selectedCity={selectedCity}
            style={{ height: "100%" }}
          />

          <RevenueByYearCard
            selectedCity={selectedCity}
            style={{ height: "100%" }}
          />
        </div>
      </div>
    </div>
  );
}
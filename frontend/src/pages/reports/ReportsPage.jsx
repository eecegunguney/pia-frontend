import { useNavigate } from "react-router-dom";
import { BarChart3, MapPin, Users, MessageSquare, ArrowRight } from "lucide-react";

const tokens = {
  bgPage: "#F8FAFC",
  bgCard: "#FFFFFF",
  border: "#E5E7EB",
  textPrimary: "#111827",
  textMuted: "#6B7280",
  primary: "#2563EB",
  primarySoft: "#EFF6FF",
};

export default function ReportsPage() {
  const navigate = useNavigate();

  const reportsList = [
    {
      title: "City-Based Analysis",
      description: "Interactive visual metrics on customer distribution, inventory values, and seasonal selling trends across Turkey's major cities.",
      path: "/analyses/city",
      icon: MapPin,
      color: "#3B82F6",
      bgColor: "rgba(59, 130, 246, 0.1)",
    },
    {
      title: "Customer Type Analysis",
      description: "Detailed charts classifying consumer purchasing behavior, order volumes, and customer segments.",
      path: "/analyses/customer-type",
      icon: Users,
      color: "#10B981",
      bgColor: "rgba(16, 185, 129, 0.1)",
    },
    {
      title: "Customer Feedback Metrics",
      description: "Customer satisfaction scores, reviews, and sentiment logs for quality control.",
      path: "/analyses/feedback",
      icon: MessageSquare,
      color: "#F59E0B",
      bgColor: "rgba(245, 158, 11, 0.1)",
    },
  ];

  return (
    <div
      style={{
        background: tokens.bgPage,
        minHeight: "100vh",
        padding: 28,
        fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <style>{`
        .report-card {
          transition: transform 0.22s ease, box-shadow 0.22s ease;
        }
        .report-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px -10px rgba(0, 0, 0, 0.08) !important;
        }
        .action-arrow {
          transition: transform 0.2s ease;
        }
        .report-card:hover .action-arrow {
          transform: translateX(4px);
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: tokens.textPrimary, letterSpacing: "-0.02em" }}>
          Reports & Analyses
        </h1>
        <p style={{ margin: "4px 0 0 0", fontSize: 14, color: tokens.textMuted, fontWeight: 500 }}>
          Access real-time business metrics, regional analyses, and client feedback insights.
        </p>
      </div>

      {/* Reports Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 24,
        }}
      >
        {reportsList.map((rep) => {
          const Icon = rep.icon;
          return (
            <div
              key={rep.title}
              className="report-card"
              onClick={() => navigate(rep.path)}
              style={{
                background: tokens.bgCard,
                borderRadius: 16,
                border: `1px solid ${tokens.border}`,
                padding: 24,
                cursor: "pointer",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: 220,
                boxShadow: "0 1px 3px rgba(0,0,0,0.01)",
              }}
            >
              <div>
                {/* Icon Badge */}
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    backgroundColor: rep.bgColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                  }}
                >
                  <Icon size={24} color={rep.color} />
                </div>

                <h3
                  style={{
                    margin: "0 0 8px 0",
                    fontSize: 18,
                    fontWeight: 700,
                    color: tokens.textPrimary,
                  }}
                >
                  {rep.title}
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13.5,
                    color: tokens.textMuted,
                    lineHeight: 1.5,
                    fontWeight: 500,
                  }}
                >
                  {rep.description}
                </p>
              </div>

              {/* Action link */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  color: rep.color,
                  fontSize: 14,
                  fontWeight: 700,
                  marginTop: 12,
                }}
              >
                <span>View Report</span>
                <ArrowRight size={16} className="action-arrow" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

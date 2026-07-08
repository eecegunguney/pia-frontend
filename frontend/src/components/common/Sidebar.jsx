import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  Mail,
  BarChart3,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Users,
  Boxes,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { getStocks } from "../../services/stockService";
import "./Sidebar.css";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkStockLevels = async () => {
      try {
        const stocksData = await getStocks();
        const hasLowStock = stocksData.some(
          (s) => (s.current_stock || 0) <= (s.minimum_stock_level || 0) * 1.10
        );
        setShowWarning(hasLowStock);
      } catch (error) {
        console.error(error);
      }
    };
    checkStockLevels();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const overviewItems = [
    { type: "route", to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { type: "route", to: "/customer", label: "Customers", icon: Users },
    { type: "route", to: "/products", label: "Products", icon: ShoppingBag },
    { type: "route", to: "/stocks", label: "Stores", icon: Boxes },
    { type: "route", to: "/reports", label: "Reports", icon: BarChart3 },

  ];

  return (
    <aside className={`sidebar-container ${isCollapsed ? "collapsed" : ""}`}>
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="brand-logo-section">
          {!isCollapsed && (
            <div className="brand-text">
              <div className="brand-title">PiA</div>
            </div>
          )}
        </div>
        <button className="collapse-toggle-btn" onClick={handleToggleCollapse} title={isCollapsed ? "Expand" : "Collapse"}>
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Menu Area */}
      <div className="sidebar-menu-wrapper">
        {/* OVERVIEW SECTION */}
        <div className="menu-group">
          {!isCollapsed && <div className="group-label">OVERVIEW</div>}
          <div className="group-items">
            {overviewItems.map((item, idx) => {
              const isStoresWarning = item.label === "Stores" && showWarning;

              if (item.label === "Reports") {
                const isReportsActive =
                  location.pathname.startsWith("/analyses") ||
                  location.pathname === "/reports";

                return (
                  <div
                    key={item.to}
                    className="reports-dropdown-container"
                    onMouseEnter={() => setReportsOpen(true)}
                    onMouseLeave={() => setReportsOpen(false)}
                    style={{ position: "relative" }}
                  >
                    <div
                      className={`menu-item ${isReportsActive ? "active" : ""}`}
                      onClick={() => setReportsOpen(!reportsOpen)}
                      style={{ cursor: "pointer" }}
                      title={isCollapsed ? "Reports" : ""}
                    >
                      {!isCollapsed && <ChevronRight size={14} className="arrow-bullet" />}
                      <div className="icon-badge-container">
                        <item.icon size={20} className="menu-icon" />
                      </div>
                      {!isCollapsed && <span className="menu-label">{item.label}</span>}
                      {!isCollapsed && (
                        <ChevronDown
                          size={14}
                          style={{
                            marginLeft: "auto",
                            transform: reportsOpen ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.2s"
                          }}
                        />
                      )}
                    </div>

                    {reportsOpen && (
                      <div className={`submenu-items ${isCollapsed ? "collapsed-submenu" : ""}`}>
                        <NavLink to="/analyses/city" className="submenu-item">
                          {!isCollapsed && <ChevronRight size={12} />}
                          <span>City</span>
                        </NavLink>
                        <NavLink to="/analyses/customer-type" className="submenu-item">
                          {!isCollapsed && <ChevronRight size={12} />}
                          <span>Customer</span>
                        </NavLink>
                        <NavLink to="/analyses/feedback" className="submenu-item">
                          {!isCollapsed && <ChevronRight size={12} />}
                          <span>Feedback</span>
                        </NavLink>
                      </div>
                    )}
                  </div>
                );
              }

              if (item.type === "route") {
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}
                    title={isCollapsed ? item.label : ""}
                  >
                    {!isCollapsed && <ChevronRight size={14} className="arrow-bullet" />}
                    <div className="icon-badge-container">
                      <item.icon size={20} className="menu-icon" />
                      {isStoresWarning && isCollapsed && (
                        <span className="collapsed-warning-badge">!</span>
                      )}
                    </div>
                    {!isCollapsed && <span className="menu-label">{item.label}</span>}
                    {isStoresWarning && !isCollapsed && (
                      <span className="menu-warning-badge">!</span>
                    )}
                  </NavLink>
                );
              } else {
                return (
                  <div key={idx} className="menu-item disabled-link" title={isCollapsed ? item.label : ""}>
                    {!isCollapsed && <ChevronRight size={14} className="arrow-bullet" />}
                    <div className="icon-badge-container">
                      <item.icon size={20} className="menu-icon" />
                      {item.badge && isCollapsed && <span className="collapsed-badge">{item.badge}</span>}
                    </div>
                    {!isCollapsed && <span className="menu-label">{item.label}</span>}
                    {item.badge && !isCollapsed && <span className="menu-badge">{item.badge}</span>}
                  </div>
                );
              }
            })}
          </div>
        </div>

        {/* ACCOUNT SECTION */}
        <div className="menu-group account-group">
          {!isCollapsed && <div className="group-label">ACCOUNT</div>}
          <div className="group-items">
            <div className="menu-item" onClick={handleLogout} style={{ cursor: "pointer" }} title={isCollapsed ? "Log out" : ""}>
              <LogOut size={20} className="menu-icon" />
              {!isCollapsed && <span className="menu-label">Log out</span>}
            </div>
          </div>
        </div>
      </div>

      {/* User Footer Profile */}
      <div className="sidebar-footer">
        <div className="user-profile-card">
          {!isCollapsed && (
            <div className="user-info">
              <div className="user-greeting">
                Have a Nice Day,
              </div>
              <div className="user-name">
                {user ? `${user.first_name} ${user.last_name}` : "John Wilson"}
              </div>
              <div className="user-email">
                {user?.email || "Wilson@gmail.com"}
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
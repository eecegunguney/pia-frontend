import { NavLink } from "react-router-dom";
import { useState } from "react";

import "./Sidebar.css";

/**
 * Application sidebar navigation.
 *
 * @component
 * @returns {JSX.Element}
 */
export default function Sidebar() {
  const [inventoryOpen, setInventoryOpen] = useState(false);

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>CIMS</h2>
      </div>

      <nav className="sidebar-menu">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/customer"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          Customers
        </NavLink>

        <NavLink
          to="/products"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          Products
        </NavLink>

        <NavLink
            to = "/stocks"
            className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
            }
        >
          Stores
        </NavLink>

        <NavLink
          to="/reports"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          Reports
        </NavLink>
      </nav>
    </aside>
  );
}
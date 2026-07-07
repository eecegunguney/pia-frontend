import "./Header.css";
import { useNavigate } from "react-router-dom";

import Button from "../ui/Button";
import useAuth from "../../hooks/useAuth";

/**
 * Application header.
 *
 * Displays the page title and authenticated user information.
 *
 * @component
 * @returns {JSX.Element}
 */
export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header-left">
        <h2>Customer Inventory Management</h2>
      </div>

      <div className="header-right">
        <div className="user-info">
          <span className="user-name">
            {user?.first_name} {user?.last_name}
          </span>

          <span className="user-role">
            {user?.role}
          </span>
        </div>

        <Button
          variant="danger"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </header>
  );
}
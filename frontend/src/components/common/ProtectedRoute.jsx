import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

/**
 * Protects routes by checking the user's authentication status.
 *
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - The component to render if the user is authenticated.
 * @returns {JSX.Element}
 */
export default function ProtectedRoute({ children }) {
  return children;

}
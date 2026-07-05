import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 *A custom hook that provides easy access to AuthContext.
 * @returns {Object} Authentication information and functions.
 */
export default function useAuth() {
  return useContext(AuthContext);
}
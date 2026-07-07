import { createContext, useState } from "react";

/**
 * @context AuthContext
 * @description Provides authentication state and functions to manage user login and logout.
 */
export const AuthContext = createContext();

/**
 * @component AuthProvider
 * @description Manages authentication state and provides login/logout functions.
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    return savedUser ? JSON.parse(savedUser) : null;
  });

  /**
   * Logs in the user and stores the session.
   *
   * @param {Object} userData - Authenticated user information.
   * @returns {void}
   */
  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);
  };

  /**
   * Logs out the current user and clears the session.
   *
   * TODO:
   * Remove JWT token when backend authentication is implemented.
   *
   * @returns {void}
   */
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
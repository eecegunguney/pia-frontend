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
    const savedUserLocal = localStorage.getItem("user");
    const savedUserSession = sessionStorage.getItem("user");
    const savedUser = savedUserLocal || savedUserSession;

    return savedUser ? JSON.parse(savedUser) : null;
  });

  /**
   * Logs in the user and stores the session.
   *
   * @param {Object} userData - Authenticated user information.
   * @param {boolean} remember - Persist session across browser restarts.
   * @returns {void}
   */
  const login = (userData, remember = false) => {
    if (remember) {
      localStorage.setItem("user", JSON.stringify(userData));
      sessionStorage.removeItem("user");
    } else {
      sessionStorage.setItem("user", JSON.stringify(userData));
      localStorage.removeItem("user");
    }

    setUser(userData);
  };

  /**
   * Logs out the current user and clears the session.
   *
   * @returns {void}
   */
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");

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
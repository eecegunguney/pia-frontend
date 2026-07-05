import { createContext, useState } from "react";

/**
 * @context AuthContext
 * @description Provides authentication state and functions to manage user login and logout.
 */
export const AuthContext = createContext();

/**
 * @component AuthProvider
 * @description A context provider that manages authentication state and provides login and logout functions to its children.
 * @param {Object} props - The properties passed to the AuthProvider component.
 * @param {React.ReactNode} props.children - The child components that will have access to the authentication context. 
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  /**
   * The user logs in and updates their status.
   * @param {Object} userData - User data.
   * @returns {void}
   */
  const login = (userData) => {
    setUser(userData);
  };

  /**
   * The user logs out and clears their session.
   * * TODO: Implement logic to clear token and user data from localStorage.
   * @returns {void}
   */

  const logout = () => {
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
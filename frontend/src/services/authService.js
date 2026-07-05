import api from "./api";

/**
 * Authenticates a user by validating the provided credentials.
 *
 * @async
 * @function login
 * @param {string} username - The username entered by the user.
 * @param {string} password - The password entered by the user.
 * @returns {Promise<Object>} A promise that resolves with the authenticated user's information.
 * @throws {Error} Throws an error if the username or password is invalid.
 * TODO: Implement proper error handling and token management for secure authentication.
 * TODO: Implement logic to handle token storage and retrieval for maintaining user sessions.
 */
export const login = async (username, password) => {
  const response = await api.get("/users", {
    params: {
      username,
      password,
    },
  });

  if (response.data.length === 0) {
    throw new Error("Invalid username or password.");
  }

  return response.data[0];
};
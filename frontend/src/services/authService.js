import api from "./api";
import API_ENDPOINTS from "../config/apiEndpoints";

export const login = async (username, password) => {
  const response = await api.post(API_ENDPOINTS.AUTH_LOGIN, {
    username,
    password,
  });

  const data = response.data;

  // Store JWT token if returned by backend
  if (data.token) {
    localStorage.setItem("token", data.token);
  }

  // Return user details
  const user = data.user || data;
  return user;
};
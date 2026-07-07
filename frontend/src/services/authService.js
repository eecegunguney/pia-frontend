import api from "./api";

export const login = async (username, password) => {
  const response = await api.get("/APP_USER");

  const user = response.data.find(
    (user) =>
      user.username === username &&
      user.password === password
  );

  if (!user) {
    throw new Error("Invalid username or password.");
  }

  return user;
};
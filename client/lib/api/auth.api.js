import api from "../api";

export const getCurrentUser = async () => {
  const response = await api.get("/api/auth/me");

   return response.data.data.user;
};
export const logoutUser = async () => {
  const response = await api.post(
    "/api/auth/logout",
    {},
    {
      withCredentials: true,
    }
  );

  return response.data;
};
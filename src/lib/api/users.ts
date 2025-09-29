import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getUserById = async (userId: string) => {
  try {
    const url = `${API_URL}/api/users/${userId}`;
    const response = await axios.get(url, {
      headers: {
        Origin:
          process.env.NODE_ENV === "production"
            ? "https://spotlight-project.vercel.app"
            : "http://localhost:3000",
        "Content-Type": "application/json",
      },
    });

    return response.data.data.user;
  } catch (err) {
    const errorMessage =
      err instanceof Error
        ? err.message
        : "Erreur lors du chargement de l'utilisateur";
    return errorMessage;
  }
};

import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const origin =
  process.env.NODE_ENV === "production"
    ? "https://spotlight-project.vercel.app"
    : "http://localhost:3000";

export const getUserById = async (userId: string) => {
  try {
    const url = `${API_URL}/api/users/${userId}`;
    const response = await axios.get(url, {
      headers: {
        Origin: origin,
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

export const getCurrentUser = async (cookieHeader?: string) => {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Origin: origin,
    };
    if (cookieHeader) {
      headers.Cookie = cookieHeader;
    }
    const response = await fetch(`${API_URL}/api/auth/me`, {
      headers,
      credentials: cookieHeader ? undefined : "include",
      signal: AbortSignal.timeout(3000),
    });

    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data.data?.user || null;
  } catch (err) {
    const errorMessage =
      err instanceof Error
        ? err.message
        : "Erreur lors du chargement de l'utilisateur";
    return errorMessage;
  }
};

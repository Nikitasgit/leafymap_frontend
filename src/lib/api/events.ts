import axios from "axios";

const origin =
  process.env.NODE_ENV === "production"
    ? "https://spotlight-project.vercel.app"
    : "http://localhost:3000";

export const getEventById = async (eventId: string) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/events/${eventId}`;
    const response = await axios.get(url, {
      headers: {
        Origin: origin,
        "Content-Type": "application/json",
      },
    });
    if (response.data && response.data.data) {
      return response.data.data;
    } else {
      return null;
    }
  } catch (err) {
    const errorMessage =
      err instanceof Error
        ? err.message
        : "Erreur lors du chargement de l'événement";
    return errorMessage;
  }
};

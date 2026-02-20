import axios from "axios";
import { APP_URL } from "@/utils/constants";

export const getEventById = async (eventId: string) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/events/${eventId}`;
    const response = await axios.get(url, {
      headers: {
        Origin: APP_URL,
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

import axios from "axios";

const origin =
  process.env.NODE_ENV === "production"
    ? "https://spotlight-project.vercel.app"
    : "http://localhost:3001";

export const getPlaceById = async (
  placeId: string,
  enrichSchedule: boolean = false
) => {
  try {
    const url = `${
      process.env.NEXT_PUBLIC_API_URL
    }/api/places/${placeId}?enrichSchedule=${enrichSchedule.toString()}`;
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
      err instanceof Error ? err.message : "Erreur lors du chargement du lieu";
    return errorMessage;
  }
};

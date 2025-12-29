import { capitalizeFirstLetter } from "@/utils/functions";
import { Metadata } from "next";
import { getUserById } from "./api/users";
import { getEventById } from "./api/events";

export async function generateUserMetadata(userId: string): Promise<Metadata> {
  try {
    const userData = await getUserById(userId);
    if (typeof userData === "string" || !userData) {
      return {
        title: "Utilisateur | SpotLight",
        description: "Découvrez le profil de cet utilisateur sur SpotLight",
        openGraph: {
          title: "Utilisateur | SpotLight",
          description: "Découvrez le profil de cet utilisateur sur SpotLight",
          siteName: "SpotLight",
        },
        twitter: {
          card: "summary",
          title: "Utilisateur | SpotLight",
          description: "Découvrez le profil de cet utilisateur sur SpotLight",
        },
      };
    }

    const username = capitalizeFirstLetter(userData.username) || "Utilisateur";

    return {
      title: `${capitalizeFirstLetter(username)} | SpotLight`,
      description: `Découvrez le profil de ${username} sur SpotLight. ${userData.description}`,
      openGraph: {
        title: `${capitalizeFirstLetter(username)} | SpotLight`,
        description: `Découvrez le profil de ${username} sur SpotLight. ${userData.description}`,
        siteName: "SpotLight",
        type: "profile",
      },
      twitter: {
        card: "summary",
        title: `${capitalizeFirstLetter(username)} | SpotLight`,
        description: `Découvrez le profil de ${username} sur SpotLight. ${userData.description}`,
      },
    };
  } catch {
    return {
      title: "Utilisateur | SpotLight",
      description: "Découvrez le profil de cet utilisateur sur SpotLight",
      openGraph: {
        title: "Utilisateur | SpotLight",
        description: "Découvrez le profil de cet utilisateur sur SpotLight",
        siteName: "SpotLight",
      },
      twitter: {
        card: "summary",
        title: "Utilisateur | SpotLight",
        description: "Découvrez le profil de cet utilisateur sur SpotLight",
      },
    };
  }
}

export async function generateEventMetadata(
  eventId: string
): Promise<Metadata> {
  try {
    const eventData = await getEventById(eventId);
    if (typeof eventData === "string" || !eventData) {
      return {
        title: "Événement | SpotLight",
        description: "Découvrez cet événement sur SpotLight",
        openGraph: {
          title: "Événement | SpotLight",
          description: "Découvrez cet événement sur SpotLight",
          siteName: "SpotLight",
        },
        twitter: {
          card: "summary",
          title: "Événement | SpotLight",
          description: "Découvrez cet événement sur SpotLight",
        },
      };
    }

    const eventName = capitalizeFirstLetter(eventData.name) || "Événement";
    const eventDescription =
      capitalizeFirstLetter(eventData.description) ||
      "Découvrez cet événement unique sur SpotLight";
    const placeName = eventData.place?.name
      ? ` à ${capitalizeFirstLetter(eventData.place.name)}`
      : "";

    return {
      title: `${eventName} | SpotLight`,
      description: `Découvrez cet événement sur SpotLight${placeName}. ${eventDescription}`,
      openGraph: {
        title: `${eventName} | SpotLight`,
        description: `Découvrez cet événement sur SpotLight${placeName}. ${eventDescription}`,
        siteName: "SpotLight",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `${eventName} | SpotLight`,
        description: `Découvrez cet événement sur SpotLight${placeName}. ${eventDescription}`,
      },
    };
  } catch {
    return {
      title: "Événement | SpotLight",
      description: "Découvrez cet événement sur SpotLight",
      openGraph: {
        title: "Événement | SpotLight",
        description: "Découvrez cet événement sur SpotLight",
        siteName: "SpotLight",
      },
      twitter: {
        card: "summary",
        title: "Événement | SpotLight",
        description: "Découvrez cet événement sur SpotLight",
      },
    };
  }
}

import { capitalizeFirstLetter } from "@/utils/functions";
import { APP_NAME } from "@/utils/constants";
import { Metadata } from "next";
import { getUserById } from "./api/users";
import { getEventById } from "./api/events";

export async function generateUserMetadata(userId: string): Promise<Metadata> {
  try {
    const userData = await getUserById(userId);
    if (typeof userData === "string" || !userData) {
      return {
        title: `Utilisateur | ${APP_NAME}`,
        description: `Découvrez le profil de cet utilisateur sur ${APP_NAME}`,
        openGraph: {
          title: `Utilisateur | ${APP_NAME}`,
          description: `Découvrez le profil de cet utilisateur sur ${APP_NAME}`,
          siteName: APP_NAME,
        },
        twitter: {
          card: "summary",
          title: `Utilisateur | ${APP_NAME}`,
          description: `Découvrez le profil de cet utilisateur sur ${APP_NAME}`,
        },
      };
    }

    const username = capitalizeFirstLetter(userData.username) || "Utilisateur";

    return {
      title: `${capitalizeFirstLetter(username)} | ${APP_NAME}`,
      description: `Découvrez le profil de ${username} sur ${APP_NAME}. ${userData.description}`,
      openGraph: {
        title: `${capitalizeFirstLetter(username)} | ${APP_NAME}`,
        description: `Découvrez le profil de ${username} sur ${APP_NAME}. ${userData.description}`,
        siteName: APP_NAME,
        type: "profile",
      },
      twitter: {
        card: "summary",
        title: `${capitalizeFirstLetter(username)} | ${APP_NAME}`,
        description: `Découvrez le profil de ${username} sur ${APP_NAME}. ${userData.description}`,
      },
    };
  } catch {
    return {
      title: `Utilisateur | ${APP_NAME}`,
      description: `Découvrez le profil de cet utilisateur sur ${APP_NAME}`,
      openGraph: {
        title: `Utilisateur | ${APP_NAME}`,
        description: `Découvrez le profil de cet utilisateur sur ${APP_NAME}`,
        siteName: APP_NAME,
      },
      twitter: {
        card: "summary",
        title: `Utilisateur | ${APP_NAME}`,
        description: `Découvrez le profil de cet utilisateur sur ${APP_NAME}`,
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
        title: `Événement | ${APP_NAME}`,
        description: `Découvrez cet événement sur ${APP_NAME}`,
        openGraph: {
          title: `Événement | ${APP_NAME}`,
          description: `Découvrez cet événement sur ${APP_NAME}`,
          siteName: APP_NAME,
        },
        twitter: {
          card: "summary",
          title: `Événement | ${APP_NAME}`,
          description: `Découvrez cet événement sur ${APP_NAME}`,
        },
      };
    }

    const eventName = capitalizeFirstLetter(eventData.name) || "Événement";
    const eventDescription =
      capitalizeFirstLetter(eventData.description) ||
      `Découvrez cet événement unique sur ${APP_NAME}`;
    const placeName = eventData.place?.name
      ? ` à ${capitalizeFirstLetter(eventData.place.name)}`
      : "";

    return {
      title: `${eventName} | ${APP_NAME}`,
      description: `Découvrez cet événement sur ${APP_NAME}${placeName}. ${eventDescription}`,
      openGraph: {
        title: `${eventName} | ${APP_NAME}`,
        description: `Découvrez cet événement sur ${APP_NAME}${placeName}. ${eventDescription}`,
        siteName: APP_NAME,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `${eventName} | ${APP_NAME}`,
        description: `Découvrez cet événement sur ${APP_NAME}${placeName}. ${eventDescription}`,
      },
    };
  } catch {
    return {
      title: `Événement | ${APP_NAME}`,
      description: `Découvrez cet événement sur ${APP_NAME}`,
      openGraph: {
        title: `Événement | ${APP_NAME}`,
        description: `Découvrez cet événement sur ${APP_NAME}`,
        siteName: APP_NAME,
      },
      twitter: {
        card: "summary",
        title: `Événement | ${APP_NAME}`,
        description: `Découvrez cet événement sur ${APP_NAME}`,
      },
    };
  }
}

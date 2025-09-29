import { capitalizeFirstLetter } from "@/utils/functions";
import { Metadata } from "next";
import { getUserById } from "./api/users";

export async function generateUserMetadata(userId: string): Promise<Metadata> {
  try {
    console.log("userId", userId);
    const userData = await getUserById(userId);
    console.log("userData", userData);
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

    const creatorName =
      capitalizeFirstLetter(userData.creatorName) || "Utilisateur";

    return {
      title: `${capitalizeFirstLetter(creatorName)} | SpotLight`,
      description: `Découvrez le profil de ${creatorName} sur SpotLight. ${userData.description}`,
      openGraph: {
        title: `${capitalizeFirstLetter(creatorName)} | SpotLight`,
        description: `Découvrez le profil de ${creatorName} sur SpotLight. ${userData.description}`,
        siteName: "SpotLight",
        type: "profile",
      },
      twitter: {
        card: "summary",
        title: `${capitalizeFirstLetter(creatorName)} | SpotLight`,
        description: `Découvrez le profil de ${creatorName} sur SpotLight. ${userData.description}`,
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

export async function generatePlaceMetadata(
  placeId: string
): Promise<Metadata> {
  try {
    const { getPlaceById } = await import("@/lib/api/places");
    const placeData = await getPlaceById(placeId);
    if (typeof placeData === "string" || !placeData) {
      return {
        title: "Lieu | SpotLight",
        description: "Découvrez ce lieu sur SpotLight",
        openGraph: {
          title: "Lieu | SpotLight",
          description: "Découvrez ce lieu sur SpotLight",
          siteName: "SpotLight",
        },
        twitter: {
          card: "summary",
          title: "Lieu | SpotLight",
          description: "Découvrez ce lieu sur SpotLight",
        },
      };
    }

    const placeName = capitalizeFirstLetter(placeData.name) || "Lieu";
    const placeDescription =
      capitalizeFirstLetter(placeData.description) ||
      "Découvrez ce lieu unique sur SpotLight";

    return {
      title: `${placeName} | SpotLight`,
      description: `Découvrez ce lieu sur SpotLight. ${placeDescription}`,
      openGraph: {
        title: `${placeName} | SpotLight`,
        description: `Découvrez ce lieu sur SpotLight. ${placeDescription}`,
        siteName: "SpotLight",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `${placeName} | SpotLight`,
        description: `Découvrez ce lieu sur SpotLight. ${placeDescription}`,
      },
    };
  } catch {
    return {
      title: "Lieu | SpotLight",
      description: "Découvrez ce lieu sur SpotLight",
      openGraph: {
        title: "Lieu | SpotLight",
        description: "Découvrez ce lieu sur SpotLight",
        siteName: "SpotLight",
      },
      twitter: {
        card: "summary",
        title: "Lieu | SpotLight",
        description: "Découvrez ce lieu sur SpotLight",
      },
    };
  }
}

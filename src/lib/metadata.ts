import { capitalizeFirstLetter } from "@/utils/functions";
import { Metadata } from "next";

export async function generateUserMetadata(userId: string): Promise<Metadata> {
  try {
    console.log("generateUserMetadata - Starting with userId:", userId);
    const { getUserById } = await import("@/lib/api/users");
    console.log("generateUserMetadata - getUserById imported successfully");

    const userData = await getUserById(userId);
    console.log("generateUserMetadata - userData received:", userData);
    console.log("generateUserMetadata - userData type:", typeof userData);
    console.log(
      "generateUserMetadata - userData is null/undefined:",
      userData === null || userData === undefined
    );

    if (typeof userData === "string" || !userData) {
      console.log("generateUserMetadata - Using fallback metadata");
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

    console.log("generateUserMetadata - Processing userData properties");
    console.log(
      "generateUserMetadata - userData.creatorName:",
      userData.creatorName
    );
    console.log(
      "generateUserMetadata - userData.description:",
      userData.description
    );

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

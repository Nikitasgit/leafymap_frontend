import { UserProfileContainer } from "@/components/userProfile";
import { generateUserMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    userId: string;
  }>;
}) {
  const { userId } = await params;
  console.log("userId", userId);

  // Option 1: Essayer de générer les métadonnées dynamiques
  try {
    return await generateUserMetadata(userId);
  } catch (error) {
    console.error(
      "Failed to generate dynamic metadata, using static fallback:",
      error
    );

    // Option 2: Métadonnées statiques de fallback
    return {
      title: "Profil Utilisateur | SpotLight",
      description: "Découvrez le profil de cet utilisateur sur SpotLight",
      openGraph: {
        title: "Profil Utilisateur | SpotLight",
        description: "Découvrez le profil de cet utilisateur sur SpotLight",
        siteName: "SpotLight",
        type: "profile",
      },
      twitter: {
        card: "summary",
        title: "Profil Utilisateur | SpotLight",
        description: "Découvrez le profil de cet utilisateur sur SpotLight",
      },
    };
  }
}

const UserPage = () => {
  return <UserProfileContainer />;
};

export default UserPage;

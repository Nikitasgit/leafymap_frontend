import { UserType } from "@/types/user";

export const getHeaderParameters = (userType: UserType | undefined) => {
  switch (userType) {
    case "guest":
      return {
        route: "/account/create",
        title:
          "Vous êtes créateur, artisan, producteur ou responsable d'un lieu  culturel ou commercial?",
        description: "Rejoignez notre communauté de passionnés!",
        buttonTitle: "Créer mon profil",
      };

    case "organizer":
      return {
        route: "/account",
        title: "Créez de nouveaux évènements!",
        description:
          "Créez de évènements pour attiser la curiosité de vos visiteurs!",
        buttonTitle: "Créer un évènement",
      };

    case "creator":
      return {
        route: "/account",
        title:
          "Créez de évènements pour attiser la curiosité de vos visiteurs!",
        description:
          "En tant que créateur, créez de nouveaux évènements et invitez d'autres créateurs à participer!",
        buttonTitle: "Créer mon compte",
      };
    default:
      return {
        route: "/auth/register",
        title:
          "Créer vous un compte pour accèder à toutes les fonctionnalités de Spotlight!",
        description:
          "Spotlight est la plateforme de mise en relation entre créateurs, artisans, responsables de lieux et passionnés d'art et de culture.",
        buttonTitle: "Créer mon compte",
      };
  }
};

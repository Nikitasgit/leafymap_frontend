import UpdatePlaceContainer from "@/components/account/Place/UpdatePlaceContainer";
import { APP_NAME } from "@/utils/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Modifier votre lieu | ${APP_NAME}`,
  description:
    "Modifiez les informations de votre lieu, mettez à jour vos horaires, vos partenariats et améliorez votre profil pour attirer plus de monde.",
};

const UpdatePlace = () => {
  return <UpdatePlaceContainer />;
};

export default UpdatePlace;

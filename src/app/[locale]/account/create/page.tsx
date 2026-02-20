import CreateProfileStepper from "@/components/account/CreateProfileStepper";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { APP_NAME } from "@/utils/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Rejoignez ${APP_NAME} | Donnez de la visibilité à vos créations et événements`,
  description: `Rejoignez ${APP_NAME} et créez votre profil en quelques étapes. Artisans, artistes et organisateurs de lieux culturels : valorisez votre activité et touchez de nouveaux publics.`,
};

const CreateProfilePage = () => {
  return (
    <ProtectedRoute allowedUserTypes={["guest"]} redirectTo="/account">
      <CreateProfileStepper />
    </ProtectedRoute>
  );
};
export default CreateProfilePage;

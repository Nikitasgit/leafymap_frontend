import CreateProfileStepper from "@/components/account/CreateProfileStepper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Rejoignez SpotLight | Donnez de la visibilité à vos créations et événements",
  description:
    "Rejoignez SpotLight et créez votre profil en quelques étapes. Artisans, artistes et organisateurs de lieux culturels : valorisez votre activité et touchez de nouveaux publics.",
};

const CreateProfilePage = () => {
  return <CreateProfileStepper />;
};
export default CreateProfilePage;

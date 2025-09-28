import { UpdateCreator } from "@/components/account/Creator/UpdateCreator";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Modifier votre profil créateur | SpotLight",
  description:
    "Mettez à jour votre profil créateur sur SpotLight : description, catégories, photos et informations de contact. Valorisez votre activité et attirez de nouveaux partenaires et visiteurs.",
};

const ModifyCreator = () => {
  return <UpdateCreator />;
};

export default ModifyCreator;

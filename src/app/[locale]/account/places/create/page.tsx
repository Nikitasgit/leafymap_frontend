import CreatePlaceForm from "@/components/account/Place/CreatePlaceContainer";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Créer un lieu | SpotLight",
  description:
    "Ajoutez votre lieu culturel, commercial ou d'exposition sur SpotLight. Donnez-lui de la visibilité, organisez des événements et collaborez avec des créateurs et artisans locaux.",
};

const CreatePlacePage = () => {
  return <CreatePlaceForm />;
};

export default CreatePlacePage;

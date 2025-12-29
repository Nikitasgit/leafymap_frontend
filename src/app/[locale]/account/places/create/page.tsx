import CreatePlaceForm from "@/components/account/Place/CreatePlaceContainer";
import ProtectedRoute from "@/components/common/ProtectedRoute";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Créer un lieu | SpotLight",
  description:
    "Ajoutez votre lieu culturel, commercial ou d'exposition sur SpotLight. Donnez-lui de la visibilité, organisez des événements et collaborez avec des créateurs et artisans locaux.",
};

const CreatePlacePage = () => {
  return (
    <ProtectedRoute allowedUserTypes={["creator"]} redirectTo="/account">
      <CreatePlaceForm />
    </ProtectedRoute>
  );
};

export default CreatePlacePage;

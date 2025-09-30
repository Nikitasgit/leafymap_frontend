import { UpdateCreator } from "@/components/account/Creator/UpdateCreator";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Modifier votre profil créateur | SpotLight",
  description:
    "Mettez à jour vos informations de profil créateur, vos catégories d'activité et les détails de votre lieu sur InnovaStay.",
};

const ModifyCreator = () => {
  return (
    <ProtectedRoute allowedUserTypes={["creator"]} redirectTo="/account">
      <UpdateCreator />
    </ProtectedRoute>
  );
};

export default ModifyCreator;

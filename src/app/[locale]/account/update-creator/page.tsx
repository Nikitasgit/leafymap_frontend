import { UpdateCreator } from "@/components/account/Creator/UpdateCreator";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { APP_NAME } from "@/utils/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Modifier votre profil créateur | ${APP_NAME}`,
  description: `Mettez à jour vos informations de profil créateur, vos catégories d'activité et les détails de votre lieu sur ${APP_NAME}.`,
};

const ModifyCreator = () => {
  return (
    <ProtectedRoute allowedUserTypes={["creator"]} redirectTo="/account">
      <UpdateCreator />
    </ProtectedRoute>
  );
};

export default ModifyCreator;

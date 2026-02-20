import AccountContainer from "@/components/account/AccountContainer";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { APP_NAME } from "@/utils/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Mon compte | ${APP_NAME}`,
  description: `Gérez votre profil ${APP_NAME}, vos lieux, événements et paramètres. Personnalisez votre expérience et restez connecté avec la communauté des créateurs et organisateurs.`,
};

export default function AccountPage() {
  return (
    <ProtectedRoute
      allowedUserTypes={["guest", "creator", "organizer"]}
      redirectTo="/"
    >
      <AccountContainer />
    </ProtectedRoute>
  );
}

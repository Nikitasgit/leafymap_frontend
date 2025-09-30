import AccountContainer from "@/components/account/AccountContainer";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mon compte | SpotLight",
  description:
    "Gérez votre profil SpotLight, vos lieux, événements et paramètres. Personnalisez votre expérience et restez connecté avec la communauté des créateurs et organisateurs.",
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

import AccountSettingsContainer from "@/components/account/AccountSettings/AccountSettingsContainer";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { APP_NAME } from "@/utils/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Paramètres du compte | ${APP_NAME}`,
  description: `Modifiez vos paramètres de compte, préférences de notification, informations personnelles et préférences de confidentialité sur ${APP_NAME}.`,
};

const AccountSettingsPage = () => {
  return (
    <ProtectedRoute
      allowedUserTypes={["guest", "creator", "organizer"]}
      redirectTo="/"
    >
      <AccountSettingsContainer />
    </ProtectedRoute>
  );
};

export default AccountSettingsPage;

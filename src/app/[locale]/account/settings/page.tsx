import AccountSettingsContainer from "@/components/account/AccountSettings/AccountSettingsContainer";
import ProtectedRoute from "@/components/common/ProtectedRoute";

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

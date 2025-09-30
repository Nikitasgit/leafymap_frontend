import AccountContainer from "@/components/account/AccountContainer";
import ProtectedRoute from "@/components/common/ProtectedRoute";

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

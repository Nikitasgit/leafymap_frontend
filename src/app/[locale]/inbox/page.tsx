import ProtectedRoute from "@/components/common/ProtectedRoute";
import InboxContainer from "@/components/messages/InboxContainer";
import { APP_NAME } from "@/utils/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Boîte de réception | ${APP_NAME}`,
  description: `Communiquez avec les organisateurs et créateurs sur ${APP_NAME}. Échangez pour organiser des événements, établir des partenariats et collaborer.`,
};

export default function InboxPage() {
  return (
    <ProtectedRoute
      allowedUserTypes={["guest", "creator", "organizer"]}
      redirectTo="/"
    >
      <InboxContainer />
    </ProtectedRoute>
  );
}

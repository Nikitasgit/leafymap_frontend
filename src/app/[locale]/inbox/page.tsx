import ProtectedRoute from "@/components/common/ProtectedRoute";
import InboxContainer from "@/components/messages/InboxContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Boîte de réception | SpotLight",
  description:
    "Communiquez avec les organisateurs et créateurs sur SpotLight. Échangez pour organiser des événements, établir des partenariats et collaborer.",
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

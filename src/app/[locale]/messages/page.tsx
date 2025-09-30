import ProtectedRoute from "@/components/common/ProtectedRoute";
import MessagesContainer from "@/components/messages/MessagesContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Messages | SpotLight",
  description:
    "Communiquez avec les organisateurs et créateurs sur SpotLight. Échangez pour organiser des événements, établir des partenariats et collaborer.",
};

export default function MessagesPage() {
  return (
    <ProtectedRoute
      allowedUserTypes={["guest", "creator", "organizer"]}
      redirectTo="/"
    >
      <MessagesContainer />
    </ProtectedRoute>
  );
}

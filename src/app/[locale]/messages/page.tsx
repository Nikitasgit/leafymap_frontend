import ProtectedRoute from "@/components/common/ProtectedRoute";
import MessagesContainer from "@/components/messages/MessagesContainer";

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

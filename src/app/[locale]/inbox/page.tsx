import ProtectedRoute from "@/components/common/ProtectedRoute";
import InboxContainer from "@/components/messages/InboxContainer";
import { getPageMetadata } from "@/lib/pageMetadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return getPageMetadata("inbox", locale);
}

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

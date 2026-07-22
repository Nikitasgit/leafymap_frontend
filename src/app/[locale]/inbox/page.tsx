import { ProtectedRoute } from "@/features/auth";
import InboxContainer from "@/features/messages/components/inboxContainer";
import { getPageMetadata } from "@/app/lib/pageMetadata";

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

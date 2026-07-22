import { AccountContainer } from "@/features/account";
import { ProtectedRoute } from "@/features/auth";
import { getPageMetadata } from "@/app/lib/pageMetadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return getPageMetadata("account", locale);
}

const AccountPage = () => {
  return (
    <ProtectedRoute>
      <AccountContainer />
    </ProtectedRoute>
  );
};

export default AccountPage;

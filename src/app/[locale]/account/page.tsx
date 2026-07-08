import AccountContainer from "@/components/account/AccountContainer";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { getPageMetadata } from "@/lib/pageMetadata";

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

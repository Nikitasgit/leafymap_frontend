import AccountContainer from "@/components/account/AccountContainer";
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
  return <AccountContainer />;
};

export default AccountPage;

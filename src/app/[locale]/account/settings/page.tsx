import { AccountSettingsContainer } from "@/features/account";
import { getPageMetadata } from "@/app/lib/pageMetadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return getPageMetadata("accountSettings", locale);
}

const AccountSettings = () => {
  return <AccountSettingsContainer />;
};

export default AccountSettings;

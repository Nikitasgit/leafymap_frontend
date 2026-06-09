import AccountSettingsContainer from "@/components/account/AccountSettings/AccountSettingsContainer";
import { getPageMetadata } from "@/lib/pageMetadata";

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

import { UserProfileContainer } from "@/components/userProfile/UserProfileContainer";
import { generateUserMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    locale: string;
    userId: string;
  }>;
}) {
  const { locale, userId } = await params;
  return generateUserMetadata(userId, locale);
}

const UserPage = () => {
  return <UserProfileContainer />;
};

export default UserPage;

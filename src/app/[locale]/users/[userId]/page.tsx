import UserProfileContainer from "@/features/users/components/userProfileContainer";
import { generateUserMetadata } from "@/app/lib/entityMetadata";

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

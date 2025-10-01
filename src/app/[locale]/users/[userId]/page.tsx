import { UserProfileContainer } from "@/components/userProfile/UserProfileContainer";
import { generateUserMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    userId: string;
  }>;
}) {
  const { userId } = await params;
  return generateUserMetadata(userId);
}

const UserPage = () => {
  return <UserProfileContainer />;
};

export default UserPage;

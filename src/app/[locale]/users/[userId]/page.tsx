import { UserProfileContainer } from "@/components/userProfile";
import { generateUserMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    userId: string;
  }>;
}) {
  const { userId } = await params;
  console.log("userId", userId);

  return generateUserMetadata(userId);
}

const UserPage = () => {
  return <UserProfileContainer />;
};

export default UserPage;

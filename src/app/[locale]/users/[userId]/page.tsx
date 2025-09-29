import { UserProfileContainer } from "@/components/userProfile";
import { generateUserMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: { userId: string };
}) {
  return generateUserMetadata(params.userId);
}

const UserPage = () => {
  return <UserProfileContainer />;
};

export default UserPage;

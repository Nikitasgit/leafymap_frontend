import { UserProfileContainer } from "@/components/userProfile";
import { generateUserMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

type Props = {
  params: {
    userId: string;
    locale: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return generateUserMetadata(params.userId);
}

const UserPage = () => {
  return <UserProfileContainer />;
};

export default UserPage;

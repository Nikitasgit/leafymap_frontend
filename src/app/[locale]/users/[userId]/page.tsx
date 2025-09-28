import { UserProfileContainer } from "@/components/userProfile";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Utilisateur | SpotLight",
  description: "Utilisateur",
};

const UserPage = () => {
  return <UserProfileContainer />;
};

export default UserPage;

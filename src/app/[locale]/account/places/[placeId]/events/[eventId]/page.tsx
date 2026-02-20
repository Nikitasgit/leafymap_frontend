import EventModifyContainer from "@/components/account/Event/EventModifyContainer";
import { APP_NAME } from "@/utils/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Modifier un événement | ${APP_NAME}`,
  description: `Mettez à jour les informations de votre événement sur ${APP_NAME} : description, horaires, participants et visuels. Gardez votre programmation claire et attrayante pour vos visiteurs.`,
};
const UpdateEventPage = () => {
  return <EventModifyContainer />;
};

export default UpdateEventPage;

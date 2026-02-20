import EventCreateContainer from "@/components/account/Event/EventCreateContainer";
import { APP_NAME } from "@/utils/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Créer un événement | ${APP_NAME}`,
  description: `Organisez un événement sur ${APP_NAME} et attirez des visiteurs. Invitez des créateurs, programmez des activités et donnez de la visibilité à votre lieu culturel ou artisanal.`,
};

const CreateEventPage = () => {
  return <EventCreateContainer />;
};

export default CreateEventPage;

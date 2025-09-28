import EventCreateContainer from "@/components/account/Event/EventCreateContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Créer un événement | SpotLight",
  description:
    "Organisez un événement sur SpotLight et attirez des visiteurs. Invitez des créateurs, programmez des activités et donnez de la visibilité à votre lieu culturel ou artisanal.",
};

const CreateEventPage = () => {
  return <EventCreateContainer />;
};

export default CreateEventPage;

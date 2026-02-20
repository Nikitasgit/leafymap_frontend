import MapPageContainer from "@/components/map/MapPageContainer";
import { APP_NAME } from "@/utils/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Carte interactive - Lieux et événements artisanaux et culturels | ${APP_NAME}`,
  description: `Explorez la carte interactive de ${APP_NAME} pour découvrir des lieux, événements et créateurs près de chez vous. Filtrez par activité, localisation ou catégorie et trouvez l'inspiration.`,
};

const MapPage = () => {
  return <MapPageContainer />;
};

export default MapPage;

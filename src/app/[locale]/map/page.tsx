import MapPageContainer from "@/components/map/MapPageContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Carte interactive - Lieux et événements artisanaux et culturels | SpotLight",
  description:
    "Explorez la carte interactive de SpotLight pour découvrir des lieux, événements et créateurs près de chez vous. Filtrez par activité, localisation ou catégorie et trouvez l'inspiration.",
};

const MapPage = () => {
  return <MapPageContainer />;
};

export default MapPage;

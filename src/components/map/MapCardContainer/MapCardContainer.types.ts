import { ExtendedMapRef } from "@/types/map";

export type MapCardContainerProps = {
  selectedItem: {
    id: string;
    type: "creator" | "filters" | null;
    eventId?: string | null;
  };
  mapRef: React.RefObject<ExtendedMapRef | null>;
  /** Ferme la fiche, retire le créateur de l’URL et désélectionne le marqueur. */
  onClose: () => void;
  isFavoritesMode?: boolean;
};

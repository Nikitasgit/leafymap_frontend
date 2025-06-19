"use client";

import Map from "../../components/map/mapComponent/Map";
import "mapbox-gl/dist/mapbox-gl.css";
import { useState } from "react";
import PlaceCardMap from "@/components/map/placeCardMap/PlaceCardMap";
import styles from "./map.module.scss";

const MapPage = () => {
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);
  const handleMarkerClick = (placeId: string) => {
    setSelectedPlace(placeId);
  };

  return (
    <div className={styles.mapPage}>
      <Map
        withPlacesInView
        onMarkerClick={handleMarkerClick}
        height="100%"
        width="100%"
      />
      {selectedPlace && <PlaceCardMap placeId={selectedPlace} />}
    </div>
  );
};

export default MapPage;

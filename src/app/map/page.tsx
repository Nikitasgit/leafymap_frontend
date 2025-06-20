"use client";

import Map from "../../components/map/mapComponent/Map";
import "mapbox-gl/dist/mapbox-gl.css";
import { useState } from "react";
import PlaceCardMap from "@/components/map/placeCardMap/PlaceCardMap";
import styles from "./map.module.scss";
import FiltersBar from "@/components/map/filtersBar/FiltersBar";

const MapPage = () => {
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const handleMarkerClick = (placeId: string) => {
    setSelectedPlace(placeId);
  };

  return (
    <div className={styles.mapPage}>
      <FiltersBar loading={loading} />
      <div className={styles.mapContainer}>
        <Map
          withPlacesInView
          setLoading={setLoading}
          onMarkerClick={handleMarkerClick}
          height="100%"
          width="100%"
        />
        {selectedPlace && <PlaceCardMap placeId={selectedPlace} />}
      </div>
    </div>
  );
};

export default MapPage;

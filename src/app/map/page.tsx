"use client";

import Map from "../../components/map/mapComponent/Map";
import "mapbox-gl/dist/mapbox-gl.css";
import { useState } from "react";
import PlaceCardMap from "@/components/map/placeCardMap/PlaceCardMap";
import styles from "./map.module.scss";
import { Place } from "@/types/place";

const MapPage = () => {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const handleMarkerClick = (place: Place) => {
    setSelectedPlace(place);
  };

  return (
    <div className={styles.mapPage}>
      <Map
        withPlacesInView
        onMarkerClick={handleMarkerClick}
        height="100%"
        width="100%"
      />
      {selectedPlace && <PlaceCardMap place={selectedPlace} />}
    </div>
  );
};

export default MapPage;

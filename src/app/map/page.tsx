"use client";

import { Place } from "@/types/place";
import Map from "../../components/map/mapComponent/Map";
import "mapbox-gl/dist/mapbox-gl.css";
import { useState } from "react";
import PlaceCardMap from "@/components/map/placeCardMap/PlaceCardMap";

const MapPage = () => {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const handleMarkerClick = (place: Place) => {
    setSelectedPlace(place);
  };
  return (
    <>
      {selectedPlace && <PlaceCardMap place={selectedPlace} />}
      <Map withPlacesInView onMarkerClick={handleMarkerClick} />
    </>
  );
};

export default MapPage;

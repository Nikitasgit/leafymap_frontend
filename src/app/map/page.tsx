"use client";

import MapComponent from "../../components/map/mapComponent/Map";
import "mapbox-gl/dist/mapbox-gl.css";
import { useState, useEffect, useRef } from "react";
import PlaceCardMap from "@/components/map/placeCardMap/PlaceCardMap";
import styles from "./map.module.scss";
import FiltersBar from "@/components/map/filtersBar/FiltersBar";
import { MapFilters } from "@/types/map";
import { Collaborator } from "@/types/place/collaborators";
import UserCardMap from "@/components/map/userCardMap/UserCardMap";
import { MapCoordinates } from "@/types/common";
import { MapRef } from "react-map-gl/mapbox";

const MapPage = () => {
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<Collaborator | null>(null);
  const [loading, setLoading] = useState(false);
  const [mapLocation, setMapLocation] = useState<MapCoordinates | undefined>(
    undefined
  );
  const [filters, setFilters] = useState<MapFilters>({
    placeType: ["all"],
    placeCategory: "all",
  });
  const mapRef = useRef<MapRef>(null);

  useEffect(() => {
    setSelectedPlace(null);
  }, [filters]);

  const handleMarkerClick = (placeId: string) => {
    setSelectedPlace(placeId);
    setSelectedUser(null);
  };

  const handleUserSelect = (user: Collaborator) => {
    setSelectedUser(user);
    setSelectedPlace(null);
  };

  const handleMapLocationChange = (location: MapCoordinates) => {
    setMapLocation(location);
  };

  return (
    <main className={styles.mapPage}>
      <FiltersBar
        filters={filters}
        setFilters={setFilters}
        loading={loading}
        handleUserSelect={handleUserSelect}
      />
      <div className={styles.mapContainer}>
        <MapComponent
          ref={mapRef}
          withPlacesInView
          filters={filters}
          setLoading={setLoading}
          onMarkerClick={handleMarkerClick}
          location={mapLocation}
          height="100%"
          width="100%"
        />
        {selectedPlace && <PlaceCardMap placeId={selectedPlace} />}
        {selectedUser && (
          <UserCardMap
            user={selectedUser}
            onMapLocationChange={handleMapLocationChange}
            mapRef={mapRef}
          />
        )}
      </div>
    </main>
  );
};

export default MapPage;

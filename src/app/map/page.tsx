"use client";

import Map from "../../components/map/mapComponent/Map";
import "mapbox-gl/dist/mapbox-gl.css";
import { useState, useEffect } from "react";
import PlaceCardMap from "@/components/map/placeCardMap/PlaceCardMap";
import styles from "./map.module.scss";
import FiltersBar from "@/components/map/filtersBar/FiltersBar";
import { MapFilters } from "@/types/map";
import { Collaborator } from "@/types/place/collaborators";
import UserCardMap from "@/components/map/userCardMap/UserCardMap";

const MapPage = () => {
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<Collaborator | null>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<MapFilters>({
    placeType: ["all"],
    placeCategory: "all",
  });

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

  return (
    <main className={styles.mapPage}>
      <FiltersBar
        filters={filters}
        setFilters={setFilters}
        loading={loading}
        handleUserSelect={handleUserSelect}
      />
      <div className={styles.mapContainer}>
        <Map
          withPlacesInView
          filters={filters}
          setLoading={setLoading}
          onMarkerClick={handleMarkerClick}
          height="100%"
          width="100%"
        />
        {selectedPlace && <PlaceCardMap placeId={selectedPlace} />}
        {selectedUser && <UserCardMap user={selectedUser} />}
      </div>
    </main>
  );
};

export default MapPage;

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import AddressInput from "@/components/common/inputs/AddressInput";
import MapComponent from "@/components/common/Map/MapComponent";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Location } from "@/types/common";
import { ExtendedMapRef } from "@/types/map";
import { DEFAULT_LOCATION } from "@/utils/constants";
import { getLocationFromCoordinates } from "@/utils/map";
import styles from "./LocationPicker.module.scss";

interface LocationPickerProps {
  location: Location | null;
  onChange: (location: Location | null) => void;
  error?: string;
  markerName?: string;
}

const LocationPicker = ({
  location,
  onChange,
  error,
  markerName = "Évènement",
}: LocationPickerProps) => {
  const mapRef = useRef<ExtendedMapRef | null>(null);
  const { latitude, longitude } = useGeolocation();
  const [mapReady, setMapReady] = useState(false);

  const marker = useMemo(() => {
    const coordinates = location?.coordinates ?? [
      longitude ?? DEFAULT_LOCATION.longitude,
      latitude ?? DEFAULT_LOCATION.latitude,
    ];

    return {
      location: { coordinates },
      placeCategory: { name: "event" },
      name: markerName,
      _id: "event-location-marker",
    };
  }, [latitude, location?.coordinates, longitude, markerName]);

  const handleMapClick = async (coordinates: {
    latitude: number;
    longitude: number;
  }) => {
    const newLocation = await getLocationFromCoordinates(coordinates);
    if (newLocation) {
      onChange(newLocation);
    }
  };

  const onLocationSelect = (selectedLocation: Location | null) => {
    onChange(selectedLocation);

    if (selectedLocation?.coordinates && mapRef.current) {
      mapRef.current.flyTo({
        center: [selectedLocation.coordinates[0], selectedLocation.coordinates[1]],
        duration: 800,
        zoom: 12,
      });
    }
  };

  useEffect(() => {
    if (mapReady && marker.location.coordinates) {
      mapRef.current?.flyTo({
        center: [marker.location.coordinates[0], marker.location.coordinates[1]],
        duration: 800,
      });
    }
  }, [mapReady, marker.location.coordinates]);

  return (
    <div className={styles.locationPicker}>
      <AddressInput
        onLocationSelect={onLocationSelect}
        value={location?.label || ""}
        selectedLocation={location}
        error={!!error}
        errorMessage={error}
      />

      <div className={styles.mapSection}>
        <p className={styles.mapTitle}>
          Cliquez sur la carte pour positionner l’évènement
        </p>
        <div className={styles.mapContainer}>
          <MapComponent
            height="200px"
            onMapClick={handleMapClick}
            userMarker={marker}
            withDefaultMarker
            selectedPlaceId="event-location-marker"
            ref={mapRef}
            onMapReady={() => setMapReady(true)}
          />
        </div>
      </div>
    </div>
  );
};

export default LocationPicker;

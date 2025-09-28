import React, { useEffect, useRef, useState } from "react";
import TimeTableForm from "@/components/account/Place/DefaultScheduleForm/DefaultScheduleForm";
import AddressInput from "@/components/account/AddressInput";
import PlaceCategorySelectorInput from "@/components/account/CategorySelectorInput/PlaceCategorySelectorInput";
import PlaceTypeSelectorInput from "@/components/account/PlaceTypeSelectorInput/PlaceTypeSelectorInput";
import RadioYesOrNo from "@/components/common/inputs/RadioYesOrNo/RadioYesOrNo";
import MapComponent from "@/components/common/Map/MapComponent";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Location } from "@/types/common";
import { ExtendedMapRef } from "@/types/map";
import { buildUserMarker, getLocationFromCoordinates } from "@/utils/map";
import { defaultSchedule } from "@/utils/createProfile";
import {
  FormDataChangeHandler,
  InitialPlaceData,
} from "../../CreateProfileStepper/CreateProfileStepper.types";
import styles from "./PlaceForm.module.scss";

const PlaceForm = ({
  place,
  userType,
  creatorName,
  onChange,
  errors = {},
  initialPlaceLocation,
}: {
  place: InitialPlaceData;
  userType: "creator" | "organizer" | "guest";
  creatorName?: string;
  onChange: FormDataChangeHandler;
  errors?: Record<string, string>;
  initialPlaceLocation?: Location | null;
}) => {
  const mapRef = useRef<ExtendedMapRef | null>(null);
  const { latitude, longitude } = useGeolocation();
  const [mapReady, setMapReady] = useState(false);

  const userLocation =
    latitude && longitude ? { latitude, longitude } : undefined;

  const userMarker = buildUserMarker(place, creatorName || "", userLocation);

  const handleDisplayPlaceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      target: {
        name: "active",
        value: e.target.value === "yes" ? true : false,
      },
    });
    if (e.target.value === "no") {
      setMapReady(false);
      if (initialPlaceLocation) {
        onChange({
          target: { name: "location", value: initialPlaceLocation },
        });
      }
    }
  };

  const handleMapClick = async (coordinates: {
    latitude: number;
    longitude: number;
  }) => {
    const newLocation = await getLocationFromCoordinates(coordinates);
    if (newLocation) {
      onChange({ target: { name: "location", value: newLocation } });
    }
  };

  const onLocationSelect = (location: Location | null) => {
    if (location?.coordinates && mapRef.current) {
      mapRef.current.flyTo({
        center: [location.coordinates[0], location.coordinates[1]],
        duration: 800,
        zoom: 12,
      });
      onChange({ target: { name: "location", value: location } });
    } else {
      onChange({ target: { name: "location", value: null } });
    }
  };

  useEffect(() => {
    if (mapReady && userMarker) {
      mapRef.current?.flyTo({
        center: [
          userMarker.location.coordinates[0],
          userMarker.location.coordinates[1],
        ],
        duration: 800,
      });
    }
  }, [userMarker, mapReady]);
  return (
    <fieldset className={styles.placeForm}>
      {userType !== "organizer" && (
        <RadioYesOrNo
          label="Souhaitez-vous afficher votre lieu sur la carte pour recevoir des visiteurs?"
          name="userWithPlace"
          value={place.active ? "yes" : "no"}
          onChange={handleDisplayPlaceChange}
        />
      )}
      {place.active && (
        <div>
          <legend className={styles.title}>Lieu</legend>
          <div className={styles.placeFormContainer}>
            <AddressInput
              onLocationSelect={onLocationSelect}
              value={place.location?.label || ""}
              selectedLocation={place.location}
              error={!!errors.location}
              errorMessage={errors.location}
            />

            <div className={styles.mapSection}>
              <p className={styles.mapTitle}>
                Cliquez sur la carte pour positionner votre lieu
              </p>
              <div className={styles.mapContainer}>
                <MapComponent
                  height="200px"
                  onMapClick={handleMapClick}
                  userMarker={userMarker}
                  withDefaultMarker
                  ref={mapRef}
                  onMapReady={() => setMapReady(true)}
                />
              </div>
            </div>
            {userType === "organizer" && (
              <PlaceTypeSelectorInput
                value={place.placeType || []}
                onChange={onChange}
                error={!!errors.placeType}
              />
            )}
            <PlaceCategorySelectorInput
              value={(place.placeCategory as string) || ""}
              onChange={onChange}
              selectedTypes={place.placeType || []}
              error={!!errors.placeCategory}
            />
          </div>
          <TimeTableForm
            schedule={place.defaultSchedule || defaultSchedule}
            onChange={(updatedSchedule) =>
              onChange({
                target: { name: "defaultSchedule", value: updatedSchedule },
              })
            }
          />
        </div>
      )}
    </fieldset>
  );
};

export default PlaceForm;

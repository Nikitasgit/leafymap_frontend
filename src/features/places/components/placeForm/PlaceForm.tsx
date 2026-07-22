import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import TimeTableForm from "../defaultScheduleForm";
import AddressInput from "@/features/map/components/addressInput";
import { PlaceCategorySelectorInput } from "@/features/account";
import RadioYesOrNo from "@/shared/ui/inputs/radioYesOrNo";
import MapComponent from "@/features/map/components/mapComponent";
import { useGeolocation } from "@/features/map/hooks/useGeolocation";
import { Location } from "@/shared/types/common";
import type { ExtendedMapRef } from "@/features/map/types";
import {
  buildUserMarker,
  getLocationFromCoordinates,
} from "@/features/map/utils/map";
import { defaultSchedule } from "@/features/account";
import {
  FormDataChangeHandler,
  InitialPlaceData,
} from "@/features/account";
import styles from "./PlaceForm.module.scss";

const PlaceForm = ({
  place,
  username,
  onChange,
  errors = {},
  initialPlaceLocation,
  showRadioYesOrNo = false,
}: {
  place: InitialPlaceData;
  username?: string;
  onChange: FormDataChangeHandler;
  errors?: Record<string, string>;
  initialPlaceLocation?: Location | null;
  showRadioYesOrNo?: boolean;
}) => {
  const { t } = useTranslation("account");
  const mapRef = useRef<ExtendedMapRef | null>(null);
  const { latitude, longitude } = useGeolocation();
  const [mapReady, setMapReady] = useState(false);

  const userLocation =
    latitude && longitude ? { latitude, longitude } : undefined;

  const userMarker = buildUserMarker(place, username || "", userLocation);

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
      {showRadioYesOrNo && (
        <RadioYesOrNo
          label={t("placeForm.displayOnMapLabel")}
          name="userWithPlace"
          value={place.active ? "yes" : "no"}
          onChange={handleDisplayPlaceChange}
        />
      )}
      {place.active && (
        <div>
          <legend className={styles.title}>{t("placeForm.placeLegend")}</legend>
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
                {t("placeForm.mapInstructions")}
              </p>
              <div className={styles.mapContainer}>
                <MapComponent
                  height="200px"
                  onMapClick={handleMapClick}
                  userMarker={userMarker}
                  withDefaultMarker
                  selectedPlaceId="user-marker"
                  ref={mapRef}
                  onMapReady={() => setMapReady(true)}
                />
              </div>
            </div>
            <PlaceCategorySelectorInput
              value={(place.placeCategory as string) || ""}
              onChange={onChange}
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

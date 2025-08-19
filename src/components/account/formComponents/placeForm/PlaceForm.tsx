import TimeTableForm from "@/components/account/formComponents/timetableForm/TimeTableForm";
import AddressInput from "@/components/common/inputs/addressInput/AddressInput";
import PlaceCategorySelectorInput from "@/components/common/inputs/categorySelectorInput/PlaceCategorySelectorInput";
import PlaceTypeSelectorInput from "@/components/common/inputs/placeTypeSelectorInput/PlaceTypeSelectorInput";
import MapComponent from "@/components/map/mapComponent/Map";
import { MapCoordinates, Location } from "@/types/common";
import React, { useState } from "react";
import Text from "@/components/common/typography/Text";
import {
  FormDataChangeHandler,
  InitialPlaceData,
} from "../../createProfileStepper/CreateProfileStepper.types";
import styles from "./PlaceForm.module.scss";
import { defaultSchedule } from "@/utils/createProfile";
import RadioYesOrNo from "@/components/common/inputs/radios/radioYesOrNo/RadioYesOrNo";

const PlaceForm = ({
  place,
  userType,
  onChange,
  errors = {},
}: {
  place: InitialPlaceData;
  userType: "creator" | "organizer" | "guest";
  onChange: FormDataChangeHandler;
  errors?: Record<string, string>;
}) => {
  const [locationMarker, setLocationMarker] = useState<MapCoordinates | null>(
    place.location?.coordinates
      ? {
          latitude: place.location.coordinates[1],
          longitude: place.location.coordinates[0],
        }
      : null
  );
  const handleDisplayPlaceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    onChange({
      target: {
        name: "active",
        value: e.target.value === "yes",
      },
    });
  };
  const handleMapClick = async ({
    latitude,
    longitude,
  }: {
    latitude: number;
    longitude: number;
  }) => {
    setLocationMarker({
      latitude,
      longitude,
    });
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${token}`
    );
    const data = await res.json();
    if (data?.features?.length) {
      const place = data.features[0];
      const newLocation: Location = {
        type: "Point",
        label: place.place_name,
        coordinates: [longitude, latitude],
        id: place.id,
      };
      onChange({ target: { name: "location", value: newLocation } });
    }
  };

  const onLocationSelect = (location: Location | null) => {
    if (location?.coordinates) {
      setLocationMarker({
        latitude: location.coordinates[1],
        longitude: location.coordinates[0],
      });
      onChange({ target: { name: "location", value: location } });
    } else {
      setLocationMarker(null);
      onChange({ target: { name: "location", value: null } });
    }
  };

  return (
    <section className={styles.placeForm}>
      {userType !== "organizer" && (
        <RadioYesOrNo
          title="Lieu"
          label="Souhaitez-vous afficher votre lieu sur la carte pour recevoir des visiteurs?"
          name="userWithPlace"
          value={place.active ? "yes" : "no"}
          onChange={handleDisplayPlaceChange}
        />
      )}
      {place.active && (
        <div>
          <h3 className={styles.title}>Lieu</h3>
          <div className={styles.placeFormContainer}>
            <AddressInput
              onLocationSelect={onLocationSelect}
              value={place.location?.label || ""}
              selectedLocation={place.location}
              error={!!errors.location}
              errorMessage={errors.location}
            />

            <div className={styles.mapSection}>
              <Text as="h4" className={styles.mapTitle}>
                Cliquez sur la carte pour positionner votre lieu
              </Text>
              <div className={styles.mapContainer}>
                <MapComponent
                  height="200px"
                  location={locationMarker || undefined}
                  markers={locationMarker ? [locationMarker] : []}
                  onMapClick={handleMapClick}
                  withDefaultMarker
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
              errorMessage={errors.placeCategory}
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
    </section>
  );
};

export default PlaceForm;

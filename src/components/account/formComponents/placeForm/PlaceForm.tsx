import TimeTableForm from "@/components/account/formComponents/timetableForm/TimeTableForm";
import AddressInput from "@/components/common/inputs/addressInput/AddressInput";
import PlaceCategorySelectorInput from "@/components/common/inputs/categorySelectorInput/PlaceCategorySelectorInput";
import PlaceTypeSelectorInput from "@/components/common/inputs/placeTypeSelectorInput/PlaceTypeSelectorInput";
import MapComponent from "@/components/map/mapComponent/Map";
import { MapCoordinates, Location } from "@/types/common";
import React, { useState } from "react";
import Text from "@/components/common/typography/Text";
import {
  NewProfileFormData,
  FormDataChangeHandler,
} from "../../createProfileStepper/CreateProfileStepper.types";
import styles from "./PlaceForm.module.scss";
import Collaborators from "../collaborators/Partnerships";
import { defaultSchedule } from "@/utils/createProfile";

const PlaceForm = ({
  data,
  onChange,
  errors = {},
}: {
  data: NewProfileFormData;
  onChange: FormDataChangeHandler;
  errors?: Record<string, string>;
}) => {
  const [locationMarker, setLocationMarker] = useState<MapCoordinates | null>(
    data.location?.coordinates
      ? {
          latitude: data.location.coordinates[1],
          longitude: data.location.coordinates[0],
        }
      : null
  );

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
      <h3 className={styles.title}>Lieu</h3>
      <div className={styles.placeFormContainer}>
        <AddressInput
          onLocationSelect={onLocationSelect}
          value={data.location?.label || ""}
          selectedLocation={data.location}
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
        {data.userType === "organizer" && (
          <PlaceTypeSelectorInput
            value={data.placeType || []}
            onChange={onChange}
            error={!!errors.placeType}
          />
        )}
        <PlaceCategorySelectorInput
          value={data.placeCategory || ""}
          onChange={onChange}
          selectedTypes={data.placeType || []}
          error={!!errors.placeCategory}
        />
      </div>
      <TimeTableForm
        schedule={data.defaultSchedule || defaultSchedule}
        onChange={(updatedSchedule) =>
          onChange({
            target: { name: "defaultSchedule", value: updatedSchedule },
          })
        }
      />
      {data.userType === "organizer" && (
        <Collaborators onChange={onChange} data={data} />
      )}
    </section>
  );
};

export default PlaceForm;

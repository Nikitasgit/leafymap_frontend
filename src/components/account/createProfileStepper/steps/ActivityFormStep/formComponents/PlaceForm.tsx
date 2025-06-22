import TimeTableForm from "@/components/common/forms/timetable/TimeTableForm";
import AddressInput from "@/components/common/inputs/addressInput/AddressInput";
import PlaceCategorySelectorInput from "@/components/common/inputs/categorySelectorInput/PlaceCategorySelectorInput";
import PlaceTypeSelectorInput from "@/components/common/inputs/placeTypeSelectorInput/PlaceTypeSelectorInput";
import MapComponent from "@/components/map/mapComponent/Map";
import { MapCoordinates, Location } from "@/types/common";
import React, { useState } from "react";
import Partners from "./Partners";
import Text from "@/components/common/typography/Text";
import {
  NewProfileFormData,
  FormDataChangeHandler,
} from "../../../CreateProfileStepper.types";

const PlaceForm = ({
  data,
  onChange,
}: {
  data: NewProfileFormData;
  onChange: FormDataChangeHandler;
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
  const onLocationSelect = (location: Location) => {
    if (location?.coordinates) {
      setLocationMarker({
        latitude: location.coordinates[1],
        longitude: location.coordinates[0],
      });
      onChange({ target: { name: "location", value: location } });
    }
  };
  return (
    <>
      <AddressInput
        onLocationSelect={onLocationSelect}
        value={data.location?.label || ""}
      />
      <Text as="h4">Cliquez sur la carte pour positionner votre lieu</Text>
      <MapComponent
        height="200px"
        width="400px"
        location={locationMarker || undefined}
        markers={locationMarker ? [locationMarker] : []}
        onMapClick={handleMapClick}
        withDefaultMarker
      />
      {data.userType === "organizer" && (
        <PlaceTypeSelectorInput
          value={data.placeType || []}
          onChange={onChange}
        />
      )}

      <PlaceCategorySelectorInput
        value={data.placeCategory}
        onChange={onChange}
        selectedTypes={data.placeType || []}
      />
      <Text as="h3">Horaires</Text>
      <TimeTableForm
        schedule={data.defaultSchedule}
        onChange={(updatedSchedule) =>
          onChange({
            target: { name: "defaultSchedule", value: updatedSchedule },
          })
        }
      />
      <Partners onChange={onChange} data={data} />
    </>
  );
};

export default PlaceForm;

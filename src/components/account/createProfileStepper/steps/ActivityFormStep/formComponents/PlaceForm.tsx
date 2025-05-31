import TimeTableForm from "@/components/common/forms/timetable/TimeTableForm";
import AddressInput from "@/components/common/inputs/addressInput/AddressInput";
import PlaceCategorySelectorInput from "@/components/common/inputs/categorySelectorInput/PlaceCategorySelectorInput";
import MapComponent from "@/components/map/mapComponent/Map";
import { MapCoordinates, Location } from "@/types/map";
import React, { useState } from "react";
import Partners from "./Partners";
import Text from "@/components/common/typography/Text";
import {
  FormData,
  FormDataChangeHandler,
} from "../../../CreateProfileStepper.types";

const PlaceForm = ({
  data,
  onChange,
}: {
  data: FormData;
  onChange: FormDataChangeHandler;
}) => {
  const [locationMarker, setLocationMarker] = useState<MapCoordinates | null>(
    data.location?.coordinates || null
  );
  const handleMapClick = async ({
    latitude,
    longitude,
  }: {
    latitude: number;
    longitude: number;
  }) => {
    setLocationMarker({ latitude, longitude });
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${token}`
    );
    const data = await res.json();

    if (data?.features?.length) {
      const place = data.features[0];
      const newLocation: Location = {
        label: place.place_name,
        coordinates: { latitude, longitude },
        id: place.id,
      };

      onChange({ target: { name: "location", value: newLocation } });
    }
  };
  const onLocationSelect = (location: Location) => {
    if (location?.coordinates) {
      setLocationMarker({
        latitude: location.coordinates.latitude,
        longitude: location.coordinates.longitude,
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
      <PlaceCategorySelectorInput
        value={data.placeCategory}
        onChange={onChange}
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

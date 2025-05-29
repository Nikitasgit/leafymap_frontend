import { useState, useEffect } from "react";
import AddressInput from "@/components/common/inputs/addressInput/AddressInput";
import RadioYesOrNo from "@/components/common/inputs/radios/radioYesOrNo/RadioYesOrNo";
import TextField from "@/components/common/inputs/textField/TextField";
import Text from "@/components/common/typography/Text";
import MapComponent from "@/components/map/mapComponent/Map";
import { MapCoordinates, Location } from "@/types/map";
import TimeTableForm from "@/components/common/forms/timetable/TimeTableForm";
import {
  FormData,
  FormDataChangeHandler,
} from "../../../CreateProfileStepper.types";
import CategorySelectorInput from "@/components/common/inputs/categorySelectorInput/CategorySelectorInput";
import PlaceCategorySelectorInput from "@/components/common/inputs/categorySelectorInput/PlaceCategorySelectorInput";
import { useUser } from "@/hooks/useUser";

interface InfosProps {
  isCreator: boolean;
  data: FormData;
  onChange: FormDataChangeHandler;
  withPlace?: boolean;
}

const Infos = ({ isCreator, data, onChange }: InfosProps) => {
  const withPlace = !!data.location;
  const { user } = useUser();
  console.log(data);

  const [creatorWithPlace, setCreatorWithPlace] = useState(withPlace);
  const [locationMarker, setLocationMarker] = useState<MapCoordinates | null>(
    data.location?.coordinates || null
  );
  const onLocationSelect = (location: Location) => {
    if (location?.coordinates) {
      setLocationMarker({
        latitude: location.coordinates.latitude,
        longitude: location.coordinates.longitude,
      });
      onChange({ target: { name: "location", value: location } });
    }
  };
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
  useEffect(() => {
    if ((creatorWithPlace || !isCreator) && !data.location?.label) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocationMarker({ latitude, longitude });
        },
        () => {},
        { enableHighAccuracy: true }
      );
    }
  }, [creatorWithPlace, isCreator, data.location?.label]);
  const handleDisplayPlaceChange = (value: string) => {
    if (user?.creatorProfile?.place) {
      onChange({
        target: {
          name: "placeCategory",
          value: user.creatorProfile.place.placeCategory._id,
        },
      });
      onChange({
        target: {
          name: "location",
          value: {
            id: user.creatorProfile.place.location.id || "",
            label: user.creatorProfile.place.location.label,
            coordinates: {
              latitude: user.creatorProfile.place.location.coordinates[1],
              longitude: user.creatorProfile.place.location.coordinates[0],
            },
          },
        },
      });
    }
    setCreatorWithPlace(value === "yes");

    if (value === "no") {
      onChange({ target: { name: "location", value: null } });
      onChange({ target: { name: "placeCategory", value: "" } });
    }
  };

  return (
    <>
      <Text as="h3">Informations</Text>
      <TextField
        label={
          isCreator
            ? "Nom de votre activité (obligatoire)*"
            : "Nom du lieu (obligatoire)*"
        }
        name="name"
        value={data.name}
        onChange={onChange}
      />
      <TextField
        label="Description"
        name="description"
        value={data.description}
        onChange={onChange}
        multiline
        rows={6}
      />
      {isCreator && (
        <>
          <CategorySelectorInput onChange={onChange} value={data.category} />
          <RadioYesOrNo
            label="Souhaitez-vous afficher votre lieu sur la carte pour recevoir des visiteurs?"
            name="creatorWithPlace"
            value={creatorWithPlace ? "yes" : "no"}
            onChange={(e) => handleDisplayPlaceChange(e.target.value)}
          />
        </>
      )}
      {(creatorWithPlace || !isCreator) && (
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
        </>
      )}
    </>
  );
};

export default Infos;

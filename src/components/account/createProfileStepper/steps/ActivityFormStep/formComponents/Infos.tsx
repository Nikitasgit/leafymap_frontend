import { useState, useEffect } from "react";
import AddressInput from "@/components/common/inputs/addressInput/AddressInput";
import RadioYesOrNo from "@/components/common/inputs/radios/radioYesOrNo/RadioYesOrNo";
import TextField from "@/components/common/inputs/textField/TextField";
import Text from "@/components/common/typography/Text";
import MapComponent from "@/components/map/mapComponent/Map";
import { Address, location } from "@/types/map";
import TimeTableForm from "@/components/common/forms/timetable/TimeTableForm";
import {
  FormData,
  FormDataChangeHandler,
} from "../../../CreateProfileStepper.types";
import CategorySelectorInput from "@/components/common/inputs/categorySelectorInput/CategorySelectorInput";
import PlaceCategorySelectorInput from "@/components/common/inputs/categorySelectorInput/PlaceCategorySelectorInput";

interface InfosProps {
  isCreator: boolean;
  data: FormData;
  onChange: FormDataChangeHandler;
  withPlace?: boolean;
}

const Infos = ({ isCreator, data, onChange }: InfosProps) => {
  const withPlace = !!data.address;
  const [creatorWithPlace, setCreatorWithPlace] = useState(withPlace);
  const [addressMarker, setAddressMarker] = useState<location | null>(
    data.address?.coordinates || null
  );
  const onAddressSelect = (address: Address) => {
    if (address?.coordinates) {
      setAddressMarker({
        latitude: address.coordinates.latitude,
        longitude: address.coordinates.longitude,
      });
      onChange({ target: { name: "address", value: address } });
    }
  };
  const handleMapClick = async ({
    latitude,
    longitude,
  }: {
    latitude: number;
    longitude: number;
  }) => {
    setAddressMarker({ latitude, longitude });
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${token}`
    );
    const data = await res.json();

    if (data?.features?.length) {
      const place = data.features[0];
      const newAddress: Address = {
        label: place.place_name,
        coordinates: { latitude, longitude },
        id: place.id,
      };

      onChange({ target: { name: "address", value: newAddress } });
    }
  };
  useEffect(() => {
    if ((creatorWithPlace || !isCreator) && !data.address?.label) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setAddressMarker({ latitude, longitude });
        },
        (error) => {
          console.warn("Geolocation error:", error);
        },
        { enableHighAccuracy: true }
      );
    }
  }, [creatorWithPlace, isCreator, data.address?.label]);
  const handleDisplayPlaceChange = (value: string) => {
    setCreatorWithPlace(value === "yes");
    if (value === "no") {
      onChange({ target: { name: "address", value: null } });
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
            onAddressSelect={onAddressSelect}
            value={data.address?.label || ""}
          />
          <Text as="h4">Cliquez sur la carte pour positionner votre lieu</Text>
          <MapComponent
            height="200px"
            width="400px"
            location={addressMarker || undefined}
            markers={addressMarker ? [addressMarker] : []}
            onMapClick={handleMapClick}
            withDefaultMarker
          />
          <PlaceCategorySelectorInput
            value={data.placeCategory._id}
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

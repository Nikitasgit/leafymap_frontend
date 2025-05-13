"use client";

import { useEffect, useState } from "react";
import Button from "@/components/common/buttons/button/Button";
import RadioYesOrNo from "@/components/common/inputs/radios/radioYesOrNo/RadioYesOrNo";
import TextField from "@/components/common/inputs/textField/TextField";
import Text from "@/components/common/typography/Text";
import MapComponent, { location } from "@/components/map/mapComponent/Map";
import TimeTableForm from "@/components/common/forms/timetable/TimeTableForm";

import {
  FormData,
  FormDataChangeHandler,
  DefaultSchedule,
} from "../CreateProfileStepper";
import AddressInput, {
  Address,
} from "@/components/common/inputs/addressInput/AddressInput";

interface ActivityFormStepProps {
  data: FormData;
  onChange: FormDataChangeHandler;
  onNext: () => void;
  onBack: () => void;
  onScheduleChange: (updatedSchedule: DefaultSchedule) => void;
}

const ActivityFormStep = ({
  data,
  onChange,
  onNext,
  onBack,
  onScheduleChange,
}: ActivityFormStepProps) => {
  const isCreator = data.userType === "creator";
  const [creatorWithPlace, setCreatorWithPlace] = useState(false);
  const [addressMarker, setAddressMarker] = useState<location | undefined>(
    undefined
  );

  const onAddressSelect = (address: Address) => {
    setAddressMarker(address.coordinates);
    onChange({ target: { name: "address", value: address } });
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

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onNext();
      }}
    >
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
      <TextField
        name="type"
        value={data.type}
        placeholder={isCreator ? "Type d'activité" : "Type de lieu"}
        onChange={onChange}
      />

      {isCreator && (
        <RadioYesOrNo
          label="Souhaitez-vous afficher votre lieu sur la carte pour recevoir des visiteurs?"
          name="creatorWithPlace"
          value={creatorWithPlace ? "yes" : "no"}
          onChange={(e) => setCreatorWithPlace(e.target.value === "yes")}
        />
      )}

      {(creatorWithPlace || !isCreator) && (
        <>
          <AddressInput
            onAddressSelect={onAddressSelect}
            value={data.address.label}
          />

          <Text as="h4">Cliquez sur la carte pour positionner votre lieu</Text>
          <MapComponent
            height="200px"
            width="400px"
            location={addressMarker ? addressMarker : undefined}
            markers={addressMarker ? [addressMarker] : []}
            onMapClick={handleMapClick}
            withDefaultMarker
          />

          <Text as="h3">Horaires</Text>
          <Text as="p">
            Il s&apos;agit d&apos;horaires standards, vous pourrez ensuite
            ajuster les horaires
          </Text>
          <TimeTableForm
            schedule={data.defaultSchedule}
            onChange={onScheduleChange}
          />
        </>
      )}

      <div>
        <Button type="button" onClick={onBack}>
          Précédent
        </Button>
        <Button type="submit">Suivant</Button>
      </div>
    </form>
  );
};

export default ActivityFormStep;

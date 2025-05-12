"use client";

import { useState } from "react";
import Button from "@/components/common/buttons/button/Button";
import RadioYesOrNo from "@/components/common/inputs/radios/radioYesOrNo/RadioYesOrNo";
import TextField from "@/components/common/inputs/textField/TextField";
import Text from "@/components/common/typography/Text";
import MapComponent from "@/components/map/mapComponent/Map";
import TimeTableForm from "@/components/common/forms/timetable/TimeTableForm";

import {
  FormData,
  FormDataChangeHandler,
  DefaultSchedule,
} from "../CreateProfileStepper";
import AddressInput from "@/components/common/inputs/addressInput/AddressInput";

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
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);

  const handleMapInteraction = (coordinates: [number, number]) => {
    setMapCenter(coordinates);
  };

  return (
    <>
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
            <AddressInput handleMapInteraction={handleMapInteraction} />
            <TextField
              name="address"
              value={data.address}
              onChange={onChange}
              label="Adresse"
            />
            <Text as="h4">Modifier l&apos;emplacement de votre pin</Text>
            <MapComponent height="200px" width="400px" />

            <Text as="h3">Horaires</Text>
            <Text as="p">
              Il s’agit d’horaires standards, vous pourrez ensuite ajuster les
              horaires
            </Text>
            <TimeTableForm
              schedule={data.defaultSchedule}
              onChange={onScheduleChange}
            />
          </>
        )}
        <div className="flex justify-between mt-4">
          <Button type="button" onClick={onBack}>
            Précédent
          </Button>
          <Button type="submit">Suivant</Button>
        </div>
      </form>
    </>
  );
};

export default ActivityFormStep;

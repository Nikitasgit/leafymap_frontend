import { useState } from "react";
import RadioYesOrNo from "@/components/common/inputs/radios/radioYesOrNo/RadioYesOrNo";
import TextField from "@/components/common/inputs/textField/TextField";
import Text from "@/components/common/typography/Text";
import {
  FormData,
  FormDataChangeHandler,
} from "../../../CreateProfileStepper.types";
import CategorySelectorInput from "@/components/common/inputs/categorySelectorInput/CategorySelectorInput";
import { useUser } from "@/hooks/useUser";
import PlaceForm from "./PlaceForm";
import { Creator } from "@/types/user";

interface InfosProps {
  isCreator: boolean;
  data: FormData;
  onChange: FormDataChangeHandler;
  withPlace?: boolean;
}

const Infos = ({ isCreator, data, onChange }: InfosProps) => {
  const { user } = useUser();
  const withPlace = !!data.placeActive;
  const creator = user as Creator;

  const [creatorWithPlace, setCreatorWithPlace] = useState(withPlace);

  const handleDisplayPlaceChange = (value: string) => {
    if (creator?.creatorProfile?.place) {
      const place = creator.creatorProfile.place;
      onChange({
        target: {
          name: "placeCategory",
          value: place.placeCategory._id,
        },
      });
      onChange({
        target: {
          name: "location",
          value: {
            id: place.location.id || "",
            label: place.location.label,
            coordinates: {
              latitude: place.location.coordinates[1],
              longitude: place.location.coordinates[0],
            },
          },
        },
      });
    }
    onChange({ target: { name: "placeActive", value: true } });
    setCreatorWithPlace(value === "yes");

    if (value === "no") {
      onChange({ target: { name: "placeActive", value: false } });
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
            name="userWithPlace"
            value={creatorWithPlace ? "yes" : "no"}
            onChange={(e) => handleDisplayPlaceChange(e.target.value)}
          />
        </>
      )}
      {(creatorWithPlace || !isCreator) && (
        <PlaceForm data={data} onChange={onChange} />
      )}
    </>
  );
};

export default Infos;

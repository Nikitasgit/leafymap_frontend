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
  const withPlace = !!data.location;
  const { user } = useUser();
  const creator = user as Creator;

  const [creatorWithPlace, setCreatorWithPlace] = useState(withPlace);

  const handleDisplayPlaceChange = (value: string) => {
    if (creator?.creatorProfile?.place) {
      onChange({
        target: {
          name: "placeCategory",
          value: creator.creatorProfile.place.placeCategory._id,
        },
      });
      onChange({
        target: {
          name: "location",
          value: {
            id: creator.creatorProfile.place.location.id || "",
            label: creator.creatorProfile.place.location.label,
            coordinates: {
              latitude: creator.creatorProfile.place.location.coordinates[1],
              longitude: creator.creatorProfile.place.location.coordinates[0],
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

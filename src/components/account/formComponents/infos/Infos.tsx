import { useState } from "react";
import RadioYesOrNo from "@/components/common/inputs/radios/radioYesOrNo/RadioYesOrNo";
import TextField from "@/components/common/inputs/textField/TextField";
import {
  NewProfileFormData,
  FormDataChangeHandler,
} from "../../createProfileStepper/CreateProfileStepper.types";
import CategorySelectorInput from "@/components/common/inputs/categorySelectorInput/CategorySelectorInput";
import { useUser } from "@/hooks/useUser";
import PlaceForm from "../placeForm/PlaceForm";
import { Creator } from "@/types/user";
import styles from "./Infos.module.scss";
import LoadingBar from "@/components/common/loading/LoadingBar";
import { useToast } from "@/hooks/useToast";

interface InfosProps {
  isCreator: boolean;
  data: NewProfileFormData;
  onChange: FormDataChangeHandler;
  withPlace?: boolean;
}

const Infos = ({ isCreator, data, onChange }: InfosProps) => {
  const { user, loading, error } = useUser();
  const creator = user as Creator;
  const withPlace = !!data.placeActive;
  const [creatorWithPlace, setCreatorWithPlace] = useState(withPlace);
  const { showError } = useToast();

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
            type: "Point",
            coordinates: [
              place.location.coordinates[0],
              place.location.coordinates[1],
            ],
            label: place.location.label,
            id: place.location.id || "",
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

  if (error) {
    showError(error);
  }

  return (
    <div className={styles.container}>
      {loading && <LoadingBar />}
      <section className={styles.section}>
        <h3 className={styles.title}>Informations</h3>
        <div className={styles.infosContainer}>
          <TextField
            fullWidth
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
            fullWidth
            label="Description"
            name="description"
            value={data.description}
            onChange={onChange}
            multiline
            rows={2}
            showCharCount
            maxLength={300}
          />
          {isCreator && (
            <CategorySelectorInput onChange={onChange} value={data.category} />
          )}
          {isCreator && (
            <RadioYesOrNo
              title="Lieu"
              label="Souhaitez-vous afficher votre lieu sur la carte pour recevoir des visiteurs?"
              name="userWithPlace"
              value={creatorWithPlace ? "yes" : "no"}
              onChange={(e) => handleDisplayPlaceChange(e.target.value)}
            />
          )}
        </div>
      </section>
      {(creatorWithPlace || !isCreator) && (
        <PlaceForm data={data} onChange={onChange} />
      )}
    </div>
  );
};

export default Infos;

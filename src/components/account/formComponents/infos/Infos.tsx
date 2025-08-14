import { useState } from "react";
import RadioYesOrNo from "@/components/common/inputs/radios/radioYesOrNo/RadioYesOrNo";
import TextField from "@/components/common/inputs/textField/TextField";
import {
  NewProfileFormData,
  FormDataChangeHandler,
} from "../../createProfileStepper/CreateProfileStepper.types";
import CategorySelectorInput from "@/components/common/inputs/categorySelectorInput/CategorySelectorInput";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import PlaceForm from "../placeForm/PlaceForm";
import { Creator } from "@/types/user";
import styles from "./Infos.module.scss";
import LoadingBar from "@/components/common/loading/LoadingBar";

interface InfosProps {
  isCreator: boolean;
  data: NewProfileFormData;
  onChange: FormDataChangeHandler;
  withPlace?: boolean;
  errors?: Record<string, string>;
}

const Infos = ({ isCreator, data, onChange, errors = {} }: InfosProps) => {
  const { user, isLoading } = useCurrentUser();
  const creator = user as Creator;
  const withPlace = !!data.placeActive;
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

  return (
    <div className={styles.container}>
      {isLoading && <LoadingBar />}
      <section className={styles.section}>
        <h3 className={styles.title}>Informations</h3>

        <div className={styles.infosContainer}>
          <TextField
            fullWidth
            label={isCreator ? "Nom de votre activité" : "Nom du lieu"}
            name="name"
            required
            value={data.name}
            onChange={onChange}
            error={!!errors.name}
            errorMessage={errors.name}
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
            error={!!errors.description}
            errorMessage={errors.description}
          />

          {isCreator && (
            <CategorySelectorInput
              withPlaceType
              onChange={onChange}
              value={data.category}
              error={!!errors.category}
            />
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
        <PlaceForm data={data} onChange={onChange} errors={errors} />
      )}
    </div>
  );
};

export default Infos;
